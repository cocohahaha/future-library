import{c9 as $t,S as Vt,a as Qt,e as dt,M as tt,g as P,bZ as _t,w as Ht,ad as Jt,aT as te,cl as ht,cp as gt,ce as bt,cb as ft,i as Dt,K as Wt,V as Yt,H as ee,u as Zt,p as oe,cj as Ct,cf as ae,cg as ne}from"./three-core-BfwYkZj_.js";import{s as Gt,x as w,b as E,c as xt,t as se,r as Bt,l as ce,a as nt,M as Pt,m as et,p as Nt,d as K,e as Lt,f as It,g as re,h as Mt,Z as ie,i as le,o as fe,z as pe,j as ue,k as he}from"./index-BtWBl6Bz.js";import{P as de,W as xe}from"./three-render-DMdaHza0.js";const qt=new P(-.72,.3,.42).normalize(),Tt={uSunDir:{value:qt},uFogSun:{value:new dt(1,.66,.42)},uFogAway:{value:new dt(.52,.57,.68)},uFogDensity:{value:.0013},uFogHeight:{value:125},uTime:{value:0}},Ot=`
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
`;function ot(d,s={}){const e=s.key||"base";return d.onBeforeCompile=t=>{Object.assign(t.uniforms,Tt,s.uniforms||{});let h=t.vertexShader,o=t.fragmentShader;h=h.replace("#include <common>",`#include <common>
uniform float uTime;
varying vec3 vAtmW;
${s.vHead||""}`),s.vNormal&&(h=h.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
${s.vNormal}`)),s.vBegin&&(h=h.replace("#include <begin_vertex>",`#include <begin_vertex>
${s.vBegin}`)),h=h.replace("#include <fog_vertex>",`#include <fog_vertex>
      {
        vec4 aw = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          aw = instanceMatrix * aw;
        #endif
        vAtmW = ( modelMatrix * aw ).xyz;
      }
      ${s.vEnd||""}`),o=o.replace("#include <common>",`#include <common>
uniform float uTime;
varying vec3 vAtmW;
${Ot}
${s.fHead||""}`),s.fColor&&(o=o.replace("#include <color_fragment>",`#include <color_fragment>
${s.fColor}`)),s.fRough&&(o=o.replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
${s.fRough}`)),s.fEmissive&&(o=o.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${s.fEmissive}`)),o=o.replace("#include <fog_fragment>",s.additive?"gl_FragColor.rgb *= 1.0 - atmFogF( vAtmW );":"gl_FragColor.rgb = atmFog( gl_FragColor.rgb, vAtmW );"),t.vertexShader=h,t.fragmentShader=o},d.customProgramCacheKey=()=>`ov:${e}`,d}const ve=`
  varying vec3 vDir;
  void main() {
    vDir = position; // the dome is centred on the camera
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`,me=`
  varying vec3 vDir;
  uniform float uTime;
  uniform float uSunDisc;
  uniform float uGround;
  ${Ot}
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
`;function Xt(d=3600,s=18,e=0){const t=new Vt({vertexShader:ve,fragmentShader:me,uniforms:{...Tt,uSunDisc:{value:s},uGround:{value:e}},side:Qt,depthWrite:!1,depthTest:!1,fog:!1}),h=new tt(Gt(d,48,24),t);return h.frustumCulled=!1,h.renderOrder=-10,h.name="sky",h}function ge(d){const s=new $t,e=Xt(80,6,1);s.add(e);const t=new de(d),h=t.fromScene(s,.02,.1,200);return t.dispose(),e.geometry.dispose(),e.material.dispose(),h.texture}const ye=4.5;function we(){const d=(u,r)=>ot(new ft(u),r),s=d({color:1910316,roughness:.06,metalness:.3,envMapIntensity:2.8},{key:"lib-glass",uniforms:{uFloor:{value:ye},uWarm:{value:new dt(1,.62,.32)}},fHead:`
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
      `}),e=d({color:15130579,roughness:.78,metalness:0},{key:"lib-stone"}),t=d({color:2894376,roughness:.5,metalness:.6},{key:"lib-dark"}),h=d({color:11819322,roughness:.42,metalness:.55,envMapIntensity:1.8},{key:"lib-fins"}),o=d({color:13214826,roughness:.3,metalness:.85,envMapIntensity:2},{key:"lib-brass"}),i=d({vertexColors:!0,roughness:.92,metalness:0},{key:"lib-green"}),l=d({color:15855336,roughness:.55,metalness:.05},{key:"lib-canopy",vHead:"varying float vUpN;",vEnd:"vUpN = normalize( mat3( modelMatrix ) * objectNormal ).y;",fHead:"varying float vUpN;",fColor:`
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
      `}),c=ot(new Ht({color:new dt(2.6,2.1,1.5)}),{key:"lib-glow"}),p=ot(new Ht({color:new dt(1.5,2.3,2.4)}),{key:"lib-glow"});return{glass:s,stone:e,dark:t,fins:h,brass:o,green:i,canopy:l,glow:c,glowCool:p}}function ze(d,s,e,t,h,o=8){const i=new Pt,l=[[-d/2,-s/2],[d/2,-s/2],[d/2,s/2],[-d/2,s/2]];for(let c=0;c<4;c++){const p=l[c],u=l[(c+1)%4];let r=u[1]-p[1],x=-(u[0]-p[0]);const z=Math.hypot(r,x);r/=z,x/=z;const n=i.p.length/3;for(let j=0;j<=o;j++){const m=j/o,b=m*e,y=t+(h-t)*m,W=Math.cos(y),f=Math.sin(y),C=(k,A)=>[k*W-A*f,k*f+A*W],N=C(p[0],p[1]),a=C(u[0],u[1]),S=C(r,x);i.v(N[0],b,N[1],S[0],0,S[1],0,b),i.v(a[0],b,a[1],S[0],0,S[1],1,b)}for(let j=0;j<o;j++){const m=n+j*2;i.quad(m,m+2,m+3,m+1)}}return i.build()}function Me(d,s,e,t,h,o=.7,i=64,l=22){const c=new Pt,p=.45,u=(m,b)=>{const y=d+e*(m*(1-p)+p*m*Math.sqrt(1-b*b/2)),W=s+t*(b*(1-p)+p*b*Math.sqrt(1-m*m/2));return[y,W]},r=(m,b)=>{const W=(h(m+.5,b)-h(m-.5,b))/1,f=(h(m,b+.5)-h(m,b-.5))/(2*.5),C=Math.hypot(W,1,f);return[-W/C,1/C,-f/C]},x=i+1;for(const m of[!0,!1]){const b=c.p.length/3;for(let y=0;y<=l;y++)for(let W=0;W<=i;W++){const[f,C]=u(W/i*2-1,y/l*2-1),N=h(f,C)-(m?0:o),a=r(f,C);m?c.v(f,N,C,a[0],a[1],a[2],f,C):c.v(f,N,C,-a[0],-a[1],-a[2],f,C)}for(let y=0;y<l;y++)for(let W=0;W<i;W++){const f=b+y*x+W;m?c.quad(f,f+x,f+x+1,f+1):c.quad(f,f+1,f+x+1,f+x)}}const z=[];for(let m=0;m<i;m++)z.push([m/i*2-1,-1]);for(let m=0;m<l;m++)z.push([1,m/l*2-1]);for(let m=i;m>0;m--)z.push([m/i*2-1,1]);for(let m=l;m>0;m--)z.push([-1,m/l*2-1]);const n=z.map(([m,b])=>u(m,b)),j=n.length;for(let m=0;m<j;m++){const[b,y]=n[m],[W,f]=n[(m+1)%j];let C=f-y,N=-(W-b);const a=Math.hypot(C,N)||1;C/=a,N/=a;const S=h(b,y),k=h(W,f),A=c.p.length/3;c.v(b,S-o,y,C,0,N,0,0),c.v(W,k-o,f,C,0,N,1,0),c.v(W,k,f,C,0,N,1,1),c.v(b,S,y,C,0,N,0,1),c.quad(A,A+3,A+2,A+1)}return c.build()}function Ft(d,s,e,t,h,o,i,l,c=1){const p=[5204794,6980680,8361045,4151861,9214554];for(let u=0;u<i;u++){const r=l(),x=s+(t-s)*r+(l()-.5)*.8,z=e+(h-e)*r+(l()-.5)*.8,n=(.5+l()*.7)*c,j=w(nt(n*2,n*1.3,n*2,n*.6,1),{t:[x,o+n*.6,z],r:[0,l()*3,0]});d.push(K(j,p[Math.floor(l()*p.length)]))}}function be({tier:d}){const s=we(),e={glass:[],stone:[],dark:[],fins:[],brass:[],green:[],canopy:[],glow:[],glowCool:[]},t=(g,T)=>(e[g].push(T),T);let h=4041;const o=()=>(h=h*16807%2147483647)/2147483647,i=d.name==="high";t("stone",w(E(132,1.2,70),{t:[0,.6,-2]}));for(let g=0;g<5;g++)t("stone",w(E(132,1.2-g*.24,.5),{t:[0,(1.2-g*.24)/2,33.25+g*.5]}));t("glass",w(E(110,8,58),{t:[0,1.2+4,-2]}));for(let g=-54;g<=54.01;g+=3)t("dark",w(E(.14,8,.3),{t:[g,5.2,27.1]})),t("dark",w(E(.14,8,.3),{t:[g,5.2,-31.1]}));for(let g=-30;g<=27.01;g+=3)t("dark",w(E(.3,8,.14),{t:[-55.1,5.2,g]})),t("dark",w(E(.3,8,.14),{t:[55.1,5.2,g]}));t("stone",w(E(116,1.3,64),{t:[0,9.85,-2]}));const l=(g,T)=>13.2+1.7*Math.sin(g*.072+.5)*Math.cos((T-46)*.14)+.6*Math.sin(g*.17+T*.09);t("canopy",Me(0,46,64,17,l,.8,i?80:48,i?26:16));for(const[g,T]of[[-46,40],[-26,50],[-8,38],[12,50],[30,39],[48,49],[-40,55],[38,56]]){t("stone",w(xt(.45,6.5,12,{rTop:.35}),{t:[g,0,T]}));for(let V=0;V<4;V++){const Q=V*(Math.PI/2)+.4,D=g+Math.cos(Q)*3.4,Z=T+Math.sin(Q)*3.4;t("stone",se([new P(g,6.5-.2,T),new P((g+D)/2,6.5+2.2,(T+Z)/2),new P(D,l(D,Z)-.7,Z)],.2,8))}}const c=0,p=2,u=15,r=10.5,x=55;t("glass",w(xt(u,x-r,64,{caps:!1}),{t:[c,r,p]}));for(let g=0;g<48;g++){const T=g/48*Math.PI*2;t("dark",w(E(.18,x-r,.4),{t:[c+Math.sin(T)*(u+.1),r+(x-r)/2,p+Math.cos(T)*(u+.1)],r:[0,T,0]}))}t("stone",w(Bt(u-1.2,u+.9,0,Math.PI*2,2.2,64),{t:[c,x,p]})),t("glowCool",w(Bt(u-1.6,u-1.15,0,Math.PI*2,.5,64),{t:[c,x+2,p]}));const z=[];for(let g=0;g<=8;g++){const T=g/8*(Math.PI/2);z.push([Math.cos(T)*(u-1.6),Math.sin(T)*3.2])}t("glass",w(ce(z,64),{t:[c,x+2.2,p]}));const n={x0:-57,x1:-19,z0:-28,z1:24,y0:10.5,y1:38};t("dark",w(E(n.x1-n.x0,n.y1-n.y0,n.z1-n.z0),{t:[(n.x0+n.x1)/2,(n.y0+n.y1)/2,(n.z0+n.z1)/2]}));for(let g=n.y0+1.6;g<n.y1-1;g+=3.4)t("glow",w(E(n.x1-n.x0-.6,.35,.1),{t:[(n.x0+n.x1)/2,g,n.z1+.06]})),t("glow",w(E(n.x1-n.x0-.6,.35,.1),{t:[(n.x0+n.x1)/2,g,n.z0-.06]})),t("glow",w(E(.1,.35,n.z1-n.z0-.6),{t:[n.x0-.06,g,(n.z0+n.z1)/2]}));const j=n.y1-n.y0+1.5,m=i?1.1:1.6,b=[[n.x0,n.z1+1.1,1,0,n.x1-n.x0,0,1],[n.x1,n.z0-1.1,-1,0,n.x1-n.x0,0,-1],[n.x0-1.1,n.z0,0,1,n.z1-n.z0,-1,0]];let y=0;for(const[g,T,Y,V,Q]of b)for(let D=m/2;D<Q;D+=m){y+=m;const Z=.95*Math.sin(y*.085),ct=.95*Math.sin(y*.085+1.9),lt=Math.atan2(Y,V),ut=1+.45*Math.sin(y*.05+1);t("fins",w(ze(.22,ut,j,Z,ct,i?10:6),{t:[g+Y*D,n.y0-.8,T+V*D],r:[0,lt+Math.PI/2,0]}))}t("stone",w(E(n.x1-n.x0+3.4,.9,n.z1-n.z0+3.4),{t:[(n.x0+n.x1)/2,n.y1+.45,(n.z0+n.z1)/2]})),t("stone",w(E(26,.8,9),{t:[-40,24.4,n.z1+5.6]})),t("glass",w(E(26,1.1,.12),{t:[-40,25.35,n.z1+10]})),Ft(e.green,-52,n.z1+8.6,-28,n.z1+8.6,24.8,i?26:14,o),Ft(e.green,-55,n.z1-1,-21,n.z1-1,38.9,i?30:16,o,1.2),Ft(e.green,-55,n.z0+1.5,-21,n.z0+1.5,38.9,i?24:12,o,1.1),t("glass",w(E(14,30.7,40),{t:[27,10.5+15.35,-1]})),t("stone",w(E(14.6,.8,40.6),{t:[27,41.6,-1]})),[[42,13.6,-14,.1],[44,13.6,4,-.08],[40,13.6,18,.12],[48,20.8,-6,-.12],[45,20.8,13,.06],[44,28,-16,.14],[50,28,2,-.05],[46,35.2,-4,.09],[42,35.2,15,-.1]].forEach(([g,T,Y,V],Q)=>{const D=13+Q%3*1.6,Z=9.5+Q*7%3,ct={t:[g,T,Y],r:[0,V,0]};t("brass",w(nt(D+.6,.7,Z+.6,.3,2),{t:[g,T-2.9,Y],r:[0,V,0]})),t("glass",w(nt(D,5.4,Z,1.6,3),ct)),t("brass",w(nt(D+.6,.7,Z+.6,.3,2),{t:[g,T+2.9,Y],r:[0,V,0]}));const lt=[];Ft(lt,-D/2+1.5,-Z/2+1.5,D/2-1.5,Z/2-1.5,0,i?9:5,o,.9);for(const ut of lt)e.green.push(w(ut,{t:[g,T+3.25,Y],r:[0,V,0]}))});const f={x0:-50,x1:66,z0:-14,z1:12,y0:41.6,y1:50};t("stone",w(E(f.x1-f.x0,f.y1-f.y0,f.z1-f.z0),{t:[(f.x0+f.x1)/2,(f.y0+f.y1)/2,(f.z0+f.z1)/2]})),t("glow",w(E(f.x1-f.x0-10,1.1,.12),{t:[(f.x0+f.x1)/2+2,f.y0+4.2,f.z1+.04]})),t("dark",w(E(f.x1-f.x0-9.6,.18,.5),{t:[(f.x0+f.x1)/2+2,f.y0+3.55,f.z1+.2]}));const C=10,N=(f.x1-f.x0)/C,a=3.4,S=f.z0+.8,k=f.z1-.8;for(let g=0;g<C;g++){const T=f.x0+N*g+.25,Y=f.x0+N*(g+1)-.25,V=Y-T,Q=Math.hypot(V,a),D=new Pt,Z=-a/Q,ct=V/Q,lt=D.v(T,0,k,Z,ct,0,0,0),ut=D.v(Y,a,k,Z,ct,0,V,0),At=D.v(Y,a,S,Z,ct,0,V,k-S),Rt=D.v(T,0,S,Z,ct,0,0,k-S);D.quad(lt,ut,At,Rt);const Et=D.v(T,0,k,0,0,1,0,0),v=D.v(Y,0,k,0,0,1,V,0),M=D.v(Y,a,k,0,0,1,V,a);D.tri(Et,v,M);const F=D.v(T,0,S,0,0,-1,0,0),G=D.v(Y,0,S,0,0,-1,V,0),L=D.v(Y,a,S,0,0,-1,V,a);D.tri(F,L,G),t("stone",w(D.build(),{t:[0,f.y1,0]})),t("glass",w(E(.16,a,k-S),{t:[Y+.08,f.y1+a/2,(S+k)/2]}))}t("dark",w(E(18,.3,f.z1-f.z0-1),{t:[f.x1-9,f.y0-.15,(f.z0+f.z1)/2]})),Ft(e.green,f.x0+2,f.z1-.6,f.x1-2,f.z1-.6,f.y1,i?30:16,o,.7);const A=new _t;A.name="library";for(const[g,T]of Object.entries(e)){if(!T.length)continue;const Y=new tt(et(T),s[g]);Y.castShadow=g!=="glow"&&g!=="glowCool",Y.receiveShadow=g!=="glow"&&g!=="glowCool",Y.name=`library-${g}`,A.add(Y)}const J=i?140:70,st=Nt(.7,.95);w(st,{r:[Math.PI/2,0,0]});const at=new Float32Array(J*4);for(let g=0;g<J;g++)at[g*4]=o()*Math.PI*2,at[g*4+1]=o()*(u-3),at[g*4+2]=o(),at[g*4+3]=.7+o()*.6;const pt=ot(new Ht({color:new dt(1.9,1.6,1.15),transparent:!0,depthWrite:!1,blending:te,side:Jt}),{key:"lib-slips",additive:!0,uniforms:{uOrigin:{value:new P(c,x+1,p)}},vHead:`
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
      `,fHead:"varying float vFade;",fColor:"diffuseColor.rgb *= vFade; diffuseColor.a *= vFade;"}),_=new ht(st,pt,J);_.geometry.setAttribute("aSeed",new gt(at,4));const B=new bt;for(let g=0;g<J;g++)_.setMatrixAt(g,B.matrix);_.frustumCulled=!1,_.renderOrder=2,A.add(_);const wt={well:new P(c,x+6,p),provenance:new P(n.x0-2,30,n.z1-6),dialogue:new P(52,38.5,8),quiet:new P(30,f.y1+4.5,-2),verify:new P(4,15.8,54)},vt={well:{target:new P(c,34,p),radius:120,phi:.95},provenance:{target:new P(-40,24,0),radius:120,theta:-.55,phi:1.2},dialogue:{target:new P(42,26,0),radius:115,theta:1.35,phi:1.2},quiet:{target:new P(10,45,0),radius:135,phi:1.05},verify:{target:new P(0,8,40),radius:105,theta:.25,phi:1.22}};return{group:A,anchors:wt,focus:vt,materials:s,footprint:{x0:-66,x1:66,z0:-37,z1:62}}}const q={px:96,pz:84,ox:48,oz:42,street:18},O={x0:-135,z0:-117,x1:135,z1:117},Se=Math.atan2(-.72,.42);function ke(d){let s=d;return()=>(s=s*16807%2147483647)/2147483647}function Ce(){return ot(new ft({color:16777215,roughness:.7,metalness:0,envMapIntensity:2.2}),{key:"towers",vHead:`
      attribute vec4 aStyle;
      varying vec4 vStyle;
      varying vec3 vLoc;
      varying vec3 vNl;
    `,vEnd:`
      vec3 sz = vec3( length( instanceMatrix[ 0 ].xyz ), length( instanceMatrix[ 1 ].xyz ), length( instanceMatrix[ 2 ].xyz ) );
      vLoc = position * sz;
      vNl = normal;
      vStyle = aStyle;
    `,fHead:`
      varying vec4 vStyle;
      varying vec3 vLoc;
      varying vec3 vNl;
      float tGlass; float tLit; vec3 tWarm;
      float th( vec3 p ) { p = fract( p * vec3( 0.1031, 0.103, 0.0973 ) ); p += dot( p, p.yxz + 33.33 ); return fract( ( p.x + p.y ) * p.z ); }
      float band( float x, float a, float b, float aa ) { return smoothstep( a - aa, a + aa, x ) * ( 1.0 - smoothstep( b - aa, b + aa, x ) ); }
    `,fColor:`
      {
        float style = vStyle.x;
        float seed = vStyle.y;
        float wall = 1.0 - step( 0.5, abs( vNl.y ) );
        float u = abs( vNl.x ) > 0.5 ? vLoc.z : vLoc.x;
        float fh = style < 0.5 ? 3.9 : style < 1.5 ? 3.2 : style < 2.5 ? 4.2 : 3.4;
        float bw = style < 0.5 ? 1.8 : style < 1.5 ? 3.6 : style < 2.5 ? 1.3 : 2.4;
        vec2 g = vec2( u / bw, vAtmW.y / fh );
        vec2 cell = floor( g );
        vec2 f = fract( g );
        vec2 aa = fwidth( g ) * 1.2;
        float m;
        if ( style < 0.5 ) m = band( f.y, 0.24, 0.98, aa.y ) * band( f.x, 0.05, 0.97, aa.x );
        else if ( style < 1.5 ) m = band( f.y, 0.3, 0.86, aa.y ) * band( f.x, 0.2, 0.8, aa.x );
        else if ( style < 2.5 ) m = band( f.x, 0.3, 0.96, aa.x ) * band( f.y, 0.04, 0.98, aa.y );
        else m = band( f.y, 0.36, 0.94, aa.y ) * band( f.x, 0.02, 0.99, aa.x );
        // far away the grid is sub-pixel: use its average coverage instead
        float cover = style < 0.5 ? 0.68 : style < 1.5 ? 0.34 : style < 2.5 ? 0.62 : 0.56;
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
        // reflective glass: a bright, cool metallic base so the sky shows in it
        vec3 glassC = mix( vec3( 0.26, 0.33, 0.4 ), wallC * 0.6 + vec3( 0.04, 0.06, 0.08 ), style < 0.5 ? 0.3 : 0.1 );
        vec3 roofC = wallC * 0.55;
        diffuseColor.rgb = wall > 0.5 ? mix( wallC, glassC, tGlass ) : roofC;
      }
    `,fRough:`
      roughnessFactor = mix( 0.72, 0.09, tGlass );
      metalnessFactor = mix( 0.0, 0.78, tGlass );
    `,fEmissive:`
      totalEmissiveRadiance += tWarm * tLit * 0.9;
    `})}function Fe(){return ot(new ft({color:16777215,roughness:.9,metalness:0}),{key:"ground",uniforms:{uPitch:{value:new Yt(q.px,q.pz)},uOff:{value:new Yt(q.ox,q.oz)},uSite:{value:new Wt(O.x0,O.z0,O.x1,O.z1)}},fHead:`
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
    `,fRough:"roughnessFactor = gRough;"})}function Pe(d,s){const e=Math.hypot(d,s),t=Math.atan2(d,s);let h=Math.abs(t-Se);h=Math.min(h,Math.PI*2-h);const o=h<.7?Math.max(14,e/3.6):1e9,i=18+Math.max(0,e-170)*.28;return Math.min(o,i)}function Ae({tier:d,rnd:s,bridges:e}){const t=d.name==="high"?12:7,h=[],o=[],i=[],l=[[15262940,3],[14275270,1],[4871776,0],[7109252,0],[9411491,0],[13219740,2],[12160362,1],[10985623,2],[3095106,0],[14472906,3],[15789800,2],[6121328,0]],c=(p,u,r,x,z,n,j)=>{const[m,b]=l[Math.floor(s()*l.length)],y=s()<.25?Math.floor(s()*4):b,W=s(),f=.04+s()*.16;if(h.push({x:p,z:u,w:r,d:x,h:z,y:n,style:y,seed:W,lit:f,color:m}),z>55&&s()<.7){const a=.62+s()*.2,S=Math.min(j-(n+z),z*(.15+s()*.25));S>6&&h.push({x:p,z:u,w:r*a,d:x*a,h:S,y:n+z,style:y,seed:W,lit:f,color:m})}const C=h[h.length-1],N=1+Math.floor(s()*3);for(let a=0;a<N;a++)o.push({x:C.x+(s()-.5)*C.w*.5,z:C.z+(s()-.5)*C.d*.5,w:3+s()*6,d:3+s()*6,h:2+s()*3,y:C.y+C.h})};for(let p=-t;p<=t;p++)for(let u=-t;u<=t;u++){if(Math.abs(p)<=1&&Math.abs(u)<=1)continue;const r=p*q.px,x=u*q.pz,z=q.px-q.street-2,n=q.pz-q.street-2,j=Math.hypot(r,x);if(j>t*q.px*1.02)continue;const m=Pe(r,x),b=Math.exp(-((r-520)**2+(x+560)**2)/(2*380**2)),y=24+70*Math.min(1,Math.max(0,(j-200)/600))+170*b,W=(a=1)=>Math.min(m,Math.max(10,y*a*(.45+s()*.9)));if(s()<.07&&j>250){i.push({x:r,z:x,w:z,d:n});continue}const f=e.find(a=>a.cell[0]===p&&a.cell[1]===u),C=f?f.y:s()<.55?6+Math.floor(s()*3)*3.5:0;C>0&&h.push({x:r,z:x,w:z,d:n,h:C,y:0,style:0,seed:s(),lit:.6,color:12169894});const N=s();if(N<.38){const a=26+s()*16,S=22+s()*14;c(r+(s()-.5)*(z-a)*.8,x+(s()-.5)*(n-S)*.8,a,S,W(1.25),C,m)}else if(N<.72)for(const a of[-1,1]){const S=z/2-4-s()*6,k=20+s()*(n-26);c(r+a*z*.25,x+(s()-.5)*(n-k)*.7,S,k,W(1),C,m)}else for(const a of[-1,1])for(const S of[-1,1]){const k=z/2-3-s()*8,A=n/2-3-s()*7;c(r+a*z*.25,x+S*n*.25,k,A,W(.6),C,m)}}return{list:h,roof:o,parks:i,N:t}}function Ut(d,s){const e=w(E(1,1,1),{t:[0,.5,0]}),t=new ht(e,s,d.length),h=new Float32Array(d.length*4),o=new bt,i=new dt;return d.forEach((l,c)=>{o.position.set(l.x,l.y,l.z),o.scale.set(l.w,l.h,l.d),o.updateMatrix(),t.setMatrixAt(c,o.matrix),t.setColorAt(c,i.set(l.color)),h.set([l.style,l.seed,l.lit,0],c*4)}),t.geometry.setAttribute("aStyle",new gt(h,4)),t.instanceColor.needsUpdate=!0,t.castShadow=!0,t.receiveShadow=!0,t.computeBoundingSphere(),t}function je(){const d=K(w(xt(.22,3.4,5,{rTop:.16,caps:!1}),{t:[0,0,0]}),4864556),s=[[0,4.6,0,2.3],[.9,4,.5,1.6],[-.8,4.2,-.6,1.7],[.1,5.7,-.2,1.5]].map(([e,t,h,o])=>K(w(Gt(o,6,4),{t:[e,t,h],s:[1,.85,1]}),16777215));return et([d,...s])}function Ne(){return ot(new ft({vertexColors:!0,roughness:.85,metalness:0}),{key:"trees",vBegin:`
      {
        vec3 ip = instanceMatrix[ 3 ].xyz;
        float sway = smoothstep( 2.5, 7.0, position.y );
        transformed.x += sin( uTime * 1.1 + ip.x * 0.13 + ip.z * 0.07 ) * 0.18 * sway;
        transformed.z += cos( uTime * 0.9 + ip.z * 0.11 ) * 0.12 * sway;
      }
    `})}function We(d,s,e){const t=new bt,h=new dt,o=[6126140,7309893,5139256,8163664,9079358,11569722,6979391];s.forEach(([i,l,c],p)=>{t.position.set(i,0,l),t.rotation.set(0,e()*6.28,0),t.scale.setScalar(c),t.updateMatrix(),d.setMatrixAt(p,t.matrix),h.set(o[Math.floor(e()*o.length)]),d.setColorAt(p,h)}),d.count=s.length,d.instanceMatrix.needsUpdate=!0,d.instanceColor&&(d.instanceColor.needsUpdate=!0)}const Ge=`
  uniform sampler2D tReflect;
  uniform float uHasReflect;
  uniform mat4 uTexMat;
  uniform float uTime;
  varying vec3 vW;
  ${Ot}
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
`,Te=`
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4( position, 1.0 );
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;function Re(d){const s=new xe(4,4,{type:ee,depthBuffer:!0,generateMipmaps:!1}),e=new Zt,t=new Dt,h=new oe,o=new Wt,i=new Wt,l=new P,c=new P,p=new P,u=new P(0,1,0);return{rt:s,texMat:t,setSize(r,x){s.setSize(Math.max(2,Math.round(r*d)),Math.max(2,Math.round(x*d)))},render(r,x,z,n,j,m){const b=new P(0,n,0);l.copy(b).sub(z.position).reflect(u).negate().add(b),c.set(0,0,-1).applyQuaternion(z.quaternion).add(z.position),p.copy(b).sub(c).reflect(u).negate().add(b),e.position.copy(l),e.up.set(0,1,0).applyQuaternion(z.quaternion).reflect(u),e.lookAt(p),e.far=z.far,e.updateMatrixWorld(),e.projectionMatrix.copy(z.projectionMatrix),t.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),t.multiply(e.projectionMatrix).multiply(e.matrixWorldInverse),h.setFromNormalAndCoplanarPoint(u,b).applyMatrix4(e.matrixWorldInverse),o.set(h.normal.x,h.normal.y,h.normal.z,h.constant);const y=e.projectionMatrix.elements;i.x=(Math.sign(o.x)+y[8])/y[0],i.y=(Math.sign(o.y)+y[9])/y[5],i.z=-1,i.w=(1+y[10])/y[14],o.multiplyScalar(2/o.dot(i)),y[2]=o.x,y[6]=o.y,y[10]=o.z+1,y[14]=o.w,e.projectionMatrixInverse.copy(e.projectionMatrix).invert(),j.forEach(N=>N.visible=!1);const W=m.position.clone();m.position.copy(e.position);const f=r.getRenderTarget(),C=r.shadowMap.autoUpdate;r.shadowMap.autoUpdate=!1,r.setRenderTarget(s),r.clear(),r.render(x,e),r.setRenderTarget(f),r.shadowMap.autoUpdate=C,m.position.copy(W),j.forEach(N=>N.visible=!0)}}}function Ee(){const d=[];for(let t=-1400;t<=180;t+=20)d.push(new P(t,13.2,-126));for(let t=1;t<12;t++){const h=t/12*(Math.PI/2);d.push(new P(180+Math.sin(h)*60,13.2,-66-Math.cos(h)*60))}for(let t=-66;t<=1400;t+=20)d.push(new P(240,13.2,t));const e=[0];for(let t=1;t<d.length;t++)e.push(e[t-1]+d[t].distanceTo(d[t-1]));return{pts:d,total:e[e.length-1],at(t,h,o){t=Math.max(0,Math.min(e[e.length-1]-.001,t));let i=0,l=e.length-1;for(;l-i>1;){const p=i+l>>1;e[p]<=t?i=p:l=p}const c=(t-e[i])/(e[l]-e[i]);return h.lerpVectors(d[i],d[l],c),o&&o.subVectors(d[l],d[i]).normalize(),h}}}function Le({renderer:d,tier:s,library:e}){const t=ke(9173),h=s.name==="high",o=new _t;o.name="city";const i=(v,M)=>ot(new ft(v),{key:M}),l={concrete:i({color:14209736,roughness:.8},"c-concrete"),paving:ot(new ft({color:14274495,roughness:.85}),{key:"c-paving",fColor:`
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
      `}),lawn:ot(new ft({color:6257210,roughness:.95}),{key:"c-lawn",fColor:`
        {
          vec2 p = vAtmW.xz;
          float n = fract( sin( dot( floor( p * 1.5 ), vec2( 12.9, 78.2 ) ) ) * 43758.5 );
          float m = 0.5 + 0.5 * sin( p.x * 0.11 + sin( p.y * 0.07 ) * 2.0 );
          diffuseColor.rgb *= 0.82 + 0.16 * n + 0.14 * m;
        }
      `}),glass:i({color:2766396,roughness:.06,metalness:.4,envMapIntensity:2.4},"c-glass"),metal:i({color:9211793,roughness:.35,metalness:.8},"c-metal"),roofUnits:i({color:10131343,roughness:.7},"c-roof"),green:i({vertexColors:!0,roughness:.92},"c-green"),train:ot(new ft({color:15987180,roughness:.25,metalness:.3,vertexColors:!0}),{key:"c-train",fEmissive:"totalEmissiveRadiance += vec3( 1.0, 0.75, 0.45 ) * step( vColor.r, 0.02 ) * 1.4;"})},c=new tt(Nt(9e3,9e3),Fe());c.receiveShadow=!0,c.position.y=-.02,o.add(c);const u=Ae({tier:s,rnd:t,bridges:[{cell:[-2,0],y:10.5},{cell:[2,-1],y:10.5}]}),r=Ut(u.list,Ce());r.name="towers",o.add(r);let x=null;{const v=w(E(1,1,1),{t:[0,.5,0]}),M=new ht(v,l.roofUnits,u.roof.length),F=new bt;u.roof.forEach((G,L)=>{F.position.set(G.x,G.y,G.z),F.scale.set(G.w,G.h,G.d),F.updateMatrix(),M.setMatrixAt(L,F.matrix)}),M.castShadow=!0,M.receiveShadow=!0,M.computeBoundingSphere(),M.name="roof-plant",o.add(M),x=M}let z=null;{const v=[],M=u.N*q.px+60;for(let G=0;G<(h?900:420);G++){const L=t()*Math.PI*2,X=M+Math.pow(t(),.7)*2200,I=Math.sin(L)*X,R=Math.cos(L)*X,H=Math.exp(-((I-520)**2+(R+560)**2)/(2*900**2));v.push({x:I,z:R,w:20+t()*40,d:20+t()*40,h:20+t()*70+160*H*t(),y:0,style:Math.floor(t()*4),seed:t(),lit:.2,color:[12104360,10134440,13222840][Math.floor(t()*3)]})}const F=Ut(v,r.material);F.castShadow=!1,F.receiveShadow=!1,F.name="towers-far",o.add(F),z=F}e.footprint,o.add(Object.assign(new tt(w(Nt(O.x1-O.x0,O.z1-O.z0),{t:[0,.03,0]}),l.paving),{receiveShadow:!0}));const n=[[-104,-84,46,50],[104,-84,46,50],[-106,78,42,60],[106,78,42,60],[-104,4,30,60],[104,4,30,60]],j=[],m=[];for(const[v,M,F,G]of n)j.push(w(Lt(It(F,G,9,5),.45),{t:[v,0,M]})),m.push(w(Lt(It(F+1.2,G+1.2,9.5,5),.5),{t:[v,0,M]}));const b=new tt(et(j),l.lawn);b.receiveShadow=!0,b.position.y=.08,o.add(b),o.add(Object.assign(new tt(et(m),l.concrete),{receiveShadow:!0,castShadow:!0}));const y={x:0,z:86,w:124,d:24,y:.32},W=et([w(E(y.w+2.4,.7,1.2),{t:[0,.35,y.z-y.d/2-.6]}),w(E(y.w+2.4,.7,1.2),{t:[0,.35,y.z+y.d/2+.6]}),w(E(1.2,.7,y.d),{t:[-124/2-.6,.35,y.z]}),w(E(1.2,.7,y.d),{t:[y.w/2+.6,.35,y.z]})]);o.add(Object.assign(new tt(W,l.concrete),{castShadow:!0,receiveShadow:!0}));const f=h?Re(.5):null,C=new Vt({vertexShader:Te,fragmentShader:Ge,uniforms:{...Tt,tReflect:{value:f?f.rt.texture:null},uHasReflect:{value:f?1:0},uTexMat:{value:f?f.texMat:new Dt}}}),N=new tt(w(Nt(y.w,y.d),{t:[y.x,y.y,y.z]}),C);N.name="water",o.add(N);const a=14,S=ot(new ft({color:15266548,roughness:.2,transparent:!0,opacity:.55,depthWrite:!1}),{key:"c-jets",vBegin:`
      {
        vec3 ip = instanceMatrix[ 3 ].xyz;
        float k = 0.55 + 0.45 * sin( uTime * 1.6 + ip.x * 0.21 );
        transformed.y *= k;
        transformed.xz *= 1.0 + ( 1.0 - k ) * 0.6 * smoothstep( 0.7, 1.0, position.y / 4.0 );
      }
    `}),k=new ht(xt(.14,4.2,8,{rTop:.05}),S,a);{const v=new bt;for(let M=0;M<a;M++)v.position.set(-52+104*M/(a-1),y.y,y.z),v.updateMatrix(),k.setMatrixAt(M,v.matrix);k.computeBoundingSphere()}o.add(k);const A=[];for(const[v,M,F,G]of n){const L=Math.round(F*G/(h?110:190));for(let X=0;X<L;X++)A.push([v+(t()-.5)*(F-8),M+(t()-.5)*(G-8),.8+t()*.55])}for(let v=-108;v<=108;v+=9)A.push([-128,v,.95+t()*.2]),A.push([128,v,.95+t()*.2]);for(let v=-120;v<=120;v+=10)Math.abs(v)>20&&A.push([v,-110,.9+t()*.2]);for(let v=-60;v<=60;v+=10)A.push([v,104,.85+t()*.25]),A.push([v+5,68,.75+t()*.2]);const J=h?620:360,st=h?13:20;for(let v=-8;v<=8;v++){const M=q.ox+v*q.px,F=q.oz+v*q.pz;for(let G=-J;G<=J;G+=st)for(const L of[-7.6,7.6]){const X=[M+L,G],I=[G,F+L];for(const[R,H]of[X,I]){if(Math.hypot(R,H)>J||R>O.x0-4&&R<O.x1+4&&H>O.z0-4&&H<O.z1+4)continue;const $=Math.abs(((R-q.ox)%q.px+q.px)%q.px),U=Math.abs(((H-q.oz)%q.pz+q.pz)%q.pz);Math.min($,q.px-$)<10&&Math.min(U,q.pz-U)<10||t()<.18||A.push([R,H,.7+t()*.3])}}}for(const v of u.parks){const M=Math.round(v.w*v.d/160);for(let F=0;F<M;F++)A.push([v.x+(t()-.5)*v.w,v.z+(t()-.5)*v.d,.9+t()*.5])}const at=je(),pt=Ne(),_=[];for(const v of[!0,!1]){const M=A.filter(([G,L])=>Math.hypot(G,L)<300===v),F=new ht(at,pt,M.length);We(F,M,t),F.castShadow=v,F.receiveShadow=!0,F.computeBoundingSphere(),F.name=v?"trees":"trees-far",o.add(F),_.push(F)}{const v=u.parks.map(M=>w(Lt(It(M.w,M.d,6,4),.3),{t:[M.x,0,M.z]}));v.length&&o.add(Object.assign(new tt(et(v),l.lawn),{receiveShadow:!0}))}const B=[],wt=[],vt=[],g=(v,M,F,G=18)=>{const L=new Pt;let X=0;const I=2;for(let $=0;$<v.length;$++){const U=v[$],rt=v[Math.min(v.length-1,$+1)],zt=v[Math.max(0,$-1)],it=rt.x-zt.x,mt=rt.z-zt.z,St=Math.hypot(it,mt)||1,kt=-mt/St,jt=it/St;$&&(X+=U.distanceTo(v[$-1])),L.v(U.x+kt*M/2,U.y,U.z+jt*M/2,0,1,0,0,X),L.v(U.x-kt*M/2,U.y,U.z-jt*M/2,0,1,0,M,X)}for(let $=0;$<v.length-1;$++){const U=$*I;L.quad(U,U+2,U+3,U+1)}const R=L.build();B.push(R);let H=0;for(let $=0;$<v.length-1;$++){const U=v[$],rt=v[$+1],zt=U.distanceTo(rt),it=U.clone().add(rt).multiplyScalar(.5),mt=Math.atan2(rt.x-U.x,rt.z-U.z),St=Math.atan2(rt.y-U.y,Math.hypot(rt.x-U.x,rt.z-U.z));B.push(w(E(M,.9,zt+.05),{t:[it.x,it.y-.46,it.z],r:[-St,mt,0]}));for(const kt of[-1,1]){const jt=Math.cos(mt)*kt*(M/2-.1),Kt=-Math.sin(mt)*kt*(M/2-.1);wt.push(w(E(.08,1.1,zt),{t:[it.x+jt,it.y+.55,it.z+Kt],r:[-St,mt,0]}))}H+=zt,H>G&&F(it)>3&&(H=0,B.push(w(xt(.45,it.y-.9,10),{t:[it.x,0,it.z]})))}};g([new P(-58,10.5,4),new P(-100,10.5,4),new P(-150,10.5,4),new P(-158,10.5,4)],7,()=>10);const T=re([new P(56,10.5,18),new P(78,10.5,30),new P(104,10.5,30),new P(122,10.5,8),new P(150,10.5,-30),new P(170,10.5,-42)],10);g(T,9,()=>10,16);for(let v=2;v<T.length-2;v+=2){const M=T[v],F=T[v+1],G=Math.atan2(F.x-M.x,F.z-M.z);for(const L of[-1,1]){const X=[],I=Math.cos(G)*L*3.2,R=-Math.sin(G)*L*3.2,H=.6+t()*.6;X.push(K(w(nt(H*2,H*1.2,H*2,H*.6,1),{t:[M.x+I,10.5+H*.6,M.z+R]}),[6126140,8163664,9079358][Math.floor(t()*3)])),vt.push(...X)}}g([new P(0,10.5,-37),new P(0,11.4,-80),new P(0,12.6,-118)],8,()=>10,20),o.add(Object.assign(new tt(et(B),l.concrete),{castShadow:!0,receiveShadow:!0})),o.add(new tt(et(wt),l.glass)),vt.length&&o.add(Object.assign(new tt(et(vt),l.green),{castShadow:!0}));const Y=Ee();{const v=[];for(let I=0;I<Y.pts.length-1;I++){const R=Y.pts[I],H=Y.pts[I+1],$=R.distanceTo(H),U=R.clone().add(H).multiplyScalar(.5),rt=Math.atan2(H.x-R.x,H.z-R.z);v.push(w(nt(7.2,1.5,$+.1,.4,1),{t:[U.x,R.y-.95,U.z],r:[0,rt,0]})),I%2===0&&(v.push(w(xt(.8,R.y-1.6,10,{rTop:.65}),{t:[R.x,0,R.z]})),v.push(w(nt(5,.9,2,.3,1),{t:[R.x,R.y-1.9,R.z],r:[0,rt,0]})))}o.add(Object.assign(new tt(et(v),l.concrete),{castShadow:!0,receiveShadow:!0}));const M=[];for(const I of[-1,1])M.push(w(E(84,.6,4),{t:[0,12.6,-126+I*6]}));for(let I=-40;I<=40;I+=10)for(const R of[-1,1])M.push(w(xt(.25,7.5,8),{t:[I,12.9,-126+R*7.4]}));o.add(Object.assign(new tt(et(M),l.metal),{castShadow:!0}));const F=new Pt,G=40,L=8;for(let I=0;I<=L;I++)for(let R=0;R<=G;R++){const H=-44+88*R/G,$=-135+18*I/L,U=20.4+1.6*Math.cos(($+126)/9*(Math.PI/2))-4e-4*H*H;F.v(H,U,$,0,1,0,H,$)}for(let I=0;I<L;I++)for(let R=0;R<G;R++){const H=I*(G+1)+R;F.quad(H,H+G+1,H+G+2,H+1)}const X=F.build();X.computeVertexNormals(),o.add(Object.assign(new tt(X,l.glass),{castShadow:!0}))}const V=4,Q=17,D=(()=>{const v=K(nt(3.1,3.3,Q,1.1,2),16777215),M=K(w(nt(3.16,1,Q-2.4,.3,1),{t:[0,.35,0]}),1712168),F=K(w(E(2.6,.5,Q-1),{t:[0,-1.8,0]}),3355443);return w(et([v,M,F]),{t:[0,1.95,0]})})(),Z=new ht(D,l.train,V*2);Z.castShadow=!0,Z.frustumCulled=!1,o.add(Z);const ct=new P,lt=new P,ut=new bt;function At(v){for(let M=0;M<2;M++){const F=M?-1:1,G=21,L=Y.total,X=((v*G+M*L*.37)%L+L)%L;for(let I=0;I<V;I++){let R=F>0?X-I*(Q+.8):L-X+I*(Q+.8);R=Math.max(1,Math.min(L-1,R)),Y.at(R,ct,lt);const H=-lt.z,$=lt.x;ut.position.set(ct.x+H*1.9*F,ct.y-.2,ct.z+$*1.9*F),ut.rotation.set(0,Math.atan2(lt.x,lt.z),0),ut.updateMatrix(),Z.setMatrixAt(M*V+I,ut.matrix)}}Z.instanceMatrix.needsUpdate=!0}At(0);const Rt=[N,..._,x,z];let Et=0;return{group:o,water:N,reflector:f,path:Y,pool:y,towers:r,update(v,M,F,G,L,X=[]){At(v),f&&Et++%2===0&&f.render(M,F,G,y.y,Rt.concat(X),L)},resize(v,M){f&&f.setSize(v,M)}}}const yt=Math.PI;function Ie(d){let s=d;return()=>(s=s*16807%2147483647)/2147483647}function He(){const d=K(w(nt(.34,.86,.22,.08,1),{t:[0,.43,0]}),2763310),s=K(w(nt(.46,.66,.28,.12,1),{t:[0,1.2,0]}),16777215),e=K(w(Gt(.12,8,6),{t:[0,1.66,0]}),13148296);return et([d,s,e])}function qe(){return ot(new ft({vertexColors:!0,roughness:.8}),{key:"life-people",vHead:`
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
    `,fColor:"if ( vColor.r > 0.97 && vColor.b > 0.97 ) diffuseColor.rgb = cloth( vHue );"})}function _e(){const d=K(w(nt(1.9,.75,4.5,.3,1),{t:[0,.6,0]}),16777215),s=K(w(nt(1.7,.6,2.5,.25,1),{t:[0,1.2,-.2]}),1777700),e=Mt(K(w(E(1.5,.18,.1),{t:[0,.72,2.26]}),16777215),.5),t=Mt(K(w(E(1.6,.16,.1),{t:[0,.78,-2.26]}),16777215),1);return et([Mt(d,0),Mt(s,0),e,t])}function De(){return ot(new ft({vertexColors:!0,roughness:.3,metalness:.5}),{key:"life-cars",uniforms:{uSite:{value:new Wt(O.x0-4,O.z0-4,O.x1+4,O.z1+4)}},vHead:`
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
    `})}function Oe(){const d=[K(nt(1.1,.34,1.1,.12,1),3159098)];for(let s=0;s<4;s++){const e=yt/4+s*yt/2,t=Math.sin(e)*.95,h=Math.cos(e)*.95;d.push(K(w(E(.12,.08,1.3),{t:[t/2,0,h/2],r:[0,e,0]}),3159098)),d.push(K(w(xt(.42,.04,12),{t:[t,.12,h]}),9080982))}return d.push(Mt(K(w(Gt(.2,8,6),{t:[0,-.28,0]}),16777215),1)),et(d.map(s=>s.attributes.aDelay?s:Mt(s,0)))}function Ye(){return ot(new ft({vertexColors:!0,roughness:.4,metalness:.6}),{key:"life-drones",vHead:`
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
    `})}function Be({tier:d}){const s=d.name==="high",e=Ie(2207),t=new _t;t.name="life";const h=(c,p)=>!(c<O.x0+2||c>O.x1-2||p<O.z0+2||p>O.z1-2||c>-67&&c<67&&p>-38&&p<36||c>-64&&c<64&&p>72&&p<100),o=[],i=s?700:300;let l=0;for(;o.length<i*.72&&l++<2e4;){const c=O.x0+e()*(O.x1-O.x0),p=O.z0+e()*(O.z1-O.z0),u=Math.exp(-((p-60)**2)/(2*40**2));if(e()>.35+.65*u)continue;const r=e()*yt*2,x=e()<.18?0:3+e()*16;!h(c+Math.sin(r)*x,p+Math.cos(r)*x)||!h(c-Math.sin(r)*x,p-Math.cos(r)*x)||!h(c,p)||o.push([c,p,r,x,x?1.1+e()*.5:0,e()*6.28,.05,e()])}for(let c=0;c<i*.08;c++){const p=e()<.5,u=e(),r=4+e()*10;p?o.push([-70-u*80,4+(e()-.5)*5,yt/2,r,1.2+e()*.4,e()*6.28,10.5,e()]):o.push([(e()-.5)*6,-50-u*60,0,r,1.2+e()*.4,e()*6.28,11.2+u,e()])}for(;o.length<i;){const c=e()<.5,p=Math.floor(e()*9)-4,u=e()<.5?-7.5:7.5,r=(e()-.5)*760,x=c?q.ox+p*q.px+u:r,z=c?r:q.oz+p*q.pz+u;x>O.x0-2&&x<O.x1+2&&z>O.z0-2&&z<O.z1+2||o.push([x,z,c?0:yt/2,8+e()*30,1.1+e()*.5,e()*6.28,.05,e()])}{const c=He(),p=new Float32Array(o.length*4),u=new Float32Array(o.length*4);o.forEach((x,z)=>{p.set([x[0],x[1],x[2],x[3]],z*4),u.set([x[4],x[5],x[6],x[7]],z*4)}),c.setAttribute("aWalk",new gt(p,4)),c.setAttribute("aGait",new gt(u,4));const r=new ht(c,qe(),o.length);r.frustumCulled=!1,r.name="people",t.add(r)}{const c=s?460:180,p=_e(),u=new Float32Array(c*4),r=[15329250,2237738,9080982,10768431,3559551,14275784,5331038,12157482],x=new ht(p,De(),c);for(let n=0;n<c;n++){const j=e()<.5?0:1,m=Math.floor(e()*15)-7,b=e()<.5?-1:1,y=(j===0?q.ox+m*q.px:q.oz+m*q.pz)+b*(j===0?-2.6:2.6)*(e()<.5?1:1.9);u.set([j,y,b*(9+e()*6),e()*2400],n*4)}p.setAttribute("aCar",new gt(u,4));const z=new dt;for(let n=0;n<c;n++)x.setColorAt(n,z.set(r[Math.floor(e()*r.length)]));x.frustumCulled=!1,x.name="cars",t.add(x)}{const c=s?70:34,p=Oe(),u=new Float32Array(c*4),r=new Float32Array(c*4);for(let z=0;z<c;z++){const n=e()<.4,j=120+e()*700,m=e()*yt*2,b=n?Math.sin(m)*j*.5:Math.sin(m)*j,y=n?Math.cos(m)*j*.5:Math.cos(m)*j,W=55+e()*120;if(n)u.set([b,y,-(150+e()*450),W],z*4),r.set([.04+e()*.05,e()*6.28,e()*yt*2,e()],z*4);else{const f=25+e()*90;u.set([b,y,f,W],z*4),r.set([(e()<.5?-1:1)*(6+e()*6)/f,e()*6.28,0,e()],z*4)}}for(let z=0;z<4;z++)u.set([(e()-.5)*80,40+(e()-.5)*60,18+e()*20,30+e()*18],z*4),r.set([.25+e()*.2,e()*6.28,0,.9],z*4);p.setAttribute("aFly",new gt(u,4)),p.setAttribute("aFly2",new gt(r,4));const x=new ht(p,Ye(),c);x.frustumCulled=!1,x.name="drones",t.add(x)}return{group:t}}function Ue({dom:d,camera:s,isActive:e,onTap:t}){const h={theta:.62,phi:1.29,radius:275,target:new P(2,30,6)},o={theta:h.theta,phi:h.phi,radius:h.radius,target:h.target.clone()},i={theta:h.theta,phi:h.phi,radius:h.radius,target:h.target.clone()},l={phi0:.16,phi1:1.42,r0:42,r1:950,pan:420};let c=7,p=-100,u=0;const r=new Map;let x=0,z=null,n=null;const j=()=>{p=u,c=7};function m(a,S){i.theta-=a*.0055,i.phi=Ct.clamp(i.phi-S*.0045,l.phi0,l.phi1),j()}function b(a){i.radius=Ct.clamp(i.radius*a,l.r0,l.r1),j()}const y=new P,W=new P;function f(a,S){const k=i.radius*2*Math.tan(Ct.degToRad(s.fov/2))/Math.max(1,d.clientHeight);y.set(Math.cos(o.theta),0,-Math.sin(o.theta)),W.set(-Math.sin(o.theta),0,-Math.cos(o.theta)),i.target.addScaledVector(y,-a*k).addScaledVector(W,S*k*1.4);const A=Math.hypot(i.target.x,i.target.z);A>l.pan&&(i.target.x*=l.pan/A,i.target.z*=l.pan/A),j()}d.addEventListener("pointerdown",a=>{if(e()){try{d.setPointerCapture(a.pointerId)}catch{}if(r.set(a.pointerId,{x:a.clientX,y:a.clientY,panning:a.button===2||a.button===1||a.shiftKey}),r.size===1)n={x:a.clientX,y:a.clientY,t:performance.now(),moved:!1};else{n=null;const[S,k]=[...r.values()];x=Math.hypot(S.x-k.x,S.y-k.y),z={x:(S.x+k.x)/2,y:(S.y+k.y)/2}}j()}}),d.addEventListener("pointermove",a=>{if(!e()||!r.has(a.pointerId))return;const S=r.get(a.pointerId),k=a.clientX-S.x,A=a.clientY-S.y;if(S.x=a.clientX,S.y=a.clientY,r.size===1)n&&Math.hypot(a.clientX-n.x,a.clientY-n.y)>6&&(n.moved=!0),S.panning?f(k,A):m(k,A);else if(r.size===2){const[J,st]=[...r.values()],at=Math.hypot(J.x-st.x,J.y-st.y);x>0&&at>0&&b(x/at),x=at;const pt={x:(J.x+st.x)/2,y:(J.y+st.y)/2};z&&f(pt.x-z.x,pt.y-z.y),z=pt}});const C=a=>{r.has(a.pointerId)&&(r.delete(a.pointerId),r.size<2&&(x=0,z=null),n&&!n.moved&&performance.now()-n.t<500&&r.size===0&&e()&&t&&t(a),r.size===0&&(n=null))};d.addEventListener("pointerup",C),d.addEventListener("pointercancel",C),d.addEventListener("wheel",a=>{e()&&(a.preventDefault(),b(Math.exp(a.deltaY*.0012)))},{passive:!1}),d.addEventListener("contextmenu",a=>{e()&&a.preventDefault()});function N(a,S=1.8){if(a.theta!==void 0){let k=a.theta;for(;k-o.theta>Math.PI;)k-=Math.PI*2;for(;k-o.theta<-Math.PI;)k+=Math.PI*2;i.theta=k}a.phi!==void 0&&(i.phi=Ct.clamp(a.phi,l.phi0,l.phi1)),a.radius!==void 0&&(i.radius=Ct.clamp(a.radius,l.r0,l.r1)),a.target&&i.target.copy(a.target),c=S,p=u}return{cur:o,goal:i,home:h,snap(a){Object.assign(o,{theta:a.theta??o.theta,phi:a.phi??o.phi,radius:a.radius??o.radius}),a.target&&o.target.copy(a.target)},setGoal:N,key(a){if(a==="ArrowLeft")m(-40,0);else if(a==="ArrowRight")m(40,0);else if(a==="ArrowUp")m(0,-30);else if(a==="ArrowDown")m(0,30);else if(a==="+"||a==="=")b(.85);else if(a==="-"||a==="_")b(1.18);else if(a==="Home")N(h,2.4);else return!1;return!0},update(a,S){u=S,S-p>9&&(i.theta+=a*.022);const k=1-Math.exp(-a*c);o.theta+=(i.theta-o.theta)*k,o.phi+=(i.phi-o.phi)*k,o.radius+=(i.radius-o.radius)*k,o.target.lerp(i.target,k),c<7&&Math.abs(i.phi-o.phi)<.002&&Math.abs(i.radius-o.radius)<.5&&(c=7);const A=Math.sin(o.phi);s.position.set(Math.sin(o.theta)*A,Math.cos(o.phi),Math.cos(o.theta)*A).multiplyScalar(o.radius).add(o.target),s.lookAt(o.target)}}}function $e({root:d,anchors:s,onPick:e,onRead:t}){const h=ie.map((l,c)=>{const p=document.createElement("div");p.className="ov-pin",p.style.setProperty("--zc",le[l]),p.innerHTML=`
      <button class="ov-label" type="button"><span class="ov-num">${c+1}</span><span class="ov-text"><span class="ov-name"></span><span class="ov-kick"></span></span></button>
      <div class="ov-card"><p class="ov-q"></p><button class="ov-read" type="button"></button></div>`,d.appendChild(p);const u=p.querySelector(".ov-label");return u.addEventListener("click",r=>{r.stopPropagation(),e(l)}),p.querySelector(".ov-read").addEventListener("click",r=>{r.stopPropagation(),t(l)}),{id:l,pin:p,label:u,anchor:s[l],v:new P,shown:!0,half:0,dx:0}});let o=null;function i(){const l=he()==="zh";for(const c of h){const p=pe(c.id);c.pin.querySelector(".ov-name").textContent=p.name,c.pin.querySelector(".ov-kick").textContent=l?p.kicker:p.kicker.toUpperCase(),c.pin.querySelector(".ov-q").textContent=p.question,c.pin.querySelector(".ov-read").textContent=`${ue("ovReadPage")} →`,c.label.setAttribute("aria-label",`${p.name}，${p.kicker}`),c.label.setAttribute("aria-expanded",String(o===c.id)),c.half=0}}return fe(i),i(),{setOpen(l){o=l;for(const c of h)c.half=0;for(const c of h)c.pin.classList.toggle("is-open",c.id===l);i()},get open(){return o},update(l,c,p){for(const u of h){u.v.copy(u.anchor).project(l);const r=u.v.z<1&&Math.abs(u.v.x)<1.15&&Math.abs(u.v.y)<1.15;if(r!==u.shown&&(u.pin.style.visibility=r?"":"hidden",u.shown=r),!r)continue;const x=(u.v.x*.5+.5)*c,z=(-u.v.y*.5+.5)*p;u.half||(u.half=Math.max(u.label.offsetWidth,o===u.id?Math.min(290,c*.72):0)/2+8);const n=Math.round(Math.min(c-u.half,Math.max(u.half,x))-x);n!==u.dx&&(u.pin.style.setProperty("--dx",`${n}px`),u.dx=n),u.pin.style.transform=`translate3d(${x.toFixed(1)}px, ${z.toFixed(1)}px, 0)`,u.pin.style.zIndex=String(1e3-Math.round(u.v.z*1e3)+(u.id===o?1e3:0))}}}}const Ke={aoRadius:2.4,aoPower:1.25,bloom:.3,threshold:1.25,exposure:1,vignette:.24};function Qe({renderer:d,tier:s,canvas:e,labelRoot:t,onRead:h}){const o=s.name==="high",i=new $t;i.name="overview",i.environment=ge(d),i.environmentIntensity=.4;const l=new Zt(40,window.innerWidth/window.innerHeight,1.5,7e3),c=Xt();i.add(c);const p=6e3,u=.6,r=new ae(16761994,6.6,0,u,.25,0);r.castShadow=!0,r.shadow.mapSize.set(s.shadow,s.shadow),r.shadow.autoUpdate=!1,r.shadow.needsUpdate=!0;const x=o?2:4;let z=0;const n=new P(1e9,0,0);let j=0;r.shadow.bias=-25e-5,r.shadow.normalBias=.6,r.shadow.radius=s.shadowRadius,r.shadow.camera.near=p-700,r.shadow.camera.far=p+900,i.add(r,r.target);const m=new ne(10467549,7034180,.3);i.add(m);const b=be({tier:s});i.add(b.group);const y=Le({renderer:d,tier:s,library:b});i.add(y.group);const W=Be({tier:s});i.add(W.group);const f=[W.group];let C=!1;const N=$e({root:t,anchors:b.anchors,onPick(_){N.open===_?N.setOpen(null):S(_)},onRead:h}),a=Ue({dom:e,camera:l,isActive:()=>C,onTap:()=>N.open&&N.setOpen(null)});function S(_){if(N.setOpen(_||null),!_){a.setGoal(a.home,1.9);return}const B=b.focus[_];a.setGoal({target:B.target,radius:B.radius,phi:B.phi,theta:B.theta??a.cur.theta},1.9)}const k=new Dt,A=new P;function J(){const _=Math.min(420,Math.max(130,a.cur.radius*.95));r.shadow.focus=Math.atan(_/p)/u;const B=2*_/r.shadow.mapSize.x;k.lookAt(qt,new P(0,0,0),new P(0,1,0)),A.copy(a.cur.target).setY(0).applyMatrix4(k.clone().invert()),A.x=Math.round(A.x/B)*B,A.y=Math.round(A.y/B)*B,A.applyMatrix4(k),(A.distanceToSquared(n)>1e-4||Math.abs(_-j)>_*.02||++z>=x)&&(r.shadow.needsUpdate=!0,z=0,n.copy(A),j=_),r.target.position.copy(A),r.position.copy(qt).multiplyScalar(p).add(A),r.target.updateMatrixWorld()}let st=0,at=window.innerWidth,pt=window.innerHeight;return{scene:i,camera:l,orbit:a,labels:N,library:b,enter({instant:_=!1}={}){C=!0;const B=a.home;_?a.snap({...B,target:B.target}):(a.snap({theta:B.theta-.55,phi:.2,radius:820,target:B.target}),a.setGoal(B,1.25)),t.hidden=!1},leave(){C=!1,N.setOpen(null),a.setGoal({phi:.2,radius:Math.min(950,a.cur.radius*2.2)},2.2)},hideLabels(){t.hidden=!0},get active(){return C},focusZone:S,get zone(){return N.open},key(_){return a.key(_)},resize(_,B,wt,vt){at=_,pt=B,l.aspect=_/B,l.fov=_/B<.8?52:40,l.updateProjectionMatrix(),y.resize(wt,vt)},update(_,B){st+=_,Tt.uTime.value=st,a.update(_,B),l.updateMatrixWorld(),c.position.copy(l.position),J(),y.update(st,d,i,l,c,f),t.hidden||N.update(l,at,pt)}}}export{Ke as POST,Qe as createOverview};
