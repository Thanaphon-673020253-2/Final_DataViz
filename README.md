# Digital Threats & Internet Freedom Dashboard
## โครงงาน Data Visualization: ภัยคุกคามในโลกดิจิทัลกับเสรีภาพอินเทอร์เน็ต (3-Tab Pastel Edition)

> **Branch:** `kp`  
> **Specification Reference:** [`handoff_kp2.md`](./handoff_kp2.md) (ปรับปรุงจาก [`handoff_kp1.md`](./handoff_kp1.md))

---

### ภาพรวมการปรับปรุงโครงสร้าง (3-Tab Pastel Architecture)
แดชบอร์ดนี้ได้รับการปรับโครงสร้างใหม่ตามข้อกำหนดใน **`handoff_kp2.md`** ให้เหลือ **3 แท็บหลัก** (ตัดหน้าสรุปแยกต่างหากออก) โดยยุบรวมและเชื่อมโยงชุดข้อมูลที่มีความสัมพันธ์กัน (Data Linking/Correlation Context) เข้าด้วยกันอย่างเป็นระบบ และกำหนด Visual Style เป็น **Pastel Theme** ที่นุ่มนวล สบายตา ตัวหนังสือคมชัดอ่านง่าย (High Contrast)

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

### ข้อกำหนดสีพาสเทล (Pastel Palette Specification)

| ส่วนประกอบ | รหัสสี (Hex) | การนำไปใช้ |
| :--- | :--- | :--- |
| **Main Background** | `#F8F9FA` | พื้นหลังหลักแบบ Soft Cream / Off-White |
| **Card Background** | `#FFFFFF` | พื้นหลังการ์ดสีขาวบริสุทธิ์ ขอบมน 12px |
| **Primary Text** | `#2C3E50` | ตัวหนังสือหลัก Dark Slate คมชัดสูง อ่านง่าย |
| **Secondary Text** | `#7F8C8D` | คำอธิบาย แกนกราฟ และ Subtitle |
| **Accent Pink** | `#FADBD8` / `#E6B0AA` | AFNC / ข่าวปลอม (Fake Verdict) / User Rights |
| **Accent Mint/Teal** | `#D4EFDF` / `#7DCEA0` | ข่าวจริง (True Verdict) / เสรีภาพระดับ Free |
| **Accent Blue** | `#D6EAF8` / `#85C1E9` | คดีหลอกลวง ACSC / AI Incidents / Obstacles to Access |
| **Accent Lavender**| `#EBDEF0` / `#BB8FCE` | ความเสี่ยง AI / Limits on Content |
| **Accent Peach/Yellow**| `#FCF3CF` / `#F7DC6F` | ความเสียหายทางการเงิน / ข่าวบิดเบือน / Partly Free |

---

### รายละเอียดของแต่ละแท็บ (Detailed Tab Specifications)

#### 1. TAB 1: Visual Overview & Landscape (ภาพรวมภัยดิจิทัล)
* **แนวคิด:** Visual-Heavy เน้นการสื่อสารด้วยการ์ดสรุปและกราฟภาพรวม
* **ปัญหาหลักประจำแท็บ:** *"เมื่อมองภาพรวม ตัวชี้วัดสำคัญของภัยดิจิทัลทั้ง 4 ด้านมีแนวโน้มและขนาดของปัญหาในเชิงโครงสร้างอย่างไร?"*
* **องค์ประกอบ:**
  - **5 KPI Cards:** AFNC ข้อมูลตรวจสอบ (17,726), ACSC คดีหลอกลวง (381,390), ACSC ความเสียหาย (18.18 พันลบ.), AI Incidents (1,775), Freedom Score ไทย (39/100)
  - **Chart 1.1 — Multi-Dataset Trend Preview:** กราฟเส้นเปรียบเทียบแนวโน้มข่าวปลอม AFNC กับคดี ACSC รายเดือน
  - **Chart 1.2 — Threat Landscape:** กราฟแท่งแนวนอนแสดงการกระจายตัวของประเภทภัยดิจิทัลในไทย
  - **Chart 1.3 — Risk Distribution Sparklines:** มินิชาร์ต 4 การ์ดสรุปสัดส่วนสำคัญของทั้ง 4 ชุดข้อมูล
  - **Chart 1.4 — Freedom Index Geographic Snap:** แผนที่โลกพาสเทลแสดงระดับเสรีภาพอินเทอร์เน็ตทั่วโลก

#### 2. TAB 2: Thailand Threats & Financial Loss (ภัยดิจิทัลและผลกระทบในไทย)
* **แนวคิด:** เชื่อมโยง **AFNC (ข่าวปลอม)** + **ACSC (คดีหลอกลวงและความเสียหาย)** เข้าด้วยกันตามแกนเวลา (Time Synchronization 12 เดือน) และความซ้อนทับของหมวดหมู่ (Category Overlap)
* **ปัญหาหลักประจำแท็บ:** *"ข่าวปลอม/ข้อมูลบิดเบือนกับคดีการหลอกลวงออนไลน์ในประเทศไทย มีความสอดคล้องกันตามช่วงเวลาอย่างไร และหมวดหมู่ใดสร้างความเสียหายทางการเงิน (Financial Loss) สูงสุด?"*
* **องค์ประกอบ:**
  - **Chart 2.1 — Verification Trend vs Scam Volume:** กราฟเส้น 2 ชั้น (Dual-Panel Stacked Time View) ซิงค์แกนเวลาเดียวกันระหว่างข่าวปลอมกับคดีหลอกลวง
  - **Chart 2.2 — AFNC Verdict Composition:** กราฟแท่ง 100% Stacked Bar แสดงสัดส่วนผลการตรวจสอบรายเดือน
  - **Chart 2.3 — Financial Loss vs Case Volume by Scam Type:** กราฟแท่งเปรียบเทียบจำนวนคดี (ฟ้า) กับมูลค่าความเสียหาย (ส้มพีช) เพื่อชี้ให้เห็นว่า **"ประเภทคดีมากสุด (หลอกซื้อขายของ) ไม่ใช่ประเภทที่เสียหายเงินสูงสุด (หลอกลงทุน)"**
  - **Chart 2.4 — Topic Matrix:** กราฟเปรียบเทียบหมวดหมู่ข่าวปลอม AFNC เทียบกับประเภทกลโกง ACSC
  - **ตาราง 2.5 — Interactive Case & Financial Loss Detail Table:** ตารางค้นหาข้อมูลรายสัปดาห์ 48 สัปดาห์ พร้อมบริบทข่าวปลอมประจำเดือน

#### 3. TAB 3: Global AI Risks & Freedom Context (ความเสี่ยง AI & บริบทเสรีภาพ)
* **แนวคิด:** เชื่อมโยง **AI Incident Database (ระดับโลก)** + **Freedom on the Net (บริบทเสรีภาพอินเทอร์เน็ต)** ในระดับมหภาค (Macro View)
* **ปัญหาหลักประจำแท็บ:** *"เหตุการณ์ความเสี่ยงจาก AI ในระดับโลกมีรูปแบบใด และประเทศไทยมีระดับเสรีภาพอินเทอร์เน็ต (Access, Content, User Rights) อยู่ในจุดใดเมื่อเทียบกับภูมิภาคและระดับโลก?"*
* **องค์ประกอบ:**
  - **Chart 3.1 — Global Internet Freedom Map:** แผนที่โลก Choropleth Map แบบ Interactive แสดงระดับเสรีภาพ พร้อมฟังก์ชัน **คลิกที่ประเทศเพื่อดูคะแนนย่อย 3 เสาหลัก**
  - **Chart 3.2 — Thailand Score Trend & Component Breakdown:** กราฟแท่งจัดกลุ่ม 3 เสาหลัก (Access: 14/25, Content: 14/35, User Rights: 8/40) พร้อมเส้นคะแนนรวม 15 ปี (2010–2024)
  - **Chart 3.3 — Thailand vs ASEAN Comparison:** กราฟแท่งเปรียบเทียบคะแนนไทย (39, Not Free) กับ 5 ประเทศอาเซียน
  - **Chart 3.4A & 3.4B — AI Incident Trends & Risk Domains:** กราฟเส้นแนวโน้มเหตุการณ์ AI แยกตามเจตนา (จงใจโจมตี vs ข้อผิดพลาดระบบ) และกราฟแท่งจัดอันดับประเภทความเสี่ยง
  - **Chart 3.5 — Risk Domain × Intent Matrix:** ตาราง Heatmap 2 มิติแสดงความสัมพันธ์ระหว่างความเสี่ยงและเจตนา
  - **ตาราง 3.6 — AI Incidents & Freedom Explorer Table:** ตารางสืบค้นเหตุการณ์ AI และแท็ก Deepfake

---

### วิธีการเปิดใช้งาน (How to Run)

แดชบอร์ดออกแบบให้สามารถทำงานได้ทันทีทั้งแบบ **Local Double-Click (Offline)** และผ่าน **Web Server**:

#### วิธีที่ 1: เปิดไฟล์โดยตรง (Offline)
- ดับเบิ้ลคลิกไฟล์ [index.html](file:///c:/Users/User/OneDrive/ajt/final_dashy/Final_DataViz/index.html) ในเครื่องได้ทันที

#### วิธีที่ 2: รันผ่าน Local Web Server
```bash
python -m http.server 8000
```
จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:8000`

#### การประมวลผลข้อมูลใหม่ (หากไฟล์ต้นฉบับเปลี่ยนแปลง)
```bash
python prep_data.py
```
สคริปต์จะสร้างไฟล์ `data.js` และ `dashboard_data.json` อัตโนมัติ
