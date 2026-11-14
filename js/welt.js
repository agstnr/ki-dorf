/* KI-Dorf: 3D-Dorf mit three.js. Übernommen aus dem Vorgänger und angepasst:
   17 Häuser, Dorfbewohner:innen, Pause, Sparmodus, three.js r187, kein Hämmern mehr (Häuser wachsen mit dem Lernstand). */
(function(){
'use strict';
var KD=window.KD, HOUSES=KD.HOUSES.filter(function(h){return !!h.look;}), BYID=KD.BYID, ORDER=HOUSES.map(function(h){return h.id;});
var FIGS=['roof-2','roof-1','roof-3','roof-4','roof-5'], LI=Math.PI;
function lvl(id){return KD.S.level(BYID[id]);}
function doneOf(id){var l=lvl(id);return [l>=1,l>=2,l>=3];}
function layoutAt(i){return HOUSES[i].spot;}
var hasGL=(function(){try{var c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')));}catch(e){return false;}})();
KD.World=(function(){
  var HARBOUR={px:32.3,pz:-4.5};
  var T, ready=null, el, canvas, renderer, scene, camera, hemi, sun, ray, ground, welcome;
  var mats={}, geos={}, HS={}, colliders=[], anims=[], puffs=[], spinners=[], clouds=[], dusts=[], pick=[], trees=[], falls=[], plates=[];
  var nearTree=-1, nearKey='', tipEl, fsBtn, fsWanted=false;
  var mode='village', room=null, rooms={}, lightSets=[], curR=null, cur=null, busy=null, doorFlag=false, snapCam=true, altBtn;
  /* Gebaute Stufen und ausgepackte Möbel merkt sich nur der Browser (Komfort, nicht im Spielstand-Code) */
  var built={}, placed={};
  var player, P={}, pl={x:0,z:19.8,face:Math.PI,phase:0,walk:0}, target=null, stuck=0;
  var keys={}, joy={x:0,z:0}, near=null, shown={}, running=false, raf=0, clk=0, tsec=0;
  var live, enterBtn, joyEl, joyKnob, fig='roof-2', OFF={y:13,z:15.5}, R=.42;
  var paused=false, lastHid=null, npcs=[], deko=[], posTick=0, armed=false;

  function cvTex(c){var t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
  function tok(n){return getComputedStyle(document.documentElement).getPropertyValue('--'+n).trim()||'#888888';}
  function night(){return parseFloat(tok('night'))>0.5;}
  function rm(){return KD.rm();}
  function mat(n){if(!mats[n]){mats[n]=new T.MeshToonMaterial({color:tok(n)});}return mats[n];}
  function glow(n){var k='glow:'+n;if(!mats[k]){mats[k]=new T.MeshToonMaterial({color:tok(n),emissive:tok(n),emissiveIntensity:.3});}return mats[k];}
  function geo(k,fn){if(!geos[k]){geos[k]=fn();}return geos[k];}
  function sph(r,a,b){return geo('s'+r+'/'+(a||16),function(){return new T.SphereGeometry(r,a||16,b||12);});}
  function cyl(t,b,h,s){return geo('c'+[t,b,h,s||16].join('/'),function(){return new T.CylinderGeometry(t,b,h,s||16);});}
  function box(w,h,d){return geo('b'+[w,h,d].join('/'),function(){return new T.BoxGeometry(w,h,d);});}
  function rrShape(w,h,r){
    r=Math.max(.005,Math.min(r,w/2-.001,h/2-.001));
    var s=new T.Shape(),x=-w/2,y=-h/2;
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
  }
  /* Runde Kiste, Unterkante bei y=0 */
  function rbox(w,h,d,r){return geo('r'+[w,h,d,r].join('/'),function(){
    var b=Math.min(r,.1,h/3);
    var g=new T.ExtrudeGeometry(rrShape(w-2*b,d-2*b,r-b),{depth:Math.max(.005,h-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,curveSegments:5});
    g.rotateX(-Math.PI/2);g.translate(0,b,0);return g;});}
  /* Flache Platte, senkrecht, Vorderseite zeigt nach +z, Mitte im Ursprung */
  function panel(w,h,r,t){return geo('p'+[w,h,r,t].join('/'),function(){return new T.ExtrudeGeometry(rrShape(w,h,r),{depth:t,bevelEnabled:false,curveSegments:6});});}
  function archG(w,h,t){return geo('a'+[w,h,t].join('/'),function(){var s=new T.Shape(),r=w/2;s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,h-r);s.absarc(0,h-r,r,0,Math.PI,false);s.lineTo(-r,0);return new T.ExtrudeGeometry(s,{depth:t,bevelEnabled:false,curveSegments:12});});}
  function M(g,m,x,y,z,par,noShadow){var o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=!noShadow;o.receiveShadow=true;(par||scene).add(o);return o;}

  function roof(rt,par,w,d,top,m,md){
    var o;
    if(rt==='flat'){M(rbox(w+.5,.36,d+.5,.22),m,0,top-.02,0,par);M(rbox(w*.45,.26,d*.4,.12),md,-w*.12,top+.32,-.2,par);return .6;}
    if(rt==='dome'){
      o=M(geo('dome',function(){return new T.SphereGeometry(1,28,14,0,Math.PI*2,0,Math.PI/2);}),m,0,top-.05,0,par);o.scale.set(w*.56,1.5,d*.62);
      M(cyl(1,1,.2,28),md,0,top,0,par).scale.set(w*.57,1,d*.63);return 1.45;
    }
    if(rt==='barrel'){
      o=M(geo('barrel',function(){var x=new T.CylinderGeometry(1,1,1,22,1,false,0,Math.PI);x.rotateZ(Math.PI/2);return x;}),m,0,top-.02,0,par);
      o.scale.set(w+.5,1.3,(d+.6)/2);return 1.3;
    }
    if(rt==='shed'){
      M(geo('shed'+w+'/'+d,function(){var s=new T.Shape(),a=w/2+.3;s.moveTo(-a,0);s.lineTo(a,0);s.lineTo(a,.55);s.lineTo(-a,1.55);s.lineTo(-a,0);
        var x=new T.ExtrudeGeometry(s,{depth:d+.6,bevelEnabled:true,bevelThickness:.08,bevelSize:.08,bevelSegments:2});x.translate(0,0,-(d+.6)/2);return x;}),m,0,top,0,par);
      return 1.55;
    }
    M(geo('gable'+w+'/'+d,function(){var s=new T.Shape(),a=w/2+.4;s.moveTo(-a,0);s.lineTo(a,0);s.lineTo(0,1.5);s.lineTo(-a,0);
      var x=new T.ExtrudeGeometry(s,{depth:d+.5,bevelEnabled:true,bevelThickness:.1,bevelSize:.1,bevelSegments:3});x.translate(0,0,-(d+.5)/2);return x;}),m,0,top,0,par);
    M(box(w+.9,.16,d+.7),md,0,top+.02,0,par);
    return 1.5;
  }
  function addPuff(par,x,y,z,o,bub){var p=M(sph(bub?.13:.24,10,8),bub?glow('roof-4'):mat('puff'),x,y,z,par,true);p.userData={x0:x,y0:y,o:o,bub:!!bub};puffs.push(p);return p;}

  /* Embleme an der Hausfront (c.ey = Höhe, c.ez = Wandvorderseite) */
  var EMB3={
    blocks:function(c){var s=.34;M(rbox(s,s,s,.06),mat('roof-2'),-.19,c.ey-.42,c.ez+s/2,c.g2);M(rbox(s,s,s,.06),mat('roof-1'),.19,c.ey-.42,c.ez+s/2,c.g2);M(rbox(s,s,s,.06),mat('roof-3'),0,c.ey-.08,c.ez+s/2,c.g2);},
    lock:function(c){M(rbox(.56,.44,.16,.08),mat('lit'),0,c.ey-.3,c.ez+.08,c.g2);M(geo('lockt',function(){return new T.TorusGeometry(.17,.055,8,18,Math.PI);}),mat('stone-d'),0,c.ey+.14,c.ez+.08,c.g2);M(cyl(.05,.05,.04,10),mat('draw'),0,c.ey-.08,c.ez+.17,c.g2).rotation.x=Math.PI/2;},
    book:function(c){M(rbox(.86,.56,.06,.04),mat('roof-3'),0,c.ey-.3,c.ez+.03,c.g2);M(box(.38,.48,.05),mat('paper-svg'),-.19,c.ey-.02,c.ez+.1,c.g2).rotation.y=.35;M(box(.38,.48,.05),mat('paper-svg'),.19,c.ey-.02,c.ez+.1,c.g2).rotation.y=-.35;},
    gear:function(c){var g=new T.Group();g.position.set(0,c.ey-.05,c.ez+.1);c.g2.add(g);M(cyl(.3,.3,.14,20),mat('stone-d'),0,0,0,g).rotation.x=Math.PI/2;
      for(var k=0;k<8;k++){var a=k*Math.PI/4;M(box(.14,.14,.14),mat('stone-d'),Math.cos(a)*.36,Math.sin(a)*.36,0,g).rotation.z=a;}
      M(cyl(.1,.1,.16,12),mat('lit'),0,0,.02,g).rotation.x=Math.PI/2;spinners.push(g);},
    magnifier:function(c){var g=new T.Group();g.position.set(0,c.ey,c.ez+.12);c.g2.add(g);M(geo('magt',function(){return new T.TorusGeometry(.24,.06,8,22);}),mat('roof-3d'),0,0,0,g);
      M(cyl(.22,.22,.03,20),glow('lit'),0,0,0,g).rotation.x=Math.PI/2;M(cyl(.05,.06,.42,8),mat('draw'),.3,-.3,0,g).rotation.z=Math.PI/4;},
    quill:function(c){M(cyl(.02,.13,.75,8),mat('paper-svg'),.05,c.ey,c.ez+.12,c.g2).rotation.z=-.6;M(cyl(.13,.15,.2,12),mat('draw'),-.25,c.ey-.28,c.ez+.12,c.g2);},
    columns:function(c){[-2.3,-.75,.75,2.3].forEach(function(x){if(Math.abs(x)<c.w/2){M(cyl(.15,.17,c.hh,12),mat('stone'),x,c.base+c.hh/2,c.ez+.3,c.g2);}});},
    palette:function(c){var p=M(cyl(.36,.36,.06,18),mat('wood'),0,c.ey-.05,c.ez+.04,c.g2);p.rotation.x=Math.PI/2;p.scale.set(1,1,.78);
      [['roof-2',-.15,.06],['roof-1',.02,.12],['lit',.17,.02]].forEach(function(b){M(sph(.07,8,6),mat(b[0]),b[1],c.ey-.05+b[2],c.ez+.1,c.g2);});
      var ex=c.w/2+.95,ez=c.d/2+.35;[[-.25,.15],[.25,.15],[0,-.25]].forEach(function(l){var leg=M(cyl(.03,.03,1.5,6),mat('wood'),ex+l[0]*.5,.72,ez+l[1]*.5,c.g3);leg.rotation.set(l[1]*.35,0,-l[0]*.35);});
      M(box(.85,.65,.05),mat('paper-svg'),ex,1.1,ez+.15,c.g3);M(box(.6,.12,.06),mat('roof-4'),ex,1.15,ez+.17,c.g3);M(sph(.1,8,6),mat('roof-2'),ex+.2,1.28,ez+.18,c.g3);},
    flask:function(c){M(sph(.27,14,10),glow('roof-4'),0,c.ey-.12,c.ez+.27,c.g2);M(cyl(.08,.1,.3,10),mat('paper-svg'),0,c.ey+.22,c.ez+.27,c.g2);
      for(var k=0;k<3;k++){addPuff(c.g3,0,c.top+c.rh+.15,0,k/3,true);}},
    letter:function(c){M(rbox(.66,.44,.06,.04),mat('paper-svg'),0,c.ey-.25,c.ez+.03,c.g2);M(box(.4,.04,.03),mat('roof-2'),-.16,c.ey-.07,c.ez+.08,c.g2).rotation.z=-.55;M(box(.4,.04,.03),mat('roof-2'),.16,c.ey-.07,c.ez+.08,c.g2).rotation.z=.55;
      var mx=-1.2,mz=c.d/2+.55;M(cyl(.06,.06,.9,8),mat('draw'),mx,.45,mz,c.g3);M(rbox(.5,.42,.36,.1),mat('roof-2'),mx,.88,mz,c.g3);M(box(.28,.04,.02),mat('draw'),mx,1.15,mz+.19,c.g3,true);},
    clock:function(c){M(cyl(.32,.32,.06,22),mat('paper-svg'),0,c.ey,c.ez+.05,c.g2).rotation.x=Math.PI/2;M(geo('clockt',function(){return new T.TorusGeometry(.32,.04,6,22);}),mat('draw'),0,c.ey,c.ez+.08,c.g2);
      M(box(.04,.2,.02),mat('draw'),0,c.ey+.08,c.ez+.1,c.g2,true);M(box(.15,.035,.02),mat('draw'),.06,c.ey,c.ez+.1,c.g2,true);}
  };
  var SPECIAL={
    train:function(c,h){
      var tz=TRACK_Z-c.pz, k;
      /* Zug ohne Gesicht: Lok und ein Wagen */
      var tg=new T.Group();tg.position.set(3,0,tz);c.g3.add(tg);
      M(rbox(2.2,.18,.9,.06),mat('draw'),-.3,.3,0,tg);
      M(cyl(.38,.38,1.5,18),mat('roof-2'),-.55,.8,0,tg).rotation.z=Math.PI/2;
      M(cyl(.4,.4,.06,18),mat('draw'),-1.32,.8,0,tg).rotation.z=Math.PI/2;
      M(cyl(.11,.15,.5,10),mat('draw'),-1,1.38,0,tg);
      M(rbox(.9,1.1,.95,.12),mat('roof-2d'),.55,.42,0,tg);M(rbox(1.05,.12,1.05,.06),mat('draw'),.55,1.52,0,tg);
      M(panel(.42,.36,.08,.03),glow('lit'),.55,1.12,.48,tg,true);
      M(rbox(1.5,.85,.9,.14),mat('roof-1'),1.95,.4,0,tg);
      M(panel(.4,.32,.08,.03),glow('lit'),1.7,.88,.46,tg,true);M(panel(.4,.32,.08,.03),glow('lit'),2.2,.88,.46,tg,true);
      [-1,-.4,.4,1.5,2.4].forEach(function(x){[-.43,.43].forEach(function(z){M(cyl(.22,.22,.08,14),mat('draw'),x,.26,z,tg).rotation.x=Math.PI/2;});});
      for(k=0;k<3;k++){addPuff(tg,-1,1.75,0,k/3);}
      colliders.push({x:c.px+3.5,z:c.pz+tz,hw:2.1,hd:.55,on:function(){return lvl(h.id)>=3;}});
    }
  };

  /* Schild mit Text (Leinwand als Textur), wird bei Farbwechsel neu gezeichnet */
  function plate(text,w,h,bg,fg,par,x,y,z){
    var cv=document.createElement('canvas');cv.width=256;cv.height=Math.max(32,Math.round(256*h/w));
    var tex=cvTex(cv), m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,transparent:true}));
    m.position.set(x,y,z);par.add(m);
    var P={cv:cv,tex:tex,text:text,bg:bg,fg:fg};plates.push(P);drawPlate(P);return m;
  }
  function drawPlate(P){
    var x=P.cv.getContext('2d'),W=P.cv.width,H=P.cv.height,fs=Math.floor(H*.62),fam='Fredoka, Nunito, system-ui, sans-serif';
    x.clearRect(0,0,W,H);rr(x,0,0,W,H,Math.min(W,H)*.25);x.fillStyle=tok(P.bg);x.fill();
    x.font='700 '+fs+'px '+fam;while(x.measureText(P.text).width>W*.86&&fs>8){fs--;x.font='700 '+fs+'px '+fam;}
    x.fillStyle=tok(P.fg);x.textAlign='center';x.textBaseline='middle';x.fillText(P.text,W/2,H/2+2);P.tex.needsUpdate=true;
  }
  function windowAt(wt,x,base,d,lv){
    if(wt==='tall'){
      M(archG(.72,1.45,.06),mat('glass'),x,base+.55,d/2-.01,lv[2],true);M(archG(.72,1.45,.04),glow('lit'),x,base+.55,d/2+.04,lv[3],true);return;
    }
    if(wt==='round'){
      M(cyl(.4,.4,.06,24),mat('glass'),x,base+1.3,d/2+.02,lv[2],true).rotation.x=Math.PI/2;
      M(cyl(.36,.36,.04,24),glow('lit'),x,base+1.3,d/2+.06,lv[3],true).rotation.x=Math.PI/2;
      M(geo('portr',function(){return new T.TorusGeometry(.42,.06,8,24);}),mat('stone-d'),x,base+1.3,d/2+.06,lv[2],true);return;
    }
    M(panel(.82,.86,.18,.06),mat('glass'),x,base+1.3,d/2-.01,lv[2],true);
    M(panel(.82,.86,.18,.04),glow('lit'),x,base+1.3,d/2+.04,lv[3],true);
    if(wt==='bars'){for(var b=-1;b<=1;b++){M(box(.045,.86,.045),mat('stone-d'),x+b*.22,base+1.3,d/2+.12,lv[2],true);}return;}
    M(box(.06,.86,.03),mat('wood'),x,base+1.3,d/2+.09,lv[3],true);M(box(.82,.06,.03),mat('wood'),x,base+1.3,d/2+.09,lv[3],true);
  }
  function pyramid(k,r,h){return geo(k,function(){var x=new T.ConeGeometry(r,h,4);x.rotateY(Math.PI/4);return x;});}

  /* Bauformen nach Funktion. c.g2 = Bau, c.g3 = Einrichtung, c.col(x,z,halbe Breite,halbe Tiefe,ab Stufe) = Hindernis */
  var TRACK_Z=-17.3;
  var KIND3={
    /* Gedächtnisturm: hoher Turm mit Reihen kleiner Fächer, die aufleuchten, wenn das Haus fertig ist */
    tower:{windows:'none',chimney:false,flowers:false,build:function(c){
      var k,r;
      for(r=0;r<3;r++){for(k=-1;k<=1;k++){
        M(panel(.5,.36,.06,.04),mat('glass'),k*.78,c.base+2.9+r*.62,c.d/2+.01,c.g2,true);
        if((r+k+3)%2===0){M(panel(.5,.36,.06,.05),glow('lit'),k*.78,c.base+2.9+r*.62,c.d/2+.02,c.g3,true);}
      }}
      M(cyl(.04,.04,1.1,6),mat('draw'),0,c.top+c.rh+.4,0,c.g2);M(box(.5,.3,.03),mat('roof-2'),.27,c.top+c.rh+.75,0,c.g3,true);
      /* Karteikasten neben dem Eingang */
      var kx=-c.w/2-.9;M(rbox(.9,1.2,.7,.08),mat('wood'),kx,0,c.d/2-.2,c.g3);
      for(k=0;k<3;k++){M(box(.7,.26,.04),mat('paper-svg'),kx,.22+k*.36,c.d/2+.16,c.g3,true);M(box(.16,.05,.05),mat('draw'),kx,.22+k*.36,c.d/2+.19,c.g3,true);}
      c.col(kx,c.d/2-.2,.5,.4,3);
    }},
    /* Remise: Lokschuppen mit großem Tor, das Gleis führt hinein */
    remise:{door:'none',windows:'none',chimney:false,flowers:false,embOnRoof:true,build:function(c){
      M(archG(2.3,2.1,.12),mat('draw'),0,c.base,c.d/2-.05,c.g2);
      M(box(.12,2.0,.1),mat('wood'),-1.24,c.base+1,c.d/2+.05,c.g2);M(box(.12,2.0,.1),mat('wood'),1.24,c.base+1,c.d/2+.05,c.g2);
      /* Lok schaut aus dem Tor, wenn das Haus fertig ist */
      var lg=new T.Group();lg.position.set(0,c.base,c.d/2-.15);c.g3.add(lg);
      M(cyl(.5,.5,.5,18),mat('roof-4'),0,.75,0,lg).rotation.x=Math.PI/2;M(cyl(.52,.52,.06,18),mat('draw'),0,.75,.27,lg).rotation.x=Math.PI/2;
      M(sph(.11,10,8),glow('lit'),0,.95,.32,lg,true);M(rbox(1.2,.2,.3,.05),mat('roof-2'),0,.12,.2,lg);
      /* Signal und Ersatzräder */
      var sx=c.w/2+.8;M(cyl(.06,.08,2.6,8),mat('draw'),sx,1.3,c.d/2+.6,c.g2);M(box(.7,.18,.05),mat('roof-2'),sx+.3,2.45,c.d/2+.6,c.g2).rotation.z=.5;M(sph(.1,8,6),glow('lit'),sx,2.1,c.d/2+.68,c.g3,true);
      [[-.2,0],[.25,.06]].forEach(function(q){M(cyl(.34,.34,.1,16),mat('draw'),-c.w/2-.5+q[0],.36,c.d/2+.3+q[1],c.g3).rotation.set(Math.PI/2,0,.25);});
    }},
    /* Leuchtturm: rot-weißer Turm auf einem flachen Wärterhaus, das Licht geht an, wenn das Haus fertig ist */
    lighthouse:{windows:'one',chimney:false,flowers:false,build:function(c){
      var y=c.top+.16,k,r0=1.02;
      for(k=0;k<5;k++){var ra=r0-k*.07,rb=r0-(k+1)*.07;M(cyl(rb,ra,.86,20),mat(k%2?'roof-2':'paper-svg'),0,y+.43+k*.86,0,c.g2);}
      y+=5*.86;
      M(cyl(.92,.92,.12,20),mat('draw'),0,y+.06,0,c.g2);
      for(k=0;k<8;k++){var a=k*Math.PI/4;M(cyl(.025,.025,.4,5),mat('draw'),Math.cos(a)*.86,y+.3,Math.sin(a)*.86,c.g2,true);}
      M(cyl(.5,.5,.7,14),mat('glass'),0,y+.47,0,c.g2);M(cyl(.44,.44,.6,14),glow('lit'),0,y+.47,0,c.g3,true);
      M(geo('lhcap',function(){return new T.ConeGeometry(.66,.6,14);}),mat('roof-2'),0,y+1.12,0,c.g2);M(sph(.08,8,6),mat('draw'),0,y+1.46,0,c.g2,true);
      /* Felsen am Ufer */
      [[-2.2,.5,.5],[-2.7,-.6,.36],[-2.0,-1.3,.42]].forEach(function(q){M(sph(q[2],9,7),mat('stone-d'),q[0],q[2]*.5,q[1],c.g1).scale.set(1.3,.8,1);});
    }},
    /* Lagerhaus: Halle mit Schiebetor, Rampe und zwei gleichen Kistenstapeln (Original und Kopie) */
    warehouse:{door:'none',windows:'none',chimney:false,flowers:false,build:function(c){
      var k;
      M(rbox(2.0,1.9,.12,.05),mat('wood'),0,c.base,c.d/2+.02,c.g2);M(box(2.9,.1,.1),mat('draw'),.4,c.base+1.98,c.d/2+.1,c.g2);
      for(k=-3;k<=3;k++){M(box(.04,1.8,.03),mat('draw'),k*.28,c.base+.95,c.d/2+.09,c.g2,true);}
      M(rbox(2.6,.26,1.0,.06),mat('stone-d'),0,0,c.d/2+.85,c.g1);
      for(k=-1;k<=1;k+=2){M(panel(.7,.4,.06,.04),mat('glass'),k*1.9,c.base+2.0,c.d/2+.01,c.g2,true);M(panel(.7,.4,.06,.05),glow('lit'),k*1.9,c.base+2.0,c.d/2+.02,c.g3,true);}
      [-1,1].forEach(function(sd){
        var gx=sd*(c.w/2+1.0),g=new T.Group();g.position.set(gx,0,c.d/2+.1);c.g3.add(g);
        M(rbox(1.0,.1,.9,.03),mat('wood'),0,0,0,g);M(rbox(.8,.6,.7,.06),mat('wall-5'),0,.1,0,g);M(rbox(.6,.5,.55,.06),mat('wall-1'),0,.7,0,g);
        M(box(.82,.06,.03),mat('draw'),0,.42,.36,g,true);M(box(.62,.06,.03),mat('draw'),0,.96,.29,g,true);
        c.col(gx,c.d/2+.1,.55,.5,3);
      });
    }},
    /* Hafen: Hafenmeisterei mit Anker, Fässern und Wimpelmast. Steg und Wasser liegen gleich daneben. */
    harbour:{flowers:false,chimney:false,build:function(c){
      var g=new T.Group();g.position.set(0,c.base+2.3,c.d/2+.1);c.g2.add(g);
      M(geo('anch1',function(){return new T.TorusGeometry(.3,.055,8,18,Math.PI);}),mat('draw'),0,-.28,0,g).rotation.z=Math.PI;
      M(box(.08,.75,.06),mat('draw'),0,.02,0,g);M(box(.44,.07,.06),mat('draw'),0,.3,0,g);M(geo('anch2',function(){return new T.TorusGeometry(.1,.035,6,14);}),mat('draw'),0,.5,0,g);
      [[-.3,0],[.3,.1],[0,-.45]].forEach(function(q){M(cyl(.26,.26,.7,12),mat('wood'),-c.w/2-.9+q[0],.35,c.d/2+q[1],c.g2);});
      c.col(-c.w/2-.9,c.d/2-.1,.6,.55);
      M(geo('buoy',function(){return new T.TorusGeometry(.26,.09,8,18);}),mat('roof-2'),1.35,c.base+1.3,c.d/2+.1,c.g3);
      var mx=c.w/2+.9;M(cyl(.05,.07,3.4,8),mat('wood'),mx,1.7,c.d/2+.4,c.g3);
      [['roof-2',3.1],['roof-5',2.75],['roof-1',2.4]].forEach(function(f){M(box(.5,.24,.03),mat(f[0]),mx+.28,f[1],c.d/2+.4,c.g3,true);});
      /* Boot am Steg */
      var b=new T.Group();b.position.set(HARBOUR.px-c.px+3.2,-.82,HARBOUR.pz-c.pz+1.5);c.g3.add(b);
      M(rbox(2.4,.5,1.0,.2),mat('roof-1'),0,0,0,b);M(rbox(2.0,.12,.7,.08),mat('wood'),0,.42,0,b);M(cyl(.05,.05,2.2,8),mat('wood'),-.2,1.5,0,b);
      M(geo('sail',function(){var s=new T.Shape();s.moveTo(0,0);s.lineTo(1.1,0);s.lineTo(0,1.7);s.lineTo(0,0);return new T.ExtrudeGeometry(s,{depth:.03,bevelEnabled:false});}),mat('paper-svg'),-.12,.75,0,b);
    }},
    school:{build:function(c){
      var ty=c.top+.95;
      M(rbox(.9,1.05,.9,.08),mat(c.wall),0,ty,0,c.g2);
      M(archG(.42,.62,.06),mat('draw'),0,ty+.2,.43,c.g2,true);
      M(cyl(.07,.19,.26,12),mat('lit'),0,ty+.6,.47,c.g2,true);
      M(pyramid('pyr1',.78,.8),mat(c.roof),0,ty+1.45,0,c.g2);
      [['roof-2',0,0,0],['roof-1',.64,0,.12],['roof-5',.32,.6,.06]].forEach(function(b){M(rbox(.58,.58,.58,.1),mat(b[0]),-c.w/2-1.05+b[1],b[2],-.5+b[3],c.g2).rotation.y=b[1]*.5;});
      c.col(-c.w/2-.75,-.45,.75,.45);
      var tb=new T.Group();tb.position.set(c.w/2+1.2,0,c.d/2+1.15);tb.rotation.y=-.4;c.g3.add(tb);
      M(box(.06,1.15,.06),mat('wood'),-.42,.57,0,tb);M(box(.06,1.15,.06),mat('wood'),.42,.57,0,tb);
      M(box(.92,.64,.05),mat('draw'),0,.82,.03,tb);
      [[-.08,.95,.5],[-.14,.82,.36],[-.1,.69,.44]].forEach(function(l){M(box(l[2],.035,.012),mat('paper-svg'),l[0],l[1],.06,tb,true);});
    }},
    vault:{door:'none',windows:'bars',chimney:false,flowers:false,build:function(c){
      var g=new T.Group();g.position.set(0,c.base+.85,c.d/2+.07);c.g2.add(g);
      M(cyl(.78,.78,.14,32),mat('stone-d'),0,0,0,g).rotation.x=Math.PI/2;
      M(geo('vrim',function(){return new T.TorusGeometry(.78,.07,8,32);}),mat('lit'),0,0,.06,g);
      M(geo('vwheel',function(){return new T.TorusGeometry(.3,.045,8,24);}),mat('lit'),0,0,.15,g,true);
      for(var k=0;k<3;k++){M(box(.62,.05,.05),mat('lit'),0,0,.15,g,true).rotation.z=k*Math.PI/3;}
      for(k=0;k<8;k++){var a=k*Math.PI/4;M(sph(.05,6,5),mat('lit'),Math.cos(a)*.6,Math.sin(a)*.6,.09,g,true);}
      M(rbox(.3,.18,.2,.05),mat('paper-svg'),c.w/2-.2,c.top-.4,c.d/2+.1,c.g2);
      M(cyl(.06,.06,.08,10),mat('draw'),c.w/2-.2,c.top-.31,c.d/2+.23,c.g2,true).rotation.x=Math.PI/2;
      [[0,0],[.3,0],[.15,.12]].forEach(function(b){M(rbox(.26,.12,.14,.03),mat('lit'),c.w/2+.55+b[0],b[1],c.d/2+.45,c.g3);});
    }},
    library:{windows:'tall',build:function(c){
      [-1,1].forEach(function(s){var x=s*(c.w/2-.85);for(var r=0;r<2;r++){for(var k=0;k<4;k++){var hg=.26+((k*7+r*3)%3)*.04;
        M(box(.12,hg,.03),mat(['roof-2','roof-1','roof-3','roof-5'][(k+r)%4]),x-.24+k*.16,c.base+.8+r*.5+hg/2,c.d/2+.1,c.g3,true);}}});
      var bk=new T.Group();bk.position.set(0,c.top+1.42,0);c.g3.add(bk);
      M(box(1.15,.06,1.0),mat('paper-svg'),-.48,0,0,bk).rotation.z=.6;M(box(1.15,.06,1.0),mat('paper-svg'),.48,0,0,bk).rotation.z=-.6;
      M(box(1.2,.04,1.06),mat('roof-3d'),-.5,.06,0,bk).rotation.z=.6;M(box(1.2,.04,1.06),mat('roof-3d'),.5,.06,0,bk).rotation.z=-.6;
      ['roof-1','roof-2','roof-5','roof-3'].forEach(function(m,k){M(rbox(.62,.14,.44,.03),mat(m),c.w/2+.8,k*.14,-.6,c.g2).rotation.y=k*.3;});
      c.col(c.w/2+.8,-.6,.4,.35);
      var bn=new T.Group();bn.position.set(-c.w/2-.85,0,.1);bn.rotation.y=Math.PI/2+.3;c.g3.add(bn);
      M(rbox(1.1,.08,.38,.03),mat('wood'),0,.42,0,bn);M(rbox(1.1,.3,.06,.03),mat('wood'),0,.5,-.18,bn);
      M(box(.08,.42,.3),mat('draw'),-.45,.21,0,bn);M(box(.08,.42,.3),mat('draw'),.45,.21,0,bn);
      c.col(-c.w/2-.85,.1,.3,.6,3);
    }},
    workshop:{door:'none',embOnRoof:true,build:function(c){
      M(rbox(1.75,1.8,.1,.04),mat('stone'),0,c.base,c.d/2+.02,c.g2);
      for(var k=0;k<6;k++){M(box(1.62,.04,.03),mat('stone-d'),0,c.base+.22+k*.27,c.d/2+.08,c.g2,true);}
      M(box(1.95,.16,.14),mat('roof-5'),0,c.base+1.86,c.d/2+.06,c.g2);
      var wb=new T.Group();wb.position.set(-c.w/2-.8,0,.3);c.g3.add(wb);
      M(rbox(1.1,.1,.6,.03),mat('wood'),0,.78,0,wb);
      [[-.48,-.24],[.48,-.24],[-.48,.24],[.48,.24]].forEach(function(q){M(box(.07,.78,.07),mat('wood'),q[0],.39,q[1],wb);});
      M(cyl(.03,.03,.45,6),mat('wood'),.1,.92,.05,wb).rotation.z=Math.PI/2;M(box(.1,.1,.2),mat('draw'),.33,.92,.05,wb);
      M(box(.4,.02,.12),mat('stone'),-.25,.89,-.12,wb);
      c.col(-c.w/2-.8,.3,.6,.35,3);
      M(rbox(.62,.62,.62,.06),mat('wood'),c.w/2+.75,0,-.6,c.g2);M(rbox(.46,.46,.46,.05),mat('wood'),c.w/2+.7,.62,-.55,c.g2);
      c.col(c.w/2+.75,-.6,.35,.35);
    }},
    detective:{windows:'one',smoke:false,build:function(c){
      var bx=-c.w/2+.9;
      M(rbox(1.3,1.05,.6,.08),mat(c.wall),bx,c.base+.7,c.d/2+.2,c.g2);
      M(panel(1.05,.72,.12,.04),mat('glass'),bx,c.base+1.22,c.d/2+.5,c.g2,true);
      M(panel(1.05,.72,.12,.03),glow('lit'),bx,c.base+1.22,c.d/2+.54,c.g3,true);
      M(rbox(1.5,.12,.78,.05),mat(c.roof+'d'),bx,c.base+1.75,c.d/2+.2,c.g2);
      if(c.chim){var ht=new T.Group();ht.position.set(c.chim.x,c.chim.y,c.chim.z);c.g2.add(ht);
        M(cyl(.42,.42,.05,20),mat('draw'),0,.03,0,ht);M(cyl(.25,.28,.36,18),mat('draw'),0,.23,0,ht);M(cyl(.285,.285,.08,18),mat('roof-3'),0,.1,0,ht);}
      [[.3,1.35],[-.05,1.75],[.28,2.15],[-.07,2.55]].forEach(function(f){M(sph(.09,8,6),mat('draw'),f[0],.07,c.d/2+f[1],c.g3,true).scale.set(1,.2,1.5);});
    }},
    writing:{flowers:false,build:function(c){
      var ix=-c.w/2-1.0,iz=-.35;
      M(cyl(.45,.56,.75,22),mat('draw'),ix,.38,iz,c.g2);M(cyl(.24,.26,.16,16),mat('draw'),ix,.83,iz,c.g2);
      var q=new T.Group();q.position.set(ix+.05,.85,iz);q.rotation.z=-.35;c.g2.add(q);
      M(cyl(.03,.03,1.5,6),mat('paper-svg'),0,.75,0,q);M(sph(1,14,10),mat('paper-svg'),.13,1.05,0,q).scale.set(.2,.62,.05);
      c.col(ix,iz,.6,.6);
      var dk=new T.Group();dk.position.set(c.w/2+.95,0,c.d/2+.35);dk.rotation.y=-.4;c.g3.add(dk);
      M(rbox(.95,.07,.55,.03),mat('wood'),0,.72,0,dk);
      [[-.4,-.2],[.4,-.2],[-.4,.2],[.4,.2]].forEach(function(l){M(box(.06,.72,.06),mat('wood'),l[0],.36,l[1],dk);});
      M(box(.42,.01,.3),mat('paper-svg'),-.1,.8,0,dk,true);M(cyl(.05,.05,.22,8),mat('paper-svg'),.3,.9,-.1,dk);M(sph(.06,8,6),glow('lit'),.3,1.05,-.1,dk,true);
      c.col(c.w/2+.95,c.d/2+.35,.5,.4,3);
      [0,1].forEach(function(k){var r=M(cyl(.09,.09,.55,10),mat('paper-svg'),c.w/2+.6,.1+k*.17,-.7+k*.05,c.g3);r.rotation.x=Math.PI/2;r.rotation.z=.3*k;});
      M(cyl(.3,.3,.05,20),mat('glass'),0,c.top+.55,c.d/2+.37,c.g2,true).rotation.x=Math.PI/2;
      M(cyl(.27,.27,.04,20),glow('lit'),0,c.top+.55,c.d/2+.41,c.g3,true).rotation.x=Math.PI/2;
    }},
    archive:{build:function(c){
      M(rbox(c.w*.8,.14,1.3,.08),mat('stone-d'),0,0,c.d/2+.75,c.g1);
      [[0,0],[.55,0],[.27,.42]].forEach(function(b){M(rbox(.5,.42,.4,.05),mat('wood'),c.w/2+.6+b[0],b[1],-.4,c.g3);M(box(.22,.12,.01),mat('paper-svg'),c.w/2+.6+b[0],b[1]+.21,-.19,c.g3,true);});
      c.col(c.w/2+.85,-.4,.55,.3,3);
      var o=new T.Group();o.position.set(-.6,c.top+1.5*(1-.6/(c.w/2+.4))+.02,.2);c.g3.add(o);
      M(sph(.26,12,10),mat('wood'),0,.28,0,o).scale.set(1,1.2,.9);M(sph(.21,12,10),mat('wood'),0,.66,0,o);
      [-1,1].forEach(function(s){M(sph(.075,8,6),mat('paper-svg'),s*.085,.7,.17,o,true);M(sph(.035,6,5),mat('draw'),s*.085,.7,.235,o,true);M(cyl(0,.06,.14,5),mat('wood'),s*.13,.86,0,o,true);});
      M(cyl(0,.04,.08,5),mat('lit'),0,.6,.21,o,true).rotation.x=Math.PI/2;
    }},
    atelier:{windows:'none',doorX:.95,flowers:false,embOnRoof:true,build:function(c){
      var wx=-.75;
      M(panel(1.7,1.4,.15,.06),mat('glass'),wx,c.base+1.15,c.d/2-.01,c.g2,true);
      M(panel(1.7,1.4,.15,.04),glow('lit'),wx,c.base+1.15,c.d/2+.04,c.g3,true);
      M(box(.06,1.4,.03),mat('wood'),wx,c.base+1.15,c.d/2+.09,c.g2,true);M(box(1.7,.06,.03),mat('wood'),wx,c.base+1.15,c.d/2+.09,c.g2,true);
      var a=c.w/2+.3,sl=Math.atan(1/(2*a)),hx=-.35,hy=c.top+1.05-.5*hx/a+.1;
      M(box(1.4,.05,1.3),mat('glass'),hx,hy,0,c.g2,true).rotation.z=-sl;
      M(box(1.3,.04,1.2),glow('lit'),hx,hy+.03,0,c.g3,true).rotation.z=-sl;
      [['roof-2',1.75,.6],['roof-1',1.95,1.5],['roof-4',1.6,1.9],['roof-3',-1.85,.25]].forEach(function(s){M(sph(.13,8,6),mat(s[0]),s[1],c.base+s[2],c.d/2+.01,c.g3,true).scale.set(1,1,.15);});
    }},
    station:{build:function(c){
      var tx=-1.7,ty=c.top+.8;
      M(rbox(1.0,1.5,1.0,.08),mat(c.wall),tx,ty,0,c.g2);
      M(cyl(.33,.33,.05,22),mat('paper-svg'),tx,ty+1.0,.52,c.g2,true).rotation.x=Math.PI/2;
      M(geo('clockt',function(){return new T.TorusGeometry(.32,.04,6,22);}),mat('draw'),tx,ty+1.0,.55,c.g2,true);
      M(box(.04,.2,.02),mat('draw'),tx,ty+1.08,.57,c.g2,true);M(box(.15,.035,.02),mat('draw'),tx+.06,ty+1.0,.57,c.g2,true);
      M(pyramid('pyr2',.86,.8),mat(c.roof+'d'),tx,ty+1.9,0,c.g2);
      plate('Bahnhof',1.7,.42,'roof-1d','paper-svg',c.g2,0,c.base+2.15,c.d/2+.03);
      M(rbox(.85,.62,.04,.03),mat('draw'),-1.15,c.base+.85,c.d/2+.02,c.g2);
      for(var k=0;k<4;k++){M(box(.6,.03,.01),mat('lit'),-1.15,c.base+.98+k*.12,c.d/2+.05,c.g2,true);}
      plate('Fahrplan',.85,.24,'draw','lit',c.g2,-1.15,c.base+1.62,c.d/2+.03);
      [-2.9,-1.4].forEach(function(x){M(cyl(.05,.05,2.2,8),mat('draw'),x,1.1,c.d/2+.55,c.g3);});
      M(rbox(2.3,.1,1.1,.05),mat(c.roof+'d'),-2.15,2.2,c.d/2+.55,c.g3);
      M(rbox(1.0,.08,.32,.03),mat('wood'),-2.15,.75,c.d/2+.15,c.g3);
      var sx=c.w/2+3.6,sz=c.d/2+2.15;
      M(cyl(.05,.06,2.1,8),mat('draw'),sx,1.05,sz,c.g2);M(rbox(.32,.62,.16,.06),mat('draw'),sx,1.75,sz+.02,c.g2);
      M(sph(.09,10,8),glow('roof-2'),sx,2.2,sz+.12,c.g3,true);M(sph(.09,10,8),glow('roof-4'),sx,1.92,sz+.12,c.g3,true);
      c.col(sx,sz,.12,.12);
      var rx=c.w/2+1.9;
      for(var z=1.0;z<2.8;z+=.45){M(box(1.05,.05,.22),mat('wood'),rx,.03,z,c.g2,true);}
      [-.36,.36].forEach(function(o){M(box(.08,.08,1.95),mat('stone-d'),rx+o,.06,1.82,c.g2,true);});
    }},
    lab:{windows:'round',build:function(c){
      [[-c.w/2-.9,.1,'roof-3',.42],[c.w/2+.85,-.4,'roof-5',.34]].forEach(function(f){
        M(sph(f[3],16,12),glow(f[2]),f[0],f[3],f[1],c.g3);M(cyl(.09,.11,.4,10),mat('paper-svg'),f[0],f[3]*2+.12,f[1],c.g3);c.col(f[0],f[1],f[3],f[3],3);});
      M(cyl(.07,.07,c.hh+.4,10),mat('stone-d'),c.w/2+.1,c.base+(c.hh+.4)/2,.8,c.g2);M(cyl(.07,.07,.5,10),mat('stone-d'),c.w/2+.3,c.base+c.hh+.4,.8,c.g2).rotation.z=Math.PI/2;
      M(cyl(.13,.18,1.1,12),mat('stone-d'),.55,c.top+1.45,-.1,c.g2).rotation.z=-.7;
      M(cyl(.19,.19,.08,12),mat('glass'),.55+Math.sin(.7)*.55,c.top+1.45+Math.cos(.7)*.55,-.1,c.g2,true).rotation.z=-.7;
    }},
    post:{embOnRoof:true,flowers:false,build:function(c){
      plate('POST',1.5,.44,'roof-2','paper-svg',c.g2,0,c.base+2.12,c.d/2+.03);
      M(box(.4,.05,.03),mat('draw'),c.doorX,c.base+.95,c.d/2+.08,c.g2,true);
      [[0,0,.55],[.5,0,.45],[.22,.44,.4]].forEach(function(b){var s=b[2];M(rbox(s,s*.8,s,.04),mat('wood'),c.w/2+.6+b[0],b[1],-.35,c.g3);M(box(.06,s*.8+.01,s+.01),mat('roof-5'),c.w/2+.6+b[0],b[1]+s*.4,-.35,c.g3,true);});
      c.col(c.w/2+.85,-.35,.55,.35,3);
      var ct=new T.Group();ct.position.set(-c.w/2-.95,0,-.3);ct.rotation.y=.3;c.g3.add(ct);
      M(rbox(.9,.5,.6,.06),mat('roof-1'),0,.32,0,ct);M(rbox(.42,.05,.3,.02),mat('paper-svg'),.1,.82,0,ct,true);
      [-1,1].forEach(function(s){M(cyl(.2,.2,.06,14),mat('draw'),0,.2,s*.33,ct).rotation.x=Math.PI/2;});
      M(box(.5,.04,.04),mat('draw'),-.65,.75,0,ct).rotation.z=-.5;
      c.col(-c.w/2-.95,-.3,.55,.45,3);
    }}
  };

  function buildHouse(h,i){
    var L=h.look||{}, K=KIND3[L.kind]||{}, w=L.w||4.4, d=L.d||3.6, hh=L.h||2.6, rt=L.roofType||'gable', p=layoutAt(i), base=.36, top=base+hh, k;
    var g=new T.Group();g.position.set(p.x,0,p.z);g.userData.hid=h.id;scene.add(g);pick.push(g);
    var lv=[0,1,2,3].map(function(){var x=new T.Group();g.add(x);return x;});
    /* Stufe 0: Bauplatz mit Pflöcken, Schnur und Material */
    var sx=w/2+.35, sz=d/2+.35;
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){M(cyl(.07,.09,.75,8),mat('wood'),q[0]*sx,.37,q[1]*sz,lv[0]);});
    M(box(2*sx,.05,.05),mat('roof-2'),0,.6,sz,lv[0],true);M(box(2*sx,.05,.05),mat('roof-2'),0,.6,-sz,lv[0],true);
    M(box(.05,.05,2*sz),mat('roof-2'),sx,.6,0,lv[0],true);M(box(.05,.05,2*sz),mat('roof-2'),-sx,.6,0,lv[0],true);
    M(rbox(.9,.45,.7,.12),mat('stone'),-.5,0,.2,lv[0]);M(rbox(.7,.35,.6,.1),mat('stone-d'),.45,0,-.3,lv[0]);M(rbox(1.2,.18,.5,.06),mat('wood'),.3,0,.75,lv[0]);
    /* Stufe 1: Fundament */
    M(rbox(w+.7,base,d+.7,.3),mat('stone'),0,0,0,lv[1]);
    M(rbox(1.5,.2,.7,.12),mat('stone-d'),0,0,d/2+.62,lv[1]);
    /* Stufe 2: Bau */
    var roofN=L.roof||'roof-1', wallN=L.wall||'wall-1', dx=K.doorX||0, chim=null;
    M(rbox(w,hh,d,.28),mat(wallN),0,base,0,lv[2]);
    var rh=roof(rt,lv[2],w,d,top,mat(roofN),mat(roofN+'d'));
    if(K.door!=='none'){M(archG(.95,1.55,.1),mat('door'),dx,base,d/2-.04,lv[2]);M(sph(.06,8,6),mat('lit'),dx+.28,base+.78,d/2+.08,lv[2],true);}
    var wx=w/2-.85, wt=K.windows||'square';
    (wt==='none'?[]:wt==='one'?[wx]:[-wx,wx]).forEach(function(x){windowAt(wt,x,base,d,lv);});
    if(rt!=='dome'&&K.chimney!==false){
      var cx=w*.27, ch=rt==='gable'?rh*.9+.2:rt==='barrel'?rh+.5:rt==='shed'?1.2:.8;
      M(cyl(.22,.26,ch,10),mat(roofN+'d'),cx,top+ch/2,-.35,lv[2]);chim={x:cx,y:top+ch,z:-.35};
      if(K.smoke!==false){for(k=0;k<3;k++){addPuff(lv[3],cx,top+ch+.2,-.35,k/3);}}
    }
    /* Stufe 3: Einrichtung mit Licht, Laterne und Blumen */
    var lx=-w/2-.55, lz=d/2+.85;
    M(cyl(.06,.08,1.7,8),mat('draw'),lx,.85,lz,lv[3]);M(sph(.2,12,10),glow('lit'),lx,1.82,lz,lv[3],true);
    if(K.flowers!==false){
      [['roof-2',0,0],['roof-3',.28,.15],['roof-2',.52,-.05],['roof-5',.2,-.25]].forEach(function(f){
        M(cyl(.025,.025,.3,5),mat('grass-d'),w/2+.25+f[1],.2,d/2+.6+f[2],lv[3],true);M(sph(.13,8,6),mat(f[0]),w/2+.25+f[1],.42,d/2+.6+f[2],lv[3]);});
      M(sph(.42,10,8),mat('grass-d'),w/2+.75,.3,d/2+.1,lv[3]);
    }
    var c={g1:lv[1],g2:lv[2],g3:lv[3],w:w,d:d,hh:hh,base:base,top:top,rh:rh,ey:base+2.12,ez:d/2,px:p.x,pz:p.z,wall:wallN,roof:roofN,chim:chim,doorX:dx,
      col:function(lx,lz,hw,hd,minL){colliders.push({x:p.x+lx,z:p.z+lz,hw:hw,hd:hd,on:function(){return lvl(h.id)>=(minL||2);}});}};
    var ce={};for(var key in c){ce[key]=c[key];}
    if(K.embOnRoof){ce.ey=top+.62;ce.ez=d/2+.36;}
    if(EMB3[L.emblem]){EMB3[L.emblem](ce);}
    if(K.build){K.build(c);}
    if(L.special&&SPECIAL[L.special]){SPECIAL[L.special](c,h);}
    /* Schild */
    var lc=document.createElement('canvas');lc.width=512;lc.height=128;
    var tex=cvTex(lc);
    var spr=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
    spr.scale.set(5.2,1.3,1);g.add(spr);
    colliders.push({x:p.x,z:p.z,hw:w/2+.4,hd:d/2+.4});
    var mkb=spriteCv(384,112,2.6,.76,g,dx,2.6,d/2+1.3);mkb.s.visible=false;
    HS[h.id]={h:h,i:i,g:g,lv:lv,x:p.x,z:p.z,w:w,d:d,door:{x:p.x+dx,z:p.z+d/2+1.05},spr:spr,lc:lc,tex:tex,lh:top+rh+1.05,mk:mkb.s,mc:mkb.cv,mt:mkb.tex,mkText:null};
  }

  /* ---------- Innenräume ----------
     Jedes Haus hat einen Raum mit drei Stationen: Lesepult (Fundament), Bautisch (Aufgabe), Möbelkiste (Einrichtung).
     Ist ein Abschnitt gelöst, baut man mit dem Hammer: Fundament legen, Wände hochziehen.
     Nach der Einrichtung packt man Kartons aus, jeder Karton stellt ein Möbelstück auf, passend zum Haustyp. */
  var BOOKC=['roof-2','roof-1','roof-3','roof-5','roof-4'];
  var FLOOR={vault:'stone',archive:'stone',lab:'paper-svg',station:'stone'};
  var STN=[
    {stage:'Fundament',act:'Fundament lesen',x:-4.6,z:-2.7,hw:.45,hd:.4,say:'Am Lesepult liest du das Fundament.'},
    {stage:'Aufgaben',act:'Aufgaben lösen',x:4.6,z:-2.7,hw:.8,hd:.5,say:'Am Bautisch löst du die Aufgaben.'},
    {stage:'Einrichtung',act:'Einrichtung öffnen',x:4.8,z:2.5,hw:.6,hd:.5,say:'In der Kiste liegen Vorlage und Checkliste.'}
  ];
  function rAnim(fn){if(curR){curR.anim.push(fn);}}
  function table(g,w,d,h,m){m=m||mat('wood');M(rbox(w,.08,d,.04),m,0,h-.08,0,g);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){M(box(.07,h-.08,.07),m,q[0]*(w/2-.08),(h-.08)/2,q[1]*(d/2-.08),g);});}
  function chair(g,x,z,r,m){m=m||mat('wood');var c=new T.Group();c.position.set(x,0,z);c.rotation.y=r||0;g.add(c);M(rbox(.45,.06,.45,.03),m,0,.44,0,c);M(rbox(.45,.5,.06,.03),m,0,.5,-.2,c);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){M(box(.05,.44,.05),m,q[0]*.18,.22,q[1]*.18,c);});return c;}
  function arm(g,x,z,r,m){var c=new T.Group();c.position.set(x,0,z);c.rotation.y=r||0;g.add(c);M(rbox(.9,.45,.8,.15),m,0,0,0,c);M(rbox(.9,.65,.2,.1),m,0,.4,-.32,c);M(rbox(.18,.35,.8,.08),m,-.4,.4,0,c);M(rbox(.18,.35,.8,.08),m,.4,.4,0,c);return c;}
  function plant(g,x,z){M(cyl(.2,.16,.35,12),mat('roof-2d'),x,.18,z,g);M(sph(.32,10,8),mat('grass-d'),x,.62,z,g);M(sph(.22,10,8),mat('grass-d'),x+.15,.85,z+.05,g);}
  function rug(g,x,z,w,d,m){M(rbox(w,.02,d,Math.min(w,d)/2-.02),m,x,.005,z,g,true);}
  function flamp(g,x,z){M(cyl(.2,.2,.04,12),mat('draw'),x,.02,z,g);M(cyl(.035,.035,1.4,8),mat('draw'),x,.72,z,g);M(cyl(.13,.26,.3,14),glow('lit'),x,1.48,z,g,true);}
  function dlamp(g,x,y,z){M(cyl(.08,.1,.03,10),mat('draw'),x,y+.015,z,g,true);M(box(.03,.35,.03),mat('draw'),x,y+.2,z,g,true);M(cyl(.04,.12,.14,10),glow('lit'),x,y+.4,z+.05,g,true);}
  function magnifier(g,x,y,z){var mg=new T.Group();mg.position.set(x,y,z);mg.rotation.x=-Math.PI/2;g.add(mg);M(geo('magt2',function(){return new T.TorusGeometry(.1,.025,6,16);}),mat('draw'),0,0,0,mg,true);M(cyl(.02,.02,.18,6),mat('wood'),.14,-.14,0,mg,true).rotation.z=Math.PI/4;}
  function shelf(g,w,h,d,books){
    var m=mat('wood'),n=Math.max(2,Math.round(h/.55)),sp=(h-.12)/n;
    M(box(.08,h,d),m,-w/2+.04,h/2,0,g);M(box(.08,h,d),m,w/2-.04,h/2,0,g);M(box(w,.06,d),m,0,h-.03,0,g);M(box(w,h,.03),mat('sign'),0,h/2,-d/2+.015,g,true);
    for(var s=0;s<n;s++){
      var y=.06+s*sp;M(box(w-.1,.05,d),m,0,y,0,g,true);
      if(books===false){continue;}
      var x=-w/2+.14,k=s*3;
      while(x<w/2-.3){var bw=.12+(k%3)*.05,bh=Math.min(sp-.1,.26+(k%4)*.05);M(box(bw,bh,d*.7),mat(BOOKC[k%5]),x+bw/2,y+.025+bh/2,.02,g,true);x+=bw+.02;k++;if(k%7===0){x+=.16;}}
    }
  }
  function cab(g,w,h,d,m,rows){
    M(rbox(w,h,d,.04),m,0,0,0,g);var rh=(h-.1)/rows;
    for(var i=0;i<rows;i++){var y=.05+rh*i+rh/2;M(box(w-.1,rh-.06,.02),mat('stone'),0,y,d/2+.01,g,true);M(box(.18,.04,.04),mat('draw'),0,y+rh*.2,d/2+.04,g,true);M(box(.16,.08,.01),mat('paper-svg'),0,y-rh*.12,d/2+.025,g,true);}
  }
  /* Möbel je Haustyp: n = Name, x/z = Platz, r = Drehung, hw/hd = halbe Breite/Tiefe als Hindernis (0 = an der Wand), b = Bauanleitung */
  var FURN={
    school:[
      {n:'Tafel',x:0,z:-3.96,hw:0,hd:0,b:function(g){M(rbox(3.2,1.5,.06,.05),mat('wood'),0,.85,0,g);M(rbox(3.0,1.3,.04,.04),mat('draw'),0,.95,.03,g,true);plate('A B C',1.1,.36,'draw','paper-svg',g,-.7,1.95,.06);[[.45,1.55,1.0],[.25,1.3,1.4],[.4,1.05,.8]].forEach(function(l){M(box(l[2],.03,.01),mat('paper-svg'),l[0],l[1],.06,g,true);});M(box(2.6,.05,.12),mat('wood'),0,.9,.08,g,true);}},
      {n:'Schulbank',x:-2,z:.6,hw:.7,hd:.85,b:function(g){table(g,1.2,.6,.75);chair(g,0,.6,Math.PI);M(box(.3,.04,.22),mat('roof-1'),-.2,.77,0,g,true);M(box(.25,.01,.32),mat('paper-svg'),.25,.755,.05,g,true);}},
      {n:'Schulbank',x:2,z:.6,hw:.7,hd:.85,b:function(g){table(g,1.2,.6,.75);chair(g,0,.6,Math.PI);M(box(.3,.04,.22),mat('roof-2'),.2,.77,0,g,true);M(box(.25,.01,.32),mat('paper-svg'),-.25,.755,.05,g,true);}},
      {n:'Globus',x:-5.2,z:.4,r:Math.PI/2,hw:.4,hd:.4,b:function(g){M(cyl(.25,.32,.1,14),mat('wood'),0,.05,0,g);M(cyl(.03,.03,.7,6),mat('draw'),0,.42,0,g);var gl=new T.Group();gl.position.y=1.0;gl.rotation.z=.4;g.add(gl);var sp=new T.Group();gl.add(sp);M(sph(.36,18,14),mat('roof-1'),0,0,0,sp);[[.2,.12,.24],[-.15,-.1,.28],[.05,.25,-.25],[-.25,.05,-.2],[.3,-.15,-.1]].forEach(function(q){M(sph(.13,10,8),mat('grass-d'),q[0],q[1],q[2],sp,true).scale.set(1,.8,.6);});rAnim(function(dt){sp.rotation.y+=dt*.5;});}},
      {n:'Bauklötze',x:-4.2,z:2.6,r:.3,hw:.55,hd:.45,b:function(g){rug(g,0,0,1.8,1.3,mat('roof-4'));[['roof-2',-.35,0,0],['roof-1',.05,0,.1],['roof-5',-.15,.34,.05],['roof-3',.4,0,-.2],['roof-2',.42,.34,-.18]].forEach(function(q){M(rbox(.34,.34,.34,.06),mat(q[0]),q[1],q[2],q[3],g).rotation.y=q[1];});}}
    ],
    vault:[
      {n:'Schließfächer',x:0,z:-3.7,hw:1.75,hd:.25,b:function(g){M(rbox(3.4,2.4,.4,.05),mat('stone-d'),0,0,0,g);for(var i=0;i<6;i++){for(var j=0;j<4;j++){var x=-1.4+i*.56,y=.38+j*.55;M(box(.48,.46,.03),mat('stone'),x,y,.21,g,true);M(sph(.035,6,5),mat('lit'),x+.16,y,.24,g,true);}}}},
      {n:'Standtresor',x:-5.1,z:.4,r:Math.PI/2,hw:.6,hd:.55,b:function(g){M(rbox(1.2,1.4,1.0,.1),mat('stone-d'),0,0,0,g);var d=new T.Group();d.position.set(0,.7,.51);g.add(d);M(cyl(.42,.42,.06,24),mat('stone'),0,0,0,d).rotation.x=Math.PI/2;M(geo('vwheel',function(){return new T.TorusGeometry(.3,.045,8,24);}),mat('lit'),0,0,.06,d,true);for(var k=0;k<3;k++){M(box(.5,.04,.04),mat('lit'),0,0,.06,d,true).rotation.z=k*Math.PI/3;}}},
      {n:'Bankschalter',x:2,z:.6,hw:.95,hd:.4,b:function(g){M(rbox(1.8,1.0,.7,.06),mat('wood'),0,0,0,g);M(rbox(1.9,.06,.8,.03),mat('stone'),0,1.0,0,g);M(rbox(.5,.35,.04,.03),mat('draw'),-.4,1.06,-.15,g);M(box(.42,.27,.01),glow('roof-4'),-.4,1.235,-.12,g,true);M(cyl(.08,.1,.06,10),mat('lit'),.5,1.09,0,g);plate('Schalter',.8,.22,'roof-1d','paper-svg',g,0,.6,.36);}},
      {n:'Goldbarren',x:-2,z:.6,hw:.6,hd:.45,b:function(g){M(rbox(1.1,.14,.8,.03),mat('wood'),0,0,0,g);for(var lay=0;lay<3;lay++){for(var i=0;i<4-lay;i++){for(var j=0;j<2;j++){M(rbox(.22,.12,.16,.03),mat('lit'),-.36+lay*.12+i*.24,.14+lay*.12,-.12+j*.24,g,true);}}}}},
      {n:'Absperrung',x:-4.2,z:2.6,hw:.9,hd:.15,b:function(g){[-.8,0,.8].forEach(function(x){M(cyl(.18,.2,.05,12),mat('lit'),x,.025,0,g);M(cyl(.04,.04,.9,8),mat('lit'),x,.45,0,g);M(sph(.07,8,6),mat('lit'),x,.92,0,g,true);});[-.4,.4].forEach(function(x){M(cyl(.03,.03,.8,6),mat('roof-2'),x,.8,0,g,true).rotation.z=Math.PI/2;});}}
    ],
    library:[
      {n:'Bücherwand',x:0,z:-3.7,hw:1.75,hd:.3,b:function(g){shelf(g,3.4,2.4,.5);}},
      {n:'Bücherregal',x:-5.25,z:.4,r:Math.PI/2,hw:.95,hd:.25,b:function(g){shelf(g,1.8,2.0,.45);}},
      {n:'Lesetisch',x:-2,z:.6,hw:.8,hd:.85,b:function(g){table(g,1.5,.9,.78);chair(g,0,.7,Math.PI);M(box(.32,.03,.42),mat('paper-svg'),-.17,.8,0,g,true).rotation.z=.08;M(box(.32,.03,.42),mat('paper-svg'),.17,.8,0,g,true).rotation.z=-.08;dlamp(g,.55,.78,-.25);}},
      {n:'Lesesessel',x:2,z:.6,r:-.4,hw:.75,hd:.6,b:function(g){arm(g,0,0,0,mat('roof-2'));M(cyl(.25,.25,.05,16),mat('wood'),.85,.6,.1,g);M(cyl(.04,.04,.58,6),mat('wood'),.85,.3,.1,g);M(box(.25,.06,.18),mat('roof-1'),.85,.66,.1,g,true);flamp(g,-.8,-.3);}},
      {n:'Bücherwagen',x:-4.2,z:2.6,r:.2,hw:.6,hd:.35,b:function(g){M(rbox(1.1,.06,.55,.03),mat('wood'),0,.3,0,g);M(rbox(1.1,.06,.55,.03),mat('wood'),0,.75,0,g);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){M(box(.04,.75,.04),mat('draw'),q[0]*.5,.4,q[1]*.24,g);M(sph(.06,8,6),mat('draw'),q[0]*.5,.06,q[1]*.24,g,true);});for(var i=0;i<6;i++){M(box(.12,.3,.36),mat(BOOKC[i%5]),-.4+i*.15,.96,0,g,true).rotation.z=(i%2?.1:-.06);}}}
    ],
    workshop:[
      {n:'Werkzeugwand',x:0,z:-3.96,hw:0,hd:0,b:function(g){M(rbox(3.0,1.5,.05,.04),mat('wood'),0,.9,0,g);M(box(.05,.5,.03),mat('wood'),-1.0,1.55,.05,g,true);M(box(.22,.1,.05),mat('draw'),-1.0,1.82,.06,g,true);M(box(.06,.5,.03),mat('stone-d'),-.4,1.55,.05,g,true);M(geo('wr',function(){return new T.TorusGeometry(.09,.035,6,12,Math.PI*1.4);}),mat('stone-d'),-.4,1.86,.06,g,true);M(box(.7,.18,.02),mat('stone'),.35,1.6,.05,g,true);M(rbox(.18,.22,.05,.04),mat('roof-2'),.78,1.49,.04,g,true);M(box(.04,.45,.03),mat('roof-5'),1.1,1.55,.05,g,true);M(box(.06,.16,.04),mat('roof-1'),1.1,1.85,.06,g,true);[-1.2,-.6,0,.6,1.2].forEach(function(x,k){M(cyl(.07,.07,.12,8),mat(BOOKC[k]),x,1.12,.08,g,true).rotation.x=Math.PI/2;});}},
      {n:'Werkbank',x:-2,z:.6,hw:.85,hd:.45,b:function(g){table(g,1.6,.8,.9);M(box(1.4,.05,.6),mat('wood'),0,.25,0,g,true);M(rbox(.3,.22,.25,.04),mat('draw'),-.6,.9,.1,g);M(box(.8,.06,.25),mat('wood'),.2,.93,.15,g,true);M(box(.6,.04,.18),mat('wood'),.25,.98,-.15,g,true);}},
      {n:'Zahnradmaschine',x:2,z:.6,hw:.6,hd:.5,b:function(g){M(rbox(1.1,.9,.9,.08),mat('stone-d'),0,0,0,g);M(cyl(.06,.06,.6,8),mat('stone-d'),0,1.1,.1,g);var gr=new T.Group();gr.position.set(0,1.45,.12);g.add(gr);M(cyl(.45,.45,.14,24),mat('roof-5'),0,0,0,gr).rotation.x=Math.PI/2;for(var k=0;k<10;k++){var a=k*Math.PI/5;M(box(.16,.16,.14),mat('roof-5'),Math.cos(a)*.52,Math.sin(a)*.52,0,gr,true).rotation.z=a;}M(cyl(.12,.12,.18,12),mat('draw'),0,0,0,gr,true).rotation.x=Math.PI/2;rAnim(function(dt){gr.rotation.z+=dt*.8;});M(sph(.07,8,6),glow('roof-4'),-.3,.72,.46,g,true);M(sph(.07,8,6),glow('roof-2'),-.1,.72,.46,g,true);}},
      {n:'Kistenregal',x:-5.25,z:.4,r:Math.PI/2,hw:.85,hd:.25,b:function(g){shelf(g,1.6,1.7,.45,false);[[-.4,.09],[.3,.09],[-.2,.62],[.4,.62],[0,1.14]].forEach(function(p,k){M(rbox(.42,.36,.36,.04),mat(k%2?'wood':'roof-5'),p[0],p[1],.02,g,true);});}},
      {n:'Werkzeugkiste',x:-4.2,z:2.6,r:.3,hw:.6,hd:.4,b:function(g){M(rbox(.7,.35,.35,.05),mat('roof-2'),-.3,0,0,g);M(geo('tbh',function(){return new T.TorusGeometry(.14,.03,6,12,Math.PI);}),mat('draw'),-.3,.36,0,g,true);M(box(.9,.08,.12),mat('wood'),.35,.6,0,g);[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(q){M(box(.06,.62,.06),mat('wood'),.35+q[0]*.35,.3,q[1]*.1,g).rotation.x=q[1]*.25;});M(box(.7,.05,.25),mat('wood'),.35,.67,0,g,true);}}
    ],
    detective:[
      {n:'Pinnwand',x:0,z:-3.96,hw:0,hd:0,b:function(g){M(rbox(2.8,1.6,.06,.04),mat('wood'),0,.8,0,g);var pts=[[-1.0,2.0],[-.2,2.1],[.8,1.9],[-.7,1.2],[.3,1.3],[1.0,1.15]];pts.forEach(function(p,k){M(box(.36,.28,.01),mat(k%2?'paper-svg':'lit'),p[0],p[1],.04,g,true);M(sph(.035,6,5),mat('roof-2'),p[0],p[1]+.12,.06,g,true);});[[0,1],[1,2],[0,3],[3,4],[4,5],[1,4]].forEach(function(e){var a=pts[e[0]],b=pts[e[1]],dx=b[0]-a[0],dy=b[1]-a[1];M(box(Math.hypot(dx,dy),.02,.01),mat('roof-2'),(a[0]+b[0])/2,(a[1]+b[1])/2+.12,.065,g,true).rotation.z=Math.atan2(dy,dx);});}},
      {n:'Schreibtisch',x:-2,z:.6,hw:.85,hd:.85,b:function(g){table(g,1.6,.8,.78);chair(g,0,.7,Math.PI);dlamp(g,-.55,.78,-.2);M(rbox(.4,.06,.3,.02),mat('roof-5'),.1,.78,0,g);M(rbox(.4,.06,.3,.02),mat('roof-3'),.12,.84,.02,g);magnifier(g,.55,.8,.12);}},
      {n:'Lehnsessel mit Hut',x:2,z:.6,r:-.3,hw:.75,hd:.6,b:function(g){arm(g,0,0,0,mat('roof-3'));M(cyl(.18,.18,.03,10),mat('wood'),-.85,.015,-.2,g);M(cyl(.03,.03,1.7,6),mat('wood'),-.85,.85,-.2,g);var hat=new T.Group();hat.position.set(-.85,1.7,-.2);g.add(hat);M(cyl(.25,.25,.03,16),mat('draw'),0,0,0,hat,true);M(cyl(.15,.17,.2,14),mat('draw'),0,.11,0,hat,true);M(cyl(.172,.172,.05,14),mat('roof-3'),0,.04,0,hat,true);}},
      {n:'Aktenschrank',x:-5.3,z:.4,r:Math.PI/2,hw:.4,hd:.35,b:function(g){cab(g,.7,1.3,.6,mat('stone-d'),3);}},
      {n:'Stehlampe',x:-4.2,z:2.6,hw:.2,hd:.2,b:function(g){M(cyl(1,1,.02,32),mat('roof-2'),0,.01,0,g,true).scale.set(1,1,.65);flamp(g,0,0);}}
    ],
    writing:[
      {n:'Bücherbord',x:0,z:-3.7,hw:1.75,hd:.3,b:function(g){shelf(g,2.4,1.7,.45);[-1.5,1.5].forEach(function(x){for(var i=0;i<4;i++){M(box(.4,.03,.3),mat('paper-svg'),x,.015+i*.035,.1,g,true);}});}},
      {n:'Schreibpult',x:-2,z:.6,hw:.8,hd:.85,b:function(g){table(g,1.4,.75,.78);chair(g,0,.7,Math.PI);M(box(.42,.01,.3),mat('paper-svg'),-.1,.785,.05,g,true);M(cyl(.07,.08,.12,10),mat('draw'),.35,.84,-.15,g);var q=new T.Group();q.position.set(.36,.9,-.15);q.rotation.z=-.4;g.add(q);M(cyl(.012,.012,.4,5),mat('paper-svg'),0,.2,0,q,true);M(sph(1,14,10),mat('paper-svg'),.03,.3,0,q,true).scale.set(.05,.15,.015);M(cyl(.05,.05,.18,8),mat('paper-svg'),-.5,.87,-.2,g);M(sph(.05,8,6),glow('lit'),-.5,1.0,-.2,g,true);}},
      {n:'Ohrensessel',x:2,z:.6,r:-.4,hw:.75,hd:.6,b:function(g){arm(g,0,0,0,mat('roof-4'));flamp(g,.85,-.25);}},
      {n:'Schreibmaschine',x:-5.2,z:.4,r:Math.PI/2,hw:.5,hd:.35,b:function(g){table(g,.9,.6,.7);M(rbox(.5,.16,.38,.05),mat('draw'),0,.7,0,g);M(rbox(.44,.06,.14,.03),mat('stone'),0,.86,-.1,g,true);M(box(.3,.32,.01),mat('paper-svg'),0,1.02,-.16,g,true).rotation.x=-.2;for(var i=0;i<3;i++){M(box(.38,.02,.05),mat('stone-d'),0,.87,.04+i*.05,g,true);}}},
      {n:'Papierkorb',x:-4.2,z:2.6,hw:.25,hd:.25,b:function(g){rug(g,.4,-.2,1.6,1.0,mat('roof-3'));M(cyl(.22,.17,.42,14),mat('wood'),0,.21,0,g);[[.05,.42,0],[-.08,.46,.06],[.3,.08,.2],[-.35,.08,.25]].forEach(function(p){M(sph(.08,8,6),mat('paper-svg'),p[0],p[1],p[2],g,true);});}}
    ],
    archive:[
      {n:'Aktenschränke',x:0,z:-3.7,hw:1.75,hd:.3,b:function(g){for(var i=0;i<4;i++){var c=new T.Group();c.position.x=-1.275+i*.85;g.add(c);cab(c,.8,1.6,.55,mat(i%2?'stone':'stone-d'),4);}}},
      {n:'Kartonregal',x:-5.25,z:.4,r:Math.PI/2,hw:.95,hd:.25,b:function(g){shelf(g,1.8,2.0,.45,false);for(var s=0;s<3;s++){for(var i=0;i<3;i++){M(rbox(.45,.36,.36,.03),mat('wood'),-.55+i*.55,.085+s*.47,.02,g,true);M(box(.2,.1,.01),mat('paper-svg'),-.55+i*.55,.27+s*.47,.205,g,true);}}}},
      {n:'Kartentisch',x:-2,z:.6,hw:.85,hd:.5,b:function(g){table(g,1.6,.9,.8);M(box(1.1,.01,.7),mat('lit'),0,.805,0,g,true);[[-.2,.1],[.25,-.15],[.1,.2]].forEach(function(p,k){M(sph(.04,6,5),mat(BOOKC[k]),p[0],.82,p[1],g,true);});magnifier(g,.5,.82,.25);M(rbox(.3,.12,.22,.02),mat('paper-svg'),-.6,.8,-.2,g);}},
      {n:'Karteikasten',x:2,z:.6,hw:.5,hd:.35,b:function(g){M(rbox(.9,1.0,.6,.05),mat('wood'),0,0,0,g);for(var i=0;i<3;i++){for(var j=0;j<4;j++){M(box(.24,.18,.02),mat('lit'),-.28+i*.28,.15+j*.22,.31,g,true);M(sph(.02,6,5),mat('draw'),-.28+i*.28,.12+j*.22,.33,g,true);}}}},
      {n:'Leiter mit Eule',x:-4.2,z:2.6,r:.4,hw:.3,hd:.2,b:function(g){[-.22,.22].forEach(function(x){M(box(.06,2.0,.06),mat('wood'),x,1.0,0,g);});for(var i=0;i<6;i++){M(box(.44,.04,.05),mat('wood'),0,.25+i*.3,0,g,true);}var o=new T.Group();o.position.set(0,2.0,0);g.add(o);M(sph(.18,10,8),mat('wood'),0,.18,0,o).scale.set(1,1.2,.9);M(sph(.15,10,8),mat('wood'),0,.44,0,o);[-1,1].forEach(function(s){M(sph(.055,8,6),mat('paper-svg'),s*.06,.47,.12,o,true);M(sph(.025,6,5),mat('draw'),s*.06,.47,.165,o,true);});}}
    ],
    atelier:[
      {n:'Bilderwand',x:0,z:-3.96,hw:0,hd:0,b:function(g){[[-1.1,1.6,.9,.7,'roof-4'],[0,1.75,.7,1.0,'roof-2'],[1.05,1.55,.9,.6,'roof-1']].forEach(function(f){M(rbox(f[2]+.12,f[3]+.12,.05,.02),mat('wood'),f[0],f[1]-f[3]/2-.06,0,g);M(box(f[2],f[3],.02),mat(f[4]),f[0],f[1],.035,g,true);M(sph(f[3]*.22,10,8),mat('lit'),f[0]-f[2]*.2,f[1]+f[3]*.1,.05,g,true).scale.set(1,1,.2);});}},
      {n:'Staffelei',x:-2,z:.6,r:.25,hw:.55,hd:.5,b:function(g){[-.3,.3].forEach(function(x){M(box(.05,1.7,.05),mat('wood'),x,.85,.15,g).rotation.z=x*-.15;});M(box(.05,1.6,.05),mat('wood'),0,.8,-.25,g).rotation.x=.3;M(box(.8,.05,.1),mat('wood'),0,.75,.18,g);M(box(.8,.6,.03),mat('paper-svg'),0,1.1,.2,g);M(sph(.18,10,8),mat('roof-2'),-.15,1.15,.22,g,true).scale.set(1,1,.15);M(box(.5,.06,.01),mat('roof-4'),.1,.95,.22,g,true);M(cyl(.18,.18,.04,14),mat('wood'),.6,.45,.4,g);M(cyl(.03,.03,.45,6),mat('wood'),.6,.22,.4,g);}},
      {n:'Gestaltungstisch',x:2,z:.6,hw:.85,hd:.85,b:function(g){table(g,1.6,.8,.78);chair(g,0,.7,Math.PI);M(rbox(.6,.03,.42,.02),mat('draw'),0,.78,-.05,g);var s=new T.Group();s.position.set(0,.81,-.26);s.rotation.x=-.25;g.add(s);M(box(.6,.4,.03),mat('draw'),0,.2,0,s);plate('Folie 1',.52,.32,'paper-svg','roof-3',s,0,.2,.02);[['roof-2',-.6],['roof-1',-.48],['roof-5',-.36],['roof-4',.55]].forEach(function(c){M(box(.1,.01,.16),mat(c[0]),c[1],.785,.25,g,true);});}},
      {n:'Farbregal',x:-5.25,z:.4,r:Math.PI/2,hw:.85,hd:.25,b:function(g){shelf(g,1.6,1.7,.45,false);for(var s=0;s<3;s++){for(var i=0;i<5;i++){M(cyl(.09,.09,.22,10),mat(BOOKC[(i+s)%5]),-.6+i*.3,.2+s*.527,.02,g,true);}}}},
      {n:'Skulptur',x:-4.2,z:2.6,hw:.45,hd:.35,b:function(g){M(rbox(.5,.9,.5,.05),mat('paper-svg'),0,0,0,g);M(geo('sculpt',function(){return new T.TorusKnotGeometry(.18,.06,48,8);}),mat('roof-3'),0,1.15,0,g);plant(g,.75,.1);}}
    ],
    station:[
      {n:'Abfahrtstafel',x:0,z:-3.96,hw:0,hd:0,b:function(g){M(rbox(3.0,1.4,.08,.05),mat('draw'),0,1.0,0,g);plate('Abfahrt',1.0,.3,'roof-1d','paper-svg',g,-.9,2.15,.06);for(var i=0;i<4;i++){M(box(1.5,.07,.01),mat('lit'),-.55,1.85-i*.24,.05,g,true);M(box(.45,.07,.01),glow('roof-4'),1.05,1.85-i*.24,.05,g,true);}}},
      {n:'Wartebank',x:-2,z:.6,hw:.9,hd:.3,b:function(g){M(rbox(1.7,.08,.45,.03),mat('wood'),0,.42,0,g);M(rbox(1.7,.5,.07,.03),mat('wood'),0,.55,-.2,g);[-.7,.7].forEach(function(x){M(box(.08,.42,.4),mat('draw'),x,.21,0,g);});M(rbox(.35,.28,.2,.04),mat('roof-2'),.4,.5,0,g,true);}},
      {n:'Fahrkartenschalter',x:2,z:.6,hw:.95,hd:.4,b:function(g){M(rbox(1.8,1.0,.7,.06),mat('wood'),0,0,0,g);M(rbox(1.9,.06,.8,.03),mat('stone'),0,1.0,0,g);[-.9,.9].forEach(function(x){M(box(.07,1.0,.07),mat('wood'),x,1.55,-.3,g);});M(box(1.9,.1,.1),mat('wood'),0,2.07,-.3,g);plate('Fahrkarten',1.1,.28,'roof-1d','paper-svg',g,0,2.3,-.28);M(box(.3,.02,.2),mat('roof-5'),.3,1.04,.1,g,true);}},
      {n:'Gepäckwagen',x:-5.2,z:.4,r:Math.PI/2,hw:.75,hd:.4,b:function(g){M(rbox(1.3,.06,.7,.03),mat('stone-d'),0,.25,0,g);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){M(cyl(.12,.12,.06,12),mat('draw'),q[0]*.5,.12,q[1]*.33,g).rotation.x=Math.PI/2;});[-.3,.3].forEach(function(z){M(box(.05,.8,.05),mat('stone-d'),-.62,.7,z,g);});M(box(.05,.05,.65),mat('stone-d'),-.62,1.1,0,g);M(rbox(.6,.4,.45,.06),mat('roof-2'),-.15,.31,0,g);M(rbox(.45,.32,.35,.05),mat('roof-1'),.35,.31,.05,g);M(rbox(.4,.25,.3,.05),mat('roof-5'),-.1,.71,0,g);}},
      {n:'Modelleisenbahn',x:-4.2,z:2.6,hw:.85,hd:.55,b:function(g){M(rbox(1.7,.35,1.1,.06),mat('grass-d'),0,0,0,g);M(geo('oval',function(){var t=new T.TorusGeometry(.5,.03,6,40);t.rotateX(Math.PI/2);return t;}),mat('stone-d'),0,.37,0,g,true).scale.set(1.3,1,1);M(sph(.15,8,6),mat('grass'),0,.4,0,g,true);var cars=[0,1].map(function(k){var c=new T.Group();g.add(c);M(rbox(.2,.12,.12,.03),mat(k?'roof-1':'roof-2'),0,0,0,c);if(!k){M(cyl(.03,.03,.08,6),mat('draw'),.06,.16,0,c,true);}return c;});var ph=0;var put=function(){cars.forEach(function(c,k){var a=ph-k*.45;c.position.set(Math.cos(a)*.65,.38,Math.sin(a)*.5);c.rotation.y=-a;});};put();rAnim(function(dt){ph+=dt*.6;put();});}}
    ],
    lab:[
      {n:'Laborbank',x:0,z:-3.7,hw:1.75,hd:.35,b:function(g){M(rbox(3.4,.9,.7,.06),mat('paper-svg'),0,0,0,g);M(rbox(3.5,.06,.75,.03),mat('draw'),0,.9,0,g);[['roof-4',-1.2],['roof-3',-.6],['roof-5',.1],['roof-2',.8],['roof-4',1.3]].forEach(function(f){M(sph(.15,12,10),glow(f[0]),f[1],1.11,0,g,true);M(cyl(.05,.05,.2,8),mat('paper-svg'),f[1],1.32,0,g,true);});M(rbox(3.4,.04,.3,.02),mat('wood'),0,1.6,-.2,g);[['roof-2',-1.1],['roof-1',-.3],['roof-5',.5],['roof-3',1.2]].forEach(function(b){M(cyl(.07,.07,.25,8),mat(b[0]),b[1],1.765,-.2,g,true);});}},
      {n:'Mikroskoptisch',x:-2,z:.6,hw:.75,hd:.45,b:function(g){table(g,1.4,.8,.8,mat('paper-svg'));var m=new T.Group();m.position.set(0,.8,0);g.add(m);M(rbox(.3,.05,.25,.02),mat('draw'),0,0,0,m);M(box(.06,.4,.06),mat('draw'),-.08,.25,-.05,m);M(cyl(.05,.06,.3,10),mat('stone'),0,.45,0,m).rotation.x=-.4;M(box(.18,.02,.14),mat('stone'),0,.16,.02,m);M(box(.15,.01,.05),glow('roof-4'),0,.175,.02,m,true);[[.45,'roof-3'],[-.45,'roof-5']].forEach(function(p){M(cyl(.04,.04,.15,8),glow(p[1]),p[0],.875,.1,g,true);});}},
      {n:'Computerplatz',x:2,z:.6,hw:.75,hd:.85,b:function(g){table(g,1.4,.75,.78);chair(g,0,.7,Math.PI);M(box(.08,.3,.08),mat('draw'),0,.93,-.2,g);var s=new T.Group();s.position.set(0,1.28,-.22);g.add(s);M(rbox(.8,.5,.05,.03),mat('draw'),0,-.25,0,s);for(var i=0;i<5;i++){var w=.2+((i*3)%4)*.1;M(box(w,.035,.01),glow(i%2?'roof-4':'lit'),-.3+w/2+((i*7)%3)*.04,.13-i*.08,.035,s,true);}M(rbox(.5,.03,.18,.02),mat('stone-d'),0,.78,.1,g);}},
      {n:'Chemikalienregal',x:-5.25,z:.4,r:Math.PI/2,hw:.55,hd:.3,b:function(g){shelf(g,1.0,1.8,.5,false);for(var s=0;s<3;s++){for(var i=0;i<4;i++){M(cyl(.06,.07,.22,8),glow(BOOKC[(i+s)%5]),-.33+i*.22,.06+s*.56+.135,.02,g,true);}}}},
      {n:'Serverschrank',x:-4.2,z:2.6,r:.3,hw:.4,hd:.35,b:function(g){M(rbox(.7,1.8,.6,.05),mat('draw'),0,0,0,g);var leds=[];for(var j=0;j<6;j++){M(box(.6,.2,.02),mat('stone-d'),0,.2+j*.26,.31,g,true);for(var i=0;i<3;i++){leds.push(M(sph(.025,6,5),glow(i===0?'roof-4':'lit'),-.2+i*.07,.2+j*.26,.33,g,true));}}var tt=0;rAnim(function(dt){tt+=dt;leds.forEach(function(l,k){l.visible=Math.sin(tt*4+k*1.7)>-.3;});});}}
    ],
    post:[
      {n:'Sortierregal',x:0,z:-3.7,hw:1.75,hd:.3,b:function(g){M(rbox(3.4,2.0,.5,.04),mat('wood'),0,0,0,g);for(var i=0;i<7;i++){for(var j=0;j<4;j++){var x=-1.44+i*.48,y=.3+j*.45;M(box(.42,.38,.02),mat('sign'),x,y,.25,g,true);if((i+j*2)%3!==0){M(box(.3,.2,.02),mat((i+j)%2?'paper-svg':'lit'),x,y-.05,.27,g,true);}}}}},
      {n:'Postschalter',x:2,z:.6,hw:.95,hd:.4,b:function(g){M(rbox(1.8,1.0,.7,.06),mat('roof-2'),0,0,0,g);M(rbox(1.9,.06,.8,.03),mat('wood'),0,1.0,0,g);M(rbox(.4,.1,.35,.03),mat('stone'),-.45,1.06,0,g);M(box(.3,.02,.25),mat('stone-d'),-.45,1.17,0,g,true);M(cyl(.06,.08,.15,10),mat('wood'),.3,1.135,0,g);plate('Post',.7,.24,'paper-svg','roof-2',g,0,.62,.36);M(box(.25,.01,.18),mat('paper-svg'),.6,1.065,.1,g,true);}},
      {n:'Paketstapel',x:-2,z:.6,r:.2,hw:.65,hd:.5,b:function(g){[[-.3,0,0,.6],[.35,0,.05,.5],[-.05,.48,.02,.45],[.4,.4,.1,.35]].forEach(function(b){var s=b[3];M(rbox(s,s*.8,s,.04),mat('wood'),b[0],b[1],b[2],g);M(box(.06,s*.8+.01,s+.01),mat('roof-5'),b[0],b[1]+s*.4,b[2],g,true);});}},
      {n:'Postsackwagen',x:-5.2,z:.4,r:Math.PI/2,hw:.75,hd:.45,b:function(g){M(rbox(1.3,.5,.8,.06),mat('roof-1'),0,.18,0,g);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){M(cyl(.1,.1,.05,10),mat('draw'),q[0]*.5,.1,q[1]*.42,g).rotation.x=Math.PI/2;});[[-.3,0],[.25,.1],[0,-.15]].forEach(function(p){M(sph(.32,12,10),mat('paper-svg'),p[0],.85,p[1],g).scale.set(1,.9,.8);M(cyl(.06,.1,.12,8),mat('wood'),p[0],1.15,p[1],g,true);});}},
      {n:'Feedbackkasten',x:-4.2,z:2.6,hw:.35,hd:.3,b:function(g){M(cyl(.05,.05,.8,8),mat('draw'),0,.4,0,g);M(rbox(.6,.55,.45,.1),mat('roof-2'),0,.8,0,g);M(box(.3,.04,.02),mat('draw'),0,1.2,.23,g,true);plate('Feedback',.55,.17,'paper-svg','roof-2',g,0,.98,.235);}}
    ]
  };
  function furnList(id){return FURN[(BYID[id].look||{}).kind]||FURN.school;}
  function allMask(id){return (1<<furnList(id).length)-1;}
  function isPlaced(id,k){return !!(placed[id]&(1<<k));}
  function countBits(n){var c=0;while(n){c+=n&1;n>>=1;}return c;}
  function pending(id){var l=lvl(id),b=built[id];if(b===undefined||b<0){return null;}if(b<l&&b<2){return 'build';}if(l>=3&&b===2){return 'furnish';}return null;}
  function loadBuilt(){ORDER.forEach(function(id){built[id]=-1;placed[id]=0;});}
  function saveBuilt(){}
  /* Gebautes folgt dem Lernstand. Sammelstücke: 1 Möbel ab Stufe 1, die Hälfte ab Stufe 2, alle ab Stufe 3. */
  function reconcile(){
    ORDER.forEach(function(id){var l=lvl(id),n=furnList(id).length,k=l>=3?n:l===2?Math.ceil(n/2):l===1?1:0;built[id]=l;placed[id]=(1<<k)-1;});
  }
  function bubble(cv,text){
    var x=cv.getContext('2d'),W=cv.width,H=cv.height,fam='Fredoka, Nunito, system-ui, sans-serif',fs=40;
    x.clearRect(0,0,W,H);x.lineWidth=5;x.strokeStyle=tok('draw');x.fillStyle=tok('lit');
    rr(x,6,6,W-12,H-34,26);x.fill();x.stroke();
    x.beginPath();x.moveTo(W/2-16,H-30);x.lineTo(W/2,H-6);x.lineTo(W/2+16,H-30);x.closePath();x.fill();x.stroke();
    x.fillRect(W/2-14,H-38,28,10);
    x.font='700 '+fs+'px '+fam;while(x.measureText(text).width>W-40&&fs>14){fs-=2;x.font='700 '+fs+'px '+fam;}
    x.fillStyle=tok('draw');x.textAlign='center';x.textBaseline='middle';x.fillText(text,W/2,(H-28)/2+4);
  }
  function spriteCv(w,h,sx,sy,par,x,y,z){var cv=document.createElement('canvas');cv.width=w;cv.height=h;var tex=cvTex(cv);var s=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));s.scale.set(sx,sy,1);s.position.set(x,y,z);par.add(s);return {cv:cv,tex:tex,s:s};}
  function setMarker(H){var p=pending(H.h.id);H.mk.visible=!!p;if(p&&H.mkText!==p){bubble(H.mc,p==='build'?'Bauen!':'Einrichten!');H.mt.needsUpdate=true;H.mkText=p;}}
  function addLights(sc,size){
    var hm=new T.HemisphereLight(0xffffff,0x9db585,.42);sc.add(hm);
    var sn=new T.DirectionalLight(0xffffff,.62);sn.position.set(-size*.6,size*1.6,size*.9);sn.castShadow=true;
    var c=sn.shadow.camera;c.left=-size;c.right=size;c.top=size;c.bottom=-size;c.near=1;c.far=size*5;sn.shadow.mapSize.set(1024,1024);sn.shadow.bias=-.0006;
    sc.add(sn);sc.add(sn.target);lightSets.push({h:hm,s:sn});
  }
  function miniTree(sc,x,z,s){var g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);sc.add(g);M(cyl(.18,.26,1.3,8),mat('wood'),0,.65,0,g);M(sph(1.05,14,10),mat('grass-d'),0,2.05,0,g);M(sph(.72,12,9),mat('grass-d'),.55,1.6,.3,g);}
  function buildStations(RO){
    STN.forEach(function(s,i){
      var g=new T.Group();g.position.set(s.x,0,s.z);RO.scene.add(g);
      var dl=Math.hypot(s.x,s.z)||1,gx=s.x-s.x/dl*1.15,gz=s.z-s.z/dl*1.15;g.userData.go={x:gx,z:gz};RO.pick.push(g);
      if(i===0){
        M(rbox(.5,.95,.4,.05),mat('wood'),0,0,0,g);
        var top=new T.Group();top.position.y=1.0;top.rotation.x=.35;g.add(top);
        M(rbox(.75,.06,.55,.03),mat('wood'),0,-.03,0,top);M(box(.3,.03,.42),mat('paper-svg'),-.16,.04,0,top,true).rotation.z=.06;M(box(.3,.03,.42),mat('paper-svg'),.16,.04,0,top,true).rotation.z=-.06;M(box(.02,.04,.42),mat('roof-2'),0,.05,0,top,true);
      } else if(i===1){
        table(g,1.5,.85,.85);M(box(1.0,.01,.6),mat('roof-1'),0,.855,0,g,true);
        [[-.2,.1,.6],[.15,-.1,.4],[0,.2,.3]].forEach(function(l){M(box(l[2],.012,.02),mat('paper-svg'),l[0],.862,l[1],g,true);});
        M(geo('helm',function(){return new T.SphereGeometry(.17,14,10,0,Math.PI*2,0,Math.PI/2);}),mat('roof-5'),.5,.85,-.22,g);M(cyl(.23,.23,.02,16),mat('roof-5'),.5,.86,-.22,g,true);
        M(cyl(.015,.015,.3,6),mat('roof-5'),-.45,.87,.22,g,true).rotation.z=Math.PI/2;
      } else {
        M(rbox(1.1,.8,.9,.06),mat('wood'),0,0,0,g);[.2,.45,.7].forEach(function(y){M(box(1.12,.04,.92),mat('sign'),0,y,0,g,true);});
        M(box(1.15,.06,.95),mat('wood'),0,.9,-.3,g).rotation.x=-.5;M(cyl(.05,.18,.2,12),glow('lit'),.25,.95,.15,g,true);
        M(box(.05,.45,.05),mat('wood'),-.25,.95,.1,g,true).rotation.z=.3;M(box(.05,.45,.05),mat('wood'),-.1,.95,.15,g,true).rotation.z=.3;
      }
      var lb=spriteCv(512,128,3.0,.75,g,0,2.2,0);
      RO.cols.push({x:s.x,z:s.z,hw:s.hw,hd:s.hd});
      RO.stations.push({x:s.x,z:s.z,gx:gx,gz:gz,cv:lb.cv,tex:lb.tex});
    });
  }
  function buildRoom(id){
    var h=BYID[id],L=h.look||{},sc=new T.Scene(),i;sc.background=new T.Color(tok('sky'));
    var RO={id:id,scene:sc,lv:[],stations:[],spots:[],cols:[],anim:[],pick:[],shown:-1,seen:false};curR=RO;
    addLights(sc,9);
    var gr=M(new T.CircleGeometry(45,40),mat('grass'),0,0,0,sc,true);gr.rotation.x=-Math.PI/2;RO.ground=gr;RO.pick.push(gr);
    [[-9,-6.5,1],[9.5,-6,1.1],[-10.5,3,.9],[10.5,4,1],[-3,-8.5,.9],[4,-9,1]].forEach(function(t){miniTree(sc,t[0],t[1],t[2]);});
    var lv=RO.lv=[0,1,2,3].map(function(){var g=new T.Group();sc.add(g);return g;});
    /* Stufe 0: Bauplatz */
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){M(cyl(.08,.1,.9,8),mat('wood'),q[0]*6.2,.45,q[1]*4.2,lv[0]);});
    M(box(12.4,.05,.05),mat('roof-2'),0,.7,-4.2,lv[0],true);M(box(12.4,.05,.05),mat('roof-2'),0,.7,4.2,lv[0],true);M(box(.05,.05,8.4),mat('roof-2'),-6.2,.7,0,lv[0],true);M(box(.05,.05,8.4),mat('roof-2'),6.2,.7,0,lv[0],true);
    /* Stufe 1: Boden */
    var fl=FLOOR[L.kind]||'wood';
    M(rbox(12.6,.3,8.6,.2),mat(fl),0,-.28,0,lv[1]);
    if(fl==='wood'){for(i=-5;i<=5;i++){M(box(.03,.01,8.3),mat('sign'),i*1.1,.025,0,lv[1],true);}}
    else{for(i=-5;i<=5;i++){M(box(.025,.01,8.3),mat('stone-d'),i*1.1,.025,0,lv[1],true);}for(i=-3;i<=3;i++){M(box(12.3,.01,.025),mat('stone-d'),0,.025,i*1.1,lv[1],true);}}
    /* Stufe 2: Wände, Fenster, Tür */
    var wm=mat(L.wall||'wall-1');
    M(rbox(12.6,3.0,.3,.08),wm,0,0,-4.15,lv[2]);M(rbox(.3,3.0,8.6,.08),wm,-6.15,0,0,lv[2]);M(rbox(.3,3.0,8.6,.08),wm,6.15,0,0,lv[2]);
    M(rbox(4.9,.9,.3,.08),wm,-3.75,0,4.15,lv[2]);M(rbox(4.9,.9,.3,.08),wm,3.75,0,4.15,lv[2]);
    M(box(.2,2.6,.36),mat('wood'),-1.25,1.3,4.15,lv[2]);M(box(.2,2.6,.36),mat('wood'),1.25,1.3,4.15,lv[2]);M(box(2.7,.24,.36),mat('wood'),0,2.6,4.15,lv[2]);
    plate('Hinaus',1.0,.3,'sign','sign-ink',lv[2],0,2.6,4.34);
    M(box(12.2,.14,.04),mat('wood'),0,.07,-3.98,lv[2],true);M(box(.04,.14,8.2),mat('wood'),-5.98,.07,0,lv[2],true);M(box(.04,.14,8.2),mat('wood'),5.98,.07,0,lv[2],true);
    [-3.4,3.4].forEach(function(x){M(panel(1.3,1.1,.15,.05),mat('glass'),x,2.0,-4.0,lv[2],true);M(panel(1.3,1.1,.15,.03),glow('lit'),x,2.0,-3.97,lv[3],true);M(box(.05,1.1,.03),mat('wood'),x,2.0,-3.93,lv[2],true);M(box(1.3,.05,.03),mat('wood'),x,2.0,-3.93,lv[2],true);});
    [[-6.0,1],[6.0,-1]].forEach(function(s){M(panel(1.2,1.0,.15,.05),mat('glass'),s[0],1.9,-1.9,lv[2],true).rotation.y=s[1]*Math.PI/2;M(panel(1.2,1.0,.15,.03),glow('lit'),s[0]+s[1]*.03,1.9,-1.9,lv[3],true).rotation.y=s[1]*Math.PI/2;});
    /* Stufe 3: Lichter und Girlande, wenn alles eingerichtet ist */
    for(i=0;i<13;i++){M(geo('flag',function(){var c=new T.ConeGeometry(.13,.26,3);c.rotateX(Math.PI);return c;}),mat(BOOKC[i%5]),-5.4+i*.9,2.78,-3.92,lv[3],true);}
    M(box(11.6,.015,.015),mat('draw'),0,2.92,-3.92,lv[3],true);
    [-2.3,2.3].forEach(function(x){M(sph(.12,10,8),glow('lit'),x,2.55,-3.9,lv[3],true);});
    buildStations(RO);
    /* Kartons und Möbel */
    furnList(id).forEach(function(f,k){
      var wall=!f.hw,g=new T.Group();g.position.set(f.x,0,f.z);g.rotation.y=f.r||0;sc.add(g);f.b(g);g.visible=false;
      var bx=f.x,bz=wall?f.z+.75:f.z,bg=new T.Group();bg.position.set(bx,0,bz);bg.rotation.y=(k*.7)%1;sc.add(bg);
      M(rbox(.7,.55,.6,.05),mat('wood'),0,0,0,bg);M(box(.72,.05,.12),mat('roof-5'),0,.56,0,bg,true);M(box(.12,.05,.62),mat('roof-5'),0,.56,0,bg,true);
      var ring=M(geo('ring',function(){var t=new T.TorusGeometry(.62,.05,6,32);t.rotateX(Math.PI/2);return t;}),glow('lit'),bx,.04,bz,sc,true);ring.visible=false;
      var swp=Math.abs(Math.sin(f.r||0))>.7,hw=swp?f.hd:f.hw,hd=swp?f.hw:f.hd;
      bg.userData.go={x:bx,z:bz};g.userData.go={x:bx,z:bz};RO.pick.push(bg);RO.pick.push(g);
      RO.cols.push({x:bx,z:bz,hw:.4,hd:.35,on:function(){return bg.visible;}});
      if(hw>0){RO.cols.push({x:f.x,z:f.z,hw:hw,hd:hd,on:function(){return g.visible;}});}
      RO.spots.push({name:f.n,bx:bx,bz:bz,piece:g,box:bg,ring:ring,on:false});
    });
    /* Baustelle in der Raummitte */
    var mk=new T.Group();mk.position.set(0,0,1.0);sc.add(mk);mk.userData.go={x:0,z:1.0};RO.pick.push(mk);
    M(geo('ring2',function(){var t=new T.TorusGeometry(.8,.06,6,36);t.rotateX(Math.PI/2);return t;}),glow('lit'),0,.04,0,mk,true);
    M(box(.9,.06,.18),mat('wood'),-.1,.05,.2,mk);M(box(.9,.06,.18),mat('wood'),.05,.11,.1,mk).rotation.y=.4;M(rbox(.3,.22,.25,.06),mat('stone'),.35,0,-.25,mk);M(rbox(.24,.18,.2,.05),mat('stone-d'),-.35,0,-.3,mk);
    var bb=spriteCv(384,112,2.7,.79,mk,0,1.7,0);RO.mk=mk;RO.mks=bb.s;RO.mkc=bb.cv;RO.mkt=bb.tex;
    /* Schild „Hinaus“ neben der Tür, auch schon auf dem Bauplatz */
    M(cyl(.04,.05,1.0,8),mat('wood'),1.85,.5,3.75);plate('Hinaus',.8,.26,'sign','sign-ink',sc,1.85,1.05,3.8);
    curR=null;
    return RO;
  }
  function setLv(lv,b){lv[0].visible=b===0;for(var k=1;k<4;k++){lv[k].visible=b>=k;lv[k].scale.set(1,1,1);}}
  function drawRoomLabels(RO){
    var d=doneOf(RO.id);
    RO.stations.forEach(function(s,i){board(s.cv,i+1,STN[i].stage+(d[i]?' ✓':''),null);s.tex.needsUpdate=true;});
    bubble(RO.mkc,built[RO.id]===0?'Fundament legen!':'Wände bauen!');RO.mkt.needsUpdate=true;
  }
  function roomSync(RO,anim){
    var id=RO.id,b=built[id],l=lvl(id),s=RO.shown,k;
    if(s<0||b<=s||!anim||rm()){setLv(RO.lv,b);}
    else{setLv(RO.lv,s);for(k=s+1;k<=b;k++){(function(k){growG(RO.lv[k],(k-s-1)*.4,k===1?function(){RO.lv[0].visible=false;}:null,{sc:RO.scene,x:0,z:0,w:12,d:8});})(k);}}
    RO.shown=b;
    RO.spots.forEach(function(sp,i){
      var on=isPlaced(id,i);
      sp.box.visible=b>=2&&!on;
      if(on&&!sp.on&&anim&&RO.seen&&!rm()){growG(sp.piece,0,null,{sc:RO.scene,x:sp.bx,z:sp.bz,w:1,d:1});}
      else{sp.piece.visible=on;sp.piece.scale.set(1,1,1);}
      sp.on=on;
      sp.ring.visible=b===2&&l>=3&&!on;
    });
    RO.mk.visible=b<l&&b<2;
    RO.seen=true;
    drawRoomLabels(RO);
  }
  function chips(t){var w=el.querySelector('.whelp');KD.clear(w);KD.add(w,[KD.h('span',{class:'chip k-fine'},'Laufen: Pfeiltasten oder WASD'),KD.h('span',{class:'chip k-fine'},t),KD.h('span',{class:'chip k-fine'},'Hinaus: Tab'),KD.h('span',{class:'chip k-touch'},'Joystick oder hintippen')]);}
  function active(){return mode==='room'&&room?room.scene:scene;}
  function setMode(m,id){
    if(m==='room'){if(!rooms[id]){rooms[id]=buildRoom(id);}room=rooms[id];}else{room=null;}
    mode=m;
    var sc=active();if(player.parent!==sc){sc.add(player);}
    var nm=m==='room'?BYID[id].name:'';
    el.setAttribute('aria-label',m==='room'?'Im Haus: '+nm:'KI-Dorf in 3D');
    chips(m==='room'?'Enter: lesen, lösen, hinausgehen':'Enter: ansprechen, Baum schütteln');
    el.querySelector('#worldHelp').textContent=m==='room'?'Du bist im Haus '+nm+'. Mit den Pfeiltasten oder W, A, S, D läufst du. Am Lesepult öffnest du das Fundament, am Bautisch die Aufgaben, an der Kiste die Einrichtung, jeweils mit Enter. Durch die Tür gehst du hinaus. Mit der Tabulatortaste verlässt du den Raum und kommst zum Text.':'Klick ins Dorf oder geh mit der Tabulatortaste hinein. Mit den Pfeiltasten oder W, A, S, D läufst du. Lauf durch eine Haustür, dann bist du im Haus. Enter vor der Tür geht auch. Neben einer Figur sprichst du sie mit Enter an, einen Baum schüttelst du mit Enter, dann fällt ein Tipp herunter. Mit der Tabulatortaste verlässt du das Dorf. Die Karte darunter führt ebenfalls in jedes Haus.';
  }
  /* Arbeiten mit dem Hammer: Figur bleibt stehen, schwingt, danach passiert fn */
  function startWork(dur,tx,tz,fn){
    if(busy){return;}
    pl.face=Math.atan2(tx-pl.x,tz-pl.z);pl.walk=0;target=null;keys={};joy.x=joy.z=0;
    busy={t:0,dur:rm()?.25:dur,fn:fn,hit:0};P.ham.visible=true;enterBtn.hidden=true;altBtn.hidden=true;nearKey='';cur=null;
  }
  function work(dt){
    if(!busy){return;}
    busy.t+=dt;
    if(!rm()){P.ham.rotation.x=Math.abs(Math.sin(busy.t*9))*1.4;var hit=Math.floor(busy.t*9/Math.PI);if(hit>busy.hit){busy.hit=hit;puffAt(active(),pl.x+Math.sin(pl.face)*.75,pl.z+Math.cos(pl.face)*.75,3,.16);}}
    if(busy.t>=busy.dur){var f=busy.fn;busy=null;P.ham.visible=false;P.ham.rotation.x=0;nearKey='';f();}
  }
  function buildStep(id,tx,tz){
    var b=built[id];if(!(b<lvl(id)&&b<2)){return;}
    startWork(1.1,tx,tz,function(){
      built[id]=b+1;saveBuilt();
      if(mode==='room'&&room&&room.id===id){roomSync(room,true);}else{syncLevels();}
      
      say(b===0?'Fundament gelegt.':'Die Wände stehen.');
    });
  }
  function placeFurn(RO,k){
    var id=RO.id,sp=RO.spots[k];if(isPlaced(id,k)||built[id]!==2||lvl(id)<3){return;}
    startWork(.6,sp.bx,sp.bz,function(){
      placed[id]|=(1<<k);
      var full=placed[id]===allMask(id);if(full){built[id]=3;}
      saveBuilt();roomSync(RO,true);
      if(full){confetti(RO);say('Alles ausgepackt. '+BYID[id].name+' ist fertig eingerichtet.');}
      else{var left=furnList(id).length-countBits(placed[id]);say(sp.name+' steht. Noch '+left+(left===1?' Karton.':' Kartons.'));}
    });
  }
  function confetti(RO){
    if(rm()){return;}
    for(var i=0;i<40;i++){var m=M(box(.12,.02,.08),mat(BOOKC[i%5]),(Math.random()-.5)*10,3+Math.random()*1.5,(Math.random()-.5)*6,RO.scene,true);m.userData.sc=m.scale.clone();falls.push({m:m,vy:-(1+Math.random()),ph:Math.random()*6,t:0,g:-1,sc:RO.scene});}
  }
  function camRoom(dt,snap){
    var k=camera.aspect<1?1.3:1,a=(snap||rm())?1:Math.min(1,dt*4);
    var tx=Math.max(-3,Math.min(3,pl.x))*(camera.aspect<1?.9:.45),tz=Math.max(-1.2,Math.min(1.6,pl.z))+7.4*k,ty=8.4*k;
    camera.position.x+=(tx-camera.position.x)*a;camera.position.y+=(ty-camera.position.y)*a;camera.position.z+=(tz-camera.position.z)*a;
    camera.lookAt(camera.position.x,.3,camera.position.z-7.4*k-.8);
  }
  function roomAmbient(dt,t){
    var RO=room,still=rm();if(!RO){return;}
    if(RO.mk.visible){RO.mks.position.y=still?1.7:1.7+Math.sin(t*3)*.12;}
    if(still){return;}
    RO.spots.forEach(function(sp){sp.box.position.y=sp.ring.visible?Math.abs(Math.sin(t*4+sp.bx))*.08:0;});
    RO.anim.forEach(function(f){f(dt,t);});
  }

  /* Bäume: Krone als eigene Gruppe, damit sie beim Schütteln wackelt. Die Zettel in der Krone zeigen, dass dort Tipps hängen. */
  function tree(x,z,s){
    var g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);g.userData.tree=trees.length;scene.add(g);pick.push(g);
    M(cyl(.18,.26,1.3,8),mat('wood'),0,.65,0,g);
    var cr=new T.Group();cr.position.y=1.25;g.add(cr);
    M(sph(1.05,14,10),mat('grass-d'),0,.8,0,cr);M(sph(.72,12,9),mat('grass-d'),.55,.35,.3,cr);
    M(box(.22,.16,.02),mat('paper-svg'),-.45,.45,.92,cr,true).rotation.z=.3;M(sph(.1,8,6),mat('roof-2'),.35,1.15,.75,cr,true);
    colliders.push({x:x,z:z,r:.55*s+.1});
    trees.push({g:g,cr:cr,x:x,z:z,s:s,t:9});
  }
  function shake(i){
    var tr=trees[i];if(!tr||tr.t<.9){return;}
    tr.t=0;
    var all=KD.TIPS.map(function(t,i){return i;}),un=all.filter(function(i){return KD.S.data.tips.indexOf(i)<0;}),pool=un.length?un:all,idx=pool[Math.floor(Math.random()*pool.length)];
    KD.S.seeTip(idx);
    var n=rm()?1:6;
    for(var k=0;k<n;k++){
      var m;
      if(k===0){m=M(box(.46,.02,.32),mat('paper-svg'),0,0,0,null,true);}
      else{m=M(sph(.13,8,6),mat('grass-d'),0,0,0,null,true);m.scale.set(1,.3,1.4);}
      var a=Math.random()*Math.PI*2,r=(.2+Math.random()*.7)*tr.s;
      m.position.set(tr.x+Math.cos(a)*r,rm()?.04:(1.9+Math.random()*.6)*tr.s,tr.z+Math.abs(Math.sin(a))*r+.3*tr.s);
      m.userData.sc=m.scale.clone();
      falls.push({m:m,vy:-(.8+Math.random()*.5),ph:Math.random()*6,t:0,g:rm()?0:-1,sc:scene});
    }
    var t=KD.TIPS[idx],th=BYID[t.haus],tm=tipEl.querySelector('.tipc-m');
    tipEl.querySelector('.tipc-t').textContent=t.t;
    KD.clear(tm);if(th){tm.appendChild(KD.h('a',{href:'#haus/'+th.id},'Mehr dazu im Haus: '+th.name));}
    tipEl.querySelector('.tipc-n').textContent='Tipp vom Baum · '+KD.S.data.tips.length+' von '+KD.TIPS.length+' gesammelt';
    tipEl.hidden=false;tipEl.userData={x:pl.x,z:pl.z};
    say('Tipp vom Baum: '+t.t);
  }
  function runFalls(dt){
    trees.forEach(function(tr){
      if(tr.t>=.9){return;}
      tr.t+=dt;var q=Math.min(1,tr.t/.9);
      if(rm()||q>=1){tr.cr.rotation.set(0,0,0);return;}
      tr.cr.rotation.z=Math.sin(tr.t*26)*.16*(1-q);tr.cr.rotation.x=Math.cos(tr.t*21)*.08*(1-q);
    });
    for(var i=falls.length-1;i>=0;i--){
      var f=falls[i],m=f.m;f.t+=dt;
      if(f.g<0){
        m.position.y+=f.vy*dt;m.position.x+=Math.sin(f.t*4+f.ph)*.7*dt;m.rotation.z=Math.sin(f.t*5+f.ph)*.6;m.rotation.y+=dt*1.5;
        if(m.position.y<=.04){m.position.y=.04;m.rotation.z=0;f.g=0;}
      }else{
        f.g+=dt;
        if(f.g>8){var s=1-(f.g-8)/.6;if(s<=0){(f.sc||scene).remove(m);falls.splice(i,1);continue;}m.scale.copy(m.userData.sc).multiplyScalar(s);}
      }
    }
  }
  function buildWorld(){
    var water=new T.Mesh(new T.CircleGeometry(170,48),mat('water'));water.rotation.x=-Math.PI/2;water.position.y=-1.1;scene.add(water);
    M(new T.CylinderGeometry(33.4,31.5,1.4,64),mat('sign'),0,-1.4,0,null,true);
    ground=M(new T.CylinderGeometry(34,33.4,1,64),mat('grass'),0,-.5,0,null,true);pick.push(ground);
    /* Wege: drei Straßen, Verbindungen im Zickzack, Weg zum Start */
    [[0,13.3,44,2.4],[0,-.7,44,2.4],[0,-14.7,44,2.4],[21,6.3,2.4,16.4],[-21,-7.7,2.4,16.4],[0,17.4,2.4,8.6],[25.5,-.7,8,2.4],[-25,-.7,8,2.4]].forEach(function(s){M(rbox(s[2],.06,s[3],.7),mat('path'),s[0],.005,s[1],null,true);});
    M(new T.CylinderGeometry(4.2,4.2,.07,40),mat('path'),0,.035,22.6,null,true);
    /* Brunnen am Start */
    M(cyl(1.4,1.55,.55,28),mat('stone'),0,.28,24);M(cyl(1.15,1.15,.06,28),mat('water'),0,.56,24,null,true);
    M(cyl(.22,.3,1.2,12),mat('stone-d'),0,.6,24);M(sph(.3),mat('roof-1'),0,1.3,24);
    colliders.push({x:0,z:24,r:1.6});
    /* Startschild */
    M(cyl(.08,.1,1.6,8),mat('wood'),3.6,.8,21.6);
    var lc=document.createElement('canvas');lc.width=512;lc.height=128;var tex=cvTex(lc);
    var s=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));s.scale.set(4,1,1);s.position.set(3.6,2.2,21.6);scene.add(s);
    welcome={lc:lc,tex:tex};colliders.push({x:3.6,z:21.6,r:.25});
    [[-24,14],[-21,4],[-24,-11],[-13.5,-27],[-4,-27],[9,-28],[18,-23.5],[24,-11],[24,5],[23,16],[-14,26],[14,26],[0,4,.8],[-9,3.4,.7],[9,3.4,.7],[-4.5,-10.5,.85],[8,-10.5,.85],[-27,-13,.9],[24,-19,.9],[-26,8,.8],[27,10,.8]].forEach(function(t){tree(t[0],t[1],t[2]||1);});
    /* Gleis: liegt von Anfang an. Hauptgleis vor Remise und Bahnhof, Stichgleis in die Remise, Prellbock am Ende. */
    var tx0=-28.5,tx1=-2.6,kk;
    M(box(tx1-tx0,.08,.08),mat('stone-d'),(tx0+tx1)/2,.06,TRACK_Z-.36,null,true);M(box(tx1-tx0,.08,.08),mat('stone-d'),(tx0+tx1)/2,.06,TRACK_Z+.36,null,true);
    for(kk=tx0+.3;kk<tx1;kk+=.75){M(box(.22,.05,1.05),mat('wood'),kk,.03,TRACK_Z,null,true);}
    M(box(.2,.7,1.1),mat('roof-2'),tx1+.1,.35,TRACK_Z);M(box(.5,.16,1.3),mat('wood'),tx1-.05,.62,TRACK_Z,null,true);
    M(box(.08,.08,2.3),mat('stone-d'),-18.36,.06,TRACK_Z-1.25,null,true);M(box(.08,.08,2.3),mat('stone-d'),-17.64,.06,TRACK_Z-1.25,null,true);
    for(kk=0;kk<3;kk++){M(box(1.05,.05,.22),mat('wood'),-18,.03,TRACK_Z-.7-kk*.7,null,true);}
    /* Hafen: Steg ins Wasser mit Pfählen und Pollern, liegt von Anfang an */
    var hx=HARBOUR.px,hz=HARBOUR.pz;
    M(rbox(8.2,.14,1.5,.05),mat('wood'),hx+3.2,-.02,hz,null,true);
    for(kk=0;kk<5;kk++){[-.68,.68].forEach(function(dz){M(cyl(.11,.13,1.5,8),mat('wood'),hx+kk*1.8,-.6,hz+dz,null,true);});}
    [[5.6,-.5],[5.6,.5],[2.4,.5]].forEach(function(q){M(cyl(.12,.14,.4,8),mat('draw'),hx+q[0],.25,hz+q[1]);});
    for(kk=0;kk<3;kk++){M(sph(.2,10,8),mat(kk%2?'paper-svg':'roof-2'),hx+4+kk*1.6,-.95,hz-2.2-kk*.5,null,true);}
    /* Blumen am Wegrand */
    for(var i=0;i<26;i++){var a=i*2.4,r=27+(i%3)*1.4;M(sph(.16,8,6),mat(['roof-2','roof-3','roof-5','paper-svg'][i%4]),Math.cos(a)*r,.16,Math.sin(a)*r,null,true);}
    /* Wolken am Horizont */
    for(i=0;i<7;i++){var cg=new T.Group();cg.position.set(-70+i*22,5+(i%3)*2.5,-48-(i%2)*10);scene.add(cg);
      [[0,0,0,2.4],[2.4,.3,0,1.8],[-2.2,-.2,.3,1.7]].forEach(function(q){M(sph(q[3],12,9),mat('puff'),q[0],q[1],q[2],cg,true);});clouds.push(cg);}
  }

  function buildPlayer(){
    player=new T.Group();scene.add(player);
    var body=new T.Group();player.add(body);P.body=body;
    var lathe=new T.LatheGeometry([new T.Vector2(0,0),new T.Vector2(.34,.04),new T.Vector2(.42,.25),new T.Vector2(.37,.55),new T.Vector2(.2,.72),new T.Vector2(0,.76)],20);
    P.torso=M(lathe,mat(fig),0,.2,0,body);
    M(sph(.36,20,16),mat('skin'),0,1.22,0,body);
    var hair=M(geo('hair',function(){return new T.SphereGeometry(.385,20,12,0,Math.PI*2,0,Math.PI*.52);}),mat('wood'),0,1.24,-.02,body);hair.rotation.x=-.32;
    M(sph(.045,8,6),mat('draw'),-.12,1.25,.32,body,true);M(sph(.045,8,6),mat('draw'),.12,1.25,.32,body,true);
    M(sph(.06,8,6),mat('roof-2'),-.21,1.15,.27,body,true).scale.set(1,.6,.4);M(sph(.06,8,6),mat('roof-2'),.21,1.15,.27,body,true).scale.set(1,.6,.4);
    P.fl=M(sph(.14,10,8),mat('draw'),-.15,.1,0,player);P.fl.scale.set(1,.7,1.3);
    P.fr=M(sph(.14,10,8),mat('draw'),.15,.1,0,player);P.fr.scale.set(1,.7,1.3);
    P.hl=M(sph(.1,10,8),mat('skin'),-.44,.62,0,body);P.hr=M(sph(.1,10,8),mat('skin'),.44,.62,0,body);
    P.ham=new T.Group();P.ham.position.set(.44,.62,.08);body.add(P.ham);M(box(.05,.5,.05),mat('wood'),0,.25,0,P.ham);M(rbox(.24,.13,.13,.03),mat('stone-d'),0,.45,0,P.ham);P.ham.visible=false;
  }

  /* Schilder */
  function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();}
  function board(cv,num,name,dots){
    var x=cv.getContext('2d'),W=cv.width,H=cv.height,fam='Fredoka, Nunito, system-ui, sans-serif',fs=44,pad=num?84:30;
    x.clearRect(0,0,W,H);x.font='600 '+fs+'px '+fam;
    var tw=x.measureText(name).width;
    while(tw>W-pad-34&&fs>24){fs-=2;x.font='600 '+fs+'px '+fam;tw=x.measureText(name).width;}
    var bw=Math.min(W-6,tw+pad+30),bx=(W-bw)/2;
    rr(x,bx,6,bw,H-12,28);x.fillStyle=tok('sign');x.fill();
    x.textBaseline='middle';
    if(num){x.beginPath();x.arc(bx+46,H/2,28,0,Math.PI*2);x.fillStyle=tok('sign-ink');x.fill();x.fillStyle=tok('sign');x.font='700 32px '+fam;x.textAlign='center';x.fillText(String(num),bx+46,H/2+2);}
    x.fillStyle=tok('sign-ink');x.font='600 '+fs+'px '+fam;x.textAlign='left';x.fillText(name,bx+pad,dots?H/2-14:H/2+2);
    if(dots){for(var i=0;i<3;i++){x.beginPath();x.arc(bx+pad+10+i*28,H/2+30,8,0,Math.PI*2);if(dots[i]){x.fillStyle=tok('grass-d');x.fill();}else{x.strokeStyle=tok('sign-ink');x.lineWidth=3;x.stroke();}}}
  }
  function drawLabel(H){board(H.lc,H.h.idx+1,H.h.name,doneOf(H.h.id));H.tex.needsUpdate=true;}
  function drawLabels(){Object.keys(HS).forEach(function(id){drawLabel(HS[id]);HS[id].mkText=null;setMarker(HS[id]);});plates.forEach(drawPlate);Object.keys(rooms).forEach(function(id){drawRoomLabels(rooms[id]);});if(welcome){board(welcome.lc,1,'Dorfplatz',null);welcome.tex.needsUpdate=true;}}

  function applyTheme(){
    if(!scene){return;}
    var n=night();
    Object.keys(mats).forEach(function(k){var m=mats[k];
      if(k.indexOf('glow:')===0){var c=tok(k.slice(5));m.color.set(c);m.emissive.set(c);m.emissiveIntensity=n?.9:.22;}
      else{m.color.set(tok(k));}});
    var sky=tok('sky');scene.background.set(sky);scene.fog.color.set(sky);
    Object.keys(rooms).forEach(function(id){rooms[id].scene.background.set(sky);});
    lightSets.forEach(function(Ls){Ls.h.color.set(n?'#A9B6E6':'#FFFFFF');Ls.h.groundColor.set(n?'#2C3B4C':'#9DB585');Ls.h.intensity=(n?.5:.42)*LI;Ls.s.color.set(n?'#B9C6FF':'#FFF3DE');Ls.s.intensity=(n?.4:.62)*LI;});
    drawLabels();
  }

  function say(t){if(live){live.textContent=t;}}
  /* Vollbild: Der Zustand gehört dem Spiel, nicht dem Element. Beim Betreten eines Hauses wird das 3D-Fenster neu eingesetzt,
     darum geht das echte Vollbild über die ganze Seite (documentElement) und das Fenster füllt sie per CSS. */
  function fsReal(){return !!(document.fullscreenElement||document.webkitFullscreenElement);}
  function fsApply(){
    if(!el){return;}
    el.classList.toggle('fs',fsWanted);
    document.documentElement.classList.toggle('fs-lock',fsWanted);
    if(fsBtn){fsBtn.setAttribute('aria-pressed',fsWanted?'true':'false');fsBtn.textContent=fsWanted?'Vollbild beenden':'Vollbild';}
    resize();
  }
  function setFs(on,quiet){
    fsWanted=!!on;fsApply();
    var d=document.documentElement;
    try{
      if(on&&!fsReal()){var rq=d.requestFullscreen||d.webkitRequestFullscreen;if(rq){var p=rq.call(d);if(p&&p.catch){p.catch(function(){});}}}
      if(!on&&fsReal()){var ex=document.exitFullscreen||document.webkitExitFullscreen;if(ex){var q=ex.call(document);if(q&&q.catch){q.catch(function(){});}}}
    }catch(e){}
    if(!quiet){say(on?'Vollbild an. Mit Escape oder der Taste F beendest du es.':'Vollbild beendet.');}
    if(el&&el.isConnected&&el.focus){el.focus({preventScroll:true});}
  }
  /* Beendet der Browser das Vollbild selbst (Escape), zieht das Spiel nach */
  function onFsChange(){if(fsWanted&&!fsReal()){setFs(false,true);say('Vollbild beendet.');}}
  function go(id){var H=HS[id];if(H){doorFlag=true;KD.app.go(id);}}
  function setLevel(H,l){H.lv[0].visible=l===0;for(var k=1;k<4;k++){H.lv[k].visible=l>=k;H.lv[k].scale.set(1,1,1);}H.spr.position.y=l>=2?H.lh:1.9;}
  function syncLevels(){
    var grew=[];
    Object.keys(HS).forEach(function(id){
      var H=HS[id],l=built[id]<0?lvl(id):built[id],s=shown[id];
      if(s===undefined||l<=s||rm()){setLevel(H,l);}
      else{setLevel(H,s);for(var k=s+1;k<=l;k++){(function(k){growG(H.lv[k],(k-s-1)*.5,k===1?function(){H.lv[0].visible=false;}:null,{sc:scene,x:H.x,z:H.z,w:H.w,d:H.d});})(k);}H.spr.position.y=l>=2?H.lh:1.9;grew.push(H.h.name);}
      drawLabel(H);setMarker(H);
      shown[id]=l;
    });
    if(grew.length&&mode==='village'){say('Gewachsen: '+grew.join(', ')+'.');}
  }
  function growG(g,delay,onStart,dustAt){g.visible=true;g.scale.set(1,.001,1);anims.push({g:g,t:-(delay||0),onStart:onStart,dustAt:dustAt});}
  function dustAround(o){for(var k=0;k<7;k++){var a=k/7*Math.PI*2;var m=M(sph(.3,8,6),mat('puff'),o.x+Math.cos(a)*(o.w/2+.2),.3,o.z+Math.sin(a)*(o.d/2+.2),o.sc,true);dusts.push({m:m,t:0,a:a,sc:o.sc});}}
  function puffAt(sc,x,z,n,s){for(var k=0;k<n;k++){var a=Math.random()*Math.PI*2;var m=M(sph(.3,8,6),mat('puff'),x+Math.cos(a)*.15,.2,z+Math.sin(a)*.15,sc,true);dusts.push({m:m,t:.3,a:a,sc:sc,s:s/.3});}}
  function runAnims(dt){
    for(var i=anims.length-1;i>=0;i--){
      var a=anims[i];a.t+=dt;if(a.t<0){continue;}
      if(!a.started){a.started=true;if(a.onStart){a.onStart();}if(a.dustAt){dustAround(a.dustAt);}}
      var p=Math.min(1,a.t/.75),c1=1.70158,e=1+(c1+1)*Math.pow(p-1,3)+c1*Math.pow(p-1,2);
      a.g.scale.set(1,Math.max(.001,e),1);
      if(p>=1){a.g.scale.set(1,1,1);anims.splice(i,1);}
    }
    for(var j=dusts.length-1;j>=0;j--){var u=dusts[j];u.t+=dt;var q=u.t/.9;
      if(q>=1){u.sc.remove(u.m);dusts.splice(j,1);continue;}
      u.m.scale.setScalar((1-q)*(1+q*1.5)*(u.s||1));u.m.position.x+=Math.cos(u.a)*dt*1.4;u.m.position.z+=Math.sin(u.a)*dt*1.4;u.m.position.y+=dt*.6;}
  }
  function ambient(dt,t){
    var still=rm();
    runFalls(dt);
    if(mode==='room'){roomAmbient(dt,t);return;}
    Object.keys(HS).forEach(function(id){var H=HS[id];if(H.mk.visible){H.mk.position.y=still?2.6:2.6+Math.sin(t*3+H.i)*.12;}});
    puffs.forEach(function(p){var u=p.userData;
      if(still){p.position.y=u.y0+u.o*.9;p.position.x=u.x0;p.scale.setScalar(u.bub?.6:.7);return;}
      var ph=(t*.32+u.o)%1,s=Math.sin(ph*Math.PI);
      p.position.y=u.y0+ph*1.6;p.position.x=u.x0+(u.bub?Math.sin(ph*9)*.08:ph*.35);p.scale.setScalar(u.bub?Math.max(.01,s*.9):.4+s*.75);});
    if(still){return;}
    spinners.forEach(function(g){g.rotation.z+=dt*.7;});
    clouds.forEach(function(c){c.position.x+=dt*.5;if(c.position.x>85){c.position.x=-85;}});
  }

  function resolve(x,z){
    var cols=colliders;
    if(mode==='room'&&room){x=Math.max(-5.55,Math.min(5.55,x));z=Math.max(-3.55,Math.min(3.55,z));cols=room.cols;}
    else{var d=Math.hypot(x,z);if(d>31.5){x*=31.5/d;z*=31.5/d;}}
    for(var n=0;n<2;n++){
      for(var i=0;i<cols.length;i++){
        var c=cols[i];
        if(c.on&&!c.on()){continue;}
        if(c.r){var dx=x-c.x,dz=z-c.z,dd=Math.hypot(dx,dz),m=c.r+R;if(dd<m){if(dd<1e-4){dx=0;dz=1;dd=1;}x=c.x+dx/dd*m;z=c.z+dz/dd*m;}continue;}
        var px=Math.max(c.x-c.hw,Math.min(x,c.x+c.hw)),pz=Math.max(c.z-c.hd,Math.min(z,c.z+c.hd)),ex=x-px,ez=z-pz,e=Math.hypot(ex,ez);
        if(e>=R){continue;}
        if(e>1e-4){x=px+ex/e*R;z=pz+ez/e*R;continue;}
        var l=x-(c.x-c.hw),r=(c.x+c.hw)-x,b=z-(c.z-c.hd),f=(c.z+c.hd)-z,mn=Math.min(l,r,b,f);
        if(mn===l){x=c.x-c.hw-R;}else if(mn===r){x=c.x+c.hw+R;}else if(mn===b){z=c.z-c.hd-R;}else{z=c.z+c.hd+R;}
      }
    }
    return {x:x,z:z};
  }
  function step(dt){
    if(busy){return;}
    var ix=0,iz=0;
    if(keys.l){ix-=1;}if(keys.r){ix+=1;}if(keys.u){iz-=1;}if(keys.d){iz+=1;}
    ix+=joy.x;iz+=joy.z;
    var len=Math.hypot(ix,iz);
    if(len>.08){target=null;if(len>1){ix/=len;iz/=len;}}
    else if(target){var dx=target.x-pl.x,dz=target.z-pl.z,dl=Math.hypot(dx,dz);
      if(dl<.12){target=null;ix=iz=0;}else{var sl=dl<.6?Math.max(.35,dl/.6):1;ix=dx/dl*sl;iz=dz/dl*sl;}}
    else{ix=iz=0;}
    var sp=5.2,mv=Math.hypot(ix,iz);
    if(mv>.01){
      var r=resolve(pl.x+ix*sp*dt,pl.z+iz*sp*dt),moved=Math.hypot(r.x-pl.x,r.z-pl.z);
      if(target&&moved<sp*dt*mv*.2){stuck+=dt;if(stuck>.5){target=null;stuck=0;}}else{stuck=0;}
      pl.x=r.x;pl.z=r.z;
      var df=Math.atan2(ix,iz)-pl.face;while(df>Math.PI){df-=2*Math.PI;}while(df<-Math.PI){df+=2*Math.PI;}
      pl.face+=df*Math.min(1,dt*12);pl.phase+=dt*11*Math.min(1,mv);pl.walk=Math.min(1,mv);
    }else{pl.walk=Math.max(0,pl.walk-dt*6);}
  }
  function animPlayer(t){
    player.position.set(pl.x,0,pl.z);player.rotation.y=pl.face;
    var w=pl.walk,s=Math.sin(pl.phase);
    P.fl.position.z=s*.17*w;P.fr.position.z=-s*.17*w;P.hl.position.z=-s*.14*w;P.hr.position.z=s*.14*w;
    P.body.position.y=rm()?0:Math.abs(s)*.07*w+(w<.1?Math.sin(t*2)*.012:0);
  }
  function cam(dt,snap){if(mode==='room'){camRoom(dt,snap);}else{camVillage(dt,snap);}}
  function camVillage(dt,snap){
    var k=camera.aspect<1?1.35:1,a=(snap||rm())?1:Math.min(1,dt*4);
    camera.position.x+=(pl.x-camera.position.x)*a;camera.position.y+=(OFF.y*k-camera.position.y)*a;camera.position.z+=(pl.z+OFF.z*k-camera.position.z)*a;
    camera.lookAt(camera.position.x,.6,camera.position.z-OFF.z*k-1.2);
  }
  /* Was die Figur gerade tun kann: Haus betreten oder bauen, Baum schütteln, im Raum lesen, lösen, bauen, auspacken, hinausgehen */
  function candidates(){
    var out=[];
    if(mode==='room'&&room){
      var RO=room;
      out.push({key:'x',x:0,z:3.4,r:1.3,auto:.55,label:'Hinaus ins Dorf',say:'Du stehst an der Tür. Mit Enter gehst du hinaus ins Dorf.',fn:function(){location.hash='#dorf';}});
      RO.stations.forEach(function(s,i){out.push({key:'s'+i,x:s.gx,z:s.gz,r:1.2,label:STN[i].act,say:STN[i].say+' Mit Enter öffnest du es.',fn:function(){KD.app.openStep(['f','t','e'][i]);}});});
      return out;
    }
    Object.keys(HS).forEach(function(id){
      var H=HS[id],nm=H.h.name;
      out.push({key:'h:'+id,hid:id,x:H.door.x,z:H.door.z-.35,r:1.9,auto:.6,label:'Eintreten: '+nm,say:'Du stehst vor: '+nm+'. '+H.h.sub+'. Geh durch die Tür oder drück Enter.',fn:function(){go(id);}});
    });
    out.push({key:'platz',x:3.6,z:21.6,r:1.7,label:'Dorfplatz ansehen',say:'Du stehst am Schwarzen Brett. Mit Enter öffnest du den Dorfplatz.',fn:function(){KD.app.go('dorfplatz');}});
    trees.forEach(function(t,i){out.push({key:'t:'+i,tree:i,x:t.x,z:t.z,r:.55*t.s+.1+.95,label:'Baum schütteln',say:'Du stehst bei einem Baum. Mit Enter schüttelst du ihn, dann fällt ein Tipp herunter.',fn:function(){shake(i);}});});
    npcs.forEach(function(n){out.push({key:'n:'+n.d.id,x:n.d.pos[0],z:n.d.pos[1],r:1.7,label:'Ansprechen: '+n.d.name,say:n.d.name+', '+n.d.beruf+'. Mit Enter bekommst du einen Tipp.',fn:function(){keys={};KD.app.npc(n.d.id);}});});
    return out;
  }
  /* Dorfbewohner:innen und Deko. Deko erscheint, wenn Karten in der Dorfrunde sitzen. */
  function buildFolk(){
    KD.NPCS.forEach(function(d){
      var g=new T.Group();g.position.set(d.pos[0],0,d.pos[1]);scene.add(g);
      var lathe=new T.LatheGeometry([new T.Vector2(0,0),new T.Vector2(.34,.04),new T.Vector2(.42,.25),new T.Vector2(.37,.55),new T.Vector2(.2,.72),new T.Vector2(0,.76)],20);
      M(lathe,mat(d.farbe),0,.2,0,g);M(sph(.36,20,16),mat('skin'),0,1.22,0,g);
      M(sph(.045,8,6),mat('draw'),-.12,1.25,.32,g,true);M(sph(.045,8,6),mat('draw'),.12,1.25,.32,g,true);
      M(cyl(.44,.44,.08,20),mat(d.farbe),0,1.56,0,g);M(cyl(.26,.3,.24,20),mat(d.farbe),0,1.7,0,g);
      colliders.push({x:d.pos[0],z:d.pos[1],r:.5});npcs.push({g:g,d:d});
    });
    [[-3,15.6],[3,15.6],[-13,7.2],[13,7.2],[-13,-6.8],[13,-6.8],[-4.5,1.7],[4.5,1.7],[-9,-12.3],[9,-12.3],[-2.6,26],[2.6,26]].forEach(function(p,i){
      var g=new T.Group();g.position.set(p[0],0,p[1]);g.visible=false;scene.add(g);
      if(i%2===0){M(cyl(.06,.08,1.5,8),mat('draw'),0,.75,0,g);M(sph(.2,12,10),glow('lit'),0,1.62,0,g,true);}
      else{[['roof-2',0,0],['roof-3',.3,.15],['roof-5',-.25,.2],['roof-2',.1,-.28]].forEach(function(f){M(cyl(.025,.025,.3,5),mat('grass-d'),f[1],.15,f[2],g,true);M(sph(.14,8,6),mat(f[0]),f[1],.36,f[2],g);});}
      deko.push(g);
    });
  }
  function syncDeko(){var n=Math.min(deko.length,Math.floor(KD.S.boxes()[2]/2));deko.forEach(function(g,i){g.visible=i<n;});}
  function checkNear(){
    /* Tippkarte verschwindet, wenn die Figur weitergeht. In der Sammlung bleibt der Tipp. */
    if(mode==='village'&&!tipEl.hidden&&tipEl.userData&&Math.hypot(pl.x-tipEl.userData.x,pl.z-tipEl.userData.z)>3.5){tipEl.hidden=true;}
    if(busy){return;}
    var best=null,bd=1e9,inAuto=null;
    candidates().forEach(function(c){var dd=Math.hypot(pl.x-c.x,pl.z-c.z);if(dd<c.r&&dd<bd){bd=dd;best=c;}if(c.auto&&dd<c.auto+(armed?0:.7)){inAuto=c;}});
    if(!inAuto){armed=true;}
    else if(armed&&pl.walk>.2){armed=false;keys={};joy.x=joy.z=0;target=null;inAuto.fn();return;}
    var key=best?best.key:'';
    if(key===nearKey){return;}
    nearKey=key;cur=best;near=best&&best.hid?best.hid:null;nearTree=best&&best.tree!==undefined?best.tree:-1;
    if(best){
      enterBtn.textContent=best.label;enterBtn.appendChild(KD.h('span',{class:'k-fine'},' (Enter)'));enterBtn.hidden=false;
      altBtn.hidden=true;
      say(best.say||best.label);
    }else{enterBtn.hidden=true;altBtn.hidden=true;}
  }
  function act(){if(cur&&!busy){cur.fn();}}
  function actAlt(){if(cur&&!busy){(cur.alt||cur).fn();}}
  function tap(cx,cy){
    var r=canvas.getBoundingClientRect(),v=new T.Vector2((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);
    ray.setFromCamera(v,camera);ray.camera=camera;
    var gnd=mode==='room'&&room?room.ground:ground;
    var hits=ray.intersectObjects(mode==='room'&&room?room.pick:pick,true);
    for(var i=0;i<hits.length;i++){
      var o=hits[i].object,v=o;while(v){if(v.visible===false){break;}v=v.parent;}if(v){continue;}
      while(o&&o!==gnd&&!(o.userData&&(o.userData.hid||o.userData.go||o.userData.tree!==undefined))){o=o.parent;}
      if(!o){continue;}
      if(o.userData.go){target={x:o.userData.go.x,z:o.userData.go.z};return;}
      if(o===gnd){target={x:hits[i].point.x,z:hits[i].point.z};if(mode==='room'&&Math.hypot(target.x-1.85,target.z-3.5)<1.3){target={x:0,z:3.45};}return;}
      if(o.userData.hid){var H=HS[o.userData.hid];target={x:H.door.x,z:H.door.z};return;}
      if(o&&o.userData&&o.userData.tree!==undefined){
        var tr=trees[o.userData.tree],vx=pl.x-tr.x,vz=pl.z-tr.z,vl=Math.hypot(vx,vz)||1,rr2=.55*tr.s+.1+R+.3;
        target={x:tr.x+vx/vl*rr2,z:tr.z+vz/vl*rr2};return;
      }
      if(o===ground){target={x:hits[i].point.x,z:hits[i].point.z};return;}
    }
  }
  function bindEvents(){
    var KM={ArrowUp:'u',w:'u',W:'u',ArrowDown:'d',s:'d',S:'d',ArrowLeft:'l',a:'l',A:'l',ArrowRight:'r',d:'r',D:'r'};
    el.addEventListener('keydown',function(e){
      if(e.target!==el){return;}
      var k=KM[e.key];
      if(k){keys[k]=true;target=null;e.preventDefault();return;}
      if((e.key==='Enter'||e.key===' ')&&cur){e.preventDefault();act();return;}
      if((e.key==='e'||e.key==='E')&&cur){e.preventDefault();actAlt();return;}
      if(e.key==='Escape'){if(!tipEl.hidden){tipEl.hidden=true;}else if(fsWanted){e.preventDefault();setFs(false);}return;}
      if(e.key==='f'||e.key==='F'){e.preventDefault();setFs(!fsWanted);return;}
    });
    el.addEventListener('keyup',function(e){var k=KM[e.key];if(k){keys[k]=false;}});
    el.addEventListener('blur',function(){keys={};});
    enterBtn.addEventListener('click',act);altBtn.addEventListener('click',actAlt);
    tipEl.querySelector('.tipc-x').addEventListener('click',function(){tipEl.hidden=true;el.focus({preventScroll:true});});
    var down=null;
    canvas.addEventListener('pointerdown',function(e){if(e.button>0){return;}down={x:e.clientX,y:e.clientY,t:Date.now()};});
    canvas.addEventListener('pointerup',function(e){if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<12&&Date.now()-down.t<700){tap(e.clientX,e.clientY);}down=null;});
    var jid=null,jc=null;
    function jmove(e){var dx=e.clientX-jc.x,dy=e.clientY-jc.y,m=40,l=Math.hypot(dx,dy);if(l>m){dx*=m/l;dy*=m/l;}joyKnob.style.transform='translate('+dx+'px,'+dy+'px)';joy.x=dx/m;joy.z=dy/m;target=null;}
    function jend(e){if(e.pointerId===jid){jid=null;joy.x=joy.z=0;joyKnob.style.transform='';}}
    joyEl.addEventListener('pointerdown',function(e){jid=e.pointerId;try{joyEl.setPointerCapture(jid);}catch(x){}var r=joyEl.getBoundingClientRect();jc={x:r.left+r.width/2,y:r.top+r.height/2};jmove(e);e.preventDefault();});
    joyEl.addEventListener('pointermove',function(e){if(e.pointerId===jid){jmove(e);}});
    joyEl.addEventListener('pointerup',jend);joyEl.addEventListener('pointercancel',jend);
  }
  function resize(){if(!el){return;}var w=el.clientWidth,h=el.clientHeight;if(!w||!h){return;}renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  function frame(now){
    if(!running){return;}
    raf=requestAnimationFrame(frame);
    /* Bewegung in kleinen Schritten (keine Sprünge durch Wände), Animationen nach echter Zeit */
    var raw=clk?Math.min(.5,(now-clk)/1000):0,dt=Math.min(.05,raw);clk=now;tsec+=raw;
    for(var left=raw;left>0;left-=.05){step(Math.min(.05,left));}
    work(raw);animPlayer(tsec);checkNear();runAnims(raw);ambient(raw,tsec);cam(raw,false);
    if(++posTick%12===0){KD.app.pos(pl.x,pl.z,mode==='village');}
    renderer.render(active(),camera);
  }
  function build(){
    T=window.THREE;
    loadBuilt();
    el=document.createElement('div');el.className='world';el.tabIndex=0;
    el.setAttribute('role','application');el.setAttribute('aria-label','KI-Dorf in 3D');el.setAttribute('aria-describedby','worldHelp');
    renderer=new T.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
    canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');el.appendChild(canvas);
    KD.add(el,[KD.h('div',{class:'whelp','aria-hidden':'true'}),
      KD.h('p',{class:'sr',id:'worldHelp'}),KD.h('p',{class:'sr','aria-live':'polite',id:'worldLive'}),
      KD.h('button',{class:'fs-btn',type:'button','aria-pressed':'false'},'Vollbild'),
      KD.h('div',{class:'tipcard',hidden:true},KD.h('p',{class:'tipc-n'}),KD.h('p',{class:'tipc-t'}),KD.h('p',{class:'tipc-m'}),KD.h('button',{type:'button',class:'tipc-x','aria-label':'Schließen'},'×')),
      KD.h('div',{class:'acts'},KD.h('button',{class:'act-alt',type:'button',hidden:true}),KD.h('button',{class:'enter-btn',type:'button',hidden:true})),
      KD.h('div',{class:'joy','aria-hidden':'true'},KD.h('i'))]);
    live=el.querySelector('#worldLive');enterBtn=el.querySelector('.enter-btn');altBtn=el.querySelector('.act-alt');tipEl=el.querySelector('.tipcard');fsBtn=el.querySelector('.fs-btn');
    fsBtn.addEventListener('click',function(){setFs(!fsWanted);});
    document.addEventListener('fullscreenchange',onFsChange);document.addEventListener('webkitfullscreenchange',onFsChange);joyEl=el.querySelector('.joy');joyKnob=joyEl.querySelector('i');
    scene=new T.Scene();scene.background=new T.Color();scene.fog=new T.Fog(0xffffff,60,130);
    camera=new T.PerspectiveCamera(42,1.6,.5,260);
    hemi=new T.HemisphereLight(0xffffff,0x9db585,.42*LI);scene.add(hemi);
    sun=new T.DirectionalLight(0xffffff,.62);sun.position.set(-14,26,16);sun.castShadow=true;
    var sc=sun.shadow.camera;sc.left=-36;sc.right=36;sc.top=36;sc.bottom=-36;sc.near=1;sc.far=90;
    var big=(window.innerWidth||1000)>700;sun.shadow.mapSize.set(big?2048:1024,big?2048:1024);sun.shadow.bias=-.0006;
    scene.add(sun);scene.add(sun.target);lightSets.push({h:hemi,s:sun});
    ray=new T.Raycaster();
    buildWorld();
    HOUSES.forEach(function(h,i){buildHouse(h,i);});
    buildPlayer();
    buildFolk();
    bindEvents();
    applyTheme();
    if(window.ResizeObserver){new ResizeObserver(resize).observe(el);}else{window.addEventListener('resize',resize);}
    if(window.MutationObserver){new MutationObserver(applyTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class','style']});}
    var mq=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');
    if(mq){if(mq.addEventListener){mq.addEventListener('change',applyTheme);}else if(mq.addListener){mq.addListener(applyTheme);}}
    if(document.fonts&&document.fonts.load){document.fonts.load('600 40px Fredoka').then(drawLabels,function(){});}
  }
  function quality(){
    if(!renderer){return;}
    var spar=KD.S.data.set.quality==='spar';
    renderer.setPixelRatio(spar?1:Math.min(window.devicePixelRatio||1,2));
    renderer.shadowMap.enabled=!spar;
    Object.keys(mats).forEach(function(k){mats[k].needsUpdate=true;});
    resize();
  }
  function start(){if(!running&&!paused){running=true;clk=0;raf=requestAnimationFrame(frame);}}
  function stop(){running=false;if(raf){cancelAnimationFrame(raf);raf=0;}keys={};joy.x=joy.z=0;}
  return {
    available:function(){return hasGL&&!!window.THREE&&ready!==false;},
    init:function(){
      if(ready!==null){return ready;}
      try{build();quality();ready=true;}catch(e){ready=false;if(window.console){console.warn('3D-Dorf nicht verfügbar',e);}}
      return ready;
    },
    /* slot = Platzhalter im Dokument, hid = Haus (Innenraum) oder null (Dorf) */
    attach:function(slot,hid){
      if(!this.init()||!slot||!slot.parentNode){this.detach();return false;}
      var hadFocus=document.activeElement===el;
      if(hid){pl.x=0;pl.z=1.5;pl.face=Math.PI;target=null;snapCam=true;}
      else if(lastHid&&HS[lastHid]){var H=HS[lastHid];pl.x=H.door.x;pl.z=H.door.z+.9;pl.face=0;target=null;snapCam=true;}
      armed=false;
      lastHid=hid||null;
      slot.parentNode.replaceChild(el,slot);
      reconcile();
      setMode(hid?'room':'village',hid);
      fsApply();applyTheme();
      if(mode==='room'){roomSync(room,true);}else{syncLevels();syncDeko();}
      near=null;nearTree=-1;nearKey='';cur=null;enterBtn.hidden=true;altBtn.hidden=true;tipEl.hidden=true;
      if(snapCam){cam(0,true);snapCam=false;}
      el.classList.toggle('paused',paused);
      if(paused){renderer.render(active(),camera);}else{start();}
      if(hadFocus||doorFlag){doorFlag=false;el.focus({preventScroll:true});}
      return true;
    },
    detach:function(){if(fsWanted){setFs(false,true);}stop();},
    /* Lernstand hat sich geändert: Häuser und Möbel nachziehen */
    sync:function(){if(!ready||!el||!el.isConnected){return;}reconcile();if(mode==='room'&&room){roomSync(room,true);}else{syncLevels();syncDeko();}},
    pause:function(on){paused=!!on;if(el){el.classList.toggle('paused',paused);}if(paused){stop();}else if(el&&el.isConnected){start();}},
    settings:function(){if(ready){quality();applyTheme();}},
    wantsFocus:function(){return !!el&&document.activeElement===el;},
    focus:function(){if(el&&el.isConnected){el.focus({preventScroll:true});}},
    state:function(){return {x:+pl.x.toFixed(2),z:+pl.z.toFixed(2),mode:mode,cur:cur&&cur.label,running:running,paused:paused,houses:Object.keys(HS).length,npcs:npcs.length};},
    testPlace:function(x,z){pl.x=x;pl.z=z;target=null;}
  };
})();
})();
