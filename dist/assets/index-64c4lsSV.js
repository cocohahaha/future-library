import{g as O,x as Ne,c8 as Q,M as ie,c9 as ht,O as vo,c2 as Ze,b7 as kt,aY as dt,L as me,b as zt,U as Ee,S as At,V as Y,aW as Zt,H as Lo,X as No,bb as _o,am as $o,i as Mt,E as Wo,ca as jo,D as Ho,G as qt,e as ue,cb as ct,ad as Tt,F as Yt,K as Ye,cc as Ko,cd as Vo,ce as Go,cf as Zo,cg as Yo,ch as Qo,ci as mo,w as Xo,a as Jo,cj as ee,bZ as Qt,ck as ze,v as en,_ as tn,cl as on,o as nn,u as sn}from"./three-core-DGRE-Brg.js";import{W as Se,P as an,a as rn}from"./three-render-EEReV2tl.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const fe={bg:11840154,cloth:10768431,clothSheen:15773834,foil:14267498,paper:16183523,paperEdge:15656402},pt={well:"#2f6f73",provenance:"#b0452f",dialogue:"#b9822a",quiet:"#66784a",verify:"#36507f"},Pt=new O(-.6,.7,.26).normalize();function ln(){let e=null;try{e=new URLSearchParams(location.search).get("q")}catch{}const o=matchMedia("(pointer: coarse)").matches,t=Math.min(window.innerWidth,window.innerHeight)<700,s=navigator.hardwareConcurrency||4,a=navigator.deviceMemory||4;let r=o||t||s<=4||a<=3?"low":"high";return(e==="low"||e==="high")&&(r=e),r}const cn={low:{name:"low",maxDpr:1.5,megapixels:1.7,minScale:.6,msaa:4,shadow:1024,shadowRadius:2,ao:!1,bloomStart:4,bloomLevels:3,pagePx:3.6,pagePxFar:1.2,texScale:.5,figureDetail:.7,books:.6,env:128},high:{name:"high",maxDpr:2,megapixels:4.2,minScale:.65,msaa:4,shadow:2048,shadowRadius:3,ao:!0,bloomStart:2,bloomLevels:5,pagePx:6,pagePxFar:1.6,texScale:1,figureDetail:1,books:1,env:256}},Xt=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4( position.xy, 0.0, 1.0 ); }
`,Jt=`
  float hash12( vec2 p ) {
    vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
    p3 += dot( p3, p3.yzx + 33.33 );
    return fract( ( p3.x + p3.y ) * p3.z );
  }
  vec2 hash22( vec2 p ) {
    vec3 p3 = fract( vec3( p.xyx ) * vec3( 0.1031, 0.1030, 0.0973 ) );
    p3 += dot( p3, p3.yzx + 33.33 );
    return fract( ( p3.xx + p3.yz ) * p3.zy );
  }
  // value noise, periodic with 'per' lattice cells
  float pnoise( vec2 p, vec2 per ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f * f * ( 3.0 - 2.0 * f );
    float a = hash12( mod( i, per ) );
    float b = hash12( mod( i + vec2( 1.0, 0.0 ), per ) );
    float c = hash12( mod( i + vec2( 0.0, 1.0 ), per ) );
    float d = hash12( mod( i + vec2( 1.0, 1.0 ), per ) );
    return mix( mix( a, b, u.x ), mix( c, d, u.x ), u.y );
  }
  float pfbm( vec2 p, vec2 per, int oct ) {
    float s = 0.0;
    float a = 0.5;
    float n = 0.0;
    for ( int i = 0; i < 8; i ++ ) {
      if ( i >= oct ) break;
      s += a * pnoise( p, per );
      n += a;
      p *= 2.0;
      per *= 2.0;
      a *= 0.5;
    }
    return s / n;
  }
  // periodic cellular noise: x = F1, y = F2, z = id hash of the nearest cell
  vec3 pworley( vec2 p, vec2 per ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    float d1 = 8.0;
    float d2 = 8.0;
    float id = 0.0;
    for ( int y = -1; y <= 1; y ++ )
      for ( int x = -1; x <= 1; x ++ ) {
        vec2 g = vec2( float( x ), float( y ) );
        vec2 c = mod( i + g, per );
        vec2 o = hash22( c );
        vec2 r = g + o - f;
        float d = dot( r, r );
        if ( d < d1 ) {
          d2 = d1;
          d1 = d;
          id = hash12( c + 7.31 );
        } else if ( d < d2 ) d2 = d;
      }
    return vec3( sqrt( d1 ), sqrt( d2 ), id );
  }
`,un={oak:{size:[1600,800],bump:1.6,glsl:`
      vec4 board( vec2 p ) {
        float row = floor( p.y / 128.0 );
        float v = fract( p.y / 128.0 );
        float off = hash12( vec2( row, 3.0 ) ) * 1600.0;
        float len = 900.0 + hash12( vec2( row, 9.0 ) ) * 700.0;
        float col = floor( ( p.x + off ) / len );
        float u = fract( ( p.x + off ) / len );
        return vec4( row * 31.0 + col, u, v, hash12( vec2( row, col ) + 0.37 ) );
      }
      float grainField( vec2 p, float id ) {
        vec2 q = p + vec2( id * 113.0, id * 57.0 );
        float warp = pfbm( q * vec2( 0.004, 0.03 ), vec2( 1e4 ), 4 ) * 18.0;
        float w2 = pfbm( q * vec2( 0.02, 0.12 ), vec2( 1e4 ), 3 ) * 2.5;
        return ( p.y + warp + w2 ) * ( 0.55 + 0.25 * hash12( vec2( id, 1.0 ) ) );
      }
      float seams( vec4 b ) {
        return smoothstep( 0.0, 0.006, b.z ) * smoothstep( 1.0, 0.994, b.z ) * smoothstep( 0.0, 0.0015, b.y ) * smoothstep( 1.0, 0.9985, b.y );
      }
      float pores( vec2 p ) { return smoothstep( 0.8, 0.95, pnoise( p * vec2( 0.9, 6.0 ), vec2( 1e4 ) ) ); }
      float height( vec2 p ) {
        vec4 b = board( p );
        float late = pow( abs( sin( grainField( p, b.x ) ) ), 14.0 );
        return -late * 0.025 - pores( p ) * 0.02 + ( seams( b ) - 1.0 ) * 0.35;
      }
      vec3 albedo( vec2 p ) {
        vec4 b = board( p );
        float g = grainField( p, b.x );
        float late = pow( abs( sin( g ) ), 10.0 );
        float early = pow( abs( sin( g * 0.5 + 0.7 ) ), 3.0 );
        vec3 base = mix( vec3( 0.80, 0.69, 0.54 ), vec3( 0.86, 0.77, 0.62 ), b.w );
        base *= 1.0 - 0.08 * hash12( vec2( b.x, 5.0 ) );
        base *= 0.93 + 0.12 * pfbm( p * 0.01 + b.x, vec2( 1e4 ), 4 );
        base = mix( base, base * vec3( 0.80, 0.72, 0.62 ), late * 0.55 );
        base = mix( base, base * 1.04, early * 0.3 );
        // medullary ray flecks on quarter-sawn boards
        if ( b.w > 0.45 ) {
          vec3 w = pworley( p * vec2( 0.08, 0.5 ), vec2( 1e4 ) );
          float fleck = smoothstep( 0.18, 0.05, w.x ) * step( 0.6, w.z );
          base = mix( base, base * vec3( 1.08, 1.05, 1.0 ), fleck * 0.6 );
        }
        base *= 1.0 - pores( p ) * 0.18;
        base *= mix( 0.55, 1.0, seams( b ) );
        return base;
      }
      float rough( vec2 p ) {
        vec4 b = board( p );
        float late = pow( abs( sin( grainField( p, b.x ) ) ), 10.0 );
        return 0.52 + 0.1 * late + 0.08 * pnoise( p * 0.05, vec2( 1e4 ) );
      }
    `},lino:{size:[120,120],bump:.5,glsl:`
      float height( vec2 p ) { return tfbm( p, vec2( 72.0 ), 4 ) * 0.06 + tn( p, vec2( 480.0 ) ) * 0.025; }
      vec3 albedo( vec2 p ) {
        vec3 base = vec3( 0.105, 0.145, 0.175 );
        base *= 0.85 + 0.3 * tfbm( p, vec2( 6.0 ), 5 );
        vec3 w = tworley( p, vec2( 192.0 ) );
        float fleck = smoothstep( 0.16, 0.06, w.x );
        vec3 fc = w.z > 0.5 ? vec3( 0.26, 0.29, 0.31 ) : vec3( 0.05, 0.065, 0.08 );
        return mix( base, fc, fleck * ( 0.35 + 0.4 * fract( w.z * 7.0 ) ) );
      }
      float rough( vec2 p ) { return 0.62 + 0.12 * tfbm( p, vec2( 24.0 ), 3 ); }
    `},paper:{size:[36,36],bump:.28,glsl:`
      // short fibres: stretched noise along four directions (axis and
      // diagonal directions keep the field periodic over the tile)
      float fibres( vec2 p ) {
        vec2 d1 = vec2( p.x + p.y, p.x - p.y );
        float f = pow( tn( p, vec2( 30.0, 220.0 ) ), 4.0 );
        f += pow( tn( p.yx, vec2( 30.0, 220.0 ) ), 4.0 );
        f += pow( tn( d1, vec2( 22.0, 160.0 ) ), 4.0 );
        f += pow( tn( d1.yx, vec2( 22.0, 160.0 ) ), 4.0 );
        return f * 0.25;
      }
      float height( vec2 p ) { return tfbm( p, vec2( 80.0 ), 4 ) * 0.35 + tn( p, vec2( 324.0 ) ) * 0.08 + fibres( p ) * 0.6; }
      vec3 albedo( vec2 p ) {
        float m = tfbm( p, vec2( 4.0 ), 4 );
        float speck = smoothstep( 0.93, 0.99, tn( p, vec2( 108.0 ) ) );
        return vec3( 0.97 + 0.05 * m - speck * 0.05 );
      }
      float rough( vec2 p ) { return 0.86; }
    `},weave:{size:[6,6],bump:.55,glsl:`
      float thread( float a, float along, float id ) {
        float slub = 0.85 + 0.3 * pnoise( vec2( along * 4.0 / 3.0, id * 3.1 ), vec2( 8.0, 1e4 ) );
        float x = ( fract( a ) - 0.5 ) * 2.0 / slub;
        return sqrt( max( 0.0, 1.0 - x * x ) ) * slub;
      }
      float height( vec2 p ) {
        vec2 c = p * 4.0; // threads per mm
        vec2 cell = floor( c );
        float over = mod( cell.x + cell.y, 2.0 );
        float warp = thread( c.x, p.y, cell.x ) * mix( 0.75, 1.0, over );
        float weft = thread( c.y, p.x, cell.y + 50.0 ) * mix( 1.0, 0.75, over );
        return max( warp, weft ) * 0.12;
      }
      vec3 albedo( vec2 p ) {
        vec2 cell = floor( p * 4.0 );
        float over = mod( cell.x + cell.y, 2.0 );
        float t = mix( hash12( vec2( cell.x, 1.0 ) ), hash12( vec2( cell.y, 2.0 ) ), over );
        return vec3( 0.86 + 0.18 * t );
      }
      float rough( vec2 p ) { return 0.8; }
    `},terrazzo:{size:[64,64],bump:.2,glsl:`
      vec4 chips( vec2 p ) {
        vec3 a = tworley( p, vec2( 160.0 ) );
        vec3 b = tworley( p + 1.3, vec2( 352.0 ) );
        float ca = smoothstep( 0.26, 0.2, a.x ) * step( 0.25, a.z );
        float cb = smoothstep( 0.24, 0.17, b.x ) * step( 0.35, b.z );
        return vec4( max( ca, cb ), ca > 0.0 ? a.z : b.z, a.x, b.x );
      }
      float height( vec2 p ) {
        float pit = smoothstep( 0.97, 1.0, tn( p, vec2( 512.0 ) ) );
        return chips( p ).x * 0.02 - pit * 0.05 + tfbm( p, vec2( 20.0 ), 3 ) * 0.04;
      }
      vec3 albedo( vec2 p ) {
        vec3 base = vec3( 0.80, 0.77, 0.72 ) * ( 0.96 + 0.06 * tfbm( p, vec2( 10.0 ), 4 ) );
        vec4 c = chips( p );
        vec3 chip = vec3( 0.93, 0.92, 0.89 );
        if ( c.y < 0.45 ) chip = vec3( 0.55, 0.55, 0.53 );
        else if ( c.y < 0.58 ) chip = vec3( 0.20, 0.20, 0.21 );
        else if ( c.y < 0.72 ) chip = vec3( 0.66, 0.36, 0.26 );
        else if ( c.y < 0.82 ) chip = vec3( 0.50, 0.57, 0.52 );
        chip *= 0.9 + 0.2 * hash12( vec2( c.y * 91.0, 3.0 ) );
        return mix( base, chip, c.x );
      }
      float rough( vec2 p ) { return 0.24 + 0.08 * chips( p ).x + 0.1 * tfbm( p, vec2( 5.0 ), 3 ); }
    `},concrete:{size:[60,60],bump:.45,glsl:`
      float grain( vec2 p, float id ) { return pnoise( vec2( p.x * 0.35, ( p.y + id * 7.0 ) * 6.0 ), vec2( 21.0, 1e4 ) ); }
      float tie( vec2 p ) { vec2 t = mod( p + vec2( 7.5, 1.875 ), vec2( 15.0 ) ) - 7.5; return length( t ); }
      float pore( vec2 p ) { return smoothstep( 0.9, 0.97, tn( p, vec2( 180.0 ) ) ); }
      float height( vec2 p ) {
        float id = floor( p.y / 3.75 );
        float v = fract( p.y / 3.75 );
        float edge = smoothstep( 0.0, 0.06, v ) * smoothstep( 1.0, 0.94, v );
        return edge * 0.05 + grain( p, id ) * 0.03 - smoothstep( 0.55, 0.35, tie( p ) ) * 0.3 - pore( p ) * 0.06 + tfbm( p, vec2( 30.0 ), 3 ) * 0.04;
      }
      vec3 albedo( vec2 p ) {
        float id = floor( p.y / 3.75 );
        float v = fract( p.y / 3.75 );
        vec3 base = vec3( 0.56, 0.55, 0.52 );
        base *= 0.92 + 0.1 * hash12( vec2( mod( id, 16.0 ), 4.0 ) );
        base *= 0.9 + 0.16 * tfbm( p, vec2( 5.0 ), 5 );
        base *= 0.97 + 0.05 * grain( p, id );
        base *= mix( 0.45, 1.0, smoothstep( 0.4, 0.6, tie( p ) ) );
        base *= 1.0 - pore( p ) * 0.35;
        base *= mix( 0.86, 1.0, smoothstep( 0.0, 0.05, v ) * smoothstep( 1.0, 0.95, v ) );
        return base;
      }
      float rough( vec2 p ) { return 0.86 + 0.08 * tn( p, vec2( 18.0 ) ); }
    `},floorOak:{size:[64,64],bump:.25,glsl:`
      vec4 plank( vec2 p ) {
        float row = floor( p.y / 4.0 );
        float off = hash12( vec2( row, 2.0 ) ) * 64.0;
        float col = floor( ( p.x + off ) / 32.0 );
        return vec4( fract( ( p.x + off ) / 32.0 ), fract( p.y / 4.0 ), hash12( vec2( row, mod( col, 2.0 ) ) ), row );
      }
      float edges( vec4 k ) { return smoothstep( 0.0, 0.04, k.y ) * smoothstep( 1.0, 0.96, k.y ) * smoothstep( 0.0, 0.006, k.x ) * smoothstep( 1.0, 0.994, k.x ); }
      float grain( vec2 p, vec4 k ) { return pnoise( vec2( p.x * 26.0 / 64.0, ( p.y + k.w * 3.0 ) * 5.0 ), vec2( 26.0, 1e4 ) ); }
      float height( vec2 p ) { vec4 k = plank( p ); return edges( k ) * 0.05 + grain( p, k ) * 0.012; }
      vec3 albedo( vec2 p ) {
        vec4 k = plank( p );
        vec3 base = mix( vec3( 0.62, 0.47, 0.33 ), vec3( 0.72, 0.58, 0.42 ), k.z );
        base *= 0.9 + 0.16 * grain( p, k );
        base *= 0.94 + 0.08 * tfbm( p, vec2( 13.0 ), 3 );
        return base * mix( 0.6, 1.0, edges( k ) );
      }
      float rough( vec2 p ) { return 0.5 + 0.12 * tn( p, vec2( 38.0 ) ); }
    `},timber:{size:[32,32],bump:.12,glsl:`
      float g( vec2 p ) {
        float w = tfbm( p, vec2( 2.0, 8.0 ), 3 ) * 4.0;
        return sin( ( p.y + w ) * 6.2831853 * 13.0 / 32.0 );
      }
      float height( vec2 p ) { return pow( abs( g( p ) ), 6.0 ) * -0.02; }
      vec3 albedo( vec2 p ) {
        float l = pow( abs( g( p ) ), 6.0 );
        return vec3( 1.0 ) * ( 0.94 + 0.08 * tfbm( p, vec2( 3.0 ), 4 ) ) * ( 1.0 - 0.12 * l );
      }
      float rough( vec2 p ) { return 0.55 + 0.1 * pow( abs( g( p ) ), 6.0 ); }
    `},felt:{size:[20,20],bump:.35,glsl:`
      float height( vec2 p ) { return tfbm( p, vec2( 60.0 ), 5 ) * 0.1; }
      vec3 albedo( vec2 p ) { return vec3( 0.93 + 0.1 * tfbm( p, vec2( 12.0 ), 4 ) ); }
      float rough( vec2 p ) { return 0.95; }
    `},cork:{size:[20,20],bump:.5,glsl:`
      float height( vec2 p ) { vec3 w = tworley( p, vec2( 64.0 ) ); return ( w.y - w.x ) * 0.12 + tn( p, vec2( 180.0 ) ) * 0.03; }
      vec3 albedo( vec2 p ) {
        vec3 w = tworley( p, vec2( 64.0 ) );
        return mix( vec3( 0.52, 0.34, 0.2 ), vec3( 0.72, 0.52, 0.32 ), w.z ) * ( 0.8 + 0.3 * ( w.y - w.x ) );
      }
      float rough( vec2 p ) { return 0.9; }
    `},plaster:{size:[40,40],bump:.12,glsl:`
      float height( vec2 p ) { return tfbm( p, vec2( 32.0 ), 5 ) * 0.08; }
      vec3 albedo( vec2 p ) { return vec3( 0.97 + 0.04 * tfbm( p, vec2( 4.0 ), 4 ) ); }
      float rough( vec2 p ) { return 0.88; }
    `}};function fn(e){const o=new Ne;o.setAttribute("position",new Q([-1,-1,0,3,-1,0,-1,3,0],3)),o.setAttribute("uv",new Q([0,0,2,0,0,2],2));const t=new ie(o,null);t.frustumCulled=!1;const s=new ht;s.add(t);const a=new vo(-1,1,1,-1,0,1),r=Math.min(8,e.capabilities.getMaxAnisotropy()),i=new Map;function c(u,h,{srgb:d=!1,mirrored:p=!1}={}){return new Se(u,h,{type:Ee,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!0,minFilter:zt,magFilter:me,wrapS:p?Zt:dt,wrapT:p?Zt:dt,anisotropy:r,colorSpace:d?Ze:kt})}function l(u,h){t.material=u;const d=e.getRenderTarget();e.setRenderTarget(h),e.render(s,a),e.setRenderTarget(d)}function n(u,{res:h=512,mirrored:d=!1}={}){const p=`${u}:${h}`;if(i.has(p))return i.get(p);const v=un[u],m=v.size[0]/v.size[1],g=Math.round(h*Math.max(1,m)),w=Math.round(h/Math.min(1,m)),A={uSize:{value:new Y(v.size[0],v.size[1])},uRes:{value:new Y(g,w)},uBump:{value:v.bump}},y=k=>`
      uniform vec2 uSize;
      uniform vec2 uRes;
      uniform float uBump;
      varying vec2 vUv;
      ${Jt}
      // tile-periodic helpers: 'cells' lattice cells across the whole tile
      float tn( vec2 p, vec2 cells ) { return pnoise( p / uSize * cells, cells ); }
      float tfbm( vec2 p, vec2 cells, int oct ) { return pfbm( p / uSize * cells, cells, oct ); }
      vec3 tworley( vec2 p, vec2 cells ) { return pworley( p / uSize * cells, cells ); }
      ${v.glsl}
      void main() {
        vec2 p = vUv * uSize;
        #if ${k} == 0
          gl_FragColor = vec4( albedo( p ), 1.0 );
        #elif ${k} == 1
          vec2 e = uSize / uRes;
          float hl = height( p - vec2( e.x, 0.0 ) );
          float hr = height( p + vec2( e.x, 0.0 ) );
          float hd = height( p - vec2( 0.0, e.y ) );
          float hu = height( p + vec2( 0.0, e.y ) );
          vec3 n = normalize( vec3( ( hl - hr ) / ( 2.0 * e.x ) * uBump, ( hd - hu ) / ( 2.0 * e.y ) * uBump, 1.0 ) );
          gl_FragColor = vec4( n * 0.5 + 0.5, 1.0 );
        #else
          gl_FragColor = vec4( 1.0, clamp( rough( p ), 0.02, 1.0 ), 0.0, 1.0 );
        #endif
      }
    `,z={size:v.size};return["map","normalMap","roughnessMap"].forEach((k,B)=>{const D=c(g,w,{srgb:B===0,mirrored:d}),R=new At({vertexShader:Xt,fragmentShader:y(B),uniforms:A,depthTest:!1,depthWrite:!1});l(R,D),R.dispose(),z[k]=D.texture,z[k+"RT"]=D}),i.set(p,z),z}function f(u,{width:h,height:d,uniforms:p={},srgb:v=!1,mips:m=!0,wrap:g=dt}={}){const w=new Se(h,d,{type:Ee,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:m,minFilter:m?zt:me,magFilter:me,wrapS:g,wrapT:g,anisotropy:r,colorSpace:v?Ze:kt}),A=new At({vertexShader:Xt,fragmentShader:`varying vec2 vUv;
${Jt}
${u}`,uniforms:p,depthTest:!1,depthWrite:!1});return l(A,w),A.dispose(),w.texture}return{bake:n,shader:f,anisotropy:r}}const hn=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4( position.xy, 0.0, 1.0 );
  }
`,pn=`
  uniform sampler2D tSrc;
  uniform vec2 uTexel;
  uniform float uThreshold;
  uniform float uKnee;
  varying vec2 vUv;
  vec3 pick( vec2 uv ) { return texture2D( tSrc, uv ).rgb; }
  void main() {
    vec3 c = ( pick( vUv + uTexel * vec2( -1.0, -1.0 ) ) + pick( vUv + uTexel * vec2( 1.0, -1.0 ) )
             + pick( vUv + uTexel * vec2( -1.0, 1.0 ) ) + pick( vUv + uTexel * vec2( 1.0, 1.0 ) ) ) * 0.25;
    c = min( c, vec3( 40.0 ) );
    float br = max( c.r, max( c.g, c.b ) );
    float soft = clamp( br - uThreshold + uKnee, 0.0, 2.0 * uKnee );
    soft = soft * soft / ( 4.0 * uKnee + 1e-4 );
    float w = max( soft, br - uThreshold ) / max( br, 1e-4 );
    gl_FragColor = vec4( c * w, 1.0 );
  }
`,dn=`
  uniform sampler2D tSrc;
  uniform vec2 uTexel;
  varying vec2 vUv;
  void main() {
    vec2 o = uTexel;
    vec3 c = texture2D( tSrc, vUv ).rgb * 4.0;
    c += texture2D( tSrc, vUv + vec2( -o.x, -o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( o.x, -o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( -o.x, o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( o.x, o.y ) ).rgb;
    gl_FragColor = vec4( c * 0.125, 1.0 );
  }
`,vn=`
  uniform sampler2D tSrc;   // lower (smaller) level, already accumulated
  uniform sampler2D tBase;  // this level's downsample
  uniform vec2 uTexel;      // texel of tSrc
  varying vec2 vUv;
  void main() {
    vec2 o = uTexel;
    vec3 c = texture2D( tSrc, vUv + vec2( -o.x, 0.0 ) ).rgb * 2.0;
    c += texture2D( tSrc, vUv + vec2( o.x, 0.0 ) ).rgb * 2.0;
    c += texture2D( tSrc, vUv + vec2( 0.0, -o.y ) ).rgb * 2.0;
    c += texture2D( tSrc, vUv + vec2( 0.0, o.y ) ).rgb * 2.0;
    c += texture2D( tSrc, vUv + vec2( -o.x, -o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( o.x, -o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( -o.x, o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( o.x, o.y ) ).rgb;
    c += texture2D( tSrc, vUv ).rgb * 4.0;
    gl_FragColor = vec4( c / 16.0 + texture2D( tBase, vUv ).rgb, 1.0 );
  }
`,mn=`
  uniform sampler2D tDepth;
  uniform mat4 uProj;
  uniform mat4 uProjInv;
  uniform vec2 uTexel;     // full-resolution depth texel
  uniform float uRadius;   // world units (mm)
  uniform float uPower;
  varying vec2 vUv;
  vec3 viewPos( vec2 uv ) {
    float d = texture2D( tDepth, uv ).x;
    vec4 v = uProjInv * vec4( uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0 );
    return v.xyz / v.w;
  }
  float ign( vec2 p ) { return fract( 52.9829189 * fract( dot( p, vec2( 0.06711056, 0.00583715 ) ) ) ); }
  void main() {
    float d = texture2D( tDepth, vUv ).x;
    if ( d >= 1.0 ) { gl_FragColor = vec4( 1.0 ); return; }
    vec3 P = viewPos( vUv );
    vec2 t = uTexel * 1.5;
    vec3 pr = viewPos( vUv + vec2( t.x, 0.0 ) ) - P;
    vec3 pl = P - viewPos( vUv - vec2( t.x, 0.0 ) );
    vec3 pu = viewPos( vUv + vec2( 0.0, t.y ) ) - P;
    vec3 pd = P - viewPos( vUv - vec2( 0.0, t.y ) );
    vec3 dx = abs( pr.z ) < abs( pl.z ) ? pr : pl;
    vec3 dy = abs( pu.z ) < abs( pd.z ) ? pu : pd;
    vec3 N = normalize( cross( dx, dy ) );
    vec3 Tg = normalize( cross( N, abs( N.y ) < 0.95 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 ) ) );
    vec3 Bt = cross( N, Tg );
    float rot = ign( gl_FragCoord.xy ) * 6.2831853;
    float occ = 0.0;
    const int SAMPLES = 12;
    for ( int i = 0; i < SAMPLES; i ++ ) {
      float f = ( float( i ) + 0.5 ) / float( SAMPLES );
      float a = float( i ) * 2.3999632 + rot;
      float r = sqrt( f );
      vec3 h = vec3( cos( a ) * r, sin( a ) * r, sqrt( max( 0.0, 1.0 - f ) ) );
      float sc = mix( 0.15, 1.0, f * f );
      vec3 S = P + ( Tg * h.x + Bt * h.y + N * h.z ) * uRadius * sc;
      vec4 c = uProj * vec4( S, 1.0 );
      vec2 suv = c.xy / c.w * 0.5 + 0.5;
      float sz = viewPos( suv ).z;
      float range = smoothstep( 0.0, 1.0, uRadius / max( abs( P.z - sz ), 1e-3 ) );
      occ += ( sz >= S.z + uRadius * 0.03 ? 1.0 : 0.0 ) * range;
    }
    float ao = 1.0 - occ / float( SAMPLES );
    gl_FragColor = vec4( pow( clamp( ao, 0.0, 1.0 ), uPower ), 0.0, 0.0, 1.0 );
  }
`,gn=`
  uniform sampler2D tAO;
  uniform sampler2D tDepth;
  uniform mat4 uProjInv;
  uniform vec2 uDir;     // texel step in the AO target
  varying vec2 vUv;
  float vz( vec2 uv ) {
    float d = texture2D( tDepth, uv ).x;
    vec4 v = uProjInv * vec4( uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0 );
    return v.z / v.w;
  }
  void main() {
    float z0 = vz( vUv );
    float sum = 0.0;
    float wsum = 0.0;
    for ( int i = -3; i <= 3; i ++ ) {
      vec2 uv = vUv + uDir * float( i );
      float w = exp( -float( i * i ) / 8.0 ) * exp( -abs( vz( uv ) - z0 ) * 0.35 );
      sum += texture2D( tAO, uv ).r * w;
      wsum += w;
    }
    gl_FragColor = vec4( sum / wsum, 0.0, 0.0, 1.0 );
  }
`,wn=`
  uniform sampler2D tScene;
  uniform sampler2D tBloom;
  uniform sampler2D tAO;
  uniform float uAO;
  uniform float uBloom;
  uniform float uExposure;
  uniform float uVignette;
  uniform float uFade;
  uniform vec3 uFadeColor;
  uniform vec2 uRes;
  uniform float uTime;
  varying vec2 vUv;
  // Khronos PBR Neutral, with a gentler desaturation: below ~0.76 colours
  // pass through untouched apart from a tiny toe, highlights compress
  vec3 neutral( vec3 c ) {
    const float start = 0.76;
    const float desat = 0.06;
    float x = min( c.r, min( c.g, c.b ) );
    float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
    c -= offset;
    float peak = max( c.r, max( c.g, c.b ) );
    if ( peak < start ) return c;
    float d = 1.0 - start;
    float np = 1.0 - d * d / ( peak + d - start );
    c *= np / peak;
    float g = 1.0 - 1.0 / ( desat * ( peak - np ) + 1.0 );
    return mix( c, vec3( np ), g );
  }
  float hash( vec2 p ) {
    vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
    p3 += dot( p3, p3.yzx + 33.33 );
    return fract( ( p3.x + p3.y ) * p3.z );
  }
  void main() {
    vec3 c = texture2D( tScene, vUv ).rgb;
    float ao = texture2D( tAO, vUv ).r;
    c *= mix( 1.0, ao, uAO );
    c += texture2D( tBloom, vUv ).rgb * uBloom;
    c = neutral( c * uExposure );
    // vignette: soft ellipse, a little stronger at the bottom corners
    vec2 q = vUv - 0.5;
    q.x *= mix( 1.0, uRes.x / uRes.y, 0.6 );
    c *= mix( 1.0 - uVignette, 1.0, smoothstep( 0.86, 0.22, length( q ) ) );
    c = mix( uFadeColor, c, uFade );
    // sRGB encode, then dither to hide banding in the soft gradients
    c = clamp( c, 0.0, 1.0 );
    c = mix( c * 12.92, 1.055 * pow( c, vec3( 1.0 / 2.4 ) ) - 0.055, step( 0.0031308, c ) );
    c += ( hash( vUv * uRes + fract( uTime ) * 37.0 ) - 0.5 ) / 255.0;
    gl_FragColor = vec4( c, 1.0 );
  }
`;function yn(e,o){const t=e.getContext(),s=e.extensions,r=s.has("EXT_color_buffer_half_float")||s.has("EXT_color_buffer_float")?Lo:Ee,i=t.getParameter(t.MAX_SAMPLES)||0,c=Math.min(o.msaa,i);let l=!!o.ao;const n={type:r,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1,minFilter:me,magFilter:me},f=new Se(4,4,{type:r,samples:c,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1});f.depthTexture=new No(4,4,_o),f.depthTexture.minFilter=f.depthTexture.magFilter=$o;const u=new Se(4,4,{type:Ee,depthBuffer:!1,generateMipmaps:!1,minFilter:me,magFilter:me}),h=u.clone(),d=o.bloomLevels,p=[],v=[];for(let E=0;E<d;E++)p.push(new Se(4,4,n)),v.push(new Se(4,4,n));const m=new Ne;m.setAttribute("position",new Q([-1,-1,0,3,-1,0,-1,3,0],3)),m.setAttribute("uv",new Q([0,0,2,0,0,2],2));const g=new vo(-1,1,1,-1,0,1),w=new ie(m,null);w.frustumCulled=!1;const A=new ht;A.add(w);const y=(E,j)=>new At({vertexShader:hn,fragmentShader:E,uniforms:j,depthTest:!1,depthWrite:!1,toneMapped:!1}),z=y(pn,{tSrc:{value:null},uTexel:{value:new Y},uThreshold:{value:1.1},uKnee:{value:.5}}),k=y(dn,{tSrc:{value:null},uTexel:{value:new Y}}),B=y(vn,{tSrc:{value:null},tBase:{value:null},uTexel:{value:new Y}}),D=y(mn,{tDepth:{value:f.depthTexture},uProj:{value:new Mt},uProjInv:{value:new Mt},uTexel:{value:new Y},uRadius:{value:7},uPower:{value:1.5}}),R=y(gn,{tAO:{value:null},tDepth:{value:f.depthTexture},uProjInv:{value:D.uniforms.uProjInv.value},uDir:{value:new Y}}),x=new Se(1,1,{type:Ee}),N=y(wn,{tScene:{value:f.texture},tBloom:{value:v[0].texture},tAO:{value:x.texture},uAO:{value:.85},uBloom:{value:.22},uExposure:{value:1},uVignette:{value:.26},uFade:{value:1},uFadeColor:{value:new O(.94,.91,.86)},uRes:{value:new Y(1,1)},uTime:{value:0}}),le=new Y;function De(E,j){f.setSize(E,j),u.setSize(Math.max(1,E>>1),Math.max(1,j>>1)),h.setSize(Math.max(1,E>>1),Math.max(1,j>>1));let ve=Math.max(1,Math.round(E/o.bloomStart)),_=Math.max(1,Math.round(j/o.bloomStart));for(let F=0;F<d;F++)p[F].setSize(ve,_),v[F].setSize(ve,_),ve=Math.max(1,Math.round(ve/2)),_=Math.max(1,Math.round(_/2));N.uniforms.uRes.value.set(E,j),D.uniforms.uTexel.value.set(1/E,1/j),le.set(E,j)}function re(E,j){w.material=E,e.setRenderTarget(j),e.render(A,g)}return e.setRenderTarget(x),e.setClearColor(16777215,1),e.clear(),e.setRenderTarget(null),{sceneRT:f,uniforms:N.uniforms,ao:D.uniforms,bright:z.uniforms,setSize:De,get aoEnabled(){return l},set aoEnabled(E){l=!!E},render(E,j,ve){e.setRenderTarget(f),e.render(E,j),l?(D.uniforms.uProj.value.copy(j.projectionMatrix),D.uniforms.uProjInv.value.copy(j.projectionMatrixInverse),re(D,u),R.uniforms.tAO.value=u.texture,R.uniforms.uDir.value.set(1/u.width,0),re(R,h),R.uniforms.tAO.value=h.texture,R.uniforms.uDir.value.set(0,1/u.height),re(R,u),N.uniforms.tAO.value=u.texture):N.uniforms.tAO.value=x.texture,z.uniforms.tSrc.value=f.texture,z.uniforms.uTexel.value.set(1/le.x,1/le.y),re(z,p[0]);for(let F=1;F<d;F++)k.uniforms.tSrc.value=p[F-1].texture,k.uniforms.uTexel.value.set(1/p[F-1].width,1/p[F-1].height),re(k,p[F]);let _=p[d-1];for(let F=d-2;F>=0;F--)B.uniforms.tSrc.value=_.texture,B.uniforms.tBase.value=p[F].texture,B.uniforms.uTexel.value.set(1/_.width,1/_.height),re(B,v[F]),_=v[F];N.uniforms.tBloom.value=d>1?v[0].texture:p[0].texture,N.uniforms.uTime.value=ve,re(N,null)}}}function bn({minScale:e=.6,onChange:o=()=>{}}={}){let t=1,s=0,a=0,r=0,i=16,c=0;return{get scale(){return t},get ms(){return i},sample(l){const n=l*1e3;if(n>250||(c++,c<90)||(i+=(n-i)*.05,s+=n,a++,s<1500))return;const f=s/a;s=0,a=0,f>26&&t>e?(t=Math.max(e,t*.85),r=0,o(t)):f<14.5?(r++,r>=4&&t<1&&(t=Math.min(1,t*1.1),r=0,o(t))):r=0}}}class Et{constructor(){this.p=[],this.n=[],this.uv=[],this.idx=[]}v(o,t,s,a,r,i,c,l){return this.p.push(o,t,s),this.n.push(a,r,i),this.uv.push(c,l),this.p.length/3-1}tri(o,t,s){this.idx.push(o,t,s)}quad(o,t,s,a){this.idx.push(o,t,s,o,s,a)}build(){const o=new Ne;o.setAttribute("position",new Q(this.p,3)),o.setAttribute("normal",new Q(this.n,3)),o.setAttribute("uv",new Q(this.uv,2));const t=this.p.length/3;return o.setIndex(t>65535?new Ho(this.idx,1):new qt(this.idx,1)),o}}function go(e,o,t,s=0,a=2){const r=e/2,i=o/2,c=t/2;s=Math.max(0,Math.min(s,r,i,c)),s<1e-4&&(a=0);const l=new Et,n=y=>{if(!a)return[-y,y];const z=[];for(let k=0;k<=a;k++)z.push(-y+s*k/a);for(let k=0;k<=a;k++)z.push(y-s+s*k/a);return z},f=n(r),u=n(i),h=n(c),d=new O,p=new O,v=new O,m=(y,z)=>Math.max(-z,Math.min(z,y)),g=[{ax:0,s:1,a:2,b:1,ta:h,tb:u,flipA:!0},{ax:0,s:-1,a:2,b:1,ta:h,tb:u,flipA:!1},{ax:1,s:1,a:0,b:2,ta:f,tb:h,flipA:!0},{ax:1,s:-1,a:0,b:2,ta:f,tb:h,flipA:!1},{ax:2,s:1,a:0,b:1,ta:f,tb:u,flipA:!1},{ax:2,s:-1,a:0,b:1,ta:f,tb:u,flipA:!0}],w=[r,i,c],A=[r-s,i-s,c-s];for(const y of g){const z=l.p.length/3,k=y.ta.length,B=y.tb.length;for(let D=0;D<B;D++)for(let R=0;R<k;R++){const x=[0,0,0];x[y.ax]=y.s*w[y.ax],x[y.a]=y.ta[y.flipA?k-1-R:R],x[y.b]=y.tb[D],p.set(x[0],x[1],x[2]),d.set(m(x[0],A[0]),m(x[1],A[1]),m(x[2],A[2])),v.subVectors(p,d),v.lengthSq()<1e-12&&(v.set(0,0,0),v.setComponent(y.ax,y.s)),v.normalize(),s>0&&p.copy(d).addScaledVector(v,s);const N=(y.flipA?-x[y.a]:x[y.a])+w[y.a],le=x[y.b]+w[y.b];l.v(p.x,p.y,p.z,v.x,v.y,v.z,N,le)}for(let D=0;D<B-1;D++)for(let R=0;R<k-1;R++){const x=z+D*k+R;l.quad(x,x+1,x+k+1,x+k)}}return l.build()}const He=(e,o,t)=>go(e,o,t,0,0);function Sn(e,o){const t=new Et,s=e.length;for(const[r,i]of[[o,1],[0,-1]]){const c=t.p.length/3;for(const[l,n]of e)t.v(l,r,n,0,i,0,l,n);for(let l=1;l<s-1;l++)i>0?t.tri(c,c+l+1,c+l):t.tri(c,c+l,c+l+1)}let a=0;for(let r=0;r<s;r++){const[i,c]=e[r],[l,n]=e[(r+1)%s],f=Math.hypot(l-i,n-c)||1,u=(n-c)/f,h=-(l-i)/f,d=t.p.length/3;t.v(i,0,c,u,0,h,a,0),t.v(l,0,n,u,0,h,a+f,0),t.v(l,o,n,u,0,h,a+f,o),t.v(i,o,c,u,0,h,a,o),t.quad(d,d+3,d+2,d+1),a+=f}return t.build()}function xn(e,o,t,s=4){const a=[],r=e/2,i=o/2;t=Math.min(t,r,i);const c=[[r-t,i-t,0],[r-t,-i+t,Math.PI/2],[-r+t,-i+t,Math.PI],[-r+t,i-t,Math.PI*1.5]];for(const[l,n,f]of c)for(let u=0;u<=s;u++){const h=f+Math.PI/2*(u/s);a.push([l+Math.sin(h)*t,n+Math.cos(h)*t])}return a.reverse()}function kn(e,o){const t=new Et,s=t.v(-e/2,0,o/2,0,1,0,0,0),a=t.v(e/2,0,o/2,0,1,0,e,0),r=t.v(e/2,0,-o/2,0,1,0,e,o),i=t.v(-e/2,0,-o/2,0,1,0,0,o);return t.quad(s,a,r,i),t.build()}const eo=new Mt,to=new jo,oo=new Wo,vt=new O,no=new O;function Ct(e,{t:o=[0,0,0],r:t=[0,0,0],s=1}={}){return oo.set(t[0],t[1],t[2]),to.setFromEuler(oo),typeof s=="number"?vt.set(s,s,s):vt.set(s[0],s[1],s[2]),no.set(o[0],o[1],o[2]),eo.compose(no,to,vt),e.applyMatrix4(eo),e}const he=196,V=256,we=2.6,wo=3.5,ke=.42,it=7,yo=7,bo=6,So=3.5,lt=2.1,Te=it+yo+bo*ke,Rt=Te/2+So,te=he+wo-So,$=V+2*wo,mt=we+Te/2,se=48,oe=new Float32Array(se+1);for(let e=0;e<=se;e++){const o=e/se;oe[e]=he*(.32*o+.68*o*o)}const xo=e=>e>=1?0:1-e*e*(3-2*e),Dt=1.48,Ae=128,xe=new Float32Array(Ae+1);for(let e=0;e<=Ae;e++){const o=Dt*e/Ae,t=64;let s=0;for(let a=0;a<=t;a++){const r=a===0||a===t?1:a%2?4:2;s+=r*Math.sin(o*xo(a/t))}xe[e]=s/(3*t)}function zn(e){if(e<=0)return 0;if(e>=xe[Ae])return Dt;let o=0,t=Ae;for(;t-o>1;){const a=o+t>>1;xe[a]<e?o=a:t=a}const s=(e-xe[o])/(xe[t]-xe[o]);return Dt*(o+s)/Ae}function Ft(e,o,t,s=1){const a=(t-o)*s,r=Math.abs(a);let i=5+1.05*r;const c=xe[Ae]*.97;r/i>c&&(i=r/c);const l=Math.sign(a)*zn(r/i);for(let n=0;n<=se;n++)e[n]=l*xo(oe[n]/i);return{L:i,phi:l}}function ko(e,o,t,s,a){s[0]=o,a[0]=t;let r=Math.cos(e[0]),i=Math.sin(e[0]);for(let c=1;c<=se;c++){const l=.5*(e[c-1]+e[c]),n=oe[c]-oe[c-1],f=Math.cos(e[c]),u=Math.sin(e[c]);s[c]=s[c-1]+n*(r+4*Math.cos(l)+f)/6,a[c]=a[c-1]+n*(i+4*Math.sin(l)+u)/6,r=f,i=u}}function An(e,o,t,s,a,r,i=.62,c=.36){const l=Math.sin(2*Math.PI*a),n=-i*(l-2*c*r*Math.abs(l));for(let f=0;f<=se;f++){const u=oe[f]/he;let h=o[f]+(t[f]-o[f])*s+n*Math.pow(u,1.5);h<o[f]&&(h=o[f]),h>t[f]&&(h=t[f]),e[f]=h}}const Mn=(e,o,t)=>{const s=Math.min(1,Math.max(0,(t-e)/(o-e)));return s*s*(3-2*s)},Tn=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,Pn=e=>e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2,Bt={uKeyDirV:{value:new O(0,1,0)},uKeyCol:{value:new ue(1,1,1)}};let ge=null;function Cn(e){ge=e}function gt({paperNormal:e,leaf:o=!1}){const t=new ct({color:fe.paper,roughness:.86,metalness:0,normalMap:e,normalScale:new Y(.24,.24),side:o?Tt:Yt,shadowSide:o?Tt:Yt,envMapIntensity:.85}),s={uPageA:{value:ge},uPageB:{value:ge},uPrintA:{value:ge},uPrintB:{value:ge},uRectA:{value:new Ye(0,0,1,1)},uRectB:{value:new Ye(0,0,1,1)},uPrintAlphaA:{value:0},uPrintAlphaB:{value:0},uMirrorA:{value:0},uPageSize:{value:new Y(he,V)},uTrans:{value:o?.32:0},uShade:{value:1}};return t.userData.u=s,t.onBeforeCompile=a=>{Object.assign(a.uniforms,s,Bt),a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
varying vec2 vPg;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vPg = uv;`),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
        varying vec2 vPg;
        uniform sampler2D uPageA, uPageB, uPrintA, uPrintB;
        uniform vec4 uRectA, uRectB;
        uniform float uPrintAlphaA, uPrintAlphaB, uMirrorA, uTrans, uShade;
        uniform vec2 uPageSize;
        uniform vec3 uKeyDirV, uKeyCol;
        vec3 pageSide( sampler2D page, sampler2D print, vec4 rect, float alpha, vec2 mm ) {
          vec3 c = texture2D( page, mm / uPageSize ).rgb;
          vec2 q = ( mm - rect.xy ) / ( rect.zw - rect.xy );
          if ( alpha > 0.001 && q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0 )
            c *= mix( vec3( 1.0 ), texture2D( print, q ).rgb, alpha );
          return c;
        }`).replace("#include <map_fragment>",`
        // side A: recto (front face). Its uv.x runs from the gutter, so a
        // left-hand page mirrors it to read in page coordinates.
        vec2 mmA = vec2( mix( vPg.x, uPageSize.x - vPg.x, uMirrorA ), vPg.y );
        vec2 mmB = vec2( uPageSize.x - vPg.x, vPg.y );
        vec3 sideA = pageSide( uPageA, uPrintA, uRectA, uPrintAlphaA, mmA );
        #ifdef DOUBLE_SIDED
          vec3 sideB = pageSide( uPageB, uPrintB, uRectB, uPrintAlphaB, mmB );
          vec3 ink = gl_FrontFacing ? sideA : sideB;
          vec3 through = gl_FrontFacing ? sideB : sideA;
        #else
          vec3 ink = sideA;
        #endif
        diffuseColor.rgb *= ink * uShade;
        float inkAmt = 1.0 - dot( ink, vec3( 0.299, 0.587, 0.114 ) );`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix( roughnessFactor, 0.5, clamp( inkAmt * 0.9, 0.0, 0.6 ) );`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
        #ifdef DOUBLE_SIDED
          // key light passing through the sheet, filtered by the far side's ink
          float back = max( 0.0, dot( -normal, uKeyDirV ) );
          reflectedLight.directDiffuse += uTrans * uKeyCol * pow( back, 1.3 ) * diffuse * through * 0.6;
        #endif`)},t.customProgramCacheKey=()=>o?"loq-leaf":"loq-page",t}function Rn(e){const o=new ct({color:fe.paperEdge,roughness:.9,metalness:0,normalMap:e,normalScale:new Y(.15,.15),envMapIntensity:.7}),t={uSheets:{value:60}};return o.userData.u=t,o.onBeforeCompile=s=>{Object.assign(s.uniforms,t),s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
varying vec2 vEd;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vEd = uv;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
        varying vec2 vEd;
        uniform float uSheets;
        float edgeHash( float n ) { return fract( sin( n * 91.345 ) * 47453.5453 ); }`).replace("#include <map_fragment>",`{
          float n = vEd.y * uSheets;
          float w = fwidth( n );
          float line = 1.0 - smoothstep( 0.0, 0.18 + w, abs( fract( n ) - 0.5 ) * 2.0 - 0.75 );
          float fade = 1.0 - smoothstep( 0.35, 0.9, w );
          float tone = 0.94 + 0.06 * edgeHash( floor( n ) );
          diffuseColor.rgb *= mix( 1.0, tone * ( 1.0 - 0.22 * line ), fade );
          // a soft darkening toward the inside of the block
          diffuseColor.rgb *= 0.9 + 0.1 * smoothstep( 0.0, 0.25, vEd.y ) ;
        }`)},o.customProgramCacheKey=()=>"loq-edge",o}function wt({weave:e,art:o=null,mask:t=null,color:s=fe.cloth}){const a=new Ko({color:s,roughness:.78,metalness:0,sheen:1,sheenColor:new ue(fe.clothSheen),sheenRoughness:.55,envMapIntensity:.9}),r={uArt:{value:o||ge},uMask:{value:t||ge},uHasArt:{value:o?1:0},uWeave:{value:e.normalMap},uWeaveRep:{value:1/e.size[0]},uArtSize:{value:new Y(1,1)},uFoil:{value:new ue(fe.foil)},uPrint:{value:ge},uPrintRect:{value:new Ye(0,0,0,0)},uPrintAlpha:{value:0}};return a.userData.u=r,a.onBeforeCompile=i=>{Object.assign(i.uniforms,r),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
varying vec2 vCl;`).replace("#include <uv_vertex>",`#include <uv_vertex>
vCl = uv;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
        varying vec2 vCl;
        uniform sampler2D uArt, uMask, uWeave, uPrint;
        uniform float uHasArt, uWeaveRep, uPrintAlpha;
        uniform vec2 uArtSize;
        uniform vec3 uFoil;
        uniform vec4 uPrintRect;
        vec4 clothMask;`).replace("#include <map_fragment>",`clothMask = vec4( 0.0, 0.0, 1.0, 0.0 );
        if ( uHasArt > 0.5 ) {
          clothMask = texture2D( uMask, vCl );
          vec3 art = texture2D( uArt, vCl ).rgb;
          diffuseColor.rgb = art;
          vec2 q = ( vCl - uPrintRect.xy ) / ( uPrintRect.zw - uPrintRect.xy );
          if ( uPrintAlpha > 0.0 && q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0 )
            diffuseColor.rgb *= mix( vec3( 1.0 ), texture2D( uPrint, q ).rgb, uPrintAlpha );
        }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix( 0.9, roughnessFactor, clothMask.b );
        roughnessFactor = mix( roughnessFactor, 0.3, clothMask.r );`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
        metalnessFactor = clothMask.r;
        diffuseColor.rgb = mix( diffuseColor.rgb, uFoil, clothMask.r );`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        {
          // weave in tangent space built from screen derivatives
          vec2 wuv = vCl * uArtSize * uWeaveRep;
          vec3 wn = texture2D( uWeave, wuv ).xyz * 2.0 - 1.0;
          float px = length( fwidth( wuv ) ) * 24.0; // threads per screen pixel
          float keep = ( 1.0 - smoothstep( 0.6, 1.4, px ) ) * clothMask.b * ( 1.0 - clothMask.r );
          // deboss: gradient of the mask's depth channel
          vec2 dm = vec2( 0.0 );
          if ( uHasArt > 0.5 ) {
            vec2 tx = 1.0 / vec2( textureSize( uMask, 0 ) );
            dm.x = texture2D( uMask, vCl + vec2( tx.x, 0.0 ) ).g - texture2D( uMask, vCl - vec2( tx.x, 0.0 ) ).g;
            dm.y = texture2D( uMask, vCl + vec2( 0.0, tx.y ) ).g - texture2D( uMask, vCl - vec2( 0.0, tx.y ) ).g;
          }
          vec3 q0 = dFdx( - vViewPosition );
          vec3 q1 = dFdy( - vViewPosition );
          vec2 st0 = dFdx( vCl );
          vec2 st1 = dFdy( vCl );
          vec3 N = normal;
          vec3 q1perp = cross( q1, N );
          vec3 q0perp = cross( N, q0 );
          vec3 Tn = q1perp * st0.x + q0perp * st1.x;
          vec3 Bn = q1perp * st0.y + q0perp * st1.y;
          float det = max( dot( Tn, Tn ), dot( Bn, Bn ) );
          float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
          Tn *= scale;
          Bn *= scale;
          vec3 pert = vec3( wn.xy * 0.55 * keep - dm * 2.2, 1.0 );
          normal = normalize( Tn * pert.x + Bn * pert.y + N * pert.z );
        }`)},a.customProgramCacheKey=()=>"loq-cloth",a}const qe={w:660,d:440,h:2.5,x:0,z:8};function Dn(e=512){const o=document.createElement("canvas");o.width=o.height=e;const t=o.getContext("2d");t.fillStyle="#000",t.fillRect(0,0,e,e);const s=e/512;t.filter=`blur(${7*s}px)`,t.fillStyle="#fff";const a=58*s,r=40*s,i=396*s,c=432*s,l=15*s,n=2,f=2,u=(i-l*(n-1))/n,h=(c-l*(f-1))/f;for(let m=0;m<n;m++)for(let g=0;g<f;g++)t.fillRect(a+m*(u+l),r+g*(h+l),u,h);t.filter="none",t.globalCompositeOperation="multiply";let d=11;const p=()=>(d=d*16807%2147483647)/2147483647;t.filter=`blur(${5*s}px)`;for(let m=0;m<38;m++){const g=a+i*(.62+p()*.4),w=r+c*(.05+p()*.5);t.fillStyle=`rgba(${150+p()*60},${150+p()*60},${150+p()*60},1)`,t.beginPath(),t.ellipse(g,w,(8+p()*16)*s,(4+p()*8)*s,p()*Math.PI,0,Math.PI*2),t.fill()}t.filter="none",t.globalCompositeOperation="source-over";const v=new mo(o);return v.colorSpace=Ze,v}function Fn(e,o){const t=new ht,s=(u,h,d)=>{const p=new ie(u,new Xo({color:h,side:d}));return t.add(p),p};s(Ct(He(12,5,12),{t:[0,1.6,0]}),new ue(.36,.35,.33),Jo),s(Ct(He(11.9,.02,11.9),{t:[0,-.88,0]}),new ue(.24,.2,.16));const a=new O(Pt.x,0,Pt.z).normalize(),r=a.clone().multiplyScalar(5.9),i=Math.atan2(a.x,a.z);for(let u=0;u<2;u++)for(let h=0;h<2;h++){const d=s(He(1.15,1.25,.02),new ue(3.1,3.25,3.6).multiplyScalar(h?1.15:1));d.position.set(r.x,1.05+h*1.35,r.z),d.rotation.y=i,d.translateX((u-.5)*1.25)}const c=s(He(5,2.5,.05),new ue(1.25,1.12,.96));c.position.set(-r.x,1.2,-r.z),c.rotation.y=i,s(He(3,.05,3),new ue(1.1,1.1,1.08)).position.set(0,4,0);const n=new an(e),f=n.fromScene(t,.035,.1,30);return n.dispose(),t.traverse(u=>{u.isMesh&&(u.geometry.dispose(),u.material.dispose())}),f.texture}function Bn({renderer:e,tier:o,textures:t}){const s=new ht;s.background=new ue(fe.bg),s.fog=new Vo(fe.bg,1600,6200),s.environment=Fn(e,o.env),s.environmentIntensity=.62;const a=t.oak;for(const m of[a.map,a.normalMap,a.roughnessMap])m.repeat.set(1/a.size[0],1/a.size[1]);const r=new ct({map:a.map,normalMap:a.normalMap,roughnessMap:a.roughnessMap,normalScale:new Y(.45,.45),roughness:1,envMapIntensity:.75}),i=new ie(Ct(kn(9e3,9e3),{t:[300,0,-800]}),r);i.receiveShadow=!0,s.add(i);const c=t.lino;for(const m of[c.map,c.normalMap,c.roughnessMap])m.repeat.set(1/c.size[0],1/c.size[1]);const l=new ct({map:c.map,normalMap:c.normalMap,roughnessMap:c.roughnessMap,normalScale:new Y(.6,.6),roughness:1,envMapIntensity:.6}),n=new ie(Sn(xn(qe.w,qe.d,9,6),qe.h),l);n.position.set(qe.x,0,qe.z),n.castShadow=!0,n.receiveShadow=!0,s.add(n);const f=new Go;f.position.set(40,0,0),s.add(f);const u=new Zo(16774636,3.5,0,.2,.55,0);u.position.copy(Pt).multiplyScalar(2700).add(f.position),u.target=f,u.castShadow=!0,u.shadow.mapSize.set(o.shadow,o.shadow),u.shadow.camera.near=1900,u.shadow.camera.far=3500,u.shadow.bias=-12e-5,u.shadow.normalBias=.45,u.shadow.radius=o.shadowRadius,u.shadow.focus=1,u.map=Dn(o.name==="high"?512:256),s.add(u);const h=new Yo(14542578,13085318,.5);s.add(h);const d=[];for(let m=0;m<3;m++){const g=new Qo(16763274,0,0,2);g.position.set(0,-500,0),s.add(g),d.push(g)}const p=new O,v=u.intensity;return{scene:s,desk:i,pad:n,key:u,hemi:h,spills:d,keyBase:v,update(m){p.copy(u.position).sub(f.position).normalize(),Bt.uKeyDirV.value.copy(p).transformDirection(m.matrixWorldInverse),Bt.uKeyCol.value.copy(u.color).multiplyScalar(u.intensity*.22)},setSpills(m=[]){d.forEach((g,w)=>{const A=m[w];if(!A){g.intensity=0,g.position.set(0,-500,0);return}g.position.copy(A.pos),g.color.set(A.color||16763274),g.intensity=A.intensity})}}}const zo=30,so=Math.tan(ee.degToRad(zo/2));function yt(e,o,t){return Math.max(o/so,e/(so*t))}function Un(e,o,t,s,a){return a.set(Math.sin(o)*Math.cos(t),Math.sin(t),Math.cos(o)*Math.cos(t)).multiplyScalar(s).add(e),a}function In(e){e.fov=zo,e.near=12,e.far=9e3;const o={open:0,zoom:0,zoomTarget:0,userZoom:1,yaw:0,pitch:0,lastInput:-10,focus:new O(104,32,-6),sheet:0},t=new O,s=new O,a=new O,r=new O,i=new O,c=new O;let l=!0;function n(u){const h=u<.82,d=2.5,p=new O(Rt+te/2,d+14,6),v=-.5,m=.84,g=yt(h?125:150,h?160:132,u)*1.05,w=h?1.08:.98,A=h?new O(96,d+16,4):new O(0,d+18,10),y=h?112:228,z=(V/2+12)*Math.sin(w)+55*Math.cos(w),k=yt(y,z,u),B=h?.78:.62,D=yt(h?92:108,82,u);return{closedT:p,closedYaw:v,closedEl:m,closedD:g,readT:A,readEl:w,readD:k,closeEl:B,closeD:D,portrait:h}}function f(u,h,d){const p=n(d);if(h-o.lastInput>1.4&&o.zoom<.5){const N=1-Math.exp(-u*2.2);o.yaw+=(0-o.yaw)*N,o.pitch+=(0-o.pitch)*N}o.zoom+=(o.zoomTarget-o.zoom)*(1-Math.exp(-u*3.2));const m=ee.smoothstep(o.open,0,1),g=ee.smoothstep(o.zoom,0,1);i.copy(p.closedT).lerp(p.readT,m);const w=ee.lerp(p.closedYaw,0,m),A=ee.lerp(p.closedEl,p.readEl,m),y=ee.lerp(p.closedD,p.readD,m);c.copy(o.focus);const z=ee.lerp(w,.16,g)+o.yaw,k=ee.clamp(ee.lerp(A,p.closeEl,g)+o.pitch,.28,1.42),B=ee.lerp(y,p.closeD,g)*o.userZoom;r.copy(i).lerp(c,g),Un(r,z,k,B,a),l&&(t.copy(a),s.copy(r),l=!1);const D=1-Math.exp(-u*5.5);t.lerp(a,D),s.lerp(r,D),e.position.copy(t),e.lookAt(s);const R=window.innerHeight,x=window.innerWidth;return o.sheet>1?e.setViewOffset(x,R,0,o.sheet*.5,x,R):e.view&&e.view.enabled&&e.clearViewOffset(),e.updateProjectionMatrix(),p}return{state:o,update:f,snap(){l=!0},drag(u,h,d){o.lastInput=d;const p=o.zoom>.5;o.yaw=ee.clamp(o.yaw-u*.0042,p?-1:-.42,p?1:.42),o.pitch=ee.clamp(o.pitch+h*.003,p?-.3:-.2,p?.45:.16)},zoomBy(u,h){o.lastInput=h,o.userZoom=ee.clamp(o.userZoom*u,.55,1.3)},get position(){return t},get target(){return s}}}const ce=bo+1,qn=ce+1,Z=6,be=10;class ao{constructor(o,t,s){this.mirrored=s;const a=se,r=(a+1)*3,i=(a+1)*(Z+1),c=(Z+1)*3;this.nTop=r,this.nSide=i;const l=r+i*2+c,n=new Ne;this.pos=new Float32Array(l*3),this.nrm=new Float32Array(l*3),this.uv=new Float32Array(l*2),n.setAttribute("position",new Q(this.pos,3).setUsage(ze)),n.setAttribute("normal",new Q(this.nrm,3).setUsage(ze)),n.setAttribute("uv",new Q(this.uv,2).setUsage(ze));const f=[];for(let d=0;d<2;d++)for(let p=0;p<a;p++){const v=d*(a+1)+p,m=v+a+1;f.push(v,m,v+1,v+1,m,m+1)}const u=f.length;for(const[d,p]of[[r,!0],[r+i,!1]])for(let v=0;v<Z;v++)for(let m=0;m<a;m++){const g=d+v*(a+1)+m,w=g+a+1;p?f.push(g,g+1,w,g+1,w+1,w):f.push(g,w,g+1,g+1,w,w+1)}const h=r+i*2;for(let d=0;d<Z;d++)for(let p=0;p<2;p++){const v=h+d*3+p,m=v+3;f.push(v,v+1,m,v+1,m+1,m)}n.setIndex(new qt(f,1)),n.addGroup(0,u,0),n.addGroup(u,f.length-u,1),this.geo=n,this.mesh=new ie(n,[o,t]),this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.mesh.frustumCulled=!1,this.th=new Float32Array(a+1),this.xs=[],this.ys=[],this.ths=[];for(let d=0;d<=Z;d++)this.xs.push(new Float32Array(a+1)),this.ys.push(new Float32Array(a+1)),this.ths.push(new Float32Array(a+1));this.key=""}update(o,t){const s=`${o.toFixed(3)}:${t.toFixed(4)}`;if(s===this.key)return!1;this.key=s;const a=se;for(let p=0;p<=Z;p++){const v=p/Z,m=we+v*o,g=Te/2-v*o*t,w=m+(lt-m)*t;Ft(this.ths[p],w,m),ko(this.ths[p],g,w,this.xs[p],this.ys[p])}const r=this.pos,i=this.nrm,c=this.uv,l=[-256/2,0,V/2],n=this.xs[Z],f=this.ys[Z],u=this.ths[Z];let h=0;for(let p=0;p<3;p++)for(let v=0;v<=a;v++,h++)r[h*3]=n[v],r[h*3+1]=f[v],r[h*3+2]=l[p],i[h*3]=-Math.sin(u[v]),i[h*3+1]=Math.cos(u[v]),i[h*3+2]=0,c[h*2]=oe[v],c[h*2+1]=l[p]+V/2;for(const p of[-256/2,V/2])for(let v=0;v<=Z;v++)for(let m=0;m<=a;m++,h++)r[h*3]=this.xs[v][m],r[h*3+1]=this.ys[v][m],r[h*3+2]=p,i[h*3]=0,i[h*3+1]=0,i[h*3+2]=Math.sign(p),c[h*2]=oe[m],c[h*2+1]=v/Z;for(let p=0;p<=Z;p++)for(let v=0;v<3;v++,h++){const m=this.ths[p][a];r[h*3]=this.xs[p][a],r[h*3+1]=this.ys[p][a],r[h*3+2]=l[v],i[h*3]=Math.cos(m),i[h*3+1]=Math.sin(m),i[h*3+2]=0,c[h*2]=l[v]+V/2,c[h*2+1]=p/Z}const d=this.geo.attributes;return d.position.needsUpdate=!0,d.normal.needsUpdate=!0,d.uv.needsUpdate=!0,this.Ts=o,!0}topAt(o){const t=se;let s=0;for(;s<t-1&&oe[s+1]<o;)s++;const a=Math.min(1,Math.max(0,(o-oe[s])/(oe[s+1]-oe[s]))),r=this.xs[Z],i=this.ys[Z];return[r[s]+(r[s+1]-r[s])*a,i[s]+(i[s+1]-i[s])*a]}}class En{constructor(o){const t=se,s=(t+1)*(be+1),a=new Ne;this.pos=new Float32Array(s*3);const r=new Float32Array(s*2);for(let c=0;c<=be;c++)for(let l=0;l<=t;l++){const n=c*(t+1)+l;r[n*2]=oe[l],r[n*2+1]=V*c/be}a.setAttribute("position",new Q(this.pos,3).setUsage(ze)),a.setAttribute("normal",new Q(new Float32Array(s*3),3).setUsage(ze)),a.setAttribute("uv",new Q(r,2));const i=[];for(let c=0;c<be;c++)for(let l=0;l<t;l++){const n=c*(t+1)+l,f=n+t+1;i.push(n,f,n+1,n+1,f,f+1)}a.setIndex(new qt(i,1)),this.geo=a,this.mat=o,this.mesh=new ie(a,o),this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.mesh.frustumCulled=!1,this.mesh.visible=!1,this.thR=new Float32Array(t+1),this.thL=new Float32Array(t+1),this.th=new Float32Array(t+1),this.xs=new Float32Array(t+1),this.ys=new Float32Array(t+1),this.unit=-1}update(o,t,s,a){const r=se,i=Te/2-t-ke,c=-16.52/2+s+ke;Ft(this.thR,lt,we+t+ke),Ft(this.thL,lt,we+s+ke);for(let f=0;f<=r;f++)this.thL[f]=Math.PI-this.thL[f];const l=i+(c-i)*a,n=this.pos;for(let f=0;f<=be;f++){const u=f/be-.5;An(this.th,this.thR,this.thL,a,o,u),ko(this.th,l,lt,this.xs,this.ys);const h=-256/2+V*(f/be);for(let d=0;d<=r;d++){const p=(f*(r+1)+d)*3;n[p]=this.xs[d],n[p+1]=this.ys[d],n[p+2]=h}}this.geo.attributes.position.needsUpdate=!0,this.geo.computeVertexNormals()}}function On({textures:e,pages:o}){const t=new Qt;t.name="book";const s=e.paper.normalMap,a=gt({paperNormal:s}),r=gt({paperNormal:s});r.userData.u.uMirrorA.value=1;const i=Rn(s),c=[0,1,2,3].map(()=>gt({paperNormal:s,leaf:!0})),l=o.get("cover"),n=wt({weave:e.weave,art:l.tex,mask:l.mask});n.userData.u.uArtSize.value.set(te,$);const f=wt({weave:e.weave});f.userData.u.uArtSize.value.set(te,$);const u=o.get("spine"),h=wt({weave:e.weave,art:u.tex,mask:u.mask});h.side=Tt,h.userData.u.uArtSize.value.set(Te+2*we+4,$);function d(b){const P=go(te,we,$,.7,2),L=P.attributes.position,T=P.attributes.uv;for(let M=0;M<L.count;M++){const G=L.getX(M)+te/2;T.setXY(M,G/te,(L.getZ(M)+$/2)/$),L.setX(M,b*(G+Rt)),L.setY(M,L.getY(M)+we/2)}if(b<0){const M=P.index.array;for(let U=0;U<M.length;U+=3){const I=M[U+1];M[U+1]=M[U+2],M[U+2]=I}const G=P.attributes.normal;for(let U=0;U<G.count;U++)G.setX(U,-G.getX(U))}return P}const p=new ie(d(1),f);p.castShadow=p.receiveShadow=!0,t.add(p);const v=new Qt;t.add(v);const m=new ie(d(-1),n);m.castShadow=m.receiveShadow=!0,m.name="cover",v.add(m);const g=new ao(a,i,!1),w=new ao(r,i,!0);w.mesh.scale.x=-1,t.add(g.mesh),v.add(w.mesh);const A=c.map(b=>{const P=new En(b);return t.add(P.mesh),P}),y=18,z=new Ne,k=new Float32Array((y+1)*2*3),B=new Float32Array((y+1)*2*2),D=[];for(let b=0;b<=y;b++)if(B[b*4]=b/y,B[b*4+1]=0,B[b*4+2]=b/y,B[b*4+3]=1,b<y){const P=b*2;D.push(P,P+2,P+1,P+1,P+2,P+3)}z.setAttribute("position",new Q(k,3).setUsage(ze)),z.setAttribute("normal",new Q(new Float32Array(k.length),3).setUsage(ze)),z.setAttribute("uv",new Q(B,2)),z.setIndex(D);const R=new ie(z,h);R.castShadow=R.receiveShadow=!0,R.frustumCulled=!1,t.add(R);const x=new Float32Array(ce);let N=[],le=0,De=0,re=0;const E={settle:[],start:[]};let j="";function ve(){const b=-(Math.PI-Math.PI*x[0]);v.rotation.z=b,v.position.set(mt*Math.sin(b),mt-mt*Math.cos(b),0),v.updateMatrix(),v.updateMatrixWorld(!0)}const _=new O,F=new O;function Do(b){_.set(Rt,0,0),F.set(-11.76,0,0).applyMatrix4(v.matrix);const P=F.x-_.x,L=F.y-_.y,T=Math.hypot(P,L)||1,M=-L/T,G=P/T,U=7.5*(1-b),I=(_.x+F.x)/2+M*U*2,X=(_.y+F.y)/2+G*U*2,C=z.attributes.normal.array;for(let Be=0;Be<=y;Be++){const J=Be/y,We=(1-J)*(1-J),je=2*(1-J)*J,Ue=J*J,Eo=We*_.x+je*I+Ue*F.x,Oo=We*_.y+je*X+Ue*F.y,Kt=2*(1-J)*(I-_.x)+2*J*(F.x-I),Vt=2*(1-J)*(X-_.y)+2*J*(F.y-X),Gt=Math.hypot(Kt,Vt)||1;for(let at=0;at<2;at++){const Ie=(Be*2+at)*3;k[Ie]=Eo,k[Ie+1]=Math.max(.05,Oo),k[Ie+2]=(at?1:-1)*($/2),C[Ie]=-Vt/Gt,C[Ie+1]=Kt/Gt,C[Ie+2]=0}}z.attributes.position.needsUpdate=!0,z.attributes.normal.needsUpdate=!0}function Fe(b,P,L){const T=o.get(L),M=b.userData.u;P==="A"?(M.uPageA.value=T.tex,M.uPrintA.value=T.print||M.uPrintA.value,M.uRectA.value=T.rect,M.uPrintAlphaA.value=T.print?T.printAlpha:0):(M.uPageB.value=T.tex,M.uPrintB.value=T.print||M.uPrintB.value,M.uRectB.value=T.rect,M.uPrintAlphaB.value=T.print?T.printAlpha:0)}let et="p0",tt="r1",ot=it,nt=Te-it,st=0;function $e(){ve(),st=Mn(.35,1,x[0]);let b=0,P=0,L=0,T=ce;for(let I=1;I<ce;I++)x[I]>=1?(b++,L=I):x[I]<=0&&(P++,I<T&&(T=I));ot=it+b*ke,nt=yo+P*ke;const M=g.update(nt,st),G=w.update(ot,st);(M||G||x[0]<1)&&Do(st),et=L?`v${L}`:"p0",tt=T<ce?`r${T}`:"bk",Fe(r,"A",et),Fe(a,"A",tt);let U=0;for(let I=1;I<ce;I++){const X=x[I];if(X<=0||X>=1)continue;const C=A[U++];if(!C)break;C.mesh.visible=!0,C.unit=I,C.update(X,nt,ot,X),Fe(C.mat,"A",`r${I}`),Fe(C.mat,"B",`v${I}`)}for(;U<A.length;U++)A[U].mesh.visible=!1,A[U].unit=-1}function Fo(){let b=0;for(;b<ce&&x[b]>=1;)b++;return b}function Bo(b,{instant:P=!1,single:L=1.15,riffle:T=.55,stagger:M=.085}={}){if(b=Math.max(0,Math.min(qn-1,b)),re=b,P){N=[];for(let C=0;C<ce;C++)x[C]=C<b?1:0;$e(),De=b,E.settle.forEach(C=>C(b));return}N=[];const G=[];for(let C=0;C<ce;C++)x[C]!==(C<b?1:0)&&G.push(C);if(!G.length)return;const U=G[0]<b,I=U?G:G.slice().reverse(),X=I.length>1;I.forEach((C,Be)=>{const J=C<b?1:0,We=x[C];let je=C===0?X?1:1.45:X?T:L;je*=Math.max(.35,Math.abs(J-We));let Ue=Be*M;U&&I[0]===0&&C>0&&(Ue+=.5),!U&&C===0&&X&&(Ue+=.3),N.push({u:C,from:We,to:J,t0:le+Ue,dur:je,ease:C===0||!X?Tn:Pn})}),E.start.forEach(C=>C(b))}function Uo(b){le+=b;let P=!1;for(const T of N){const M=Math.min(1,Math.max(0,(le-T.t0)/T.dur));x[T.u]=T.from+(T.to-T.from)*T.ease(M),M<1&&(P=!0)}if(N.length&&!P){N=[],De=Fo(),$e(),E.settle.forEach(T=>T(De));return}const L=Array.from(x).join(",");L!==j||P?(j=L,$e()):(Fe(r,"A",et),Fe(a,"A",tt))}const Io=new O;function qo(b,P,L=Io){const[T,M]=g.topAt(b);return L.set(T,M,-256/2+P)}return $e(),{group:t,right:g,left:w,leaves:A,frontBoard:m,tau:x,materials:{pageL:r,pageR:a,edge:i,coverMat:n,backMat:f,spineMat:h,leafMats:c},goTo:Bo,update:Uo,rightPagePoint:qo,get settled(){return De},get target(){return re},get turning(){return N.length>0},get openness(){return x[0]},get topIds(){return[et,tt]},get thickness(){return{TL:ot,TR:nt}},pickMeshes:()=>[w.mesh,g.mesh,m],on(b,P){E[b].push(P)},relayout:$e}}const ro="'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', 'Noto Serif', Georgia, 'Times New Roman'",io="'Songti SC', STSong, 'Noto Serif CJK SC', 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif CN', SimSun",lo="'Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Noto Sans', Arial",co="'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', 'Noto Sans SC', 'Source Han Sans SC'";function Ln(e,o="serif"){return o==="sans"?e==="zh"?`${co}, ${lo}, sans-serif`:`${lo}, ${co}, sans-serif`:e==="zh"?`${io}, ${ro}, serif`:`${ro}, ${io}, serif`}function S(e,o,t,{kind:s="serif",weight:a=400,italic:r=!1}={}){e.font=`${r?"italic ":""}${a} ${t}px ${Ln(o,s)}`}const Ao=/[⺀-⿿　-〿぀-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/,Nn="，。、；：？！）》」』〕】〉”’…—%．,.;:?!)]}·",_n="（《「『〔【〈“‘([{";function $n(e){const o=[];let t="";const s=()=>{t&&o.push(t),t=""};for(const i of e)Ao.test(i)?(s(),o.push(i)):i===" "?(t+=" ",s()):i===`
`?(s(),o.push(`
`)):t+=i;s();const a=[];for(const i of o)a.length&&i!==`
`&&Nn.includes(i[0])&&a[a.length-1]!==`
`?a[a.length-1]+=i:a.push(i);const r=[];for(let i=0;i<a.length;i++){let c=a[i];for(;c.length&&_n.includes(c[c.length-1])&&i+1<a.length&&a[i+1]!==`
`;)c+=a[++i];r.push(c)}return r}function Ot(e,o,t){const s=$n(o),a=[];let r="";const i=c=>{const l=r.replace(/\s+$/,"");a.push({text:l,width:e.measureText(l).width,last:c}),r=""};for(const c of s){if(c===`
`){i(!0);continue}e.measureText(r+c).width;const l=e.measureText((r+c).replace(/\s+$/,"")).width;r&&l>t?(i(!1),r=c.replace(/^\s+/,""),e.measureText(r).width):r+=c}return r.trim()&&i(!0),a.length&&(a[a.length-1].last=!0),a}function Wn(e,o,t,s,a,r){const i=a-o.width;if(!r||o.last||i<=0||i>a*.18){e.fillText(o.text,t,s);return}if(Ao.test(o.text)){const l=Array.from(o.text),n=l.length-1;if(n<=0){e.fillText(o.text,t,s);return}const f=i/n;let u=t;for(const h of l)e.fillText(h,u,s),u+=e.measureText(h).width+f}else{const l=o.text.split(" "),n=l.length-1;if(n<=0){e.fillText(o.text,t,s);return}const f=e.measureText(" ").width+i/n;let u=t;for(const h of l)e.fillText(h,u,s),u+=e.measureText(h).width+f}}function ye(e,o,t,s,a,{size:r,leading:i=1.45,justify:c=!1,align:l="left",maxLines:n=99}={}){const f=Ot(e,o,a).slice(0,n),u=r*i;for(const h of f)l==="center"?e.fillText(h.text,t+(a-h.width)/2,s):l==="right"?e.fillText(h.text,t+a-h.width,s):Wn(e,h,t,s,a,c),s+=u;return{y:s,lines:f.length,height:f.length*u}}function W(e,o,t,s,a,{align:r="left",measureOnly:i=!1}={}){const c=Array.from(o);let l=0;for(const f of c)l+=e.measureText(f).width;if(l+=a*Math.max(0,c.length-1),i)return l;let n=r==="center"?t-l/2:r==="right"?t-l:t;for(const f of c)e.fillText(f,n,s),n+=e.measureText(f).width+a;return l}function ut(e,o,t,s,a,r,i,c={}){for(let l=r;l>=i;l-=.25)if(S(e,o,l,c),Ot(e,t,s).length<=a)return l;return S(e,o,i,c),i}function ne(e,o,t,s,a,r=.2){e.lineWidth=r,e.beginPath(),e.moveTo(o,t),e.lineTo(s,a),e.stroke()}const uo=["zh","en"],jn="loq-lang",fo={docTitle:{zh:"开放问题图书馆",en:"The Library of Open Questions"},metaDescription:{zh:"开放问题图书馆：一本摊在书桌上的书。翻开每一页，一座 AI 之后的公共图书馆便从纸上立起。",en:"The Library of Open Questions: a book open on a desk. Turn a page and a public library after AI stands up from the paper."},eyebrow:{zh:"AI 之后的公共图书馆",en:"A public library, after AI"},brand:{zh:"开放问题图书馆",en:"The Library of Open Questions"},canvas:{zh:"一本摊开在书桌上的立体书",en:"A pop-up book lying open on a desk"},langToggle:{zh:"切换语言",en:"Switch language"},contents:{zh:"目录",en:"Contents"},prev:{zh:"上一页",en:"Previous page"},next:{zh:"下一页",en:"Next page"},closer:{zh:"近看",en:"Look closer"},farther:{zh:"退后",en:"Step back"},read:{zh:"文字",en:"Text"},readAria:{zh:"显示本页文字",en:"Show this page as text"},closeSheet:{zh:"收起",en:"Hide text"},soundOn:{zh:"声音已开",en:"Sound on"},soundOff:{zh:"声音已关",en:"Sound off"},hintTouch:{zh:"左右轻扫翻页 · 轻点模型",en:"Swipe to turn the page · tap the model"},hintMouse:{zh:"← → 翻页 · 点击模型 · 拖动转动视角",en:"← → to turn · click the model · drag to look around"},openBook:{zh:"打开这本书",en:"Open the book"},loader:{zh:"装订中……",en:"Binding the book…"},noWebGL:{zh:"此设备不支持 WebGL 2。",en:"WebGL 2 is not available on this device."},cover:{zh:"封面",en:"Cover"},titleContents:{zh:"扉页与目录",en:"Title & contents"},afterword:{zh:"后记",en:"Afterword"},spreadOf:{zh:"第 {n} / {m} 页",en:"Spread {n} of {m}"},before:{zh:"AI 之前",en:"Before AI"},now:{zh:"如今",en:"Now"},openQuestion:{zh:"开放问题",en:"Open question"},plate:{zh:"图版",en:"Plate"},goTo:{zh:"翻到",en:"Go to"}},Hn={zh:{press:"开放问题出版社",title:["开放问题","图书馆"],titleRun:"开放问题图书馆",subtitle:"AI 之后的公共图书馆",epigraph:`答案如今唾手可得。
图书馆，是让答案慢下来的地方。`,edition:"二〇四一年 · 初版",contents:"目 录",howTo:"怎样读这本书",howLines:["左右轻扫、方向键或 ‹ › 按钮翻页。","每张图版上的模型会从纸面立起；轻点它，让它动起来。","右上角可切换中文 / EN，每一页都会随之重排。"],afterTitle:"后 记",afterBody:`这本书是一份提案：当答案变得廉价，公共图书馆可以成为什么。书中的五处空间都还没有建成，它们仍是开放的问题。

图书馆曾经替我们保存答案。如今它要替我们保护别的东西：提问的耐心、出处的线索、彼此争论的余地、不被打扰的专注，以及在众人面前核对事实的习惯。`,colophon:"书页以系统字体排版；模型、纸张与布面全部由代码生成（three.js）。翻页与立体图版的手法，受 Techartist 的 Every Joule 与 Fold 启发。",cardTitle:"借阅卡",cardSub:"应还日期",cardRule:"问题可无限续借。",cardStamps:["2041 年 3 月 14 日","2041 年 4 月 2 日","2041 年 5 月 27 日","2041 年 9 月 9 日"],cardFoot:"请把你的问题留在这里，后来的读者会接着问下去。"},en:{press:"Open Questions Press",title:["The Library of","Open Questions"],titleRun:"The Library of Open Questions",subtitle:"A public library, after AI",epigraph:`Answers are cheap now.
A library is where they are slowed down.`,edition:"First edition · 2041",contents:"Contents",howTo:"How to read this book",howLines:["Turn the pages with a swipe, the arrow keys or the ‹ › buttons.","Each plate stands up from the paper. Tap the model to set it moving.","Switch 中文 / EN at the top right and every page is reset in that language."],afterTitle:"Afterword",afterBody:`This book is a proposal for what a public library could become once answers are cheap. None of its five rooms has been built yet; they are still open questions.

Libraries used to keep answers for us. Now they can protect other things: the patience to ask, the thread back to a source, room to disagree, attention nobody interrupts, and the habit of checking facts in front of each other.`,colophon:"Set in system typefaces. Every model, paper and cloth is generated in code with three.js. The page turns and lift-off plates are inspired by Every Joule and Fold by Techartist.",cardTitle:"Reader’s card",cardSub:"Date due",cardRule:"Questions may be renewed indefinitely.",cardStamps:["14 MAR 2041","02 APR 2041","27 MAY 2041","09 SEP 2041"],cardFoot:"Leave your question here. The next reader will keep asking it."}},Kn={well:{zh:{short:"问题井",name:"问题之井",kicker:"中庭 · 中心",body:"下沉的阅读圆环围着一池静水。来访者把尚未成形的问题投进水里；打磨过的问题写成纸笺，缓缓升向天窗。答案如今唾手可得，图书馆于是把力气花在更好的问题上。",before:"检索台与目录卡：带着关键词进来，借走几本书离开。",after:"问题工作室：馆员陪你想清楚，你真正想问的是什么。",action:"泛起涟漪",question:"什么样的问题，值得一问？",caption:"下沉阅读圆环与静水池。水磨石、白橡木、玻璃天窗。"},en:{short:"Well",name:"The Question Well",kicker:"Centre · Atrium",body:"A sunken reading ring surrounds a pool of still water. Visitors drop half-formed questions into it; refined ones rise as paper slips toward the skylight. Answers are cheap now, so the library spends its effort on better questions.",before:"A search desk and a card catalogue: you came with a keyword and left with a few books.",after:"A question studio: librarians help you work out what you are really asking.",action:"Ripple the pool",question:"What makes a question worth asking?",caption:"Sunken reading ring and still pool. Terrazzo, white oak, glass skylight."}},provenance:{zh:{short:"溯源",name:"溯源书库",kicker:"第二区 · 源流",body:"每一本书、每一篇论文、每一份 AI 生成的摘要，都用一根红线系回它的出处，无论来源是人还是机器。来访者既读文字，也读红线。",before:"书架按学科排列，出处藏在没人翻看的脚注里。",after:"书架按源流排列，每一条论断都看得见它从何而来。",action:"循线溯源",question:"这些话，究竟出自谁？",caption:"高书架、滑轨梯与谱系长桌。白橡木、黄铜、红线。"},en:{short:"Stacks",name:"Provenance Stacks",kicker:"Zone 2 · Lineage",body:"Every book, paper and machine-written summary is tied by a red thread back to its sources, human or machine. Visitors read the threads as well as the text.",before:"Shelves sorted by subject; sources buried in footnotes nobody followed.",after:"Shelves sorted by lineage; every claim visibly tethered to where it came from.",action:"Follow the threads",question:"Whose words are these, really?",caption:"Tall stacks, rolling ladder and lineage table. White oak, brass, red thread."}},dialogue:{zh:{short:"对话",name:"对话龛",kicker:"第三区 · 研讨",body:"毛毡围合的小圆龛里，几个人与三位“刻意意见不合”的 AI 导师同坐一桌。这里没有唯一的神谕：人们看着观点相撞，再选择自己的立场。",before:"供独自苦读的安静隔间，小组讨论室按小时预约。",after:"研讨圆龛：由人来主持机器之间的公开争论。",action:"开始辩论",question:"机器意见相左时，由谁裁断？",caption:"毛毡声学屏、圆桌与三位导师。羊毛毡、橡木、玻璃。"},en:{short:"Dialogue",name:"Dialogue Alcoves",kicker:"Zone 3 · Seminar",body:"In a felt-lined alcove, a few people share a table with three AI tutors built to disagree. Nobody gets one oracle: people watch arguments collide, then take a side.",before:"Quiet carrels for solitary study; group rooms booked by the hour.",after:"Seminar rings where people chair the machines’ disagreements out loud.",action:"Start the argument",question:"When the machines disagree, who decides?",caption:"Acoustic felt screens, round table and three tutors. Wool felt, oak, glass."}},quiet:{zh:{short:"静读",name:"无辅助阅览室",kicker:"第四区 · 避静",body:"没有屏幕，没有助手，只有纸、台灯和长桌。不借外力的专注如今最为稀缺，图书馆有意守护它。",before:"安静是一条规定，靠“嘘”声维持。",after:"安静是一处精心设计的避难所，也是全馆最抢手的房间。",action:"让全馆静下来",question:"专注若不用在这里，又该用在哪里？",caption:"北窗、长桌与台灯。橡木、亚麻、钢窗。",sign:"无屏幕 · 无助手"},en:{short:"Unassisted",name:"The Unassisted Room",kicker:"Zone 4 · Refuge",body:"No screens and no assistants: only paper, reading lamps and long tables. Unaided attention is the scarce resource now, and the library protects it on purpose.",before:"Silence was a rule, enforced by shushing.",after:"Silence is a designed refuge, and the most requested room in the building.",action:"Hush the library",question:"If attention is not for this, what is it for?",caption:"North window, long table and reading lamps. Oak, linen, steel glazing.",sign:"No screens · No assistants"}},verify:{zh:{short:"核验",name:"公共核验台",kicker:"第五区 · 信任",body:"无论是否由 AI 生成，每一条论断都摆上核验台公开检验：逐条核对出处，再当众盖章。谁核验了什么，记录对所有人公开。",before:"信任来自书脊上出版社的标志。",after:"信任在公开处赢得，一次一枚印章。",action:"进行一次核验",question:"核验到什么程度，才算足够？",caption:"核验长桌、证据墙与盖章机。橡木、软木、黄铜。"},en:{short:"Verify",name:"Verification Commons",kicker:"Zone 5 · Trust",body:"Claims, machine-made or not, are laid on the bench and tested in public: each source is checked, then the result is stamped in front of everyone. The record of who checked what stays open.",before:"Trust was implied by the publisher’s logo on the spine.",after:"Trust is earned in the open, one stamp at a time.",action:"Run a verification",question:"How much checking is enough?",caption:"Verification bench, evidence wall and stamping press. Oak, cork, brass."}}},Lt=["well","provenance","dialogue","quiet","verify"];function Vn(){try{const e=new URLSearchParams(location.search).get("lang");if(e&&uo.includes(e.slice(0,2)))return e.slice(0,2);const o=localStorage.getItem(jn);if(uo.includes(o))return o}catch{}return"zh"}let Oe=Vn();const ho=new Set,bt=()=>Oe,H=(e,o)=>fo[e]?fo[e][Oe]:e,Nt=e=>Kn[e][Oe],_e=()=>Hn[Oe];function Gn(e){return ho.add(e),()=>ho.delete(e)}function Zn(e=document){document.documentElement.lang=Oe==="zh"?"zh-CN":"en",document.title=H("docTitle");const o=document.querySelector('meta[name="description"]');o&&o.setAttribute("content",H("metaDescription")),e.querySelectorAll("[data-i18n]").forEach(t=>t.textContent=H(t.dataset.i18n)),e.querySelectorAll("[data-i18n-html]").forEach(t=>t.innerHTML=H(t.dataset.i18nHtml)),e.querySelectorAll("[data-i18n-aria]").forEach(t=>t.setAttribute("aria-label",H(t.dataset.i18nAria))),e.querySelectorAll("[data-lang]").forEach(t=>{const s=t.dataset.lang===Oe;t.classList.toggle("is-active",s),t.setAttribute("aria-pressed",String(s))})}const Ke={x0:26,y0:30,x1:182,y1:214},Yn={x0:50,y0:100,x1:146,y1:213.3},Ve=Te+2*we+4.5,q="#26231f",K="#6d665c",rt=["I","II","III","IV","V"],Ut={r1:1,v1:2,r2:3,v2:4,r3:5,v3:6,r4:7,v4:8,r5:9,v5:10,r6:11,v6:12,bk:13},Qn=e=>e+2;function Xn(e){if(e==="p0")return{kind:"title"};if(e==="r1")return{kind:"contents"};if(e==="v6")return{kind:"after"};if(e==="bk")return{kind:"card"};if(e==="cover"||e==="spine")return{kind:e};const o=Number(e.slice(1));return e[0]==="v"?{kind:"zone",zone:o-1}:{kind:"plate",zone:o-2}}const ft=e=>e==="p0"||e[0]==="v";function Re(e){return ft(e)?{l:19,r:he-24}:{l:24,r:he-19}}function Qe(e,o,t,s){const a=Re(o);e.fillStyle=K,S(e,s,2.6,{kind:"sans",weight:500});const r=s==="zh"?.6:.55,i=s==="zh"?t:t.toUpperCase();ft(o)?W(e,i,a.l,14,r):W(e,i,a.r,14,r,{align:"right"})}function Xe(e,o,t){const s=Ut[o];if(!s)return;const a=Re(o);e.fillStyle=K,S(e,t,3.2,{weight:400}),e.textAlign=ft(o)?"left":"right",e.fillText(String(s),ft(o)?a.l:a.r,V-13),e.textAlign="left"}function Je(e,o,t,s,a){e.save(),e.strokeStyle=a,e.fillStyle=a,e.lineWidth=s*.08,e.beginPath(),e.arc(o,t,s,0,Math.PI*2),e.stroke();const r=s*.62,i=t+s*.38;e.lineWidth=s*.07,e.beginPath(),e.moveTo(o,i),e.quadraticCurveTo(o-r*.5,i-s*.16,o-r,i-s*.02),e.lineTo(o-r,i-s*.32),e.quadraticCurveTo(o-r*.5,i-s*.46,o,i-s*.3),e.quadraticCurveTo(o+r*.5,i-s*.46,o+r,i-s*.32),e.lineTo(o+r,i-s*.02),e.quadraticCurveTo(o+r*.5,i-s*.16,o,i),e.moveTo(o,i),e.lineTo(o,i-s*.3),e.stroke(),e.beginPath(),e.arc(o,t-s*.32,s*.2,Math.PI*1.05,Math.PI*2.35),e.stroke(),e.beginPath(),e.arc(o,t+s*0,s*.05,0,Math.PI*2),e.fill(),e.restore()}function Jn(e,o,t,s){const a=_e(),r=he/2-2;if(Je(e,r,34,6.5,q),e.fillStyle=q,S(e,t,2.9,{kind:"sans",weight:500}),W(e,t==="zh"?a.press:a.press.toUpperCase(),r,50,t==="zh"?1.2:.8,{align:"center"}),e.fillStyle=q,e.textAlign="center",t==="zh")S(e,t,21,{weight:600}),W(e,a.title[0],r,104,3.2,{align:"center"}),W(e,a.title[1],r,132,3.2,{align:"center"});else{const c=ut(e,t,a.title[0],150,1,13,8,{weight:400});e.fillText(a.title[0],r,100),S(e,t,c*1.32,{weight:400,italic:!0}),e.measureText(a.title[1]).width>152&&S(e,t,c*1.32*152/e.measureText(a.title[1]).width,{italic:!0}),e.fillText(a.title[1],r,100+c*1.55)}e.textAlign="left",e.strokeStyle=pt.well,ne(e,r-10,147,r+10,147,.5),e.fillStyle=K,S(e,t,4.4,{italic:t!=="zh"}),e.textAlign="center",e.fillText(a.subtitle,r,158),e.textAlign="left",e.fillStyle=q,S(e,t,4,{italic:t!=="zh"}),a.epigraph.split(`
`).forEach((c,l)=>{e.textAlign="center",e.fillText(c,r,196+l*6.4)}),e.textAlign="left",e.fillStyle=K,S(e,t,2.9,{kind:"sans",weight:500}),W(e,t==="zh"?a.edition:a.edition.toUpperCase(),r,V-22,t==="zh"?.9:.6,{align:"center"})}function es(e,o,t,s){const a=_e(),r=Re(o);Qe(e,o,H("brand"),t),e.fillStyle=q,S(e,t,t==="zh"?10:11,{weight:t==="zh"?600:400}),e.fillText(a.contents,r.l,44),e.strokeStyle=q,ne(e,r.l,51,r.r,51,.3);let i=66;Lt.forEach((l,n)=>{const f=Nt(l),u=pt[l],h=i-9;e.fillStyle=u,S(e,t,9,{weight:300}),e.fillText(String(n+1),r.l,i+1);const d=r.l+13;e.fillStyle=q,S(e,t,t==="zh"?5.6:5.8,{weight:t==="zh"?600:500}),e.fillText(f.name,d,i-1);const p=e.measureText(f.name).width;e.fillStyle=K,S(e,t,2.7,{kind:"sans",weight:500}),W(e,t==="zh"?f.kicker:f.kicker.toUpperCase(),d,i+5.2,t==="zh"?.5:.35);const v=String(Ut[`v${n+1}`]);S(e,t,4.4,{weight:400});const m=e.measureText(v).width;e.fillStyle=q,e.fillText(v,r.r-m,i-1),e.fillStyle=K;for(let g=d+p+3;g<r.r-m-3;g+=2.2)e.beginPath(),e.arc(g,i-2.2,.22,0,Math.PI*2),e.fill();s.push({x:r.l-2,y:h,w:r.r-r.l+4,h:18,action:{type:"goto",spread:Qn(n)}}),i+=22}),e.fillStyle=K,S(e,t,4.4,{italic:t!=="zh"}),e.fillText(a.afterTitle.replace(/\s/g,t==="zh"?"":" "),r.l+13,i-1),S(e,t,4.4);const c=String(Ut.v6);e.fillText(c,r.r-e.measureText(c).width,i-1),s.push({x:r.l-2,y:i-9,w:r.r-r.l+4,h:13,action:{type:"goto",spread:7}}),i=196,e.strokeStyle=K,ne(e,r.l,i-9,r.l+18,i-9,.25),e.fillStyle=q,S(e,t,3.3,{kind:"sans",weight:600}),e.fillText(a.howTo,r.l,i-2),e.fillStyle=K,S(e,t,3.3,{weight:400}),i+=5;for(const l of a.howLines)i=ye(e,l,r.l,i,r.r-r.l,{size:3.3,leading:1.45}).y+1.2;Xe(e,o,t)}function ts(e,o,t,s,a){const r=Lt[a],i=Nt(r),c=pt[r],l=Re(o),n=l.r-l.l;Qe(e,o,H("brand"),t),e.fillStyle=c,S(e,t,34,{weight:300}),e.fillText(String(a+1).padStart(2,"0"),l.l-1.5,52),S(e,t,2.9,{kind:"sans",weight:600}),W(e,t==="zh"?i.kicker:i.kicker.toUpperCase(),l.l,61,t==="zh"?.7:.45),e.fillStyle=q;const f=ut(e,t,i.name,n,1,t==="zh"?10.5:11,6,{weight:t==="zh"?600:400});e.fillText(i.name,l.l,61+f*1.25);let u=61+f*1.25+6;e.strokeStyle=q,ne(e,l.l,u,l.l+22,u,.35),u+=10;const h=t==="zh"?4.05:4.25;S(e,t,h),e.fillStyle=q,u=ye(e,i.body,l.l,u,n,{size:h,leading:t==="zh"?1.75:1.48,justify:t==="zh"}).y+4;const d=(n-8)/2,p=t==="zh"?3.35:3.45;e.strokeStyle="rgba(38,35,31,0.35)",ne(e,l.l,u-3,l.r,u-3,.2);const v=u+3;[[H("before"),i.before,l.l],[H("now"),i.after,l.l+d+8]].forEach(([k,B,D],R)=>{e.fillStyle=R?c:K,S(e,t,2.6,{kind:"sans",weight:700}),W(e,t==="zh"?k:k.toUpperCase(),D,v,t==="zh"?.5:.4),e.fillStyle=R?q:K,S(e,t,p,{italic:!R&&t!=="zh"});const x=ye(e,B,D,v+6,d,{size:p,leading:1.5});R===0?u=x.y:u=Math.max(u,x.y)}),ne(e,l.l+d+4,v-3,l.l+d+4,u-3,.2);const m=Math.max(u+12,V-62);e.fillStyle=c,S(e,t,2.6,{kind:"sans",weight:700}),W(e,t==="zh"?H("openQuestion"):H("openQuestion").toUpperCase(),l.l,m,t==="zh"?.6:.45),e.fillStyle=q;const g=ut(e,t,i.question,n,2,t==="zh"?6.2:6.6,4.5,{italic:t!=="zh",weight:400}),w=ye(e,i.question,l.l,m+g*1.5,n,{size:g,leading:1.3}),A=Math.min(V-24,w.y+5);e.fillStyle=c,S(e,t,3.4,{kind:"sans",weight:600});const y=`→  ${i.action}`;e.fillText(y,l.l,A);const z=e.measureText(y).width;e.strokeStyle=c,ne(e,l.l,A+1.4,l.l+z,A+1.4,.25),s.push({x:l.l-3,y:A-6,w:z+6,h:10,action:{type:"zone",zone:a}}),Xe(e,o,t)}function os(e,o,t,s,a){const r=Lt[a],i=Nt(r),c=pt[r],l=Re(o);Qe(e,o,i.name,t);const n=Ke;e.fillStyle="#f7f6f2",e.fillRect(n.x0,n.y0,n.x1-n.x0,n.y1-n.y0),e.strokeStyle="rgba(38,35,31,0.55)",e.lineWidth=.22,e.strokeRect(n.x0,n.y0,n.x1-n.x0,n.y1-n.y0),e.lineWidth=.15;for(const[y,z,k,B]of[[n.x0,n.y0,-1,-1],[n.x1,n.y0,1,-1],[n.x0,n.y1,-1,1],[n.x1,n.y1,1,1]])ne(e,y+k*1.5,z,y+k*5,z,.15),ne(e,y,z+B*1.5,y,z+B*5,.15);e.fillStyle=K,S(e,t,2.6,{kind:"sans",weight:600});const f=t==="zh"?`${H("plate")} ${rt[a]}`:`${H("plate").toUpperCase()} ${rt[a]}`;W(e,f,n.x0,n.y0-3.5,.5);const u=n.x0+4,h=n.y1+9;e.fillStyle=q,e.beginPath(),e.moveTo(u,h-4),e.lineTo(u+1.6,h+1.5),e.lineTo(u,h+.6),e.lineTo(u-1.6,h+1.5),e.closePath(),e.fill(),S(e,t,2.4,{kind:"sans",weight:600}),e.textAlign="center",e.fillText("N",u,h+5),e.textAlign="left";const d=n.x1-50,p=n.y1+7;e.strokeStyle=q,e.lineWidth=.2,e.strokeRect(d,p,50,1.4),e.fillStyle=q,e.fillRect(d,p,12.5,1.4),e.fillRect(d+25,p,12.5,1.4),S(e,t,2.3,{kind:"sans",weight:500}),e.fillText("0",d-.6,p+5),e.fillText("1",d+24.4,p+5),e.fillText("2 m",d+48.8,p+5),e.textAlign="right",e.fillText("1 : 40",d-3,p+1.6),e.textAlign="left";const v=n.y1+20,m=l.r-l.l;e.fillStyle=q,S(e,t,3.5,{weight:600,italic:t!=="zh"});const g=t==="zh"?`${H("plate")} ${rt[a]}　${i.name}。`:`Plate ${rt[a]}. ${i.name}.`;e.fillText(g,l.l,v);const w=e.measureText(g+" ").width;S(e,t,3.5,{weight:400}),Ot(e,i.caption,m-w).length===1?e.fillText(i.caption,l.l+w,v):ye(e,i.caption,l.l,v+5.2,m,{size:3.5,leading:1.45,maxLines:2}),e.fillStyle=c,e.fillRect(l.l,v-9,6,.6),Xe(e,o,t)}function ns(e,o,t){const s=_e(),a=Re(o),r=a.r-a.l;Qe(e,o,H("brand"),t),e.fillStyle=q,S(e,t,t==="zh"?9:10,{weight:t==="zh"?600:400,italic:t!=="zh"}),e.fillText(s.afterTitle,a.l,50),e.strokeStyle=q,ne(e,a.l,57,a.l+22,57,.35);const i=t==="zh"?4.05:4.25;S(e,t,i);let c=70;for(const l of s.afterBody.split(`

`))c=ye(e,l,a.l,c,r,{size:i,leading:t==="zh"?1.75:1.48,justify:t==="zh"}).y+3;Je(e,a.l+6,V-60,5,K),e.fillStyle=K,S(e,t,3,{weight:400,italic:t!=="zh"}),ye(e,s.colophon,a.l+16,V-63,r-16,{size:3,leading:1.5}),Xe(e,o,t)}function ss(e,o,t){const s=_e(),a=Re(o);Qe(e,o,s.cardTitle,t);const r=46,i=40,c=104,l=150;e.save(),e.translate(r+c/2,i+l/2),e.rotate(-.025),e.translate(-c/2,-l/2),e.fillStyle="rgba(70,55,30,0.07)",e.fillRect(1.2,1.6,c,l),e.fillStyle="#fbf6ea",e.fillRect(0,0,c,l),e.strokeStyle="rgba(38,35,31,0.5)",e.lineWidth=.2,e.strokeRect(0,0,c,l),e.fillStyle=q,S(e,t,4.4,{weight:600}),e.fillText(s.cardTitle,7,12),e.fillStyle=K,S(e,t,2.6,{kind:"sans",weight:600}),W(e,t==="zh"?s.cardSub:s.cardSub.toUpperCase(),7,19,.5),e.strokeStyle="rgba(54,80,127,0.45)";for(let f=0;f<11;f++)ne(e,6,26+f*10.5,c-6,26+f*10.5,.18);ne(e,46,22,46,l-8,.18),s.cardStamps.forEach((f,u)=>{e.save(),e.translate(9,34+u*10.5),e.rotate((u*37%7-3)*.012),e.fillStyle=u%2?"rgba(84,62,140,0.78)":"rgba(54,80,127,0.8)",S(e,t,3.2,{kind:"sans",weight:700}),W(e,f,0,0,.35),e.restore()}),e.restore();const n=150;e.fillStyle="#efe2c4",e.beginPath(),e.moveTo(38,n),e.lineTo(158,n),e.lineTo(158,214),e.lineTo(38,214),e.closePath(),e.fill(),e.strokeStyle="rgba(38,35,31,0.45)",e.lineWidth=.25,e.stroke(),e.fillStyle=q,S(e,t,3,{kind:"sans",weight:700}),W(e,t==="zh"?H("brand"):H("brand").toUpperCase(),98,n+16,t==="zh"?.8:.4,{align:"center"}),e.fillStyle=K,S(e,t,3.4,{italic:t!=="zh"}),e.textAlign="center",e.fillText(s.cardRule,98,n+27),e.textAlign="left",Je(e,98,n+44,5,K),e.fillStyle=K,S(e,t,3.3,{italic:t!=="zh"}),ye(e,s.cardFoot,a.l,V-30,a.r-a.l,{size:3.3,leading:1.4,align:"center"}),Xe(e,o,t)}function as(e,o,t){const s=_e(),a="#"+fe.cloth.toString(16).padStart(6,"0");e.fillStyle=a,e.fillRect(0,0,te,$),o.fillStyle="rgb(0,0,255)",o.fillRect(0,0,te,$);const r=n=>{e.fillStyle=e.strokeStyle="#d9b46a",n(e),o.globalCompositeOperation="lighter",o.fillStyle=o.strokeStyle="rgb(255,170,0)",n(o),o.globalCompositeOperation="source-over"},i=n=>{o.globalCompositeOperation="lighter",o.fillStyle=o.strokeStyle="rgb(0,150,0)",n(o),o.globalCompositeOperation="source-over"},c=te/2+2;r(n=>{n.lineWidth=.5,n.strokeRect(10,10,te-20,$-20)}),i(n=>{n.lineWidth=.6,n.strokeRect(13,13,te-26,$-26)}),r(n=>{n.textAlign="center",t==="zh"?(S(n,t,15.5,{weight:600}),W(n,s.titleRun,c,54,1.6,{align:"center"}),S(n,t,4.2,{kind:"sans",weight:500}),W(n,s.subtitle,c,72,1.4,{align:"center"})):(S(n,t,9,{weight:400,italic:!0}),n.fillText(s.title[0],c,44),ut(n,t,s.title[1],te-44,1,15,9,{weight:400}),n.fillText(s.title[1],c,63),S(n,t,3.4,{kind:"sans",weight:600}),W(n,s.subtitle.toUpperCase(),c,77,.9,{align:"center"})),n.textAlign="left"});const l=Yn;e.fillStyle="#f2ece0",e.fillRect(l.x0,l.y0,l.x1-l.x0,l.y1-l.y0),o.fillStyle="rgb(0,90,0)",o.fillRect(l.x0-3,l.y0-3,l.x1-l.x0+6,l.y1-l.y0+6),o.fillStyle="rgb(0,255,0)",o.fillRect(l.x0,l.y0,l.x1-l.x0,l.y1-l.y0),r(n=>{S(n,t,3,{kind:"sans",weight:600}),W(n,t==="zh"?s.press:s.press.toUpperCase(),c,$-24,t==="zh"?1.2:.8,{align:"center"})}),r(n=>Je(n,c,$-37,4.2,n.fillStyle))}function rs(e,o,t){const s=_e(),a="#"+fe.cloth.toString(16).padStart(6,"0");e.fillStyle=a,e.fillRect(0,0,Ve,$),o.fillStyle="rgb(0,0,255)",o.fillRect(0,0,Ve,$);const r=c=>{e.fillStyle=e.strokeStyle="#d9b46a",c(e),o.globalCompositeOperation="lighter",o.fillStyle=o.strokeStyle="rgb(255,170,0)",c(o),o.globalCompositeOperation="source-over"},i=Ve/2;r(c=>{for(const l of[11,13.2,$-13.2,$-11])c.fillRect(3,l-.25,Ve-6,.5)}),r(c=>{t==="zh"?(S(c,t,6.4,{weight:600}),c.textAlign="center",Array.from(s.titleRun).forEach((l,n)=>c.fillText(l,i,36+n*8.6)),c.textAlign="left"):(c.save(),c.translate(i+1.8,28),c.rotate(Math.PI/2),S(c,t,4.8,{weight:500}),W(c,s.titleRun.toUpperCase(),0,0,.9),c.restore()),Je(c,i,$-26,3.3,c.fillStyle)})}function is({tier:e,anisotropy:o=8}){const t=new Map,s=["p0","r1","v1","r2","v2","r3","v3","r4","v4","r5","v5","r6","v6","bk"],a=[];function r(n,f=!0){const u=new mo(n);return u.colorSpace=f?Ze:kt,u.flipY=!1,u.anisotropy=o,u.minFilter=zt,u.magFilter=me,u.generateMipmaps=!0,u}for(const n of s)t.set(n,{id:n,...Xn(n),canvas:null,tex:null,density:0,want:e.pagePxFar,hits:[],print:null,printAlpha:0,rect:new Ye(Ke.x0,Ke.y0,Ke.x1,Ke.y1)});for(const n of["cover","spine"])t.set(n,{id:n,kind:n,canvas:null,mcanvas:null,tex:null,mask:null,density:0,want:0,hits:[],print:null,printAlpha:0,rect:new Ye});function i(n){const f=bt(),u=n.kind==="cover"||n.kind==="spine",h=n.kind==="cover"?te:n.kind==="spine"?Ve:he,d=u?$:V,p=u?e.name==="high"?5:3:n.want,v=Math.max(8,Math.round(h*p)),m=Math.max(8,Math.round(d*p)),g=!n.canvas||n.canvas.width!==v||n.canvas.height!==m;g&&(n.canvas=document.createElement("canvas"),n.canvas.width=v,n.canvas.height=m,u&&(n.mcanvas=document.createElement("canvas"),n.mcanvas.width=v,n.mcanvas.height=m));const w=n.canvas.getContext("2d");if(w.setTransform(v/h,0,0,m/d,0,0),w.textBaseline="alphabetic",n.hits=[],u){const A=n.mcanvas.getContext("2d");A.setTransform(v/h,0,0,m/d,0,0),n.kind==="cover"?as(w,A,f):rs(w,A,f)}else w.fillStyle="#ffffff",w.fillRect(0,0,he,V),w.fillStyle=q,w.strokeStyle=q,n.kind==="title"?Jn(w,n.id,f,n.hits):n.kind==="contents"?es(w,n.id,f,n.hits):n.kind==="zone"?ts(w,n.id,f,n.hits,n.zone):n.kind==="plate"?os(w,n.id,f,n.hits,n.zone):n.kind==="after"?ns(w,n.id,f):n.kind==="card"&&ss(w,n.id,f);g||!n.tex?(n.tex&&n.tex.dispose(),n.tex=r(n.canvas),u&&(n.mask&&n.mask.dispose(),n.mask=r(n.mcanvas,!1))):(n.tex.needsUpdate=!0,u&&(n.mask.needsUpdate=!0)),n.density=p,n.lang=f}function c(n){const f=new Set;for(const h of[n-1,n,n+1])h<0||h>7||(f.add(h<=1?"p0":`v${h-1}`),f.add(h>=7?"bk":`r${Math.max(1,h)}`));a.length=0;const u=[];for(const h of t.values())h.kind==="cover"||h.kind==="spine"||(h.want=f.has(h.id)?e.pagePx:e.pagePxFar,(!h.canvas||Math.abs(h.density-h.want)>.01||h.lang!==bt())&&u.push(h));u.sort((h,d)=>(f.has(d.id)?1:0)-(f.has(h.id)?1:0)),a.push(...u)}function l(){for(const n of t.values())n.lang=null;i(t.get("cover")),i(t.get("spine"))}return{get:n=>{const f=t.get(n);return f.tex||i(f),f},entries:t,focus:c,invalidate:l,step(n=1){let f=0;for(;a.length&&f<n;){const u=a.shift();u.canvas&&Math.abs(u.density-u.want)<.01&&u.lang===bt()||(i(u),f++)}return a.length},renderNow(n){i(t.get(n))},setPrint(n,f){const u=t.get(n);u.print=f},hitAt(n,f,u){const h=t.get(n);if(!h)return null;for(const d of h.hits)if(f>=d.x&&f<=d.x+d.w&&u>=d.y&&u<=d.y+d.h)return d.action;return null}}}Zn();const Pe=new URLSearchParams(location.search),pe=cn[ln()];document.documentElement.dataset.tier=pe.name;const ls=document.getElementById("scene"),Mo=document.getElementById("loader");let ae;try{ae=new rn({canvas:ls,antialias:!1,powerPreference:"high-performance",stencil:!1})}catch(e){throw Mo.innerHTML=`<span>${H("noWebGL")}</span>`,e}ae.toneMapping=en;ae.shadowMap.enabled=!0;ae.shadowMap.type=tn;const _t=new on(new Uint8Array([255,255,255,255]),1,1,nn,Ee);_t.colorSpace=Ze;_t.needsUpdate=!0;Cn(_t);const To=bn({minScale:pe.minScale,onChange:()=>Ht()});function cs(){const e=window.devicePixelRatio||1,o=Math.sqrt(pe.megapixels*1e6/(window.innerWidth*window.innerHeight));return Math.max(.5,Math.min(e,pe.maxDpr,o)*To.scale)}const Me=new sn(30,window.innerWidth/window.innerHeight,12,9e3),Le=In(Me),$t=yn(ae,pe),Ge=fn(ae),us=pe.texScale,Po={oak:Ge.bake("oak",{res:Math.round(1024*us),mirrored:!0}),lino:Ge.bake("lino",{res:512}),paper:Ge.bake("paper",{res:512}),weave:Ge.bake("weave",{res:256})},Wt=Bn({renderer:ae,tier:pe,textures:Po}),jt=Wt.scene,Ce=is({tier:pe,anisotropy:Ge.anisotropy}),de=On({textures:Po,pages:Ce});de.group.position.y=qe.h;jt.add(de.group);Gn(()=>{Ce.invalidate(),Ce.focus(de.settled)});const St=new Y;function Ht(){const e=window.innerWidth,o=window.innerHeight;ae.setPixelRatio(cs()),ae.setSize(e,o,!1),Me.aspect=e/o,Me.updateProjectionMatrix(),ae.getDrawingBufferSize(St),$t.setSize(St.x,St.y)}window.addEventListener("resize",Ht);Ht();const Co=Pe.has("spread")?Number(Pe.get("spread")):0;de.goTo(Co,{instant:!0});Ce.focus(Co);for(;Ce.step(4););const It=Pe.get("turn");if(It){const[e,o]=It.split(",").map(Number);de.tau[e]=o,de.relayout()}Pe.has("zoom")&&(Le.state.zoomTarget=Le.state.zoom=Number(Pe.get("zoom")));Pe.has("yaw")&&(Le.state.yaw=Number(Pe.get("yaw")));let po=performance.now(),xt=0;function Ro(e){requestAnimationFrame(Ro);const o=(e-po)/1e3;if(po=e,document.hidden)return;const t=Math.min(o,.05);xt+=t,To.sample(o),It||de.update(t),Le.state.open=de.openness,Le.update(t,xt,Me.aspect),Wt.update(Me),Ce.step(1),$t.render(jt,Me,xt)}requestAnimationFrame(Ro);Mo.classList.add("is-done");document.body.classList.add("is-ready");window.__loq={scene:jt,camera:Me,renderer:ae,book:de,pages:Ce,rig:Le,stage:Wt,post:$t,tier:pe};window.__ready=!0;
