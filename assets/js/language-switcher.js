(()=>{'use strict';
const ROOT='/DevImpact/', PLAY='https://play.google.com/store/apps/dev?id=8467983811225231952';
const langs=['en','fr','ar','de','it','es','pt'];
const p=location.pathname;
let lang='en';
for(const l of langs.slice(1)) if(p.startsWith(ROOT+l+'/')) lang=l;
const route=p.replace(/^\/DevImpact\//,'').replace(/^(?:en|fr|ar|de|it|es|pt)\//,'').replace(/index\.html$/,'');
const localized=['fr','ar','de'].includes(lang);
const page=(path)=>ROOT+(lang==='en'||!localized?'':lang+'/')+path;
const home=ROOT+(lang==='en'?'':lang+'/');
const T={
en:{home:'Home',apps:'Apps',allApps:'All apps',browse:'Browse by category',games:'Games',social:'Social',career:'Career',sports:'Sports',categories:'Categories',allCategories:'All categories',discover:'Discover',directory:'Games Directory',compare:'App Comparison',blog:'Guides & Blog',about:'About DevImpact',play:'Google Play ↗',menu:'Menu',aria:'Main navigation'},
fr:{home:'Accueil',apps:'Applications',allApps:'Toutes les applications',browse:'Parcourir par catégorie',games:'Jeux',social:'Social',career:'Carrière',sports:'Sports',categories:'Rubriques',allCategories:'Toutes les rubriques',discover:'Découvrir',directory:'Catalogue des jeux',compare:'Comparateur d’applications',blog:'Guides et blog',about:'À propos de DevImpact',play:'Google Play ↗',menu:'Menu',aria:'Navigation principale'},
ar:{home:'الرئيسية',apps:'التطبيقات',allApps:'كل التطبيقات',browse:'تصفح حسب الفئة',games:'الألعاب',social:'التواصل',career:'المهنة',sports:'الرياضة',categories:'الفئات',allCategories:'كل الفئات',discover:'اكتشف',directory:'دليل الألعاب',compare:'مقارنة التطبيقات',blog:'الأدلة والمدونة',about:'عن DevImpact',play:'Google Play ↗',menu:'القائمة',aria:'التنقل الرئيسي'},
de:{home:'Startseite',apps:'Apps',allApps:'Alle Apps',browse:'Nach Kategorie stöbern',games:'Spiele',social:'Soziales',career:'Karriere',sports:'Sport',categories:'Kategorien',allCategories:'Alle Kategorien',discover:'Entdecken',directory:'Spieleverzeichnis',compare:'App-Vergleich',blog:'Ratgeber & Blog',about:'Über DevImpact',play:'Google Play ↗',menu:'Menü',aria:'Hauptnavigation'},
it:{home:'Home',apps:'App',allApps:'Tutte le app',browse:'Sfoglia per categoria',games:'Giochi',social:'Social',career:'Carriera',sports:'Sport',categories:'Categorie',allCategories:'Tutte le categorie',discover:'Scopri',directory:'Catalogo giochi',compare:'Confronto app',blog:'Guide e blog',about:'Chi siamo',play:'Google Play ↗',menu:'Menu',aria:'Navigazione principale'},
es:{home:'Inicio',apps:'Aplicaciones',allApps:'Todas las aplicaciones',browse:'Explorar por categoría',games:'Juegos',social:'Social',career:'Carrera',sports:'Deportes',categories:'Categorías',allCategories:'Todas las categorías',discover:'Descubrir',directory:'Directorio de juegos',compare:'Comparador de aplicaciones',blog:'Guías y blog',about:'Sobre DevImpact',play:'Google Play ↗',menu:'Menú',aria:'Navegación principal'},
pt:{home:'Início',apps:'Aplicativos',allApps:'Todos os aplicativos',browse:'Explorar por categoria',games:'Jogos',social:'Social',career:'Carreira',sports:'Esportes',categories:'Categorias',allCategories:'Todas as categorias',discover:'Descobrir',directory:'Diretório de jogos',compare:'Comparador de aplicativos',blog:'Guias e blog',about:'Sobre a DevImpact',play:'Google Play ↗',menu:'Menu',aria:'Navegação principal'}
}[lang];
const link=(text,path)=>'<a href="'+path+'">'+text+'</a>';
const group=(label,items)=>'<details class="di-unified-menu"><summary>'+label+'<span aria-hidden="true">⌄</span></summary><div class="di-unified-panel">'+items+'</div></details>';
const categories='<b class="di-unified-label">'+T.browse+'</b>'+link(T.games,page('categories/games/'))+link(T.social,page('categories/social/'))+link(T.career,page('categories/career/'))+link(T.sports,page('categories/sports/'));
const desktop=document.createElement('nav');desktop.className='di-unified-nav';desktop.setAttribute('aria-label',T.aria);
desktop.innerHTML=link(T.home,home)+group(T.apps,link(T.allApps,page('apps/'))+categories)+group(T.categories,link(T.allCategories,page('categories/'))+link(T.games,page('categories/games/'))+link(T.social,page('categories/social/'))+link(T.career,page('categories/career/'))+link(T.sports,page('categories/sports/')))+group(T.discover,link(T.directory,page('games/'))+link(T.compare,page('compare/'))+link(T.blog,page('blog/'))+link(T.about,page('about/')))+'<a class="di-unified-cta" href="'+PLAY+'" target="_blank" rel="noopener">'+T.play+'</a>';
const mobile=document.createElement('details');mobile.className='di-unified-mobile';
mobile.innerHTML='<summary><span class="di-unified-bars" aria-hidden="true"><i></i><i></i><i></i></span>'+T.menu+'</summary><nav class="di-unified-mobile-panel" aria-label="'+T.aria+'">'+link(T.home,home)+link(T.allApps,page('apps/'))+link(T.allCategories,page('categories/'))+'<div class="di-unified-mobile-group"><b>'+T.apps+' · '+T.browse+'</b>'+link(T.games,page('categories/games/'))+link(T.social,page('categories/social/'))+link(T.career,page('categories/career/'))+link(T.sports,page('categories/sports/'))+'</div>'+link(T.directory,page('games/'))+link(T.compare,page('compare/'))+link(T.blog,page('blog/'))+link(T.about,page('about/'))+'<a href="'+PLAY+'" target="_blank" rel="noopener">'+T.play+'</a></nav>';
const header=document.querySelector('header.di-site-header');
if(header){
 header.setAttribute('dir',lang==='ar'?'rtl':'ltr');
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
const routeFor=l=>{if(l==='en')return ROOT+route;if(['fr','ar','de'].includes(l))return ROOT+l+'/'+route;return ROOT+l+'/'};
const labels={en:'English',fr:'Français',ar:'العربية',de:'Deutsch',it:'Italiano',es:'Español',pt:'Português'};
const picker=document.createElement('nav');picker.className='di-lang-switch';picker.setAttribute('aria-label','Language selection');
picker.innerHTML=langs.map(l=>'<a href="'+routeFor(l)+'" lang="'+l+'"'+(l==='ar'?' dir="rtl"':'')+'>'+labels[l]+'</a>').join('');
const css=document.createElement('style');css.textContent='.di-lang-switch{position:fixed;z-index:9999;top:12px;right:12px;display:flex;flex-wrap:wrap;gap:4px;max-width:min(94vw,560px);padding:5px;border:1px solid #303844;border-radius:12px;background:#0b0e12f2;box-shadow:0 8px 24px #0008;font:12px/1.2 system-ui}.di-lang-switch a{padding:7px 9px;border-radius:8px;color:#edf1f7;text-decoration:none}.di-lang-switch a:hover,.di-lang-switch a:focus-visible{background:#202a35;outline:2px solid #68e2d2}.di-lang-switch a[lang="'+current+'"]{background:#193d3a;color:#9ff4e5;font-weight:800}@media(max-width:600px){.di-lang-switch{top:7px;right:7px;max-width:96vw}.di-lang-switch a{padding:6px 7px;font-size:11px}}';
document.head.appendChild(css);document.body.appendChild(picker);
})();