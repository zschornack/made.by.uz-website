(()=>{
  const stage=document.getElementById('stage'),stack=document.getElementById('stack');
  const cards=[...stage.querySelectorAll('.card')],slots=[...stage.querySelectorAll('.slot')];
  // posição de cada card dentro da pilha: deslocamento (fração da pilha) + rotação
  const fan=[{x:.02,y:.10,r:-9},{x:.10,y:.03,r:-3},{x:.18,y:.07,r:4},{x:.24,y:.14,r:10}];
  let geo=null;
  const rel=(el)=>{const a=el.getBoundingClientRect(),s=stage.getBoundingClientRect();return{x:a.left-s.left,y:a.top-s.top,w:a.width,h:a.height}};
  function measure(){
    const st=rel(stack),h1=document.querySelector('.projects h2').getBoundingClientRect();
    const cw=st.w*.74,ch=cw*11/16;
    geo=cards.map((c,i)=>{
      const end=rel(slots[i]);
      const f=fan[i];
      const start={x:st.x+st.w*f.x,y:st.y+(st.h-ch)/2+st.h*(f.y-.08),w:cw,h:ch};
      c.style.width=end.w+'px';c.style.height=end.h+'px';
      return{start,end,r:f.r};
    });
    const top=stage.getBoundingClientRect().top+scrollY;
    geo.from=0;
    geo.to=Math.max(1,top+rel(slots[0]).y-innerHeight*.22);
    if(cur===null)cur=target();
    paint();
  }
  const clamp=v=>Math.min(1,Math.max(0,v));
  const ease=t=>-(Math.cos(Math.PI*t)-1)/2;                // easeInOutSine
  const easeOut=t=>1-Math.pow(1-t,3);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const target=()=>geo?clamp((scrollY-geo.from)/(geo.to-geo.from)):0;
  let cur=null,raf=0,last=0;
  function paint(){
    if(!geo)return;
    cards.forEach((c,i)=>{
      // cada card sai um pouquinho depois do anterior
      const d=i*.07,t=clamp((cur-d)/(1-.21)),p=ease(t);
      const g=geo[i],s=g.start,e=g.end;
      const x=s.x+(e.x-s.x)*p,y=s.y+(e.y-s.y)*p,w=s.w+(e.w-s.w)*p,sc=w/e.w,r=g.r*(1-easeOut(t));
      c.style.transform=`translate3d(${x}px,${y}px,0) rotate(${r}deg) scale(${sc})`;
      c.style.zIndex=t<1?6-i:2;
    });
  }
  function loop(now){
    const dt=Math.min(64,now-(last||now));last=now;
    const tg=target();
    if(cur===null||reduce)cur=tg;
    else cur+=(tg-cur)*(1-Math.pow(1-.03,dt/16.7));   // amortecimento: quanto menor, mais macio
    if(Math.abs(tg-cur)<.0004)cur=tg;
    paint();
    raf=cur!==tg?requestAnimationFrame(loop):0;
    if(!raf)last=0;
  }
  const kick=()=>{if(!raf)raf=requestAnimationFrame(loop)};
  addEventListener('scroll',kick,{passive:true});
  addEventListener('resize',measure);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
  measure();

  // nav encolhe ao rolar
  const nav=document.getElementById('nav');
  const navTick=()=>nav.classList.toggle('small',scrollY>120);
  addEventListener('scroll',navTick,{passive:true});navTick();

  // palavra rotativa (hero)
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)
    document.querySelectorAll('.rot').forEach(g=>{
      const w=[...g.children];let k=0;
      setInterval(()=>{w[k].classList.remove('on');k=(k+1)%w.length;w[k].classList.add('on')},2400);
    });
})();

// "Navegar aqui": carrega o site real dentro do card, em escala de desktop (ou celular, em telas estreitas)
(()=>{
  const cards=[...document.querySelectorAll('.card')];
  function fit(card){
    const view=card.querySelector('.view'),f=view.querySelector('iframe');if(!f)return;
    const w=view.clientWidth,h=view.clientHeight,vw=w<480?390:1440,sc=w/vw;
    f.style.width=vw+'px';f.style.height=(h/sc)+'px';f.style.transform=`scale(${sc})`;
  }
  function close(card){
    card.classList.remove('exploring');
    const view=card.querySelector('.view');view.querySelectorAll('iframe,.loading').forEach(n=>n.remove());
    view.querySelector('.shot').hidden=false;
    card.querySelector('.explore').textContent='Navegar aqui';
  }
  function open(card){
    cards.forEach(c=>c!==card&&c.classList.contains('exploring')&&close(c));
    const btn=card.querySelector('.explore'),view=card.querySelector('.view');
    card.classList.add('exploring');btn.textContent='Fechar';
    const ld=document.createElement('div');ld.className='loading';ld.textContent='carregando o site…';view.appendChild(ld);
    const f=document.createElement('iframe');
    f.src=btn.dataset.src;f.title='Prévia navegável do site';f.loading='eager';
    f.setAttribute('referrerpolicy','no-referrer-when-downgrade');
    f.addEventListener('load',()=>{ld.remove();view.querySelector('.shot').hidden=true});
    view.appendChild(f);
    setTimeout(()=>fit(card),460);fit(card);
  }
  cards.forEach(card=>card.querySelector('.explore').addEventListener('click',()=>
    card.classList.contains('exploring')?close(card):open(card)));
  addEventListener('resize',()=>cards.forEach(fit));
  // fecha a prévia se o visitante voltar para o topo (cards voltam para a pilha)
  const proj=document.getElementById('projetos');
  addEventListener('scroll',()=>{
    if(proj.getBoundingClientRect().top>innerHeight*.6)cards.forEach(c=>c.classList.contains('exploring')&&close(c));
  },{passive:true});
})();
