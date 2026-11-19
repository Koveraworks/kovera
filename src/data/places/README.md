# Places (states and districts)

One source of truth: `source/places.json`. Everything else is generated.

- Source: Local Government Directory (LGD), Ministry of Panchayati Raj (https://lgdirectory.gov.in), read through the daily LGD scrape archive `ramSeraph/opendata`, release `lgd-latest`, files `districts.19Nov2026.csv` and `states.19Nov2026.csv` (https://github.com/ramSeraph/opendata/releases/tag/lgd-latest).
- Retrieved: 2026-11-19 (the archive was refreshed that day). lgdirectory.gov.in itself only serves downloads behind a captcha form, so the archive was used instead.
- Totals: 36 states and UTs, 790 districts.

## Update

Edit `source/places.json`, then run `node scripts/build-places.mjs`. It validates and regenerates `states.js`, `districts/<CODE>.json` and `supabase/places.sql` (apply that after `supabase/schema.sql`).

## What was added by hand on top of LGD

The district set is exactly LGD's: nothing added or removed. Hand work:

- `hi` (Hindi names) for every district and state: LGD gives no Hindi for districts, so these are standard Devanagari transliterations written by hand. They are not verified by a native review.
- `aliases`: common alternate spellings and old names (Gurgaon, Mohali, Allahabad, Bangalore, Bombay, ...).
- State codes: ISO 3166-2:IN style (Telangana TS, Odisha OD, Dadra and Nagar Haveli and Daman and Diu DH).
- Display-name cleanups of the LGD `en` (the LGD spelling is kept as an alias where it differs): "And" to "and" everywhere; Andhra Pradesh "Ntr" to "NTR", "Y.S.R. Kadapa" to "YSR Kadapa"; Assam "Marigaon" to "Morigaon"; Bihar "Kaimur (Bhabua)" to "Kaimur"; Chhattisgarh "Manendragarh-Chirmiri-Bharatpur(M C B)" without the suffix; Jharkhand "East Singhbum" to "East Singhbhum"; Lakshadweep "Lakshadweep District" to "Lakshadweep"; Madhya Pradesh "Khandwa (East Nimar)" to "Khandwa", "Khargone (West Nimar)" to "Khargone", "MAUGANJ" to "Mauganj"; Punjab "S.A.S Nagar" to "SAS Nagar"; Tamil Nadu "The Nilgiris" to "Nilgiris".
- Odisha: LGD uses Odia-style spellings; renamed to the common names Angul, Bargarh, Deogarh, Cuttack, Nayagarh, Sundargarh, Kandhamal (LGD forms kept as aliases).
- Delhi: LGD names such as "East" or "Central" are shown as "East Delhi", "Central Delhi", etc.; "New Delhi" also carries the alias "Delhi".

## Not independently verified

The district list was not cross-checked against a second source. Notably, recent additions (for example Goa "Kushavati", Ladakh's eight districts including "Leh Ladakh", Delhi's 13 districts, Andhra Pradesh "Polavaram" and "Markapuram", Haryana "Hansi") are as LGD lists them. Rajasthan's 41 districts match the post-December-2024 abolitions (Anupgarh, Dudu, Gangapur City, Jaipur Rural, Jodhpur Rural, Kekri, Neem Ka Thana, Sanchore and Shahpura are absent).
