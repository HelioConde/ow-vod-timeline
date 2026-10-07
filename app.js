const STORAGE_KEY="ow-vod-timeline:reviews:v1";
const LANGUAGE_KEY="ow-vod-timeline:language";

const ui={
  pt:{
    local:"100% local no MVP",eyebrow:"OVERWATCH · REVISÃO PÓS-PARTIDA",
    heroTitle:'Pare de rever o VOD inteiro. <span>Marque os momentos que importam.</span>',
    heroText:"Abra um vídeo do seu computador, pause no momento importante e crie uma timeline com contexto, categoria e ação para a próxima partida.",
    benefit1:"✓ O vídeo não sai do navegador",benefit2:"✓ Notas salvas localmente",benefit3:"✓ Exportação em JSON",
    reviewFlow:"FLUXO DE REVISÃO",flow1:"Abra seu VOD local",flow2:"Marque o timestamp",flow3:"Escreva o que aconteceu",flow4:"Transforme em próxima ação",
    step1:"1 · VOD",videoTitle:"Abra um vídeo para revisar",openVideo:"Escolher vídeo",
    emptyVideoTitle:"Nenhum vídeo aberto",emptyVideoText:"Escolha um arquivo de vídeo do seu computador. Ele é reproduzido localmente e não é enviado para servidor.",
    reviewName:"Nome da revisão",currentTime:"Tempo atual",step2:"2 · MOMENTO",noteTitle:"O que aconteceu aqui?",
    timestamp:"Timestamp",category:"Categoria",observation:"Observação",nextAction:"Próxima ação",
    addMoment:"Adicionar à timeline",useCurrent:"Usar tempo atual",clearForm:"Limpar",ad:"PUBLICIDADE",adNote:"espaço reservado · fora do player",
    step3:"3 · TIMELINE",timelineTitle:"Momentos da revisão",import:"Importar JSON",export:"Exportar JSON",clearTimeline:"Limpar timeline",all:"Todos",
    methodEyebrow:"COMO USAR BEM",methodTitle:"Marque menos momentos. Escreva melhor.",
    methodText:"Uma timeline útil não precisa registrar cada erro. Priorize decisões repetidas, lutas importantes e situações que viram uma ação concreta para a próxima partida.",
    disclaimer:"Projeto independente e não afiliado à Blizzard Entertainment.",about:"Sobre",privacy:"Privacidade",terms:"Termos",
    catPositioning:"Posicionamento",catUltimate:"Ultimate",catTarget:"Prioridade de alvo",catCooldown:"Cooldown",catTeamfight:"Teamfight",catGood:"Boa decisão",catOther:"Outro",
    noNotes:"Nenhum momento marcado ainda.",summary:function(n){return n+" momento"+(n===1?"":"s")+" marcado"+(n===1?"":"s");},
    saved:"Momento adicionado.",deleted:"Momento removido.",cleared:"Timeline limpa.",invalidTime:"Use um timestamp válido, como 02:14.",
    needVideo:"Abra um vídeo primeiro para usar o tempo atual.",imported:"Timeline importada.",importError:"Não foi possível importar esse arquivo.",
    exported:"JSON exportado.",jump:"Ir para o momento",remove:"Excluir",action:"Próxima ação",videoOpened:"Vídeo aberto localmente.",
    reviewDefault:"Minha revisão de Overwatch"
  },
  en:{
    local:"100% local in the MVP",eyebrow:"OVERWATCH · POST-MATCH REVIEW",
    heroTitle:'Stop rewatching the whole VOD. <span>Mark the moments that matter.</span>',
    heroText:"Open a video from your computer, pause at an important moment and build a timeline with context, category and an action for the next match.",
    benefit1:"✓ The video never leaves your browser",benefit2:"✓ Notes saved locally",benefit3:"✓ JSON export",
    reviewFlow:"REVIEW FLOW",flow1:"Open your local VOD",flow2:"Mark the timestamp",flow3:"Write what happened",flow4:"Turn it into a next action",
    step1:"1 · VOD",videoTitle:"Open a video to review",openVideo:"Choose video",
    emptyVideoTitle:"No video opened",emptyVideoText:"Choose a video file from your computer. It is played locally and is not uploaded to a server.",
    reviewName:"Review name",currentTime:"Current time",step2:"2 · MOMENT",noteTitle:"What happened here?",
    timestamp:"Timestamp",category:"Category",observation:"Observation",nextAction:"Next action",
    addMoment:"Add to timeline",useCurrent:"Use current time",clearForm:"Clear",ad:"ADVERTISEMENT",adNote:"reserved space · outside the player",
    step3:"3 · TIMELINE",timelineTitle:"Review moments",import:"Import JSON",export:"Export JSON",clearTimeline:"Clear timeline",all:"All",
    methodEyebrow:"HOW TO USE IT",methodTitle:"Mark fewer moments. Write better notes.",
    methodText:"A useful timeline does not need to log every mistake. Prioritize repeated decisions, important fights and situations that become a concrete action for the next match.",
    disclaimer:"Independent project not affiliated with Blizzard Entertainment.",about:"About",privacy:"Privacy",terms:"Terms",
    catPositioning:"Positioning",catUltimate:"Ultimate",catTarget:"Target priority",catCooldown:"Cooldown",catTeamfight:"Teamfight",catGood:"Good decision",catOther:"Other",
    noNotes:"No moments marked yet.",summary:function(n){return n+" marked moment"+(n===1?"":"s");},
    saved:"Moment added.",deleted:"Moment removed.",cleared:"Timeline cleared.",invalidTime:"Use a valid timestamp such as 02:14.",
    needVideo:"Open a video first to use the current time.",imported:"Timeline imported.",importError:"Could not import this file.",
    exported:"JSON exported.",jump:"Jump to moment",remove:"Delete",action:"Next action",videoOpened:"Video opened locally.",
    reviewDefault:"My Overwatch review"
  }
};

let lang=localStorage.getItem(LANGUAGE_KEY)==="en"?"en":"pt";
let notes=[];
let currentFilter="all";
let currentVideoUrl="";
let toastTimer=null;

function $(selector){return document.querySelector(selector);}
function t(key){return ui[lang][key]||key;}
function esc(value){
  return String(value==null?"":value).replace(/[&<>"']/g,function(char){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char];
  });
}
function categoryLabel(value){
  const key={
    positioning:"catPositioning",ultimate:"catUltimate",target:"catTarget",
    cooldown:"catCooldown",teamfight:"catTeamfight",good:"catGood",other:"catOther"
  }[value]||"catOther";
  return t(key);
}
function formatTime(seconds){
  const value=Math.max(0,Math.floor(Number(seconds)||0));
  const h=Math.floor(value/3600);
  const m=Math.floor((value%3600)/60);
  const s=value%60;
  if(h>0)return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
}
function parseTime(value){
  const raw=String(value||"").trim();
  if(!/^\d{1,2}:\d{2}(?::\d{2})?$/.test(raw))return null;
  const parts=raw.split(":").map(Number);
  if(parts.some(function(n){return !Number.isFinite(n);}))return null;
  if(parts.length===2){
    if(parts[1]>59)return null;
    return parts[0]*60+parts[1];
  }
  if(parts[1]>59||parts[2]>59)return null;
  return parts[0]*3600+parts[1]*60+parts[2];
}
function showToast(message){
  const toast=$("#toast");
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){toast.classList.remove("show");},2200);
}
function reviewName(){
  return $("#review-name").value.trim()||t("reviewDefault");
}
function storagePayload(){
  return {
    version:1,
    name:reviewName(),
    notes:notes.slice().sort(function(a,b){return a.seconds-b.seconds;}),
    updatedAt:new Date().toISOString()
  };
}
function saveLocal(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(storagePayload()));
}
function loadLocal(){
  try{
    const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
    if(parsed&&Array.isArray(parsed.notes)){
      notes=parsed.notes.filter(validNote).map(normalizeNote);
      if(parsed.name)$("#review-name").value=String(parsed.name).slice(0,80);
    }
  }catch(error){
    notes=[];
  }
}
function validNote(note){
  return note&&Number.isFinite(Number(note.seconds))&&typeof note.observation==="string";
}
function normalizeNote(note){
  return {
    id:String(note.id||("note-"+Date.now()+"-"+Math.random().toString(36).slice(2,8))),
    seconds:Math.max(0,Math.floor(Number(note.seconds)||0)),
    category:["positioning","ultimate","target","cooldown","teamfight","good","other"].includes(note.category)?note.category:"other",
    observation:String(note.observation||"").slice(0,500),
    nextAction:String(note.nextAction||"").slice(0,180),
    createdAt:note.createdAt||new Date().toISOString()
  };
}
function filteredNotes(){
  const sorted=notes.slice().sort(function(a,b){return a.seconds-b.seconds;});
  return currentFilter==="all"?sorted:sorted.filter(function(note){return note.category===currentFilter;});
}
function renderTimeline(){
  const host=$("#timeline-list");
  const rows=filteredNotes();
  $("#timeline-summary").textContent=ui[lang].summary(notes.length);
  document.querySelectorAll("[data-filter]").forEach(function(button){
    button.classList.toggle("active",button.dataset.filter===currentFilter);
  });

  if(!rows.length){
    host.innerHTML='<div class="empty-timeline">'+esc(t("noNotes"))+'</div>';
    return;
  }

  host.innerHTML=rows.map(function(note){
    const action=note.nextAction?'<small><b>'+esc(t("action"))+':</b> '+esc(note.nextAction)+'</small>':"";
    return '<article class="timeline-item" data-id="'+esc(note.id)+'">'+
      '<button class="timeline-time" type="button" data-jump="'+note.seconds+'" title="'+esc(t("jump"))+'">'+esc(formatTime(note.seconds))+'</button>'+
      '<span class="category-pill">'+esc(categoryLabel(note.category))+'</span>'+
      '<div class="timeline-copy"><strong>'+esc(note.observation)+'</strong>'+action+'</div>'+
      '<div class="timeline-controls"><button type="button" data-jump="'+note.seconds+'">'+esc(t("jump"))+'</button><button type="button" data-delete="'+esc(note.id)+'">'+esc(t("remove"))+'</button></div>'+
      '</article>';
  }).join("");
}
function applyLanguage(){
  document.documentElement.lang=lang==="pt"?"pt-BR":"en";
  document.querySelectorAll("[data-i18n]").forEach(function(element){
    const value=t(element.dataset.i18n);
    if(typeof value==="string"&&value.indexOf("<span>")>=0)element.innerHTML=value;
    else if(typeof value==="string")element.textContent=value;
  });
  document.querySelectorAll("[data-i18n-option]").forEach(function(element){
    element.textContent=t(element.dataset.i18nOption);
  });
  $("#language-toggle").textContent=lang==="pt"?"EN":"PT-BR";
  localStorage.setItem(LANGUAGE_KEY,lang);
  renderTimeline();
}
function resetForm(keepTimestamp){
  if(!keepTimestamp)$("#timestamp").value="";
  $("#observation").value="";
  $("#next-action").value="";
  $("#category").value="positioning";
}
function openVideo(file){
  if(currentVideoUrl)URL.revokeObjectURL(currentVideoUrl);
  currentVideoUrl=URL.createObjectURL(file);
  const player=$("#vod-player");
  player.src=currentVideoUrl;
  player.hidden=false;
  $("#video-empty").hidden=true;
  $("#current-time").textContent="00:00";
  if(!$("#review-name").value.trim()){
    $("#review-name").value=file.name.replace(/\.[^.]+$/,"").slice(0,80);
  }
  showToast(t("videoOpened"));
}
function jumpTo(seconds){
  const player=$("#vod-player");
  if(!player.src||player.hidden){
    showToast(t("needVideo"));
    return;
  }
  player.currentTime=Math.min(Number(seconds)||0,Number.isFinite(player.duration)?player.duration:Number(seconds)||0);
  player.play().catch(function(){});
  player.focus();
}
function downloadJson(){
  const payload=storagePayload();
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");
  anchor.href=url;
  anchor.download=(reviewName().toLowerCase().replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"")||"ow-vod-review")+".json";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},1000);
  showToast(t("exported"));
}
async function importJson(file){
  try{
    const text=await file.text();
    const parsed=JSON.parse(text);
    if(!parsed||!Array.isArray(parsed.notes))throw new Error("invalid");
    const imported=parsed.notes.filter(validNote).map(normalizeNote);
    if(!imported.length&&parsed.notes.length)throw new Error("invalid_notes");
    notes=imported;
    if(parsed.name)$("#review-name").value=String(parsed.name).slice(0,80);
    saveLocal();
    currentFilter="all";
    renderTimeline();
    showToast(t("imported"));
  }catch(error){
    showToast(t("importError"));
  }
}

$("#video-file").addEventListener("change",function(event){
  const file=event.target.files&&event.target.files[0];
  if(file)openVideo(file);
});
$("#vod-player").addEventListener("timeupdate",function(event){
  $("#current-time").textContent=formatTime(event.target.currentTime);
});
$("#use-current-time").addEventListener("click",function(){
  const player=$("#vod-player");
  if(player.hidden||!player.src){showToast(t("needVideo"));return;}
  $("#timestamp").value=formatTime(player.currentTime);
  $("#observation").focus();
});
$("#clear-form").addEventListener("click",function(){resetForm(false);});
$("#review-name").addEventListener("change",saveLocal);

$("#note-form").addEventListener("submit",function(event){
  event.preventDefault();
  const seconds=parseTime($("#timestamp").value);
  if(seconds===null){showToast(t("invalidTime"));$("#timestamp").focus();return;}
  const observation=$("#observation").value.trim();
  if(!observation){$("#observation").focus();return;}
  const note=normalizeNote({
    id:"note-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),
    seconds:seconds,
    category:$("#category").value,
    observation:observation,
    nextAction:$("#next-action").value.trim(),
    createdAt:new Date().toISOString()
  });
  notes.push(note);
  saveLocal();
  renderTimeline();
  resetForm(false);
  showToast(t("saved"));
});

document.addEventListener("click",function(event){
  const filter=event.target.closest("[data-filter]");
  if(filter){
    currentFilter=filter.dataset.filter;
    renderTimeline();
    return;
  }

  const jump=event.target.closest("[data-jump]");
  if(jump){
    jumpTo(Number(jump.dataset.jump));
    return;
  }

  const del=event.target.closest("[data-delete]");
  if(del){
    notes=notes.filter(function(note){return note.id!==del.dataset.delete;});
    saveLocal();
    renderTimeline();
    showToast(t("deleted"));
  }
});

$("#export-button").addEventListener("click",downloadJson);
$("#import-button").addEventListener("click",function(){ $("#import-file").click(); });
$("#import-file").addEventListener("change",function(event){
  const file=event.target.files&&event.target.files[0];
  if(file)importJson(file);
  event.target.value="";
});
$("#clear-timeline").addEventListener("click",function(){
  notes=[];
  localStorage.removeItem(STORAGE_KEY);
  currentFilter="all";
  renderTimeline();
  showToast(t("cleared"));
});
$("#language-toggle").addEventListener("click",function(){
  lang=lang==="pt"?"en":"pt";
  applyLanguage();
});

window.addEventListener("beforeunload",function(){
  if(currentVideoUrl)URL.revokeObjectURL(currentVideoUrl);
});

loadLocal();
applyLanguage();
renderTimeline();