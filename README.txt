REVISION HUB — HOW TO USE
==========================

FILES (keep all of these in the SAME folder — they link to each other by name)
--------------------------------------------------------------------------------
index.html            Homepage. Just a "Start" button.
hub.html              Dashboard — starts clean and shows attempts you add/import,
                       plus confidence, mastery, trends and analysis.
add-exam.html         Upload tool. Turns a raw Moodle "attempt review" export
                       into a themed debrief page automatically.
view.html             Reusable debrief/retry view for imported exam attempts.


1) OPEN THE SITE
--------------------------------------------------------------------------------
Double-click index.html. Click Start. A fresh copy opens with no preloaded
exam attempts. Add/import an attempt to populate the dashboard and analysis.


2) ADD A NEW EXAM ATTEMPT
--------------------------------------------------------------------------------
Step A — Export the attempt from Moodle
  Open your finished attempt review page > right-click > Save As >
  "Webpage, HTML only" > save it somewhere you can find it.

Step B — Auto-build the basic debrief
  Open add-exam.html in your browser.
  Fill in: Subject, Exam title, Output filename.
  Upload the file you just saved.
  Click "Parse & Generate Debrief."
  Click "Download Debrief Page" — this saves a new .html file with your
  answers, the correct answers, and question text already filled in.
  Move that downloaded file into the SAME folder as the other files above.

Step C — Get detailed explanations written in (this part needs Claude)
  Come back to this chat (or start a new one) and upload the file you just
  downloaded in Step B. Ask Claude to "write the debrief explanations for
  the incorrect answers, same style as before." Claude will hand back an
  updated version of that same file — replace the one in your folder with it.

Step D — Register it on the hub
  On add-exam.html, after generating, there's a ready-made code snippet
  (subject, title, filename, score already filled in).
  Copy it. Open hub.html in a text editor. Find the EXAMS list near the
  bottom of the file (search for "var EXAMS ="). Paste your new entry in
  as one more item in that list, then save the file.
  Reload hub.html — your new exam now shows up as a card.


3) SAVING / BACKING UP YOUR DATA
--------------------------------------------------------------------------------
There's no database — every exam's data lives directly inside its own
.html file. "Saving your data" just means keeping this folder safe:
  - Keep the whole folder in a cloud-synced location (Google Drive,
    iCloud Drive, OneDrive, Dropbox) so it's backed up automatically, or
  - Zip the folder occasionally and keep a copy somewhere safe.
Do NOT lose hub.html specifically — it's the only file that remembers
which exams exist and their scores; the individual exam files are self-
contained but won't show up anywhere without an entry in hub.html.


4) IF YOU WANT IT ON A REAL WEBSITE LATER
--------------------------------------------------------------------------------
Same 5 files, drag-and-dropped into any free static host (Cloudflare
Pages, Netlify, GitHub Pages) — no changes needed to the files themselves.

5) NEW LEARNING FEATURES
--------------------------------------------------------------------------------
Custom/imported exams opened through view.html now include:
  - Confidence Calibration: save a 1-10 pre-result confidence rating. The hub
    compares confidence with the actual score.
  - Retry My Mistakes: re-answer only incorrect MCQs without seeing the answer
    first. Retry history is stored separately and never overwrites exam scores.
  - Topic Mastery: the hub aggregates topic-tagged exam results into Needs Work,
    Developing, and Strong mastery levels and stores a local mastery snapshot.

These features still use localStorage only. They do not require a database.


6) PROGRESS TESTS, MOCK TESTS AND ANALYSIS RESET
------------------------------------------------------
Choose Progress Test or Mock Test and a whole test number in Add New Exam.
Numbers 1–10 are suggested; higher numbers are supported. The title is an
optional extra description. Each save creates a separate attempt so retakes
do not overwrite earlier debriefs. The backup registration snippet preserves
the type and number too.
Each subject has two score lines: blue solid Progress Test, red dashed Mock Test.
The x axis is the test number. If a number is repeated, its latest saved score
is plotted; all attempts remain available in the hub and other analysis.
Existing attempts infer their type/number from their title; untyped attempts
default to Mock Test. Use the attempt's options menu to change classification.
Reset Analysis asks for confirmation, excludes existing attempts from future
analysis and clears confidence ratings, retry history and topic mastery.
It keeps exam files, imported questions, review progress, financial data,
password, countdowns and final exam progress. New imports start fresh analysis.
Use the same browser and site address to retain your existing local data.


7) FIA AND ACCA SUBJECT CATALOG
------------------------------------------------------
The subject list includes 10 FIA exam papers and all 15 current ACCA paper
choices, including the four Strategic Professional options. Subjects are
grouped by qualification stage in Add New Exam and countdown selectors.
The current-subject selector, progress tracker and chart ordering use the
same catalog. Existing paper labels are recognized by code and mapped to
the official title without deleting saved questions or scores.
FIA and ACCA equivalents (e.g. FFA and FA) remain separate subjects.
Country variants can be added using Add a new subject (e.g. TX-MYS).
The topic reference panel covers FIA; it is not a complete ACCA syllabus.
Source: https://www.accaglobal.com/my/en/help/registration.html
Source: https://www.accaglobal.com/sg/en/student/getting-started/acca-qualification-structure.html

8) FINANCIAL TRACKER AND FINANCIAL DASHBOARD
------------------------------------------------------
Financial Tracker keeps Income & Expenses, Savings, Investments and Gold.
Use the two top navigation links to move between it and Financial Dashboard.
Your existing rh_finance_v1 browser records are reused; there is no reset or
replacement on opening the updated pages. Keep the same browser and site
address. File URLs may have different storage behavior between browsers.
Export finance backup before moving to another browser, device or address.

NEW TRACKER FIELDS
- Savings and investments now have dates. Use Edit to add dates to older rows.
- Expenses have a category and behavior: fixed, variable essential,
  discretionary, or unclassified.
- Investment lots can include an asset class, current lot value, annual fund
  expense ratio (%) and retirement/tax account tag.
- Gold can include grams and a manually entered current lot value.
- Edit updates a saved lot instead of recording the same holding twice.
- Record savings/investment/gold allocations in their own tab, not again as
  expenses. Expense records should represent actual consumption or costs.

DASHBOARD SETUP
1. Choose an analysis month. The comparison uses that month and the prior one;
   trend charts show a rolling 12-month period ending with the selected month.
2. Enter current assets and debt in Wealth Snapshots. Add a new dated snapshot
   each month (or more frequently) to build a net worth history. Include every
   asset once; these are BALANCES, not contributions. Snapshot charts support
   multiple years and use actual recorded dates.
3. Set your bare-minimum monthly expense baseline, annual expense baseline,
   savings rate target, emergency-fund months, FI multiple, and personal annual
   retirement-account contribution goal under Targets & Assumptions.
4. Keep investment lot values and fee percentages current in the tracker.
5. Export finance backup periodically. It includes tracker records, snapshots
   and target settings. Restore requires confirmation and validates the file.

FORMULAS AND DATA SCOPE
- Cash surplus = recorded take-home income - recorded expenses.
- Savings rate = cash surplus / income x 100. This includes unallocated cash
  surplus; it is distinct from contributions entered in savings/investments.
  No income gives no rate, not a fabricated zero percentage.
- Allocated money = savings + investment contributions + gold purchase cost.
- Net worth = snapshot assets - snapshot liabilities. Savings and investment
  contribution totals are NOT added to net worth again.
- Emergency coverage = designated emergency cash / monthly essential baseline.
  Emergency cash is a subset of cash assets and cannot exceed total cash.
- FI target = annual expense baseline x configurable multiple (default 25).
  FI portfolio includes stocks, bonds, gold and other investments in the
  snapshot. Cash, real estate and other non-investment assets are excluded.
  The 25x assumption is an illustrative planning target, not a guarantee.
- Weighted fee ratio = sum(value x fee %) / sum(values with known fees).
  Values use each lot's entered value, or its cost if no value was entered.
  Coverage is shown so unknown fees are never silently treated as zero.
- Annual fee estimate = sum(lot value x fee percentage / 100).
- Retirement-account progress = dated contributions tagged with the selected
  account, from January through the selected month, divided by your annual
  target. This is a personal goal, not a statutory limit or tax relief claim.
- Investment cost vs value uses only lots with a recorded value. Gains are
  unrealized recorded value minus cost, without distributions or annualization.
- Gold purchase cost, grams and entered value remain distinct quantities.

MISSING / HISTORICAL DATA
Old rows without a date remain in the tracker but are excluded from monthly
flows and cumulative dated contribution trends. Add dates with Edit.
Balances are manual. The selected month's wealth uses the latest snapshot on
or before that month and shows its date. Current lot values are the latest
entered values, not reconstructed prices for previous months. Future-dated
rows do not enter an earlier month's totals. Months without records indicate
no recorded activity, not verified zero spending. Empty charts contain no
demo balances. No bank syncing, live market feed or paid API is required.
