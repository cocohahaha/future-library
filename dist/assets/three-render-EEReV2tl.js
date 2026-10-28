import{R as Lr,C as ir,L as At,B as zn,S as bt,N as Rt,a as lt,c as In,M as St,b as Gt,d as Ur,e as $e,f as Fe,V as st,m as at,g as Ve,h as mn,E as rr,i as Vt,j as et,k as Ke,P as ar,F as Zt,l as or,I as sr,H as _n,U as yt,n as It,o as Mt,p as Dr,q as yn,r as Nn,s as Qt,t as kt,O as wr,u as cn,v as Ct,w as Ir,x as cr,y as ln,z as gn,A as qt,D as yr,G as Nr,J as Or,K as ot,Q as lr,T as Fr,W as fr,X as dr,Y as ur,Z as ti,_ as pr,$ as Br,a0 as vt,a1 as Gr,a2 as Hr,a3 as Vr,a4 as kr,a5 as Wr,a6 as zr,a7 as Xr,a8 as hr,a9 as Yr,aa as qr,ab as Kr,ac as $r,ad as Et,ae as fn,af as Zr,ag as Qr,ah as Jr,ai as mr,aj as jr,ak as ea,al as ta,am as $t,an as un,ao as na,ap as ia,aq as Yt,ar as ra,as as aa,at as oa,au as sa,av as ca,aw as la,ax as fa,ay as da,az as ua,aA as pa,aB as ha,aC as ma,aD as _a,aE as ga,aF as va,aG as On,aH as Fn,aI as Bn,aJ as Gn,aK as Hn,aL as Vn,aM as kn,aN as Ea,aO as ni,aP as Sa,aQ as Ma,aR as ii,aS as ri,aT as ai,aU as Ta,aV as xa,aW as Aa,aX as Ra,aY as Ca,aZ as Sn,a_ as nn,a$ as ba,b0 as Pa,b1 as La,b2 as Ua,b3 as Da,b4 as wa,b5 as Ia,b6 as ya,b7 as Bt,b8 as pn,b9 as oi,ba as Xn,bb as Jt,bc as jt,bd as hn,be as Na,bf as _r,bg as gr,bh as Oa,bi as Fa,bj as Ba,bk as Ga,bl as Ha,bm as Va,bn as ka,bo as Wa,bp as vr,bq as za,br as Er,bs as Sr,bt as Mn,bu as Tn,bv as xn,bw as An,bx as si,by as ci,bz as li,bA as fi,bB as di,bC as ui,bD as pi,bE as hi,bF as mi,bG as _i,bH as gi,bI as vi,bJ as Ei,bK as Si,bL as Mi,bM as Ti,bN as xi,bO as Ai,bP as Ri,bQ as Ci,bR as bi,bS as Rn,bT as Pi,bU as Li,bV as Xa,bW as Ui,bX as Di,bY as wi,bZ as rn,b_ as Ya,b$ as qa,c0 as Ka,c1 as $a,c2 as Za,c3 as Qa,c4 as Ja,c5 as ja,c6 as eo,c7 as to}from"./three-core-DGRE-Brg.js";class Nt extends Lr{constructor(n=1,t=1,i={}){super(n,t,i),this.isWebGLRenderTarget=!0}}class no extends Nt{constructor(n=1,t={}){super(n,n,t),this.isWebGLCubeRenderTarget=!0;const i={width:n,height:n,depth:1},s=[i,i,i,i,i,i];this.texture=new ir(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:At}fromEquirectangularTexture(n,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new zn(5,5,5),o=new bt({name:"CubemapFromEquirect",uniforms:In(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:lt,blending:Rt});o.uniforms.tEquirect.value=t;const h=new St(s,o),f=t.minFilter;return t.minFilter===Gt&&(t.minFilter=At),new Ur(1,10,this).update(n,h),t.minFilter=f,h.geometry.dispose(),h.material.dispose(),this}clear(n,t,i,s){const o=n.getRenderTarget();for(let h=0;h<6;h++)n.setRenderTarget(this,h),n.clear(t,i,s);n.setRenderTarget(o)}}function Mr(){let e=null,n=!1,t=null,i=null;function s(o,h){t(o,h),i=e.requestAnimationFrame(s)}return{start:function(){n!==!0&&t!==null&&(i=e.requestAnimationFrame(s),n=!0)},stop:function(){e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(o){t=o},setContext:function(o){e=o}}}function io(e){const n=new WeakMap;function t(f,b){const E=f.array,U=f.usage,R=E.byteLength,g=e.createBuffer();e.bindBuffer(b,g),e.bufferData(b,E,U),f.onUploadCallback();let x;if(E instanceof Float32Array)x=e.FLOAT;else if(E instanceof Uint16Array)f.isFloat16BufferAttribute?x=e.HALF_FLOAT:x=e.UNSIGNED_SHORT;else if(E instanceof Int16Array)x=e.SHORT;else if(E instanceof Uint32Array)x=e.UNSIGNED_INT;else if(E instanceof Int32Array)x=e.INT;else if(E instanceof Int8Array)x=e.BYTE;else if(E instanceof Uint8Array)x=e.UNSIGNED_BYTE;else if(E instanceof Uint8ClampedArray)x=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+E);return{buffer:g,type:x,bytesPerElement:E.BYTES_PER_ELEMENT,version:f.version,size:R}}function i(f,b,E){const U=b.array,R=b.updateRanges;if(e.bindBuffer(E,f),R.length===0)e.bufferSubData(E,0,U);else{R.sort((x,N)=>x.start-N.start);let g=0;for(let x=1;x<R.length;x++){const N=R[g],C=R[x];C.start<=N.start+N.count+1?N.count=Math.max(N.count,C.start+C.count-N.start):(++g,R[g]=C)}R.length=g+1;for(let x=0,N=R.length;x<N;x++){const C=R[x];e.bufferSubData(E,C.start*U.BYTES_PER_ELEMENT,U,C.start,C.count)}b.clearUpdateRanges()}b.onUploadCallback()}function s(f){return f.isInterleavedBufferAttribute&&(f=f.data),n.get(f)}function o(f){f.isInterleavedBufferAttribute&&(f=f.data);const b=n.get(f);b&&(e.deleteBuffer(b.buffer),n.delete(f))}function h(f,b){if(f.isInterleavedBufferAttribute&&(f=f.data),f.isGLBufferAttribute){const U=n.get(f);(!U||U.version<f.version)&&n.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}const E=n.get(f);if(E===void 0)n.set(f,t(f,b));else if(E.version<f.version){if(E.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(E.buffer,f,b),E.version=f.version}}return{get:s,remove:o,update:h}}const ro=`
#ifdef USE_ALPHAHASH
if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif
`,ao=`
#ifdef USE_ALPHAHASH
const float ALPHA_HASH_SCALE = 0.05; // Derived from trials only, and may be changed.
float hash2D( vec2 value ) {
return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
}
float hash3D( vec3 value ) {
return hash2D( vec2( hash2D( value.xy ), value.z ) );
}
float getAlphaHashThreshold( vec3 position ) {
float maxDeriv = max(
length( dFdx( position.xyz ) ),
length( dFdy( position.xyz ) )
);
float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
vec2 pixScales = vec2(
exp2( floor( log2( pixScale ) ) ),
exp2( ceil( log2( pixScale ) ) )
);
vec2 alpha = vec2(
hash3D( floor( pixScales.x * position.xyz ) ),
hash3D( floor( pixScales.y * position.xyz ) )
);
float lerpFactor = fract( log2( pixScale ) );
float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
float a = min( lerpFactor, 1.0 - lerpFactor );
vec3 cases = vec3(
x * x / ( 2.0 * a * ( 1.0 - a ) ),
( x - 0.5 * a ) / ( 1.0 - a ),
1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
);
float threshold = ( x < ( 1.0 - a ) )
? ( ( x < a ) ? cases.x : cases.y )
: cases.z;
return clamp( threshold , 1.0e-6, 1.0 );
}
#endif
`,oo=`
#ifdef USE_ALPHAMAP
diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif
`,so=`
#ifdef USE_ALPHAMAP
uniform sampler2D alphaMap;
#endif
`,co=`
#ifdef USE_ALPHATEST
#ifdef ALPHA_TO_COVERAGE
diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
if ( diffuseColor.a == 0.0 ) discard;
#else
if ( diffuseColor.a < alphaTest ) discard;
#endif
#endif
`,lo=`
#ifdef USE_ALPHATEST
uniform float alphaTest;
#endif
`,fo=`
#ifdef USE_AOMAP
float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
reflectedLight.indirectDiffuse *= ambientOcclusion;
#if defined( USE_CLEARCOAT ) 
clearcoatSpecularIndirect *= ambientOcclusion;
#endif
#if defined( USE_SHEEN ) 
sheenSpecularIndirect *= ambientOcclusion;
#endif
#if defined( USE_ENVMAP ) && defined( STANDARD )
float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
#endif
#endif
`,uo=`
#ifdef USE_AOMAP
uniform sampler2D aoMap;
uniform float aoMapIntensity;
#endif
`,po=`
#ifdef USE_BATCHING
#if ! defined( GL_ANGLE_multi_draw )
#define gl_DrawID _gl_DrawID
uniform int _gl_DrawID;
#endif
uniform highp sampler2D batchingTexture;
uniform highp usampler2D batchingIdTexture;
mat4 getBatchingMatrix( const in float i ) {
int size = textureSize( batchingTexture, 0 ).x;
int j = int( i ) * 4;
int x = j % size;
int y = j / size;
vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
return mat4( v1, v2, v3, v4 );
}
float getIndirectIndex( const in int i ) {
int size = textureSize( batchingIdTexture, 0 ).x;
int x = i % size;
int y = i / size;
return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
}
#endif
#ifdef USE_BATCHING_COLOR
uniform sampler2D batchingColorTexture;
vec3 getBatchingColor( const in float i ) {
int size = textureSize( batchingColorTexture, 0 ).x;
int j = int( i );
int x = j % size;
int y = j / size;
return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
}
#endif
`,ho=`
#ifdef USE_BATCHING
mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif
`,mo=`
vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
vPosition = vec3( position );
#endif
`,_o=`
vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
vec3 objectTangent = vec3( tangent.xyz );
#endif
`,go=`
float G_BlinnPhong_Implicit(  ) {
return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
vec3 halfDir = normalize( lightDir + viewDir );
float dotNH = saturate( dot( normal, halfDir ) );
float dotVH = saturate( dot( viewDir, halfDir ) );
vec3 F = F_Schlick( specularColor, 1.0, dotVH );
float G = G_BlinnPhong_Implicit(  );
float D = D_BlinnPhong( shininess, dotNH );
return F * ( G * D );
} // validated
`,vo=`
#ifdef USE_IRIDESCENCE
const mat3 XYZ_TO_REC709 = mat3(
3.2404542, -0.9692660,  0.0556434,
-1.5371385,  1.8760108, -0.2040259,
-0.4985314,  0.0415560,  1.0572252
);
vec3 Fresnel0ToIor( vec3 fresnel0 ) {
vec3 sqrtF0 = sqrt( fresnel0 );
return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
}
vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
}
float IorToFresnel0( float transmittedIor, float incidentIor ) {
return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
}
vec3 evalSensitivity( float OPD, vec3 shift ) {
float phase = 2.0 * PI * OPD * 1.0e-9;
vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
xyz /= 1.0685e-7;
vec3 rgb = XYZ_TO_REC709 * xyz;
return rgb;
}
vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
vec3 I;
float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
float cosTheta2Sq = 1.0 - sinTheta2Sq;
if ( cosTheta2Sq < 0.0 ) {
return vec3( 1.0 );
}
float cosTheta2 = sqrt( cosTheta2Sq );
float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
float R12 = F_Schlick( R0, 1.0, cosTheta1 );
float T121 = 1.0 - R12;
float phi12 = 0.0;
if ( iridescenceIOR < outsideIOR ) phi12 = PI;
float phi21 = PI - phi12;
vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) ); // guard against 1.0
vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
vec3 phi23 = vec3( 0.0 );
if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
vec3 phi = vec3( phi21 ) + phi23;
vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
vec3 r123 = sqrt( R123 );
vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
vec3 C0 = R12 + Rs;
I = C0;
vec3 Cm = Rs - T121;
for ( int m = 1; m <= 2; ++ m ) {
Cm *= r123;
vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
I += Cm * Sm;
}
return max( I, vec3( 0.0 ) );
}
#endif
`,Eo=`
#ifdef USE_BUMPMAP
uniform sampler2D bumpMap;
uniform float bumpScale;
vec2 dHdxy_fwd() {
vec2 dSTdx = dFdx( vBumpMapUv );
vec2 dSTdy = dFdy( vBumpMapUv );
float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
return vec2( dBx, dBy );
}
vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
vec3 vN = surf_norm; // normalized
vec3 R1 = cross( vSigmaY, vN );
vec3 R2 = cross( vN, vSigmaX );
float fDet = dot( vSigmaX, R1 ) * faceDirection;
vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
return normalize( abs( fDet ) * surf_norm - vGrad );
}
#endif
`,So=`
#if NUM_CLIPPING_PLANES > 0
vec4 plane;
#ifdef ALPHA_TO_COVERAGE
float distanceToPlane, distanceGradient;
float clipOpacity = 1.0;
#pragma unroll_loop_start
for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
plane = clippingPlanes[ i ];
distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
distanceGradient = fwidth( distanceToPlane ) / 2.0;
clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
if ( clipOpacity == 0.0 ) discard;
}
#pragma unroll_loop_end
#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
float unionClipOpacity = 1.0;
#pragma unroll_loop_start
for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
plane = clippingPlanes[ i ];
distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
distanceGradient = fwidth( distanceToPlane ) / 2.0;
unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
}
#pragma unroll_loop_end
clipOpacity *= 1.0 - unionClipOpacity;
#endif
diffuseColor.a *= clipOpacity;
if ( diffuseColor.a == 0.0 ) discard;
#else
#pragma unroll_loop_start
for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
plane = clippingPlanes[ i ];
if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
}
#pragma unroll_loop_end
#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
bool clipped = true;
#pragma unroll_loop_start
for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
plane = clippingPlanes[ i ];
clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
}
#pragma unroll_loop_end
if ( clipped ) discard;
#endif
#endif
#endif
`,Mo=`
#if NUM_CLIPPING_PLANES > 0
varying vec3 vClipPosition;
uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif
`,To=`
#if NUM_CLIPPING_PLANES > 0
varying vec3 vClipPosition;
#endif
`,xo=`
#if NUM_CLIPPING_PLANES > 0
vClipPosition = - mvPosition.xyz;
#endif
`,Ao=`
#if defined( USE_COLOR_ALPHA )
diffuseColor *= vColor;
#elif defined( USE_COLOR )
diffuseColor.rgb *= vColor;
#endif
`,Ro=`
#if defined( USE_COLOR_ALPHA )
varying vec4 vColor;
#elif defined( USE_COLOR )
varying vec3 vColor;
#endif
`,Co=`
#if defined( USE_COLOR_ALPHA )
varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
varying vec3 vColor;
#endif
`,bo=`
#if defined( USE_COLOR_ALPHA )
vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
vColor.xyz *= batchingColor.xyz;
#endif
`,Po=`
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
const highp float a = 12.9898, b = 78.233, c = 43758.5453;
highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
float precisionSafeLength( vec3 v ) { return length( v ); }
#else
float precisionSafeLength( vec3 v ) {
float maxComponent = max3( abs( v ) );
return length( v / maxComponent ) * maxComponent;
}
#endif
struct IncidentLight {
vec3 color;
vec3 direction;
bool visible;
};
struct ReflectedLight {
vec3 directDiffuse;
vec3 directSpecular;
vec3 indirectDiffuse;
vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
mat3 tmp;
tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
return RECIPROCAL_PI * diffuseColor;
} // validated
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated
`,Lo=`
#ifdef ENVMAP_TYPE_CUBE_UV
#define cubeUV_minMipLevel 4.0
#define cubeUV_minTileSize 16.0
float getFace( vec3 direction ) {
vec3 absDirection = abs( direction );
float face = - 1.0;
if ( absDirection.x > absDirection.z ) {
if ( absDirection.x > absDirection.y )
face = direction.x > 0.0 ? 0.0 : 3.0;
else
face = direction.y > 0.0 ? 1.0 : 4.0;
} else {
if ( absDirection.z > absDirection.y )
face = direction.z > 0.0 ? 2.0 : 5.0;
else
face = direction.y > 0.0 ? 1.0 : 4.0;
}
return face;
}
vec2 getUV( vec3 direction, float face ) {
vec2 uv;
if ( face == 0.0 ) {
uv = vec2( direction.z, direction.y ) / abs( direction.x ); // pos x
} else if ( face == 1.0 ) {
uv = vec2( - direction.x, - direction.z ) / abs( direction.y ); // pos y
} else if ( face == 2.0 ) {
uv = vec2( - direction.x, direction.y ) / abs( direction.z ); // pos z
} else if ( face == 3.0 ) {
uv = vec2( - direction.z, direction.y ) / abs( direction.x ); // neg x
} else if ( face == 4.0 ) {
uv = vec2( - direction.x, direction.z ) / abs( direction.y ); // neg y
} else {
uv = vec2( direction.x, direction.y ) / abs( direction.z ); // neg z
}
return 0.5 * ( uv + 1.0 );
}
vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
float face = getFace( direction );
float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
mipInt = max( mipInt, cubeUV_minMipLevel );
float faceSize = exp2( mipInt );
highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0; // #25071
if ( face > 2.0 ) {
uv.y += faceSize;
face -= 3.0;
}
uv.x += face * faceSize;
uv.x += filterInt * 3.0 * cubeUV_minTileSize;
uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
uv.x *= CUBEUV_TEXEL_WIDTH;
uv.y *= CUBEUV_TEXEL_HEIGHT;
#ifdef texture2DGradEXT
return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb; // disable anisotropic filtering
#else
return texture2D( envMap, uv ).rgb;
#endif
}
#define cubeUV_r0 1.0
#define cubeUV_m0 - 2.0
#define cubeUV_r1 0.8
#define cubeUV_m1 - 1.0
#define cubeUV_r4 0.4
#define cubeUV_m4 2.0
#define cubeUV_r5 0.305
#define cubeUV_m5 3.0
#define cubeUV_r6 0.21
#define cubeUV_m6 4.0
float roughnessToMip( float roughness ) {
float mip = 0.0;
if ( roughness >= cubeUV_r1 ) {
mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
} else if ( roughness >= cubeUV_r4 ) {
mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
} else if ( roughness >= cubeUV_r5 ) {
mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
} else if ( roughness >= cubeUV_r6 ) {
mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
} else {
mip = - 2.0 * log2( 1.16 * roughness ); // 1.16 = 1.79^0.25
}
return mip;
}
vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
float mipF = fract( mip );
float mipInt = floor( mip );
vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
if ( mipF == 0.0 ) {
return vec4( color0, 1.0 );
} else {
vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
return vec4( mix( color0, color1, mipF ), 1.0 );
}
}
#endif
`,Uo=`
vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
mat3 bm = mat3( batchingMatrix );
transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
transformedNormal = bm * transformedNormal;
#ifdef USE_TANGENT
transformedTangent = bm * transformedTangent;
#endif
#endif
#ifdef USE_INSTANCING
mat3 im = mat3( instanceMatrix );
transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
transformedNormal = im * transformedNormal;
#ifdef USE_TANGENT
transformedTangent = im * transformedTangent;
#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#ifdef FLIP_SIDED
transformedTangent = - transformedTangent;
#endif
#endif
`,Do=`
#ifdef USE_DISPLACEMENTMAP
uniform sampler2D displacementMap;
uniform float displacementScale;
uniform float displacementBias;
#endif
`,wo=`
#ifdef USE_DISPLACEMENTMAP
transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif
`,Io=`
#ifdef USE_EMISSIVEMAP
vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
emissiveColor = sRGBTransferEOTF( emissiveColor );
#endif
totalEmissiveRadiance *= emissiveColor.rgb;
#endif
`,yo=`
#ifdef USE_EMISSIVEMAP
uniform sampler2D emissiveMap;
#endif
`,No=`
gl_FragColor = linearToOutputTexel( gl_FragColor );
`,Oo=`
vec4 LinearTransferOETF( in vec4 value ) {
return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
`,Fo=`
#ifdef USE_ENVMAP
#ifdef ENV_WORLDPOS
vec3 cameraToFrag;
if ( isOrthographic ) {
cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
} else {
cameraToFrag = normalize( vWorldPosition - cameraPosition );
}
vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
#ifdef ENVMAP_MODE_REFLECTION
vec3 reflectVec = reflect( cameraToFrag, worldNormal );
#else
vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
#endif
#else
vec3 reflectVec = vReflect;
#endif
#ifdef ENVMAP_TYPE_CUBE
vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
#else
vec4 envColor = vec4( 0.0 );
#endif
#ifdef ENVMAP_BLENDING_MULTIPLY
outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
#elif defined( ENVMAP_BLENDING_MIX )
outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
#elif defined( ENVMAP_BLENDING_ADD )
outgoingLight += envColor.xyz * specularStrength * reflectivity;
#endif
#endif
`,Bo=`
#ifdef USE_ENVMAP
uniform float envMapIntensity;
uniform float flipEnvMap;
uniform mat3 envMapRotation;
#ifdef ENVMAP_TYPE_CUBE
uniform samplerCube envMap;
#else
uniform sampler2D envMap;
#endif
#endif
`,Go=`
#ifdef USE_ENVMAP
uniform float reflectivity;
#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
#define ENV_WORLDPOS
#endif
#ifdef ENV_WORLDPOS
varying vec3 vWorldPosition;
uniform float refractionRatio;
#else
varying vec3 vReflect;
#endif
#endif
`,Ho=`
#ifdef USE_ENVMAP
#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
#define ENV_WORLDPOS
#endif
#ifdef ENV_WORLDPOS
varying vec3 vWorldPosition;
#else
varying vec3 vReflect;
uniform float refractionRatio;
#endif
#endif
`,Vo=`
#ifdef USE_ENVMAP
#ifdef ENV_WORLDPOS
vWorldPosition = worldPosition.xyz;
#else
vec3 cameraToVertex;
if ( isOrthographic ) {
cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
} else {
cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
}
vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
#ifdef ENVMAP_MODE_REFLECTION
vReflect = reflect( cameraToVertex, worldNormal );
#else
vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
#endif
#endif
#endif
`,ko=`
#ifdef USE_FOG
vFogDepth = - mvPosition.z;
#endif
`,Wo=`
#ifdef USE_FOG
varying float vFogDepth;
#endif
`,zo=`
#ifdef USE_FOG
#ifdef FOG_EXP2
float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
#else
float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
#endif
gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif
`,Xo=`
#ifdef USE_FOG
uniform vec3 fogColor;
varying float vFogDepth;
#ifdef FOG_EXP2
uniform float fogDensity;
#else
uniform float fogNear;
uniform float fogFar;
#endif
#endif
`,Yo=`
#ifdef USE_GRADIENTMAP
uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
float dotNL = dot( normal, lightDirection );
vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
#ifdef USE_GRADIENTMAP
return vec3( texture2D( gradientMap, coord ).r );
#else
vec2 fw = fwidth( coord ) * 0.5;
return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
#endif
}
`,qo=`
#ifdef USE_LIGHTMAP
uniform sampler2D lightMap;
uniform float lightMapIntensity;
#endif
`,Ko=`
LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;
`,$o=`
varying vec3 vViewPosition;
struct LambertMaterial {
vec3 diffuseColor;
float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
vec3 irradiance = dotNL * directLight.color;
reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert
`,Zo=`
uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
float x = normal.x, y = normal.y, z = normal.z;
vec3 result = shCoefficients[ 0 ] * 0.886227;
result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
vec3 irradiance = ambientLightColor;
return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
if ( cutoffDistance > 0.0 ) {
distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
}
return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
struct DirectionalLight {
vec3 direction;
vec3 color;
};
uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
light.color = directionalLight.color;
light.direction = directionalLight.direction;
light.visible = true;
}
#endif
#if NUM_POINT_LIGHTS > 0
struct PointLight {
vec3 position;
vec3 color;
float distance;
float decay;
};
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
vec3 lVector = pointLight.position - geometryPosition;
light.direction = normalize( lVector );
float lightDistance = length( lVector );
light.color = pointLight.color;
light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
light.visible = ( light.color != vec3( 0.0 ) );
}
#endif
#if NUM_SPOT_LIGHTS > 0
struct SpotLight {
vec3 position;
vec3 direction;
vec3 color;
float distance;
float decay;
float coneCos;
float penumbraCos;
};
uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
vec3 lVector = spotLight.position - geometryPosition;
light.direction = normalize( lVector );
float angleCos = dot( light.direction, spotLight.direction );
float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
if ( spotAttenuation > 0.0 ) {
float lightDistance = length( lVector );
light.color = spotLight.color * spotAttenuation;
light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
light.visible = ( light.color != vec3( 0.0 ) );
} else {
light.color = vec3( 0.0 );
light.visible = false;
}
}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
struct RectAreaLight {
vec3 color;
vec3 position;
vec3 halfWidth;
vec3 halfHeight;
};
uniform sampler2D ltc_1; // RGBA Float
uniform sampler2D ltc_2; // RGBA Float
uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
struct HemisphereLight {
vec3 direction;
vec3 skyColor;
vec3 groundColor;
};
uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
float dotNL = dot( normal, hemiLight.direction );
float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
return irradiance;
}
#endif
`,Qo=`
#ifdef USE_ENVMAP
vec3 getIBLIrradiance( const in vec3 normal ) {
#ifdef ENVMAP_TYPE_CUBE_UV
vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
return PI * envMapColor.rgb * envMapIntensity;
#else
return vec3( 0.0 );
#endif
}
vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
#ifdef ENVMAP_TYPE_CUBE_UV
vec3 reflectVec = reflect( - viewDir, normal );
reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
return envMapColor.rgb * envMapIntensity;
#else
return vec3( 0.0 );
#endif
}
#ifdef USE_ANISOTROPY
vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
#ifdef ENVMAP_TYPE_CUBE_UV
vec3 bentNormal = cross( bitangent, viewDir );
bentNormal = normalize( cross( bentNormal, bitangent ) );
bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
return getIBLRadiance( viewDir, bentNormal, roughness );
#else
return vec3( 0.0 );
#endif
}
#endif
#endif
`,Jo=`
ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;
`,jo=`
varying vec3 vViewPosition;
struct ToonMaterial {
vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon
`,es=`
BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;
`,ts=`
varying vec3 vViewPosition;
struct BlinnPhongMaterial {
vec3 diffuseColor;
vec3 specularColor;
float specularShininess;
float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
vec3 irradiance = dotNL * directLight.color;
reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
`,ns=`
PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );// 0.0525 corresponds to the base mip of a 256 cubemap.
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
material.ior = ior;
#ifdef USE_SPECULAR
float specularIntensityFactor = specularIntensity;
vec3 specularColorFactor = specularColor;
#ifdef USE_SPECULAR_COLORMAP
specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
#endif
material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
#else
float specularIntensityFactor = 1.0;
vec3 specularColorFactor = vec3( 1.0 );
material.specularF90 = 1.0;
#endif
material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
material.clearcoat = clearcoat;
material.clearcoatRoughness = clearcoatRoughness;
material.clearcoatF0 = vec3( 0.04 );
material.clearcoatF90 = 1.0;
#ifdef USE_CLEARCOATMAP
material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
#endif
material.clearcoat = saturate( material.clearcoat ); // Burley clearcoat model
material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
material.clearcoatRoughness += geometryRoughness;
material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
material.iridescence = iridescence;
material.iridescenceIOR = iridescenceIOR;
#ifdef USE_IRIDESCENCEMAP
material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
#else
material.iridescenceThickness = iridescenceThicknessMaximum;
#endif
#endif
#ifdef USE_SHEEN
material.sheenColor = sheenColor;
#ifdef USE_SHEEN_COLORMAP
material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
#endif
material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
#ifdef USE_SHEEN_ROUGHNESSMAP
material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
#endif
#endif
#ifdef USE_ANISOTROPY
#ifdef USE_ANISOTROPYMAP
mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
#else
vec2 anisotropyV = anisotropyVector;
#endif
material.anisotropy = length( anisotropyV );
if( material.anisotropy == 0.0 ) {
anisotropyV = vec2( 1.0, 0.0 );
} else {
anisotropyV /= material.anisotropy;
material.anisotropy = saturate( material.anisotropy );
}
material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif
`,is=`
struct PhysicalMaterial {
vec3 diffuseColor;
float roughness;
vec3 specularColor;
float specularF90;
float dispersion;
#ifdef USE_CLEARCOAT
float clearcoat;
float clearcoatRoughness;
vec3 clearcoatF0;
float clearcoatF90;
#endif
#ifdef USE_IRIDESCENCE
float iridescence;
float iridescenceIOR;
float iridescenceThickness;
vec3 iridescenceFresnel;
vec3 iridescenceF0;
#endif
#ifdef USE_SHEEN
vec3 sheenColor;
float sheenRoughness;
#endif
#ifdef IOR
float ior;
#endif
#ifdef USE_TRANSMISSION
float transmission;
float transmissionAlpha;
float thickness;
float attenuationDistance;
vec3 attenuationColor;
#endif
#ifdef USE_ANISOTROPY
float anisotropy;
float alphaT;
vec3 anisotropyT;
vec3 anisotropyB;
#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
float x2 = x * x;
float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
float a2 = pow2( alpha );
float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
float a2 = pow2( alpha );
float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1
return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
float v = 0.5 / ( gv + gl );
return saturate(v);
}
float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
float a2 = alphaT * alphaB;
highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
highp float v2 = dot( v, v );
float w2 = a2 / v2;
return RECIPROCAL_PI * a2 * pow2 ( w2 );
}
#endif
#ifdef USE_CLEARCOAT
vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
vec3 f0 = material.clearcoatF0;
float f90 = material.clearcoatF90;
float roughness = material.clearcoatRoughness;
float alpha = pow2( roughness ); // UE4's roughness
vec3 halfDir = normalize( lightDir + viewDir );
float dotNL = saturate( dot( normal, lightDir ) );
float dotNV = saturate( dot( normal, viewDir ) );
float dotNH = saturate( dot( normal, halfDir ) );
float dotVH = saturate( dot( viewDir, halfDir ) );
vec3 F = F_Schlick( f0, f90, dotVH );
float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
float D = D_GGX( alpha, dotNH );
return F * ( V * D );
}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
vec3 f0 = material.specularColor;
float f90 = material.specularF90;
float roughness = material.roughness;
float alpha = pow2( roughness ); // UE4's roughness
vec3 halfDir = normalize( lightDir + viewDir );
float dotNL = saturate( dot( normal, lightDir ) );
float dotNV = saturate( dot( normal, viewDir ) );
float dotNH = saturate( dot( normal, halfDir ) );
float dotVH = saturate( dot( viewDir, halfDir ) );
vec3 F = F_Schlick( f0, f90, dotVH );
#ifdef USE_IRIDESCENCE
F = mix( F, material.iridescenceFresnel, material.iridescence );
#endif
#ifdef USE_ANISOTROPY
float dotTL = dot( material.anisotropyT, lightDir );
float dotTV = dot( material.anisotropyT, viewDir );
float dotTH = dot( material.anisotropyT, halfDir );
float dotBL = dot( material.anisotropyB, lightDir );
float dotBV = dot( material.anisotropyB, viewDir );
float dotBH = dot( material.anisotropyB, halfDir );
float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
#else
float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
float D = D_GGX( alpha, dotNH );
#endif
return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
const float LUT_SIZE = 64.0;
const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
const float LUT_BIAS = 0.5 / LUT_SIZE;
float dotNV = saturate( dot( N, V ) );
vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
uv = uv * LUT_SCALE + LUT_BIAS;
return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
float l = length( f );
return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
float x = dot( v1, v2 );
float y = abs( x );
float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
float b = 3.4175940 + ( 4.1616724 + y ) * y;
float v = a / b;
float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
vec3 lightNormal = cross( v1, v2 );
if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
vec3 T1, T2;
T1 = normalize( V - N * dot( V, N ) );
T2 = - cross( N, T1 ); // negated from paper; possibly due to a different handedness of world coordinate system
mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
vec3 coords[ 4 ];
coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
coords[ 0 ] = normalize( coords[ 0 ] );
coords[ 1 ] = normalize( coords[ 1 ] );
coords[ 2 ] = normalize( coords[ 2 ] );
coords[ 3 ] = normalize( coords[ 3 ] );
vec3 vectorFormFactor = vec3( 0.0 );
vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
float alpha = pow2( roughness );
float invAlpha = 1.0 / alpha;
float cos2h = dotNH * dotNH;
float sin2h = max( 1.0 - cos2h, 0.0078125 ); // 2^(-14/2), so sin2h^2 > 0 in fp16
return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
vec3 halfDir = normalize( lightDir + viewDir );
float dotNL = saturate( dot( normal, lightDir ) );
float dotNV = saturate( dot( normal, viewDir ) );
float dotNH = saturate( dot( normal, halfDir ) );
float D = D_Charlie( sheenRoughness, dotNH );
float V = V_Neubelt( dotNV, dotNL );
return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
float dotNV = saturate( dot( normal, viewDir ) );
float r2 = roughness * roughness;
float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
float dotNV = saturate( dot( normal, viewDir ) );
const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
vec4 r = roughness * c0 + c1;
float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
vec2 fab = DFGApprox( normal, viewDir, roughness );
return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
vec2 fab = DFGApprox( normal, viewDir, roughness );
#ifdef USE_IRIDESCENCE
vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
#else
vec3 Fr = specularColor;
#endif
vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
float Ess = fab.x + fab.y;
float Ems = 1.0 - Ess;
vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619; // 1/21
vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
singleScatter += FssEss;
multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
vec3 normal = geometryNormal;
vec3 viewDir = geometryViewDir;
vec3 position = geometryPosition;
vec3 lightPos = rectAreaLight.position;
vec3 halfWidth = rectAreaLight.halfWidth;
vec3 halfHeight = rectAreaLight.halfHeight;
vec3 lightColor = rectAreaLight.color;
float roughness = material.roughness;
vec3 rectCoords[ 4 ];
rectCoords[ 0 ] = lightPos + halfWidth - halfHeight; // counterclockwise; light shines in local neg z direction
rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
vec2 uv = LTC_Uv( normal, viewDir, roughness );
vec4 t1 = texture2D( ltc_1, uv );
vec4 t2 = texture2D( ltc_2, uv );
mat3 mInv = mat3(
vec3( t1.x, 0, t1.y ),
vec3(    0, 1,    0 ),
vec3( t1.z, 0, t1.w )
);
vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
vec3 irradiance = dotNL * directLight.color;
#ifdef USE_CLEARCOAT
float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
vec3 ccIrradiance = dotNLcc * directLight.color;
clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
#endif
#ifdef USE_SHEEN
sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
#endif
reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
#ifdef USE_CLEARCOAT
clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
#endif
#ifdef USE_SHEEN
sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
#endif
vec3 singleScattering = vec3( 0.0 );
vec3 multiScattering = vec3( 0.0 );
vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
#ifdef USE_IRIDESCENCE
computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
#else
computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
#endif
vec3 totalScattering = singleScattering + multiScattering;
vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
reflectedLight.indirectSpecular += radiance * singleScattering;
reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}
`,rs=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
float dotNVi = saturate( dot( normal, geometryViewDir ) );
if ( material.iridescenceThickness == 0.0 ) {
material.iridescence = 0.0;
} else {
material.iridescence = saturate( material.iridescence );
}
if ( material.iridescence > 0.0 ) {
material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
PointLight pointLight;
#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
PointLightShadow pointLightShadow;
#endif
#pragma unroll_loop_start
for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
pointLight = pointLights[ i ];
getPointLightInfo( pointLight, geometryPosition, directLight );
#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
pointLightShadow = pointLightShadows[ i ];
directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
#endif
RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
}
#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
SpotLight spotLight;
vec4 spotColor;
vec3 spotLightCoord;
bool inSpotLightMap;
#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
SpotLightShadow spotLightShadow;
#endif
#pragma unroll_loop_start
for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
spotLight = spotLights[ i ];
getSpotLightInfo( spotLight, geometryPosition, directLight );
#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
#else
#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
#endif
#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
#endif
#undef SPOT_LIGHT_MAP_INDEX
#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
spotLightShadow = spotLightShadows[ i ];
directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
#endif
RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
}
#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
DirectionalLight directionalLight;
#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
DirectionalLightShadow directionalLightShadow;
#endif
#pragma unroll_loop_start
for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
directionalLight = directionalLights[ i ];
getDirectionalLightInfo( directionalLight, directLight );
#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
directionalLightShadow = directionalLightShadows[ i ];
directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
#endif
RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
}
#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
RectAreaLight rectAreaLight;
#pragma unroll_loop_start
for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
rectAreaLight = rectAreaLights[ i ];
RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
}
#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
vec3 iblIrradiance = vec3( 0.0 );
vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
#if defined( USE_LIGHT_PROBES )
irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
#endif
#if ( NUM_HEMI_LIGHTS > 0 )
#pragma unroll_loop_start
for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
}
#pragma unroll_loop_end
#endif
#endif
#if defined( RE_IndirectSpecular )
vec3 radiance = vec3( 0.0 );
vec3 clearcoatRadiance = vec3( 0.0 );
#endif
`,as=`
#if defined( RE_IndirectDiffuse )
#ifdef USE_LIGHTMAP
vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
irradiance += lightMapIrradiance;
#endif
#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
iblIrradiance += getIBLIrradiance( geometryNormal );
#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
#ifdef USE_ANISOTROPY
radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
#else
radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
#endif
#ifdef USE_CLEARCOAT
clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
#endif
#endif
`,os=`
#if defined( RE_IndirectDiffuse )
RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
`,ss=`
#if defined( USE_LOGDEPTHBUF )
gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif
`,cs=`
#if defined( USE_LOGDEPTHBUF )
uniform float logDepthBufFC;
varying float vFragDepth;
varying float vIsPerspective;
#endif
`,ls=`
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
varying float vIsPerspective;
#endif
`,fs=`
#ifdef USE_LOGDEPTHBUF
vFragDepth = 1.0 + gl_Position.w;
vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif
`,ds=`
#ifdef USE_MAP
vec4 sampledDiffuseColor = texture2D( map, vMapUv );
#ifdef DECODE_VIDEO_TEXTURE
sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
#endif
diffuseColor *= sampledDiffuseColor;
#endif
`,us=`
#ifdef USE_MAP
uniform sampler2D map;
#endif
`,ps=`
#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
#if defined( USE_POINTS_UV )
vec2 uv = vUv;
#else
vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#endif
#ifdef USE_MAP
diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif
`,hs=`
#if defined( USE_POINTS_UV )
varying vec2 vUv;
#else
#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
uniform mat3 uvTransform;
#endif
#endif
#ifdef USE_MAP
uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
uniform sampler2D alphaMap;
#endif
`,ms=`
float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
metalnessFactor *= texelMetalness.b;
#endif
`,_s=`
#ifdef USE_METALNESSMAP
uniform sampler2D metalnessMap;
#endif
`,gs=`
#ifdef USE_INSTANCING_MORPH
float morphTargetInfluences[ MORPHTARGETS_COUNT ];
float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
}
#endif
`,vs=`
#if defined( USE_MORPHCOLORS )
vColor *= morphTargetBaseInfluence;
for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
#if defined( USE_COLOR_ALPHA )
if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
#elif defined( USE_COLOR )
if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
#endif
}
#endif
`,Es=`
#ifdef USE_MORPHNORMALS
objectNormal *= morphTargetBaseInfluence;
for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
}
#endif
`,Ss=`
#ifdef USE_MORPHTARGETS
#ifndef USE_INSTANCING_MORPH
uniform float morphTargetBaseInfluence;
uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
#endif
uniform sampler2DArray morphTargetsTexture;
uniform ivec2 morphTargetsTextureSize;
vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
int y = texelIndex / morphTargetsTextureSize.x;
int x = texelIndex - y * morphTargetsTextureSize.x;
ivec3 morphUV = ivec3( x, y, morphTargetIndex );
return texelFetch( morphTargetsTexture, morphUV, 0 );
}
#endif
`,Ms=`
#ifdef USE_MORPHTARGETS
transformed *= morphTargetBaseInfluence;
for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
}
#endif
`,Ts=`
float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
vec3 fdx = dFdx( vViewPosition );
vec3 fdy = dFdy( vViewPosition );
vec3 normal = normalize( cross( fdx, fdy ) );
#else
vec3 normal = normalize( vNormal );
#ifdef DOUBLE_SIDED
normal *= faceDirection;
#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
#ifdef USE_TANGENT
mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
#else
mat3 tbn = getTangentFrame( - vViewPosition, normal,
#if defined( USE_NORMALMAP )
vNormalMapUv
#elif defined( USE_CLEARCOAT_NORMALMAP )
vClearcoatNormalMapUv
#else
vUv
#endif
);
#endif
#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
tbn[0] *= faceDirection;
tbn[1] *= faceDirection;
#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
#ifdef USE_TANGENT
mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
#else
mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
#endif
#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
tbn2[0] *= faceDirection;
tbn2[1] *= faceDirection;
#endif
#endif
vec3 nonPerturbedNormal = normal;
`,xs=`
#ifdef USE_NORMALMAP_OBJECTSPACE
normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals
#ifdef FLIP_SIDED
normal = - normal;
#endif
#ifdef DOUBLE_SIDED
normal = normal * faceDirection;
#endif
normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
mapN.xy *= normalScale;
normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif
`,As=`
#ifndef FLAT_SHADED
varying vec3 vNormal;
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
`,Rs=`
#ifndef FLAT_SHADED
varying vec3 vNormal;
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
`,Cs=`
#ifndef FLAT_SHADED // normal is computed with derivatives when FLAT_SHADED
vNormal = normalize( transformedNormal );
#ifdef USE_TANGENT
vTangent = normalize( transformedTangent );
vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
#endif
#endif
`,bs=`
#ifdef USE_NORMALMAP
uniform sampler2D normalMap;
uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
vec3 q0 = dFdx( eye_pos.xyz );
vec3 q1 = dFdy( eye_pos.xyz );
vec2 st0 = dFdx( uv.st );
vec2 st1 = dFdy( uv.st );
vec3 N = surf_norm; // normalized
vec3 q1perp = cross( q1, N );
vec3 q0perp = cross( N, q0 );
vec3 T = q1perp * st0.x + q0perp * st1.x;
vec3 B = q1perp * st0.y + q0perp * st1.y;
float det = max( dot( T, T ), dot( B, B ) );
float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
return mat3( T * scale, B * scale, N );
}
#endif
`,Ps=`
#ifdef USE_CLEARCOAT
vec3 clearcoatNormal = nonPerturbedNormal;
#endif
`,Ls=`
#ifdef USE_CLEARCOAT_NORMALMAP
vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
clearcoatMapN.xy *= clearcoatNormalScale;
clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif
`,Us=`
#ifdef USE_CLEARCOATMAP
uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
uniform sampler2D clearcoatNormalMap;
uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
uniform sampler2D clearcoatRoughnessMap;
#endif
`,Ds=`
#ifdef USE_IRIDESCENCEMAP
uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
uniform sampler2D iridescenceThicknessMap;
#endif
`,ws=`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`,Is=`
vec3 packNormalToRGB( const in vec3 normal ) {
return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)
const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
if( v <= 0.0 )
return vec4( 0., 0., 0., 0. );
if( v >= 1.0 )
return vec4( 1., 1., 1., 1. );
float vuf;
float af = modf( v * PackFactors.a, vuf );
float bf = modf( vuf * ShiftRight8, vuf );
float gf = modf( vuf * ShiftRight8, vuf );
return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
if( v <= 0.0 )
return vec3( 0., 0., 0. );
if( v >= 1.0 )
return vec3( 1., 1., 1. );
float vuf;
float bf = modf( v * PackFactors.b, vuf );
float gf = modf( vuf * ShiftRight8, vuf );
return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
if( v <= 0.0 )
return vec2( 0., 0. );
if( v >= 1.0 )
return vec2( 1., 1. );
float vuf;
float gf = modf( v * 256., vuf );
return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
return ( near * far ) / ( ( far - near ) * depth - far );
}
`,ys=`
#ifdef PREMULTIPLIED_ALPHA
gl_FragColor.rgb *= gl_FragColor.a;
#endif
`,Ns=`
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;
`,Os=`
#ifdef DITHERING
gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif
`,Fs=`
#ifdef DITHERING
vec3 dithering( vec3 color ) {
float grid_position = rand( gl_FragCoord.xy );
vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
return color + dither_shift_RGB;
}
#endif
`,Bs=`
float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
roughnessFactor *= texelRoughness.g;
#endif
`,Gs=`
#ifdef USE_ROUGHNESSMAP
uniform sampler2D roughnessMap;
#endif
`,Hs=`
#if NUM_SPOT_LIGHT_COORDS > 0
varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
#if NUM_DIR_LIGHT_SHADOWS > 0
uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
struct DirectionalLightShadow {
float shadowIntensity;
float shadowBias;
float shadowNormalBias;
float shadowRadius;
vec2 shadowMapSize;
};
uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
#endif
#if NUM_SPOT_LIGHT_SHADOWS > 0
uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
struct SpotLightShadow {
float shadowIntensity;
float shadowBias;
float shadowNormalBias;
float shadowRadius;
vec2 shadowMapSize;
};
uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
#endif
#if NUM_POINT_LIGHT_SHADOWS > 0
uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
struct PointLightShadow {
float shadowIntensity;
float shadowBias;
float shadowNormalBias;
float shadowRadius;
vec2 shadowMapSize;
float shadowCameraNear;
float shadowCameraFar;
};
uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
#endif
float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
}
vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
return unpackRGBATo2Half( texture2D( shadow, uv ) );
}
float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
float occlusion = 1.0;
vec2 distribution = texture2DDistribution( shadow, uv );
float hard_shadow = step( compare , distribution.x ); // Hard Shadow
if (hard_shadow != 1.0 ) {
float distance = compare - distribution.x ;
float variance = max( 0.00000, distribution.y * distribution.y );
float softness_probability = variance / (variance + distance * distance ); // Chebeyshevs inequality
softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 ); // 0.3 reduces light bleed
occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
}
return occlusion;
}
float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
float shadow = 1.0;
shadowCoord.xyz /= shadowCoord.w;
shadowCoord.z += shadowBias;
bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
if ( frustumTest ) {
#if defined( SHADOWMAP_TYPE_PCF )
vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
float dx0 = - texelSize.x * shadowRadius;
float dy0 = - texelSize.y * shadowRadius;
float dx1 = + texelSize.x * shadowRadius;
float dy1 = + texelSize.y * shadowRadius;
float dx2 = dx0 / 2.0;
float dy2 = dy0 / 2.0;
float dx3 = dx1 / 2.0;
float dy3 = dy1 / 2.0;
shadow = (
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
) * ( 1.0 / 17.0 );
#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
float dx = texelSize.x;
float dy = texelSize.y;
vec2 uv = shadowCoord.xy;
vec2 f = fract( uv * shadowMapSize + 0.5 );
uv -= f * texelSize;
shadow = (
texture2DCompare( shadowMap, uv, shadowCoord.z ) +
texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
f.x ) +
mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
f.x ) +
mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
f.y ) +
mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
f.y ) +
mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
f.x ),
mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
f.x ),
f.y )
) * ( 1.0 / 9.0 );
#elif defined( SHADOWMAP_TYPE_VSM )
shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
#else // no percentage-closer filtering:
shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
#endif
}
return mix( 1.0, shadow, shadowIntensity );
}
vec2 cubeToUV( vec3 v, float texelSizeY ) {
vec3 absV = abs( v );
float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
absV *= scaleToCube;
v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
vec2 planar = v.xy;
float almostATexel = 1.5 * texelSizeY;
float almostOne = 1.0 - almostATexel;
if ( absV.z >= almostOne ) {
if ( v.z > 0.0 )
planar.x = 4.0 - v.x;
} else if ( absV.x >= almostOne ) {
float signX = sign( v.x );
planar.x = v.z * signX + 2.0 * signX;
} else if ( absV.y >= almostOne ) {
float signY = sign( v.y );
planar.x = v.x + 2.0 * signY + 2.0;
planar.y = v.z * signY - 2.0;
}
return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
}
float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
float shadow = 1.0;
vec3 lightToPosition = shadowCoord.xyz;
float lightToPositionLength = length( lightToPosition );
if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?
dp += shadowBias;
vec3 bd3D = normalize( lightToPosition );
vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
shadow = (
texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
) * ( 1.0 / 9.0 );
#else // no percentage-closer filtering
shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
#endif
}
return mix( 1.0, shadow, shadowIntensity );
}
#endif
`,Vs=`
#if NUM_SPOT_LIGHT_COORDS > 0
uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
#if NUM_DIR_LIGHT_SHADOWS > 0
uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
struct DirectionalLightShadow {
float shadowIntensity;
float shadowBias;
float shadowNormalBias;
float shadowRadius;
vec2 shadowMapSize;
};
uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
#endif
#if NUM_SPOT_LIGHT_SHADOWS > 0
struct SpotLightShadow {
float shadowIntensity;
float shadowBias;
float shadowNormalBias;
float shadowRadius;
vec2 shadowMapSize;
};
uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
#endif
#if NUM_POINT_LIGHT_SHADOWS > 0
uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
struct PointLightShadow {
float shadowIntensity;
float shadowBias;
float shadowNormalBias;
float shadowRadius;
vec2 shadowMapSize;
float shadowCameraNear;
float shadowCameraFar;
};
uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
#endif
#endif
`,ks=`
#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
#if NUM_DIR_LIGHT_SHADOWS > 0
#pragma unroll_loop_start
for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
}
#pragma unroll_loop_end
#endif
#if NUM_POINT_LIGHT_SHADOWS > 0
#pragma unroll_loop_start
for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
}
#pragma unroll_loop_end
#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
#pragma unroll_loop_start
for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
shadowWorldPosition = worldPosition;
#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
#endif
vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
}
#pragma unroll_loop_end
#endif
`,Ws=`
float getShadowMask() {
float shadow = 1.0;
#ifdef USE_SHADOWMAP
#if NUM_DIR_LIGHT_SHADOWS > 0
DirectionalLightShadow directionalLight;
#pragma unroll_loop_start
for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
directionalLight = directionalLightShadows[ i ];
shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
}
#pragma unroll_loop_end
#endif
#if NUM_SPOT_LIGHT_SHADOWS > 0
SpotLightShadow spotLight;
#pragma unroll_loop_start
for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
spotLight = spotLightShadows[ i ];
shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
}
#pragma unroll_loop_end
#endif
#if NUM_POINT_LIGHT_SHADOWS > 0
PointLightShadow pointLight;
#pragma unroll_loop_start
for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
pointLight = pointLightShadows[ i ];
shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
}
#pragma unroll_loop_end
#endif
#endif
return shadow;
}
`,zs=`
#ifdef USE_SKINNING
mat4 boneMatX = getBoneMatrix( skinIndex.x );
mat4 boneMatY = getBoneMatrix( skinIndex.y );
mat4 boneMatZ = getBoneMatrix( skinIndex.z );
mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif
`,Xs=`
#ifdef USE_SKINNING
uniform mat4 bindMatrix;
uniform mat4 bindMatrixInverse;
uniform highp sampler2D boneTexture;
mat4 getBoneMatrix( const in float i ) {
int size = textureSize( boneTexture, 0 ).x;
int j = int( i ) * 4;
int x = j % size;
int y = j / size;
vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
return mat4( v1, v2, v3, v4 );
}
#endif
`,Ys=`
#ifdef USE_SKINNING
vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
vec4 skinned = vec4( 0.0 );
skinned += boneMatX * skinVertex * skinWeight.x;
skinned += boneMatY * skinVertex * skinWeight.y;
skinned += boneMatZ * skinVertex * skinWeight.z;
skinned += boneMatW * skinVertex * skinWeight.w;
transformed = ( bindMatrixInverse * skinned ).xyz;
#endif
`,qs=`
#ifdef USE_SKINNING
mat4 skinMatrix = mat4( 0.0 );
skinMatrix += skinWeight.x * boneMatX;
skinMatrix += skinWeight.y * boneMatY;
skinMatrix += skinWeight.z * boneMatZ;
skinMatrix += skinWeight.w * boneMatW;
skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
#ifdef USE_TANGENT
objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
#endif
#endif
`,Ks=`
float specularStrength;
#ifdef USE_SPECULARMAP
vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
specularStrength = texelSpecular.r;
#else
specularStrength = 1.0;
#endif
`,$s=`
#ifdef USE_SPECULARMAP
uniform sampler2D specularMap;
#endif
`,Zs=`
#if defined( TONE_MAPPING )
gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif
`,Qs=`
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
color *= toneMappingExposure;
return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
color *= toneMappingExposure;
color = max( vec3( 0.0 ), color - 0.004 );
return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
const mat3 ACESInputMat = mat3(
vec3( 0.59719, 0.07600, 0.02840 ), // transposed from source
vec3( 0.35458, 0.90834, 0.13383 ),
vec3( 0.04823, 0.01566, 0.83777 )
);
const mat3 ACESOutputMat = mat3(
vec3(  1.60475, -0.10208, -0.00327 ), // transposed from source
vec3( -0.53108,  1.10813, -0.07276 ),
vec3( -0.07367, -0.00605,  1.07602 )
);
color *= toneMappingExposure / 0.6;
color = ACESInputMat * color;
color = RRTAndODTFit( color );
color = ACESOutputMat * color;
return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
vec3( 1.6605, - 0.1246, - 0.0182 ),
vec3( - 0.5876, 1.1329, - 0.1006 ),
vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
vec3( 0.6274, 0.0691, 0.0164 ),
vec3( 0.3293, 0.9195, 0.0880 ),
vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
vec3 x2 = x * x;
vec3 x4 = x2 * x2;
return + 15.5 * x4 * x2
- 40.14 * x4 * x
+ 31.96 * x4
- 6.868 * x2 * x
+ 0.4298 * x2
+ 0.1191 * x
- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
const mat3 AgXInsetMatrix = mat3(
vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
);
const mat3 AgXOutsetMatrix = mat3(
vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
);
const float AgxMinEv = - 12.47393;  // log2( pow( 2, LOG2_MIN ) * MIDDLE_GRAY )
const float AgxMaxEv = 4.026069;    // log2( pow( 2, LOG2_MAX ) * MIDDLE_GRAY )
color *= toneMappingExposure;
color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
color = AgXInsetMatrix * color;
color = max( color, 1e-10 ); // avoid 0 or negative numbers for log2
color = log2( color );
color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
color = clamp( color, 0.0, 1.0 );
color = agxDefaultContrastApprox( color );
color = AgXOutsetMatrix * color;
color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
color = clamp( color, 0.0, 1.0 );
return color;
}
vec3 NeutralToneMapping( vec3 color ) {
const float StartCompression = 0.8 - 0.04;
const float Desaturation = 0.15;
color *= toneMappingExposure;
float x = min( color.r, min( color.g, color.b ) );
float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
color -= offset;
float peak = max( color.r, max( color.g, color.b ) );
if ( peak < StartCompression ) return color;
float d = 1. - StartCompression;
float newPeak = 1. - d * d / ( peak + d - StartCompression );
color *= newPeak / peak;
float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }
`,Js=`
#ifdef USE_TRANSMISSION
material.transmission = transmission;
material.transmissionAlpha = 1.0;
material.thickness = thickness;
material.attenuationDistance = attenuationDistance;
material.attenuationColor = attenuationColor;
#ifdef USE_TRANSMISSIONMAP
material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
#endif
#ifdef USE_THICKNESSMAP
material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
#endif
vec3 pos = vWorldPosition;
vec3 v = normalize( cameraPosition - pos );
vec3 n = inverseTransformDirection( normal, viewMatrix );
vec4 transmitted = getIBLVolumeRefraction(
n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
material.attenuationColor, material.attenuationDistance );
material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif
`,js=`
#ifdef USE_TRANSMISSION
uniform float transmission;
uniform float thickness;
uniform float attenuationDistance;
uniform vec3 attenuationColor;
#ifdef USE_TRANSMISSIONMAP
uniform sampler2D transmissionMap;
#endif
#ifdef USE_THICKNESSMAP
uniform sampler2D thicknessMap;
#endif
uniform vec2 transmissionSamplerSize;
uniform sampler2D transmissionSamplerMap;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
varying vec3 vWorldPosition;
float w0( float a ) {
return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
}
float w1( float a ) {
return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
}
float w2( float a ){
return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
}
float w3( float a ) {
return ( 1.0 / 6.0 ) * ( a * a * a );
}
float g0( float a ) {
return w0( a ) + w1( a );
}
float g1( float a ) {
return w2( a ) + w3( a );
}
float h0( float a ) {
return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
}
float h1( float a ) {
return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
}
vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
uv = uv * texelSize.zw + 0.5;
vec2 iuv = floor( uv );
vec2 fuv = fract( uv );
float g0x = g0( fuv.x );
float g1x = g1( fuv.x );
float h0x = h0( fuv.x );
float h1x = h1( fuv.x );
float h0y = h0( fuv.y );
float h1y = h1( fuv.y );
vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
}
vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
vec2 fLodSizeInv = 1.0 / fLodSize;
vec2 cLodSizeInv = 1.0 / cLodSize;
vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
return mix( fSample, cSample, fract( lod ) );
}
vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
vec3 modelScale;
modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
return normalize( refractionVector ) * thickness * modelScale;
}
float applyIorToRoughness( const in float roughness, const in float ior ) {
return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
}
vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
}
vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
if ( isinf( attenuationDistance ) ) {
return vec3( 1.0 );
} else {
vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
return transmittance;
}
}
vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
const in vec3 attenuationColor, const in float attenuationDistance ) {
vec4 transmittedLight;
vec3 transmittance;
#ifdef USE_DISPERSION
float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
for ( int i = 0; i < 3; i ++ ) {
vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
vec3 refractedRayExit = position + transmissionRay;
vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
vec2 refractionCoords = ndcPos.xy / ndcPos.w;
refractionCoords += 1.0;
refractionCoords /= 2.0;
vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
transmittedLight[ i ] = transmissionSample[ i ];
transmittedLight.a += transmissionSample.a;
transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
}
transmittedLight.a /= 3.0;
#else
vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
vec3 refractedRayExit = position + transmissionRay;
vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
vec2 refractionCoords = ndcPos.xy / ndcPos.w;
refractionCoords += 1.0;
refractionCoords /= 2.0;
transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
#endif
vec3 attenuatedColor = transmittance * transmittedLight.rgb;
vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
}
#endif
`,ec=`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )
varying vec2 vUv;
#endif
#ifdef USE_MAP
varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
uniform mat3 transmissionMapTransform;
varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
uniform mat3 thicknessMapTransform;
varying vec2 vThicknessMapUv;
#endif
`,tc=`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )
varying vec2 vUv;
#endif
#ifdef USE_MAP
uniform mat3 mapTransform;
varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
uniform mat3 alphaMapTransform;
varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
uniform mat3 lightMapTransform;
varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
uniform mat3 aoMapTransform;
varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
uniform mat3 bumpMapTransform;
varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
uniform mat3 normalMapTransform;
varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
uniform mat3 displacementMapTransform;
varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
uniform mat3 emissiveMapTransform;
varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
uniform mat3 metalnessMapTransform;
varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
uniform mat3 roughnessMapTransform;
varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
uniform mat3 anisotropyMapTransform;
varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
uniform mat3 clearcoatMapTransform;
varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
uniform mat3 clearcoatNormalMapTransform;
varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
uniform mat3 clearcoatRoughnessMapTransform;
varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
uniform mat3 sheenColorMapTransform;
varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
uniform mat3 sheenRoughnessMapTransform;
varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
uniform mat3 iridescenceMapTransform;
varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
uniform mat3 iridescenceThicknessMapTransform;
varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
uniform mat3 specularMapTransform;
varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
uniform mat3 specularColorMapTransform;
varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
uniform mat3 specularIntensityMapTransform;
varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
uniform mat3 transmissionMapTransform;
varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
uniform mat3 thicknessMapTransform;
varying vec2 vThicknessMapUv;
#endif
`,nc=`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )
vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif
`,ic=`
#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
vec4 worldPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
worldPosition = batchingMatrix * worldPosition;
#endif
#ifdef USE_INSTANCING
worldPosition = instanceMatrix * worldPosition;
#endif
worldPosition = modelMatrix * worldPosition;
#endif
`,rc=`
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
gl_Position = vec4( position.xy, 1.0, 1.0 );
}
`,ac=`
uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
vec4 texColor = texture2D( t2D, vUv );
#ifdef DECODE_VIDEO_TEXTURE
texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
#endif
texColor.rgb *= backgroundIntensity;
gl_FragColor = texColor;
#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`,oc=`
varying vec3 vWorldDirection;
#include <common>
void main() {
vWorldDirection = transformDirection( position, modelMatrix );
#include <begin_vertex>
#include <project_vertex>
gl_Position.z = gl_Position.w; // set z to camera.far
}
`,sc=`
#ifdef ENVMAP_TYPE_CUBE
uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
#ifdef ENVMAP_TYPE_CUBE
vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
#elif defined( ENVMAP_TYPE_CUBE_UV )
vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
#else
vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
#endif
texColor.rgb *= backgroundIntensity;
gl_FragColor = texColor;
#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`,cc=`
varying vec3 vWorldDirection;
#include <common>
void main() {
vWorldDirection = transformDirection( position, modelMatrix );
#include <begin_vertex>
#include <project_vertex>
gl_Position.z = gl_Position.w; // set z to camera.far
}
`,lc=`
uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
gl_FragColor = texColor;
gl_FragColor.a *= opacity;
#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`,fc=`
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
#include <uv_vertex>
#include <batching_vertex>
#include <skinbase_vertex>
#include <morphinstance_vertex>
#ifdef USE_DISPLACEMENTMAP
#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinnormal_vertex>
#endif
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <displacementmap_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
vHighPrecisionZW = gl_Position.zw;
}
`,dc=`
#if DEPTH_PACKING == 3200
uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
vec4 diffuseColor = vec4( 1.0 );
#include <clipping_planes_fragment>
#if DEPTH_PACKING == 3200
diffuseColor.a = opacity;
#endif
#include <map_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
#include <logdepthbuf_fragment>
float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
#if DEPTH_PACKING == 3200
gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
#elif DEPTH_PACKING == 3201
gl_FragColor = packDepthToRGBA( fragCoordZ );
#elif DEPTH_PACKING == 3202
gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
#elif DEPTH_PACKING == 3203
gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
#endif
}
`,uc=`
#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
#include <uv_vertex>
#include <batching_vertex>
#include <skinbase_vertex>
#include <morphinstance_vertex>
#ifdef USE_DISPLACEMENTMAP
#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinnormal_vertex>
#endif
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <displacementmap_vertex>
#include <project_vertex>
#include <worldpos_vertex>
#include <clipping_planes_vertex>
vWorldPosition = worldPosition.xyz;
}
`,pc=`
#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
vec4 diffuseColor = vec4( 1.0 );
#include <clipping_planes_fragment>
#include <map_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
float dist = length( vWorldPosition - referencePosition );
dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
dist = saturate( dist ); // clamp to [ 0, 1 ]
gl_FragColor = packDepthToRGBA( dist );
}
`,hc=`
varying vec3 vWorldDirection;
#include <common>
void main() {
vWorldDirection = transformDirection( position, modelMatrix );
#include <begin_vertex>
#include <project_vertex>
}
`,mc=`
uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
vec3 direction = normalize( vWorldDirection );
vec2 sampleUV = equirectUv( direction );
gl_FragColor = texture2D( tEquirect, sampleUV );
#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`,_c=`
uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
vLineDistance = scale * lineDistance;
#include <uv_vertex>
#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
#include <fog_vertex>
}
`,gc=`
uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>
if ( mod( vLineDistance, totalSize ) > dashSize ) {
discard;
}
vec3 outgoingLight = vec3( 0.0 );
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
outgoingLight = diffuseColor.rgb; // simple shader
#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
}
`,vc=`
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
#include <uv_vertex>
#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <batching_vertex>
#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <defaultnormal_vertex>
#endif
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
#include <worldpos_vertex>
#include <envmap_vertex>
#include <fog_vertex>
}
`,Ec=`
uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
#include <specularmap_fragment>
ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
#ifdef USE_LIGHTMAP
vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
#else
reflectedLight.indirectDiffuse += vec3( 1.0 );
#endif
#include <aomap_fragment>
reflectedLight.indirectDiffuse *= diffuseColor.rgb;
vec3 outgoingLight = reflectedLight.indirectDiffuse;
#include <envmap_fragment>
#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}
`,Sc=`
#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
#include <uv_vertex>
#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <batching_vertex>
#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <defaultnormal_vertex>
#include <normal_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <displacementmap_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
vViewPosition = - mvPosition.xyz;
#include <worldpos_vertex>
#include <envmap_vertex>
#include <shadowmap_vertex>
#include <fog_vertex>
}
`,Mc=`
#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>
ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
vec3 totalEmissiveRadiance = emissive;
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
#include <specularmap_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
#include <emissivemap_fragment>
#include <lights_lambert_fragment>
#include <lights_fragment_begin>
#include <lights_fragment_maps>
#include <lights_fragment_end>
#include <aomap_fragment>
vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
#include <envmap_fragment>
#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}
`,Tc=`
#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
#include <uv_vertex>
#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <batching_vertex>
#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <defaultnormal_vertex>
#include <normal_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <displacementmap_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
#include <fog_vertex>
vViewPosition = - mvPosition.xyz;
}
`,xc=`
#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
vec3 viewDir = normalize( vViewPosition );
vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
vec3 y = cross( viewDir, x );
vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks
#ifdef USE_MATCAP
vec4 matcapColor = texture2D( matcap, uv );
#else
vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 ); // default if matcap is missing
#endif
vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}
`,Ac=`
#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
#include <uv_vertex>
#include <batching_vertex>
#include <beginnormal_vertex>
#include <morphinstance_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <defaultnormal_vertex>
#include <normal_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <displacementmap_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
vViewPosition = - mvPosition.xyz;
#endif
}
`,Rc=`
#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
#include <clipping_planes_fragment>
#include <logdepthbuf_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
#ifdef OPAQUE
gl_FragColor.a = 1.0;
#endif
}
`,Cc=`
#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
#include <uv_vertex>
#include <color_vertex>
#include <morphcolor_vertex>
#include <batching_vertex>
#include <beginnormal_vertex>
#include <morphinstance_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <defaultnormal_vertex>
#include <normal_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <displacementmap_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
vViewPosition = - mvPosition.xyz;
#include <worldpos_vertex>
#include <envmap_vertex>
#include <shadowmap_vertex>
#include <fog_vertex>
}
`,bc=`
#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>
ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
vec3 totalEmissiveRadiance = emissive;
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
#include <specularmap_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
#include <emissivemap_fragment>
#include <lights_phong_fragment>
#include <lights_fragment_begin>
#include <lights_fragment_maps>
#include <lights_fragment_end>
#include <aomap_fragment>
vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
#include <envmap_fragment>
#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}
`,Pc=`
#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
#include <uv_vertex>
#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <batching_vertex>
#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <defaultnormal_vertex>
#include <normal_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <displacementmap_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
vViewPosition = - mvPosition.xyz;
#include <worldpos_vertex>
#include <shadowmap_vertex>
#include <fog_vertex>
#ifdef USE_TRANSMISSION
vWorldPosition = worldPosition.xyz;
#endif
}
`,Lc=`
#define STANDARD
#ifdef PHYSICAL
#define IOR
#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
uniform float ior;
#endif
#ifdef USE_SPECULAR
uniform float specularIntensity;
uniform vec3 specularColor;
#ifdef USE_SPECULAR_COLORMAP
uniform sampler2D specularColorMap;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
uniform sampler2D specularIntensityMap;
#endif
#endif
#ifdef USE_CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
uniform float iridescence;
uniform float iridescenceIOR;
uniform float iridescenceThicknessMinimum;
uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
uniform vec3 sheenColor;
uniform float sheenRoughness;
#ifdef USE_SHEEN_COLORMAP
uniform sampler2D sheenColorMap;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
uniform sampler2D sheenRoughnessMap;
#endif
#endif
#ifdef USE_ANISOTROPY
uniform vec2 anisotropyVector;
#ifdef USE_ANISOTROPYMAP
uniform sampler2D anisotropyMap;
#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>
ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
vec3 totalEmissiveRadiance = emissive;
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
#include <roughnessmap_fragment>
#include <metalnessmap_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
#include <clearcoat_normal_fragment_begin>
#include <clearcoat_normal_fragment_maps>
#include <emissivemap_fragment>
#include <lights_physical_fragment>
#include <lights_fragment_begin>
#include <lights_fragment_maps>
#include <lights_fragment_end>
#include <aomap_fragment>
vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
#include <transmission_fragment>
vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
#ifdef USE_SHEEN
float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
#endif
#ifdef USE_CLEARCOAT
float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
#endif
#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}
`,Uc=`
#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
#include <uv_vertex>
#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <batching_vertex>
#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <defaultnormal_vertex>
#include <normal_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <displacementmap_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
vViewPosition = - mvPosition.xyz;
#include <worldpos_vertex>
#include <shadowmap_vertex>
#include <fog_vertex>
}
`,Dc=`
#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>
ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
vec3 totalEmissiveRadiance = emissive;
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
#include <emissivemap_fragment>
#include <lights_toon_fragment>
#include <lights_fragment_begin>
#include <lights_fragment_maps>
#include <lights_fragment_end>
#include <aomap_fragment>
vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}
`,wc=`
uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
varying vec2 vUv;
uniform mat3 uvTransform;
#endif
void main() {
#ifdef USE_POINTS_UV
vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif
#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <project_vertex>
gl_PointSize = size;
#ifdef USE_SIZEATTENUATION
bool isPerspective = isPerspectiveMatrix( projectionMatrix );
if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
#endif
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
#include <worldpos_vertex>
#include <fog_vertex>
}
`,Ic=`
uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>
vec3 outgoingLight = vec3( 0.0 );
#include <logdepthbuf_fragment>
#include <map_particle_fragment>
#include <color_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
outgoingLight = diffuseColor.rgb;
#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
}
`,yc=`
#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
#include <batching_vertex>
#include <beginnormal_vertex>
#include <morphinstance_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <defaultnormal_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <worldpos_vertex>
#include <shadowmap_vertex>
#include <fog_vertex>
}
`,Nc=`
uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
#include <logdepthbuf_fragment>
gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
}
`,Oc=`
uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
#include <uv_vertex>
vec4 mvPosition = modelViewMatrix[ 3 ];
vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
#ifndef USE_SIZEATTENUATION
bool isPerspective = isPerspectiveMatrix( projectionMatrix );
if ( isPerspective ) scale *= - mvPosition.z;
#endif
vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
vec2 rotatedPosition;
rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
mvPosition.xy += rotatedPosition;
gl_Position = projectionMatrix * mvPosition;
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
#include <fog_vertex>
}
`,Fc=`
uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>
vec3 outgoingLight = vec3( 0.0 );
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
outgoingLight = diffuseColor.rgb;
#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
}
`,Pe={alphahash_fragment:ro,alphahash_pars_fragment:ao,alphamap_fragment:oo,alphamap_pars_fragment:so,alphatest_fragment:co,alphatest_pars_fragment:lo,aomap_fragment:fo,aomap_pars_fragment:uo,batching_pars_vertex:po,batching_vertex:ho,begin_vertex:mo,beginnormal_vertex:_o,bsdfs:go,iridescence_fragment:vo,bumpmap_pars_fragment:Eo,clipping_planes_fragment:So,clipping_planes_pars_fragment:Mo,clipping_planes_pars_vertex:To,clipping_planes_vertex:xo,color_fragment:Ao,color_pars_fragment:Ro,color_pars_vertex:Co,color_vertex:bo,common:Po,cube_uv_reflection_fragment:Lo,defaultnormal_vertex:Uo,displacementmap_pars_vertex:Do,displacementmap_vertex:wo,emissivemap_fragment:Io,emissivemap_pars_fragment:yo,colorspace_fragment:No,colorspace_pars_fragment:Oo,envmap_fragment:Fo,envmap_common_pars_fragment:Bo,envmap_pars_fragment:Go,envmap_pars_vertex:Ho,envmap_physical_pars_fragment:Qo,envmap_vertex:Vo,fog_vertex:ko,fog_pars_vertex:Wo,fog_fragment:zo,fog_pars_fragment:Xo,gradientmap_pars_fragment:Yo,lightmap_pars_fragment:qo,lights_lambert_fragment:Ko,lights_lambert_pars_fragment:$o,lights_pars_begin:Zo,lights_toon_fragment:Jo,lights_toon_pars_fragment:jo,lights_phong_fragment:es,lights_phong_pars_fragment:ts,lights_physical_fragment:ns,lights_physical_pars_fragment:is,lights_fragment_begin:rs,lights_fragment_maps:as,lights_fragment_end:os,logdepthbuf_fragment:ss,logdepthbuf_pars_fragment:cs,logdepthbuf_pars_vertex:ls,logdepthbuf_vertex:fs,map_fragment:ds,map_pars_fragment:us,map_particle_fragment:ps,map_particle_pars_fragment:hs,metalnessmap_fragment:ms,metalnessmap_pars_fragment:_s,morphinstance_vertex:gs,morphcolor_vertex:vs,morphnormal_vertex:Es,morphtarget_pars_vertex:Ss,morphtarget_vertex:Ms,normal_fragment_begin:Ts,normal_fragment_maps:xs,normal_pars_fragment:As,normal_pars_vertex:Rs,normal_vertex:Cs,normalmap_pars_fragment:bs,clearcoat_normal_fragment_begin:Ps,clearcoat_normal_fragment_maps:Ls,clearcoat_pars_fragment:Us,iridescence_pars_fragment:Ds,opaque_fragment:ws,packing:Is,premultiplied_alpha_fragment:ys,project_vertex:Ns,dithering_fragment:Os,dithering_pars_fragment:Fs,roughnessmap_fragment:Bs,roughnessmap_pars_fragment:Gs,shadowmap_pars_fragment:Hs,shadowmap_pars_vertex:Vs,shadowmap_vertex:ks,shadowmask_pars_fragment:Ws,skinbase_vertex:zs,skinning_pars_vertex:Xs,skinning_vertex:Ys,skinnormal_vertex:qs,specularmap_fragment:Ks,specularmap_pars_fragment:$s,tonemapping_fragment:Zs,tonemapping_pars_fragment:Qs,transmission_fragment:Js,transmission_pars_fragment:js,uv_pars_fragment:ec,uv_pars_vertex:tc,uv_vertex:nc,worldpos_vertex:ic,background_vert:rc,background_frag:ac,backgroundCube_vert:oc,backgroundCube_frag:sc,cube_vert:cc,cube_frag:lc,depth_vert:fc,depth_frag:dc,distanceRGBA_vert:uc,distanceRGBA_frag:pc,equirect_vert:hc,equirect_frag:mc,linedashed_vert:_c,linedashed_frag:gc,meshbasic_vert:vc,meshbasic_frag:Ec,meshlambert_vert:Sc,meshlambert_frag:Mc,meshmatcap_vert:Tc,meshmatcap_frag:xc,meshnormal_vert:Ac,meshnormal_frag:Rc,meshphong_vert:Cc,meshphong_frag:bc,meshphysical_vert:Pc,meshphysical_frag:Lc,meshtoon_vert:Uc,meshtoon_frag:Dc,points_vert:wc,points_frag:Ic,shadow_vert:yc,shadow_frag:Nc,sprite_vert:Oc,sprite_frag:Fc},ee={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},mt={basic:{uniforms:at([ee.common,ee.specularmap,ee.envmap,ee.aomap,ee.lightmap,ee.fog]),vertexShader:Pe.meshbasic_vert,fragmentShader:Pe.meshbasic_frag},lambert:{uniforms:at([ee.common,ee.specularmap,ee.envmap,ee.aomap,ee.lightmap,ee.emissivemap,ee.bumpmap,ee.normalmap,ee.displacementmap,ee.fog,ee.lights,{emissive:{value:new $e(0)}}]),vertexShader:Pe.meshlambert_vert,fragmentShader:Pe.meshlambert_frag},phong:{uniforms:at([ee.common,ee.specularmap,ee.envmap,ee.aomap,ee.lightmap,ee.emissivemap,ee.bumpmap,ee.normalmap,ee.displacementmap,ee.fog,ee.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30}}]),vertexShader:Pe.meshphong_vert,fragmentShader:Pe.meshphong_frag},standard:{uniforms:at([ee.common,ee.envmap,ee.aomap,ee.lightmap,ee.emissivemap,ee.bumpmap,ee.normalmap,ee.displacementmap,ee.roughnessmap,ee.metalnessmap,ee.fog,ee.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Pe.meshphysical_vert,fragmentShader:Pe.meshphysical_frag},toon:{uniforms:at([ee.common,ee.aomap,ee.lightmap,ee.emissivemap,ee.bumpmap,ee.normalmap,ee.displacementmap,ee.gradientmap,ee.fog,ee.lights,{emissive:{value:new $e(0)}}]),vertexShader:Pe.meshtoon_vert,fragmentShader:Pe.meshtoon_frag},matcap:{uniforms:at([ee.common,ee.bumpmap,ee.normalmap,ee.displacementmap,ee.fog,{matcap:{value:null}}]),vertexShader:Pe.meshmatcap_vert,fragmentShader:Pe.meshmatcap_frag},points:{uniforms:at([ee.points,ee.fog]),vertexShader:Pe.points_vert,fragmentShader:Pe.points_frag},dashed:{uniforms:at([ee.common,ee.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Pe.linedashed_vert,fragmentShader:Pe.linedashed_frag},depth:{uniforms:at([ee.common,ee.displacementmap]),vertexShader:Pe.depth_vert,fragmentShader:Pe.depth_frag},normal:{uniforms:at([ee.common,ee.bumpmap,ee.normalmap,ee.displacementmap,{opacity:{value:1}}]),vertexShader:Pe.meshnormal_vert,fragmentShader:Pe.meshnormal_frag},sprite:{uniforms:at([ee.sprite,ee.fog]),vertexShader:Pe.sprite_vert,fragmentShader:Pe.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Pe.background_vert,fragmentShader:Pe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Pe.backgroundCube_vert,fragmentShader:Pe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Pe.cube_vert,fragmentShader:Pe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Pe.equirect_vert,fragmentShader:Pe.equirect_frag},distanceRGBA:{uniforms:at([ee.common,ee.displacementmap,{referencePosition:{value:new Ve},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Pe.distanceRGBA_vert,fragmentShader:Pe.distanceRGBA_frag},shadow:{uniforms:at([ee.lights,ee.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:Pe.shadow_vert,fragmentShader:Pe.shadow_frag}};mt.physical={uniforms:at([mt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Pe.meshphysical_vert,fragmentShader:Pe.meshphysical_frag};const an={r:0,b:0,g:0},Lt=new rr,Bc=new Vt;function Gc(e,n,t,i,s,o,h){const f=new $e(0);let b=o===!0?0:1,E,U,R=null,g=0,x=null;function N(P){let M=P.isScene===!0?P.background:null;return M&&M.isTexture&&(M=(P.backgroundBlurriness>0?t:n).get(M)),M}function C(P){let M=!1;const m=N(P);m===null?r(f,b):m&&m.isColor&&(r(m,1),M=!0);const Z=e.xr.getEnvironmentBlendMode();Z==="additive"?i.buffers.color.setClear(0,0,0,1,h):Z==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,h),(e.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function l(P,M){const m=N(M);m&&(m.isCubeTexture||m.mapping===mn)?(U===void 0&&(U=new St(new zn(1,1,1),new bt({name:"BackgroundCubeMaterial",uniforms:In(mt.backgroundCube.uniforms),vertexShader:mt.backgroundCube.vertexShader,fragmentShader:mt.backgroundCube.fragmentShader,side:lt,depthTest:!1,depthWrite:!1,fog:!1})),U.geometry.deleteAttribute("normal"),U.geometry.deleteAttribute("uv"),U.onBeforeRender=function(Z,D,y){this.matrixWorld.copyPosition(y.matrixWorld)},Object.defineProperty(U.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(U)),Lt.copy(M.backgroundRotation),Lt.x*=-1,Lt.y*=-1,Lt.z*=-1,m.isCubeTexture&&m.isRenderTargetTexture===!1&&(Lt.y*=-1,Lt.z*=-1),U.material.uniforms.envMap.value=m,U.material.uniforms.flipEnvMap.value=m.isCubeTexture&&m.isRenderTargetTexture===!1?-1:1,U.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,U.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,U.material.uniforms.backgroundRotation.value.setFromMatrix4(Bc.makeRotationFromEuler(Lt)),U.material.toneMapped=et.getTransfer(m.colorSpace)!==Ke,(R!==m||g!==m.version||x!==e.toneMapping)&&(U.material.needsUpdate=!0,R=m,g=m.version,x=e.toneMapping),U.layers.enableAll(),P.unshift(U,U.geometry,U.material,0,0,null)):m&&m.isTexture&&(E===void 0&&(E=new St(new ar(2,2),new bt({name:"BackgroundMaterial",uniforms:In(mt.background.uniforms),vertexShader:mt.background.vertexShader,fragmentShader:mt.background.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1})),E.geometry.deleteAttribute("normal"),Object.defineProperty(E.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(E)),E.material.uniforms.t2D.value=m,E.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,E.material.toneMapped=et.getTransfer(m.colorSpace)!==Ke,m.matrixAutoUpdate===!0&&m.updateMatrix(),E.material.uniforms.uvTransform.value.copy(m.matrix),(R!==m||g!==m.version||x!==e.toneMapping)&&(E.material.needsUpdate=!0,R=m,g=m.version,x=e.toneMapping),E.layers.enableAll(),P.unshift(E,E.geometry,E.material,0,0,null))}function r(P,M){P.getRGB(an,or(e)),i.buffers.color.setClear(an.r,an.g,an.b,M,h)}return{getClearColor:function(){return f},setClearColor:function(P,M=1){f.set(P),b=M,r(f,b)},getClearAlpha:function(){return b},setClearAlpha:function(P){b=P,r(f,b)},render:C,addToRenderList:l}}function Hc(e,n){const t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=g(null);let o=s,h=!1;function f(d,A,Y,G,X){let Q=!1;const k=R(G,Y,A);o!==k&&(o=k,E(o.object)),Q=x(d,G,Y,X),Q&&N(d,G,Y,X),X!==null&&n.update(X,e.ELEMENT_ARRAY_BUFFER),(Q||h)&&(h=!1,m(d,A,Y,G),X!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(X).buffer))}function b(){return e.createVertexArray()}function E(d){return e.bindVertexArray(d)}function U(d){return e.deleteVertexArray(d)}function R(d,A,Y){const G=Y.wireframe===!0;let X=i[d.id];X===void 0&&(X={},i[d.id]=X);let Q=X[A.id];Q===void 0&&(Q={},X[A.id]=Q);let k=Q[G];return k===void 0&&(k=g(b()),Q[G]=k),k}function g(d){const A=[],Y=[],G=[];for(let X=0;X<t;X++)A[X]=0,Y[X]=0,G[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:Y,attributeDivisors:G,object:d,attributes:{},index:null}}function x(d,A,Y,G){const X=o.attributes,Q=A.attributes;let k=0;const j=Y.getAttributes();for(const F in j)if(j[F].location>=0){const Se=X[F];let Le=Q[F];if(Le===void 0&&(F==="instanceMatrix"&&d.instanceMatrix&&(Le=d.instanceMatrix),F==="instanceColor"&&d.instanceColor&&(Le=d.instanceColor)),Se===void 0||Se.attribute!==Le||Le&&Se.data!==Le.data)return!0;k++}return o.attributesNum!==k||o.index!==G}function N(d,A,Y,G){const X={},Q=A.attributes;let k=0;const j=Y.getAttributes();for(const F in j)if(j[F].location>=0){let Se=Q[F];Se===void 0&&(F==="instanceMatrix"&&d.instanceMatrix&&(Se=d.instanceMatrix),F==="instanceColor"&&d.instanceColor&&(Se=d.instanceColor));const Le={};Le.attribute=Se,Se&&Se.data&&(Le.data=Se.data),X[F]=Le,k++}o.attributes=X,o.attributesNum=k,o.index=G}function C(){const d=o.newAttributes;for(let A=0,Y=d.length;A<Y;A++)d[A]=0}function l(d){r(d,0)}function r(d,A){const Y=o.newAttributes,G=o.enabledAttributes,X=o.attributeDivisors;Y[d]=1,G[d]===0&&(e.enableVertexAttribArray(d),G[d]=1),X[d]!==A&&(e.vertexAttribDivisor(d,A),X[d]=A)}function P(){const d=o.newAttributes,A=o.enabledAttributes;for(let Y=0,G=A.length;Y<G;Y++)A[Y]!==d[Y]&&(e.disableVertexAttribArray(Y),A[Y]=0)}function M(d,A,Y,G,X,Q,k){k===!0?e.vertexAttribIPointer(d,A,Y,X,Q):e.vertexAttribPointer(d,A,Y,G,X,Q)}function m(d,A,Y,G){C();const X=G.attributes,Q=Y.getAttributes(),k=A.defaultAttributeValues;for(const j in Q){const F=Q[j];if(F.location>=0){let _e=X[j];if(_e===void 0&&(j==="instanceMatrix"&&d.instanceMatrix&&(_e=d.instanceMatrix),j==="instanceColor"&&d.instanceColor&&(_e=d.instanceColor)),_e!==void 0){const Se=_e.normalized,Le=_e.itemSize,Be=n.get(_e);if(Be===void 0)continue;const Qe=Be.buffer,V=Be.type,J=Be.bytesPerElement,pe=V===e.INT||V===e.UNSIGNED_INT||_e.gpuType===sr;if(_e.isInterleavedBufferAttribute){const ne=_e.data,Me=ne.stride,Ae=_e.offset;if(ne.isInstancedInterleavedBuffer){for(let Ue=0;Ue<F.locationSize;Ue++)r(F.location+Ue,ne.meshPerAttribute);d.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ue=0;Ue<F.locationSize;Ue++)l(F.location+Ue);e.bindBuffer(e.ARRAY_BUFFER,Qe);for(let Ue=0;Ue<F.locationSize;Ue++)M(F.location+Ue,Le/F.locationSize,V,Se,Me*J,(Ae+Le/F.locationSize*Ue)*J,pe)}else{if(_e.isInstancedBufferAttribute){for(let ne=0;ne<F.locationSize;ne++)r(F.location+ne,_e.meshPerAttribute);d.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let ne=0;ne<F.locationSize;ne++)l(F.location+ne);e.bindBuffer(e.ARRAY_BUFFER,Qe);for(let ne=0;ne<F.locationSize;ne++)M(F.location+ne,Le/F.locationSize,V,Se,Le*J,Le/F.locationSize*ne*J,pe)}}else if(k!==void 0){const Se=k[j];if(Se!==void 0)switch(Se.length){case 2:e.vertexAttrib2fv(F.location,Se);break;case 3:e.vertexAttrib3fv(F.location,Se);break;case 4:e.vertexAttrib4fv(F.location,Se);break;default:e.vertexAttrib1fv(F.location,Se)}}}}P()}function Z(){H();for(const d in i){const A=i[d];for(const Y in A){const G=A[Y];for(const X in G)U(G[X].object),delete G[X];delete A[Y]}delete i[d]}}function D(d){if(i[d.id]===void 0)return;const A=i[d.id];for(const Y in A){const G=A[Y];for(const X in G)U(G[X].object),delete G[X];delete A[Y]}delete i[d.id]}function y(d){for(const A in i){const Y=i[A];if(Y[d.id]===void 0)continue;const G=Y[d.id];for(const X in G)U(G[X].object),delete G[X];delete Y[d.id]}}function H(){p(),h=!0,o!==s&&(o=s,E(o.object))}function p(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:f,reset:H,resetDefaultState:p,dispose:Z,releaseStatesOfGeometry:D,releaseStatesOfProgram:y,initAttributes:C,enableAttribute:l,disableUnusedAttributes:P}}function Vc(e,n,t){let i;function s(E){i=E}function o(E,U){e.drawArrays(i,E,U),t.update(U,i,1)}function h(E,U,R){R!==0&&(e.drawArraysInstanced(i,E,U,R),t.update(U,i,R))}function f(E,U,R){if(R===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,E,0,U,0,R);let x=0;for(let N=0;N<R;N++)x+=U[N];t.update(x,i,1)}function b(E,U,R,g){if(R===0)return;const x=n.get("WEBGL_multi_draw");if(x===null)for(let N=0;N<E.length;N++)h(E[N],U[N],g[N]);else{x.multiDrawArraysInstancedWEBGL(i,E,0,U,0,g,0,R);let N=0;for(let C=0;C<R;C++)N+=U[C]*g[C];t.update(N,i,1)}}this.setMode=s,this.render=o,this.renderInstances=h,this.renderMultiDraw=f,this.renderMultiDrawInstances=b}function kc(e,n,t,i){let s;function o(){if(s!==void 0)return s;if(n.has("EXT_texture_filter_anisotropic")===!0){const y=n.get("EXT_texture_filter_anisotropic");s=e.getParameter(y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function h(y){return!(y!==Mt&&i.convert(y)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(y){const H=y===_n&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(y!==yt&&i.convert(y)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&y!==It&&!H)}function b(y){if(y==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";y="mediump"}return y==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let E=t.precision!==void 0?t.precision:"highp";const U=b(E);U!==E&&(console.warn("THREE.WebGLRenderer:",E,"not supported, using",U,"instead."),E=U);const R=t.logarithmicDepthBuffer===!0,g=t.reverseDepthBuffer===!0&&n.has("EXT_clip_control"),x=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),N=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=e.getParameter(e.MAX_TEXTURE_SIZE),l=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),r=e.getParameter(e.MAX_VERTEX_ATTRIBS),P=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),M=e.getParameter(e.MAX_VARYING_VECTORS),m=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),Z=N>0,D=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:b,textureFormatReadable:h,textureTypeReadable:f,precision:E,logarithmicDepthBuffer:R,reverseDepthBuffer:g,maxTextures:x,maxVertexTextures:N,maxTextureSize:C,maxCubemapSize:l,maxAttributes:r,maxVertexUniforms:P,maxVaryings:M,maxFragmentUniforms:m,vertexTextures:Z,maxSamples:D}}function Wc(e){const n=this;let t=null,i=0,s=!1,o=!1;const h=new Dr,f=new Fe,b={value:null,needsUpdate:!1};this.uniform=b,this.numPlanes=0,this.numIntersection=0,this.init=function(R,g){const x=R.length!==0||g||i!==0||s;return s=g,i=R.length,x},this.beginShadows=function(){o=!0,U(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(R,g){t=U(R,g,0)},this.setState=function(R,g,x){const N=R.clippingPlanes,C=R.clipIntersection,l=R.clipShadows,r=e.get(R);if(!s||N===null||N.length===0||o&&!l)o?U(null):E();else{const P=o?0:i,M=P*4;let m=r.clippingState||null;b.value=m,m=U(N,g,M,x);for(let Z=0;Z!==M;++Z)m[Z]=t[Z];r.clippingState=m,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=P}};function E(){b.value!==t&&(b.value=t,b.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function U(R,g,x,N){const C=R!==null?R.length:0;let l=null;if(C!==0){if(l=b.value,N!==!0||l===null){const r=x+C*4,P=g.matrixWorldInverse;f.getNormalMatrix(P),(l===null||l.length<r)&&(l=new Float32Array(r));for(let M=0,m=x;M!==C;++M,m+=4)h.copy(R[M]).applyMatrix4(P,f),h.normal.toArray(l,m),l[m+3]=h.constant}b.value=l,b.needsUpdate=!0}return n.numPlanes=C,n.numIntersection=0,l}}function zc(e){let n=new WeakMap;function t(h,f){return f===yn?h.mapping=Qt:f===Nn&&(h.mapping=kt),h}function i(h){if(h&&h.isTexture){const f=h.mapping;if(f===yn||f===Nn)if(n.has(h)){const b=n.get(h).texture;return t(b,h.mapping)}else{const b=h.image;if(b&&b.height>0){const E=new no(b.height);return E.fromEquirectangularTexture(e,h),n.set(h,E),h.addEventListener("dispose",s),t(E.texture,h.mapping)}else return null}}return h}function s(h){const f=h.target;f.removeEventListener("dispose",s);const b=n.get(f);b!==void 0&&(n.delete(f),b.dispose())}function o(){n=new WeakMap}return{get:i,dispose:o}}const Ht=4,Ii=[.125,.215,.35,.446,.526,.582],wt=20,Cn=new wr,yi=new $e;let bn=null,Pn=0,Ln=0,Un=!1;const Dt=(1+Math.sqrt(5))/2,Ft=1/Dt,Ni=[new Ve(-Dt,Ft,0),new Ve(Dt,Ft,0),new Ve(-Ft,0,Dt),new Ve(Ft,0,Dt),new Ve(0,Dt,-Ft),new Ve(0,Dt,Ft),new Ve(-1,1,-1),new Ve(1,1,-1),new Ve(-1,1,1),new Ve(1,1,1)];class Oi{constructor(n){this._renderer=n,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(n,t=0,i=.1,s=100){bn=this._renderer.getRenderTarget(),Pn=this._renderer.getActiveCubeFace(),Ln=this._renderer.getActiveMipmapLevel(),Un=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(n,i,s,o),t>0&&this._blur(o,0,0,t),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gi(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bi(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(n){this._lodMax=Math.floor(Math.log2(n)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let n=0;n<this._lodPlanes.length;n++)this._lodPlanes[n].dispose()}_cleanup(n){this._renderer.setRenderTarget(bn,Pn,Ln),this._renderer.xr.enabled=Un,n.scissorTest=!1,on(n,0,0,n.width,n.height)}_fromTexture(n,t){n.mapping===Qt||n.mapping===kt?this._setSize(n.image.length===0?16:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4),bn=this._renderer.getRenderTarget(),Pn=this._renderer.getActiveCubeFace(),Ln=this._renderer.getActiveMipmapLevel(),Un=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(n,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const n=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:At,minFilter:At,generateMipmaps:!1,type:_n,format:Mt,colorSpace:gn,depthBuffer:!1},s=Fi(n,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==n||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fi(n,t,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Xc(o)),this._blurMaterial=Yc(o,n,t)}return s}_compileMaterial(n){const t=new St(this._lodPlanes[0],n);this._renderer.compile(t,Cn)}_sceneToCubeUV(n,t,i,s){const f=new cn(90,1,t,i),b=[1,-1,1,1,1,1],E=[1,1,1,-1,-1,-1],U=this._renderer,R=U.autoClear,g=U.toneMapping;U.getClearColor(yi),U.toneMapping=Ct,U.autoClear=!1;const x=new Ir({name:"PMREM.Background",side:lt,depthWrite:!1,depthTest:!1}),N=new St(new zn,x);let C=!1;const l=n.background;l?l.isColor&&(x.color.copy(l),n.background=null,C=!0):(x.color.copy(yi),C=!0);for(let r=0;r<6;r++){const P=r%3;P===0?(f.up.set(0,b[r],0),f.lookAt(E[r],0,0)):P===1?(f.up.set(0,0,b[r]),f.lookAt(0,E[r],0)):(f.up.set(0,b[r],0),f.lookAt(0,0,E[r]));const M=this._cubeSize;on(s,P*M,r>2?M:0,M,M),U.setRenderTarget(s),C&&U.render(N,f),U.render(n,f)}N.geometry.dispose(),N.material.dispose(),U.toneMapping=g,U.autoClear=R,n.background=l}_textureToCubeUV(n,t){const i=this._renderer,s=n.mapping===Qt||n.mapping===kt;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gi()),this._cubemapMaterial.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bi());const o=s?this._cubemapMaterial:this._equirectMaterial,h=new St(this._lodPlanes[0],o),f=o.uniforms;f.envMap.value=n;const b=this._cubeSize;on(t,0,0,3*b,2*b),i.setRenderTarget(t),i.render(h,Cn)}_applyPMREM(n){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const h=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),f=Ni[(s-o-1)%Ni.length];this._blur(n,o-1,o,h,f)}t.autoClear=i}_blur(n,t,i,s,o){const h=this._pingPongRenderTarget;this._halfBlur(n,h,t,i,s,"latitudinal",o),this._halfBlur(h,n,i,i,s,"longitudinal",o)}_halfBlur(n,t,i,s,o,h,f){const b=this._renderer,E=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const U=3,R=new St(this._lodPlanes[s],E),g=E.uniforms,x=this._sizeLods[i]-1,N=isFinite(o)?Math.PI/(2*x):2*Math.PI/(2*wt-1),C=o/N,l=isFinite(o)?1+Math.floor(U*C):wt;l>wt&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${l} samples when the maximum is set to ${wt}`);const r=[];let P=0;for(let y=0;y<wt;++y){const H=y/C,p=Math.exp(-H*H/2);r.push(p),y===0?P+=p:y<l&&(P+=2*p)}for(let y=0;y<r.length;y++)r[y]=r[y]/P;g.envMap.value=n.texture,g.samples.value=l,g.weights.value=r,g.latitudinal.value=h==="latitudinal",f&&(g.poleAxis.value=f);const{_lodMax:M}=this;g.dTheta.value=N,g.mipInt.value=M-i;const m=this._sizeLods[s],Z=3*m*(s>M-Ht?s-M+Ht:0),D=4*(this._cubeSize-m);on(t,Z,D,3*m,2*m),b.setRenderTarget(t),b.render(R,Cn)}}function Xc(e){const n=[],t=[],i=[];let s=e;const o=e-Ht+1+Ii.length;for(let h=0;h<o;h++){const f=Math.pow(2,s);t.push(f);let b=1/f;h>e-Ht?b=Ii[h-e+Ht-1]:h===0&&(b=0),i.push(b);const E=1/(f-2),U=-E,R=1+E,g=[U,U,R,U,R,R,U,U,R,R,U,R],x=6,N=6,C=3,l=2,r=1,P=new Float32Array(C*N*x),M=new Float32Array(l*N*x),m=new Float32Array(r*N*x);for(let D=0;D<x;D++){const y=D%3*2/3-1,H=D>2?0:-1,p=[y,H,0,y+2/3,H,0,y+2/3,H+1,0,y,H,0,y+2/3,H+1,0,y,H+1,0];P.set(p,C*N*D),M.set(g,l*N*D);const d=[D,D,D,D,D,D];m.set(d,r*N*D)}const Z=new cr;Z.setAttribute("position",new ln(P,C)),Z.setAttribute("uv",new ln(M,l)),Z.setAttribute("faceIndex",new ln(m,r)),n.push(Z),s>Ht&&s--}return{lodPlanes:n,sizeLods:t,sigmas:i}}function Fi(e,n,t){const i=new Nt(e,n,t);return i.texture.mapping=mn,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function on(e,n,t,i,s){e.viewport.set(n,t,i,s),e.scissor.set(n,t,i,s)}function Yc(e,n,t){const i=new Float32Array(wt),s=new Ve(0,1,0);return new bt({name:"SphericalGaussianBlur",defines:{n:wt,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Yn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Rt,depthTest:!1,depthWrite:!1})}function Bi(){return new bt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Yn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Rt,depthTest:!1,depthWrite:!1})}function Gi(){return new bt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Yn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rt,depthTest:!1,depthWrite:!1})}function Yn(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function qc(e){let n=new WeakMap,t=null;function i(f){if(f&&f.isTexture){const b=f.mapping,E=b===yn||b===Nn,U=b===Qt||b===kt;if(E||U){let R=n.get(f);const g=R!==void 0?R.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==g)return t===null&&(t=new Oi(e)),R=E?t.fromEquirectangular(f,R):t.fromCubemap(f,R),R.texture.pmremVersion=f.pmremVersion,n.set(f,R),R.texture;if(R!==void 0)return R.texture;{const x=f.image;return E&&x&&x.height>0||U&&x&&s(x)?(t===null&&(t=new Oi(e)),R=E?t.fromEquirectangular(f):t.fromCubemap(f),R.texture.pmremVersion=f.pmremVersion,n.set(f,R),f.addEventListener("dispose",o),R.texture):null}}}return f}function s(f){let b=0;const E=6;for(let U=0;U<E;U++)f[U]!==void 0&&b++;return b===E}function o(f){const b=f.target;b.removeEventListener("dispose",o);const E=n.get(b);E!==void 0&&(n.delete(b),E.dispose())}function h(){n=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:h}}function Kc(e){const n={};function t(i){if(n[i]!==void 0)return n[i];let s;switch(i){case"WEBGL_depth_texture":s=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=e.getExtension(i)}return n[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&qt("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function $c(e,n,t,i){const s={},o=new WeakMap;function h(R){const g=R.target;g.index!==null&&n.remove(g.index);for(const N in g.attributes)n.remove(g.attributes[N]);for(const N in g.morphAttributes){const C=g.morphAttributes[N];for(let l=0,r=C.length;l<r;l++)n.remove(C[l])}g.removeEventListener("dispose",h),delete s[g.id];const x=o.get(g);x&&(n.remove(x),o.delete(g)),i.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function f(R,g){return s[g.id]===!0||(g.addEventListener("dispose",h),s[g.id]=!0,t.memory.geometries++),g}function b(R){const g=R.attributes;for(const N in g)n.update(g[N],e.ARRAY_BUFFER);const x=R.morphAttributes;for(const N in x){const C=x[N];for(let l=0,r=C.length;l<r;l++)n.update(C[l],e.ARRAY_BUFFER)}}function E(R){const g=[],x=R.index,N=R.attributes.position;let C=0;if(x!==null){const P=x.array;C=x.version;for(let M=0,m=P.length;M<m;M+=3){const Z=P[M+0],D=P[M+1],y=P[M+2];g.push(Z,D,D,y,y,Z)}}else if(N!==void 0){const P=N.array;C=N.version;for(let M=0,m=P.length/3-1;M<m;M+=3){const Z=M+0,D=M+1,y=M+2;g.push(Z,D,D,y,y,Z)}}else return;const l=new(Or(g)?yr:Nr)(g,1);l.version=C;const r=o.get(R);r&&n.remove(r),o.set(R,l)}function U(R){const g=o.get(R);if(g){const x=R.index;x!==null&&g.version<x.version&&E(R)}else E(R);return o.get(R)}return{get:f,update:b,getWireframeAttribute:U}}function Zc(e,n,t){let i;function s(g){i=g}let o,h;function f(g){o=g.type,h=g.bytesPerElement}function b(g,x){e.drawElements(i,x,o,g*h),t.update(x,i,1)}function E(g,x,N){N!==0&&(e.drawElementsInstanced(i,x,o,g*h,N),t.update(x,i,N))}function U(g,x,N){if(N===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,x,0,o,g,0,N);let l=0;for(let r=0;r<N;r++)l+=x[r];t.update(l,i,1)}function R(g,x,N,C){if(N===0)return;const l=n.get("WEBGL_multi_draw");if(l===null)for(let r=0;r<g.length;r++)E(g[r]/h,x[r],C[r]);else{l.multiDrawElementsInstancedWEBGL(i,x,0,o,g,0,C,0,N);let r=0;for(let P=0;P<N;P++)r+=x[P]*C[P];t.update(r,i,1)}}this.setMode=s,this.setIndex=f,this.render=b,this.renderInstances=E,this.renderMultiDraw=U,this.renderMultiDrawInstances=R}function Qc(e){const n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,h,f){switch(t.calls++,h){case e.TRIANGLES:t.triangles+=f*(o/3);break;case e.LINES:t.lines+=f*(o/2);break;case e.LINE_STRIP:t.lines+=f*(o-1);break;case e.LINE_LOOP:t.lines+=f*o;break;case e.POINTS:t.points+=f*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Jc(e,n,t){const i=new WeakMap,s=new ot;function o(h,f,b){const E=h.morphTargetInfluences,U=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,R=U!==void 0?U.length:0;let g=i.get(f);if(g===void 0||g.count!==R){let p=function(){y.dispose(),i.delete(f),f.removeEventListener("dispose",p)};g!==void 0&&g.texture.dispose();const x=f.morphAttributes.position!==void 0,N=f.morphAttributes.normal!==void 0,C=f.morphAttributes.color!==void 0,l=f.morphAttributes.position||[],r=f.morphAttributes.normal||[],P=f.morphAttributes.color||[];let M=0;x===!0&&(M=1),N===!0&&(M=2),C===!0&&(M=3);let m=f.attributes.position.count*M,Z=1;m>n.maxTextureSize&&(Z=Math.ceil(m/n.maxTextureSize),m=n.maxTextureSize);const D=new Float32Array(m*Z*4*R),y=new lr(D,m,Z,R);y.type=It,y.needsUpdate=!0;const H=M*4;for(let d=0;d<R;d++){const A=l[d],Y=r[d],G=P[d],X=m*Z*4*d;for(let Q=0;Q<A.count;Q++){const k=Q*H;x===!0&&(s.fromBufferAttribute(A,Q),D[X+k+0]=s.x,D[X+k+1]=s.y,D[X+k+2]=s.z,D[X+k+3]=0),N===!0&&(s.fromBufferAttribute(Y,Q),D[X+k+4]=s.x,D[X+k+5]=s.y,D[X+k+6]=s.z,D[X+k+7]=0),C===!0&&(s.fromBufferAttribute(G,Q),D[X+k+8]=s.x,D[X+k+9]=s.y,D[X+k+10]=s.z,D[X+k+11]=G.itemSize===4?s.w:1)}}g={count:R,texture:y,size:new st(m,Z)},i.set(f,g),f.addEventListener("dispose",p)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)b.getUniforms().setValue(e,"morphTexture",h.morphTexture,t);else{let x=0;for(let C=0;C<E.length;C++)x+=E[C];const N=f.morphTargetsRelative?1:1-x;b.getUniforms().setValue(e,"morphTargetBaseInfluence",N),b.getUniforms().setValue(e,"morphTargetInfluences",E)}b.getUniforms().setValue(e,"morphTargetsTexture",g.texture,t),b.getUniforms().setValue(e,"morphTargetsTextureSize",g.size)}return{update:o}}function jc(e,n,t,i){let s=new WeakMap;function o(b){const E=i.render.frame,U=b.geometry,R=n.get(b,U);if(s.get(R)!==E&&(n.update(R),s.set(R,E)),b.isInstancedMesh&&(b.hasEventListener("dispose",f)===!1&&b.addEventListener("dispose",f),s.get(b)!==E&&(t.update(b.instanceMatrix,e.ARRAY_BUFFER),b.instanceColor!==null&&t.update(b.instanceColor,e.ARRAY_BUFFER),s.set(b,E))),b.isSkinnedMesh){const g=b.skeleton;s.get(g)!==E&&(g.update(),s.set(g,E))}return R}function h(){s=new WeakMap}function f(b){const E=b.target;E.removeEventListener("dispose",f),t.remove(E.instanceMatrix),E.instanceColor!==null&&t.remove(E.instanceColor)}return{update:o,dispose:h}}const Tr=new ur,Hi=new dr(1,1),xr=new lr,Ar=new Fr,Rr=new ir,Vi=[],ki=[],Wi=new Float32Array(16),zi=new Float32Array(9),Xi=new Float32Array(4);function Wt(e,n,t){const i=e[0];if(i<=0||i>0)return e;const s=n*t;let o=Vi[s];if(o===void 0&&(o=new Float32Array(s),Vi[s]=o),n!==0){i.toArray(o,0);for(let h=1,f=0;h!==n;++h)f+=t,e[h].toArray(o,f)}return o}function tt(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function nt(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function vn(e,n){let t=ki[n];t===void 0&&(t=new Int32Array(n),ki[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function el(e,n){const t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function tl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(tt(t,n))return;e.uniform2fv(this.addr,n),nt(t,n)}}function nl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(tt(t,n))return;e.uniform3fv(this.addr,n),nt(t,n)}}function il(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(tt(t,n))return;e.uniform4fv(this.addr,n),nt(t,n)}}function rl(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(tt(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),nt(t,n)}else{if(tt(t,i))return;Xi.set(i),e.uniformMatrix2fv(this.addr,!1,Xi),nt(t,i)}}function al(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(tt(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),nt(t,n)}else{if(tt(t,i))return;zi.set(i),e.uniformMatrix3fv(this.addr,!1,zi),nt(t,i)}}function ol(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(tt(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),nt(t,n)}else{if(tt(t,i))return;Wi.set(i),e.uniformMatrix4fv(this.addr,!1,Wi),nt(t,i)}}function sl(e,n){const t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function cl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(tt(t,n))return;e.uniform2iv(this.addr,n),nt(t,n)}}function ll(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(tt(t,n))return;e.uniform3iv(this.addr,n),nt(t,n)}}function fl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(tt(t,n))return;e.uniform4iv(this.addr,n),nt(t,n)}}function dl(e,n){const t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function ul(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(tt(t,n))return;e.uniform2uiv(this.addr,n),nt(t,n)}}function pl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(tt(t,n))return;e.uniform3uiv(this.addr,n),nt(t,n)}}function hl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(tt(t,n))return;e.uniform4uiv(this.addr,n),nt(t,n)}}function ml(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let o;this.type===e.SAMPLER_2D_SHADOW?(Hi.compareFunction=fr,o=Hi):o=Tr,t.setTexture2D(n||o,s)}function _l(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(n||Ar,s)}function gl(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(n||Rr,s)}function vl(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(n||xr,s)}function El(e){switch(e){case 5126:return el;case 35664:return tl;case 35665:return nl;case 35666:return il;case 35674:return rl;case 35675:return al;case 35676:return ol;case 5124:case 35670:return sl;case 35667:case 35671:return cl;case 35668:case 35672:return ll;case 35669:case 35673:return fl;case 5125:return dl;case 36294:return ul;case 36295:return pl;case 36296:return hl;case 35678:case 36198:case 36298:case 36306:case 35682:return ml;case 35679:case 36299:case 36307:return _l;case 35680:case 36300:case 36308:case 36293:return gl;case 36289:case 36303:case 36311:case 36292:return vl}}function Sl(e,n){e.uniform1fv(this.addr,n)}function Ml(e,n){const t=Wt(n,this.size,2);e.uniform2fv(this.addr,t)}function Tl(e,n){const t=Wt(n,this.size,3);e.uniform3fv(this.addr,t)}function xl(e,n){const t=Wt(n,this.size,4);e.uniform4fv(this.addr,t)}function Al(e,n){const t=Wt(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function Rl(e,n){const t=Wt(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function Cl(e,n){const t=Wt(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function bl(e,n){e.uniform1iv(this.addr,n)}function Pl(e,n){e.uniform2iv(this.addr,n)}function Ll(e,n){e.uniform3iv(this.addr,n)}function Ul(e,n){e.uniform4iv(this.addr,n)}function Dl(e,n){e.uniform1uiv(this.addr,n)}function wl(e,n){e.uniform2uiv(this.addr,n)}function Il(e,n){e.uniform3uiv(this.addr,n)}function yl(e,n){e.uniform4uiv(this.addr,n)}function Nl(e,n,t){const i=this.cache,s=n.length,o=vn(t,s);tt(i,o)||(e.uniform1iv(this.addr,o),nt(i,o));for(let h=0;h!==s;++h)t.setTexture2D(n[h]||Tr,o[h])}function Ol(e,n,t){const i=this.cache,s=n.length,o=vn(t,s);tt(i,o)||(e.uniform1iv(this.addr,o),nt(i,o));for(let h=0;h!==s;++h)t.setTexture3D(n[h]||Ar,o[h])}function Fl(e,n,t){const i=this.cache,s=n.length,o=vn(t,s);tt(i,o)||(e.uniform1iv(this.addr,o),nt(i,o));for(let h=0;h!==s;++h)t.setTextureCube(n[h]||Rr,o[h])}function Bl(e,n,t){const i=this.cache,s=n.length,o=vn(t,s);tt(i,o)||(e.uniform1iv(this.addr,o),nt(i,o));for(let h=0;h!==s;++h)t.setTexture2DArray(n[h]||xr,o[h])}function Gl(e){switch(e){case 5126:return Sl;case 35664:return Ml;case 35665:return Tl;case 35666:return xl;case 35674:return Al;case 35675:return Rl;case 35676:return Cl;case 5124:case 35670:return bl;case 35667:case 35671:return Pl;case 35668:case 35672:return Ll;case 35669:case 35673:return Ul;case 5125:return Dl;case 36294:return wl;case 36295:return Il;case 36296:return yl;case 35678:case 36198:case 36298:case 36306:case 35682:return Nl;case 35679:case 36299:case 36307:return Ol;case 35680:case 36300:case 36308:case 36293:return Fl;case 36289:case 36303:case 36311:case 36292:return Bl}}class Hl{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=El(t.type)}}class Vl{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Gl(t.type)}}class kl{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){const s=this.seq;for(let o=0,h=s.length;o!==h;++o){const f=s[o];f.setValue(n,t[f.id],i)}}}const Dn=/(\w+)(\])?(\[|\.)?/g;function Yi(e,n){e.seq.push(n),e.map[n.id]=n}function Wl(e,n,t){const i=e.name,s=i.length;for(Dn.lastIndex=0;;){const o=Dn.exec(i),h=Dn.lastIndex;let f=o[1];const b=o[2]==="]",E=o[3];if(b&&(f=f|0),E===void 0||E==="["&&h+2===s){Yi(t,E===void 0?new Hl(f,e,n):new Vl(f,e,n));break}else{let R=t.map[f];R===void 0&&(R=new kl(f),Yi(t,R)),t=R}}}class dn{constructor(n,t){this.seq=[],this.map={};const i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const o=n.getActiveUniform(t,s),h=n.getUniformLocation(t,o.name);Wl(o,h,this)}}setValue(n,t,i,s){const o=this.map[t];o!==void 0&&o.setValue(n,i,s)}setOptional(n,t,i){const s=t[i];s!==void 0&&this.setValue(n,i,s)}static upload(n,t,i,s){for(let o=0,h=t.length;o!==h;++o){const f=t[o],b=i[f.id];b.needsUpdate!==!1&&f.setValue(n,b.value,s)}}static seqWithValue(n,t){const i=[];for(let s=0,o=n.length;s!==o;++s){const h=n[s];h.id in t&&i.push(h)}return i}}function qi(e,n,t){const i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}const zl=37297;let Xl=0;function Yl(e,n){const t=e.split(`
`),i=[],s=Math.max(n-6,0),o=Math.min(n+6,t.length);for(let h=s;h<o;h++){const f=h+1;i.push(`${f===n?">":" "} ${f}: ${t[h]}`)}return i.join(`
`)}const Ki=new Fe;function ql(e){et._getMatrix(Ki,et.workingColorSpace,e);const n=`mat3( ${Ki.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(e)){case hr:return[n,"LinearTransferOETF"];case Ke:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function $i(e,n,t){const i=e.getShaderParameter(n,e.COMPILE_STATUS),s=e.getShaderInfoLog(n).trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const h=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+Yl(e.getShaderSource(n),h)}else return s}function Kl(e,n){const t=ql(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function $l(e,n){let t;switch(n){case Xr:t="Linear";break;case zr:t="Reinhard";break;case Wr:t="Cineon";break;case kr:t="ACESFilmic";break;case Vr:t="AgX";break;case Hr:t="Neutral";break;case Gr:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",n),t="Linear"}return"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const sn=new Ve;function Zl(){et.getLuminanceCoefficients(sn);const e=sn.x.toFixed(4),n=sn.y.toFixed(4),t=sn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ql(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Kt).join(`
`)}function Jl(e){const n=[];for(const t in e){const i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function jl(e,n){const t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const o=e.getActiveAttrib(n,s),h=o.name;let f=1;o.type===e.FLOAT_MAT2&&(f=2),o.type===e.FLOAT_MAT3&&(f=3),o.type===e.FLOAT_MAT4&&(f=4),t[h]={type:o.type,location:e.getAttribLocation(n,h),locationSize:f}}return t}function Kt(e){return e!==""}function Zi(e,n){const t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows)}function Qi(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}const ef=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wn(e){return e.replace(ef,nf)}const tf=new Map;function nf(e,n){let t=Pe[n];if(t===void 0){const i=tf.get(n);if(i!==void 0)t=Pe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',n,i);else throw new Error("Can not resolve #include <"+n+">")}return Wn(t)}const rf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ji(e){return e.replace(rf,af)}function af(e,n,t,i){let s="";for(let o=parseInt(n);o<parseInt(t);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function ji(e){let n=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}function of(e){let n="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===pr?n="SHADOWMAP_TYPE_PCF":e.shadowMapType===Br?n="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===vt&&(n="SHADOWMAP_TYPE_VSM"),n}function sf(e){let n="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case Qt:case kt:n="ENVMAP_TYPE_CUBE";break;case mn:n="ENVMAP_TYPE_CUBE_UV";break}return n}function cf(e){let n="ENVMAP_MODE_REFLECTION";if(e.envMap)switch(e.envMapMode){case kt:n="ENVMAP_MODE_REFRACTION";break}return n}function lf(e){let n="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case Kr:n="ENVMAP_BLENDING_MULTIPLY";break;case qr:n="ENVMAP_BLENDING_MIX";break;case Yr:n="ENVMAP_BLENDING_ADD";break}return n}function ff(e){const n=e.envMapCubeUVHeight;if(n===null)return null;const t=Math.log2(n)-2,i=1/n;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function df(e,n,t,i){const s=e.getContext(),o=t.defines;let h=t.vertexShader,f=t.fragmentShader;const b=of(t),E=sf(t),U=cf(t),R=lf(t),g=ff(t),x=Ql(t),N=Jl(o),C=s.createProgram();let l,r,P=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(l=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N].filter(Kt).join(`
`),l.length>0&&(l+=`
`),r=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N].filter(Kt).join(`
`),r.length>0&&(r+=`
`)):(l=[ji(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+U:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+b:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Kt).join(`
`),r=[ji(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+E:"",t.envMap?"#define "+U:"",t.envMap?"#define "+R:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+b:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ct?"#define TONE_MAPPING":"",t.toneMapping!==Ct?Pe.tonemapping_pars_fragment:"",t.toneMapping!==Ct?$l("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Pe.colorspace_pars_fragment,Kl("linearToOutputTexel",t.outputColorSpace),Zl(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Kt).join(`
`)),h=Wn(h),h=Zi(h,t),h=Qi(h,t),f=Wn(f),f=Zi(f,t),f=Qi(f,t),h=Ji(h),f=Ji(f),t.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,l=[x,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+l,r=["#define varying in",t.glslVersion===ti?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ti?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+r);const M=P+l+h,m=P+r+f,Z=qi(s,s.VERTEX_SHADER,M),D=qi(s,s.FRAGMENT_SHADER,m);s.attachShader(C,Z),s.attachShader(C,D),t.index0AttributeName!==void 0?s.bindAttribLocation(C,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(C,0,"position"),s.linkProgram(C);function y(A){if(e.debug.checkShaderErrors){const Y=s.getProgramInfoLog(C).trim(),G=s.getShaderInfoLog(Z).trim(),X=s.getShaderInfoLog(D).trim();let Q=!0,k=!0;if(s.getProgramParameter(C,s.LINK_STATUS)===!1)if(Q=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,C,Z,D);else{const j=$i(s,Z,"vertex"),F=$i(s,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(C,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+Y+`
`+j+`
`+F)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(G===""||X==="")&&(k=!1);k&&(A.diagnostics={runnable:Q,programLog:Y,vertexShader:{log:G,prefix:l},fragmentShader:{log:X,prefix:r}})}s.deleteShader(Z),s.deleteShader(D),H=new dn(s,C),p=jl(s,C)}let H;this.getUniforms=function(){return H===void 0&&y(this),H};let p;this.getAttributes=function(){return p===void 0&&y(this),p};let d=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return d===!1&&(d=s.getProgramParameter(C,zl)),d},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(C),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Xl++,this.cacheKey=n,this.usedTimes=1,this.program=C,this.vertexShader=Z,this.fragmentShader=D,this}let uf=0;class pf{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n){const t=n.vertexShader,i=n.fragmentShader,s=this._getShaderStage(t),o=this._getShaderStage(i),h=this._getShaderCacheForMaterial(n);return h.has(s)===!1&&(h.add(s),s.usedTimes++),h.has(o)===!1&&(h.add(o),o.usedTimes++),this}remove(n){const t=this.materialCache.get(n);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderID(n){return this._getShaderStage(n.vertexShader).id}getFragmentShaderID(n){return this._getShaderStage(n.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){const t=this.materialCache;let i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){const t=this.shaderCache;let i=t.get(n);return i===void 0&&(i=new hf(n),t.set(n,i)),i}}class hf{constructor(n){this.id=uf++,this.code=n,this.usedTimes=0}}function mf(e,n,t,i,s,o,h){const f=new Jr,b=new pf,E=new Set,U=[],R=s.logarithmicDepthBuffer,g=s.vertexTextures;let x=s.precision;const N={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function C(p){return E.add(p),p===0?"uv":`uv${p}`}function l(p,d,A,Y,G){const X=Y.fog,Q=G.geometry,k=p.isMeshStandardMaterial?Y.environment:null,j=(p.isMeshStandardMaterial?t:n).get(p.envMap||k),F=j&&j.mapping===mn?j.image.height:null,_e=N[p.type];p.precision!==null&&(x=s.getMaxPrecision(p.precision),x!==p.precision&&console.warn("THREE.WebGLProgram.getParameters:",p.precision,"not supported, using",x,"instead."));const Se=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,Le=Se!==void 0?Se.length:0;let Be=0;Q.morphAttributes.position!==void 0&&(Be=1),Q.morphAttributes.normal!==void 0&&(Be=2),Q.morphAttributes.color!==void 0&&(Be=3);let Qe,V,J,pe;if(_e){const ke=mt[_e];Qe=ke.vertexShader,V=ke.fragmentShader}else Qe=p.vertexShader,V=p.fragmentShader,b.update(p),J=b.getVertexShaderID(p),pe=b.getFragmentShaderID(p);const ne=e.getRenderTarget(),Me=e.state.buffers.depth.getReversed(),Ae=G.isInstancedMesh===!0,Ue=G.isBatchedMesh===!0,Ze=!!p.map,ye=!!p.matcap,je=!!j,T=!!p.aoMap,ft=!!p.lightMap,De=!!p.bumpMap,we=!!p.normalMap,ve=!!p.displacementMap,Xe=!!p.emissiveMap,ge=!!p.metalnessMap,u=!!p.roughnessMap,a=p.anisotropy>0,L=p.clearcoat>0,W=p.dispersion>0,q=p.iridescence>0,B=p.sheen>0,he=p.transmission>0,ie=a&&!!p.anisotropyMap,se=L&&!!p.clearcoatMap,Ne=L&&!!p.clearcoatNormalMap,K=L&&!!p.clearcoatRoughnessMap,ce=q&&!!p.iridescenceMap,Ee=q&&!!p.iridescenceThicknessMap,Te=B&&!!p.sheenColorMap,le=B&&!!p.sheenRoughnessMap,Ie=!!p.specularMap,be=!!p.specularColorMap,We=!!p.specularIntensityMap,_=he&&!!p.transmissionMap,te=he&&!!p.thicknessMap,O=!!p.gradientMap,z=!!p.alphaMap,oe=p.alphaTest>0,re=!!p.alphaHash,Re=!!p.extensions;let Je=Ct;p.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Je=e.toneMapping);const it={shaderID:_e,shaderType:p.type,shaderName:p.name,vertexShader:Qe,fragmentShader:V,defines:p.defines,customVertexShaderID:J,customFragmentShaderID:pe,isRawShaderMaterial:p.isRawShaderMaterial===!0,glslVersion:p.glslVersion,precision:x,batching:Ue,batchingColor:Ue&&G._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&G.instanceColor!==null,instancingMorph:Ae&&G.morphTexture!==null,supportsVertexTextures:g,outputColorSpace:ne===null?e.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:gn,alphaToCoverage:!!p.alphaToCoverage,map:Ze,matcap:ye,envMap:je,envMapMode:je&&j.mapping,envMapCubeUVHeight:F,aoMap:T,lightMap:ft,bumpMap:De,normalMap:we,displacementMap:g&&ve,emissiveMap:Xe,normalMapObjectSpace:we&&p.normalMapType===Qr,normalMapTangentSpace:we&&p.normalMapType===Zr,metalnessMap:ge,roughnessMap:u,anisotropy:a,anisotropyMap:ie,clearcoat:L,clearcoatMap:se,clearcoatNormalMap:Ne,clearcoatRoughnessMap:K,dispersion:W,iridescence:q,iridescenceMap:ce,iridescenceThicknessMap:Ee,sheen:B,sheenColorMap:Te,sheenRoughnessMap:le,specularMap:Ie,specularColorMap:be,specularIntensityMap:We,transmission:he,transmissionMap:_,thicknessMap:te,gradientMap:O,opaque:p.transparent===!1&&p.blending===fn&&p.alphaToCoverage===!1,alphaMap:z,alphaTest:oe,alphaHash:re,combine:p.combine,mapUv:Ze&&C(p.map.channel),aoMapUv:T&&C(p.aoMap.channel),lightMapUv:ft&&C(p.lightMap.channel),bumpMapUv:De&&C(p.bumpMap.channel),normalMapUv:we&&C(p.normalMap.channel),displacementMapUv:ve&&C(p.displacementMap.channel),emissiveMapUv:Xe&&C(p.emissiveMap.channel),metalnessMapUv:ge&&C(p.metalnessMap.channel),roughnessMapUv:u&&C(p.roughnessMap.channel),anisotropyMapUv:ie&&C(p.anisotropyMap.channel),clearcoatMapUv:se&&C(p.clearcoatMap.channel),clearcoatNormalMapUv:Ne&&C(p.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&C(p.clearcoatRoughnessMap.channel),iridescenceMapUv:ce&&C(p.iridescenceMap.channel),iridescenceThicknessMapUv:Ee&&C(p.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&C(p.sheenColorMap.channel),sheenRoughnessMapUv:le&&C(p.sheenRoughnessMap.channel),specularMapUv:Ie&&C(p.specularMap.channel),specularColorMapUv:be&&C(p.specularColorMap.channel),specularIntensityMapUv:We&&C(p.specularIntensityMap.channel),transmissionMapUv:_&&C(p.transmissionMap.channel),thicknessMapUv:te&&C(p.thicknessMap.channel),alphaMapUv:z&&C(p.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&(we||a),vertexColors:p.vertexColors,vertexAlphas:p.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!Q.attributes.uv&&(Ze||z),fog:!!X,useFog:p.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:p.flatShading===!0,sizeAttenuation:p.sizeAttenuation===!0,logarithmicDepthBuffer:R,reverseDepthBuffer:Me,skinning:G.isSkinnedMesh===!0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:Le,morphTextureStride:Be,numDirLights:d.directional.length,numPointLights:d.point.length,numSpotLights:d.spot.length,numSpotLightMaps:d.spotLightMap.length,numRectAreaLights:d.rectArea.length,numHemiLights:d.hemi.length,numDirLightShadows:d.directionalShadowMap.length,numPointLightShadows:d.pointShadowMap.length,numSpotLightShadows:d.spotShadowMap.length,numSpotLightShadowsWithMaps:d.numSpotLightShadowsWithMaps,numLightProbes:d.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:p.dithering,shadowMapEnabled:e.shadowMap.enabled&&A.length>0,shadowMapType:e.shadowMap.type,toneMapping:Je,decodeVideoTexture:Ze&&p.map.isVideoTexture===!0&&et.getTransfer(p.map.colorSpace)===Ke,decodeVideoTextureEmissive:Xe&&p.emissiveMap.isVideoTexture===!0&&et.getTransfer(p.emissiveMap.colorSpace)===Ke,premultipliedAlpha:p.premultipliedAlpha,doubleSided:p.side===Et,flipSided:p.side===lt,useDepthPacking:p.depthPacking>=0,depthPacking:p.depthPacking||0,index0AttributeName:p.index0AttributeName,extensionClipCullDistance:Re&&p.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&p.extensions.multiDraw===!0||Ue)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:p.customProgramCacheKey()};return it.vertexUv1s=E.has(1),it.vertexUv2s=E.has(2),it.vertexUv3s=E.has(3),E.clear(),it}function r(p){const d=[];if(p.shaderID?d.push(p.shaderID):(d.push(p.customVertexShaderID),d.push(p.customFragmentShaderID)),p.defines!==void 0)for(const A in p.defines)d.push(A),d.push(p.defines[A]);return p.isRawShaderMaterial===!1&&(P(d,p),M(d,p),d.push(e.outputColorSpace)),d.push(p.customProgramCacheKey),d.join()}function P(p,d){p.push(d.precision),p.push(d.outputColorSpace),p.push(d.envMapMode),p.push(d.envMapCubeUVHeight),p.push(d.mapUv),p.push(d.alphaMapUv),p.push(d.lightMapUv),p.push(d.aoMapUv),p.push(d.bumpMapUv),p.push(d.normalMapUv),p.push(d.displacementMapUv),p.push(d.emissiveMapUv),p.push(d.metalnessMapUv),p.push(d.roughnessMapUv),p.push(d.anisotropyMapUv),p.push(d.clearcoatMapUv),p.push(d.clearcoatNormalMapUv),p.push(d.clearcoatRoughnessMapUv),p.push(d.iridescenceMapUv),p.push(d.iridescenceThicknessMapUv),p.push(d.sheenColorMapUv),p.push(d.sheenRoughnessMapUv),p.push(d.specularMapUv),p.push(d.specularColorMapUv),p.push(d.specularIntensityMapUv),p.push(d.transmissionMapUv),p.push(d.thicknessMapUv),p.push(d.combine),p.push(d.fogExp2),p.push(d.sizeAttenuation),p.push(d.morphTargetsCount),p.push(d.morphAttributeCount),p.push(d.numDirLights),p.push(d.numPointLights),p.push(d.numSpotLights),p.push(d.numSpotLightMaps),p.push(d.numHemiLights),p.push(d.numRectAreaLights),p.push(d.numDirLightShadows),p.push(d.numPointLightShadows),p.push(d.numSpotLightShadows),p.push(d.numSpotLightShadowsWithMaps),p.push(d.numLightProbes),p.push(d.shadowMapType),p.push(d.toneMapping),p.push(d.numClippingPlanes),p.push(d.numClipIntersection),p.push(d.depthPacking)}function M(p,d){f.disableAll(),d.supportsVertexTextures&&f.enable(0),d.instancing&&f.enable(1),d.instancingColor&&f.enable(2),d.instancingMorph&&f.enable(3),d.matcap&&f.enable(4),d.envMap&&f.enable(5),d.normalMapObjectSpace&&f.enable(6),d.normalMapTangentSpace&&f.enable(7),d.clearcoat&&f.enable(8),d.iridescence&&f.enable(9),d.alphaTest&&f.enable(10),d.vertexColors&&f.enable(11),d.vertexAlphas&&f.enable(12),d.vertexUv1s&&f.enable(13),d.vertexUv2s&&f.enable(14),d.vertexUv3s&&f.enable(15),d.vertexTangents&&f.enable(16),d.anisotropy&&f.enable(17),d.alphaHash&&f.enable(18),d.batching&&f.enable(19),d.dispersion&&f.enable(20),d.batchingColor&&f.enable(21),p.push(f.mask),f.disableAll(),d.fog&&f.enable(0),d.useFog&&f.enable(1),d.flatShading&&f.enable(2),d.logarithmicDepthBuffer&&f.enable(3),d.reverseDepthBuffer&&f.enable(4),d.skinning&&f.enable(5),d.morphTargets&&f.enable(6),d.morphNormals&&f.enable(7),d.morphColors&&f.enable(8),d.premultipliedAlpha&&f.enable(9),d.shadowMapEnabled&&f.enable(10),d.doubleSided&&f.enable(11),d.flipSided&&f.enable(12),d.useDepthPacking&&f.enable(13),d.dithering&&f.enable(14),d.transmission&&f.enable(15),d.sheen&&f.enable(16),d.opaque&&f.enable(17),d.pointsUvs&&f.enable(18),d.decodeVideoTexture&&f.enable(19),d.decodeVideoTextureEmissive&&f.enable(20),d.alphaToCoverage&&f.enable(21),p.push(f.mask)}function m(p){const d=N[p.type];let A;if(d){const Y=mt[d];A=$r.clone(Y.uniforms)}else A=p.uniforms;return A}function Z(p,d){let A;for(let Y=0,G=U.length;Y<G;Y++){const X=U[Y];if(X.cacheKey===d){A=X,++A.usedTimes;break}}return A===void 0&&(A=new df(e,d,p,o),U.push(A)),A}function D(p){if(--p.usedTimes===0){const d=U.indexOf(p);U[d]=U[U.length-1],U.pop(),p.destroy()}}function y(p){b.remove(p)}function H(){b.dispose()}return{getParameters:l,getProgramCacheKey:r,getUniforms:m,acquireProgram:Z,releaseProgram:D,releaseShaderCache:y,programs:U,dispose:H}}function _f(){let e=new WeakMap;function n(h){return e.has(h)}function t(h){let f=e.get(h);return f===void 0&&(f={},e.set(h,f)),f}function i(h){e.delete(h)}function s(h,f,b){e.get(h)[f]=b}function o(){e=new WeakMap}return{has:n,get:t,remove:i,update:s,dispose:o}}function gf(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.z!==n.z?e.z-n.z:e.id-n.id}function er(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function tr(){const e=[];let n=0;const t=[],i=[],s=[];function o(){n=0,t.length=0,i.length=0,s.length=0}function h(R,g,x,N,C,l){let r=e[n];return r===void 0?(r={id:R.id,object:R,geometry:g,material:x,groupOrder:N,renderOrder:R.renderOrder,z:C,group:l},e[n]=r):(r.id=R.id,r.object=R,r.geometry=g,r.material=x,r.groupOrder=N,r.renderOrder=R.renderOrder,r.z=C,r.group=l),n++,r}function f(R,g,x,N,C,l){const r=h(R,g,x,N,C,l);x.transmission>0?i.push(r):x.transparent===!0?s.push(r):t.push(r)}function b(R,g,x,N,C,l){const r=h(R,g,x,N,C,l);x.transmission>0?i.unshift(r):x.transparent===!0?s.unshift(r):t.unshift(r)}function E(R,g){t.length>1&&t.sort(R||gf),i.length>1&&i.sort(g||er),s.length>1&&s.sort(g||er)}function U(){for(let R=n,g=e.length;R<g;R++){const x=e[R];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:t,transmissive:i,transparent:s,init:o,push:f,unshift:b,finish:U,sort:E}}function vf(){let e=new WeakMap;function n(i,s){const o=e.get(i);let h;return o===void 0?(h=new tr,e.set(i,[h])):s>=o.length?(h=new tr,o.push(h)):h=o[s],h}function t(){e=new WeakMap}return{get:n,dispose:t}}function Ef(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={direction:new Ve,color:new $e};break;case"SpotLight":t={position:new Ve,direction:new Ve,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Ve,color:new $e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Ve,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":t={color:new $e,position:new Ve,halfWidth:new Ve,halfHeight:new Ve};break}return e[n.id]=t,t}}}function Sf(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}let Mf=0;function Tf(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function xf(e){const n=new Ef,t=Sf(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let E=0;E<9;E++)i.probe.push(new Ve);const s=new Ve,o=new Vt,h=new Vt;function f(E){let U=0,R=0,g=0;for(let p=0;p<9;p++)i.probe[p].set(0,0,0);let x=0,N=0,C=0,l=0,r=0,P=0,M=0,m=0,Z=0,D=0,y=0;E.sort(Tf);for(let p=0,d=E.length;p<d;p++){const A=E[p],Y=A.color,G=A.intensity,X=A.distance,Q=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)U+=Y.r*G,R+=Y.g*G,g+=Y.b*G;else if(A.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(A.sh.coefficients[k],G);y++}else if(A.isDirectionalLight){const k=n.get(A);if(k.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const j=A.shadow,F=t.get(A);F.shadowIntensity=j.intensity,F.shadowBias=j.bias,F.shadowNormalBias=j.normalBias,F.shadowRadius=j.radius,F.shadowMapSize=j.mapSize,i.directionalShadow[x]=F,i.directionalShadowMap[x]=Q,i.directionalShadowMatrix[x]=A.shadow.matrix,P++}i.directional[x]=k,x++}else if(A.isSpotLight){const k=n.get(A);k.position.setFromMatrixPosition(A.matrixWorld),k.color.copy(Y).multiplyScalar(G),k.distance=X,k.coneCos=Math.cos(A.angle),k.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),k.decay=A.decay,i.spot[C]=k;const j=A.shadow;if(A.map&&(i.spotLightMap[Z]=A.map,Z++,j.updateMatrices(A),A.castShadow&&D++),i.spotLightMatrix[C]=j.matrix,A.castShadow){const F=t.get(A);F.shadowIntensity=j.intensity,F.shadowBias=j.bias,F.shadowNormalBias=j.normalBias,F.shadowRadius=j.radius,F.shadowMapSize=j.mapSize,i.spotShadow[C]=F,i.spotShadowMap[C]=Q,m++}C++}else if(A.isRectAreaLight){const k=n.get(A);k.color.copy(Y).multiplyScalar(G),k.halfWidth.set(A.width*.5,0,0),k.halfHeight.set(0,A.height*.5,0),i.rectArea[l]=k,l++}else if(A.isPointLight){const k=n.get(A);if(k.color.copy(A.color).multiplyScalar(A.intensity),k.distance=A.distance,k.decay=A.decay,A.castShadow){const j=A.shadow,F=t.get(A);F.shadowIntensity=j.intensity,F.shadowBias=j.bias,F.shadowNormalBias=j.normalBias,F.shadowRadius=j.radius,F.shadowMapSize=j.mapSize,F.shadowCameraNear=j.camera.near,F.shadowCameraFar=j.camera.far,i.pointShadow[N]=F,i.pointShadowMap[N]=Q,i.pointShadowMatrix[N]=A.shadow.matrix,M++}i.point[N]=k,N++}else if(A.isHemisphereLight){const k=n.get(A);k.skyColor.copy(A.color).multiplyScalar(G),k.groundColor.copy(A.groundColor).multiplyScalar(G),i.hemi[r]=k,r++}}l>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ee.LTC_FLOAT_1,i.rectAreaLTC2=ee.LTC_FLOAT_2):(i.rectAreaLTC1=ee.LTC_HALF_1,i.rectAreaLTC2=ee.LTC_HALF_2)),i.ambient[0]=U,i.ambient[1]=R,i.ambient[2]=g;const H=i.hash;(H.directionalLength!==x||H.pointLength!==N||H.spotLength!==C||H.rectAreaLength!==l||H.hemiLength!==r||H.numDirectionalShadows!==P||H.numPointShadows!==M||H.numSpotShadows!==m||H.numSpotMaps!==Z||H.numLightProbes!==y)&&(i.directional.length=x,i.spot.length=C,i.rectArea.length=l,i.point.length=N,i.hemi.length=r,i.directionalShadow.length=P,i.directionalShadowMap.length=P,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=m,i.spotShadowMap.length=m,i.directionalShadowMatrix.length=P,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=m+Z-D,i.spotLightMap.length=Z,i.numSpotLightShadowsWithMaps=D,i.numLightProbes=y,H.directionalLength=x,H.pointLength=N,H.spotLength=C,H.rectAreaLength=l,H.hemiLength=r,H.numDirectionalShadows=P,H.numPointShadows=M,H.numSpotShadows=m,H.numSpotMaps=Z,H.numLightProbes=y,i.version=Mf++)}function b(E,U){let R=0,g=0,x=0,N=0,C=0;const l=U.matrixWorldInverse;for(let r=0,P=E.length;r<P;r++){const M=E[r];if(M.isDirectionalLight){const m=i.directional[R];m.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),m.direction.sub(s),m.direction.transformDirection(l),R++}else if(M.isSpotLight){const m=i.spot[x];m.position.setFromMatrixPosition(M.matrixWorld),m.position.applyMatrix4(l),m.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),m.direction.sub(s),m.direction.transformDirection(l),x++}else if(M.isRectAreaLight){const m=i.rectArea[N];m.position.setFromMatrixPosition(M.matrixWorld),m.position.applyMatrix4(l),h.identity(),o.copy(M.matrixWorld),o.premultiply(l),h.extractRotation(o),m.halfWidth.set(M.width*.5,0,0),m.halfHeight.set(0,M.height*.5,0),m.halfWidth.applyMatrix4(h),m.halfHeight.applyMatrix4(h),N++}else if(M.isPointLight){const m=i.point[g];m.position.setFromMatrixPosition(M.matrixWorld),m.position.applyMatrix4(l),g++}else if(M.isHemisphereLight){const m=i.hemi[C];m.direction.setFromMatrixPosition(M.matrixWorld),m.direction.transformDirection(l),C++}}}return{setup:f,setupView:b,state:i}}function nr(e){const n=new xf(e),t=[],i=[];function s(U){E.camera=U,t.length=0,i.length=0}function o(U){t.push(U)}function h(U){i.push(U)}function f(){n.setup(t)}function b(U){n.setupView(t,U)}const E={lightsArray:t,shadowsArray:i,camera:null,lights:n,transmissionRenderTarget:{}};return{init:s,state:E,setupLights:f,setupLightsView:b,pushLight:o,pushShadow:h}}function Af(e){let n=new WeakMap;function t(s,o=0){const h=n.get(s);let f;return h===void 0?(f=new nr(e),n.set(s,[f])):o>=h.length?(f=new nr(e),h.push(f)):f=h[o],f}function i(){n=new WeakMap}return{get:t,dispose:i}}const Rf=`
void main() {
gl_Position = vec4( position, 1.0 );
}
`,Cf=`
uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
const float samples = float( VSM_SAMPLES );
float mean = 0.0;
float squared_mean = 0.0;
float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
for ( float i = 0.0; i < samples; i ++ ) {
float uvOffset = uvStart + i * uvStride;
#ifdef HORIZONTAL_PASS
vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
mean += distribution.x;
squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
#else
float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
mean += depth;
squared_mean += depth * depth;
#endif
}
mean = mean / samples;
squared_mean = squared_mean / samples;
float std_dev = sqrt( squared_mean - mean * mean );
gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}
`;function bf(e,n,t){let i=new mr;const s=new st,o=new st,h=new ot,f=new jr({depthPacking:ea}),b=new ta,E={},U=t.maxTextureSize,R={[Zt]:lt,[lt]:Zt,[Et]:Et},g=new bt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new st},radius:{value:4}},vertexShader:Rf,fragmentShader:Cf}),x=g.clone();x.defines.HORIZONTAL_PASS=1;const N=new cr;N.setAttribute("position",new ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new St(N,g),l=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pr;let r=this.type;this.render=function(D,y,H){if(l.enabled===!1||l.autoUpdate===!1&&l.needsUpdate===!1||D.length===0)return;const p=e.getRenderTarget(),d=e.getActiveCubeFace(),A=e.getActiveMipmapLevel(),Y=e.state;Y.setBlending(Rt),Y.buffers.color.setClear(1,1,1,1),Y.buffers.depth.setTest(!0),Y.setScissorTest(!1);const G=r!==vt&&this.type===vt,X=r===vt&&this.type!==vt;for(let Q=0,k=D.length;Q<k;Q++){const j=D[Q],F=j.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);const _e=F.getFrameExtents();if(s.multiply(_e),o.copy(F.mapSize),(s.x>U||s.y>U)&&(s.x>U&&(o.x=Math.floor(U/_e.x),s.x=o.x*_e.x,F.mapSize.x=o.x),s.y>U&&(o.y=Math.floor(U/_e.y),s.y=o.y*_e.y,F.mapSize.y=o.y)),F.map===null||G===!0||X===!0){const Le=this.type!==vt?{minFilter:$t,magFilter:$t}:{};F.map!==null&&F.map.dispose(),F.map=new Nt(s.x,s.y,Le),F.map.texture.name=j.name+".shadowMap",F.camera.updateProjectionMatrix()}e.setRenderTarget(F.map),e.clear();const Se=F.getViewportCount();for(let Le=0;Le<Se;Le++){const Be=F.getViewport(Le);h.set(o.x*Be.x,o.y*Be.y,o.x*Be.z,o.y*Be.w),Y.viewport(h),F.updateMatrices(j,Le),i=F.getFrustum(),m(y,H,F.camera,j,this.type)}F.isPointLightShadow!==!0&&this.type===vt&&P(F,H),F.needsUpdate=!1}r=this.type,l.needsUpdate=!1,e.setRenderTarget(p,d,A)};function P(D,y){const H=n.update(C);g.defines.VSM_SAMPLES!==D.blurSamples&&(g.defines.VSM_SAMPLES=D.blurSamples,x.defines.VSM_SAMPLES=D.blurSamples,g.needsUpdate=!0,x.needsUpdate=!0),D.mapPass===null&&(D.mapPass=new Nt(s.x,s.y)),g.uniforms.shadow_pass.value=D.map.texture,g.uniforms.resolution.value=D.mapSize,g.uniforms.radius.value=D.radius,e.setRenderTarget(D.mapPass),e.clear(),e.renderBufferDirect(y,null,H,g,C,null),x.uniforms.shadow_pass.value=D.mapPass.texture,x.uniforms.resolution.value=D.mapSize,x.uniforms.radius.value=D.radius,e.setRenderTarget(D.map),e.clear(),e.renderBufferDirect(y,null,H,x,C,null)}function M(D,y,H,p){let d=null;const A=H.isPointLight===!0?D.customDistanceMaterial:D.customDepthMaterial;if(A!==void 0)d=A;else if(d=H.isPointLight===!0?b:f,e.localClippingEnabled&&y.clipShadows===!0&&Array.isArray(y.clippingPlanes)&&y.clippingPlanes.length!==0||y.displacementMap&&y.displacementScale!==0||y.alphaMap&&y.alphaTest>0||y.map&&y.alphaTest>0){const Y=d.uuid,G=y.uuid;let X=E[Y];X===void 0&&(X={},E[Y]=X);let Q=X[G];Q===void 0&&(Q=d.clone(),X[G]=Q,y.addEventListener("dispose",Z)),d=Q}if(d.visible=y.visible,d.wireframe=y.wireframe,p===vt?d.side=y.shadowSide!==null?y.shadowSide:y.side:d.side=y.shadowSide!==null?y.shadowSide:R[y.side],d.alphaMap=y.alphaMap,d.alphaTest=y.alphaTest,d.map=y.map,d.clipShadows=y.clipShadows,d.clippingPlanes=y.clippingPlanes,d.clipIntersection=y.clipIntersection,d.displacementMap=y.displacementMap,d.displacementScale=y.displacementScale,d.displacementBias=y.displacementBias,d.wireframeLinewidth=y.wireframeLinewidth,d.linewidth=y.linewidth,H.isPointLight===!0&&d.isMeshDistanceMaterial===!0){const Y=e.properties.get(d);Y.light=H}return d}function m(D,y,H,p,d){if(D.visible===!1)return;if(D.layers.test(y.layers)&&(D.isMesh||D.isLine||D.isPoints)&&(D.castShadow||D.receiveShadow&&d===vt)&&(!D.frustumCulled||i.intersectsObject(D))){D.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,D.matrixWorld);const G=n.update(D),X=D.material;if(Array.isArray(X)){const Q=G.groups;for(let k=0,j=Q.length;k<j;k++){const F=Q[k],_e=X[F.materialIndex];if(_e&&_e.visible){const Se=M(D,_e,p,d);D.onBeforeShadow(e,D,y,H,G,Se,F),e.renderBufferDirect(H,null,G,Se,D,F),D.onAfterShadow(e,D,y,H,G,Se,F)}}}else if(X.visible){const Q=M(D,X,p,d);D.onBeforeShadow(e,D,y,H,G,Q,null),e.renderBufferDirect(H,null,G,Q,D,null),D.onAfterShadow(e,D,y,H,G,Q,null)}}const Y=D.children;for(let G=0,X=Y.length;G<X;G++)m(Y[G],y,H,p,d)}function Z(D){D.target.removeEventListener("dispose",Z);for(const H in E){const p=E[H],d=D.target.uuid;d in p&&(p[d].dispose(),delete p[d])}}}const Pf={[kn]:Vn,[Hn]:Fn,[Gn]:On,[un]:Bn,[Vn]:kn,[Fn]:Hn,[On]:Gn,[Bn]:un};function Lf(e,n){function t(){let _=!1;const te=new ot;let O=null;const z=new ot(0,0,0,0);return{setMask:function(oe){O!==oe&&!_&&(e.colorMask(oe,oe,oe,oe),O=oe)},setLocked:function(oe){_=oe},setClear:function(oe,re,Re,Je,it){it===!0&&(oe*=Je,re*=Je,Re*=Je),te.set(oe,re,Re,Je),z.equals(te)===!1&&(e.clearColor(oe,re,Re,Je),z.copy(te))},reset:function(){_=!1,O=null,z.set(-1,0,0,0)}}}function i(){let _=!1,te=!1,O=null,z=null,oe=null;return{setReversed:function(re){if(te!==re){const Re=n.get("EXT_clip_control");te?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT);const Je=oe;oe=null,this.setClear(Je)}te=re},getReversed:function(){return te},setTest:function(re){re?ne(e.DEPTH_TEST):Me(e.DEPTH_TEST)},setMask:function(re){O!==re&&!_&&(e.depthMask(re),O=re)},setFunc:function(re){if(te&&(re=Pf[re]),z!==re){switch(re){case kn:e.depthFunc(e.NEVER);break;case Vn:e.depthFunc(e.ALWAYS);break;case Hn:e.depthFunc(e.LESS);break;case un:e.depthFunc(e.LEQUAL);break;case Gn:e.depthFunc(e.EQUAL);break;case Bn:e.depthFunc(e.GEQUAL);break;case Fn:e.depthFunc(e.GREATER);break;case On:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}z=re}},setLocked:function(re){_=re},setClear:function(re){oe!==re&&(te&&(re=1-re),e.clearDepth(re),oe=re)},reset:function(){_=!1,O=null,z=null,oe=null,te=!1}}}function s(){let _=!1,te=null,O=null,z=null,oe=null,re=null,Re=null,Je=null,it=null;return{setTest:function(ke){_||(ke?ne(e.STENCIL_TEST):Me(e.STENCIL_TEST))},setMask:function(ke){te!==ke&&!_&&(e.stencilMask(ke),te=ke)},setFunc:function(ke,ut,_t){(O!==ke||z!==ut||oe!==_t)&&(e.stencilFunc(ke,ut,_t),O=ke,z=ut,oe=_t)},setOp:function(ke,ut,_t){(re!==ke||Re!==ut||Je!==_t)&&(e.stencilOp(ke,ut,_t),re=ke,Re=ut,Je=_t)},setLocked:function(ke){_=ke},setClear:function(ke){it!==ke&&(e.clearStencil(ke),it=ke)},reset:function(){_=!1,te=null,O=null,z=null,oe=null,re=null,Re=null,Je=null,it=null}}}const o=new t,h=new i,f=new s,b=new WeakMap,E=new WeakMap;let U={},R={},g=new WeakMap,x=[],N=null,C=!1,l=null,r=null,P=null,M=null,m=null,Z=null,D=null,y=new $e(0,0,0),H=0,p=!1,d=null,A=null,Y=null,G=null,X=null;const Q=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,j=0;const F=e.getParameter(e.VERSION);F.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(F)[1]),k=j>=1):F.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),k=j>=2);let _e=null,Se={};const Le=e.getParameter(e.SCISSOR_BOX),Be=e.getParameter(e.VIEWPORT),Qe=new ot().fromArray(Le),V=new ot().fromArray(Be);function J(_,te,O,z){const oe=new Uint8Array(4),re=e.createTexture();e.bindTexture(_,re),e.texParameteri(_,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(_,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Re=0;Re<O;Re++)_===e.TEXTURE_3D||_===e.TEXTURE_2D_ARRAY?e.texImage3D(te,0,e.RGBA,1,1,z,0,e.RGBA,e.UNSIGNED_BYTE,oe):e.texImage2D(te+Re,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,oe);return re}const pe={};pe[e.TEXTURE_2D]=J(e.TEXTURE_2D,e.TEXTURE_2D,1),pe[e.TEXTURE_CUBE_MAP]=J(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),pe[e.TEXTURE_2D_ARRAY]=J(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),pe[e.TEXTURE_3D]=J(e.TEXTURE_3D,e.TEXTURE_3D,1,1),o.setClear(0,0,0,1),h.setClear(1),f.setClear(0),ne(e.DEPTH_TEST),h.setFunc(un),De(!1),we(ni),ne(e.CULL_FACE),T(Rt);function ne(_){U[_]!==!0&&(e.enable(_),U[_]=!0)}function Me(_){U[_]!==!1&&(e.disable(_),U[_]=!1)}function Ae(_,te){return R[_]!==te?(e.bindFramebuffer(_,te),R[_]=te,_===e.DRAW_FRAMEBUFFER&&(R[e.FRAMEBUFFER]=te),_===e.FRAMEBUFFER&&(R[e.DRAW_FRAMEBUFFER]=te),!0):!1}function Ue(_,te){let O=x,z=!1;if(_){O=g.get(te),O===void 0&&(O=[],g.set(te,O));const oe=_.textures;if(O.length!==oe.length||O[0]!==e.COLOR_ATTACHMENT0){for(let re=0,Re=oe.length;re<Re;re++)O[re]=e.COLOR_ATTACHMENT0+re;O.length=oe.length,z=!0}}else O[0]!==e.BACK&&(O[0]=e.BACK,z=!0);z&&e.drawBuffers(O)}function Ze(_){return N!==_?(e.useProgram(_),N=_,!0):!1}const ye={[Yt]:e.FUNC_ADD,[ia]:e.FUNC_SUBTRACT,[na]:e.FUNC_REVERSE_SUBTRACT};ye[Ta]=e.MIN,ye[xa]=e.MAX;const je={[va]:e.ZERO,[ga]:e.ONE,[_a]:e.SRC_COLOR,[ma]:e.SRC_ALPHA,[ha]:e.SRC_ALPHA_SATURATE,[pa]:e.DST_COLOR,[ua]:e.DST_ALPHA,[da]:e.ONE_MINUS_SRC_COLOR,[fa]:e.ONE_MINUS_SRC_ALPHA,[la]:e.ONE_MINUS_DST_COLOR,[ca]:e.ONE_MINUS_DST_ALPHA,[sa]:e.CONSTANT_COLOR,[oa]:e.ONE_MINUS_CONSTANT_COLOR,[aa]:e.CONSTANT_ALPHA,[ra]:e.ONE_MINUS_CONSTANT_ALPHA};function T(_,te,O,z,oe,re,Re,Je,it,ke){if(_===Rt){C===!0&&(Me(e.BLEND),C=!1);return}if(C===!1&&(ne(e.BLEND),C=!0),_!==Ma){if(_!==l||ke!==p){if((r!==Yt||m!==Yt)&&(e.blendEquation(e.FUNC_ADD),r=Yt,m=Yt),ke)switch(_){case fn:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case ai:e.blendFunc(e.ONE,e.ONE);break;case ri:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case ii:e.blendFuncSeparate(e.ZERO,e.SRC_COLOR,e.ZERO,e.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",_);break}else switch(_){case fn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case ai:e.blendFunc(e.SRC_ALPHA,e.ONE);break;case ri:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case ii:e.blendFunc(e.ZERO,e.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",_);break}P=null,M=null,Z=null,D=null,y.set(0,0,0),H=0,l=_,p=ke}return}oe=oe||te,re=re||O,Re=Re||z,(te!==r||oe!==m)&&(e.blendEquationSeparate(ye[te],ye[oe]),r=te,m=oe),(O!==P||z!==M||re!==Z||Re!==D)&&(e.blendFuncSeparate(je[O],je[z],je[re],je[Re]),P=O,M=z,Z=re,D=Re),(Je.equals(y)===!1||it!==H)&&(e.blendColor(Je.r,Je.g,Je.b,it),y.copy(Je),H=it),l=_,p=!1}function ft(_,te){_.side===Et?Me(e.CULL_FACE):ne(e.CULL_FACE);let O=_.side===lt;te&&(O=!O),De(O),_.blending===fn&&_.transparent===!1?T(Rt):T(_.blending,_.blendEquation,_.blendSrc,_.blendDst,_.blendEquationAlpha,_.blendSrcAlpha,_.blendDstAlpha,_.blendColor,_.blendAlpha,_.premultipliedAlpha),h.setFunc(_.depthFunc),h.setTest(_.depthTest),h.setMask(_.depthWrite),o.setMask(_.colorWrite);const z=_.stencilWrite;f.setTest(z),z&&(f.setMask(_.stencilWriteMask),f.setFunc(_.stencilFunc,_.stencilRef,_.stencilFuncMask),f.setOp(_.stencilFail,_.stencilZFail,_.stencilZPass)),Xe(_.polygonOffset,_.polygonOffsetFactor,_.polygonOffsetUnits),_.alphaToCoverage===!0?ne(e.SAMPLE_ALPHA_TO_COVERAGE):Me(e.SAMPLE_ALPHA_TO_COVERAGE)}function De(_){d!==_&&(_?e.frontFace(e.CW):e.frontFace(e.CCW),d=_)}function we(_){_!==Ea?(ne(e.CULL_FACE),_!==A&&(_===ni?e.cullFace(e.BACK):_===Sa?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Me(e.CULL_FACE),A=_}function ve(_){_!==Y&&(k&&e.lineWidth(_),Y=_)}function Xe(_,te,O){_?(ne(e.POLYGON_OFFSET_FILL),(G!==te||X!==O)&&(e.polygonOffset(te,O),G=te,X=O)):Me(e.POLYGON_OFFSET_FILL)}function ge(_){_?ne(e.SCISSOR_TEST):Me(e.SCISSOR_TEST)}function u(_){_===void 0&&(_=e.TEXTURE0+Q-1),_e!==_&&(e.activeTexture(_),_e=_)}function a(_,te,O){O===void 0&&(_e===null?O=e.TEXTURE0+Q-1:O=_e);let z=Se[O];z===void 0&&(z={type:void 0,texture:void 0},Se[O]=z),(z.type!==_||z.texture!==te)&&(_e!==O&&(e.activeTexture(O),_e=O),e.bindTexture(_,te||pe[_]),z.type=_,z.texture=te)}function L(){const _=Se[_e];_!==void 0&&_.type!==void 0&&(e.bindTexture(_.type,null),_.type=void 0,_.texture=void 0)}function W(){try{e.compressedTexImage2D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function q(){try{e.compressedTexImage3D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function B(){try{e.texSubImage2D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function he(){try{e.texSubImage3D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function ie(){try{e.compressedTexSubImage2D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function se(){try{e.compressedTexSubImage3D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function Ne(){try{e.texStorage2D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function K(){try{e.texStorage3D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function ce(){try{e.texImage2D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function Ee(){try{e.texImage3D.apply(e,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function Te(_){Qe.equals(_)===!1&&(e.scissor(_.x,_.y,_.z,_.w),Qe.copy(_))}function le(_){V.equals(_)===!1&&(e.viewport(_.x,_.y,_.z,_.w),V.copy(_))}function Ie(_,te){let O=E.get(te);O===void 0&&(O=new WeakMap,E.set(te,O));let z=O.get(_);z===void 0&&(z=e.getUniformBlockIndex(te,_.name),O.set(_,z))}function be(_,te){const z=E.get(te).get(_);b.get(te)!==z&&(e.uniformBlockBinding(te,z,_.__bindingPointIndex),b.set(te,z))}function We(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),h.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),U={},_e=null,Se={},R={},g=new WeakMap,x=[],N=null,C=!1,l=null,r=null,P=null,M=null,m=null,Z=null,D=null,y=new $e(0,0,0),H=0,p=!1,d=null,A=null,Y=null,G=null,X=null,Qe.set(0,0,e.canvas.width,e.canvas.height),V.set(0,0,e.canvas.width,e.canvas.height),o.reset(),h.reset(),f.reset()}return{buffers:{color:o,depth:h,stencil:f},enable:ne,disable:Me,bindFramebuffer:Ae,drawBuffers:Ue,useProgram:Ze,setBlending:T,setMaterial:ft,setFlipSided:De,setCullFace:we,setLineWidth:ve,setPolygonOffset:Xe,setScissorTest:ge,activeTexture:u,bindTexture:a,unbindTexture:L,compressedTexImage2D:W,compressedTexImage3D:q,texImage2D:ce,texImage3D:Ee,updateUBOMapping:Ie,uniformBlockBinding:be,texStorage2D:Ne,texStorage3D:K,texSubImage2D:B,texSubImage3D:he,compressedTexSubImage2D:ie,compressedTexSubImage3D:se,scissor:Te,viewport:le,reset:We}}function Uf(e,n,t,i,s,o,h){const f=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,b=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),E=new st,U=new WeakMap;let R;const g=new WeakMap;let x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function N(u,a){return x?new OffscreenCanvas(u,a):Na("canvas")}function C(u,a,L){let W=1;const q=ge(u);if((q.width>L||q.height>L)&&(W=L/Math.max(q.width,q.height)),W<1)if(typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&u instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&u instanceof ImageBitmap||typeof VideoFrame<"u"&&u instanceof VideoFrame){const B=Math.floor(W*q.width),he=Math.floor(W*q.height);R===void 0&&(R=N(B,he));const ie=a?N(B,he):R;return ie.width=B,ie.height=he,ie.getContext("2d").drawImage(u,0,0,B,he),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+B+"x"+he+")."),ie}else return"data"in u&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),u;return u}function l(u){return u.generateMipmaps}function r(u){e.generateMipmap(u)}function P(u){return u.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:u.isWebGL3DRenderTarget?e.TEXTURE_3D:u.isWebGLArrayRenderTarget||u.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function M(u,a,L,W,q=!1){if(u!==null){if(e[u]!==void 0)return e[u];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+u+"'")}let B=a;if(a===e.RED&&(L===e.FLOAT&&(B=e.R32F),L===e.HALF_FLOAT&&(B=e.R16F),L===e.UNSIGNED_BYTE&&(B=e.R8)),a===e.RED_INTEGER&&(L===e.UNSIGNED_BYTE&&(B=e.R8UI),L===e.UNSIGNED_SHORT&&(B=e.R16UI),L===e.UNSIGNED_INT&&(B=e.R32UI),L===e.BYTE&&(B=e.R8I),L===e.SHORT&&(B=e.R16I),L===e.INT&&(B=e.R32I)),a===e.RG&&(L===e.FLOAT&&(B=e.RG32F),L===e.HALF_FLOAT&&(B=e.RG16F),L===e.UNSIGNED_BYTE&&(B=e.RG8)),a===e.RG_INTEGER&&(L===e.UNSIGNED_BYTE&&(B=e.RG8UI),L===e.UNSIGNED_SHORT&&(B=e.RG16UI),L===e.UNSIGNED_INT&&(B=e.RG32UI),L===e.BYTE&&(B=e.RG8I),L===e.SHORT&&(B=e.RG16I),L===e.INT&&(B=e.RG32I)),a===e.RGB_INTEGER&&(L===e.UNSIGNED_BYTE&&(B=e.RGB8UI),L===e.UNSIGNED_SHORT&&(B=e.RGB16UI),L===e.UNSIGNED_INT&&(B=e.RGB32UI),L===e.BYTE&&(B=e.RGB8I),L===e.SHORT&&(B=e.RGB16I),L===e.INT&&(B=e.RGB32I)),a===e.RGBA_INTEGER&&(L===e.UNSIGNED_BYTE&&(B=e.RGBA8UI),L===e.UNSIGNED_SHORT&&(B=e.RGBA16UI),L===e.UNSIGNED_INT&&(B=e.RGBA32UI),L===e.BYTE&&(B=e.RGBA8I),L===e.SHORT&&(B=e.RGBA16I),L===e.INT&&(B=e.RGBA32I)),a===e.RGB&&L===e.UNSIGNED_INT_5_9_9_9_REV&&(B=e.RGB9_E5),a===e.RGBA){const he=q?hr:et.getTransfer(W);L===e.FLOAT&&(B=e.RGBA32F),L===e.HALF_FLOAT&&(B=e.RGBA16F),L===e.UNSIGNED_BYTE&&(B=he===Ke?e.SRGB8_ALPHA8:e.RGBA8),L===e.UNSIGNED_SHORT_4_4_4_4&&(B=e.RGBA4),L===e.UNSIGNED_SHORT_5_5_5_1&&(B=e.RGB5_A1)}return(B===e.R16F||B===e.R32F||B===e.RG16F||B===e.RG32F||B===e.RGBA16F||B===e.RGBA32F)&&n.get("EXT_color_buffer_float"),B}function m(u,a){let L;return u?a===null||a===Jt||a===jt?L=e.DEPTH24_STENCIL8:a===It?L=e.DEPTH32F_STENCIL8:a===hn&&(L=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):a===null||a===Jt||a===jt?L=e.DEPTH_COMPONENT24:a===It?L=e.DEPTH_COMPONENT32F:a===hn&&(L=e.DEPTH_COMPONENT16),L}function Z(u,a){return l(u)===!0||u.isFramebufferTexture&&u.minFilter!==$t&&u.minFilter!==At?Math.log2(Math.max(a.width,a.height))+1:u.mipmaps!==void 0&&u.mipmaps.length>0?u.mipmaps.length:u.isCompressedTexture&&Array.isArray(u.image)?a.mipmaps.length:1}function D(u){const a=u.target;a.removeEventListener("dispose",D),H(a),a.isVideoTexture&&U.delete(a)}function y(u){const a=u.target;a.removeEventListener("dispose",y),d(a)}function H(u){const a=i.get(u);if(a.__webglInit===void 0)return;const L=u.source,W=g.get(L);if(W){const q=W[a.__cacheKey];q.usedTimes--,q.usedTimes===0&&p(u),Object.keys(W).length===0&&g.delete(L)}i.remove(u)}function p(u){const a=i.get(u);e.deleteTexture(a.__webglTexture);const L=u.source,W=g.get(L);delete W[a.__cacheKey],h.memory.textures--}function d(u){const a=i.get(u);if(u.depthTexture&&(u.depthTexture.dispose(),i.remove(u.depthTexture)),u.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(a.__webglFramebuffer[W]))for(let q=0;q<a.__webglFramebuffer[W].length;q++)e.deleteFramebuffer(a.__webglFramebuffer[W][q]);else e.deleteFramebuffer(a.__webglFramebuffer[W]);a.__webglDepthbuffer&&e.deleteRenderbuffer(a.__webglDepthbuffer[W])}else{if(Array.isArray(a.__webglFramebuffer))for(let W=0;W<a.__webglFramebuffer.length;W++)e.deleteFramebuffer(a.__webglFramebuffer[W]);else e.deleteFramebuffer(a.__webglFramebuffer);if(a.__webglDepthbuffer&&e.deleteRenderbuffer(a.__webglDepthbuffer),a.__webglMultisampledFramebuffer&&e.deleteFramebuffer(a.__webglMultisampledFramebuffer),a.__webglColorRenderbuffer)for(let W=0;W<a.__webglColorRenderbuffer.length;W++)a.__webglColorRenderbuffer[W]&&e.deleteRenderbuffer(a.__webglColorRenderbuffer[W]);a.__webglDepthRenderbuffer&&e.deleteRenderbuffer(a.__webglDepthRenderbuffer)}const L=u.textures;for(let W=0,q=L.length;W<q;W++){const B=i.get(L[W]);B.__webglTexture&&(e.deleteTexture(B.__webglTexture),h.memory.textures--),i.remove(L[W])}i.remove(u)}let A=0;function Y(){A=0}function G(){const u=A;return u>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+u+" texture units while this GPU supports only "+s.maxTextures),A+=1,u}function X(u){const a=[];return a.push(u.wrapS),a.push(u.wrapT),a.push(u.wrapR||0),a.push(u.magFilter),a.push(u.minFilter),a.push(u.anisotropy),a.push(u.internalFormat),a.push(u.format),a.push(u.type),a.push(u.generateMipmaps),a.push(u.premultiplyAlpha),a.push(u.flipY),a.push(u.unpackAlignment),a.push(u.colorSpace),a.join()}function Q(u,a){const L=i.get(u);if(u.isVideoTexture&&ve(u),u.isRenderTargetTexture===!1&&u.version>0&&L.__version!==u.version){const W=u.image;if(W===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V(L,u,a);return}}t.bindTexture(e.TEXTURE_2D,L.__webglTexture,e.TEXTURE0+a)}function k(u,a){const L=i.get(u);if(u.version>0&&L.__version!==u.version){V(L,u,a);return}t.bindTexture(e.TEXTURE_2D_ARRAY,L.__webglTexture,e.TEXTURE0+a)}function j(u,a){const L=i.get(u);if(u.version>0&&L.__version!==u.version){V(L,u,a);return}t.bindTexture(e.TEXTURE_3D,L.__webglTexture,e.TEXTURE0+a)}function F(u,a){const L=i.get(u);if(u.version>0&&L.__version!==u.version){J(L,u,a);return}t.bindTexture(e.TEXTURE_CUBE_MAP,L.__webglTexture,e.TEXTURE0+a)}const _e={[Ca]:e.REPEAT,[Ra]:e.CLAMP_TO_EDGE,[Aa]:e.MIRRORED_REPEAT},Se={[$t]:e.NEAREST,[ba]:e.NEAREST_MIPMAP_NEAREST,[nn]:e.NEAREST_MIPMAP_LINEAR,[At]:e.LINEAR,[Sn]:e.LINEAR_MIPMAP_NEAREST,[Gt]:e.LINEAR_MIPMAP_LINEAR},Le={[ya]:e.NEVER,[Ia]:e.ALWAYS,[wa]:e.LESS,[fr]:e.LEQUAL,[Da]:e.EQUAL,[Ua]:e.GEQUAL,[La]:e.GREATER,[Pa]:e.NOTEQUAL};function Be(u,a){if(a.type===It&&n.has("OES_texture_float_linear")===!1&&(a.magFilter===At||a.magFilter===Sn||a.magFilter===nn||a.magFilter===Gt||a.minFilter===At||a.minFilter===Sn||a.minFilter===nn||a.minFilter===Gt)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(u,e.TEXTURE_WRAP_S,_e[a.wrapS]),e.texParameteri(u,e.TEXTURE_WRAP_T,_e[a.wrapT]),(u===e.TEXTURE_3D||u===e.TEXTURE_2D_ARRAY)&&e.texParameteri(u,e.TEXTURE_WRAP_R,_e[a.wrapR]),e.texParameteri(u,e.TEXTURE_MAG_FILTER,Se[a.magFilter]),e.texParameteri(u,e.TEXTURE_MIN_FILTER,Se[a.minFilter]),a.compareFunction&&(e.texParameteri(u,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(u,e.TEXTURE_COMPARE_FUNC,Le[a.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(a.magFilter===$t||a.minFilter!==nn&&a.minFilter!==Gt||a.type===It&&n.has("OES_texture_float_linear")===!1)return;if(a.anisotropy>1||i.get(a).__currentAnisotropy){const L=n.get("EXT_texture_filter_anisotropic");e.texParameterf(u,L.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,s.getMaxAnisotropy())),i.get(a).__currentAnisotropy=a.anisotropy}}}function Qe(u,a){let L=!1;u.__webglInit===void 0&&(u.__webglInit=!0,a.addEventListener("dispose",D));const W=a.source;let q=g.get(W);q===void 0&&(q={},g.set(W,q));const B=X(a);if(B!==u.__cacheKey){q[B]===void 0&&(q[B]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,L=!0),q[B].usedTimes++;const he=q[u.__cacheKey];he!==void 0&&(q[u.__cacheKey].usedTimes--,he.usedTimes===0&&p(a)),u.__cacheKey=B,u.__webglTexture=q[B].texture}return L}function V(u,a,L){let W=e.TEXTURE_2D;(a.isDataArrayTexture||a.isCompressedArrayTexture)&&(W=e.TEXTURE_2D_ARRAY),a.isData3DTexture&&(W=e.TEXTURE_3D);const q=Qe(u,a),B=a.source;t.bindTexture(W,u.__webglTexture,e.TEXTURE0+L);const he=i.get(B);if(B.version!==he.__version||q===!0){t.activeTexture(e.TEXTURE0+L);const ie=et.getPrimaries(et.workingColorSpace),se=a.colorSpace===Bt?null:et.getPrimaries(a.colorSpace),Ne=a.colorSpace===Bt||ie===se?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,a.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,a.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);let K=C(a.image,!1,s.maxTextureSize);K=Xe(a,K);const ce=o.convert(a.format,a.colorSpace),Ee=o.convert(a.type);let Te=M(a.internalFormat,ce,Ee,a.colorSpace,a.isVideoTexture);Be(W,a);let le;const Ie=a.mipmaps,be=a.isVideoTexture!==!0,We=he.__version===void 0||q===!0,_=B.dataReady,te=Z(a,K);if(a.isDepthTexture)Te=m(a.format===pn,a.type),We&&(be?t.texStorage2D(e.TEXTURE_2D,1,Te,K.width,K.height):t.texImage2D(e.TEXTURE_2D,0,Te,K.width,K.height,0,ce,Ee,null));else if(a.isDataTexture)if(Ie.length>0){be&&We&&t.texStorage2D(e.TEXTURE_2D,te,Te,Ie[0].width,Ie[0].height);for(let O=0,z=Ie.length;O<z;O++)le=Ie[O],be?_&&t.texSubImage2D(e.TEXTURE_2D,O,0,0,le.width,le.height,ce,Ee,le.data):t.texImage2D(e.TEXTURE_2D,O,Te,le.width,le.height,0,ce,Ee,le.data);a.generateMipmaps=!1}else be?(We&&t.texStorage2D(e.TEXTURE_2D,te,Te,K.width,K.height),_&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,K.width,K.height,ce,Ee,K.data)):t.texImage2D(e.TEXTURE_2D,0,Te,K.width,K.height,0,ce,Ee,K.data);else if(a.isCompressedTexture)if(a.isCompressedArrayTexture){be&&We&&t.texStorage3D(e.TEXTURE_2D_ARRAY,te,Te,Ie[0].width,Ie[0].height,K.depth);for(let O=0,z=Ie.length;O<z;O++)if(le=Ie[O],a.format!==Mt)if(ce!==null)if(be){if(_)if(a.layerUpdates.size>0){const oe=oi(le.width,le.height,a.format,a.type);for(const re of a.layerUpdates){const Re=le.data.subarray(re*oe/le.data.BYTES_PER_ELEMENT,(re+1)*oe/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,O,0,0,re,le.width,le.height,1,ce,Re)}a.clearLayerUpdates()}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,O,0,0,0,le.width,le.height,K.depth,ce,le.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,O,Te,le.width,le.height,K.depth,0,le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else be?_&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,O,0,0,0,le.width,le.height,K.depth,ce,Ee,le.data):t.texImage3D(e.TEXTURE_2D_ARRAY,O,Te,le.width,le.height,K.depth,0,ce,Ee,le.data)}else{be&&We&&t.texStorage2D(e.TEXTURE_2D,te,Te,Ie[0].width,Ie[0].height);for(let O=0,z=Ie.length;O<z;O++)le=Ie[O],a.format!==Mt?ce!==null?be?_&&t.compressedTexSubImage2D(e.TEXTURE_2D,O,0,0,le.width,le.height,ce,le.data):t.compressedTexImage2D(e.TEXTURE_2D,O,Te,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):be?_&&t.texSubImage2D(e.TEXTURE_2D,O,0,0,le.width,le.height,ce,Ee,le.data):t.texImage2D(e.TEXTURE_2D,O,Te,le.width,le.height,0,ce,Ee,le.data)}else if(a.isDataArrayTexture)if(be){if(We&&t.texStorage3D(e.TEXTURE_2D_ARRAY,te,Te,K.width,K.height,K.depth),_)if(a.layerUpdates.size>0){const O=oi(K.width,K.height,a.format,a.type);for(const z of a.layerUpdates){const oe=K.data.subarray(z*O/K.data.BYTES_PER_ELEMENT,(z+1)*O/K.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,z,K.width,K.height,1,ce,Ee,oe)}a.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,ce,Ee,K.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,Te,K.width,K.height,K.depth,0,ce,Ee,K.data);else if(a.isData3DTexture)be?(We&&t.texStorage3D(e.TEXTURE_3D,te,Te,K.width,K.height,K.depth),_&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,ce,Ee,K.data)):t.texImage3D(e.TEXTURE_3D,0,Te,K.width,K.height,K.depth,0,ce,Ee,K.data);else if(a.isFramebufferTexture){if(We)if(be)t.texStorage2D(e.TEXTURE_2D,te,Te,K.width,K.height);else{let O=K.width,z=K.height;for(let oe=0;oe<te;oe++)t.texImage2D(e.TEXTURE_2D,oe,Te,O,z,0,ce,Ee,null),O>>=1,z>>=1}}else if(Ie.length>0){if(be&&We){const O=ge(Ie[0]);t.texStorage2D(e.TEXTURE_2D,te,Te,O.width,O.height)}for(let O=0,z=Ie.length;O<z;O++)le=Ie[O],be?_&&t.texSubImage2D(e.TEXTURE_2D,O,0,0,ce,Ee,le):t.texImage2D(e.TEXTURE_2D,O,Te,ce,Ee,le);a.generateMipmaps=!1}else if(be){if(We){const O=ge(K);t.texStorage2D(e.TEXTURE_2D,te,Te,O.width,O.height)}_&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,ce,Ee,K)}else t.texImage2D(e.TEXTURE_2D,0,Te,ce,Ee,K);l(a)&&r(W),he.__version=B.version,a.onUpdate&&a.onUpdate(a)}u.__version=a.version}function J(u,a,L){if(a.image.length!==6)return;const W=Qe(u,a),q=a.source;t.bindTexture(e.TEXTURE_CUBE_MAP,u.__webglTexture,e.TEXTURE0+L);const B=i.get(q);if(q.version!==B.__version||W===!0){t.activeTexture(e.TEXTURE0+L);const he=et.getPrimaries(et.workingColorSpace),ie=a.colorSpace===Bt?null:et.getPrimaries(a.colorSpace),se=a.colorSpace===Bt||he===ie?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,a.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,a.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,se);const Ne=a.isCompressedTexture||a.image[0].isCompressedTexture,K=a.image[0]&&a.image[0].isDataTexture,ce=[];for(let z=0;z<6;z++)!Ne&&!K?ce[z]=C(a.image[z],!0,s.maxCubemapSize):ce[z]=K?a.image[z].image:a.image[z],ce[z]=Xe(a,ce[z]);const Ee=ce[0],Te=o.convert(a.format,a.colorSpace),le=o.convert(a.type),Ie=M(a.internalFormat,Te,le,a.colorSpace),be=a.isVideoTexture!==!0,We=B.__version===void 0||W===!0,_=q.dataReady;let te=Z(a,Ee);Be(e.TEXTURE_CUBE_MAP,a);let O;if(Ne){be&&We&&t.texStorage2D(e.TEXTURE_CUBE_MAP,te,Ie,Ee.width,Ee.height);for(let z=0;z<6;z++){O=ce[z].mipmaps;for(let oe=0;oe<O.length;oe++){const re=O[oe];a.format!==Mt?Te!==null?be?_&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,oe,0,0,re.width,re.height,Te,re.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,oe,Ie,re.width,re.height,0,re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):be?_&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,oe,0,0,re.width,re.height,Te,le,re.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,oe,Ie,re.width,re.height,0,Te,le,re.data)}}}else{if(O=a.mipmaps,be&&We){O.length>0&&te++;const z=ge(ce[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,te,Ie,z.width,z.height)}for(let z=0;z<6;z++)if(K){be?_&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,0,0,ce[z].width,ce[z].height,Te,le,ce[z].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,Ie,ce[z].width,ce[z].height,0,Te,le,ce[z].data);for(let oe=0;oe<O.length;oe++){const Re=O[oe].image[z].image;be?_&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,oe+1,0,0,Re.width,Re.height,Te,le,Re.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,oe+1,Ie,Re.width,Re.height,0,Te,le,Re.data)}}else{be?_&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,0,0,Te,le,ce[z]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,Ie,Te,le,ce[z]);for(let oe=0;oe<O.length;oe++){const re=O[oe];be?_&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,oe+1,0,0,Te,le,re.image[z]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+z,oe+1,Ie,Te,le,re.image[z])}}}l(a)&&r(e.TEXTURE_CUBE_MAP),B.__version=q.version,a.onUpdate&&a.onUpdate(a)}u.__version=a.version}function pe(u,a,L,W,q,B){const he=o.convert(L.format,L.colorSpace),ie=o.convert(L.type),se=M(L.internalFormat,he,ie,L.colorSpace),Ne=i.get(a),K=i.get(L);if(K.__renderTarget=a,!Ne.__hasExternalTextures){const ce=Math.max(1,a.width>>B),Ee=Math.max(1,a.height>>B);q===e.TEXTURE_3D||q===e.TEXTURE_2D_ARRAY?t.texImage3D(q,B,se,ce,Ee,a.depth,0,he,ie,null):t.texImage2D(q,B,se,ce,Ee,0,he,ie,null)}t.bindFramebuffer(e.FRAMEBUFFER,u),we(a)?f.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,W,q,K.__webglTexture,0,De(a)):(q===e.TEXTURE_2D||q>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,W,q,K.__webglTexture,B),t.bindFramebuffer(e.FRAMEBUFFER,null)}function ne(u,a,L){if(e.bindRenderbuffer(e.RENDERBUFFER,u),a.depthBuffer){const W=a.depthTexture,q=W&&W.isDepthTexture?W.type:null,B=m(a.stencilBuffer,q),he=a.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ie=De(a);we(a)?f.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,ie,B,a.width,a.height):L?e.renderbufferStorageMultisample(e.RENDERBUFFER,ie,B,a.width,a.height):e.renderbufferStorage(e.RENDERBUFFER,B,a.width,a.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,he,e.RENDERBUFFER,u)}else{const W=a.textures;for(let q=0;q<W.length;q++){const B=W[q],he=o.convert(B.format,B.colorSpace),ie=o.convert(B.type),se=M(B.internalFormat,he,ie,B.colorSpace),Ne=De(a);L&&we(a)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ne,se,a.width,a.height):we(a)?f.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ne,se,a.width,a.height):e.renderbufferStorage(e.RENDERBUFFER,se,a.width,a.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Me(u,a){if(a&&a.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(e.FRAMEBUFFER,u),!(a.depthTexture&&a.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const W=i.get(a.depthTexture);W.__renderTarget=a,(!W.__webglTexture||a.depthTexture.image.width!==a.width||a.depthTexture.image.height!==a.height)&&(a.depthTexture.image.width=a.width,a.depthTexture.image.height=a.height,a.depthTexture.needsUpdate=!0),Q(a.depthTexture,0);const q=W.__webglTexture,B=De(a);if(a.depthTexture.format===Xn)we(a)?f.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,q,0,B):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,q,0);else if(a.depthTexture.format===pn)we(a)?f.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,q,0,B):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function Ae(u){const a=i.get(u),L=u.isWebGLCubeRenderTarget===!0;if(a.__boundDepthTexture!==u.depthTexture){const W=u.depthTexture;if(a.__depthDisposeCallback&&a.__depthDisposeCallback(),W){const q=()=>{delete a.__boundDepthTexture,delete a.__depthDisposeCallback,W.removeEventListener("dispose",q)};W.addEventListener("dispose",q),a.__depthDisposeCallback=q}a.__boundDepthTexture=W}if(u.depthTexture&&!a.__autoAllocateDepthBuffer){if(L)throw new Error("target.depthTexture not supported in Cube render targets");Me(a.__webglFramebuffer,u)}else if(L){a.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(e.FRAMEBUFFER,a.__webglFramebuffer[W]),a.__webglDepthbuffer[W]===void 0)a.__webglDepthbuffer[W]=e.createRenderbuffer(),ne(a.__webglDepthbuffer[W],u,!1);else{const q=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,B=a.__webglDepthbuffer[W];e.bindRenderbuffer(e.RENDERBUFFER,B),e.framebufferRenderbuffer(e.FRAMEBUFFER,q,e.RENDERBUFFER,B)}}else if(t.bindFramebuffer(e.FRAMEBUFFER,a.__webglFramebuffer),a.__webglDepthbuffer===void 0)a.__webglDepthbuffer=e.createRenderbuffer(),ne(a.__webglDepthbuffer,u,!1);else{const W=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,q=a.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,q),e.framebufferRenderbuffer(e.FRAMEBUFFER,W,e.RENDERBUFFER,q)}t.bindFramebuffer(e.FRAMEBUFFER,null)}function Ue(u,a,L){const W=i.get(u);a!==void 0&&pe(W.__webglFramebuffer,u,u.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),L!==void 0&&Ae(u)}function Ze(u){const a=u.texture,L=i.get(u),W=i.get(a);u.addEventListener("dispose",y);const q=u.textures,B=u.isWebGLCubeRenderTarget===!0,he=q.length>1;if(he||(W.__webglTexture===void 0&&(W.__webglTexture=e.createTexture()),W.__version=a.version,h.memory.textures++),B){L.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(a.mipmaps&&a.mipmaps.length>0){L.__webglFramebuffer[ie]=[];for(let se=0;se<a.mipmaps.length;se++)L.__webglFramebuffer[ie][se]=e.createFramebuffer()}else L.__webglFramebuffer[ie]=e.createFramebuffer()}else{if(a.mipmaps&&a.mipmaps.length>0){L.__webglFramebuffer=[];for(let ie=0;ie<a.mipmaps.length;ie++)L.__webglFramebuffer[ie]=e.createFramebuffer()}else L.__webglFramebuffer=e.createFramebuffer();if(he)for(let ie=0,se=q.length;ie<se;ie++){const Ne=i.get(q[ie]);Ne.__webglTexture===void 0&&(Ne.__webglTexture=e.createTexture(),h.memory.textures++)}if(u.samples>0&&we(u)===!1){L.__webglMultisampledFramebuffer=e.createFramebuffer(),L.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,L.__webglMultisampledFramebuffer);for(let ie=0;ie<q.length;ie++){const se=q[ie];L.__webglColorRenderbuffer[ie]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,L.__webglColorRenderbuffer[ie]);const Ne=o.convert(se.format,se.colorSpace),K=o.convert(se.type),ce=M(se.internalFormat,Ne,K,se.colorSpace,u.isXRRenderTarget===!0),Ee=De(u);e.renderbufferStorageMultisample(e.RENDERBUFFER,Ee,ce,u.width,u.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ie,e.RENDERBUFFER,L.__webglColorRenderbuffer[ie])}e.bindRenderbuffer(e.RENDERBUFFER,null),u.depthBuffer&&(L.__webglDepthRenderbuffer=e.createRenderbuffer(),ne(L.__webglDepthRenderbuffer,u,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(B){t.bindTexture(e.TEXTURE_CUBE_MAP,W.__webglTexture),Be(e.TEXTURE_CUBE_MAP,a);for(let ie=0;ie<6;ie++)if(a.mipmaps&&a.mipmaps.length>0)for(let se=0;se<a.mipmaps.length;se++)pe(L.__webglFramebuffer[ie][se],u,a,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ie,se);else pe(L.__webglFramebuffer[ie],u,a,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);l(a)&&r(e.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let ie=0,se=q.length;ie<se;ie++){const Ne=q[ie],K=i.get(Ne);t.bindTexture(e.TEXTURE_2D,K.__webglTexture),Be(e.TEXTURE_2D,Ne),pe(L.__webglFramebuffer,u,Ne,e.COLOR_ATTACHMENT0+ie,e.TEXTURE_2D,0),l(Ne)&&r(e.TEXTURE_2D)}t.unbindTexture()}else{let ie=e.TEXTURE_2D;if((u.isWebGL3DRenderTarget||u.isWebGLArrayRenderTarget)&&(ie=u.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(ie,W.__webglTexture),Be(ie,a),a.mipmaps&&a.mipmaps.length>0)for(let se=0;se<a.mipmaps.length;se++)pe(L.__webglFramebuffer[se],u,a,e.COLOR_ATTACHMENT0,ie,se);else pe(L.__webglFramebuffer,u,a,e.COLOR_ATTACHMENT0,ie,0);l(a)&&r(ie),t.unbindTexture()}u.depthBuffer&&Ae(u)}function ye(u){const a=u.textures;for(let L=0,W=a.length;L<W;L++){const q=a[L];if(l(q)){const B=P(u),he=i.get(q).__webglTexture;t.bindTexture(B,he),r(B),t.unbindTexture()}}}const je=[],T=[];function ft(u){if(u.samples>0){if(we(u)===!1){const a=u.textures,L=u.width,W=u.height;let q=e.COLOR_BUFFER_BIT;const B=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,he=i.get(u),ie=a.length>1;if(ie)for(let se=0;se<a.length;se++)t.bindFramebuffer(e.FRAMEBUFFER,he.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+se,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,he.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+se,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let se=0;se<a.length;se++){if(u.resolveDepthBuffer&&(u.depthBuffer&&(q|=e.DEPTH_BUFFER_BIT),u.stencilBuffer&&u.resolveStencilBuffer&&(q|=e.STENCIL_BUFFER_BIT)),ie){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,he.__webglColorRenderbuffer[se]);const Ne=i.get(a[se]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Ne,0)}e.blitFramebuffer(0,0,L,W,0,0,L,W,q,e.NEAREST),b===!0&&(je.length=0,T.length=0,je.push(e.COLOR_ATTACHMENT0+se),u.depthBuffer&&u.resolveDepthBuffer===!1&&(je.push(B),T.push(B),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,T)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,je))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ie)for(let se=0;se<a.length;se++){t.bindFramebuffer(e.FRAMEBUFFER,he.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+se,e.RENDERBUFFER,he.__webglColorRenderbuffer[se]);const Ne=i.get(a[se]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,he.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+se,e.TEXTURE_2D,Ne,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(u.depthBuffer&&u.resolveDepthBuffer===!1&&b){const a=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[a])}}}function De(u){return Math.min(s.maxSamples,u.samples)}function we(u){const a=i.get(u);return u.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&a.__useRenderToTexture!==!1}function ve(u){const a=h.render.frame;U.get(u)!==a&&(U.set(u,a),u.update())}function Xe(u,a){const L=u.colorSpace,W=u.format,q=u.type;return u.isCompressedTexture===!0||u.isVideoTexture===!0||L!==gn&&L!==Bt&&(et.getTransfer(L)===Ke?(W!==Mt||q!==yt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",L)),a}function ge(u){return typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement?(E.width=u.naturalWidth||u.width,E.height=u.naturalHeight||u.height):typeof VideoFrame<"u"&&u instanceof VideoFrame?(E.width=u.displayWidth,E.height=u.displayHeight):(E.width=u.width,E.height=u.height),E}this.allocateTextureUnit=G,this.resetTextureUnits=Y,this.setTexture2D=Q,this.setTexture2DArray=k,this.setTexture3D=j,this.setTextureCube=F,this.rebindTextures=Ue,this.setupRenderTarget=Ze,this.updateRenderTargetMipmap=ye,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=we}function Df(e,n){function t(i,s=Bt){let o;const h=et.getTransfer(s);if(i===yt)return e.UNSIGNED_BYTE;if(i===_r)return e.UNSIGNED_SHORT_4_4_4_4;if(i===gr)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Oa)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===Fa)return e.BYTE;if(i===Ba)return e.SHORT;if(i===hn)return e.UNSIGNED_SHORT;if(i===sr)return e.INT;if(i===Jt)return e.UNSIGNED_INT;if(i===It)return e.FLOAT;if(i===_n)return e.HALF_FLOAT;if(i===Ga)return e.ALPHA;if(i===Ha)return e.RGB;if(i===Mt)return e.RGBA;if(i===Va)return e.LUMINANCE;if(i===ka)return e.LUMINANCE_ALPHA;if(i===Xn)return e.DEPTH_COMPONENT;if(i===pn)return e.DEPTH_STENCIL;if(i===Wa)return e.RED;if(i===vr)return e.RED_INTEGER;if(i===za)return e.RG;if(i===Er)return e.RG_INTEGER;if(i===Sr)return e.RGBA_INTEGER;if(i===Mn||i===Tn||i===xn||i===An)if(h===Ke)if(o=n.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Mn)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Tn)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===xn)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===An)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=n.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Mn)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Tn)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===xn)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===An)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===si||i===ci||i===li||i===fi)if(o=n.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===si)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ci)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===li)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===fi)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===di||i===ui||i===pi)if(o=n.get("WEBGL_compressed_texture_etc"),o!==null){if(i===di||i===ui)return h===Ke?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===pi)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===hi||i===mi||i===_i||i===gi||i===vi||i===Ei||i===Si||i===Mi||i===Ti||i===xi||i===Ai||i===Ri||i===Ci||i===bi)if(o=n.get("WEBGL_compressed_texture_astc"),o!==null){if(i===hi)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===mi)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===_i)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===gi)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===vi)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ei)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Si)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Mi)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ti)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===xi)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ai)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ri)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ci)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===bi)return h===Ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Rn||i===Pi||i===Li)if(o=n.get("EXT_texture_compression_bptc"),o!==null){if(i===Rn)return h===Ke?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Pi)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Li)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Xa||i===Ui||i===Di||i===wi)if(o=n.get("EXT_texture_compression_rgtc"),o!==null){if(i===Rn)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Ui)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Di)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===wi)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===jt?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}const wf={type:"move"};class wn{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new rn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new rn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Ve,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Ve),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new rn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Ve,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Ve),this._grip}dispatchEvent(n){return this._targetRay!==null&&this._targetRay.dispatchEvent(n),this._grip!==null&&this._grip.dispatchEvent(n),this._hand!==null&&this._hand.dispatchEvent(n),this}connect(n){if(n&&n.hand){const t=this._hand;if(t)for(const i of n.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:n}),this}disconnect(n){return this.dispatchEvent({type:"disconnected",data:n}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(n,t,i){let s=null,o=null,h=null;const f=this._targetRay,b=this._grip,E=this._hand;if(n&&t.session.visibilityState!=="visible-blurred"){if(E&&n.hand){h=!0;for(const C of n.hand.values()){const l=t.getJointPose(C,i),r=this._getHandJoint(E,C);l!==null&&(r.matrix.fromArray(l.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,r.jointRadius=l.radius),r.visible=l!==null}const U=E.joints["index-finger-tip"],R=E.joints["thumb-tip"],g=U.position.distanceTo(R.position),x=.02,N=.005;E.inputState.pinching&&g>x+N?(E.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:n.handedness,target:this})):!E.inputState.pinching&&g<=x-N&&(E.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:n.handedness,target:this}))}else b!==null&&n.gripSpace&&(o=t.getPose(n.gripSpace,i),o!==null&&(b.matrix.fromArray(o.transform.matrix),b.matrix.decompose(b.position,b.rotation,b.scale),b.matrixWorldNeedsUpdate=!0,o.linearVelocity?(b.hasLinearVelocity=!0,b.linearVelocity.copy(o.linearVelocity)):b.hasLinearVelocity=!1,o.angularVelocity?(b.hasAngularVelocity=!0,b.angularVelocity.copy(o.angularVelocity)):b.hasAngularVelocity=!1));f!==null&&(s=t.getPose(n.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(f.matrix.fromArray(s.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,s.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(s.linearVelocity)):f.hasLinearVelocity=!1,s.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(s.angularVelocity)):f.hasAngularVelocity=!1,this.dispatchEvent(wf)))}return f!==null&&(f.visible=s!==null),b!==null&&(b.visible=o!==null),E!==null&&(E.visible=h!==null),this}_getHandJoint(n,t){if(n.joints[t.jointName]===void 0){const i=new rn;i.matrixAutoUpdate=!1,i.visible=!1,n.joints[t.jointName]=i,n.add(i)}return n.joints[t.jointName]}}const If=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,yf=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Nf{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t,i){if(this.texture===null){const s=new ur,o=n.properties.get(s);o.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(n){if(this.texture!==null&&this.mesh===null){const t=n.cameras[0].viewport,i=new bt({vertexShader:If,fragmentShader:yf,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new St(new ar(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Of extends Ya{constructor(n,t){super();const i=this;let s=null,o=1,h=null,f="local-floor",b=1,E=null,U=null,R=null,g=null,x=null,N=null;const C=new Nf,l=t.getContextAttributes();let r=null,P=null;const M=[],m=[],Z=new st;let D=null;const y=new cn;y.viewport=new ot;const H=new cn;H.viewport=new ot;const p=[y,H],d=new qa;let A=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let J=M[V];return J===void 0&&(J=new wn,M[V]=J),J.getTargetRaySpace()},this.getControllerGrip=function(V){let J=M[V];return J===void 0&&(J=new wn,M[V]=J),J.getGripSpace()},this.getHand=function(V){let J=M[V];return J===void 0&&(J=new wn,M[V]=J),J.getHandSpace()};function G(V){const J=m.indexOf(V.inputSource);if(J===-1)return;const pe=M[J];pe!==void 0&&(pe.update(V.inputSource,V.frame,E||h),pe.dispatchEvent({type:V.type,data:V.inputSource}))}function X(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",Q);for(let V=0;V<M.length;V++){const J=m[V];J!==null&&(m[V]=null,M[V].disconnect(J))}A=null,Y=null,C.reset(),n.setRenderTarget(r),x=null,g=null,R=null,s=null,P=null,Qe.stop(),i.isPresenting=!1,n.setPixelRatio(D),n.setSize(Z.width,Z.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){o=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){f=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return E||h},this.setReferenceSpace=function(V){E=V},this.getBaseLayer=function(){return g!==null?g:x},this.getBinding=function(){return R},this.getFrame=function(){return N},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(r=n.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",X),s.addEventListener("inputsourceschange",Q),l.xrCompatible!==!0&&await t.makeXRCompatible(),D=n.getPixelRatio(),n.getSize(Z),s.renderState.layers===void 0){const J={antialias:l.antialias,alpha:!0,depth:l.depth,stencil:l.stencil,framebufferScaleFactor:o};x=new XRWebGLLayer(s,t,J),s.updateRenderState({baseLayer:x}),n.setPixelRatio(1),n.setSize(x.framebufferWidth,x.framebufferHeight,!1),P=new Nt(x.framebufferWidth,x.framebufferHeight,{format:Mt,type:yt,colorSpace:n.outputColorSpace,stencilBuffer:l.stencil})}else{let J=null,pe=null,ne=null;l.depth&&(ne=l.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,J=l.stencil?pn:Xn,pe=l.stencil?jt:Jt);const Me={colorFormat:t.RGBA8,depthFormat:ne,scaleFactor:o};R=new XRWebGLBinding(s,t),g=R.createProjectionLayer(Me),s.updateRenderState({layers:[g]}),n.setPixelRatio(1),n.setSize(g.textureWidth,g.textureHeight,!1),P=new Nt(g.textureWidth,g.textureHeight,{format:Mt,type:yt,depthTexture:new dr(g.textureWidth,g.textureHeight,pe,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:l.stencil,colorSpace:n.outputColorSpace,samples:l.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1})}P.isXRRenderTarget=!0,this.setFoveation(b),E=null,h=await s.requestReferenceSpace(f),Qe.setContext(s),Qe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return C.getDepthTexture()};function Q(V){for(let J=0;J<V.removed.length;J++){const pe=V.removed[J],ne=m.indexOf(pe);ne>=0&&(m[ne]=null,M[ne].disconnect(pe))}for(let J=0;J<V.added.length;J++){const pe=V.added[J];let ne=m.indexOf(pe);if(ne===-1){for(let Ae=0;Ae<M.length;Ae++)if(Ae>=m.length){m.push(pe),ne=Ae;break}else if(m[Ae]===null){m[Ae]=pe,ne=Ae;break}if(ne===-1)break}const Me=M[ne];Me&&Me.connect(pe)}}const k=new Ve,j=new Ve;function F(V,J,pe){k.setFromMatrixPosition(J.matrixWorld),j.setFromMatrixPosition(pe.matrixWorld);const ne=k.distanceTo(j),Me=J.projectionMatrix.elements,Ae=pe.projectionMatrix.elements,Ue=Me[14]/(Me[10]-1),Ze=Me[14]/(Me[10]+1),ye=(Me[9]+1)/Me[5],je=(Me[9]-1)/Me[5],T=(Me[8]-1)/Me[0],ft=(Ae[8]+1)/Ae[0],De=Ue*T,we=Ue*ft,ve=ne/(-T+ft),Xe=ve*-T;if(J.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Xe),V.translateZ(ve),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Me[10]===-1)V.projectionMatrix.copy(J.projectionMatrix),V.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const ge=Ue+ve,u=Ze+ve,a=De-Xe,L=we+(ne-Xe),W=ye*Ze/u*ge,q=je*Ze/u*ge;V.projectionMatrix.makePerspective(a,L,W,q,ge,u),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function _e(V,J){J===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(J.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let J=V.near,pe=V.far;C.texture!==null&&(C.depthNear>0&&(J=C.depthNear),C.depthFar>0&&(pe=C.depthFar)),d.near=H.near=y.near=J,d.far=H.far=y.far=pe,(A!==d.near||Y!==d.far)&&(s.updateRenderState({depthNear:d.near,depthFar:d.far}),A=d.near,Y=d.far),y.layers.mask=V.layers.mask|2,H.layers.mask=V.layers.mask|4,d.layers.mask=y.layers.mask|H.layers.mask;const ne=V.parent,Me=d.cameras;_e(d,ne);for(let Ae=0;Ae<Me.length;Ae++)_e(Me[Ae],ne);Me.length===2?F(d,y,H):d.projectionMatrix.copy(y.projectionMatrix),Se(V,d,ne)};function Se(V,J,pe){pe===null?V.matrix.copy(J.matrixWorld):(V.matrix.copy(pe.matrixWorld),V.matrix.invert(),V.matrix.multiply(J.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(J.projectionMatrix),V.projectionMatrixInverse.copy(J.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Ka*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return d},this.getFoveation=function(){if(!(g===null&&x===null))return b},this.setFoveation=function(V){b=V,g!==null&&(g.fixedFoveation=V),x!==null&&x.fixedFoveation!==void 0&&(x.fixedFoveation=V)},this.hasDepthSensing=function(){return C.texture!==null},this.getDepthSensingMesh=function(){return C.getMesh(d)};let Le=null;function Be(V,J){if(U=J.getViewerPose(E||h),N=J,U!==null){const pe=U.views;x!==null&&(n.setRenderTargetFramebuffer(P,x.framebuffer),n.setRenderTarget(P));let ne=!1;pe.length!==d.cameras.length&&(d.cameras.length=0,ne=!0);for(let Ae=0;Ae<pe.length;Ae++){const Ue=pe[Ae];let Ze=null;if(x!==null)Ze=x.getViewport(Ue);else{const je=R.getViewSubImage(g,Ue);Ze=je.viewport,Ae===0&&(n.setRenderTargetTextures(P,je.colorTexture,g.ignoreDepthValues?void 0:je.depthStencilTexture),n.setRenderTarget(P))}let ye=p[Ae];ye===void 0&&(ye=new cn,ye.layers.enable(Ae),ye.viewport=new ot,p[Ae]=ye),ye.matrix.fromArray(Ue.transform.matrix),ye.matrix.decompose(ye.position,ye.quaternion,ye.scale),ye.projectionMatrix.fromArray(Ue.projectionMatrix),ye.projectionMatrixInverse.copy(ye.projectionMatrix).invert(),ye.viewport.set(Ze.x,Ze.y,Ze.width,Ze.height),Ae===0&&(d.matrix.copy(ye.matrix),d.matrix.decompose(d.position,d.quaternion,d.scale)),ne===!0&&d.cameras.push(ye)}const Me=s.enabledFeatures;if(Me&&Me.includes("depth-sensing")){const Ae=R.getDepthInformation(pe[0]);Ae&&Ae.isValid&&Ae.texture&&C.init(n,Ae,s.renderState)}}for(let pe=0;pe<M.length;pe++){const ne=m[pe],Me=M[pe];ne!==null&&Me!==void 0&&Me.update(ne,J,E||h)}Le&&Le(V,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),N=null}const Qe=new Mr;Qe.setAnimationLoop(Be),this.setAnimationLoop=function(V){Le=V},this.dispose=function(){}}}const Ut=new rr,Ff=new Vt;function Bf(e,n){function t(l,r){l.matrixAutoUpdate===!0&&l.updateMatrix(),r.value.copy(l.matrix)}function i(l,r){r.color.getRGB(l.fogColor.value,or(e)),r.isFog?(l.fogNear.value=r.near,l.fogFar.value=r.far):r.isFogExp2&&(l.fogDensity.value=r.density)}function s(l,r,P,M,m){r.isMeshBasicMaterial||r.isMeshLambertMaterial?o(l,r):r.isMeshToonMaterial?(o(l,r),R(l,r)):r.isMeshPhongMaterial?(o(l,r),U(l,r)):r.isMeshStandardMaterial?(o(l,r),g(l,r),r.isMeshPhysicalMaterial&&x(l,r,m)):r.isMeshMatcapMaterial?(o(l,r),N(l,r)):r.isMeshDepthMaterial?o(l,r):r.isMeshDistanceMaterial?(o(l,r),C(l,r)):r.isMeshNormalMaterial?o(l,r):r.isLineBasicMaterial?(h(l,r),r.isLineDashedMaterial&&f(l,r)):r.isPointsMaterial?b(l,r,P,M):r.isSpriteMaterial?E(l,r):r.isShadowMaterial?(l.color.value.copy(r.color),l.opacity.value=r.opacity):r.isShaderMaterial&&(r.uniformsNeedUpdate=!1)}function o(l,r){l.opacity.value=r.opacity,r.color&&l.diffuse.value.copy(r.color),r.emissive&&l.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(l.map.value=r.map,t(r.map,l.mapTransform)),r.alphaMap&&(l.alphaMap.value=r.alphaMap,t(r.alphaMap,l.alphaMapTransform)),r.bumpMap&&(l.bumpMap.value=r.bumpMap,t(r.bumpMap,l.bumpMapTransform),l.bumpScale.value=r.bumpScale,r.side===lt&&(l.bumpScale.value*=-1)),r.normalMap&&(l.normalMap.value=r.normalMap,t(r.normalMap,l.normalMapTransform),l.normalScale.value.copy(r.normalScale),r.side===lt&&l.normalScale.value.negate()),r.displacementMap&&(l.displacementMap.value=r.displacementMap,t(r.displacementMap,l.displacementMapTransform),l.displacementScale.value=r.displacementScale,l.displacementBias.value=r.displacementBias),r.emissiveMap&&(l.emissiveMap.value=r.emissiveMap,t(r.emissiveMap,l.emissiveMapTransform)),r.specularMap&&(l.specularMap.value=r.specularMap,t(r.specularMap,l.specularMapTransform)),r.alphaTest>0&&(l.alphaTest.value=r.alphaTest);const P=n.get(r),M=P.envMap,m=P.envMapRotation;M&&(l.envMap.value=M,Ut.copy(m),Ut.x*=-1,Ut.y*=-1,Ut.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Ut.y*=-1,Ut.z*=-1),l.envMapRotation.value.setFromMatrix4(Ff.makeRotationFromEuler(Ut)),l.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,l.reflectivity.value=r.reflectivity,l.ior.value=r.ior,l.refractionRatio.value=r.refractionRatio),r.lightMap&&(l.lightMap.value=r.lightMap,l.lightMapIntensity.value=r.lightMapIntensity,t(r.lightMap,l.lightMapTransform)),r.aoMap&&(l.aoMap.value=r.aoMap,l.aoMapIntensity.value=r.aoMapIntensity,t(r.aoMap,l.aoMapTransform))}function h(l,r){l.diffuse.value.copy(r.color),l.opacity.value=r.opacity,r.map&&(l.map.value=r.map,t(r.map,l.mapTransform))}function f(l,r){l.dashSize.value=r.dashSize,l.totalSize.value=r.dashSize+r.gapSize,l.scale.value=r.scale}function b(l,r,P,M){l.diffuse.value.copy(r.color),l.opacity.value=r.opacity,l.size.value=r.size*P,l.scale.value=M*.5,r.map&&(l.map.value=r.map,t(r.map,l.uvTransform)),r.alphaMap&&(l.alphaMap.value=r.alphaMap,t(r.alphaMap,l.alphaMapTransform)),r.alphaTest>0&&(l.alphaTest.value=r.alphaTest)}function E(l,r){l.diffuse.value.copy(r.color),l.opacity.value=r.opacity,l.rotation.value=r.rotation,r.map&&(l.map.value=r.map,t(r.map,l.mapTransform)),r.alphaMap&&(l.alphaMap.value=r.alphaMap,t(r.alphaMap,l.alphaMapTransform)),r.alphaTest>0&&(l.alphaTest.value=r.alphaTest)}function U(l,r){l.specular.value.copy(r.specular),l.shininess.value=Math.max(r.shininess,1e-4)}function R(l,r){r.gradientMap&&(l.gradientMap.value=r.gradientMap)}function g(l,r){l.metalness.value=r.metalness,r.metalnessMap&&(l.metalnessMap.value=r.metalnessMap,t(r.metalnessMap,l.metalnessMapTransform)),l.roughness.value=r.roughness,r.roughnessMap&&(l.roughnessMap.value=r.roughnessMap,t(r.roughnessMap,l.roughnessMapTransform)),r.envMap&&(l.envMapIntensity.value=r.envMapIntensity)}function x(l,r,P){l.ior.value=r.ior,r.sheen>0&&(l.sheenColor.value.copy(r.sheenColor).multiplyScalar(r.sheen),l.sheenRoughness.value=r.sheenRoughness,r.sheenColorMap&&(l.sheenColorMap.value=r.sheenColorMap,t(r.sheenColorMap,l.sheenColorMapTransform)),r.sheenRoughnessMap&&(l.sheenRoughnessMap.value=r.sheenRoughnessMap,t(r.sheenRoughnessMap,l.sheenRoughnessMapTransform))),r.clearcoat>0&&(l.clearcoat.value=r.clearcoat,l.clearcoatRoughness.value=r.clearcoatRoughness,r.clearcoatMap&&(l.clearcoatMap.value=r.clearcoatMap,t(r.clearcoatMap,l.clearcoatMapTransform)),r.clearcoatRoughnessMap&&(l.clearcoatRoughnessMap.value=r.clearcoatRoughnessMap,t(r.clearcoatRoughnessMap,l.clearcoatRoughnessMapTransform)),r.clearcoatNormalMap&&(l.clearcoatNormalMap.value=r.clearcoatNormalMap,t(r.clearcoatNormalMap,l.clearcoatNormalMapTransform),l.clearcoatNormalScale.value.copy(r.clearcoatNormalScale),r.side===lt&&l.clearcoatNormalScale.value.negate())),r.dispersion>0&&(l.dispersion.value=r.dispersion),r.iridescence>0&&(l.iridescence.value=r.iridescence,l.iridescenceIOR.value=r.iridescenceIOR,l.iridescenceThicknessMinimum.value=r.iridescenceThicknessRange[0],l.iridescenceThicknessMaximum.value=r.iridescenceThicknessRange[1],r.iridescenceMap&&(l.iridescenceMap.value=r.iridescenceMap,t(r.iridescenceMap,l.iridescenceMapTransform)),r.iridescenceThicknessMap&&(l.iridescenceThicknessMap.value=r.iridescenceThicknessMap,t(r.iridescenceThicknessMap,l.iridescenceThicknessMapTransform))),r.transmission>0&&(l.transmission.value=r.transmission,l.transmissionSamplerMap.value=P.texture,l.transmissionSamplerSize.value.set(P.width,P.height),r.transmissionMap&&(l.transmissionMap.value=r.transmissionMap,t(r.transmissionMap,l.transmissionMapTransform)),l.thickness.value=r.thickness,r.thicknessMap&&(l.thicknessMap.value=r.thicknessMap,t(r.thicknessMap,l.thicknessMapTransform)),l.attenuationDistance.value=r.attenuationDistance,l.attenuationColor.value.copy(r.attenuationColor)),r.anisotropy>0&&(l.anisotropyVector.value.set(r.anisotropy*Math.cos(r.anisotropyRotation),r.anisotropy*Math.sin(r.anisotropyRotation)),r.anisotropyMap&&(l.anisotropyMap.value=r.anisotropyMap,t(r.anisotropyMap,l.anisotropyMapTransform))),l.specularIntensity.value=r.specularIntensity,l.specularColor.value.copy(r.specularColor),r.specularColorMap&&(l.specularColorMap.value=r.specularColorMap,t(r.specularColorMap,l.specularColorMapTransform)),r.specularIntensityMap&&(l.specularIntensityMap.value=r.specularIntensityMap,t(r.specularIntensityMap,l.specularIntensityMapTransform))}function N(l,r){r.matcap&&(l.matcap.value=r.matcap)}function C(l,r){const P=n.get(r).light;l.referencePosition.value.setFromMatrixPosition(P.matrixWorld),l.nearDistance.value=P.shadow.camera.near,l.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Gf(e,n,t,i){let s={},o={},h=[];const f=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function b(P,M){const m=M.program;i.uniformBlockBinding(P,m)}function E(P,M){let m=s[P.id];m===void 0&&(N(P),m=U(P),s[P.id]=m,P.addEventListener("dispose",l));const Z=M.program;i.updateUBOMapping(P,Z);const D=n.render.frame;o[P.id]!==D&&(g(P),o[P.id]=D)}function U(P){const M=R();P.__bindingPointIndex=M;const m=e.createBuffer(),Z=P.__size,D=P.usage;return e.bindBuffer(e.UNIFORM_BUFFER,m),e.bufferData(e.UNIFORM_BUFFER,Z,D),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,M,m),m}function R(){for(let P=0;P<f;P++)if(h.indexOf(P)===-1)return h.push(P),P;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(P){const M=s[P.id],m=P.uniforms,Z=P.__cache;e.bindBuffer(e.UNIFORM_BUFFER,M);for(let D=0,y=m.length;D<y;D++){const H=Array.isArray(m[D])?m[D]:[m[D]];for(let p=0,d=H.length;p<d;p++){const A=H[p];if(x(A,D,p,Z)===!0){const Y=A.__offset,G=Array.isArray(A.value)?A.value:[A.value];let X=0;for(let Q=0;Q<G.length;Q++){const k=G[Q],j=C(k);typeof k=="number"||typeof k=="boolean"?(A.__data[0]=k,e.bufferSubData(e.UNIFORM_BUFFER,Y+X,A.__data)):k.isMatrix3?(A.__data[0]=k.elements[0],A.__data[1]=k.elements[1],A.__data[2]=k.elements[2],A.__data[3]=0,A.__data[4]=k.elements[3],A.__data[5]=k.elements[4],A.__data[6]=k.elements[5],A.__data[7]=0,A.__data[8]=k.elements[6],A.__data[9]=k.elements[7],A.__data[10]=k.elements[8],A.__data[11]=0):(k.toArray(A.__data,X),X+=j.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,Y,A.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function x(P,M,m,Z){const D=P.value,y=M+"_"+m;if(Z[y]===void 0)return typeof D=="number"||typeof D=="boolean"?Z[y]=D:Z[y]=D.clone(),!0;{const H=Z[y];if(typeof D=="number"||typeof D=="boolean"){if(H!==D)return Z[y]=D,!0}else if(H.equals(D)===!1)return H.copy(D),!0}return!1}function N(P){const M=P.uniforms;let m=0;const Z=16;for(let y=0,H=M.length;y<H;y++){const p=Array.isArray(M[y])?M[y]:[M[y]];for(let d=0,A=p.length;d<A;d++){const Y=p[d],G=Array.isArray(Y.value)?Y.value:[Y.value];for(let X=0,Q=G.length;X<Q;X++){const k=G[X],j=C(k),F=m%Z,_e=F%j.boundary,Se=F+_e;m+=_e,Se!==0&&Z-Se<j.storage&&(m+=Z-Se),Y.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=m,m+=j.storage}}}const D=m%Z;return D>0&&(m+=Z-D),P.__size=m,P.__cache={},this}function C(P){const M={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(M.boundary=4,M.storage=4):P.isVector2?(M.boundary=8,M.storage=8):P.isVector3||P.isColor?(M.boundary=16,M.storage=12):P.isVector4?(M.boundary=16,M.storage=16):P.isMatrix3?(M.boundary=48,M.storage=48):P.isMatrix4?(M.boundary=64,M.storage=64):P.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",P),M}function l(P){const M=P.target;M.removeEventListener("dispose",l);const m=h.indexOf(M.__bindingPointIndex);h.splice(m,1),e.deleteBuffer(s[M.id]),delete s[M.id],delete o[M.id]}function r(){for(const P in s)e.deleteBuffer(s[P]);h=[],s={},o={}}return{bind:b,update:E,dispose:r}}class Vf{constructor(n={}){const{canvas:t=$a(),context:i=null,depth:s=!0,stencil:o=!1,alpha:h=!1,antialias:f=!1,premultipliedAlpha:b=!0,preserveDrawingBuffer:E=!1,powerPreference:U="default",failIfMajorPerformanceCaveat:R=!1,reverseDepthBuffer:g=!1}=n;this.isWebGLRenderer=!0;let x;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=i.getContextAttributes().alpha}else x=h;const N=new Uint32Array(4),C=new Int32Array(4);let l=null,r=null;const P=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Za,this.toneMapping=Ct,this.toneMappingExposure=1;const m=this;let Z=!1,D=0,y=0,H=null,p=-1,d=null;const A=new ot,Y=new ot;let G=null;const X=new $e(0);let Q=0,k=t.width,j=t.height,F=1,_e=null,Se=null;const Le=new ot(0,0,k,j),Be=new ot(0,0,k,j);let Qe=!1;const V=new mr;let J=!1,pe=!1;const ne=new Vt,Me=new Vt,Ae=new Ve,Ue=new ot,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ye=!1;function je(){return H===null?F:1}let T=i;function ft(c,v){return t.getContext(c,v)}try{const c={alpha:!0,depth:s,stencil:o,antialias:f,premultipliedAlpha:b,preserveDrawingBuffer:E,powerPreference:U,failIfMajorPerformanceCaveat:R};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Qa}`),t.addEventListener("webglcontextlost",z,!1),t.addEventListener("webglcontextrestored",oe,!1),t.addEventListener("webglcontextcreationerror",re,!1),T===null){const v="webgl2";if(T=ft(v,c),T===null)throw ft(v)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(c){throw console.error("THREE.WebGLRenderer: "+c.message),c}let De,we,ve,Xe,ge,u,a,L,W,q,B,he,ie,se,Ne,K,ce,Ee,Te,le,Ie,be,We,_;function te(){De=new Kc(T),De.init(),be=new Df(T,De),we=new kc(T,De,n,be),ve=new Lf(T,De),we.reverseDepthBuffer&&g&&ve.buffers.depth.setReversed(!0),Xe=new Qc(T),ge=new _f,u=new Uf(T,De,ve,ge,we,be,Xe),a=new zc(m),L=new qc(m),W=new io(T),We=new Hc(T,W),q=new $c(T,W,Xe,We),B=new jc(T,q,W,Xe),Te=new Jc(T,we,u),K=new Wc(ge),he=new mf(m,a,L,De,we,We,K),ie=new Bf(m,ge),se=new vf,Ne=new Af(De),Ee=new Gc(m,a,L,ve,B,x,b),ce=new bf(m,B,we),_=new Gf(T,Xe,we,ve),le=new Vc(T,De,Xe),Ie=new Zc(T,De,Xe),Xe.programs=he.programs,m.capabilities=we,m.extensions=De,m.properties=ge,m.renderLists=se,m.shadowMap=ce,m.state=ve,m.info=Xe}te();const O=new Of(m,T);this.xr=O,this.getContext=function(){return T},this.getContextAttributes=function(){return T.getContextAttributes()},this.forceContextLoss=function(){const c=De.get("WEBGL_lose_context");c&&c.loseContext()},this.forceContextRestore=function(){const c=De.get("WEBGL_lose_context");c&&c.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(c){c!==void 0&&(F=c,this.setSize(k,j,!1))},this.getSize=function(c){return c.set(k,j)},this.setSize=function(c,v,w=!0){if(O.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=c,j=v,t.width=Math.floor(c*F),t.height=Math.floor(v*F),w===!0&&(t.style.width=c+"px",t.style.height=v+"px"),this.setViewport(0,0,c,v)},this.getDrawingBufferSize=function(c){return c.set(k*F,j*F).floor()},this.setDrawingBufferSize=function(c,v,w){k=c,j=v,F=w,t.width=Math.floor(c*w),t.height=Math.floor(v*w),this.setViewport(0,0,c,v)},this.getCurrentViewport=function(c){return c.copy(A)},this.getViewport=function(c){return c.copy(Le)},this.setViewport=function(c,v,w,I){c.isVector4?Le.set(c.x,c.y,c.z,c.w):Le.set(c,v,w,I),ve.viewport(A.copy(Le).multiplyScalar(F).round())},this.getScissor=function(c){return c.copy(Be)},this.setScissor=function(c,v,w,I){c.isVector4?Be.set(c.x,c.y,c.z,c.w):Be.set(c,v,w,I),ve.scissor(Y.copy(Be).multiplyScalar(F).round())},this.getScissorTest=function(){return Qe},this.setScissorTest=function(c){ve.setScissorTest(Qe=c)},this.setOpaqueSort=function(c){_e=c},this.setTransparentSort=function(c){Se=c},this.getClearColor=function(c){return c.copy(Ee.getClearColor())},this.setClearColor=function(){Ee.setClearColor.apply(Ee,arguments)},this.getClearAlpha=function(){return Ee.getClearAlpha()},this.setClearAlpha=function(){Ee.setClearAlpha.apply(Ee,arguments)},this.clear=function(c=!0,v=!0,w=!0){let I=0;if(c){let S=!1;if(H!==null){const $=H.texture.format;S=$===Sr||$===Er||$===vr}if(S){const $=H.texture.type,ae=$===yt||$===Jt||$===hn||$===jt||$===_r||$===gr,fe=Ee.getClearColor(),de=Ee.getClearAlpha(),xe=fe.r,Ce=fe.g,ue=fe.b;ae?(N[0]=xe,N[1]=Ce,N[2]=ue,N[3]=de,T.clearBufferuiv(T.COLOR,0,N)):(C[0]=xe,C[1]=Ce,C[2]=ue,C[3]=de,T.clearBufferiv(T.COLOR,0,C))}else I|=T.COLOR_BUFFER_BIT}v&&(I|=T.DEPTH_BUFFER_BIT),w&&(I|=T.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),T.clear(I)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",z,!1),t.removeEventListener("webglcontextrestored",oe,!1),t.removeEventListener("webglcontextcreationerror",re,!1),se.dispose(),Ne.dispose(),ge.dispose(),a.dispose(),L.dispose(),B.dispose(),We.dispose(),_.dispose(),he.dispose(),O.dispose(),O.removeEventListener("sessionstart",qn),O.removeEventListener("sessionend",Kn),Pt.stop()};function z(c){c.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),Z=!0}function oe(){console.log("THREE.WebGLRenderer: Context Restored."),Z=!1;const c=Xe.autoReset,v=ce.enabled,w=ce.autoUpdate,I=ce.needsUpdate,S=ce.type;te(),Xe.autoReset=c,ce.enabled=v,ce.autoUpdate=w,ce.needsUpdate=I,ce.type=S}function re(c){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",c.statusMessage)}function Re(c){const v=c.target;v.removeEventListener("dispose",Re),Je(v)}function Je(c){it(c),ge.remove(c)}function it(c){const v=ge.get(c).programs;v!==void 0&&(v.forEach(function(w){he.releaseProgram(w)}),c.isShaderMaterial&&he.releaseShaderCache(c))}this.renderBufferDirect=function(c,v,w,I,S,$){v===null&&(v=Ze);const ae=S.isMesh&&S.matrixWorld.determinant()<0,fe=Cr(c,v,w,I,S);ve.setMaterial(I,ae);let de=w.index,xe=1;if(I.wireframe===!0){if(de=q.getWireframeAttribute(w),de===void 0)return;xe=2}const Ce=w.drawRange,ue=w.attributes.position;let Oe=Ce.start*xe,ze=(Ce.start+Ce.count)*xe;$!==null&&(Oe=Math.max(Oe,$.start*xe),ze=Math.min(ze,($.start+$.count)*xe)),de!==null?(Oe=Math.max(Oe,0),ze=Math.min(ze,de.count)):ue!=null&&(Oe=Math.max(Oe,0),ze=Math.min(ze,ue.count));const Ye=ze-Oe;if(Ye<0||Ye===1/0)return;We.setup(S,I,fe,w,de);let rt,Ge=le;if(de!==null&&(rt=W.get(de),Ge=Ie,Ge.setIndex(rt)),S.isMesh)I.wireframe===!0?(ve.setLineWidth(I.wireframeLinewidth*je()),Ge.setMode(T.LINES)):Ge.setMode(T.TRIANGLES);else if(S.isLine){let me=I.linewidth;me===void 0&&(me=1),ve.setLineWidth(me*je()),S.isLineSegments?Ge.setMode(T.LINES):S.isLineLoop?Ge.setMode(T.LINE_LOOP):Ge.setMode(T.LINE_STRIP)}else S.isPoints?Ge.setMode(T.POINTS):S.isSprite&&Ge.setMode(T.TRIANGLES);if(S.isBatchedMesh)if(S._multiDrawInstances!==null)Ge.renderMultiDrawInstances(S._multiDrawStarts,S._multiDrawCounts,S._multiDrawCount,S._multiDrawInstances);else if(De.get("WEBGL_multi_draw"))Ge.renderMultiDraw(S._multiDrawStarts,S._multiDrawCounts,S._multiDrawCount);else{const me=S._multiDrawStarts,gt=S._multiDrawCounts,He=S._multiDrawCount,pt=de?W.get(de).bytesPerElement:1,Ot=ge.get(I).currentProgram.getUniforms();for(let ct=0;ct<He;ct++)Ot.setValue(T,"_gl_DrawID",ct),Ge.render(me[ct]/pt,gt[ct])}else if(S.isInstancedMesh)Ge.renderInstances(Oe,Ye,S.count);else if(w.isInstancedBufferGeometry){const me=w._maxInstanceCount!==void 0?w._maxInstanceCount:1/0,gt=Math.min(w.instanceCount,me);Ge.renderInstances(Oe,Ye,gt)}else Ge.render(Oe,Ye)};function ke(c,v,w){c.transparent===!0&&c.side===Et&&c.forceSinglePass===!1?(c.side=lt,c.needsUpdate=!0,tn(c,v,w),c.side=Zt,c.needsUpdate=!0,tn(c,v,w),c.side=Et):tn(c,v,w)}this.compile=function(c,v,w=null){w===null&&(w=c),r=Ne.get(w),r.init(v),M.push(r),w.traverseVisible(function(S){S.isLight&&S.layers.test(v.layers)&&(r.pushLight(S),S.castShadow&&r.pushShadow(S))}),c!==w&&c.traverseVisible(function(S){S.isLight&&S.layers.test(v.layers)&&(r.pushLight(S),S.castShadow&&r.pushShadow(S))}),r.setupLights();const I=new Set;return c.traverse(function(S){if(!(S.isMesh||S.isPoints||S.isLine||S.isSprite))return;const $=S.material;if($)if(Array.isArray($))for(let ae=0;ae<$.length;ae++){const fe=$[ae];ke(fe,w,S),I.add(fe)}else ke($,w,S),I.add($)}),M.pop(),r=null,I},this.compileAsync=function(c,v,w=null){const I=this.compile(c,v,w);return new Promise(S=>{function $(){if(I.forEach(function(ae){ge.get(ae).currentProgram.isReady()&&I.delete(ae)}),I.size===0){S(c);return}setTimeout($,10)}De.get("KHR_parallel_shader_compile")!==null?$():setTimeout($,10)})};let ut=null;function _t(c){ut&&ut(c)}function qn(){Pt.stop()}function Kn(){Pt.start()}const Pt=new Mr;Pt.setAnimationLoop(_t),typeof self<"u"&&Pt.setContext(self),this.setAnimationLoop=function(c){ut=c,O.setAnimationLoop(c),c===null?Pt.stop():Pt.start()},O.addEventListener("sessionstart",qn),O.addEventListener("sessionend",Kn),this.render=function(c,v){if(v!==void 0&&v.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(Z===!0)return;if(c.matrixWorldAutoUpdate===!0&&c.updateMatrixWorld(),v.parent===null&&v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),O.enabled===!0&&O.isPresenting===!0&&(O.cameraAutoUpdate===!0&&O.updateCamera(v),v=O.getCamera()),c.isScene===!0&&c.onBeforeRender(m,c,v,H),r=Ne.get(c,M.length),r.init(v),M.push(r),Me.multiplyMatrices(v.projectionMatrix,v.matrixWorldInverse),V.setFromProjectionMatrix(Me),pe=this.localClippingEnabled,J=K.init(this.clippingPlanes,pe),l=se.get(c,P.length),l.init(),P.push(l),O.enabled===!0&&O.isPresenting===!0){const $=m.xr.getDepthSensingMesh();$!==null&&En($,v,-1/0,m.sortObjects)}En(c,v,0,m.sortObjects),l.finish(),m.sortObjects===!0&&l.sort(_e,Se),ye=O.enabled===!1||O.isPresenting===!1||O.hasDepthSensing()===!1,ye&&Ee.addToRenderList(l,c),this.info.render.frame++,J===!0&&K.beginShadows();const w=r.state.shadowsArray;ce.render(w,c,v),J===!0&&K.endShadows(),this.info.autoReset===!0&&this.info.reset();const I=l.opaque,S=l.transmissive;if(r.setupLights(),v.isArrayCamera){const $=v.cameras;if(S.length>0)for(let ae=0,fe=$.length;ae<fe;ae++){const de=$[ae];Zn(I,S,c,de)}ye&&Ee.render(c);for(let ae=0,fe=$.length;ae<fe;ae++){const de=$[ae];$n(l,c,de,de.viewport)}}else S.length>0&&Zn(I,S,c,v),ye&&Ee.render(c),$n(l,c,v);H!==null&&(u.updateMultisampleRenderTarget(H),u.updateRenderTargetMipmap(H)),c.isScene===!0&&c.onAfterRender(m,c,v),We.resetDefaultState(),p=-1,d=null,M.pop(),M.length>0?(r=M[M.length-1],J===!0&&K.setGlobalState(m.clippingPlanes,r.state.camera)):r=null,P.pop(),P.length>0?l=P[P.length-1]:l=null};function En(c,v,w,I){if(c.visible===!1)return;if(c.layers.test(v.layers)){if(c.isGroup)w=c.renderOrder;else if(c.isLOD)c.autoUpdate===!0&&c.update(v);else if(c.isLight)r.pushLight(c),c.castShadow&&r.pushShadow(c);else if(c.isSprite){if(!c.frustumCulled||V.intersectsSprite(c)){I&&Ue.setFromMatrixPosition(c.matrixWorld).applyMatrix4(Me);const ae=B.update(c),fe=c.material;fe.visible&&l.push(c,ae,fe,w,Ue.z,null)}}else if((c.isMesh||c.isLine||c.isPoints)&&(!c.frustumCulled||V.intersectsObject(c))){const ae=B.update(c),fe=c.material;if(I&&(c.boundingSphere!==void 0?(c.boundingSphere===null&&c.computeBoundingSphere(),Ue.copy(c.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),Ue.copy(ae.boundingSphere.center)),Ue.applyMatrix4(c.matrixWorld).applyMatrix4(Me)),Array.isArray(fe)){const de=ae.groups;for(let xe=0,Ce=de.length;xe<Ce;xe++){const ue=de[xe],Oe=fe[ue.materialIndex];Oe&&Oe.visible&&l.push(c,ae,Oe,w,Ue.z,ue)}}else fe.visible&&l.push(c,ae,fe,w,Ue.z,null)}}const $=c.children;for(let ae=0,fe=$.length;ae<fe;ae++)En($[ae],v,w,I)}function $n(c,v,w,I){const S=c.opaque,$=c.transmissive,ae=c.transparent;r.setupLightsView(w),J===!0&&K.setGlobalState(m.clippingPlanes,w),I&&ve.viewport(A.copy(I)),S.length>0&&en(S,v,w),$.length>0&&en($,v,w),ae.length>0&&en(ae,v,w),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function Zn(c,v,w,I){if((w.isScene===!0?w.overrideMaterial:null)!==null)return;r.state.transmissionRenderTarget[I.id]===void 0&&(r.state.transmissionRenderTarget[I.id]=new Nt(1,1,{generateMipmaps:!0,type:De.has("EXT_color_buffer_half_float")||De.has("EXT_color_buffer_float")?_n:yt,minFilter:Gt,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace}));const $=r.state.transmissionRenderTarget[I.id],ae=I.viewport||A;$.setSize(ae.z,ae.w);const fe=m.getRenderTarget();m.setRenderTarget($),m.getClearColor(X),Q=m.getClearAlpha(),Q<1&&m.setClearColor(16777215,.5),m.clear(),ye&&Ee.render(w);const de=m.toneMapping;m.toneMapping=Ct;const xe=I.viewport;if(I.viewport!==void 0&&(I.viewport=void 0),r.setupLightsView(I),J===!0&&K.setGlobalState(m.clippingPlanes,I),en(c,w,I),u.updateMultisampleRenderTarget($),u.updateRenderTargetMipmap($),De.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let ue=0,Oe=v.length;ue<Oe;ue++){const ze=v[ue],Ye=ze.object,rt=ze.geometry,Ge=ze.material,me=ze.group;if(Ge.side===Et&&Ye.layers.test(I.layers)){const gt=Ge.side;Ge.side=lt,Ge.needsUpdate=!0,Qn(Ye,w,I,rt,Ge,me),Ge.side=gt,Ge.needsUpdate=!0,Ce=!0}}Ce===!0&&(u.updateMultisampleRenderTarget($),u.updateRenderTargetMipmap($))}m.setRenderTarget(fe),m.setClearColor(X,Q),xe!==void 0&&(I.viewport=xe),m.toneMapping=de}function en(c,v,w){const I=v.isScene===!0?v.overrideMaterial:null;for(let S=0,$=c.length;S<$;S++){const ae=c[S],fe=ae.object,de=ae.geometry,xe=I===null?ae.material:I,Ce=ae.group;fe.layers.test(w.layers)&&Qn(fe,v,w,de,xe,Ce)}}function Qn(c,v,w,I,S,$){c.onBeforeRender(m,v,w,I,S,$),c.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,c.matrixWorld),c.normalMatrix.getNormalMatrix(c.modelViewMatrix),S.onBeforeRender(m,v,w,I,c,$),S.transparent===!0&&S.side===Et&&S.forceSinglePass===!1?(S.side=lt,S.needsUpdate=!0,m.renderBufferDirect(w,v,I,S,c,$),S.side=Zt,S.needsUpdate=!0,m.renderBufferDirect(w,v,I,S,c,$),S.side=Et):m.renderBufferDirect(w,v,I,S,c,$),c.onAfterRender(m,v,w,I,S,$)}function tn(c,v,w){v.isScene!==!0&&(v=Ze);const I=ge.get(c),S=r.state.lights,$=r.state.shadowsArray,ae=S.state.version,fe=he.getParameters(c,S.state,$,v,w),de=he.getProgramCacheKey(fe);let xe=I.programs;I.environment=c.isMeshStandardMaterial?v.environment:null,I.fog=v.fog,I.envMap=(c.isMeshStandardMaterial?L:a).get(c.envMap||I.environment),I.envMapRotation=I.environment!==null&&c.envMap===null?v.environmentRotation:c.envMapRotation,xe===void 0&&(c.addEventListener("dispose",Re),xe=new Map,I.programs=xe);let Ce=xe.get(de);if(Ce!==void 0){if(I.currentProgram===Ce&&I.lightsStateVersion===ae)return jn(c,fe),Ce}else fe.uniforms=he.getUniforms(c),c.onBeforeCompile(fe,m),Ce=he.acquireProgram(fe,de),xe.set(de,Ce),I.uniforms=fe.uniforms;const ue=I.uniforms;return(!c.isShaderMaterial&&!c.isRawShaderMaterial||c.clipping===!0)&&(ue.clippingPlanes=K.uniform),jn(c,fe),I.needsLights=Pr(c),I.lightsStateVersion=ae,I.needsLights&&(ue.ambientLightColor.value=S.state.ambient,ue.lightProbe.value=S.state.probe,ue.directionalLights.value=S.state.directional,ue.directionalLightShadows.value=S.state.directionalShadow,ue.spotLights.value=S.state.spot,ue.spotLightShadows.value=S.state.spotShadow,ue.rectAreaLights.value=S.state.rectArea,ue.ltc_1.value=S.state.rectAreaLTC1,ue.ltc_2.value=S.state.rectAreaLTC2,ue.pointLights.value=S.state.point,ue.pointLightShadows.value=S.state.pointShadow,ue.hemisphereLights.value=S.state.hemi,ue.directionalShadowMap.value=S.state.directionalShadowMap,ue.directionalShadowMatrix.value=S.state.directionalShadowMatrix,ue.spotShadowMap.value=S.state.spotShadowMap,ue.spotLightMatrix.value=S.state.spotLightMatrix,ue.spotLightMap.value=S.state.spotLightMap,ue.pointShadowMap.value=S.state.pointShadowMap,ue.pointShadowMatrix.value=S.state.pointShadowMatrix),I.currentProgram=Ce,I.uniformsList=null,Ce}function Jn(c){if(c.uniformsList===null){const v=c.currentProgram.getUniforms();c.uniformsList=dn.seqWithValue(v.seq,c.uniforms)}return c.uniformsList}function jn(c,v){const w=ge.get(c);w.outputColorSpace=v.outputColorSpace,w.batching=v.batching,w.batchingColor=v.batchingColor,w.instancing=v.instancing,w.instancingColor=v.instancingColor,w.instancingMorph=v.instancingMorph,w.skinning=v.skinning,w.morphTargets=v.morphTargets,w.morphNormals=v.morphNormals,w.morphColors=v.morphColors,w.morphTargetsCount=v.morphTargetsCount,w.numClippingPlanes=v.numClippingPlanes,w.numIntersection=v.numClipIntersection,w.vertexAlphas=v.vertexAlphas,w.vertexTangents=v.vertexTangents,w.toneMapping=v.toneMapping}function Cr(c,v,w,I,S){v.isScene!==!0&&(v=Ze),u.resetTextureUnits();const $=v.fog,ae=I.isMeshStandardMaterial?v.environment:null,fe=H===null?m.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:gn,de=(I.isMeshStandardMaterial?L:a).get(I.envMap||ae),xe=I.vertexColors===!0&&!!w.attributes.color&&w.attributes.color.itemSize===4,Ce=!!w.attributes.tangent&&(!!I.normalMap||I.anisotropy>0),ue=!!w.morphAttributes.position,Oe=!!w.morphAttributes.normal,ze=!!w.morphAttributes.color;let Ye=Ct;I.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(Ye=m.toneMapping);const rt=w.morphAttributes.position||w.morphAttributes.normal||w.morphAttributes.color,Ge=rt!==void 0?rt.length:0,me=ge.get(I),gt=r.state.lights;if(J===!0&&(pe===!0||c!==d)){const dt=c===d&&I.id===p;K.setState(I,c,dt)}let He=!1;I.version===me.__version?(me.needsLights&&me.lightsStateVersion!==gt.state.version||me.outputColorSpace!==fe||S.isBatchedMesh&&me.batching===!1||!S.isBatchedMesh&&me.batching===!0||S.isBatchedMesh&&me.batchingColor===!0&&S.colorTexture===null||S.isBatchedMesh&&me.batchingColor===!1&&S.colorTexture!==null||S.isInstancedMesh&&me.instancing===!1||!S.isInstancedMesh&&me.instancing===!0||S.isSkinnedMesh&&me.skinning===!1||!S.isSkinnedMesh&&me.skinning===!0||S.isInstancedMesh&&me.instancingColor===!0&&S.instanceColor===null||S.isInstancedMesh&&me.instancingColor===!1&&S.instanceColor!==null||S.isInstancedMesh&&me.instancingMorph===!0&&S.morphTexture===null||S.isInstancedMesh&&me.instancingMorph===!1&&S.morphTexture!==null||me.envMap!==de||I.fog===!0&&me.fog!==$||me.numClippingPlanes!==void 0&&(me.numClippingPlanes!==K.numPlanes||me.numIntersection!==K.numIntersection)||me.vertexAlphas!==xe||me.vertexTangents!==Ce||me.morphTargets!==ue||me.morphNormals!==Oe||me.morphColors!==ze||me.toneMapping!==Ye||me.morphTargetsCount!==Ge)&&(He=!0):(He=!0,me.__version=I.version);let pt=me.currentProgram;He===!0&&(pt=tn(I,v,S));let Ot=!1,ct=!1,zt=!1;const qe=pt.getUniforms(),ht=me.uniforms;if(ve.useProgram(pt.program)&&(Ot=!0,ct=!0,zt=!0),I.id!==p&&(p=I.id,ct=!0),Ot||d!==c){ve.buffers.depth.getReversed()?(ne.copy(c.projectionMatrix),Ja(ne),ja(ne),qe.setValue(T,"projectionMatrix",ne)):qe.setValue(T,"projectionMatrix",c.projectionMatrix),qe.setValue(T,"viewMatrix",c.matrixWorldInverse);const Tt=qe.map.cameraPosition;Tt!==void 0&&Tt.setValue(T,Ae.setFromMatrixPosition(c.matrixWorld)),we.logarithmicDepthBuffer&&qe.setValue(T,"logDepthBufFC",2/(Math.log(c.far+1)/Math.LN2)),(I.isMeshPhongMaterial||I.isMeshToonMaterial||I.isMeshLambertMaterial||I.isMeshBasicMaterial||I.isMeshStandardMaterial||I.isShaderMaterial)&&qe.setValue(T,"isOrthographic",c.isOrthographicCamera===!0),d!==c&&(d=c,ct=!0,zt=!0)}if(S.isSkinnedMesh){qe.setOptional(T,S,"bindMatrix"),qe.setOptional(T,S,"bindMatrixInverse");const dt=S.skeleton;dt&&(dt.boneTexture===null&&dt.computeBoneTexture(),qe.setValue(T,"boneTexture",dt.boneTexture,u))}S.isBatchedMesh&&(qe.setOptional(T,S,"batchingTexture"),qe.setValue(T,"batchingTexture",S._matricesTexture,u),qe.setOptional(T,S,"batchingIdTexture"),qe.setValue(T,"batchingIdTexture",S._indirectTexture,u),qe.setOptional(T,S,"batchingColorTexture"),S._colorsTexture!==null&&qe.setValue(T,"batchingColorTexture",S._colorsTexture,u));const Xt=w.morphAttributes;if((Xt.position!==void 0||Xt.normal!==void 0||Xt.color!==void 0)&&Te.update(S,w,pt),(ct||me.receiveShadow!==S.receiveShadow)&&(me.receiveShadow=S.receiveShadow,qe.setValue(T,"receiveShadow",S.receiveShadow)),I.isMeshGouraudMaterial&&I.envMap!==null&&(ht.envMap.value=de,ht.flipEnvMap.value=de.isCubeTexture&&de.isRenderTargetTexture===!1?-1:1),I.isMeshStandardMaterial&&I.envMap===null&&v.environment!==null&&(ht.envMapIntensity.value=v.environmentIntensity),ct&&(qe.setValue(T,"toneMappingExposure",m.toneMappingExposure),me.needsLights&&br(ht,zt),$&&I.fog===!0&&ie.refreshFogUniforms(ht,$),ie.refreshMaterialUniforms(ht,I,F,j,r.state.transmissionRenderTarget[c.id]),dn.upload(T,Jn(me),ht,u)),I.isShaderMaterial&&I.uniformsNeedUpdate===!0&&(dn.upload(T,Jn(me),ht,u),I.uniformsNeedUpdate=!1),I.isSpriteMaterial&&qe.setValue(T,"center",S.center),qe.setValue(T,"modelViewMatrix",S.modelViewMatrix),qe.setValue(T,"normalMatrix",S.normalMatrix),qe.setValue(T,"modelMatrix",S.matrixWorld),I.isShaderMaterial||I.isRawShaderMaterial){const dt=I.uniformsGroups;for(let Tt=0,xt=dt.length;Tt<xt;Tt++){const ei=dt[Tt];_.update(ei,pt),_.bind(ei,pt)}}return pt}function br(c,v){c.ambientLightColor.needsUpdate=v,c.lightProbe.needsUpdate=v,c.directionalLights.needsUpdate=v,c.directionalLightShadows.needsUpdate=v,c.pointLights.needsUpdate=v,c.pointLightShadows.needsUpdate=v,c.spotLights.needsUpdate=v,c.spotLightShadows.needsUpdate=v,c.rectAreaLights.needsUpdate=v,c.hemisphereLights.needsUpdate=v}function Pr(c){return c.isMeshLambertMaterial||c.isMeshToonMaterial||c.isMeshPhongMaterial||c.isMeshStandardMaterial||c.isShadowMaterial||c.isShaderMaterial&&c.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(c,v,w){ge.get(c.texture).__webglTexture=v,ge.get(c.depthTexture).__webglTexture=w;const I=ge.get(c);I.__hasExternalTextures=!0,I.__autoAllocateDepthBuffer=w===void 0,I.__autoAllocateDepthBuffer||De.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),I.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(c,v){const w=ge.get(c);w.__webglFramebuffer=v,w.__useDefaultFramebuffer=v===void 0},this.setRenderTarget=function(c,v=0,w=0){H=c,D=v,y=w;let I=!0,S=null,$=!1,ae=!1;if(c){const de=ge.get(c);if(de.__useDefaultFramebuffer!==void 0)ve.bindFramebuffer(T.FRAMEBUFFER,null),I=!1;else if(de.__webglFramebuffer===void 0)u.setupRenderTarget(c);else if(de.__hasExternalTextures)u.rebindTextures(c,ge.get(c.texture).__webglTexture,ge.get(c.depthTexture).__webglTexture);else if(c.depthBuffer){const ue=c.depthTexture;if(de.__boundDepthTexture!==ue){if(ue!==null&&ge.has(ue)&&(c.width!==ue.image.width||c.height!==ue.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");u.setupDepthRenderbuffer(c)}}const xe=c.texture;(xe.isData3DTexture||xe.isDataArrayTexture||xe.isCompressedArrayTexture)&&(ae=!0);const Ce=ge.get(c).__webglFramebuffer;c.isWebGLCubeRenderTarget?(Array.isArray(Ce[v])?S=Ce[v][w]:S=Ce[v],$=!0):c.samples>0&&u.useMultisampledRTT(c)===!1?S=ge.get(c).__webglMultisampledFramebuffer:Array.isArray(Ce)?S=Ce[w]:S=Ce,A.copy(c.viewport),Y.copy(c.scissor),G=c.scissorTest}else A.copy(Le).multiplyScalar(F).floor(),Y.copy(Be).multiplyScalar(F).floor(),G=Qe;if(ve.bindFramebuffer(T.FRAMEBUFFER,S)&&I&&ve.drawBuffers(c,S),ve.viewport(A),ve.scissor(Y),ve.setScissorTest(G),$){const de=ge.get(c.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_CUBE_MAP_POSITIVE_X+v,de.__webglTexture,w)}else if(ae){const de=ge.get(c.texture),xe=v||0;T.framebufferTextureLayer(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,de.__webglTexture,w||0,xe)}p=-1},this.readRenderTargetPixels=function(c,v,w,I,S,$,ae){if(!(c&&c.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let fe=ge.get(c).__webglFramebuffer;if(c.isWebGLCubeRenderTarget&&ae!==void 0&&(fe=fe[ae]),fe){ve.bindFramebuffer(T.FRAMEBUFFER,fe);try{const de=c.texture,xe=de.format,Ce=de.type;if(!we.textureFormatReadable(xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!we.textureTypeReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}v>=0&&v<=c.width-I&&w>=0&&w<=c.height-S&&T.readPixels(v,w,I,S,be.convert(xe),be.convert(Ce),$)}finally{const de=H!==null?ge.get(H).__webglFramebuffer:null;ve.bindFramebuffer(T.FRAMEBUFFER,de)}}},this.readRenderTargetPixelsAsync=async function(c,v,w,I,S,$,ae){if(!(c&&c.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let fe=ge.get(c).__webglFramebuffer;if(c.isWebGLCubeRenderTarget&&ae!==void 0&&(fe=fe[ae]),fe){const de=c.texture,xe=de.format,Ce=de.type;if(!we.textureFormatReadable(xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!we.textureTypeReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(v>=0&&v<=c.width-I&&w>=0&&w<=c.height-S){ve.bindFramebuffer(T.FRAMEBUFFER,fe);const ue=T.createBuffer();T.bindBuffer(T.PIXEL_PACK_BUFFER,ue),T.bufferData(T.PIXEL_PACK_BUFFER,$.byteLength,T.STREAM_READ),T.readPixels(v,w,I,S,be.convert(xe),be.convert(Ce),0);const Oe=H!==null?ge.get(H).__webglFramebuffer:null;ve.bindFramebuffer(T.FRAMEBUFFER,Oe);const ze=T.fenceSync(T.SYNC_GPU_COMMANDS_COMPLETE,0);return T.flush(),await eo(T,ze,4),T.bindBuffer(T.PIXEL_PACK_BUFFER,ue),T.getBufferSubData(T.PIXEL_PACK_BUFFER,0,$),T.deleteBuffer(ue),T.deleteSync(ze),$}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(c,v=null,w=0){c.isTexture!==!0&&(qt("WebGLRenderer: copyFramebufferToTexture function signature has changed."),v=arguments[0]||null,c=arguments[1]);const I=Math.pow(2,-w),S=Math.floor(c.image.width*I),$=Math.floor(c.image.height*I),ae=v!==null?v.x:0,fe=v!==null?v.y:0;u.setTexture2D(c,0),T.copyTexSubImage2D(T.TEXTURE_2D,w,0,0,ae,fe,S,$),ve.unbindTexture()},this.copyTextureToTexture=function(c,v,w=null,I=null,S=0){c.isTexture!==!0&&(qt("WebGLRenderer: copyTextureToTexture function signature has changed."),I=arguments[0]||null,c=arguments[1],v=arguments[2],S=arguments[3]||0,w=null);let $,ae,fe,de,xe,Ce,ue,Oe,ze;const Ye=c.isCompressedTexture?c.mipmaps[S]:c.image;w!==null?($=w.max.x-w.min.x,ae=w.max.y-w.min.y,fe=w.isBox3?w.max.z-w.min.z:1,de=w.min.x,xe=w.min.y,Ce=w.isBox3?w.min.z:0):($=Ye.width,ae=Ye.height,fe=Ye.depth||1,de=0,xe=0,Ce=0),I!==null?(ue=I.x,Oe=I.y,ze=I.z):(ue=0,Oe=0,ze=0);const rt=be.convert(v.format),Ge=be.convert(v.type);let me;v.isData3DTexture?(u.setTexture3D(v,0),me=T.TEXTURE_3D):v.isDataArrayTexture||v.isCompressedArrayTexture?(u.setTexture2DArray(v,0),me=T.TEXTURE_2D_ARRAY):(u.setTexture2D(v,0),me=T.TEXTURE_2D),T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,v.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,v.unpackAlignment);const gt=T.getParameter(T.UNPACK_ROW_LENGTH),He=T.getParameter(T.UNPACK_IMAGE_HEIGHT),pt=T.getParameter(T.UNPACK_SKIP_PIXELS),Ot=T.getParameter(T.UNPACK_SKIP_ROWS),ct=T.getParameter(T.UNPACK_SKIP_IMAGES);T.pixelStorei(T.UNPACK_ROW_LENGTH,Ye.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Ye.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,de),T.pixelStorei(T.UNPACK_SKIP_ROWS,xe),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Ce);const zt=c.isDataArrayTexture||c.isData3DTexture,qe=v.isDataArrayTexture||v.isData3DTexture;if(c.isRenderTargetTexture||c.isDepthTexture){const ht=ge.get(c),Xt=ge.get(v),dt=ge.get(ht.__renderTarget),Tt=ge.get(Xt.__renderTarget);ve.bindFramebuffer(T.READ_FRAMEBUFFER,dt.__webglFramebuffer),ve.bindFramebuffer(T.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer);for(let xt=0;xt<fe;xt++)zt&&T.framebufferTextureLayer(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,ge.get(c).__webglTexture,S,Ce+xt),c.isDepthTexture?(qe&&T.framebufferTextureLayer(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,ge.get(v).__webglTexture,S,ze+xt),T.blitFramebuffer(de,xe,$,ae,ue,Oe,$,ae,T.DEPTH_BUFFER_BIT,T.NEAREST)):qe?T.copyTexSubImage3D(me,S,ue,Oe,ze+xt,de,xe,$,ae):T.copyTexSubImage2D(me,S,ue,Oe,ze+xt,de,xe,$,ae);ve.bindFramebuffer(T.READ_FRAMEBUFFER,null),ve.bindFramebuffer(T.DRAW_FRAMEBUFFER,null)}else qe?c.isDataTexture||c.isData3DTexture?T.texSubImage3D(me,S,ue,Oe,ze,$,ae,fe,rt,Ge,Ye.data):v.isCompressedArrayTexture?T.compressedTexSubImage3D(me,S,ue,Oe,ze,$,ae,fe,rt,Ye.data):T.texSubImage3D(me,S,ue,Oe,ze,$,ae,fe,rt,Ge,Ye):c.isDataTexture?T.texSubImage2D(T.TEXTURE_2D,S,ue,Oe,$,ae,rt,Ge,Ye.data):c.isCompressedTexture?T.compressedTexSubImage2D(T.TEXTURE_2D,S,ue,Oe,Ye.width,Ye.height,rt,Ye.data):T.texSubImage2D(T.TEXTURE_2D,S,ue,Oe,$,ae,rt,Ge,Ye);T.pixelStorei(T.UNPACK_ROW_LENGTH,gt),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,He),T.pixelStorei(T.UNPACK_SKIP_PIXELS,pt),T.pixelStorei(T.UNPACK_SKIP_ROWS,Ot),T.pixelStorei(T.UNPACK_SKIP_IMAGES,ct),S===0&&v.generateMipmaps&&T.generateMipmap(me),ve.unbindTexture()},this.copyTextureToTexture3D=function(c,v,w=null,I=null,S=0){return c.isTexture!==!0&&(qt("WebGLRenderer: copyTextureToTexture3D function signature has changed."),w=arguments[0]||null,I=arguments[1]||null,c=arguments[2],v=arguments[3],S=arguments[4]||0),qt('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(c,v,w,I,S)},this.initRenderTarget=function(c){ge.get(c).__webglFramebuffer===void 0&&u.setupRenderTarget(c)},this.initTexture=function(c){c.isCubeTexture?u.setTextureCube(c,0):c.isData3DTexture?u.setTexture3D(c,0):c.isDataArrayTexture||c.isCompressedArrayTexture?u.setTexture2DArray(c,0):u.setTexture2D(c,0),ve.unbindTexture()},this.resetState=function(){D=0,y=0,H=null,ve.reset(),We.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return to}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;const t=this.getContext();t.drawingBufferColorspace=et._getDrawingBufferColorSpace(n),t.unpackColorSpace=et._getUnpackColorSpace()}}export{Oi as P,Nt as W,Vf as a};
