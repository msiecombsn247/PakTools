// ============================================
// WorldTools / PakToolsOnline - script.js
// DUKAN KA DIMAG - Search + Filter + FREE/PRO
// ============================================

let ALL_TOOLS = [];
let CURRENT_CAT = "All";
let CURRENT_SEARCH = "";

// 1. PAGE KHULTE HI tools.json LOAD KARO
async function loadTools() {
  try {
    let res = await fetch("tools.json");
    ALL_TOOLS = await res.json();
    renderTools();
  } catch (e) {
    // Agar tools.json na mile to 8 Popular Tools dikhao - taake page khali na lage
    ALL_TOOLS = [
      {id:1,name:"Invoice Generator",cat:"Business & Office",icon:"🧾",desc:"Professional invoice in seconds",type:"FREE+PRO",pro:800,blog:"How to make invoice in Pakistan"},
      {id:116,name:"Shaadi Card Maker Urdu",cat:"Shaadi / Cards",icon:"💍",desc:"Design wedding cards in Urdu & English",type:"FREE+PRO",pro:1200,blog:"Shaadi card kaise banaye Urdu me"},
      {id:66,name:"Passport Photo Maker",cat:"Photo & Image",icon:"🪪",desc:"Passport size photo maker",type:"FREE+PRO",pro:800,blog:"Passport size photo kaise banaye"},
      {id:17,name:"CV / Resume Maker",cat:"Business & Office",icon:"👔",desc:"Build your CV instantly",type:"FREE+PRO",pro:1000,blog:"CV kaise banaye Pakistan me"},
      {id:103,name:"Age Calculator",cat:"Education",icon:"🎂",desc:"Calculate age from date of birth",type:"FREE",pro:0,blog:"Age kaise calculate kare"},
      {id:141,name:"QR Code Generator",cat:"Daily Life & Health",icon:"🔲",desc:"Generate QR codes for free",type:"FREE",pro:0,blog:"QR code kaise banaye"},
      {id:26,name:"EMI Calculator",cat:"Finance",icon:"🏦",desc:"Loan & EMI calculator",type:"FREE",pro:0,blog:"EMI kaise calculate kare"},
      {id:101,name:"Result Card Maker",cat:"Education",icon:"🏫",desc:"Create school result card",type:"FREE+PRO",pro:500,blog:"Result card kaise banaye"}
    ];
    renderTools();
  }
}

// 2. TOOLS KE CARDS BANAO
function renderTools() {
  let grid = document.getElementById("toolsGrid");
  if(!grid) return;

  let filtered = ALL_TOOLS.filter(t => {
    let catMatch = CURRENT_CAT === "All" || t.cat === CURRENT_CAT || t.cat.includes(CURRENT_CAT) || CURRENT_CAT.includes(t.cat);
    // Category buttons ke liye short mapping
    if(CURRENT_CAT==="Office") catMatch = t.cat==="Business & Office";
    if(CURRENT_CAT==="Cards") catMatch = t.cat==="Shaadi / Cards";
    if(CURRENT_CAT==="Photo") catMatch = t.cat==="Photo & Image";
    if(CURRENT_CAT==="School") catMatch = t.cat==="Education";
    if(CURRENT_CAT==="Daily") catMatch = t.cat==="Daily Life & Health";
    let searchMatch = t.name.toLowerCase().includes(CURRENT_SEARCH) || t.desc.toLowerCase().includes(CURRENT_SEARCH) || t.cat.toLowerCase().includes(CURRENT_SEARCH);
    return catMatch && searchMatch;
  });

  // Agar koi tool na mile
  if(filtered.length===0){
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px">Koi tool nahi mila. Doosra naam try karein. 🔍</div>`;
    updateCount(0);
    return;
  }

  grid.innerHTML = filtered.map(t => `
    <div class="card" onclick="openTool(${t.id})">
      <div class="icon">${t.icon}</div>
      <h3>${t.name}</h3>
      <p>${t.desc}</p>
      <span style="font-size:11px;color:#888">${t.cat}</span><br>
      ${t.type==="FREE+PRO" 
        ? `<span class="free">FREE</span> <span style="display:inline-block;background:#fff3cd;color:#7a5a00;padding:3px 12px;border-radius:6px;font-size:12px;font-weight:bold;margin-top:10px">PRO ${t.pro} Rs</span>`
        : `<span class="free">FREE</span>`
      }
    </div>
  `).join("");

  updateCount(filtered.length);
}

function updateCount(n){
  let top = document.querySelector(".top h2");
  if(top) top.innerText = `Popular Tools (${n})`;
  let viewAll = document.querySelector(".top a");
  if(viewAll) viewAll.innerText = `View All ${ALL_TOOLS.length} →`;
}

// 3. SEARCH - index.html wale search box se
function filterTools(){
  let inp = document.getElementById("searchInput");
  CURRENT_SEARCH = inp ? inp.value.toLowerCase().trim() : "";
  renderTools();
}

// 4. CATEGORY FILTER - Buttons se
function filterCat(cat, btn){
  CURRENT_CAT = cat;
  document.querySelectorAll("#cats button").forEach(b=>b.classList.remove("active"));
  if(btn) btn.classList.add("active");
  renderTools();
}

// 5. VIEW ALL - Saare tools dikhao
function showAll(){
  CURRENT_CAT = "All";
  CURRENT_SEARCH = "";
  let inp = document.getElementById("searchInput");
  if(inp) inp.value="";
  document.querySelectorAll("#cats button").forEach(b=>b.classList.remove("active"));
  let first = document.querySelector("#cats button");
  if(first) first.classList.add("active");
  renderTools();
  window.scrollTo({top: document.getElementById("toolsGrid").offsetTop - 80, behavior:"smooth"});
  return false;
}

// 6. TOOL KHOLO - Jab banda card dabaye
function openTool(id){
  let t = ALL_TOOLS.find(x=>x.id===id);
  if(!t) return;

  // FREE + PRO wale tool ke liye 2 options dikhao
  if(t.type==="FREE+PRO"){
    let choice = confirm(`🛠️ ${t.name}\n\n${t.desc}\n\nOK = FREE Version (Simple, Watermark)\nCancel = PRO Version (${t.pro} Rs - Premium, No Watermark, Office Ready)\n\nFREE kholna hai to OK dabayein.`);
    if(choice){
      openFreeTool(t);
    } else {
      openProPayment(t);
    }
  } else {
    // SIRF FREE wale - seedha kholo
    openFreeTool(t);
  }
}

// 7. FREE TOOL KHOLO
function openFreeTool(t){
  // Yahan baad me har tool ka apna page khulega
  // Abhi ke liye demo: Blog + Tool ka naam dikhao
  alert(`✅ ${t.name} - FREE Version\n\n${t.desc}\n\n📝 Blog: ${t.blog}\n\nIs tool ka poora FREE version agle step me banega.\nAIM CARD Rule: 100% Working - No Error.`);
}

// 8. PRO PAYMENT KHOLO - JazzCash / Easypaisa / Card
function openProPayment(t){
  let pay = confirm(`⭐ ${t.name} - PRO Version - ${t.pro} Rs\n\nPRO me milega:\n✓ Premium Design\n✓ No Watermark\n✓ Embassy / Office Ready\n✓ High Quality Download\n\nPayment:\n• JazzCash / Easypaisa (Pakistan)\n• Card / PayPal (World)\n\nPayment karne ke liye OK dabayein.\n\nPayment ke baad AUTO PRO Unlock ho jayega.`);
  if(pay){
    // Yahan JazzCash / Easypaisa ka link aayega
    // Abhi ke liye WhatsApp / Payment page ka demo
    let wa = prompt(`PRO Unlock - ${t.name} - ${t.pro} Rs\n\nApna JazzCash / Easypaisa Number likhein:\n(Jaise: 0300-1234567)`);
    if(wa && wa.length >= 10){
      alert(`Shukriya! ✅\n\n${t.name} PRO ke liye request mil gayi.\nNumber: ${wa}\n\nPayment verify hote hi DOWNLOAD button khul jayega.\n(Auto PRO Unlock - Manual ka wait nahi)`);
      // Yahan localStorage me PRO unlock save hota hai
      localStorage.setItem("PRO_"+t.id, "unlocked");
    }
  }
}

// 9. PAGE LOAD HOTE HI CHALAO
document.addEventListener("DOMContentLoaded", loadTools);
