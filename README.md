# Digital Threats & Internet Freedom Dashboard
## โครงงาน Data Visualization: ภัยคุกคามในโลกดิจิทัลกับเสรีภาพอินเทอร์เน็ต (Actionable Insights & Flexible Interactivity Edition)

> **Specification Reference:** [`dashboard_revision_handoff.md`](./dashboard_revision_handoff.md) (พัฒนาต่อยอดจาก [`handoff_kp3.md`](./handoff_kp3.md), [`handoff_kp2.md`](./handoff_kp2.md), และ [`handoff_kp1.md`](./handoff_kp1.md))  
> **Branch:** `main`  
> **Live Public URL:** <a href="https://digital-threats-internet-freedom-1.vercel.app/" target="_blank">Dashboard</a>  
> **Local URL:** [http://localhost:8000](http://localhost:8000)

---

### ภาพรวมการปรับปรุงตามข้อกำหนด dashboard_revision_handoff.md

แดชบอร์ดนี้ได้รับการพัฒนาปรับปรุงให้ตอบโจทย์ **"การวิเคราะห์ความเชื่อมโยง (Actionable Insights)"** และ **"การโต้ตอบที่ยืดหยุ่น (Flexible Interactivity)"** ตามข้อกำหนดใน `dashboard_revision_handoff.md`:

1. **จุดตัด AI-Driven Fraud (AI x ACSC — Chart 1.1):**
   * วิเคราะห์สัดส่วนความเสียหายจากมิจฉาชีพที่ใช้เทคโนโลยี AI (Deepfake, AI Voice Cloning, Trading Bots, Synthetic Identity) คิดเป็น **฿3.25 พันล้านบาท (17.9%)** จากยอดความเสียหายรวม ฿18.18 พันล้านบาท เทียบกับการหลอกลวงทั่วไป **฿14.93 พันล้านบาท (82.1%)**
   * กราฟ Donut Chart ทำงานเชื่อมโยงแบบ Cross-filtering กับกราฟ Threat Category Breakdown (Chart 1.2)
2. **ข้อมูลประชากรศาสตร์และพื้นที่ (Demographics Target Profile — Section 2.5):**
   * **Chart 2.5A:** วิเคราะห์กลุ่มอายุของผู้เสียหายเปรียบเทียบระหว่างสัดส่วนคดี (%) กับมูลค่าความเสียหายเฉลี่ย (฿/คดี จากเฉลี่ยภาพรวม ฿49,498) ชี้ให้เห็นว่าวัยทำงาน (25–34 ปี) มีจำนวนคดีสูงสุด (38.5%) แต่ผู้สูงวัย (55 ปีขึ้นไป) มีมูลค่าสูญเสียเฉลี่ยสูงสุดถึง **฿112,400 บาท/คดี**
   * **Chart 2.5B:** พื้นที่ที่มีการแจ้งความคดีออนไลน์สูงสุด 5 อันดับแรก (กทม. 27.8%, เชียงใหม่ 8.4%, ชลบุรี 7.9%, นนทบุรี 6.5%, ขอนแก่น 4.8%)
3. **การวิเคราะห์ความสัมพันธ์ Freedom vs. Threats (Scatter Analysis — Chart 3.4):**
   * เปรียบเทียบคะแนน Internet Freedom Score (แกน X) กับดัชนี Cyber Threat & Scam Severity (แกน Y) ของ 19 ประเทศ
   * แสดงบทวิเคราะห์เชิงประจักษ์ (Empirical Insight): *"ประเทศที่ควบคุมอินเทอร์เน็ตเข้มงวด (Not Free เช่น เมียนมา เสรีภาพ 9/100, กัมพูชา 43/100) มิได้ลดภัยคุกคามไซเบอร์ หากแต่กลายเป็นฐานที่ตั้งของ Scam Hubs และแก๊งคอลเซ็นเตอร์ข้ามชาติที่ส่งผลกระทบต่อไทย (เสรีภาพ 39/100, ดัชนีภัย 82)"*
4. **ปรับโฟกัสแผนที่เสรีภาพเน็ต (Chart 1.4):**
   * ปรับตั้งค่าเริ่มต้นให้โฟกัสเฉพาะภูมิภาคอาเซียน (ASEAN Focus) เพื่อเปรียบเทียบบริบทประเทศเพื่อนบ้าน
   * พร้อมปุ่ม Toggle สลับระหว่าง **"โฟกัสอาเซียน"** และ **"มุมมองโลก (Global View)"**
5. **Mobile Panel Switcher สำหรับ Tab 2:**
   * รองรับการสลับมุมมองกราฟคู่ Synchronized Time Series บนหน้าจอขนาดเล็ก (ทั้ง 2 แผง / เฉพาะ AFNC / เฉพาะ ACSC)
6. **Global Filter Bar ที่ทำงานอย่างสมบูรณ์:**
   * กรองช่วงเวลา (Time Horizon: 12 เดือนล่าสุด, 2026, 2025, 2024, 2020–2024, ทั้งหมด)
   * กรองขอบเขตภูมิศาสตร์ (Scope: โลก & ไทย, เน้นเฉพาะไทย, เปรียบเทียบในอาเซียน)
   * กรองคุณภาพข้อมูล (Quality: ข้อมูลทั้งหมด, เฉพาะแถวที่ตรวจสอบแล้ว Validated Only)
   * ปุ่มรีเซ็ตตัวกรองรวม (Reset Global Filters)
7. **ระบบโต้ตอบข้ามกราฟอย่างสมบูรณ์ในทุกแท็บ (Full Cross-Filtering):**
   * ทุกกราฟใน Tab 1, Tab 2, และ Tab 3 เชื่อมโยงกันอย่างยืดหยุ่น สามารถคลิกเพื่อไฮไลต์ กรองข้อมูล และคำนวณสถิติสัมพันธ์กันได้ทันที

---

### โครงสร้างและองค์ประกอบของแดชบอร์ด

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
 (AI Fraud Donut,              (Synchronized Time,           (Freedom vs Threats
 Taxonomy Bar,                 Loss vs Volume,               Scatter, Intent Line,
 4 Sparklines,                 Demographics 2.5A/B,          Domains Bar, Heatmap
 ASEAN Focus Map)              Weekly Table 2.4)             & Case Studies Modal)
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
| **Accent Lavender**| `#EBDEF0` / `#BB8FCE` | ความเสี่ยง AI / Limits on Content / Deepfake Tag |
| **Accent Peach/Yellow**| `#FCF3CF` / `#F7DC6F` | ความเสียหายทางการเงิน / ข่าวบิดเบือน / Partly Free |

---

### วิธีการเปิดใช้งาน (How to Run)

#### ลิงก์สาธารณะ (Public Live Access)
สามารถเข้าชมแดชบอร์ดออนไลน์ผ่านเบราว์เซอร์ได้ทันทีโดยไม่ต้องรันเซิร์ฟเวอร์เอง:
👉 **<a href="https://digital-threats-internet-freedom-1.vercel.app/" target="_blank">Digital Threats & Internet Freedom Dashboard</a>**

#### รันผ่าน Local Web Server
```bash
python -m http.server 8000
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:8000` (หรือเปิดไฟล์ [index.html](file:///d:/finalajt/Final_DataViz/index.html) ได้โดยตรงแบบออฟไลน์)
