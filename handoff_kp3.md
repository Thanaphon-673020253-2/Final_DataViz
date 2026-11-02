# Dashboard Specification: Digital Threats & Internet Freedom (3-Tab Interactive & Statistical Edition)

## 0. ภาพรวมระบบแดชบอร์ดแบบเชื่อมโยงและสถิติ (Interactive & Statistical Architecture)

เอกสารฉบับนี้เป็นข้อกำหนดการออกแบบ Dashboard 3 แท็บ ในโทนสี **Pastel Visual Theme** ที่เพิ่มระบบ **Dynamic Interactivity & Cross-Filtering** (เมื่อคลิกที่กราฟใด กราฟและตารางอื่นในแท็บจะปรับอัปเดตข้อมูลตามทันที) พร้อมการระบุ **ตัวเลขสถิติ (Direct Data Labels & Statistical Metrics)** บนทุก visual element อย่างแม่นยำ

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                GLOBAL FILTER BAR ( Top Bar )                             │
│  [📅 ช่วงเวลา (Year/Range)]   [🌏 ภูมิภาค/ประเทศ (Scope)]   [⚠️ ระดับความเสี่ยง/ความรุนแรง]   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                             │ (ส่งผลกระทบต่อทุกแท็บและทุกชุดข้อมูล)
                                             ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                    MASTER OVERARCHING PROBLEM STATEMENT & ANALYSIS                      │
│ "สังคมไทยและระดับโลกกำลังเผชิญภัยคุกคามดิจิทัลในมิติใดบ้าง ผลกระทบเชิงเศรษฐกิจเกิดขึ้นอย่างไร  │
│  มีค่าเฉลี่ย/ความเสียหายเท่าใด และสัมพันธ์กับเสรีภาพรวมถึงความเสี่ยง AI อย่างไร?"               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         ▼                                   ▼                                   ▼
┌─────────────────────────┐         ┌─────────────────────────┐         ┌─────────────────────────┐
│          TAB 1          │         │          TAB 2          │         │          TAB 3          │
│ Visual Overview & Threat│         │ Thailand Threat Linkage │         │ Global AI Risks &       │
│ Landscape (Cross-Filter)│         │ & Financial Impact      │         │ Freedom Context         │
└─────────────────────────┘         └─────────────────────────┘         └─────────────────────────┘
 (Cross-Filtering: คลิกส่วน   (Interactive Link: AFNC      (Interactive Link: AI DB 
  ใด กราฟอื่นไฮไลต์ทันที)     Fake News ↔ ACSC Scams)        Incident ↔ Freedom House)
```

---

## 1. ระบบฟิลเตอร์และการเชื่อมโยงข้อมูล (Global & Cross-Filtering Engine)

### 1.1 Global Filter Bar (ระดับแดชบอร์ด — ส่งผลกระทบทุกแท็บ)
วางอยู่ส่วนบนสุดของ Dashboard (Header Area) ควบคุมการกรองข้อมูลทั้ง 4 Datasets พร้อมกัน:

1. **Time Horizon Picker (ตัวเลือกช่วงเวลา):** 
   * **Control:** Date Range Slider / Multi-year Dropdown (`Year`: 2020 – 2024 / `Month` / `Week`)
   * **Global Behavior:** เมื่อเปลี่ยนช่วงเวลา ทุกกราฟในทุกแท็บจะ Re-query คำนวณค่าสถิติ ($N$, Sum, Average, Growth Rate) ใหม่ทันที
2. **Geographic Scope (ขอบเขตภูมิภาค):**
   * **Control:** Dropdown [ global | Thailand | ASEAN | Select Country ]
   * **Global Behavior:** ปรับบริบทจากภาพรวมโลกเป็นประเทศไทย หรือเปรียบเทียบในระดับภูมิภาค
3. **Data Quality & Flag Filter (ตัวกรองคุณภาพข้อมูล):**
   * **Control:** Toggle [ Show All Data | Validated Rows Only ]

### 1.2 Interactive Cross-Filtering (ระดับแท็บ — คลิกกราฟเพื่อกรองกราฟอื่น)
ใช้วิธี **Bidirectional Interactive Filtering** เมื่อผู้ใช้คลิกเลือก Element (Bar, Line Point, Map Region, Stack Segment) ในกราฟใดกราฟหนึ่ง:

* **Active State:** Element ที่ถูกเลือกจะแสดงสีพาสเทลความเข้มสูง พร้อมเส้นขอบเน้น (`Stroke Width: 2px`, `#2563EB`)
* **Filtered/Dimmed State:** Element ในกราฟอื่นที่ไม่เกี่ยวข้องจะลดความสว่างลง (Opacity ลดเหลือ `30%`)
* **Calculated Metrics Refresh:** KPI Cards, Direct Data Labels และตาราง Detail ด้านล่างจะรีเฟรชคำนวณตัวเลขสถิติใหม่เฉพาะ Sub-group ที่ถูกเลือก (Selected Sub-dataset)
* **Reset Trigger:** คลิกพื้นที่ว่างในกราฟ หรือกดปุ่ม `Reset Selection` มุมขวาบนของกราฟ เพื่อปลดล็อก Cross-filter

### 1.3 กลไกการเชื่อมโยงข้อมูลข้าม Dataset (Common Data Keys Strategy)

เพื่อเปิดให้ Cross-filtering ทำงานข้าม Dataset ได้อย่างสมบูรณ์ ระบบจะสร้าง **Calculated Bridge Keys** ดังนี้:

| Data Key Name | ชนิดข้อมูล | Dataset A | Dataset B | วัตถุประสงค์การเชื่อมโยง (Cross-Filter Logic) |
| --- | --- | --- | --- | --- |
| `time_year_month` | String (`YYYY-MM`) | AFNC (`date`) | ACSC (`week_start`) | ซิงค์แนวโน้มรายเดือนระหว่างข่าวปลอมกับคดีหลอกลวง |
| `threat_category_bridge` | Category Enum | AFNC (`category`) | ACSC (`top_type_th`) | จับคู่ประเภทภัย เช่น *"การเงิน/การลงทุน"* ↔ *"Scam การลงทุน"* |
| `iso3_country` | String (ISO-3) | Freedom House (`Country`) | AI Incident DB (`Country`) | เชื่อมโยงระดับเสรีภาพกับสถานที่เกิดเหตุการณ์ AI Risk |

---

## 2. ข้อกำหนดตัวเลขสถิติและการแสดงค่าบนกราฟ (Statistical Data Labels & Callouts)

เพื่อไม่ให้กราฟเป็นเพียงภาพวาดสวยงาม ทุกกราฟ **ต้องกำกับตัวเลขสถิติเชิงปริมาณ (Data Labels & Callout Metrics)** ตามหลักเกณฑ์ดังนี้:

### 2.1 หลักการติด Data Labels บนกราฟ (Direct Labeling Rules)
1. **Absolute Values ($N$) & Percentages ($\%$):** กราฟแท่ง (Bar Chart) และ 100% Stacked Bar ต้องติดตัวเลขจำนวน ($N$) และสัดส่วน ($\%$) กำกับที่ปลายแท่งหรือกึ่งกลางแท่งเสมอ
2. **End-of-Line & Peak Labels:** กราฟเส้น (Line Chart) ต้องระบุตัวเลขที่ **จุดล่าสุด (Current Value)**, **จุดสูงสุด (Peak Value)** และ **จุดต่ำสุด (Trough Value)**
3. **Number Formatting Standards:**
   * **จำนวนคน/ข่าว/คดี:** ใช้เครื่องหมายจุลภาค เช่น `1,245 รายการ`
   * **มูลค่าเงินบาท (Financial Loss):** ใช้ย่อหน่วยสถิติ เช่น `฿45.2M` (ล้านบาท) หรือ `฿1.2B` (พันล้านบาท) พร้อมแสดงเลขเต็มใน Tooltip `฿45,210,500 บาท`
   * **คะแนนเสรีภาพ (Freedom Score):** แสดงทศนิยม 1 ตำแหน่ง เช่น `54.0 / 100`
   * **อัตราการเปลี่ยนแปลง (Percentage Change):** แสดงพร้อมสัญลักษณ์ เช่น `▲ +14.2% YoY` (สีแดง/ชมพูพาสเทล) หรือ `▼ -5.8% MoM` (สีเขียวพาสเทล)

### 2.2 การคำนวณและแสดงค่าทางสถิติย่อ (Summary Statistical Callouts)
ทุกการ์ดกราฟจะมี **Stat Badge** ขนาดเล็กมุมขวาบน เพื่ออธิบายค่าทางสถิติของข้อมูลที่กำลังแสดง เช่น:
* $\text{Mean} (\mu)$: ค่าเฉลี่ยต่อสัปดาห์/เดือน
* $\text{Median} (\tilde{x})$: ค่ามัธยฐานความเสียหายต่อคดี (`Loss per Case`)
* $\text{Total Sample} (N)$: จำนวนประชากรข้อมูลทั้งหมดที่อยู่ใน Filter ปัจจุบัน

---

## 3. ข้อกำหนดธีมและสไตล์ (Pastel Visual & Interactive State Theme)

ออกแบบในโทนพาสเทลสบายตา อ่านง่าย ตัวหนังสือคมชัด พร้อมกำหนดสถานะการตอบสนองเชิงโต้ตอบ (Interactive States)

### 3.1 Palette & Color Codes (รหัสสีและสถานะโต้ตอบ)

| ส่วนประกอบ | รหัสสี (Hex Code) | สถานะปกติ (Default) | สถานะเมื่อถูกเลือก (Active Focus) | สถานะไม่ถูกเลือก (Dimmed) |
| --- | --- | --- | --- | --- |
| **Main Background** | `#F8F9FA` | Off-white | - | - |
| **Card Background** | `#FFFFFF` | Border: `#E5E7EB` | Border: `#2563EB` (Shadow) | Opacity: `80%` |
| **Primary Text** | `#2C3E50` | Slate Grey (High Contrast) | `#0F172A` (Bold) | `#94A3B8` |
| **AFNC / Fake Verdict** | `#FADBD8` | Soft Rose | `#E6B0AA` (Stroke: `#C0392B`) | Opacity: `30%` |
| **ACSC Scams / Cases** | `#D6EAF8` | Pastel Sky Blue | `#85C1E9` (Stroke: `#2980B9`) | Opacity: `30%` |
| **Financial Loss Metric**| `#FCF3CF` | Soft Amber Peach | `#F7DC6F` (Stroke: `#D68910`) | Opacity: `30%` |
| **AI Risks / Intent** | `#EBDEF0` | Soft Lavender | `#BB8FCE` (Stroke: `#8E44AD`) | Opacity: `30%` |
| **Freedom High / True** | `#D4EFDF` | Soft Sage Mint | `#7DCEA0` (Stroke: `#27AE60`) | Opacity: `30%` |

---

## 4. TAB 1 — Visual Overview & Interactive Threat Landscape

### 4.1 เป้าหมายประจำแท็บ
ตอบคำถาม: *"เมื่อมองภาพรวม ตัวชี้วัดสำคัญของภัยดิจิทัลทั้ง 4 ด้านมีแนวโน้ม สถิติรวม และโครงสร้างความเสี่ยงอย่างไร?"* (เน้น **Visual-Heavy & Interactive Cross-Filtering**)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  [KPI 1: Checked Items]   [KPI 2: Scam Cases]   [KPI 3: Financial Loss]  [KPI 4: AI Incidents]  │
│  N = 4,520 (▲12.4%)       N = 18,240 cases      ฿ 1.45B (Avg 80K/case)   N = 340 events         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────┬──────────────────────────────────────────┐
│ CHART 1.1: Multi-Dataset Trend Preview       │ CHART 1.2: Threat Category Breakdown     │
│ (Line Chart with Peak/Trough Labels)         │ (Interactive Horizontal Bar Chart)       │
│ * Action: คลิกจุดบนเส้น เพื่อกรอง Chart 1.2    │ * Action: คลิกแท่งประเภทภัย เพื่อกรอง    │
│   และ KPI Cards                              │   Chart 1.1, Map และ Detail Table        │
└──────────────────────────────────────────────┴──────────────────────────────────────────┘
┌──────────────────────────────────────────────┬──────────────────────────────────────────┐
│ CHART 1.3: Risk Distribution Sparklines      │ CHART 1.4: Freedom Index Map Snap        │
│ (Micro-Bar with Direct % Labels)             │ (Interactive Choropleth World Map)       │
└──────────────────────────────────────────────┴──────────────────────────────────────────┘
```

### 4.2 รายละเอียดกราฟและตัวเลขสถิติ (Chart Specifications & Statistics)

#### 1. CHART 1.1 — Multi-Dataset Time Series Trend Preview
* **ประเภท:** Interactive Line Chart (Dual Y-Axis แบบ Normalized Metric)
* **ชุดข้อมูล:** AFNC (จำนวนเรื่อง) + ACSC (จำนวนคดี)
* **ตัวเลขสถิติที่ระบุบนกราฟ (Data Labels):**
  * ติด Data Label ตัวเลขยอดรวมปลายเส้น ($N_{\text{current}}$)
  * ติดป้าย **Peak Annotation** แสดงจุดสัปดาห์/เดือนที่มีคดีสูงสุด เช่น `Peak: 2,450 คดี (สัปดาห์ที่ 42)`
  * แสดงค่าเฉลี่ยเคลื่อนที่ ($\mu_{\text{monthly}}$) เป็นเส้นประพาสเทล
* **Cross-Filtering Interaction:**
  * **Click Line Data Point:** คลิกที่เดือนใดเดือนหนึ่ง $\rightarrow$ **Chart 1.2** (ประเภทภัย) และ **KPI Cards** จะอัปเดตแสดงเฉพาะสถิติของเดือนนั้นทันที

#### 2. CHART 1.2 — Threat Category Breakdown (Horizontal Bar Chart)
* **ประเภท:** Horizontal Bar Chart แบบแยกหมวดหมู่ภัยรวม (Threat Taxonomy)
* **ตัวเลขสถิติที่ระบุบนกราฟ (Data Labels):**
  * แสดง **จำนวนคดี ($N$)** และ **เปอร์เซ็นต์สัดส่วน ($\%$)** ปลายแท่ง เช่น `หลอกลงทุน: 5,420 คดี (34.2%)`
* **Cross-Filtering Interaction:**
  * **Click Bar Segment:** คลิกที่แท่ง *"หลอกลงทุน"* $\rightarrow$ **Chart 1.1** จะกรองเส้นกราฟแสดงเฉพาะ Trend ของภัยหลอกลงทุน, **KPI Card 3** จะเปลี่ยนแสดงเฉพาะยอดความเสียหายของการหลอกลงทุน

#### 3. CHART 1.4 — Freedom Index Geographic Snap (Choropleth Map)
* **ประเภท:** Interactive World Map (Pastel Gradient)
* **ตัวเลขสถิติที่ระบุบนกราฟ (Data Labels):**
  * แสดงคะแนนสถิติเฉลี่ยรายภูมิภาค บน Legend และแสดงคะแนน `Score: XX.X` เมื่อ Hover/Click
* **Cross-Filtering Interaction:**
  * **Click Country (เช่น Thailand):** ปรับการ์ดสรุปสถิติเสรีภาพของไทยทันที

---

## 5. TAB 2 — Thailand Threats & Economic Impact (AFNC + ACSC Linkage)

### 5.1 ปัญหาหลักประจำแท็บ
*"ข่าวปลอมและคดีการหลอกลวงออนไลน์ในไทยมีความสัมพันธ์ตามช่วงเวลาอย่างไร หมวดหมู่ใดสร้างความเสียหายทางการเงิน ($฿$) สูงสุด และส่งผลกระทบต่อคดีเฉลี่ยเท่าใด?"*

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  [Stat Summary Banner] Total Scams: 18,240 | Total Loss: ฿1.45 Billion | Avg/Case: ฿79,500   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ CHART 2.1: Synchronized Time Series — AFNC Verification vs ACSC Scam Cases              │
│ (Dual Panel Line Chart with Peak/Trough & Event Annotations)                             │
│ * Interactivity: ลาก Brush Selection ช่วงเวลา เพื่อ Filter กราฟ 2.2, 2.3, 2.4 พร้อมกัน      │
└─────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────┬──────────────────────────────────────────┐
│ CHART 2.2: AFNC Verdict Composition          │ CHART 2.3: Financial Loss vs Case Volume │
│ (100% Stacked Bar with Direct % Labels)      │ (Dual Horizontal Bar Chart with ฿ Values)│
│ * Action: คลิกสี Fake/True เพื่อ Filter ACSC │ * Action: คลิกประเภท Scam เพื่อ Filter   │
│   คดีที่เกี่ยวข้อง                           │   ความเสียหายรายสัปดาห์                  │
└──────────────────────────────────────────────┴──────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ TABLE 2.4: Interactive Weekly Detail & Case Explorer Table                              │
│ (ตารางข้อมูลจริง พร้อม Highlight สถิติค่าความเสียหายต่อคดี Loss per Case > ฿100K)              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 รายละเอียดกราฟ ตัวเลขสถิติ และ Cross-Filtering Logic

#### 1. CHART 2.1 — Synchronized Time Series (AFNC vs ACSC)
* **ประเภท:** Dual Panel Synchronized Line Chart (แผงบน: ข่าวปลอม AFNC / แผงล่าง: คดี ACSC)
* **ตัวเลขสถิติที่ระบุบนกราฟ:**
  * แผงบน: ติด Data Label จุดสูงสุดข่าวปลอม ($N_{\text{max}}$) พร้อมระบุ Verdict
  * แผงล่าง: ติด Data Label มูลค่าเงินสูงสุด ($฿_{\text{max}}$) บนจุดยอดคดี
  * แสดงค่าเฉลี่ยรายสัปดาห์ ($\bar{x}_{\text{cases}}$ และ $\bar{x}_{\text{loss}}$)
* **Interactive Filtering:**
  * **Brush Time Selection:** ผู้ใช้สามารถคลิกลากเลือกช่วงสัปดาห์บนกราฟ $\rightarrow$ ทุกกราฟใน Tab 2 จะคำนวณสถิติมูลค่าความเสียหายย่อยตามช่วงเวลานั้นทันที

#### 2. CHART 2.2 — AFNC Verdict Composition (100% Stacked Bar Chart)
* **ประเภท:** 100% Stacked Bar Chart รายเดือน
* **ตัวเลขสถิติที่ระบุบนกราฟ:**
  * ติดตัวเลขเปอร์เซ็นต์ ($\%$) ในทุก Stack Segment เช่น `Fake: 62.5% ($N=450$)`, `Distorted: 22.1% ($N=159$)`, `True: 15.4% ($N=111$)`
* **Interactive Filtering:**
  * **Click Segment (เช่น คลิกเลือก Fake):** กราฟ 2.3 และ ตาราง 2.4 จะถูกกรองให้แสดงเฉพาะประเภทคดีหลอกลวงที่มีความเชื่อมโยงกับข่าวปลอมประเภท Fake เท่านั้น

#### 3. CHART 2.3 — Financial Loss vs Case Volume by Scam Type (Dual Horizontal Bar)
* **ประเภท:** Grouped Horizontal Bar Chart (เปรียบเทียบ 2 Metric: จำนวนคดี $N$ vs มูลค่าความเสียหาย $฿$)
* **ตัวเลขสถิติที่ระบุบนกราฟ:**
  * แท่งที่ 1 (จำนวนคดี): ติดตัวเลข `N = X,XXX คดี (XX.X%)` (สีฟ้าพาสเทล `#85C1E9`)
  * แท่งที่ 2 (ความเสียหาย): ติดตัวเลข `฿XX.X ล้านบาท` (สีส้มพีชพาสเทล `#F7DC6F`)
  * Callout Badge: แสดงสถิติ **Loss per Case (ความเสียหายเฉลี่ยต่อคดี)** เช่น `เฉลี่ย ฿245,000 / คดี`
* **Interactive Filtering:**
  * **Click Scam Type Bar (เช่น คลิก "หลอกลงทุน"):** 
    * กราฟ 2.1 จะ Highlight เฉพาะเส้น Trend ความเสียหายของการหลอกลงทุน
    * ตาราง 2.4 จะ Filter แสดงเฉพาะ Row คดีหลอกลงทุน

#### 4. TABLE 2.4 — Interactive Detail Table & Case Explorer
* **คอลัมน์:** `week_start` | `cases` | `loss_baht` | `loss_per_case_baht` | `top_type_th` | `afnc_verdict_ratio`
* **Statistical Indicators:** 
  * แสดงแถบสีพาสเทลจาง (Data Bars) ใน Cell คอลัมน์ `loss_baht` เพื่อเปรียบเทียบระดับความเสียหายเชิงมิติสถิติ
  * Highlight สีชมพูพาสเทลในแถวที่มี `loss_per_case_baht` สูงกว่าค่ามัธยฐาน ($\tilde{x} > \text{Threshold}$)

---

## 6. TAB 3 — Global AI Risks & Internet Freedom Context (AI DB + Freedom House Link)

### 6.1 ปัญหาหลักประจำแท็บ
*"เหตุการณ์ความเสี่ยงจาก AI ในระดับโลกมีสถิติและรูปแบบใด และประเทศไทยมีระดับเสรีภาพอินเทอร์เน็ตในมิติต่างๆ (Access, Content, User Rights) อยู่ ณ จุดใดเมื่อเทียบกับอาเซียนและระดับโลก?"*

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ CHART 3.1: Global Internet Freedom Map (Choropleth Map with Score Color Gradient)        │
│ * Action: คลิกประเทศบนแผนที่เพื่อ Filter คะแนน 3 Components (3.2) และ AI Incidents (3.4)  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────┬──────────────────────────────────────────┐
│ CHART 3.2: Thailand vs ASEAN Freedom Scores  │ CHART 3.3: Freedom Component Breakdown   │
│ (Horizontal Bar Chart with Score Data Labels)│ (Grouped Bar Chart with Mean Benchmark)  │
│ * Stat Label: Thailand: 39/100 (Not Free)    │ * Stat Label: Access: 12/25, Content: ...│
└──────────────────────────────────────────────┴──────────────────────────────────────────┘
┌──────────────────────────────────────────────┬──────────────────────────────────────────┐
│ CHART 3.4: AI Incidents by Year & Intent     │ CHART 3.5: Risk Domain × Intent Matrix   │
│ (Line Chart with Growth Rate % Labels)       │ (Heatmap with Incident Count N Labels)   │
│ * Action: คลิกจุดปี เพื่อ Filter Heatmap 3.5 │ * Action: คลิก Cell Risk เพื่อดูรายละเอียด│
└──────────────────────────────────────────────┴──────────────────────────────────────────┘
```

### 6.2 รายละเอียดกราฟ ตัวเลขสถิติ และ Cross-Filtering Logic

#### 1. CHART 3.1 — Global Internet Freedom Map (Choropleth Map)
* **ประเภท:** Choropleth World Map
* **ตัวเลขสถิติที่ระบุบนกราฟ:**
  * Legend ระบุช่วงคะแนนสถิติชัดเจน (0-39 Not Free: ชมพูพาสเทล / 40-69 Party Free: เหลืองพาสเทล / 70-100 Free: เขียวพาสเทล)
  * Display Banner: `Global Mean Score: 58.4/100` | `Thailand Score: 39.0/100`
* **Interactive Filtering:**
  * **Click Country (เช่น คลิก Thailand หรือ Vietnam):** 
    * **Chart 3.2 & 3.3** จะเปลี่ยนแสดงสถิติเปรียบเทียบคะแนนย่อยของประเทศนั้นทันที

#### 2. CHART 3.2 — Thailand vs ASEAN Freedom Score Comparison
* **ประเภท:** Horizontal Bar Chart
* **ตัวเลขสถิติที่ระบุบนกราฟ:**
  * ติดตัวเลขคะแนนสุทธิปลายแท่งทุกประเทศ เช่น `Singapore: 54/100`, `Thailand: 39/100`, `Myanmar: 12/100`
  * แสดงเส้นประพาสเทลค่าเฉลี่ยอาเซียน ($\mu_{\text{ASEAN}} = 41.2$)
* **Interactive Filtering:**
  * **Click Country Bar:** อัปเดตกราฟ 3.3 แสดงการเจาะลึกคะแนน 3 Components ของประเทศนั้น

#### 3. CHART 3.3 — Freedom Component Breakdown (3 Dimensions)
* **ประเภท:** Grouped Bar Chart เปรียบเทียบ 3 มิติย่อย:
  1. Obstacles to Access (เต็ม 25)
  2. Limits on Content (เต็ม 35)
  3. Violations of User Rights (เต็ม 40)
* **ตัวเลขสถิติที่ระบุบนกราฟ:**
  * ติดตัวเลขคะแนนจริงและเปอร์เซ็นต์ย่อย เช่น `User Rights: 10/40 (25.0%)` (สีชมพูพาสเทล `#FADBD8`)

#### 4. CHART 3.4 — AI Incident Trends by Intent (Line Chart)
* **ประเภท:** Line Chart (แยกตาม Intent: Malicious vs Unintended)
* **ตัวเลขสถิติที่ระบุบนกราฟ:**
  * ติด Data Label จำนวนเหตุการณ์ ($N$) ทุกจุดปี
  * ติดป้ายอัตราการเติบโต YoY ($\% \Delta$) เช่น `2023: N=112 (▲+35.8% YoY)`
* **Interactive Filtering:**
  * **Click Year Point:** กราฟ 3.5 (Heatmap) จะกรองแสดงเฉพาะสถิติสัดส่วนความเสี่ยง AI ของปีนั้น

#### 5. CHART 3.5 — Risk Domain × Intent Matrix (Heatmap)
* **ประเภท:** Interactive Matrix Heatmap (Rows: Risk Domain / Columns: Intent)
* **ตัวเลขสถิติที่ระบุบนกราฟ:**
  * ระบุตัวเลขจำนวนเหตุการณ์จริง ($N$) ตรงกลางทุก Cell เช่น `Disinformation × Malicious: N = 48`
* **Interactive Filtering:**
  * **Click Cell:** แสดง Popup Case Study Table ขนาดเล็ก เจาะลึกเหตุการณ์ AI Risk ในกลุ่มนั้น

---

## 7. ตารางสรุปการจับคู่ชุดข้อมูล คอลัมน์ ตัวเลขสถิติ และการเชื่อมโยง (Data & Interactive Matrix)

| Tab | Research Question / ปัญหาที่ต้องการตอบ | Dataset หลัก | คอลัมน์ที่ใช้งานจริง | ตัวเลขสถิติที่ต้องระบุบนกราฟ (Data Labels) | Interactivity & Cross-Filter Trigger |
| --- | --- | --- | --- | --- | --- |
| **Tab 1** | สถิติภาพรวมภัย 4 ด้านมีแนวโน้มอย่างไร? | รวม 4 Datasets | Metrics สรุปรายไฟล์ | $N_{\text{total}}$, Peak Value, $\mu_{\text{monthly}}$, YoY % | คลิกจุดเวลา $\rightarrow$ กรองหมวดหมู่ภัยและ KPI |
| **Tab 1** | สดส่วนหมวดหมู่ภัยดิจิทัลในภาพรวม | AFNC + ACSC | `item_type`, `top_type_th` | Count ($N$), Percentage Ratio ($\%$) | คลิกแท่งภัย $\rightarrow$ กรองเส้น Trend และแผนที่ |
| **Tab 2** | ข่าวปลอมและคดีหลอกลวงสอดคล้องกันหรือไม่? | AFNC + ACSC | `date`, `week_start`, `cases` | $N_{\text{max}}$, $฿_{\text{max}}$, $\bar{x}_{\text{cases}}$, $\bar{x}_{\text{loss}}$ | Brush เลือกช่วงเวลา $\rightarrow$ กรองทุกกราฟใน Tab 2 |
| **Tab 2** | สัดส่วนผลตรวจสอบข่าวปลอม (Verdict) | AFNC | `date`, `verdict` | Segment Percentages ($\%$), Sub-total ($N$) | คลิกสี Verdict $\rightarrow$ กรองคดี ACSC ที่เกี่ยวข้องกัน |
| **Tab 2** | Scam ประเภทใดมีคดีสูง vs Loss สูง? | ACSC | `top_type_th`, `cases`, `loss_baht` | `N คดี`, `฿ ล้านบาท`, `Loss per Case (฿/คดี)` | คลิกแท่งประเภทคดี $\rightarrow$ กรองตาราง Detail 2.4 |
| **Tab 3** | เสรีภาพอินเทอร์เน็ตทั่วโลกเป็นอย่างไร? | Freedom House | `Country`, `total_score` | Score (0-100), Global Mean ($\mu$), Regional Rank | คลิกประเทศ $\rightarrow$ กรองคะแนนย่อยและ AI Risks |
| **Tab 3** | คะแนนเสรีภาพไทยเทียบ ASEAN | Freedom House | `Country`, `total_score`, `Year` | Exact Scores, ASEAN Benchmark Mean ($\mu_{\text{ASEAN}}$) | คลิกแท่งประเทศ $\rightarrow$ กรอง Component Breakdown |
| **Tab 3** | คะแนนย่อย 3 มิติด้านเสรีภาพของไทย | Freedom House | `Year`, 3 Component fields | Score / Max Score, Component Ratio ($\%$) | Hover/Click $\rightarrow$ แสดงรายละเอียดสิทธิที่ถูกจำกัด |
| **Tab 3** | แนวโน้มเหตุการณ์ความเสี่ยง AI ระดับโลก | AI Incident DB | `Year`, `Intent` | Yearly Count ($N$), YoY Growth Rate ($\% \Delta$) | คลิกจุดปี $\rightarrow$ กรอง Heatmap Risk Domain |
| **Tab 3** | ความสัมพันธ์ระหว่าง Risk Domain × Intent | AI Incident DB | `Risk Domain`, `Intent` | Incident Count ($N$) ต่อ Cell ใน Heatmap | คลิก Cell $\rightarrow$ เปิด Case Study Modal Popup |

---

## 8. AI Prompt Disclosure (พรอมพ์ AI ที่ใช้ในการอัปเดตระบบ)

เพื่อความโปร่งใสในกระบวนการพัฒนาระบบและการวิเคราะห์ ข้อมูลในเอกสารฉบับนี้ถูกปรับปรุงโดยใช้คำสั่ง AI Prompt ดังต่อไปนี้:

```text
[SYSTEM PROMPT / USER INSTRUCTION]
"ช่วยแก้ไขและอัปเดตเอกสาร Markdown (graph_spec_3tabs_pastel.md) โดยมีข้อกำหนดเพิ่มเติมดังนี้:
1. ปรับเพิ่มระบบ Interactivity & Cross-Filtering: เมื่อผู้ใช้คลิกเลือกข้อมูลบนกราฟใด กราฟอื่นๆ และตารางในแท็บต้องปรับอัปเดตข้อมูลตามกันอย่างสอดคล้อง (Bidirectional Interactive Filtering)
2. เพิ่มการกำหนดระบบ Global Filter Bar ด้านบนสุด ที่สามารถกรองข้อมูลช่วงเวลา (Time Horizon Picker), ภูมิภาค (Geographic Scope) และคุณภาพข้อมูล (Data Quality) ซึ่งส่งผลกระทบต่อทุกแท็บและทุก Dataset
3. กำหนดตัวเลขสถิติ (Direct Data Labels & Statistical Metrics) ลงบนทุกกราฟอย่างชัดเจน เช่น จำนวนประชากรข้อมูล (N), สัดส่วนเปอร์เซ็นต์ (%), มูลค่าความเสียหายเงินบาท (฿M/฿B), ค่าเฉลี่ย (Mean μ), ค่ามัธยฐาน (Median), อัตราการเติบโต (% YoY) และจุดสูงสุด/ต่ำสุด (Peak/Trough Annotations)
4. คงโครงสร้าง 3 แท็บหลัก และ Pastel Visual Theme ( hex codes, opacity states, high contrast text) พร้อมแสดง Active Selection Focus State เมื่อกราฟถูกคลิก
5. อัปเดตตาราง Data Inventory Matrix ให้ระบุคอลัมน์ สถิติที่ต้องแสดงบนกราฟ และกลไก Interactive Cross-Filter Trigger สำหรับแต่ละ visual element"
```