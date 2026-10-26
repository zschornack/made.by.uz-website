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
    geo.to=Math.max(1,top+rel(slots[0]).y-innerHeight*.28);
    paint();
  }
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  function paint(){
    if(!geo)return;
    const p=ease(Math.min(1,Math.max(0,(scrollY-geo.from)/(geo.to-geo.from))));
    cards.forEach((c,i)=>{
      const g=geo[i],s=g.start,e=g.end;
      const x=s.x+(e.x-s.x)*p,y=s.y+(e.y-s.y)*p,w=s.w+(e.w-s.w)*p,sc=w/e.w,r=g.r*(1-p);
      c.style.transform=`translate(${x}px,${y}px) rotate(${r}deg) scale(${sc})`;
      c.style.zIndex=p<1?4-i+2:2;
    });
  }
  addEventListener('scroll',()=>requestAnimationFrame(paint),{passive:true});
  addEventListener('resize',measure);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
  measure();

  // nav encolhe ao rolar
  const nav=document.getElementById('nav');
  const navTick=()=>nav.classList.toggle('small',scrollY>120);
  addEventListener('scroll',navTick,{passive:true});navTick();

  // palavra rotativa do rodapé
  const w=[...document.querySelectorAll('.rot span')];let k=0;
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)
    setInterval(()=>{w[k].classList.remove('on');k=(k+1)%w.length;w[k].classList.add('on')},2200);
})();
