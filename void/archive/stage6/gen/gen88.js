// ARCH·88: 41 прямая запись G.state → scr6(X). Источник — dump88 (t88.json) по сборке 1.5.27; все записи — отдельные операторы-выражения
// (значение присваивания нигде не используется, проверено), поэтому порядок вычислений не меняется: сначала вычисляется X, затем
// запись. scr6 возвращает присвоенное значение, как и исходное выражение присваивания (на случай будущего использования в выражении).
const fs=require('fs'),path=require('path');const build=require('./sites6.js');
const h=fs.readFileSync(process.argv[2],'utf8');const I0=h.indexOf('<script>\n"use strict";')+8,J0=h.indexOf('</script>',I0);const src=h.slice(I0,J0);
const T=JSON.parse(fs.readFileSync(path.join(__dirname,'t88.json'),'utf8'));
if(T.length!==41||T.some(o=>o.used||o.op!=='='||o.inner))throw new Error('ожидалась 41 запись-оператор без использования значения');
const items=T.map(o=>({a:o.a,b:o.b,t:'scr6('+o.rhs+')'}));
for(const o of T)if(src.slice(o.a,o.b)!=='G.state='+o.rhs)throw new Error('текст записи не совпал: '+o.line);
const {sites}=build(h,src,I0,items);
fs.writeFileSync(path.join(__dirname,'s88.json'),JSON.stringify(sites));console.log('мест',sites.length);
