# Dashboard Specification: Digital Threats & Internet Freedom (3-Tab Pastel Edition)

---

## 0. ภาพรวมการปรับปรุงโครงสร้าง (3-Tab Architecture)

เอกสารนี้ปรับโครงสร้างแดชบอร์ดให้เหลือ **3 แท็บหลัก** (ตัดหน้าสรุปแยกต่างหากออก) โดยยุบรวมชุดข้อมูลที่มีจุดเชื่อมโยง (Data Linking/Correlation Context) เข้าด้วยกันอย่างเป็นระบบ และกำหนด Visual Style เป็น **Pastel Theme**

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                    MASTER OVERARCHING PROBLEM STATEMENT                    │
 │ "สังคมไทยและระดับโลกกำลังเผชิญภัยคุกคามดิจิทัลในมิติใดบ้าง ผลกระทบเชิงเศรษฐกิจ  │
 │  เกิดขึ้นอย่างไร และสัมพันธ์กับบริบทเสรีภาพรวมถึงเทคโนโลยี AI อย่างไร?"          │
 └─────────────────────────────────────────────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│     TAB 1       │           │     TAB 2       │           │     TAB 3       │
│ Visual Overview │           │ Thailand Threat │           │ Global AI Risks │
│  & Landscape    │           │ & Financial Loss│           │ & Freedom Context│
└─────────────────┘           └─────────────────┘           └─────────────────┘
 (Visual-Heavy /               (AFNC Fake News +             (AI Incident DB +
 Charts Focus)                  ACSC Scams Link)              Freedom House Link)
```

---

## 1. ข้อกำหนดธีมและสไตล์ (Pastel Visual Theme Specification)

กำหนดการดีไซน์โทนสีพาสเทล (Pastel Palette) ตามภาพตัวอย่าง เพื่อให้ Dashboard มีความนุ่มนวล สบายตา อ่านง่าย แต่ยังคงความเปรียบต่าง (Contrast) ของข้อมูลอย่างชัดเจน

### 1.1 Palette & Color Codes (รหัสสีหลัก)

| ส่วนประกอบ | ชื่อสี | Hex Code | การนำไปใช้ |
| :--- | :--- | :--- | :--- |
| **Main Background** | Soft Cream/Off-White | `#F8F9FA` | พื้นหลังหลักของแดชบอร์ด |
| **Card Background** | Pure White | `#FFFFFF` | การ์ดรองรับกราฟและ KPI |
| **Primary Text** | Dark Slate | `#2C3E50` | หัวข้อและตัวหนังสือหลัก (อ่านง่ายบนพาสเทล) |
| **Secondary Text** | Muted Grey | `#7F8C8D` | คำอธิบาย แกนกราฟ และ Subtitle |
| **Accent Pink** | Soft Rose | `#FADBD8` / `#E6B0AA` | AFNC / ข่าวปลอม / Fake Verdict |
| **Accent Mint/Teal** | Soft Sage Mint | `#D4EFDF` / `#7DCEA0` | True Verdict / Safety / Freedom High |
| **Accent Blue** | Pastel Sky Blue | `#D6EAF8` / `#85C1E9` | Scam Cases / AI Incidents / Obstacles |
| **Accent Lavender** | Soft Lavender | `#EBDEF0` / `#BB8FCE` | AI Risks / Limits on Content |
| **Accent Peach/Yellow** | Soft Amber Peach | `#FCF3CF` / `#F7DC6F` | Financial Loss / Distorted Verdict |
| **Border & Card Shadow**| Soft Border Grey | `#E5E7EB` | เส้นขอบการ์ดมน (Border-radius: 12px) |

### 1.2 Principles for Pastel Charts

1. **High Contrast Text & Labels:** ใช้สีข้อความเข้ม (`#2C3E50`) บนพื้นหลังพาสเทล ห้ามใช้ตัวหนังสือสีอ่อน
2. **Distinct Categorical Colors:** ใช้สีพาสเทลต่างโทน (เช่น ชมพู vs ฟ้า vs เขียวพาสเทล) เพื่อแยก Category ของกราฟ ไม่ให้กลืนกัน
3. **Soft Grid Lines:** เส้นตารางในกราฟใช้สีเทาจางมาก (`#F2F4F4`) เพื่อเน้นตัวเส้นกราฟและแท่งข้อมูล
4. **Rounded Elements:** กราฟแท่ง (Bar Chart) มีความโค้งมนที่ปลายแท่ง (Border Radius 4px-6px)

---

## 2. TAB 1 — Overview: Digital Threat Landscape (ภาพรวมภัยดิจิทัล)

### 2.1 เป้าหมายและแนวคิด
* **แนวคิด:** เน้น **Visual-Heavy** (เน้นกราฟและ Card ไม่ใช้อักษรอธิบายยืดยาว)
* **ปัญหาหลักประจำแท็บ:** 
  > *"เมื่อมองภาพรวม ตัวชี้วัดสำคัญของภัยดิจิทัลทั้ง 4 ด้านมีแนวโน้มและขนาดของปัญหาในเชิงโครงสร้างอย่างไร?"*

### 2.2 ชุดข้อมูลและคอลัมน์ที่ใช้ (Datasets & Columns Used)

| Dataset | คอลัมน์ที่ใช้ (Key Columns) | Metric ที่สกัดมาแสดง |
| :--- | :--- | :--- |
| **AFNC** | `date`, `item_type` | จำนวนรายการที่ถูกตรวจสอบรวม |
| **ACSC** | `week_start`, `cases`, `loss_baht` | จำนวนคดีรวม และ มูลค่าความเสียหายรวม (บาท) |
| **AI Incident DB** | `Year` | จำนวนเหตุการณ์ AI ความเสี่ยงสูงรวม |
| **Freedom House** | `Country`, `total_score` | คะแนนเสรีภาพเน็ตของไทย และอันดับเฉลี่ย |

### 2.3 โครงสร้างการจัดวางกราฟ (Visual Layout)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [KPI Card 1: AFNC]   [KPI Card 2: ACSC Cases]  [KPI Card 3: ACSC Loss]  [KPI Card 4: AI Incidents] [KPI Card 5: Freedom Score] │
│ Color: Soft Rose     Color: Sky Blue           Color: Amber Peach       Color: Soft Lavender       Color: Sage Mint            │
└─────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────┬──────────────────────────────┐
│ CHART 1.1: Multi-Dataset Trend Preview       │ CHART 1.2: Threat Landscape  │
│ (Line Chart - Pastel Dual Metric Focus)       │ (Horizontal Bar Chart)       │
│ - AFNC Items vs ACSC Cases by Month          │ Conceptual Comparison        │
└──────────────────────────────────────────────┴──────────────────────────────┘
┌──────────────────────────────────────────────┬──────────────────────────────┐
│ CHART 1.3: Risk Distribution Sparklines      │ CHART 1.4: Geographic Snap   │
│ (Micro-Bar/Area Charts per Dataset)          │ (Mini Choropleth Map)        │
└──────────────────────────────────────────────┴──────────────────────────────┘
```

#### กราฟหลักใน Tab 1:
1. **KPI Cards (5 ใบ):** แสดงตัวเลขสรุปหลัก พร้อมสัญลักษณ์เปรียบเทียบ % การเปลี่ยนแปลง 
2. **Chart 1.1 — Key Time Trend (Line Chart):** 
   - **X-axis:** เดือน/ปี 
   - **Y-axis:** Count (แสดงเส้นจำนวนคดี ACSC และจำนวนเรื่อง AFNC แยกเส้นสีฟ้าสดพาสเทลกับสีชมพูพาสเทล)
3. **Chart 1.2 — Digital Threat Categories (Horizontal Bar Chart):** 
   - แสดงสัดส่วนประเภทภัยดิจิทัลในไทย (สกัดจาก AFNC + ACSC Top Category)
4. **Chart 1.4 — Freedom Index Geographic Snap (Choropleth Map):** 
   - แผนที่โลกพาสเทลแสดงระดับเสรีภาพอินเทอร์เน็ต (โทนเขียวพาสเทล = เสรี, ชมพูพาสเทล = ไม่เสรี)

---

## 3. TAB 2 — Thailand Threats & Economic Impact (ภัยดิจิทัลและผลกระทบในไทย)

### 3.1 เป้าหมายและแนวคิด
* **แนวคิด:** เชื่อมโยง **AFNC (ข่าวปลอม/ข้อมูลบิดเบือน)** เข้ากับ **ACSC (อาชญากรรมออนไลน์และความเสียหาย)** โดยอาศัยจุดเชื่อมโยงด้าน **ช่วงเวลา (Time Alignment)** และ **หมวดหมู่ภัยที่เกี่ยวข้องกัน (Category Overlap)** เช่น การหลอกลวงทางการเงิน (Financial Scams) กับ ข่าวปลอมด้านการเงิน/เศรษฐกิจ
* **ปัญหาหลักประจำแท็บ:**
  > *"ข่าวปลอม/ข้อมูลบิดเบือนกับคดีการหลอกลวงออนไลน์ในประเทศไทย มีความสอดคล้องกันตามช่วงเวลาอย่างไร และหมวดหมู่ใดสร้างความเสียหายทางการเงิน (Financial Loss) สูงสุด?"*

### 3.2 ชุดข้อมูลและคอลัมน์ที่ใช้ (Datasets & Columns Used)

```
[AFNC Dataset]                             [ACSC Dataset]
 ├── date (Date/Time) ─────── LINK ───────── ├── week_start (Date/Time)
 ├── verdict (Fake/Distorted/True)          ├── cases (Cases Count)
 ├── category (Topic Domain) ── LINK ─────── ├── top_type_th (Scam Category)
 └── item_type                               ├── loss_baht (Financial Impact)
                                             └── loss_per_case_baht
```

### 3.3 รายละเอียดกราฟและการเชื่อมโยง (Visual Specifications)

#### 1. กราฟ 2.1 — Verification Trend vs Scam Volume (Combined Time Series)
* **ประเภท:** Line Chart (Dual Panel / Stacked Time View)
* **การเชื่อมโยงข้อมูล:** ซิงค์แกน X (เวลา) ระหว่าง AFNC (ข่าวปลอม) และ ACSC (คดี Scam)
* **X-axis:** สัปดาห์ / เดือน
* **Y-axis (Top Panel):** จำนวนเรื่องข่าวปลอมแยกตาม Verdict (Fake = `#FADBD8`, Distorted = `#FCF3CF`, True = `#D4EFDF`)
* **Y-axis (Bottom Panel):** จำนวนคดีหลอกลวง ACSC (Cases = `#85C1E9`)
* **วัตถุประสงค์:** ตรวจสอบว่าช่วงที่มีข่าวปลอมระบาดสูง สอดคล้องกับช่วงที่คดีออนไลน์เพิ่มขึ้นหรือไม่

#### 2. กราฟ 2.2 — AFNC Verdict Composition (100% Stacked Bar Chart)
* **X-axis:** เดือน
* **Y-axis:** สัดส่วนผลการตรวจสอบ (%)
* **Series:** Fake (`#FADBD8`), Distorted (`#FCF3CF`), True (`#D4EFDF`)
* **วัตถุประสงค์:** ดูสัดส่วนความน่าเชื่อถือของข่าวสารในแต่ละช่วงเวลา

#### 3. กราฟ 2.3 — Financial Loss vs Case Volume by Scam Type (Grouped/Dual Horizontal Bar Chart)
* **ประเภท:** Horizontal Bar Chart (2 Metric Comparison)
* **Dimension:** ประเภทการหลอกลวง (`top_type_th`)
* **Metric 1 (Bar 1):** จำนวนคดี (`cases`) — สีฟ้าพาสเทล (`#85C1E9`)
* **Metric 2 (Bar 2):** มูลค่าความเสียหาย (`loss_baht`) — สีส้มพีชพาสเทล (`#F7DC6F`)
* **วัตถุประสงค์:** ตอบโจทย์สำคัญว่า **"ประเภทภัยที่มีคดีมากที่สุด อาจไม่ใช่ประเภทที่สร้างความเสียหายเงินสูงสุด"**

#### 4. กราฟ 2.4 — Topic Matrix: Disinformation Category vs Scam Types (Cross-Category Bar Chart)
* **Dimension:** หมวดหมู่ข่าวปลอม AFNC (`category`) เทียบกับ ประเภทคดี ACSC (`top_type_th`)
* **Metric:** จำนวนรายการ/คดี
* **วัตถุประสงค์:** เปรียบเทียบว่าหมวดหมู่ข่าวยอดฮิต (เช่น การเงิน/สุขภาพ) ตรงกับคดีการหลอกลวงประเภทใด

#### 5. ตาราง 2.5 — Interactive Case & Financial Loss Detail Table
* **คอลัมน์:** `week_start`, `cases`, `loss_baht`, `loss_per_case_baht`, `top_type_th`, `afnc_top_category`
* **Filter:** ช่วงเวลา, หมวดหมู่ภัย, ระดับความเสียหาย

---

## 4. TAB 3 — Global AI Risks & Internet Freedom Context (ความเสี่ยง AI & บริบทเสรีภาพ)

### 4.1 เป้าหมายและแนวคิด
* **แนวคิด:** เชื่อมโยง **AI Incident Database (ความเสี่ยง AI ระดับโลก)** เข้ากับ **Freedom on the Net (บริบทเสรีภาพอินเทอร์เน็ต)** เพื่อให้เห็นภาพระดับมหภาค (Macro View) ว่าความเสี่ยงทางเทคโนโลยีใหม่ๆ เกิดขึ้นภายใต้บริบทเสรีภาพและการกำกับดูแลของแต่ละประเทศอย่างไร
* **ปัญหาหลักประจำแท็บ:**
  > *"เหตุการณ์ความเสี่ยงจาก AI ในระดับโลกมีรูปแบบใด และประเทศไทยมีระดับเสรีภาพอินเทอร์เน็ต (Access, Content, User Rights) อยู่ในจุดใดเมื่อเทียบกับภูมิภาคและระดับโลก?"*

### 4.2 ชุดข้อมูลและคอลัมน์ที่ใช้ (Datasets & Columns Used)

```
[AI Incident Database]                      [Freedom on the Net (House)]
 ├── Year ────────────────── LINK ─────────  ├── Year
 ├── Risk Domain                             ├── Country / ISO3
 ├── Intent (Malicious/Unintended)           ├── total_score (0-100)
 ├── Implicated Systems                      ├── Obstacles to Access (0-25)
 └── Deepfake indicator                      ├── Limits on Content (0-35)
                                             └── Violations of User Rights (0-40)
```

### 4.3 รายละเอียดกราฟและการเชื่อมโยง (Visual Specifications)

#### 1. กราฟ 3.1 — Global Internet Freedom Map (Choropleth Map)
* **ประเภท:** Interactive World Map
* **Geographic Dimension:** `Country`
* **Metric:** `total_score` (0-100)
* **Color Palette (Pastel Gradient):** 
  - 0–39 (Not Free): สีชมพูพาสเทลเข้ม (`#E6B0AA`)
  - 40–69 (Partly Free): สีเหลืองพีชพาสเทล (`#F7DC6F`)
  - 70–100 (Free): สีเขียวมิ้นต์พาสเทล (`#7DCEA0`)
* **Interaction:** คลิกที่ประเทศ เพื่อกรองข้อมูลคะแนนย่อย 3 มิติ และดูเหตุการณ์ AI ในภูมิภาคนั้น (ถ้ามี)

#### 2. กราฟ 3.2 — Thailand Score Trend & Component Breakdown (Grouped Bar + Line)
* **X-axis:** Year (ปี)
* **Y-axis:** คะแนน (Scores)
* **Series (3 Components):**
  - Obstacles to Access (ฟ้าพาสเทล `#85C1E9`)
  - Limits on Content (ม่วงพาสเทล `#BB8FCE`)
  - Violations of User Rights (ชมพูพาสเทล `#FADBD8`)
* **Line Series Overlay:** คะแนนรวมประเทศไทย (`total_score`)
* **วัตถุประสงค์:** ชี้ให้เห็นว่าจุดอ่อนด้านเสรีภาพของไทยมาจากมิติใดมากที่สุด

#### 3. กราฟ 3.3 — Thailand vs ASEAN Internet Freedom Comparison (Horizontal Bar Chart)
* **Dimension:** ประเทศในกลุ่ม ASEAN
* **Metric:** `total_score`
* **Highlight:** ประเทศไทย (Highlight ด้วยสีเข้มกว่าประเทศอื่น)

#### 4. กราฟ 3.4 — AI Incident Trends & Risk Domains (Line & Horizontal Bar Chart)
* **Part A (Line Chart):** แนวโน้มจำนวนเหตุการณ์ AI ทั่วโลกตามปี (`Year`) แยกตาม `Intent` (เจตนา vs อุบัติเหตุ)
* **Part B (Horizontal Bar):** จัดอันดับ `Risk Domain` (เช่น Privacy, Deepfake/Disinformation, Discrimination)
* **Pastel Color:** สีม่วงพาสเทล (`#BB8FCE`) และ สีฟ้าพาสเทล (`#85C1E9`)

#### 5. กราฟ 3.5 — Risk Domain × Intent Matrix (Heatmap)
* **Rows:** Risk Domain
* **Columns:** Intent
* **Value Color Scale:** ไล่เฉดจาก Off-White (`#F8F9FA`) ไปยัง Soft Violet (`#BB8FCE`)
* **วัตถุประสงค์:** ทำ EDA ดูความสัมพันธ์ระหว่างประเภทความเสี่ยงกับเจตนาผู้สร้าง AI

---

## 5. ตารางสรุปการจับคู่ชุดข้อมูล คอลัมน์ และรูปแบบกราฟ (Data Inventory Matrix)

| Tab | Research Question / ปัญหาที่ต้องการตอบ | Dataset หลัก | คอลัมน์ที่ต้องใช้ | Recommended Chart | Pastel Palette |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tab 1** | ภาพรวมภัยคุกคามสี่มิติเป็นอย่างไร? | ทั้ง 4 Datasets | Metrics สรุปรายไฟล์ | KPI Cards + Line Preview | Mixed Pastels |
| **Tab 1** | เสรีภาพอินเทอร์เน็ตทั่วโลกในภาพกว้าง | Freedom House | `Country`, `total_score` | Mini Choropleth Map | Green/Yellow/Pink |
| **Tab 2** | ข่าวปลอมเปลี่ยนอย่างไรตามเวลา? | AFNC | `date`, `verdict` | Line Chart | Pink/Yellow/Mint |
| **Tab 2** | ข่าวปลอมสัดส่วน Verdict เป็นอย่างไร? | AFNC | `date`, `verdict` | 100% Stacked Bar | Pink/Yellow/Mint |
| **Tab 2** | คดีหลอกลวงเปลี่ยนอย่างไรตามเวลา? | ACSC | `week_start`, `cases` | Line Chart | Sky Blue |
| **Tab 2** | Scam ประเภทใดมีคดีสูง vs Loss สูง? | ACSC | `top_type_th`, `cases`, `loss_baht` | Grouped Horizontal Bar | Blue & Amber Peach |
| **Tab 3** | เสรีภาพอินเทอร์เน็ตไทยเทียบ ASEAN? | Freedom House | `Country`, `total_score`, `Year` | Horizontal Bar Chart | Mint & Muted Grey |
| **Tab 3** | คะแนนเสรีภาพไทยย่อยมาจากมิติใด? | Freedom House | `Year`, 3 Component fields | Grouped Bar Chart | Blue, Violet, Pink |
| **Tab 3** | เหตุการณ์ AI Risks เติบโตอย่างไร? | AI Incident DB | `Year`, `Intent` | Line Chart | Soft Lavender |
| **Tab 3** | AI Risk Domain ใดพบมากที่สุด? | AI Incident DB | `Risk Domain` | Horizontal Bar Chart | Soft Lavender |

---

## 6. ข้อห้ามและข้อควรระวังในการออกแบบกราฟ (Design Guardrails)

1. **ห้ามรวม Metric คนละหน่วยไว้ในแกนเดียวกัน:** 
   - ห้าม plot จำนวนข่าว AFNC, มูลค่าเงิน ACSC (บาท), คะแนน Freedom House (0-100) ลงบนแกน Y เดียวกันโดยไม่มีการ Normalization
2. **หลีกเลี่ยง Dual-Axis ที่ไม่จำเป็น:** 
   - แยกกราฟระหว่าง "จำนวนคดี ACSC" กับ "มูลค่าความเสียหาย ACSC (บาท)" ออกเป็น 2 Panel/Chart เพื่อป้องกันความเข้าใจผิดเรื่อง Scale
3. **ห้ามอ้างอิงความสัมพันธ์เชิงสาเหตุ (No Causal Claim):** 
   - ห้ามสรุปว่า *"การลดลงของเสรีภาพอินเทอร์เน็ตทำให้ข่าวปลอมเพิ่มขึ้น"* ให้ใช้คำว่า **"ความสัมพันธ์ที่พบในข้อมูล" (Correlation/Co-occurrence in Data)** เท่านั้น
4. **ห้ามใช้ Pie Chart ที่มี Category มากเกิน 3 หมวด:** 
   - ให้ใช้ Bar Chart หรือ Horizontal Bar Chart แทนเสมอเพื่อการอ่านค่าที่แม่นยำกว่า

---

## 7. AI Prompt Disclosure (พรอมพ์ AI ที่ใช้ในการสร้างโครงสร้างนี้)

เพื่อความโปร่งใสในกระบวนการทำงาน เอกสารฉบับนี้ถูกสร้างขึ้นโดยใช้คำสั่ง AI Prompt ดังต่อไปนี้:

```text
[SYSTEM PROMPT / USER INSTRUCTION]
"จากเนื้อหาในเอกสาร handoff_kp1.md ช่วยปรับโครงสร้างการนำเสนอแดชบอร์ดใหม่ โดยมีเงื่อนไขดังนี้:
1. ปรับลดจำนวนหน้าแดชบอร์ดเหลือเพียง 3 แท็บหลัก (ตัดหน้าสรุปแยกต่างหากออก)
2. Tab 1 ต้องเป็นหน้าภาพรวมที่เน้นการใช้กราฟและ Visual KPIs เป็นหลัก (Visual-Heavy) ไม่ใช้อักษรอธิบายยืดยาว
3. Tab 2 และ Tab 3 ให้ยุบรวมเนื้อหาและเชื่อมโยง Dataset ที่ใช้งานร่วมกันได้ (Data Linking) 
   - Tab 2: เชื่อมโยง AFNC (Fake News) + ACSC (Online Scams) ในบริบทประเทศไทย
   - Tab 3: เชื่อมโยง AI Incident DB (ความเสี่ยง AI) + Freedom House (เสรีภาพอินเทอร์เน็ต) ในบริบทมหภาค/ระดับโลก
4. กำหนดรายละเอียดเกี่ยวกับ Theme พาสเทล (Pastel Theme) อย่างละเอียด โดยอ้างอิงโทนสีพาสเทลสบายตา พร้อมระบุรหัสสี Hex Code, การเลือกใช้สีกับกราฟแต่ละประเภท, ตัวหนังสือแบบ High Contrast และ Card Styling
5. ระบุชุดข้อมูล (Datasets) และคอลัมน์ (Columns) ที่ใช้จริงในแต่ละแท็บอย่างชัดเจน
6. ระบุปัญหาหลักภาพรวม (Master Overarching Problem) และปัญหาหลักประจำแท็บ
7. แสดง AI Prompt ที่ใช้ในเอกสารนี้เพื่อความโปร่งใส"
```