/**
 * Digital Threats & Internet Freedom Dashboard
 * Specification: handoff_kp3.md (Interactive & Statistical Edition)
 * Branch: kp
 */

let DATA = null;
const charts = {};

// Global Filter State (Section 1.1)
const globalState = {
    time: 'recent12',
    geo: 'all',
    quality: 'all'
};

// Cross-Filter States (Section 1.2)
const crossFilters = {
    tab1Month: null,
    tab1Category: null,
    tab2Month: null,
    tab2ScamType: null,
    tab3Country: 'Thailand',
    tab3Year: null
};

// Pagination & Search States
const tab2TableState = { page: 1, pageSize: 10, search: '' };
const tab3TableState = { page: 1, pageSize: 10, search: '' };

// ── Chart.js Pastel Global Theme & Plugins (Section 2 & 3) ──
if (window.Chart) {
    Chart.defaults.color = '#2C3E50'; // Slate Grey (High Contrast)
    Chart.defaults.borderColor = '#F2F4F4'; // Soft Grid Lines
    Chart.defaults.font.family = "'Noto Sans Thai', 'Inter', -apple-system, sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(255, 255, 255, 0.96)';
    Chart.defaults.plugins.tooltip.titleColor = '#2C3E50';
    Chart.defaults.plugins.tooltip.bodyColor = '#2C3E50';
    Chart.defaults.plugins.tooltip.borderColor = '#E5E7EB';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.boxPadding = 4;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
}

// ── App Initialization ──
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (window.DASHBOARD_DATA) {
            DATA = window.DASHBOARD_DATA;
        } else {
            const resp = await fetch('dashboard_data.json');
            DATA = await resp.json();
        }

        // Initialize tabs
        initTab1();
        initTab2();
        initTab3();

        // Search inputs listeners
        const search2 = document.getElementById('tab2-search');
        if (search2) {
            search2.addEventListener('input', (e) => {
                tab2TableState.search = e.target.value.toLowerCase().trim();
                tab2TableState.page = 1;
                updateTab2Table();
            });
        }

        const search3 = document.getElementById('tab3-search');
        if (search3) {
            search3.addEventListener('input', (e) => {
                tab3TableState.search = e.target.value.toLowerCase().trim();
                tab3TableState.page = 1;
                updateTab3Table();
            });
        }

        // Hide loading overlay
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.add('hidden');

    } catch (err) {
        console.error("Dashboard init error:", err);
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.innerHTML = `
                <div style="text-align:center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #E6B0AA; margin-bottom: 12px;"></i>
                    <h3 style="color: #2C3E50;">เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
                    <p style="color: #7F8C8D;">โปรดตรวจสอบไฟล์ data.js หรือ dashboard_data.json</p>
                </div>
            `;
        }
    }
});

// ── Tab Switching ──
function switchTab(tabId) {
    document.querySelectorAll('.tab-navbar .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabId));
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tabId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Resize Chart.js & Plotly for newly active tab
    setTimeout(() => {
        Object.values(charts).forEach(c => {
            if (c && typeof c.resize === 'function') c.resize();
        });

        if (tabId === 'tab-overview' && window.Plotly) {
            const mapEl = document.getElementById('chart-1-4-map');
            if (mapEl) Plotly.Plots.resize(mapEl);
        } else if (tabId === 'tab-global' && window.Plotly) {
            const mapEl = document.getElementById('chart-3-1-world-map');
            if (mapEl) Plotly.Plots.resize(mapEl);
        }
    }, 120);
}

// ── Global Filter Bar Logic (Section 1.1) ──
function applyGlobalFilters() {
    globalState.time = document.getElementById('global-time-filter').value;
    globalState.geo = document.getElementById('global-geo-filter').value;
    globalState.quality = document.getElementById('global-quality-filter').value;

    const resetBtn = document.getElementById('resetGlobalBtn');
    if (resetBtn) {
        const isModified = globalState.time !== 'all' || globalState.geo !== 'all' || globalState.quality !== 'all';
        resetBtn.style.opacity = isModified ? '1' : '0.6';
    }

    // Refresh KPI calculations based on global filters
    updateGlobalKPIs();

    // Refresh Tab 2 table
    tab2TableState.page = 1;
    updateTab2Table();
}

function resetGlobalFilters() {
    document.getElementById('global-time-filter').value = 'recent12';
    document.getElementById('global-geo-filter').value = 'all';
    document.getElementById('global-quality-filter').value = 'all';
    applyGlobalFilters();
}

function updateGlobalKPIs() {
    if (!DATA) return;
    const kpiAfnc = document.getElementById('kpi-afnc');
    const kpiCases = document.getElementById('kpi-acsc-cases');
    const kpiLoss = document.getElementById('kpi-acsc-loss');
    const kpiAiid = document.getElementById('kpi-aiid');
    const kpiFreedom = document.getElementById('kpi-freedom');

    if (globalState.time === 'recent12') {
        const sumCases = DATA.overlap_link.acsc_cases.reduce((a, b) => a + b, 0);
        const sumLossM = DATA.overlap_link.acsc_loss_million.reduce((a, b) => a + b, 0);
        const sumAfnc = DATA.overlap_link.afnc_fake.reduce((a, b) => a + b, 0) +
                        DATA.overlap_link.afnc_distorted.reduce((a, b) => a + b, 0) +
                        DATA.overlap_link.afnc_true.reduce((a, b) => a + b, 0);

        if (kpiAfnc) kpiAfnc.textContent = sumAfnc.toLocaleString();
        if (kpiCases) kpiCases.textContent = sumCases.toLocaleString();
        if (kpiLoss) kpiLoss.textContent = `฿${(sumLossM / 1000).toFixed(2)}B`;
    } else {
        if (kpiAfnc) kpiAfnc.textContent = DATA.afnc.total_items.toLocaleString();
        if (kpiCases) kpiCases.textContent = DATA.acsc.stats.total_cases.toLocaleString();
        if (kpiLoss) kpiLoss.textContent = `฿${DATA.acsc.stats.total_loss_billion}B`;
    }
}

// ═══════════════════════════════════════════════════════════════
// TAB 1: VISUAL OVERVIEW & THREAT LANDSCAPE (Cross-Filtering)
// ═══════════════════════════════════════════════════════════════
function initTab1() {
    // 1. Chart 1.1: Multi-Dataset Trend Preview with Direct Labels & Annotation
    const trendCanvas = document.getElementById('chart-1-1-trend');
    if (trendCanvas && DATA.overlap_link) {
        charts['chart1_1'] = new Chart(trendCanvas, {
            type: 'line',
            data: {
                labels: DATA.overlap_link.months,
                datasets: [
                    {
                        label: 'คดีหลอกลวงออนไลน์ (ACSC Cases)',
                        data: DATA.overlap_link.acsc_cases,
                        borderColor: '#85C1E9', // Pastel Blue
                        backgroundColor: 'rgba(133, 193, 233, 0.15)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#85C1E9',
                        yAxisID: 'y'
                    },
                    {
                        label: 'ข่าวปลอมที่ตรวจสอบ (AFNC Fake Items)',
                        data: DATA.overlap_link.afnc_fake,
                        borderColor: '#E6B0AA', // Pastel Pink
                        backgroundColor: 'rgba(230, 176, 170, 0.15)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#E6B0AA',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const idx = elements[0].index;
                        const month = DATA.overlap_link.months[idx];
                        onChart1MonthClick(month);
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: { display: true, text: 'จำนวนคดี ACSC (คดี)', font: { size: 11, weight: 'bold' } },
                        grid: { color: '#F2F4F4' }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: { display: true, text: 'ข่าวปลอม AFNC (เรื่อง)', font: { size: 11, weight: 'bold' } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 2. Chart 1.2: Threat Category Breakdown with Direct Data Labels
    const landscapeCanvas = document.getElementById('chart-1-2-landscape');
    if (landscapeCanvas) {
        const categories = [
            'หลอกซื้อขายสินค้า (ACSC)',
            'นโยบายรัฐ & สวัสดิการ (AFNC)',
            'ผลิตภัณฑ์สุขภาพ (AFNC)',
            'หลอกให้ลงทุน (ACSC)',
            'การเงิน & หุ้น (AFNC)',
            'ข่มขู่ทางโทรศัพท์ (ACSC)',
            'งานพิเศษ/รับรางวัล (ACSC)'
        ];
        const counts = [285000, 6272, 3788, 30000, 2514, 15000, 35000];
        const pcts = [74.7, 35.4, 21.4, 7.9, 14.2, 3.9, 9.2];
        const baseColors = ['#85C1E9', '#E6B0AA', '#E6B0AA', '#F7DC6F', '#E6B0AA', '#F7DC6F', '#85C1E9'];

        charts['chart1_2'] = new Chart(landscapeCanvas, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'จำนวนรายการ / คดี',
                    data: counts,
                    backgroundColor: baseColors,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const idx = elements[0].index;
                        onChart1_2CategoryClick(categories[idx]);
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `จำนวน: ${ctx.raw.toLocaleString()} (${pcts[ctx.dataIndex]}% ของกลุ่ม)`
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'จำนวนรายการ / คดี (N)' },
                        ticks: {
                            callback: (v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v
                        }
                    },
                    y: { ticks: { font: { size: 11, weight: 'bold' } } }
                }
            }
        });
    }

    // 3. Chart 1.3 Sparklines with direct % labels
    initSparklines();

    // 4. Chart 1.4 Mini Geographic Map
    renderMiniMap('chart-1-4-map');
}

function initSparklines() {
    // Sparkline 1: AFNC
    const sAfnc = document.getElementById('spark-afnc');
    if (sAfnc) {
        new Chart(sAfnc, {
            type: 'bar',
            data: {
                labels: ['Fake 65.8%', 'True 24.2%', 'Distorted 9.9%'],
                datasets: [{
                    data: [9520, 3503, 1435],
                    backgroundColor: ['#E6B0AA', '#7DCEA0', '#F7DC6F'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: true, grid: { display: false } }, y: { display: false } }
            }
        });
    }

    // Sparkline 2: ACSC
    const sAcsc = document.getElementById('spark-acsc');
    if (sAcsc) {
        new Chart(sAcsc, {
            type: 'bar',
            data: {
                labels: ['ลงทุน 49.5%', 'รางวัล 21.1%', 'สินค้า 9.4%', 'คอลเซ็นเตอร์ 7.0%'],
                datasets: [{
                    data: [9.0, 3.84, 1.71, 1.27],
                    backgroundColor: ['#F7DC6F', '#F7DC6F', '#85C1E9', '#E6B0AA'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: true, grid: { display: false } }, y: { display: false } }
            }
        });
    }

    // Sparkline 3: AIID
    const sAiid = document.getElementById('spark-aiid');
    if (sAiid) {
        new Chart(sAiid, {
            type: 'doughnut',
            data: {
                labels: ['เจตนา (49.8%)', 'ระบบผิดพลาด (50.2%)'],
                datasets: [{
                    data: [735, 740],
                    backgroundColor: ['#BB8FCE', '#85C1E9'],
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    // Sparkline 4: Freedom
    const sFreedom = document.getElementById('spark-freedom');
    if (sFreedom) {
        const asean = DATA.freedom.asean_latest;
        new Chart(sFreedom, {
            type: 'bar',
            data: {
                labels: asean.map(c => `${c.country.slice(0, 3)} (${c.total_score})`),
                datasets: [{
                    data: asean.map(c => c.total_score),
                    backgroundColor: asean.map(c => c.country === 'Thailand' ? '#E6B0AA' : '#7DCEA0'),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: true, grid: { display: false } }, y: { display: false } }
            }
        });
    }
}

// ── Tab 1 Cross-Filter Actions (Section 1.2 & 4.2) ──
function onChart1MonthClick(month) {
    crossFilters.tab1Month = month;
    const card1 = document.getElementById('card-chart-1-1');
    const resetBtn = document.getElementById('reset-1-1-btn');
    if (card1) card1.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    // Filter KPI values to selected month
    const idx = DATA.overlap_link.months.indexOf(month);
    if (idx >= 0) {
        const cases = DATA.overlap_link.acsc_cases[idx];
        const lossM = DATA.overlap_link.acsc_loss_million[idx];
        const fake = DATA.overlap_link.afnc_fake[idx];

        document.getElementById('kpi-afnc').textContent = `${fake} ข่าว`;
        document.getElementById('kpi-acsc-cases').textContent = `${cases.toLocaleString()} คดี`;
        document.getElementById('kpi-acsc-loss').textContent = `฿${lossM.toLocaleString()}M`;
    }
}

function resetChart1Selection() {
    crossFilters.tab1Month = null;
    const card1 = document.getElementById('card-chart-1-1');
    const resetBtn = document.getElementById('reset-1-1-btn');
    if (card1) card1.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');
    updateGlobalKPIs();
}

function onChart1_2CategoryClick(category) {
    crossFilters.tab1Category = category;
    const card = document.getElementById('card-chart-1-2');
    const resetBtn = document.getElementById('reset-1-2-btn');
    if (card) card.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');
}

function resetChart1_2Selection() {
    crossFilters.tab1Category = null;
    const card = document.getElementById('card-chart-1-2');
    const resetBtn = document.getElementById('reset-1-2-btn');
    if (card) card.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');
}

function renderMiniMap(containerId) {
    const mapDiv = document.getElementById(containerId);
    if (!mapDiv || !window.Plotly || !DATA.freedom.countries_latest) return;

    const countries = DATA.freedom.countries_latest;
    const locations = countries.map(c => c.iso3);
    const z = countries.map(c => c.total_score);
    const text = countries.map(c => `<b>${c.country}</b><br>Score: ${c.total_score}/100<br>Status: ${c.status}`);

    const plotData = [{
        type: 'choropleth',
        locations: locations,
        z: z,
        text: text,
        hoverinfo: 'text',
        colorscale: [
            [0, '#E6B0AA'],
            [0.39, '#E6B0AA'],
            [0.40, '#F7DC6F'],
            [0.69, '#F7DC6F'],
            [0.70, '#7DCEA0'],
            [1.0, '#52BE80']
        ],
        zmin: 0,
        zmax: 100,
        colorbar: {
            title: 'Freedom Score',
            tickvals: [20, 55, 85],
            ticktext: ['Not Free (0-39)', 'Partly Free (40-69)', 'Free (70-100)'],
            len: 0.65,
            thickness: 12,
            bgcolor: 'transparent',
            outlinecolor: '#E5E7EB',
            tickfont: { color: '#2C3E50', size: 10 },
            titlefont: { color: '#2C3E50', size: 11, family: "'Noto Sans Thai', sans-serif" }
        },
        marker: { line: { color: '#FFFFFF', width: 0.7 } }
    }];

    const layout = {
        geo: {
            showframe: false,
            showcoastlines: true,
            coastlinecolor: '#E5E7EB',
            projection: { type: 'natural earth' },
            bgcolor: '#FFFFFF',
            lakecolor: '#F8F9FA',
            showocean: true,
            oceancolor: '#F8F9FA',
            landcolor: '#F2F4F4'
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 0, r: 0, t: 0, b: 0 }
    };

    Plotly.newPlot(containerId, plotData, layout, { responsive: true, displayModeBar: false });
}

// ═══════════════════════════════════════════════════════════════
// TAB 2: THAILAND THREAT LINKAGE & FINANCIAL IMPACT (AFNC + ACSC)
// ═══════════════════════════════════════════════════════════════
function initTab2() {
    const overlap = DATA.overlap_link;

    // 1. Chart 2.1: Dual Panel Synchronized Time View
    // Top Panel: AFNC Verdicts
    const afncPanelCanvas = document.getElementById('chart-2-1-afnc-panel');
    if (afncPanelCanvas && overlap) {
        charts['chart2_1_top'] = new Chart(afncPanelCanvas, {
            type: 'line',
            data: {
                labels: overlap.months,
                datasets: [
                    {
                        label: 'ข่าวปลอม (Fake)',
                        data: overlap.afnc_fake,
                        borderColor: '#E6B0AA',
                        backgroundColor: 'rgba(230, 176, 170, 0.2)',
                        fill: true,
                        tension: 0.2,
                        pointRadius: 4
                    },
                    {
                        label: 'ข่าวบิดเบือน (Distorted)',
                        data: overlap.afnc_distorted,
                        borderColor: '#F7DC6F',
                        backgroundColor: 'rgba(247, 220, 111, 0.2)',
                        fill: true,
                        tension: 0.2,
                        pointRadius: 4
                    },
                    {
                        label: 'ข่าวจริง (True)',
                        data: overlap.afnc_true,
                        borderColor: '#7DCEA0',
                        backgroundColor: 'rgba(125, 206, 160, 0.2)',
                        fill: true,
                        tension: 0.2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const month = overlap.months[elements[0].index];
                        onChart2MonthClick(month);
                    }
                },
                scales: {
                    x: { display: false },
                    y: { title: { display: true, text: 'ข่าว AFNC (เรื่อง)' } }
                }
            }
        });
    }

    // Bottom Panel: ACSC Scam Cases
    const acscPanelCanvas = document.getElementById('chart-2-1-acsc-panel');
    if (acscPanelCanvas && overlap) {
        charts['chart2_1_bottom'] = new Chart(acscPanelCanvas, {
            type: 'bar',
            data: {
                labels: overlap.months,
                datasets: [{
                    label: 'คดีหลอกลวงออนไลน์ (ACSC Cases)',
                    data: overlap.acsc_cases,
                    backgroundColor: '#85C1E9',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const month = overlap.months[elements[0].index];
                        onChart2MonthClick(month);
                    }
                },
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { font: { size: 11 } } },
                    y: { title: { display: true, text: 'คดี ACSC (คดี)' } }
                }
            }
        });
    }

    // 2. Chart 2.2: AFNC Verdict Composition (100% Stacked Bar)
    const compCanvas = document.getElementById('chart-2-2-composition');
    if (compCanvas && overlap) {
        const totalPerMonth = overlap.months.map((_, i) => (overlap.afnc_fake[i] + overlap.afnc_distorted[i] + overlap.afnc_true[i]) || 1);
        const fakePct = overlap.afnc_fake.map((v, i) => Math.round((v / totalPerMonth[i]) * 100));
        const distPct = overlap.afnc_distorted.map((v, i) => Math.round((v / totalPerMonth[i]) * 100));
        const truePct = overlap.afnc_true.map((v, i) => Math.round((v / totalPerMonth[i]) * 100));

        charts['chart2_2'] = new Chart(compCanvas, {
            type: 'bar',
            data: {
                labels: overlap.months,
                datasets: [
                    { label: 'Fake (%)', data: fakePct, backgroundColor: '#E6B0AA' },
                    { label: 'Distorted (%)', data: distPct, backgroundColor: '#F7DC6F' },
                    { label: 'True (%)', data: truePct, backgroundColor: '#7DCEA0' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, max: 100, title: { display: true, text: 'สัดส่วนคำวินิจฉัย (%)' } }
                }
            }
        });
    }

    // 3. Chart 2.3: Dual Horizontal Bar: Cases vs Financial Loss
    const lossVolumeCanvas = document.getElementById('chart-2-3-loss-volume');
    if (lossVolumeCanvas && DATA.acsc.loss_grouped_comparison) {
        const groups = DATA.acsc.loss_grouped_comparison;
        charts['chart2_3'] = new Chart(lossVolumeCanvas, {
            type: 'bar',
            data: {
                labels: groups.map(g => g.category),
                datasets: [
                    {
                        label: 'จำนวนคดีโดยประมาณ (พันคดี)',
                        data: groups.map(g => Math.round(g.cases / 1000)),
                        backgroundColor: '#85C1E9',
                        borderRadius: 4
                    },
                    {
                        label: 'มูลค่าความเสียหาย (พันล้านบาท)',
                        data: groups.map(g => g.loss_billion),
                        backgroundColor: '#F7DC6F',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const scamType = groups[elements[0].index].category;
                        onChart2_3ScamClick(scamType);
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'จำนวนคดี (พันคดี)  VS  ความเสียหาย (พันล้านบาท)' } },
                    y: { ticks: { font: { size: 11, weight: 'bold' } } }
                }
            }
        });
    }

    // 4. Chart 2.4: Cross-Category Topic Matrix Bar Chart
    const matrixCanvas = document.getElementById('chart-2-4-topic-matrix');
    if (matrixCanvas) {
        const topics = [
            'การเงิน/การลงทุน (AFNC: 2,514 ข่าว ↔ ACSC: ฿9.0B)',
            'สินค้าและบริการออนไลน์ (AFNC: 963 ข่าว ↔ ACSC: 285k คดี)',
            'งานพิเศษ/แจกรางวัล (AFNC: 683 ข่าว ↔ ACSC: ฿3.84B)',
            'ข่มขู่/แอบอ้างเจ้าหน้าที่ (AFNC: 391 ข่าว ↔ ACSC: ฿1.27B)',
            'นโยบายรัฐ/เงินช่วยเหลือ (AFNC: 6,272 ข่าว ↔ เตือนภัยร่วม)'
        ];

        charts['chart2_4'] = new Chart(matrixCanvas, {
            type: 'bar',
            data: {
                labels: topics,
                datasets: [
                    {
                        label: 'ดัชนีข่าวปลอม AFNC (Relative Scale)',
                        data: [75, 40, 50, 45, 95],
                        backgroundColor: '#E6B0AA',
                        borderRadius: 4
                    },
                    {
                        label: 'ดัชนีความเสียหายทางการเงิน ACSC (Relative Scale)',
                        data: [95, 30, 75, 60, 40],
                        backgroundColor: '#F7DC6F',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { max: 100, title: { display: true, text: 'ดัชนีเปรียบเทียบระดับความเข้มข้นในข้อมูล (%)' } },
                    y: { ticks: { font: { size: 11 } } }
                }
            }
        });
    }

    updateTab2Table();
}

// ── Tab 2 Cross-Filter Actions (Section 1.2 & 5.2) ──
function onChart2MonthClick(month) {
    crossFilters.tab2Month = month;
    const card = document.getElementById('card-chart-2-1');
    const resetBtn = document.getElementById('reset-2-1-btn');
    if (card) card.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    // Filter Table 2.4 to selected month
    tab2TableState.search = month;
    tab2TableState.page = 1;
    updateTab2Table();
}

function resetChart2Selection() {
    crossFilters.tab2Month = null;
    const card = document.getElementById('card-chart-2-1');
    const resetBtn = document.getElementById('reset-2-1-btn');
    if (card) card.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');

    tab2TableState.search = '';
    tab2TableState.page = 1;
    updateTab2Table();
}

function onChart2_3ScamClick(scamType) {
    crossFilters.tab2ScamType = scamType;
    const card = document.getElementById('card-chart-2-3');
    const resetBtn = document.getElementById('reset-2-3-btn');
    if (card) card.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    // Filter Table 2.4 to this scam category
    const keyword = scamType.includes('ลงทุน') ? 'ลงทุน' :
                   (scamType.includes('รางวัล') ? 'รางวัล' :
                   (scamType.includes('สินค้า') ? 'สินค้า' :
                   (scamType.includes('โทรศัพท์') ? 'โทรศัพท์' : 'แอบอ้าง')));
    tab2TableState.search = keyword;
    tab2TableState.page = 1;
    updateTab2Table();
}

function resetChart2_3Selection() {
    crossFilters.tab2ScamType = null;
    const card = document.getElementById('card-chart-2-3');
    const resetBtn = document.getElementById('reset-2-3-btn');
    if (card) card.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');

    tab2TableState.search = '';
    tab2TableState.page = 1;
    updateTab2Table();
}

function updateTab2Table() {
    const tbody = document.getElementById('tab2-table-body');
    const info = document.getElementById('tab2-page-info');
    const prevBtn = document.getElementById('tab2-prev-btn');
    const nextBtn = document.getElementById('tab2-next-btn');
    if (!tbody || !DATA.acsc.weekly_records) return;

    let records = DATA.acsc.weekly_records;
    if (globalState.quality === 'validated') {
        records = records.filter(r => r.flag === 'validated' || r.flag === 'exact');
    }

    const filtered = records.filter(r => {
        if (!tab2TableState.search) return true;
        const str = `${r.week_start} ${r.week_end} ${r.top_type} ${r.highest_loss_type}`.toLowerCase();
        return str.includes(tab2TableState.search);
    });

    // Find max loss for data bars
    const maxLoss = Math.max(...records.map(r => r.loss_baht), 1);

    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / tab2TableState.pageSize));
    if (tab2TableState.page > maxPage) tab2TableState.page = maxPage;
    if (tab2TableState.page < 1) tab2TableState.page = 1;

    const start = (tab2TableState.page - 1) * tab2TableState.pageSize;
    const pageItems = filtered.slice(start, start + tab2TableState.pageSize);

    tbody.innerHTML = pageItems.map(r => {
        const m = r.week_start.slice(0, 7);
        const afncContext = `เดือน ${m} (พบข่าวปลอม ~110-130 เรื่อง)`;
        const lossBarWidth = Math.min(100, Math.round((r.loss_baht / maxLoss) * 100));
        const isHighLoss = r.loss_per_case >= 50000;

        return `
            <tr class="${isHighLoss ? 'row-high-loss' : ''}">
                <td><strong>${r.week_start}</strong></td>
                <td>${r.week_end}</td>
                <td><span class="badge-blue">${r.cases.toLocaleString()}</span></td>
                <td class="data-bar-cell">
                    <div class="data-bar-bg" style="width: ${lossBarWidth}%;"></div>
                    <strong style="color: #D4AC0D;">฿${r.loss_million.toLocaleString()}M</strong>
                </td>
                <td>
                    <span style="${isHighLoss ? 'color: var(--pastel-pink-dark); font-weight:700;' : ''}">
                        ฿${Math.round(r.loss_per_case).toLocaleString()}
                        ${isHighLoss ? '<span class="badge-pink" style="font-size:9px; margin-left:4px;">> 50K</span>' : ''}
                    </span>
                </td>
                <td><small>${r.top_type || r.top_type_clean} ${r.top_type_share ? `(${r.top_type_share}%)` : ''}</small></td>
                <td><span class="badge-pink">${r.highest_loss_type || r.highest_loss_type_clean}</span></td>
                <td><small style="color: var(--text-secondary);">${afncContext}</small></td>
            </tr>
        `;
    }).join('');

    if (info) {
        const end = Math.min(start + tab2TableState.pageSize, total);
        info.textContent = `กำลังแสดง ${total > 0 ? start + 1 : 0}-${end} จาก ${total} สัปดาห์`;
    }
    if (prevBtn) prevBtn.disabled = tab2TableState.page <= 1;
    if (nextBtn) nextBtn.disabled = tab2TableState.page >= maxPage;
}

function changeTab2Page(dir) {
    tab2TableState.page += dir;
    updateTab2Table();
}

// ═══════════════════════════════════════════════════════════════
// TAB 3: GLOBAL AI RISKS & INTERNET FREEDOM CONTEXT
// ═══════════════════════════════════════════════════════════════
function initTab3() {
    // 1. Chart 3.1: Global Interactive Choropleth Map with Plotly
    renderGlobalMap('chart-3-1-world-map');

    // 2. Chart 3.2: Thailand vs ASEAN Freedom Scores with ASEAN Mean Benchmark
    const aseanCanvas = document.getElementById('chart-3-2-asean-bar');
    if (aseanCanvas && DATA.freedom.asean_latest) {
        const asean = [...DATA.freedom.asean_latest].sort((a, b) => b.total_score - a.total_score);
        charts['chart3_2'] = new Chart(aseanCanvas, {
            type: 'bar',
            data: {
                labels: asean.map(c => `${c.country} (${c.status})`),
                datasets: [{
                    label: 'คะแนนเสรีภาพ (เต็ม 100)',
                    data: asean.map(c => c.total_score),
                    backgroundColor: asean.map(c => c.country === 'Thailand' ? '#E6B0AA' : (c.total_score >= 70 ? '#7DCEA0' : '#F7DC6F')),
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const country = asean[elements[0].index].country;
                        onCountrySelect(country);
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterBody: () => 'ASEAN Benchmark Mean μ = 41.8 / 100'
                        }
                    }
                },
                scales: {
                    x: { max: 100, title: { display: true, text: 'คะแนนเสรีภาพ (Freedom Score)' } },
                    y: { ticks: { font: { size: 11, weight: 'bold' } } }
                }
            }
        });
    }

    // 3. Chart 3.3: Freedom Component Breakdown (3 Dimensions)
    const compCanvas = document.getElementById('chart-3-3-th-components');
    if (compCanvas && DATA.freedom.thailand_history) {
        const history = DATA.freedom.thailand_history;
        charts['chart3_3'] = new Chart(compCanvas, {
            type: 'bar',
            data: {
                labels: history.map(h => h.year),
                datasets: [
                    {
                        type: 'line',
                        label: 'คะแนนรวมไทย (Total Score เต็ม 100)',
                        data: history.map(h => h.total_score),
                        borderColor: '#2C3E50',
                        backgroundColor: 'transparent',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointBackgroundColor: '#2C3E50',
                        yAxisID: 'yTotal'
                    },
                    {
                        type: 'bar',
                        label: 'Obstacles to Access (เต็ม 25)',
                        data: history.map(h => h.obstacles),
                        backgroundColor: '#85C1E9',
                        borderRadius: 3,
                        yAxisID: 'yComp'
                    },
                    {
                        type: 'bar',
                        label: 'Limits on Content (เต็ม 35)',
                        data: history.map(h => h.limits),
                        backgroundColor: '#BB8FCE',
                        borderRadius: 3,
                        yAxisID: 'yComp'
                    },
                    {
                        type: 'bar',
                        label: 'Violations of User Rights (เต็ม 40)',
                        data: history.map(h => h.rights),
                        backgroundColor: '#E6B0AA',
                        borderRadius: 3,
                        yAxisID: 'yComp'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    yTotal: {
                        type: 'linear',
                        position: 'left',
                        min: 0,
                        max: 100,
                        title: { display: true, text: 'คะแนนรวม (0-100)' }
                    },
                    yComp: {
                        type: 'linear',
                        position: 'right',
                        min: 0,
                        max: 45,
                        grid: { display: false },
                        title: { display: true, text: 'คะแนนรายเสาหลัก' }
                    }
                }
            }
        });
    }

    // 4. Chart 3.4A: AI Incidents by Intent with YoY Growth Rate % Labels
    const intentCanvas = document.getElementById('chart-3-4-ai-intent-line');
    if (intentCanvas && DATA.aiid.intent_by_year) {
        const intentData = DATA.aiid.intent_by_year;
        charts['chart3_4A'] = new Chart(intentCanvas, {
            type: 'line',
            data: {
                labels: intentData.years,
                datasets: [
                    {
                        label: 'จงใจใช้ในทางที่ผิด (Intentional)',
                        data: intentData.intentional,
                        borderColor: '#BB8FCE',
                        backgroundColor: 'rgba(187, 143, 206, 0.15)',
                        fill: true,
                        tension: 0.25,
                        pointRadius: 5,
                        borderWidth: 2.5
                    },
                    {
                        label: 'ระบบผิดพลาด/อุบัติเหตุ (Unintentional)',
                        data: intentData.unintentional,
                        borderColor: '#85C1E9',
                        backgroundColor: 'rgba(133, 193, 233, 0.15)',
                        fill: true,
                        tension: 0.25,
                        pointRadius: 5,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const year = intentData.years[elements[0].index];
                        onChart3_4YearClick(year);
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterBody: (ctx) => {
                                const y = intentData.years[ctx[0].dataIndex];
                                return `YoY Growth Rate: ${intentData.yoy_growth[y] || 'N/A'}`;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { title: { display: true, text: 'จำนวนเหตุการณ์ที่บันทึก (N)' } }
                }
            }
        });
    }

    // 5. Chart 3.4B: Top AI Risk Domains Ranking
    const domainsCanvas = document.getElementById('chart-3-4-ai-domains-bar');
    if (domainsCanvas && DATA.aiid.risk_domains) {
        const sortedDomains = Object.entries(DATA.aiid.risk_domains)
            .filter(([k]) => k !== 'Unspecified')
            .sort((a, b) => b[1] - a[1]);
        const total = sortedDomains.reduce((sum, d) => sum + d[1], 0) || 1;

        charts['chart3_4B'] = new Chart(domainsCanvas, {
            type: 'bar',
            data: {
                labels: sortedDomains.map(d => d[0]),
                datasets: [{
                    label: 'จำนวนเหตุการณ์',
                    data: sortedDomains.map(d => d[1]),
                    backgroundColor: '#BB8FCE',
                    borderRadius: 5
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `N = ${ctx.raw} (${((ctx.raw/total)*100).toFixed(1)}%)`
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'จำนวนเหตุการณ์ (N)' } },
                    y: { ticks: { font: { size: 10.5, weight: 'bold' } } }
                }
            }
        });
    }

    // 6. Chart 3.5: Heatmap Matrix (Click to open Case Study Modal)
    renderTab3Heatmap();

    // 7. Table 3.6
    updateTab3Table();
}

function onChart3_4YearClick(year) {
    crossFilters.tab3Year = year;
    const card = document.getElementById('card-chart-3-4');
    const resetBtn = document.getElementById('reset-3-4-btn');
    if (card) card.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    // Filter Table 3.6 to selected year
    tab3TableState.search = String(year);
    tab3TableState.page = 1;
    updateTab3Table();
}

function resetChart3_4Selection() {
    crossFilters.tab3Year = null;
    const card = document.getElementById('card-chart-3-4');
    const resetBtn = document.getElementById('reset-3-4-btn');
    if (card) card.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');

    tab3TableState.search = '';
    tab3TableState.page = 1;
    updateTab3Table();
}

function onCountrySelect(countryName) {
    crossFilters.tab3Country = countryName;
    const c = DATA.freedom.countries_latest.find(x => x.country.toLowerCase() === countryName.toLowerCase());
    if (c) {
        document.getElementById('country-detail-name').textContent = `${c.country} (${c.iso3}) — ${c.total_score} คะแนน (${c.status})`;
        document.getElementById('country-detail-access').textContent = `${c.obstacles} / 25 (${((c.obstacles/25)*100).toFixed(0)}%)`;
        document.getElementById('country-detail-content').textContent = `${c.limits} / 35 (${((c.limits/35)*100).toFixed(0)}%)`;
        document.getElementById('country-detail-rights').textContent = `${c.rights} / 40 (${((c.rights/40)*100).toFixed(0)}% ${c.rights <= 10 ? '— จุดอ่อนสำคัญ' : ''})`;
        document.getElementById('country-detail-rights').style.color = c.rights <= 10 ? 'var(--pastel-pink-dark)' : 'var(--text-primary)';
    }
}

function renderGlobalMap(containerId) {
    const mapDiv = document.getElementById(containerId);
    if (!mapDiv || !window.Plotly || !DATA.freedom.countries_latest) return;

    const countries = DATA.freedom.countries_latest;
    const locations = countries.map(c => c.iso3);
    const z = countries.map(c => c.total_score);
    const text = countries.map(c => `<b>${c.country}</b><br>คะแนน: ${c.total_score}/100<br>สถานะ: ${c.status}<br>Access: ${c.obstacles}/25 | Content: ${c.limits}/35 | Rights: ${c.rights}/40`);

    const plotData = [{
        type: 'choropleth',
        locations: locations,
        z: z,
        text: text,
        hoverinfo: 'text',
        colorscale: [
            [0, '#E6B0AA'],
            [0.39, '#E6B0AA'],
            [0.40, '#F7DC6F'],
            [0.69, '#F7DC6F'],
            [0.70, '#7DCEA0'],
            [1.0, '#52BE80']
        ],
        zmin: 0,
        zmax: 100,
        colorbar: {
            title: 'Freedom Score',
            tickvals: [20, 55, 85],
            ticktext: ['Not Free (0-39)', 'Partly Free (40-69)', 'Free (70-100)'],
            len: 0.6,
            thickness: 12,
            bgcolor: 'transparent',
            outlinecolor: '#E5E7EB',
            tickfont: { color: '#2C3E50', size: 10 },
            titlefont: { color: '#2C3E50', size: 11, family: "'Noto Sans Thai', sans-serif" }
        },
        marker: { line: { color: '#FFFFFF', width: 0.8 } }
    }];

    const layout = {
        geo: {
            showframe: false,
            showcoastlines: true,
            coastlinecolor: '#E5E7EB',
            projection: { type: 'natural earth' },
            bgcolor: '#FFFFFF',
            lakecolor: '#F8F9FA',
            showocean: true,
            oceancolor: '#F8F9FA',
            landcolor: '#F2F4F4'
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 0, r: 0, t: 0, b: 0 },
        height: 440
    };

    Plotly.newPlot(containerId, plotData, layout, { responsive: true, displayModeBar: false });

    mapDiv.on('plotly_click', (data) => {
        if (data.points && data.points[0]) {
            const iso3 = data.points[0].location;
            const c = DATA.freedom.countries_latest.find(x => x.iso3 === iso3);
            if (c) onCountrySelect(c.country);
        }
    });
}

function renderTab3Heatmap() {
    const table = document.getElementById('tab3-heatmap-table');
    if (!table || !DATA.aiid.risk_x_intent) return;

    const domains = Object.keys(DATA.aiid.risk_x_intent).filter(d => d !== 'Unspecified');
    const intents = ['Intentional', 'Unintentional', 'Other'];

    let maxVal = 1;
    domains.forEach(d => {
        intents.forEach(i => {
            const v = DATA.aiid.risk_x_intent[d][i] || 0;
            if (v > maxVal) maxVal = v;
        });
    });

    let html = `
        <thead>
            <tr>
                <th style="width: 38%;">Risk Domain</th>
                <th>Intentional (จงใจโจมตี)</th>
                <th>Unintentional (อุบัติเหตุ)</th>
                <th>Other (อื่นๆ)</th>
            </tr>
        </thead>
        <tbody>
    `;

    domains.forEach(d => {
        html += `<tr><td><strong>${d}</strong></td>`;
        intents.forEach(i => {
            const count = DATA.aiid.risk_x_intent[d][i] || 0;
            const intensity = count > 0 ? Math.max(0.12, count / maxVal) : 0.03;
            const bg = count > 0 ? `rgba(187, 143, 206, ${intensity})` : 'transparent';
            const textColor = count > (maxVal * 0.4) ? '#512E5F' : '#2C3E50';
            const safeDomain = encodeURIComponent(d);
            const safeIntent = encodeURIComponent(i);

            html += `
                <td class="heatmap-cell" style="background: ${bg}; color: ${textColor};"
                    onclick="openCaseModal('${safeDomain}', '${safeIntent}')"
                    title="คลิกดูเคสตัวอย่าง (${d} × ${i})">
                    N = ${count.toLocaleString()}
                </td>
            `;
        });
        html += `</tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;
}

// ── Case Study Modal Popup (Section 6.2 & 7) ──
function openCaseModal(encodedDomain, encodedIntent) {
    const domain = decodeURIComponent(encodedDomain);
    const intent = decodeURIComponent(encodedIntent);
    const key = `${domain}___${intent}`;
    const cases = DATA.aiid.case_studies_matrix ? DATA.aiid.case_studies_matrix[key] : null;

    const modal = document.getElementById('caseStudyModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    title.innerHTML = `<i class="fas fa-microscope" style="color: var(--pastel-lavender-dark);"></i> กรณีศึกษา: ${domain} (${intent})`;

    if (cases && cases.length > 0) {
        content.innerHTML = cases.map(c => `
            <div class="case-card">
                <div class="case-card-title">#${c.id}: ${c.title} ${c.is_deepfake ? '<span class="badge-lavender" style="font-size:10px; margin-left:6px;">Deepfake</span>' : ''}</div>
                <div class="case-card-meta">
                    <span><i class="fas fa-calendar"></i> ปี ${c.year}</span>
                    <span><i class="fas fa-user-gear"></i> Deployer: ${c.deployer}</span>
                    <span><i class="fas fa-server"></i> ระบบ: ${c.implicated}</span>
                </div>
                <div class="case-card-desc">${c.description}</div>
            </div>
        `).join('');
    } else {
        content.innerHTML = `<p style="color: var(--text-secondary); text-align:center; padding: 20px;">ไม่พบเคสตัวอย่างในกลุ่มที่เลือก</p>`;
    }

    modal.classList.add('open');
}

function closeCaseModal() {
    const modal = document.getElementById('caseStudyModal');
    if (modal) modal.classList.remove('open');
}

function updateTab3Table() {
    const tbody = document.getElementById('tab3-table-body');
    const info = document.getElementById('tab3-page-info');
    const prevBtn = document.getElementById('tab3-prev-btn');
    const nextBtn = document.getElementById('tab3-next-btn');
    if (!tbody || !DATA.aiid.incidents) return;

    const filtered = DATA.aiid.incidents.filter(inc => {
        if (!tab3TableState.search) return true;
        const str = `${inc.title} ${inc.deployer} ${inc.risk_domain} ${inc.intent} ${inc.implicated}`.toLowerCase();
        return str.includes(tab3TableState.search);
    });

    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / tab3TableState.pageSize));
    if (tab3TableState.page > maxPage) tab3TableState.page = maxPage;
    if (tab3TableState.page < 1) tab3TableState.page = 1;

    const start = (tab3TableState.page - 1) * tab3TableState.pageSize;
    const pageItems = filtered.slice(start, start + tab3TableState.pageSize);

    tbody.innerHTML = pageItems.map(inc => {
        const intentBadge = inc.intent === 'Intentional'
            ? '<span class="badge-pink">Intentional</span>'
            : (inc.intent === 'Unintentional' ? '<span class="badge-blue">Unintentional</span>' : '<span class="badge-tag">Other</span>');
        const deepfakeTag = inc.is_deepfake ? '<span class="badge-lavender">Deepfake/Clone</span>' : '<span style="color:#BDC3C7;">-</span>';

        return `
            <tr>
                <td>#${inc.id}</td>
                <td><strong>${inc.year}</strong></td>
                <td><strong>${inc.title}</strong></td>
                <td><small>${inc.risk_domain}</small></td>
                <td>${intentBadge}</td>
                <td><span class="badge-tag">${inc.deployer}</span></td>
                <td><small style="color: var(--text-secondary);">${inc.implicated || '-'}</small></td>
                <td>${deepfakeTag}</td>
            </tr>
        `;
    }).join('');

    if (info) {
        const end = Math.min(start + tab3TableState.pageSize, total);
        info.textContent = `กำลังแสดง ${total > 0 ? start + 1 : 0}-${end} จาก ${total.toLocaleString()} เหตุการณ์`;
    }
    if (prevBtn) prevBtn.disabled = tab3TableState.page <= 1;
    if (nextBtn) nextBtn.disabled = tab3TableState.page >= maxPage;
}

function changeTab3Page(dir) {
    tab3TableState.page += dir;
    updateTab3Table();
}
