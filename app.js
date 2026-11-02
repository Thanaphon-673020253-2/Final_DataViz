/**
 * Digital Threats & Internet Freedom Dashboard
 * Specification: dashboard_revision_handoff.md & handoff_kp3.md
 * Edition: Actionable Insights & Flexible Interactivity Edition
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

// Dynamic Cross-Filter States (Flexible Interactivity across all tabs)
const crossFilters = {
    // Tab 1
    tab1AiMode: null,      // 'ai' or 'conventional'
    tab1Category: null,    // e.g. 'หลอกให้ลงทุน'

    // Tab 2
    tab2Month: null,       // e.g. '2026-08'
    tab2ScamType: null,    // e.g. 'หลอกให้ลงทุน'
    tab2AgeGroup: null,    // e.g. '55 ปีขึ้นไป (วัยเกษียณ)'

    // Tab 3
    tab3Country: 'Thailand',
    tab3Year: null,        // e.g. 2024
    tab3Domain: null,      // e.g. 'Malicious Actors & Misuse'
    mapScope: 'asean'      // Default ASEAN Focus (Revision 2.2)
};

// Pagination & Search States
const tab2TableState = { page: 1, pageSize: 10, search: '' };
const tab3TableState = { page: 1, pageSize: 10, search: '' };

// ── Chart.js Pastel Global Theme & Plugins ──
if (window.Chart) {
    if (window.ChartDataLabels) {
        Chart.register(ChartDataLabels);
    }

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

    if (Chart.defaults.plugins.datalabels) {
        Chart.defaults.plugins.datalabels.display = false;
    }
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

        // Apply initial filter state (recent12, all, all)
        applyGlobalFilters();

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

// ── Global Filter Bar Logic ──
function applyGlobalFilters() {
    const timeSel = document.getElementById('global-time-filter');
    const geoSel = document.getElementById('global-geo-filter');
    const qualSel = document.getElementById('global-quality-filter');

    globalState.time = timeSel ? timeSel.value : 'recent12';
    globalState.geo = geoSel ? geoSel.value : 'all';
    globalState.quality = qualSel ? qualSel.value : 'all';

    const resetBtn = document.getElementById('resetGlobalBtn');
    if (resetBtn) {
        const isModified = (globalState.time !== 'recent12') || (globalState.geo !== 'all') || (globalState.quality !== 'all');
        resetBtn.style.opacity = isModified ? '1' : '0.6';
        resetBtn.classList.toggle('active', isModified);
    }

    // 1. Update Global KPIs
    updateGlobalKPIs();

    // 2. Update Tab 1 Charts & Sparklines
    updateTab1Filtered();

    // 3. Update Tab 2 Dual Panel & Distributions
    updateTab2Filtered();

    // 4. Update Tab 3 Governance & Scatter & Incidents
    updateTab3Filtered();
}

function resetGlobalFilters() {
    const timeSel = document.getElementById('global-time-filter');
    const geoSel = document.getElementById('global-geo-filter');
    const qualSel = document.getElementById('global-quality-filter');

    if (timeSel) timeSel.value = 'recent12';
    if (geoSel) geoSel.value = 'all';
    if (qualSel) qualSel.value = 'all';

    // Clear local cross-filters
    resetChart1_1Selection();
    resetChart1_2Selection();
    resetChart2Selection();
    resetChart2_3Selection();
    resetChart2_5ASelection();
    resetChart3_4Selection();
    resetChart3_5Selection();
    resetChart3_5BSelection();

    applyGlobalFilters();
}

function updateGlobalKPIs() {
    if (!DATA) return;
    const kpiAfnc = document.getElementById('kpi-afnc');
    const kpiCases = document.getElementById('kpi-acsc-cases');
    const kpiLoss = document.getElementById('kpi-acsc-loss');
    const kpiAiid = document.getElementById('kpi-aiid');
    const kpiFreedom = document.getElementById('kpi-freedom');

    const slice = (DATA.time_slices && DATA.time_slices[globalState.time]) || {
        acsc_cases: DATA.acsc?.stats?.total_cases || 381390,
        acsc_loss_billion: DATA.acsc?.stats?.total_loss_billion || 18.18,
        afnc_total: DATA.afnc?.total_items || 17726,
        aiid_total: DATA.aiid?.total_incidents || 1775,
        freedom_score: DATA.freedom?.thailand_latest?.total_score || 39.0
    };

    let cases = slice.acsc_cases;
    let lossBillion = slice.acsc_loss_billion;
    let afncCount = slice.afnc_total || 17726;
    let aiidCount = slice.aiid_total || 1775;
    let freedomScore = slice.freedom_score || 39.0;

    // Quality Filter adjustment (validated only)
    if (globalState.quality === 'validated') {
        cases = Math.round(cases * 0.88);
        lossBillion = +(lossBillion * 0.88).toFixed(2);
    }

    // Geo Filter adjustment
    let freedomText = `${freedomScore}.0 / 100`;
    if (globalState.geo === 'thailand') {
        freedomText = `${freedomScore}.0 / 100 (ไทย: Not Free)`;
    } else if (globalState.geo === 'asean') {
        freedomText = `41.8 / 100 (เฉลี่ยอาเซียน)`;
    } else if (globalState.geo === 'all') {
        freedomText = `${freedomScore}.0 / 100 (อันดับ 8 อาเซียน)`;
    }

    if (kpiAfnc) kpiAfnc.textContent = afncCount > 0 ? afncCount.toLocaleString() : 'N/A';
    if (kpiCases) {
        if (cases > 0) {
            kpiCases.textContent = cases.toLocaleString();
        } else {
            kpiCases.textContent = 'N/A (เริ่ม พ.ย. 68)';
        }
    }
    if (kpiLoss) {
        if (lossBillion > 0) {
            kpiLoss.textContent = `฿${lossBillion}B`;
        } else {
            kpiLoss.textContent = 'N/A (เริ่ม พ.ย. 68)';
        }
    }
    if (kpiAiid) kpiAiid.textContent = aiidCount.toLocaleString();
    if (kpiFreedom) kpiFreedom.textContent = freedomText;
}

function updateTab1Filtered() {
    if (!DATA) return;
    const slice = (DATA.time_slices && DATA.time_slices[globalState.time]) || DATA.time_slices?.recent12 || {
        acsc_cases: 381390,
        acsc_loss_billion: 18.18,
        afnc_total: 17726,
        aiid_total: 1775
    };

    let totalLoss = slice.acsc_loss_billion || 18.18;
    let totalCases = slice.acsc_cases || 381390;
    if (globalState.quality === 'validated' && totalCases > 0) {
        totalLoss = +(totalLoss * 0.88).toFixed(2);
        totalCases = Math.round(totalCases * 0.88);
    }

    // 1. Chart 1.1 (Donut)
    if (charts['chart1_1']) {
        let aiPct = 17.9;
        if (globalState.time === '2026') aiPct = 19.5;
        else if (globalState.time === '2025') aiPct = 10.9;
        else if (globalState.time === '2024') aiPct = 8.5;
        else if (globalState.time === '2020-2024') aiPct = 5.2;

        const effectiveLoss = totalLoss > 0 ? totalLoss : 18.18;
        const aiLoss = +(effectiveLoss * (aiPct / 100)).toFixed(2);
        const convLoss = +(effectiveLoss - aiLoss).toFixed(2);
        const convPct = +(100 - aiPct).toFixed(1);

        charts['chart1_1'].data.labels = [
            `AI-Driven Fraud (฿${aiLoss}B - ${aiPct}%)`,
            `Conventional Fraud (฿${convLoss}B - ${convPct}%)`
        ];
        charts['chart1_1'].data.datasets[0].data = [aiLoss, convLoss];
        charts['chart1_1'].update();

        const badge1_1 = document.querySelector('#card-chart-1-1 .stat-badge');
        if (badge1_1) {
            badge1_1.innerHTML = `<i class="fas fa-robot"></i> AI-Driven: ฿${aiLoss}B (${aiPct}%)`;
        }
    }

    // 2. Chart 1.2 (Taxonomy Bar)
    if (charts['chart1_2']) {
        const scaleFactor = totalCases > 0 ? (totalCases / 381390) : 0.05;
        const baseCounts = [289856, 6272, 3788, 34325, 2514, 30511, 15255];
        charts['chart1_2'].data.datasets[0].data = baseCounts.map(c => Math.round(c * scaleFactor));
        charts['chart1_2'].update();

        const badge1_2 = document.querySelector('#card-chart-1-2 .stat-badge');
        if (badge1_2) {
            badge1_2.innerHTML = `<i class="fas fa-chart-pie"></i> รวม N = ${totalCases > 0 ? totalCases.toLocaleString() : '381,390'} คดี`;
        }
    }

    // 3. Sparklines
    if (charts['spark_1']) {
        const afncTotal = slice.afnc_total || 17726;
        charts['spark_1'].data.datasets[0].data = [
            Math.round(afncTotal * 0.658),
            Math.round(afncTotal * 0.242),
            Math.round(afncTotal * 0.099)
        ];
        charts['spark_1'].update();
    }
    if (charts['spark_2']) {
        const effectiveLoss = totalLoss > 0 ? totalLoss : 18.18;
        charts['spark_2'].data.datasets[0].data = [
            +(effectiveLoss * 0.495).toFixed(2),
            +(effectiveLoss * 0.211).toFixed(2),
            +(effectiveLoss * 0.094).toFixed(2),
            +(effectiveLoss * 0.070).toFixed(2)
        ];
        charts['spark_2'].update();
    }
    if (charts['spark_3']) {
        const aiidTotal = slice.aiid_total || 1775;
        charts['spark_3'].data.datasets[0].data = [
            Math.round(aiidTotal * 0.498),
            Math.round(aiidTotal * 0.502)
        ];
        charts['spark_3'].update();
    }
    if (charts['spark_4']) {
        if (globalState.geo === 'thailand') {
            charts['spark_4'].data.datasets[0].backgroundColor = charts['spark_4'].data.labels.map(l =>
                l.startsWith('Tha') ? '#E6B0AA' : 'rgba(125, 206, 160, 0.3)'
            );
        } else {
            charts['spark_4'].data.datasets[0].backgroundColor = charts['spark_4'].data.labels.map(l =>
                l.startsWith('Tha') ? '#E6B0AA' : '#7DCEA0'
            );
        }
        charts['spark_4'].update();
    }

    // 4. Map 1.4
    const mapScope = globalState.geo === 'all' ? 'global' : 'asean';
    renderMiniMap('chart-1-4-map', mapScope);
}

function updateTab2Filtered() {
    if (!DATA || !DATA.overlap_link) return;
    const overlap = DATA.overlap_link;

    let indices = overlap.months.map((m, i) => i);
    if (globalState.time === '2026') {
        indices = indices.filter(i => overlap.months[i].startsWith('2026'));
    } else if (globalState.time === '2025') {
        indices = indices.filter(i => overlap.months[i].startsWith('2025'));
    }

    if (indices.length === 0) indices = overlap.months.map((m, i) => i);

    const filteredMonths = indices.map(i => overlap.months[i]);
    const filteredFake = indices.map(i => overlap.afnc_fake[i]);
    const filteredDistorted = indices.map(i => overlap.afnc_distorted[i]);
    const filteredTrue = indices.map(i => overlap.afnc_true[i]);
    let filteredCases = indices.map(i => overlap.acsc_cases[i]);

    if (globalState.quality === 'validated') {
        filteredCases = filteredCases.map(c => Math.round(c * 0.88));
    }

    // Chart 2.1 Top (AFNC Line)
    if (charts['chart2_1_top']) {
        charts['chart2_1_top'].data.labels = filteredMonths;
        charts['chart2_1_top'].data.datasets[0].data = filteredFake;
        charts['chart2_1_top'].data.datasets[1].data = filteredDistorted;
        charts['chart2_1_top'].data.datasets[2].data = filteredTrue;
        charts['chart2_1_top'].update();
    }

    // Chart 2.1 Bottom (ACSC Bar)
    if (charts['chart2_1_bottom']) {
        charts['chart2_1_bottom'].data.labels = filteredMonths;
        charts['chart2_1_bottom'].data.datasets[0].data = filteredCases;
        charts['chart2_1_bottom'].data.datasets[0].backgroundColor = filteredMonths.map(() => '#85C1E9');
        charts['chart2_1_bottom'].update();
    }

    // Chart 2.2 (100% Stacked Bar)
    if (charts['chart2_2']) {
        charts['chart2_2'].data.labels = filteredMonths;
        const totalAfncMonth = indices.map(i => overlap.afnc_fake[i] + overlap.afnc_distorted[i] + overlap.afnc_true[i]);
        const maxAfnc = Math.max(...totalAfncMonth, 1);
        const maxAcsc = Math.max(...filteredCases, 1);
        const normAfnc = totalAfncMonth.map((v, i) => {
            const aNorm = v / maxAfnc;
            const cNorm = filteredCases[i] / maxAcsc;
            return Math.round((aNorm / (aNorm + cNorm || 1)) * 100);
        });
        const normAcsc = normAfnc.map(v => 100 - v);
        charts['chart2_2'].data.datasets[0].data = normAfnc;
        charts['chart2_2'].data.datasets[1].data = normAcsc;
        charts['chart2_2'].update();
    }

    // Chart 2.3 (Loss vs Volume)
    if (charts['chart2_3']) {
        const slice = (DATA.time_slices && DATA.time_slices[globalState.time]) || DATA.time_slices?.recent12;
        const scaleFactor = (slice && slice.acsc_cases > 0 ? slice.acsc_cases : 381390) / 381390;
        const baseCases = [34325, 289856, 15255, 30511, 11443];
        const baseLoss = [9.00, 1.71, 1.27, 3.84, 2.36];
        charts['chart2_3'].data.datasets[0].data = baseCases.map(c => Math.round((c * scaleFactor) / 1000));
        charts['chart2_3'].data.datasets[1].data = baseLoss.map(l => +(l * scaleFactor).toFixed(2));
        charts['chart2_3'].update();
    }

    // Refresh Tab 2 table
    tab2TableState.page = 1;
    updateTab2Table();
}

function updateTab3Filtered() {
    if (!DATA) return;

    // 1. Scatter Plot (Chart 3.4)
    if (charts['chart3_4_scatter']) {
        const aseanCountries = ['Thailand', 'Myanmar', 'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam', 'Cambodia'];
        charts['chart3_4_scatter'].data.datasets.forEach(ds => {
            if (globalState.geo === 'asean') {
                ds.pointRadius = ds.data.map(pt => aseanCountries.includes(pt.country) ? 12 : 4);
                ds.borderWidth = ds.data.map(pt => aseanCountries.includes(pt.country) ? 2.5 : 0.5);
            } else if (globalState.geo === 'thailand') {
                ds.pointRadius = ds.data.map(pt => pt.country === 'Thailand' ? 15 : 4);
                ds.borderWidth = ds.data.map(pt => pt.country === 'Thailand' ? 3.5 : 0.5);
            } else {
                ds.pointRadius = ds.data.map(() => 8);
                ds.borderWidth = ds.data.map(() => 1.5);
            }
        });
        charts['chart3_4_scatter'].update();
    }

    // 2. Chart 3.5A (Trend Year highlight)
    if (charts['chart3_5A'] && (globalState.time === '2026' || globalState.time === '2025' || globalState.time === '2024')) {
        const targetYear = parseInt(globalState.time, 10);
        const years = charts['chart3_5A'].data.labels;
        charts['chart3_5A'].data.datasets[0].pointRadius = years.map(y => y == targetYear ? 11 : 4);
        charts['chart3_5A'].data.datasets[1].pointRadius = years.map(y => y == targetYear ? 11 : 4);
        charts['chart3_5A'].update();
    } else if (charts['chart3_5A']) {
        charts['chart3_5A'].data.datasets[0].pointRadius = charts['chart3_5A'].data.labels.map(() => 5);
        charts['chart3_5A'].data.datasets[1].pointRadius = charts['chart3_5A'].data.labels.map(() => 5);
        charts['chart3_5A'].update();
    }

    // 3. Global Map 3.1
    renderGlobalMap('chart-3-1-world-map');

    // 4. Table 3.7
    tab3TableState.page = 1;
    updateTab3Table();
}

// ═══════════════════════════════════════════════════════════════
// TAB 1: VISUAL OVERVIEW & INTERACTIVE THREAT LANDSCAPE
// ═══════════════════════════════════════════════════════════════
function initTab1() {
    // 1. Chart 1.1: AI-Driven Fraud Impact & Conventional Scams (Donut Chart)
    const aiFraudCanvas = document.getElementById('chart-1-1-ai-fraud');
    if (aiFraudCanvas && DATA.acsc.ai_driven_fraud) {
        const aiData = DATA.acsc.ai_driven_fraud;
        charts['chart1_1'] = new Chart(aiFraudCanvas, {
            type: 'doughnut',
            data: {
                labels: [
                    `AI-Driven Fraud (฿${aiData.total_loss_ai_billion}B - ${aiData.total_loss_pct}%)`,
                    `Conventional Fraud (฿${aiData.conventional_loss_billion}B - ${aiData.conventional_loss_pct}%)`
                ],
                datasets: [{
                    data: [aiData.total_loss_ai_billion, aiData.conventional_loss_billion],
                    backgroundColor: ['#BB8FCE', '#85C1E9'],
                    hoverBackgroundColor: ['#8E44AD', '#2980B9'],
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '58%',
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const idx = elements[0].index;
                        const mode = idx === 0 ? 'ai' : 'conventional';
                        onChart1_1AiClick(mode);
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { size: 12, weight: 'bold' }, padding: 14 }
                    },
                    datalabels: {
                        display: true,
                        color: '#2C3E50',
                        font: { weight: 'bold', size: 11.5 },
                        formatter: (val, ctx) => {
                            const pct = ctx.dataIndex === 0 ? aiData.total_loss_pct : aiData.conventional_loss_pct;
                            return `฿${val}B\n(${pct}%)`;
                        }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: (ctx) => {
                                if (ctx.dataIndex === 0) {
                                    return [
                                        '── ยุทธวิธี AI ที่มิจฉาชีพใช้ ──',
                                        '• Deepfake Video: ฿1.45B (44.6%)',
                                        '• AI Voice Cloning: ฿0.98B (30.2%)',
                                        '• AI Trading Bots: ฿0.54B (16.6%)',
                                        '• Synthetic ID: ฿0.28B (8.6%)'
                                    ];
                                }
                                return 'คดีกลโกงทั่วไปที่ไม่ใช้เทคโนโลยีสังเคราะห์เสียง/ภาพ';
                            }
                        }
                    }
                }
            }
        });
    }

    // 2. Chart 1.2: Threat Category Breakdown
    const landscapeCanvas = document.getElementById('chart-1-2-landscape');
    if (landscapeCanvas && DATA.acsc.loss_grouped_comparison && DATA.afnc.top_categories) {
        const topScams = DATA.acsc.loss_grouped_comparison;
        const topAfnc = DATA.afnc.top_categories;

        const categories = [
            'หลอกซื้อขายสินค้า (ACSC)',
            'นโยบายรัฐ & สวัสดิการ (AFNC)',
            'ผลิตภัณฑ์สุขภาพ (AFNC)',
            'หลอกให้ลงทุน (ACSC)',
            'การเงิน & หุ้น (AFNC)',
            'งานพิเศษ/รับรางวัล (ACSC)',
            'ข่มขู่ทางโทรศัพท์ (ACSC)'
        ];

        const counts = [
            topScams.find(s => s.category.includes('สินค้า'))?.cases || 289856,
            topAfnc.find(a => a.category.includes('นโยบาย'))?.total || 6272,
            topAfnc.find(a => a.category.includes('สุขภาพ'))?.total || 3788,
            topScams.find(s => s.category.includes('ลงทุน'))?.cases || 34325,
            topAfnc.find(a => a.category.includes('การเงิน'))?.total || 2514,
            topScams.find(s => s.category.includes('รางวัล'))?.cases || 30511,
            topScams.find(s => s.category.includes('ข่มขู่'))?.cases || 15255
        ];

        const defaultColors = ['#85C1E9', '#E6B0AA', '#E6B0AA', '#F7DC6F', '#E6B0AA', '#F7DC6F', '#85C1E9'];

        charts['chart1_2'] = new Chart(landscapeCanvas, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'จำนวนรายการ / คดี',
                    data: counts,
                    backgroundColor: [...defaultColors],
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
                    datalabels: {
                        display: true,
                        anchor: 'end',
                        align: 'end',
                        color: '#2C3E50',
                        font: { size: 10.5, weight: 'bold' },
                        formatter: (val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val.toLocaleString()
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `จำนวน: ${ctx.raw.toLocaleString()} รายการ/คดี`
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

    // 3. Sparklines
    initSparklines();

    // 4. Chart 1.4 Mini Geographic Map (Default ASEAN Focus)
    renderMiniMap('chart-1-4-map', 'asean');
}

function initSparklines() {
    // Sparkline 1: AFNC Veracity
    const sAfnc = document.getElementById('spark-afnc');
    if (sAfnc && DATA.afnc) {
        sAfnc.style.cursor = 'pointer';
        charts['spark_1'] = new Chart(sAfnc, {
            type: 'bar',
            data: {
                labels: ['Fake 65.8%', 'True 24.2%', 'Distorted 9.9%'],
                datasets: [{
                    data: [DATA.afnc.fake_count, DATA.afnc.true_count, DATA.afnc.distorted_count],
                    backgroundColor: ['#E6B0AA', '#7DCEA0', '#F7DC6F'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const idx = elements[0].index;
                        onSparkline1Click(idx);
                    }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.raw.toLocaleString()} ข่าว`
                        }
                    }
                },
                scales: { x: { display: true, grid: { display: false } }, y: { display: false } }
            }
        });
    }

    // Sparkline 2: ACSC Loss Concentration
    const sAcsc = document.getElementById('spark-acsc');
    if (sAcsc && DATA.acsc.loss_grouped_comparison) {
        const groups = DATA.acsc.loss_grouped_comparison;
        sAcsc.style.cursor = 'pointer';
        charts['spark_2'] = new Chart(sAcsc, {
            type: 'bar',
            data: {
                labels: ['ลงทุน 49.5%', 'รางวัล 21.1%', 'สินค้า 9.4%', 'คอลเซ็นเตอร์ 7.0%'],
                datasets: [{
                    data: groups.slice(0, 4).map(g => g.loss_billion),
                    backgroundColor: ['#F7DC6F', '#F7DC6F', '#85C1E9', '#E6B0AA'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const idx = elements[0].index;
                        const scamMap = [
                            'หลอกให้ลงทุน (ACSC)',
                            'งานพิเศษ/รับรางวัล (ACSC)',
                            'หลอกซื้อขายสินค้า (ACSC)',
                            'ข่มขู่ทางโทรศัพท์ (ACSC)'
                        ];
                        onChart1_2CategoryClick(scamMap[idx]);
                    }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ฿${ctx.raw}B`
                        }
                    }
                },
                scales: { x: { display: true, grid: { display: false } }, y: { display: false } }
            }
        });
    }

    // Sparkline 3: AIID Intent
    const sAiid = document.getElementById('spark-aiid');
    if (sAiid && DATA.aiid.intents) {
        const intentCnt = DATA.aiid.intents;
        sAiid.style.cursor = 'pointer';
        charts['spark_3'] = new Chart(sAiid, {
            type: 'doughnut',
            data: {
                labels: ['เจตนา (49.8%)', 'ระบบผิดพลาด (50.2%)'],
                datasets: [{
                    data: [intentCnt['Intentional'] || 735, intentCnt['Unintentional'] || 740],
                    backgroundColor: ['#BB8FCE', '#85C1E9'],
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const idx = elements[0].index;
                        if (idx === 0) onChart1_1AiClick('ai');
                        else onChart1_1AiClick('conventional');
                    }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.raw.toLocaleString()} เหตุการณ์`
                        }
                    }
                }
            }
        });
    }

    // Sparkline 4: Freedom ASEAN Benchmark
    const sFreedom = document.getElementById('spark-freedom');
    if (sFreedom && DATA.freedom.asean_latest) {
        const asean = DATA.freedom.asean_latest;
        sFreedom.style.cursor = 'pointer';
        charts['spark_4'] = new Chart(sFreedom, {
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
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const idx = elements[0].index;
                        const c = asean[idx];
                        onSparkline4CountryClick(c.country, c.total_score, c.status);
                    }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${asean[ctx.dataIndex].country}: ${ctx.raw}/100 (${asean[ctx.dataIndex].status})`
                        }
                    }
                },
                scales: { x: { display: true, grid: { display: false } }, y: { display: false } }
            }
        });
    }
}

// ── Tab 1 Flexible Cross-Filtering ──
function onChart1_1AiClick(mode) {
    if (crossFilters.tab1AiMode === mode) {
        resetChart1_1Selection();
        return;
    }

    crossFilters.tab1AiMode = mode;
    const card1 = document.getElementById('card-chart-1-1');
    const resetBtn1 = document.getElementById('reset-1-1-btn');
    if (card1) card1.classList.add('is-active-filter');
    if (resetBtn1) resetBtn1.classList.add('visible');

    // Cross-filter Chart 1.2: Highlight categories affected by AI
    if (charts['chart1_2']) {
        const categories = charts['chart1_2'].data.labels;
        const aiHeavy = ['หลอกให้ลงทุน (ACSC)', 'ข่มขู่ทางโทรศัพท์ (ACSC)', 'การเงิน & หุ้น (AFNC)', 'งานพิเศษ/รับรางวัล (ACSC)'];

        charts['chart1_2'].data.datasets[0].backgroundColor = categories.map(cat => {
            if (mode === 'ai') {
                return aiHeavy.includes(cat) ? '#BB8FCE' : 'rgba(133, 193, 233, 0.2)';
            } else {
                return !aiHeavy.includes(cat) ? '#85C1E9' : 'rgba(187, 143, 206, 0.2)';
            }
        });
        charts['chart1_2'].update();
    }

    // Cross-filter Sparkline 2 (ACSC Top Scams)
    if (charts['spark_2']) {
        if (mode === 'ai') {
            charts['spark_2'].data.datasets[0].backgroundColor = ['#BB8FCE', 'rgba(247, 220, 111, 0.25)', 'rgba(133, 193, 233, 0.25)', '#BB8FCE'];
        } else {
            charts['spark_2'].data.datasets[0].backgroundColor = ['rgba(247, 220, 111, 0.25)', '#F7DC6F', '#85C1E9', 'rgba(230, 176, 170, 0.25)'];
        }
        charts['spark_2'].update();
    }

    // Cross-filter Sparkline 3 (AIID Intent)
    if (charts['spark_3']) {
        if (mode === 'ai') {
            charts['spark_3'].data.datasets[0].backgroundColor = ['#BB8FCE', 'rgba(133, 193, 233, 0.25)'];
        } else {
            charts['spark_3'].data.datasets[0].backgroundColor = ['rgba(187, 143, 206, 0.25)', '#85C1E9'];
        }
        charts['spark_3'].update();
    }
}

function resetChart1_1Selection() {
    crossFilters.tab1AiMode = null;
    const card1 = document.getElementById('card-chart-1-1');
    const resetBtn1 = document.getElementById('reset-1-1-btn');
    if (card1) card1.classList.remove('is-active-filter');
    if (resetBtn1) resetBtn1.classList.remove('visible');

    if (charts['chart1_2']) {
        const defaultColors = ['#85C1E9', '#E6B0AA', '#E6B0AA', '#F7DC6F', '#E6B0AA', '#F7DC6F', '#85C1E9'];
        charts['chart1_2'].data.datasets[0].backgroundColor = defaultColors;
        charts['chart1_2'].update();
    }

    if (charts['spark_2']) {
        charts['spark_2'].data.datasets[0].backgroundColor = ['#F7DC6F', '#F7DC6F', '#85C1E9', '#E6B0AA'];
        charts['spark_2'].update();
    }

    if (charts['spark_3']) {
        charts['spark_3'].data.datasets[0].backgroundColor = ['#BB8FCE', '#85C1E9'];
        charts['spark_3'].update();
    }
}

function onChart1_2CategoryClick(category) {
    if (crossFilters.tab1Category === category) {
        resetChart1_2Selection();
        return;
    }

    crossFilters.tab1Category = category;
    const card2 = document.getElementById('card-chart-1-2');
    const resetBtn2 = document.getElementById('reset-1-2-btn');
    if (card2) card2.classList.add('is-active-filter');
    if (resetBtn2) resetBtn2.classList.add('visible');

    // Highlight selected bar in Chart 1.2
    if (charts['chart1_2']) {
        const labels = charts['chart1_2'].data.labels;
        charts['chart1_2'].data.datasets[0].backgroundColor = labels.map(l =>
            l === category ? '#2563EB' : 'rgba(148, 163, 184, 0.25)'
        );
        charts['chart1_2'].update();
    }

    // Cross-update Chart 1.1 (Donut) with specific AI share for this category
    if (charts['chart1_1'] && DATA.acsc.category_ai_share) {
        const cleanCat = Object.keys(DATA.acsc.category_ai_share).find(k => category.includes(k));
        const info = cleanCat ? DATA.acsc.category_ai_share[cleanCat] : {
            ai_pct: 18.0, conv_pct: 82.0, ai_billion: 1.2, conv_billion: 5.5
        };

        charts['chart1_1'].data.labels = [
            `AI-Driven ในกลุ่มนี้ (฿${info.ai_billion}B - ${info.ai_pct}%)`,
            `Conventional ในกลุ่มนี้ (฿${info.conv_billion}B - ${info.conv_pct}%)`
        ];
        charts['chart1_1'].data.datasets[0].data = [info.ai_billion, info.conv_billion];
        charts['chart1_1'].update();

        const card1 = document.getElementById('card-chart-1-1');
        const resetBtn1 = document.getElementById('reset-1-1-btn');
        if (card1) card1.classList.add('is-active-filter');
        if (resetBtn1) resetBtn1.classList.add('visible');
    }

    // Cross-highlight Sparkline 2 if it's an ACSC scam
    if (charts['spark_2']) {
        const sLabels = ['ลงทุน', 'รางวัล', 'สินค้า', 'ข่มขู่'];
        charts['spark_2'].data.datasets[0].backgroundColor = sLabels.map(l =>
            category.includes(l) ? '#2563EB' : 'rgba(200, 200, 200, 0.3)'
        );
        charts['spark_2'].update();
    }
}

function resetChart1_2Selection() {
    crossFilters.tab1Category = null;
    const card2 = document.getElementById('card-chart-1-2');
    const resetBtn2 = document.getElementById('reset-1-2-btn');
    if (card2) card2.classList.remove('is-active-filter');
    if (resetBtn2) resetBtn2.classList.remove('visible');

    // Restore Chart 1.2
    if (charts['chart1_2']) {
        const defaultColors = ['#85C1E9', '#E6B0AA', '#E6B0AA', '#F7DC6F', '#E6B0AA', '#F7DC6F', '#85C1E9'];
        charts['chart1_2'].data.datasets[0].backgroundColor = defaultColors;
        charts['chart1_2'].update();
    }

    // Restore Chart 1.1 based on current filter state
    if (charts['chart1_1']) {
        updateTab1Filtered();
        const card1 = document.getElementById('card-chart-1-1');
        const resetBtn1 = document.getElementById('reset-1-1-btn');
        if (card1) card1.classList.remove('is-active-filter');
        if (resetBtn1) resetBtn1.classList.remove('visible');
    }

    // Restore Sparkline 2
    if (charts['spark_2']) {
        charts['spark_2'].data.datasets[0].backgroundColor = ['#F7DC6F', '#F7DC6F', '#85C1E9', '#E6B0AA'];
        charts['spark_2'].update();
    }
}

function onSparkline1Click(idx) {
    if (charts['chart1_2']) {
        const categories = charts['chart1_2'].data.labels;
        let targetCats = [];
        if (idx === 0) { // Fake
            targetCats = ['ผลิตภัณฑ์สุขภาพ (AFNC)', 'นโยบายรัฐ & สวัสดิการ (AFNC)', 'การเงิน & หุ้น (AFNC)'];
        } else if (idx === 1) { // True
            targetCats = ['นโยบายรัฐ & สวัสดิการ (AFNC)'];
        } else { // Distorted
            targetCats = ['การเงิน & หุ้น (AFNC)'];
        }

        charts['chart1_2'].data.datasets[0].backgroundColor = categories.map(cat =>
            targetCats.includes(cat) ? '#E6B0AA' : 'rgba(148, 163, 184, 0.25)'
        );
        charts['chart1_2'].update();

        const card2 = document.getElementById('card-chart-1-2');
        const resetBtn2 = document.getElementById('reset-1-2-btn');
        if (card2) card2.classList.add('is-active-filter');
        if (resetBtn2) resetBtn2.classList.add('visible');
    }
}

function onSparkline4CountryClick(countryName, score, status) {
    // Highlight in Sparkline 4
    if (charts['spark_4']) {
        const asean = DATA.freedom.asean_latest;
        charts['spark_4'].data.datasets[0].backgroundColor = asean.map(c =>
            c.country === countryName ? '#2563EB' : (c.country === 'Thailand' ? '#E6B0AA' : '#7DCEA0')
        );
        charts['spark_4'].update();
    }

    // Update Map 1.4 stat badge
    const badge = document.getElementById('map-stat-badge');
    if (badge) {
        badge.innerHTML = `<i class="fas fa-location-dot"></i> <strong>${countryName}</strong>: Freedom Score ${score}/100 (${status || 'Score'})`;
        badge.style.backgroundColor = '#EBF5FB';
        badge.style.color = '#2980B9';
        badge.style.borderColor = '#AED6F1';
    }
}

function onMapCountryClick(iso3) {
    if (!DATA || !DATA.freedom.countries_latest) return;
    const country = DATA.freedom.countries_latest.find(c => c.iso3 === iso3);
    if (!country) return;

    onSparkline4CountryClick(country.country, country.total_score, country.status);
}

// ── Map View Toggle Logic (Revision 2.2) ──
function toggleMapScope(scope) {
    crossFilters.mapScope = scope;
    const btnAsean = document.getElementById('btn-map-asean');
    const btnGlobal = document.getElementById('btn-map-global');
    const badge = document.getElementById('map-stat-badge');

    if (btnAsean && btnGlobal) {
        btnAsean.classList.toggle('active', scope === 'asean');
        btnGlobal.classList.toggle('active', scope === 'global');
    }

    if (badge) {
        badge.innerHTML = scope === 'asean'
            ? `<i class="fas fa-scale-balanced"></i> ค่าเฉลี่ยอาเซียน μ = 41.8 / 100`
            : `<i class="fas fa-globe"></i> ค่าเฉลี่ยโลก μ = 52.9 / 100`;
    }

    renderMiniMap('chart-1-4-map', scope);
}

function renderMiniMap(containerId, scope = 'asean') {
    const mapDiv = document.getElementById(containerId);
    if (!mapDiv || !window.Plotly || !DATA.freedom.countries_latest) return;

    let countries = DATA.freedom.countries_latest;
    if (scope === 'asean') {
        const aseanIso = ['THA', 'SGP', 'MYS', 'IDN', 'KHM', 'MMR', 'PHL', 'VNM'];
        countries = countries.filter(c => aseanIso.includes(c.iso3));
    }

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
            landcolor: '#F2F4F4',
            ...(scope === 'asean' ? {
                lonaxis: { range: [88, 142] },
                lataxis: { range: [-12, 28] }
            } : {})
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 0, r: 0, t: 0, b: 0 }
    };

    Plotly.newPlot(containerId, plotData, layout, { responsive: true, displayModeBar: false }).then(() => {
        if (mapDiv.removeAllListeners) {
            mapDiv.removeAllListeners('plotly_click');
        }
        mapDiv.on('plotly_click', (data) => {
            if (data && data.points && data.points.length > 0) {
                const iso3 = data.points[0].location;
                onMapCountryClick(iso3);
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// TAB 2: THAILAND THREAT LINKAGE, FINANCIAL IMPACT & DEMOGRAPHICS
// ═══════════════════════════════════════════════════════════════
function initTab2() {
    const overlap = DATA.overlap_link;

    // 1. Chart 2.1: Dual Panel Synchronized Time View (Click month to cross-filter Tab 2)
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
                        pointRadius: overlap.months.map(() => 4)
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
                plugins: { datalabels: { display: false } },
                scales: {
                    x: { display: false },
                    y: { title: { display: true, text: 'ข่าว AFNC (เรื่อง)' } }
                }
            }
        });
    }

    const acscPanelCanvas = document.getElementById('chart-2-1-acsc-panel');
    if (acscPanelCanvas && overlap) {
        charts['chart2_1_bottom'] = new Chart(acscPanelCanvas, {
            type: 'bar',
            data: {
                labels: overlap.months,
                datasets: [{
                    label: 'คดีหลอกลวงออนไลน์ (ACSC Cases)',
                    data: overlap.acsc_cases,
                    backgroundColor: overlap.months.map(() => '#85C1E9'),
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
                plugins: {
                    legend: { position: 'bottom' },
                    datalabels: {
                        display: true,
                        anchor: 'end',
                        align: 'top',
                        font: { size: 10, weight: 'bold' },
                        formatter: (val) => `${(val / 1000).toFixed(1)}k`
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { title: { display: true, text: 'คดี ACSC (คดี)' } }
                }
            }
        });
    }

    // 2. Chart 2.2: Normalized 100% Stacked Bar
    const compCanvas = document.getElementById('chart-2-2-composition');
    if (compCanvas && overlap) {
        const totalAfncMonth = overlap.months.map((m, i) => overlap.afnc_fake[i] + overlap.afnc_distorted[i] + overlap.afnc_true[i]);
        const maxAfnc = Math.max(...totalAfncMonth);
        const maxAcsc = Math.max(...overlap.acsc_cases);
        const normAfnc = totalAfncMonth.map((v, i) => {
            const aNorm = v / maxAfnc;
            const cNorm = overlap.acsc_cases[i] / maxAcsc;
            return Math.round((aNorm / (aNorm + cNorm)) * 100);
        });
        const normAcsc = normAfnc.map(v => 100 - v);

        charts['chart2_2'] = new Chart(compCanvas, {
            type: 'bar',
            data: {
                labels: overlap.months,
                datasets: [
                    { label: 'AFNC Volume Share (%)', data: normAfnc, backgroundColor: '#E6B0AA' },
                    { label: 'ACSC Volume Share (%)', data: normAcsc, backgroundColor: '#85C1E9' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, max: 100, ticks: { callback: v => `${v}%` } }
                }
            }
        });
    }

    // 3. Chart 2.3: Financial Loss vs Volume (Click to filter demographics & Table 2.4)
    const lossVolumeCanvas = document.getElementById('chart-2-3-loss-volume');
    if (lossVolumeCanvas && DATA.acsc.loss_grouped_comparison) {
        const groups = DATA.acsc.loss_grouped_comparison;
        charts['chart2_3'] = new Chart(lossVolumeCanvas, {
            type: 'bar',
            data: {
                labels: groups.map(g => g.category),
                datasets: [
                    {
                        label: 'จำนวนคดี (พันคดี)',
                        data: groups.map(g => Math.round(g.cases / 1000)),
                        backgroundColor: groups.map(() => '#85C1E9'),
                        yAxisID: 'yCases',
                        borderRadius: 4
                    },
                    {
                        label: 'มูลค่าความเสียหาย (พันล้านบาท)',
                        data: groups.map(g => g.loss_billion),
                        backgroundColor: groups.map(() => '#F7DC6F'),
                        yAxisID: 'yLoss',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const scamType = charts['chart2_3'].data.labels[elements[0].index];
                        onChart2_3ScamClick(scamType);
                    }
                },
                scales: {
                    yCases: {
                        type: 'linear',
                        position: 'left',
                        title: { display: true, text: 'จำนวนคดี (พันคดี)' }
                    },
                    yLoss: {
                        type: 'linear',
                        position: 'right',
                        title: { display: true, text: 'ความเสียหาย (พันล้านบาท)' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 4. Chart 2.4: Topic Matrix
    const matrixCanvas = document.getElementById('chart-2-4-topic-matrix');
    if (matrixCanvas) {
        charts['chart2_4'] = new Chart(matrixCanvas, {
            type: 'bar',
            data: {
                labels: ['หลอกซื้อขายสินค้า', 'หลอกให้ลงทุน', 'งานพิเศษ/รางวัล', 'ข่มขู่ทางโทรศัพท์', 'แอบอ้างบุคคลอื่น'],
                datasets: [
                    { label: 'นโยบายรัฐ & สวัสดิการ', data: [120, 45, 80, 30, 95], backgroundColor: '#E6B0AA' },
                    { label: 'สุขภาพ & เครื่องสำอาง', data: [85, 20, 15, 10, 40], backgroundColor: '#7DCEA0' },
                    { label: 'การเงิน & หุ้น', data: [40, 180, 90, 60, 50], backgroundColor: '#F7DC6F' },
                    { label: 'ภัยพิบัติ & สังคม', data: [35, 15, 10, 20, 25], backgroundColor: '#85C1E9' }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: { x: { stacked: true }, y: { stacked: true } }
            }
        });
    }

    // 5. Section 2.5: Demographics & Geographic Concentration Charts
    initDemographicsCharts();

    // 6. Table 2.4 initialization
    updateTab2Table();
}

function initDemographicsCharts() {
    if (!DATA.acsc.demographics) return;
    const demo = DATA.acsc.demographics;

    // Chart 2.5A: Victim Demographic Profile (Age Groups vs % Cases & Avg Loss)
    const ageCanvas = document.getElementById('chart-2-5A-age');
    if (ageCanvas) {
        charts['chart2_5A'] = new Chart(ageCanvas, {
            type: 'bar',
            data: {
                labels: demo.age_groups.map(a => a.age),
                datasets: [
                    {
                        label: 'สัดส่วนคดี (% of Cases)',
                        data: demo.age_groups.map(a => a.cases_pct),
                        backgroundColor: demo.age_groups.map(() => '#85C1E9'),
                        yAxisID: 'yPct',
                        borderRadius: 4
                    },
                    {
                        label: 'ความเสียหายเฉลี่ย (บาท/คดี)',
                        data: demo.age_groups.map(a => a.avg_loss_baht),
                        backgroundColor: demo.age_groups.map(() => '#E6B0AA'),
                        yAxisID: 'yLoss',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const age = charts['chart2_5A'].data.labels[elements[0].index];
                        onChart2_5AAgeClick(age);
                    }
                },
                plugins: {
                    datalabels: {
                        display: true,
                        font: { size: 10, weight: 'bold' },
                        formatter: (val, ctx) => ctx.datasetIndex === 0 ? `${val}%` : `฿${(val/1000).toFixed(0)}k`
                    }
                },
                scales: {
                    yPct: {
                        type: 'linear',
                        position: 'left',
                        title: { display: true, text: 'สัดส่วนคดี (%)' },
                        max: 50
                    },
                    yLoss: {
                        type: 'linear',
                        position: 'right',
                        title: { display: true, text: 'ความเสียหายเฉลี่ย (บาท/คดี)' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // Chart 2.5B: Geographic Concentration (Top Reported Provinces)
    const provCanvas = document.getElementById('chart-2-5B-provinces');
    if (provCanvas) {
        charts['chart2_5B'] = new Chart(provCanvas, {
            type: 'bar',
            data: {
                labels: demo.top_provinces.map(p => p.province),
                datasets: [{
                    label: 'สัดส่วนคดีสะสม (%)',
                    data: demo.top_provinces.map(p => p.cases_share),
                    backgroundColor: ['#BB8FCE', '#85C1E9', '#85C1E9', '#F7DC6F', '#7DCEA0', '#BDC3C7'],
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        display: true,
                        anchor: 'end',
                        align: 'end',
                        font: { size: 10.5, weight: 'bold' },
                        formatter: (val) => `${val}%`
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'สัดส่วนคดี (%)' },
                        max: 35
                    }
                }
            }
        });
    }
}

// ── Tab 2 Flexible Cross-Filtering ──
function onChart2MonthClick(month) {
    if (crossFilters.tab2Month === month) {
        resetChart2Selection();
        return;
    }

    crossFilters.tab2Month = month;
    const card2_1 = document.getElementById('card-chart-2-1');
    const resetBtn = document.getElementById('reset-2-1-btn');
    if (card2_1) card2_1.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    // Highlight selected month in Chart 2.1 bottom
    if (charts['chart2_1_bottom']) {
        const months = charts['chart2_1_bottom'].data.labels;
        charts['chart2_1_bottom'].data.datasets[0].backgroundColor = months.map(m =>
            m === month ? '#2563EB' : 'rgba(133, 193, 233, 0.25)'
        );
        charts['chart2_1_bottom'].update();
    }

    // Filter Table 2.4 to selected month
    tab2TableState.page = 1;
    updateTab2Table();
}

function resetChart2Selection() {
    crossFilters.tab2Month = null;
    const card2_1 = document.getElementById('card-chart-2-1');
    const resetBtn = document.getElementById('reset-2-1-btn');
    if (card2_1) card2_1.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');

    if (charts['chart2_1_bottom']) {
        const months = charts['chart2_1_bottom'].data.labels;
        charts['chart2_1_bottom'].data.datasets[0].backgroundColor = months.map(() => '#85C1E9');
        charts['chart2_1_bottom'].update();
    }

    tab2TableState.page = 1;
    updateTab2Table();
}

function onChart2_3ScamClick(scamType) {
    if (crossFilters.tab2ScamType === scamType) {
        resetChart2_3Selection();
        return;
    }

    crossFilters.tab2ScamType = scamType;
    const card2_3 = document.getElementById('card-chart-2-3');
    const resetBtn = document.getElementById('reset-2-3-btn');
    if (card2_3) card2_3.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    // Highlight clicked bar in Chart 2.3
    if (charts['chart2_3']) {
        const labels = charts['chart2_3'].data.labels;
        charts['chart2_3'].data.datasets[0].backgroundColor = labels.map(l => l === scamType ? '#2563EB' : 'rgba(133, 193, 233, 0.25)');
        charts['chart2_3'].data.datasets[1].backgroundColor = labels.map(l => l === scamType ? '#D4AC0D' : 'rgba(247, 220, 111, 0.25)');
        charts['chart2_3'].update();
    }

    // Update Demographic Profile 2.5A with this scam's age breakdown
    if (charts['chart2_5A'] && DATA.acsc.scam_demographics_map) {
        const cleanScam = Object.keys(DATA.acsc.scam_demographics_map).find(k => scamType.includes(k));
        if (cleanScam) {
            const specificDemo = DATA.acsc.scam_demographics_map[cleanScam];
            charts['chart2_5A'].data.datasets[0].data = specificDemo.map(d => d.cases_pct);
            charts['chart2_5A'].data.datasets[1].data = specificDemo.map(d => d.avg_loss_baht);
            charts['chart2_5A'].update();

            const card2_5A = document.getElementById('card-chart-2-5A');
            const resetBtn2_5A = document.getElementById('reset-2-5A-btn');
            if (card2_5A) card2_5A.classList.add('is-active-filter');
            if (resetBtn2_5A) resetBtn2_5A.classList.add('visible');
        }
    }

    // Filter Table 2.4
    tab2TableState.page = 1;
    updateTab2Table();
}

function resetChart2_3Selection() {
    crossFilters.tab2ScamType = null;
    const card2_3 = document.getElementById('card-chart-2-3');
    const resetBtn = document.getElementById('reset-2-3-btn');
    if (card2_3) card2_3.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');

    if (charts['chart2_3']) {
        const labels = charts['chart2_3'].data.labels;
        charts['chart2_3'].data.datasets[0].backgroundColor = labels.map(() => '#85C1E9');
        charts['chart2_3'].data.datasets[1].backgroundColor = labels.map(() => '#F7DC6F');
        charts['chart2_3'].update();
    }

    resetChart2_5ASelection();
    tab2TableState.page = 1;
    updateTab2Table();
}

function onChart2_5AAgeClick(ageGroup) {
    if (crossFilters.tab2AgeGroup === ageGroup) {
        resetChart2_5ASelection();
        return;
    }

    crossFilters.tab2AgeGroup = ageGroup;
    const card2_5A = document.getElementById('card-chart-2-5A');
    const resetBtn = document.getElementById('reset-2-5A-btn');
    if (card2_5A) card2_5A.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    // Highlight clicked bar in 2.5A
    if (charts['chart2_5A']) {
        const labels = charts['chart2_5A'].data.labels;
        charts['chart2_5A'].data.datasets[0].backgroundColor = labels.map(l => l === ageGroup ? '#2563EB' : 'rgba(133, 193, 233, 0.25)');
        charts['chart2_5A'].data.datasets[1].backgroundColor = labels.map(l => l === ageGroup ? '#C0392B' : 'rgba(230, 176, 170, 0.25)');
        charts['chart2_5A'].update();
    }

    // Highlight dominant scams for this age group in Chart 2.3
    if (charts['chart2_3']) {
        const scamLabels = charts['chart2_3'].data.labels;
        let dominantScams = [];
        if (ageGroup.includes('55') || ageGroup.includes('45')) {
            dominantScams = ['หลอกให้ลงทุน', 'ข่มขู่ทางโทรศัพท์'];
        } else if (ageGroup.includes('15') || ageGroup.includes('25')) {
            dominantScams = ['หลอกซื้อขายสินค้า', 'หลอกโอนเงินรับรางวัล'];
        } else {
            dominantScams = ['หลอกให้ลงทุน', 'หลอกโอนเงินรับรางวัล'];
        }

        charts['chart2_3'].data.datasets[0].backgroundColor = scamLabels.map(l =>
            dominantScams.some(d => l.includes(d)) ? '#2563EB' : 'rgba(133, 193, 233, 0.25)'
        );
        charts['chart2_3'].data.datasets[1].backgroundColor = scamLabels.map(l =>
            dominantScams.some(d => l.includes(d)) ? '#D4AC0D' : 'rgba(247, 220, 111, 0.25)'
        );
        charts['chart2_3'].update();
    }
}

function resetChart2_5ASelection() {
    crossFilters.tab2AgeGroup = null;
    const card2_5A = document.getElementById('card-chart-2-5A');
    const resetBtn = document.getElementById('reset-2-5A-btn');
    if (card2_5A) card2_5A.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');

    if (charts['chart2_5A'] && DATA.acsc.demographics) {
        const demo = DATA.acsc.demographics;
        charts['chart2_5A'].data.datasets[0].data = demo.age_groups.map(a => a.cases_pct);
        charts['chart2_5A'].data.datasets[1].data = demo.age_groups.map(a => a.avg_loss_baht);
        charts['chart2_5A'].data.datasets[0].backgroundColor = demo.age_groups.map(() => '#85C1E9');
        charts['chart2_5A'].data.datasets[1].backgroundColor = demo.age_groups.map(() => '#E6B0AA');
        charts['chart2_5A'].update();
    }
}

function switchTab2Panel(panel) {
    const btnBoth = document.getElementById('btn-panel-both');
    const btnAfnc = document.getElementById('btn-panel-afnc');
    const btnAcsc = document.getElementById('btn-panel-acsc');
    const panelAfnc = document.getElementById('chart-2-1-afnc-panel')?.closest('.panel-row');
    const panelAcsc = document.getElementById('chart-2-1-acsc-panel')?.closest('.panel-row');

    if (btnBoth) btnBoth.classList.toggle('active', panel === 'both');
    if (btnAfnc) btnAfnc.classList.toggle('active', panel === 'afnc');
    if (btnAcsc) btnAcsc.classList.toggle('active', panel === 'acsc');

    if (panelAfnc) panelAfnc.style.display = (panel === 'both' || panel === 'afnc') ? 'block' : 'none';
    if (panelAcsc) panelAcsc.style.display = (panel === 'both' || panel === 'acsc') ? 'block' : 'none';

    setTimeout(() => {
        if (charts['chart2_1_top']) charts['chart2_1_top'].resize();
        if (charts['chart2_1_bottom']) charts['chart2_1_bottom'].resize();
    }, 80);
}

function updateTab2Table() {
    const tbody = document.getElementById('tab2-table-body');
    const info = document.getElementById('tab2-page-info');
    const prevBtn = document.getElementById('tab2-prev-btn');
    const nextBtn = document.getElementById('tab2-next-btn');
    if (!tbody || !DATA || !DATA.acsc || !DATA.acsc.weekly_records) return;

    let records = DATA.acsc.weekly_records;

    // 1. Time Horizon Filter
    if (globalState.time === '2026') {
        records = records.filter(r => r.week_start.startsWith('2026'));
    } else if (globalState.time === '2025') {
        records = records.filter(r => r.week_start.startsWith('2025'));
    } else if (globalState.time === '2024' || globalState.time === '2020-2024') {
        records = [];
    }

    // 2. Data Quality Filter
    if (globalState.quality === 'validated') {
        records = records.filter(r => r.is_validated === true || r.flag === 'validated' || r.flag === 'exact');
    }

    // 3. Month Cross-Filter
    if (crossFilters.tab2Month) {
        records = records.filter(r => r.week_start.startsWith(crossFilters.tab2Month));
    }

    // 4. Scam Type Cross-Filter
    if (crossFilters.tab2ScamType) {
        const cleanScam = crossFilters.tab2ScamType.split(' ')[0].replace(/[()]/g, '');
        records = records.filter(r =>
            (r.top_type && r.top_type.includes(cleanScam)) ||
            (r.highest_loss_type && r.highest_loss_type.includes(cleanScam))
        );
    }

    // 5. Search text
    const filtered = records.filter(r => {
        if (!tab2TableState.search) return true;
        const str = `${r.week_start} ${r.week_end} ${r.top_type} ${r.highest_loss_type}`.toLowerCase();
        return str.includes(tab2TableState.search);
    });

    const maxLoss = records.length > 0 ? Math.max(...records.map(r => r.loss_baht), 1) : 1;
    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / tab2TableState.pageSize));
    if (tab2TableState.page > maxPage) tab2TableState.page = maxPage;
    if (tab2TableState.page < 1) tab2TableState.page = 1;

    const start = (tab2TableState.page - 1) * tab2TableState.pageSize;
    const pageItems = filtered.slice(start, start + tab2TableState.pageSize);

    if (total === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding: 24px; color: var(--text-secondary);">
                    <i class="fas fa-filter" style="margin-right: 6px;"></i> ไม่พบข้อมูลตามตัวกรองที่เลือก (ระบบรายงาน ACSC เริ่มบันทึก พ.ย. 2568)
                </td>
            </tr>
        `;
    } else {
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
    }

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
// TAB 3: GLOBAL GOVERNANCE, FREEDOM BENCHMARK & AI RISK ECOSYSTEM
// ═══════════════════════════════════════════════════════════════
function initTab3() {
    // 1. Chart 3.1: World Choropleth Map
    renderGlobalMap('chart-3-1-world-map');

    // 2. Chart 3.2: Thailand vs ASEAN Freedom Scores
    const aseanCanvas = document.getElementById('chart-3-2-asean-bar');
    if (aseanCanvas && DATA.freedom.asean_latest) {
        const asean = DATA.freedom.asean_latest;
        charts['chart3_2'] = new Chart(aseanCanvas, {
            type: 'bar',
            data: {
                labels: asean.map(c => c.country),
                datasets: [{
                    label: 'Freedom on the Net Score (2024)',
                    data: asean.map(c => c.total_score),
                    backgroundColor: asean.map(c => c.country === 'Thailand' ? '#E6B0AA' : '#7DCEA0'),
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
                    datalabels: {
                        display: true,
                        anchor: 'end',
                        align: 'end',
                        font: { size: 10.5, weight: 'bold' },
                        formatter: (val) => `${val}/100`
                    }
                },
                scales: {
                    x: { max: 100, title: { display: true, text: 'คะแนนเสรีภาพ (เต็ม 100)' } }
                }
            }
        });
    }

    // 3. Chart 3.3: Freedom Component Breakdown (3 Dimensions)
    const compCanvas = document.getElementById('chart-3-3-th-components');
    if (compCanvas && DATA.freedom.thailand_history) {
        const history = DATA.freedom.thailand_history;
        charts['chart3_3'] = new Chart(compCanvas, {
            type: 'line',
            data: {
                labels: history.map(h => h.year),
                datasets: [
                    {
                        label: '1. อุปสรรคการเข้าถึง (Access /25)',
                        data: history.map(h => h.obstacles),
                        borderColor: '#85C1E9',
                        tension: 0.2,
                        pointRadius: 4
                    },
                    {
                        label: '2. การจำกัดเนื้อหา (Content /35)',
                        data: history.map(h => h.limits),
                        borderColor: '#BB8FCE',
                        tension: 0.2,
                        pointRadius: 4
                    },
                    {
                        label: '3. การละเมิดสิทธิผู้ใช้ (Rights /40)',
                        data: history.map(h => h.rights),
                        borderColor: '#E6B0AA',
                        tension: 0.2,
                        pointRadius: 4
                    },
                    {
                        label: 'คะแนนรวม (Total /100)',
                        data: history.map(h => h.total_score),
                        borderColor: '#2C3E50',
                        borderDash: [5, 5],
                        tension: 0.2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { min: 0, max: 100 } }
            }
        });
    }

    // 4. Chart 3.4: Freedom vs Threats Scatter Analysis (Revision 1.3)
    initFreedomThreatScatter();

    // 5. Chart 3.5A: AI Incidents by Year & Intent
    const intentCanvas = document.getElementById('chart-3-4-ai-intent-line');
    if (intentCanvas && DATA.aiid.intent_by_year) {
        const iby = DATA.aiid.intent_by_year;
        charts['chart3_5A'] = new Chart(intentCanvas, {
            type: 'line',
            data: {
                labels: iby.years,
                datasets: [
                    {
                        label: 'จงใจใช้ AI โจมตี (Intentional)',
                        data: iby.intentional,
                        borderColor: '#BB8FCE',
                        backgroundColor: 'rgba(187, 143, 206, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5
                    },
                    {
                        label: 'ระบบผิดพลาด/อุบัติเหตุ (Unintentional)',
                        data: iby.unintentional,
                        borderColor: '#85C1E9',
                        backgroundColor: 'rgba(133, 193, 233, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const year = iby.years[elements[0].index];
                        onChart3_5YearClick(year);
                    }
                }
            }
        });
    }

    // 6. Chart 3.5B: Top AI Risk Domains Ranking
    const domainsCanvas = document.getElementById('chart-3-4-ai-domains-bar');
    if (domainsCanvas && DATA.aiid.risk_domains) {
        const sortedDomains = Object.entries(DATA.aiid.risk_domains)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        charts['chart3_5B'] = new Chart(domainsCanvas, {
            type: 'bar',
            data: {
                labels: sortedDomains.map(d => d[0]),
                datasets: [{
                    label: 'จำนวนเหตุการณ์',
                    data: sortedDomains.map(d => d[1]),
                    backgroundColor: sortedDomains.map(() => '#BB8FCE'),
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (elements && elements.length > 0) {
                        const domain = charts['chart3_5B'].data.labels[elements[0].index];
                        onChart3_5BDomainClick(domain);
                    }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        display: true,
                        anchor: 'end',
                        align: 'end',
                        font: { size: 10, weight: 'bold' }
                    }
                }
            }
        });
    }

    // 7. Heatmap Matrix 3.6
    renderTab3Heatmap();

    // 8. Incident Table 3.7
    updateTab3Table();
}

function initFreedomThreatScatter() {
    const scatterCanvas = document.getElementById('chart-3-4-freedom-threat-scatter');
    if (!scatterCanvas || !DATA.freedom.freedom_vs_threats) return;

    const dataList = DATA.freedom.freedom_vs_threats;
    const notFree = dataList.filter(d => d.status === 'Not Free');
    const partlyFree = dataList.filter(d => d.status === 'Partly Free');
    const free = dataList.filter(d => d.status === 'Free');

    charts['chart3_4_scatter'] = new Chart(scatterCanvas, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'กลุ่ม Not Free (เสรีภาพต่ำ: 0–39)',
                    data: notFree.map(d => ({ x: d.freedom_score, y: d.threat_index, country: d.country, note: d.note })),
                    backgroundColor: '#E6B0AA',
                    borderColor: '#C0392B',
                    borderWidth: 1.5,
                    pointRadius: 8,
                    pointHoverRadius: 12
                },
                {
                    label: 'กลุ่ม Partly Free (เสรีภาพปานกลาง: 40–69)',
                    data: partlyFree.map(d => ({ x: d.freedom_score, y: d.threat_index, country: d.country, note: d.note })),
                    backgroundColor: '#F7DC6F',
                    borderColor: '#D4AC0D',
                    borderWidth: 1.5,
                    pointRadius: 8,
                    pointHoverRadius: 12
                },
                {
                    label: 'กลุ่ม Free (เสรีภาพสูง: 70–100)',
                    data: free.map(d => ({ x: d.freedom_score, y: d.threat_index, country: d.country, note: d.note })),
                    backgroundColor: '#7DCEA0',
                    borderColor: '#27AE60',
                    borderWidth: 1.5,
                    pointRadius: 8,
                    pointHoverRadius: 12
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (evt, elements) => {
                if (elements && elements.length > 0) {
                    const el = elements[0];
                    const pt = charts['chart3_4_scatter'].data.datasets[el.datasetIndex].data[el.index];
                    onCountrySelect(pt.country);
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 12, weight: 'bold' } }
                },
                datalabels: {
                    display: (ctx) => {
                        const pt = ctx.dataset.data[ctx.dataIndex];
                        return ['Thailand', 'Myanmar', 'Singapore', 'Estonia', 'China', 'United States'].includes(pt.country);
                    },
                    align: 'top',
                    font: { size: 10.5, weight: 'bold' },
                    color: '#2C3E50',
                    formatter: (pt) => pt.country
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const pt = ctx.raw;
                            return `📍 ${pt.country} — Freedom: ${pt.x}/100 | Threat Index: ${pt.y}/100`;
                        },
                        afterLabel: (ctx) => `บริบท: ${ctx.raw.note}`
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: '← ควบคุมเข้มงวด (Not Free)       คะแนนเสรีภาพอินเทอร์เน็ต (Freedom Score)       เสรีภาพสูง (Free) →',
                        font: { size: 11, weight: 'bold' }
                    }
                },
                y: {
                    min: 0,
                    max: 105,
                    title: {
                        display: true,
                        text: 'ดัชนีภัยคุกคามไซเบอร์ & Scam Hubs (Threat Severity Index)',
                        font: { size: 11, weight: 'bold' }
                    }
                }
            }
        }
    });
}

// ── Tab 3 Flexible Cross-Filtering ──
function onCountrySelect(countryName) {
    if (crossFilters.tab3Country === countryName) {
        resetChart3_4Selection();
        return;
    }

    crossFilters.tab3Country = countryName;
    const card3_4 = document.getElementById('card-chart-3-4');
    const resetBtn = document.getElementById('reset-3-4-btn');
    if (card3_4) card3_4.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    // Highlight country in Scatter Plot
    if (charts['chart3_4_scatter']) {
        charts['chart3_4_scatter'].data.datasets.forEach(ds => {
            ds.pointRadius = ds.data.map(pt => pt.country === countryName ? 14 : 5);
        });
        charts['chart3_4_scatter'].update();
    }

    // Highlight in Chart 3.2 (ASEAN bar)
    if (charts['chart3_2']) {
        const labels = charts['chart3_2'].data.labels;
        charts['chart3_2'].data.datasets[0].backgroundColor = labels.map(l =>
            l === countryName ? '#2563EB' : 'rgba(125, 206, 160, 0.25)'
        );
        charts['chart3_2'].update();
    }

    // Update detail banner
    const country = DATA.freedom.countries_latest.find(c => c.country === countryName);
    if (country) {
        const nameEl = document.getElementById('country-detail-name');
        const accEl = document.getElementById('country-detail-access');
        const limEl = document.getElementById('country-detail-content');
        const rigEl = document.getElementById('country-detail-rights');

        if (nameEl) nameEl.textContent = `${country.country} (${country.iso3}) — Total: ${country.total_score}/100`;
        if (accEl) accEl.textContent = `${country.obstacles} / 25`;
        if (limEl) limEl.textContent = `${country.limits} / 35`;
        if (rigEl) rigEl.textContent = `${country.rights} / 40 (${country.status})`;
    }

    // Search table 3.7
    tab3TableState.search = countryName.toLowerCase();
    const searchInput = document.getElementById('tab3-search');
    if (searchInput) searchInput.value = countryName;
    tab3TableState.page = 1;
    updateTab3Table();
}

function resetChart3_4Selection() {
    crossFilters.tab3Country = 'Thailand';
    const card3_4 = document.getElementById('card-chart-3-4');
    const resetBtn = document.getElementById('reset-3-4-btn');
    if (card3_4) card3_4.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');

    if (charts['chart3_4_scatter']) {
        charts['chart3_4_scatter'].data.datasets.forEach(ds => {
            ds.pointRadius = ds.data.map(() => 8);
        });
        charts['chart3_4_scatter'].update();
    }

    if (charts['chart3_2'] && DATA.freedom.asean_latest) {
        const asean = DATA.freedom.asean_latest;
        charts['chart3_2'].data.datasets[0].backgroundColor = asean.map(c =>
            c.country === 'Thailand' ? '#E6B0AA' : '#7DCEA0'
        );
        charts['chart3_2'].update();
    }

    tab3TableState.search = '';
    const searchInput = document.getElementById('tab3-search');
    if (searchInput) searchInput.value = '';
    tab3TableState.page = 1;
    updateTab3Table();
}

function onChart3_5YearClick(year) {
    if (crossFilters.tab3Year === year) {
        resetChart3_5Selection();
        return;
    }

    crossFilters.tab3Year = year;
    const card3_5 = document.getElementById('card-chart-3-5');
    const resetBtn = document.getElementById('reset-3-5-btn');
    if (card3_5) card3_5.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    // Highlight clicked year in Chart 3.5A
    if (charts['chart3_5A']) {
        const years = charts['chart3_5A'].data.labels;
        const yIdx = years.indexOf(year);
        charts['chart3_5A'].data.datasets[0].pointRadius = years.map((y, i) => i === yIdx ? 11 : 4);
        charts['chart3_5A'].data.datasets[1].pointRadius = years.map((y, i) => i === yIdx ? 11 : 4);
        charts['chart3_5A'].update();
    }

    // Filter Chart 3.5B (Domains) for that year
    if (charts['chart3_5B'] && DATA.aiid.domains_by_year && DATA.aiid.domains_by_year[String(year)]) {
        const yearDomains = Object.entries(DATA.aiid.domains_by_year[String(year)])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);
        charts['chart3_5B'].data.labels = yearDomains.map(d => d[0]);
        charts['chart3_5B'].data.datasets[0].data = yearDomains.map(d => d[1]);
        charts['chart3_5B'].update();

        const card3_5B = document.getElementById('card-chart-3-5B');
        const resetBtn3_5B = document.getElementById('reset-3-5B-btn');
        if (card3_5B) card3_5B.classList.add('is-active-filter');
        if (resetBtn3_5B) resetBtn3_5B.classList.add('visible');
    }

    // Filter Table 3.7
    tab3TableState.page = 1;
    updateTab3Table();
}

function resetChart3_5Selection() {
    crossFilters.tab3Year = null;
    const card3_5 = document.getElementById('card-chart-3-5');
    const resetBtn = document.getElementById('reset-3-5-btn');
    if (card3_5) card3_5.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');

    if (charts['chart3_5A']) {
        const years = charts['chart3_5A'].data.labels;
        charts['chart3_5A'].data.datasets[0].pointRadius = years.map(() => 5);
        charts['chart3_5A'].data.datasets[1].pointRadius = years.map(() => 5);
        charts['chart3_5A'].update();
    }

    // Restore Chart 3.5B (all years)
    if (charts['chart3_5B'] && DATA.aiid.risk_domains) {
        const sortedDomains = Object.entries(DATA.aiid.risk_domains)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);
        charts['chart3_5B'].data.labels = sortedDomains.map(d => d[0]);
        charts['chart3_5B'].data.datasets[0].data = sortedDomains.map(d => d[1]);
        charts['chart3_5B'].data.datasets[0].backgroundColor = sortedDomains.map(() => '#BB8FCE');
        charts['chart3_5B'].update();

        const card3_5B = document.getElementById('card-chart-3-5B');
        const resetBtn3_5B = document.getElementById('reset-3-5B-btn');
        if (card3_5B) card3_5B.classList.remove('is-active-filter');
        if (resetBtn3_5B) resetBtn3_5B.classList.remove('visible');
    }

    tab3TableState.page = 1;
    updateTab3Table();
}

function onChart3_5BDomainClick(domainName) {
    if (crossFilters.tab3Domain === domainName) {
        resetChart3_5BSelection();
        return;
    }

    crossFilters.tab3Domain = domainName;
    const card3_5B = document.getElementById('card-chart-3-5B');
    const resetBtn = document.getElementById('reset-3-5B-btn');
    if (card3_5B) card3_5B.classList.add('is-active-filter');
    if (resetBtn) resetBtn.classList.add('visible');

    if (charts['chart3_5B']) {
        const labels = charts['chart3_5B'].data.labels;
        charts['chart3_5B'].data.datasets[0].backgroundColor = labels.map(l =>
            l === domainName ? '#2563EB' : 'rgba(187, 143, 206, 0.25)'
        );
        charts['chart3_5B'].update();
    }

    // Filter Table 3.7
    tab3TableState.page = 1;
    updateTab3Table();
}

function resetChart3_5BSelection() {
    crossFilters.tab3Domain = null;
    const card3_5B = document.getElementById('card-chart-3-5B');
    const resetBtn = document.getElementById('reset-3-5B-btn');
    if (card3_5B) card3_5B.classList.remove('is-active-filter');
    if (resetBtn) resetBtn.classList.remove('visible');

    if (charts['chart3_5B']) {
        const count = charts['chart3_5B'].data.labels.length;
        charts['chart3_5B'].data.datasets[0].backgroundColor = Array(count).fill('#BB8FCE');
        charts['chart3_5B'].update();
    }

    tab3TableState.page = 1;
    updateTab3Table();
}

function renderGlobalMap(containerId) {
    const mapDiv = document.getElementById(containerId);
    if (!mapDiv || !window.Plotly || !DATA.freedom.countries_latest) return;

    const countries = DATA.freedom.countries_latest;
    const locations = countries.map(c => c.iso3);
    const z = countries.map(c => c.total_score);
    const text = countries.map(c => `<b>${c.country}</b><br>Score: ${c.total_score}/100<br>Status: ${c.status}`);

    const isAsean = globalState.geo === 'asean' || globalState.geo === 'thailand';

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
            thickness: 14,
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
            landcolor: '#F2F4F4',
            ...(isAsean ? {
                lonaxis: { range: [85, 145] },
                lataxis: { range: [-15, 30] }
            } : {})
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 0, r: 0, t: 0, b: 0 }
    };

    Plotly.newPlot(containerId, plotData, layout, { responsive: true, displayModeBar: false }).then(() => {
        if (mapDiv.removeAllListeners) {
            mapDiv.removeAllListeners('plotly_click');
        }
        mapDiv.on('plotly_click', (data) => {
            if (data && data.points && data.points.length > 0) {
                const iso3 = data.points[0].location;
                const c = DATA.freedom.countries_latest.find(x => x.iso3 === iso3);
                if (c) onCountrySelect(c.country);
            }
        });
    });
}

function renderTab3Heatmap() {
    const table = document.getElementById('tab3-heatmap-table');
    if (!table || !DATA.aiid.risk_x_intent) return;

    const matrix = DATA.aiid.risk_x_intent;
    const domains = Object.keys(matrix);
    const intents = ['Intentional', 'Unintentional', 'Unspecified'];

    let maxVal = 0;
    domains.forEach(d => {
        intents.forEach(it => {
            const v = (matrix[d] && matrix[d][it]) || 0;
            if (v > maxVal) maxVal = v;
        });
    });

    let html = `
        <thead>
            <tr>
                <th style="min-width: 220px;">Risk Domain / AI Threat Area</th>
                <th style="text-align: center;">เจตนาโจมตี (Intentional)</th>
                <th style="text-align: center;">ข้อผิดพลาดระบบ (Unintentional)</th>
                <th style="text-align: center;">ไม่ระบุชัดเจน (Other)</th>
            </tr>
        </thead>
        <tbody>
    `;

    domains.forEach(d => {
        html += `<tr><td><strong>${d}</strong></td>`;
        intents.forEach(it => {
            const val = (matrix[d] && matrix[d][it]) || 0;
            const alpha = maxVal > 0 ? (val / maxVal).toFixed(2) : 0;
            const bg = `rgba(187, 143, 206, ${Math.max(0.08, alpha)})`;
            const textColor = alpha > 0.55 ? '#FFFFFF' : '#2C3E50';

            html += `
                <td class="heatmap-cell"
                    style="background: ${bg}; color: ${textColor};"
                    onclick="openCaseModal('${encodeURIComponent(d)}', '${encodeURIComponent(it)}')">
                    ${val.toLocaleString()}
                </td>
            `;
        });
        html += `</tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;
}

function openCaseModal(encodedDomain, encodedIntent) {
    const domain = decodeURIComponent(encodedDomain);
    const intent = decodeURIComponent(encodedIntent);
    const modal = document.getElementById('caseStudyModal');
    const title = document.getElementById('modalTitle');
    const container = document.getElementById('modalContent');

    if (!modal || !DATA.aiid.case_studies_matrix) return;

    const key = `${domain}___${intent}`;
    const cases = DATA.aiid.case_studies_matrix[key] || [];

    if (title) {
        title.innerHTML = `<i class="fas fa-folder-open" style="color: var(--pastel-lavender-dark);"></i> ตัวอย่างเหตุการณ์จริง: <strong>${domain}</strong> (${intent})`;
    }

    if (container) {
        if (cases.length === 0) {
            container.innerHTML = `<p style="color: var(--text-secondary); padding: 20px; text-align: center;">ไม่พบตัวอย่างเคสที่มีบันทึกรายละเอียดสำหรับจุดตัดนี้</p>`;
        } else {
            container.innerHTML = cases.map(c => `
                <div class="case-card">
                    <div class="case-card-title">
                        <strong>#${c.id}: ${c.title}</strong>
                        <span class="badge-tag">${c.year}</span>
                        ${c.is_deepfake ? '<span class="tag-pill tag-deepfake">Deepfake/Clone</span>' : ''}
                    </div>
                    <div style="font-size: 11.5px; color: var(--text-secondary); margin-bottom: 6px;">
                        <span>ผู้พัฒนา/ใช้งาน: <strong>${c.deployer}</strong></span> |
                        <span>ระบบที่เกี่ยวข้อง: <strong>${c.implicated}</strong></span>
                    </div>
                    <p style="font-size: 12px; line-height: 1.5; color: var(--text-primary); margin: 0;">${c.description}...</p>
                </div>
            `).join('');
        }
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
    if (!tbody || !DATA || !DATA.aiid || !DATA.aiid.incidents) return;

    let incidents = DATA.aiid.incidents;

    // 1. Time Horizon Filter
    if (globalState.time === '2026' || globalState.time === '2025' || globalState.time === '2024') {
        const yr = parseInt(globalState.time, 10);
        incidents = incidents.filter(i => i.year == yr);
    } else if (globalState.time === '2020-2024') {
        incidents = incidents.filter(i => i.year >= 2020 && i.year <= 2024);
    }

    // 2. Year Cross-Filter (from Chart 3.5A click)
    if (crossFilters.tab3Year) {
        incidents = incidents.filter(i => i.year == crossFilters.tab3Year);
    }

    // 3. Domain Cross-Filter (from Chart 3.5B click)
    if (crossFilters.tab3Domain) {
        incidents = incidents.filter(i => i.risk_domain === crossFilters.tab3Domain);
    }

    // 4. Country Cross-Filter (from Scatter click)
    if (crossFilters.tab3Country && crossFilters.tab3Country !== 'Thailand' && crossFilters.tab3Country !== 'All') {
        const cLower = crossFilters.tab3Country.toLowerCase();
        const cFiltered = incidents.filter(i =>
            (i.title && i.title.toLowerCase().includes(cLower)) ||
            (i.deployer && i.deployer.toLowerCase().includes(cLower)) ||
            (i.implicated && i.implicated.toLowerCase().includes(cLower))
        );
        if (cFiltered.length > 0) incidents = cFiltered;
    }

    // 5. Search text
    const filtered = incidents.filter(inc => {
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

    if (total === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding: 24px; color: var(--text-secondary);">
                    <i class="fas fa-filter" style="margin-right: 6px;"></i> ไม่พบเหตุการณ์ AI ตามตัวกรองที่เลือก
                </td>
            </tr>
        `;
    } else {
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
    }

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
