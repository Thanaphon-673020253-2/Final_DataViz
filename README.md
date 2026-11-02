# Digital Threats & Internet Freedom Dashboard
## โครงงาน Data Visualization: ภัยคุกคามในโลกดิจิทัลกับเสรีภาพอินเทอร์เน็ต

> **Branch:** `kp`  
> **Specification Reference:** [`handoff_kp1.md`](./handoff_kp1.md)

---

### ภาพรวมของแดชบอร์ด (Dashboard Overview)
แดชบอร์ดนี้พัฒนาขึ้นตามข้อกำหนดใน **`handoff_kp1.md`** เพื่อวิเคราะห์และนำเสนอข้อมูลแบบสหวิทยาการภายใต้หัวข้อ **Digital Threats & Internet Freedom** โดยรวบรวมและวิเคราะห์ข้อมูลจริงจาก 4 แหล่งข้อมูลหลัก:

1. **Anti-Fake News Center Thailand (AFNC):** ข่าวปลอมและข้อมูลบิดเบือนที่ถูกตรวจสอบในประเทศไทย (17,726 รายการ, 2019–2026)
2. **Anti Online Scam Operation Center (ACSC):** สถิติคดีและมูลค่าความเสียหายจากการหลอกลวงออนไลน์รายสัปดาห์ (381,390 คดี, 1.82 หมื่นล้านบาท, 48 สัปดาห์)
3. **AI Incident Database (AIID):** สถิติเหตุการณ์ความเสียหายและความเสี่ยงจากการใช้ AI ระดับโลก (1,775 เหตุการณ์, 567 Deepfake, 1983–2026)
4. **Freedom on the Net (Freedom House):** คะแนนประเมินระดับเสรีภาพอินเทอร์เน็ตทั่วโลกและการเปรียบเทียบประเทศไทย (71 ประเทศ, 2010–2024)

---

### โครงสร้างของแดชบอร์ด (6 หน้าตามข้อกำหนด handoff_kp1)

1. **Page 1: ภาพรวมภัยคุกคามทางดิจิทัล (Digital Threats Overview)**
   - **KPI Summary Cards:** ตัวเลขสรุปหลักจากทั้ง 4 ฐานข้อมูล พร้อมระบุแหล่งที่มาและช่วงเวลาชัดเจน
   - **Threat Landscape (Section 2.2):** 4 การ์ดนำทางแยกตามประเภทภัย พร้อมปุ่มลัดเพื่อไปยังหน้านั้นๆ ทันที
   - **Key Trend Preview (Section 2.3):** กราฟเส้นแนวโน้มที่สามารถสลับดู ACSC Weekly Cases, AFNC Fact-check Volume หรือ AIID Yearly Incidents ได้โดยไม่รวมหน่วยวัดที่ต่างกัน
   - **Overview Charts:** สัดส่วนคำวินิจฉัย AFNC, ประเภทความเสี่ยง AIID, ความเสียหาย ACSC, และเสรีภาพไทยเทียบอาเซียน
   - **Key Insights Panel (Section 2.4):** 4 ข้อค้นพบเชิงประจักษ์จากข้อมูลจริง
   - **Dataset Inventory & Quality (Section 13):** ตารางบันทึกสถานะชุดข้อมูล ความครบถ้วน และหมายเหตุด้านคุณภาพ

2. **Page 2: ข่าวปลอมและข้อมูลบิดเบือนในประเทศไทย (Fake News - AFNC)**
   - **Interactive Filters:** กรองตามปี (2019–2026), คำวินิจฉัย (Fake, Distorted, True), และหมวดหมู่ข่าว
   - **3.1 Verification Trend:** กราฟเส้นรายเดือนแสดงจำนวน Fake, Distorted, True
   - **3.2 Verdict Composition:** กราฟแท่ง 100% Stacked Bar แสดงสัดส่วนร้อยละของแต่ละคำวินิจฉัยในแต่ละปี
   - **3.3 Fake News Topics:** กราฟแท่งแนวนอนจัดอันดับหมวดหมู่ข่าวที่พบมากที่สุด (นโยบายรัฐ, สุขภาพ, การเงิน)
   - **3.4 Items by Type:** กราฟแท่งแสดงองค์ประกอบประเภทรายการ (Verdict, Knowledge, Crime advisory)
   - **3.5 Case Explorer Table:** ตารางค้นหาและแบ่งหน้า (Pagination) รายการข่าวในฐานข้อมูลจริง
   - **Insights & Cautionary Notes:** คำเตือนเรื่องขอบเขตข้อมูลที่ไม่เท่ากับปริมาณข่าวปลอมทั้งหมดในประเทศ

3. **Page 3: การหลอกลวงออนไลน์ในประเทศไทย (Online Scams - ACSC)**
   - **Comparison Cards (Section 4.6):** วิเคราะห์ความขัดแย้งเชิงโครงสร้าง **Volume vs Value** (คดีสูงสุด vs เสียหายสูงสุด)
   - **4.1 Weekly Scam Cases:** กราฟเส้นจำนวนคดีรายสัปดาห์
   - **4.2 Weekly Financial Loss:** กราฟเส้นมูลค่าความเสียหายรายสัปดาห์ (แยกคนละกราฟตาม Section 12.2)
   - **4.3 Cases by Scam Type:** กราฟแท่งความถี่ของประเภทคดีอันดับ 1 (หลอกซื้อขายสินค้า >75%)
   - **4.4 Loss by Scam Type:** กราฟแท่งประเภทที่สร้างความเสียหายสูงสุด (หลอกลงทุน, ข่มขู่ทางโทรศัพท์)
   - **4.5 Loss per Case:** กราฟแนวโน้มความเสียหายเฉลี่ยต่อคดีในแต่ละสัปดาห์
   - **4.7 Weekly Detail Table:** ตารางรายละเอียดรายสัปดาห์พร้อมระบบค้นหาและแบ่งหน้า

4. **Page 4: ความเสี่ยง AI และผลกระทบต่อสังคม (AI Risks - AIID)**
   - **Global Scope Disclaimer:** ระบุชัดเจนว่าเป็นข้อมูลระดับนานาชาติ
   - **Interactive Filters:** ช่วงปี, Risk Domain, เจตนา (Intent)
   - **5.1 AI Incidents by Year:** กราฟแท่งแสดงการเติบโตแบบก้าวกระโดดหลังปี 2020
   - **5.2 Risk Domains:** กราฟแท่งจัดอันดับประเภทความเสี่ยง (Malicious Actors ครองอันดับ 1)
   - **5.3 Incidents by Intent:** สัดส่วนระหว่างความผิดพลาด (Unintentional) กับการจงใจใช้ในทางที่ผิด (Intentional)
   - **5.4 Risk Domain × Intent Heatmap:** ตารางเมทริกซ์ 2 มิติแสดงความเข้มข้นของเหตุการณ์
   - **5.5 Deepfake Surge Trend:** กราฟแสดงการพุ่งขึ้นของเหตุการณ์ที่เกี่ยวกับ Deepfake และสื่อสังเคราะห์
   - **Top Deployers:** ผู้ใช้งานระบบที่ถูกระบุในเหตุการณ์ (Scammers, OpenAI, Google, Tesla, Meta)
   - **5.6 Case Study Table:** ตารางค้นหากรณีศึกษาตัวอย่าง

5. **Page 5: เสรีภาพอินเทอร์เน็ต (Internet Freedom - Freedom House)**
   - **6.1 World Choropleth Map (Plotly):** แผนที่โลกแสดงระดับคะแนนเสรีภาพ พร้อมระบบ Interactive คลิกที่ประเทศเพื่อดูคะแนนย่อย
   - **6.2 Thailand vs ASEAN:** กราฟแท่งเปรียบเทียบไทย (39, Not Free) กับ 5 ประเทศอาเซียน
   - **6.3 Thailand Score Trend (2010–2024):** กราฟเส้นแนวโน้ม 15 ปีของไทย
   - **6.4 Freedom Components:** กราฟแท่งจัดกลุ่ม 3 เสาหลัก (Access 14/25, Content 14/35, Rights 8/40)
   - **6.5 Component Trend (2010–2024):** วิวัฒนาการ 3 เสาหลัก ชี้ชัดว่าสิทธิผู้ใช้ (User Rights) ต่ำสุดตลอดมา
   - **Country Ranking Table:** ตารางจัดอันดับทั้ง 71 ประเทศพร้อมค้นหา

6. **Page 6: บทสรุปและสิ่งที่เราควรเรียนรู้ (Final Insights & Takeaways - Section 7)**
   - **Storytelling Flow:** กรอบการนำเสนอ 5 ขั้นตอน: **Overview → Evidence → Impact → Context → Insight**
   - **7.1 - 7.4 Synthesized Cards:** การสังเคราะห์ 4 มิติ (Information Threat, Financial Threat, AI Risk, Internet Environment)
   - **Actionable Recommendations:** ข้อเสนอแนะ 3 ระดับ (สำหรับประชาชน, ผู้ให้บริการแพลตฟอร์ม, ภาครัฐและผู้กำหนดนโยบาย)
   - **Final Synthesis Quote:** บทสรุปความเชื่อมโยงของระบบนิเวศข้อมูล

---

### วิธีการเปิดใช้งาน (How to Run)

แดชบอร์ดออกแบบให้สามารถทำงานได้ทันทีทั้งแบบ **Local Double-Click (Offline)** และผ่าน **Web Server**:

#### วิธีที่ 1: เปิดไฟล์โดยตรง
- ดับเบิ้ลคลิกไฟล์ `index.html` เพื่อเปิดในเว็บเบราว์เซอร์ (Edge, Chrome, Firefox) ได้ทันที

#### วิธีที่ 2: รันผ่าน Local Server
```bash
python -m http.server 8000
```
จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:8000`

#### การประมวลผลข้อมูลใหม่ (หากมีการอัปเดตไฟล์ข้อมูล)
```bash
python prep_data.py
```
สคริปต์จะทำการอ่านข้อมูลจากไฟล์ต้นฉบับและสร้างไฟล์ `data.js` และ `dashboard_data.json` ขึ้นมาใหม่โดยอัตโนมัติ
