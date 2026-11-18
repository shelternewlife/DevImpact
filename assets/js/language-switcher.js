(()=>{'use strict';
const ROOT='/DevImpact/', PLAY='https://play.google.com/store/apps/dev?id=8467983811225231952';
const langs=['en','fr','ar','de','it','es','pt'];
const p=location.pathname;
let lang='en';
for(const l of langs.slice(1)) if(p.startsWith(ROOT+l+'/')) lang=l;
const route=p.replace(/^\/DevImpact\//,'').replace(/^(?:en|fr|ar|de|it|es|pt)\//,'').replace(/index\.html$/,'');
const localized=lang!=='en';
const page=(path)=>ROOT+(lang==='en'||!localized?'':lang+'/')+path;
const home=ROOT+(lang==='en'?'':lang+'/');
const T={home:'Home',apps:'Apps',allApps:'All apps',browse:'Browse by category',games:'Games',social:'Social',career:'Career',sports:'Sports',categories:'Categories',allCategories:'All categories',discover:'Discover',directory:'Games Directory',compare:'App Comparison',blog:'Guides & Blog',about:'About DevImpact',play:'Google Play ↗',menu:'Menu',aria:'Main navigation'};

const link=(text,path)=>'<a href="'+path+'">'+text+'</a>';
const group=(label,items)=>'<details class="di-unified-menu"><summary>'+label+'<span aria-hidden="true">⌄</span></summary><div class="di-unified-panel">'+items+'</div></details>';
const categories='<b class="di-unified-label">'+T.browse+'</b>'+link(T.games,page('categories/games/'))+link(T.social,page('categories/social/'))+link(T.career,page('categories/career/'))+link(T.sports,page('categories/sports/'));
const desktop=document.createElement('nav');desktop.className='di-unified-nav';desktop.setAttribute('aria-label',T.aria);
desktop.innerHTML=link(T.home,home)+group(T.apps,link(T.allApps,page('apps/'))+categories)+group(T.categories,link(T.allCategories,page('categories/'))+link(T.games,page('categories/games/'))+link(T.social,page('categories/social/'))+link(T.career,page('categories/career/'))+link(T.sports,page('categories/sports/')))+group(T.discover,link(T.directory,page('games/'))+link(T.compare,page('compare/'))+link(T.blog,page('blog/'))+link(T.about,page('about/')))+'<a class="di-unified-cta" href="'+PLAY+'" target="_blank" rel="noopener">'+T.play+'</a>';
const mobile=document.createElement('details');mobile.className='di-unified-mobile';
mobile.innerHTML='<summary><span class="di-unified-bars" aria-hidden="true"><i></i><i></i><i></i></span>'+T.menu+'</summary><nav class="di-unified-mobile-panel" aria-label="'+T.aria+'">'+link(T.home,home)+link(T.allApps,page('apps/'))+link(T.allCategories,page('categories/'))+'<div class="di-unified-mobile-group"><b>'+T.apps+' · '+T.browse+'</b>'+link(T.games,page('categories/games/'))+link(T.social,page('categories/social/'))+link(T.career,page('categories/career/'))+link(T.sports,page('categories/sports/'))+'</div>'+link(T.directory,page('games/'))+link(T.compare,page('compare/'))+link(T.blog,page('blog/'))+link(T.about,page('about/'))+'<a href="'+PLAY+'" target="_blank" rel="noopener">'+T.play+'</a></nav>';
const header=document.querySelector('header.di-site-header');
if(header){
 header.setAttribute('dir','ltr');
 const brand=header.querySelector('.di-site-brand');
 if(brand) brand.href=home;
 header.querySelectorAll('.di-unified-nav,.di-unified-mobile').forEach(n=>n.remove());
 header.append(desktop,mobile);
}
if(!document.getElementById('di-nav-unified-style')){
 const style=document.createElement('style');style.id='di-nav-unified-style';
 style.textContent='.di-site-header{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;gap:16px!important;min-width:0}.di-site-brand{flex:none!important}.di-unified-nav{display:flex!important;align-items:center!important;justify-content:flex-end!important;flex-wrap:nowrap!important;gap:clamp(7px,.9vw,14px)!important;margin-inline-start:auto!important;min-width:0!important;font-size:clamp(11px,.9vw,13px)!important}.di-unified-nav>a,.di-unified-menu>summary{white-space:nowrap!important}.di-unified-mobile{display:none!important;position:relative!important;margin-inline-start:auto!important}.di-unified-mobile>summary{display:flex;align-items:center;gap:9px;padding:10px 13px;border:1px solid var(--di-line,#35435c);border-radius:11px;background:#ffffff09;color:var(--di-text,#f4f7ff);font-size:13px;font-weight:750;cursor:pointer;list-style:none}.di-unified-mobile>summary::-webkit-details-marker{display:none}.di-unified-bars{display:grid;gap:4px;width:17px}.di-unified-bars i{display:block;height:2px;border-radius:2px;background:#9fc1ff}.di-unified-mobile-panel{position:absolute;z-index:230;top:calc(100% + 9px);inset-inline-end:0;display:grid;gap:4px;width:min(88vw,360px);max-height:75vh;overflow:auto;padding:10px;border:1px solid var(--di-line,#35435c);border-radius:16px;background:#101a2d;box-shadow:0 22px 55px #000b}.di-unified-mobile-panel>a{display:block;padding:10px 12px;border-radius:9px;color:#eaf1ff;text-decoration:none}.di-unified-mobile-group{display:grid;gap:2px;padding:7px 4px;border-block:1px solid #ffffff16}.di-unified-mobile-group>b{padding:5px 8px;color:#68e2d2;font-size:11px}.di-unified-mobile-group>a{display:block;padding:10px 12px;border-radius:9px;color:#eaf1ff;text-decoration:none}@media(max-width:1100px){.di-unified-nav{display:none!important}.di-unified-mobile{display:block!important}}@media(max-width:700px){.di-site-header{width:calc(100% - 28px)!important;min-height:68px!important;gap:10px!important}.di-unified-mobile-panel{width:min(88vw,360px)}}';
 document.head.appendChild(style);
}
const current=lang;
const routeFor=l=>{if(l==='en')return ROOT+route;if(l!=='en')return ROOT+l+'/'+route;return ROOT};
const labels={en:'English',fr:'Français',ar:'العربية',de:'Deutsch',it:'Italiano',es:'Español',pt:'Português'};
const short={en:'EN',fr:'FR',ar:'AR',de:'DE',it:'IT',es:'ES',pt:'PT'};
const picker=document.createElement('details');
picker.className='di-lang-switch';
picker.setAttribute('dir',lang==='ar'?'rtl':'ltr');
picker.innerHTML='<summary aria-label="Choose language"><span class="di-lang-current">'+short[current]+' · '+labels[current]+'</span><span class="di-lang-chevron" aria-hidden="true">⌄</span></summary><div class="di-lang-panel" role="group" aria-label="Available languages">'+langs.map(l=>'<a href="'+routeFor(l)+'" lang="'+l+'"'+(l==='ar'?' dir="rtl"':'')+(l===current?' aria-current="page"':'')+'><span>'+labels[l]+'</span><small>'+short[l]+'</small></a>').join('')+'</div>';
if(header) header.appendChild(picker);
document.querySelectorAll('a[href]').forEach(a=>{
 if(a.closest('.di-lang-panel'))return;
 try{
  const u=new URL(a.getAttribute('href'),location.href);
  if(u.origin!==location.origin||!u.pathname.startsWith(ROOT)||u.pathname.startsWith(ROOT+'assets/'))return;
  let tail=u.pathname.slice(ROOT.length).replace(/^(?:en|fr|ar|de|it|es|pt)\//,'');
  a.href=ROOT+(lang==='en'?'':lang+'/')+tail+u.search+u.hash;
 }catch(_){}
});
if(!document.getElementById('di-lang-inline-style')){
 const css=document.createElement('style');css.id='di-lang-inline-style';
 css.textContent='.di-site-header{position:relative!important;flex-wrap:nowrap!important;min-width:0!important}.di-unified-nav{flex:0 1 auto!important}.di-lang-switch{position:relative!important;z-index:240!important;display:block!important;flex:0 0 auto!important;margin:0!important;font:12px/1.2 system-ui!important}.di-lang-switch>summary{display:flex!important;align-items:center!important;gap:8px!important;max-width:155px!important;padding:9px 11px!important;border:1px solid var(--di-line,#35435c)!important;border-radius:11px!important;background:#101a2d!important;color:var(--di-text,#f4f7ff)!important;font-weight:750!important;cursor:pointer!important;list-style:none!important;white-space:nowrap!important}.di-lang-switch>summary::-webkit-details-marker{display:none!important}.di-lang-chevron{color:#68e2d2!important;font-size:15px!important}.di-lang-panel{position:absolute!important;z-index:500!important;top:calc(100% + 8px)!important;inset-inline-end:0!important;display:none!important;width:190px!important;max-height:min(65vh,390px)!important;overflow:auto!important;padding:7px!important;border:1px solid var(--di-line,#35435c)!important;border-radius:13px!important;background:#101a2d!important;box-shadow:0 18px 45px #000b!important}.di-lang-switch[open] .di-lang-panel{display:grid!important;gap:3px!important}.di-lang-panel a{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:9px 10px!important;border-radius:8px!important;color:#edf3ff!important;text-decoration:none!important}.di-lang-panel a:hover,.di-lang-panel a:focus-visible{background:#ffffff12!important;outline:2px solid #68e2d2!important;outline-offset:-2px!important}.di-lang-panel a[aria-current=page]{background:#193d3a!important;color:#9ff4e5!important;font-weight:800!important}.di-lang-panel small{color:#9eacc2!important;font-size:10px!important}.di-unified-mobile{flex:0 0 auto!important}@media(max-width:1100px){.di-site-header{gap:10px!important}.di-lang-switch>summary{padding:9px 10px!important}}@media(max-width:700px){.di-site-header{flex-wrap:wrap!important;row-gap:10px!important}.di-site-brand{flex:1 1 auto!important;min-width:0!important}.di-unified-mobile{margin-inline-start:0!important}.di-lang-switch{margin-inline-start:0!important}.di-lang-switch>summary{max-width:130px!important;padding:9px 10px!important}.di-lang-panel{width:175px!important}}@media(max-width:390px){.di-site-header{gap:8px!important}.di-lang-switch>summary{max-width:112px!important;font-size:11px!important}.di-unified-mobile>summary{padding:9px 10px!important}}';
 document.head.appendChild(css);
}
})();