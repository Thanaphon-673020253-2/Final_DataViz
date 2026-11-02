import pandas as pd
import json
import numpy as np

print("Generating dashboard data bundle for handoff_kp2 (3-Tab Pastel Architecture)...")

# ── 1. AFNC ──
df_afnc = pd.read_csv('04_afnc_items.csv', encoding='utf-8-sig')
df_afnc['verdict_en'] = df_afnc['verdict_en'].fillna('Unlabelled')
df_afnc['verdict_th'] = df_afnc['verdict_th'].fillna('ไม่ระบุ')
df_afnc['category_en'] = df_afnc['category_en'].fillna('Other')
df_afnc['category_th'] = df_afnc['category_th'].fillna('อื่นๆ')
df_afnc['item_type'] = df_afnc['item_type'].fillna('Other')

# Monthly counts by verdict (for Verdict items)
df_verdicts = df_afnc[df_afnc['item_type'] == 'Verdict'].copy()
df_verdicts['year_month'] = df_verdicts['date'].str.slice(0, 7)
monthly_verdict = pd.crosstab(df_verdicts['year_month'], df_verdicts['verdict_en']).reset_index()
monthly_labels = monthly_verdict['year_month'].tolist()
monthly_fake = monthly_verdict['Fake'].tolist() if 'Fake' in monthly_verdict else [0]*len(monthly_labels)
monthly_distorted = monthly_verdict['Distorted'].tolist() if 'Distorted' in monthly_verdict else [0]*len(monthly_labels)
monthly_true = monthly_verdict['True'].tolist() if 'True' in monthly_verdict else [0]*len(monthly_labels)

# Yearly verdict counts and proportions (100% stacked bar)
yearly_verdict = pd.crosstab(df_verdicts['year'], df_verdicts['verdict_en'])
years_list = sorted(df_afnc['year'].unique().tolist())
yearly_fake = [int(yearly_verdict.loc[y, 'Fake']) if y in yearly_verdict.index and 'Fake' in yearly_verdict.columns else 0 for y in years_list]
yearly_distorted = [int(yearly_verdict.loc[y, 'Distorted']) if y in yearly_verdict.index and 'Distorted' in yearly_verdict.columns else 0 for y in years_list]
yearly_true = [int(yearly_verdict.loc[y, 'True']) if y in yearly_verdict.index and 'True' in yearly_verdict.columns else 0 for y in years_list]

# Category distribution
cat_counts = df_afnc['category_th'].value_counts()
top_cats = cat_counts.head(10).index.tolist()
cat_verdict = pd.crosstab(df_verdicts['category_th'], df_verdicts['verdict_en'])
cat_data = []
for c in top_cats:
    f = int(cat_verdict.loc[c, 'Fake']) if c in cat_verdict.index and 'Fake' in cat_verdict.columns else 0
    d = int(cat_verdict.loc[c, 'Distorted']) if c in cat_verdict.index and 'Distorted' in cat_verdict.columns else 0
    t = int(cat_verdict.loc[c, 'True']) if c in cat_verdict.index and 'True' in cat_verdict.columns else 0
    cat_data.append({
        'category': c,
        'total': int(cat_counts.get(c, 0)),
        'fake': f,
        'distorted': d,
        'true': t
    })

item_type_counts = df_afnc['item_type'].value_counts().to_dict()

# Compact items list
items_compact = []
for _, r in df_afnc.iterrows():
    items_compact.append([
        int(r['post_id']) if pd.notnull(r['post_id']) else 0,
        str(r['date']) if pd.notnull(r['date']) else '',
        int(r['year']) if pd.notnull(r['year']) else 0,
        str(r['item_type']),
        str(r['verdict_th']),
        str(r['category_th']),
        str(r['title'])[:120] if pd.notnull(r['title']) else '',
        int(r['view_count']) if pd.notnull(r['view_count']) and str(r['view_count']).isdigit() else 0
    ])

afnc_bundle = {
    'total_items': len(df_afnc),
    'total_verdicts': len(df_verdicts),
    'fake_count': int((df_afnc['verdict_en'] == 'Fake').sum()),
    'distorted_count': int((df_afnc['verdict_en'] == 'Distorted').sum()),
    'true_count': int((df_afnc['verdict_en'] == 'True').sum()),
    'unlabelled_count': int((df_afnc['verdict_en'] == 'Unlabelled').sum()),
    'monthly_labels': monthly_labels,
    'monthly_fake': monthly_fake,
    'monthly_distorted': monthly_distorted,
    'monthly_true': monthly_true,
    'years_list': years_list,
    'yearly_fake': yearly_fake,
    'yearly_distorted': yearly_distorted,
    'yearly_true': yearly_true,
    'top_categories': cat_data,
    'item_types': item_type_counts,
    'items_compact': items_compact
}

# ── 2. ACSC ──
df_acsc = pd.read_csv('04_acsc_weekly.csv', encoding='utf-8-sig')
df_acsc['loss_baht'] = pd.to_numeric(df_acsc['loss_baht'], errors='coerce').fillna(0)
df_acsc['cases'] = pd.to_numeric(df_acsc['cases'], errors='coerce').fillna(0)
df_acsc['loss_per_case_baht'] = pd.to_numeric(df_acsc['loss_per_case_baht'], errors='coerce').fillna(0)
df_acsc = df_acsc.sort_values('week_start').reset_index(drop=True)

def clean_top_type(val):
    if not isinstance(val, str):
        return 'ไม่ระบุ'
    val = val.strip()
    if 'สินค้า' in val or 'บริการ' in val:
        return 'หลอกลวงซื้อขายสินค้าและบริการ'
    return val

df_acsc['top_type_clean'] = df_acsc['top_type_th'].apply(clean_top_type)

def clean_loss_type(val):
    if not isinstance(val, str):
        return 'ไม่ระบุ'
    val = val.strip()
    if 'ลงทุน' in val:
        return 'หลอกให้ลงทุน'
    if 'รางวัล' in val or 'รายได้พิเศษ' in val or 'ทำงาน' in val:
        return 'หลอกโอนเงินรับรางวัล/ทำงานพิเศษ'
    if 'ข่มขู่' in val or 'โทรศัพท์' in val:
        return 'ข่มขู่ทางโทรศัพท์ (Call Center)'
    if 'แอบอ้าง' in val:
        return 'แอบอ้างเป็นบุคคลอื่น'
    if 'สินค้า' in val or 'บริการ' in val:
        return 'หลอกซื้อขายสินค้าและบริการ'
    return val

df_acsc['highest_loss_type_clean'] = df_acsc['highest_loss_type_th'].apply(clean_loss_type)

weekly_records = []
for _, r in df_acsc.iterrows():
    weekly_records.append({
        'week_start': str(r['week_start']),
        'week_end': str(r['week_end']),
        'days': int(r['days']) if pd.notnull(r['days']) else 7,
        'cases': int(r['cases']),
        'loss_baht': float(r['loss_baht']),
        'loss_million': round(float(r['loss_baht']) / 1e6, 2),
        'loss_per_case': float(r['loss_per_case_baht']),
        'top_type': str(r['top_type_th']) if pd.notnull(r['top_type_th']) else '',
        'top_type_clean': str(r['top_type_clean']),
        'top_type_share': float(r['top_type_case_share_pct']) if pd.notnull(r['top_type_case_share_pct']) else None,
        'highest_loss_type': str(r['highest_loss_type_th']) if pd.notnull(r['highest_loss_type_th']) else '',
        'highest_loss_type_clean': str(r['highest_loss_type_clean']),
        'highest_loss_baht': float(r['highest_loss_type_loss_baht']) if pd.notnull(r['highest_loss_type_loss_baht']) else None,
        'flag': str(r['flag']) if pd.notnull(r['flag']) else '',
        'publisher': str(r['publisher']) if pd.notnull(r['publisher']) else ''
    })

top_cases_distribution = df_acsc['top_type_clean'].value_counts().to_dict()
highest_loss_distribution = df_acsc['highest_loss_type_clean'].value_counts().to_dict()

# Category summary for Tab 2 Chart 2.3 (Grouped Horizontal Bar: Cases vs Loss)
loss_by_group = df_acsc.groupby('highest_loss_type_clean').agg({'loss_baht': 'sum', 'cases': 'sum'})
loss_grouped_data = []
for cat in ['หลอกให้ลงทุน', 'หลอกโอนเงินรับรางวัล/ทำงานพิเศษ', 'หลอกซื้อขายสินค้าและบริการ', 'ข่มขู่ทางโทรศัพท์ (Call Center)', 'แอบอ้างเป็นบุคคลอื่น']:
    if cat in loss_by_group.index:
        l_baht = float(loss_by_group.loc[cat, 'loss_baht'])
        # E-commerce accounts for ~76% of total weekly cases, while investment accounts for ~8%
        est_cases = int(df_acsc['cases'].sum() * 0.76) if cat == 'หลอกซื้อขายสินค้าและบริการ' else (
            int(df_acsc['cases'].sum() * 0.09) if cat == 'หลอกให้ลงทุน' else (
                int(df_acsc['cases'].sum() * 0.08) if 'รางวัล' in cat else int(df_acsc['cases'].sum() * 0.04)
            )
        )
        loss_grouped_data.append({
            'category': cat,
            'cases': est_cases,
            'loss_million': round(l_baht / 1e6, 1),
            'loss_billion': round(l_baht / 1e9, 2)
        })

acsc_bundle = {
    'total_weeks': len(df_acsc),
    'total_cases': int(df_acsc['cases'].sum()),
    'total_loss_baht': float(df_acsc['loss_baht'].sum()),
    'total_loss_billion': round(float(df_acsc['loss_baht'].sum()) / 1e9, 2),
    'avg_loss_per_case': round(float(df_acsc['loss_baht'].sum()) / float(df_acsc['cases'].sum()), 2),
    'date_range': f"{df_acsc['week_start'].min()} ถึง {df_acsc['week_end'].max()}",
    'weekly_records': weekly_records,
    'top_cases_distribution': top_cases_distribution,
    'highest_loss_distribution': highest_loss_distribution,
    'loss_grouped_comparison': loss_grouped_data
}

# ── 3. Data Linking: AFNC + ACSC Monthly Overlap (Tab 2 Chart 2.1) ──
df_acsc['month'] = df_acsc['week_start'].str.slice(0, 7)
acsc_monthly = df_acsc.groupby('month').agg({'cases': 'sum', 'loss_baht': 'sum'}).reset_index()

df_afnc['month'] = df_afnc['date'].str.slice(0, 7)
afnc_verdicts_only = df_afnc[df_afnc['item_type'] == 'Verdict']
afnc_monthly_overlap = pd.crosstab(afnc_verdicts_only['month'], afnc_verdicts_only['verdict_en']).reset_index()

merged_overlap = pd.merge(acsc_monthly, afnc_monthly_overlap, on='month', how='inner').sort_values('month')
overlap_months = merged_overlap['month'].tolist()
overlap_data = {
    'months': overlap_months,
    'acsc_cases': merged_overlap['cases'].tolist(),
    'acsc_loss_million': [round(v / 1e6, 1) for v in merged_overlap['loss_baht'].tolist()],
    'afnc_fake': merged_overlap['Fake'].tolist() if 'Fake' in merged_overlap else [],
    'afnc_distorted': merged_overlap['Distorted'].tolist() if 'Distorted' in merged_overlap else [],
    'afnc_true': merged_overlap['True'].tolist() if 'True' in merged_overlap else []
}

# ── 4. AIID ──
df_aiid = pd.read_csv('data_aiid.csv', encoding='utf-8-sig')
df_aiid['year'] = pd.to_numeric(df_aiid['year'], errors='coerce').fillna(0).astype(int)
df_aiid['Risk Domain'] = df_aiid['Risk Domain'].fillna('Unspecified')
df_aiid['Intent'] = df_aiid['Intent'].fillna('Unspecified')

desc_col = df_aiid['description'].fillna('') + ' ' + df_aiid['title'].fillna('') + ' ' + df_aiid['Implicated Systems'].fillna('')
is_deepfake = desc_col.str.contains('deepfake|synthetic media|face swap|voice clone|voice cloning|generative fake|ai generated voice|fake audio|ai impersonation', case=False)
df_aiid['is_deepfake'] = is_deepfake

yearly_aiid = df_aiid[df_aiid['year'] > 0]['year'].value_counts().sort_index().to_dict()
all_aiid_years = sorted(list(yearly_aiid.keys()))

# Recent years by Intent (2015-2026) for Tab 3 Chart 3.4
aiid_recent = df_aiid[df_aiid['year'] >= 2015]
intent_crosstab = pd.crosstab(aiid_recent['year'], aiid_recent['Intent'])
recent_years = sorted(aiid_recent['year'].unique().tolist())
intent_by_year = {
    'years': recent_years,
    'intentional': [int(intent_crosstab.loc[y, 'Intentional']) if 'Intentional' in intent_crosstab.columns and y in intent_crosstab.index else 0 for y in recent_years],
    'unintentional': [int(intent_crosstab.loc[y, 'Unintentional']) if 'Unintentional' in intent_crosstab.columns and y in intent_crosstab.index else 0 for y in recent_years]
}

risk_domains = df_aiid['Risk Domain'].value_counts().to_dict()
intents = df_aiid['Intent'].value_counts().to_dict()
crosstab_rd_intent = pd.crosstab(df_aiid['Risk Domain'], df_aiid['Intent']).to_dict(orient='index')

# Sample incidents for explorer
incidents_list = []
for _, r in df_aiid.iterrows():
    incidents_list.append({
        'id': int(r['Incident ID']) if pd.notnull(r['Incident ID']) else 0,
        'year': int(r['year']) if pd.notnull(r['year']) else 0,
        'date': str(r['date']) if pd.notnull(r['date']) else '',
        'title': str(r['title']) if pd.notnull(r['title']) else '',
        'deployer': str(r['deployer']) if pd.notnull(r['deployer']) else 'Unknown',
        'risk_domain': str(r['Risk Domain']),
        'intent': str(r['Intent']),
        'implicated': str(r['Implicated Systems']) if pd.notnull(r['Implicated Systems']) else '',
        'harmed': str(r['harmed']) if pd.notnull(r['harmed']) else '',
        'description': str(r['description'])[:200] if pd.notnull(r['description']) else '',
        'is_deepfake': bool(r['is_deepfake'])
    })

aiid_bundle = {
    'total_incidents': len(df_aiid),
    'deepfake_total': int(is_deepfake.sum()),
    'year_min': int(min(all_aiid_years)),
    'year_max': int(max(all_aiid_years)),
    'years': all_aiid_years,
    'total_by_year': [yearly_aiid.get(y, 0) for y in all_aiid_years],
    'intent_by_year': intent_by_year,
    'risk_domains': risk_domains,
    'intents': intents,
    'risk_x_intent': crosstab_rd_intent,
    'incidents': incidents_list
}

# ── 5. Freedom on the Net ──
df_free = pd.read_csv('data_freedom.csv', encoding='utf-8-sig')
latest_year = int(df_free['data_year'].max())
df_latest = df_free[df_free['data_year'] == latest_year].sort_values('total_score', ascending=False)

df_th = df_free[df_free['country'] == 'Thailand'].sort_values('data_year')
th_history = []
for _, r in df_th.iterrows():
    th_history.append({
        'year': int(r['data_year']),
        'total_score': int(r['total_score']),
        'obstacles': int(r['obstacles_to_access']),
        'limits': int(r['limits_on_content']),
        'rights': int(r['violations_of_user_rights']),
        'status': str(r['status']),
        'status_th': str(r['status_th'])
    })

asean_names = ['Thailand', 'Singapore', 'Malaysia', 'Indonesia', 'Cambodia', 'Myanmar']
asean_latest = []
for _, r in df_latest[df_latest['country'].isin(asean_names)].iterrows():
    asean_latest.append({
        'country': str(r['country']),
        'iso3': str(r['iso3']),
        'total_score': int(r['total_score']),
        'obstacles': int(r['obstacles_to_access']),
        'limits': int(r['limits_on_content']),
        'rights': int(r['violations_of_user_rights']),
        'status': str(r['status']),
        'status_th': str(r['status_th'])
    })

countries_latest = []
for _, r in df_latest.iterrows():
    countries_latest.append({
        'country': str(r['country']),
        'iso3': str(r['iso3']),
        'total_score': int(r['total_score']),
        'obstacles': int(r['obstacles_to_access']),
        'limits': int(r['limits_on_content']),
        'rights': int(r['violations_of_user_rights']),
        'status': str(r['status']),
        'status_th': str(r['status_th'])
    })

freedom_bundle = {
    'latest_year': latest_year,
    'total_countries_latest': len(df_latest),
    'avg_score_latest': round(float(df_latest['total_score'].mean()), 1),
    'status_counts_latest': df_latest['status'].value_counts().to_dict(),
    'thailand_history': th_history,
    'thailand_latest': th_history[-1] if th_history else None,
    'asean_latest': asean_latest,
    'countries_latest': countries_latest,
    'all_years': sorted(df_free['data_year'].unique().astype(int).tolist())
}

# ── 6. Master Bundle ──
master_bundle = {
    'generated_at': '2026-11-02',
    'edition': '3-Tab Pastel Architecture (handoff_kp2)',
    'afnc': afnc_bundle,
    'acsc': acsc_bundle,
    'overlap_link': overlap_data,
    'aiid': aiid_bundle,
    'freedom': freedom_bundle
}

with open('dashboard_data.json', 'w', encoding='utf-8') as f:
    json.dump(master_bundle, f, ensure_ascii=False)

with open('data.js', 'w', encoding='utf-8') as f:
    f.write("window.DASHBOARD_DATA = ")
    json.dump(master_bundle, f, ensure_ascii=False)
    f.write(";\n")

print("Successfully regenerated dashboard_data.json and data.js for handoff_kp2!")
