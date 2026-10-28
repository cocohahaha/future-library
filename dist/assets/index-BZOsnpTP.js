import{c9 as Jt,S as te,a as ne,e as xt,M as nt,g as T,bZ as Bt,w as Dt,ad as se,aT as ce,cl as ht,cp as wt,ce as Mt,cb as ft,i as Yt,K as Rt,V as $t,H as re,u as ee,p as ie,c8 as Vt,cj as At,cf as le,cg as fe}from"./three-core-BfwYkZj_.js";import{s as Et,x as b,b as I,c as dt,t as pe,r as Zt,l as ue,a as rt,M as Ct,m as st,p as Nt,d as tt,e as Ht,f as _t,g as he,h as kt,Z as de,i as xe,o as ve,z as me,j as ge,k as ye}from"./index-C2Ueyxps.js";import{P as we,W as ze}from"./three-render-DMdaHza0.js";const Ot=new T(-.72,.3,.42).normalize(),It={uSunDir:{value:Ot},uFogSun:{value:new xt(1,.66,.42)},uFogAway:{value:new xt(.52,.57,.68)},uFogDensity:{value:.0013},uFogHeight:{value:125},uTime:{value:0}},Ut=`
  uniform vec3 uSunDir;
  uniform vec3 uFogSun;
  uniform vec3 uFogAway;
  uniform float uFogDensity;
  uniform float uFogHeight;
  vec3 hazeColor( vec3 dir ) {
    float s = max( dot( dir, uSunDir ), 0.0 );
    return mix( uFogAway, uFogSun, pow( s, 3.0 ) );
  }
  // exponential fog whose density falls off as exp(-y / H), integrated along the ray
  float atmFogF( vec3 wp ) {
    float d = length( wp - cameraPosition );
    float h0 = max( cameraPosition.y, 0.0 );
    float h1 = max( wp.y, 0.0 );
    float dh = h1 - h0;
    float k = abs( dh ) > 0.05 ? ( exp( -h0 / uFogHeight ) - exp( -h1 / uFogHeight ) ) * uFogHeight / dh : exp( -h0 / uFogHeight );
    return clamp( 1.0 - exp( -uFogDensity * d * k ), 0.0, 1.0 );
  }
  vec3 atmFog( vec3 col, vec3 wp ) {
    return mix( col, hazeColor( normalize( wp - cameraPosition ) ), atmFogF( wp ) );
  }
`;function ct(r,o={}){const e=o.key||"base";return r.onBeforeCompile=t=>{Object.assign(t.uniforms,It,o.uniforms||{});let h=t.vertexShader,a=t.fragmentShader;h=h.replace("#include <common>",`#include <common>
uniform float uTime;
varying vec3 vAtmW;
${o.vHead||""}`),o.vNormal&&(h=h.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
${o.vNormal}`)),o.vBegin&&(h=h.replace("#include <begin_vertex>",`#include <begin_vertex>
${o.vBegin}`)),h=h.replace("#include <fog_vertex>",`#include <fog_vertex>
      {
        vec4 aw = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          aw = instanceMatrix * aw;
        #endif
        vAtmW = ( modelMatrix * aw ).xyz;
      }
      ${o.vEnd||""}`),a=a.replace("#include <common>",`#include <common>
uniform float uTime;
varying vec3 vAtmW;
${Ut}
${o.fHead||""}`),o.fColor&&(a=a.replace("#include <color_fragment>",`#include <color_fragment>
${o.fColor}`)),o.fRough&&(a=a.replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
${o.fRough}`)),o.fEmissive&&(a=a.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${o.fEmissive}`)),a=a.replace("#include <fog_fragment>",o.additive?"gl_FragColor.rgb *= 1.0 - atmFogF( vAtmW );":"gl_FragColor.rgb = atmFog( gl_FragColor.rgb, vAtmW );"),t.vertexShader=h,t.fragmentShader=a},r.customProgramCacheKey=()=>`ov:${e}`,r}const Me=`
  varying vec3 vDir;
  void main() {
    vDir = position; // the dome is centred on the camera
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`,be=`
  varying vec3 vDir;
  uniform float uTime;
  uniform float uSunDisc;
  uniform float uGround;
  ${Ut}
  float h21( vec2 p ) { return fract( sin( dot( p, vec2( 41.3, 289.1 ) ) ) * 45758.5453 ); }
  float vn( vec2 p ) {
    vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
    return mix( mix( h21( i ), h21( i + vec2( 1, 0 ) ), f.x ), mix( h21( i + vec2( 0, 1 ) ), h21( i + vec2( 1, 1 ) ), f.x ), f.y );
  }
  void main() {
    vec3 d = normalize( vDir );
    float h = d.y;
    float s = max( dot( d, uSunDir ), 0.0 );
    vec3 horizon = hazeColor( d );
    vec3 zenith = vec3( 0.16, 0.27, 0.52 );
    vec3 mid = mix( vec3( 0.52, 0.55, 0.68 ), vec3( 0.95, 0.62, 0.42 ), pow( s, 2.0 ) );
    float t = clamp( h, 0.0, 1.0 );
    vec3 c = mix( horizon, mid, smoothstep( 0.0, 0.16, t ) );
    c = mix( c, zenith, smoothstep( 0.1, 0.85, t ) );
    // forward scattering around the low sun
    c += vec3( 1.0, 0.56, 0.26 ) * pow( s, 10.0 ) * 0.55;
    c += vec3( 1.0, 0.78, 0.5 ) * pow( s, 90.0 ) * 1.4;
    c += vec3( 1.0, 0.86, 0.66 ) * smoothstep( 0.99965, 0.9999, s ) * uSunDisc;
    // a few long, warm-lit cirrus streaks
    vec2 q = d.xz / max( h + 0.12, 0.05 );
    float cl = vn( q * vec2( 1.4, 5.0 ) + vec2( uTime * 0.004, 0.0 ) ) * vn( q * vec2( 3.1, 9.0 ) - 3.7 );
    cl = smoothstep( 0.32, 0.75, cl ) * smoothstep( 0.03, 0.2, h ) * smoothstep( 0.75, 0.25, h );
    c = mix( c, mix( vec3( 1.05, 0.78, 0.62 ), vec3( 1.5, 0.95, 0.6 ), pow( s, 4.0 ) ), cl * 0.45 );
    // below the horizon: the haze (or, for the reflection probe, a dark
    // warm ground, so surfaces facing down get little bounce)
    vec3 below = mix( horizon * 0.92, mix( horizon * 0.5, vec3( 0.07, 0.06, 0.05 ), smoothstep( -0.02, -0.25, h ) ), uGround );
    c = mix( c, below, smoothstep( 0.0, -0.06, h ) );
    gl_FragColor = vec4( c, 1.0 );
  }
`;function oe(r=3600,o=18,e=0){const t=new te({vertexShader:Me,fragmentShader:be,uniforms:{...It,uSunDisc:{value:o},uGround:{value:e}},side:ne,depthWrite:!1,depthTest:!1,fog:!1}),h=new nt(Et(r,48,24),t);return h.frustumCulled=!1,h.renderOrder=-10,h.name="sky",h}function Se(r){const o=new Jt,e=oe(80,6,1);o.add(e);const t=new we(r),h=t.fromScene(o,.02,.1,200);return t.dispose(),e.geometry.dispose(),e.material.dispose(),h.texture}const ke=4.5;function Ce(){const r=(d,l)=>ct(new ft(d),l),o=r({color:1910316,roughness:.06,metalness:.3,envMapIntensity:2.8},{key:"lib-glass",uniforms:{uFloor:{value:ke},uWarm:{value:new xt(1,.62,.32)}},fHead:`
        uniform float uFloor;
        uniform vec3 uWarm;
        float gSlab; float gRoom;
        float h1( vec2 p ) { return fract( sin( dot( p, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ); }
      `,fColor:`
        {
          float fy = ( vAtmW.y - 1.2 ) / uFloor;
          float fr = fract( fy );
          float aa = fwidth( fy ) * 1.5;
          gSlab = smoothstep( 0.86 - aa, 0.86 + aa, fr );
          float bay = floor( ( vAtmW.x + vAtmW.z ) / 6.0 );
          gRoom = 0.35 + 0.65 * step( 0.3, h1( vec2( floor( fy ), bay ) ) );
          diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.56, 0.53, 0.5 ), gSlab );
        }
      `,fRough:`
        roughnessFactor = mix( roughnessFactor, 0.8, gSlab );
        metalnessFactor = mix( metalnessFactor, 0.0, gSlab );
      `,fEmissive:`
        {
          float facing = abs( dot( normal, normalize( vViewPosition ) ) );
          float fr = fract( ( vAtmW.y - 1.2 ) / uFloor );
          float lamp = smoothstep( 0.0, 0.5, fr ) * 0.6 + 0.4;
          totalEmissiveRadiance += uWarm * gRoom * lamp * ( 1.0 - gSlab ) * mix( 0.12, 0.62, facing * facing );
        }
      `}),e=r({color:15130579,roughness:.78,metalness:0},{key:"lib-stone"}),t=r({color:2894376,roughness:.5,metalness:.6},{key:"lib-dark"}),h=r({color:11819322,roughness:.42,metalness:.55,envMapIntensity:1.8},{key:"lib-fins"}),a=r({color:13214826,roughness:.3,metalness:.85,envMapIntensity:2},{key:"lib-brass"}),u=r({vertexColors:!0,roughness:.92,metalness:0},{key:"lib-green"}),f=r({color:15855336,roughness:.55,metalness:.05},{key:"lib-canopy",vHead:"varying float vUpN;",vEnd:"vUpN = normalize( mat3( modelMatrix ) * objectNormal ).y;",fHead:"varying float vUpN;",fColor:`
        {
          vec2 p = vAtmW.xz;
          if ( vUpN < -0.2 ) {
            float s = fract( p.x / 0.9 );
            float aa = fwidth( p.x / 0.9 ) * 1.5;
            float gap = smoothstep( 0.0, aa + 0.08, s ) * smoothstep( 1.0, 0.92 - aa, s );
            diffuseColor.rgb = mix( vec3( 0.16, 0.09, 0.05 ), vec3( 0.62, 0.4, 0.22 ), gap );
          } else {
            vec2 q = vec2( p.x + p.y, p.x - p.y ) / 4.2;
            vec2 g = abs( fract( q ) - 0.5 );
            vec2 aa = fwidth( q ) * 1.2;
            float seam = 1.0 - min( smoothstep( 0.0, aa.x + 0.02, 0.5 - g.x ), smoothstep( 0.0, aa.y + 0.02, 0.5 - g.y ) );
            diffuseColor.rgb *= 1.0 - seam * 0.22;
          }
        }
      `}),c=ct(new Dt({color:new xt(2.6,2.1,1.5)}),{key:"lib-glow"}),x=ct(new Dt({color:new xt(1.5,2.3,2.4)}),{key:"lib-glow"});return{glass:o,stone:e,dark:t,fins:h,brass:a,green:u,canopy:f,glow:c,glowCool:x}}function Fe(r,o,e,t,h,a=8){const u=new Ct,f=[[-r/2,-o/2],[r/2,-o/2],[r/2,o/2],[-r/2,o/2]];for(let c=0;c<4;c++){const x=f[c],d=f[(c+1)%4];let l=d[1]-x[1],v=-(d[0]-x[0]);const m=Math.hypot(l,v);l/=m,v/=m;const n=u.p.length/3;for(let k=0;k<=a;k++){const p=k/a,w=p*e,S=t+(h-t)*p,G=Math.cos(S),i=Math.sin(S),P=(W,C)=>[W*G-C*i,W*i+C*G],F=P(x[0],x[1]),s=P(d[0],d[1]),y=P(l,v);u.v(F[0],w,F[1],y[0],0,y[1],0,w),u.v(s[0],w,s[1],y[0],0,y[1],1,w)}for(let k=0;k<a;k++){const p=n+k*2;u.quad(p,p+2,p+3,p+1)}}return u.build()}function Pe(r,o,e,t,h,a=.7,u=64,f=22){const c=new Ct,x=.45,d=(p,w)=>{const S=r+e*(p*(1-x)+x*p*Math.sqrt(1-w*w/2)),G=o+t*(w*(1-x)+x*w*Math.sqrt(1-p*p/2));return[S,G]},l=(p,w)=>{const G=(h(p+.5,w)-h(p-.5,w))/1,i=(h(p,w+.5)-h(p,w-.5))/(2*.5),P=Math.hypot(G,1,i);return[-G/P,1/P,-i/P]},v=u+1;for(const p of[!0,!1]){const w=c.p.length/3;for(let S=0;S<=f;S++)for(let G=0;G<=u;G++){const[i,P]=d(G/u*2-1,S/f*2-1),F=h(i,P)-(p?0:a),s=l(i,P);p?c.v(i,F,P,s[0],s[1],s[2],i,P):c.v(i,F,P,-s[0],-s[1],-s[2],i,P)}for(let S=0;S<f;S++)for(let G=0;G<u;G++){const i=w+S*v+G;p?c.quad(i,i+v,i+v+1,i+1):c.quad(i,i+1,i+v+1,i+v)}}const m=[];for(let p=0;p<u;p++)m.push([p/u*2-1,-1]);for(let p=0;p<f;p++)m.push([1,p/f*2-1]);for(let p=u;p>0;p--)m.push([p/u*2-1,1]);for(let p=f;p>0;p--)m.push([-1,p/f*2-1]);const n=m.map(([p,w])=>d(p,w)),k=n.length;for(let p=0;p<k;p++){const[w,S]=n[p],[G,i]=n[(p+1)%k];let P=i-S,F=-(G-w);const s=Math.hypot(P,F)||1;P/=s,F/=s;const y=h(w,S),W=h(G,i),C=c.p.length/3;c.v(w,y-a,S,P,0,F,0,0),c.v(G,W-a,i,P,0,F,1,0),c.v(G,W,i,P,0,F,1,1),c.v(w,y,S,P,0,F,0,1),c.quad(C,C+3,C+2,C+1)}return c.build()}function Gt(r,o,e,t,h,a,u,f,c=1){const x=[5204794,6980680,8361045,4151861,9214554];for(let d=0;d<u;d++){const l=f(),v=o+(t-o)*l+(f()-.5)*.8,m=e+(h-e)*l+(f()-.5)*.8,n=(.5+f()*.7)*c,k=b(rt(n*2,n*1.3,n*2,n*.6,1),{t:[v,a+n*.6,m],r:[0,f()*3,0]});r.push(tt(k,x[Math.floor(f()*x.length)]))}}function Ae({tier:r}){const o=Ce(),e={glass:[],stone:[],dark:[],fins:[],brass:[],green:[],canopy:[],glow:[],glowCool:[]},t=(z,N)=>(e[z].push(N),N);let h=4041;const a=()=>(h=h*16807%2147483647)/2147483647,u=r.name==="high";t("stone",b(I(132,1.2,70),{t:[0,.6,-2]}));for(let z=0;z<5;z++)t("stone",b(I(132,1.2-z*.24,.5),{t:[0,(1.2-z*.24)/2,33.25+z*.5]}));t("glass",b(I(110,8,58),{t:[0,1.2+4,-2]}));for(let z=-54;z<=54.01;z+=3)t("dark",b(I(.14,8,.3),{t:[z,5.2,27.1]})),t("dark",b(I(.14,8,.3),{t:[z,5.2,-31.1]}));for(let z=-30;z<=27.01;z+=3)t("dark",b(I(.3,8,.14),{t:[-55.1,5.2,z]})),t("dark",b(I(.3,8,.14),{t:[55.1,5.2,z]}));t("stone",b(I(116,1.3,64),{t:[0,9.85,-2]}));const f=(z,N)=>13.2+1.7*Math.sin(z*.072+.5)*Math.cos((N-46)*.14)+.6*Math.sin(z*.17+N*.09);t("canopy",Pe(0,46,64,17,f,.8,u?80:48,u?26:16));for(const[z,N]of[[-46,40],[-26,50],[-8,38],[12,50],[30,39],[48,49],[-40,55],[38,56]]){t("stone",b(dt(.45,6.5,12,{rTop:.35}),{t:[z,0,N]}));for(let K=0;K<4;K++){const et=K*(Math.PI/2)+.4,_=z+Math.cos(et)*3.4,Q=N+Math.sin(et)*3.4;t("stone",pe([new T(z,6.5-.2,N),new T((z+_)/2,6.5+2.2,(N+Q)/2),new T(_,f(_,Q)-.7,Q)],.2,8))}}const c=0,x=2,d=15,l=10.5,v=55;t("glass",b(dt(d,v-l,64,{caps:!1}),{t:[c,l,x]}));for(let z=0;z<48;z++){const N=z/48*Math.PI*2;t("dark",b(I(.18,v-l,.4),{t:[c+Math.sin(N)*(d+.1),l+(v-l)/2,x+Math.cos(N)*(d+.1)],r:[0,N,0]}))}t("stone",b(Zt(d-1.2,d+.9,0,Math.PI*2,2.2,64),{t:[c,v,x]})),t("glowCool",b(Zt(d-1.6,d-1.15,0,Math.PI*2,.5,64),{t:[c,v+2,x]}));const m=[];for(let z=0;z<=8;z++){const N=z/8*(Math.PI/2);m.push([Math.cos(N)*(d-1.6),Math.sin(N)*3.2])}t("glass",b(ue(m,64),{t:[c,v+2.2,x]}));const n={x0:-57,x1:-19,z0:-28,z1:24,y0:10.5,y1:38};t("dark",b(I(n.x1-n.x0,n.y1-n.y0,n.z1-n.z0),{t:[(n.x0+n.x1)/2,(n.y0+n.y1)/2,(n.z0+n.z1)/2]}));for(let z=n.y0+1.6;z<n.y1-1;z+=3.4)t("glow",b(I(n.x1-n.x0-.6,.35,.1),{t:[(n.x0+n.x1)/2,z,n.z1+.06]})),t("glow",b(I(n.x1-n.x0-.6,.35,.1),{t:[(n.x0+n.x1)/2,z,n.z0-.06]})),t("glow",b(I(.1,.35,n.z1-n.z0-.6),{t:[n.x0-.06,z,(n.z0+n.z1)/2]}));const k=n.y1-n.y0+1.5,p=u?1.1:1.6,w=[[n.x0,n.z1+1.1,1,0,n.x1-n.x0,0,1],[n.x1,n.z0-1.1,-1,0,n.x1-n.x0,0,-1],[n.x0-1.1,n.z0,0,1,n.z1-n.z0,-1,0]];let S=0;for(const[z,N,Z,K,et]of w)for(let _=p/2;_<et;_+=p){S+=p;const Q=.95*Math.sin(S*.085),pt=.95*Math.sin(S*.085+1.9),lt=Math.atan2(Z,K),ut=1+.45*Math.sin(S*.05+1);t("fins",b(Fe(.22,ut,k,Q,pt,u?10:6),{t:[z+Z*_,n.y0-.8,N+K*_],r:[0,lt+Math.PI/2,0]}))}t("stone",b(I(n.x1-n.x0+3.4,.9,n.z1-n.z0+3.4),{t:[(n.x0+n.x1)/2,n.y1+.45,(n.z0+n.z1)/2]})),t("stone",b(I(26,.8,9),{t:[-40,24.4,n.z1+5.6]})),t("glass",b(I(26,1.1,.12),{t:[-40,25.35,n.z1+10]})),Gt(e.green,-52,n.z1+8.6,-28,n.z1+8.6,24.8,u?26:14,a),Gt(e.green,-55,n.z1-1,-21,n.z1-1,38.9,u?30:16,a,1.2),Gt(e.green,-55,n.z0+1.5,-21,n.z0+1.5,38.9,u?24:12,a,1.1),t("glass",b(I(14,30.7,40),{t:[27,10.5+15.35,-1]})),t("stone",b(I(14.6,.8,40.6),{t:[27,41.6,-1]})),[[42,13.6,-14,.1],[44,13.6,4,-.08],[40,13.6,18,.12],[48,20.8,-6,-.12],[45,20.8,13,.06],[44,28,-16,.14],[50,28,2,-.05],[46,35.2,-4,.09],[42,35.2,15,-.1]].forEach(([z,N,Z,K],et)=>{const _=13+et%3*1.6,Q=9.5+et*7%3,pt={t:[z,N,Z],r:[0,K,0]};t("brass",b(rt(_+.6,.7,Q+.6,.3,2),{t:[z,N-2.9,Z],r:[0,K,0]})),t("glass",b(rt(_,5.4,Q,1.6,3),pt)),t("brass",b(rt(_+.6,.7,Q+.6,.3,2),{t:[z,N+2.9,Z],r:[0,K,0]}));const lt=[];Gt(lt,-_/2+1.5,-Q/2+1.5,_/2-1.5,Q/2-1.5,0,u?9:5,a,.9);for(const ut of lt)e.green.push(b(ut,{t:[z,N+3.25,Z],r:[0,K,0]}))});const i={x0:-50,x1:66,z0:-14,z1:12,y0:41.6,y1:50};t("stone",b(I(i.x1-i.x0,i.y1-i.y0,i.z1-i.z0),{t:[(i.x0+i.x1)/2,(i.y0+i.y1)/2,(i.z0+i.z1)/2]})),t("glow",b(I(i.x1-i.x0-10,1.1,.12),{t:[(i.x0+i.x1)/2+2,i.y0+4.2,i.z1+.04]})),t("dark",b(I(i.x1-i.x0-9.6,.18,.5),{t:[(i.x0+i.x1)/2+2,i.y0+3.55,i.z1+.2]}));const P=10,F=(i.x1-i.x0)/P,s=3.4,y=i.z0+.8,W=i.z1-.8;for(let z=0;z<P;z++){const N=i.x0+F*z+.25,Z=i.x0+F*(z+1)-.25,K=Z-N,et=Math.hypot(K,s),_=new Ct,Q=-s/et,pt=K/et,lt=_.v(N,0,W,Q,pt,0,0,0),ut=_.v(Z,s,W,Q,pt,0,K,0),gt=_.v(Z,s,y,Q,pt,0,K,W-y),St=_.v(N,0,y,Q,pt,0,0,W-y);_.quad(lt,ut,gt,St);const Tt=_.v(N,0,W,0,0,1,0,0),Lt=_.v(Z,0,W,0,0,1,K,0),qt=_.v(Z,s,W,0,0,1,K,s);_.tri(Tt,Lt,qt);const g=_.v(N,0,y,0,0,-1,0,0),M=_.v(Z,0,y,0,0,-1,K,0),A=_.v(Z,s,y,0,0,-1,K,s);_.tri(g,A,M),t("stone",b(_.build(),{t:[0,i.y1,0]})),t("glass",b(I(.16,s,W-y),{t:[Z+.08,i.y1+s/2,(y+W)/2]}))}t("dark",b(I(18,.3,i.z1-i.z0-1),{t:[i.x1-9,i.y0-.15,(i.z0+i.z1)/2]})),Gt(e.green,i.x0+2,i.z1-.6,i.x1-2,i.z1-.6,i.y1,u?30:16,a,.7);const C=new Bt;C.name="library";for(const[z,N]of Object.entries(e)){if(!N.length)continue;const Z=new nt(st(N),o[z]);Z.castShadow=z!=="glow"&&z!=="glowCool",Z.receiveShadow=z!=="glow"&&z!=="glowCool",Z.name=`library-${z}`,C.add(Z)}const H=u?140:70,U=Nt(.7,.95);b(U,{r:[Math.PI/2,0,0]});const D=new Float32Array(H*4);for(let z=0;z<H;z++)D[z*4]=a()*Math.PI*2,D[z*4+1]=a()*(d-3),D[z*4+2]=a(),D[z*4+3]=.7+a()*.6;const ot=ct(new Dt({color:new xt(1.9,1.6,1.15),transparent:!0,depthWrite:!1,blending:ce,side:se}),{key:"lib-slips",additive:!0,uniforms:{uOrigin:{value:new T(c,v+1,x)}},vHead:`
        attribute vec4 aSeed;
        uniform vec3 uOrigin;
        varying float vFade;
      `,vBegin:`
        {
          float life = fract( aSeed.z + uTime * 0.018 * aSeed.w );
          float h = life * 70.0;
          float a = aSeed.x + life * 2.2;
          float r = aSeed.y * ( 1.0 + life * 1.6 );
          vec3 c = uOrigin + vec3( sin( a ) * r + life * life * 26.0, h, cos( a ) * r + life * life * 9.0 );
          float spin = uTime * ( 0.6 + aSeed.w ) + aSeed.x * 3.0;
          float cs = cos( spin ), sn = sin( spin );
          vec3 p = transformed;
          p = vec3( p.x * cs - p.z * sn, p.y, p.x * sn + p.z * cs );
          float tilt = 0.4 * sin( uTime * 1.3 + aSeed.x * 5.0 );
          p = vec3( p.x, p.y * cos( tilt ) - p.z * sin( tilt ), p.y * sin( tilt ) + p.z * cos( tilt ) );
          transformed = c + p * ( 0.6 + 0.4 * smoothstep( 0.0, 0.1, life ) );
          vFade = smoothstep( 0.0, 0.06, life ) * smoothstep( 1.0, 0.55, life );
        }
      `,fHead:"varying float vFade;",fColor:"diffuseColor.rgb *= vFade; diffuseColor.a *= vFade;"}),$=new ht(U,ot,H);$.geometry.setAttribute("aSeed",new wt(D,4));const X=new Mt;for(let z=0;z<H;z++)$.setMatrixAt(z,X.matrix);$.frustumCulled=!1,$.renderOrder=2,C.add($);const bt={well:new T(c,v+6,x),provenance:new T(n.x0-2,30,n.z1-6),dialogue:new T(52,38.5,8),quiet:new T(30,i.y1+4.5,-2),verify:new T(4,15.8,54)},vt={well:{target:new T(c,34,x),radius:120,phi:.95},provenance:{target:new T(-40,24,0),radius:120,theta:-.55,phi:1.2},dialogue:{target:new T(42,26,0),radius:115,theta:1.35,phi:1.2},quiet:{target:new T(10,45,0),radius:135,phi:1.05},verify:{target:new T(0,8,40),radius:105,theta:.25,phi:1.22}};return{group:C,anchors:bt,focus:vt,materials:o,footprint:{x0:-66,x1:66,z0:-37,z1:62}}}const q={px:96,pz:84,ox:48,oz:42,street:18},V={x0:-135,z0:-117,x1:135,z1:117},Ge=Math.atan2(-.72,.42);function We(r){let o=r;return()=>(o=o*16807%2147483647)/2147483647}function Te(){return ct(new ft({color:16777215,roughness:.7,metalness:0,envMapIntensity:2.2}),{key:"towers",vHead:`
      attribute vec4 aStyle;
      attribute vec3 aFlat;
      attribute vec3 aFace;
      varying vec4 vStyle;
      varying vec3 vLoc;
      varying vec3 vNl;
    `,vEnd:`
      vec3 sz = vec3( length( instanceMatrix[ 0 ].xyz ), length( instanceMatrix[ 1 ].xyz ), length( instanceMatrix[ 2 ].xyz ) );
      vLoc = aFlat * sz;
      vNl = aFace;
      vStyle = aStyle;
    `,fHead:`
      varying vec4 vStyle;
      varying vec3 vLoc;
      varying vec3 vNl;
      float tGlass; float tLit; vec3 tWarm; float tRough; float tGreen;
      float th( vec3 p ) { p = fract( p * vec3( 0.1031, 0.103, 0.0973 ) ); p += dot( p, p.yxz + 33.33 ); return fract( ( p.x + p.y ) * p.z ); }
      float band( float x, float a, float b, float aa ) { return smoothstep( a - aa, a + aa, x ) * ( 1.0 - smoothstep( b - aa, b + aa, x ) ); }
    `,fColor:`
      {
        float style = vStyle.x;
        float seed = vStyle.y;
        float wall = 1.0 - step( 0.5, abs( vNl.y ) );
        float u = abs( vNl.x ) > 0.5 ? vLoc.z : vLoc.x;
        float fh = style < 0.5 ? 3.9 : style < 1.5 ? 3.2 : style < 2.5 ? 4.2 : style < 3.5 ? 3.4 : 4.4;
        float bw = style < 0.5 ? 1.8 : style < 1.5 ? 3.6 : style < 2.5 ? 1.3 : style < 3.5 ? 2.4 : 3.0;
        vec2 g = vec2( u / bw, vAtmW.y / fh );
        vec2 cell = floor( g );
        vec2 f = fract( g );
        vec2 aa = fwidth( g ) * 1.2;
        float m;
        if ( style < 0.5 ) m = band( f.y, 0.24, 0.98, aa.y ) * band( f.x, 0.05, 0.97, aa.x );
        else if ( style < 1.5 ) m = band( f.y, 0.3, 0.86, aa.y ) * band( f.x, 0.2, 0.8, aa.x );
        else if ( style < 2.5 ) m = band( f.x, 0.3, 0.96, aa.x ) * band( f.y, 0.04, 0.98, aa.y );
        else if ( style < 3.5 ) m = band( f.y, 0.36, 0.94, aa.y ) * band( f.x, 0.02, 0.99, aa.x );
        else m = band( f.y, 0.4, 0.97, aa.y ) * band( f.x, 0.03, 0.97, aa.x );
        // far away the grid is sub-pixel: use its average coverage instead
        float cover = style < 0.5 ? 0.68 : style < 1.5 ? 0.34 : style < 2.5 ? 0.62 : style < 3.5 ? 0.56 : 0.55;
        m = mix( m, cover, smoothstep( 0.25, 0.7, max( aa.x, aa.y ) ) );
        // ground floor: shopfronts
        float shop = 1.0 - smoothstep( 5.2, 5.6, vAtmW.y );
        m = mix( m, band( f.x, 0.03, 0.97, aa.x ) * 0.95, shop );
        tGlass = m * wall;
        float r = th( vec3( cell, seed * 97.0 ) );
        tLit = step( r, vStyle.z ) * tGlass;
        tLit = max( tLit, shop * tGlass * step( 0.25, r ) );
        float k = th( vec3( cell.yx, seed * 31.0 + 4.0 ) );
        tWarm = mix( vec3( 1.0, 0.58, 0.26 ), vec3( 1.0, 0.82, 0.6 ), k ) * ( 0.5 + 1.1 * k * k );
        vec3 wallC = diffuseColor.rgb;
        // glass, tinted per tower: cool blue-grey, sea green, bronze or
        // champagne (the warm ones turn gold in the low sun); a little
        // lighter toward the top, where it holds more sky
        float gk = th( vec3( seed * 113.0, 7.0, 3.0 ) );
        vec3 glassT = gk < 0.34 ? vec3( 0.22, 0.31, 0.4 ) : gk < 0.56 ? vec3( 0.16, 0.3, 0.3 ) : gk < 0.8 ? vec3( 0.42, 0.3, 0.19 ) : vec3( 0.52, 0.45, 0.34 );
        glassT *= 0.85 + 0.3 * smoothstep( 20.0, 220.0, vAtmW.y );
        vec3 glassC = mix( glassT, wallC * 0.6 + vec3( 0.04, 0.06, 0.08 ), style < 0.5 ? 0.12 : 0.25 );
        tRough = 0.05 + 0.16 * th( vec3( seed * 71.0, 1.0, 9.0 ) );
        // leafy noise for the farms' planted floors and the roof gardens
        float leaf = th( vec3( floor( vAtmW.xz / 1.4 ), floor( vAtmW.y / 1.4 ) ) );
        vec3 greenC = mix( vec3( 0.12, 0.2, 0.06 ), vec3( 0.32, 0.4, 0.13 ), leaf );
        tGreen = 0.0;
        if ( style > 3.5 ) {
          wallC = mix( greenC, wallC, band( f.y, 0.33, 0.4, aa.y ) );
          tGreen = 1.0 - tGlass;
          // magenta-white grow lights on most floors
          tWarm = mix( vec3( 1.0, 0.45, 0.75 ), vec3( 1.0, 0.85, 0.75 ), step( 0.6, k ) ) * 0.9;
          tLit = tGlass * step( 0.3, th( vec3( cell.y, seed * 17.0, 2.0 ) ) );
        }
        vec3 roofC = wallC * 0.55;
        if ( vStyle.w > 0.5 ) {
          // planted roof with paths
          vec2 rp = abs( fract( vAtmW.xz / 7.0 ) - 0.5 );
          float path = step( 0.44, max( rp.x, rp.y ) );
          roofC = mix( greenC * 1.15, vec3( 0.42, 0.39, 0.34 ), path );
          if ( wall < 0.5 ) tGreen = 1.0 - path;
        }
        diffuseColor.rgb = wall > 0.5 ? mix( wallC, glassC, tGlass ) : roofC;
      }
    `,fRough:`
      roughnessFactor = mix( mix( 0.72, 0.95, tGreen ), tRough, tGlass );
      metalnessFactor = mix( 0.0, 0.8, tGlass );
    `,fEmissive:`
      totalEmissiveRadiance += tWarm * tLit * 0.9;
      {
        vec3 sv = normalize( ( viewMatrix * vec4( uSunDir, 0.0 ) ).xyz );
        vec3 rv = reflect( normalize( -vViewPosition ), normal );
        float gl = pow( max( dot( rv, sv ), 0.0 ), 10.0 ) * step( 0.0, dot( normal, sv ) );
        totalEmissiveRadiance += vec3( 1.0, 0.6, 0.3 ) * gl * tGlass * 1.3;
      }
    `})}const Xt=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]],Kt=r=>[[-.5+r,-.5],[.5-r,-.5],[.5,-.5+r],[.5,.5-r],[.5-r,.5],[-.5+r,.5],[-.5,.5-r],[-.5,-.5+r]],je=r=>Array.from({length:r},(o,e)=>[-Math.sin(e/r*Math.PI*2)*.5,Math.cos(e/r*Math.PI*2)*.5]);function Wt(r,o,{smooth:e=!1,arc:t=!1}={}){const h=new Ct,a=[],u=[],f=r.length,c=[0];for(let l=0;l<f;l++)c.push(c[l]+Math.hypot(r[(l+1)%f][0]-r[l][0],r[(l+1)%f][1]-r[l][1]));const x=(l,v,m,n)=>(a.push(...m),u.push(...n),h.v(l[0],l[1],l[2],v[0],v[1],v[2],0,0));for(const l of o){const v=([p,w,S,G=0,i=0],P,F)=>{const s=Math.cos(S),y=Math.sin(S);return{p:[G+(P*s-F*y)*w,p,i+(P*y+F*s)*w],f:[G+P*w,p,i+F*w],ca:s,sa:y}};for(let p=0;p<f;p++){const w=r[p],S=r[(p+1)%f];let G=S[1]-w[1],i=-(S[0]-w[0]);const P=Math.hypot(G,i);G/=P,i/=P;const F=h.p.length/3;for(const s of l)for(const[y,W]of[[w,p],[S,p+1]]){const C=v(s,y[0],y[1]);let H=G,U=i;if(e){const ot=Math.hypot(y[0],y[1])||1;H=y[0]/ot,U=y[1]/ot}const D=[H*C.ca-U*C.sa,0,H*C.sa+U*C.ca];t?x(C.p,D,[c[W],s[0],0],[0,0,1]):x(C.p,D,C.f,[G,0,i])}for(let s=0;s<l.length-1;s++){const y=F+s*2;h.quad(y,y+2,y+3,y+1)}}const m=l[l.length-1],n=x([m[3]||0,m[0],m[4]||0],[0,1,0],[m[3]||0,m[0],m[4]||0],[0,1,0]),k=r.map(([p,w])=>{const S=v(m,p,w);return x(S.p,[0,1,0],S.f,[0,1,0])});for(let p=0;p<f;p++)h.tri(n,k[(p+1)%f],k[p])}const d=h.build();return d.setAttribute("aFlat",new Vt(a,3)),d.setAttribute("aFace",new Vt(u,3)),d}function Ne(){const r=[];for(let o=0;o<=10;o++)r.push([o/10,1-.12*(o/10),o/10*1.2]);return{box:Wt(Xt,[[[0,1,0],[1,1,0]]]),taper:Wt(Kt(.13),[[[0,1,0],[1,.6,0]]]),twist:Wt(Kt(.09),[r]),round:Wt(je(20),[[[0,1,0],[1,.84,0]]],{smooth:!0,arc:!0}),stepped:Wt(Xt,[[[0,1,0],[.5,1,0]],[[.5,.78,0,.08,-.07],[.78,.78,0,.08,-.07]],[[.78,.52,0,-.06,.05],[1,.52,0,-.06,.05]]])}}function Re(){return ct(new ft({color:16777215,roughness:.9,metalness:0}),{key:"ground",uniforms:{uPitch:{value:new $t(q.px,q.pz)},uOff:{value:new $t(q.ox,q.oz)},uSite:{value:new Rt(V.x0,V.z0,V.x1,V.z1)}},fHead:`
      uniform vec2 uPitch;
      uniform vec2 uOff;
      uniform vec4 uSite;
      float gh( vec2 p ) { return fract( sin( dot( p, vec2( 27.1, 61.7 ) ) ) * 43758.5453 ); }
      float gn( vec2 p ) { vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( gh( i ), gh( i + vec2( 1, 0 ) ), f.x ), mix( gh( i + vec2( 0, 1 ) ), gh( i + vec2( 1, 1 ) ), f.x ), f.y ); }
      float gRough;
      float band2( float x, float a, float b ) { return step( a, x ) * step( x, b ); }
    `,fColor:`
      {
        vec2 p = vAtmW.xz;
        vec2 c = mod( p - uOff, uPitch );
        c = min( c, uPitch - c );
        vec2 aa = fwidth( p ) * 1.2;
        float site = step( uSite.x, p.x ) * step( p.x, uSite.z ) * step( uSite.y, p.y ) * step( p.y, uSite.w );
        float rx = 1.0 - smoothstep( 6.0 - aa.x, 6.0 + aa.x, c.x );
        float rz = 1.0 - smoothstep( 6.0 - aa.y, 6.0 + aa.y, c.y );
        float wx = 1.0 - smoothstep( 9.0 - aa.x, 9.0 + aa.x, c.x );
        float wz = 1.0 - smoothstep( 9.0 - aa.y, 9.0 + aa.y, c.y );
        float road = max( rx, rz ) * ( 1.0 - site );
        float walk = max( wx, wz ) * ( 1.0 - road ) * ( 1.0 - site );
        float n = gn( p * 0.35 ) * 0.5 + gn( p * 2.3 ) * 0.5;
        vec3 asphalt = vec3( 0.05, 0.05, 0.055 ) * ( 0.85 + 0.3 * n );
        // lane lines and zebra crossings
        float dashX = ( 1.0 - smoothstep( 0.1, 0.1 + aa.x, abs( c.x ) ) ) * step( 0.5, fract( p.y / 9.0 ) ) * step( 9.5, c.y );
        float dashZ = ( 1.0 - smoothstep( 0.1, 0.1 + aa.y, abs( c.y ) ) ) * step( 0.5, fract( p.x / 9.0 ) ) * step( 9.5, c.x );
        float zebX = rx * band2( c.y, 9.6, 13.0 ) * step( 0.5, fract( p.x / 1.1 ) );
        float zebZ = rz * band2( c.x, 9.6, 13.0 ) * step( 0.5, fract( p.y / 1.1 ) );
        float mark = clamp( max( max( dashX * rx, dashZ * rz ), max( zebX, zebZ ) ), 0.0, 1.0 );
        mark *= 1.0 - smoothstep( 0.4, 1.0, max( aa.x, aa.y ) );
        asphalt = mix( asphalt, vec3( 0.62, 0.6, 0.55 ), mark * 0.8 );
        vec3 pave = vec3( 0.34, 0.32, 0.29 ) * ( 0.9 + 0.2 * n );
        vec3 yard = mix( vec3( 0.13, 0.16, 0.09 ), vec3( 0.3, 0.28, 0.24 ), step( 0.55, gn( p * 0.08 ) ) ) * ( 0.85 + 0.3 * n );
        vec3 col = mix( yard, pave, walk );
        col = mix( col, asphalt, road );
        diffuseColor.rgb = mix( col, vec3( 0.42, 0.4, 0.37 ), site );
        gRough = mix( 0.95, 0.75, road );
      }
    `,fRough:"roughnessFactor = gRough;"})}function Ee(r,o){const e=Math.hypot(r,o),t=Math.atan2(r,o);let h=Math.abs(t-Ge);h=Math.min(h,Math.PI*2-h);const a=h<.7?Math.max(14,e/3.6):1e9,u=18+Math.max(0,e-170)*.28;return Math.min(a,u)}function Ie({tier:r,rnd:o,bridges:e}){const t=r.name==="high"?12:7,h=[],a=[],u=[],f=[[15262940,3],[14275270,2],[4871776,0],[7109252,0],[9411491,0],[13219740,2],[12160362,1],[10985623,2],[3095106,0],[14472906,3],[15789800,2],[6121328,0]],c=[],x=v=>{const m=o();return v>70?m<.22?"twist":m<.44?"taper":m<.62?"round":m<.8?"stepped":"box":v>34?m<.2?"stepped":m<.32?"round":m<.42?"taper":"box":"box"},d=(v,m,n,k,p,w,S)=>{const[G,i]=f[Math.floor(o()*f.length)];let P=o()<.25?Math.floor(o()*4):i;const F=o(),s=.04+o()*.16,y=x(p);(y==="twist"||y==="round")&&(n=k=Math.min(n,k)),y!=="box"&&P===1&&(P=0),p>30&&o()<.08&&(P=4);const W=y==="stepped"||P===4||o()<.3?1:0,C={x:v,z:m,w:n,d:k,h:p,y:w,style:P,seed:F,lit:s,color:G,kind:y,garden:W};if(h.push(C),y!=="box"&&y!=="stepped"&&p>80&&o()<.55){const D=y==="taper"?.6:.84;c.push({x:v,z:m,r:Math.min(n,k)*D*.09,h:p*(.16+o()*.16),y:w+p})}if(y!=="box")return C;if(p>55&&o()<.7){const D=.62+o()*.2,ot=Math.min(S-(w+p),p*(.15+o()*.25));ot>6&&h.push({x:v,z:m,w:n*D,d:k*D,h:ot,y:w+p,style:P,seed:F,lit:s,color:G,kind:y,garden:W})}const H=h[h.length-1],U=W?0:1+Math.floor(o()*3);for(let D=0;D<U;D++)a.push({x:H.x+(o()-.5)*H.w*.5,z:H.z+(o()-.5)*H.d*.5,w:3+o()*6,d:3+o()*6,h:2+o()*3,y:H.y+H.h});return C},l=(v,m,n)=>{const k=Math.max(v.z-v.d/2,m.z-m.d/2),p=Math.min(v.z+v.d/2,m.z+m.d/2),w=Math.min(v.h,m.h);if(p-k<12||w<40)return;const S=v.x,G=m.x,i=w>90&&o()<.5?2:1;for(let P=0;P<i;P++){const F=n+w*(i===2?P?.78:.45:.55+o()*.25);h.push({x:(S+G)/2,z:(k+p)/2,w:G-S,d:Math.min(9,p-k-3),h:7.5,y:F,style:0,seed:o(),lit:.5,color:15262940,kind:"box",garden:1})}};for(let v=-t;v<=t;v++)for(let m=-t;m<=t;m++){if(Math.abs(v)<=1&&Math.abs(m)<=1)continue;const n=v*q.px,k=m*q.pz,p=q.px-q.street-2,w=q.pz-q.street-2,S=Math.hypot(n,k);if(S>t*q.px*1.02)continue;const G=Ee(n,k),i=Math.exp(-((n-520)**2+(k+560)**2)/(2*380**2)),P=24+70*Math.min(1,Math.max(0,(S-200)/600))+170*i,F=(C=1)=>Math.min(G,Math.max(10,P*C*(.45+o()*.9)));if(o()<.07&&S>250){u.push({x:n,z:k,w:p,d:w});continue}const s=e.find(C=>C.cell[0]===v&&C.cell[1]===m),y=s?s.y:o()<.55?6+Math.floor(o()*3)*3.5:0;y>0&&h.push({x:n,z:k,w:p,d:w,h:y,y:0,style:0,seed:o(),lit:.6,color:12169894,kind:"box",garden:o()<.4?1:0});const W=o();if(W<.38){const C=26+o()*16,H=22+o()*14;d(n+(o()-.5)*(p-C)*.8,k+(o()-.5)*(w-H)*.8,C,H,F(1.25),y,G)}else if(W<.72){const C=[-1,1].map(H=>{const U=p/2-4-o()*6,D=20+o()*(w-26);return d(n+H*p*.25,k+(o()-.5)*(w-D)*.7,U,D,F(1),y,G)});l(C[0],C[1],y)}else for(const C of[-1,1])for(const H of[-1,1]){const U=p/2-3-o()*8,D=w/2-3-o()*7;d(n+C*p*.25,k+H*w*.25,U,D,F(.6),y,G)}}return{list:h,roof:a,parks:u,spires:c,N:t}}function Qt(r,o,e,t){const h=[];for(const a of Object.keys(e)){const u=r.filter(c=>(c.kind||"box")===a);if(!u.length)continue;const f=Le(u,o,e[a]);f.name=`${t}-${a}`,h.push(f)}return h}function Le(r,o,e){const t=new ht(e.clone(),o,r.length),h=new Float32Array(r.length*4),a=new Mt,u=new xt;return r.forEach((f,c)=>{a.position.set(f.x,f.y,f.z),a.scale.set(f.w,f.h,f.d),a.updateMatrix(),t.setMatrixAt(c,a.matrix),t.setColorAt(c,u.set(f.color)),h.set([f.style,f.seed,f.lit,f.garden||0],c*4)}),t.geometry.setAttribute("aStyle",new wt(h,4)),t.instanceColor.needsUpdate=!0,t.castShadow=!0,t.receiveShadow=!0,t.computeBoundingSphere(),t}function qe(){const r=tt(b(dt(.22,3.4,5,{rTop:.16,caps:!1}),{t:[0,0,0]}),4864556),o=[[0,4.6,0,2.3],[.9,4,.5,1.6],[-.8,4.2,-.6,1.7],[.1,5.7,-.2,1.5]].map(([e,t,h,a])=>tt(b(Et(a,6,4),{t:[e,t,h],s:[1,.85,1]}),16777215));return st([r,...o])}function He(){return ct(new ft({vertexColors:!0,roughness:.85,metalness:0}),{key:"trees",vBegin:`
      {
        vec3 ip = instanceMatrix[ 3 ].xyz;
        float sway = smoothstep( 2.5, 7.0, position.y );
        transformed.x += sin( uTime * 1.1 + ip.x * 0.13 + ip.z * 0.07 ) * 0.18 * sway;
        transformed.z += cos( uTime * 0.9 + ip.z * 0.11 ) * 0.12 * sway;
      }
    `})}function _e(r,o,e){const t=new Mt,h=new xt,a=[6126140,7309893,5139256,8163664,9079358,11569722,6979391];o.forEach(([u,f,c],x)=>{t.position.set(u,0,f),t.rotation.set(0,e()*6.28,0),t.scale.setScalar(c),t.updateMatrix(),r.setMatrixAt(x,t.matrix),h.set(a[Math.floor(e()*a.length)]),r.setColorAt(x,h)}),r.count=o.length,r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0)}const De=`
  uniform sampler2D tReflect;
  uniform float uHasReflect;
  uniform mat4 uTexMat;
  uniform float uTime;
  varying vec3 vW;
  ${Ut}
  float wh( vec2 p ) { return fract( sin( dot( p, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ); }
  float wn( vec2 p ) { vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
    return mix( mix( wh( i ), wh( i + vec2( 1, 0 ) ), f.x ), mix( wh( i + vec2( 0, 1 ) ), wh( i + vec2( 1, 1 ) ), f.x ), f.y ); }
  vec3 skyApprox( vec3 d ) {
    float h = max( d.y, 0.0 );
    vec3 hz = hazeColor( d );
    vec3 zen = vec3( 0.16, 0.27, 0.52 );
    return mix( hz, zen, smoothstep( 0.05, 0.8, h ) );
  }
  void main() {
    vec2 p = vW.xz;
    float t = uTime;
    vec2 g = vec2( wn( p * 0.9 + t * 0.35 ) - wn( p * 0.9 - vec2( 3.1, 1.7 ) - t * 0.3 ),
                   wn( p * 1.3 + vec2( 7.0, 2.0 ) + t * 0.27 ) - wn( p * 1.1 - t * 0.33 ) );
    g += 0.5 * vec2( wn( p * 3.7 + t ), wn( p * 3.3 - t * 1.1 ) ) - 0.25;
    vec3 n = normalize( vec3( g.x * 0.08, 1.0, g.y * 0.08 ) );
    vec3 v = normalize( vW - cameraPosition );
    vec3 r = reflect( v, n );
    float fres = 0.04 + 0.96 * pow( 1.0 - max( dot( -v, n ), 0.0 ), 5.0 );
    vec3 refl = skyApprox( r );
    if ( uHasReflect > 0.5 ) {
      vec4 uvp = uTexMat * vec4( vW, 1.0 );
      vec2 uv = uvp.xy / uvp.w + n.xz * 0.025;
      refl = texture2D( tReflect, uv ).rgb;
    }
    // the sun's glitter path
    float sp = pow( max( dot( r, uSunDir ), 0.0 ), 700.0 ) * 40.0;
    vec3 deep = vec3( 0.025, 0.05, 0.055 );
    vec3 c = mix( deep, refl, clamp( fres + 0.35, 0.0, 1.0 ) ) + vec3( 1.0, 0.78, 0.5 ) * sp;
    gl_FragColor = vec4( atmFog( c, vW ), 1.0 );
  }
`,Oe=`
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4( position, 1.0 );
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;function Be(r){const o=new ze(4,4,{type:re,depthBuffer:!0,generateMipmaps:!1}),e=new ee,t=new Yt,h=new ie,a=new Rt,u=new Rt,f=new T,c=new T,x=new T,d=new T(0,1,0);return{rt:o,texMat:t,setSize(l,v){o.setSize(Math.max(2,Math.round(l*r)),Math.max(2,Math.round(v*r)))},render(l,v,m,n,k,p){const w=new T(0,n,0);f.copy(w).sub(m.position).reflect(d).negate().add(w),c.set(0,0,-1).applyQuaternion(m.quaternion).add(m.position),x.copy(w).sub(c).reflect(d).negate().add(w),e.position.copy(f),e.up.set(0,1,0).applyQuaternion(m.quaternion).reflect(d),e.lookAt(x),e.far=m.far,e.updateMatrixWorld(),e.projectionMatrix.copy(m.projectionMatrix),t.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),t.multiply(e.projectionMatrix).multiply(e.matrixWorldInverse),h.setFromNormalAndCoplanarPoint(d,w).applyMatrix4(e.matrixWorldInverse),a.set(h.normal.x,h.normal.y,h.normal.z,h.constant);const S=e.projectionMatrix.elements;u.x=(Math.sign(a.x)+S[8])/S[0],u.y=(Math.sign(a.y)+S[9])/S[5],u.z=-1,u.w=(1+S[10])/S[14],a.multiplyScalar(2/a.dot(u)),S[2]=a.x,S[6]=a.y,S[10]=a.z+1,S[14]=a.w,e.projectionMatrixInverse.copy(e.projectionMatrix).invert(),k.forEach(F=>F.visible=!1);const G=p.position.clone();p.position.copy(e.position);const i=l.getRenderTarget(),P=l.shadowMap.autoUpdate;l.shadowMap.autoUpdate=!1,l.setRenderTarget(o),l.clear(),l.render(v,e),l.setRenderTarget(i),l.shadowMap.autoUpdate=P,p.position.copy(G),k.forEach(F=>F.visible=!0)}}}function Ye(){const r=[];for(let t=-1400;t<=180;t+=20)r.push(new T(t,13.2,-126));for(let t=1;t<12;t++){const h=t/12*(Math.PI/2);r.push(new T(180+Math.sin(h)*60,13.2,-66-Math.cos(h)*60))}for(let t=-66;t<=1400;t+=20)r.push(new T(240,13.2,t));const e=[0];for(let t=1;t<r.length;t++)e.push(e[t-1]+r[t].distanceTo(r[t-1]));return{pts:r,total:e[e.length-1],at(t,h,a){t=Math.max(0,Math.min(e[e.length-1]-.001,t));let u=0,f=e.length-1;for(;f-u>1;){const x=u+f>>1;e[x]<=t?u=x:f=x}const c=(t-e[u])/(e[f]-e[u]);return h.lerpVectors(r[u],r[f],c),a&&a.subVectors(r[f],r[u]).normalize(),h}}}function Ue({renderer:r,tier:o,library:e}){const t=We(9173),h=o.name==="high",a=new Bt;a.name="city";const u=(g,M)=>ct(new ft(g),{key:M}),f={concrete:u({color:14209736,roughness:.8},"c-concrete"),paving:ct(new ft({color:14274495,roughness:.85}),{key:"c-paving",fColor:`
        {
          vec2 p = vAtmW.xz;
          vec2 q = vec2( p.x / 1.6 + 0.5 * step( 0.5, fract( p.y / 1.6 ) ), p.y / 0.8 );
          vec2 g = abs( fract( q ) - 0.5 );
          vec2 aa = fwidth( q ) * 1.2;
          float j = 1.0 - min( smoothstep( 0.0, aa.x + 0.03, 0.5 - g.x ), smoothstep( 0.0, aa.y + 0.03, 0.5 - g.y ) );
          j *= 1.0 - smoothstep( 0.3, 0.8, max( aa.x, aa.y ) );
          float stripe = step( 0.92, fract( ( p.x + p.y * 0.0 ) / 12.0 ) );
          float tone = fract( sin( dot( floor( q ), vec2( 12.9, 78.2 ) ) ) * 43758.5 );
          diffuseColor.rgb *= ( 0.92 + 0.12 * tone ) * ( 1.0 - j * 0.28 );
          diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.36, 0.33, 0.3 ), stripe * 0.6 );
        }
      `}),lawn:ct(new ft({color:6257210,roughness:.95}),{key:"c-lawn",fColor:`
        {
          vec2 p = vAtmW.xz;
          float n = fract( sin( dot( floor( p * 1.5 ), vec2( 12.9, 78.2 ) ) ) * 43758.5 );
          float m = 0.5 + 0.5 * sin( p.x * 0.11 + sin( p.y * 0.07 ) * 2.0 );
          diffuseColor.rgb *= 0.82 + 0.16 * n + 0.14 * m;
        }
      `}),glass:u({color:2766396,roughness:.06,metalness:.4,envMapIntensity:2.4},"c-glass"),metal:u({color:9211793,roughness:.35,metalness:.8},"c-metal"),roofUnits:u({color:10131343,roughness:.7},"c-roof"),green:u({vertexColors:!0,roughness:.92},"c-green"),train:ct(new ft({color:15987180,roughness:.25,metalness:.3,vertexColors:!0}),{key:"c-train",fEmissive:"totalEmissiveRadiance += vec3( 1.0, 0.75, 0.45 ) * step( vColor.r, 0.02 ) * 1.4;"})},c=new nt(Nt(9e3,9e3),Re());c.receiveShadow=!0,c.position.y=-.02,a.add(c);const d=Ie({tier:o,rnd:t,bridges:[{cell:[-2,0],y:10.5},{cell:[2,-1],y:10.5}]}),l=Ne(),v=Te(),m=Qt(d.list,v,l,"towers");if(a.add(...m),d.spires.length){const g=new ht(dt(.5,1,8,{rTop:.03}),f.metal,d.spires.length),M=new Mt;d.spires.forEach((A,j)=>{M.position.set(A.x,A.y-.5,A.z),M.scale.set(A.r*2,A.h,A.r*2),M.updateMatrix(),g.setMatrixAt(j,M.matrix)}),g.castShadow=!0,g.computeBoundingSphere(),g.name="spires",a.add(g)}let n=null;{const g=b(I(1,1,1),{t:[0,.5,0]}),M=new ht(g,f.roofUnits,d.roof.length),A=new Mt;d.roof.forEach((j,O)=>{A.position.set(j.x,j.y,j.z),A.scale.set(j.w,j.h,j.d),A.updateMatrix(),M.setMatrixAt(O,A.matrix)}),M.castShadow=!0,M.receiveShadow=!0,M.computeBoundingSphere(),M.name="roof-plant",a.add(M),n=M}let k=null;{const g=[],M=d.N*q.px+60;for(let A=0;A<(h?900:420);A++){const j=t()*Math.PI*2,O=M+Math.pow(t(),.7)*2200,J=Math.sin(j)*O,L=Math.cos(j)*O,R=Math.exp(-((J-520)**2+(L+560)**2)/(2*900**2)),E=20+t()*70+160*R*t(),B=t(),Y=E<45?"box":B<.25?"taper":B<.45?"round":B<.6?"twist":B<.72?"stepped":"box",at=20+t()*40,mt=Y==="round"||Y==="twist"?at:20+t()*40;g.push({x:J,z:L,w:at,d:mt,h:E,y:0,style:Math.floor(t()*3)===1?0:Math.floor(t()*4),seed:t(),lit:.2,color:[12104360,10134440,13222840][Math.floor(t()*3)],kind:Y,garden:0})}k=Qt(g,v,l,"towers-far");for(const A of k)A.castShadow=!1,A.receiveShadow=!1,a.add(A)}e.footprint,a.add(Object.assign(new nt(b(Nt(V.x1-V.x0,V.z1-V.z0),{t:[0,.03,0]}),f.paving),{receiveShadow:!0}));const p=[[-104,-84,46,50],[104,-84,46,50],[-106,78,42,60],[106,78,42,60],[-104,4,30,60],[104,4,30,60]],w=[],S=[];for(const[g,M,A,j]of p)w.push(b(Ht(_t(A,j,9,5),.45),{t:[g,0,M]})),S.push(b(Ht(_t(A+1.2,j+1.2,9.5,5),.5),{t:[g,0,M]}));const G=new nt(st(w),f.lawn);G.receiveShadow=!0,G.position.y=.08,a.add(G),a.add(Object.assign(new nt(st(S),f.concrete),{receiveShadow:!0,castShadow:!0}));const i={x:0,z:86,w:124,d:24,y:.32},P=st([b(I(i.w+2.4,.7,1.2),{t:[0,.35,i.z-i.d/2-.6]}),b(I(i.w+2.4,.7,1.2),{t:[0,.35,i.z+i.d/2+.6]}),b(I(1.2,.7,i.d),{t:[-124/2-.6,.35,i.z]}),b(I(1.2,.7,i.d),{t:[i.w/2+.6,.35,i.z]})]);a.add(Object.assign(new nt(P,f.concrete),{castShadow:!0,receiveShadow:!0}));const F=h?Be(.5):null,s=new te({vertexShader:Oe,fragmentShader:De,uniforms:{...It,tReflect:{value:F?F.rt.texture:null},uHasReflect:{value:F?1:0},uTexMat:{value:F?F.texMat:new Yt}}}),y=new nt(b(Nt(i.w,i.d),{t:[i.x,i.y,i.z]}),s);y.name="water",a.add(y);const W=14,C=ct(new ft({color:15266548,roughness:.2,transparent:!0,opacity:.55,depthWrite:!1}),{key:"c-jets",vBegin:`
      {
        vec3 ip = instanceMatrix[ 3 ].xyz;
        float k = 0.55 + 0.45 * sin( uTime * 1.6 + ip.x * 0.21 );
        transformed.y *= k;
        transformed.xz *= 1.0 + ( 1.0 - k ) * 0.6 * smoothstep( 0.7, 1.0, position.y / 4.0 );
      }
    `}),H=new ht(dt(.14,4.2,8,{rTop:.05}),C,W);{const g=new Mt;for(let M=0;M<W;M++)g.position.set(-52+104*M/(W-1),i.y,i.z),g.updateMatrix(),H.setMatrixAt(M,g.matrix);H.computeBoundingSphere()}a.add(H);const U=[];for(const[g,M,A,j]of p){const O=Math.round(A*j/(h?110:190));for(let J=0;J<O;J++)U.push([g+(t()-.5)*(A-8),M+(t()-.5)*(j-8),.8+t()*.55])}for(let g=-108;g<=108;g+=9)U.push([-128,g,.95+t()*.2]),U.push([128,g,.95+t()*.2]);for(let g=-120;g<=120;g+=10)Math.abs(g)>20&&U.push([g,-110,.9+t()*.2]);for(let g=-60;g<=60;g+=10)U.push([g,104,.85+t()*.25]),U.push([g+5,68,.75+t()*.2]);const D=h?620:360,ot=h?13:20;for(let g=-8;g<=8;g++){const M=q.ox+g*q.px,A=q.oz+g*q.pz;for(let j=-D;j<=D;j+=ot)for(const O of[-7.6,7.6]){const J=[M+O,j],L=[j,A+O];for(const[R,E]of[J,L]){if(Math.hypot(R,E)>D||R>V.x0-4&&R<V.x1+4&&E>V.z0-4&&E<V.z1+4)continue;const B=Math.abs(((R-q.ox)%q.px+q.px)%q.px),Y=Math.abs(((E-q.oz)%q.pz+q.pz)%q.pz);Math.min(B,q.px-B)<10&&Math.min(Y,q.pz-Y)<10||t()<.18||U.push([R,E,.7+t()*.3])}}}for(const g of d.parks){const M=Math.round(g.w*g.d/160);for(let A=0;A<M;A++)U.push([g.x+(t()-.5)*g.w,g.z+(t()-.5)*g.d,.9+t()*.5])}const $=qe(),X=He(),bt=[];for(const g of[!0,!1]){const M=U.filter(([j,O])=>Math.hypot(j,O)<300===g),A=new ht($,X,M.length);_e(A,M,t),A.castShadow=g,A.receiveShadow=!0,A.computeBoundingSphere(),A.name=g?"trees":"trees-far",a.add(A),bt.push(A)}{const g=d.parks.map(M=>b(Ht(_t(M.w,M.d,6,4),.3),{t:[M.x,0,M.z]}));g.length&&a.add(Object.assign(new nt(st(g),f.lawn),{receiveShadow:!0}))}const vt=[],z=[],N=[],Z=(g,M,A,j=18)=>{const O=new Ct;let J=0;const L=2;for(let B=0;B<g.length;B++){const Y=g[B],at=g[Math.min(g.length-1,B+1)],mt=g[Math.max(0,B-1)],it=at.x-mt.x,yt=at.z-mt.z,Ft=Math.hypot(it,yt)||1,Pt=-yt/Ft,jt=it/Ft;B&&(J+=Y.distanceTo(g[B-1])),O.v(Y.x+Pt*M/2,Y.y,Y.z+jt*M/2,0,1,0,0,J),O.v(Y.x-Pt*M/2,Y.y,Y.z-jt*M/2,0,1,0,M,J)}for(let B=0;B<g.length-1;B++){const Y=B*L;O.quad(Y,Y+2,Y+3,Y+1)}const R=O.build();vt.push(R);let E=0;for(let B=0;B<g.length-1;B++){const Y=g[B],at=g[B+1],mt=Y.distanceTo(at),it=Y.clone().add(at).multiplyScalar(.5),yt=Math.atan2(at.x-Y.x,at.z-Y.z),Ft=Math.atan2(at.y-Y.y,Math.hypot(at.x-Y.x,at.z-Y.z));vt.push(b(I(M,.9,mt+.05),{t:[it.x,it.y-.46,it.z],r:[-Ft,yt,0]}));for(const Pt of[-1,1]){const jt=Math.cos(yt)*Pt*(M/2-.1),ae=-Math.sin(yt)*Pt*(M/2-.1);z.push(b(I(.08,1.1,mt),{t:[it.x+jt,it.y+.55,it.z+ae],r:[-Ft,yt,0]}))}E+=mt,E>j&&A(it)>3&&(E=0,vt.push(b(dt(.45,it.y-.9,10),{t:[it.x,0,it.z]})))}};Z([new T(-58,10.5,4),new T(-100,10.5,4),new T(-150,10.5,4),new T(-158,10.5,4)],7,()=>10);const K=he([new T(56,10.5,18),new T(78,10.5,30),new T(104,10.5,30),new T(122,10.5,8),new T(150,10.5,-30),new T(170,10.5,-42)],10);Z(K,9,()=>10,16);for(let g=2;g<K.length-2;g+=2){const M=K[g],A=K[g+1],j=Math.atan2(A.x-M.x,A.z-M.z);for(const O of[-1,1]){const J=[],L=Math.cos(j)*O*3.2,R=-Math.sin(j)*O*3.2,E=.6+t()*.6;J.push(tt(b(rt(E*2,E*1.2,E*2,E*.6,1),{t:[M.x+L,10.5+E*.6,M.z+R]}),[6126140,8163664,9079358][Math.floor(t()*3)])),N.push(...J)}}Z([new T(0,10.5,-37),new T(0,11.4,-80),new T(0,12.6,-118)],8,()=>10,20),a.add(Object.assign(new nt(st(vt),f.concrete),{castShadow:!0,receiveShadow:!0})),a.add(new nt(st(z),f.glass)),N.length&&a.add(Object.assign(new nt(st(N),f.green),{castShadow:!0}));const et=Ye();{const g=[];for(let L=0;L<et.pts.length-1;L++){const R=et.pts[L],E=et.pts[L+1],B=R.distanceTo(E),Y=R.clone().add(E).multiplyScalar(.5),at=Math.atan2(E.x-R.x,E.z-R.z);g.push(b(rt(7.2,1.5,B+.1,.4,1),{t:[Y.x,R.y-.95,Y.z],r:[0,at,0]})),L%2===0&&(g.push(b(dt(.8,R.y-1.6,10,{rTop:.65}),{t:[R.x,0,R.z]})),g.push(b(rt(5,.9,2,.3,1),{t:[R.x,R.y-1.9,R.z],r:[0,at,0]})))}a.add(Object.assign(new nt(st(g),f.concrete),{castShadow:!0,receiveShadow:!0}));const M=[];for(const L of[-1,1])M.push(b(I(84,.6,4),{t:[0,12.6,-126+L*6]}));for(let L=-40;L<=40;L+=10)for(const R of[-1,1])M.push(b(dt(.25,7.5,8),{t:[L,12.9,-126+R*7.4]}));a.add(Object.assign(new nt(st(M),f.metal),{castShadow:!0}));const A=new Ct,j=40,O=8;for(let L=0;L<=O;L++)for(let R=0;R<=j;R++){const E=-44+88*R/j,B=-135+18*L/O,Y=20.4+1.6*Math.cos((B+126)/9*(Math.PI/2))-4e-4*E*E;A.v(E,Y,B,0,1,0,E,B)}for(let L=0;L<O;L++)for(let R=0;R<j;R++){const E=L*(j+1)+R;A.quad(E,E+j+1,E+j+2,E+1)}const J=A.build();J.computeVertexNormals(),a.add(Object.assign(new nt(J,f.glass),{castShadow:!0}))}const _=4,Q=17,pt=(()=>{const g=tt(rt(3.1,3.3,Q,1.1,2),16777215),M=tt(b(rt(3.16,1,Q-2.4,.3,1),{t:[0,.35,0]}),1712168),A=tt(b(I(2.6,.5,Q-1),{t:[0,-1.8,0]}),3355443);return b(st([g,M,A]),{t:[0,1.95,0]})})(),lt=new ht(pt,f.train,_*2);lt.castShadow=!0,lt.frustumCulled=!1,a.add(lt);const ut=new T,gt=new T,St=new Mt;function Tt(g){for(let M=0;M<2;M++){const A=M?-1:1,j=21,O=et.total,J=((g*j+M*O*.37)%O+O)%O;for(let L=0;L<_;L++){let R=A>0?J-L*(Q+.8):O-J+L*(Q+.8);R=Math.max(1,Math.min(O-1,R)),et.at(R,ut,gt);const E=-gt.z,B=gt.x;St.position.set(ut.x+E*1.9*A,ut.y-.2,ut.z+B*1.9*A),St.rotation.set(0,Math.atan2(gt.x,gt.z),0),St.updateMatrix(),lt.setMatrixAt(M*_+L,St.matrix)}}lt.instanceMatrix.needsUpdate=!0}Tt(0);const Lt=[y,...bt,n,...k];let qt=0;return{group:a,water:y,reflector:F,path:et,pool:i,towers:m,update(g,M,A,j,O,J=[]){Tt(g),F&&qt++%2===0&&F.render(M,A,j,i.y,Lt.concat(J),O)},resize(g,M){F&&F.setSize(g,M)}}}const zt=Math.PI;function $e(r){let o=r;return()=>(o=o*16807%2147483647)/2147483647}function Ve(){const r=tt(b(rt(.34,.86,.22,.08,1),{t:[0,.43,0]}),2763310),o=tt(b(rt(.46,.66,.28,.12,1),{t:[0,1.2,0]}),16777215),e=tt(b(Et(.12,8,6),{t:[0,1.66,0]}),13148296);return st([r,o,e])}function Ze(){return ct(new ft({vertexColors:!0,roughness:.8}),{key:"life-people",vHead:`
      attribute vec4 aWalk;  // centre x, centre z, heading, half length
      attribute vec4 aGait;  // speed m/s, phase, ground y, cloth hue
      varying float vHue;
      float pYaw; float pPh; float pMove;
    `,vNormal:`
      pMove = step( 0.01, aGait.x );
      pPh = aGait.y + uTime * aGait.x / max( aWalk.w, 0.5 );
      pYaw = aWalk.z + ( cos( pPh ) >= 0.0 ? 0.0 : 3.14159265 );
      {
        float cs = cos( pYaw ), sn = sin( pYaw );
        objectNormal = vec3( objectNormal.x * cs + objectNormal.z * sn, objectNormal.y, -objectNormal.x * sn + objectNormal.z * cs );
      }
      vHue = aGait.w;
    `,vBegin:`
      {
        float s = sin( pPh ) * aWalk.w * pMove;
        vec2 d = vec2( sin( aWalk.z ), cos( aWalk.z ) );
        vec2 c = aWalk.xy + d * s;
        float cyc = uTime * aGait.x * 2.4 + aGait.y * 7.0;
        vec3 p = transformed;
        if ( p.y < 0.86 ) p.z += sin( cyc + ( p.x > 0.0 ? 0.0 : 3.14159 ) ) * 0.22 * ( 0.86 - p.y ) * pMove;
        p.y += abs( sin( cyc ) ) * 0.035 * pMove;
        float cs = cos( pYaw ), sn = sin( pYaw );
        p = vec3( p.x * cs + p.z * sn, p.y, -p.x * sn + p.z * cs );
        transformed = vec3( c.x, aGait.z, c.y ) + p * 1.15;
      }
    `,fHead:`
      varying float vHue;
      vec3 cloth( float h ) {
        vec3 a = vec3( 0.75, 0.32, 0.18 ), b = vec3( 0.18, 0.3, 0.5 ), c = vec3( 0.85, 0.82, 0.76 ), d = vec3( 0.55, 0.6, 0.35 ), e = vec3( 0.9, 0.7, 0.3 );
        return h < 0.2 ? a : h < 0.4 ? b : h < 0.62 ? c : h < 0.8 ? d : e;
      }
    `,fColor:"if ( vColor.r > 0.97 && vColor.b > 0.97 ) diffuseColor.rgb = cloth( vHue );"})}function Xe(){const r=tt(b(rt(1.9,.75,4.5,.3,1),{t:[0,.6,0]}),16777215),o=tt(b(rt(1.7,.6,2.5,.25,1),{t:[0,1.2,-.2]}),1777700),e=kt(tt(b(I(1.5,.18,.1),{t:[0,.72,2.26]}),16777215),.5),t=kt(tt(b(I(1.6,.16,.1),{t:[0,.78,-2.26]}),16777215),1);return st([kt(r,0),kt(o,0),e,t])}function Ke(){return ct(new ft({vertexColors:!0,roughness:.3,metalness:.5}),{key:"life-cars",uniforms:{uSite:{value:new Rt(V.x0-4,V.z0-4,V.x1+4,V.z1+4)}},vHead:`
      attribute vec4 aCar;   // axis (0: runs along z), line coordinate, speed (signed), phase
      attribute float aDelay;
      varying float vGlow;
      uniform vec4 uSite;
      float cYaw;
      vec2 cPos;
    `,vNormal:`
      {
        float L = 2400.0;
        float s = mod( aCar.w + uTime * aCar.z, L ) - L * 0.5;
        cPos = aCar.x < 0.5 ? vec2( aCar.y, s ) : vec2( s, aCar.y );
        cYaw = aCar.x < 0.5 ? ( aCar.z > 0.0 ? 0.0 : 3.14159265 ) : ( aCar.z > 0.0 ? 1.5707963 : -1.5707963 );
        float cs = cos( cYaw ), sn = sin( cYaw );
        objectNormal = vec3( objectNormal.x * cs + objectNormal.z * sn, objectNormal.y, -objectNormal.x * sn + objectNormal.z * cs );
      }
      vGlow = aDelay;
    `,vBegin:`
      {
        float cs = cos( cYaw ), sn = sin( cYaw );
        vec3 p = transformed;
        p = vec3( p.x * cs + p.z * sn, p.y, -p.x * sn + p.z * cs );
        // no streets inside the civic superblock
        float inSite = step( uSite.x, cPos.x ) * step( cPos.x, uSite.z ) * step( uSite.y, cPos.y ) * step( cPos.y, uSite.w );
        transformed = vec3( cPos.x, 0.0, cPos.y ) + p * ( 1.0 - inSite );
      }
    `,fHead:"varying float vGlow;",fEmissive:`
      totalEmissiveRadiance += vec3( 1.0, 0.92, 0.75 ) * 3.0 * step( 0.25, vGlow ) * step( vGlow, 0.75 );
      totalEmissiveRadiance += vec3( 1.0, 0.08, 0.04 ) * 2.2 * step( 0.9, vGlow );
    `})}function Qe(){const r=[tt(rt(1.1,.34,1.1,.12,1),3159098)];for(let o=0;o<4;o++){const e=zt/4+o*zt/2,t=Math.sin(e)*.95,h=Math.cos(e)*.95;r.push(tt(b(I(.12,.08,1.3),{t:[t/2,0,h/2],r:[0,e,0]}),3159098)),r.push(tt(b(dt(.42,.04,12),{t:[t,.12,h]}),9080982))}return r.push(kt(tt(b(Et(.2,8,6),{t:[0,-.28,0]}),16777215),1)),st(r.map(o=>o.attributes.aDelay?o:kt(o,0)))}function Je(){return ct(new ft({vertexColors:!0,roughness:.4,metalness:.6}),{key:"life-drones",vHead:`
      attribute vec4 aFly;   // centre x, centre z, radius (negative: straight run of that half length), altitude
      attribute vec4 aFly2;  // angular speed, phase, heading for runs, light hue
      attribute float aDelay;
      varying float vGlow;
      varying vec2 vBlink;
      float dYaw;
      vec3 dPos;
    `,vNormal:`
      {
        float ph = aFly2.y + uTime * aFly2.x;
        if ( aFly.z > 0.0 ) {
          dPos = vec3( aFly.x + sin( ph ) * aFly.z, aFly.w + sin( ph * 3.0 ) * 1.5, aFly.y + cos( ph ) * aFly.z );
          dYaw = ph + 1.5707963 * sign( aFly2.x );
        } else {
          float s = sin( ph ) * -aFly.z;
          dPos = vec3( aFly.x + sin( aFly2.z ) * s, aFly.w + sin( ph * 2.0 ) * 2.0, aFly.y + cos( aFly2.z ) * s );
          dYaw = aFly2.z + ( cos( ph ) >= 0.0 ? 0.0 : 3.14159265 );
        }
        float cs = cos( dYaw ), sn = sin( dYaw );
        objectNormal = vec3( objectNormal.x * cs + objectNormal.z * sn, objectNormal.y, -objectNormal.x * sn + objectNormal.z * cs );
      }
      vGlow = aDelay;
      vBlink = vec2( step( 0.72, fract( uTime * 0.9 + aFly2.y ) ), aFly2.w );
    `,vBegin:`
      {
        float cs = cos( dYaw ), sn = sin( dYaw );
        vec3 p = transformed * 1.6;
        p = vec3( p.x * cs + p.z * sn, p.y, -p.x * sn + p.z * cs );
        transformed = dPos + p;
      }
    `,fHead:"varying float vGlow; varying vec2 vBlink;",fEmissive:`
      {
        vec3 lc = vBlink.y < 0.33 ? vec3( 1.0, 0.12, 0.08 ) : vBlink.y < 0.66 ? vec3( 0.2, 1.0, 0.45 ) : vec3( 1.0, 0.95, 0.85 );
        totalEmissiveRadiance += lc * step( 0.5, vGlow ) * ( 0.6 + 9.0 * vBlink.x );
      }
    `})}function to({tier:r}){const o=r.name==="high",e=$e(2207),t=new Bt;t.name="life";const h=(c,x)=>!(c<V.x0+2||c>V.x1-2||x<V.z0+2||x>V.z1-2||c>-67&&c<67&&x>-38&&x<36||c>-64&&c<64&&x>72&&x<100),a=[],u=o?700:300;let f=0;for(;a.length<u*.72&&f++<2e4;){const c=V.x0+e()*(V.x1-V.x0),x=V.z0+e()*(V.z1-V.z0),d=Math.exp(-((x-60)**2)/(2*40**2));if(e()>.35+.65*d)continue;const l=e()*zt*2,v=e()<.18?0:3+e()*16;!h(c+Math.sin(l)*v,x+Math.cos(l)*v)||!h(c-Math.sin(l)*v,x-Math.cos(l)*v)||!h(c,x)||a.push([c,x,l,v,v?1.1+e()*.5:0,e()*6.28,.05,e()])}for(let c=0;c<u*.08;c++){const x=e()<.5,d=e(),l=4+e()*10;x?a.push([-70-d*80,4+(e()-.5)*5,zt/2,l,1.2+e()*.4,e()*6.28,10.5,e()]):a.push([(e()-.5)*6,-50-d*60,0,l,1.2+e()*.4,e()*6.28,11.2+d,e()])}for(;a.length<u;){const c=e()<.5,x=Math.floor(e()*9)-4,d=e()<.5?-7.5:7.5,l=(e()-.5)*760,v=c?q.ox+x*q.px+d:l,m=c?l:q.oz+x*q.pz+d;v>V.x0-2&&v<V.x1+2&&m>V.z0-2&&m<V.z1+2||a.push([v,m,c?0:zt/2,8+e()*30,1.1+e()*.5,e()*6.28,.05,e()])}{const c=Ve(),x=new Float32Array(a.length*4),d=new Float32Array(a.length*4);a.forEach((v,m)=>{x.set([v[0],v[1],v[2],v[3]],m*4),d.set([v[4],v[5],v[6],v[7]],m*4)}),c.setAttribute("aWalk",new wt(x,4)),c.setAttribute("aGait",new wt(d,4));const l=new ht(c,Ze(),a.length);l.frustumCulled=!1,l.name="people",t.add(l)}{const c=o?460:180,x=Xe(),d=new Float32Array(c*4),l=[15329250,2237738,9080982,10768431,3559551,14275784,5331038,12157482],v=new ht(x,Ke(),c);for(let n=0;n<c;n++){const k=e()<.5?0:1,p=Math.floor(e()*15)-7,w=e()<.5?-1:1,S=(k===0?q.ox+p*q.px:q.oz+p*q.pz)+w*(k===0?-2.6:2.6)*(e()<.5?1:1.9);d.set([k,S,w*(9+e()*6),e()*2400],n*4)}x.setAttribute("aCar",new wt(d,4));const m=new xt;for(let n=0;n<c;n++)v.setColorAt(n,m.set(l[Math.floor(e()*l.length)]));v.frustumCulled=!1,v.name="cars",t.add(v)}{const c=o?70:34,x=Qe(),d=new Float32Array(c*4),l=new Float32Array(c*4);for(let m=0;m<c;m++){const n=e()<.4,k=120+e()*700,p=e()*zt*2,w=n?Math.sin(p)*k*.5:Math.sin(p)*k,S=n?Math.cos(p)*k*.5:Math.cos(p)*k,G=55+e()*120;if(n)d.set([w,S,-(150+e()*450),G],m*4),l.set([.04+e()*.05,e()*6.28,e()*zt*2,e()],m*4);else{const i=25+e()*90;d.set([w,S,i,G],m*4),l.set([(e()<.5?-1:1)*(6+e()*6)/i,e()*6.28,0,e()],m*4)}}for(let m=0;m<4;m++)d.set([(e()-.5)*80,40+(e()-.5)*60,18+e()*20,30+e()*18],m*4),l.set([.25+e()*.2,e()*6.28,0,.9],m*4);x.setAttribute("aFly",new wt(d,4)),x.setAttribute("aFly2",new wt(l,4));const v=new ht(x,Je(),c);v.frustumCulled=!1,v.name="drones",t.add(v)}return{group:t}}function eo({dom:r,camera:o,isActive:e,onTap:t}){const h={theta:.62,phi:1.29,radius:275,target:new T(2,30,6)},a={theta:h.theta,phi:h.phi,radius:h.radius,target:h.target.clone()},u={theta:h.theta,phi:h.phi,radius:h.radius,target:h.target.clone()},f={phi0:.16,phi1:1.42,r0:42,r1:950,pan:420};let c=7,x=-100,d=0;const l=new Map;let v=0,m=null,n=null;const k=()=>{x=d,c=7};function p(s,y){u.theta-=s*.0055,u.phi=At.clamp(u.phi-y*.0045,f.phi0,f.phi1),k()}function w(s){u.radius=At.clamp(u.radius*s,f.r0,f.r1),k()}const S=new T,G=new T;function i(s,y){const W=u.radius*2*Math.tan(At.degToRad(o.fov/2))/Math.max(1,r.clientHeight);S.set(Math.cos(a.theta),0,-Math.sin(a.theta)),G.set(-Math.sin(a.theta),0,-Math.cos(a.theta)),u.target.addScaledVector(S,-s*W).addScaledVector(G,y*W*1.4);const C=Math.hypot(u.target.x,u.target.z);C>f.pan&&(u.target.x*=f.pan/C,u.target.z*=f.pan/C),k()}r.addEventListener("pointerdown",s=>{if(e()){try{r.setPointerCapture(s.pointerId)}catch{}if(l.set(s.pointerId,{x:s.clientX,y:s.clientY,panning:s.button===2||s.button===1||s.shiftKey}),l.size===1)n={x:s.clientX,y:s.clientY,t:performance.now(),moved:!1};else{n=null;const[y,W]=[...l.values()];v=Math.hypot(y.x-W.x,y.y-W.y),m={x:(y.x+W.x)/2,y:(y.y+W.y)/2}}k()}}),r.addEventListener("pointermove",s=>{if(!e()||!l.has(s.pointerId))return;const y=l.get(s.pointerId),W=s.clientX-y.x,C=s.clientY-y.y;if(y.x=s.clientX,y.y=s.clientY,l.size===1)n&&Math.hypot(s.clientX-n.x,s.clientY-n.y)>6&&(n.moved=!0),y.panning?i(W,C):p(W,C);else if(l.size===2){const[H,U]=[...l.values()],D=Math.hypot(H.x-U.x,H.y-U.y);v>0&&D>0&&w(v/D),v=D;const ot={x:(H.x+U.x)/2,y:(H.y+U.y)/2};m&&i(ot.x-m.x,ot.y-m.y),m=ot}});const P=s=>{l.has(s.pointerId)&&(l.delete(s.pointerId),l.size<2&&(v=0,m=null),n&&!n.moved&&performance.now()-n.t<500&&l.size===0&&e()&&t&&t(s),l.size===0&&(n=null))};r.addEventListener("pointerup",P),r.addEventListener("pointercancel",P),r.addEventListener("wheel",s=>{e()&&(s.preventDefault(),w(Math.exp(s.deltaY*.0012)))},{passive:!1}),r.addEventListener("contextmenu",s=>{e()&&s.preventDefault()});function F(s,y=1.8){if(s.theta!==void 0){let W=s.theta;for(;W-a.theta>Math.PI;)W-=Math.PI*2;for(;W-a.theta<-Math.PI;)W+=Math.PI*2;u.theta=W}s.phi!==void 0&&(u.phi=At.clamp(s.phi,f.phi0,f.phi1)),s.radius!==void 0&&(u.radius=At.clamp(s.radius,f.r0,f.r1)),s.target&&u.target.copy(s.target),c=y,x=d}return{cur:a,goal:u,home:h,snap(s){Object.assign(a,{theta:s.theta??a.theta,phi:s.phi??a.phi,radius:s.radius??a.radius}),s.target&&a.target.copy(s.target)},setGoal:F,key(s){if(s==="ArrowLeft")p(-40,0);else if(s==="ArrowRight")p(40,0);else if(s==="ArrowUp")p(0,-30);else if(s==="ArrowDown")p(0,30);else if(s==="+"||s==="=")w(.85);else if(s==="-"||s==="_")w(1.18);else if(s==="Home")F(h,2.4);else return!1;return!0},update(s,y){d=y,y-x>9&&(u.theta+=s*.022);const W=1-Math.exp(-s*c);a.theta+=(u.theta-a.theta)*W,a.phi+=(u.phi-a.phi)*W,a.radius+=(u.radius-a.radius)*W,a.target.lerp(u.target,W),c<7&&Math.abs(u.phi-a.phi)<.002&&Math.abs(u.radius-a.radius)<.5&&(c=7);const C=Math.sin(a.phi);o.position.set(Math.sin(a.theta)*C,Math.cos(a.phi),Math.cos(a.theta)*C).multiplyScalar(a.radius).add(a.target),o.lookAt(a.target)}}}function oo({root:r,anchors:o,onPick:e,onRead:t}){const h=de.map((f,c)=>{const x=document.createElement("div");x.className="ov-pin",x.style.setProperty("--zc",xe[f]),x.innerHTML=`
      <button class="ov-label" type="button"><span class="ov-num">${c+1}</span><span class="ov-text"><span class="ov-name"></span><span class="ov-kick"></span></span></button>
      <div class="ov-card"><p class="ov-q"></p><button class="ov-read" type="button"></button></div>`,r.appendChild(x);const d=x.querySelector(".ov-label");return d.addEventListener("click",l=>{l.stopPropagation(),e(f)}),x.querySelector(".ov-read").addEventListener("click",l=>{l.stopPropagation(),t(f)}),{id:f,pin:x,label:d,anchor:o[f],v:new T,shown:!0,half:0,dx:0}});let a=null;function u(){const f=ye()==="zh";for(const c of h){const x=me(c.id);c.pin.querySelector(".ov-name").textContent=x.name,c.pin.querySelector(".ov-kick").textContent=f?x.kicker:x.kicker.toUpperCase(),c.pin.querySelector(".ov-q").textContent=x.question,c.pin.querySelector(".ov-read").textContent=`${ge("ovReadPage")} →`,c.label.setAttribute("aria-label",`${x.name}，${x.kicker}`),c.label.setAttribute("aria-expanded",String(a===c.id)),c.half=0}}return ve(u),u(),{setOpen(f){a=f;for(const c of h)c.half=0;for(const c of h)c.pin.classList.toggle("is-open",c.id===f);u()},get open(){return a},update(f,c,x){for(const d of h){d.v.copy(d.anchor).project(f);const l=d.v.z<1&&Math.abs(d.v.x)<1.15&&Math.abs(d.v.y)<1.15;if(l!==d.shown&&(d.pin.style.visibility=l?"":"hidden",d.shown=l),!l)continue;const v=(d.v.x*.5+.5)*c,m=(-d.v.y*.5+.5)*x;d.half||(d.half=Math.max(d.label.offsetWidth,a===d.id?Math.min(290,c*.72):0)/2+8);const n=Math.round(Math.min(c-d.half,Math.max(d.half,v))-v);n!==d.dx&&(d.pin.style.setProperty("--dx",`${n}px`),d.dx=n),d.pin.style.transform=`translate3d(${v.toFixed(1)}px, ${m.toFixed(1)}px, 0)`,d.pin.style.zIndex=String(1e3-Math.round(d.v.z*1e3)+(d.id===a?1e3:0))}}}}const co={aoRadius:2.4,aoPower:1.25,bloom:.3,threshold:1.25,exposure:1,vignette:.24};function ro({renderer:r,tier:o,canvas:e,labelRoot:t,onRead:h}){const a=o.name==="high",u=new Jt;u.name="overview",u.environment=Se(r),u.environmentIntensity=.4;const f=new ee(40,window.innerWidth/window.innerHeight,1.5,7e3),c=oe();u.add(c);const x=6e3,d=.6,l=new le(16761994,6.6,0,d,.25,0);l.castShadow=!0,l.shadow.mapSize.set(o.shadow,o.shadow),l.shadow.autoUpdate=!1,l.shadow.needsUpdate=!0;const v=a?2:4;let m=0;const n=new T(1e9,0,0);let k=0;l.shadow.bias=-25e-5,l.shadow.normalBias=.6,l.shadow.radius=o.shadowRadius,l.shadow.camera.near=x-700,l.shadow.camera.far=x+900,u.add(l,l.target);const p=new fe(10467549,7034180,.3);u.add(p);const w=Ae({tier:o});u.add(w.group);const S=Ue({renderer:r,tier:o,library:w});u.add(S.group);const G=to({tier:o});u.add(G.group);const i=[G.group];let P=!1;const F=oo({root:t,anchors:w.anchors,onPick($){F.open===$?F.setOpen(null):y($)},onRead:h}),s=eo({dom:e,camera:f,isActive:()=>P,onTap:()=>F.open&&F.setOpen(null)});function y($){if(F.setOpen($||null),!$){s.setGoal(s.home,1.9);return}const X=w.focus[$];s.setGoal({target:X.target,radius:X.radius,phi:X.phi,theta:X.theta??s.cur.theta},1.9)}const W=new Yt,C=new T;function H(){const $=Math.min(420,Math.max(130,s.cur.radius*.95));l.shadow.focus=Math.atan($/x)/d;const X=2*$/l.shadow.mapSize.x;W.lookAt(Ot,new T(0,0,0),new T(0,1,0)),C.copy(s.cur.target).setY(0).applyMatrix4(W.clone().invert()),C.x=Math.round(C.x/X)*X,C.y=Math.round(C.y/X)*X,C.applyMatrix4(W),(C.distanceToSquared(n)>1e-4||Math.abs($-k)>$*.02||++m>=v)&&(l.shadow.needsUpdate=!0,m=0,n.copy(C),k=$),l.target.position.copy(C),l.position.copy(Ot).multiplyScalar(x).add(C),l.target.updateMatrixWorld()}let U=0,D=window.innerWidth,ot=window.innerHeight;return{scene:u,camera:f,orbit:s,labels:F,library:w,enter({instant:$=!1}={}){P=!0;const X=s.home;$?s.snap({...X,target:X.target}):(s.snap({theta:X.theta-.55,phi:.2,radius:820,target:X.target}),s.setGoal(X,1.25)),t.hidden=!1},leave(){P=!1,F.setOpen(null),s.setGoal({phi:.2,radius:Math.min(950,s.cur.radius*2.2)},2.2)},hideLabels(){t.hidden=!0},get active(){return P},focusZone:y,get zone(){return F.open},key($){return s.key($)},resize($,X,bt,vt){D=$,ot=X,f.aspect=$/X,f.fov=$/X<.8?52:40,f.updateProjectionMatrix(),S.resize(bt,vt)},update($,X){U+=$,It.uTime.value=U,s.update($,X),f.updateMatrixWorld(),c.position.copy(f.position),H(),S.update(U,r,u,f,c,i),t.hidden||F.update(f,D,ot)}}}export{co as POST,ro as createOverview};
