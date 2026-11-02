/**
 * Digital Threats & Internet Freedom Dashboard
 * Specification: handoff_kp2.md (3-Tab Pastel Architecture)
 * Branch: kp
 */

let DATA = null;
const charts = {};

// Table & Pagination States
const tab2State = { page: 1, pageSize: 10, search: '' };
const tab3State = { page: 1, pageSize: 10, search: '' };

// ── Chart.js Pastel Theme Global Config (handoff_kp2 Section 1) ──
if (window.Chart) {
    Chart.defaults.color = '#2C3E50'; // Dark Slate (High Contrast)
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

        // Initialize all 3 tabs
        initTab1();
        initTab2();
        initTab3();

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

    // Trigger Chart & Plotly Resizes for newly active tab
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

// ═══════════════════════════════════════════════════════════════
// TAB 1: VISUAL OVERVIEW & LANDSCAPE (Visual-Heavy)
// ═══════════════════════════════════════════════════════════════
function initTab1() {
    // 1. Chart 1.1: Multi-Dataset Trend Preview (AFNC Items vs ACSC Cases by Month)
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
                        pointRadius: 4,
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
                        pointRadius: 4,
                        pointBackgroundColor: '#E6B0AA',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                        title: { display: true, text: 'จำนวนข่าว AFNC (เรื่อง)', font: { size: 11, weight: 'bold' } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 2. Chart 1.2: Threat Landscape (Horizontal Bar Chart)
    const landscapeCanvas = document.getElementById('chart-1-2-landscape');
    if (landscapeCanvas) {
        // Synthesized landscape categories in Thailand
        const categories = [
            'หลอกซื้อขายสินค้าออนไลน์ (ACSC)',
            'นโยบายรัฐ & สวัสดิการ (AFNC)',
            'ผลิตภัณฑ์สุขภาพ & ยา (AFNC)',
            'หลอกให้ลงทุน / คริปโต (ACSC)',
            'การเงิน & ตลาดหุ้น (AFNC)',
            'ข่มขู่ทางโทรศัพท์ / คอลเซ็นเตอร์ (ACSC)',
            'หลอกรับรางวัล / ทำงานพิเศษ (ACSC)',
            'ภัยพิบัติ & ข่าวความมั่นคง (AFNC)'
        ];
        const scores = [85, 78, 65, 62, 54, 48, 45, 30]; // Relative impact index
        const colors = [
            '#85C1E9', '#E6B0AA', '#E6B0AA', '#F7DC6F',
            '#E6B0AA', '#F7DC6F', '#85C1E9', '#BB8FCE'
        ];

        charts['chart1_2'] = new Chart(landscapeCanvas, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'ดัชนีผลกระทบและความถี่ในข้อมูล (%)',
                    data: scores,
                    backgroundColor: colors,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { max: 100, title: { display: true, text: 'ระดับผลกระทบและความชุกในข้อมูล (%)' } },
                    y: { ticks: { font: { size: 11 } } }
                }
            }
        });
    }

    // 3. Sparkline Micro-Charts (Chart 1.3)
    // 3A: AFNC Split
    const sparkAfnc = document.getElementById('spark-afnc');
    if (sparkAfnc) {
        new Chart(sparkAfnc, {
            type: 'bar',
            data: {
                labels: ['Fake', 'True', 'Distorted'],
                datasets: [{
                    data: [DATA.afnc.fake_count, DATA.afnc.true_count, DATA.afnc.distorted_count],
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

    // 3B: ACSC Impact
    const sparkAcsc = document.getElementById('spark-acsc');
    if (sparkAcsc) {
        new Chart(sparkAcsc, {
            type: 'bar',
            data: {
                labels: ['ลงทุน', 'รางวัล', 'สินค้า', 'คอลเซ็นเตอร์'],
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

    // 3C: AIID Intent
    const sparkAiid = document.getElementById('spark-aiid');
    if (sparkAiid) {
        new Chart(sparkAiid, {
            type: 'doughnut',
            data: {
                labels: ['เจตนา (Intentional)', 'ข้อผิดพลาด (Unintentional)'],
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

    // 3D: Freedom ASEAN
    const sparkFreedom = document.getElementById('spark-freedom');
    if (sparkFreedom) {
        const asean = DATA.freedom.asean_latest;
        new Chart(sparkFreedom, {
            type: 'bar',
            data: {
                labels: asean.map(c => c.country.slice(0, 3)),
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

    // 4. Chart 1.4: Mini Geographic Snap (Plotly Map)
    renderMiniMap('chart-1-4-map');
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
            [0, '#E6B0AA'],      // Pastel Rose (Not Free: 0-39)
            [0.39, '#E6B0AA'],
            [0.40, '#F7DC6F'],   // Pastel Peach/Yellow (Partly Free: 40-69)
            [0.69, '#F7DC6F'],
            [0.70, '#7DCEA0'],   // Pastel Sage Mint (Free: 70-100)
            [1.0, '#52BE80']
        ],
        zmin: 0,
        zmax: 100,
        colorbar: {
            title: 'Freedom Score',
            tickvals: [20, 55, 85],
            ticktext: ['Not Free', 'Partly Free', 'Free'],
            len: 0.65,
            thickness: 12,
            bgcolor: 'transparent',
            outlinecolor: '#E5E7EB',
            tickfont: { color: '#2C3E50', size: 10 },
            titlefont: { color: '#2C3E50', size: 11, family: "'Noto Sans Thai', sans-serif" }
        },
        marker: {
            line: { color: '#FFFFFF', width: 0.7 }
        }
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
// TAB 2: THAILAND THREATS & FINANCIAL LOSS (AFNC + ACSC LINK)
// ═══════════════════════════════════════════════════════════════
function initTab2() {
    const overlap = DATA.overlap_link;

    // 1. Chart 2.1: Dual Panel Stacked Time View (Synchronized X-axis)
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
                        pointRadius: 3
                    },
                    {
                        label: 'ข่าวบิดเบือน (Distorted)',
                        data: overlap.afnc_distorted,
                        borderColor: '#F7DC6F',
                        backgroundColor: 'rgba(247, 220, 111, 0.2)',
                        fill: true,
                        tension: 0.2,
                        pointRadius: 3
                    },
                    {
                        label: 'ข่าวจริง (True)',
                        data: overlap.afnc_true,
                        borderColor: '#7DCEA0',
                        backgroundColor: 'rgba(125, 206, 160, 0.2)',
                        fill: true,
                        tension: 0.2,
                        pointRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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

    // 3. Chart 2.3: Grouped Horizontal Bar: Cases vs Financial Loss
    const lossVolumeCanvas = document.getElementById('chart-2-3-loss-volume');
    if (lossVolumeCanvas && DATA.acsc.loss_grouped_comparison) {
        const groups = DATA.acsc.loss_grouped_comparison;
        charts['chart2_3'] = new Chart(lossVolumeCanvas, {
            type: 'bar',
            data: {
                labels: groups.map(g => g.category),
                datasets: [
                    {
                        label: 'จำนวนคดีโดยประมาณ (Cases / 1,000)',
                        data: groups.map(g => Math.round(g.cases / 1000)),
                        backgroundColor: '#85C1E9', // Sky Blue
                        borderRadius: 4
                    },
                    {
                        label: 'มูลค่าความเสียหาย (พันล้านบาท)',
                        data: groups.map(g => g.loss_billion),
                        backgroundColor: '#F7DC6F', // Amber Peach
                        borderRadius: 4
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'จำนวนคดี (พันคดี)  VS  ความเสียหาย (พันล้านบาท)' } },
                    y: { ticks: { font: { size: 11 } } }
                }
            }
        });
    }

    // 4. Chart 2.4: Cross-Category Topic Matrix Bar Chart
    const matrixCanvas = document.getElementById('chart-2-4-topic-matrix');
    if (matrixCanvas) {
        const topics = [
            'การเงิน/การลงทุน (AFNC: 2,514 ข่าว | ACSC: 9,000 ลบ.)',
            'สินค้าและบริการออนไลน์ (AFNC: 963 ข่าว | ACSC: 285k คดี)',
            'งานพิเศษ/แจกรางวัล (AFNC: 683 ข่าว | ACSC: 3,840 ลบ.)',
            'ข่มขู่/แอบอ้างเจ้าหน้าที่ (AFNC: 391 ข่าว | ACSC: 1,270 ลบ.)',
            'นโยบายรัฐ/เงินช่วยเหลือ (AFNC: 6,272 ข่าว | ACSC: เตือนภัยร่วม)'
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
                        label: 'ดัชนีผลกระทบทางการเงิน ACSC (Relative Scale)',
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

    // Search in Tab 2 Table
    const searchInput = document.getElementById('tab2-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            tab2State.search = e.target.value.toLowerCase().trim();
            tab2State.page = 1;
            updateTab2Table();
        });
    }

    updateTab2Table();
}

function updateTab2Table() {
    const tbody = document.getElementById('tab2-table-body');
    const info = document.getElementById('tab2-page-info');
    const prevBtn = document.getElementById('tab2-prev-btn');
    const nextBtn = document.getElementById('tab2-next-btn');
    if (!tbody || !DATA.acsc.weekly_records) return;

    const filtered = DATA.acsc.weekly_records.filter(r => {
        if (!tab2State.search) return true;
        const str = `${r.week_start} ${r.week_end} ${r.top_type} ${r.highest_loss_type}`.toLowerCase();
        return str.includes(tab2State.search);
    });

    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / tab2State.pageSize));
    if (tab2State.page > maxPage) tab2State.page = maxPage;
    if (tab2State.page < 1) tab2State.page = 1;

    const start = (tab2State.page - 1) * tab2State.pageSize;
    const pageItems = filtered.slice(start, start + tab2State.pageSize);

    tbody.innerHTML = pageItems.map(r => {
        const m = r.week_start.slice(0, 7);
        const afncContext = `เดือน ${m} (พบข่าวปลอม ~110-130 เรื่อง/เดือน)`;

        return `
            <tr>
                <td><strong>${r.week_start}</strong></td>
                <td>${r.week_end}</td>
                <td><span class="badge-blue">${r.cases.toLocaleString()}</span></td>
                <td><strong style="color: #D4AC0D;">${r.loss_million.toLocaleString()} ลบ.</strong></td>
                <td>${Math.round(r.loss_per_case).toLocaleString()}</td>
                <td><small>${r.top_type || r.top_type_clean} ${r.top_type_share ? `(${r.top_type_share}%)` : ''}</small></td>
                <td><span class="badge-pink">${r.highest_loss_type || r.highest_loss_type_clean}</span></td>
                <td><small style="color: var(--text-secondary);">${afncContext}</small></td>
            </tr>
        `;
    }).join('');

    if (info) {
        const end = Math.min(start + tab2State.pageSize, total);
        info.textContent = `กำลังแสดง ${total > 0 ? start + 1 : 0}-${end} จาก ${total} สัปดาห์`;
    }
    if (prevBtn) prevBtn.disabled = tab2State.page <= 1;
    if (nextBtn) nextBtn.disabled = tab2State.page >= maxPage;
}

function changeTab2Page(dir) {
    tab2State.page += dir;
    updateTab2Table();
}

// ═══════════════════════════════════════════════════════════════
// TAB 3: GLOBAL AI RISKS & INTERNET FREEDOM CONTEXT
// ═══════════════════════════════════════════════════════════════
function initTab3() {
    // 1. Chart 3.1: Global Interactive Choropleth Map with Plotly
    renderGlobalMap('chart-3-1-world-map');

    // 2. Chart 3.2: Thailand Score Trend & Component Breakdown (Grouped Bar + Line)
    const compCanvas = document.getElementById('chart-3-2-th-components');
    if (compCanvas && DATA.freedom.thailand_history) {
        const history = DATA.freedom.thailand_history;
        charts['chart3_2'] = new Chart(compCanvas, {
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
                        backgroundColor: '#85C1E9', // Sky Blue
                        borderRadius: 3,
                        yAxisID: 'yComp'
                    },
                    {
                        type: 'bar',
                        label: 'Limits on Content (เต็ม 35)',
                        data: history.map(h => h.limits),
                        backgroundColor: '#BB8FCE', // Soft Lavender
                        borderRadius: 3,
                        yAxisID: 'yComp'
                    },
                    {
                        type: 'bar',
                        label: 'Violations of User Rights (เต็ม 40)',
                        data: history.map(h => h.rights),
                        backgroundColor: '#E6B0AA', // Pastel Rose
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

    // 3. Chart 3.3: Thailand vs ASEAN Comparison (Horizontal Bar Chart)
    const aseanCanvas = document.getElementById('chart-3-3-asean-bar');
    if (aseanCanvas && DATA.freedom.asean_latest) {
        const asean = [...DATA.freedom.asean_latest].sort((a, b) => b.total_score - a.total_score);
        charts['chart3_3'] = new Chart(aseanCanvas, {
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
                plugins: { legend: { display: false } },
                scales: {
                    x: { max: 100, title: { display: true, text: 'คะแนนเสรีภาพ (Freedom Score)' } }
                }
            }
        });
    }

    // 4. Chart 3.4A: AI Incidents by Intent (2015–2026 Line Chart)
    const intentCanvas = document.getElementById('chart-3-4-ai-intent-line');
    if (intentCanvas && DATA.aiid.intent_by_year) {
        const intentData = DATA.aiid.intent_by_year;
        charts['chart3_4A'] = new Chart(intentCanvas, {
            type: 'line',
            data: {
                labels: intentData.years,
                datasets: [
                    {
                        label: 'จงใจใช้ในทางที่ผิด (Intentional Harms)',
                        data: intentData.intentional,
                        borderColor: '#BB8FCE', // Pastel Lavender
                        backgroundColor: 'rgba(187, 143, 206, 0.15)',
                        fill: true,
                        tension: 0.25,
                        pointRadius: 4,
                        borderWidth: 2.5
                    },
                    {
                        label: 'ความผิดพลาดของระบบ (Unintentional Failures)',
                        data: intentData.unintentional,
                        borderColor: '#85C1E9', // Pastel Blue
                        backgroundColor: 'rgba(133, 193, 233, 0.15)',
                        fill: true,
                        tension: 0.25,
                        pointRadius: 4,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: { title: { display: true, text: 'จำนวนเหตุการณ์ที่บันทึก' } }
                }
            }
        });
    }

    // 5. Chart 3.4B: Top Risk Domains Ranking
    const domainsCanvas = document.getElementById('chart-3-4-ai-domains-bar');
    if (domainsCanvas && DATA.aiid.risk_domains) {
        const sortedDomains = Object.entries(DATA.aiid.risk_domains)
            .filter(([k]) => k !== 'Unspecified')
            .sort((a, b) => b[1] - a[1]);

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
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: 'จำนวนเหตุการณ์' } },
                    y: { ticks: { font: { size: 10.5 } } }
                }
            }
        });
    }

    // 6. Chart 3.5: Heatmap Matrix
    renderTab3Heatmap();

    // 7. Search in Tab 3 Table
    const searchInput = document.getElementById('tab3-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            tab3State.search = e.target.value.toLowerCase().trim();
            tab3State.page = 1;
            updateTab3Table();
        });
    }

    updateTab3Table();
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
            [0, '#E6B0AA'],      // Dark Pastel Rose (0-39 Not Free)
            [0.39, '#E6B0AA'],
            [0.40, '#F7DC6F'],   // Soft Pastel Yellow/Peach (40-69 Partly Free)
            [0.69, '#F7DC6F'],
            [0.70, '#7DCEA0'],   // Soft Pastel Mint (70-100 Free)
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
        marker: {
            line: { color: '#FFFFFF', width: 0.8 }
        }
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

    // Click handler to update selected country
    mapDiv.on('plotly_click', (data) => {
        if (data.points && data.points[0]) {
            const iso3 = data.points[0].location;
            const c = DATA.freedom.countries_latest.find(x => x.iso3 === iso3);
            if (c) {
                const nameEl = document.getElementById('country-detail-name');
                const accessEl = document.getElementById('country-detail-access');
                const contentEl = document.getElementById('country-detail-content');
                const rightsEl = document.getElementById('country-detail-rights');

                if (nameEl) nameEl.textContent = `${c.country} (${c.iso3}) — ${c.total_score} คะแนน (${c.status})`;
                if (accessEl) accessEl.textContent = `${c.obstacles} / 25`;
                if (contentEl) contentEl.textContent = `${c.limits} / 35`;
                if (rightsEl) {
                    rightsEl.textContent = `${c.rights} / 40 ${c.rights <= 10 ? '(จุดอ่อนสำคัญ)' : ''}`;
                    rightsEl.style.color = c.rights <= 10 ? 'var(--pastel-pink-dark)' : 'var(--text-primary)';
                }
            }
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
                <th>Intentional (จงใจโจมตี/ใช้ผิด)</th>
                <th>Unintentional (อุบัติเหตุ/ระบบล้มเหลว)</th>
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
            html += `<td class="heatmap-cell" style="background: ${bg}; color: ${textColor};">${count.toLocaleString()}</td>`;
        });
        html += `</tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;
}

function updateTab3Table() {
    const tbody = document.getElementById('tab3-table-body');
    const info = document.getElementById('tab3-page-info');
    const prevBtn = document.getElementById('tab3-prev-btn');
    const nextBtn = document.getElementById('tab3-next-btn');
    if (!tbody || !DATA.aiid.incidents) return;

    const filtered = DATA.aiid.incidents.filter(inc => {
        if (!tab3State.search) return true;
        const str = `${inc.title} ${inc.deployer} ${inc.risk_domain} ${inc.intent} ${inc.implicated}`.toLowerCase();
        return str.includes(tab3State.search);
    });

    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / tab3State.pageSize));
    if (tab3State.page > maxPage) tab3State.page = maxPage;
    if (tab3State.page < 1) tab3State.page = 1;

    const start = (tab3State.page - 1) * tab3State.pageSize;
    const pageItems = filtered.slice(start, start + tab3State.pageSize);

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
        const end = Math.min(start + tab3State.pageSize, total);
        info.textContent = `กำลังแสดง ${total > 0 ? start + 1 : 0}-${end} จาก ${total.toLocaleString()} เหตุการณ์`;
    }
    if (prevBtn) prevBtn.disabled = tab3State.page <= 1;
    if (nextBtn) nextBtn.disabled = tab3State.page >= maxPage;
}

function changeTab3Page(dir) {
    tab3State.page += dir;
    updateTab3Table();
}
