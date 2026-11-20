// Общий построитель мест правки для этапа 6: по списку диапазонов [a,b) в тексте основного скрипта и замен строит пары
// (якорь, новый текст) так, чтобы каждый якорь был единственным в ТЕКУЩЕМ тексте (правки применяются по порядку) и каждая
// замена — единственной в итоговом тексте (условие снятия патча). Диапазоны не должны пересекаться.
module.exports=function build(h,src,I0,items,extra){extra=extra||'';// extra — текст, который патч вставит целиком (прелюдия): якоря и замены не должны в нём встречаться
  items=items.slice().sort((x,y)=>y.a-x.a);const minQ=new Map();
  for(let round=0;round<30;round++){let work=h;const sites=[];
    for(const it of items){let anc,neu,q=minQ.get(it)||0;
      for(;q<400;q++){const L=12*Math.floor(q/2),R=12*Math.ceil(q/2);anc=src.slice(it.a-L,it.b+R);neu=src.slice(it.a-L,it.a)+it.t+src.slice(it.b,it.b+R);
        if(work.split(anc).length-1===1&&work.split(neu).length-1===0&&!extra.includes(anc)&&!extra.includes(neu))break;}
      if(work.split(anc).length-1!==1)throw new Error('нет единственного якоря для '+src.slice(it.a,it.b).slice(0,60));
      it.q=q;work=work.replace(anc,neu);sites.push([anc,neu,it]);}
    const bad=sites.filter(([a,b])=>work.split(b).length-1!==1||extra.includes(b));
    if(!bad.length)return {sites:sites.map(s=>[s[0],s[1]]),work};
    for(const s of bad)minQ.set(s[2],s[2].q+1);}
  throw new Error('не удалось сделать замены единственными');};
