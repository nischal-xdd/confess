/* ============================================
   NISCHAL ADHIKARI — PORTFOLIO INTERACTIONS
   ============================================ */
(function(){
  "use strict";
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 860px)').matches || 'ontouchstart' in window;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const pct = document.getElementById('preloaderPct');
  let p = 0;
  const loadTimer = setInterval(()=>{
    p += Math.random()*18;
    if(p >= 100){ p = 100; clearInterval(loadTimer); }
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
    if(p === 100){
      setTimeout(()=>{
        preloader.classList.add('done');
        document.body.style.overflow = '';
        initRevealObserver();
      }, 350);
    }
  }, 140);
  document.body.style.overflow = 'hidden';
  setTimeout(()=>{ if(p<100){p=100; fill.style.width='100%'; pct.textContent='100%'; preloader.classList.add('done'); document.body.style.overflow='';} }, 3200);

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if(!isTouch){
    let cx=window.innerWidth/2, cy=window.innerHeight/2, tx=cx, ty=cy;
    window.addEventListener('mousemove', e=>{
      tx = e.clientX; ty = e.clientY;
      cursorDot.style.opacity = 1; cursor.style.opacity = 1;
      cursorDot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
    });
    function raf(){
      cx += (tx-cx)*0.16; cy += (ty-cy)*0.16;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    }
    raf();
    document.querySelectorAll('[data-hover]').forEach(el=>{
      el.addEventListener('mouseenter', ()=> cursor.classList.add('active'));
      el.addEventListener('mouseleave', ()=> cursor.classList.remove('active'));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if(!isTouch){
    document.querySelectorAll('[data-magnetic]').forEach(el=>{
      el.addEventListener('mousemove', e=>{
        const r = el.getBoundingClientRect();
        const relX = e.clientX - r.left - r.width/2;
        const relY = e.clientY - r.top - r.height/2;
        el.style.transform = `translate(${relX*0.28}px, ${relY*0.5}px)`;
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------- Tilt cards ---------- */
  if(!isTouch){
    document.querySelectorAll('[data-tilt]').forEach(el=>{
      el.addEventListener('mousemove', e=>{
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width - 0.5;
        const py = (e.clientY - r.top)/r.height - 0.5;
        el.style.transform = `perspective(700px) rotateX(${-py*6}deg) rotateY(${px*8}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform = ''; });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initRevealObserver(){
    const items = document.querySelectorAll('.reveal-up');
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(i=> obs.observe(i));
  }
  if(reduceMotion){ document.querySelectorAll('.reveal-up').forEach(el=>el.classList.add('in')); }

  /* ---------- Nav scroll state + scroll progress + timeline fill ---------- */
  const nav = document.getElementById('nav');
  const progressFill = document.getElementById('scrollProgressFill');
  const timelineFill = document.getElementById('timelineFill');
  const timelineEl = document.querySelector('.timeline');

  function onScroll(){
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressFill.style.width = scrolled + '%';

    if(timelineEl){
      const r = timelineEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height;
      let visible = vh*0.6 - r.top;
      visible = Math.max(0, Math.min(visible, total));
      timelineFill.style.height = (visible/total*100) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', ()=>{
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> mobileMenu.classList.remove('open')));

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if(id.length>1){
        const target = document.querySelector(id);
        if(target){
          e.preventDefault();
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior:'smooth' });
        }
      }
    });
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const duration = 1400;
        const start = performance.now();
        function tick(now){
          const t = Math.min(1, (now-start)/duration);
          const eased = 1 - Math.pow(1-t, 3);
          cur = Math.round(target*eased);
          el.textContent = cur + suffix;
          if(t<1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c=> counterObs.observe(c));

  /* ---------- Particle canvas (hero) ---------- */
  const canvas = document.getElementById('particles');
  if(canvas && !reduceMotion){
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize(){
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function makeParticles(){
      const count = Math.min(70, Math.floor(canvas.offsetWidth/18));
      particles = Array.from({length:count}, ()=>({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.6+0.4,
        vx: (Math.random()-0.5)*0.25*devicePixelRatio,
        vy: (Math.random()-0.5)*0.25*devicePixelRatio,
        o: Math.random()*0.5+0.2
      }));
    }
    let mx = -9999, my = -9999;
    canvas.addEventListener('mousemove', e=>{
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left)*devicePixelRatio; my = (e.clientY - r.top)*devicePixelRatio;
    });
    canvas.addEventListener('mouseleave', ()=>{ mx=-9999; my=-9999; });
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(pt=>{
        pt.x += pt.vx; pt.y += pt.vy;
        const dx = pt.x-mx, dy = pt.y-my;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 140*devicePixelRatio){
          const f = (140*devicePixelRatio-dist)/(140*devicePixelRatio);
          pt.x += dx*0.01*f; pt.y += dy*0.01*f;
        }
        if(pt.x<0) pt.x=canvas.width; if(pt.x>canvas.width) pt.x=0;
        if(pt.y<0) pt.y=canvas.height; if(pt.y>canvas.height) pt.y=0;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r*devicePixelRatio, 0, Math.PI*2);
        ctx.fillStyle = `rgba(160,180,255,${pt.o})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); makeParticles(); draw();
    window.addEventListener('resize', ()=>{ resize(); makeParticles(); });
  }

  /* ---------- Portfolio data ---------- */
  const projects = [
    { id:1, cat:'poster', catLabel:'Poster Design', title:'Match Day Poster Series', client:'KhelkoKura', desc:'A high-energy poster series announcing tournament fixtures, built to perform across social feeds and print.', tools:'Photoshop, Illustrator', tall:true, process:['Brief','Concept sketches','Typography pass','Color grading','Final export'] },
    { id:2, cat:'branding', catLabel:'School Branding', title:'Admission Campaign System', client:'Nawayug English School', desc:'A full campaign identity spanning posters, banners, certificates, and social creatives for the admissions season.', tools:'Illustrator, Canva', tall:false, process:['Discovery call','Moodboard','Identity system','Templates','Rollout kit'] },
    { id:3, cat:'thumbnail', catLabel:'YouTube Thumbnails', title:'High-CTR Thumbnail Set', client:'Rich Samir', desc:'A thumbnail system engineered for contrast, readability, and click-through across a fast-growing channel.', tools:'Photoshop', tall:false, process:['Reference audit','A/B concepts','Composite','Color pass','Delivery'] },
    { id:4, cat:'social', catLabel:'Social Media Posts', title:'Everyday Content System', client:'Guff Sansar', desc:'A modular content system for daily posting — consistent, fast to produce, and built to hold a feed together.', tools:'Canva, Photoshop', tall:true, process:['Grid system','Template set','Content calendar','QA','Handoff'] },
    { id:5, cat:'event', catLabel:'Event Posters', title:'Promotional Poster Suite', client:'Yugal Meet', desc:'Event promotion posters and digital ads built around a single strong visual hook.', tools:'Illustrator, Photoshop', tall:false, process:['Brief','Concept','Design','Revision','Delivery'] },
    { id:6, cat:'branding', catLabel:'School Branding', title:'Certificate & Banner Kit', client:'Nawayug English School', desc:'Certificates, banners, and event branding built to match the school\u2019s refreshed visual identity.', tools:'Illustrator', tall:false, process:['Audit','Grid','Type system','Templates','Print check'] },
    { id:7, cat:'campaign', catLabel:'Creative Campaigns', title:'Digital Advertisement Campaign', client:'Yugal Meet', desc:'A multi-format ad campaign adapted across placements, aspect ratios, and platforms.', tools:'Photoshop, Illustrator', tall:false, process:['Strategy','Concept','Adaptation','Testing','Launch'] },
    { id:8, cat:'poster', catLabel:'Poster Design', title:'Tournament Announcement Posters', client:'KhelkoKura', desc:'Player-announcement posters built on a repeatable grid system for fast weekly turnaround.', tools:'Photoshop', tall:false, process:['Grid setup','Asset prep','Design','Batch export','Delivery'] },
    { id:9, cat:'social', catLabel:'Social Media Posts', title:'Sports Campaign Graphics', client:'KhelkoKura', desc:'Match-day social graphics designed for speed of production without losing visual polish.', tools:'Canva, Photoshop', tall:true, process:['Template design','Live production','QA','Publishing kit'] },
  ];

  const workGrid = document.getElementById('workGrid');
  function renderProjects(){
    workGrid.innerHTML = projects.map(p=>`
      <div class="work-card reveal-up${p.tall?' tall':''}" data-cat="${p.cat}" data-id="${p.id}">
        <div class="wc-media">
          <div class="halftone"></div>
          <div class="wc-crop"></div>
          <span class="wc-media-title">${p.title}</span>
        </div>
        <div class="wc-overlay">
          <span class="wc-cat">${p.catLabel}</span>
          <div class="wc-title">${p.title}</div>
          <div class="wc-client">${p.client}</div>
        </div>
        <div class="wc-expand">↗</div>
      </div>
    `).join('');

    workGrid.querySelectorAll('.work-card').forEach(card=>{
      card.classList.add('in');
      card.addEventListener('click', ()=> openCase(parseInt(card.dataset.id,10)));
      if(!isTouch){
        card.addEventListener('mousemove', e=>{
          const r = card.getBoundingClientRect();
          const px = (e.clientX-r.left)/r.width - 0.5;
          const py = (e.clientY-r.top)/r.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${-py*4}deg) rotateY(${px*5}deg)`;
        });
        card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
      }
      card.querySelectorAll('[data-hover]');
    });
  }
  renderProjects();

  /* ---------- Filters ---------- */
  document.getElementById('filters').addEventListener('click', e=>{
    const btn = e.target.closest('.filter-btn');
    if(!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.work-card').forEach(card=>{
      const show = f==='all' || card.dataset.cat===f;
      card.classList.toggle('hide', !show);
    });
  });

  /* ---------- Case study modal ---------- */
  const caseStudy = document.getElementById('caseStudy');
  const caseClose = document.getElementById('caseClose');
  function openCase(id){
    const p = projects.find(x=>x.id===id);
    if(!p) return;
    document.getElementById('caseCat').textContent = p.catLabel;
    document.getElementById('caseTitle').textContent = p.title;
    document.getElementById('caseDesc').textContent = p.desc;
    document.getElementById('caseClient').textContent = p.client;
    document.getElementById('caseTools').textContent = p.tools;
    document.getElementById('caseCategory').textContent = p.catLabel;
    document.getElementById('caseMedia').innerHTML = `<div class="halftone" style="position:absolute;inset:0;opacity:.3;"></div><span class="wc-media-title" style="position:relative;font-size:clamp(22px,3vw,34px);">${p.title}</span>`;
    document.getElementById('caseProcess').innerHTML = p.process.map(s=>`<span>${s}</span>`).join('');
    caseStudy.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCase(){
    caseStudy.classList.remove('open');
    document.body.style.overflow = '';
  }
  caseClose.addEventListener('click', closeCase);
  caseStudy.addEventListener('click', e=>{ if(e.target===caseStudy) closeCase(); });
  window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeCase(); });

  /* ---------- Skills ---------- */
  const skills = [
    {name:'Photoshop', pct:98}, {name:'Illustrator', pct:90}, {name:'Canva', pct:98}, {name:'Lightroom', pct:88},
    {name:'Typography', pct:95}, {name:'Branding', pct:92}, {name:'Poster Design', pct:99}, {name:'Creative Thinking', pct:98}
  ];
  const skillsGrid = document.getElementById('skillsGrid');
  const CIRC = 2*Math.PI*52;
  skillsGrid.innerHTML = `<svg width="0" height="0"><defs><linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#5b8cff"/><stop offset="100%" stop-color="#a855f7"/></linearGradient></defs></svg>` +
    skills.map(s=>`
      <div class="skill-item reveal-up">
        <div class="skill-ring">
          <svg viewBox="0 0 120 120">
            <circle class="bg" cx="60" cy="60" r="52"/>
            <circle class="fg" cx="60" cy="60" r="52" data-pct="${s.pct}"/>
          </svg>
          <span class="skill-pct">${s.pct}%</span>
        </div>
        <span class="skill-name">${s.name}</span>
      </div>
    `).join('');

  const ringObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const circle = entry.target.querySelector('.fg');
        const pct = parseInt(circle.dataset.pct,10);
        const offset = CIRC - (pct/100)*CIRC;
        requestAnimationFrame(()=>{ circle.style.strokeDashoffset = offset; });
        ringObs.unobserve(entry.target);
      }
    });
  }, { threshold:0.4 });
  document.querySelectorAll('.skill-ring').forEach(r=> ringObs.observe(r));

  /* ---------- GSAP ScrollTrigger enhancement (progressive) ---------- */
  if(window.gsap && window.ScrollTrigger && !reduceMotion){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.hero-blob').forEach((blob, i)=>{
      gsap.to(blob, {
        yPercent: i===0 ? 30 : -30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start:'top top', end:'bottom top', scrub:true }
      });
    });
  }
})();
