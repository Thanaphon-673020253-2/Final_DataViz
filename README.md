# Digital Threats & Internet Freedom Dashboard
## โครงงาน Data Visualization: ภัยคุกคามในโลกดิจิทัลกับเสรีภาพอินเทอร์เน็ต (3-Tab Pastel Edition - handoff_kp3)

> **Branch:** `kp`  
> **Specification Reference:** [`handoff_kp3.md`](./handoff_kp3.md) (พัฒนาต่อยอดจาก [`handoff_kp2.md`](./handoff_kp2.md) และ [`handoff_kp1.md`](./handoff_kp1.md))  
> **Live Public URL:** [https://stones-enjoying-crown-relation.trycloudflare.com](https://stones-enjoying-crown-relation.trycloudflare.com)  
> **Local URL:** [http://localhost:8000](http://localhost:8000)

---

### ภาพรวมการปรับปรุงตามข้อกำหนด handoff_kp3

แดชบอร์ดนี้สร้างขึ้นตามข้อกำหนด **`handoff_kp3.md`** บนสถาปัตยกรรม **3-Tab Pastel Architecture** พร้อมด้วยฟังก์ชันวิเคราะห์ระดับสูงและการแสดงผลข้อมูลแบบสมบูรณ์:

1. **Global Filter Bar**: แถบตัวกรองระดับ Global หัวหน้าเว็บสำหรับกรองช่วงเวลา (Time Filter: All, H1 2026, H2 2026), ภูมิศาสตร์ (Global vs ASEAN), และคุณภาพข้อมูล (Data Quality) พร้อมปุ่ม Reset All Filters
2. **Direct Data Labels บนทุกกราฟ**: แสดงตัวเลขจริง ($N$), สัดส่วน (%), มูลค่าเงิน (฿), และอัตราเติบโต (YoY) บนแท่งกราฟ จุดข้อมูล และ Slice ชาร์ตทันที ไม่ต้องรอ Hover Tooltip
3. **Statistical Stat Badges**: แสดงค่าสถิติเชิงลึก เช่น ค่าเฉลี่ยรายสัปดาห์ ($\mu$), มัธยฐาน ($\tilde{x}$), และสัปดาห์ที่เกิดวิกฤตสูงสุด (Peak Week 2026-08-16: 79,311 คดี / ฿2,775M)
4. **Bidirectional Cross-Filtering**: คลิกจุดข้อมูลบนกราฟ (เช่น แท่งเดือน หรือประเภทกลโกง) เพื่อกรองและไฮไลต์ข้อมูลในตารางและชาร์ตอื่น ๆ แบบเรียลไทม์
5. **Interactive Case Study Modal**: คลิกที่เซลล์ Heatmap (Chart 3.5) เพื่อเปิดหน้าต่าง Modal แสดงกรณีศึกษาจริงจาก AI Incident Database

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
 Charts & Metrics)             ACSC Scams Link)              Freedom House Link)
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
* **ปัญหาหลักประจำแท็บ:** *"เมื่อมองภาพรวม ตัวชี้วัดสำคัญของภัยดิจิทัลทั้ง 4 ด้านมีแนวโน้มและขนาดของปัญหาในเชิงโครงสร้างอย่างไร?"*
* **องค์ประกอบ:**
  - **5 KPI Cards พร้อม Delta Badges:** AFNC ข้อมูลตรวจสอบ (17,726 รายการ), ACSC คดีหลอกลวง (381,390 คดี), ACSC ความเสียหาย (฿18.18 พันล้าน), AI Incidents (1,775 เหตุการณ์), เสรีภาพเน็ตไทย (39/100, Not Free)
  - **Chart 1.1 — Multi-Dataset Dual-Axis Trend:** กราฟเส้นเปรียบเทียบแนวโน้มข่าวปลอม AFNC กับคดี ACSC รายเดือน พร้อมจุด Callout แสดง Peak Week
  - **Chart 1.2 — Threat Landscape Distribution:** กราฟแท่งแนวนอนแสดงสัดส่วนคดีหลอกลวง พร้อมตัวเลข N และ % บนแท่งกราฟ
  - **Chart 1.3 — Risk Distribution Sparklines:** 4 การ์ดสรุปสัดส่วนสำคัญของทั้ง 4 ชุดข้อมูล
  - **Chart 1.4 — Global Freedom Overview Map:** แผนที่โลกพาสเทลแสดงระดับเสรีภาพอินเทอร์เน็ต

#### 2. TAB 2: Thailand Threats & Financial Loss (ภัยดิจิทัลและผลกระทบในไทย)
* **ปัญหาหลักประจำแท็บ:** *"ข่าวปลอม/ข้อมูลบิดเบือนกับคดีการหลอกลวงออนไลน์ในประเทศไทย มีความสอดคล้องกันตามช่วงเวลาอย่างไร และหมวดหมู่ใดสร้างความเสียหายทางการเงินสูงสุด?"*
* **องค์ประกอบ:**
  - **Stat Summary Banner:** Mean cases/wk: 7,946 | Mean loss/wk: ฿378.7M | Mean loss/case: ฿49,498 | Median: ฿49,889 | Peak Week: 2026-08-16 (79,311 คดี / ฿2,775M)
  - **Chart 2.1 — Dual-Panel Synchronized Time Series:** เปรียบเทียบปริมาณข่าวปลอม AFNC ด้านบน และคดีหลอกลวง ACSC ด้านล่าง
  - **Chart 2.2 — AFNC Verdict Composition:** กราฟแท่ง 100% Stacked Bar แสดงสัดส่วนข่าวปลอม (65.8%), ข่าวจริง (26.3%), ข่าวบิดเบือน (7.9%) รายเดือนพร้อมฉลาก %
  - **Chart 2.3 — Financial Loss vs Case Volume (The Paradox):** กราฟแท่งเปรียบเทียบชี้ชัดว่าหลอกซื้อขายสินค้าคดีสูงสุด (75%) แต่หลอกลงทุนสร้างความเสียหายสูงสุด (฿9.00 พันล้าน หรือ 49.5%)
  - **Chart 2.4 — Topic Matrix:** กราฟแท่งเปรียบเทียบหมวดหมู่ AFNC กับ ACSC
  - **ตาราง 2.4 — Interactive Case & Financial Loss Detail Table:** ตารางค้นหาข้อมูล 48 สัปดาห์ พร้อม Data Bars และไฮไลต์แถวที่ความเสียหายเกินค่าเฉลี่ย

#### 3. TAB 3: Global AI Risks & Freedom Context (ความเสี่ยง AI & บริบทเสรีภาพ)
* **ปัญหาหลักประจำแท็บ:** *"เหตุการณ์ความเสี่ยงจาก AI ในระดับโลกมีรูปแบบใด และประเทศไทยมีระดับเสรีภาพอินเทอร์เน็ตอยู่ในจุดใดเมื่อเทียบกับภูมิภาคและระดับโลก?"*
* **องค์ประกอบ:**
  - **Chart 3.1 — Interactive Global Freedom Map:** แผนที่โลกคลิกที่ประเทศเพื่อดูคะแนนย่อย 3 เสาหลัก
  - **Chart 3.2 — Thailand vs ASEAN Comparison:** กราฟแท่งเปรียบเทียบคะแนนไทย (39, Not Free) เทียบกับค่าเฉลี่ยอาเซียน (41.8)
  - **Chart 3.3 — Thailand Freedom Component Breakdown:** จำแนกคะแนนย่อย 3 เสาหลัก (Access: 14/25, Content: 14/35, User Rights: 8/40 - Critical Deficit)
  - **Chart 3.4 — AI Incident Trends & Intentional Harm:** กราฟเส้นแสดงการพุ่งสูงขึ้นของภัยที่เกิดจากเจตนา (Intentional) แซงหน้าความผิดพลาดของระบบ (Unintentional) ตั้งแต่ปี 2022 (+73.7% YoY)
  - **Chart 3.5 — Risk Domain × Intent Matrix Heatmap:** ฮีตแม็ป 2 มิติที่สามารถคลิกเซลล์เพื่อเปิดดู Case Study Modal
  - **ตาราง 3.6 — AI Incidents & Case Explorer Table:** ตารางสืบค้นเหตุการณ์ AI และกรณีศึกษา

---

### วิธีการเปิดใช้งาน (How to Run)

#### ลิงก์สาธารณะ (Public Live Access)
สามารถเข้าชมแดชบอร์ดออนไลน์ผ่านเบราว์เซอร์ได้ทันทีโดยไม่ต้องรันเซิร์ฟเวอร์เอง:
👉 **[https://stones-enjoying-crown-relation.trycloudflare.com](https://stones-enjoying-crown-relation.trycloudflare.com)**

#### รันผ่าน Local Web Server
```bash
python -m http.server 8000
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:8000`

#### การประมวลผลข้อมูลใหม่ (Data Bundle Regeneration)
```bash
python generate_dashboard_data.py
```
สคริปต์จะคำนวณค่าสถิติทั้งหมดและสร้างไฟล์ `data.js` และ `dashboard_data.json` อัตโนมัติ
