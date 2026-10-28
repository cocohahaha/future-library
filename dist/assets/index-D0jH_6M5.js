import{e as Q,g as $,c9 as be,S as ke,a as Ce,M as de,bZ as me,w as pe,ad as ve,aT as Ae,cl as Pe,cp as Ie,ce as Le,p as _e,cb as ze,cj as V,u as Ee,cf as qe,cg as Re,i as xe}from"./three-core-BfwYkZj_.js";import{s as De,x as k,b as G,c as fe,p as Me,r as ae,t as Oe,m as We,a as ue,l as $e,M as ge,d as He,Z as te,e as Te,o as Ne,z as Ge,f as Ue,g as je,h as Be}from"./index-CKwxIm5u.js";import{P as Ye}from"./three-render-DMdaHza0.js";const ce=new $(-.72,.3,.42).normalize(),K={uSunDir:{value:ce},uFogSun:{value:new Q(1,.66,.42)},uFogAway:{value:new Q(.52,.57,.68)},uFogDensity:{value:.0013},uFogHeight:{value:125},uTime:{value:0}},Se=`
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
`;function se(g,c={}){const v=c.key||"base";return g.onBeforeCompile=x=>{Object.assign(x.uniforms,K,c.uniforms||{});let f=x.vertexShader,n=x.fragmentShader;f=f.replace("#include <common>",`#include <common>
uniform float uTime;
varying vec3 vAtmW;
${c.vHead||""}`),c.vNormal&&(f=f.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
${c.vNormal}`)),c.vBegin&&(f=f.replace("#include <begin_vertex>",`#include <begin_vertex>
${c.vBegin}`)),f=f.replace("#include <fog_vertex>",`#include <fog_vertex>
      {
        vec4 aw = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          aw = instanceMatrix * aw;
        #endif
        vAtmW = ( modelMatrix * aw ).xyz;
      }
      ${c.vEnd||""}`),n=n.replace("#include <common>",`#include <common>
uniform float uTime;
varying vec3 vAtmW;
${Se}
${c.fHead||""}`),c.fColor&&(n=n.replace("#include <color_fragment>",`#include <color_fragment>
${c.fColor}`)),c.fRough&&(n=n.replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
${c.fRough}`)),c.fEmissive&&(n=n.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${c.fEmissive}`)),n=n.replace("#include <fog_fragment>",(c.additive?"gl_FragColor.rgb *= 1.0 - atmFogF( vAtmW );":"gl_FragColor.rgb = atmFog( gl_FragColor.rgb, vAtmW );")+`
${c.fEnd||""}`),x.vertexShader=f,x.fragmentShader=n},g.customProgramCacheKey=()=>`ov:${v}`,g}const Ve=`
  varying vec3 vDir;
  void main() {
    vDir = position; // the dome is centred on the camera
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`,Xe=`
  varying vec3 vDir;
  uniform float uTime;
  uniform float uSunDisc;
  uniform float uGround;
  ${Se}
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
`;function Ze(g=3600,c=18,v=0){const x=new ke({vertexShader:Ve,fragmentShader:Xe,uniforms:{...K,uSunDisc:{value:c},uGround:{value:v}},side:Ce,depthWrite:!1,depthTest:!1,fog:!1}),f=new de(De(g,48,24),x);return f.frustumCulled=!1,f.renderOrder=-10,f.name="sky",f}function Ke(g){const c=new be,v=Ze(80,6,1);c.add(v);const x=new Ye(g),f=x.fromScene(c,.02,.1,200);return x.dispose(),v.geometry.dispose(),v.material.dispose(),f.texture}const Qe=4.5;function ye(){const g=(t,d)=>se(new ze(t),d),c=g({color:1910316,roughness:.06,metalness:.3,envMapIntensity:2.8},{key:"lib-glass",uniforms:{uFloor:{value:Qe},uWarm:{value:new Q(1,.62,.32)}},fHead:`
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
      `}),v=g({color:15130579,roughness:.78,metalness:0},{key:"lib-stone"}),x=g({color:2894376,roughness:.5,metalness:.6},{key:"lib-dark"}),f=g({color:11819322,roughness:.42,metalness:.55,envMapIntensity:1.8},{key:"lib-fins"}),n=g({color:13214826,roughness:.3,metalness:.85,envMapIntensity:2},{key:"lib-brass"}),s=g({vertexColors:!0,roughness:.92,metalness:0},{key:"lib-green"}),r=g({color:15855336,roughness:.55,metalness:.05},{key:"lib-canopy",vHead:"varying float vUpN;",vEnd:"vUpN = normalize( mat3( modelMatrix ) * objectNormal ).y;",fHead:"varying float vUpN;",fColor:`
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
      `}),a=se(new pe({color:new Q(2.6,2.1,1.5)}),{key:"lib-glow"}),w=se(new pe({color:new Q(1.5,2.3,2.4)}),{key:"lib-glow"});return{glass:c,stone:v,dark:x,fins:f,brass:n,green:s,canopy:r,glow:a,glowCool:w}}function Je(g,c,v,x,f,n=8){const s=new ge,r=[[-g/2,-c/2],[g/2,-c/2],[g/2,c/2],[-g/2,c/2]];for(let a=0;a<4;a++){const w=r[a],t=r[(a+1)%4];let d=t[1]-w[1],M=-(t[0]-w[0]);const i=Math.hypot(d,M);d/=i,M/=i;const h=s.p.length/3;for(let S=0;S<=n;S++){const p=S/n,y=p*v,D=x+(f-x)*p,C=Math.cos(D),A=Math.sin(D),I=(L,T)=>[L*C-T*A,L*A+T*C],H=I(w[0],w[1]),e=I(t[0],t[1]),m=I(d,M);s.v(H[0],y,H[1],m[0],0,m[1],0,y),s.v(e[0],y,e[1],m[0],0,m[1],1,y)}for(let S=0;S<n;S++){const p=h+S*2;s.quad(p,p+2,p+3,p+1)}}return s.build()}function et(g,c,v,x,f,n=.7,s=64,r=22){const a=new ge,w=.45,t=(p,y)=>{const D=g+v*(p*(1-w)+w*p*Math.sqrt(1-y*y/2)),C=c+x*(y*(1-w)+w*y*Math.sqrt(1-p*p/2));return[D,C]},d=(p,y)=>{const C=(f(p+.5,y)-f(p-.5,y))/1,A=(f(p,y+.5)-f(p,y-.5))/(2*.5),I=Math.hypot(C,1,A);return[-C/I,1/I,-A/I]},M=s+1;for(const p of[!0,!1]){const y=a.p.length/3;for(let D=0;D<=r;D++)for(let C=0;C<=s;C++){const[A,I]=t(C/s*2-1,D/r*2-1),H=f(A,I)-(p?0:n),e=d(A,I);p?a.v(A,H,I,e[0],e[1],e[2],A,I):a.v(A,H,I,-e[0],-e[1],-e[2],A,I)}for(let D=0;D<r;D++)for(let C=0;C<s;C++){const A=y+D*M+C;p?a.quad(A,A+M,A+M+1,A+1):a.quad(A,A+1,A+M+1,A+M)}}const i=[];for(let p=0;p<s;p++)i.push([p/s*2-1,-1]);for(let p=0;p<r;p++)i.push([1,p/r*2-1]);for(let p=s;p>0;p--)i.push([p/s*2-1,1]);for(let p=r;p>0;p--)i.push([-1,p/r*2-1]);const h=i.map(([p,y])=>t(p,y)),S=h.length;for(let p=0;p<S;p++){const[y,D]=h[p],[C,A]=h[(p+1)%S];let I=A-D,H=-(C-y);const e=Math.hypot(I,H)||1;I/=e,H/=e;const m=f(y,D),L=f(C,A),T=a.p.length/3;a.v(y,m-n,D,I,0,H,0,0),a.v(C,L-n,A,I,0,H,1,0),a.v(C,L,A,I,0,H,1,1),a.v(y,m,D,I,0,H,0,1),a.quad(T,T+3,T+2,T+1)}return a.build()}function ne(g,c,v,x,f,n,s,r,a=1){const w=[5204794,6980680,8361045,4151861,9214554];for(let t=0;t<s;t++){const d=r(),M=c+(x-c)*d+(r()-.5)*.8,i=v+(f-v)*d+(r()-.5)*.8,h=(.5+r()*.7)*a,S=k(ae(h*2,h*1.3,h*2,h*.6,1),{t:[M,n+h*.6,i],r:[0,r()*3,0]});g.push(Oe(S,w[Math.floor(r()*w.length)]))}}function ie(g,c,v,x,f,n,s,r,a=.25,w=null){const t=r-s,d=(v+x)/2,M=(f+n)/2;g(c,k(G(x-v,t,a),{t:[d,s+t/2,n-a/2]})),g(c,k(G(x-v,t,a),{t:[d,s+t/2,f+a/2]})),g(c,k(G(a,t,n-f-2*a),{t:[v+a/2,s+t/2,M]})),g(c,k(G(a,t,n-f-2*a),{t:[x-a/2,s+t/2,M]})),w&&g(w,k(G(x-v+.5,.45,n-f+.5),{t:[d,r+.22,M]}))}const z=.6,he={well:{x:0,y:z,z:0,ry:0},provenance:{x:-10.6,y:z,z:-.4,ry:0},dialogue:{x:10.6,y:z,z:-.4,ry:Math.PI/2},quiet:{x:0,y:5,z:-11.8,ry:0},verify:{x:0,y:z,z:11.6,ry:0}};function tt({tier:g}){let c=4041;const v=()=>(c=c*16807%2147483647)/2147483647,x=g.name==="high",f=()=>({glass:[],stone:[],dark:[],fins:[],brass:[],green:[],canopy:[],glow:[],glowCool:[]}),n=new me;n.name="library";function s(o,u,b,_){for(const[O,R]of Object.entries(o)){if(!R.length)continue;const E=new de(We(R),u[O]),W=O!=="glow"&&O!=="glowCool";E.castShadow=W,E.receiveShadow=W,E.name=`${_}-${O}`,b.add(E)}}const r=f();{const o=(u,b)=>r[u].push(b);o("stone",k(G(34,z,46),{t:[0,z/2,5]}));for(let u=0;u<3;u++)o("stone",k(G(30,z-(u+1)*.15,.45),{t:[0,(z-(u+1)*.15)/2,28.2+u*.45]}));o("stone",k(G(25,.4,8.6),{t:[0,4.8,-11.8]}));for(const u of[-11,-5.5,5.5,11])for(const b of[-15,-8.6])o("stone",k(fe(.26,4.2,12),{t:[u,z,b]}));ne(r.green,-15.5,18,-15.5,27,z,x?10:6,v,.5),ne(r.green,15.5,18,15.5,27,z,x?10:6,v,.5),ne(r.green,-15.5,-16,-15.5,6,z,x?12:7,v,.45),ne(r.green,15.5,-16,15.5,6,z,x?12:7,v,.45)}const a=ye();s(r,a,n,"library-base");const w={};function t(o,u,b){const _=f();b((P,N)=>(_[P].push(N),N),_);const R=ye(),E=new _e(new $(0,-1,0),u+1);for(const P of Object.values(R))P.clippingPlanes=[E],P.clipShadows=!0,P.side=ve;const W=new me;W.name=`shell-${o}`,s(_,R,W,`shell-${o}`),n.add(W),w[o]={group:W,clip:E,top:u,floor:he[o].y,materials:R}}const d=4.9,M=10.8;t("well",M+2.4,o=>{o("glass",k(fe(d,M-z,48,{caps:!1}),{t:[0,z,0]}));for(let b=0;b<32;b++){const _=b/32*Math.PI*2;o("dark",k(G(.1,M-z,.22),{t:[Math.sin(_)*(d+.06),(z+M)/2,Math.cos(_)*(d+.06)],r:[0,_,0]}))}o("stone",k(ue(d-.05,d+.3,0,Math.PI*2,.3,48),{t:[0,z,0]})),o("stone",k(ue(d-.7,d+.45,0,Math.PI*2,.9,48),{t:[0,M,0]})),o("glowCool",k(ue(d-.95,d-.7,0,Math.PI*2,.22,48),{t:[0,M+.95,0]}));const u=[];for(let b=0;b<=8;b++){const _=b/8*(Math.PI/2);u.push([Math.cos(_)*(d-.95),Math.sin(_)*1.3])}o("glass",k($e(u,48),{t:[0,M+.9,0]}))});const i={x0:-14.6,x1:-6.6,z0:-5.4,z1:4.6,y1:8.4};t("provenance",i.y1+1,o=>{ie(o,"dark",i.x0,i.x1,i.z0,i.z1,z,i.y1,.25,"stone");for(let R=z+1;R<i.y1-.5;R+=1.25)o("glow",k(G(i.x1-i.x0-.4,.14,.05),{t:[(i.x0+i.x1)/2,R,i.z1+.03]})),o("glow",k(G(i.x1-i.x0-.4,.14,.05),{t:[(i.x0+i.x1)/2,R,i.z0-.03]})),o("glow",k(G(.05,.14,i.z1-i.z0-.4),{t:[i.x0-.03,R,(i.z0+i.z1)/2]}));const u=i.y1-z+.5,b=x?.5:.7,_=[[i.x0,i.z1+.45,1,0,i.x1-i.x0],[i.x1,i.z0-.45,-1,0,i.x1-i.x0],[i.x0-.45,i.z0,0,1,i.z1-i.z0]];let O=0;for(const[R,E,W,P,N]of _)for(let j=b/2;j<N;j+=b){O+=b*2.2;const l=.95*Math.sin(O*.085),F=.95*Math.sin(O*.085+1.9),q=.42+.18*Math.sin(O*.05+1);o("fins",k(Je(.1,q,u,l,F,x?10:6),{t:[R+W*j,z,E+P*j],r:[0,Math.atan2(W,P)+Math.PI/2,0]}))}}),t("dialogue",z+13,(o,u)=>{const E=z+4;ie(o,"glass",6.8,14.4,-4.1,3.3,z,E,.1);for(let P=6.8;P<=14.4+.01;P+=1.9)o("dark",k(G(.08,E-z,.14),{t:[P,(z+E)/2,3.3]}));for(let P=-4.1;P<=3.3+.01;P+=1.85)o("dark",k(G(.14,E-z,.08),{t:[14.4,(z+E)/2,P]}));o("brass",k(ae(14.4-6.8+.4,.4,3.3- -4.1+.4,.15,2),{t:[(6.8+14.4)/2,E+.2,(-4.1+3.3)/2]})),o("glass",k(G(1.6,8.6,5.2),{t:[7.7,E+.4+4.3,-.6]}));const W=[[11.6,E+2.4,-1.6,.12,6.8,3.2,5.8],[10.4,E+6.2,.9,-.1,6,3,5.4]];for(const[P,N,j,l,F,q,B]of W){o("brass",k(ae(F+.3,.3,B+.3,.12,2),{t:[P,N-q/2-.15,j],r:[0,l,0]})),o("glass",k(ae(F,q,B,.8,3),{t:[P,N,j],r:[0,l,0]})),o("brass",k(ae(F+.3,.3,B+.3,.12,2),{t:[P,N+q/2+.15,j],r:[0,l,0]}));const U=[];ne(U,-F/2+.8,-B/2+.8,F/2-.8,B/2-.8,0,x?7:4,v,.4);for(const X of U)u.green.push(k(X,{t:[P,N+q/2+.3,j],r:[0,l,0]}))}});const h={x0:-12,x1:12,z0:-15.8,z1:-7.8,y0:5,y1:8.6};t("quiet",h.y1+2,o=>{ie(o,"stone",h.x0,h.x1,h.z0,h.z1,h.y0,h.y1,.3),o("glow",k(G(h.x1-h.x0-4,.45,.05),{t:[0,h.y0+2.2,h.z1+.03]})),o("dark",k(G(h.x1-h.x0-3.8,.1,.25),{t:[0,h.y0+1.95,h.z1+.12]}));const u=6,b=(h.x1-h.x0)/u,_=1.4,O=h.z0,R=h.z1;for(let E=0;E<u;E++){const W=h.x0+b*E,P=h.x0+b*(E+1)-.1,N=P-W,j=Math.hypot(N,_),l=new ge,F=-_/j,q=N/j,B=l.v(W,0,R,F,q,0,0,0),U=l.v(P,_,R,F,q,0,N,0),X=l.v(P,_,O,F,q,0,N,R-O),Y=l.v(W,0,O,F,q,0,0,R-O);l.quad(B,U,X,Y);const Z=l.v(W,0,R,0,0,1,0,0),oe=l.v(P,0,R,0,0,1,N,0),J=l.v(P,_,R,0,0,1,N,_);l.tri(Z,oe,J);const re=l.v(W,0,O,0,0,-1,0,0),ee=l.v(P,0,O,0,0,-1,N,0),Fe=l.v(P,_,O,0,0,-1,N,_);l.tri(re,Fe,ee),o("stone",k(l.build(),{t:[0,h.y1,0]})),o("glass",k(G(.1,_,R-O),{t:[P+.05,h.y1+_/2,(O+R)/2]}))}});const S={x0:-8,x1:8,z0:7.4,z1:16.2,y1:z+4},p=(o,u)=>5.6+.45*Math.sin(o*.3+.5)*Math.cos((u-21.6)*.5)+.2*Math.sin(o*.7+u*.4);t("verify",7.2,o=>{ie(o,"glass",S.x0,S.x1,S.z0,S.z1,z,S.y1,.1,"stone");for(let u=S.x0;u<=S.x1+.01;u+=1.6)o("dark",k(G(.08,S.y1-z,.14),{t:[u,(z+S.y1)/2,S.z1]}));for(let u=S.z0;u<=S.z1+.01;u+=1.76)o("dark",k(G(.14,S.y1-z,.08),{t:[S.x0,(z+S.y1)/2,u]})),o("dark",k(G(.14,S.y1-z,.08),{t:[S.x1,(z+S.y1)/2,u]}));o("canopy",et(0,21.8,13,5.4,p,.3,x?64:40,x?20:14));for(const[u,b]of[[-9,19.5],[-3,24],[3.5,19.6],[9.5,23.8]]){o("stone",k(fe(.16,3-z,10,{rTop:.12}),{t:[u,z,b]}));for(let O=0;O<4;O++){const R=O*(Math.PI/2)+.4,E=u+Math.cos(R)*1.4,W=b+Math.sin(R)*1.4;o("stone",He([new $(u,3-.1,b),new $((u+E)/2,3+.9,(b+W)/2),new $(E,p(E,W)-.3,W)],.07,6))}}});const y=x?90:50,D=Me(.3,.4);k(D,{r:[Math.PI/2,0,0]});const C=new Float32Array(y*4);for(let o=0;o<y;o++)C[o*4]=v()*Math.PI*2,C[o*4+1]=v()*(d-1.2),C[o*4+2]=v(),C[o*4+3]=.7+v()*.6;const A=se(new pe({color:new Q(1.9,1.6,1.15),transparent:!0,depthWrite:!1,blending:Ae,side:ve}),{key:"lib-slips",additive:!0,uniforms:{uOrigin:{value:new $(0,M+.6,0)}},vHead:`
        attribute vec4 aSeed;
        uniform vec3 uOrigin;
        varying float vFade;
      `,vBegin:`
        {
          float life = fract( aSeed.z + uTime * 0.03 * aSeed.w );
          float h = life * 22.0;
          float a = aSeed.x + life * 2.2;
          float r = aSeed.y * ( 1.0 + life * 1.2 );
          vec3 c = uOrigin + vec3( sin( a ) * r + life * life * 7.0, h, cos( a ) * r + life * life * 2.5 );
          float spin = uTime * ( 0.6 + aSeed.w ) + aSeed.x * 3.0;
          float cs = cos( spin ), sn = sin( spin );
          vec3 p = transformed;
          p = vec3( p.x * cs - p.z * sn, p.y, p.x * sn + p.z * cs );
          float tilt = 0.4 * sin( uTime * 1.3 + aSeed.x * 5.0 );
          p = vec3( p.x, p.y * cos( tilt ) - p.z * sin( tilt ), p.y * sin( tilt ) + p.z * cos( tilt ) );
          transformed = c + p * ( 0.6 + 0.4 * smoothstep( 0.0, 0.1, life ) );
          vFade = smoothstep( 0.0, 0.06, life ) * smoothstep( 1.0, 0.55, life );
        }
      `,fHead:"varying float vFade;",fColor:"diffuseColor.rgb *= vFade; diffuseColor.a *= vFade;"}),I=new Pe(D,A,y);I.geometry.setAttribute("aSeed",new Ie(C,4));const H=new Le;for(let o=0;o<y;o++)I.setMatrixAt(o,H.matrix);I.frustumCulled=!1,I.renderOrder=2,n.add(I);const e={well:new $(0,M+2.6,0),provenance:new $(i.x0-.4,i.y1-1.5,i.z1-1.5),dialogue:new $(13.6,z+11.8,1.4),quiet:new $(6,h.y1+1.8,h.z1-1),verify:new $(2,6.4,22.5)},m={},L={},T={};for(const[o,u]of Object.entries(he))m[o]=e[o].clone(),L[o]=new $(u.x,u.y+3.9,u.z),T[o]={target:new $(u.x,u.y+1.2,u.z),radius:11.5,phi:1,theta:u.ry-.45};return{group:n,zones:w,anchors:m,shellAnchors:e,roomAnchors:L,focus:T,rooms:he,materials:a,footprint:{x0:-17,x1:17,z0:-18,z1:29}}}const le=new Q(15129803);function ot({reveal:g=46}={}){const c=se(new ze({color:15853784,roughness:.96,metalness:0}),{key:"ov-ground",uniforms:{uBg:{value:le},uReveal:{value:g}},fHead:`
      uniform vec3 uBg;
      uniform float uReveal;
      float gFog;
      float gh( vec2 p ) { return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 ); }
      float gn( vec2 p ) {
        vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( gh( i ), gh( i + vec2( 1, 0 ) ), f.x ), mix( gh( i + vec2( 0, 1 ) ), gh( i + vec2( 1, 1 ) ), f.x ), f.y );
      }
      float gfbm( vec2 p ) { return gn( p ) * 0.55 + gn( p * 2.03 + 7.1 ) * 0.28 + gn( p * 4.1 - 3.3 ) * 0.17; }
      // anti-aliased line at the integers of v, w pixels wide
      float gLine( float v, float w ) { float d = abs( fract( v - 0.5 ) - 0.5 ) / max( fwidth( v ), 1e-4 ); return 1.0 - smoothstep( w - 0.5, w + 0.5, d ); }
    `,fColor:`
      {
        vec2 p = vAtmW.xz;
        float r = length( p * vec2( 1.0, 0.86 ) - vec2( 0.0, 3.0 ) );
        // ragged edge of the explored area
        float edge = uReveal * ( 0.78 + 0.5 * gfbm( p * 0.035 ) ) ;
        float seen = 1.0 - smoothstep( edge - 14.0, edge + 6.0, r );
        // survey grid: 2 m and 10 m
        float g = gLine( p.x / 2.0, 0.5 ) * 0.25 + gLine( p.y / 2.0, 0.5 ) * 0.25;
        g = max( g, max( gLine( p.x / 10.0, 0.8 ), gLine( p.y / 10.0, 0.8 ) ) * 0.55 );
        // contours of a gentle invented terrain, flat round the building
        float h = gfbm( p * 0.018 + 3.0 ) * 24.0 + gfbm( p * 0.05 ) * 3.0;
        float flatSite = smoothstep( 22.0, 34.0, r );
        float c = gLine( h / 1.2, 0.6 ) * 0.5 + gLine( h / 6.0, 0.9 ) * 0.45;
        float ink = max( g * 0.55, c * flatSite ) * seen;
        vec3 paper = diffuseColor.rgb * ( 0.97 + 0.06 * gn( p * 1.7 ) );
        diffuseColor.rgb = mix( paper, vec3( 0.42, 0.33, 0.24 ), ink * 0.55 );
        // beyond the edge: blank paper, with a soft cloud of fog
        gFog = 1.0 - seen;
      }
    `,fEnd:`
      gl_FragColor.rgb = mix( gl_FragColor.rgb, uBg * ( 0.98 + 0.05 * gfbm( vAtmW.xz * 0.02 ) ), gFog );
    `}),v=new de(Me(1600,1600),c);return v.receiveShadow=!0,v.name="ground",{mesh:v,material:c}}function nt({dom:g,camera:c,isActive:v,onTap:x}){const f={theta:.62,phi:1.08,radius:92,target:new $(0,3,5)},n={theta:f.theta,phi:f.phi,radius:f.radius,target:f.target.clone()},s={theta:f.theta,phi:f.phi,radius:f.radius,target:f.target.clone()},r={phi0:.16,phi1:1.42,r0:5,r1:260,pan:40};let a=7,w=-100,t=0;const d=new Map;let M=0,i=null,h=null;const S=()=>{w=t,a=7};function p(e,m){s.theta-=e*.0055,s.phi=V.clamp(s.phi-m*.0045,r.phi0,r.phi1),S()}function y(e){s.radius=V.clamp(s.radius*e,r.r0,r.r1),S()}const D=new $,C=new $;function A(e,m){const L=s.radius*2*Math.tan(V.degToRad(c.fov/2))/Math.max(1,g.clientHeight);D.set(Math.cos(n.theta),0,-Math.sin(n.theta)),C.set(-Math.sin(n.theta),0,-Math.cos(n.theta)),s.target.addScaledVector(D,-e*L).addScaledVector(C,m*L*1.4);const T=Math.hypot(s.target.x,s.target.z);T>r.pan&&(s.target.x*=r.pan/T,s.target.z*=r.pan/T),S()}g.addEventListener("pointerdown",e=>{if(v()){try{g.setPointerCapture(e.pointerId)}catch{}if(d.set(e.pointerId,{x:e.clientX,y:e.clientY,panning:e.button===2||e.button===1||e.shiftKey}),d.size===1)h={x:e.clientX,y:e.clientY,t:performance.now(),moved:!1};else{h=null;const[m,L]=[...d.values()];M=Math.hypot(m.x-L.x,m.y-L.y),i={x:(m.x+L.x)/2,y:(m.y+L.y)/2}}S()}}),g.addEventListener("pointermove",e=>{if(!v()||!d.has(e.pointerId))return;const m=d.get(e.pointerId),L=e.clientX-m.x,T=e.clientY-m.y;if(m.x=e.clientX,m.y=e.clientY,d.size===1)h&&Math.hypot(e.clientX-h.x,e.clientY-h.y)>6&&(h.moved=!0),m.panning?A(L,T):p(L,T);else if(d.size===2){const[o,u]=[...d.values()],b=Math.hypot(o.x-u.x,o.y-u.y);M>0&&b>0&&y(M/b),M=b;const _={x:(o.x+u.x)/2,y:(o.y+u.y)/2};i&&A(_.x-i.x,_.y-i.y),i=_}});const I=e=>{d.has(e.pointerId)&&(d.delete(e.pointerId),d.size<2&&(M=0,i=null),h&&!h.moved&&performance.now()-h.t<500&&d.size===0&&v()&&x&&x(e),d.size===0&&(h=null))};g.addEventListener("pointerup",I),g.addEventListener("pointercancel",I),g.addEventListener("wheel",e=>{v()&&(e.preventDefault(),y(Math.exp(e.deltaY*.0012)))},{passive:!1}),g.addEventListener("contextmenu",e=>{v()&&e.preventDefault()});function H(e,m=1.8){if(e.theta!==void 0){let L=e.theta;for(;L-n.theta>Math.PI;)L-=Math.PI*2;for(;L-n.theta<-Math.PI;)L+=Math.PI*2;s.theta=L}e.phi!==void 0&&(s.phi=V.clamp(e.phi,r.phi0,r.phi1)),e.radius!==void 0&&(s.radius=V.clamp(e.radius,r.r0,r.r1)),e.target&&s.target.copy(e.target),a=m,w=t}return{cur:n,goal:s,home:f,snap(e){Object.assign(n,{theta:e.theta??n.theta,phi:e.phi??n.phi,radius:e.radius??n.radius}),e.target&&n.target.copy(e.target)},setGoal:H,key(e){if(e==="ArrowLeft")p(-40,0);else if(e==="ArrowRight")p(40,0);else if(e==="ArrowUp")p(0,-30);else if(e==="ArrowDown")p(0,30);else if(e==="+"||e==="=")y(.85);else if(e==="-"||e==="_")y(1.18);else if(e==="Home")H(f,2.4);else return!1;return!0},update(e,m){t=m,m-w>9&&(s.theta+=e*.022);const L=1-Math.exp(-e*a);n.theta+=(s.theta-n.theta)*L,n.phi+=(s.phi-n.phi)*L,n.radius+=(s.radius-n.radius)*L,n.target.lerp(s.target,L),a<7&&Math.abs(s.phi-n.phi)<.002&&Math.abs(s.radius-n.radius)<.5&&(a=7);const T=Math.sin(n.phi);c.position.set(Math.sin(n.theta)*T,Math.cos(n.phi),Math.cos(n.theta)*T).multiplyScalar(n.radius).add(n.target),c.lookAt(n.target)}}}function at({root:g,anchors:c,onPick:v,onRead:x}){const f=te.map((r,a)=>{const w=document.createElement("div");w.className="ov-pin",w.style.setProperty("--zc",Te[r]),w.innerHTML=`
      <button class="ov-label" type="button"><span class="ov-num">${a+1}</span><span class="ov-text"><span class="ov-name"></span><span class="ov-kick"></span></span></button>
      <div class="ov-card"><p class="ov-q"></p><button class="ov-read" type="button"></button></div>`,g.appendChild(w);const t=w.querySelector(".ov-label");return t.addEventListener("click",d=>{d.stopPropagation(),v(r)}),w.querySelector(".ov-read").addEventListener("click",d=>{d.stopPropagation(),x(r)}),{id:r,pin:w,label:t,anchor:c[r],v:new $,shown:!0,half:0,dx:0}});let n=null;function s(){const r=je()==="zh";for(const a of f){const w=Ge(a.id);a.pin.querySelector(".ov-name").textContent=w.name,a.pin.querySelector(".ov-kick").textContent=r?w.kicker:w.kicker.toUpperCase(),a.pin.querySelector(".ov-q").textContent=w.question,a.pin.querySelector(".ov-read").textContent=`${Ue("ovReadPage")} →`,a.label.setAttribute("aria-label",`${w.name}，${w.kicker}`),a.label.setAttribute("aria-expanded",String(n===a.id)),a.half=0}}return Ne(s),s(),{setOpen(r){n=r;for(const a of f)a.half=0;for(const a of f)a.pin.classList.toggle("is-open",a.id===r);s()},get open(){return n},update(r,a,w){for(const t of f){t.v.copy(t.anchor).project(r);const d=t.v.z<1&&Math.abs(t.v.x)<1.15&&Math.abs(t.v.y)<1.15;if(d!==t.shown&&(t.pin.style.visibility=d?"":"hidden",t.shown=d),!d)continue;const M=(t.v.x*.5+.5)*a,i=(-t.v.y*.5+.5)*w;t.half||(t.half=Math.max(t.label.offsetWidth,n===t.id?Math.min(290,a*.72):0)/2+8);const h=Math.round(Math.min(a-t.half,Math.max(t.half,M))-M);h!==t.dx&&(t.pin.style.setProperty("--dx",`${h}px`),t.dx=h),t.pin.style.transform=`translate3d(${M.toFixed(1)}px, ${i.toFixed(1)}px, 0)`,t.pin.style.zIndex=String(1e3-Math.round(t.v.z*1e3)+(t.id===n?1e3:0))}}}}const ft={aoRadius:.8,aoPower:1.2,bloom:.2,threshold:1.3,exposure:1,vignette:.2},st=82,rt=30,we=92;function ut({renderer:g,tier:c,canvas:v,labelRoot:x,onRead:f}){const n=c.name==="high";ce.set(-.5,.78,.38).normalize(),K.uFogSun.value.copy(le),K.uFogAway.value.copy(le),K.uFogDensity.value=.0022,K.uFogHeight.value=70,g.localClippingEnabled=!0;const s=new be;s.name="overview",s.background=le,s.environment=Ke(g),s.environmentIntensity=.45;const r=new Ee(40,window.innerWidth/window.innerHeight,.2,2400),a=400,w=.5,t=new qe(16773340,3.1,0,w,.2,0);t.castShadow=!0,t.shadow.mapSize.set(c.shadow,c.shadow),t.shadow.autoUpdate=!1,t.shadow.needsUpdate=!0;const d=n?2:4;let M=0;const i=new $(1e9,0,0);let h=0;t.shadow.bias=-4e-4,t.shadow.normalBias=.02,t.shadow.radius=c.shadowRadius,t.shadow.camera.near=a-60,t.shadow.camera.far=a+60,s.add(t,t.target);const S=new Re(15001322,10127988,1);s.add(S);const p=ot({reveal:50});s.add(p.mesh);const y=tt({tier:c});s.add(y.group);const D={},C={};for(const l of te)C[l]=0;const A=new $;function I(l){const F=y.rooms[l],q=Be(te.indexOf(l),{tier:c});q.group.position.set(F.x,F.y,F.z),q.group.rotation.y=F.ry,q.group.name=`room-${l}`,q.group.visible=!1,s.add(q.group),D[l]=q,t.shadow.needsUpdate=!0}let H=!1;const e=at({root:x,anchors:y.anchors,onPick(l){e.open===l?e.setOpen(null):L(l)},onRead:f}),m=nt({dom:v,camera:r,isActive:()=>H,onTap:()=>e.open&&e.setOpen(null)});function L(l){if(e.setOpen(l||null),!l){m.setGoal(m.home,1.9);return}m.setGoal(y.focus[l],1.9)}function T(){const l=new URLSearchParams(location.search),F=l.get("zoom");if(F==="far")return m.home;if(F==="mid")return{theta:.45,phi:.92,radius:48,target:new $(0,2,2)};if(F==="close"){const q=V.clamp(Math.round(Number(l.get("zone"))||1),1,te.length);return y.focus[te[q-1]]}return null}const o=new xe,u=new xe,b=new $,_=new $,O=new $(0,1,0);function R(){const l=Math.min(48,Math.max(9,m.cur.radius*.7));t.shadow.focus=Math.atan(l/a)/w;const F=2*l/t.shadow.mapSize.x;o.lookAt(ce,_,O),u.copy(o).invert(),b.copy(m.cur.target).setY(0).applyMatrix4(u),b.x=Math.round(b.x/F)*F,b.y=Math.round(b.y/F)*F,b.applyMatrix4(o),(b.distanceToSquared(i)>1e-6||Math.abs(l-h)>l*.02||++M>=d)&&(t.shadow.needsUpdate=!0,M=0,i.copy(b),h=l),t.target.position.copy(b),t.position.copy(ce).multiplyScalar(a).add(b),t.target.updateMatrixWorld()}let E=!1;function W(l,F){let q=null,B=1/0;for(const U of te){const X=y.rooms[U],Y=y.zones[U];A.set(X.x,X.y+1.5,X.z);const Z=r.position.distanceTo(A),oe=1-V.smoothstep(Z,rt,st);C[U]+=(oe-C[U])*(1-Math.exp(-l*5)),(E||Math.abs(oe-C[U])<.001)&&(C[U]=oe),E&&!D[U]&&Z<we&&I(U);const J=C[U],re=J*J*(3-2*J);Y.clip.constant=V.lerp(Y.top+1,Y.floor+.9,re),Y.group.visible=Y.clip.constant>Y.floor+.05,y.anchors[U].lerpVectors(y.shellAnchors[U],y.roomAnchors[U],re);const ee=D[U];ee?(ee.group.visible=J>.02,ee.group.visible&&ee.tick(F)):Z<we&&Z<B&&(q=U,B=Z)}q&&!D[q]&&I(q),E=!1}let P=0,N=window.innerWidth,j=window.innerHeight;return{scene:s,camera:r,orbit:m,labels:e,library:y,enter({instant:l=!1}={}){H=!0;const F=T(),q=F||m.home;l||F?(m.snap(q),m.setGoal(q,7),E=!0):(m.snap({theta:q.theta-.55,phi:.2,radius:240,target:q.target}),m.setGoal(q,1.25)),x.hidden=!1},leave(){H=!1,e.setOpen(null),m.setGoal({phi:.2,radius:Math.min(260,Math.max(120,m.cur.radius*2.2))},2.2)},hideLabels(){x.hidden=!0},get active(){return H},focusZone:L,get zone(){return e.open},key(l){return m.key(l)},resize(l,F){N=l,j=F,r.aspect=l/F,r.fov=l/F<.8?52:40,r.updateProjectionMatrix()},update(l,F){P+=l,K.uTime.value=P,m.update(l,F),r.updateMatrixWorld(),W(l,P),R(),x.hidden||e.update(r,N,j)}}}export{ft as POST,ut as createOverview};
