import{c9 as _t,S as Dt,a as Ut,e as ft,M as Q,g as P,bZ as Rt,w as Gt,ad as $t,aT as Vt,cl as lt,cp as dt,ce as yt,cb as ct,i as Lt,K as Pt,V as It,H as Xt,u as Ot,p as Zt,cj as bt,cf as Kt,cg as Qt}from"./three-core-BfwYkZj_.js";import{s as At,x as z,b as L,c as ut,t as Jt,r as Ht,l as te,a as ot,M as kt,m as J,p as Ft,d as Z,e as Wt,f as Nt,g as ee,h as gt,Z as oe,i as ae,o as ne,z as se,j as ce,k as re}from"./index-B1Zs5EKG.js";import{P as ie,W as le}from"./three-render-DMdaHza0.js";const Tt=new P(-.72,.3,.42).normalize(),jt={uSunDir:{value:Tt},uFogSun:{value:new ft(1,.66,.42)},uFogAway:{value:new ft(.52,.57,.68)},uFogDensity:{value:.0013},uFogHeight:{value:125},uTime:{value:0}},Et=`
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
`;function tt(x,n={}){const e=n.key||"base";return x.onBeforeCompile=t=>{Object.assign(t.uniforms,jt,n.uniforms||{});let d=t.vertexShader,o=t.fragmentShader;d=d.replace("#include <common>",`#include <common>
uniform float uTime;
varying vec3 vAtmW;
${n.vHead||""}`),n.vNormal&&(d=d.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
${n.vNormal}`)),n.vBegin&&(d=d.replace("#include <begin_vertex>",`#include <begin_vertex>
${n.vBegin}`)),d=d.replace("#include <fog_vertex>",`#include <fog_vertex>
      {
        vec4 aw = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          aw = instanceMatrix * aw;
        #endif
        vAtmW = ( modelMatrix * aw ).xyz;
      }
      ${n.vEnd||""}`),o=o.replace("#include <common>",`#include <common>
uniform float uTime;
varying vec3 vAtmW;
${Et}
${n.fHead||""}`),n.fColor&&(o=o.replace("#include <color_fragment>",`#include <color_fragment>
${n.fColor}`)),n.fRough&&(o=o.replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
${n.fRough}`)),n.fEmissive&&(o=o.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${n.fEmissive}`)),o=o.replace("#include <fog_fragment>",n.additive?"gl_FragColor.rgb *= 1.0 - atmFogF( vAtmW );":"gl_FragColor.rgb = atmFog( gl_FragColor.rgb, vAtmW );"),t.vertexShader=d,t.fragmentShader=o},x.customProgramCacheKey=()=>`ov:${e}`,x}const fe=`
  varying vec3 vDir;
  void main() {
    vDir = position; // the dome is centred on the camera
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`,pe=`
  varying vec3 vDir;
  uniform float uTime;
  uniform float uSunDisc;
  uniform float uGround;
  ${Et}
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
`;function Yt(x=3600,n=18,e=0){const t=new Dt({vertexShader:fe,fragmentShader:pe,uniforms:{...jt,uSunDisc:{value:n},uGround:{value:e}},side:Ut,depthWrite:!1,depthTest:!1,fog:!1}),d=new Q(At(x,48,24),t);return d.frustumCulled=!1,d.renderOrder=-10,d.name="sky",d}function ue(x){const n=new _t,e=Yt(80,6,1);n.add(e);const t=new ie(x),d=t.fromScene(n,.02,.1,200);return t.dispose(),e.geometry.dispose(),e.material.dispose(),d.texture}const he=4.5;function de(){const x=(h,r)=>tt(new ct(h),r),n=x({color:1910316,roughness:.06,metalness:.3,envMapIntensity:2.8},{key:"lib-glass",uniforms:{uFloor:{value:he},uWarm:{value:new ft(1,.62,.32)}},fHead:`
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
      `}),e=x({color:15130579,roughness:.78,metalness:0},{key:"lib-stone"}),t=x({color:2894376,roughness:.5,metalness:.6},{key:"lib-dark"}),d=x({color:11819322,roughness:.42,metalness:.55,envMapIntensity:1.8},{key:"lib-fins"}),o=x({color:13214826,roughness:.3,metalness:.85,envMapIntensity:2},{key:"lib-brass"}),i=x({vertexColors:!0,roughness:.92,metalness:0},{key:"lib-green"}),f=x({color:15855336,roughness:.55,metalness:.05},{key:"lib-canopy",vHead:"varying float vUpN;",vEnd:"vUpN = normalize( mat3( modelMatrix ) * objectNormal ).y;",fHead:"varying float vUpN;",fColor:`
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
      `}),s=tt(new Gt({color:new ft(2.6,2.1,1.5)}),{key:"lib-glow"}),u=tt(new Gt({color:new ft(1.5,2.3,2.4)}),{key:"lib-glow"});return{glass:n,stone:e,dark:t,fins:d,brass:o,green:i,canopy:f,glow:s,glowCool:u}}function xe(x,n,e,t,d,o=8){const i=new kt,f=[[-x/2,-n/2],[x/2,-n/2],[x/2,n/2],[-x/2,n/2]];for(let s=0;s<4;s++){const u=f[s],h=f[(s+1)%4];let r=h[1]-u[1],m=-(h[0]-u[0]);const y=Math.hypot(r,m);r/=y,m/=y;const a=i.p.length/3;for(let A=0;A<=o;A++){const l=A/o,k=l*e,w=t+(d-t)*l,j=Math.cos(w),p=Math.sin(w),C=(b,F)=>[b*j-F*p,b*p+F*j],q=C(u[0],u[1]),c=C(h[0],h[1]),S=C(r,m);i.v(q[0],k,q[1],S[0],0,S[1],0,k),i.v(c[0],k,c[1],S[0],0,S[1],1,k)}for(let A=0;A<o;A++){const l=a+A*2;i.quad(l,l+2,l+3,l+1)}}return i.build()}function ve(x,n,e,t,d,o=.7,i=64,f=22){const s=new kt,u=.45,h=(l,k)=>{const w=x+e*(l*(1-u)+u*l*Math.sqrt(1-k*k/2)),j=n+t*(k*(1-u)+u*k*Math.sqrt(1-l*l/2));return[w,j]},r=(l,k)=>{const j=(d(l+.5,k)-d(l-.5,k))/1,p=(d(l,k+.5)-d(l,k-.5))/(2*.5),C=Math.hypot(j,1,p);return[-j/C,1/C,-p/C]},m=i+1;for(const l of[!0,!1]){const k=s.p.length/3;for(let w=0;w<=f;w++)for(let j=0;j<=i;j++){const[p,C]=h(j/i*2-1,w/f*2-1),q=d(p,C)-(l?0:o),c=r(p,C);l?s.v(p,q,C,c[0],c[1],c[2],p,C):s.v(p,q,C,-c[0],-c[1],-c[2],p,C)}for(let w=0;w<f;w++)for(let j=0;j<i;j++){const p=k+w*m+j;l?s.quad(p,p+m,p+m+1,p+1):s.quad(p,p+1,p+m+1,p+m)}}const y=[];for(let l=0;l<i;l++)y.push([l/i*2-1,-1]);for(let l=0;l<f;l++)y.push([1,l/f*2-1]);for(let l=i;l>0;l--)y.push([l/i*2-1,1]);for(let l=f;l>0;l--)y.push([-1,l/f*2-1]);const a=y.map(([l,k])=>h(l,k)),A=a.length;for(let l=0;l<A;l++){const[k,w]=a[l],[j,p]=a[(l+1)%A];let C=p-w,q=-(j-k);const c=Math.hypot(C,q)||1;C/=c,q/=c;const S=d(k,w),b=d(j,p),F=s.p.length/3;s.v(k,S-o,w,C,0,q,0,0),s.v(j,b-o,p,C,0,q,1,0),s.v(j,b,p,C,0,q,1,1),s.v(k,S,w,C,0,q,0,1),s.quad(F,F+3,F+2,F+1)}return s.build()}function St(x,n,e,t,d,o,i,f,s=1){const u=[5204794,6980680,8361045,4151861,9214554];for(let h=0;h<i;h++){const r=f(),m=n+(t-n)*r+(f()-.5)*.8,y=e+(d-e)*r+(f()-.5)*.8,a=(.5+f()*.7)*s,A=z(ot(a*2,a*1.3,a*2,a*.6,1),{t:[m,o+a*.6,y],r:[0,f()*3,0]});x.push(Z(A,u[Math.floor(f()*u.length)]))}}function me({tier:x}){const n=de(),e={glass:[],stone:[],dark:[],fins:[],brass:[],green:[],canopy:[],glow:[],glowCool:[]},t=(g,E)=>(e[g].push(E),E);let d=4041;const o=()=>(d=d*16807%2147483647)/2147483647,i=x.name==="high";t("stone",z(L(132,1.2,70),{t:[0,.6,-2]}));for(let g=0;g<5;g++)t("stone",z(L(132,1.2-g*.24,.5),{t:[0,(1.2-g*.24)/2,33.25+g*.5]}));t("glass",z(L(110,8,58),{t:[0,1.2+4,-2]}));for(let g=-54;g<=54.01;g+=3)t("dark",z(L(.14,8,.3),{t:[g,5.2,27.1]})),t("dark",z(L(.14,8,.3),{t:[g,5.2,-31.1]}));for(let g=-30;g<=27.01;g+=3)t("dark",z(L(.3,8,.14),{t:[-55.1,5.2,g]})),t("dark",z(L(.3,8,.14),{t:[55.1,5.2,g]}));t("stone",z(L(116,1.3,64),{t:[0,9.85,-2]}));const f=(g,E)=>13.2+1.7*Math.sin(g*.072+.5)*Math.cos((E-46)*.14)+.6*Math.sin(g*.17+E*.09);t("canopy",ve(0,46,64,17,f,.8,i?80:48,i?26:16));for(const[g,E]of[[-46,40],[-26,50],[-8,38],[12,50],[30,39],[48,49],[-40,55],[38,56]]){t("stone",z(ut(.45,6.5,12,{rTop:.35}),{t:[g,0,E]}));for(let U=0;U<4;U++){const K=U*(Math.PI/2)+.4,I=g+Math.cos(K)*3.4,V=E+Math.sin(K)*3.4;t("stone",Jt([new P(g,6.5-.2,E),new P((g+I)/2,6.5+2.2,(E+V)/2),new P(I,f(I,V)-.7,V)],.2,8))}}const s=0,u=2,h=15,r=10.5,m=55;t("glass",z(ut(h,m-r,64,{caps:!1}),{t:[s,r,u]}));for(let g=0;g<48;g++){const E=g/48*Math.PI*2;t("dark",z(L(.18,m-r,.4),{t:[s+Math.sin(E)*(h+.1),r+(m-r)/2,u+Math.cos(E)*(h+.1)],r:[0,E,0]}))}t("stone",z(Ht(h-1.2,h+.9,0,Math.PI*2,2.2,64),{t:[s,m,u]})),t("glowCool",z(Ht(h-1.6,h-1.15,0,Math.PI*2,.5,64),{t:[s,m+2,u]}));const y=[];for(let g=0;g<=8;g++){const E=g/8*(Math.PI/2);y.push([Math.cos(E)*(h-1.6),Math.sin(E)*3.2])}t("glass",z(te(y,64),{t:[s,m+2.2,u]}));const a={x0:-57,x1:-19,z0:-28,z1:24,y0:10.5,y1:38};t("dark",z(L(a.x1-a.x0,a.y1-a.y0,a.z1-a.z0),{t:[(a.x0+a.x1)/2,(a.y0+a.y1)/2,(a.z0+a.z1)/2]}));for(let g=a.y0+1.6;g<a.y1-1;g+=3.4)t("glow",z(L(a.x1-a.x0-.6,.35,.1),{t:[(a.x0+a.x1)/2,g,a.z1+.06]})),t("glow",z(L(a.x1-a.x0-.6,.35,.1),{t:[(a.x0+a.x1)/2,g,a.z0-.06]})),t("glow",z(L(.1,.35,a.z1-a.z0-.6),{t:[a.x0-.06,g,(a.z0+a.z1)/2]}));const A=a.y1-a.y0+1.5,l=i?1.1:1.6,k=[[a.x0,a.z1+1.1,1,0,a.x1-a.x0,0,1],[a.x1,a.z0-1.1,-1,0,a.x1-a.x0,0,-1],[a.x0-1.1,a.z0,0,1,a.z1-a.z0,-1,0]];let w=0;for(const[g,E,B,U,K]of k)for(let I=l/2;I<K;I+=l){w+=l;const V=.95*Math.sin(w*.085),v=.95*Math.sin(w*.085+1.9),M=Math.atan2(B,U),W=1+.45*Math.sin(w*.05+1);t("fins",z(xe(.22,W,A,V,v,i?10:6),{t:[g+B*I,a.y0-.8,E+U*I],r:[0,M+Math.PI/2,0]}))}t("stone",z(L(a.x1-a.x0+3.4,.9,a.z1-a.z0+3.4),{t:[(a.x0+a.x1)/2,a.y1+.45,(a.z0+a.z1)/2]})),t("stone",z(L(26,.8,9),{t:[-40,24.4,a.z1+5.6]})),t("glass",z(L(26,1.1,.12),{t:[-40,25.35,a.z1+10]})),St(e.green,-52,a.z1+8.6,-28,a.z1+8.6,24.8,i?26:14,o),St(e.green,-55,a.z1-1,-21,a.z1-1,38.9,i?30:16,o,1.2),St(e.green,-55,a.z0+1.5,-21,a.z0+1.5,38.9,i?24:12,o,1.1),t("glass",z(L(14,30.7,40),{t:[27,10.5+15.35,-1]})),t("stone",z(L(14.6,.8,40.6),{t:[27,41.6,-1]})),[[42,13.6,-14,.1],[44,13.6,4,-.08],[40,13.6,18,.12],[48,20.8,-6,-.12],[45,20.8,13,.06],[44,28,-16,.14],[50,28,2,-.05],[46,35.2,-4,.09],[42,35.2,15,-.1]].forEach(([g,E,B,U],K)=>{const I=13+K%3*1.6,V=9.5+K*7%3,v={t:[g,E,B],r:[0,U,0]};t("brass",z(ot(I+.6,.7,V+.6,.3,2),{t:[g,E-2.9,B],r:[0,U,0]})),t("glass",z(ot(I,5.4,V,1.6,3),v)),t("brass",z(ot(I+.6,.7,V+.6,.3,2),{t:[g,E+2.9,B],r:[0,U,0]}));const M=[];St(M,-I/2+1.5,-V/2+1.5,I/2-1.5,V/2-1.5,0,i?9:5,o,.9);for(const W of M)e.green.push(z(W,{t:[g,E+3.25,B],r:[0,U,0]}))});const p={x0:-50,x1:66,z0:-14,z1:12,y0:41.6,y1:50};t("stone",z(L(p.x1-p.x0,p.y1-p.y0,p.z1-p.z0),{t:[(p.x0+p.x1)/2,(p.y0+p.y1)/2,(p.z0+p.z1)/2]})),t("glow",z(L(p.x1-p.x0-10,1.1,.12),{t:[(p.x0+p.x1)/2+2,p.y0+4.2,p.z1+.04]})),t("dark",z(L(p.x1-p.x0-9.6,.18,.5),{t:[(p.x0+p.x1)/2+2,p.y0+3.55,p.z1+.2]}));const C=10,q=(p.x1-p.x0)/C,c=3.4,S=p.z0+.8,b=p.z1-.8;for(let g=0;g<C;g++){const E=p.x0+q*g+.25,B=p.x0+q*(g+1)-.25,U=B-E,K=Math.hypot(U,c),I=new kt,V=-c/K,v=U/K,M=I.v(E,0,b,V,v,0,0,0),W=I.v(B,c,b,V,v,0,U,0),G=I.v(B,c,S,V,v,0,U,b-S),_=I.v(E,0,S,V,v,0,0,b-S);I.quad(M,W,G,_);const $=I.v(E,0,b,0,0,1,0,0),T=I.v(B,0,b,0,0,1,U,0),N=I.v(B,c,b,0,0,1,U,c);I.tri($,T,N);const R=I.v(E,0,S,0,0,-1,0,0),Y=I.v(B,0,S,0,0,-1,U,0),D=I.v(B,c,S,0,0,-1,U,c);I.tri(R,D,Y),t("stone",z(I.build(),{t:[0,p.y1,0]})),t("glass",z(L(.16,c,b-S),{t:[B+.08,p.y1+c/2,(S+b)/2]}))}t("dark",z(L(18,.3,p.z1-p.z0-1),{t:[p.x1-9,p.y0-.15,(p.z0+p.z1)/2]})),St(e.green,p.x0+2,p.z1-.6,p.x1-2,p.z1-.6,p.y1,i?30:16,o,.7);const F=new Rt;F.name="library";for(const[g,E]of Object.entries(e)){if(!E.length)continue;const B=new Q(J(E),n[g]);B.castShadow=g!=="glow"&&g!=="glowCool",B.receiveShadow=g!=="glow"&&g!=="glowCool",B.name=`library-${g}`,F.add(B)}const X=i?140:70,et=Ft(.7,.95);z(et,{r:[Math.PI/2,0,0]});const st=new Float32Array(X*4);for(let g=0;g<X;g++)st[g*4]=o()*Math.PI*2,st[g*4+1]=o()*(h-3),st[g*4+2]=o(),st[g*4+3]=.7+o()*.6;const rt=tt(new Gt({color:new ft(1.9,1.6,1.15),transparent:!0,depthWrite:!1,blending:Vt,side:$t}),{key:"lib-slips",additive:!0,uniforms:{uOrigin:{value:new P(s,m+1,u)}},vHead:`
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
      `,fHead:"varying float vFade;",fColor:"diffuseColor.rgb *= vFade; diffuseColor.a *= vFade;"}),it=new lt(et,rt,X);it.geometry.setAttribute("aSeed",new dt(st,4));const vt=new yt;for(let g=0;g<X;g++)it.setMatrixAt(g,vt.matrix);it.frustumCulled=!1,it.renderOrder=2,F.add(it);const pt={well:new P(s,m+6,u),provenance:new P(a.x0-2,30,a.z1-6),dialogue:new P(52,38.5,8),quiet:new P(30,p.y1+4.5,-2),verify:new P(4,15.8,54)},wt={well:{target:new P(s,34,u),radius:120,phi:.95},provenance:{target:new P(-40,24,0),radius:120,theta:-.55,phi:1.2},dialogue:{target:new P(42,26,0),radius:115,theta:1.35,phi:1.2},quiet:{target:new P(10,45,0),radius:135,phi:1.05},verify:{target:new P(0,8,40),radius:105,theta:.25,phi:1.22}};return{group:F,anchors:pt,focus:wt,materials:n,footprint:{x0:-66,x1:66,z0:-37,z1:62}}}const H={px:96,pz:84,ox:48,oz:42,street:18},O={x0:-135,z0:-117,x1:135,z1:117},ge=Math.atan2(-.72,.42);function ye(x){let n=x;return()=>(n=n*16807%2147483647)/2147483647}function we(){return tt(new ct({color:16777215,roughness:.7,metalness:0,envMapIntensity:2.2}),{key:"towers",vHead:`
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
    `})}function ze(){return tt(new ct({color:16777215,roughness:.9,metalness:0}),{key:"ground",uniforms:{uPitch:{value:new It(H.px,H.pz)},uOff:{value:new It(H.ox,H.oz)},uSite:{value:new Pt(O.x0,O.z0,O.x1,O.z1)}},fHead:`
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
    `,fRough:"roughnessFactor = gRough;"})}function Me(x,n){const e=Math.hypot(x,n),t=Math.atan2(x,n);let d=Math.abs(t-ge);d=Math.min(d,Math.PI*2-d);const o=d<.7?Math.max(14,e/3.6):1e9,i=18+Math.max(0,e-170)*.28;return Math.min(o,i)}function be({tier:x,rnd:n,bridges:e}){const t=x.name==="high"?12:7,d=[],o=[],i=[],f=[[15262940,3],[14275270,1],[4871776,0],[7109252,0],[9411491,0],[13219740,2],[12160362,1],[10985623,2],[3095106,0],[14472906,3],[15789800,2],[6121328,0]],s=(u,h,r,m,y,a,A)=>{const[l,k]=f[Math.floor(n()*f.length)],w=n()<.25?Math.floor(n()*4):k,j=n(),p=.04+n()*.16;if(d.push({x:u,z:h,w:r,d:m,h:y,y:a,style:w,seed:j,lit:p,color:l}),y>55&&n()<.7){const c=.62+n()*.2,S=Math.min(A-(a+y),y*(.15+n()*.25));S>6&&d.push({x:u,z:h,w:r*c,d:m*c,h:S,y:a+y,style:w,seed:j,lit:p,color:l})}const C=d[d.length-1],q=1+Math.floor(n()*3);for(let c=0;c<q;c++)o.push({x:C.x+(n()-.5)*C.w*.5,z:C.z+(n()-.5)*C.d*.5,w:3+n()*6,d:3+n()*6,h:2+n()*3,y:C.y+C.h})};for(let u=-t;u<=t;u++)for(let h=-t;h<=t;h++){if(Math.abs(u)<=1&&Math.abs(h)<=1)continue;const r=u*H.px,m=h*H.pz,y=H.px-H.street-2,a=H.pz-H.street-2,A=Math.hypot(r,m);if(A>t*H.px*1.02)continue;const l=Me(r,m),k=Math.exp(-((r-520)**2+(m+560)**2)/(2*380**2)),w=24+70*Math.min(1,Math.max(0,(A-200)/600))+170*k,j=(c=1)=>Math.min(l,Math.max(10,w*c*(.45+n()*.9)));if(n()<.07&&A>250){i.push({x:r,z:m,w:y,d:a});continue}const p=e.find(c=>c.cell[0]===u&&c.cell[1]===h),C=p?p.y:n()<.55?6+Math.floor(n()*3)*3.5:0;C>0&&d.push({x:r,z:m,w:y,d:a,h:C,y:0,style:0,seed:n(),lit:.6,color:12169894});const q=n();if(q<.38){const c=26+n()*16,S=22+n()*14;s(r+(n()-.5)*(y-c)*.8,m+(n()-.5)*(a-S)*.8,c,S,j(1.25),C,l)}else if(q<.72)for(const c of[-1,1]){const S=y/2-4-n()*6,b=20+n()*(a-26);s(r+c*y*.25,m+(n()-.5)*(a-b)*.7,S,b,j(1),C,l)}else for(const c of[-1,1])for(const S of[-1,1]){const b=y/2-3-n()*8,F=a/2-3-n()*7;s(r+c*y*.25,m+S*a*.25,b,F,j(.6),C,l)}}return{list:d,roof:o,parks:i,N:t}}function qt(x,n){const e=z(L(1,1,1),{t:[0,.5,0]}),t=new lt(e,n,x.length),d=new Float32Array(x.length*4),o=new yt,i=new ft;return x.forEach((f,s)=>{o.position.set(f.x,f.y,f.z),o.scale.set(f.w,f.h,f.d),o.updateMatrix(),t.setMatrixAt(s,o.matrix),t.setColorAt(s,i.set(f.color)),d.set([f.style,f.seed,f.lit,0],s*4)}),t.geometry.setAttribute("aStyle",new dt(d,4)),t.instanceColor.needsUpdate=!0,t.castShadow=!0,t.receiveShadow=!0,t.computeBoundingSphere(),t}function Se(){const x=Z(z(ut(.22,3.4,6,{rTop:.16}),{t:[0,0,0]}),4864556),n=[[0,4.6,0,2.3],[.9,4,.5,1.6],[-.8,4.2,-.6,1.7],[.1,5.7,-.2,1.5]].map(([e,t,d,o])=>Z(z(At(o,8,6),{t:[e,t,d],s:[1,.85,1]}),16777215));return J([x,...n])}function ke(){return tt(new ct({vertexColors:!0,roughness:.85,metalness:0}),{key:"trees",vBegin:`
      {
        vec3 ip = instanceMatrix[ 3 ].xyz;
        float sway = smoothstep( 2.5, 7.0, position.y );
        transformed.x += sin( uTime * 1.1 + ip.x * 0.13 + ip.z * 0.07 ) * 0.18 * sway;
        transformed.z += cos( uTime * 0.9 + ip.z * 0.11 ) * 0.12 * sway;
      }
    `})}function Ce(x,n,e){const t=new yt,d=new ft,o=[6126140,7309893,5139256,8163664,9079358,11569722,6979391];n.forEach(([i,f,s],u)=>{t.position.set(i,0,f),t.rotation.set(0,e()*6.28,0),t.scale.setScalar(s),t.updateMatrix(),x.setMatrixAt(u,t.matrix),d.set(o[Math.floor(e()*o.length)]),x.setColorAt(u,d)}),x.count=n.length,x.instanceMatrix.needsUpdate=!0,x.instanceColor&&(x.instanceColor.needsUpdate=!0)}const Fe=`
  uniform sampler2D tReflect;
  uniform float uHasReflect;
  uniform mat4 uTexMat;
  uniform float uTime;
  varying vec3 vW;
  ${Et}
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
`,Pe=`
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4( position, 1.0 );
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;function Ae(x){const n=new le(4,4,{type:Xt,depthBuffer:!0,generateMipmaps:!1}),e=new Ot,t=new Lt,d=new Zt,o=new Pt,i=new Pt,f=new P,s=new P,u=new P,h=new P(0,1,0);return{rt:n,texMat:t,setSize(r,m){n.setSize(Math.max(2,Math.round(r*x)),Math.max(2,Math.round(m*x)))},render(r,m,y,a,A,l){const k=new P(0,a,0);f.copy(k).sub(y.position).reflect(h).negate().add(k),s.set(0,0,-1).applyQuaternion(y.quaternion).add(y.position),u.copy(k).sub(s).reflect(h).negate().add(k),e.position.copy(f),e.up.set(0,1,0).applyQuaternion(y.quaternion).reflect(h),e.lookAt(u),e.far=y.far,e.updateMatrixWorld(),e.projectionMatrix.copy(y.projectionMatrix),t.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),t.multiply(e.projectionMatrix).multiply(e.matrixWorldInverse),d.setFromNormalAndCoplanarPoint(h,k).applyMatrix4(e.matrixWorldInverse),o.set(d.normal.x,d.normal.y,d.normal.z,d.constant);const w=e.projectionMatrix.elements;i.x=(Math.sign(o.x)+w[8])/w[0],i.y=(Math.sign(o.y)+w[9])/w[5],i.z=-1,i.w=(1+w[10])/w[14],o.multiplyScalar(2/o.dot(i)),w[2]=o.x,w[6]=o.y,w[10]=o.z+1,w[14]=o.w,e.projectionMatrixInverse.copy(e.projectionMatrix).invert(),A.forEach(q=>q.visible=!1);const j=l.position.clone();l.position.copy(e.position);const p=r.getRenderTarget(),C=r.shadowMap.autoUpdate;r.shadowMap.autoUpdate=!1,r.setRenderTarget(n),r.clear(),r.render(m,e),r.setRenderTarget(p),r.shadowMap.autoUpdate=C,l.position.copy(j),A.forEach(q=>q.visible=!0)}}}function je(){const x=[];for(let t=-1400;t<=180;t+=20)x.push(new P(t,13.2,-126));for(let t=1;t<12;t++){const d=t/12*(Math.PI/2);x.push(new P(180+Math.sin(d)*60,13.2,-66-Math.cos(d)*60))}for(let t=-66;t<=1400;t+=20)x.push(new P(240,13.2,t));const e=[0];for(let t=1;t<x.length;t++)e.push(e[t-1]+x[t].distanceTo(x[t-1]));return{pts:x,total:e[e.length-1],at(t,d,o){t=Math.max(0,Math.min(e[e.length-1]-.001,t));let i=0,f=e.length-1;for(;f-i>1;){const u=i+f>>1;e[u]<=t?i=u:f=u}const s=(t-e[i])/(e[f]-e[i]);return d.lerpVectors(x[i],x[f],s),o&&o.subVectors(x[f],x[i]).normalize(),d}}}function We({renderer:x,tier:n,library:e}){const t=ye(9173),d=n.name==="high",o=new Rt;o.name="city";const i=(v,M)=>tt(new ct(v),{key:M}),f={concrete:i({color:14209736,roughness:.8},"c-concrete"),paving:tt(new ct({color:14274495,roughness:.85}),{key:"c-paving",fColor:`
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
      `}),lawn:tt(new ct({color:6257210,roughness:.95}),{key:"c-lawn",fColor:`
        {
          vec2 p = vAtmW.xz;
          float n = fract( sin( dot( floor( p * 1.5 ), vec2( 12.9, 78.2 ) ) ) * 43758.5 );
          float m = 0.5 + 0.5 * sin( p.x * 0.11 + sin( p.y * 0.07 ) * 2.0 );
          diffuseColor.rgb *= 0.82 + 0.16 * n + 0.14 * m;
        }
      `}),glass:i({color:2766396,roughness:.06,metalness:.4,envMapIntensity:2.4},"c-glass"),metal:i({color:9211793,roughness:.35,metalness:.8},"c-metal"),roofUnits:i({color:10131343,roughness:.7},"c-roof"),green:i({vertexColors:!0,roughness:.92},"c-green"),train:tt(new ct({color:15987180,roughness:.25,metalness:.3,vertexColors:!0}),{key:"c-train",fEmissive:"totalEmissiveRadiance += vec3( 1.0, 0.75, 0.45 ) * step( vColor.r, 0.02 ) * 1.4;"})},s=new Q(Ft(9e3,9e3),ze());s.receiveShadow=!0,s.position.y=-.02,o.add(s);const h=be({tier:n,rnd:t,bridges:[{cell:[-2,0],y:10.5},{cell:[2,-1],y:10.5}]}),r=qt(h.list,we());r.name="towers",o.add(r);{const v=z(L(1,1,1),{t:[0,.5,0]}),M=new lt(v,f.roofUnits,h.roof.length),W=new yt;h.roof.forEach((G,_)=>{W.position.set(G.x,G.y,G.z),W.scale.set(G.w,G.h,G.d),W.updateMatrix(),M.setMatrixAt(_,W.matrix)}),M.castShadow=!0,M.receiveShadow=!0,M.computeBoundingSphere(),o.add(M)}{const v=[],M=h.N*H.px+60;for(let G=0;G<(d?900:420);G++){const _=t()*Math.PI*2,$=M+Math.pow(t(),.7)*2200,T=Math.sin(_)*$,N=Math.cos(_)*$,R=Math.exp(-((T-520)**2+(N+560)**2)/(2*900**2));v.push({x:T,z:N,w:20+t()*40,d:20+t()*40,h:20+t()*70+160*R*t(),y:0,style:Math.floor(t()*4),seed:t(),lit:.2,color:[12104360,10134440,13222840][Math.floor(t()*3)]})}const W=qt(v,r.material);W.castShadow=!1,W.receiveShadow=!1,o.add(W)}e.footprint,o.add(Object.assign(new Q(z(Ft(O.x1-O.x0,O.z1-O.z0),{t:[0,.03,0]}),f.paving),{receiveShadow:!0}));const m=[[-104,-84,46,50],[104,-84,46,50],[-106,78,42,60],[106,78,42,60],[-104,4,30,60],[104,4,30,60]],y=[],a=[];for(const[v,M,W,G]of m)y.push(z(Wt(Nt(W,G,9,5),.45),{t:[v,0,M]})),a.push(z(Wt(Nt(W+1.2,G+1.2,9.5,5),.5),{t:[v,0,M]}));const A=new Q(J(y),f.lawn);A.receiveShadow=!0,A.position.y=.08,o.add(A),o.add(Object.assign(new Q(J(a),f.concrete),{receiveShadow:!0,castShadow:!0}));const l={x:0,z:86,w:124,d:24,y:.32},k=J([z(L(l.w+2.4,.7,1.2),{t:[0,.35,l.z-l.d/2-.6]}),z(L(l.w+2.4,.7,1.2),{t:[0,.35,l.z+l.d/2+.6]}),z(L(1.2,.7,l.d),{t:[-124/2-.6,.35,l.z]}),z(L(1.2,.7,l.d),{t:[l.w/2+.6,.35,l.z]})]);o.add(Object.assign(new Q(k,f.concrete),{castShadow:!0,receiveShadow:!0}));const w=d?Ae(.5):null,j=new Dt({vertexShader:Pe,fragmentShader:Fe,uniforms:{...jt,tReflect:{value:w?w.rt.texture:null},uHasReflect:{value:w?1:0},uTexMat:{value:w?w.texMat:new Lt}}}),p=new Q(z(Ft(l.w,l.d),{t:[l.x,l.y,l.z]}),j);p.name="water",o.add(p);const C=14,q=tt(new ct({color:15266548,roughness:.2,transparent:!0,opacity:.55,depthWrite:!1}),{key:"c-jets",vBegin:`
      {
        vec3 ip = instanceMatrix[ 3 ].xyz;
        float k = 0.55 + 0.45 * sin( uTime * 1.6 + ip.x * 0.21 );
        transformed.y *= k;
        transformed.xz *= 1.0 + ( 1.0 - k ) * 0.6 * smoothstep( 0.7, 1.0, position.y / 4.0 );
      }
    `}),c=new lt(ut(.14,4.2,8,{rTop:.05}),q,C);{const v=new yt;for(let M=0;M<C;M++)v.position.set(-52+104*M/(C-1),l.y,l.z),v.updateMatrix(),c.setMatrixAt(M,v.matrix);c.computeBoundingSphere()}o.add(c);const S=[];for(const[v,M,W,G]of m){const _=Math.round(W*G/(d?110:190));for(let $=0;$<_;$++)S.push([v+(t()-.5)*(W-8),M+(t()-.5)*(G-8),.8+t()*.55])}for(let v=-108;v<=108;v+=9)S.push([-128,v,.95+t()*.2]),S.push([128,v,.95+t()*.2]);for(let v=-120;v<=120;v+=10)Math.abs(v)>20&&S.push([v,-110,.9+t()*.2]);for(let v=-60;v<=60;v+=10)S.push([v,104,.85+t()*.25]),S.push([v+5,68,.75+t()*.2]);const b=d?620:380,F=d?13:18;for(let v=-8;v<=8;v++){const M=H.ox+v*H.px,W=H.oz+v*H.pz;for(let G=-b;G<=b;G+=F)for(const _ of[-7.6,7.6]){const $=[M+_,G],T=[G,W+_];for(const[N,R]of[$,T]){if(Math.hypot(N,R)>b||N>O.x0-4&&N<O.x1+4&&R>O.z0-4&&R<O.z1+4)continue;const Y=Math.abs(((N-H.ox)%H.px+H.px)%H.px),D=Math.abs(((R-H.oz)%H.pz+H.pz)%H.pz);Math.min(Y,H.px-Y)<10&&Math.min(D,H.pz-D)<10||t()<.18||S.push([N,R,.7+t()*.3])}}}for(const v of h.parks){const M=Math.round(v.w*v.d/160);for(let W=0;W<M;W++)S.push([v.x+(t()-.5)*v.w,v.z+(t()-.5)*v.d,.9+t()*.5])}const X=new lt(Se(),ke(),S.length);Ce(X,S,t),X.castShadow=!0,X.receiveShadow=!0,X.computeBoundingSphere(),X.name="trees",o.add(X);{const v=h.parks.map(M=>z(Wt(Nt(M.w,M.d,6,4),.3),{t:[M.x,0,M.z]}));v.length&&o.add(Object.assign(new Q(J(v),f.lawn),{receiveShadow:!0}))}const et=[],st=[],rt=[],it=(v,M,W,G=18)=>{const _=new kt;let $=0;const T=2;for(let Y=0;Y<v.length;Y++){const D=v[Y],at=v[Math.min(v.length-1,Y+1)],mt=v[Math.max(0,Y-1)],nt=at.x-mt.x,ht=at.z-mt.z,zt=Math.hypot(nt,ht)||1,Mt=-ht/zt,Ct=nt/zt;Y&&($+=D.distanceTo(v[Y-1])),_.v(D.x+Mt*M/2,D.y,D.z+Ct*M/2,0,1,0,0,$),_.v(D.x-Mt*M/2,D.y,D.z-Ct*M/2,0,1,0,M,$)}for(let Y=0;Y<v.length-1;Y++){const D=Y*T;_.quad(D,D+2,D+3,D+1)}const N=_.build();et.push(N);let R=0;for(let Y=0;Y<v.length-1;Y++){const D=v[Y],at=v[Y+1],mt=D.distanceTo(at),nt=D.clone().add(at).multiplyScalar(.5),ht=Math.atan2(at.x-D.x,at.z-D.z),zt=Math.atan2(at.y-D.y,Math.hypot(at.x-D.x,at.z-D.z));et.push(z(L(M,.9,mt+.05),{t:[nt.x,nt.y-.46,nt.z],r:[-zt,ht,0]}));for(const Mt of[-1,1]){const Ct=Math.cos(ht)*Mt*(M/2-.1),Bt=-Math.sin(ht)*Mt*(M/2-.1);st.push(z(L(.08,1.1,mt),{t:[nt.x+Ct,nt.y+.55,nt.z+Bt],r:[-zt,ht,0]}))}R+=mt,R>G&&W(nt)>3&&(R=0,et.push(z(ut(.45,nt.y-.9,10),{t:[nt.x,0,nt.z]})))}};it([new P(-58,10.5,4),new P(-100,10.5,4),new P(-150,10.5,4),new P(-158,10.5,4)],7,()=>10);const vt=ee([new P(56,10.5,18),new P(78,10.5,30),new P(104,10.5,30),new P(122,10.5,8),new P(150,10.5,-30),new P(170,10.5,-42)],10);it(vt,9,()=>10,16);for(let v=2;v<vt.length-2;v+=2){const M=vt[v],W=vt[v+1],G=Math.atan2(W.x-M.x,W.z-M.z);for(const _ of[-1,1]){const $=[],T=Math.cos(G)*_*3.2,N=-Math.sin(G)*_*3.2,R=.6+t()*.6;$.push(Z(z(ot(R*2,R*1.2,R*2,R*.6,1),{t:[M.x+T,10.5+R*.6,M.z+N]}),[6126140,8163664,9079358][Math.floor(t()*3)])),rt.push(...$)}}it([new P(0,10.5,-37),new P(0,11.4,-80),new P(0,12.6,-118)],8,()=>10,20),o.add(Object.assign(new Q(J(et),f.concrete),{castShadow:!0,receiveShadow:!0})),o.add(new Q(J(st),f.glass)),rt.length&&o.add(Object.assign(new Q(J(rt),f.green),{castShadow:!0}));const pt=je();{const v=[];for(let T=0;T<pt.pts.length-1;T++){const N=pt.pts[T],R=pt.pts[T+1],Y=N.distanceTo(R),D=N.clone().add(R).multiplyScalar(.5),at=Math.atan2(R.x-N.x,R.z-N.z);v.push(z(ot(7.2,1.5,Y+.1,.4,1),{t:[D.x,N.y-.95,D.z],r:[0,at,0]})),T%2===0&&(v.push(z(ut(.8,N.y-1.6,10,{rTop:.65}),{t:[N.x,0,N.z]})),v.push(z(ot(5,.9,2,.3,1),{t:[N.x,N.y-1.9,N.z],r:[0,at,0]})))}o.add(Object.assign(new Q(J(v),f.concrete),{castShadow:!0,receiveShadow:!0}));const M=[];for(const T of[-1,1])M.push(z(L(84,.6,4),{t:[0,12.6,-126+T*6]}));for(let T=-40;T<=40;T+=10)for(const N of[-1,1])M.push(z(ut(.25,7.5,8),{t:[T,12.9,-126+N*7.4]}));o.add(Object.assign(new Q(J(M),f.metal),{castShadow:!0}));const W=new kt,G=40,_=8;for(let T=0;T<=_;T++)for(let N=0;N<=G;N++){const R=-44+88*N/G,Y=-135+18*T/_,D=20.4+1.6*Math.cos((Y+126)/9*(Math.PI/2))-4e-4*R*R;W.v(R,D,Y,0,1,0,R,Y)}for(let T=0;T<_;T++)for(let N=0;N<G;N++){const R=T*(G+1)+N;W.quad(R,R+G+1,R+G+2,R+1)}const $=W.build();$.computeVertexNormals(),o.add(Object.assign(new Q($,f.glass),{castShadow:!0}))}const wt=4,g=17,E=(()=>{const v=Z(ot(3.1,3.3,g,1.1,2),16777215),M=Z(z(ot(3.16,1,g-2.4,.3,1),{t:[0,.35,0]}),1712168),W=Z(z(L(2.6,.5,g-1),{t:[0,-1.8,0]}),3355443);return z(J([v,M,W]),{t:[0,1.95,0]})})(),B=new lt(E,f.train,wt*2);B.castShadow=!0,B.frustumCulled=!1,o.add(B);const U=new P,K=new P,I=new yt;function V(v){for(let M=0;M<2;M++){const W=M?-1:1,G=21,_=pt.total,$=((v*G+M*_*.37)%_+_)%_;for(let T=0;T<wt;T++){let N=W>0?$-T*(g+.8):_-$+T*(g+.8);N=Math.max(1,Math.min(_-1,N)),pt.at(N,U,K);const R=-K.z,Y=K.x;I.position.set(U.x+R*1.9*W,U.y-.2,U.z+Y*1.9*W),I.rotation.set(0,Math.atan2(K.x,K.z),0),I.updateMatrix(),B.setMatrixAt(M*wt+T,I.matrix)}}B.instanceMatrix.needsUpdate=!0}return V(0),{group:o,water:p,reflector:w,path:pt,pool:l,towers:r,update(v,M,W,G,_){V(v),w&&w.render(M,W,G,l.y,[p],_)},resize(v,M){w&&w.setSize(v,M)}}}const xt=Math.PI;function Ne(x){let n=x;return()=>(n=n*16807%2147483647)/2147483647}function Ge(){const x=Z(z(ot(.34,.86,.22,.08,1),{t:[0,.43,0]}),2763310),n=Z(z(ot(.46,.66,.28,.12,1),{t:[0,1.2,0]}),16777215),e=Z(z(At(.12,8,6),{t:[0,1.66,0]}),13148296);return J([x,n,e])}function Te(){return tt(new ct({vertexColors:!0,roughness:.8}),{key:"life-people",vHead:`
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
    `,fColor:"if ( vColor.r > 0.97 && vColor.b > 0.97 ) diffuseColor.rgb = cloth( vHue );"})}function Re(){const x=Z(z(ot(1.9,.75,4.5,.3,1),{t:[0,.6,0]}),16777215),n=Z(z(ot(1.7,.6,2.5,.25,1),{t:[0,1.2,-.2]}),1777700),e=gt(Z(z(L(1.5,.18,.1),{t:[0,.72,2.26]}),16777215),.5),t=gt(Z(z(L(1.6,.16,.1),{t:[0,.78,-2.26]}),16777215),1);return J([gt(x,0),gt(n,0),e,t])}function Le(){return tt(new ct({vertexColors:!0,roughness:.3,metalness:.5}),{key:"life-cars",uniforms:{uSite:{value:new Pt(O.x0-4,O.z0-4,O.x1+4,O.z1+4)}},vHead:`
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
    `})}function Ee(){const x=[Z(ot(1.1,.34,1.1,.12,1),3159098)];for(let n=0;n<4;n++){const e=xt/4+n*xt/2,t=Math.sin(e)*.95,d=Math.cos(e)*.95;x.push(Z(z(L(.12,.08,1.3),{t:[t/2,0,d/2],r:[0,e,0]}),3159098)),x.push(Z(z(ut(.42,.04,12),{t:[t,.12,d]}),9080982))}return x.push(gt(Z(z(At(.2,8,6),{t:[0,-.28,0]}),16777215),1)),J(x.map(n=>n.attributes.aDelay?n:gt(n,0)))}function Ie(){return tt(new ct({vertexColors:!0,roughness:.4,metalness:.6}),{key:"life-drones",vHead:`
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
    `})}function He({tier:x}){const n=x.name==="high",e=Ne(2207),t=new Rt;t.name="life";const d=(s,u)=>!(s<O.x0+2||s>O.x1-2||u<O.z0+2||u>O.z1-2||s>-67&&s<67&&u>-38&&u<36||s>-64&&s<64&&u>72&&u<100),o=[],i=n?700:300;let f=0;for(;o.length<i*.72&&f++<2e4;){const s=O.x0+e()*(O.x1-O.x0),u=O.z0+e()*(O.z1-O.z0),h=Math.exp(-((u-60)**2)/(2*40**2));if(e()>.35+.65*h)continue;const r=e()*xt*2,m=e()<.18?0:3+e()*16;!d(s+Math.sin(r)*m,u+Math.cos(r)*m)||!d(s-Math.sin(r)*m,u-Math.cos(r)*m)||!d(s,u)||o.push([s,u,r,m,m?1.1+e()*.5:0,e()*6.28,.05,e()])}for(let s=0;s<i*.08;s++){const u=e()<.5,h=e(),r=4+e()*10;u?o.push([-70-h*80,4+(e()-.5)*5,xt/2,r,1.2+e()*.4,e()*6.28,10.5,e()]):o.push([(e()-.5)*6,-50-h*60,0,r,1.2+e()*.4,e()*6.28,11.2+h,e()])}for(;o.length<i;){const s=e()<.5,u=Math.floor(e()*9)-4,h=e()<.5?-7.5:7.5,r=(e()-.5)*760,m=s?H.ox+u*H.px+h:r,y=s?r:H.oz+u*H.pz+h;m>O.x0-2&&m<O.x1+2&&y>O.z0-2&&y<O.z1+2||o.push([m,y,s?0:xt/2,8+e()*30,1.1+e()*.5,e()*6.28,.05,e()])}{const s=Ge(),u=new Float32Array(o.length*4),h=new Float32Array(o.length*4);o.forEach((m,y)=>{u.set([m[0],m[1],m[2],m[3]],y*4),h.set([m[4],m[5],m[6],m[7]],y*4)}),s.setAttribute("aWalk",new dt(u,4)),s.setAttribute("aGait",new dt(h,4));const r=new lt(s,Te(),o.length);r.frustumCulled=!1,r.name="people",t.add(r)}{const s=n?460:180,u=Re(),h=new Float32Array(s*4),r=[15329250,2237738,9080982,10768431,3559551,14275784,5331038,12157482],m=new lt(u,Le(),s);for(let a=0;a<s;a++){const A=e()<.5?0:1,l=Math.floor(e()*15)-7,k=e()<.5?-1:1,w=(A===0?H.ox+l*H.px:H.oz+l*H.pz)+k*(A===0?-2.6:2.6)*(e()<.5?1:1.9);h.set([A,w,k*(9+e()*6),e()*2400],a*4)}u.setAttribute("aCar",new dt(h,4));const y=new ft;for(let a=0;a<s;a++)m.setColorAt(a,y.set(r[Math.floor(e()*r.length)]));m.frustumCulled=!1,m.name="cars",t.add(m)}{const s=n?70:34,u=Ee(),h=new Float32Array(s*4),r=new Float32Array(s*4);for(let y=0;y<s;y++){const a=e()<.4,A=120+e()*700,l=e()*xt*2,k=a?Math.sin(l)*A*.5:Math.sin(l)*A,w=a?Math.cos(l)*A*.5:Math.cos(l)*A,j=55+e()*120;if(a)h.set([k,w,-(150+e()*450),j],y*4),r.set([.04+e()*.05,e()*6.28,e()*xt*2,e()],y*4);else{const p=25+e()*90;h.set([k,w,p,j],y*4),r.set([(e()<.5?-1:1)*(6+e()*6)/p,e()*6.28,0,e()],y*4)}}for(let y=0;y<4;y++)h.set([(e()-.5)*80,40+(e()-.5)*60,18+e()*20,30+e()*18],y*4),r.set([.25+e()*.2,e()*6.28,0,.9],y*4);u.setAttribute("aFly",new dt(h,4)),u.setAttribute("aFly2",new dt(r,4));const m=new lt(u,Ie(),s);m.frustumCulled=!1,m.name="drones",t.add(m)}return{group:t}}function qe({dom:x,camera:n,isActive:e,onTap:t}){const d={theta:.62,phi:1.29,radius:275,target:new P(2,30,6)},o={theta:d.theta,phi:d.phi,radius:d.radius,target:d.target.clone()},i={theta:d.theta,phi:d.phi,radius:d.radius,target:d.target.clone()},f={phi0:.16,phi1:1.42,r0:42,r1:950,pan:420};let s=7,u=-100,h=0;const r=new Map;let m=0,y=null,a=null;const A=()=>{u=h,s=7};function l(c,S){i.theta-=c*.0055,i.phi=bt.clamp(i.phi-S*.0045,f.phi0,f.phi1),A()}function k(c){i.radius=bt.clamp(i.radius*c,f.r0,f.r1),A()}const w=new P,j=new P;function p(c,S){const b=i.radius*2*Math.tan(bt.degToRad(n.fov/2))/Math.max(1,x.clientHeight);w.set(Math.cos(o.theta),0,-Math.sin(o.theta)),j.set(-Math.sin(o.theta),0,-Math.cos(o.theta)),i.target.addScaledVector(w,-c*b).addScaledVector(j,S*b*1.4);const F=Math.hypot(i.target.x,i.target.z);F>f.pan&&(i.target.x*=f.pan/F,i.target.z*=f.pan/F),A()}x.addEventListener("pointerdown",c=>{if(e()){try{x.setPointerCapture(c.pointerId)}catch{}if(r.set(c.pointerId,{x:c.clientX,y:c.clientY,panning:c.button===2||c.button===1||c.shiftKey}),r.size===1)a={x:c.clientX,y:c.clientY,t:performance.now(),moved:!1};else{a=null;const[S,b]=[...r.values()];m=Math.hypot(S.x-b.x,S.y-b.y),y={x:(S.x+b.x)/2,y:(S.y+b.y)/2}}A()}}),x.addEventListener("pointermove",c=>{if(!e()||!r.has(c.pointerId))return;const S=r.get(c.pointerId),b=c.clientX-S.x,F=c.clientY-S.y;if(S.x=c.clientX,S.y=c.clientY,r.size===1)a&&Math.hypot(c.clientX-a.x,c.clientY-a.y)>6&&(a.moved=!0),S.panning?p(b,F):l(b,F);else if(r.size===2){const[X,et]=[...r.values()],st=Math.hypot(X.x-et.x,X.y-et.y);m>0&&st>0&&k(m/st),m=st;const rt={x:(X.x+et.x)/2,y:(X.y+et.y)/2};y&&p(rt.x-y.x,rt.y-y.y),y=rt}});const C=c=>{r.has(c.pointerId)&&(r.delete(c.pointerId),r.size<2&&(m=0,y=null),a&&!a.moved&&performance.now()-a.t<500&&r.size===0&&e()&&t&&t(c),r.size===0&&(a=null))};x.addEventListener("pointerup",C),x.addEventListener("pointercancel",C),x.addEventListener("wheel",c=>{e()&&(c.preventDefault(),k(Math.exp(c.deltaY*.0012)))},{passive:!1}),x.addEventListener("contextmenu",c=>{e()&&c.preventDefault()});function q(c,S=1.8){if(c.theta!==void 0){let b=c.theta;for(;b-o.theta>Math.PI;)b-=Math.PI*2;for(;b-o.theta<-Math.PI;)b+=Math.PI*2;i.theta=b}c.phi!==void 0&&(i.phi=bt.clamp(c.phi,f.phi0,f.phi1)),c.radius!==void 0&&(i.radius=bt.clamp(c.radius,f.r0,f.r1)),c.target&&i.target.copy(c.target),s=S,u=h}return{cur:o,goal:i,home:d,snap(c){Object.assign(o,{theta:c.theta??o.theta,phi:c.phi??o.phi,radius:c.radius??o.radius}),c.target&&o.target.copy(c.target)},setGoal:q,key(c){if(c==="ArrowLeft")l(-40,0);else if(c==="ArrowRight")l(40,0);else if(c==="ArrowUp")l(0,-30);else if(c==="ArrowDown")l(0,30);else if(c==="+"||c==="=")k(.85);else if(c==="-"||c==="_")k(1.18);else if(c==="Home")q(d,2.4);else return!1;return!0},update(c,S){h=S,S-u>9&&(i.theta+=c*.022);const b=1-Math.exp(-c*s);o.theta+=(i.theta-o.theta)*b,o.phi+=(i.phi-o.phi)*b,o.radius+=(i.radius-o.radius)*b,o.target.lerp(i.target,b),s<7&&Math.abs(i.phi-o.phi)<.002&&Math.abs(i.radius-o.radius)<.5&&(s=7);const F=Math.sin(o.phi);n.position.set(Math.sin(o.theta)*F,Math.cos(o.phi),Math.cos(o.theta)*F).multiplyScalar(o.radius).add(o.target),n.lookAt(o.target)}}}function _e({root:x,anchors:n,onPick:e,onRead:t}){const d=oe.map((f,s)=>{const u=document.createElement("div");u.className="ov-pin",u.style.setProperty("--zc",ae[f]),u.innerHTML=`
      <button class="ov-label" type="button"><span class="ov-num">${s+1}</span><span class="ov-text"><span class="ov-name"></span><span class="ov-kick"></span></span></button>
      <div class="ov-card"><p class="ov-q"></p><button class="ov-read" type="button"></button></div>`,x.appendChild(u);const h=u.querySelector(".ov-label");return h.addEventListener("click",r=>{r.stopPropagation(),e(f)}),u.querySelector(".ov-read").addEventListener("click",r=>{r.stopPropagation(),t(f)}),{id:f,pin:u,label:h,anchor:n[f],v:new P,shown:!0,half:0,dx:0}});let o=null;function i(){const f=re()==="zh";for(const s of d){const u=se(s.id);s.pin.querySelector(".ov-name").textContent=u.name,s.pin.querySelector(".ov-kick").textContent=f?u.kicker:u.kicker.toUpperCase(),s.pin.querySelector(".ov-q").textContent=u.question,s.pin.querySelector(".ov-read").textContent=`${ce("ovReadPage")} →`,s.label.setAttribute("aria-label",`${u.name}，${u.kicker}`),s.label.setAttribute("aria-expanded",String(o===s.id)),s.half=0}}return ne(i),i(),{setOpen(f){o=f;for(const s of d)s.half=0;for(const s of d)s.pin.classList.toggle("is-open",s.id===f);i()},get open(){return o},update(f,s,u){for(const h of d){h.v.copy(h.anchor).project(f);const r=h.v.z<1&&Math.abs(h.v.x)<1.15&&Math.abs(h.v.y)<1.15;if(r!==h.shown&&(h.pin.style.visibility=r?"":"hidden",h.shown=r),!r)continue;const m=(h.v.x*.5+.5)*s,y=(-h.v.y*.5+.5)*u;h.half||(h.half=Math.max(h.label.offsetWidth,o===h.id?Math.min(290,s*.72):0)/2+8);const a=Math.round(Math.min(s-h.half,Math.max(h.half,m))-m);a!==h.dx&&(h.pin.style.setProperty("--dx",`${a}px`),h.dx=a),h.pin.style.transform=`translate3d(${m.toFixed(1)}px, ${y.toFixed(1)}px, 0)`,h.pin.style.zIndex=String(1e3-Math.round(h.v.z*1e3)+(h.id===o?1e3:0))}}}}const Be={aoRadius:2.4,aoPower:1.25,bloom:.3,threshold:1.25,exposure:1,vignette:.24};function Ue({renderer:x,tier:n,canvas:e,labelRoot:t,onRead:d}){const o=n.name==="high",i=new _t;i.name="overview",i.environment=ue(x),i.environmentIntensity=.4;const f=new Ot(40,window.innerWidth/window.innerHeight,1.5,7e3),s=Yt();i.add(s);const u=6e3,h=.6,r=new Kt(16761994,6.6,0,h,.25,0);r.castShadow=!0,r.shadow.mapSize.set(n.shadow*(o?2:1),n.shadow*(o?2:1)),r.shadow.bias=-25e-5,r.shadow.normalBias=.6,r.shadow.radius=n.shadowRadius,r.shadow.camera.near=u-700,r.shadow.camera.far=u+900,i.add(r,r.target);const m=new Qt(10467549,7034180,.3);i.add(m);const y=me({tier:n});i.add(y.group);const a=We({renderer:x,tier:n,library:y});i.add(a.group);const A=He({tier:n});i.add(A.group);let l=!1;const k=_e({root:t,anchors:y.anchors,onPick(b){if(k.open===b){k.setOpen(null);return}k.setOpen(b);const F=y.focus[b];w.setGoal({target:F.target,radius:F.radius,phi:F.phi,theta:F.theta??w.cur.theta},1.9)},onRead:d}),w=qe({dom:e,camera:f,isActive:()=>l,onTap:()=>k.open&&k.setOpen(null)}),j=new Lt,p=new P;function C(){const b=Math.min(420,Math.max(130,w.cur.radius*.95));r.shadow.focus=Math.atan(b/u)/h;const F=2*b/r.shadow.mapSize.x;j.lookAt(Tt,new P(0,0,0),new P(0,1,0)),p.copy(w.cur.target).setY(0).applyMatrix4(j.clone().invert()),p.x=Math.round(p.x/F)*F,p.y=Math.round(p.y/F)*F,p.applyMatrix4(j),r.target.position.copy(p),r.position.copy(Tt).multiplyScalar(u).add(p),r.target.updateMatrixWorld()}let q=0,c=window.innerWidth,S=window.innerHeight;return{scene:i,camera:f,orbit:w,labels:k,library:y,enter({instant:b=!1}={}){l=!0;const F=w.home;b?w.snap({...F,target:F.target}):(w.snap({theta:F.theta-.55,phi:.2,radius:820,target:F.target}),w.setGoal(F,1.25)),t.hidden=!1},leave(){l=!1,k.setOpen(null),w.setGoal({phi:.2,radius:Math.min(950,w.cur.radius*2.2)},2.2)},hideLabels(){t.hidden=!0},get active(){return l},key(b){return w.key(b)},resize(b,F,X,et){c=b,S=F,f.aspect=b/F,f.fov=b/F<.8?52:40,f.updateProjectionMatrix(),a.resize(X,et)},update(b,F){q+=b,jt.uTime.value=q,w.update(b,F),f.updateMatrixWorld(),s.position.copy(f.position),C(),a.update(q,x,i,f,s),t.hidden||k.update(f,c,S)}}}export{Be as POST,Ue as createOverview};
