// ---------- Настройки и рекорд ----------
const SET_DEF={amb:true,ambVol:.6,sfx:true,fx:true,manual:true,radio:true,zoom:1,btnSize:1,btnAlpha:.7,hand:'r',stick:'float',dashSwipe:true,haptics:true,softInv:false,oneHand:false,quality:'auto',fps:60,textScale:1,fsMode:(window.matchMedia&&matchMedia('(pointer:coarse)').matches)?'auto':'off',orient:'auto',fsHintShown:false,shake:1,noErase:false,lessFx:false,fpsCap:0,fpsCapD:0};/* ARCH·90a: fpsCap — телефон/планшет, fpsCapD — ПК; 0 — без ограничения */
const SET_OPT={fsMode:['off','auto','always'],orient:['auto','land','port'],zoom:[.85,1,1.15],btnSize:[.85,1,1.2],btnAlpha:[.45,.7,1],hand:['r','l'],stick:['float','fixed'],quality:['auto',0,1,2],fps:[60,30],fpsCap:[30,60,0],fpsCapD:[30,60,0],textScale:[1,1.15,1.3],shake:[0,.5,1]};
const SET=Object.assign({},SET_DEF,(()=>{const v=store('void_settings');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};})());
{const v=store('void_settings');if(!(v&&typeof v==='object'&&!Array.isArray(v)&&'fpsCap' in v))SET.fpsCap=SET.fps===30?30:0;}/* ARCH·90a: прежний «30» — предел на телефоне, прежний «60» — предела не было */
for(const k in SET_DEF){const d=SET_DEF[k];if(SET_OPT[k]){if(!SET_OPT[k].includes(SET[k]))SET[k]=d;}else if(typeof SET[k]!==typeof d||(typeof d==='number'&&!Number.isFinite(SET[k])))SET[k]=d;}
if(SET.ambVol<0||SET.ambVol>1)SET.ambVol=SET_DEF.ambVol;
// 0.6.2: миграция autoFs (0.6.1) → fsMode
{const raw=store('void_settings');if(raw&&typeof raw==='object'&&typeof raw.autoFs==='boolean'&&raw.fsMode===undefined)SET.fsMode=raw.autoFs?'auto':'off';delete SET.autoFs;}
const REC=Object.assign({best:0,maxMission:0,seen:['scout']},store('void_record')||{});
if(!Array.isArray(REC.seen))REC.seen=['scout'];
function saveSet(){store('void_settings',SET);}
function saveRec(){if(devAny())return;store('void_record',REC);}
function recReload(){const s=store('void_record')||{};for(const k in REC)delete REC[k];Object.assign(REC,{best:0,maxMission:0,seen:['scout']},s);}
function saveKey(){/*DEVW*/return window.DEVW&&DEVW.on()?'void_devworld':'void_world';}

