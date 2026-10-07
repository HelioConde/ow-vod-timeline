const toggle=document.querySelector("[data-language-toggle]");
let lang=localStorage.getItem("ow-vod-timeline:language")==="en"?"en":"pt";
function apply(){
  document.documentElement.lang=lang==="pt"?"pt-BR":"en";
  document.querySelectorAll("[data-lang]").forEach(function(section){section.hidden=section.dataset.lang!==lang;});
  if(toggle)toggle.textContent=lang==="pt"?"EN":"PT-BR";
  localStorage.setItem("ow-vod-timeline:language",lang);
}
if(toggle)toggle.addEventListener("click",function(){lang=lang==="pt"?"en":"pt";apply();});
apply();