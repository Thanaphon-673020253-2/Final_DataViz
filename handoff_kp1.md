# Graph Specification: Digital Threats & Internet Freedom

## 0. วัตถุประสงค์ของเอกสาร

เอกสารนี้เป็นส่วนขยายจาก `Handoff: Digital Threats & Internet Freedom`
โดยเน้นเฉพาะ **การออกแบบกราฟและองค์ประกอบ Visualization ของแต่ละหน้า
Dashboard**

หลักการสำคัญคือยัง **ไม่ใส่ตัวเลขสมมติ**
และยังไม่กำหนดกราฟจากข้อมูลที่ยังไม่ได้ตรวจสอบจริง กราฟด้านล่างเป็น
**ข้อเสนอเชิงโครงสร้าง** เพื่อให้ผู้พัฒนา Dashboard สามารถนำไปจับคู่กับ Dataset
จริงได้หลังจากทำ Dataset Inventory และ Data Quality Assessment

> Source handoff ระบุว่าต้องตรวจสอบโครงสร้างไฟล์จริง ช่วงเวลา ฟิลด์
> และคุณภาพข้อมูลก่อนสร้าง Dashboard ดังนั้นชื่อ field
> ในเอกสารนี้ให้ถือเป็นแนวทางจนกว่าจะตรวจสอบไฟล์จริงอีกครั้ง

------------------------------------------------------------------------

# 1. Dashboard Structure ที่แนะนำ

แนะนำให้มี **5 หน้า Dataset/Analysis + 1 ส่วนสรุป** ดังนี้

1.  **Overview --- Digital Threats**
2.  **Fake News & Disinformation in Thailand**
3.  **Online Scams in Thailand**
4.  **AI Risks & Social Impact**
5.  **Internet Freedom**
6.  **Final Insights / What Should We Learn?**

เหตุผลที่แยกหน้าเป็น Dataset-specific คือแต่ละ Dataset วัดคนละสิ่ง และ Handoff
ระบุว่าไม่จำเป็นต้อง JOIN ทุก Dataset เข้าด้วยกัน

------------------------------------------------------------------------

# 2. PAGE 1 --- Overview: Digital Threats

## เป้าหมายของหน้า

ตอบคำถาม:

> "เมื่อมองภาพรวม เรากำลังเผชิญภัยดิจิทัลประเภทใดบ้าง และแต่ละ Dataset
> บอกอะไรเรา?"

หน้า Overview ไม่ควรพยายามรวมตัวเลขทั้งหมดเป็นคะแนนเดียว เพราะจำนวนข่าว จำนวนคดี
จำนวนเหตุการณ์ AI และคะแนน Internet Freedom มีหน่วยและความหมายต่างกัน

## 2.1 KPI Cards

แนะนำให้ใช้ KPI Card 4 ใบ โดยแต่ละใบมาจาก Dataset คนละชุด

  KPI                      Dataset                ความหมาย
  ------------------------ ---------------------- ------------------------------------
  Checked Information      AFNC                   จำนวนรายการที่อยู่ในขอบเขตข้อมูลที่ตรวจสอบ
  Scam Cases               ACSC                   จำนวนคดีตามช่วงเวลาที่เลือก
  Scam Loss                ACSC                   มูลค่าความเสียหายตามช่วงเวลาที่เลือก
  AI Incidents             AI Incident Database   จำนวนเหตุการณ์ที่บันทึกในฐานข้อมูล
  Internet Freedom Score   Freedom on the Net     คะแนนของประเทศ/ปีที่เลือก

### หมายเหตุ

ไม่จำเป็นต้องใช้ทั้ง 5 KPI พร้อมกัน หากหน้าจอแคบ สามารถเลือก 4 ตัวที่สำคัญที่สุด และแสดง
source + period ใต้ KPI ทุกใบ

------------------------------------------------------------------------

## 2.2 กราฟที่ 1 --- Threat Landscape

**ประเภท:** Horizontal Bar Chart

**คำถาม:** Dataset แต่ละชุดสะท้อน "ภัย" ในด้านใด?

ไม่ควรเอาจำนวนจากทุก Dataset มาใส่แกนเดียวกัน เพราะหน่วยต่างกัน

ดังนั้นกราฟนี้ควรเป็น **conceptual comparison** มากกว่าการเปรียบเทียบขนาดตัวเลข

### ทางเลือกที่แนะนำ

ใช้เป็น 4 small cards แทนกราฟเดียว:

-   Fake News / Disinformation → AFNC
-   Online Scams → ACSC
-   AI Risks → AI Incident Database
-   Internet Freedom → Freedom on the Net

แต่ละ card มี: - ชื่อประเด็น - Dataset - Metric หลัก - ปุ่ม "Explore"

------------------------------------------------------------------------

## 2.3 กราฟที่ 2 --- Key Trend Preview

**ประเภท:** Line Chart

ใช้แสดง trend ของ Dataset ที่มี time series ชัดเจน

แนะนำให้เลือก **เพียง 1 Dataset ต่อกราฟ** เช่น

-   AFNC → จำนวนรายการตามเดือน/สัปดาห์ หรือ
-   ACSC → จำนวนคดีตามสัปดาห์

ไม่ควร plot AFNC, ACSC และ AI Incident เป็นเส้นเดียวกันหากไม่มี normalization
ที่มีเหตุผล

------------------------------------------------------------------------

## 2.4 Insight Panel

วางด้านขวาหรือด้านล่าง

แสดง 3--5 insight ที่เขียนจากข้อมูลจริง เช่น

-   ประเภทข้อมูลที่พบมากใน AFNC
-   ช่วงเวลาที่ ACSC มีจำนวนคดีสูง
-   ประเภท AI risk ที่พบมาก
-   Thailand Internet Freedom score อยู่ระดับใดเมื่อเทียบกับกลุ่มประเทศที่เลือก

> Insight ต้องถูกสร้างหลังจากวิเคราะห์ข้อมูลจริง ไม่ควรเขียนข้อความตายตัวล่วงหน้า

------------------------------------------------------------------------

# 3. PAGE 2 --- Fake News & Disinformation in Thailand

## Dataset

**AFNC --- Anti-Fake News Center Thailand**

## คำถามหลัก

> "ข่าวปลอมและข้อมูลบิดเบือนที่ถูกตรวจสอบในข้อมูล AFNC มีประเภท ผลการตรวจสอบ
> และแนวโน้มอย่างไร?"

------------------------------------------------------------------------

## 3.1 กราฟหลัก --- Verification Trend

**ประเภท:** Line Chart

### X-axis

วันที่ / สัปดาห์ / เดือน ตามความละเอียดจริงของข้อมูล

### Y-axis

จำนวนรายการ

### Series ที่แนะนำ

-   Fake
-   Distorted
-   True

หากข้อมูลจริงมีประเภทอื่น เช่น educational หรือ online crime advisories
ให้ตรวจสอบนิยามก่อน แล้วจึงตัดสินใจว่าจะรวมในกราฟนี้หรือแยกเป็นอีกกราฟ

### จุดประสงค์

ดูว่า "รูปแบบของรายการที่ถูกตรวจสอบ" เปลี่ยนไปตามเวลาอย่างไร

### ไม่ควรสรุปว่า

"ช่วงที่มี Fake News สูง = คนในประเทศผลิตข่าวปลอมมากขึ้น"

เพราะ Dataset อาจสะท้อนจำนวนที่ถูกนำมาตรวจสอบ ไม่ใช่จำนวนข่าวปลอมทั้งหมดที่เกิดขึ้นจริง

------------------------------------------------------------------------

## 3.2 กราฟ --- Verdict Composition

**ประเภท:** 100% Stacked Bar Chart

### X-axis

เดือน หรือปี

### Y-axis

สัดส่วนของผลการตรวจสอบ (%)

### Series

-   Fake
-   Distorted
-   True
-   อื่น ๆ หากมีและนิยามชัดเจน

### จุดประสงค์

ดู "องค์ประกอบของผลการตรวจสอบ" ในแต่ละช่วงเวลา
โดยไม่ให้จำนวนรายการทั้งหมดบดบังสัดส่วน

------------------------------------------------------------------------

## 3.3 กราฟ --- Fake News Topics

**ประเภท:** Horizontal Bar Chart

### Dimension

ใช้หมวดหมู่ที่มีอยู่จริงใน Dataset เช่น

-   Health
-   Finance
-   Disaster
-   Security
-   Other

หากไฟล์จริงมี field แบบ flag เช่น `afnc_false_health` ให้ตรวจสอบก่อนว่าค่าของ
field หมายถึง category, binary flag หรืออย่างอื่น

### Metric

จำนวนรายการ

### Sort

Descending

### จุดประสงค์

ตอบว่า:

> "ประเด็นใดปรากฏบ่อยในข้อมูลที่ AFNC ตรวจสอบ?"

ใช้คำว่า **"พบมากที่สุดใน Dataset"** ไม่ใช่ "เกิดมากที่สุดในประเทศไทย"

------------------------------------------------------------------------

## 3.4 กราฟ --- Items by Type

**ประเภท:** Bar Chart

### Dimension

`item_type` หรือ fieldที่มีความหมายเทียบเท่าในไฟล์จริง

### Metric

จำนวนรายการ

### จุดประสงค์

แสดงว่าข้อมูลที่ AFNC เก็บมีลักษณะใดบ้าง

------------------------------------------------------------------------

## 3.5 ตาราง Detail / Case Explorer

**ประเภท:** Interactive Table

คอลัมน์ที่ควรพิจารณา:

-   date
-   item_type
-   verdict
-   category/topic
-   source/reference
-   title/text หาก Dataset อนุญาต

### Interaction

Filter: - Date - Year - Verdict - Category - Item type

------------------------------------------------------------------------

## 3.6 Insight ที่ควรหา

หลังวิเคราะห์จริง ควรพยายามตอบ:

1.  Verdict ใดมีสัดส่วนสูงสุด?
2.  หมวดหมู่ใดปรากฏบ่อย?
3.  มีช่วงเวลาใดที่จำนวนรายการเพิ่มขึ้นหรือลดลงชัดเจน?
4.  ประเภทข้อมูลที่ถูกตรวจสอบเปลี่ยนไปตามเวลาหรือไม่?

------------------------------------------------------------------------

# 4. PAGE 3 --- Online Scams in Thailand

## Dataset

**ACSC --- Anti Online Scam Operation Center**
ชื่อเต็ม/ชื่อย่อให้ตรวจสอบกับไฟล์จริงอีกครั้งตาม Handoff

## คำถามหลัก

> "การหลอกลวงออนไลน์ประเภทใดมีจำนวนคดีและมูลค่าความเสียหายสูงในข้อมูลที่ศึกษา?"

------------------------------------------------------------------------

## 4.1 กราฟหลัก --- Weekly Scam Cases

**ประเภท:** Line Chart

### X-axis

`week_start` หรือวันที่ที่เป็นตัวแทนของสัปดาห์

### Y-axis

จำนวนคดี

### Series

ใช้ 1 series หลัก: - Scam cases

### จุดประสงค์

ดู trend รายสัปดาห์

หาก Dataset มีข้อมูลรายสัปดาห์ ให้ใช้รายสัปดาห์เป็นหลักแทนการ aggregate
เป็นรายเดือนทันที

------------------------------------------------------------------------

## 4.2 กราฟ --- Weekly Financial Loss

**ประเภท:** Line Chart

### X-axis

สัปดาห์

### Y-axis

มูลค่าความเสียหาย (บาท)

### จุดประสงค์

ดูว่าช่วงใดมี financial impact สูง

### สำคัญ

จำนวนคดีและมูลค่าความเสียหายเป็นคนละ metric จึงแนะนำให้แยกเป็น 2 กราฟแทนการใช้
dual-axis หากไม่จำเป็น

------------------------------------------------------------------------

## 4.3 กราฟ --- Cases by Scam Type

**ประเภท:** Horizontal Bar Chart

### Dimension

ประเภทการหลอกลวงจาก field ที่มีอยู่จริง

### Metric

จำนวนคดี

### Sort

Descending

### จุดประสงค์

หา scam type ที่มีจำนวนคดีสูงใน Dataset

------------------------------------------------------------------------

## 4.4 กราฟ --- Loss by Scam Type

**ประเภท:** Horizontal Bar Chart

### Dimension

ประเภทการหลอกลวง

### Metric

มูลค่าความเสียหาย (บาท)

### Sort

Descending

### จุดประสงค์

หา scam type ที่สร้าง financial loss สูงในข้อมูล

### เหตุผลที่ต้องแยกจาก Cases by Type

ประเภทที่มีจำนวนคดีมากที่สุดอาจไม่ใช่ประเภทที่สร้างความเสียหายทางการเงินสูงที่สุด

------------------------------------------------------------------------

## 4.5 กราฟ --- Loss per Case

**ประเภท:** Bar Chart หรือ KPI + Table

ถ้า Dataset มี field `loss_per_case_baht` ให้ใช้เป็น metric รอง

### คำถาม

> "โดยเฉลี่ยแล้วคดีแต่ละประเภทมีมูลค่าความเสียหายต่อคดีแตกต่างกันหรือไม่?"

### ข้อควรระวัง

ต้องตรวจสอบวิธีคำนวณและ precision ของ loss ก่อนนำเสนอ

------------------------------------------------------------------------

## 4.6 กราฟ --- Top Type vs Highest Loss Type

หาก Dataset มี field เช่น:

-   `top_type_th`
-   `top_type_case_share_pct`
-   `highest_loss_type_th`
-   `highest_loss_type_loss_baht`

สามารถทำเป็น **Insight Cards**:

**Most Cases** \> ประเภทที่มีสัดส่วนคดีสูงสุด

**Highest Loss** \> ประเภทที่มีมูลค่าความเสียหายสูงสุด

ไม่ควรเขียนว่า "อันตรายที่สุด" เพราะเป็นการตีความเกิน metric

------------------------------------------------------------------------

## 4.7 ตาราง Weekly Detail

คอลัมน์ที่ควรพิจารณา:

-   week_start
-   week_end
-   cases
-   loss_baht
-   loss_precision
-   loss_per_case_baht
-   cases_change_vs_prev_week
-   loss_change_vs_prev_week_baht
-   top_type
-   highest_loss_type
-   flag

------------------------------------------------------------------------

## 4.8 Insight ที่ควรหา

1.  สัปดาห์ใดมีจำนวนคดีสูง?
2.  สัปดาห์ใดมี financial loss สูง?
3.  ประเภทใดมีจำนวนคดีสูง?
4.  ประเภทใดสร้างความเสียหายสูง?
5.  จำนวนคดีสูงสัมพันธ์กับ loss สูงในแต่ละสัปดาห์หรือไม่?

ข้อ 5 สามารถใช้ scatter plot ได้ **ถ้าข้อมูลรายสัปดาห์มีทั้ง cases และ loss
ในแถวเดียวกัน**

แต่ควรเขียนว่าเป็นการดู **ความสัมพันธ์ในข้อมูล** ไม่ใช่เหตุและผล

------------------------------------------------------------------------

# 5. PAGE 4 --- AI Risks & Social Impact

## Dataset

**AI Incident Database**

## คำถามหลัก

> "เหตุการณ์ความเสียหายหรือความเสี่ยงที่เกี่ยวข้องกับ AI
> ในฐานข้อมูลมีประเภทและแนวโน้มอย่างไร?"

Handoff ระบุชัดว่า AI Incident Database เป็นข้อมูลระดับโลก
จึงต้องแยกออกจากข้อมูลประเทศไทย

------------------------------------------------------------------------

## 5.1 กราฟหลัก --- AI Incidents by Year

**ประเภท:** Line Chart

### X-axis

Year

### Y-axis

จำนวนเหตุการณ์

### จุดประสงค์

ดูแนวโน้มจำนวนเหตุการณ์ที่ถูกบันทึกในฐานข้อมูลตามปี

### ห้ามสรุปว่า

"จำนวนเหตุการณ์ AI ที่เกิดขึ้นจริงทั่วโลกเพิ่มขึ้นเท่านี้"

เพราะฐานข้อมูลไม่ได้ครอบคลุมทุกเหตุการณ์ที่เกิดขึ้นจริง

------------------------------------------------------------------------

## 5.2 กราฟ --- Incidents by Risk Domain

**ประเภท:** Horizontal Bar Chart

### Dimension

`Risk Domain` หรือ field ที่เทียบเท่าในไฟล์จริง

### Metric

จำนวนเหตุการณ์

### จุดประสงค์

ดูประเภทความเสี่ยงที่ปรากฏบ่อย

> ห้ามสร้าง category ใหม่เองก่อนตรวจสอบ definition จาก Dataset

------------------------------------------------------------------------

## 5.3 กราฟ --- Incidents by Intent

**ประเภท:** Bar Chart

### Dimension

`Intent`

### Metric

จำนวนเหตุการณ์

### จุดประสงค์

ดูรูปแบบเจตนาที่ถูกระบุไว้ในฐานข้อมูล หาก field นี้มีอยู่จริง

------------------------------------------------------------------------

## 5.4 กราฟ --- Risk Domain × Intent

**ประเภท:** Heatmap

### Rows

Risk Domain

### Columns

Intent

### Values

จำนวนเหตุการณ์

### จุดประสงค์

ดูว่าความเสี่ยงประเภทใดปรากฏร่วมกับ intent แบบใดบ่อย

### หมายเหตุ

Heatmap นี้เหมาะสำหรับ EDA และอาจไม่จำเป็นต้องอยู่ในหน้า final หากจำนวน category
เยอะจนอ่านยาก

------------------------------------------------------------------------

## 5.5 กราฟ --- Deepfake

หาก Dataset มี field หรือ text ที่รองรับการระบุ Deepfake จริง:

**ประเภท:** Bar / Line Chart

ตัวเลือก:

-   จำนวนเหตุการณ์ Deepfake ตามปี
-   Deepfake แยกตาม risk domain
-   Deepfake แยกตามกลุ่มผู้ได้รับผลกระทบ

### ข้อสำคัญ

ห้ามสร้าง Deepfake category จากการเดา keyword
โดยไม่บันทึกกฎการจัดกลุ่มและตรวจสอบตัวอย่างด้วยมือ

------------------------------------------------------------------------

## 5.6 Case Study Table

แนะนำให้มีตารางเล็ก ๆ สำหรับเหตุการณ์ตัวอย่าง

คอลัมน์:

-   Year / Date
-   Risk Domain
-   Intent
-   Implicated Systems
-   Affected Group
-   Short Description

ใช้เพื่อช่วยให้ผู้ชมเข้าใจว่า "AI risk" ในข้อมูลหมายถึงเหตุการณ์ลักษณะใดจริง ๆ

------------------------------------------------------------------------

# 6. PAGE 5 --- Internet Freedom

## Dataset

**Freedom on the Net --- Freedom House**

## คำถามหลัก

> "ประเทศไทยมีระดับเสรีภาพอินเทอร์เน็ตอย่างไรเมื่อเทียบกับประเทศอื่น
> และคะแนนย่อยสะท้อนมิติใดบ้าง?"

------------------------------------------------------------------------

## 6.1 กราฟหลัก --- World Map

**ประเภท:** Choropleth Map

### Geographic Dimension

Country / ISO3

### Metric

`total_score`

### Color Meaning

ใช้ scale เดียวกันทุกประเทศในปีเดียวกัน

### สำคัญ

ต้องตรวจสอบคู่มือของ Freedom House ว่า score สูงหมายถึงระดับเสรีภาพสูงกว่า และแสดง
legend ให้ชัดเจน

### Interaction

เมื่อ click ประเทศ:

-   Country
-   Total Score
-   Access
-   Content
-   User Rights
-   Status

------------------------------------------------------------------------

## 6.2 กราฟ --- Thailand vs ASEAN

**ประเภท:** Horizontal Bar Chart

### Dimension

Country

### Metric

Total Internet Freedom Score

### Filter

Year

### Highlight

Thailand

### จุดประสงค์

ตอบ:

> "ประเทศไทยอยู่ตำแหน่งใดเมื่อเทียบกับประเทศอาเซียนในปีที่เลือก?"

### ข้อควรระวัง

ต้องตรวจสอบว่าประเทศใดมีข้อมูลในปีนั้นจริงก่อนสร้างกลุ่ม ASEAN

------------------------------------------------------------------------

## 6.3 กราฟ --- Thailand Score Trend

**ประเภท:** Line Chart

### X-axis

Year

### Y-axis

Total Score

### Series

Thailand

ถ้าต้องการเปรียบเทียบ: - Thailand - ASEAN average

แต่ต้องคำนวณ ASEAN average อย่างโปร่งใสและตรวจสอบจำนวนประเทศที่มีข้อมูลในแต่ละปี

### จุดประสงค์

ดูการเปลี่ยนแปลงของ Internet Freedom score ของไทยตามเวลา

------------------------------------------------------------------------

## 6.4 กราฟ --- Freedom Components

**ประเภท:** Grouped Bar Chart

เปรียบเทียบ 3 components:

-   Obstacles to Access
-   Limits on Content
-   Violations of User Rights

### จุดประสงค์

ไม่ดูแค่ total score แต่ดูว่า score มาจากมิติใด

------------------------------------------------------------------------

## 6.5 กราฟ --- Component Trend

ถ้ามีข้อมูลหลายปี:

**ประเภท:** Line Chart

Series:

-   Obstacles to Access
-   Limits on Content
-   Violations of User Rights

### จุดประสงค์

ดูว่ามิติใดเปลี่ยนแปลงมากที่สุดตามเวลา

------------------------------------------------------------------------

# 7. FINAL INSIGHTS --- สรุปภาพรวม

หน้านี้ไม่ควรเป็นหน้าที่นำตัวเลขทุก Dataset มารวมกันเป็นกราฟเดียว

เป้าหมายคือ **สังเคราะห์ Insight**

------------------------------------------------------------------------

## 7.1 Insight Card --- Information Threat

ตอบจาก AFNC:

> ข่าว/ข้อมูลประเภทใดถูกตรวจสอบบ่อยใน Dataset?

------------------------------------------------------------------------

## 7.2 Insight Card --- Financial Threat

ตอบจาก ACSC:

> การหลอกลวงประเภทใดมีจำนวนคดีหรือ financial loss สูงในข้อมูล?

------------------------------------------------------------------------

## 7.3 Insight Card --- AI Risk

ตอบจาก AI Incident Database:

> ความเสี่ยงจาก AI ที่ปรากฏบ่อยมีลักษณะใด?

------------------------------------------------------------------------

## 7.4 Insight Card --- Internet Environment

ตอบจาก Freedom on the Net:

> ประเทศไทยมีลักษณะ Internet Freedom อย่างไร และ component ใดโดดเด่น?

------------------------------------------------------------------------

## 7.5 Final Message

ควรสรุปในลักษณะ:

> "ข้อมูลทั้ง 4 ชุดสะท้อนภัยและสภาพแวดล้อมดิจิทัลคนละมิติ AFNC
> ช่วยให้เห็นข้อมูลที่ถูกตรวจสอบในบริบทข่าวปลอม/ข้อมูลบิดเบือน ACSC
> ช่วยให้เห็นจำนวนคดีและผลกระทบทางการเงิน AI Incident Database
> ช่วยให้เห็นรูปแบบความเสี่ยงจาก AI ในระดับโลก ขณะที่ Freedom on the Net
> ช่วยให้เข้าใจบริบทด้านการเข้าถึงข้อมูล เนื้อหา และสิทธิของผู้ใช้อินเทอร์เน็ต"

ข้อความจริงควรปรับตามผลวิเคราะห์ที่ได้จาก Dataset จริง

------------------------------------------------------------------------

# 8. Recommended Dashboard Filters

## Global Filters

ไม่จำเป็นต้องทำ Global Filter ทุกตัว เพราะ Dataset มีระดับเวลาและขอบเขตต่างกัน

แนะนำ:

### AFNC

-   Year
-   Month
-   Verdict
-   Category
-   Item Type

### ACSC

-   Week / Month / Year
-   Scam Type
-   Data quality / flag หากจำเป็น

### AI Incident

-   Year
-   Risk Domain
-   Intent
-   Deepfake indicator หากมีข้อมูลรองรับ

### Freedom on the Net

-   Year
-   Country
-   Region / ASEAN
-   Status

------------------------------------------------------------------------

# 9. Recommended Layout

## Desktop 16:9

### Header

ชื่อ Dashboard + subtitle + selected filters

### Row 1

KPI cards

### Row 2

Main visualization

### Row 3

Supporting charts 2--3 กราฟ

### Row 4

Detail table / explanation / source

------------------------------------------------------------------------

# 10. Visualization Selection Matrix

  --------------------------------------------------------------------------------------
  Research Question                Dataset           Recommended Chart Main Metric
  -------------------------------- ----------------- ----------------- -----------------
  ข่าวที่ตรวจสอบเปลี่ยนอย่างไรตามเวลา?   AFNC              Line              Count

  Verdict มีสัดส่วนอย่างไร?            AFNC              100% Stacked Bar  \%

  หัวข้อใดพบมาก?                     AFNC              Horizontal Bar    Count

  Scam cases เปลี่ยนอย่างไร?          ACSC              Line              Cases

  Loss เปลี่ยนอย่างไร?                ACSC              Line              Baht

  Scam type ใดมีคดีสูง?               ACSC              Horizontal Bar    Cases

  Scam type ใด loss สูง?            ACSC              Horizontal Bar    Baht

  Cases กับ loss มีความสัมพันธ์อย่างไร?  ACSC              Scatter           Cases vs Loss

  AI incidents เปลี่ยนอย่างไร?        AI Incident       Line              Count

  Risk domain ใดพบมาก?             AI Incident       Horizontal Bar    Count

  Risk × Intent เป็นอย่างไร?         AI Incident       Heatmap           Count

  Internet Freedom ทั่วโลกเป็นอย่างไร? Freedom on the    Choropleth Map    Total Score
                                   Net                                 

  Thailand เทียบ ASEAN              Freedom on the    Bar               Total Score
                                   Net                                 

  Thailand score เปลี่ยนอย่างไร?      Freedom on the    Line              Total Score
                                   Net                                 

  Components แตกต่างกันอย่างไร?       Freedom on the    Grouped Bar       Component Score
                                   Net                                 
  --------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 11. กราฟที่ "ควรมี" ถ้าต้องลดจำนวนกราฟ

หากอาจารย์กำหนดจำนวนกราฟไม่มาก แนะนำให้เหลือ **12 กราฟหลัก**

### AFNC

1.  Verification Trend --- Line
2.  Verdict Composition --- 100% Stacked Bar
3.  Fake News Topics --- Horizontal Bar

### ACSC

4.  Weekly Cases --- Line
5.  Weekly Loss --- Line
6.  Cases by Scam Type --- Horizontal Bar
7.  Loss by Scam Type --- Horizontal Bar

### AI Incident

8.  AI Incidents by Year --- Line
9.  Risk Domain --- Horizontal Bar

### Freedom on the Net

10. World Map --- Choropleth
11. Thailand vs ASEAN --- Horizontal Bar
12. Component Breakdown --- Grouped Bar

ชุดนี้ครอบคลุมทั้ง **Trend + Composition + Ranking + Geographic Comparison +
Component Comparison**

------------------------------------------------------------------------

# 12. กราฟที่ไม่แนะนำ

## 12.1 Pie Chart จำนวนมาก

ไม่แนะนำใช้ Pie Chart สำหรับ:

-   trend
-   ranking
-   category ที่มีหลายประเภท

Bar Chart อ่านง่ายกว่า

------------------------------------------------------------------------

## 12.2 Dual Axis โดยไม่จำเป็น

เช่น Cases + Loss ในกราฟเดียว

เหตุผล: - scale ต่างกันมาก - อาจทำให้ผู้ชมเข้าใจผิดว่าการเคลื่อนไหวของสอง metric
มีความสัมพันธ์กัน

แนะนำแยกเป็น 2 กราฟ

------------------------------------------------------------------------

## 12.3 รวม 4 Dataset เป็นกราฟเดียว

ไม่แนะนำ:

> AFNC count + ACSC cases + AI incidents + Internet Freedom score

เพราะเป็นคนละ unit และคนละ definition

------------------------------------------------------------------------

## 12.4 Correlation ที่ไม่มีเหตุผลเชิงข้อมูล

อย่าทำ scatter ระหว่าง:

-   Internet Freedom score vs Fake News count
-   Internet Freedom score vs Scam cases
-   Internet Freedom score vs AI incidents

เพียงเพราะมีตัวเลขทั้งสองชุด

หากจะทำต้องมี: - key ที่จับคู่ได้อย่างสมเหตุผล - time alignment หรือ country
alignment - methodology ที่รองรับ - การตีความที่ไม่เกินข้อมูล

------------------------------------------------------------------------

# 13. Data Quality Indicators ที่ควรแสดง

เพราะ Handoff ระบุว่ายังต้องตรวจสอบข้อมูลจริงก่อนสร้าง Dashboard แนะนำให้มีส่วนเล็ก ๆ
แสดงสถานะคุณภาพข้อมูล

ตัวอย่าง:

-   Rows loaded
-   Date coverage
-   Missing values
-   Duplicate rows
-   Countries available
-   Last updated / source period
-   Data quality flags

ไม่ต้องทำเป็นกราฟใหญ่ อาจเป็น small status panel

------------------------------------------------------------------------

# 14. Source & Methodology Footer

ทุกหน้าควรมี footer:

**Source:** Dataset name / source organization

**Period:** YYYY--YYYY หรือช่วงเวลาจริง

**Unit:** Count / Cases / Baht / Score

**Note:** ตัวเลขสะท้อนข้อมูลที่อยู่ใน Dataset
ไม่จำเป็นต้องเท่ากับจำนวนเหตุการณ์จริงทั้งหมด

สำหรับ Freedom on the Net ให้ระบุว่าคะแนนเป็นการประเมินตามกรอบของ Freedom
House

------------------------------------------------------------------------

# 15. Recommended Storytelling Order

ลำดับที่แนะนำสำหรับการนำเสนอหน้าชั้น:

### 01 --- Overview

"ภัยดิจิทัลมีหลายรูปแบบ"

↓

### 02 --- Fake News

"เราเผชิญข้อมูลที่ต้องตรวจสอบและข้อมูลบิดเบือนแบบใด?"

↓

### 03 --- Online Scams

"ภัยดิจิทัลไม่ได้มีแค่เรื่องข้อมูล แต่สร้างความเสียหายทางการเงินจริง"

↓

### 04 --- AI Risks

"เมื่อ AI เข้ามา ความเสี่ยงมีรูปแบบใดเพิ่มเข้ามาในภาพรวม?"

↓

### 05 --- Internet Freedom

"ทั้งหมดนี้เกิดขึ้นภายใต้สภาพแวดล้อมอินเทอร์เน็ตที่แต่ละประเทศมีระดับการเข้าถึง เนื้อหา
และสิทธิแตกต่างกัน"

↓

### 06 --- Final Insights

"เราควรเข้าใจข้อมูลเหล่านี้อย่างไร และสิ่งใดเกี่ยวข้องกับชีวิตประจำวัน?"

------------------------------------------------------------------------

# 16. สิ่งที่ Developer ต้องทำก่อนสร้างกราฟจริง

1.  ตรวจสอบไฟล์จริงของทั้ง 4 Dataset
2.  สร้าง Dataset Inventory
3.  ยืนยันชื่อ column
4.  ยืนยัน data type
5.  ตรวจสอบช่วงเวลา
6.  ตรวจสอบ missing values
7.  ตรวจสอบ duplicate
8.  ตรวจสอบ category ที่สะกดต่างกัน
9.  ตรวจสอบ definition ของแต่ละ metric
10. ค่อยสร้าง calculated fields
11. สร้าง EDA
12. ตรวจสอบตัวเลขกับ source
13. จึงนำไปทำ Dashboard

> ห้ามสร้างกราฟจากชื่อ field ที่ยังไม่ยืนยันว่ามีอยู่จริง

------------------------------------------------------------------------

# 17. Acceptance Criteria ของกราฟ

กราฟแต่ละกราฟควรผ่าน checklist นี้:

-   [ ] ตอบคำถามอย่างน้อย 1 ข้อ
-   [ ] มี Dataset/source ระบุชัดเจน
-   [ ] มีช่วงเวลา
-   [ ] มีหน่วย
-   [ ] Label อ่านง่าย
-   [ ] Tooltip อธิบายค่าได้
-   [ ] Filter แล้วค่าปรับตามจริง
-   [ ] ไม่รวม metric คนละหน่วยโดยไม่จำเป็น
-   [ ] ไม่สร้าง category ที่ไม่มีใน source โดยไม่มี methodology
-   [ ] ไม่สรุป causal relationship
-   [ ] ไม่ใช้ตัวเลขสมมติเป็นข้อมูลจริง
-   [ ] ตรวจสอบกับ source แล้ว

------------------------------------------------------------------------

# 18. สรุป Design Direction

Dashboard นี้ควรให้ความรู้สึกเป็น **Data Storytelling** มากกว่า Dashboard
ที่เต็มไปด้วยกราฟ

หลักการ:

> **Overview → Evidence → Impact → Context → Insight**

และควรใช้กราฟเท่าที่จำเป็น โดยให้แต่ละกราฟมี "คำถาม" ของตัวเอง

เป้าหมายไม่ใช่การแสดงกราฟให้เยอะที่สุด แต่คือการทำให้ผู้ชมเข้าใจว่า:

**Digital threats มีหลายมิติ และแต่ละ Dataset
ช่วยให้เราเห็นคนละส่วนของภาพเดียวกัน**
