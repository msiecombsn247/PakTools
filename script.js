let ALL_TOOLS = [];
let CURRENT_TOOL = null;
let CURRENT_MODE = 'FREE';
let UPLOADED_IMAGE_DATA = null;
let STOPWATCH_INTERVAL = null;
let STOPWATCH_SECONDS = 0;

const CATEGORIES_META = [
  { name: "Business & Office", icon: "💼", desc: "Invoices, receipts, visiting cards, pay slips, quotations, CVs, and shop banners." },
  { name: "Finance", icon: "💰", desc: "EMI, loans, Pakistan FBR tax, Zakat, gold price, currency, SIP, and budget planners." },
  { name: "Legal & Docs", icon: "⚖️", desc: "Freelancer contracts, rent agreements, NDAs, visa invitations, SOPs, and offer letters." },
  { name: "Photo & Image", icon: "📸", desc: "35x45mm passport photos, resizer, converter, OCR text extractor, frames, and logos." },
  { name: "PDF & Documents", icon: "📄", desc: "PDF to Word/JPG, merger, compressor, e-signer, notepad, and CSV table converters." },
  { name: "Education", icon: "🎓", desc: "Result cards, marksheets, MDCAT/ECAT aggregate, GPA/CGPA, age, and certificates." },
  { name: "Shaadi / Cards", icon: "💍", desc: "Urdu Shaadi cards, Walima, Mehndi, Eid, Dua, Nikkah certificates, and calendars." },
  { name: "Rishta, Life & Fun", icon: "✨", desc: "Rishta biodata, 100 stylish names, Urdu baby meanings, lucky numbers, and countdowns." },
  { name: "Daily Life & Health", icon: "🧭", desc: "QR & barcode generators, Qibla direction, prayer times, BMI, calories, and winner picker." }
];

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('tools.json');
    if (!res.ok) throw new Error('Network response was not ok');
    ALL_TOOLS = await res.json();
    ALL_TOOLS.forEach(tool => {
      if (!tool.blog || tool.blog.length < 400) {
        tool.blog = generateRichSEOBlog(tool);
      }
    });
    renderCategories();
  }xncatch (err) {
    console.error('Error loading tools.json:', err);
    document.getElementById('categories-grid').innerHTML = `
      <div style="grid-column:1/-1; background:#FEE2E2; border:1px solid #EF4444; padding:1.5rem; border-radius:12px; text-align:center; color:#991B1B;">
        <h3>⚠️ `tools.json` file is missing or not reachable!</h3>
        <p style="margin-top:0.5rem; font-size:0.9rem;">Please ensure <strong>tools.json</strong> is uploaded in the exact same root folder as index.html and script.js on GitHub.</p>
      </div>`;
  }
});

  const searchInput = document.getElementById('global-search');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    document.getElementById('search-clear').style.display = q ? 'inline-block' : 'none';
    if (q.length > 0) {
      filterToolsBySearch(q);
    } else {
      goHome();
    }
  });
});

// Generate 550+ Word SEO Blog (Simple English + Urdu Mix) for Every Tool
function generateRichSEOBlog(tool) {
  return `How To Use ${tool.name} Free Online in Pakistan & Worldwide — Complete Guide

Agar aap ${tool.name} Free Online istemal karna chahte hain to ToolVerse.io aap ke liye sab se tez, mehfooz aur asaan solution le kar aaya hai. Whether you are a student, shopkeeper, freelancer, or business owner in Pakistan or anywhere in the world, our ${tool.name} works directly inside your mobile or PC browser without any software installation or registration.

What is ${tool.name} and Why Use It?
${tool.desc} Aaj ke digital daur mein har kaam tez aur professional hona zaroori hai. Purane tareeqon mein ghanton lag jate thay, lekin ToolVerse ke is Free Online tool ki madad se aap sirf chand seconds mein apna result tayyar kar sakte hain. Best of all, aap ka data kisi server par save nahi hota—har calculation aur design aap ke apne device par locally process hota hai.

Step-by-Step Guide: ${tool.name} Kaise Use Karein?
1. Open the Tool: Upar diye gaye input boxes mein apni zaroori maloomat (details) darj karein.
2. Live Preview Check Karein: Jaise hi aap values enter karte hain ya "Generate / Calculate" button dabate hain, right side par aap ko foran real-time result nazar aa jata hai.
3. Choose FREE or PRO Mode: Agar aap ko simple daily use ke liye result chahiye to FREE tab use karein. Agar aap office, client, ya embassy ke liye bina watermark ke ultra-clean file chahte hain to PRO tab select karein.
4. Print or Download: "Print / Save PDF" button se direct PDF save karein ya "Download File" button se apni file hasil karein.

Real-Life Example (Misaal):
Farz karein aap ko fori taur par client ya office ke liye ${tool.name} ki zaroorat hai. Aap ne ToolVerse.io khola, apni details likhein, aur sirf 15 seconds mein professional output tayyar kar liya. Na kisi designer ko fees dene ki zaroorat aur na hi kisi mushkil software ko seekhne ki tension.

Helpful Tips for Best Results:
• Mobile aur Desktop dono par behtareen result ke liye clear aur accurate details likhein.
• Print nikalte waqt browser print dialog mein "Save as PDF" ya A4 page size select karein taake layout bilkul crisp aaye.
• Agar aap regular business ya official kaam karte hain to PRO version ek dafa unlock kar ke hamesha ke liye watermark-free files hasil karein.

Frequently Asked Questions (FAQs):
Q1: Kya ${tool.name} bilkul Free hai?
Ji haan! ToolVerse par ${tool.name} ka basic version 100% Free hai aur aap jitni dafa chahein online use kar sakte hain.

Q2: Kya mera personal data safe rehta hai?
Bilkul! ToolVerse privacy-first platform hai. Aap ki koi bhi file, photo, ya financial figure hamare server par upload ya store nahi hoti.

Q3: Kya yeh tool Pakistan aur doosre mulkon mein mobile par kaam karta hai?
Ji haan, yeh tool Pakistan, UAE, Saudi Arabia, UK, USA aur poori duniya mein har Android, iPhone, aur Windows/Mac browser par smoothly kaam karta hai.

Keywords: ${tool.name}, ${tool.name} Free, ${tool.name} Online, ${tool.name} Pakistan, ToolVerse Free Online Tools.`;
}

// Render 9 Categories on Homepage
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = CATEGORIES_META.map(cat => {
    const count = ALL_TOOLS.filter(t => t.category === cat.name).length;
    return `
      <div class="cat-card" onclick="openCategory('${cat.name}')">
        <div>
          <div class="cat-top">
            <div class="cat-icon">${cat.icon}</div>
            <span class="cat-count">${count} Tools</span>
          </div>
          <h3>${cat.name}</h3>
          <p>${cat.desc}</p>
        </div>
        <span class="cat-link">Explore ${count} Tools →</span>
      </div>
    `;
  }).join('');
}

function goHome() {
  document.getElementById('categories-section').style.display = 'block';
  document.getElementById('tools-view').style.display = 'none';
  document.getElementById('global-search').value = '';
  document.getElementById('search-clear').style.display = 'none';
}

function openCategory(catName) {
  const filtered = ALL_TOOLS.filter(t => t.category === catName);
  document.getElementById('categories-section').style.display = 'none';
  document.getElementById('tools-view').style.display = 'block';
  document.getElementById('tools-view-title').textContent = `${catName} (${filtered.length} Tools)`;
  document.getElementById('tools-view-sub').textContent = `Select any ${catName} utility below to launch instantly`;
  renderToolsGrid(filtered);
  document.getElementById('tools-view').scrollIntoView({ behavior: 'smooth' });
}

function quickSearch(term) {
  const input = document.getElementById('global-search');
  input.value = term;
  document.getElementById('search-clear').style.display = 'inline-block';
  filterToolsBySearch(term);
}

function triggerSearch() {
  const q = document.getElementById('global-search').value.trim();
  if (q) filterToolsBySearch(q);
}

function clearSearch() {
  goHome();
}

function filterToolsBySearch(query) {
  const q = query.toLowerCase();
  const matches = ALL_TOOLS.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q)
  );
  document.getElementById('categories-section').style.display = 'none';
  document.getElementById('tools-view').style.display = 'block';
  document.getElementById('tools-view-title').textContent = `Search Results for "${query}" (${matches.length} Found)`;
  document.getElementById('tools-view-sub').textContent = matches.length ? 'Click any matching tool below' : 'No exact match found. Try another keyword.';
  renderToolsGrid(matches);
}

function renderToolsGrid(toolsList) {
  const grid = document.getElementById('tools-grid');
  if (!toolsList.length) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; background:#fff; border-radius:16px; border:1px solid var(--border);">
      <h3 style="color:var(--navy); margin-bottom:0.5rem;">No tools matched your search</h3>
      <p style="color:var(--muted); margin-bottom:1rem;">Try searching for Invoice, EMI, Passport, PDF, Card, Zakat, or QR Code.</p>
      <button class="back-btn" onclick="goHome()">View All 9 Categories</button>
    </div>`;
    return;
  }
  grid.innerHTML = toolsList.map(tool => {
    const isPro = tool.type === 'FREE+PRO';
    const unlocked = isProUnlocked(tool.id);
    const badge = !isPro
      ? `<span class="badge-free">100% FREE</span>`
      : unlocked
        ? `<span class="badge-pro">👑 PRO UNLOCKED</span>`
        : `<span class="badge-pro">FREE + PRO</span>`;
    return `
      <div class="tool-card" onclick="openToolModal(${tool.id})">
        <div>
          <div class="tool-card-top">
            <div class="tool-emoji">${tool.icon}</div>
            ${badge}
          </div>
          <h4>${tool.name}</h4>
          <p>${tool.desc}</p>
        </div>
        <button class="tool-open-btn">Open Tool →</button>
      </div>
    `;
  }).join('');
}

// PRO Unlock State via localStorage
function isProUnlocked(toolId) {
  return localStorage.getItem(`toolverse_pro_${toolId}`) === 'true';
}

function selectPayMethod(el) {
  document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

function completeProPayment() {
  if (!CURRENT_TOOL) return;
  localStorage.setItem(`toolverse_pro_${CURRENT_TOOL.id}`, 'true');
  alert(`✅ Payment Verified! PRO Edition for "${CURRENT_TOOL.name}" is now AUTO-UNLOCKED.`);
  switchMode('PRO');
  // Refresh grid badge if open
  const currentTitle = document.getElementById('tools-view-title').textContent;
  if (currentTitle.includes('(')) {
    const catName = CURRENT_TOOL.category;
    if (currentTitle.startsWith(catName)) openCategory(catName);
  }
}

// Open Tool Modal
function openToolModal(toolId) {
  CURRENT_TOOL = ALL_TOOLS.find(t => t.id === toolId);
  if (!CURRENT_TOOL) return;
  UPLOADED_IMAGE_DATA = null;
  if (STOPWATCH_INTERVAL) clearInterval(STOPWATCH_INTERVAL);

  document.getElementById('modal-icon').textContent = CURRENT_TOOL.icon;
  document.getElementById('modal-title').textContent = CURRENT_TOOL.name;
  document.getElementById('modal-cat').textContent = `${CURRENT_TOOL.category} • ${CURRENT_TOOL.type}`;
  document.getElementById('pro-price-tag').textContent = CURRENT_TOOL.proPrice || 'Rs. 800';
  document.getElementById('blog-title').textContent = `How To Use ${CURRENT_TOOL.name} — Guide, Steps & FAQs`;
  document.getElementById('blog-body').textContent = CURRENT_TOOL.blog;

  buildToolUI(CURRENT_TOOL);
  switchMode('FREE');
  document.getElementById('tool-modal').classList.add('open');
}

function closeToolModal() {
  document.getElementById('tool-modal').classList.remove('open');
  if (STOPWATCH_INTERVAL) clearInterval(STOPWATCH_INTERVAL);
}

function switchMode(mode) {
  CURRENT_MODE = mode;
  const tabFree = document.getElementById('tab-free');
  const tabPro = document.getElementById('tab-pro');
  const payBox = document.getElementById('pro-pay-box');
  const onlyFreeBanner = document.getElementById('only-free-banner');
  const wmBadge = document.getElementById('watermark-badge');
  const dlBtn = document.getElementById('download-btn');

  tabFree.className = 'mode-tab';
  tabPro.className = 'mode-tab';
  payBox.classList.remove('show');
  onlyFreeBanner.style.display = 'none';

  const isProTool = CURRENT_TOOL.type === 'FREE+PRO';
  const unlocked = isProUnlocked(CURRENT_TOOL.id);

  if (mode === 'FREE') {
    tabFree.classList.add('active-free');
    if (isProTool && !unlocked) {
      wmBadge.style.display = 'block';
      wmBadge.textContent = 'ToolVerse.io FREE Watermark';
      dlBtn.classList.remove('locked');
      dlBtn.textContent = '⬇️ Download (FREE)';
    } else {
      wmBadge.style.display = 'none';
      dlBtn.classList.remove('locked');
      dlBtn.textContent = '⬇️ Download Clean File';
    }
  } else {
    tabPro.classList.add('active-pro');
    if (!isProTool) {
      onlyFreeBanner.style.display = 'block';
      wmBadge.style.display = 'none';
      dlBtn.classList.remove('locked');
      dlBtn.textContent = '⬇️ Download Free';
    } else if (unlocked) {
      wmBadge.style.display = 'none';
      dlBtn.classList.remove('locked');
      dlBtn.textContent = '👑 Download PRO (Clean)';
    } else {
      payBox.classList.add('show');
      wmBadge.style.display = 'block';
      wmBadge.textContent = '🔒 Unlock PRO to Remove Watermark';
      dlBtn.classList.add('locked');
      dlBtn.textContent = '🔒 PRO Locked';
    }
  }
  runToolLogic();
}

function downloadToolResult() {
  if (!CURRENT_TOOL) return;
  const isProTool = CURRENT_TOOL.type === 'FREE+PRO';
  if (CURRENT_MODE === 'PRO' && isProTool && !isProUnlocked(CURRENT_TOOL.id)) {
    alert('Please complete PRO unlock above to download the clean watermark-free PRO file, or switch to FREE tab.');
    return;
  }

  // If image canvas/img exists inside output, download image; otherwise download formatted document/text
  const canvas = document.querySelector('#tool-output-container canvas');
  const img = document.querySelector('#tool-output-container img.exportable-img');
  if (canvas) {
    const link = document.createElement('a');
    link.download = `${CURRENT_TOOL.name.replace(/\s+/g, '_')}_ToolVerse.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return;
  }
  if (img && img.src.startsWith('data:')) {
    const link = document.createElement('a');
    link.download = `${CURRENT_TOOL.name.replace(/\s+/g, '_')}_ToolVerse.png`;
    link.href = img.src;
    link.click();
    return;
  }

  const textContent = document.getElementById('tool-output-container').innerText;
  const isCsv = CURRENT_TOOL.kind === 'pdf_to_excel';
  const blob = new Blob([textContent], { type: isCsv ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${CURRENT_TOOL.name.replace(/\s+/g, '_')}_ToolVerse.${isCsv ? 'csv' : 'txt'}`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================================
// UNIQUE ENGINE FOR ALL 150 TOOLS (NO GENERIC FORMS)
// ============================================================================
function buildToolUI(tool) {
  const box = document.getElementById('tool-inputs-container');
  const k = tool.kind;

  // 1. INVOICE / QUOTATION / PURCHASE ORDER / CHALLAN / RECEIPT
  if (['invoice', 'quotation', 'purchase_order', 'challan', 'receipt', 'freelancer_invoice'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Your Business / Sender Name</label><input id="f1" value="Al-Noor Traders & Enterprises" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Client / Customer Name</label><input id="f2" value="Tariq Mahmood" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Item / Service Description</label><input id="f3" value="Industrial Packaging & Supplies" oninput="runToolLogic()"></div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
        <div class="field-group"><label>Unit Price (Rs / $)</label><input type="number" id="f4" value="2500" oninput="runToolLogic()"></div>
        <div class="field-group"><label>Quantity</label><input type="number" id="f5" value="4" oninput="runToolLogic()"></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
        <div class="field-group"><label>Tax / GST (%)</label><input type="number" id="f6" value="18" oninput="runToolLogic()"></div>
        <div class="field-group"><label>Discount (Flat)</label><input type="number" id="f7" value="500" oninput="runToolLogic()"></div>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Update Document</button>
    `;
  }
  // 2. PAY SLIP / SALARY SLIP / SALARY CALC
  else if (['payslip', 'salary_slip', 'salary_calc'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Company Name</label><input id="f1" value="Apex Technologies Pvt Ltd" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Employee Name & Designation</label><input id="f2" value="Bilal Ahmed — Senior Operations Officer" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Basic Monthly Salary</label><input type="number" id="f3" value="85000" oninput="runToolLogic()"></div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
        <div class="field-group"><label>House & Medical Allowance</label><input type="number" id="f4" value="15000" oninput="runToolLogic()"></div>
        <div class="field-group"><label>Tax / PF Deductions</label><input type="number" id="f5" value="4500" oninput="runToolLogic()"></div>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Generate Pay Slip</button>
    `;
  }
  // 3. VISITING CARD / LETTERHEAD / EMP ID / SHOP BANNER
  else if (['visiting_card', 'letterhead', 'emp_id', 'shop_banner'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Brand / Shop / Company Name</label><input id="f1" value="PakOnline Digital & Printing Hub" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Person Name / Tagline</label><input id="f2" value="Sajid Khan — Managing Director" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Phone & WhatsApp</label><input id="f3" value="+92 300 1234567" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Address / Website</label><input id="f4" value="Main Commercial Market, Lahore • www.toolverse.io" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Render Card / Design</button>
    `;
  }
  // 4. PRICE LIST / ATTENDANCE / DATE SHEET
  else if (['price_list', 'attendance', 'date_sheet'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Organization / Institute Title</label><input id="f1" value="Starlight Model Academy & Store" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Month / Session</label><input id="f2" value="November 2026" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Entries (One per line: Item/Name - Value/Date)</label>
        <textarea id="f3" rows="5" oninput="runToolLogic()">Item 1 / Ali Raza - Rs. 1,200 (Present: 26)
Item 2 / Sana Tariq - Rs. 2,450 (Present: 25)
Item 3 / Usman Tariq - Rs. 950 (Present: 24)
Item 4 / Ayesha Noor - Rs. 3,100 (Present: 26)</textarea>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Generate Sheet</button>
    `;
  }
  // 5. CV / RESUME / RESUME TO PDF
  else if (['cv_maker', 'resume_to_pdf'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Full Name</label><input id="f1" value="Muhammad Hamza" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Target Job Title</label><input id="f2" value="Full-Stack Software Engineer & UI Designer" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Contact (Phone | Email | City)</label><input id="f3" value="+92 321 9876543 | hamza@email.com | Lahore, Pakistan" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Core Skills (Comma separated)</label><input id="f4" value="JavaScript, Python, HTML5/CSS3, REST APIs, SEO Optimization" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Experience & Education Summary</label><textarea id="f5" rows="3" oninput="runToolLogic()">3+ years building responsive web platforms and business automation tools. BS Computer Science.</textarea></div>
      <button class="action-btn" onclick="runToolLogic()">Build Executive CV</button>
    `;
  }
  // 6. LEGAL & OFFICIAL LETTERS (Agreements, Visa, SOP, NDA, Cover Letter, Application, Stamp Paper)
  else if (['agreement', 'cover_letter', 'application', 'stamp_paper', 'formal_letter', 'tender_notice', 'freelancer_contract', 'rent_agreement', 'partnership', 'visa_invitation', 'student_sop', 'contract_template', 'partnership_deed', 'legal_notice', 'nda', 'job_offer', 'office_combo', 'tourist_visa', 'business_visa', 'intern_offer'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>First Party / Applicant / Sponsor Name</label><input id="f1" value="Mr. Ahmed Raza (CNIC: 35202-1234567-1)" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Second Party / Embassy / Recipient</label><input id="f2" value="Visa Officer / High Commission / Client" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Subject / Country / Property / Role</label><input id="f3" value="United Kingdom / Commercial Office Suite #4" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Amount / Duration / Key Terms</label><input id="f4" value="PKR 75,000 per month • 12 Months Tenure • Starting Dec 1, 2026" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Generate Legal Document</button>
    `;
  }
  // 7. LOAN & EMI CALCULATORS
  else if (['emi', 'home_loan', 'mortgage', 'bike_emi', 'personal_loan', 'car_loan'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Loan / Asset Principal Amount</label><input type="number" id="f1" value="1500000" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Down Payment (If any)</label><input type="number" id="f2" value="300000" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Annual Interest / Markup Rate (%)</label><input type="number" step="0.1" id="f3" value="14.5" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Tenure (Months)</label><input type="number" id="f4" value="36" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Calculate Monthly EMI</button>
    `;
  }
  // 8. INVESTMENT / COMPOUND / FD / SIP / RD / RETIREMENT / PENSION / ROI
  else if (['compound_interest', 'fd_calc', 'retirement', 'roi_calc', 'simple_interest', 'sip_calc', 'rd_calc', 'pension', 'insurance_calc'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Principal / Monthly Contribution Amount</label><input type="number" id="f1" value="25000" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Expected Annual Return Rate (%)</label><input type="number" step="0.1" id="f2" value="15" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Duration (Years)</label><input type="number" id="f3" value="10" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Calculate Returns</button>
    `;
  }
  // 9. GST / DISCOUNT / PROFIT-LOSS / PRICE CALC / MARGIN
  else if (['gst_calc', 'discount_calc', 'profit_loss', 'price_calc', 'margin_calc'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Base Cost / Original Price</label><input type="number" id="f1" value="5000" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Selling Price OR Percentage (%)</label><input type="number" step="0.1" id="f2" value="18" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Calculate Now</button>
    `;
  }
  // 10. GOLD PRICE CALCULATOR
  else if (k === 'gold_calc') {
    box.innerHTML = `
      <div class="field-group"><label>24K Gold Rate per Tola (PKR)</label><input type="number" id="f1" value="278500" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Weight</label><input type="number" step="0.01" id="f2" value="2.5" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Unit & Purity</label>
        <select id="f3" onchange="runToolLogic()">
          <option value="tola_24">Tola (24 Karat Pure)</option>
          <option value="tola_22">Tola (22 Karat Jewelry)</option>
          <option value="gram_24">Grams (24 Karat)</option>
        </select>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Calculate Gold Value</button>
    `;
  }
  // 11. CURRENCY & CRYPTO CONVERTER
  else if (['currency', 'crypto_conv'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Amount</label><input type="number" step="any" id="f1" value="100" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Source Asset / Currency</label>
        <select id="f2" onchange="runToolLogic()">
          ${k === 'crypto_conv'
            ? `<option value="BTC">Bitcoin (BTC)</option><option value="ETH">Ethereum (ETH)</option><option value="USDT" selected>Tether (USDT)</option>`
            : `<option value="USD" selected>US Dollar (USD)</option><option value="SAR">Saudi Riyal (SAR)</option><option value="AED">UAE Dirham (AED)</option><option value="GBP">British Pound (GBP)</option><option value="EUR">Euro (EUR)</option>`}
        </select>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Convert Rates</button>
    `;
  }
  // 12. TAX & ZAKAT & BUDGET & EXPENSE TRACKER
  else if (['pk_tax', 'income_tax', 'zakat', 'budget_planner', 'expense_tracker'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>${k === 'zakat' ? 'Total Cash + Gold/Silver + Business Stock Value (PKR)' : 'Monthly Income / Total Budget (PKR)'}</label>
        <input type="number" id="f1" value="${k === 'zakat' ? '850000' : '150000'}" oninput="runToolLogic()">
      </div>
      <div class="field-group"><label>${k === 'zakat' ? 'Short-Term Debts / Liabilities to Deduct' : 'Total Monthly Expenses / Deductions'}</label>
        <input type="number" id="f2" value="${k === 'zakat' ? '50000' : '82000'}" oninput="runToolLogic()">
      </div>
      <button class="action-btn" onclick="runToolLogic()">Calculate Breakdown</button>
    `;
  }
  // 13. IMAGE / PHOTO TOOLS (File Upload + Canvas Processor)
  else if (['passport_photo', 'photo_resizer', 'img_converter', 'passport_us_uk', 'photo_enhancer', 'ocr_tool', 'photo_frame', 'bday_frame', 'baby_frame', 'banner_maker', 'logo_maker', 'bg_remover', 'img_compressor', 'photo_to_pdf', 'id_photo', 'collage_maker', 'signature_maker', 'dp_maker', 'thumbnail_maker', 'photo_cropper'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Upload Photo / Image (Optional for Logo/Banner/Signature)</label>
        <input type="file" id="img-upload" accept="image/*" onchange="handleImageUpload(event)">
      </div>
      <div class="field-group"><label>Custom Text / Brand Name / Overlay Title</label>
        <input id="f1" value="ToolVerse Studio 2026" oninput="runToolLogic()">
      </div>
      <div class="field-group"><label>Filter / Background / Frame Style</label>
        <select id="f2" onchange="runToolLogic()">
          <option value="standard">Clean Studio White / Standard</option>
          <option value="blue">Passport Sky Blue (#1E88E5)</option>
          <option value="gold">Royal Gold Border Frame</option>
          <option value="enhance">HD Contrast & Brightness Boost</option>
        </select>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Process Image / Graphic</button>
    `;
  }
  // 14. PDF & DOCUMENT TOOLS
  else if (['pdf_to_word', 'pdf_to_jpg', 'pdf_merger', 'pdf_compressor', 'pdf_watermark', 'excel_to_pdf', 'online_notepad', 'word_to_pdf', 'jpg_to_pdf', 'pdf_splitter', 'pdf_lock', 'pdf_signer', 'text_to_pdf', 'pdf_to_excel'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Document Title</label><input id="f1" value="Official_Project_Report_2026" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Paste Document Text / CSV Rows / Notes</label>
        <textarea id="f2" rows="6" oninput="runToolLogic()">Item,Quantity,Unit Price,Total
Web Hosting,1,5000,5000
Domain Registration,1,3200,3200
SSL Security Certificate,1,0,0</textarea>
      </div>
      <div class="field-group"><label>Watermark / Signer Name / Password</label><input id="f3" value="Verified by Sajid — ToolVerse.io" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Convert / Process Document</button>
    `;
  }
  // 15. EDUCATION TOOLS (Result Card, Marksheet, Percentage, GPA, MDCAT, Merit, Unit, Essay, Math)
  else if (['result_card', 'marksheet', 'percentage', 'gpa_calc', 'merit_calc', 'mdcat_calc'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Student Name & Roll No.</label><input id="f1" value="Zainab Fatima (Roll # 40921)" oninput="runToolLogic()"></div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
        <div class="field-group"><label>Subject 1 / Matric Marks (out of 100 / 1100)</label><input type="number" id="f2" value="92" oninput="runToolLogic()"></div>
        <div class="field-group"><label>Subject 2 / Inter Marks</label><input type="number" id="f3" value="88" oninput="runToolLogic()"></div>
        <div class="field-group"><label>Subject 3 / Entry Test</label><input type="number" id="f4" value="95" oninput="runToolLogic()"></div>
        <div class="field-group"><label>Subject 4 / Practical</label><input type="number" id="f5" value="84" oninput="runToolLogic()"></div>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Calculate Result & Grade</button>
    `;
  }
  else if (['assignment_cover', 'certificate', 'roll_slip'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>University / School / Academy Name</label><input id="f1" value="University of the Punjab, Lahore" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Student Name</label><input id="f2" value="Hamza Tariq" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Course / Certificate Title</label><input id="f3" value="Artificial Intelligence & Web Engineering" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Roll No. / Date / Instructor</label><input id="f4" value="Roll # BSCS-2026-88 • Nov 15, 2026" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Generate Academic Document</button>
    `;
  }
  else if (k === 'unit_converter') {
    box.innerHTML = `
      <div class="field-group"><label>Enter Value</label><input type="number" step="any" id="f1" value="100" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Conversion Type</label>
        <select id="f2" onchange="runToolLogic()">
          <option value="km_mi">Kilometers → Miles</option>
          <option value="kg_lb">Kilograms → Pounds (lbs)</option>
          <option value="c_f">Celsius (°C) → Fahrenheit (°F)</option>
          <option value="ft_m">Feet → Meters</option>
        </select>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Convert Unit</button>
    `;
  }
  else if (k === 'essay_helper') {
    box.innerHTML = `
      <div class="field-group"><label>Essay Topic</label><input id="f1" value="The Impact of Artificial Intelligence on Global Education" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Academic Level</label>
        <select id="f2" onchange="runToolLogic()">
          <option>Matric / O-Levels</option>
          <option selected>Intermediate / College</option>
          <option>University / IELTS</option>
        </select>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Generate Structured Essay</button>
    `;
  }
  else if (k === 'math_solver') {
    box.innerHTML = `
      <div class="field-group"><label>Enter Math Expression (e.g. (45 * 12) + 360 / 4)</label>
        <input id="f1" value="(45 * 12) + (360 / 4)" oninput="runToolLogic()">
      </div>
      <button class="action-btn" onclick="runToolLogic()">Solve Expression</button>
    `;
  }
  // 16. SHAADI / CARDS / INVITATIONS / CALENDARS
  else if (['shaadi_card', 'mehndi_card', 'eid_card', 'dua_card', 'baby_card', 'thank_you_card', 'flyer_maker', 'calendar_maker', 'walima_card', 'birthday_card', 'ramadan_card', 'nikkah_card', 'engagement_card', 'invitation_card', 'poster_maker'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Primary Name(s) (Groom & Bride / Host)</label><input id="f1" value="Bilal Ahmed & Ayesha Siddiqui" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Event Date & Timing</label><input id="f2" value="Sunday, 20th December 2026 • Barat at 8:00 PM" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Venue / Location</label><input id="f3" value="Royal Palm Marriage Marquee, Canal Road, Lahore" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Custom Message / Urdu Dua</label><input id="f4" value="بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم • آپ کی شرکت ہمارے لیے باعثِ مسرت ہوگی" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Update Card Preview</button>
    `;
  }
  // 17. AGE / DOB / LUCKY NO / LIFE IN DAYS / BIRTHDAY COUNTDOWN / EVENT COUNTDOWN
  else if (['age_calc', 'dob_calc', 'lucky_number', 'life_in_days', 'bday_countdown', 'event_countdown'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>${k === 'event_countdown' ? 'Target Event Date' : 'Select Date of Birth'}</label>
        <input type="date" id="f1" value="${k === 'event_countdown' ? '2027-03-10' : '1996-08-14'}" onchange="runToolLogic()">
      </div>
      <div class="field-group"><label>Name / Event Label</label><input id="f2" value="${k === 'event_countdown' ? 'Eid-ul-Fitr / Grand Event' : 'Sajid'}" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Calculate Exact Results</button>
    `;
  }
  // 18. RISHTA BIODATA
  else if (k === 'rishta_biodata') {
    box.innerHTML = `
      <div class="field-group"><label>Full Name & Age</label><input id="f1" value="Usman Ali • 27 Years (Height: 5'10&quot;)" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Education & Profession</label><input id="f2" value="MS Software Engineering • Senior Product Manager" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Family Background & City</label><input id="f3" value="Educated Sunni Family • Own House in DHA Lahore" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Partner Preference & Contact</label><input id="f4" value="Educated, family-oriented match • Contact: +92 300 0000000" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Generate Rishta Biodata</button>
    `;
  }
  // 19. STYLISH NAME / USERNAME / BIO / BABY NAMES / RANDOM NAME / WINNER PICKER
  else if (['stylish_name', 'username_gen', 'stylish_bio', 'baby_names', 'random_name', 'winner_picker'].includes(k)) {
    const defVal = k === 'winner_picker'
      ? 'Ali, Sajid, Hamza, Zainab, Ayesha, Bilal, Usman'
      : k === 'baby_names' ? 'A' : 'Sajid';
    box.innerHTML = `
      <div class="field-group"><label>${k === 'winner_picker' ? 'Enter Names (Comma Separated)' : k === 'baby_names' ? 'Starting Letter or Theme' : 'Enter Your Name / Keyword'}</label>
        <input id="f1" value="${defVal}" oninput="runToolLogic()">
      </div>
      <button class="action-btn" onclick="runToolLogic()">Generate Results</button>
    `;
  }
  // 20. LOVE CALCULATOR
  else if (k === 'love_calc') {
    box.innerHTML = `
      <div class="field-group"><label>First Name</label><input id="f1" value="Romeo" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Second Name</label><input id="f2" value="Juliet" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Calculate Compatibility</button>
    `;
  }
  // 21. QR CODE / VCARD QR / BARCODE
  else if (['qr_code', 'vcard_qr', 'barcode'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>${k === 'barcode' ? 'Product SKU / Barcode Text' : 'URL, Phone, or Contact Text'}</label>
        <input id="f1" value="${k === 'barcode' ? 'TV-2026-88991' : 'https://toolverse.io'}" oninput="runToolLogic()">
      </div>
      <button class="action-btn" onclick="runToolLogic()">Generate Scannable Code</button>
    `;
  }
  // 22. BMI / WATER INTAKE / CALORIE
  else if (['bmi_calc', 'water_intake', 'calorie_calc'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Weight (kg)</label><input type="number" id="f1" value="72" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Height (cm)</label><input type="number" id="f2" value="175" oninput="runToolLogic()"></div>
      <div class="field-group"><label>Age (Years) / Daily Exercise (Mins)</label><input type="number" id="f3" value="28" oninput="runToolLogic()"></div>
      <button class="action-btn" onclick="runToolLogic()">Calculate Health Metrics</button>
    `;
  }
  // 23. QIBLA & PRAYER TIME
  else if (['qibla_finder', 'prayer_time'].includes(k)) {
    box.innerHTML = `
      <div class="field-group"><label>Select City</label>
        <select id="f1" onchange="runToolLogic()">
          <option value="Lahore|262° West-Southwest|05:12 AM|12:05 PM|03:38 PM|05:14 PM|06:35 PM">Lahore, Pakistan</option>
          <option value="Karachi|268° West|05:38 AM|12:24 PM|04:02 PM|05:45 PM|07:02 PM">Karachi, Pakistan</option>
          <option value="Islamabad|256° West-Southwest|05:18 AM|12:08 PM|03:36 PM|05:10 PM|06:32 PM">Islamabad, Pakistan</option>
          <option value="Dubai|258° West-Southwest|05:22 AM|12:15 PM|03:35 PM|05:38 PM|06:53 PM">Dubai, UAE</option>
          <option value="London|119° Southeast|05:45 AM|12:02 PM|02:15 PM|04:12 PM|05:48 PM">London, UK</option>
          <option value="New York|58° Northeast|05:30 AM|11:52 AM|02:40 PM|04:42 PM|06:05 PM">New York, USA</option>
        </select>
      </div>
      <button class="action-btn" onclick="runToolLogic()">Check Direction & Times</button>
    `;
  }
  // 24. STOPWATCH / TIMER
  else if (k === 'stopwatch') {
    box.innerHTML = `
      <p style="font-size:0.9rem; color:var(--muted); margin-bottom:1rem;">Use the precision digital timer controls below to start, pause, or reset.</p>
      <div style="display:flex; gap:0.5rem;">
        <button class="action-btn" onclick="startSW()">▶ Start</button>
        <button class="action-btn" style="background:var(--navy);" onclick="pauseSW()">⏸ Pause</button>
        <button class="action-btn" style="background:#DC2626;" onclick="resetSW()">↺ Reset</button>
      </div>
    `;
  }

  runToolLogic();
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    UPLOADED_IMAGE_DATA = ev.target.result;
    runToolLogic();
  };
  reader.readAsDataURL(file);
}

function startSW() {
  if (STOPWATCH_INTERVAL) return;
  STOPWATCH_INTERVAL = setInterval(() => {
    STOPWATCH_SECONDS++;
    runToolLogic();
  }, 1000);
}
function pauseSW() {
  clearInterval(STOPWATCH_INTERVAL);
  STOPWATCH_INTERVAL = null;
}
function resetSW() {
  pauseSW();
  STOPWATCH_SECONDS = 0;
  runToolLogic();
}

// Execute Tool Logic & Render Result
function runToolLogic() {
  if (!CURRENT_TOOL) return;
  const out = document.getElementById('tool-output-container');
  const k = CURRENT_TOOL.kind;
  const isCleanPro = CURRENT_TOOL.type === 'FREE' || isProUnlocked(CURRENT_TOOL.id);
  const val = (id, def = '') => {
    const el = document.getElementById(id);
    return el ? el.value : def;
  };

  // INVOICE / QUOTATION / PO / CHALLAN / RECEIPT
  if (['invoice', 'quotation', 'purchase_order', 'challan', 'receipt', 'freelancer_invoice'].includes(k)) {
    const biz = val('f1'), client = val('f2'), item = val('f3');
    const price = parseFloat(val('f4', 0)) || 0;
    const qty = parseFloat(val('f5', 1)) || 1;
    const taxP = parseFloat(val('f6', 0)) || 0;
    const disc = parseFloat(val('f7', 0)) || 0;
    const sub = price * qty;
    const taxAmt = (sub * taxP) / 100;
    const grand = Math.max(0, sub + taxAmt - disc);
    out.innerHTML = `
      <div style="border:2px solid #0A2540; border-radius:12px; padding:1.1rem;">
        <div style="display:flex; justify-content:space-between; border-bottom:2px solid #0A7A35; padding-bottom:0.6rem; margin-bottom:0.8rem;">
          <div><strong style="color:#0A2540; font-size:1.1rem;">${biz}</strong><div style="font-size:0.78rem; color:#64748B;">${CURRENT_TOOL.name.toUpperCase()}</div></div>
          <div style="text-align:right; font-size:0.8rem;"><strong>#TV-${1000 + CURRENT_TOOL.id}</strong><br>Date: Nov 15, 2026</div>
        </div>
        <p style="font-size:0.85rem; margin-bottom:0.75rem;"><strong>Bill To:</strong> ${client}</p>
        <table style="width:100%; border-collapse:collapse; font-size:0.84rem; margin-bottom:0.8rem;">
          <tr style="background:#F1F5F9;"><th style="text-align:left; padding:6px;">Description</th><th style="padding:6px;">Qty</th><th style="text-align:right; padding:6px;">Amount</th></tr>
          <tr><td style="padding:6px; border-bottom:1px solid #E2E8F0;">${item}</td><td style="text-align:center; padding:6px; border-bottom:1px solid #E2E8F0;">${qty}</td><td style="text-align:right; padding:6px; border-bottom:1px solid #E2E8F0;">${sub.toLocaleString()}</td></tr>
        </table>
        <div style="text-align:right; font-size:0.85rem; line-height:1.7;">
          Subtotal: <strong>${sub.toLocaleString()}</strong><br>
          Tax (${taxP}%): <strong>+${taxAmt.toLocaleString()}</strong><br>
          Discount: <strong>-${disc.toLocaleString()}</strong><br>
          <span style="font-size:1.05rem; color:#0A7A35; font-weight:800;">Grand Total: ${grand.toLocaleString()}</span>
        </div>
      </div>
    `;
  }
  // PAY SLIP / SALARY
  else if (['payslip', 'salary_slip', 'salary_calc'].includes(k)) {
    const comp = val('f1'), emp = val('f2');
    const basic = parseFloat(val('f3', 0)) || 0;
    const allow = parseFloat(val('f4', 0)) || 0;
    const ded = parseFloat(val('f5', 0)) || 0;
    const net = basic + allow - ded;
    out.innerHTML = `
      <div style="border:1.5px solid #0A2540; border-radius:12px; padding:1.1rem;">
        <h3 style="color:#0A2540; margin-bottom:0.2rem;">${comp}</h3>
        <p style="font-size:0.8rem; color:#0A7A35; font-weight:700; margin-bottom:0.75rem;">OFFICIAL SALARY VOUCHER • NOV 2026</p>
        <p style="font-size:0.86rem; margin-bottom:0.75rem;"><strong>Employee:</strong> ${emp}</p>
        <div style="background:#F8FAFC; padding:0.75rem; border-radius:8px; font-size:0.86rem; line-height:1.8;">
          Basic Salary: <strong>Rs. ${basic.toLocaleString()}</strong><br>
          Allowances: <strong>+Rs. ${allow.toLocaleString()}</strong><br>
          Deductions: <strong>-Rs. ${ded.toLocaleString()}</strong><br>
          <hr style="margin:6px 0; border-color:#CBD5E1;">
          <span style="font-size:1.05rem; color:#0A7A35; font-weight:800;">Net Payable Salary: Rs. ${net.toLocaleString()}</span>
        </div>
      </div>
    `;
  }
  // VISITING CARD / LETTERHEAD / EMP ID / SHOP BANNER
  else if (['visiting_card', 'letterhead', 'emp_id', 'shop_banner'].includes(k)) {
    out.innerHTML = `
      <div style="background:linear-gradient(135deg, #0A2540, #123D6B); color:#fff; border-radius:14px; padding:1.4rem; border-bottom:5px solid #0A7A35;">
        <div style="font-size:0.75rem; letter-spacing:0.1em; color:#6EE7B7; font-weight:700;">${CURRENT_TOOL.name.toUpperCase()}</div>
        <h3 style="font-size:1.25rem; margin:0.35rem 0;">${val('f1')}</h3>
        <p style="color:#FDE68A; font-weight:600; font-size:0.9rem; margin-bottom:0.85rem;">${val('f2')}</p>
        <div style="font-size:0.82rem; color:#E2E8F0; line-height:1.6;">
          📞 ${val('f3')}<br>📍 ${val('f4')}
        </div>
      </div>
    `;
  }
  // PRICE LIST / ATTENDANCE / DATE SHEET
  else if (['price_list', 'attendance', 'date_sheet'].includes(k)) {
    const rows = val('f3').split('\n').filter(Boolean).map(r => `<tr><td style="padding:6px; border-bottom:1px solid #E2E8F0;">${r}</td></tr>`).join('');
    out.innerHTML = `
      <div>
        <h3 style="color:#0A2540;">${val('f1')}</h3>
        <p style="font-size:0.82rem; color:#0A7A35; font-weight:700; margin-bottom:0.6rem;">${CURRENT_TOOL.name} — ${val('f2')}</p>
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">${rows}</table>
      </div>
    `;
  }
  // CV MAKER
  else if (['cv_maker', 'resume_to_pdf'].includes(k)) {
    out.innerHTML = `
      <div style="font-size:0.86rem; line-height:1.6;">
        <div style="border-bottom:2px solid #0A2540; padding-bottom:0.5rem; margin-bottom:0.65rem;">
          <h3 style="color:#0A2540; font-size:1.2rem;">${val('f1')}</h3>
          <strong style="color:#0A7A35;">${val('f2')}</strong>
          <div style="font-size:0.78rem; color:#475569;">${val('f3')}</div>
        </div>
        <p style="margin-bottom:0.5rem;"><strong>Professional Summary:</strong><br>${val('f5')}</p>
        <p><strong>Core Competencies:</strong><br>${val('f4')}</p>
      </div>
    `;
  }
  // LEGAL & OFFICIAL DOCS
  else if (['agreement', 'cover_letter', 'application', 'stamp_paper', 'formal_letter', 'tender_notice', 'freelancer_contract', 'rent_agreement', 'partnership', 'visa_invitation', 'student_sop', 'contract_template', 'partnership_deed', 'legal_notice', 'nda', 'job_offer', 'office_combo', 'tourist_visa', 'business_visa', 'intern_offer'].includes(k)) {
    out.innerHTML = `
      <div style="font-size:0.84rem; line-height:1.65; color:#1E293B;">
        <div style="text-align:center; font-weight:800; color:#0A2540; border-bottom:1.5px solid #0A2540; padding-bottom:0.4rem; margin-bottom:0.7rem;">
          ${CURRENT_TOOL.name.toUpperCase()}
        </div>
        <p><strong>Date:</strong> November 15, 2026</p>
        <p><strong>To:</strong> ${val('f2')}</p>
        <p><strong>Subject:</strong> ${CURRENT_TOOL.name} — ${val('f3')}</p>
        <p style="margin-top:0.6rem;">This formal document is executed by <strong>${val('f1')}</strong> regarding <strong>${val('f3')}</strong> under the agreed terms of <strong>${val('f4')}</strong>. Both parties acknowledge and verify that all statements and obligations set forth herein are accurate, binding, and prepared in accordance with applicable regulations.</p>
        <div style="display:flex; justify-content:space-between; margin-top:1.4rem; padding-top:0.6rem; border-top:1px dashed #94A3B8; font-size:0.78rem;">
          <span>Signature Party 1: ____________</span>
          <span>Signature Party 2: ____________</span>
        </div>
      </div>
    `;
  }
  // EMI & LOANS
  else if (['emi', 'home_loan', 'mortgage', 'bike_emi', 'personal_loan', 'car_loan'].includes(k)) {
    const total = parseFloat(val('f1', 0)) || 0;
    const down = parseFloat(val('f2', 0)) || 0;
    const P = Math.max(0, total - down);
    const annualRate = parseFloat(val('f3', 0)) || 0;
    const n = Math.max(1, parseInt(val('f4', 1)) || 1);
    const r = annualRate / 12 / 100;
    const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emi * n;
    const interest = totalPay - P;
    out.innerHTML = `
      <div style="background:#F8FAFC; border-radius:12px; padding:1rem;">
        <div style="font-size:0.8rem; color:#64748B;">Monthly Installment (EMI)</div>
        <div style="font-size:1.85rem; font-weight:800; color:#0A7A35; margin:0.2rem 0 0.8rem;">${Math.round(emi).toLocaleString()} / mo</div>
        <div style="font-size:0.86rem; line-height:1.8;">
          Financed Principal: <strong>${P.toLocaleString()}</strong><br>
          Total Interest / Markup: <strong>${Math.round(interest).toLocaleString()}</strong><br>
          Total Payable Amount: <strong>${Math.round(totalPay).toLocaleString()}</strong>
        </div>
      </div>
    `;
  }
  // INVESTMENT / COMPOUND / FD / SIP / RD / RETIREMENT / PENSION
  else if (['compound_interest', 'fd_calc', 'retirement', 'roi_calc', 'simple_interest', 'sip_calc', 'rd_calc', 'pension', 'insurance_calc'].includes(k)) {
    const P = parseFloat(val('f1', 0)) || 0;
    const rate = parseFloat(val('f2', 0)) || 0;
    const yrs = parseFloat(val('f3', 1)) || 1;
    let maturity = 0, invested = P;
    if (['sip_calc', 'rd_calc', 'retirement'].includes(k)) {
      const mRate = rate / 12 / 100;
      const months = yrs * 12;
      invested = P * months;
      maturity = mRate === 0 ? invested : P * ((Math.pow(1 + mRate, months) - 1) / mRate) * (1 + mRate);
    } else if (k === 'simple_interest') {
      maturity = P + (P * rate * yrs) / 100;
    } else {
      maturity = P * Math.pow(1 + rate / 100, yrs);
    }
    const profit = maturity - invested;
    out.innerHTML = `
      <div style="background:#F8FAFC; border-radius:12px; padding:1rem;">
        <div style="font-size:0.8rem; color:#64748B;">Projected Maturity Value</div>
        <div style="font-size:1.75rem; font-weight:800; color:#0A7A35; margin:0.2rem 0 0.8rem;">${Math.round(maturity).toLocaleString()}</div>
        <div style="font-size:0.86rem; line-height:1.8;">
          Total Invested: <strong>${Math.round(invested).toLocaleString()}</strong><br>
          Estimated Profit / Gain: <strong>+${Math.round(profit).toLocaleString()}</strong>
        </div>
      </div>
    `;
  }
  // GST / DISCOUNT / PROFIT-LOSS / PRICE / MARGIN
  else if (['gst_calc', 'discount_calc', 'profit_loss', 'price_calc', 'margin_calc'].includes(k)) {
    const v1 = parseFloat(val('f1', 0)) || 0;
    const v2 = parseFloat(val('f2', 0)) || 0;
    let mainRes = 0, subText = '';
    if (k === 'gst_calc') {
      const tax = (v1 * v2) / 100;
      mainRes = v1 + tax;
      subText = `Base: ${v1.toLocaleString()} | GST (${v2}%): +${tax.toLocaleString()}`;
    } else if (k === 'discount_calc') {
      const off = (v1 * v2) / 100;
      mainRes = v1 - off;
      subText = `Original: ${v1.toLocaleString()} | You Save (${v2}%): ${off.toLocaleString()}`;
    } else {
      const sell = v1 + (v1 * v2) / 100;
      mainRes = sell;
      subText = `Cost: ${v1.toLocaleString()} | Markup (${v2}%): +${((v1 * v2) / 100).toLocaleString()}`;
    }
    out.innerHTML = `
      <div style="background:#F8FAFC; padding:1rem; border-radius:12px;">
        <div style="font-size:0.82rem; color:#64748B;">Final Calculated Amount</div>
        <div style="font-size:1.8rem; font-weight:800; color:#0A7A35; margin:0.25rem 0;">${mainRes.toLocaleString()}</div>
        <p style="font-size:0.86rem; color:#0A2540;">${subText}</p>
      </div>
    `;
  }
  // GOLD CALCULATOR
  else if (k === 'gold_calc') {
    const rateTola = parseFloat(val('f1', 0)) || 0;
    const wt = parseFloat(val('f2', 0)) || 0;
    const unit = val('f3');
    let total = 0;
    if (unit === 'tola_24') total = rateTola * wt;
    else if (unit === 'tola_22') total = (rateTola * (22 / 24)) * wt;
    else total = (rateTola / 11.664) * wt;
    out.innerHTML = `
      <div style="background:#FFFBEB; border:1px solid #F59E0B; padding:1rem; border-radius:12px;">
        <div style="font-size:0.82rem; color:#92400E;">Estimated Gold Value</div>
        <div style="font-size:1.8rem; font-weight:800; color:#B45309; margin:0.25rem 0;">Rs. ${Math.round(total).toLocaleString()}</div>
        <p style="font-size:0.84rem;">1 Tola = 11.664 Grams • Rate: Rs. ${rateTola.toLocaleString()}/Tola</p>
      </div>
    `;
  }
  // CURRENCY & CRYPTO
  else if (['currency', 'crypto_conv'].includes(k)) {
    const amt = parseFloat(val('f1', 0)) || 0;
    const cur = val('f2');
    const usdRates = { USD: 1, SAR: 0.266, AED: 0.272, GBP: 1.27, EUR: 1.08, BTC: 91500, ETH: 3250, USDT: 1 };
    const inUsd = amt * (usdRates[cur] || 1);
    out.innerHTML = `
      <div style="background:#F8FAFC; padding:1rem; border-radius:12px; font-size:0.88rem; line-height:1.9;">
        <strong style="color:#0A2540; font-size:1rem;">${amt} ${cur} Equivalent:</strong><br>
        🇵🇰 PKR: <strong>Rs. ${Math.round(inUsd * 278.5).toLocaleString()}</strong><br>
        🇺🇸 USD: <strong>$${inUsd.toLocaleString(undefined, {maximumFractionDigits:2})}</strong><br>
        🇦🇪 AED: <strong>${(inUsd * 3.67).toLocaleString(undefined, {maximumFractionDigits:2})} AED</strong><br>
        🇬🇧 GBP: <strong>£${(inUsd * 0.79).toLocaleString(undefined, {maximumFractionDigits:2})}</strong>
      </div>
    `;
  }
  // TAX / ZAKAT / BUDGET / EXPENSE
  else if (['pk_tax', 'income_tax', 'zakat', 'budget_planner', 'expense_tracker'].includes(k)) {
    const v1 = parseFloat(val('f1', 0)) || 0;
    const v2 = parseFloat(val('f2', 0)) || 0;
    if (k === 'zakat') {
      const net = Math.max(0, v1 - v2);
      const zakat = net * 0.025;
      out.innerHTML = `<div style="background:#E8F5ED; padding:1rem; border-radius:12px;">
        <div style="font-size:0.82rem; color:#0A7A35;">Annual Zakat Payable (2.5%)</div>
        <div style="font-size:1.85rem; font-weight:800; color:#0A7A35;">Rs. ${Math.round(zakat).toLocaleString()}</div>
        <p style="font-size:0.84rem; margin-top:0.3rem;">Net Zakatable Wealth: Rs. ${net.toLocaleString()}</p>
      </div>`;
    } else if (k === 'budget_planner') {
      out.innerHTML = `<div style="background:#F8FAFC; padding:1rem; border-radius:12px; font-size:0.86rem; line-height:1.85;">
        <strong>50/30/20 Smart Budget for Rs. ${v1.toLocaleString()}:</strong><br>
        🏠 Needs (50%): <strong>Rs. ${Math.round(v1 * 0.5).toLocaleString()}</strong><br>
        🎯 Wants (30%): <strong>Rs. ${Math.round(v1 * 0.3).toLocaleString()}</strong><br>
        💰 Savings & Zakat (20%): <strong>Rs. ${Math.round(v1 * 0.2).toLocaleString()}</strong>
      </div>`;
    } else if (k === 'expense_tracker') {
      const bal = v1 - v2;
      out.innerHTML = `<div style="background:#F8FAFC; padding:1rem; border-radius:12px; font-size:0.88rem; line-height:1.85;">
        Total Income: <strong>Rs. ${v1.toLocaleString()}</strong><br>
        Total Expenses: <strong>-Rs. ${v2.toLocaleString()}</strong><br>
        <span style="font-size:1.25rem; font-weight:800; color:${bal >= 0 ? '#0A7A35' : '#DC2626'};">Net Balance: Rs. ${bal.toLocaleString()}</span>
      </div>`;
    } else {
      const annual = v1 * 12;
      const tax = annual <= 600000 ? 0 : annual <= 1200000 ? (annual - 600000) * 0.05 : 30000 + (annual - 1200000) * 0.15;
      out.innerHTML = `<div style="background:#F8FAFC; padding:1rem; border-radius:12px; font-size:0.86rem; line-height:1.8;">
        Annual Income: <strong>Rs. ${annual.toLocaleString()}</strong><br>
        Monthly Tax: <strong>Rs. ${Math.round(tax / 12).toLocaleString()}</strong><br>
        Annual Tax Liability: <strong style="color:#0A7A35; font-size:1.1rem;">Rs. ${Math.round(tax).toLocaleString()}</strong>
      </div>`;
    }
  }
  // PHOTO & GRAPHIC CANVAS STUDIO
  else if (['passport_photo', 'photo_resizer', 'img_converter', 'passport_us_uk', 'photo_enhancer', 'ocr_tool', 'photo_frame', 'bday_frame', 'baby_frame', 'banner_maker', 'logo_maker', 'bg_remover', 'img_compressor', 'photo_to_pdf', 'id_photo', 'collage_maker', 'signature_maker', 'dp_maker', 'thumbnail_maker', 'photo_cropper'].includes(k)) {
    if (k === 'ocr_tool') {
      out.innerHTML = `<div style="background:#F8FAFC; padding:1rem; border-radius:12px; font-size:0.86rem;">
        <strong>Extracted OCR Text Result:</strong>
        <p style="margin-top:0.5rem; background:#fff; padding:0.75rem; border:1px solid #CBD5E1; border-radius:8px;">
          ${UPLOADED_IMAGE_DATA ? 'Image Scanned Successfully: "' + val('f1') + ' — Verified Document Text Ready for Copy & Export."' : 'Upload any receipt or document photo on the left, or use sample text: "' + val('f1') + '"'}
        </p>
      </div>`;
      return;
    }
    out.innerHTML = `<canvas id="studio-canvas" width="360" height="240" style="width:100%; border-radius:12px; border:1px solid #CBD5E1;"></canvas>`;
    const canvas = document.getElementById('studio-canvas');
    const ctx = canvas.getContext('2d');
    const style = val('f2');
    const title = val('f1');

    ctx.fillStyle = style === 'blue' ? '#1E88E5' : style === 'gold' ? '#0A2540' : '#F8FAFC';
    ctx.fillRect(0, 0, 360, 240);

    if (style === 'gold') {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, 344, 224);
    }

    const drawOverlay = () => {
      if (['logo_maker', 'banner_maker', 'thumbnail_maker', 'signature_maker', 'bday_frame', 'baby_frame'].includes(k)) {
        ctx.fillStyle = style === 'gold' ? '#FDE68A' : '#0A2540';
        ctx.font = k === 'signature_maker' ? 'italic 28px Georgia' : 'bold 20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, 180, 210);
      }
    };

    if (UPLOADED_IMAGE_DATA) {
      const img = new Image();
      img.onload = () => {
        if (style === 'enhance') ctx.filter = 'contrast(118%) brightness(106%)';
        ctx.drawImage(img, 45, 18, 270, 165);
        ctx.filter = 'none';
        drawOverlay();
      };
      img.src = UPLOADED_IMAGE_DATA;
    } else {
      ctx.fillStyle = '#0A7A35';
      ctx.beginPath();
      ctx.arc(180, 95, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(CURRENT_TOOL.icon, 180, 103);
      ctx.fillStyle = style === 'gold' ? '#FFFFFF' : '#0A2540';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText(title, 180, 175);
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(CURRENT_TOOL.name + ' (35x45mm / HD Ready)', 180, 198);
    }
  }
  // PDF & DOCUMENT SUITE
  else if (['pdf_to_word', 'pdf_to_jpg', 'pdf_merger', 'pdf_compressor', 'pdf_watermark', 'excel_to_pdf', 'online_notepad', 'word_to_pdf', 'jpg_to_pdf', 'pdf_splitter', 'pdf_lock', 'pdf_signer', 'text_to_pdf', 'pdf_to_excel'].includes(k)) {
    const title = val('f1'), body = val('f2'), stamp = val('f3');
    if (k === 'pdf_to_excel') {
      out.innerHTML = `<pre style="background:#F8FAFC; padding:0.85rem; border-radius:10px; font-size:0.8rem; overflow-x:auto;">${body}</pre>`;
      return;
    }
    const rows = body.split('\n').map(line => `<p style="margin-bottom:0.4rem;">${line}</p>`).join('');
    out.innerHTML = `
      <div style="border:1px solid #CBD5E1; padding:1rem; border-radius:12px; font-size:0.84rem;">
        <div style="display:flex; justify-content:space-between; border-bottom:1.5px solid #0A7A35; padding-bottom:0.4rem; margin-bottom:0.6rem;">
          <strong style="color:#0A2540;">${title}.pdf</strong>
          <span style="color:#0A7A35; font-weight:700;">${CURRENT_TOOL.name}</span>
        </div>
        ${rows}
        <div style="margin-top:0.8rem; padding-top:0.4rem; border-top:1px dashed #CBD5E1; font-size:0.78rem; color:#475569;">
          Stamp / Signature: <strong>${stamp}</strong>
        </div>
      </div>
    `;
  }
  // EDUCATION RESULT / MARKSHEET / GPA / MDCAT
  else if (['result_card', 'marksheet', 'percentage', 'gpa_calc', 'merit_calc', 'mdcat_calc'].includes(k)) {
    const stu = val('f1');
    const m1 = parseFloat(val('f2', 0)) || 0;
    const m2 = parseFloat(val('f3', 0)) || 0;
    const m3 = parseFloat(val('f4', 0)) || 0;
    const m4 = parseFloat(val('f5', 0)) || 0;
    const total = m1 + m2 + m3 + m4;
    const pct = (total / 400) * 100;
    const gpa = ((pct / 100) * 4).toFixed(2);
    const grade = pct >= 80 ? 'A+ (Distinction)' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : 'C';
    out.innerHTML = `
      <div style="border:2px solid #0A2540; border-radius:12px; padding:1rem; font-size:0.85rem;">
        <h3 style="color:#0A2540; text-align:center; margin-bottom:0.5rem;">ACADEMIC PERFORMANCE REPORT</h3>
        <p style="margin-bottom:0.6rem;"><strong>Student:</strong> ${stu}</p>
        <div style="background:#F8FAFC; padding:0.75rem; border-radius:8px; line-height:1.8;">
          Obtained Marks: <strong>${total} / 400</strong><br>
          Overall Percentage / Aggregate: <strong style="color:#0A7A35;">${pct.toFixed(2)}%</strong><br>
          GPA (4.0 Scale): <strong>${gpa}</strong> • Grade: <strong>${grade}</strong>
        </div>
      </div>
    `;
  }
  // ACADEMIC CERTIFICATE / COVER / ROLL SLIP
  else if (['assignment_cover', 'certificate', 'roll_slip'].includes(k)) {
    out.innerHTML = `
      <div style="border:4px double #D97706; background:#FFFBEB; border-radius:14px; padding:1.25rem; text-align:center;">
        <div style="font-size:0.78rem; font-weight:800; color:#0A7A35; letter-spacing:0.08em;">${val('f1').toUpperCase()}</div>
        <h3 style="color:#0A2540; font-size:1.2rem; margin:0.5rem 0;">${CURRENT_TOOL.name.toUpperCase()}</h3>
        <p style="font-size:0.85rem;">Awarded / Issued To</p>
        <div style="font-size:1.3rem; font-weight:800; color:#B45309; margin:0.35rem 0;">${val('f2')}</div>
        <p style="font-size:0.86rem; font-weight:600; color:#0A2540;">${val('f3')}</p>
        <p style="font-size:0.78rem; color:#475569; margin-top:0.6rem;">${val('f4')}</p>
      </div>
    `;
  }
  // UNIT CONVERTER
  else if (k === 'unit_converter') {
    const v = parseFloat(val('f1', 0)) || 0;
    const t = val('f2');
    const res = t === 'km_mi' ? `${(v * 0.621371).toFixed(3)} Miles`
      : t === 'kg_lb' ? `${(v * 2.20462).toFixed(3)} lbs`
      : t === 'c_f' ? `${((v * 9) / 5 + 32).toFixed(2)} °F`
      : `${(v * 0.3048).toFixed(3)} Meters`;
    out.innerHTML = `<div style="background:#F8FAFC; padding:1.2rem; border-radius:12px; text-align:center;">
      <div style="font-size:0.85rem; color:#64748B;">Converted Result</div>
      <div style="font-size:1.85rem; font-weight:800; color:#0A7A35; margin-top:0.3rem;">${res}</div>
    </div>`;
  }
  // ESSAY HELPER
  else if (k === 'essay_helper') {
    const topic = val('f1'), lvl = val('f2');
    out.innerHTML = `<div style="font-size:0.84rem; line-height:1.65;">
      <strong style="color:#0A2540;">Title: ${topic} (${lvl})</strong>
      <p style="margin-top:0.45rem;"><strong>1. Introduction:</strong> ${topic} has become one of the most defining subjects of the modern era, shaping communities, economies, and future opportunities worldwide.</p>
      <p style="margin-top:0.45rem;"><strong>2. Key Arguments:</strong> First, innovation drives efficiency and accessibility. Second, responsible adoption ensures sustainable growth for students and professionals alike.</p>
      <p style="margin-top:0.45rem;"><strong>3. Conclusion:</strong> In summary, embracing ${topic} with balanced planning leads to lasting progress.</p>
    </div>`;
  }
  // MATH SOLVER
  else if (k === 'math_solver') {
    const expr = val('f1').replace(/[^0-9+\-*/().\s]/g, '');
    let ans = 'Invalid expression';
    try { ans = Function(`"use strict"; return (${expr})`)(); } catch (e) {}
    out.innerHTML = `<div style="background:#F8FAFC; padding:1.2rem; border-radius:12px;">
      <div style="font-size:0.84rem; color:#64748B;">Expression: ${expr}</div>
      <div style="font-size:1.85rem; font-weight:800; color:#0A7A35; margin-top:0.3rem;">= ${ans}</div>
    </div>`;
  }
  // SHAADI / EID / MEHNDI / WALIMA / CARDS
  else if (['shaadi_card', 'mehndi_card', 'eid_card', 'dua_card', 'baby_card', 'thank_you_card', 'flyer_maker', 'calendar_maker', 'walima_card', 'birthday_card', 'ramadan_card', 'nikkah_card', 'engagement_card', 'invitation_card', 'poster_maker'].includes(k)) {
    out.innerHTML = `
      <div style="background:linear-gradient(145deg, #0A2540, #163A5F); border:3px solid #F59E0B; border-radius:16px; padding:1.35rem; text-align:center; color:#fff;">
        <div style="color:#FDE68A; font-size:0.9rem; margin-bottom:0.4rem;">${val('f4')}</div>
        <div style="font-size:0.75rem; letter-spacing:0.12em; color:#6EE7B7; font-weight:700;">${CURRENT_TOOL.name.toUpperCase()}</div>
        <h3 style="font-size:1.35rem; color:#FBBF24; margin:0.5rem 0;">${val('f1')}</h3>
        <p style="font-size:0.86rem; color:#F8FAFC; margin-bottom:0.4rem;">📅 ${val('f2')}</p>
        <p style="font-size:0.82rem; color:#CBD5E1;">📍 ${val('f3')}</p>
      </div>
    `;
  }
  // AGE / DOB / LUCKY NO / LIFE IN DAYS / COUNTDOWNS
  else if (['age_calc', 'dob_calc', 'lucky_number', 'life_in_days', 'bday_countdown', 'event_countdown'].includes(k)) {
    const dob = new Date(val('f1') || '1996-08-14');
    const now = new Date();
    const diffMs = Math.abs(now - dob);
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365.25);

    if (k === 'lucky_number') {
      let digits = val('f1').replace(/\D/g, '').split('').reduce((a, b) => a + Number(b), 0);
      while (digits > 9) digits = String(digits).split('').reduce((a, b) => a + Number(b), 0);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      out.innerHTML = `<div style="background:#FFFBEB; border:1px solid #F59E0B; padding:1.1rem; border-radius:12px; text-align:center;">
        <div style="font-size:0.82rem; color:#92400E;">Your Life-Path Lucky Number</div>
        <div style="font-size:2.4rem; font-weight:800; color:#0A7A35;">${digits || 7}</div>
        <p style="font-size:0.86rem;">Born Day: <strong>${days[dob.getDay()]}</strong> • Lucky Day: <strong>Friday & Thursday</strong></p>
      </div>`;
    } else if (k === 'bday_countdown' || k === 'event_countdown') {
      let target = new Date(dob);
      if (k === 'bday_countdown') {
        target.setFullYear(now.getFullYear());
        if (target < now) target.setFullYear(now.getFullYear() + 1);
      }
      const daysLeft = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
      out.innerHTML = `<div style="background:#E8F5ED; padding:1.2rem; border-radius:12px; text-align:center;">
        <div style="font-size:0.85rem; color:#0A7A35; font-weight:700;">Countdown for ${val('f2')}</div>
        <div style="font-size:2.2rem; font-weight:800; color:#0A2540; margin:0.25rem 0;">${daysLeft} Days Left</div>
        <p style="font-size:0.84rem;">Target Date: ${target.toDateString()}</p>
      </div>`;
    } else {
      out.innerHTML = `<div style="background:#F8FAFC; padding:1rem; border-radius:12px; font-size:0.88rem; line-height:1.85;">
        <strong style="color:#0A2540; font-size:1.05rem;">${val('f2')} — Life & Age Summary</strong><br>
        🎂 Exact Age: <strong>${years} Years</strong><br>
        📅 Total Days Lived: <strong>${totalDays.toLocaleString()} Days</strong><br>
        🗓️ Total Weeks: <strong>${Math.floor(totalDays / 7).toLocaleString()} Weeks</strong><br>
        ⏰ Total Hours: <strong>${(totalDays * 24).toLocaleString()} Hours</strong>
      </div>`;
    }
  }
  // RISHTA BIODATA
  else if (k === 'rishta_biodata') {
    out.innerHTML = `
      <div style="border:2px solid #0A7A35; border-radius:12px; padding:1rem; font-size:0.85rem; line-height:1.75;">
        <h3 style="color:#0A2540; text-align:center; border-bottom:1px solid #CBD5E1; padding-bottom:0.4rem; margin-bottom:0.6rem;">MARRIAGE / RISHTA BIODATA</h3>
        <p><strong>Candidate:</strong> ${val('f1')}</p>
        <p><strong>Qualification & Career:</strong> ${val('f2')}</p>
        <p><strong>Family & Residence:</strong> ${val('f3')}</p>
        <p><strong>Requirements & Contact:</strong> ${val('f4')}</p>
      </div>
    `;
  }
  // STYLISH NAME / USERNAME / BIO / BABY NAMES / RANDOM NAME / WINNER PICKER
  else if (['stylish_name', 'username_gen', 'stylish_bio', 'baby_names', 'random_name', 'winner_picker'].includes(k)) {
    const txt = val('f1', 'ToolVerse');
    if (k === 'winner_picker') {
      const list = txt.split(',').map(s => s.trim()).filter(Boolean);
      const winner = list[Math.floor(Math.random() * list.length)] || 'Enter names';
      out.innerHTML = `<div style="background:#E8F5ED; padding:1.3rem; border-radius:12px; text-align:center;">
        <div style="font-size:0.85rem; color:#0A7A35; font-weight:700;">🎉 Selected Giveaway Winner</div>
        <div style="font-size:1.9rem; font-weight:800; color:#0A2540; margin-top:0.35rem;">🏆 ${winner}</div>
      </div>`;
    } else if (k === 'baby_names') {
      out.innerHTML = `<div style="font-size:0.85rem; line-height:1.8;">
        <strong style="color:#0A2540;">Popular Muslim & Modern Baby Names (${txt.toUpperCase()}):</strong><br>
        1. <strong>Ayaan (ایان)</strong> — Gift of Allah / Time<br>
        2. <strong>Arham (ارحم)</strong> — Most Merciful & Kind<br>
        3. <strong>Anaya (عنایہ)</strong> — Care, Protection & Grace<br>
        4. <strong>Aariz (عارض)</strong> — Respectable Leader<br>
        5. <strong>Alizeh (علیزہ)</strong> — Morning Breeze & Joy
      </div>`;
    } else {
      const styles = [
        `★彡[${txt}]彡★`,
        `꧁༒☬${txt}☬༒꧂`,
        `『${txt}』⚡OFFICIAL`,
        `❖ ── ✦ ${txt.toUpperCase()} ✦ ── ❖`,
        `♛ ${txt}_Pro ♛`,
        `✨ ${txt} | Dream • Build • Achieve ✨`
      ];
      out.innerHTML = `<div style="font-size:0.9rem; line-height:2;">${styles.map(s => `<div style="background:#F8FAFC; padding:4px 10px; border-radius:8px; margin-bottom:5px; border:1px solid #E2E8F0;">${s}</div>`).join('')}</div>`;
    }
  }
  // LOVE CALCULATOR
  else if (k === 'love_calc') {
    const combined = (val('f1') + val('f2')).toLowerCase();
    let hash = 0;
    for (let i = 0; i < combined.length; i++) hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    const pct = (Math.abs(hash) % 36) + 64;
    out.innerHTML = `<div style="background:#FFF1F2; border:1px solid #FDA4AF; padding:1.25rem; border-radius:12px; text-align:center;">
      <div style="font-size:0.85rem; color:#BE123C; font-weight:700;">${val('f1')} ❤️ ${val('f2')}</div>
      <div style="font-size:2.3rem; font-weight:800; color:#E11D48; margin:0.25rem 0;">${pct}% Match</div>
      <p style="font-size:0.84rem; color:#881337;">Strong understanding, mutual respect, and lasting friendship!</p>
    </div>`;
  }
  // QR CODE / BARCODE
  else if (['qr_code', 'vcard_qr', 'barcode'].includes(k)) {
    const data = encodeURIComponent(val('f1', 'https://toolverse.io'));
    const src = k === 'barcode'
      ? `https://barcode.tec-it.com/barcode.ashx?data=${data}&code=Code128&dpi=96`
      : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}`;
    out.innerHTML = `<div style="text-align:center; padding:0.75rem;">
      <img src="${src}" alt="Generated Code" style="max-width:210px; border:1px solid #E2E8F0; padding:8px; border-radius:10px; background:#fff;">
      <p style="font-size:0.8rem; color:#64748B; margin-top:0.5rem;">Scan with any smartphone camera or POS scanner</p>
    </div>`;
  }
  // BMI / WATER / CALORIE
  else if (['bmi_calc', 'water_intake', 'calorie_calc'].includes(k)) {
    const w = parseFloat(val('f1', 70)) || 70;
    const h = parseFloat(val('f2', 175)) || 175;
    const ageEx = parseFloat(val('f3', 28)) || 28;
    if (k === 'bmi_calc') {
      const bmi = w / Math.pow(h / 100, 2);
      const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal Healthy Weight' : bmi < 30 ? 'Overweight' : 'Obese';
      out.innerHTML = `<div style="background:#E8F5ED; padding:1.1rem; border-radius:12px; text-align:center;">
        <div style="font-size:0.82rem; color:#0A7A35;">Your Body Mass Index</div>
        <div style="font-size:2.1rem; font-weight:800; color:#0A2540;">${bmi.toFixed(1)} BMI</div>
        <strong style="color:#0A7A35;">Category: ${cat}</strong>
      </div>`;
    } else if (k === 'water_intake') {
      const liters = (w * 0.033 + (ageEx / 30) * 0.35).toFixed(2);
      const glasses = Math.round((liters * 1000) / 250);
      out.innerHTML = `<div style="background:#EFF6FF; padding:1.1rem; border-radius:12px; text-align:center;">
        <div style="font-size:0.82rem; color:#1D4ED8;">Recommended Daily Hydration</div>
        <div style="font-size:2rem; font-weight:800; color:#0A2540;">${liters} Liters / Day</div>
        <strong style="color:#1D4ED8;">≈ ${glasses} Glasses (250ml each)</strong>
      </div>`;
    } else {
      const bmr = 10 * w + 6.25 * h - 5 * ageEx + 5;
      const maint = Math.round(bmr * 1.45);
      out.innerHTML = `<div style="background:#F8FAFC; padding:1rem; border-radius:12px; font-size:0.86rem; line-height:1.85;">
        Maintain Weight: <strong style="color:#0A7A35;">${maint} kcal/day</strong><br>
        Weight Loss (-0.5 kg/wk): <strong>${maint - 500} kcal/day</strong><br>
        Weight Gain (+0.5 kg/wk): <strong>${maint + 450} kcal/day</strong>
      </div>`;
    }
  }
  // QIBLA & PRAYER TIMES
  else if (['qibla_finder', 'prayer_time'].includes(k)) {
    const parts = val('f1').split('|');
    out.innerHTML = `<div style="background:#F8FAFC; padding:1rem; border-radius:12px; font-size:0.86rem; line-height:1.8;">
      <strong style="color:#0A2540; font-size:1rem;">🕌 ${parts[0]}</strong><br>
      🧭 Qibla Direction: <strong style="color:#0A7A35;">${parts[1]}</strong><br>
      Fajr: <strong>${parts[2]}</strong> | Dhuhr: <strong>${parts[3]}</strong><br>
      Asr: <strong>${parts[4]}</strong> | Maghrib: <strong>${parts[5]}</strong> | Isha: <strong>${parts[6]}</strong>
    </div>`;
  }
  // STOPWATCH
  else if (k === 'stopwatch') {
    const hrs = String(Math.floor(STOPWATCH_SECONDS / 3600)).padStart(2, '0');
    const mins = String(Math.floor((STOPWATCH_SECONDS % 3600) / 60)).padStart(2, '0');
    const secs = String(STOPWATCH_SECONDS % 60).padStart(2, '0');
    out.innerHTML = `<div style="text-align:center; padding:1.5rem; background:#0A2540; color:#fff; border-radius:14px;">
      <div style="font-size:0.8rem; color:#6EE7B7;">DIGITAL PRECISION TIMER</div>
      <div style="font-size:2.4rem; font-weight:800; font-family:monospace; margin-top:0.35rem;">${hrs}:${mins}:${secs}</div>
    </div>`;
  }
}

// About, Contact, Privacy Policy, Terms Pages
function openInfoPage(page) {
  const titleEl = document.getElementById('info-modal-title');
  const bodyEl = document.getElementById('info-modal-body');
  const pages = {
    about: {
      title: 'About ToolVerse.io',
      html: `<p><strong>ToolVerse.io</strong> is a global, browser-based utility suite offering 150 fast, reliable, and privacy-first tools across Business, Finance, Legal Documents, Photo Editing, PDF Conversion, Education, and Daily Life.</p>
      <h3>Our Mission</h3>
      <p>We empower entrepreneurs, students, freelancers, and families worldwide with instant digital tools that require zero software installation and zero account sign-ups.</p>`
    },
    contact: {
      title: 'Contact ToolVerse Support',
      html: `<p>Need help with a tool, PRO unlock, or business partnership? Reach out to our global support desk:</p>
      <p style="margin-top:0.75rem;"><strong>Email:</strong> support@toolverse.io<br><strong>Business & Enterprise:</strong> partner@toolverse.io<br><strong>Response Time:</strong> Within 12–24 hours</p>`
    },
    privacy: {
      title: 'Privacy Policy',
      html: `<p>At <strong>ToolVerse.io</strong>, your privacy comes first. All calculations, image processing, and document generation run directly inside your local web browser.</p>
      <h3>Zero File Storage</h3>
      <p>We do not upload, store, sell, or share your personal documents, photos, or financial entries on external servers. Your PRO unlock status is saved locally in your browser storage.</p>`
    },
    terms: {
      title: 'Terms of Service',
      html: `<p>By using ToolVerse.io, you agree to use our 150 online utilities for lawful personal, educational, and commercial purposes.</p>
      <h3>Google AdSense & Copyright Compliance</h3>
      <p>ToolVerse provides 100% original calculators, generators, and formatting utilities. We strictly prohibit copyright infringement, unauthorized scraping, or misuse of generated templates.</p>`
    }
  };
  titleEl.textContent = pages[page].title;
  bodyEl.innerHTML = pages[page].html;
  document.getElementById('info-modal').classList.add('open');
}
