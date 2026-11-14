// ToolWorldly - WORLD VERSION V2 - Categories First
let ALL_TOOLS = [];
let CURRENT_CAT = "";
let CURRENT_SEARCH = "";

const CATEGORIES = [
  {name:"Business & Office", icon:"💼", desc:"Invoice, CV, Receipt, Agreement, Visiting Card & more for business.", color:"#eef6ff"},
  {name:"Finance", icon:"💰", desc:"EMI, Loan, Tax, Zakat, Salary, Gold & Currency calculators.", color:"#e6f7eb"},
  {name:"Legal & Docs", icon:"⚖️", desc:"Contracts, Rent Agreement, Visa Letters, NDA & Job Offer.", color:"#fef3e2"},
  {name:"Photo & Image", icon:"📸", desc:"Passport Photo, Background Remover, Compressor, Logo & more.", color:"#f3e8ff"},
  {name:"PDF & Documents", icon:"📄", desc:"PDF to Word, Merge, Split, Compress, Sign & Convert.", color:"#e0f2fe"},
  {name:"Education", icon:"🎓", desc:"Result Card, GPA, Merit, Age Calculator & Certificate Maker.", color:"#e6f7eb"},
  {name:"Shaadi / Cards", icon:"💍", desc:"Shaadi, Walima, Mehndi, Birthday, Eid & Invitation Cards.", color:"#ffe4ec"},
  {name:"Rishta, Life & Fun", icon:"❤️", desc:"Rishta Biodata, Stylish Name, Love Calculator & Fun Tools.", color:"#fff0e0"},
  {name:"Daily Life & Health", icon:"🌍", desc:"QR Code, BMI, Qibla, Prayer Time, Countdown & Timer.", color:"#e0f7f5"},
];

async function loadTools(){
  try{ let r=await fetch("tools.json"); ALL_TOOLS=await r.json(); }
  catch(e){ ALL_TOOLS=[]; }
  renderCategories();
  document.getElementById("totalCount").innerText = ALL_TOOLS.length + " Tools • 9 Categories";
}

function renderCategories(){
  let grid=document.getElementById("catsGrid");
  grid.innerHTML = CATEGORIES.map(c=>{
    let count = ALL_TOOLS.filter(t=>t.cat===c.name).length;
    return `<div class="card" onclick="openCategory('${c.name}')">
      <div class="ic" style="background:${c.color}">${c.icon}</div>
      <div><h3>${c.name}</h3><p>${c.desc}</p><span class="count">${count} Tools →</span></div>
    </div>`;
  }).join("");
}

function openCategory(catName){
  CURRENT_CAT = catName;
  document.getElementById("homeSection").style.display="none";
  document.getElementById("toolsSection").style.display="block";
  let c = CATEGORIES.find(x=>x.name===catName);
  document.getElementById("catTitle").innerText = catName;
  document.getElementById("catDesc").innerText = c ? c.desc : "";
  renderTools();
  window.scrollTo({top:0, behavior:"smooth"});
}

function goHome(){
  document.getElementById("homeSection").style.display="block";
  document.getElementById("toolsSection").style.display="none";
  CURRENT_CAT=""; CURRENT_SEARCH="";
  document.getElementById("searchInput").value="";
  renderCategories();
  window.scrollTo({top:0, behavior:"smooth"});
  return false;
}

function renderTools(){
  let grid=document.getElementById("toolsGrid");
  let filtered = ALL_TOOLS.filter(t=>{
    let catMatch = CURRENT_CAT==="" || t.cat===CURRENT_CAT;
    let s = CURRENT_SEARCH.toLowerCase();
    let searchMatch = !s || t.name.toLowerCase().includes(s) || t.desc.toLowerCase().includes(s) || t.cat.toLowerCase().includes(s);
    return catMatch && searchMatch;
  });
  // Agar search me kuch likha hai aur category nahi khuli, to category view khol do
  if(filtered.length===0){
    grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:30px">No tool found. Try another keyword.</div>`;
    return;
  }
  grid.innerHTML = filtered.map(t=>`
    <div class="toolCard" onclick="openTool(${t.id})">
      <div class="icon">${t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p>
      ${t.type==="FREE+PRO" ? `<span class="free">FREE</span> <span class="pro">PRO ${t.pro} Rs</span>` : `<span class="free">FREE</span>`}
    </div>`).join("");
}

function filterTools(){
  let v=document.getElementById("searchInput").value.toLowerCase().trim();
  CURRENT_SEARCH=v;
  if(v.length>1){
    // Search karte hi category view khol do, taake tools dikhein
    document.getElementById("homeSection").style.display="none";
    document.getElementById("toolsSection").style.display="block";
    document.getElementById("catTitle").innerText = `Search Results for "${v}"`;
    document.getElementById("catDesc").innerText = "Tools matching your search";
    CURRENT_CAT="";
    renderTools();
  } else if(v.length===0){
    goHome();
  }
}
function quickSearch(word){
  document.getElementById("searchInput").value=word;
  filterTools();
}
function openTool(id){
  let t=ALL_TOOLS.find(x=>x.id===id); if(!t) return;
  if(t.type==="FREE+PRO"){
    let isPro = confirm(`🛠️ ${t.name}\n\n${t.desc}\n\nOK = FREE Version\nCancel = PRO Version (${t.pro} Rs - Premium, No Watermark)`);
    if(isPro) alert(`✅ ${t.name} - FREE Version opening...`);
    else alert(`⭐ ${t.name} - PRO ${t.pro} Rs\nPayment: JazzCash / Easypaisa / Card / PayPal\nPayment ke baad AUTO PRO Unlock.`);
  } else {
    alert(`✅ ${t.name} - FREE Version opening...\n${t.desc}`);
  }
}
document.addEventListener("DOMContentLoaded", loadTools);
