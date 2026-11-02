/**
 * Digital Threats & Internet Freedom Dashboard
 * Specification: handoff_kp1.md
 * Branch: kp
 */

// ── Global State & Chart Store ──
let DATA = null;
const charts = {};

// Filter & Table States
const afncState = { page: 1, pageSize: 15, search: '', year: 'all', verdict: 'all', category: 'all' };
const acscState = { page: 1, pageSize: 12, search: '' };
const aiidState = { page: 1, pageSize: 12, search: '', yearFrom: 1983, yearTo: 2026, risk: 'all', intent: 'all' };
const freedomState = { page: 1, pageSize: 15, search: '', year: 2024, status: 'all' };

let currentOverviewTrendType = 'acsc';

// ── Chart.js Global Dark Theme Styling ──
if (window.Chart) {
    Chart.defaults.color = '#9aa0b4';
    Chart.defaults.borderColor = 'rgba(45, 50, 80, 0.6)';
    Chart.defaults.font.family = "'Noto Sans Thai', 'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = '#1e2235';
    Chart.defaults.plugins.tooltip.titleColor = '#e8eaed';
    Chart.defaults.plugins.tooltip.bodyColor = '#9aa0b4';
    Chart.defaults.plugins.tooltip.borderColor = '#2d3250';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
}

// ── App Initialization ──
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();

    try {
        if (window.DASHBOARD_DATA) {
            DATA = window.DASHBOARD_DATA;
        } else {
            const resp = await fetch('dashboard_data.json');
            DATA = await resp.json();
        }

        // Initialize all pages
        initOverviewPage();
        initAfncPage();
        initAcscPage();
        initAiidPage();
        initFreedomPage();

        // Hide loading overlay
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.add('hidden');

    } catch (err) {
        console.error("Failed to load dashboard data:", err);
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.innerHTML = `<div style="text-align:center; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #f87171; margin-bottom: 12px;"></i>
                <h3>เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
                <p style="color: #9aa0b4;">โปรดตรวจสอบไฟล์ data.js หรือ dashboard_data.json</p>
            </div>`;
        }
    }
});

// ── Navigation ──
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            navigateToPage(pageId);
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

function navigateToPage(pageId) {
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-page') === pageId);
    });

    document.querySelectorAll('.page').forEach(el => {
        el.classList.toggle('active', el.id === `page-${pageId}`);
    });

    const pageTitles = {
        'overview': 'ภาพรวมภัยคุกคามทางดิจิทัล (Digital Threats Overview)',
        'fakenews': 'ข่าวปลอมและข้อมูลบิดเบือนในประเทศไทย (AFNC)',
        'scams': 'การหลอกลวงออนไลน์ในประเทศไทย (ACSC)',
        'ai-risks': 'AI Risks & Social Impact (AI Incident Database)',
        'freedom': 'เสรีภาพอินเทอร์เน็ต (Freedom on the Net)',
        'final-insights': 'บทสรุปและสิ่งที่เราควรเรียนรู้ (Final Insights)'
    };

    const titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.textContent = pageTitles[pageId] || 'Dashboard';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger chart resize for newly visible page
    setTimeout(() => {
        Object.values(charts).forEach(c => {
            if (c && typeof c.resize === 'function') c.resize();
        });
        if (pageId === 'freedom') {
            const mapDiv = document.getElementById('freedom-world-map');
            if (mapDiv && window.Plotly) Plotly.Plots.resize(mapDiv);
        }
    }, 100);
}

// ═══════════════════════════════════════════════════════════════
// PAGE 1: OVERVIEW
// ═══════════════════════════════════════════════════════════════
function initOverviewPage() {
    // Inventory table
    const invTbody = document.getElementById('inventory-table-body');
    if (invTbody && DATA.inventory) {
        invTbody.innerHTML = DATA.inventory.map(item => `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td><span class="badge" style="background: rgba(79,140,255,0.15); color: #4f8cff;">${item.code}</span></td>
                <td><code>${item.filename}</code></td>
                <td><strong>${item.rows.toLocaleString()}</strong></td>
                <td>${item.period}</td>
                <td>${item.key_metrics}</td>
                <td style="color: #9aa0b4; font-size: 12px;">${item.quality_notes}</td>
            </tr>
        `).join('');
    }

    // 1. Overview Trend Preview
    renderOverviewTrendPreview('acsc');

    // 2. Verdict Doughnut
    const pieCanvas = document.getElementById('overview-verdict-pie');
    if (pieCanvas) {
        charts['overviewVerdict'] = new Chart(pieCanvas, {
            type: 'doughnut',
            data: {
                labels: ['ข่าวปลอม (Fake)', 'ข่าวบิดเบือน (Distorted)', 'ข่าวจริง (True)'],
                datasets: [{
                    data: [DATA.afnc.fake_count, DATA.afnc.distorted_count, DATA.afnc.true_count],
                    backgroundColor: ['#f87171', '#fb923c', '#34d399'],
                    borderColor: '#1e2235',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // 3. AI Risk Bar
    const aiRiskCanvas = document.getElementById('overview-airisk-bar');
    if (aiRiskCanvas) {
        const topDomains = Object.entries(DATA.aiid.risk_domains)
            .filter(([k]) => k !== 'Unspecified')
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        charts['overviewAiRisk'] = new Chart(aiRiskCanvas, {
            type: 'bar',
            data: {
                labels: topDomains.map(d => d[0]),
                datasets: [{
                    label: 'จำนวนเหตุการณ์',
                    data: topDomains.map(d => d[1]),
                    backgroundColor: '#4f8cff',
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { ticks: { font: { size: 11 } } }
                }
            }
        });
    }

    // 4. ACSC Weekly Damage Line
    const damageCanvas = document.getElementById('overview-scam-damage');
    if (damageCanvas) {
        charts['overviewDamage'] = new Chart(damageCanvas, {
            type: 'line',
            data: {
                labels: DATA.acsc.weekly_records.map(r => r.week_start),
                datasets: [{
                    label: 'ความเสียหาย (ล้านบาท)',
                    data: DATA.acsc.weekly_records.map(r => r.loss_million),
                    borderColor: '#fb923c',
                    backgroundColor: 'rgba(251, 146, 60, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { maxTicksLimit: 8 } },
                    y: { title: { display: true, text: 'ล้านบาท' } }
                }
            }
        });
    }

    // 5. Freedom Thailand vs ASEAN Bar
    const freedomCanvas = document.getElementById('overview-freedom-bar');
    if (freedomCanvas) {
        const asean = [...DATA.freedom.asean_latest].sort((a, b) => b.total_score - a.total_score);
        charts['overviewFreedom'] = new Chart(freedomCanvas, {
            type: 'bar',
            data: {
                labels: asean.map(c => c.country),
                datasets: [{
                    label: 'คะแนนเสรีภาพ (เต็ม 100)',
                    data: asean.map(c => c.total_score),
                    backgroundColor: asean.map(c => c.country === 'Thailand' ? '#f87171' : '#2dd4bf'),
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { max: 100, title: { display: true, text: 'คะแนน (0-100)' } }
                }
            }
        });
    }
}

function switchOverviewTrend(type) {
    currentOverviewTrendType = type;
    document.querySelectorAll('.trend-header-tabs .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(type));
    });
    renderOverviewTrendPreview(type);
}

function renderOverviewTrendPreview(type) {
    const canvas = document.getElementById('overview-trend-preview');
    if (!canvas) return;

    if (charts['overviewTrendPreview']) {
        charts['overviewTrendPreview'].destroy();
    }

    let chartConfig = {};

    if (type === 'acsc') {
        chartConfig = {
            type: 'line',
            data: {
                labels: DATA.acsc.weekly_records.map(r => r.week_start),
                datasets: [{
                    label: 'คดีหลอกลวงรายสัปดาห์ (ACSC Cases)',
                    data: DATA.acsc.weekly_records.map(r => r.cases),
                    borderColor: '#a78bfa',
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { maxTicksLimit: 12 } },
                    y: { title: { display: true, text: 'จำนวนคดี' } }
                }
            }
        };
    } else if (type === 'afnc') {
        chartConfig = {
            type: 'line',
            data: {
                labels: DATA.afnc.monthly_labels,
                datasets: [
                    {
                        label: 'ข่าวปลอม (Fake)',
                        data: DATA.afnc.monthly_fake,
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        tension: 0.2,
                        pointRadius: 1
                    },
                    {
                        label: 'ข่าวจริง (True)',
                        data: DATA.afnc.monthly_true,
                        borderColor: '#34d399',
                        backgroundColor: 'rgba(52, 211, 153, 0.1)',
                        tension: 0.2,
                        pointRadius: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { maxTicksLimit: 12 } },
                    y: { title: { display: true, text: 'จำนวนรายการ' } }
                }
            }
        };
    } else if (type === 'aiid') {
        chartConfig = {
            type: 'bar',
            data: {
                labels: DATA.aiid.years,
                datasets: [{
                    label: 'เหตุการณ์ AI ทั่วโลก (AI Incidents)',
                    data: DATA.aiid.total_by_year,
                    backgroundColor: '#4f8cff',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { title: { display: true, text: 'จำนวนเหตุการณ์' } }
                }
            }
        };
    }

    charts['overviewTrendPreview'] = new Chart(canvas, chartConfig);
}

// ═══════════════════════════════════════════════════════════════
// PAGE 2: FAKE NEWS (AFNC)
// ═══════════════════════════════════════════════════════════════
function initAfncPage() {
    // Populate filters
    const yearSelect = document.getElementById('afnc-year-filter');
    if (yearSelect) {
        DATA.afnc.years_list.forEach(y => {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = `ปี ${y}`;
            yearSelect.appendChild(opt);
        });
        yearSelect.addEventListener('change', (e) => {
            afncState.year = e.target.value;
            afncState.page = 1;
            updateAfncTable();
        });
    }

    const verdictSelect = document.getElementById('afnc-verdict-filter');
    if (verdictSelect) {
        verdictSelect.addEventListener('change', (e) => {
            afncState.verdict = e.target.value;
            afncState.page = 1;
            updateAfncTable();
        });
    }

    const catSelect = document.getElementById('afnc-cat-filter');
    if (catSelect) {
        DATA.afnc.top_categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.category;
            opt.textContent = `${cat.category} (${cat.total})`;
            catSelect.appendChild(opt);
        });
        catSelect.addEventListener('change', (e) => {
            afncState.category = e.target.value;
            afncState.page = 1;
            updateAfncTable();
        });
    }

    const searchInput = document.getElementById('afnc-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            afncState.search = e.target.value.toLowerCase().trim();
            afncState.page = 1;
            updateAfncTable();
        });
    }

    // 3.1 Verification Trend Line
    const trendCanvas = document.getElementById('afnc-trend-line');
    if (trendCanvas) {
        charts['afncTrend'] = new Chart(trendCanvas, {
            type: 'line',
            data: {
                labels: DATA.afnc.monthly_labels,
                datasets: [
                    {
                        label: 'ข่าวปลอม (Fake)',
                        data: DATA.afnc.monthly_fake,
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        tension: 0.2,
                        pointRadius: 2
                    },
                    {
                        label: 'บิดเบือน (Distorted)',
                        data: DATA.afnc.monthly_distorted,
                        borderColor: '#fb923c',
                        backgroundColor: 'rgba(251, 146, 60, 0.1)',
                        tension: 0.2,
                        pointRadius: 2
                    },
                    {
                        label: 'ข่าวจริง (True)',
                        data: DATA.afnc.monthly_true,
                        borderColor: '#34d399',
                        backgroundColor: 'rgba(52, 211, 153, 0.1)',
                        tension: 0.2,
                        pointRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { maxTicksLimit: 12 } },
                    y: { title: { display: true, text: 'จำนวนรายการ' } }
                }
            }
        });
    }

    // 3.2 Verdict Composition 100% Stacked Bar
    const stackedCanvas = document.getElementById('afnc-verdict-stacked');
    if (stackedCanvas) {
        const years = DATA.afnc.years_list;
        const fakePct = [];
        const distortedPct = [];
        const truePct = [];

        years.forEach((_, i) => {
            const f = DATA.afnc.yearly_fake[i];
            const d = DATA.afnc.yearly_distorted[i];
            const t = DATA.afnc.yearly_true[i];
            const sum = f + d + t || 1;
            fakePct.push(Math.round((f / sum) * 100));
            distortedPct.push(Math.round((d / sum) * 100));
            truePct.push(Math.round((t / sum) * 100));
        });

        charts['afncStacked'] = new Chart(stackedCanvas, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    { label: 'Fake (%)', data: fakePct, backgroundColor: '#f87171' },
                    { label: 'Distorted (%)', data: distortedPct, backgroundColor: '#fb923c' },
                    { label: 'True (%)', data: truePct, backgroundColor: '#34d399' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, max: 100, title: { display: true, text: 'สัดส่วน (%)' } }
                }
            }
        });
    }

    // 3.3 Fake News Topics Horizontal Bar
    const catCanvas = document.getElementById('afnc-category-bar');
    if (catCanvas) {
        const topCats = DATA.afnc.top_categories.slice(0, 8);
        charts['afncCategory'] = new Chart(catCanvas, {
            type: 'bar',
            data: {
                labels: topCats.map(c => c.category),
                datasets: [
                    { label: 'ข่าวปลอม (Fake)', data: topCats.map(c => c.fake), backgroundColor: '#f87171' },
                    { label: 'บิดเบือน (Distorted)', data: topCats.map(c => c.distorted), backgroundColor: '#fb923c' },
                    { label: 'ข่าวจริง (True)', data: topCats.map(c => c.true), backgroundColor: '#34d399' }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true, title: { display: true, text: 'จำนวนข่าว' } },
                    y: { stacked: true, ticks: { font: { size: 11 } } }
                }
            }
        });
    }

    // 3.4 Items by Type
    const typeCanvas = document.getElementById('afnc-type-bar');
    if (typeCanvas) {
        const types = Object.entries(DATA.afnc.item_types).sort((a, b) => b[1] - a[1]);
        charts['afncTypes'] = new Chart(typeCanvas, {
            type: 'bar',
            data: {
                labels: types.map(t => t[0]),
                datasets: [{
                    label: 'จำนวนรายการ',
                    data: types.map(t => t[1]),
                    backgroundColor: '#a78bfa',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { title: { display: true, text: 'จำนวนรายการ' } }
                }
            }
        });
    }

    // Initialize Table
    updateAfncTable();
}

function updateAfncTable() {
    const tbody = document.getElementById('afnc-table-body');
    const info = document.getElementById('afnc-page-info');
    const prevBtn = document.getElementById('afnc-prev-btn');
    const nextBtn = document.getElementById('afnc-next-btn');
    if (!tbody || !DATA.afnc.items_compact) return;

    // Filter items
    const filtered = DATA.afnc.items_compact.filter(item => {
        // [post_id, date, year, item_type, verdict_th, category_th, title, view_count]
        const [, date, year, item_type, verdict_th, category_th, title] = item;
        if (afncState.year !== 'all' && String(year) !== afncState.year) return false;
        if (afncState.verdict === 'Fake' && !verdict_th.includes('ปลอม')) return false;
        if (afncState.verdict === 'Distorted' && !verdict_th.includes('บิดเบือน')) return false;
        if (afncState.verdict === 'True' && !verdict_th.includes('จริง')) return false;
        if (afncState.category !== 'all' && category_th !== afncState.category) return false;
        if (afncState.search) {
            const str = `${title} ${category_th} ${item_type}`.toLowerCase();
            if (!str.includes(afncState.search)) return false;
        }
        return true;
    });

    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / afncState.pageSize));
    if (afncState.page > maxPage) afncState.page = maxPage;
    if (afncState.page < 1) afncState.page = 1;

    const start = (afncState.page - 1) * afncState.pageSize;
    const pageItems = filtered.slice(start, start + afncState.pageSize);

    tbody.innerHTML = pageItems.map(r => {
        const [id, date, , item_type, verdict, cat, title, views] = r;
        let vBadge = '<span class="badge-neutral">-</span>';
        if (verdict.includes('ปลอม')) vBadge = '<span class="badge-fake">ข่าวปลอม</span>';
        else if (verdict.includes('บิดเบือน')) vBadge = '<span class="badge-distorted">ข่าวบิดเบือน</span>';
        else if (verdict.includes('จริง')) vBadge = '<span class="badge-true">ข่าวจริง</span>';

        return `
            <tr>
                <td>#${id}</td>
                <td style="white-space: nowrap;">${date}</td>
                <td><span class="badge-neutral">${item_type}</span></td>
                <td>${vBadge}</td>
                <td><small>${cat}</small></td>
                <td>${title}</td>
                <td>${views.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    if (info) {
        const end = Math.min(start + afncState.pageSize, total);
        info.textContent = `กำลังแสดง ${total > 0 ? start + 1 : 0}-${end} จาก ${total.toLocaleString()} รายการ`;
    }
    if (prevBtn) prevBtn.disabled = afncState.page <= 1;
    if (nextBtn) nextBtn.disabled = afncState.page >= maxPage;
}

function changeAfncPage(dir) {
    afncState.page += dir;
    updateAfncTable();
}

// ═══════════════════════════════════════════════════════════════
// PAGE 3: ONLINE SCAMS (ACSC)
// ═══════════════════════════════════════════════════════════════
function initAcscPage() {
    const records = DATA.acsc.weekly_records;

    // 4.1 Weekly Cases Line
    const casesCanvas = document.getElementById('acsc-cases-line');
    if (casesCanvas) {
        charts['acscCases'] = new Chart(casesCanvas, {
            type: 'line',
            data: {
                labels: records.map(r => r.week_start),
                datasets: [{
                    label: 'จำนวนคดีรายสัปดาห์',
                    data: records.map(r => r.cases),
                    borderColor: '#a78bfa',
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { maxTicksLimit: 12 } },
                    y: { title: { display: true, text: 'จำนวนคดี' } }
                }
            }
        });
    }

    // 4.2 Weekly Loss Line (Separated)
    const damageCanvas = document.getElementById('acsc-damage-line');
    if (damageCanvas) {
        charts['acscDamage'] = new Chart(damageCanvas, {
            type: 'line',
            data: {
                labels: records.map(r => r.week_start),
                datasets: [{
                    label: 'มูลค่าความเสียหาย (ล้านบาท)',
                    data: records.map(r => r.loss_million),
                    borderColor: '#f87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { maxTicksLimit: 12 } },
                    y: { title: { display: true, text: 'ล้านบาท' } }
                }
            }
        });
    }

    // 4.3 Top Types Bar
    const topTypeCanvas = document.getElementById('acsc-toptype-bar');
    if (topTypeCanvas) {
        const topTypes = Object.entries(DATA.acsc.top_cases_distribution).sort((a, b) => b[1] - a[1]);
        charts['acscTopTypes'] = new Chart(topTypeCanvas, {
            type: 'bar',
            data: {
                labels: topTypes.map(t => t[0]),
                datasets: [{
                    label: 'จำนวนสัปดาห์ที่ครองอันดับ 1',
                    data: topTypes.map(t => t[1]),
                    backgroundColor: '#fb923c',
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: 'จำนวนสัปดาห์ (จาก 48 สัปดาห์)' } }
                }
            }
        });
    }

    // 4.4 Highest Loss Types Bar
    const lossTypeCanvas = document.getElementById('acsc-loss-type-bar');
    if (lossTypeCanvas) {
        const lossTypes = Object.entries(DATA.acsc.highest_loss_distribution).sort((a, b) => b[1] - a[1]);
        charts['acscLossTypes'] = new Chart(lossTypeCanvas, {
            type: 'bar',
            data: {
                labels: lossTypes.map(t => t[0]),
                datasets: [{
                    label: 'สัปดาห์ที่สร้างความเสียหายสูงสุด',
                    data: lossTypes.map(t => t[1]),
                    backgroundColor: '#f87171',
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: 'จำนวนสัปดาห์' } }
                }
            }
        });
    }

    // 4.5 Loss per case line
    const percaseCanvas = document.getElementById('acsc-percase-line');
    if (percaseCanvas) {
        charts['acscPercase'] = new Chart(percaseCanvas, {
            type: 'line',
            data: {
                labels: records.map(r => r.week_start),
                datasets: [{
                    label: 'ความเสียหายเฉลี่ยต่อคดี (บาท)',
                    data: records.map(r => Math.round(r.loss_per_case)),
                    borderColor: '#2dd4bf',
                    backgroundColor: 'rgba(45, 212, 191, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { maxTicksLimit: 12 } },
                    y: { title: { display: true, text: 'บาท / คดี' } }
                }
            }
        });
    }

    // Search in ACSC Table
    const acscSearch = document.getElementById('acsc-search');
    if (acscSearch) {
        acscSearch.addEventListener('input', (e) => {
            acscState.search = e.target.value.toLowerCase().trim();
            acscState.page = 1;
            updateAcscTable();
        });
    }

    updateAcscTable();
}

function updateAcscTable() {
    const tbody = document.getElementById('acsc-table-body');
    const info = document.getElementById('acsc-page-info');
    const prevBtn = document.getElementById('acsc-prev-btn');
    const nextBtn = document.getElementById('acsc-next-btn');
    if (!tbody || !DATA.acsc.weekly_records) return;

    const filtered = DATA.acsc.weekly_records.filter(r => {
        if (!acscState.search) return true;
        const str = `${r.week_start} ${r.week_end} ${r.top_type} ${r.highest_loss_type}`.toLowerCase();
        return str.includes(acscState.search);
    });

    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / acscState.pageSize));
    if (acscState.page > maxPage) acscState.page = maxPage;
    if (acscState.page < 1) acscState.page = 1;

    const start = (acscState.page - 1) * acscState.pageSize;
    const pageItems = filtered.slice(start, start + acscState.pageSize);

    tbody.innerHTML = pageItems.map(r => `
        <tr>
            <td><strong>${r.week_start}</strong></td>
            <td>${r.week_end}</td>
            <td><strong>${r.cases.toLocaleString()}</strong></td>
            <td style="color: #fb923c; font-weight: 600;">${r.loss_million.toLocaleString()} ลบ.</td>
            <td>${Math.round(r.loss_per_case).toLocaleString()}</td>
            <td><small>${r.top_type || r.top_type_clean} ${r.top_type_share ? `(${r.top_type_share}%)` : ''}</small></td>
            <td><small style="color: #f87171;">${r.highest_loss_type || r.highest_loss_type_clean}</small></td>
            <td><span class="badge-neutral">${r.flag || 'ปกติ'}</span></td>
        </tr>
    `).join('');

    if (info) {
        const end = Math.min(start + acscState.pageSize, total);
        info.textContent = `กำลังแสดง ${total > 0 ? start + 1 : 0}-${end} จาก ${total} สัปดาห์`;
    }
    if (prevBtn) prevBtn.disabled = acscState.page <= 1;
    if (nextBtn) nextBtn.disabled = acscState.page >= maxPage;
}

function changeAcscPage(dir) {
    acscState.page += dir;
    updateAcscTable();
}

// ═══════════════════════════════════════════════════════════════
// PAGE 4: AI RISKS (AIID)
// ═══════════════════════════════════════════════════════════════
function initAiidPage() {
    // Populate year range
    const yearFrom = document.getElementById('aiid-year-from');
    const yearTo = document.getElementById('aiid-year-to');
    if (yearFrom && yearTo) {
        DATA.aiid.years.forEach(y => {
            const opt1 = document.createElement('option');
            opt1.value = y;
            opt1.textContent = y;
            if (y === 2015) opt1.selected = true;
            yearFrom.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = y;
            opt2.textContent = y;
            if (y === 2026) opt2.selected = true;
            yearTo.appendChild(opt2);
        });

        aiidState.yearFrom = 2015;
        aiidState.yearTo = 2026;

        yearFrom.addEventListener('change', (e) => {
            aiidState.yearFrom = parseInt(e.target.value);
            aiidState.page = 1;
            updateAiidTable();
        });
        yearTo.addEventListener('change', (e) => {
            aiidState.yearTo = parseInt(e.target.value);
            aiidState.page = 1;
            updateAiidTable();
        });
    }

    const riskSelect = document.getElementById('aiid-risk-filter');
    if (riskSelect) {
        Object.keys(DATA.aiid.risk_domains).forEach(r => {
            if (r !== 'Unspecified') {
                const opt = document.createElement('option');
                opt.value = r;
                opt.textContent = `${r} (${DATA.aiid.risk_domains[r]})`;
                riskSelect.appendChild(opt);
            }
        });
        riskSelect.addEventListener('change', (e) => {
            aiidState.risk = e.target.value;
            aiidState.page = 1;
            updateAiidTable();
        });
    }

    const intentSelect = document.getElementById('aiid-intent-filter');
    if (intentSelect) {
        intentSelect.addEventListener('change', (e) => {
            aiidState.intent = e.target.value;
            aiidState.page = 1;
            updateAiidTable();
        });
    }

    const searchInput = document.getElementById('aiid-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            aiidState.search = e.target.value.toLowerCase().trim();
            aiidState.page = 1;
            updateAiidTable();
        });
    }

    // 5.1 AI Incidents by Year
    const yearlyCanvas = document.getElementById('aiid-yearly-bar');
    if (yearlyCanvas) {
        charts['aiidYearly'] = new Chart(yearlyCanvas, {
            type: 'bar',
            data: {
                labels: DATA.aiid.years,
                datasets: [{
                    label: 'จำนวนเหตุการณ์ที่ถูกบันทึก',
                    data: DATA.aiid.total_by_year,
                    backgroundColor: '#4f8cff',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { title: { display: true, text: 'จำนวนเหตุการณ์' } }
                }
            }
        });
    }

    // 5.2 Incidents by Risk Domain
    const riskCanvas = document.getElementById('aiid-risk-bar');
    if (riskCanvas) {
        const sortedDomains = Object.entries(DATA.aiid.risk_domains)
            .filter(([k]) => k !== 'Unspecified')
            .sort((a, b) => b[1] - a[1]);

        charts['aiidRisk'] = new Chart(riskCanvas, {
            type: 'bar',
            data: {
                labels: sortedDomains.map(d => d[0]),
                datasets: [{
                    label: 'จำนวนเหตุการณ์',
                    data: sortedDomains.map(d => d[1]),
                    backgroundColor: '#a78bfa',
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: 'จำนวนเหตุการณ์' } },
                    y: { ticks: { font: { size: 11 } } }
                }
            }
        });
    }

    // 5.3 Intent Distribution
    const intentCanvas = document.getElementById('aiid-intent-pie');
    if (intentCanvas) {
        const intents = Object.entries(DATA.aiid.intents).filter(([k]) => k !== 'Unspecified');
        charts['aiidIntent'] = new Chart(intentCanvas, {
            type: 'doughnut',
            data: {
                labels: intents.map(i => i[0]),
                datasets: [{
                    data: intents.map(i => i[1]),
                    backgroundColor: ['#34d399', '#f87171', '#fbbf24'],
                    borderColor: '#1e2235',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // 5.5 Deepfake Line
    const deepfakeCanvas = document.getElementById('aiid-deepfake-line');
    if (deepfakeCanvas) {
        // filter from 2018 onwards where deepfakes emerge
        const startIdx = DATA.aiid.years.indexOf(2018);
        const subYears = DATA.aiid.years.slice(startIdx);
        const subDeepfakes = DATA.aiid.deepfake_by_year.slice(startIdx);

        charts['aiidDeepfake'] = new Chart(deepfakeCanvas, {
            type: 'line',
            data: {
                labels: subYears,
                datasets: [{
                    label: 'เหตุการณ์ Deepfake / สื่อสังเคราะห์',
                    data: subDeepfakes,
                    borderColor: '#f472b6',
                    backgroundColor: 'rgba(244, 114, 182, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { title: { display: true, text: 'จำนวนเหตุการณ์' } }
                }
            }
        });
    }

    // 5.4 Risk Domain x Intent Heatmap Table
    renderAiidHeatmap();

    // Top Deployers Bar
    const deployerCanvas = document.getElementById('aiid-deployer-bar');
    if (deployerCanvas) {
        const deployers = Object.entries(DATA.aiid.top_deployers);
        charts['aiidDeployers'] = new Chart(deployerCanvas, {
            type: 'bar',
            data: {
                labels: deployers.map(d => d[0]),
                datasets: [{
                    label: 'จำนวนเหตุการณ์ที่เกี่ยวข้อง',
                    data: deployers.map(d => d[1]),
                    backgroundColor: '#2dd4bf',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { title: { display: true, text: 'เหตุการณ์' } }
                }
            }
        });
    }

    updateAiidTable();
}

function renderAiidHeatmap() {
    const table = document.getElementById('aiid-heatmap-table');
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
                <th style="width: 35%;">Risk Domain</th>
                <th>Intentional (เจตนา)</th>
                <th>Unintentional (ไม่เจตนา)</th>
                <th>Other (อื่นๆ)</th>
            </tr>
        </thead>
        <tbody>
    `;

    domains.forEach(d => {
        html += `<tr><td><strong>${d}</strong></td>`;
        intents.forEach(i => {
            const count = DATA.aiid.risk_x_intent[d][i] || 0;
            const intensity = count > 0 ? Math.max(0.15, count / maxVal) : 0.04;
            const bg = count > 0 ? `rgba(79, 140, 255, ${intensity})` : 'transparent';
            const textColor = count > (maxVal * 0.4) ? '#fff' : (count > 0 ? '#e8eaed' : '#6b7280');
            html += `<td class="heatmap-cell" style="background: ${bg}; color: ${textColor};">${count.toLocaleString()}</td>`;
        });
        html += `</tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;
}

function updateAiidTable() {
    const tbody = document.getElementById('aiid-table-body');
    const info = document.getElementById('aiid-page-info');
    const prevBtn = document.getElementById('aiid-prev-btn');
    const nextBtn = document.getElementById('aiid-next-btn');
    if (!tbody || !DATA.aiid.incidents) return;

    const filtered = DATA.aiid.incidents.filter(inc => {
        if (inc.year < aiidState.yearFrom || inc.year > aiidState.yearTo) return false;
        if (aiidState.risk !== 'all' && inc.risk_domain !== aiidState.risk) return false;
        if (aiidState.intent !== 'all' && inc.intent !== aiidState.intent) return false;
        if (aiidState.search) {
            const str = `${inc.title} ${inc.description} ${inc.implicated} ${inc.deployer} ${inc.risk_domain}`.toLowerCase();
            if (!str.includes(aiidState.search)) return false;
        }
        return true;
    });

    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / aiidState.pageSize));
    if (aiidState.page > maxPage) aiidState.page = maxPage;
    if (aiidState.page < 1) aiidState.page = 1;

    const start = (aiidState.page - 1) * aiidState.pageSize;
    const pageItems = filtered.slice(start, start + aiidState.pageSize);

    tbody.innerHTML = pageItems.map(inc => {
        const intentBadge = inc.intent === 'Intentional'
            ? '<span class="badge-fake">Intentional</span>'
            : (inc.intent === 'Unintentional' ? '<span class="badge-true">Unintentional</span>' : '<span class="badge-neutral">Other</span>');
        const deepfakeTag = inc.is_deepfake ? '<span class="badge" style="background: rgba(244,114,182,0.2); color: #f472b6; margin-left: 6px;">Deepfake</span>' : '';

        return `
            <tr>
                <td>#${inc.id}</td>
                <td><strong>${inc.year}</strong></td>
                <td><strong>${inc.title}</strong> ${deepfakeTag}</td>
                <td><small>${inc.risk_domain}</small></td>
                <td>${intentBadge}</td>
                <td><small>${inc.implicated || '-'}</small></td>
                <td><span class="badge-neutral">${inc.deployer}</span></td>
                <td><small style="color: #9aa0b4;">${inc.description}</small></td>
            </tr>
        `;
    }).join('');

    if (info) {
        const end = Math.min(start + aiidState.pageSize, total);
        info.textContent = `กำลังแสดง ${total > 0 ? start + 1 : 0}-${end} จาก ${total.toLocaleString()} เหตุการณ์`;
    }
    if (prevBtn) prevBtn.disabled = aiidState.page <= 1;
    if (nextBtn) nextBtn.disabled = aiidState.page >= maxPage;
}

function changeAiidPage(dir) {
    aiidState.page += dir;
    updateAiidTable();
}

// ═══════════════════════════════════════════════════════════════
// PAGE 5: INTERNET FREEDOM (FREEDOM ON THE NET)
// ═══════════════════════════════════════════════════════════════
function initFreedomPage() {
    // Populate year filter
    const yearSelect = document.getElementById('freedom-year-filter');
    if (yearSelect && DATA.freedom.all_years) {
        yearSelect.innerHTML = DATA.freedom.all_years.map(y => `
            <option value="${y}" ${y === DATA.freedom.latest_year ? 'selected' : ''}>ปี ${y}</option>
        `).join('');
        yearSelect.addEventListener('change', (e) => {
            freedomState.year = parseInt(e.target.value);
            freedomState.page = 1;
            updateFreedomTable();
        });
    }

    const statusSelect = document.getElementById('freedom-status-filter');
    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            freedomState.status = e.target.value;
            freedomState.page = 1;
            updateFreedomTable();
        });
    }

    const searchInput = document.getElementById('freedom-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            freedomState.search = e.target.value.toLowerCase().trim();
            freedomState.page = 1;
            updateFreedomTable();
        });
    }

    // 6.1 World Choropleth Map with Plotly
    renderFreedomWorldMap();

    // 6.2 Thailand vs ASEAN Bar
    const aseanCanvas = document.getElementById('freedom-asean-bar');
    if (aseanCanvas) {
        const asean = [...DATA.freedom.asean_latest].sort((a, b) => b.total_score - a.total_score);
        charts['freedomAsean'] = new Chart(aseanCanvas, {
            type: 'bar',
            data: {
                labels: asean.map(c => c.country),
                datasets: [{
                    label: 'คะแนนเสรีภาพ (100)',
                    data: asean.map(c => c.total_score),
                    backgroundColor: asean.map(c => c.country === 'Thailand' ? '#f87171' : (c.total_score >= 70 ? '#34d399' : '#fbbf24')),
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { max: 100, title: { display: true, text: 'คะแนนเสรีภาพ' } }
                }
            }
        });
    }

    // 6.4 Components Breakdown (Grouped Bar)
    const compCanvas = document.getElementById('freedom-th-components');
    if (compCanvas) {
        const thLatest = DATA.freedom.thailand_latest || { obstacles: 14, limits: 14, rights: 8 };
        // ASEAN averages
        const asean = DATA.freedom.asean_latest;
        const avgObstacles = Math.round(asean.reduce((s, c) => s + c.obstacles, 0) / asean.length);
        const avgLimits = Math.round(asean.reduce((s, c) => s + c.limits, 0) / asean.length);
        const avgRights = Math.round(asean.reduce((s, c) => s + c.rights, 0) / asean.length);

        charts['freedomComponents'] = new Chart(compCanvas, {
            type: 'bar',
            data: {
                labels: [
                    'Obstacles to Access (เต็ม 25)',
                    'Limits on Content (เต็ม 35)',
                    'Violations of Rights (เต็ม 40)'
                ],
                datasets: [
                    {
                        label: 'ไทย (Thailand)',
                        data: [thLatest.obstacles, thLatest.limits, thLatest.rights],
                        backgroundColor: '#f87171',
                        borderRadius: 4
                    },
                    {
                        label: 'ค่าเฉลี่ยอาเซียน (ASEAN Avg)',
                        data: [avgObstacles, avgLimits, avgRights],
                        backgroundColor: '#4f8cff',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { max: 40, title: { display: true, text: 'คะแนน' } }
                }
            }
        });
    }

    // 6.3 Thailand Score Trend Line (2010–2024)
    const thTrendCanvas = document.getElementById('freedom-th-trend');
    if (thTrendCanvas) {
        const history = DATA.freedom.thailand_history;
        charts['freedomThTrend'] = new Chart(thTrendCanvas, {
            type: 'line',
            data: {
                labels: history.map(h => h.year),
                datasets: [{
                    label: 'คะแนนรวมไทย (Thailand Total Score)',
                    data: history.map(h => h.total_score),
                    borderColor: '#f87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 20, max: 60, title: { display: true, text: 'คะแนน' } }
                }
            }
        });
    }

    // 6.5 Component Trend Line
    const compTrendCanvas = document.getElementById('freedom-component-trend');
    if (compTrendCanvas) {
        const history = DATA.freedom.thailand_history;
        charts['freedomCompTrend'] = new Chart(compTrendCanvas, {
            type: 'line',
            data: {
                labels: history.map(h => h.year),
                datasets: [
                    {
                        label: 'Access (เต็ม 25)',
                        data: history.map(h => h.obstacles),
                        borderColor: '#34d399',
                        tension: 0.2,
                        pointRadius: 3
                    },
                    {
                        label: 'Content (เต็ม 35)',
                        data: history.map(h => h.limits),
                        borderColor: '#fb923c',
                        tension: 0.2,
                        pointRadius: 3
                    },
                    {
                        label: 'User Rights (เต็ม 40)',
                        data: history.map(h => h.rights),
                        borderColor: '#f87171',
                        borderWidth: 3,
                        tension: 0.2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 0, max: 25, title: { display: true, text: 'คะแนนย่อย' } }
                }
            }
        });
    }

    updateFreedomTable();
}

function renderFreedomWorldMap() {
    const mapDiv = document.getElementById('freedom-world-map');
    if (!mapDiv || !window.Plotly || !DATA.freedom.countries_latest) return;

    const countries = DATA.freedom.countries_latest;
    const locations = countries.map(c => c.iso3);
    const z = countries.map(c => c.total_score);
    const text = countries.map(c => `<b>${c.country}</b><br>Score: ${c.total_score}/100<br>Status: ${c.status}<br>Access: ${c.obstacles}/25 | Content: ${c.limits}/35 | Rights: ${c.rights}/40`);

    const plotData = [{
        type: 'choropleth',
        locations: locations,
        z: z,
        text: text,
        hoverinfo: 'text',
        colorscale: [
            [0, '#ef4444'],      // Red for Not Free (0)
            [0.39, '#ef4444'],   // Red boundary at 39
            [0.40, '#f59e0b'],   // Orange/Yellow for Partly Free (40)
            [0.69, '#f59e0b'],   // Orange boundary at 69
            [0.70, '#10b981'],   // Green for Free (70)
            [1.0, '#059669']     // Dark Green at 100
        ],
        zmin: 0,
        zmax: 100,
        colorbar: {
            title: 'Freedom Score',
            titleside: 'top',
            tickvals: [20, 55, 85],
            ticktext: ['Not Free', 'Partly Free', 'Free'],
            len: 0.6,
            thickness: 14,
            bgcolor: 'transparent',
            outlinecolor: '#2d3250',
            tickfont: { color: '#9aa0b4', size: 10 },
            titlefont: { color: '#e8eaed', size: 12 }
        },
        marker: {
            line: {
                color: '#1a1d2e',
                width: 0.8
            }
        }
    }];

    const layout = {
        geo: {
            showframe: false,
            showcoastlines: true,
            coastlinecolor: '#2d3250',
            projection: { type: 'natural earth' },
            bgcolor: '#141728',
            lakecolor: '#0f1117',
            showocean: true,
            oceancolor: '#0f1117',
            landcolor: '#1e2235'
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 0, r: 0, t: 0, b: 0 },
        height: 480
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot('freedom-world-map', plotData, layout, config);

    // Map click event
    mapDiv.on('plotly_click', (data) => {
        if (data.points && data.points[0]) {
            const pt = data.points[0];
            const iso3 = pt.location;
            const c = DATA.freedom.countries_latest.find(x => x.iso3 === iso3);
            if (c) {
                updateSelectedCountryCard(c);
            }
        }
    });
}

function updateSelectedCountryCard(c) {
    const nameEl = document.getElementById('selected-country-name');
    const accessEl = document.getElementById('country-access-score');
    const contentEl = document.getElementById('country-content-score');
    const rightsEl = document.getElementById('country-rights-score');

    if (nameEl) {
        nameEl.innerHTML = `<i class="fas fa-map-pin"></i> ข้อมูลประเทศ: ${c.country} (${c.iso3}) — ${c.total_score} คะแนน (${c.status})`;
    }
    if (accessEl) accessEl.textContent = `${c.obstacles} / 25`;
    if (contentEl) contentEl.textContent = `${c.limits} / 35`;
    if (rightsEl) {
        rightsEl.textContent = `${c.rights} / 40`;
        rightsEl.style.color = c.rights <= 10 ? 'var(--accent-red)' : 'var(--text-primary)';
    }
}

function updateFreedomTable() {
    const tbody = document.getElementById('freedom-table-body');
    const info = document.getElementById('freedom-page-info');
    const prevBtn = document.getElementById('freedom-prev-btn');
    const nextBtn = document.getElementById('freedom-next-btn');
    if (!tbody || !DATA.freedom.countries_latest) return;

    const filtered = DATA.freedom.countries_latest.filter(c => {
        if (freedomState.status !== 'all' && c.status !== freedomState.status) return false;
        if (freedomState.search) {
            const str = `${c.country} ${c.iso3}`.toLowerCase();
            if (!str.includes(freedomState.search)) return false;
        }
        return true;
    });

    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / freedomState.pageSize));
    if (freedomState.page > maxPage) freedomState.page = maxPage;
    if (freedomState.page < 1) freedomState.page = 1;

    const start = (freedomState.page - 1) * freedomState.pageSize;
    const pageItems = filtered.slice(start, start + freedomState.pageSize);

    tbody.innerHTML = pageItems.map((c, idx) => {
        let badgeClass = 'badge-status-not';
        if (c.status === 'Free') badgeClass = 'badge-status-free';
        else if (c.status === 'Partly Free') badgeClass = 'badge-status-partly';

        const isTh = c.country === 'Thailand';
        const rowStyle = isTh ? 'background: rgba(248, 113, 113, 0.12); font-weight: 600;' : '';

        return `
            <tr style="${rowStyle}">
                <td>${start + idx + 1}</td>
                <td><strong>${c.country}</strong> ${isTh ? '<span class="badge" style="background:#f87171; color:#fff; font-size:10px;">TH</span>' : ''}</td>
                <td><code>${c.iso3}</code></td>
                <td><strong>${c.total_score}</strong></td>
                <td>${c.obstacles}</td>
                <td>${c.limits}</td>
                <td style="${c.rights <= 10 ? 'color: var(--accent-red); font-weight: 600;' : ''}">${c.rights}</td>
                <td><span class="${badgeClass}">${c.status}</span></td>
            </tr>
        `;
    }).join('');

    if (info) {
        const end = Math.min(start + freedomState.pageSize, total);
        info.textContent = `กำลังแสดง ${total > 0 ? start + 1 : 0}-${end} จาก ${total} ประเทศ`;
    }
    if (prevBtn) prevBtn.disabled = freedomState.page <= 1;
    if (nextBtn) nextBtn.disabled = freedomState.page >= maxPage;
}

function changeFreedomPage(dir) {
    freedomState.page += dir;
    updateFreedomTable();
}
