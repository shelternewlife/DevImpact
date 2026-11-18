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
const T=lang==='ar'?{home:'الرئيسية',apps:'التطبيقات',allApps:'جميع التطبيقات',browse:'تصفّح حسب الفئة',games:'الألعاب',social:'التواصل الاجتماعي',career:'المسار المهني',sports:'الرياضة',categories:'التصنيفات',allCategories:'جميع التصنيفات',discover:'اكتشف',directory:'دليل الألعاب',compare:'مقارنة التطبيقات',blog:'الأدلة والمقالات',about:'حول DevImpact',play:'Google Play ↗',menu:'القائمة',aria:'التنقل الرئيسي'}:{home:'Home',apps:'Apps',allApps:'All apps',browse:'Browse by category',games:'Games',social:'Social',career:'Career',sports:'Sports',categories:'Categories',allCategories:'All categories',discover:'Discover',directory:'Games Directory',compare:'App Comparison',blog:'Guides & Blog',about:'About DevImpact',play:'Google Play ↗',menu:'Menu',aria:'Main navigation'};

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
const footerLinks=[
 ['About DevImpact',page('about/')],
 ['Contact',page('contact/')],
 ['Privacy Policy',page('privacy/')],
 ['Terms of Use',page('terms/')],
 ['Google Play',PLAY,'_blank'],
 ['GitHub','https://github.com/shelternewlife/DevImpact','_blank']
];
let footer=document.querySelector('footer');
if(!footer){footer=document.createElement('footer');document.body.appendChild(footer);}
footer.className='footer';
footer.innerHTML='<div class="wrap footer-inner"><span>© <span id="year">'+new Date().getFullYear()+'</span> DevImpact. <span>All rights reserved.</span></span><span>'+footerLinks.map(([label,href,target])=>'<a href="'+href+'"'+(target?' target="'+target+'" rel="noopener"':'')+'>'+label+'</a>').join(' · ')+'</span></div>';
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

if(lang==='ar'){
 document.documentElement.lang='ar';
 document.documentElement.dir='rtl';
 document.body.dir='rtl';
 const arFooter=document.querySelector('footer');
 if(arFooter) arFooter.innerHTML='<div class="wrap footer-inner"><span>© <span id="year">'+new Date().getFullYear()+'</span> DevImpact. <span>جميع الحقوق محفوظة.</span></span><span><a href="'+page('about/')+'">حول DevImpact</a> · <a href="'+page('contact/')+'">اتصل بنا</a> · <a href="'+page('privacy/')+'">سياسة الخصوصية</a> · <a href="'+page('terms/')+'">شروط الاستخدام</a> · <a href="'+PLAY+'" target="_blank" rel="noopener">Google Play</a> · <a href="https://github.com/shelternewlife/DevImpact" target="_blank" rel="noopener">GitHub</a></span></div>';
 const langSummary=picker.querySelector('summary'); if(langSummary)langSummary.setAttribute('aria-label','اختر اللغة');
 const rtl=document.createElement('style');rtl.id='di-arabic-rtl-style';
 rtl.textContent='html[dir=rtl]{direction:rtl}html[dir=rtl] body{direction:rtl;text-align:right;font-family:"Noto Sans Arabic","Noto Naskh Arabic",Tahoma,Arial,sans-serif;line-height:1.9}html[dir=rtl] .di-site-header{direction:rtl!important;flex-direction:row!important}html[dir=rtl] .di-site-brand{direction:ltr;text-align:left}html[dir=rtl] .di-unified-nav,html[dir=rtl] .di-unified-mobile-panel,html[dir=rtl] .di-unified-panel{direction:rtl;text-align:right}html[dir=rtl] .di-unified-nav{justify-content:flex-start!important}html[dir=rtl] .di-unified-mobile-panel{inset-inline-start:0;inset-inline-end:auto}html[dir=rtl] .hero,html[dir=rtl] .top,html[dir=rtl] .section-head,html[dir=rtl] .app-top,html[dir=rtl] .app-foot,html[dir=rtl] .footer-inner,html[dir=rtl] .actions,html[dir=rtl] .feature-grid,html[dir=rtl] .gallery,html[dir=rtl] .related{direction:rtl}html[dir=rtl] .feature:before{margin-right:0;margin-left:10px}html[dir=rtl] input,html[dir=rtl] textarea,html[dir=rtl] select{direction:rtl;text-align:right}html[dir=rtl] .di-lang-panel{right:auto;left:0;text-align:right}html[dir=rtl] .di-lang-switch>summary{direction:rtl}html[dir=rtl] .footer-inner>span:last-child{direction:rtl}html[dir=rtl] img,html[dir=rtl] svg{direction:ltr}';
 document.head.appendChild(rtl);
 const AR={
 'DevImpact APPS · GAMES · DIGITAL':'DevImpact · تطبيقات · ألعاب · تجارب رقمية',
 'A mobile app & game studio':'استوديو لتطبيقات الهاتف والألعاب',
 'Ideas made':'أفكار تتحول',
 'Ideas into impact.':'إلى أثر ملموس.',
 'Discover the apps and games published by DevImpact — from quick arcade challenges and thoughtful puzzles to social discovery, career tools and football analytics.':'اكتشف التطبيقات والألعاب التي تنشرها DevImpact، من تحديات الأركيد السريعة والألغاز إلى التواصل الاجتماعي وأدوات المسار المهني وتحليلات كرة القدم.',
 'Explore the apps ↓':'استكشف التطبيقات ↓','View Google Play profile ↗':'عرض ملف المطوّر على Google Play ↗',
 '10 Published apps':'10 تطبيقات منشورة','4 App categories':'4 فئات للتطبيقات','6 Games & puzzles':'6 ألعاب وألغاز','4 Other app categories':'4 تطبيقات في فئات أخرى',
 'Who we are':'من نحن','Building useful and entertaining mobile experiences.':'نصنع تجارب هاتفية مفيدة وممتعة.',
 'The collection':'المجموعة','Find your next app.':'اعثر على تطبيقك التالي.','Browse the current DevImpact catalogue.':'تصفّح مجموعة DevImpact الحالية.','Each listing links directly to its official Google Play page.':'يرتبط كل تطبيق مباشرة بصفحته الرسمية على Google Play.',
 'All apps':'جميع التطبيقات','Games':'الألعاب','Communication':'التواصل','Productivity & career':'الإنتاجية والمسار المهني','Sports':'الرياضة','All types':'جميع الأنواع','Apps':'التطبيقات','Showing 10 apps':'عرض 10 تطبيقات',
 'Screenshots gallery':'معرض لقطات الشاشة','Explore the apps visually.':'تعرّف على التطبيقات من خلال الصور.','Real screenshots from the DevImpact app pages.':'لقطات حقيقية من صفحات تطبيقات DevImpact.',
 'DevImpact Journal':'مجلة DevImpact','Guides, ideas & app insights.':'أدلة وأفكار ورؤى حول التطبيقات.','Practical reading about mobile games, Android apps and digital experiences.':'مقالات عملية حول ألعاب الهاتف وتطبيقات Android والتجارب الرقمية.','Visit the blog ↗':'زيارة المدوّنة ↗',
 'How to choose a puzzle game':'كيف تختار لعبة الألغاز المناسبة؟','Compare matching, sorting and block-puzzle mechanics by pace and challenge.':'قارن بين آليات المطابقة والفرز وألغاز الكتل من حيث السرعة والتحدي.',
 'Better mobile gaming habits':'عادات أفضل للعب على الهاتف','Simple ways to make short gaming sessions comfortable and balanced.':'طرق بسيطة لجعل جلسات اللعب القصيرة أكثر راحة وتوازناً.',
 'Before installing an Android app':'قبل تثبيت تطبيق Android','Check publisher details, permissions, compatibility and updates.':'تحقّق من بيانات الناشر والأذونات والتوافق والتحديثات.',
 'What we build':'ما الذي نقدّمه','Four areas. One developer.':'أربعة مجالات، ومطوّر واحد.','The catalogue spans four practical areas. Counts below reflect the ten apps currently listed in the developer catalogue.':'تغطي المجموعة أربعة مجالات عملية، وتعكس الأعداد أدناه التطبيقات العشرة المدرجة حالياً.',
 'Games & entertainment':'الألعاب والترفيه','Casual arcade and puzzle experiences, from matching and sorting to action-based play.':'تجارب أركيد وألغاز خفيفة، من المطابقة والفرز إلى أساليب اللعب الحركية.',
 'Tools to explore job listings, roles and career opportunities.':'أدوات لاستكشاف إعلانات الوظائف والأدوار والفرص المهنية.',
 'A social discovery app for meeting people, building friendships and connecting.':'تطبيق للتعارف الاجتماعي يتيح لقاء أشخاص جدد وبناء الصداقات والتواصل.',
 'Football match information and data-led prediction insights.':'معلومات مباريات كرة القدم ورؤى التوقعات المستندة إلى البيانات.',
 'Discover DevImpact':'اكتشف DevImpact','Find the app that fits your next moment.':'اعثر على التطبيق المناسب لوقتك واحتياجك.',
 'Browse the full catalogue or visit our Google Play developer profile.':'تصفّح المجموعة كاملة أو زر ملف المطوّر على Google Play.',
 'Explore on Google Play ↗':'استكشف على Google Play ↗','One home for the whole collection.':'وجهة واحدة لجميع التطبيقات.',
 'Made for different moments':'مصممة لأوقات واحتياجات مختلفة',
 'Get the official version':'احصل على النسخة الرسمية',
 'Use the Google Play links on each app card to view the latest listing, screenshots, compatibility details and publisher-provided information.':'استخدم روابط Google Play في بطاقات التطبيقات للاطلاع على أحدث الأوصاف ولقطات الشاشة وتفاصيل التوافق والمعلومات المقدّمة من الناشر.',
 'Our studio · Our purpose':'استوديوُنا · هدفُنا','About DevImpact':'حول DevImpact',
 'Our vision':'رؤيتنا','Our philosophy':'فلسفتنا','Our catalogue':'مجموعتنا',
 'Make useful and entertaining mobile experiences easier to discover, understand and access.':'تسهيل اكتشاف التجارب المفيدة والممتعة على الهاتف وفهمها والوصول إليها.',
 'Focus each product on a clear purpose, communicate its capabilities transparently, and direct users to official product information.':'منح كل منتج هدفاً واضحاً، وشرح إمكاناته بشفافية، وتوجيه المستخدمين إلى مصادر المعلومات الرسمية.',
 'Explore all apps':'استكشف جميع التطبيقات','Find DevImpact on Google Play':'اعثر على DevImpact على Google Play','Visit developer profile ↗':'زيارة ملف المطوّر ↗',
 'Explore the DevImpact portfolio':'استكشف مجموعة DevImpact','For questions, feedback or business enquiries, visit the Contact page .':'للاستفسارات أو الملاحظات أو طلبات الأعمال، تفضّل بزيارة صفحة اتصل بنا.',
 'Get in touch':'تواصل معنا','Contact DevImpact':'اتصل بـ DevImpact','Email':'البريد الإلكتروني','App support':'الدعم الفني للتطبيقات','Business & partnerships':'الأعمال والشراكات','Official product information':'معلومات المنتجات الرسمية',
 'For questions about our apps, feedback, business enquiries or partnership proposals, contact DevImpact by email.':'للاستفسارات حول تطبيقاتنا أو إرسال الملاحظات أو طلبات الأعمال أو مقترحات الشراكة، تواصل مع DevImpact عبر البريد الإلكتروني.',
 'For general enquiries, use the email below. Include the app name and relevant details so your message can be directed appropriately.':'للاستفسارات العامة، استخدم البريد أدناه. اذكر اسم التطبيق والتفاصيل ذات الصلة حتى نوجّه رسالتك إلى الجهة المناسبة.',
 'When contacting us about an app, mention its exact name, your device model and Android version, and a clear description of the issue. Do not include passwords or sensitive payment information.':'عند التواصل معنا بشأن تطبيق، اذكر اسمه بدقة وطراز جهازك وإصدار Android واشرح المشكلة بوضوح. لا ترسل كلمات المرور أو معلومات الدفع الحساسة.',
 'For collaboration proposals, describe your organisation, the purpose of the enquiry and the best way to follow up.':'لمقترحات التعاون، اذكر اسم مؤسستك وهدف الاستفسار والطريقة الأنسب لمتابعة التواصل.',
 'For current app descriptions, screenshots, availability and developer information, visit the official DevImpact Google Play profile.':'للاطلاع على أوصاف التطبيقات الحالية ولقطات الشاشة والتوفّر ومعلومات المطوّر، زر ملف DevImpact الرسمي على Google Play.',
 'Privacy Policy':'سياسة الخصوصية','Privacy · Transparency':'الخصوصية · الشفافية','Terms of Use':'شروط الاستخدام','Legal · Website terms':'الشؤون القانونية · شروط الموقع',
 'This page explains the privacy scope of the DevImpact website and how to find the applicable privacy information for an individual app.':'توضح هذه الصفحة نطاق الخصوصية الخاص بموقع DevImpact وكيفية الوصول إلى معلومات الخصوصية الخاصة بكل تطبيق.',
 '1. Scope':'1. النطاق','2. Website interactions and external services':'2. التفاعل مع الموقع والخدمات الخارجية','3. App-specific privacy information':'3. معلومات الخصوصية الخاصة بالتطبيقات','4. Age-related information':'4. المعلومات المتعلقة بالعمر','5. Changes and contact':'5. التعديلات والتواصل',
 'This notice applies to the public DevImpact website hosted on GitHub Pages. It does not replace or override privacy policies, disclosures or Data safety information that may apply to an individual Android app.':'ينطبق هذا الإشعار على موقع DevImpact العام المستضاف عبر GitHub Pages، ولا يحل محل سياسات الخصوصية أو إفصاحات أمان البيانات الخاصة بأي تطبيق Android.',
 'This website is a static portfolio and information site. It provides links to Google Play, GitHub and email. When you follow an external link or contact a third party, that service may process information under its own privacy terms. GitHub Pages hosting and delivery may involve technical request information handled by GitHub under its own terms. The website does not provide account registration, user profiles, payment forms or an on-site messaging service.':'هذا الموقع معرض تعريفي ثابت ومصدر للمعلومات، ويوفر روابط إلى Google Play وGitHub والبريد الإلكتروني. عند اتباع رابط خارجي أو التواصل مع جهة أخرى، قد تعالج تلك الخدمة معلوماتك وفق سياسة الخصوصية الخاصة بها. وقد تتضمن استضافة الموقع عبر GitHub Pages معالجة بيانات تقنية للطلبات وفق شروط GitHub. لا يوفر الموقع تسجيل حسابات أو ملفات شخصية أو نماذج دفع أو خدمة مراسلة داخلية.',
 '3. App-specific privacy information':'3. معلومات الخصوصية الخاصة بالتطبيقات',
 'Before installing or using an app, review its Data safety section and the developer-provided Privacy Policy link on its official Google Play listing, where available.':'قبل تثبيت أي تطبيق أو استخدامه، راجع قسم أمان البيانات ورابط سياسة الخصوصية الذي يقدمه المطوّر في صفحته الرسمية على Google Play، إن توفر.',
 'Last updated: 17 November 2026':'آخر تحديث: 17 نوفمبر 2026',
 '1. Website use':'1. استخدام الموقع','2. Product information':'2. معلومات المنتجات','3. External services':'3. الخدمات الخارجية','4. Intellectual property':'4. الملكية الفكرية','5. Availability and disclaimer':'5. التوفّر وإخلاء المسؤولية','6. Changes and contact':'6. التعديلات والتواصل',
 'These terms apply to your use of the DevImpact public website. Individual apps may have additional terms or notices where applicable.':'تنطبق هذه الشروط على استخدامك لموقع DevImpact العام، وقد تكون لبعض التطبيقات شروط أو إشعارات إضافية عند الاقتضاء.',
 'You may use this website to learn about DevImpact and browse links to its published apps. You agree not to misuse the site, interfere with its operation, attempt unauthorised access or use its content for unlawful purposes.':'يمكنك استخدام الموقع للتعرّف إلى DevImpact وتصفّح روابط تطبيقاتها المنشورة. وتتعهد بعدم إساءة استخدام الموقع أو تعطيل تشغيله أو محاولة الوصول غير المصرح به أو استخدام محتواه لأغراض غير قانونية.',
 'App descriptions on this website are general information and may not reflect the latest release, availability, compatibility or regional terms. The official Google Play listing for each app is the reference for current publisher-provided product details.':'أوصاف التطبيقات على الموقع معلومات عامة، وقد لا تعكس أحدث إصدار أو التوفّر أو التوافق أو الشروط الإقليمية. وتعد صفحة كل تطبيق الرسمية على Google Play المرجع لأحدث تفاصيل المنتج التي يقدمها الناشر.',
 'Contact DevImpact | DevImpact':'اتصل بـ DevImpact | DevImpact','Privacy Policy | DevImpact':'سياسة الخصوصية | DevImpact','Terms of Use | DevImpact':'شروط الاستخدام | DevImpact',
 'DEVIMPACT COLLECTION':'مجموعة DevImpact','DEVIMPACT CATEGORY':'تصنيف DevImpact','BROWSE BY INTEREST':'تصفّح حسب الاهتمام',
 'App categories':'تصنيفات التطبيقات','Find apps and games by the kind of experience you are looking for.':'اعثر على التطبيقات والألعاب وفق نوع التجربة التي تبحث عنها.',
 'Career':'المسار المهني','Job search and career discovery tools.':'أدوات البحث عن عمل واستكشاف المسارات المهنية.',
 'Games':'الألعاب','Arcade and puzzle games.':'ألعاب الأركيد والألغاز.',
 'Social':'التواصل الاجتماعي','Social discovery, friendship and professional connections.':'التعارف الاجتماعي والصداقات والعلاقات المهنية.',
 'Sports':'الرياضة','Football forecasts, statistics and analytical context.':'توقعات كرة القدم والإحصاءات والسياق التحليلي.',
 'Explore career apps':'استكشف تطبيقات المسار المهني','Explore games apps':'استكشف تطبيقات الألعاب','Explore social apps':'استكشف تطبيقات التواصل الاجتماعي','Explore sports apps':'استكشف تطبيقات الرياضة',
 'Compare descriptions and screenshots, then review the official Google Play listing before installing.':'قارن الأوصاف ولقطات الشاشة، ثم راجع صفحة Google Play الرسمية قبل التثبيت.',
 'Read practical app guides .':'اقرأ أدلة عملية حول التطبيقات.',
 'Explore match-3, bubble shooter, block puzzle, liquid sorting and fruit-slicing games.':'استكشف ألعاب المطابقة الثلاثية وإطلاق الفقاعات وألغاز الكتل وفرز السوائل وتقطيع الفواكه.',
 'Explore social discovery for meeting people, building friendships, chatting and professional connections.':'استكشف تطبيقات التعارف الاجتماعي للتعرّف إلى أشخاص جدد وبناء الصداقات والدردشة والعلاقات المهنية.',
 'Explore win-draw-loss probabilities, expected goals, ELO ratings and football data context.':'استكشف احتمالات الفوز والتعادل والخسارة والأهداف المتوقعة وتصنيفات ELO وسياق بيانات كرة القدم.',
 'App categories':'تصنيفات التطبيقات','Explore 6 games ↗':'استكشف 6 ألعاب ↗','Explore app ↗':'استكشف التطبيق ↗',
 'DevImpact Blog | Mobile App & Game Guides':'مدوّنة DevImpact | أدلة تطبيقات الهاتف والألعاب','Guides, ideas & app insights':'أدلة وأفكار ورؤى حول التطبيقات',
 'Practical, informational articles to help readers explore mobile games and Android apps.':'مقالات عملية ومعلوماتية تساعد القراء على استكشاف ألعاب الهاتف وتطبيقات Android.',
 'How to choose a puzzle game that fits your play style':'كيف تختار لعبة ألغاز تناسب أسلوب لعبك؟',
 'Match-3 games reward pattern recognition and planning around limited moves. Liquid-sorting puzzles focus on sequencing and keeping colors organized. Block puzzles ask you to position shapes and clear complete rows. Consider whether you prefer quick decisions or a slower pace, then review screenshots and the official store listing before installing.':'تكافئ ألعاب المطابقة الثلاثية ملاحظة الأنماط والتخطيط ضمن عدد محدود من الحركات. وتركّز ألغاز فرز السوائل على ترتيب الخطوات وتنظيم الألوان، بينما تتطلب ألغاز الكتل وضع الأشكال وإكمال الصفوف. فكّر فيما إذا كنت تفضّل القرارات السريعة أم الإيقاع الهادئ، ثم راجع لقطات الشاشة وصفحة المتجر الرسمية قبل التثبيت.',
 'Small habits for a better mobile gaming session':'عادات بسيطة لتحسين جلسة اللعب على الهاتف',
 'Choose a natural stopping point before you begin, adjust screen brightness to your surroundings and take breaks during longer sessions. A quick arcade challenge may suit a short break, while a sorting or matching puzzle may be better when you want a slower pace. Keep entertainment balanced with other daily activities.':'حدّد نقطة مناسبة للتوقف قبل البدء، واضبط سطوع الشاشة وفق الإضاءة المحيطة، وخذ فترات استراحة خلال الجلسات الطويلة. قد يناسبك تحدي أركيد سريع أثناء استراحة قصيرة، بينما يكون لغز الفرز أو المطابقة أنسب عندما ترغب في إيقاع أهدأ. وازن الترفيه مع أنشطتك اليومية الأخرى.',
 'What to check before installing an Android app':'ما الذي ينبغي التحقق منه قبل تثبيت تطبيق Android؟',
 'Review the developer name, app description, screenshots and update information. Read requested permissions and privacy information, check device compatibility and Android requirements, and use the official Google Play listing rather than unfamiliar third-party download pages.':'راجع اسم المطوّر ووصف التطبيق ولقطات الشاشة ومعلومات التحديث. اقرأ الأذونات المطلوبة ومعلومات الخصوصية، وتحقّق من توافق التطبيق مع جهازك ومتطلبات Android، واستخدم صفحة Google Play الرسمية بدلاً من مواقع التنزيل غير المعروفة.',
 'Topic-specific guides':'أدلة متخصصة حسب الموضوع','Match-3 Puzzle Strategy: How to Use Limited Moves Wisely':'استراتيجيات ألغاز المطابقة الثلاثية: كيف تستفيد من الحركات المحدودة؟',
 'Bubble Shooter Tips: Aiming, Bank Shots and Clearing Groups':'نصائح إطلاق الفقاعات: التصويب والارتداد وإزالة المجموعات',
 'Block Puzzle Tips: Clear Rows and Keep the Board Open':'نصائح ألغاز الكتل: أكمل الصفوف وحافظ على مساحة اللوحة',
 'Liquid Sort Puzzle: Rules, Planning and Avoiding Dead Ends':'ألغاز فرز السوائل: القواعد والتخطيط وتجنّب الطرق المسدودة',
 'Puzzle Game Types Explained: Match-3 vs Block Puzzles vs Bubble Shooters vs Liquid Sort':'شرح أنواع ألعاب الألغاز: المطابقة الثلاثية أم الكتل أم إطلاق الفقاعات أم فرز السوائل؟',
 'Match-3 puzzle tips for reading objectives, creating cascades, prioritizing blockers and planning limited moves.':'نصائح لألغاز المطابقة الثلاثية لفهم الأهداف وإنشاء التتابعات وإعطاء الأولوية للعوائق والتخطيط للحركات المحدودة.',
 'Improve bubble shooter decisions with color matching, aiming lanes, wall rebounds and planning the next shot.':'حسّن قراراتك في ألعاب إطلاق الفقاعات عبر مطابقة الألوان واختيار مسارات التصويب والاستفادة من ارتداد الجدران والتخطيط للطلقة التالية.',
 'Practical block puzzle tips for placing shapes, clearing rows and columns, and preserving space for future pieces.':'نصائح عملية لوضع الأشكال وإكمال الصفوف والأعمدة والحفاظ على مساحة للقطع القادمة.',
 'Understand liquid sort puzzle rules and plan pours by matching top colors, checking tube capacity and preserving empty space.':'افهم قواعد ألغاز فرز السوائل وخطّط للسكب عبر مطابقة الألوان العلوية والتحقق من سعة الأنابيب والحفاظ على مساحة فارغة.',
 'Compare four puzzle mechanics, understand how each works, and choose a mobile game that matches your preferred style of thinking.':'قارن بين أربع آليات للألغاز، وافهم طريقة عمل كل منها، واختر لعبة هاتف تتوافق مع أسلوب التفكير الذي تفضّله.',
 'Related app':'التطبيق المرتبط','Back to blog':'العودة إلى المدوّنة',
 '1. Inspect all pieces':'1. افحص جميع القطع','2. Keep open areas':'2. حافظ على المساحات المفتوحة','3. Clear lines with purpose':'3. أكمل الصفوف لهدف واضح','4. Watch isolated gaps':'4. انتبه إلى الفجوات المنعزلة',
 'Consider the full set before placing the first shape. A convenient move may block the only space needed for a larger piece.':'ألقِ نظرة على مجموعة القطع كاملة قبل وضع الشكل الأول. فقد تؤدي حركة تبدو مناسبة إلى إغلاق المساحة الوحيدة التي تحتاج إليها قطعة أكبر.',
 'Avoid filling the board into narrow holes that accept only one exact shape. Broad open spaces give you more options when new pieces arrive.':'تجنّب تكوين فجوات ضيقة لا تستوعب إلا شكلاً محدداً. فالمساحات الواسعة تمنحك خيارات أكثر عند ظهور قطع جديدة.',
 'A complete row or column creates room, but do not damage a useful layout just to clear one line. Prefer placements that also leave a flexible board.':'يؤدي إكمال صف أو عمود إلى توفير مساحة، لكن لا تفسد توزيعاً مفيداً لمجرد إزالة خط واحد. فضّل المواضع التي تُبقي اللوحة مرنة أيضاً.',
 'Small empty spaces can become unusable when surrounding cells are filled. Check whether a placement creates a pocket future shapes cannot reach.':'قد تصبح المساحات الصغيرة الفارغة غير قابلة للاستخدام عند امتلاء الخانات المحيطة بها. تحقّق مما إذا كان وضع قطعة ما سيُنشئ فجوة لا تستطيع الأشكال اللاحقة الوصول إليها.',
 '1. Read the color groups':'1. تعرّف إلى مجموعات الألوان','2. Plan the angle':'2. خطّط لزاوية التصويب','3. Think about what falls':'3. فكّر فيما قد يسقط','4. Manage the next bubble':'4. خطّط للفقاعة التالية',
 'Find connected bubbles of the same color. A shot is useful when it joins a matching group of at least three or removes a connection supporting other bubbles.':'حدّد الفقاعات المتصلة ذات اللون نفسه. تكون الطلقة مفيدة عندما تضمّ الفقاعة إلى مجموعة من ثلاث فقاعات متطابقة على الأقل، أو تزيل نقطة اتصال تحمل فقاعات أخرى.',
 'Trace the path before firing. If the direct route is blocked, look for an open lane or a wall rebound when the game supports it.':'تتبّع مسار الطلقة قبل إطلاقها. إذا كان المسار المباشر مغلقاً، فابحث عن ممر مفتوح أو إمكانية ارتداد الفقاعة عن الجدار إذا كانت اللعبة تدعم ذلك.',
 'Removing a connected group may cause bubbles attached only to it to fall too. Targeting a supporting group can clear more than the bubbles hit directly.':'قد تؤدي إزالة مجموعة متصلة إلى سقوط الفقاعات المرتبطة بها وحدها أيضاً. وقد تساعدك إصابة مجموعة داعمة على إزالة فقاعات أكثر من تلك التي تصيبها مباشرة.',
 'If the next color is shown, use that information. Avoid leaving a large isolated group that will be difficult to reach with the upcoming color.':'إذا كان لون الفقاعة التالية ظاهراً، فاستفد من هذه المعلومة. وتجنّب ترك مجموعة كبيرة منعزلة يصعب الوصول إليها باللون القادم.',
 '1. Know when a pour is valid':'1. اعرف متى يكون السكب مسموحاً','2. Keep an empty tube available':'2. احتفظ بأنبوب فارغ','3. Build one color at a time':'3. اجمع لوناً واحداً في كل مرة','4. Avoid aimless moves':'4. تجنّب الحركات العشوائية',
 'An empty tube is working space. It lets you move a top layer temporarily to reveal a hidden color. Avoid filling every empty tube too early.':'يمثّل الأنبوب الفارغ مساحة عمل مؤقتة؛ إذ يتيح لك نقل طبقة علوية لكشف لون مخفي. تجنّب ملء جميع الأنابيب الفارغة مبكراً.',
 '1. Start with the objective':'1. ابدأ بفهم الهدف','2. Look for cascades':'2. ابحث عن التتابعات','3. Prioritize restricted areas':'3. أعطِ الأولوية للمناطق المقيّدة','4. Use boosters deliberately':'4. استخدم المعزّزات بحكمة',
 'Read the objective first.':'اقرأ الهدف أولاً.','Look beyond the obvious match.':'انظر إلى ما وراء المطابقة الواضحة.','Watch restricted areas.':'راقب المناطق المقيّدة.','Use special tools deliberately.':'استخدم الأدوات الخاصة بحكمة.',
 'What defines arcade gameplay?':'ما الذي يميّز ألعاب الأركيد؟','Choose by gameplay':'اختر حسب أسلوب اللعب',
 'Browse arcade-style Android games with direct controls, quick reactions, fruit slicing and bubble shooting.':'تصفّح ألعاب Android من فئة الأركيد التي تعتمد على التحكم المباشر وسرعة الاستجابة وتقطيع الفواكه وإطلاق الفقاعات.',
 'Arcade games often emphasize short sessions, direct controls, timing, aiming or quick reactions. Fruit Fury Slice asks you to swipe through flying fruit and avoid bombs. Bubble Fury asks you to aim and connect matching bubbles. Both are arcade-oriented, but use different mechanics.':'تركّز ألعاب الأركيد غالباً على الجلسات القصيرة والتحكم المباشر والتوقيت والتصويب وسرعة الاستجابة. تطلب Fruit Fury Slice السحب لتقطيع الفواكه المتطايرة وتجنّب القنابل، بينما تطلب Bubble Fury التصويب وربط الفقاعات المتطابقة. تنتمي اللعبتان إلى الأركيد لكنهما تستخدمان آليتين مختلفتين.',
 'Browse DevImpact games by gameplay: puzzle games, match-3, bubble shooter, block puzzles, liquid sorting and arcade fruit slicing.':'تصفّح ألعاب DevImpact حسب أسلوب اللعب: ألعاب الألغاز والمطابقة الثلاثية وإطلاق الفقاعات وألغاز الكتل وفرز السوائل وتقطيع الفواكه بأسلوب الأركيد.',
 'Puzzle Games':'ألعاب الألغاز','Matching, bubble shooting, block placement and liquid sorting. Explore distinct mechanics and choose a challenge that fits your style.':'المطابقة وإطلاق الفقاعات ووضع الكتل وفرز السوائل. استكشف الآليات المختلفة واختر التحدي الذي يناسب أسلوبك.',
 'Quick-action games built around timing, aiming and fast decisions.':'ألعاب سريعة تعتمد على التوقيت والتصويب واتخاذ القرارات الفورية.',
 'Match-3 connects similar pieces; bubble shooters require aiming at color groups; block puzzles test spatial placement; liquid sorting focuses on sequence and tube capacity. Fruit slicing emphasizes swipe timing and avoiding hazards.':'تربط المطابقة الثلاثية القطع المتشابهة؛ وتتطلب ألعاب إطلاق الفقاعات التصويب نحو مجموعات الألوان؛ وتختبر ألغاز الكتل القدرة على الترتيب المكاني؛ ويركّز فرز السوائل على التسلسل وسعة الأنابيب. أما تقطيع الفواكه فيعتمد على توقيت السحب وتجنّب المخاطر.',
 'Explore Android puzzle formats including match-3, bubble shooter, block puzzles and liquid sorting, with links to DevImpact games.':'استكشف أنواع ألعاب الألغاز على Android، بما فيها المطابقة الثلاثية وإطلاق الفقاعات وألغاز الكتل وفرز السوائل، مع روابط إلى ألعاب DevImpact.',
 'Understand the puzzle formats':'تعرّف إلى أنواع الألغاز',
 'Match-3: connect three or more matching pieces and plan around objectives or move limits.':'المطابقة الثلاثية: اربط ثلاث قطع متشابهة أو أكثر وخطّط وفق الأهداف أو عدد الحركات المحدود.',
 'Bubble shooter: aim colored bubbles at matching groups and consider angles and rebounds.':'إطلاق الفقاعات: صوّب الفقاعات الملوّنة نحو المجموعات المطابقة، وراعِ الزوايا والارتدادات.',
 'Block puzzle: position shapes to complete rows while preserving open space.':'ألغاز الكتل: ضع الأشكال لإكمال الصفوف مع الحفاظ على المساحات المفتوحة.',
 'Liquid sort: transfer top color layers between tubes while respecting matching and capacity rules.':'فرز السوائل: انقل الطبقات العلوية الملوّنة بين الأنابيب مع مراعاة قواعد تطابق الألوان والسعة.',
 'Compare related DevImpact Android apps by their actual gameplay, purpose and published features. Read clear differences before choosing an app.':'قارن تطبيقات DevImpact المتقاربة وفق أسلوب اللعب الفعلي والغرض والميزات المعلنة. اطّلع على الفروق بوضوح قبل اختيار التطبيق.',
 'How comparisons are prepared':'كيف أُعدّت المقارنات؟',
 'Comparisons use features stated in official app descriptions. They do not invent rankings, ratings, download counts or claims that one app is universally better. Check Google Play for current product information.':'تعتمد المقارنات على الميزات الواردة في أوصاف التطبيقات الرسمية. ولا تختلق ترتيباً أو تقييمات أو أعداد تنزيلات أو ادعاءات بأن تطبيقاً أفضل للجميع. راجع Google Play للحصول على معلومات المنتجات الحالية.',
 'Bubble Fury is built around aiming and matching colored bubbles. Fruit Fury Slice is swipe-based fruit slicing where timing and avoiding bombs matter.':'تعتمد Bubble Fury على التصويب ومطابقة الفقاعات الملوّنة، بينما تقوم Fruit Fury Slice على تقطيع الفواكه بالسحب، حيث يلعب التوقيت وتجنّب القنابل دوراً أساسياً.',
 'Aim and release bubbles to connect groups of three or more matching colors. Gameplay includes angle choices, wall rebounds and combos.':'صوّب الفقاعات وأطلقها لربط مجموعات تضم ثلاث فقاعات أو أكثر من اللون نفسه. وتتضمن طريقة اللعب اختيار الزوايا وارتداد الفقاعات عن الجدران وتكوين المجموعات المتتالية.',
 'Key difference':'الفرق الأساسي','How to choose':'كيف تختار؟',
 'Both relate to finding work, but their listed purposes differ. Compare the published descriptions and official listings for current details.':'يرتبط التطبيقان بالبحث عن عمل، لكن الغرض المعلن لكل منهما يختلف. قارن الأوصاف المنشورة والصفحات الرسمية للاطلاع على التفاصيل الحالية.',
 'How they differ':'أوجه الاختلاف',
 'Job Connect explicitly describes saving jobs and setting alerts; Job Search describes browsing categories and matching listings to a candidate profile. Neither listing guarantees employment.':'يذكر Job Connect صراحةً إمكانية حفظ الوظائف وضبط التنبيهات، بينما يركّز Job Search على تصفّح الفئات ومطابقة الإعلانات مع ملف المرشح. ولا يضمن أي من التطبيقين الحصول على وظيفة.',
 'Candy-themed match-3 with levels, objectives and limited moves. Its description includes combos, coins and optional boosters or shop elements.':'لعبة مطابقة ثلاثية بطابع الحلوى، تضم مستويات وأهدافاً وحركات محدودة. ويشمل وصفها المجموعات المتتالية والعملات والمعزّزات أو عناصر المتجر الاختيارية.',
 'Fruit-themed match-3 on an 8×8 board, with limited-move levels and endless mode. It tracks score, best score, moves, coins and level.':'لعبة مطابقة ثلاثية بطابع الفواكه على لوحة 8×8، مع مستويات محدودة الحركات ووضع لا نهائي. وتتبع النقاط وأفضل نتيجة والحركات والعملات والمستوى.',
 'Explore ZyCrush for its candy theme and objective-based levels. Explore Palace Match if an 8×8 fruit board, score tracking and endless play are more relevant. Check each Google Play listing for current details.':'اختر ZyCrush إذا كنت تفضّل طابع الحلوى والمستويات القائمة على الأهداف. واختر Palace Match إذا كانت لوحة الفواكه 8×8 وتتبع النتائج واللعب اللامتناهي أقرب إلى تفضيلاتك. راجع صفحة كل تطبيق على Google Play للاطلاع على التفاصيل الحالية.',
 'Get it on Google Play ↗':'احصل عليه من Google Play ↗','View app screenshots':'عرض لقطات التطبيق',
 'Frequently asked questions':'الأسئلة الشائعة','Key features':'أبرز الميزات','Highlights described in the official Google Play listing.':'أبرز الميزات الواردة في صفحة Google Play الرسمية.',
 'Real app images shown on the official Google Play listing.':'صور حقيقية للتطبيق كما تظهر في صفحة Google Play الرسمية.',
 'This page is based on the app\'s Google Play listing. App features and availability may change; consult the official store page for the latest information.':'تعتمد هذه الصفحة على قائمة التطبيق في Google Play. وقد تتغير الميزات ومدى التوفّر؛ لذا يُرجى الرجوع إلى صفحة المتجر الرسمية للحصول على أحدث المعلومات.',
 'How to play':'كيفية اللعب','Explore related DevImpact apps':'اكتشف تطبيقات أخرى من DevImpact',
 'Last reviewed: 17 November 2026 · App information checked against the Google Play listing.':'آخر مراجعة: 17 نوفمبر 2026 · تمت مراجعة معلومات التطبيق بالرجوع إلى صفحة Google Play الرسمية.',
 'Download on Google Play ↗':'التنزيل من Google Play ↗','All apps · Developer profile · Contact':'جميع التطبيقات · ملف المطوّر · اتصل بنا'
 };

 Object.assign(AR,{
 'Célibataire: Dating, Friendship & Chat | DevImpact':'Célibataire: للتعارف والصداقة والدردشة | DevImpact',
 'Dating · Friendship · Professional networking':'التعارف · الصداقة · العلاقات المهنية',
 'Social · Dating':'التواصل الاجتماعي · التعارف',
 'Célibataire: Rencontres & Chat (listed in the app experience as Single: Meet & Chat) helps people discover nearby connections based on what they are looking for. The Google Play listing describes three intentions in one app: dating, friendship and professional networking.':'يساعد تطبيق Célibataire: Rencontres & Chat (المعروف داخل التطبيق باسم Single: Meet & Chat) الأشخاص على اكتشاف أشخاص قريبين منهم وفق ما يبحثون عنه. وتصف صفحة Google Play ثلاثة أهداف يجمعها التطبيق: التعارف والصداقة وبناء العلاقات المهنية.',
 'About Célibataire: Rencontres & Chat':'حول Célibataire: Rencontres & Chat',
 'Create a profile with photos, a biography, prompts and interests. Browse profiles and use filters for age, distance and intentions. The listing also describes profile likes and SuperSwipe, a women-first first-message approach, and matches that expire after 24 hours with options to extend or send another match. For friendship, users can look for people to go out with, travel with or chat with without romantic pressure. For professional networking, the app brings people with shared ambitions into the same interface while keeping intentions distinct. Conversations support text messages, photos and voice notes. Local storage helps users continue exploring when the connection is unstable.':'أنشئ ملفاً شخصياً يتضمن الصور والنبذة والأسئلة التعريفية والاهتمامات. تصفّح الملفات الشخصية واستخدم عوامل التصفية حسب العمر والمسافة والهدف من التواصل. كما تذكر صفحة التطبيق الإعجاب بالملفات الشخصية وميزة SuperSwipe، ونهجاً يتيح للنساء إرسال الرسالة الأولى، ومطابقات تنتهي صلاحيتها بعد 24 ساعة مع إمكانية تمديدها أو إرسال مطابقة أخرى. وفي مجال الصداقة، يمكن للمستخدمين البحث عن أشخاص للخروج معهم أو السفر أو الدردشة دون ضغط عاطفي. أما في مجال العلاقات المهنية، فيجمع التطبيق أشخاصاً لديهم طموحات مشتركة ضمن واجهة واحدة مع إبقاء أهداف التواصل منفصلة. وتدعم المحادثات الرسائل النصية والصور والملاحظات الصوتية. كما يساعد التخزين المحلي على مواصلة الاستكشاف عندما يكون الاتصال غير مستقر.',
 'Create a personal profile with photos, biography, prompts and interests.':'أنشئ ملفاً شخصياً يتضمن الصور والنبذة والأسئلة التعريفية والاهتمامات.',
 'Discover people nearby using age, distance and intention filters.':'اكتشف أشخاصاً بالقرب منك باستخدام عوامل التصفية حسب العمر والمسافة وهدف التواصل.',
 'Like profiles or use SuperSwipe.':'أبدِ إعجابك بالملفات الشخصية أو استخدم ميزة SuperSwipe.',
 'Women send the first message, as described in the store listing.':'تتيح آلية التطبيق للنساء إرسال الرسالة الأولى، وفقاً لوصف المتجر.',
 'Matches expire after 24 hours, with an option to extend or send another match.':'تنتهي صلاحية المطابقات بعد 24 ساعة، مع إمكانية تمديدها أو إرسال مطابقة أخرى.',
 'Explore friendship and social connections without romantic pressure.':'استكشف الصداقة والعلاقات الاجتماعية دون ضغط عاطفي.',
 'Connect with professionals who share your ambitions.':'تواصل مع محترفين يشاركونك طموحاتك.',
 'Chat through text messages, photos and voice notes.':'تواصل عبر الرسائل النصية والصور والملاحظات الصوتية.',
 'Continue exploring with local storage when connectivity is unstable.':'واصل الاستكشاف بفضل التخزين المحلي عندما يكون الاتصال غير مستقر.',
 'How to use Célibataire':'كيفية استخدام Célibataire',
 'Create a profile with photos, a bio and interests.':'أنشئ ملفاً شخصياً يتضمن الصور والنبذة والاهتمامات.',
 'Discover profiles and apply the available age, distance and intention filters.':'اكتشف الملفات الشخصية وطبّق عوامل التصفية المتاحة حسب العمر والمسافة وهدف التواصل.',
 'When a match is made, start a conversation using supported text, photo or voice messages; the store listing describes a women-first first-message rule and 24-hour match expiry with an extension option.':'عند حدوث تطابق، ابدأ محادثة باستخدام الرسائل النصية أو الصور أو الرسائل الصوتية المدعومة. ويذكر وصف المتجر أن الرسالة الأولى ترسلها المرأة، وأن صلاحية المطابقة تنتهي بعد 24 ساعة مع إمكانية تمديدها.',
 'Is Célibataire only a dating app?':'هل Célibataire تطبيق للتعارف فقط؟',
 'No. The Google Play description presents dating, friendship and professional networking as distinct ways to connect.':'لا. يعرض وصف Google Play التعارف والصداقة وبناء العلاقات المهنية باعتبارها طرقاً مختلفة للتواصل.',
 'Can I filter the profiles I discover?':'هل يمكنني تصفية الملفات الشخصية التي أكتشفها؟',
 'Yes. The listing describes filters for age, distance and intentions.':'نعم. تذكر صفحة التطبيق عوامل تصفية حسب العمر والمسافة وأهداف التواصل.',
 'What types of messages are supported?':'ما أنواع الرسائل المدعومة؟',
 'The listing says conversations can include text messages, photos and voice notes.':'تذكر صفحة التطبيق أن المحادثات يمكن أن تتضمن رسائل نصية وصوراً وملاحظات صوتية.',
 'Who sends the first message?':'من يرسل الرسالة الأولى؟',
 'The store description says women send the first message.':'يذكر وصف المتجر أن النساء يرسلن الرسالة الأولى.',
 'Do matches stay active indefinitely?':'هل تظل المطابقات نشطة إلى أجل غير محدد؟',
 'The listing says each match expires after 24 hours, and users can extend it or send another match.':'تذكر صفحة التطبيق أن صلاحية كل مطابقة تنتهي بعد 24 ساعة، ويمكن للمستخدمين تمديدها أو إرسال مطابقة أخرى.',
 'DevImpact is an independent app publisher focused on creating accessible Android experiences across casual games, social communication, career discovery and sports information.':'DevImpact جهة مستقلة لنشر التطبيقات، تركّز على تقديم تجارب Android سهلة الوصول في مجالات الألعاب الخفيفة والتواصل الاجتماعي واكتشاف الفرص المهنية والمعلومات الرياضية.',
 'Explore each product below and follow its official Google Play listing for current details.':'استكشف كل منتج أدناه، وانتقل إلى صفحته الرسمية على Google Play للاطلاع على أحدث التفاصيل.',
 'The DevImpact catalogue brings together mobile games and practical apps across social discovery, careers, entertainment and sports analytics.':'تجمع مجموعة DevImpact بين ألعاب الهاتف والتطبيقات العملية في مجالات التعارف الاجتماعي والمسارات المهنية والترفيه وتحليلات الرياضة.',
 'We present our products in one place so visitors can understand each app and continue to its official Google Play listing for current product information.':'نجمع منتجاتنا في مكان واحد حتى يتمكن الزوار من التعرّف إلى كل تطبيق والانتقال إلى صفحته الرسمية على Google Play للاطلاع على أحدث معلومات المنتج.',
 'Games and entertainment, communication and social discovery, productivity and career tools, and sports information and analytics.':'الألعاب والترفيه، والتواصل والاكتشاف الاجتماعي، وأدوات الإنتاجية والمسار المهني، ومعلومات الرياضة وتحليلاتها.',
 "Explore the collection and visit each app's official store listing for screenshots, availability, compatibility and publisher-provided details.":'استكشف المجموعة وزر صفحة المتجر الرسمية لكل تطبيق للاطلاع على لقطات الشاشة والتوفّر والتوافق والتفاصيل التي يقدّمها الناشر.',
 'Browse the Games Directory for puzzle and arcade titles, compare related products in App Comparison , or use Guides & Blog for practical gameplay and app-selection articles.':'تصفّح دليل الألعاب للعثور على ألعاب الألغاز والأركيد، أو قارن المنتجات ذات الصلة في قسم مقارنة التطبيقات، أو اقرأ الأدلة والمقالات للحصول على نصائح عملية حول اللعب واختيار التطبيقات.',
 'For app-specific data practices, consult the privacy disclosures on the relevant Google Play listing.':'لمعرفة ممارسات البيانات الخاصة بكل تطبيق، راجع إفصاحات الخصوصية في صفحة التطبيق المعنية على Google Play.',
 'Visit the official Google Play listing for the current app details, compatibility information and installation.':'زر صفحة التطبيق الرسمية على Google Play للاطلاع على التفاصيل الحالية ومعلومات التوافق والتثبيت.',
 'App features and availability may change; consult the official store page for the latest information.':'قد تتغير ميزات التطبيق ومدى توفّره؛ لذا يُرجى الرجوع إلى صفحة المتجر الرسمية للحصول على أحدث المعلومات.',
 'About Bubble Fury: Bubble Shooter':'حول Bubble Fury: Bubble Shooter',
 'About Fruit Fury Slice':'حول Fruit Fury Slice',
 'About Job Connect':'حول Job Connect',
 'About Job Search - Career - find job':'حول Job Search - Career - find job',
 'About Nextube':'حول Nextube',
 'About Palace Match':'حول Palace Match',
 'About GoalPredict: Match Predictions':'حول GoalPredict: Match Predictions',
 'About ZyCrush':'حول ZyCrush',
 'About Tetrixa: Block Puzzle Arcade':'حول Tetrixa: Block Puzzle Arcade'
 });

 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){const raw=node.nodeValue,trim=raw.trim();if(AR[trim])node.nodeValue=raw.replace(trim,AR[trim]);}
 const attrMap=['content','alt','title','aria-label','placeholder'];
 for(const attr of attrMap){document.querySelectorAll('['+attr+']').forEach(el=>{const v=el.getAttribute(attr);if(AR[v])el.setAttribute(attr,AR[v]);});}
 if(AR[document.title])document.title=AR[document.title];
 const desc=document.querySelector('meta[name="description"]');if(desc&&AR[desc.content])desc.content=AR[desc.content];
 const ogt=document.querySelector('meta[property="og:title"]');if(ogt&&AR[ogt.content])ogt.content=AR[ogt.content];
 const ogd=document.querySelector('meta[property="og:description"]');if(ogd&&AR[ogd.content])ogd.content=AR[ogd.content];
 const kw=document.querySelector('meta[name="keywords"]');if(kw)kw.content='DevImpact، تطبيقات أندرويد، ألعاب الهاتف، ألعاب الألغاز، ألعاب الأركيد، البحث عن عمل، التعارف، توقعات كرة القدم';
 const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=location.origin+ROOT+'ar/'+route;
 const ogurl=document.querySelector('meta[property="og:url"]');if(ogurl)ogurl.content=location.origin+ROOT+'ar/'+route;
 document.querySelectorAll('script[type="application/ld+json"]').forEach(s=>{s.textContent=s.textContent.replace(/"inLanguage"\s*:\s*"en"/g,'"inLanguage":"ar"');});
}

