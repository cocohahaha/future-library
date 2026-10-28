(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Sl="170",bi={ROTATE:0,DOLLY:1,PAN:2},Gi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ad=0,vu=1,Cd=2,bl=1,df=2,pi=3,fn=0,sn=1,ve=2,Xi=0,Xs=1,Tc=2,_u=3,Mu=4,Rd=5,cs=100,Pd=101,Ld=102,Dd=103,Id=104,Ud=200,Nd=201,Fd=202,Od=203,Ac=204,Cc=205,kd=206,zd=207,Bd=208,Hd=209,Gd=210,Vd=211,Wd=212,Xd=213,qd=214,Rc=0,Pc=1,Lc=2,$s=3,Dc=4,Ic=5,Uc=6,Nc=7,pf=0,Yd=1,Zd=2,wi=0,$d=1,jd=2,Kd=3,Jd=4,Qd=5,t0=6,e0=7,mf=300,js=301,Ks=302,Fc=303,Oc=304,Ma=306,Wo=1e3,Vi=1001,kc=1002,yn=1003,n0=1004,hr=1005,_n=1006,Oa=1007,Mi=1008,ei=1009,gf=1010,xf=1011,Xo=1012,wl=1013,ps=1014,Qn=1015,gs=1016,El=1017,Tl=1018,Js=1020,vf=35902,_f=1021,Mf=1022,Ln=1023,yf=1024,Sf=1025,qs=1026,Qs=1027,Al=1028,Cl=1029,bf=1030,Rl=1031,Pl=1033,Zr=33776,$r=33777,jr=33778,Kr=33779,zc=35840,Bc=35841,Hc=35842,Gc=35843,Vc=36196,Wc=37492,Xc=37496,qc=37808,Yc=37809,Zc=37810,$c=37811,jc=37812,Kc=37813,Jc=37814,Qc=37815,tl=37816,el=37817,nl=37818,il=37819,sl=37820,ol=37821,Jr=36492,rl=36494,al=36495,wf=36283,cl=36284,ll=36285,ul=36286,i0=3200,s0=3201,Ef=0,o0=1,Jn="",We="srgb",ao="srgb-linear",ya="linear",de="srgb",Ss=7680,yu=519,r0=512,a0=513,c0=514,Tf=515,l0=516,u0=517,h0=518,f0=519,Su=35044,ko=35048,bu="300 es",yi=2e3,ea=2001;class xs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let o=0,r=s.length;o<r;o++)s[o].call(this,t);t.target=null}}}const Ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let wu=1234567;const zo=Math.PI/180,qo=180/Math.PI;function vs(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ye[i&255]+Ye[i>>8&255]+Ye[i>>16&255]+Ye[i>>24&255]+"-"+Ye[t&255]+Ye[t>>8&255]+"-"+Ye[t>>16&15|64]+Ye[t>>24&255]+"-"+Ye[e&63|128]+Ye[e>>8&255]+"-"+Ye[e>>16&255]+Ye[e>>24&255]+Ye[n&255]+Ye[n>>8&255]+Ye[n>>16&255]+Ye[n>>24&255]).toLowerCase()}function Re(i,t,e){return Math.max(t,Math.min(e,i))}function Ll(i,t){return(i%t+t)%t}function d0(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function p0(i,t,e){return i!==t?(e-i)/(t-i):0}function Bo(i,t,e){return(1-e)*i+e*t}function m0(i,t,e,n){return Bo(i,t,1-Math.exp(-e*n))}function g0(i,t=1){return t-Math.abs(Ll(i,t*2)-t)}function x0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function v0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function _0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function M0(i,t){return i+Math.random()*(t-i)}function y0(i){return i*(.5-Math.random())}function S0(i){i!==void 0&&(wu=i);let t=wu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function b0(i){return i*zo}function w0(i){return i*qo}function E0(i){return(i&i-1)===0&&i!==0}function T0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function A0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function C0(i,t,e,n,s){const o=Math.cos,r=Math.sin,a=o(e/2),c=r(e/2),l=o((t+n)/2),u=r((t+n)/2),f=o((t-n)/2),d=r((t-n)/2),h=o((n-t)/2),g=r((n-t)/2);switch(s){case"XYX":i.set(a*u,c*f,c*d,a*l);break;case"YZY":i.set(c*d,a*u,c*f,a*l);break;case"ZXZ":i.set(c*f,c*d,a*u,a*l);break;case"XZX":i.set(a*u,c*g,c*h,a*l);break;case"YXY":i.set(c*h,a*u,c*g,a*l);break;case"ZYZ":i.set(c*g,c*h,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ks(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Je(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const en={DEG2RAD:zo,RAD2DEG:qo,generateUUID:vs,clamp:Re,euclideanModulo:Ll,mapLinear:d0,inverseLerp:p0,lerp:Bo,damp:m0,pingpong:g0,smoothstep:x0,smootherstep:v0,randInt:_0,randFloat:M0,randFloatSpread:y0,seededRandom:S0,degToRad:b0,radToDeg:w0,isPowerOfTwo:E0,ceilPowerOfTwo:T0,floorPowerOfTwo:A0,setQuaternionFromProperEuler:C0,normalize:Je,denormalize:ks};class rt{constructor(t=0,e=0){rt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*n-r*s+t.x,this.y=o*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Zt{constructor(t,e,n,s,o,r,a,c,l){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l)}set(t,e,n,s,o,r,a,c,l){const u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=o,u[5]=c,u[6]=n,u[7]=r,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[3],c=n[6],l=n[1],u=n[4],f=n[7],d=n[2],h=n[5],g=n[8],x=s[0],p=s[3],m=s[6],v=s[1],M=s[4],_=s[7],w=s[2],b=s[5],A=s[8];return o[0]=r*x+a*v+c*w,o[3]=r*p+a*M+c*b,o[6]=r*m+a*_+c*A,o[1]=l*x+u*v+f*w,o[4]=l*p+u*M+f*b,o[7]=l*m+u*_+f*A,o[2]=d*x+h*v+g*w,o[5]=d*p+h*M+g*b,o[8]=d*m+h*_+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*r*u-e*a*l-n*o*u+n*a*c+s*o*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],u=t[8],f=u*r-a*l,d=a*c-u*o,h=l*o-r*c,g=e*f+n*d+s*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=f*x,t[1]=(s*l-u*n)*x,t[2]=(a*n-s*r)*x,t[3]=d*x,t[4]=(u*e-s*c)*x,t[5]=(s*o-a*e)*x,t[6]=h*x,t[7]=(n*c-l*e)*x,t[8]=(r*e-n*o)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,o,r,a){const c=Math.cos(o),l=Math.sin(o);return this.set(n*c,n*l,-n*(c*r+l*a)+r+t,-s*l,s*c,-s*(-l*r+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ka.makeScale(t,e)),this}rotate(t){return this.premultiply(ka.makeRotation(-t)),this}translate(t,e){return this.premultiply(ka.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ka=new Zt;function Af(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function na(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function R0(){const i=na("canvas");return i.style.display="block",i}const Eu={};function Uo(i){i in Eu||(Eu[i]=!0,console.warn(i))}function P0(i,t,e){return new Promise(function(n,s){function o(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:n()}}setTimeout(o,e)})}function L0(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function D0(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const re={enabled:!0,workingColorSpace:ao,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===de&&(i.r=Ei(i.r),i.g=Ei(i.g),i.b=Ei(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===de&&(i.r=Ys(i.r),i.g=Ys(i.g),i.b=Ys(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Jn?ya:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Ei(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ys(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Tu=[.64,.33,.3,.6,.15,.06],Au=[.2126,.7152,.0722],Cu=[.3127,.329],Ru=new Zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pu=new Zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);re.define({[ao]:{primaries:Tu,whitePoint:Cu,transfer:ya,toXYZ:Ru,fromXYZ:Pu,luminanceCoefficients:Au,workingColorSpaceConfig:{unpackColorSpace:We},outputColorSpaceConfig:{drawingBufferColorSpace:We}},[We]:{primaries:Tu,whitePoint:Cu,transfer:de,toXYZ:Ru,fromXYZ:Pu,luminanceCoefficients:Au,outputColorSpaceConfig:{drawingBufferColorSpace:We}}});let bs;class I0{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{bs===void 0&&(bs=na("canvas")),bs.width=t.width,bs.height=t.height;const n=bs.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=bs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){const e=na("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),o=s.data;for(let r=0;r<o.length;r++)o[r]=Ei(o[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ei(e[n]/255)*255):e[n]=Ei(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let U0=0;class Cf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:U0++}),this.uuid=vs(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let r=0,a=s.length;r<a;r++)s[r].isDataTexture?o.push(za(s[r].image)):o.push(za(s[r]))}else o=za(s);n.url=o}return e||(t.images[this.uuid]=n),n}}function za(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?I0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let N0=0;class je extends xs{constructor(t=je.DEFAULT_IMAGE,e=je.DEFAULT_MAPPING,n=Vi,s=Vi,o=_n,r=Mi,a=Ln,c=ei,l=je.DEFAULT_ANISOTROPY,u=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:N0++}),this.uuid=vs(),this.name="",this.source=new Cf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=o,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new rt(0,0),this.repeat=new rt(1,1),this.center=new rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==mf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Wo:t.x=t.x-Math.floor(t.x);break;case Vi:t.x=t.x<0?0:1;break;case kc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Wo:t.y=t.y-Math.floor(t.y);break;case Vi:t.y=t.y<0?0:1;break;case kc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=mf;je.DEFAULT_ANISOTROPY=1;class oe{constructor(t=0,e=0,n=0,s=1){oe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*o,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*o,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*o,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,o;const c=t.elements,l=c[0],u=c[4],f=c[8],d=c[1],h=c[5],g=c[9],x=c[2],p=c[6],m=c[10];if(Math.abs(u-d)<.01&&Math.abs(f-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+x)<.1&&Math.abs(g+p)<.1&&Math.abs(l+h+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,_=(h+1)/2,w=(m+1)/2,b=(u+d)/4,A=(f+x)/4,R=(g+p)/4;return M>_&&M>w?M<.01?(n=0,s=.707106781,o=.707106781):(n=Math.sqrt(M),s=b/n,o=A/n):_>w?_<.01?(n=.707106781,s=0,o=.707106781):(s=Math.sqrt(_),n=b/s,o=R/s):w<.01?(n=.707106781,s=.707106781,o=0):(o=Math.sqrt(w),n=A/o,s=R/o),this.set(n,s,o,e),this}let v=Math.sqrt((p-g)*(p-g)+(f-x)*(f-x)+(d-u)*(d-u));return Math.abs(v)<.001&&(v=1),this.x=(p-g)/v,this.y=(f-x)/v,this.z=(d-u)/v,this.w=Math.acos((l+h+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class F0 extends xs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new oe(0,0,t,e),this.scissorTest=!1,this.viewport=new oe(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_n,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const o=new je(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);o.flipY=!1,o.generateMipmaps=n.generateMipmaps,o.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let a=0;a<r;a++)this.textures[a]=o.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Cf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xn extends F0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Rf extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=yn,this.minFilter=yn,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class O0 extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=yn,this.minFilter=yn,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class wn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,o,r,a){let c=n[s+0],l=n[s+1],u=n[s+2],f=n[s+3];const d=o[r+0],h=o[r+1],g=o[r+2],x=o[r+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=f;return}if(a===1){t[e+0]=d,t[e+1]=h,t[e+2]=g,t[e+3]=x;return}if(f!==x||c!==d||l!==h||u!==g){let p=1-a;const m=c*d+l*h+u*g+f*x,v=m>=0?1:-1,M=1-m*m;if(M>Number.EPSILON){const w=Math.sqrt(M),b=Math.atan2(w,m*v);p=Math.sin(p*b)/w,a=Math.sin(a*b)/w}const _=a*v;if(c=c*p+d*_,l=l*p+h*_,u=u*p+g*_,f=f*p+x*_,p===1-a){const w=1/Math.sqrt(c*c+l*l+u*u+f*f);c*=w,l*=w,u*=w,f*=w}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,o,r){const a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],f=o[r],d=o[r+1],h=o[r+2],g=o[r+3];return t[e]=a*g+u*f+c*h-l*d,t[e+1]=c*g+u*d+l*f-a*h,t[e+2]=l*g+u*h+a*d-c*f,t[e+3]=u*g-a*f-c*d-l*h,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,o=t._z,r=t._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),f=a(o/2),d=c(n/2),h=c(s/2),g=c(o/2);switch(r){case"XYZ":this._x=d*u*f+l*h*g,this._y=l*h*f-d*u*g,this._z=l*u*g+d*h*f,this._w=l*u*f-d*h*g;break;case"YXZ":this._x=d*u*f+l*h*g,this._y=l*h*f-d*u*g,this._z=l*u*g-d*h*f,this._w=l*u*f+d*h*g;break;case"ZXY":this._x=d*u*f-l*h*g,this._y=l*h*f+d*u*g,this._z=l*u*g+d*h*f,this._w=l*u*f-d*h*g;break;case"ZYX":this._x=d*u*f-l*h*g,this._y=l*h*f+d*u*g,this._z=l*u*g-d*h*f,this._w=l*u*f+d*h*g;break;case"YZX":this._x=d*u*f+l*h*g,this._y=l*h*f+d*u*g,this._z=l*u*g-d*h*f,this._w=l*u*f-d*h*g;break;case"XZY":this._x=d*u*f-l*h*g,this._y=l*h*f-d*u*g,this._z=l*u*g+d*h*f,this._w=l*u*f+d*h*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],o=e[8],r=e[1],a=e[5],c=e[9],l=e[2],u=e[6],f=e[10],d=n+a+f;if(d>0){const h=.5/Math.sqrt(d+1);this._w=.25/h,this._x=(u-c)*h,this._y=(o-l)*h,this._z=(r-s)*h}else if(n>a&&n>f){const h=2*Math.sqrt(1+n-a-f);this._w=(u-c)/h,this._x=.25*h,this._y=(s+r)/h,this._z=(o+l)/h}else if(a>f){const h=2*Math.sqrt(1+a-n-f);this._w=(o-l)/h,this._x=(s+r)/h,this._y=.25*h,this._z=(c+u)/h}else{const h=2*Math.sqrt(1+f-n-a);this._w=(r-s)/h,this._x=(o+l)/h,this._y=(c+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Re(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,o=t._z,r=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+r*a+s*l-o*c,this._y=s*u+r*c+o*a-n*l,this._z=o*u+r*l+n*c-s*a,this._w=r*u-n*a-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,o=this._z,r=this._w;let a=r*t._w+n*t._x+s*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=n,this._y=s,this._z=o,this;const c=1-a*a;if(c<=Number.EPSILON){const h=1-e;return this._w=h*r+e*this._w,this._x=h*n+e*this._x,this._y=h*s+e*this._y,this._z=h*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),f=Math.sin((1-e)*u)/l,d=Math.sin(e*u)/l;return this._w=r*f+this._w*d,this._x=n*f+this._x*d,this._y=s*f+this._y*d,this._z=o*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),o=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Lu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Lu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*s,this.y=o[1]*e+o[4]*n+o[7]*s,this.z=o[2]*e+o[5]*n+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=t.elements,r=1/(o[3]*e+o[7]*n+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*s+o[12])*r,this.y=(o[1]*e+o[5]*n+o[9]*s+o[13])*r,this.z=(o[2]*e+o[6]*n+o[10]*s+o[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,o=t.x,r=t.y,a=t.z,c=t.w,l=2*(r*s-a*n),u=2*(a*e-o*s),f=2*(o*n-r*e);return this.x=e+c*l+r*f-a*u,this.y=n+c*u+a*l-o*f,this.z=s+c*f+o*u-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s,this.y=o[1]*e+o[5]*n+o[9]*s,this.z=o[2]*e+o[6]*n+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,o=t.z,r=e.x,a=e.y,c=e.z;return this.x=s*c-o*a,this.y=o*r-n*c,this.z=n*a-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ba.copy(this).projectOnVector(t),this.sub(Ba)}reflect(t){return this.sub(Ba.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ba=new C,Lu=new wn;class _s{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,Fn):Fn.fromBufferAttribute(o,r),Fn.applyMatrix4(t.matrixWorld),this.expandByPoint(Fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),fr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fr.copy(n.boundingBox)),fr.applyMatrix4(t.matrixWorld),this.union(fr)}const s=t.children;for(let o=0,r=s.length;o<r;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Fn),Fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(xo),dr.subVectors(this.max,xo),ws.subVectors(t.a,xo),Es.subVectors(t.b,xo),Ts.subVectors(t.c,xo),Di.subVectors(Es,ws),Ii.subVectors(Ts,Es),Qi.subVectors(ws,Ts);let e=[0,-Di.z,Di.y,0,-Ii.z,Ii.y,0,-Qi.z,Qi.y,Di.z,0,-Di.x,Ii.z,0,-Ii.x,Qi.z,0,-Qi.x,-Di.y,Di.x,0,-Ii.y,Ii.x,0,-Qi.y,Qi.x,0];return!Ha(e,ws,Es,Ts,dr)||(e=[1,0,0,0,1,0,0,0,1],!Ha(e,ws,Es,Ts,dr))?!1:(pr.crossVectors(Di,Ii),e=[pr.x,pr.y,pr.z],Ha(e,ws,Es,Ts,dr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ri),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const ri=[new C,new C,new C,new C,new C,new C,new C,new C],Fn=new C,fr=new _s,ws=new C,Es=new C,Ts=new C,Di=new C,Ii=new C,Qi=new C,xo=new C,dr=new C,pr=new C,ts=new C;function Ha(i,t,e,n,s){for(let o=0,r=i.length-3;o<=r;o+=3){ts.fromArray(i,o);const a=s.x*Math.abs(ts.x)+s.y*Math.abs(ts.y)+s.z*Math.abs(ts.z),c=t.dot(ts),l=e.dot(ts),u=n.dot(ts);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const k0=new _s,vo=new C,Ga=new C;class co{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):k0.setFromPoints(t).getCenter(n);let s=0;for(let o=0,r=t.length;o<r;o++)s=Math.max(s,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;vo.subVectors(t,this.center);const e=vo.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(vo,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ga.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(vo.copy(t.center).add(Ga)),this.expandByPoint(vo.copy(t.center).sub(Ga))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ai=new C,Va=new C,mr=new C,Ui=new C,Wa=new C,gr=new C,Xa=new C;class Sa{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ai)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ai.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ai.copy(this.origin).addScaledVector(this.direction,e),ai.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Va.copy(t).add(e).multiplyScalar(.5),mr.copy(e).sub(t).normalize(),Ui.copy(this.origin).sub(Va);const o=t.distanceTo(e)*.5,r=-this.direction.dot(mr),a=Ui.dot(this.direction),c=-Ui.dot(mr),l=Ui.lengthSq(),u=Math.abs(1-r*r);let f,d,h,g;if(u>0)if(f=r*c-a,d=r*a-c,g=o*u,f>=0)if(d>=-g)if(d<=g){const x=1/u;f*=x,d*=x,h=f*(f+r*d+2*a)+d*(r*f+d+2*c)+l}else d=o,f=Math.max(0,-(r*d+a)),h=-f*f+d*(d+2*c)+l;else d=-o,f=Math.max(0,-(r*d+a)),h=-f*f+d*(d+2*c)+l;else d<=-g?(f=Math.max(0,-(-r*o+a)),d=f>0?-o:Math.min(Math.max(-o,-c),o),h=-f*f+d*(d+2*c)+l):d<=g?(f=0,d=Math.min(Math.max(-o,-c),o),h=d*(d+2*c)+l):(f=Math.max(0,-(r*o+a)),d=f>0?o:Math.min(Math.max(-o,-c),o),h=-f*f+d*(d+2*c)+l);else d=r>0?-o:o,f=Math.max(0,-(r*d+a)),h=-f*f+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Va).addScaledVector(mr,d),h}intersectSphere(t,e){ai.subVectors(t.center,this.origin);const n=ai.dot(this.direction),s=ai.dot(ai)-n*n,o=t.radius*t.radius;if(s>o)return null;const r=Math.sqrt(o-s),a=n-r,c=n+r;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,o,r,a,c;const l=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),u>=0?(o=(t.min.y-d.y)*u,r=(t.max.y-d.y)*u):(o=(t.max.y-d.y)*u,r=(t.min.y-d.y)*u),n>r||o>s||((o>n||isNaN(n))&&(n=o),(r<s||isNaN(s))&&(s=r),f>=0?(a=(t.min.z-d.z)*f,c=(t.max.z-d.z)*f):(a=(t.max.z-d.z)*f,c=(t.min.z-d.z)*f),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,ai)!==null}intersectTriangle(t,e,n,s,o){Wa.subVectors(e,t),gr.subVectors(n,t),Xa.crossVectors(Wa,gr);let r=this.direction.dot(Xa),a;if(r>0){if(s)return null;a=1}else if(r<0)a=-1,r=-r;else return null;Ui.subVectors(this.origin,t);const c=a*this.direction.dot(gr.crossVectors(Ui,gr));if(c<0)return null;const l=a*this.direction.dot(Wa.cross(Ui));if(l<0||c+l>r)return null;const u=-a*Ui.dot(Xa);return u<0?null:this.at(u/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class vt{constructor(t,e,n,s,o,r,a,c,l,u,f,d,h,g,x,p){vt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l,u,f,d,h,g,x,p)}set(t,e,n,s,o,r,a,c,l,u,f,d,h,g,x,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=o,m[5]=r,m[9]=a,m[13]=c,m[2]=l,m[6]=u,m[10]=f,m[14]=d,m[3]=h,m[7]=g,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new vt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/As.setFromMatrixColumn(t,0).length(),o=1/As.setFromMatrixColumn(t,1).length(),r=1/As.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,o=t.z,r=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(o),f=Math.sin(o);if(t.order==="XYZ"){const d=r*u,h=r*f,g=a*u,x=a*f;e[0]=c*u,e[4]=-c*f,e[8]=l,e[1]=h+g*l,e[5]=d-x*l,e[9]=-a*c,e[2]=x-d*l,e[6]=g+h*l,e[10]=r*c}else if(t.order==="YXZ"){const d=c*u,h=c*f,g=l*u,x=l*f;e[0]=d+x*a,e[4]=g*a-h,e[8]=r*l,e[1]=r*f,e[5]=r*u,e[9]=-a,e[2]=h*a-g,e[6]=x+d*a,e[10]=r*c}else if(t.order==="ZXY"){const d=c*u,h=c*f,g=l*u,x=l*f;e[0]=d-x*a,e[4]=-r*f,e[8]=g+h*a,e[1]=h+g*a,e[5]=r*u,e[9]=x-d*a,e[2]=-r*l,e[6]=a,e[10]=r*c}else if(t.order==="ZYX"){const d=r*u,h=r*f,g=a*u,x=a*f;e[0]=c*u,e[4]=g*l-h,e[8]=d*l+x,e[1]=c*f,e[5]=x*l+d,e[9]=h*l-g,e[2]=-l,e[6]=a*c,e[10]=r*c}else if(t.order==="YZX"){const d=r*c,h=r*l,g=a*c,x=a*l;e[0]=c*u,e[4]=x-d*f,e[8]=g*f+h,e[1]=f,e[5]=r*u,e[9]=-a*u,e[2]=-l*u,e[6]=h*f+g,e[10]=d-x*f}else if(t.order==="XZY"){const d=r*c,h=r*l,g=a*c,x=a*l;e[0]=c*u,e[4]=-f,e[8]=l*u,e[1]=d*f+x,e[5]=r*u,e[9]=h*f-g,e[2]=g*f-h,e[6]=a*u,e[10]=x*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(z0,t,B0)}lookAt(t,e,n){const s=this.elements;return mn.subVectors(t,e),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),Ni.crossVectors(n,mn),Ni.lengthSq()===0&&(Math.abs(n.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),Ni.crossVectors(n,mn)),Ni.normalize(),xr.crossVectors(mn,Ni),s[0]=Ni.x,s[4]=xr.x,s[8]=mn.x,s[1]=Ni.y,s[5]=xr.y,s[9]=mn.y,s[2]=Ni.z,s[6]=xr.z,s[10]=mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[4],c=n[8],l=n[12],u=n[1],f=n[5],d=n[9],h=n[13],g=n[2],x=n[6],p=n[10],m=n[14],v=n[3],M=n[7],_=n[11],w=n[15],b=s[0],A=s[4],R=s[8],S=s[12],y=s[1],E=s[5],U=s[9],N=s[13],P=s[2],k=s[6],L=s[10],H=s[14],z=s[3],O=s[7],Y=s[11],Z=s[15];return o[0]=r*b+a*y+c*P+l*z,o[4]=r*A+a*E+c*k+l*O,o[8]=r*R+a*U+c*L+l*Y,o[12]=r*S+a*N+c*H+l*Z,o[1]=u*b+f*y+d*P+h*z,o[5]=u*A+f*E+d*k+h*O,o[9]=u*R+f*U+d*L+h*Y,o[13]=u*S+f*N+d*H+h*Z,o[2]=g*b+x*y+p*P+m*z,o[6]=g*A+x*E+p*k+m*O,o[10]=g*R+x*U+p*L+m*Y,o[14]=g*S+x*N+p*H+m*Z,o[3]=v*b+M*y+_*P+w*z,o[7]=v*A+M*E+_*k+w*O,o[11]=v*R+M*U+_*L+w*Y,o[15]=v*S+M*N+_*H+w*Z,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],o=t[12],r=t[1],a=t[5],c=t[9],l=t[13],u=t[2],f=t[6],d=t[10],h=t[14],g=t[3],x=t[7],p=t[11],m=t[15];return g*(+o*c*f-s*l*f-o*a*d+n*l*d+s*a*h-n*c*h)+x*(+e*c*h-e*l*d+o*r*d-s*r*h+s*l*u-o*c*u)+p*(+e*l*f-e*a*h-o*r*f+n*r*h+o*a*u-n*l*u)+m*(-s*a*u-e*c*f+e*a*d+s*r*f-n*r*d+n*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],u=t[8],f=t[9],d=t[10],h=t[11],g=t[12],x=t[13],p=t[14],m=t[15],v=f*p*l-x*d*l+x*c*h-a*p*h-f*c*m+a*d*m,M=g*d*l-u*p*l-g*c*h+r*p*h+u*c*m-r*d*m,_=u*x*l-g*f*l+g*a*h-r*x*h-u*a*m+r*f*m,w=g*f*c-u*x*c-g*a*d+r*x*d+u*a*p-r*f*p,b=e*v+n*M+s*_+o*w;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/b;return t[0]=v*A,t[1]=(x*d*o-f*p*o-x*s*h+n*p*h+f*s*m-n*d*m)*A,t[2]=(a*p*o-x*c*o+x*s*l-n*p*l-a*s*m+n*c*m)*A,t[3]=(f*c*o-a*d*o-f*s*l+n*d*l+a*s*h-n*c*h)*A,t[4]=M*A,t[5]=(u*p*o-g*d*o+g*s*h-e*p*h-u*s*m+e*d*m)*A,t[6]=(g*c*o-r*p*o-g*s*l+e*p*l+r*s*m-e*c*m)*A,t[7]=(r*d*o-u*c*o+u*s*l-e*d*l-r*s*h+e*c*h)*A,t[8]=_*A,t[9]=(g*f*o-u*x*o-g*n*h+e*x*h+u*n*m-e*f*m)*A,t[10]=(r*x*o-g*a*o+g*n*l-e*x*l-r*n*m+e*a*m)*A,t[11]=(u*a*o-r*f*o-u*n*l+e*f*l+r*n*h-e*a*h)*A,t[12]=w*A,t[13]=(u*x*s-g*f*s+g*n*d-e*x*d-u*n*p+e*f*p)*A,t[14]=(g*a*s-r*x*s-g*n*c+e*x*c+r*n*p-e*a*p)*A,t[15]=(r*f*s-u*a*s+u*n*c-e*f*c-r*n*d+e*a*d)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,o=t.z;return e[0]*=n,e[4]*=s,e[8]*=o,e[1]*=n,e[5]*=s,e[9]*=o,e[2]*=n,e[6]*=s,e[10]*=o,e[3]*=n,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),o=1-n,r=t.x,a=t.y,c=t.z,l=o*r,u=o*a;return this.set(l*r+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*r,0,l*c-s*a,u*c+s*r,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,o,r){return this.set(1,n,o,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,o=e._x,r=e._y,a=e._z,c=e._w,l=o+o,u=r+r,f=a+a,d=o*l,h=o*u,g=o*f,x=r*u,p=r*f,m=a*f,v=c*l,M=c*u,_=c*f,w=n.x,b=n.y,A=n.z;return s[0]=(1-(x+m))*w,s[1]=(h+_)*w,s[2]=(g-M)*w,s[3]=0,s[4]=(h-_)*b,s[5]=(1-(d+m))*b,s[6]=(p+v)*b,s[7]=0,s[8]=(g+M)*A,s[9]=(p-v)*A,s[10]=(1-(d+x))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let o=As.set(s[0],s[1],s[2]).length();const r=As.set(s[4],s[5],s[6]).length(),a=As.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],On.copy(this);const l=1/o,u=1/r,f=1/a;return On.elements[0]*=l,On.elements[1]*=l,On.elements[2]*=l,On.elements[4]*=u,On.elements[5]*=u,On.elements[6]*=u,On.elements[8]*=f,On.elements[9]*=f,On.elements[10]*=f,e.setFromRotationMatrix(On),n.x=o,n.y=r,n.z=a,this}makePerspective(t,e,n,s,o,r,a=yi){const c=this.elements,l=2*o/(e-t),u=2*o/(n-s),f=(e+t)/(e-t),d=(n+s)/(n-s);let h,g;if(a===yi)h=-(r+o)/(r-o),g=-2*r*o/(r-o);else if(a===ea)h=-r/(r-o),g=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=h,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,o,r,a=yi){const c=this.elements,l=1/(e-t),u=1/(n-s),f=1/(r-o),d=(e+t)*l,h=(n+s)*u;let g,x;if(a===yi)g=(r+o)*f,x=-2*f;else if(a===ea)g=o*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-h,c[2]=0,c[6]=0,c[10]=x,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const As=new C,On=new vt,z0=new C(0,0,0),B0=new C(1,1,1),Ni=new C,xr=new C,mn=new C,Du=new vt,Iu=new wn;class dn{constructor(t=0,e=0,n=0,s=dn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,o=s[0],r=s[4],a=s[8],c=s[1],l=s[5],u=s[9],f=s[2],d=s[6],h=s[10];switch(e){case"XYZ":this._y=Math.asin(Re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Re(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,h),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,o),this._z=0);break;case"ZXY":this._x=Math.asin(Re(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,h),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-Re(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,h),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Re(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-f,o)):(this._x=0,this._y=Math.atan2(a,h));break;case"XZY":this._z=Math.asin(-Re(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-u,h),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Du.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Du,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Iu.setFromEuler(this),this.setFromQuaternion(Iu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}dn.DEFAULT_ORDER="XYZ";class Dl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let H0=0;const Uu=new C,Cs=new wn,ci=new vt,vr=new C,_o=new C,G0=new C,V0=new wn,Nu=new C(1,0,0),Fu=new C(0,1,0),Ou=new C(0,0,1),ku={type:"added"},W0={type:"removed"},Rs={type:"childadded",child:null},qa={type:"childremoved",child:null};class ze extends xs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:H0++}),this.uuid=vs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ze.DEFAULT_UP.clone();const t=new C,e=new dn,n=new wn,s=new C(1,1,1);function o(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new vt},normalMatrix:{value:new Zt}}),this.matrix=new vt,this.matrixWorld=new vt,this.matrixAutoUpdate=ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Cs.setFromAxisAngle(t,e),this.quaternion.multiply(Cs),this}rotateOnWorldAxis(t,e){return Cs.setFromAxisAngle(t,e),this.quaternion.premultiply(Cs),this}rotateX(t){return this.rotateOnAxis(Nu,t)}rotateY(t){return this.rotateOnAxis(Fu,t)}rotateZ(t){return this.rotateOnAxis(Ou,t)}translateOnAxis(t,e){return Uu.copy(t).applyQuaternion(this.quaternion),this.position.add(Uu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nu,t)}translateY(t){return this.translateOnAxis(Fu,t)}translateZ(t){return this.translateOnAxis(Ou,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ci.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?vr.copy(t):vr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),_o.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ci.lookAt(_o,vr,this.up):ci.lookAt(vr,_o,this.up),this.quaternion.setFromRotationMatrix(ci),s&&(ci.extractRotation(s.matrixWorld),Cs.setFromRotationMatrix(ci),this.quaternion.premultiply(Cs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ku),Rs.child=t,this.dispatchEvent(Rs),Rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(W0),qa.child=t,this.dispatchEvent(qa),qa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ci.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ci.multiply(t.parent.matrixWorld)),t.applyMatrix4(ci),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ku),Rs.child=t,this.dispatchEvent(Rs),Rs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_o,t,G0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_o,V0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const f=c[l];o(t.shapes,f)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(o(t.materials,this.material[c]));s.material=a}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(o(t.animations,c))}}if(e){const a=r(t.geometries),c=r(t.materials),l=r(t.textures),u=r(t.images),f=r(t.shapes),d=r(t.skeletons),h=r(t.animations),g=r(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),h.length>0&&(n.animations=h),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ze.DEFAULT_UP=new C(0,1,0);ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new C,li=new C,Ya=new C,ui=new C,Ps=new C,Ls=new C,zu=new C,Za=new C,$a=new C,ja=new C,Ka=new oe,Ja=new oe,Qa=new oe;class Wn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),kn.subVectors(t,e),s.cross(kn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,n,s,o){kn.subVectors(s,e),li.subVectors(n,e),Ya.subVectors(t,e);const r=kn.dot(kn),a=kn.dot(li),c=kn.dot(Ya),l=li.dot(li),u=li.dot(Ya),f=r*l-a*a;if(f===0)return o.set(0,0,0),null;const d=1/f,h=(l*c-a*u)*d,g=(r*u-a*c)*d;return o.set(1-h-g,g,h)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,ui)===null?!1:ui.x>=0&&ui.y>=0&&ui.x+ui.y<=1}static getInterpolation(t,e,n,s,o,r,a,c){return this.getBarycoord(t,e,n,s,ui)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,ui.x),c.addScaledVector(r,ui.y),c.addScaledVector(a,ui.z),c)}static getInterpolatedAttribute(t,e,n,s,o,r){return Ka.setScalar(0),Ja.setScalar(0),Qa.setScalar(0),Ka.fromBufferAttribute(t,e),Ja.fromBufferAttribute(t,n),Qa.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Ka,o.x),r.addScaledVector(Ja,o.y),r.addScaledVector(Qa,o.z),r}static isFrontFacing(t,e,n,s){return kn.subVectors(n,e),li.subVectors(t,e),kn.cross(li).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return kn.subVectors(this.c,this.b),li.subVectors(this.a,this.b),kn.cross(li).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Wn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,o){return Wn.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}containsPoint(t){return Wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,o=this.c;let r,a;Ps.subVectors(s,n),Ls.subVectors(o,n),Za.subVectors(t,n);const c=Ps.dot(Za),l=Ls.dot(Za);if(c<=0&&l<=0)return e.copy(n);$a.subVectors(t,s);const u=Ps.dot($a),f=Ls.dot($a);if(u>=0&&f<=u)return e.copy(s);const d=c*f-u*l;if(d<=0&&c>=0&&u<=0)return r=c/(c-u),e.copy(n).addScaledVector(Ps,r);ja.subVectors(t,o);const h=Ps.dot(ja),g=Ls.dot(ja);if(g>=0&&h<=g)return e.copy(o);const x=h*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(Ls,a);const p=u*g-h*f;if(p<=0&&f-u>=0&&h-g>=0)return zu.subVectors(o,s),a=(f-u)/(f-u+(h-g)),e.copy(s).addScaledVector(zu,a);const m=1/(p+x+d);return r=x*m,a=d*m,e.copy(n).addScaledVector(Ps,r).addScaledVector(Ls,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Pf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},_r={h:0,s:0,l:0};function tc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Rt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=We){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=re.workingColorSpace){return this.r=t,this.g=e,this.b=n,re.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=re.workingColorSpace){if(t=Ll(t,1),e=Re(e,0,1),n=Re(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,r=2*n-o;this.r=tc(r,o,t+1/3),this.g=tc(r,o,t),this.b=tc(r,o,t-1/3)}return re.toWorkingColorSpace(this,s),this}setStyle(t,e=We){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=s[1],a=s[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=We){const n=Pf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ei(t.r),this.g=Ei(t.g),this.b=Ei(t.b),this}copyLinearToSRGB(t){return this.r=Ys(t.r),this.g=Ys(t.g),this.b=Ys(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=We){return re.fromWorkingColorSpace(Ze.copy(this),t),Math.round(Re(Ze.r*255,0,255))*65536+Math.round(Re(Ze.g*255,0,255))*256+Math.round(Re(Ze.b*255,0,255))}getHexString(t=We){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.fromWorkingColorSpace(Ze.copy(this),e);const n=Ze.r,s=Ze.g,o=Ze.b,r=Math.max(n,s,o),a=Math.min(n,s,o);let c,l;const u=(a+r)/2;if(a===r)c=0,l=0;else{const f=r-a;switch(l=u<=.5?f/(r+a):f/(2-r-a),r){case n:c=(s-o)/f+(s<o?6:0);break;case s:c=(o-n)/f+2;break;case o:c=(n-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=re.workingColorSpace){return re.fromWorkingColorSpace(Ze.copy(this),e),t.r=Ze.r,t.g=Ze.g,t.b=Ze.b,t}getStyle(t=We){re.fromWorkingColorSpace(Ze.copy(this),t);const e=Ze.r,n=Ze.g,s=Ze.b;return t!==We?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Fi),this.setHSL(Fi.h+t,Fi.s+e,Fi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Fi),t.getHSL(_r);const n=Bo(Fi.h,_r.h,e),s=Bo(Fi.s,_r.s,e),o=Bo(Fi.l,_r.l,e);return this.setHSL(n,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*s,this.g=o[1]*e+o[4]*n+o[7]*s,this.b=o[2]*e+o[5]*n+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ze=new Rt;Rt.NAMES=Pf;let X0=0;class Ms extends xs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:X0++}),this.uuid=vs(),this.name="",this.blending=Xs,this.side=fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ac,this.blendDst=Cc,this.blendEquation=cs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Rt(0,0,0),this.blendAlpha=0,this.depthFunc=$s,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ss,this.stencilZFail=Ss,this.stencilZPass=Ss,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Xs&&(n.blending=this.blending),this.side!==fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ac&&(n.blendSrc=this.blendSrc),this.blendDst!==Cc&&(n.blendDst=this.blendDst),this.blendEquation!==cs&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==$s&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==yu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ss&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ss&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ss&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(o){const r=[];for(const a in o){const c=o[a];delete c.metadata,r.push(c)}return r}if(e){const o=s(t.textures),r=s(t.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let o=0;o!==s;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ri extends Ms{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=pf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new C,Mr=new rt;class le{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Su,this.updateRanges=[],this.gpuType=Qn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Mr.fromBufferAttribute(this,e),Mr.applyMatrix3(t),this.setXY(e,Mr.x,Mr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ks(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Je(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ks(e,this.array)),e}setX(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ks(e,this.array)),e}setY(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ks(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ks(e,this.array)),e}setW(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),s=Je(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),s=Je(s,this.array),o=Je(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Su&&(t.usage=this.usage),t}}class ia extends le{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class sa extends le{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class at extends le{constructor(t,e,n){super(new Float32Array(t),e,n)}}let q0=0;const Tn=new vt,ec=new ze,Ds=new C,gn=new _s,Mo=new _s,Fe=new C;class Gt extends xs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:q0++}),this.uuid=vs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Af(t)?sa:ia)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Zt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Tn.makeRotationFromQuaternion(t),this.applyMatrix4(Tn),this}rotateX(t){return Tn.makeRotationX(t),this.applyMatrix4(Tn),this}rotateY(t){return Tn.makeRotationY(t),this.applyMatrix4(Tn),this}rotateZ(t){return Tn.makeRotationZ(t),this.applyMatrix4(Tn),this}translate(t,e,n){return Tn.makeTranslation(t,e,n),this.applyMatrix4(Tn),this}scale(t,e,n){return Tn.makeScale(t,e,n),this.applyMatrix4(Tn),this}lookAt(t){return ec.lookAt(t),ec.updateMatrix(),this.applyMatrix4(ec.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ds).negate(),this.translate(Ds.x,Ds.y,Ds.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,o=t.length;s<o;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new at(n,3))}else{for(let n=0,s=e.count;n<s;n++){const o=t[n];e.setXYZ(n,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _s);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const o=e[n];gn.setFromBufferAttribute(o),this.morphTargetsRelative?(Fe.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint(Fe),Fe.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint(Fe)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new co);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(gn.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];Mo.setFromBufferAttribute(a),this.morphTargetsRelative?(Fe.addVectors(gn.min,Mo.min),gn.expandByPoint(Fe),Fe.addVectors(gn.max,Mo.max),gn.expandByPoint(Fe)):(gn.expandByPoint(Mo.min),gn.expandByPoint(Mo.max))}gn.getCenter(n);let s=0;for(let o=0,r=t.count;o<r;o++)Fe.fromBufferAttribute(t,o),s=Math.max(s,n.distanceToSquared(Fe));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)Fe.fromBufferAttribute(a,l),c&&(Ds.fromBufferAttribute(t,l),Fe.add(Ds)),s=Math.max(s,n.distanceToSquared(Fe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new le(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),a=[],c=[];for(let R=0;R<n.count;R++)a[R]=new C,c[R]=new C;const l=new C,u=new C,f=new C,d=new rt,h=new rt,g=new rt,x=new C,p=new C;function m(R,S,y){l.fromBufferAttribute(n,R),u.fromBufferAttribute(n,S),f.fromBufferAttribute(n,y),d.fromBufferAttribute(o,R),h.fromBufferAttribute(o,S),g.fromBufferAttribute(o,y),u.sub(l),f.sub(l),h.sub(d),g.sub(d);const E=1/(h.x*g.y-g.x*h.y);isFinite(E)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(f,-h.y).multiplyScalar(E),p.copy(f).multiplyScalar(h.x).addScaledVector(u,-g.x).multiplyScalar(E),a[R].add(x),a[S].add(x),a[y].add(x),c[R].add(p),c[S].add(p),c[y].add(p))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let R=0,S=v.length;R<S;++R){const y=v[R],E=y.start,U=y.count;for(let N=E,P=E+U;N<P;N+=3)m(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const M=new C,_=new C,w=new C,b=new C;function A(R){w.fromBufferAttribute(s,R),b.copy(w);const S=a[R];M.copy(S),M.sub(w.multiplyScalar(w.dot(S))).normalize(),_.crossVectors(b,S);const E=_.dot(c[R])<0?-1:1;r.setXYZW(R,M.x,M.y,M.z,E)}for(let R=0,S=v.length;R<S;++R){const y=v[R],E=y.start,U=y.count;for(let N=E,P=E+U;N<P;N+=3)A(t.getX(N+0)),A(t.getX(N+1)),A(t.getX(N+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new le(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,h=n.count;d<h;d++)n.setXYZ(d,0,0,0);const s=new C,o=new C,r=new C,a=new C,c=new C,l=new C,u=new C,f=new C;if(t)for(let d=0,h=t.count;d<h;d+=3){const g=t.getX(d+0),x=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,x),r.fromBufferAttribute(e,p),u.subVectors(r,o),f.subVectors(s,o),u.cross(f),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,p),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,h=e.count;d<h;d+=3)s.fromBufferAttribute(e,d+0),o.fromBufferAttribute(e,d+1),r.fromBufferAttribute(e,d+2),u.subVectors(r,o),f.subVectors(s,o),u.cross(f),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Fe.fromBufferAttribute(t,e),Fe.normalize(),t.setXYZ(e,Fe.x,Fe.y,Fe.z)}toNonIndexed(){function t(a,c){const l=a.array,u=a.itemSize,f=a.normalized,d=new l.constructor(c.length*u);let h=0,g=0;for(let x=0,p=c.length;x<p;x++){a.isInterleavedBufferAttribute?h=c[x]*a.data.stride+a.offset:h=c[x]*u;for(let m=0;m<u;m++)d[g++]=l[h++]}return new le(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Gt,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const o=this.morphAttributes;for(const a in o){const c=[],l=o[a];for(let u=0,f=l.length;u<f;u++){const d=l[u],h=t(d,n);c.push(h)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,c=r.length;a<c;a++){const l=r[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let f=0,d=l.length;f<d;f++){const h=l[f];u.push(h.toJSON(t.data))}u.length>0&&(s[c]=u,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(e))}const o=t.morphAttributes;for(const l in o){const u=[],f=o[l];for(let d=0,h=f.length;d<h;d++)u.push(f[d].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,u=r.length;l<u;l++){const f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bu=new vt,es=new Sa,yr=new co,Hu=new C,Sr=new C,br=new C,wr=new C,nc=new C,Er=new C,Gu=new C,Tr=new C;class Wt extends ze{constructor(t=new Gt,e=new Ri){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(o&&a){Er.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const u=a[c],f=o[c];u!==0&&(nc.fromBufferAttribute(f,t),r?Er.addScaledVector(nc,u):Er.addScaledVector(nc.sub(e),u))}e.add(Er)}return e}raycast(t,e){const n=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),yr.copy(n.boundingSphere),yr.applyMatrix4(o),es.copy(t.ray).recast(t.near),!(yr.containsPoint(es.origin)===!1&&(es.intersectSphere(yr,Hu)===null||es.origin.distanceToSquared(Hu)>(t.far-t.near)**2))&&(Bu.copy(o).invert(),es.copy(t.ray).applyMatrix4(Bu),!(n.boundingBox!==null&&es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,es)))}_computeIntersections(t,e,n){let s;const o=this.geometry,r=this.material,a=o.index,c=o.attributes.position,l=o.attributes.uv,u=o.attributes.uv1,f=o.attributes.normal,d=o.groups,h=o.drawRange;if(a!==null)if(Array.isArray(r))for(let g=0,x=d.length;g<x;g++){const p=d[g],m=r[p.materialIndex],v=Math.max(p.start,h.start),M=Math.min(a.count,Math.min(p.start+p.count,h.start+h.count));for(let _=v,w=M;_<w;_+=3){const b=a.getX(_),A=a.getX(_+1),R=a.getX(_+2);s=Ar(this,m,t,n,l,u,f,b,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,h.start),x=Math.min(a.count,h.start+h.count);for(let p=g,m=x;p<m;p+=3){const v=a.getX(p),M=a.getX(p+1),_=a.getX(p+2);s=Ar(this,r,t,n,l,u,f,v,M,_),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,x=d.length;g<x;g++){const p=d[g],m=r[p.materialIndex],v=Math.max(p.start,h.start),M=Math.min(c.count,Math.min(p.start+p.count,h.start+h.count));for(let _=v,w=M;_<w;_+=3){const b=_,A=_+1,R=_+2;s=Ar(this,m,t,n,l,u,f,b,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,h.start),x=Math.min(c.count,h.start+h.count);for(let p=g,m=x;p<m;p+=3){const v=p,M=p+1,_=p+2;s=Ar(this,r,t,n,l,u,f,v,M,_),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function Y0(i,t,e,n,s,o,r,a){let c;if(t.side===sn?c=n.intersectTriangle(r,o,s,!0,a):c=n.intersectTriangle(s,o,r,t.side===fn,a),c===null)return null;Tr.copy(a),Tr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Tr);return l<e.near||l>e.far?null:{distance:l,point:Tr.clone(),object:i}}function Ar(i,t,e,n,s,o,r,a,c,l){i.getVertexPosition(a,Sr),i.getVertexPosition(c,br),i.getVertexPosition(l,wr);const u=Y0(i,t,e,n,Sr,br,wr,Gu);if(u){const f=new C;Wn.getBarycoord(Gu,Sr,br,wr,f),s&&(u.uv=Wn.getInterpolatedAttribute(s,a,c,l,f,new rt)),o&&(u.uv1=Wn.getInterpolatedAttribute(o,a,c,l,f,new rt)),r&&(u.normal=Wn.getInterpolatedAttribute(r,a,c,l,f,new C),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new C,materialIndex:0};Wn.getNormal(Sr,br,wr,d.normal),u.face=d,u.barycoord=f}return u}class Ke extends Gt{constructor(t=1,e=1,n=1,s=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:o,depthSegments:r};const a=this;s=Math.floor(s),o=Math.floor(o),r=Math.floor(r);const c=[],l=[],u=[],f=[];let d=0,h=0;g("z","y","x",-1,-1,n,e,t,r,o,0),g("z","y","x",1,-1,n,e,-t,r,o,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,o,4),g("x","y","z",-1,-1,t,e,-n,s,o,5),this.setIndex(c),this.setAttribute("position",new at(l,3)),this.setAttribute("normal",new at(u,3)),this.setAttribute("uv",new at(f,2));function g(x,p,m,v,M,_,w,b,A,R,S){const y=_/A,E=w/R,U=_/2,N=w/2,P=b/2,k=A+1,L=R+1;let H=0,z=0;const O=new C;for(let Y=0;Y<L;Y++){const Z=Y*E-N;for(let nt=0;nt<k;nt++){const mt=nt*y-U;O[x]=mt*v,O[p]=Z*M,O[m]=P,l.push(O.x,O.y,O.z),O[x]=0,O[p]=0,O[m]=b>0?1:-1,u.push(O.x,O.y,O.z),f.push(nt/A),f.push(1-Y/R),H+=1}}for(let Y=0;Y<R;Y++)for(let Z=0;Z<A;Z++){const nt=d+Z+k*Y,mt=d+Z+k*(Y+1),V=d+(Z+1)+k*(Y+1),j=d+(Z+1)+k*Y;c.push(nt,mt,j),c.push(mt,V,j),z+=6}a.addGroup(h,z,S),h+=z,d+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ke(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function to(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function tn(i){const t={};for(let e=0;e<i.length;e++){const n=to(i[e]);for(const s in n)t[s]=n[s]}return t}function Z0(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Lf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const lo={clone:to,merge:tn};var $0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,j0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Xe extends Ms{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$0,this.fragmentShader=j0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=to(t.uniforms),this.uniformsGroups=Z0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Df extends ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new vt,this.projectionMatrix=new vt,this.projectionMatrixInverse=new vt,this.coordinateSystem=yi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Oi=new C,Vu=new rt,Wu=new rt;class hn extends Df{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(zo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qo*2*Math.atan(Math.tan(zo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Oi.x,Oi.y).multiplyScalar(-t/Oi.z),Oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Oi.x,Oi.y).multiplyScalar(-t/Oi.z)}getViewSize(t,e){return this.getViewBounds(t,Vu,Wu),e.subVectors(Wu,Vu)}setViewOffset(t,e,n,s,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(zo*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,o=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;o+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Is=-90,Us=1;class K0 extends ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new hn(Is,Us,t,e);s.layers=this.layers,this.add(s);const o=new hn(Is,Us,t,e);o.layers=this.layers,this.add(o);const r=new hn(Is,Us,t,e);r.layers=this.layers,this.add(r);const a=new hn(Is,Us,t,e);a.layers=this.layers,this.add(a);const c=new hn(Is,Us,t,e);c.layers=this.layers,this.add(c);const l=new hn(Is,Us,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,o,r,a,c]=e;for(const l of e)this.remove(l);if(t===yi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ea)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,c,l,u]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),h=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,o),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(f,d,h),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class If extends je{constructor(t,e,n,s,o,r,a,c,l,u){t=t!==void 0?t:[],e=e!==void 0?e:js,super(t,e,n,s,o,r,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class J0 extends Xn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new If(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:_n}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ke(5,5,5),o=new Xe({name:"CubemapFromEquirect",uniforms:to(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:Xi});o.uniforms.tEquirect.value=e;const r=new Wt(s,o),a=e.minFilter;return e.minFilter===Mi&&(e.minFilter=_n),new K0(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(o)}}const ic=new C,Q0=new C,tp=new Zt;class mi{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ic.subVectors(n,e).cross(Q0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ic),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||tp.getNormalMatrix(t),s=this.coplanarPoint(ic).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ns=new co,Cr=new C;class ba{constructor(t=new mi,e=new mi,n=new mi,s=new mi,o=new mi,r=new mi){this.planes=[t,e,n,s,o,r]}set(t,e,n,s,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=yi){const n=this.planes,s=t.elements,o=s[0],r=s[1],a=s[2],c=s[3],l=s[4],u=s[5],f=s[6],d=s[7],h=s[8],g=s[9],x=s[10],p=s[11],m=s[12],v=s[13],M=s[14],_=s[15];if(n[0].setComponents(c-o,d-l,p-h,_-m).normalize(),n[1].setComponents(c+o,d+l,p+h,_+m).normalize(),n[2].setComponents(c+r,d+u,p+g,_+v).normalize(),n[3].setComponents(c-r,d-u,p-g,_-v).normalize(),n[4].setComponents(c-a,d-f,p-x,_-M).normalize(),e===yi)n[5].setComponents(c+a,d+f,p+x,_+M).normalize();else if(e===ea)n[5].setComponents(a,f,x,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ns.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ns.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ns)}intersectsSprite(t){return ns.center.set(0,0,0),ns.radius=.7071067811865476,ns.applyMatrix4(t.matrixWorld),this.intersectsSphere(ns)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Cr.x=s.normal.x>0?t.max.x:t.min.x,Cr.y=s.normal.y>0?t.max.y:t.min.y,Cr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Cr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Uf(){let i=null,t=!1,e=null,n=null;function s(o,r){e(o,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){i=o}}}function ep(i){const t=new WeakMap;function e(a,c){const l=a.array,u=a.usage,f=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),a.onUploadCallback();let h;if(l instanceof Float32Array)h=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?h=i.HALF_FLOAT:h=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)h=i.SHORT;else if(l instanceof Uint32Array)h=i.UNSIGNED_INT;else if(l instanceof Int32Array)h=i.INT;else if(l instanceof Int8Array)h=i.BYTE;else if(l instanceof Uint8Array)h=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)h=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:h,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,c,l){const u=c.array,f=c.updateRanges;if(i.bindBuffer(l,a),f.length===0)i.bufferSubData(l,0,u);else{f.sort((h,g)=>h.start-g.start);let d=0;for(let h=1;h<f.length;h++){const g=f[d],x=f[h];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,f[d]=x)}f.length=d+1;for(let h=0,g=f.length;h<g;h++){const x=f[h];i.bufferSubData(l,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function o(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function r(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:o,update:r}}class Le extends Gt{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const o=t/2,r=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,f=t/a,d=e/c,h=[],g=[],x=[],p=[];for(let m=0;m<u;m++){const v=m*d-r;for(let M=0;M<l;M++){const _=M*f-o;g.push(_,-v,0),x.push(0,0,1),p.push(M/a),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let v=0;v<a;v++){const M=v+l*m,_=v+l*(m+1),w=v+1+l*(m+1),b=v+1+l*m;h.push(M,_,b),h.push(_,w,b)}this.setIndex(h),this.setAttribute("position",new at(g,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Le(t.width,t.height,t.widthSegments,t.heightSegments)}}var np=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ip=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
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
#endif`,sp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,op=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ap=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cp=`#ifdef USE_AOMAP
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
#endif`,lp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,up=`#ifdef USE_BATCHING
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
#endif`,hp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pp=`float G_BlinnPhong_Implicit( ) {
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
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,mp=`#ifdef USE_IRIDESCENCE
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
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
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
#endif`,gp=`#ifdef USE_BUMPMAP
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
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,xp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Sp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,wp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ep=`#define PI 3.141592653589793
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
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Tp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
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
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
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
			mip = - 2.0 * log2( 1.16 * roughness );		}
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
#endif`,Ap=`vec3 transformedNormal = objectNormal;
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
#endif`,Cp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Pp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ip=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Up=`#ifdef USE_ENVMAP
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
#endif`,Np=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Fp=`#ifdef USE_ENVMAP
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
#endif`,Op=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,kp=`#ifdef USE_ENVMAP
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
#endif`,zp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vp=`#ifdef USE_GRADIENTMAP
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
}`,Wp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Xp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,qp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yp=`uniform bool receiveShadow;
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
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
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
#endif`,Zp=`#ifdef USE_ENVMAP
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
#endif`,$p=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Kp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Jp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Qp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
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
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
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
#endif`,tm=`struct PhysicalMaterial {
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
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
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
		float alpha = pow2( roughness );
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
	float alpha = pow2( roughness );
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
	T2 = - cross( N, T1 );
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
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
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
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
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
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
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
}`,em=`
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
#endif`,nm=`#if defined( RE_IndirectDiffuse )
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
#endif`,im=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,om=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,am=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,lm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,um=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,hm=`#if defined( USE_POINTS_UV )
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
#endif`,fm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xm=`#ifdef USE_MORPHTARGETS
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
#endif`,vm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_m=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Mm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
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
#endif`,ym=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,wm=`#ifdef USE_NORMALMAP
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
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Em=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Tm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Am=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Cm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Rm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
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
}`,Lm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Dm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Im=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Um=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Nm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Fm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Om=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
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
		#else
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
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
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
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,km=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Bm=`float getShadowMask() {
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
}`,Hm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gm=`#ifdef USE_SKINNING
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
#endif`,Vm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wm=`#ifdef USE_SKINNING
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
#endif`,Xm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ym=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Zm=`#ifndef saturate
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
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
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
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,$m=`#ifdef USE_TRANSMISSION
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
#endif`,jm=`#ifdef USE_TRANSMISSION
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
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
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
#endif`,Km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const eg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ng=`uniform sampler2D t2D;
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
}`,ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ag=`#include <common>
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
}`,cg=`#if DEPTH_PACKING == 3200
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
}`,lg=`#define DISTANCE
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
}`,ug=`#define DISTANCE
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
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,hg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`uniform float scale;
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
}`,pg=`uniform vec3 diffuse;
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
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mg=`#include <common>
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
}`,gg=`uniform vec3 diffuse;
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
}`,xg=`#define LAMBERT
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
}`,vg=`#define LAMBERT
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
}`,_g=`#define MATCAP
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
}`,Mg=`#define MATCAP
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
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yg=`#define NORMAL
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
}`,Sg=`#define NORMAL
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
}`,bg=`#define PHONG
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
}`,wg=`#define PHONG
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
}`,Eg=`#define STANDARD
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
}`,Tg=`#define STANDARD
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
}`,Ag=`#define TOON
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
}`,Cg=`#define TOON
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
}`,Rg=`uniform float size;
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
}`,Pg=`uniform vec3 diffuse;
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
}`,Lg=`#include <common>
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
}`,Dg=`uniform vec3 color;
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
}`,Ig=`uniform float rotation;
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
}`,Ug=`uniform vec3 diffuse;
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
}`,qt={alphahash_fragment:np,alphahash_pars_fragment:ip,alphamap_fragment:sp,alphamap_pars_fragment:op,alphatest_fragment:rp,alphatest_pars_fragment:ap,aomap_fragment:cp,aomap_pars_fragment:lp,batching_pars_vertex:up,batching_vertex:hp,begin_vertex:fp,beginnormal_vertex:dp,bsdfs:pp,iridescence_fragment:mp,bumpmap_pars_fragment:gp,clipping_planes_fragment:xp,clipping_planes_pars_fragment:vp,clipping_planes_pars_vertex:_p,clipping_planes_vertex:Mp,color_fragment:yp,color_pars_fragment:Sp,color_pars_vertex:bp,color_vertex:wp,common:Ep,cube_uv_reflection_fragment:Tp,defaultnormal_vertex:Ap,displacementmap_pars_vertex:Cp,displacementmap_vertex:Rp,emissivemap_fragment:Pp,emissivemap_pars_fragment:Lp,colorspace_fragment:Dp,colorspace_pars_fragment:Ip,envmap_fragment:Up,envmap_common_pars_fragment:Np,envmap_pars_fragment:Fp,envmap_pars_vertex:Op,envmap_physical_pars_fragment:Zp,envmap_vertex:kp,fog_vertex:zp,fog_pars_vertex:Bp,fog_fragment:Hp,fog_pars_fragment:Gp,gradientmap_pars_fragment:Vp,lightmap_pars_fragment:Wp,lights_lambert_fragment:Xp,lights_lambert_pars_fragment:qp,lights_pars_begin:Yp,lights_toon_fragment:$p,lights_toon_pars_fragment:jp,lights_phong_fragment:Kp,lights_phong_pars_fragment:Jp,lights_physical_fragment:Qp,lights_physical_pars_fragment:tm,lights_fragment_begin:em,lights_fragment_maps:nm,lights_fragment_end:im,logdepthbuf_fragment:sm,logdepthbuf_pars_fragment:om,logdepthbuf_pars_vertex:rm,logdepthbuf_vertex:am,map_fragment:cm,map_pars_fragment:lm,map_particle_fragment:um,map_particle_pars_fragment:hm,metalnessmap_fragment:fm,metalnessmap_pars_fragment:dm,morphinstance_vertex:pm,morphcolor_vertex:mm,morphnormal_vertex:gm,morphtarget_pars_vertex:xm,morphtarget_vertex:vm,normal_fragment_begin:_m,normal_fragment_maps:Mm,normal_pars_fragment:ym,normal_pars_vertex:Sm,normal_vertex:bm,normalmap_pars_fragment:wm,clearcoat_normal_fragment_begin:Em,clearcoat_normal_fragment_maps:Tm,clearcoat_pars_fragment:Am,iridescence_pars_fragment:Cm,opaque_fragment:Rm,packing:Pm,premultiplied_alpha_fragment:Lm,project_vertex:Dm,dithering_fragment:Im,dithering_pars_fragment:Um,roughnessmap_fragment:Nm,roughnessmap_pars_fragment:Fm,shadowmap_pars_fragment:Om,shadowmap_pars_vertex:km,shadowmap_vertex:zm,shadowmask_pars_fragment:Bm,skinbase_vertex:Hm,skinning_pars_vertex:Gm,skinning_vertex:Vm,skinnormal_vertex:Wm,specularmap_fragment:Xm,specularmap_pars_fragment:qm,tonemapping_fragment:Ym,tonemapping_pars_fragment:Zm,transmission_fragment:$m,transmission_pars_fragment:jm,uv_pars_fragment:Km,uv_pars_vertex:Jm,uv_vertex:Qm,worldpos_vertex:tg,background_vert:eg,background_frag:ng,backgroundCube_vert:ig,backgroundCube_frag:sg,cube_vert:og,cube_frag:rg,depth_vert:ag,depth_frag:cg,distanceRGBA_vert:lg,distanceRGBA_frag:ug,equirect_vert:hg,equirect_frag:fg,linedashed_vert:dg,linedashed_frag:pg,meshbasic_vert:mg,meshbasic_frag:gg,meshlambert_vert:xg,meshlambert_frag:vg,meshmatcap_vert:_g,meshmatcap_frag:Mg,meshnormal_vert:yg,meshnormal_frag:Sg,meshphong_vert:bg,meshphong_frag:wg,meshphysical_vert:Eg,meshphysical_frag:Tg,meshtoon_vert:Ag,meshtoon_frag:Cg,points_vert:Rg,points_frag:Pg,shadow_vert:Lg,shadow_frag:Dg,sprite_vert:Ig,sprite_frag:Ug},bt={common:{diffuse:{value:new Rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},envMapRotation:{value:new Zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new Rt(16777215)},opacity:{value:1},center:{value:new rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},Kn={basic:{uniforms:tn([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:tn([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Rt(0)}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:tn([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Rt(0)},specular:{value:new Rt(1118481)},shininess:{value:30}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:tn([bt.common,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.roughnessmap,bt.metalnessmap,bt.fog,bt.lights,{emissive:{value:new Rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:tn([bt.common,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.gradientmap,bt.fog,bt.lights,{emissive:{value:new Rt(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:tn([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:tn([bt.points,bt.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:tn([bt.common,bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:tn([bt.common,bt.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:tn([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:tn([bt.sprite,bt.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Zt}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distanceRGBA:{uniforms:tn([bt.common,bt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distanceRGBA_vert,fragmentShader:qt.distanceRGBA_frag},shadow:{uniforms:tn([bt.lights,bt.fog,{color:{value:new Rt(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};Kn.physical={uniforms:tn([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new Rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new Rt(0)},specularColor:{value:new Rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};const Rr={r:0,b:0,g:0},is=new dn,Ng=new vt;function Fg(i,t,e,n,s,o,r){const a=new Rt(0);let c=o===!0?0:1,l,u,f=null,d=0,h=null;function g(v){let M=v.isScene===!0?v.background:null;return M&&M.isTexture&&(M=(v.backgroundBlurriness>0?e:t).get(M)),M}function x(v){let M=!1;const _=g(v);_===null?m(a,c):_&&_.isColor&&(m(_,1),M=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(v,M){const _=g(M);_&&(_.isCubeTexture||_.mapping===Ma)?(u===void 0&&(u=new Wt(new Ke(1,1,1),new Xe({name:"BackgroundCubeMaterial",uniforms:to(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,b,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),is.copy(M.backgroundRotation),is.x*=-1,is.y*=-1,is.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),u.material.uniforms.envMap.value=_,u.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Ng.makeRotationFromEuler(is)),u.material.toneMapped=re.getTransfer(_.colorSpace)!==de,(f!==_||d!==_.version||h!==i.toneMapping)&&(u.material.needsUpdate=!0,f=_,d=_.version,h=i.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Wt(new Le(2,2),new Xe({name:"BackgroundMaterial",uniforms:to(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:fn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=re.getTransfer(_.colorSpace)!==de,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(f!==_||d!==_.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,f=_,d=_.version,h=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,M){v.getRGB(Rr,Lf(i)),n.buffers.color.setClear(Rr.r,Rr.g,Rr.b,M,r)}return{getClearColor:function(){return a},setClearColor:function(v,M=1){a.set(v),c=M,m(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,m(a,c)},render:x,addToRenderList:p}}function Og(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let o=s,r=!1;function a(y,E,U,N,P){let k=!1;const L=f(N,U,E);o!==L&&(o=L,l(o.object)),k=h(y,N,U,P),k&&g(y,N,U,P),P!==null&&t.update(P,i.ELEMENT_ARRAY_BUFFER),(k||r)&&(r=!1,_(y,E,U,N),P!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(P).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function u(y){return i.deleteVertexArray(y)}function f(y,E,U){const N=U.wireframe===!0;let P=n[y.id];P===void 0&&(P={},n[y.id]=P);let k=P[E.id];k===void 0&&(k={},P[E.id]=k);let L=k[N];return L===void 0&&(L=d(c()),k[N]=L),L}function d(y){const E=[],U=[],N=[];for(let P=0;P<e;P++)E[P]=0,U[P]=0,N[P]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:U,attributeDivisors:N,object:y,attributes:{},index:null}}function h(y,E,U,N){const P=o.attributes,k=E.attributes;let L=0;const H=U.getAttributes();for(const z in H)if(H[z].location>=0){const Y=P[z];let Z=k[z];if(Z===void 0&&(z==="instanceMatrix"&&y.instanceMatrix&&(Z=y.instanceMatrix),z==="instanceColor"&&y.instanceColor&&(Z=y.instanceColor)),Y===void 0||Y.attribute!==Z||Z&&Y.data!==Z.data)return!0;L++}return o.attributesNum!==L||o.index!==N}function g(y,E,U,N){const P={},k=E.attributes;let L=0;const H=U.getAttributes();for(const z in H)if(H[z].location>=0){let Y=k[z];Y===void 0&&(z==="instanceMatrix"&&y.instanceMatrix&&(Y=y.instanceMatrix),z==="instanceColor"&&y.instanceColor&&(Y=y.instanceColor));const Z={};Z.attribute=Y,Y&&Y.data&&(Z.data=Y.data),P[z]=Z,L++}o.attributes=P,o.attributesNum=L,o.index=N}function x(){const y=o.newAttributes;for(let E=0,U=y.length;E<U;E++)y[E]=0}function p(y){m(y,0)}function m(y,E){const U=o.newAttributes,N=o.enabledAttributes,P=o.attributeDivisors;U[y]=1,N[y]===0&&(i.enableVertexAttribArray(y),N[y]=1),P[y]!==E&&(i.vertexAttribDivisor(y,E),P[y]=E)}function v(){const y=o.newAttributes,E=o.enabledAttributes;for(let U=0,N=E.length;U<N;U++)E[U]!==y[U]&&(i.disableVertexAttribArray(U),E[U]=0)}function M(y,E,U,N,P,k,L){L===!0?i.vertexAttribIPointer(y,E,U,P,k):i.vertexAttribPointer(y,E,U,N,P,k)}function _(y,E,U,N){x();const P=N.attributes,k=U.getAttributes(),L=E.defaultAttributeValues;for(const H in k){const z=k[H];if(z.location>=0){let O=P[H];if(O===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(O=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(O=y.instanceColor)),O!==void 0){const Y=O.normalized,Z=O.itemSize,nt=t.get(O);if(nt===void 0)continue;const mt=nt.buffer,V=nt.type,j=nt.bytesPerElement,ct=V===i.INT||V===i.UNSIGNED_INT||O.gpuType===wl;if(O.isInterleavedBufferAttribute){const ot=O.data,Tt=ot.stride,gt=O.offset;if(ot.isInstancedInterleavedBuffer){for(let J=0;J<z.locationSize;J++)m(z.location+J,ot.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let J=0;J<z.locationSize;J++)p(z.location+J);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let J=0;J<z.locationSize;J++)M(z.location+J,Z/z.locationSize,V,Y,Tt*j,(gt+Z/z.locationSize*J)*j,ct)}else{if(O.isInstancedBufferAttribute){for(let ot=0;ot<z.locationSize;ot++)m(z.location+ot,O.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let ot=0;ot<z.locationSize;ot++)p(z.location+ot);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let ot=0;ot<z.locationSize;ot++)M(z.location+ot,Z/z.locationSize,V,Y,Z*j,Z/z.locationSize*ot*j,ct)}}else if(L!==void 0){const Y=L[H];if(Y!==void 0)switch(Y.length){case 2:i.vertexAttrib2fv(z.location,Y);break;case 3:i.vertexAttrib3fv(z.location,Y);break;case 4:i.vertexAttrib4fv(z.location,Y);break;default:i.vertexAttrib1fv(z.location,Y)}}}}v()}function w(){R();for(const y in n){const E=n[y];for(const U in E){const N=E[U];for(const P in N)u(N[P].object),delete N[P];delete E[U]}delete n[y]}}function b(y){if(n[y.id]===void 0)return;const E=n[y.id];for(const U in E){const N=E[U];for(const P in N)u(N[P].object),delete N[P];delete E[U]}delete n[y.id]}function A(y){for(const E in n){const U=n[E];if(U[y.id]===void 0)continue;const N=U[y.id];for(const P in N)u(N[P].object),delete N[P];delete U[y.id]}}function R(){S(),r=!0,o!==s&&(o=s,l(o.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:S,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:p,disableUnusedAttributes:v}}function kg(i,t,e){let n;function s(l){n=l}function o(l,u){i.drawArrays(n,l,u),e.update(u,n,1)}function r(l,u,f){f!==0&&(i.drawArraysInstanced(n,l,u,f),e.update(u,n,f))}function a(l,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,f);let h=0;for(let g=0;g<f;g++)h+=u[g];e.update(h,n,1)}function c(l,u,f,d){if(f===0)return;const h=t.get("WEBGL_multi_draw");if(h===null)for(let g=0;g<l.length;g++)r(l[g],u[g],d[g]);else{h.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,f);let g=0;for(let x=0;x<f;x++)g+=u[x]*d[x];e.update(g,n,1)}}this.setMode=s,this.render=o,this.renderInstances=r,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function zg(i,t,e,n){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==Ln&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const R=A===gs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==ei&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Qn&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:h,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:w,maxSamples:b}}function Bg(i){const t=this;let e=null,n=0,s=!1,o=!1;const r=new mi,a=new Zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const h=f.length!==0||d||n!==0||s;return s=d,n=f.length,h},this.beginShadows=function(){o=!0,u(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(f,d){e=u(f,d,0)},this.setState=function(f,d,h){const g=f.clippingPlanes,x=f.clipIntersection,p=f.clipShadows,m=i.get(f);if(!s||g===null||g.length===0||o&&!p)o?u(null):l();else{const v=o?0:n,M=v*4;let _=m.clippingState||null;c.value=_,_=u(g,d,M,h);for(let w=0;w!==M;++w)_[w]=e[w];m.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,d,h,g){const x=f!==null?f.length:0;let p=null;if(x!==0){if(p=c.value,g!==!0||p===null){const m=h+x*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(p===null||p.length<m)&&(p=new Float32Array(m));for(let M=0,_=h;M!==x;++M,_+=4)r.copy(f[M]).applyMatrix4(v,a),r.normal.toArray(p,_),p[_+3]=r.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}function Hg(i){let t=new WeakMap;function e(r,a){return a===Fc?r.mapping=js:a===Oc&&(r.mapping=Ks),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===Fc||a===Oc)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new J0(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const a=r.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class Il extends Df{constructor(t=-1,e=1,n=1,s=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=n-t,r=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,r=o+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Bs=4,Xu=[.125,.215,.35,.446,.526,.582],ls=20,sc=new Il,qu=new Rt;let oc=null,rc=0,ac=0,cc=!1;const as=(1+Math.sqrt(5))/2,Ns=1/as,Yu=[new C(-as,Ns,0),new C(as,Ns,0),new C(-Ns,0,as),new C(Ns,0,as),new C(0,as,-Ns),new C(0,as,Ns),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class Zu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){oc=this._renderer.getRenderTarget(),rc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ku(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ju(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(oc,rc,ac),this._renderer.xr.enabled=cc,t.scissorTest=!1,Pr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===js||t.mapping===Ks?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),oc=this._renderer.getRenderTarget(),rc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:_n,minFilter:_n,generateMipmaps:!1,type:gs,format:Ln,colorSpace:ao,depthBuffer:!1},s=$u(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$u(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gg(o)),this._blurMaterial=Vg(o,t,e)}return s}_compileMaterial(t){const e=new Wt(this._lodPlanes[0],t);this._renderer.compile(e,sc)}_sceneToCubeUV(t,e,n,s){const a=new hn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(qu),u.toneMapping=wi,u.autoClear=!1;const h=new Ri({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),g=new Wt(new Ke,h);let x=!1;const p=t.background;p?p.isColor&&(h.color.copy(p),t.background=null,x=!0):(h.color.copy(qu),x=!0);for(let m=0;m<6;m++){const v=m%3;v===0?(a.up.set(0,c[m],0),a.lookAt(l[m],0,0)):v===1?(a.up.set(0,0,c[m]),a.lookAt(0,l[m],0)):(a.up.set(0,c[m],0),a.lookAt(0,0,l[m]));const M=this._cubeSize;Pr(s,v*M,m>2?M:0,M,M),u.setRenderTarget(s),x&&u.render(g,a),u.render(t,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=f,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===js||t.mapping===Ks;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ku()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ju());const o=s?this._cubemapMaterial:this._equirectMaterial,r=new Wt(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const c=this._cubeSize;Pr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,sc)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const r=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),a=Yu[(s-o-1)%Yu.length];this._blur(t,o-1,o,r,a)}e.autoClear=n}_blur(t,e,n,s,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",o),this._halfBlur(r,t,n,n,s,"longitudinal",o)}_halfBlur(t,e,n,s,o,r,a){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Wt(this._lodPlanes[s],l),d=l.uniforms,h=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*h):2*Math.PI/(2*ls-1),x=o/g,p=isFinite(o)?1+Math.floor(u*x):ls;p>ls&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ls}`);const m=[];let v=0;for(let A=0;A<ls;++A){const R=A/x,S=Math.exp(-R*R/2);m.push(S),A===0?v+=S:A<p&&(v+=2*S)}for(let A=0;A<m.length;A++)m[A]=m[A]/v;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=r==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;const _=this._sizeLods[s],w=3*_*(s>M-Bs?s-M+Bs:0),b=4*(this._cubeSize-_);Pr(e,w,b,3*_,2*_),c.setRenderTarget(e),c.render(f,sc)}}function Gg(i){const t=[],e=[],n=[];let s=i;const o=i-Bs+1+Xu.length;for(let r=0;r<o;r++){const a=Math.pow(2,s);e.push(a);let c=1/a;r>i-Bs?c=Xu[r-i+Bs-1]:r===0&&(c=0),n.push(c);const l=1/(a-2),u=-l,f=1+l,d=[u,u,f,u,f,f,u,u,f,f,u,f],h=6,g=6,x=3,p=2,m=1,v=new Float32Array(x*g*h),M=new Float32Array(p*g*h),_=new Float32Array(m*g*h);for(let b=0;b<h;b++){const A=b%3*2/3-1,R=b>2?0:-1,S=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];v.set(S,x*g*b),M.set(d,p*g*b);const y=[b,b,b,b,b,b];_.set(y,m*g*b)}const w=new Gt;w.setAttribute("position",new le(v,x)),w.setAttribute("uv",new le(M,p)),w.setAttribute("faceIndex",new le(_,m)),t.push(w),s>Bs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function $u(i,t,e){const n=new Xn(i,t,e);return n.texture.mapping=Ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Pr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Vg(i,t,e){const n=new Float32Array(ls),s=new C(0,1,0);return new Xe({name:"SphericalGaussianBlur",defines:{n:ls,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ul(),fragmentShader:`

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
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function ju(){return new Xe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ul(),fragmentShader:`

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
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Ku(){return new Xe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ul(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Ul(){return`

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
	`}function Wg(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Fc||c===Oc,u=c===js||c===Ks;if(l||u){let f=t.get(a);const d=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Zu(i)),f=l?e.fromEquirectangular(a,f):e.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),f.texture;if(f!==void 0)return f.texture;{const h=a.image;return l&&h&&h.height>0||u&&h&&s(h)?(e===null&&(e=new Zu(i)),f=l?e.fromEquirectangular(a):e.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),a.addEventListener("dispose",o),f.texture):null}}}return a}function s(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function o(a){const c=a.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function Xg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Uo("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function qg(i,t,e,n){const s={},o=new WeakMap;function r(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const x=d.morphAttributes[g];for(let p=0,m=x.length;p<m;p++)t.remove(x[p])}d.removeEventListener("dispose",r),delete s[d.id];const h=o.get(d);h&&(t.remove(h),o.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(f,d){return s[d.id]===!0||(d.addEventListener("dispose",r),s[d.id]=!0,e.memory.geometries++),d}function c(f){const d=f.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const h=f.morphAttributes;for(const g in h){const x=h[g];for(let p=0,m=x.length;p<m;p++)t.update(x[p],i.ARRAY_BUFFER)}}function l(f){const d=[],h=f.index,g=f.attributes.position;let x=0;if(h!==null){const v=h.array;x=h.version;for(let M=0,_=v.length;M<_;M+=3){const w=v[M+0],b=v[M+1],A=v[M+2];d.push(w,b,b,A,A,w)}}else if(g!==void 0){const v=g.array;x=g.version;for(let M=0,_=v.length/3-1;M<_;M+=3){const w=M+0,b=M+1,A=M+2;d.push(w,b,b,A,A,w)}}else return;const p=new(Af(d)?sa:ia)(d,1);p.version=x;const m=o.get(f);m&&t.remove(m),o.set(f,p)}function u(f){const d=o.get(f);if(d){const h=f.index;h!==null&&d.version<h.version&&l(f)}else l(f);return o.get(f)}return{get:a,update:c,getWireframeAttribute:u}}function Yg(i,t,e){let n;function s(d){n=d}let o,r;function a(d){o=d.type,r=d.bytesPerElement}function c(d,h){i.drawElements(n,h,o,d*r),e.update(h,n,1)}function l(d,h,g){g!==0&&(i.drawElementsInstanced(n,h,o,d*r,g),e.update(h,n,g))}function u(d,h,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,o,d,0,g);let p=0;for(let m=0;m<g;m++)p+=h[m];e.update(p,n,1)}function f(d,h,g,x){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<d.length;m++)l(d[m]/r,h[m],x[m]);else{p.multiDrawElementsInstancedWEBGL(n,h,0,o,d,0,x,0,g);let m=0;for(let v=0;v<g;v++)m+=h[v]*x[v];e.update(m,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function Zg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=a*(o/3);break;case i.LINES:e.lines+=a*(o/2);break;case i.LINE_STRIP:e.lines+=a*(o-1);break;case i.LINE_LOOP:e.lines+=a*o;break;case i.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function $g(i,t,e){const n=new WeakMap,s=new oe;function o(r,a,c){const l=r.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==f){let y=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",y)};var h=y;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],v=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let _=0;g===!0&&(_=1),x===!0&&(_=2),p===!0&&(_=3);let w=a.attributes.position.count*_,b=1;w>t.maxTextureSize&&(b=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const A=new Float32Array(w*b*4*f),R=new Rf(A,w,b,f);R.type=Qn,R.needsUpdate=!0;const S=_*4;for(let E=0;E<f;E++){const U=m[E],N=v[E],P=M[E],k=w*b*4*E;for(let L=0;L<U.count;L++){const H=L*S;g===!0&&(s.fromBufferAttribute(U,L),A[k+H+0]=s.x,A[k+H+1]=s.y,A[k+H+2]=s.z,A[k+H+3]=0),x===!0&&(s.fromBufferAttribute(N,L),A[k+H+4]=s.x,A[k+H+5]=s.y,A[k+H+6]=s.z,A[k+H+7]=0),p===!0&&(s.fromBufferAttribute(P,L),A[k+H+8]=s.x,A[k+H+9]=s.y,A[k+H+10]=s.z,A[k+H+11]=P.itemSize===4?s.w:1)}}d={count:f,texture:R,size:new rt(w,b)},n.set(a,d),a.addEventListener("dispose",y)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const x=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:o}}function jg(i,t,e,n){let s=new WeakMap;function o(c){const l=n.render.frame,u=c.geometry,f=t.get(c,u);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return f}function r(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:r}}class Nf extends je{constructor(t,e,n,s,o,r,a,c,l,u=qs){if(u!==qs&&u!==Qs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===qs&&(n=ps),n===void 0&&u===Qs&&(n=Js),super(null,s,o,r,a,c,u,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:yn,this.minFilter=c!==void 0?c:yn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Ff=new je,Ju=new Nf(1,1),Of=new Rf,kf=new O0,zf=new If,Qu=[],th=[],eh=new Float32Array(16),nh=new Float32Array(9),ih=new Float32Array(4);function uo(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let o=Qu[s];if(o===void 0&&(o=new Float32Array(s),Qu[s]=o),t!==0){n.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,i[r].toArray(o,a)}return o}function Ie(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ue(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function wa(i,t){let e=th[t];e===void 0&&(e=new Int32Array(t),th[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Kg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Jg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2fv(this.addr,t),Ue(e,t)}}function Qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;i.uniform3fv(this.addr,t),Ue(e,t)}}function tx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4fv(this.addr,t),Ue(e,t)}}function ex(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,n))return;ih.set(n),i.uniformMatrix2fv(this.addr,!1,ih),Ue(e,n)}}function nx(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,n))return;nh.set(n),i.uniformMatrix3fv(this.addr,!1,nh),Ue(e,n)}}function ix(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,n))return;eh.set(n),i.uniformMatrix4fv(this.addr,!1,eh),Ue(e,n)}}function sx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function ox(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2iv(this.addr,t),Ue(e,t)}}function rx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;i.uniform3iv(this.addr,t),Ue(e,t)}}function ax(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4iv(this.addr,t),Ue(e,t)}}function cx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function lx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2uiv(this.addr,t),Ue(e,t)}}function ux(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;i.uniform3uiv(this.addr,t),Ue(e,t)}}function hx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4uiv(this.addr,t),Ue(e,t)}}function fx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let o;this.type===i.SAMPLER_2D_SHADOW?(Ju.compareFunction=Tf,o=Ju):o=Ff,e.setTexture2D(t||o,s)}function dx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||kf,s)}function px(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||zf,s)}function mx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Of,s)}function gx(i){switch(i){case 5126:return Kg;case 35664:return Jg;case 35665:return Qg;case 35666:return tx;case 35674:return ex;case 35675:return nx;case 35676:return ix;case 5124:case 35670:return sx;case 35667:case 35671:return ox;case 35668:case 35672:return rx;case 35669:case 35673:return ax;case 5125:return cx;case 36294:return lx;case 36295:return ux;case 36296:return hx;case 35678:case 36198:case 36298:case 36306:case 35682:return fx;case 35679:case 36299:case 36307:return dx;case 35680:case 36300:case 36308:case 36293:return px;case 36289:case 36303:case 36311:case 36292:return mx}}function xx(i,t){i.uniform1fv(this.addr,t)}function vx(i,t){const e=uo(t,this.size,2);i.uniform2fv(this.addr,e)}function _x(i,t){const e=uo(t,this.size,3);i.uniform3fv(this.addr,e)}function Mx(i,t){const e=uo(t,this.size,4);i.uniform4fv(this.addr,e)}function yx(i,t){const e=uo(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Sx(i,t){const e=uo(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function bx(i,t){const e=uo(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function wx(i,t){i.uniform1iv(this.addr,t)}function Ex(i,t){i.uniform2iv(this.addr,t)}function Tx(i,t){i.uniform3iv(this.addr,t)}function Ax(i,t){i.uniform4iv(this.addr,t)}function Cx(i,t){i.uniform1uiv(this.addr,t)}function Rx(i,t){i.uniform2uiv(this.addr,t)}function Px(i,t){i.uniform3uiv(this.addr,t)}function Lx(i,t){i.uniform4uiv(this.addr,t)}function Dx(i,t,e){const n=this.cache,s=t.length,o=wa(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Ue(n,o));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||Ff,o[r])}function Ix(i,t,e){const n=this.cache,s=t.length,o=wa(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Ue(n,o));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||kf,o[r])}function Ux(i,t,e){const n=this.cache,s=t.length,o=wa(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Ue(n,o));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||zf,o[r])}function Nx(i,t,e){const n=this.cache,s=t.length,o=wa(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Ue(n,o));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||Of,o[r])}function Fx(i){switch(i){case 5126:return xx;case 35664:return vx;case 35665:return _x;case 35666:return Mx;case 35674:return yx;case 35675:return Sx;case 35676:return bx;case 5124:case 35670:return wx;case 35667:case 35671:return Ex;case 35668:case 35672:return Tx;case 35669:case 35673:return Ax;case 5125:return Cx;case 36294:return Rx;case 36295:return Px;case 36296:return Lx;case 35678:case 36198:case 36298:case 36306:case 35682:return Dx;case 35679:case 36299:case 36307:return Ix;case 35680:case 36300:case 36308:case 36293:return Ux;case 36289:case 36303:case 36311:case 36292:return Nx}}class Ox{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=gx(e.type)}}class kx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Fx(e.type)}}class zx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let o=0,r=s.length;o!==r;++o){const a=s[o];a.setValue(t,e[a.id],n)}}}const lc=/(\w+)(\])?(\[|\.)?/g;function sh(i,t){i.seq.push(t),i.map[t.id]=t}function Bx(i,t,e){const n=i.name,s=n.length;for(lc.lastIndex=0;;){const o=lc.exec(n),r=lc.lastIndex;let a=o[1];const c=o[2]==="]",l=o[3];if(c&&(a=a|0),l===void 0||l==="["&&r+2===s){sh(e,l===void 0?new Ox(a,i,t):new kx(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new zx(a),sh(e,f)),e=f}}}class Qr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const o=t.getActiveUniform(e,s),r=t.getUniformLocation(e,o.name);Bx(o,r,this)}}setValue(t,e,n,s){const o=this.map[e];o!==void 0&&o.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let o=0,r=e.length;o!==r;++o){const a=e[o],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,o=t.length;s!==o;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function oh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Hx=37297;let Gx=0;function Vx(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=s;r<o;r++){const a=r+1;n.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return n.join(`
`)}const rh=new Zt;function Wx(i){re._getMatrix(rh,re.workingColorSpace,i);const t=`mat3( ${rh.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(i)){case ya:return[t,"LinearTransferOETF"];case de:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function ah(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const r=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+Vx(i.getShaderSource(t),r)}else return s}function Xx(i,t){const e=Wx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function qx(i,t){let e;switch(t){case $d:e="Linear";break;case jd:e="Reinhard";break;case Kd:e="Cineon";break;case Jd:e="ACESFilmic";break;case t0:e="AgX";break;case e0:e="Neutral";break;case Qd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Lr=new C;function Yx(){re.getLuminanceCoefficients(Lr);const i=Lr.x.toFixed(4),t=Lr.y.toFixed(4),e=Lr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Zx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(No).join(`
`)}function $x(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function jx(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const o=i.getActiveAttrib(t,s),r=o.name;let a=1;o.type===i.FLOAT_MAT2&&(a=2),o.type===i.FLOAT_MAT3&&(a=3),o.type===i.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:i.getAttribLocation(t,r),locationSize:a}}return e}function No(i){return i!==""}function ch(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function lh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Kx=/^[ \t]*#include +<([\w\d./]+)>/gm;function hl(i){return i.replace(Kx,Qx)}const Jx=new Map;function Qx(i,t){let e=qt[t];if(e===void 0){const n=Jx.get(t);if(n!==void 0)e=qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return hl(e)}const tv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uh(i){return i.replace(tv,ev)}function ev(i,t,e,n){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function hh(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function nv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===bl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===df?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===pi&&(t="SHADOWMAP_TYPE_VSM"),t}function iv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case js:case Ks:t="ENVMAP_TYPE_CUBE";break;case Ma:t="ENVMAP_TYPE_CUBE_UV";break}return t}function sv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ks:t="ENVMAP_MODE_REFRACTION";break}return t}function ov(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case pf:t="ENVMAP_BLENDING_MULTIPLY";break;case Yd:t="ENVMAP_BLENDING_MIX";break;case Zd:t="ENVMAP_BLENDING_ADD";break}return t}function rv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function av(i,t,e,n){const s=i.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const c=nv(e),l=iv(e),u=sv(e),f=ov(e),d=rv(e),h=Zx(e),g=$x(o),x=s.createProgram();let p,m,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(No).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(No).join(`
`),m.length>0&&(m+=`
`)):(p=[hh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(No).join(`
`),m=[hh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==wi?"#define TONE_MAPPING":"",e.toneMapping!==wi?qt.tonemapping_pars_fragment:"",e.toneMapping!==wi?qx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,Xx("linearToOutputTexel",e.outputColorSpace),Yx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(No).join(`
`)),r=hl(r),r=ch(r,e),r=lh(r,e),a=hl(a),a=ch(a,e),a=lh(a,e),r=uh(r),a=uh(a),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===bu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===bu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const M=v+p+r,_=v+m+a,w=oh(s,s.VERTEX_SHADER,M),b=oh(s,s.FRAGMENT_SHADER,_);s.attachShader(x,w),s.attachShader(x,b),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function A(E){if(i.debug.checkShaderErrors){const U=s.getProgramInfoLog(x).trim(),N=s.getShaderInfoLog(w).trim(),P=s.getShaderInfoLog(b).trim();let k=!0,L=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(k=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,b);else{const H=ah(s,w,"vertex"),z=ah(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+U+`
`+H+`
`+z)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(N===""||P==="")&&(L=!1);L&&(E.diagnostics={runnable:k,programLog:U,vertexShader:{log:N,prefix:p},fragmentShader:{log:P,prefix:m}})}s.deleteShader(w),s.deleteShader(b),R=new Qr(s,x),S=jx(s,x)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(x,Hx)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gx++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=b,this}let cv=0;class lv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new uv(t),e.set(t,n)),n}}class uv{constructor(t){this.id=cv++,this.code=t,this.usedTimes=0}}function hv(i,t,e,n,s,o,r){const a=new Dl,c=new lv,l=new Set,u=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let h=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return l.add(S),S===0?"uv":`uv${S}`}function p(S,y,E,U,N){const P=U.fog,k=N.geometry,L=S.isMeshStandardMaterial?U.environment:null,H=(S.isMeshStandardMaterial?e:t).get(S.envMap||L),z=H&&H.mapping===Ma?H.image.height:null,O=g[S.type];S.precision!==null&&(h=s.getMaxPrecision(S.precision),h!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",h,"instead."));const Y=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Z=Y!==void 0?Y.length:0;let nt=0;k.morphAttributes.position!==void 0&&(nt=1),k.morphAttributes.normal!==void 0&&(nt=2),k.morphAttributes.color!==void 0&&(nt=3);let mt,V,j,ct;if(O){const fe=Kn[O];mt=fe.vertexShader,V=fe.fragmentShader}else mt=S.vertexShader,V=S.fragmentShader,c.update(S),j=c.getVertexShaderID(S),ct=c.getFragmentShaderID(S);const ot=i.getRenderTarget(),Tt=i.state.buffers.depth.getReversed(),gt=N.isInstancedMesh===!0,J=N.isBatchedMesh===!0,lt=!!S.map,G=!!S.matcap,tt=!!H,F=!!S.aoMap,St=!!S.lightMap,dt=!!S.bumpMap,Et=!!S.normalMap,_t=!!S.displacementMap,zt=!!S.emissiveMap,ut=!!S.metalnessMap,I=!!S.roughnessMap,T=S.anisotropy>0,$=S.clearcoat>0,st=S.dispersion>0,ft=S.iridescence>0,K=S.sheen>0,wt=S.transmission>0,yt=T&&!!S.anisotropyMap,At=$&&!!S.clearcoatMap,$t=$&&!!S.clearcoatNormalMap,xt=$&&!!S.clearcoatRoughnessMap,It=ft&&!!S.iridescenceMap,Ht=ft&&!!S.iridescenceThicknessMap,Vt=K&&!!S.sheenColorMap,Ut=K&&!!S.sheenRoughnessMap,se=!!S.specularMap,Jt=!!S.specularColorMap,ge=!!S.specularIntensityMap,W=wt&&!!S.transmissionMap,Ct=wt&&!!S.thicknessMap,it=!!S.gradientMap,ht=!!S.alphaMap,Dt=S.alphaTest>0,Pt=!!S.alphaHash,jt=!!S.extensions;let be=wi;S.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(be=i.toneMapping);const qe={shaderID:O,shaderType:S.type,shaderName:S.name,vertexShader:mt,fragmentShader:V,defines:S.defines,customVertexShaderID:j,customFragmentShaderID:ct,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:h,batching:J,batchingColor:J&&N._colorsTexture!==null,instancing:gt,instancingColor:gt&&N.instanceColor!==null,instancingMorph:gt&&N.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ot===null?i.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:ao,alphaToCoverage:!!S.alphaToCoverage,map:lt,matcap:G,envMap:tt,envMapMode:tt&&H.mapping,envMapCubeUVHeight:z,aoMap:F,lightMap:St,bumpMap:dt,normalMap:Et,displacementMap:d&&_t,emissiveMap:zt,normalMapObjectSpace:Et&&S.normalMapType===o0,normalMapTangentSpace:Et&&S.normalMapType===Ef,metalnessMap:ut,roughnessMap:I,anisotropy:T,anisotropyMap:yt,clearcoat:$,clearcoatMap:At,clearcoatNormalMap:$t,clearcoatRoughnessMap:xt,dispersion:st,iridescence:ft,iridescenceMap:It,iridescenceThicknessMap:Ht,sheen:K,sheenColorMap:Vt,sheenRoughnessMap:Ut,specularMap:se,specularColorMap:Jt,specularIntensityMap:ge,transmission:wt,transmissionMap:W,thicknessMap:Ct,gradientMap:it,opaque:S.transparent===!1&&S.blending===Xs&&S.alphaToCoverage===!1,alphaMap:ht,alphaTest:Dt,alphaHash:Pt,combine:S.combine,mapUv:lt&&x(S.map.channel),aoMapUv:F&&x(S.aoMap.channel),lightMapUv:St&&x(S.lightMap.channel),bumpMapUv:dt&&x(S.bumpMap.channel),normalMapUv:Et&&x(S.normalMap.channel),displacementMapUv:_t&&x(S.displacementMap.channel),emissiveMapUv:zt&&x(S.emissiveMap.channel),metalnessMapUv:ut&&x(S.metalnessMap.channel),roughnessMapUv:I&&x(S.roughnessMap.channel),anisotropyMapUv:yt&&x(S.anisotropyMap.channel),clearcoatMapUv:At&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:$t&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xt&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:It&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ht&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:Vt&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:Ut&&x(S.sheenRoughnessMap.channel),specularMapUv:se&&x(S.specularMap.channel),specularColorMapUv:Jt&&x(S.specularColorMap.channel),specularIntensityMapUv:ge&&x(S.specularIntensityMap.channel),transmissionMapUv:W&&x(S.transmissionMap.channel),thicknessMapUv:Ct&&x(S.thicknessMap.channel),alphaMapUv:ht&&x(S.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Et||T),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!k.attributes.uv&&(lt||ht),fog:!!P,useFog:S.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Tt,skinning:N.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:nt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&E.length>0,shadowMapType:i.shadowMap.type,toneMapping:be,decodeVideoTexture:lt&&S.map.isVideoTexture===!0&&re.getTransfer(S.map.colorSpace)===de,decodeVideoTextureEmissive:zt&&S.emissiveMap.isVideoTexture===!0&&re.getTransfer(S.emissiveMap.colorSpace)===de,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===ve,flipSided:S.side===sn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:jt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(jt&&S.extensions.multiDraw===!0||J)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return qe.vertexUv1s=l.has(1),qe.vertexUv2s=l.has(2),qe.vertexUv3s=l.has(3),l.clear(),qe}function m(S){const y=[];if(S.shaderID?y.push(S.shaderID):(y.push(S.customVertexShaderID),y.push(S.customFragmentShaderID)),S.defines!==void 0)for(const E in S.defines)y.push(E),y.push(S.defines[E]);return S.isRawShaderMaterial===!1&&(v(y,S),M(y,S),y.push(i.outputColorSpace)),y.push(S.customProgramCacheKey),y.join()}function v(S,y){S.push(y.precision),S.push(y.outputColorSpace),S.push(y.envMapMode),S.push(y.envMapCubeUVHeight),S.push(y.mapUv),S.push(y.alphaMapUv),S.push(y.lightMapUv),S.push(y.aoMapUv),S.push(y.bumpMapUv),S.push(y.normalMapUv),S.push(y.displacementMapUv),S.push(y.emissiveMapUv),S.push(y.metalnessMapUv),S.push(y.roughnessMapUv),S.push(y.anisotropyMapUv),S.push(y.clearcoatMapUv),S.push(y.clearcoatNormalMapUv),S.push(y.clearcoatRoughnessMapUv),S.push(y.iridescenceMapUv),S.push(y.iridescenceThicknessMapUv),S.push(y.sheenColorMapUv),S.push(y.sheenRoughnessMapUv),S.push(y.specularMapUv),S.push(y.specularColorMapUv),S.push(y.specularIntensityMapUv),S.push(y.transmissionMapUv),S.push(y.thicknessMapUv),S.push(y.combine),S.push(y.fogExp2),S.push(y.sizeAttenuation),S.push(y.morphTargetsCount),S.push(y.morphAttributeCount),S.push(y.numDirLights),S.push(y.numPointLights),S.push(y.numSpotLights),S.push(y.numSpotLightMaps),S.push(y.numHemiLights),S.push(y.numRectAreaLights),S.push(y.numDirLightShadows),S.push(y.numPointLightShadows),S.push(y.numSpotLightShadows),S.push(y.numSpotLightShadowsWithMaps),S.push(y.numLightProbes),S.push(y.shadowMapType),S.push(y.toneMapping),S.push(y.numClippingPlanes),S.push(y.numClipIntersection),S.push(y.depthPacking)}function M(S,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),S.push(a.mask)}function _(S){const y=g[S.type];let E;if(y){const U=Kn[y];E=lo.clone(U.uniforms)}else E=S.uniforms;return E}function w(S,y){let E;for(let U=0,N=u.length;U<N;U++){const P=u[U];if(P.cacheKey===y){E=P,++E.usedTimes;break}}return E===void 0&&(E=new av(i,y,S,o),u.push(E)),E}function b(S){if(--S.usedTimes===0){const y=u.indexOf(S);u[y]=u[u.length-1],u.pop(),S.destroy()}}function A(S){c.remove(S)}function R(){c.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:_,acquireProgram:w,releaseProgram:b,releaseShaderCache:A,programs:u,dispose:R}}function fv(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function n(r){i.delete(r)}function s(r,a,c){i.get(r)[a]=c}function o(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:o}}function dv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function fh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function dh(){const i=[];let t=0;const e=[],n=[],s=[];function o(){t=0,e.length=0,n.length=0,s.length=0}function r(f,d,h,g,x,p){let m=i[t];return m===void 0?(m={id:f.id,object:f,geometry:d,material:h,groupOrder:g,renderOrder:f.renderOrder,z:x,group:p},i[t]=m):(m.id=f.id,m.object=f,m.geometry=d,m.material=h,m.groupOrder=g,m.renderOrder=f.renderOrder,m.z=x,m.group=p),t++,m}function a(f,d,h,g,x,p){const m=r(f,d,h,g,x,p);h.transmission>0?n.push(m):h.transparent===!0?s.push(m):e.push(m)}function c(f,d,h,g,x,p){const m=r(f,d,h,g,x,p);h.transmission>0?n.unshift(m):h.transparent===!0?s.unshift(m):e.unshift(m)}function l(f,d){e.length>1&&e.sort(f||dv),n.length>1&&n.sort(d||fh),s.length>1&&s.sort(d||fh)}function u(){for(let f=t,d=i.length;f<d;f++){const h=i[f];if(h.id===null)break;h.id=null,h.object=null,h.geometry=null,h.material=null,h.group=null}}return{opaque:e,transmissive:n,transparent:s,init:o,push:a,unshift:c,finish:u,sort:l}}function pv(){let i=new WeakMap;function t(n,s){const o=i.get(n);let r;return o===void 0?(r=new dh,i.set(n,[r])):s>=o.length?(r=new dh,o.push(r)):r=o[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function mv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Rt};break;case"SpotLight":e={position:new C,direction:new C,color:new Rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Rt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Rt,groundColor:new Rt};break;case"RectAreaLight":e={color:new Rt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function gv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let xv=0;function vv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function _v(i){const t=new mv,e=gv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new C);const s=new C,o=new vt,r=new vt;function a(l){let u=0,f=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let h=0,g=0,x=0,p=0,m=0,v=0,M=0,_=0,w=0,b=0,A=0;l.sort(vv);for(let S=0,y=l.length;S<y;S++){const E=l[S],U=E.color,N=E.intensity,P=E.distance,k=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)u+=U.r*N,f+=U.g*N,d+=U.b*N;else if(E.isLightProbe){for(let L=0;L<9;L++)n.probe[L].addScaledVector(E.sh.coefficients[L],N);A++}else if(E.isDirectionalLight){const L=t.get(E);if(L.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const H=E.shadow,z=e.get(E);z.shadowIntensity=H.intensity,z.shadowBias=H.bias,z.shadowNormalBias=H.normalBias,z.shadowRadius=H.radius,z.shadowMapSize=H.mapSize,n.directionalShadow[h]=z,n.directionalShadowMap[h]=k,n.directionalShadowMatrix[h]=E.shadow.matrix,v++}n.directional[h]=L,h++}else if(E.isSpotLight){const L=t.get(E);L.position.setFromMatrixPosition(E.matrixWorld),L.color.copy(U).multiplyScalar(N),L.distance=P,L.coneCos=Math.cos(E.angle),L.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),L.decay=E.decay,n.spot[x]=L;const H=E.shadow;if(E.map&&(n.spotLightMap[w]=E.map,w++,H.updateMatrices(E),E.castShadow&&b++),n.spotLightMatrix[x]=H.matrix,E.castShadow){const z=e.get(E);z.shadowIntensity=H.intensity,z.shadowBias=H.bias,z.shadowNormalBias=H.normalBias,z.shadowRadius=H.radius,z.shadowMapSize=H.mapSize,n.spotShadow[x]=z,n.spotShadowMap[x]=k,_++}x++}else if(E.isRectAreaLight){const L=t.get(E);L.color.copy(U).multiplyScalar(N),L.halfWidth.set(E.width*.5,0,0),L.halfHeight.set(0,E.height*.5,0),n.rectArea[p]=L,p++}else if(E.isPointLight){const L=t.get(E);if(L.color.copy(E.color).multiplyScalar(E.intensity),L.distance=E.distance,L.decay=E.decay,E.castShadow){const H=E.shadow,z=e.get(E);z.shadowIntensity=H.intensity,z.shadowBias=H.bias,z.shadowNormalBias=H.normalBias,z.shadowRadius=H.radius,z.shadowMapSize=H.mapSize,z.shadowCameraNear=H.camera.near,z.shadowCameraFar=H.camera.far,n.pointShadow[g]=z,n.pointShadowMap[g]=k,n.pointShadowMatrix[g]=E.shadow.matrix,M++}n.point[g]=L,g++}else if(E.isHemisphereLight){const L=t.get(E);L.skyColor.copy(E.color).multiplyScalar(N),L.groundColor.copy(E.groundColor).multiplyScalar(N),n.hemi[m]=L,m++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=bt.LTC_FLOAT_1,n.rectAreaLTC2=bt.LTC_FLOAT_2):(n.rectAreaLTC1=bt.LTC_HALF_1,n.rectAreaLTC2=bt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=d;const R=n.hash;(R.directionalLength!==h||R.pointLength!==g||R.spotLength!==x||R.rectAreaLength!==p||R.hemiLength!==m||R.numDirectionalShadows!==v||R.numPointShadows!==M||R.numSpotShadows!==_||R.numSpotMaps!==w||R.numLightProbes!==A)&&(n.directional.length=h,n.spot.length=x,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+w-b,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=A,R.directionalLength=h,R.pointLength=g,R.spotLength=x,R.rectAreaLength=p,R.hemiLength=m,R.numDirectionalShadows=v,R.numPointShadows=M,R.numSpotShadows=_,R.numSpotMaps=w,R.numLightProbes=A,n.version=xv++)}function c(l,u){let f=0,d=0,h=0,g=0,x=0;const p=u.matrixWorldInverse;for(let m=0,v=l.length;m<v;m++){const M=l[m];if(M.isDirectionalLight){const _=n.directional[f];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(p),f++}else if(M.isSpotLight){const _=n.spot[h];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(p),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(p),h++}else if(M.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(p),r.identity(),o.copy(M.matrixWorld),o.premultiply(p),r.extractRotation(o),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(r),_.halfHeight.applyMatrix4(r),g++}else if(M.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(p),d++}else if(M.isHemisphereLight){const _=n.hemi[x];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(p),x++}}}return{setup:a,setupView:c,state:n}}function ph(i){const t=new _v(i),e=[],n=[];function s(u){l.camera=u,e.length=0,n.length=0}function o(u){e.push(u)}function r(u){n.push(u)}function a(){t.setup(e)}function c(u){t.setupView(e,u)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:o,pushShadow:r}}function Mv(i){let t=new WeakMap;function e(s,o=0){const r=t.get(s);let a;return r===void 0?(a=new ph(i),t.set(s,[a])):o>=r.length?(a=new ph(i),r.push(a)):a=r[o],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class yv extends Ms{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=i0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Sv extends Ms{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const bv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wv=`uniform sampler2D shadow_pass;
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
}`;function Ev(i,t,e){let n=new ba;const s=new rt,o=new rt,r=new oe,a=new yv({depthPacking:s0}),c=new Sv,l={},u=e.maxTextureSize,f={[fn]:sn,[sn]:fn,[ve]:ve},d=new Xe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new rt},radius:{value:4}},vertexShader:bv,fragmentShader:wv}),h=d.clone();h.defines.HORIZONTAL_PASS=1;const g=new Gt;g.setAttribute("position",new le(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Wt(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=bl;let m=this.type;this.render=function(b,A,R){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;const S=i.getRenderTarget(),y=i.getActiveCubeFace(),E=i.getActiveMipmapLevel(),U=i.state;U.setBlending(Xi),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const N=m!==pi&&this.type===pi,P=m===pi&&this.type!==pi;for(let k=0,L=b.length;k<L;k++){const H=b[k],z=H.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const O=z.getFrameExtents();if(s.multiply(O),o.copy(z.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(o.x=Math.floor(u/O.x),s.x=o.x*O.x,z.mapSize.x=o.x),s.y>u&&(o.y=Math.floor(u/O.y),s.y=o.y*O.y,z.mapSize.y=o.y)),z.map===null||N===!0||P===!0){const Z=this.type!==pi?{minFilter:yn,magFilter:yn}:{};z.map!==null&&z.map.dispose(),z.map=new Xn(s.x,s.y,Z),z.map.texture.name=H.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();const Y=z.getViewportCount();for(let Z=0;Z<Y;Z++){const nt=z.getViewport(Z);r.set(o.x*nt.x,o.y*nt.y,o.x*nt.z,o.y*nt.w),U.viewport(r),z.updateMatrices(H,Z),n=z.getFrustum(),_(A,R,z.camera,H,this.type)}z.isPointLightShadow!==!0&&this.type===pi&&v(z,R),z.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(S,y,E)};function v(b,A){const R=t.update(x);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,h.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,h.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Xn(s.x,s.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(A,null,R,d,x,null),h.uniforms.shadow_pass.value=b.mapPass.texture,h.uniforms.resolution.value=b.mapSize,h.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(A,null,R,h,x,null)}function M(b,A,R,S){let y=null;const E=R.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(E!==void 0)y=E;else if(y=R.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const U=y.uuid,N=A.uuid;let P=l[U];P===void 0&&(P={},l[U]=P);let k=P[N];k===void 0&&(k=y.clone(),P[N]=k,A.addEventListener("dispose",w)),y=k}if(y.visible=A.visible,y.wireframe=A.wireframe,S===pi?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:f[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,R.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const U=i.properties.get(y);U.light=R}return y}function _(b,A,R,S,y){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&y===pi)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,b.matrixWorld);const N=t.update(b),P=b.material;if(Array.isArray(P)){const k=N.groups;for(let L=0,H=k.length;L<H;L++){const z=k[L],O=P[z.materialIndex];if(O&&O.visible){const Y=M(b,O,S,y);b.onBeforeShadow(i,b,A,R,N,Y,z),i.renderBufferDirect(R,null,N,Y,b,z),b.onAfterShadow(i,b,A,R,N,Y,z)}}}else if(P.visible){const k=M(b,P,S,y);b.onBeforeShadow(i,b,A,R,N,k,null),i.renderBufferDirect(R,null,N,k,b,null),b.onAfterShadow(i,b,A,R,N,k,null)}}const U=b.children;for(let N=0,P=U.length;N<P;N++)_(U[N],A,R,S,y)}function w(b){b.target.removeEventListener("dispose",w);for(const R in l){const S=l[R],y=b.target.uuid;y in S&&(S[y].dispose(),delete S[y])}}}const Tv={[Rc]:Pc,[Lc]:Uc,[Dc]:Nc,[$s]:Ic,[Pc]:Rc,[Uc]:Lc,[Nc]:Dc,[Ic]:$s};function Av(i,t){function e(){let W=!1;const Ct=new oe;let it=null;const ht=new oe(0,0,0,0);return{setMask:function(Dt){it!==Dt&&!W&&(i.colorMask(Dt,Dt,Dt,Dt),it=Dt)},setLocked:function(Dt){W=Dt},setClear:function(Dt,Pt,jt,be,qe){qe===!0&&(Dt*=be,Pt*=be,jt*=be),Ct.set(Dt,Pt,jt,be),ht.equals(Ct)===!1&&(i.clearColor(Dt,Pt,jt,be),ht.copy(Ct))},reset:function(){W=!1,it=null,ht.set(-1,0,0,0)}}}function n(){let W=!1,Ct=!1,it=null,ht=null,Dt=null;return{setReversed:function(Pt){if(Ct!==Pt){const jt=t.get("EXT_clip_control");Ct?jt.clipControlEXT(jt.LOWER_LEFT_EXT,jt.ZERO_TO_ONE_EXT):jt.clipControlEXT(jt.LOWER_LEFT_EXT,jt.NEGATIVE_ONE_TO_ONE_EXT);const be=Dt;Dt=null,this.setClear(be)}Ct=Pt},getReversed:function(){return Ct},setTest:function(Pt){Pt?ot(i.DEPTH_TEST):Tt(i.DEPTH_TEST)},setMask:function(Pt){it!==Pt&&!W&&(i.depthMask(Pt),it=Pt)},setFunc:function(Pt){if(Ct&&(Pt=Tv[Pt]),ht!==Pt){switch(Pt){case Rc:i.depthFunc(i.NEVER);break;case Pc:i.depthFunc(i.ALWAYS);break;case Lc:i.depthFunc(i.LESS);break;case $s:i.depthFunc(i.LEQUAL);break;case Dc:i.depthFunc(i.EQUAL);break;case Ic:i.depthFunc(i.GEQUAL);break;case Uc:i.depthFunc(i.GREATER);break;case Nc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ht=Pt}},setLocked:function(Pt){W=Pt},setClear:function(Pt){Dt!==Pt&&(Ct&&(Pt=1-Pt),i.clearDepth(Pt),Dt=Pt)},reset:function(){W=!1,it=null,ht=null,Dt=null,Ct=!1}}}function s(){let W=!1,Ct=null,it=null,ht=null,Dt=null,Pt=null,jt=null,be=null,qe=null;return{setTest:function(fe){W||(fe?ot(i.STENCIL_TEST):Tt(i.STENCIL_TEST))},setMask:function(fe){Ct!==fe&&!W&&(i.stencilMask(fe),Ct=fe)},setFunc:function(fe,Un,si){(it!==fe||ht!==Un||Dt!==si)&&(i.stencilFunc(fe,Un,si),it=fe,ht=Un,Dt=si)},setOp:function(fe,Un,si){(Pt!==fe||jt!==Un||be!==si)&&(i.stencilOp(fe,Un,si),Pt=fe,jt=Un,be=si)},setLocked:function(fe){W=fe},setClear:function(fe){qe!==fe&&(i.clearStencil(fe),qe=fe)},reset:function(){W=!1,Ct=null,it=null,ht=null,Dt=null,Pt=null,jt=null,be=null,qe=null}}}const o=new e,r=new n,a=new s,c=new WeakMap,l=new WeakMap;let u={},f={},d=new WeakMap,h=[],g=null,x=!1,p=null,m=null,v=null,M=null,_=null,w=null,b=null,A=new Rt(0,0,0),R=0,S=!1,y=null,E=null,U=null,N=null,P=null;const k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let L=!1,H=0;const z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(z)[1]),L=H>=1):z.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),L=H>=2);let O=null,Y={};const Z=i.getParameter(i.SCISSOR_BOX),nt=i.getParameter(i.VIEWPORT),mt=new oe().fromArray(Z),V=new oe().fromArray(nt);function j(W,Ct,it,ht){const Dt=new Uint8Array(4),Pt=i.createTexture();i.bindTexture(W,Pt),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let jt=0;jt<it;jt++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(Ct,0,i.RGBA,1,1,ht,0,i.RGBA,i.UNSIGNED_BYTE,Dt):i.texImage2D(Ct+jt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Dt);return Pt}const ct={};ct[i.TEXTURE_2D]=j(i.TEXTURE_2D,i.TEXTURE_2D,1),ct[i.TEXTURE_CUBE_MAP]=j(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ct[i.TEXTURE_2D_ARRAY]=j(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ct[i.TEXTURE_3D]=j(i.TEXTURE_3D,i.TEXTURE_3D,1,1),o.setClear(0,0,0,1),r.setClear(1),a.setClear(0),ot(i.DEPTH_TEST),r.setFunc($s),dt(!1),Et(vu),ot(i.CULL_FACE),F(Xi);function ot(W){u[W]!==!0&&(i.enable(W),u[W]=!0)}function Tt(W){u[W]!==!1&&(i.disable(W),u[W]=!1)}function gt(W,Ct){return f[W]!==Ct?(i.bindFramebuffer(W,Ct),f[W]=Ct,W===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=Ct),W===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=Ct),!0):!1}function J(W,Ct){let it=h,ht=!1;if(W){it=d.get(Ct),it===void 0&&(it=[],d.set(Ct,it));const Dt=W.textures;if(it.length!==Dt.length||it[0]!==i.COLOR_ATTACHMENT0){for(let Pt=0,jt=Dt.length;Pt<jt;Pt++)it[Pt]=i.COLOR_ATTACHMENT0+Pt;it.length=Dt.length,ht=!0}}else it[0]!==i.BACK&&(it[0]=i.BACK,ht=!0);ht&&i.drawBuffers(it)}function lt(W){return g!==W?(i.useProgram(W),g=W,!0):!1}const G={[cs]:i.FUNC_ADD,[Pd]:i.FUNC_SUBTRACT,[Ld]:i.FUNC_REVERSE_SUBTRACT};G[Dd]=i.MIN,G[Id]=i.MAX;const tt={[Ud]:i.ZERO,[Nd]:i.ONE,[Fd]:i.SRC_COLOR,[Ac]:i.SRC_ALPHA,[Gd]:i.SRC_ALPHA_SATURATE,[Bd]:i.DST_COLOR,[kd]:i.DST_ALPHA,[Od]:i.ONE_MINUS_SRC_COLOR,[Cc]:i.ONE_MINUS_SRC_ALPHA,[Hd]:i.ONE_MINUS_DST_COLOR,[zd]:i.ONE_MINUS_DST_ALPHA,[Vd]:i.CONSTANT_COLOR,[Wd]:i.ONE_MINUS_CONSTANT_COLOR,[Xd]:i.CONSTANT_ALPHA,[qd]:i.ONE_MINUS_CONSTANT_ALPHA};function F(W,Ct,it,ht,Dt,Pt,jt,be,qe,fe){if(W===Xi){x===!0&&(Tt(i.BLEND),x=!1);return}if(x===!1&&(ot(i.BLEND),x=!0),W!==Rd){if(W!==p||fe!==S){if((m!==cs||_!==cs)&&(i.blendEquation(i.FUNC_ADD),m=cs,_=cs),fe)switch(W){case Xs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tc:i.blendFunc(i.ONE,i.ONE);break;case _u:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Mu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case Xs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case _u:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Mu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}v=null,M=null,w=null,b=null,A.set(0,0,0),R=0,p=W,S=fe}return}Dt=Dt||Ct,Pt=Pt||it,jt=jt||ht,(Ct!==m||Dt!==_)&&(i.blendEquationSeparate(G[Ct],G[Dt]),m=Ct,_=Dt),(it!==v||ht!==M||Pt!==w||jt!==b)&&(i.blendFuncSeparate(tt[it],tt[ht],tt[Pt],tt[jt]),v=it,M=ht,w=Pt,b=jt),(be.equals(A)===!1||qe!==R)&&(i.blendColor(be.r,be.g,be.b,qe),A.copy(be),R=qe),p=W,S=!1}function St(W,Ct){W.side===ve?Tt(i.CULL_FACE):ot(i.CULL_FACE);let it=W.side===sn;Ct&&(it=!it),dt(it),W.blending===Xs&&W.transparent===!1?F(Xi):F(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),r.setFunc(W.depthFunc),r.setTest(W.depthTest),r.setMask(W.depthWrite),o.setMask(W.colorWrite);const ht=W.stencilWrite;a.setTest(ht),ht&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),zt(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):Tt(i.SAMPLE_ALPHA_TO_COVERAGE)}function dt(W){y!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),y=W)}function Et(W){W!==Ad?(ot(i.CULL_FACE),W!==E&&(W===vu?i.cullFace(i.BACK):W===Cd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Tt(i.CULL_FACE),E=W}function _t(W){W!==U&&(L&&i.lineWidth(W),U=W)}function zt(W,Ct,it){W?(ot(i.POLYGON_OFFSET_FILL),(N!==Ct||P!==it)&&(i.polygonOffset(Ct,it),N=Ct,P=it)):Tt(i.POLYGON_OFFSET_FILL)}function ut(W){W?ot(i.SCISSOR_TEST):Tt(i.SCISSOR_TEST)}function I(W){W===void 0&&(W=i.TEXTURE0+k-1),O!==W&&(i.activeTexture(W),O=W)}function T(W,Ct,it){it===void 0&&(O===null?it=i.TEXTURE0+k-1:it=O);let ht=Y[it];ht===void 0&&(ht={type:void 0,texture:void 0},Y[it]=ht),(ht.type!==W||ht.texture!==Ct)&&(O!==it&&(i.activeTexture(it),O=it),i.bindTexture(W,Ct||ct[W]),ht.type=W,ht.texture=Ct)}function $(){const W=Y[O];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function st(){try{i.compressedTexImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ft(){try{i.compressedTexImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function K(){try{i.texSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function wt(){try{i.texSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function yt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function At(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function $t(){try{i.texStorage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function xt(){try{i.texStorage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function It(){try{i.texImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ht(){try{i.texImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Vt(W){mt.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),mt.copy(W))}function Ut(W){V.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),V.copy(W))}function se(W,Ct){let it=l.get(Ct);it===void 0&&(it=new WeakMap,l.set(Ct,it));let ht=it.get(W);ht===void 0&&(ht=i.getUniformBlockIndex(Ct,W.name),it.set(W,ht))}function Jt(W,Ct){const ht=l.get(Ct).get(W);c.get(Ct)!==ht&&(i.uniformBlockBinding(Ct,ht,W.__bindingPointIndex),c.set(Ct,ht))}function ge(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},O=null,Y={},f={},d=new WeakMap,h=[],g=null,x=!1,p=null,m=null,v=null,M=null,_=null,w=null,b=null,A=new Rt(0,0,0),R=0,S=!1,y=null,E=null,U=null,N=null,P=null,mt.set(0,0,i.canvas.width,i.canvas.height),V.set(0,0,i.canvas.width,i.canvas.height),o.reset(),r.reset(),a.reset()}return{buffers:{color:o,depth:r,stencil:a},enable:ot,disable:Tt,bindFramebuffer:gt,drawBuffers:J,useProgram:lt,setBlending:F,setMaterial:St,setFlipSided:dt,setCullFace:Et,setLineWidth:_t,setPolygonOffset:zt,setScissorTest:ut,activeTexture:I,bindTexture:T,unbindTexture:$,compressedTexImage2D:st,compressedTexImage3D:ft,texImage2D:It,texImage3D:Ht,updateUBOMapping:se,uniformBlockBinding:Jt,texStorage2D:$t,texStorage3D:xt,texSubImage2D:K,texSubImage3D:wt,compressedTexSubImage2D:yt,compressedTexSubImage3D:At,scissor:Vt,viewport:Ut,reset:ge}}function mh(i,t,e,n){const s=Cv(n);switch(e){case _f:return i*t;case yf:return i*t;case Sf:return i*t*2;case Al:return i*t/s.components*s.byteLength;case Cl:return i*t/s.components*s.byteLength;case bf:return i*t*2/s.components*s.byteLength;case Rl:return i*t*2/s.components*s.byteLength;case Mf:return i*t*3/s.components*s.byteLength;case Ln:return i*t*4/s.components*s.byteLength;case Pl:return i*t*4/s.components*s.byteLength;case Zr:case $r:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case jr:case Kr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Bc:case Gc:return Math.max(i,16)*Math.max(t,8)/4;case zc:case Hc:return Math.max(i,8)*Math.max(t,8)/2;case Vc:case Wc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Xc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case qc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Yc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Zc:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case $c:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case jc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Kc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Jc:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Qc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case tl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case el:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case nl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case il:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case sl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case ol:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Jr:case rl:case al:return Math.ceil(i/4)*Math.ceil(t/4)*16;case wf:case cl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ll:case ul:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Cv(i){switch(i){case ei:case gf:return{byteLength:1,components:1};case Xo:case xf:case gs:return{byteLength:2,components:1};case El:case Tl:return{byteLength:2,components:4};case ps:case wl:case Qn:return{byteLength:4,components:1};case vf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Rv(i,t,e,n,s,o,r){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new rt,u=new WeakMap;let f;const d=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,T){return h?new OffscreenCanvas(I,T):na("canvas")}function x(I,T,$){let st=1;const ft=ut(I);if((ft.width>$||ft.height>$)&&(st=$/Math.max(ft.width,ft.height)),st<1)if(typeof HTMLImageElement!="undefined"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&I instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&I instanceof ImageBitmap||typeof VideoFrame!="undefined"&&I instanceof VideoFrame){const K=Math.floor(st*ft.width),wt=Math.floor(st*ft.height);f===void 0&&(f=g(K,wt));const yt=T?g(K,wt):f;return yt.width=K,yt.height=wt,yt.getContext("2d").drawImage(I,0,0,K,wt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ft.width+"x"+ft.height+") to ("+K+"x"+wt+")."),yt}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ft.width+"x"+ft.height+")."),I;return I}function p(I){return I.generateMipmaps}function m(I){i.generateMipmap(I)}function v(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(I,T,$,st,ft=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let K=T;if(T===i.RED&&($===i.FLOAT&&(K=i.R32F),$===i.HALF_FLOAT&&(K=i.R16F),$===i.UNSIGNED_BYTE&&(K=i.R8)),T===i.RED_INTEGER&&($===i.UNSIGNED_BYTE&&(K=i.R8UI),$===i.UNSIGNED_SHORT&&(K=i.R16UI),$===i.UNSIGNED_INT&&(K=i.R32UI),$===i.BYTE&&(K=i.R8I),$===i.SHORT&&(K=i.R16I),$===i.INT&&(K=i.R32I)),T===i.RG&&($===i.FLOAT&&(K=i.RG32F),$===i.HALF_FLOAT&&(K=i.RG16F),$===i.UNSIGNED_BYTE&&(K=i.RG8)),T===i.RG_INTEGER&&($===i.UNSIGNED_BYTE&&(K=i.RG8UI),$===i.UNSIGNED_SHORT&&(K=i.RG16UI),$===i.UNSIGNED_INT&&(K=i.RG32UI),$===i.BYTE&&(K=i.RG8I),$===i.SHORT&&(K=i.RG16I),$===i.INT&&(K=i.RG32I)),T===i.RGB_INTEGER&&($===i.UNSIGNED_BYTE&&(K=i.RGB8UI),$===i.UNSIGNED_SHORT&&(K=i.RGB16UI),$===i.UNSIGNED_INT&&(K=i.RGB32UI),$===i.BYTE&&(K=i.RGB8I),$===i.SHORT&&(K=i.RGB16I),$===i.INT&&(K=i.RGB32I)),T===i.RGBA_INTEGER&&($===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),$===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),$===i.UNSIGNED_INT&&(K=i.RGBA32UI),$===i.BYTE&&(K=i.RGBA8I),$===i.SHORT&&(K=i.RGBA16I),$===i.INT&&(K=i.RGBA32I)),T===i.RGB&&$===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),T===i.RGBA){const wt=ft?ya:re.getTransfer(st);$===i.FLOAT&&(K=i.RGBA32F),$===i.HALF_FLOAT&&(K=i.RGBA16F),$===i.UNSIGNED_BYTE&&(K=wt===de?i.SRGB8_ALPHA8:i.RGBA8),$===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),$===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function _(I,T){let $;return I?T===null||T===ps||T===Js?$=i.DEPTH24_STENCIL8:T===Qn?$=i.DEPTH32F_STENCIL8:T===Xo&&($=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ps||T===Js?$=i.DEPTH_COMPONENT24:T===Qn?$=i.DEPTH_COMPONENT32F:T===Xo&&($=i.DEPTH_COMPONENT16),$}function w(I,T){return p(I)===!0||I.isFramebufferTexture&&I.minFilter!==yn&&I.minFilter!==_n?Math.log2(Math.max(T.width,T.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?T.mipmaps.length:1}function b(I){const T=I.target;T.removeEventListener("dispose",b),R(T),T.isVideoTexture&&u.delete(T)}function A(I){const T=I.target;T.removeEventListener("dispose",A),y(T)}function R(I){const T=n.get(I);if(T.__webglInit===void 0)return;const $=I.source,st=d.get($);if(st){const ft=st[T.__cacheKey];ft.usedTimes--,ft.usedTimes===0&&S(I),Object.keys(st).length===0&&d.delete($)}n.remove(I)}function S(I){const T=n.get(I);i.deleteTexture(T.__webglTexture);const $=I.source,st=d.get($);delete st[T.__cacheKey],r.memory.textures--}function y(I){const T=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let st=0;st<6;st++){if(Array.isArray(T.__webglFramebuffer[st]))for(let ft=0;ft<T.__webglFramebuffer[st].length;ft++)i.deleteFramebuffer(T.__webglFramebuffer[st][ft]);else i.deleteFramebuffer(T.__webglFramebuffer[st]);T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer[st])}else{if(Array.isArray(T.__webglFramebuffer))for(let st=0;st<T.__webglFramebuffer.length;st++)i.deleteFramebuffer(T.__webglFramebuffer[st]);else i.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&i.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let st=0;st<T.__webglColorRenderbuffer.length;st++)T.__webglColorRenderbuffer[st]&&i.deleteRenderbuffer(T.__webglColorRenderbuffer[st]);T.__webglDepthRenderbuffer&&i.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const $=I.textures;for(let st=0,ft=$.length;st<ft;st++){const K=n.get($[st]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),r.memory.textures--),n.remove($[st])}n.remove(I)}let E=0;function U(){E=0}function N(){const I=E;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),E+=1,I}function P(I){const T=[];return T.push(I.wrapS),T.push(I.wrapT),T.push(I.wrapR||0),T.push(I.magFilter),T.push(I.minFilter),T.push(I.anisotropy),T.push(I.internalFormat),T.push(I.format),T.push(I.type),T.push(I.generateMipmaps),T.push(I.premultiplyAlpha),T.push(I.flipY),T.push(I.unpackAlignment),T.push(I.colorSpace),T.join()}function k(I,T){const $=n.get(I);if(I.isVideoTexture&&_t(I),I.isRenderTargetTexture===!1&&I.version>0&&$.__version!==I.version){const st=I.image;if(st===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(st.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V($,I,T);return}}e.bindTexture(i.TEXTURE_2D,$.__webglTexture,i.TEXTURE0+T)}function L(I,T){const $=n.get(I);if(I.version>0&&$.__version!==I.version){V($,I,T);return}e.bindTexture(i.TEXTURE_2D_ARRAY,$.__webglTexture,i.TEXTURE0+T)}function H(I,T){const $=n.get(I);if(I.version>0&&$.__version!==I.version){V($,I,T);return}e.bindTexture(i.TEXTURE_3D,$.__webglTexture,i.TEXTURE0+T)}function z(I,T){const $=n.get(I);if(I.version>0&&$.__version!==I.version){j($,I,T);return}e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture,i.TEXTURE0+T)}const O={[Wo]:i.REPEAT,[Vi]:i.CLAMP_TO_EDGE,[kc]:i.MIRRORED_REPEAT},Y={[yn]:i.NEAREST,[n0]:i.NEAREST_MIPMAP_NEAREST,[hr]:i.NEAREST_MIPMAP_LINEAR,[_n]:i.LINEAR,[Oa]:i.LINEAR_MIPMAP_NEAREST,[Mi]:i.LINEAR_MIPMAP_LINEAR},Z={[r0]:i.NEVER,[f0]:i.ALWAYS,[a0]:i.LESS,[Tf]:i.LEQUAL,[c0]:i.EQUAL,[h0]:i.GEQUAL,[l0]:i.GREATER,[u0]:i.NOTEQUAL};function nt(I,T){if(T.type===Qn&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===_n||T.magFilter===Oa||T.magFilter===hr||T.magFilter===Mi||T.minFilter===_n||T.minFilter===Oa||T.minFilter===hr||T.minFilter===Mi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,O[T.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,O[T.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,O[T.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,Y[T.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,Y[T.minFilter]),T.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,Z[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===yn||T.minFilter!==hr&&T.minFilter!==Mi||T.type===Qn&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");i.texParameterf(I,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function mt(I,T){let $=!1;I.__webglInit===void 0&&(I.__webglInit=!0,T.addEventListener("dispose",b));const st=T.source;let ft=d.get(st);ft===void 0&&(ft={},d.set(st,ft));const K=P(T);if(K!==I.__cacheKey){ft[K]===void 0&&(ft[K]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,$=!0),ft[K].usedTimes++;const wt=ft[I.__cacheKey];wt!==void 0&&(ft[I.__cacheKey].usedTimes--,wt.usedTimes===0&&S(T)),I.__cacheKey=K,I.__webglTexture=ft[K].texture}return $}function V(I,T,$){let st=i.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(st=i.TEXTURE_2D_ARRAY),T.isData3DTexture&&(st=i.TEXTURE_3D);const ft=mt(I,T),K=T.source;e.bindTexture(st,I.__webglTexture,i.TEXTURE0+$);const wt=n.get(K);if(K.version!==wt.__version||ft===!0){e.activeTexture(i.TEXTURE0+$);const yt=re.getPrimaries(re.workingColorSpace),At=T.colorSpace===Jn?null:re.getPrimaries(T.colorSpace),$t=T.colorSpace===Jn||yt===At?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,$t);let xt=x(T.image,!1,s.maxTextureSize);xt=zt(T,xt);const It=o.convert(T.format,T.colorSpace),Ht=o.convert(T.type);let Vt=M(T.internalFormat,It,Ht,T.colorSpace,T.isVideoTexture);nt(st,T);let Ut;const se=T.mipmaps,Jt=T.isVideoTexture!==!0,ge=wt.__version===void 0||ft===!0,W=K.dataReady,Ct=w(T,xt);if(T.isDepthTexture)Vt=_(T.format===Qs,T.type),ge&&(Jt?e.texStorage2D(i.TEXTURE_2D,1,Vt,xt.width,xt.height):e.texImage2D(i.TEXTURE_2D,0,Vt,xt.width,xt.height,0,It,Ht,null));else if(T.isDataTexture)if(se.length>0){Jt&&ge&&e.texStorage2D(i.TEXTURE_2D,Ct,Vt,se[0].width,se[0].height);for(let it=0,ht=se.length;it<ht;it++)Ut=se[it],Jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Ut.width,Ut.height,It,Ht,Ut.data):e.texImage2D(i.TEXTURE_2D,it,Vt,Ut.width,Ut.height,0,It,Ht,Ut.data);T.generateMipmaps=!1}else Jt?(ge&&e.texStorage2D(i.TEXTURE_2D,Ct,Vt,xt.width,xt.height),W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,xt.width,xt.height,It,Ht,xt.data)):e.texImage2D(i.TEXTURE_2D,0,Vt,xt.width,xt.height,0,It,Ht,xt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Jt&&ge&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ct,Vt,se[0].width,se[0].height,xt.depth);for(let it=0,ht=se.length;it<ht;it++)if(Ut=se[it],T.format!==Ln)if(It!==null)if(Jt){if(W)if(T.layerUpdates.size>0){const Dt=mh(Ut.width,Ut.height,T.format,T.type);for(const Pt of T.layerUpdates){const jt=Ut.data.subarray(Pt*Dt/Ut.data.BYTES_PER_ELEMENT,(Pt+1)*Dt/Ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,Pt,Ut.width,Ut.height,1,It,jt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Ut.width,Ut.height,xt.depth,It,Ut.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,Vt,Ut.width,Ut.height,xt.depth,0,Ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Jt?W&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Ut.width,Ut.height,xt.depth,It,Ht,Ut.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,Vt,Ut.width,Ut.height,xt.depth,0,It,Ht,Ut.data)}else{Jt&&ge&&e.texStorage2D(i.TEXTURE_2D,Ct,Vt,se[0].width,se[0].height);for(let it=0,ht=se.length;it<ht;it++)Ut=se[it],T.format!==Ln?It!==null?Jt?W&&e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,Ut.width,Ut.height,It,Ut.data):e.compressedTexImage2D(i.TEXTURE_2D,it,Vt,Ut.width,Ut.height,0,Ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Ut.width,Ut.height,It,Ht,Ut.data):e.texImage2D(i.TEXTURE_2D,it,Vt,Ut.width,Ut.height,0,It,Ht,Ut.data)}else if(T.isDataArrayTexture)if(Jt){if(ge&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ct,Vt,xt.width,xt.height,xt.depth),W)if(T.layerUpdates.size>0){const it=mh(xt.width,xt.height,T.format,T.type);for(const ht of T.layerUpdates){const Dt=xt.data.subarray(ht*it/xt.data.BYTES_PER_ELEMENT,(ht+1)*it/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ht,xt.width,xt.height,1,It,Ht,Dt)}T.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,It,Ht,xt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Vt,xt.width,xt.height,xt.depth,0,It,Ht,xt.data);else if(T.isData3DTexture)Jt?(ge&&e.texStorage3D(i.TEXTURE_3D,Ct,Vt,xt.width,xt.height,xt.depth),W&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,It,Ht,xt.data)):e.texImage3D(i.TEXTURE_3D,0,Vt,xt.width,xt.height,xt.depth,0,It,Ht,xt.data);else if(T.isFramebufferTexture){if(ge)if(Jt)e.texStorage2D(i.TEXTURE_2D,Ct,Vt,xt.width,xt.height);else{let it=xt.width,ht=xt.height;for(let Dt=0;Dt<Ct;Dt++)e.texImage2D(i.TEXTURE_2D,Dt,Vt,it,ht,0,It,Ht,null),it>>=1,ht>>=1}}else if(se.length>0){if(Jt&&ge){const it=ut(se[0]);e.texStorage2D(i.TEXTURE_2D,Ct,Vt,it.width,it.height)}for(let it=0,ht=se.length;it<ht;it++)Ut=se[it],Jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,It,Ht,Ut):e.texImage2D(i.TEXTURE_2D,it,Vt,It,Ht,Ut);T.generateMipmaps=!1}else if(Jt){if(ge){const it=ut(xt);e.texStorage2D(i.TEXTURE_2D,Ct,Vt,it.width,it.height)}W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,It,Ht,xt)}else e.texImage2D(i.TEXTURE_2D,0,Vt,It,Ht,xt);p(T)&&m(st),wt.__version=K.version,T.onUpdate&&T.onUpdate(T)}I.__version=T.version}function j(I,T,$){if(T.image.length!==6)return;const st=mt(I,T),ft=T.source;e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+$);const K=n.get(ft);if(ft.version!==K.__version||st===!0){e.activeTexture(i.TEXTURE0+$);const wt=re.getPrimaries(re.workingColorSpace),yt=T.colorSpace===Jn?null:re.getPrimaries(T.colorSpace),At=T.colorSpace===Jn||wt===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);const $t=T.isCompressedTexture||T.image[0].isCompressedTexture,xt=T.image[0]&&T.image[0].isDataTexture,It=[];for(let ht=0;ht<6;ht++)!$t&&!xt?It[ht]=x(T.image[ht],!0,s.maxCubemapSize):It[ht]=xt?T.image[ht].image:T.image[ht],It[ht]=zt(T,It[ht]);const Ht=It[0],Vt=o.convert(T.format,T.colorSpace),Ut=o.convert(T.type),se=M(T.internalFormat,Vt,Ut,T.colorSpace),Jt=T.isVideoTexture!==!0,ge=K.__version===void 0||st===!0,W=ft.dataReady;let Ct=w(T,Ht);nt(i.TEXTURE_CUBE_MAP,T);let it;if($t){Jt&&ge&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,se,Ht.width,Ht.height);for(let ht=0;ht<6;ht++){it=It[ht].mipmaps;for(let Dt=0;Dt<it.length;Dt++){const Pt=it[Dt];T.format!==Ln?Vt!==null?Jt?W&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Dt,0,0,Pt.width,Pt.height,Vt,Pt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Dt,se,Pt.width,Pt.height,0,Pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Dt,0,0,Pt.width,Pt.height,Vt,Ut,Pt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Dt,se,Pt.width,Pt.height,0,Vt,Ut,Pt.data)}}}else{if(it=T.mipmaps,Jt&&ge){it.length>0&&Ct++;const ht=ut(It[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,se,ht.width,ht.height)}for(let ht=0;ht<6;ht++)if(xt){Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,It[ht].width,It[ht].height,Vt,Ut,It[ht].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,se,It[ht].width,It[ht].height,0,Vt,Ut,It[ht].data);for(let Dt=0;Dt<it.length;Dt++){const jt=it[Dt].image[ht].image;Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Dt+1,0,0,jt.width,jt.height,Vt,Ut,jt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Dt+1,se,jt.width,jt.height,0,Vt,Ut,jt.data)}}else{Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,Vt,Ut,It[ht]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,se,Vt,Ut,It[ht]);for(let Dt=0;Dt<it.length;Dt++){const Pt=it[Dt];Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Dt+1,0,0,Vt,Ut,Pt.image[ht]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Dt+1,se,Vt,Ut,Pt.image[ht])}}}p(T)&&m(i.TEXTURE_CUBE_MAP),K.__version=ft.version,T.onUpdate&&T.onUpdate(T)}I.__version=T.version}function ct(I,T,$,st,ft,K){const wt=o.convert($.format,$.colorSpace),yt=o.convert($.type),At=M($.internalFormat,wt,yt,$.colorSpace),$t=n.get(T),xt=n.get($);if(xt.__renderTarget=T,!$t.__hasExternalTextures){const It=Math.max(1,T.width>>K),Ht=Math.max(1,T.height>>K);ft===i.TEXTURE_3D||ft===i.TEXTURE_2D_ARRAY?e.texImage3D(ft,K,At,It,Ht,T.depth,0,wt,yt,null):e.texImage2D(ft,K,At,It,Ht,0,wt,yt,null)}e.bindFramebuffer(i.FRAMEBUFFER,I),Et(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,ft,xt.__webglTexture,0,dt(T)):(ft===i.TEXTURE_2D||ft>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ft<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,st,ft,xt.__webglTexture,K),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ot(I,T,$){if(i.bindRenderbuffer(i.RENDERBUFFER,I),T.depthBuffer){const st=T.depthTexture,ft=st&&st.isDepthTexture?st.type:null,K=_(T.stencilBuffer,ft),wt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=dt(T);Et(T)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,yt,K,T.width,T.height):$?i.renderbufferStorageMultisample(i.RENDERBUFFER,yt,K,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,K,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,wt,i.RENDERBUFFER,I)}else{const st=T.textures;for(let ft=0;ft<st.length;ft++){const K=st[ft],wt=o.convert(K.format,K.colorSpace),yt=o.convert(K.type),At=M(K.internalFormat,wt,yt,K.colorSpace),$t=dt(T);$&&Et(T)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,$t,At,T.width,T.height):Et(T)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,$t,At,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,At,T.width,T.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Tt(I,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,I),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const st=n.get(T.depthTexture);st.__renderTarget=T,(!st.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),k(T.depthTexture,0);const ft=st.__webglTexture,K=dt(T);if(T.depthTexture.format===qs)Et(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ft,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ft,0);else if(T.depthTexture.format===Qs)Et(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ft,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ft,0);else throw new Error("Unknown depthTexture format")}function gt(I){const T=n.get(I),$=I.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==I.depthTexture){const st=I.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),st){const ft=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,st.removeEventListener("dispose",ft)};st.addEventListener("dispose",ft),T.__depthDisposeCallback=ft}T.__boundDepthTexture=st}if(I.depthTexture&&!T.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");Tt(T.__webglFramebuffer,I)}else if($){T.__webglDepthbuffer=[];for(let st=0;st<6;st++)if(e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[st]),T.__webglDepthbuffer[st]===void 0)T.__webglDepthbuffer[st]=i.createRenderbuffer(),ot(T.__webglDepthbuffer[st],I,!1);else{const ft=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=T.__webglDepthbuffer[st];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ft,i.RENDERBUFFER,K)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=i.createRenderbuffer(),ot(T.__webglDepthbuffer,I,!1);else{const st=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=T.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ft),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,ft)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function J(I,T,$){const st=n.get(I);T!==void 0&&ct(st.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),$!==void 0&&gt(I)}function lt(I){const T=I.texture,$=n.get(I),st=n.get(T);I.addEventListener("dispose",A);const ft=I.textures,K=I.isWebGLCubeRenderTarget===!0,wt=ft.length>1;if(wt||(st.__webglTexture===void 0&&(st.__webglTexture=i.createTexture()),st.__version=T.version,r.memory.textures++),K){$.__webglFramebuffer=[];for(let yt=0;yt<6;yt++)if(T.mipmaps&&T.mipmaps.length>0){$.__webglFramebuffer[yt]=[];for(let At=0;At<T.mipmaps.length;At++)$.__webglFramebuffer[yt][At]=i.createFramebuffer()}else $.__webglFramebuffer[yt]=i.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){$.__webglFramebuffer=[];for(let yt=0;yt<T.mipmaps.length;yt++)$.__webglFramebuffer[yt]=i.createFramebuffer()}else $.__webglFramebuffer=i.createFramebuffer();if(wt)for(let yt=0,At=ft.length;yt<At;yt++){const $t=n.get(ft[yt]);$t.__webglTexture===void 0&&($t.__webglTexture=i.createTexture(),r.memory.textures++)}if(I.samples>0&&Et(I)===!1){$.__webglMultisampledFramebuffer=i.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let yt=0;yt<ft.length;yt++){const At=ft[yt];$.__webglColorRenderbuffer[yt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,$.__webglColorRenderbuffer[yt]);const $t=o.convert(At.format,At.colorSpace),xt=o.convert(At.type),It=M(At.internalFormat,$t,xt,At.colorSpace,I.isXRRenderTarget===!0),Ht=dt(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ht,It,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,$.__webglColorRenderbuffer[yt])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&($.__webglDepthRenderbuffer=i.createRenderbuffer(),ot($.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){e.bindTexture(i.TEXTURE_CUBE_MAP,st.__webglTexture),nt(i.TEXTURE_CUBE_MAP,T);for(let yt=0;yt<6;yt++)if(T.mipmaps&&T.mipmaps.length>0)for(let At=0;At<T.mipmaps.length;At++)ct($.__webglFramebuffer[yt][At],I,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,At);else ct($.__webglFramebuffer[yt],I,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0);p(T)&&m(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let yt=0,At=ft.length;yt<At;yt++){const $t=ft[yt],xt=n.get($t);e.bindTexture(i.TEXTURE_2D,xt.__webglTexture),nt(i.TEXTURE_2D,$t),ct($.__webglFramebuffer,I,$t,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,0),p($t)&&m(i.TEXTURE_2D)}e.unbindTexture()}else{let yt=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(yt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(yt,st.__webglTexture),nt(yt,T),T.mipmaps&&T.mipmaps.length>0)for(let At=0;At<T.mipmaps.length;At++)ct($.__webglFramebuffer[At],I,T,i.COLOR_ATTACHMENT0,yt,At);else ct($.__webglFramebuffer,I,T,i.COLOR_ATTACHMENT0,yt,0);p(T)&&m(yt),e.unbindTexture()}I.depthBuffer&&gt(I)}function G(I){const T=I.textures;for(let $=0,st=T.length;$<st;$++){const ft=T[$];if(p(ft)){const K=v(I),wt=n.get(ft).__webglTexture;e.bindTexture(K,wt),m(K),e.unbindTexture()}}}const tt=[],F=[];function St(I){if(I.samples>0){if(Et(I)===!1){const T=I.textures,$=I.width,st=I.height;let ft=i.COLOR_BUFFER_BIT;const K=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,wt=n.get(I),yt=T.length>1;if(yt)for(let At=0;At<T.length;At++)e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let At=0;At<T.length;At++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(ft|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(ft|=i.STENCIL_BUFFER_BIT)),yt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,wt.__webglColorRenderbuffer[At]);const $t=n.get(T[At]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,$t,0)}i.blitFramebuffer(0,0,$,st,0,0,$,st,ft,i.NEAREST),c===!0&&(tt.length=0,F.length=0,tt.push(i.COLOR_ATTACHMENT0+At),I.depthBuffer&&I.resolveDepthBuffer===!1&&(tt.push(K),F.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,F)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,tt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),yt)for(let At=0;At<T.length;At++){e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,wt.__webglColorRenderbuffer[At]);const $t=n.get(T[At]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,$t,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){const T=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[T])}}}function dt(I){return Math.min(s.maxSamples,I.samples)}function Et(I){const T=n.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function _t(I){const T=r.render.frame;u.get(I)!==T&&(u.set(I,T),I.update())}function zt(I,T){const $=I.colorSpace,st=I.format,ft=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||$!==ao&&$!==Jn&&(re.getTransfer($)===de?(st!==Ln||ft!==ei)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),T}function ut(I){return typeof HTMLImageElement!="undefined"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame!="undefined"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=N,this.resetTextureUnits=U,this.setTexture2D=k,this.setTexture2DArray=L,this.setTexture3D=H,this.setTextureCube=z,this.rebindTextures=J,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=G,this.updateMultisampleRenderTarget=St,this.setupDepthRenderbuffer=gt,this.setupFrameBufferTexture=ct,this.useMultisampledRTT=Et}function Pv(i,t){function e(n,s=Jn){let o;const r=re.getTransfer(s);if(n===ei)return i.UNSIGNED_BYTE;if(n===El)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Tl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===vf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gf)return i.BYTE;if(n===xf)return i.SHORT;if(n===Xo)return i.UNSIGNED_SHORT;if(n===wl)return i.INT;if(n===ps)return i.UNSIGNED_INT;if(n===Qn)return i.FLOAT;if(n===gs)return i.HALF_FLOAT;if(n===_f)return i.ALPHA;if(n===Mf)return i.RGB;if(n===Ln)return i.RGBA;if(n===yf)return i.LUMINANCE;if(n===Sf)return i.LUMINANCE_ALPHA;if(n===qs)return i.DEPTH_COMPONENT;if(n===Qs)return i.DEPTH_STENCIL;if(n===Al)return i.RED;if(n===Cl)return i.RED_INTEGER;if(n===bf)return i.RG;if(n===Rl)return i.RG_INTEGER;if(n===Pl)return i.RGBA_INTEGER;if(n===Zr||n===$r||n===jr||n===Kr)if(r===de)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(n===Zr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$r)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===jr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Kr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(n===Zr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$r)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===jr)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Kr)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===zc||n===Bc||n===Hc||n===Gc)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(n===zc)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bc)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Hc)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Gc)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Vc||n===Wc||n===Xc)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(n===Vc||n===Wc)return r===de?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===Xc)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===qc||n===Yc||n===Zc||n===$c||n===jc||n===Kc||n===Jc||n===Qc||n===tl||n===el||n===nl||n===il||n===sl||n===ol)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(n===qc)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Yc)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Zc)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===$c)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===jc)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Kc)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Jc)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qc)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===tl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===el)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===nl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===il)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===sl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ol)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Jr||n===rl||n===al)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(n===Jr)return r===de?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===rl)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===al)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===wf||n===cl||n===ll||n===ul)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(n===Jr)return o.COMPRESSED_RED_RGTC1_EXT;if(n===cl)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ll)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ul)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Js?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Lv extends hn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class we extends ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Dv={type:"move"};class uc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new we,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new we,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new we,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,o=null,r=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const x of t.hand.values()){const p=e.getJointPose(x,n),m=this._getHandJoint(l,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],d=u.position.distanceTo(f.position),h=.02,g=.005;l.inputState.pinching&&d>h+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=h-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&o!==null&&(s=o),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Dv)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new we;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Iv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Uv=`
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

}`;class Nv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new je,o=t.properties.get(s);o.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Xe({vertexShader:Iv,fragmentShader:Uv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Wt(new Le(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Fv extends xs{constructor(t,e){super();const n=this;let s=null,o=1,r=null,a="local-floor",c=1,l=null,u=null,f=null,d=null,h=null,g=null;const x=new Nv,p=e.getContextAttributes();let m=null,v=null;const M=[],_=[],w=new rt;let b=null;const A=new hn;A.viewport=new oe;const R=new hn;R.viewport=new oe;const S=[A,R],y=new Lv;let E=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let j=M[V];return j===void 0&&(j=new uc,M[V]=j),j.getTargetRaySpace()},this.getControllerGrip=function(V){let j=M[V];return j===void 0&&(j=new uc,M[V]=j),j.getGripSpace()},this.getHand=function(V){let j=M[V];return j===void 0&&(j=new uc,M[V]=j),j.getHandSpace()};function N(V){const j=_.indexOf(V.inputSource);if(j===-1)return;const ct=M[j];ct!==void 0&&(ct.update(V.inputSource,V.frame,l||r),ct.dispatchEvent({type:V.type,data:V.inputSource}))}function P(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",P),s.removeEventListener("inputsourceschange",k);for(let V=0;V<M.length;V++){const j=_[V];j!==null&&(_[V]=null,M[V].disconnect(j))}E=null,U=null,x.reset(),t.setRenderTarget(m),h=null,d=null,f=null,s=null,v=null,mt.stop(),n.isPresenting=!1,t.setPixelRatio(b),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){o=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){a=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(V){l=V},this.getBaseLayer=function(){return d!==null?d:h},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",P),s.addEventListener("inputsourceschange",k),p.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(w),s.renderState.layers===void 0){const j={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:o};h=new XRWebGLLayer(s,e,j),s.updateRenderState({baseLayer:h}),t.setPixelRatio(1),t.setSize(h.framebufferWidth,h.framebufferHeight,!1),v=new Xn(h.framebufferWidth,h.framebufferHeight,{format:Ln,type:ei,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let j=null,ct=null,ot=null;p.depth&&(ot=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=p.stencil?Qs:qs,ct=p.stencil?Js:ps);const Tt={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:o};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(Tt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),v=new Xn(d.textureWidth,d.textureHeight,{format:Ln,type:ei,depthTexture:new Nf(d.textureWidth,d.textureHeight,ct,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(a),mt.setContext(s),mt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function k(V){for(let j=0;j<V.removed.length;j++){const ct=V.removed[j],ot=_.indexOf(ct);ot>=0&&(_[ot]=null,M[ot].disconnect(ct))}for(let j=0;j<V.added.length;j++){const ct=V.added[j];let ot=_.indexOf(ct);if(ot===-1){for(let gt=0;gt<M.length;gt++)if(gt>=_.length){_.push(ct),ot=gt;break}else if(_[gt]===null){_[gt]=ct,ot=gt;break}if(ot===-1)break}const Tt=M[ot];Tt&&Tt.connect(ct)}}const L=new C,H=new C;function z(V,j,ct){L.setFromMatrixPosition(j.matrixWorld),H.setFromMatrixPosition(ct.matrixWorld);const ot=L.distanceTo(H),Tt=j.projectionMatrix.elements,gt=ct.projectionMatrix.elements,J=Tt[14]/(Tt[10]-1),lt=Tt[14]/(Tt[10]+1),G=(Tt[9]+1)/Tt[5],tt=(Tt[9]-1)/Tt[5],F=(Tt[8]-1)/Tt[0],St=(gt[8]+1)/gt[0],dt=J*F,Et=J*St,_t=ot/(-F+St),zt=_t*-F;if(j.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(zt),V.translateZ(_t),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Tt[10]===-1)V.projectionMatrix.copy(j.projectionMatrix),V.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const ut=J+_t,I=lt+_t,T=dt-zt,$=Et+(ot-zt),st=G*lt/I*ut,ft=tt*lt/I*ut;V.projectionMatrix.makePerspective(T,$,st,ft,ut,I),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function O(V,j){j===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(j.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let j=V.near,ct=V.far;x.texture!==null&&(x.depthNear>0&&(j=x.depthNear),x.depthFar>0&&(ct=x.depthFar)),y.near=R.near=A.near=j,y.far=R.far=A.far=ct,(E!==y.near||U!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),E=y.near,U=y.far),A.layers.mask=V.layers.mask|2,R.layers.mask=V.layers.mask|4,y.layers.mask=A.layers.mask|R.layers.mask;const ot=V.parent,Tt=y.cameras;O(y,ot);for(let gt=0;gt<Tt.length;gt++)O(Tt[gt],ot);Tt.length===2?z(y,A,R):y.projectionMatrix.copy(A.projectionMatrix),Y(V,y,ot)};function Y(V,j,ct){ct===null?V.matrix.copy(j.matrixWorld):(V.matrix.copy(ct.matrixWorld),V.matrix.invert(),V.matrix.multiply(j.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(j.projectionMatrix),V.projectionMatrixInverse.copy(j.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=qo*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&h===null))return c},this.setFoveation=function(V){c=V,d!==null&&(d.fixedFoveation=V),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=V)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(y)};let Z=null;function nt(V,j){if(u=j.getViewerPose(l||r),g=j,u!==null){const ct=u.views;h!==null&&(t.setRenderTargetFramebuffer(v,h.framebuffer),t.setRenderTarget(v));let ot=!1;ct.length!==y.cameras.length&&(y.cameras.length=0,ot=!0);for(let gt=0;gt<ct.length;gt++){const J=ct[gt];let lt=null;if(h!==null)lt=h.getViewport(J);else{const tt=f.getViewSubImage(d,J);lt=tt.viewport,gt===0&&(t.setRenderTargetTextures(v,tt.colorTexture,d.ignoreDepthValues?void 0:tt.depthStencilTexture),t.setRenderTarget(v))}let G=S[gt];G===void 0&&(G=new hn,G.layers.enable(gt),G.viewport=new oe,S[gt]=G),G.matrix.fromArray(J.transform.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale),G.projectionMatrix.fromArray(J.projectionMatrix),G.projectionMatrixInverse.copy(G.projectionMatrix).invert(),G.viewport.set(lt.x,lt.y,lt.width,lt.height),gt===0&&(y.matrix.copy(G.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ot===!0&&y.cameras.push(G)}const Tt=s.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")){const gt=f.getDepthInformation(ct[0]);gt&&gt.isValid&&gt.texture&&x.init(t,gt,s.renderState)}}for(let ct=0;ct<M.length;ct++){const ot=_[ct],Tt=M[ct];ot!==null&&Tt!==void 0&&Tt.update(ot,j,l||r)}Z&&Z(V,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}const mt=new Uf;mt.setAnimationLoop(nt),this.setAnimationLoop=function(V){Z=V},this.dispose=function(){}}}const ss=new dn,Ov=new vt;function kv(i,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Lf(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,v,M,_){m.isMeshBasicMaterial||m.isMeshLambertMaterial?o(p,m):m.isMeshToonMaterial?(o(p,m),f(p,m)):m.isMeshPhongMaterial?(o(p,m),u(p,m)):m.isMeshStandardMaterial?(o(p,m),d(p,m),m.isMeshPhysicalMaterial&&h(p,m,_)):m.isMeshMatcapMaterial?(o(p,m),g(p,m)):m.isMeshDepthMaterial?o(p,m):m.isMeshDistanceMaterial?(o(p,m),x(p,m)):m.isMeshNormalMaterial?o(p,m):m.isLineBasicMaterial?(r(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?c(p,m,v,M):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function o(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===sn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===sn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const v=t.get(m),M=v.envMap,_=v.envMapRotation;M&&(p.envMap.value=M,ss.copy(_),ss.x*=-1,ss.y*=-1,ss.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),p.envMapRotation.value.setFromMatrix4(Ov.makeRotationFromEuler(ss)),p.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function r(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,v,M){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*v,p.scale.value=M*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function f(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function h(p,m,v){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===sn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){const v=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function zv(i,t,e,n){let s={},o={},r=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,M){const _=M.program;n.uniformBlockBinding(v,_)}function l(v,M){let _=s[v.id];_===void 0&&(g(v),_=u(v),s[v.id]=_,v.addEventListener("dispose",p));const w=M.program;n.updateUBOMapping(v,w);const b=t.render.frame;o[v.id]!==b&&(d(v),o[v.id]=b)}function u(v){const M=f();v.__bindingPointIndex=M;const _=i.createBuffer(),w=v.__size,b=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,w,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function f(){for(let v=0;v<a;v++)if(r.indexOf(v)===-1)return r.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const M=s[v.id],_=v.uniforms,w=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let b=0,A=_.length;b<A;b++){const R=Array.isArray(_[b])?_[b]:[_[b]];for(let S=0,y=R.length;S<y;S++){const E=R[S];if(h(E,b,S,w)===!0){const U=E.__offset,N=Array.isArray(E.value)?E.value:[E.value];let P=0;for(let k=0;k<N.length;k++){const L=N[k],H=x(L);typeof L=="number"||typeof L=="boolean"?(E.__data[0]=L,i.bufferSubData(i.UNIFORM_BUFFER,U+P,E.__data)):L.isMatrix3?(E.__data[0]=L.elements[0],E.__data[1]=L.elements[1],E.__data[2]=L.elements[2],E.__data[3]=0,E.__data[4]=L.elements[3],E.__data[5]=L.elements[4],E.__data[6]=L.elements[5],E.__data[7]=0,E.__data[8]=L.elements[6],E.__data[9]=L.elements[7],E.__data[10]=L.elements[8],E.__data[11]=0):(L.toArray(E.__data,P),P+=H.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,U,E.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(v,M,_,w){const b=v.value,A=M+"_"+_;if(w[A]===void 0)return typeof b=="number"||typeof b=="boolean"?w[A]=b:w[A]=b.clone(),!0;{const R=w[A];if(typeof b=="number"||typeof b=="boolean"){if(R!==b)return w[A]=b,!0}else if(R.equals(b)===!1)return R.copy(b),!0}return!1}function g(v){const M=v.uniforms;let _=0;const w=16;for(let A=0,R=M.length;A<R;A++){const S=Array.isArray(M[A])?M[A]:[M[A]];for(let y=0,E=S.length;y<E;y++){const U=S[y],N=Array.isArray(U.value)?U.value:[U.value];for(let P=0,k=N.length;P<k;P++){const L=N[P],H=x(L),z=_%w,O=z%H.boundary,Y=z+O;_+=O,Y!==0&&w-Y<H.storage&&(_+=w-Y),U.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=_,_+=H.storage}}}const b=_%w;return b>0&&(_+=w-b),v.__size=_,v.__cache={},this}function x(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function p(v){const M=v.target;M.removeEventListener("dispose",p);const _=r.indexOf(M.__bindingPointIndex);r.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete o[M.id]}function m(){for(const v in s)i.deleteBuffer(s[v]);r=[],s={},o={}}return{bind:c,update:l,dispose:m}}class Bv{constructor(t={}){const{canvas:e=R0(),context:n=null,depth:s=!0,stencil:o=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=n.getContextAttributes().alpha}else h=r;const g=new Uint32Array(4),x=new Int32Array(4);let p=null,m=null;const v=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=We,this.toneMapping=wi,this.toneMappingExposure=1;const _=this;let w=!1,b=0,A=0,R=null,S=-1,y=null;const E=new oe,U=new oe;let N=null;const P=new Rt(0);let k=0,L=e.width,H=e.height,z=1,O=null,Y=null;const Z=new oe(0,0,L,H),nt=new oe(0,0,L,H);let mt=!1;const V=new ba;let j=!1,ct=!1;const ot=new vt,Tt=new vt,gt=new C,J=new oe,lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let G=!1;function tt(){return R===null?z:1}let F=n;function St(D,X){return e.getContext(D,X)}try{const D={alpha:!0,depth:s,stencil:o,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Sl}`),e.addEventListener("webglcontextlost",ht,!1),e.addEventListener("webglcontextrestored",Dt,!1),e.addEventListener("webglcontextcreationerror",Pt,!1),F===null){const X="webgl2";if(F=St(X,D),F===null)throw St(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let dt,Et,_t,zt,ut,I,T,$,st,ft,K,wt,yt,At,$t,xt,It,Ht,Vt,Ut,se,Jt,ge,W;function Ct(){dt=new Xg(F),dt.init(),Jt=new Pv(F,dt),Et=new zg(F,dt,t,Jt),_t=new Av(F,dt),Et.reverseDepthBuffer&&d&&_t.buffers.depth.setReversed(!0),zt=new Zg(F),ut=new fv,I=new Rv(F,dt,_t,ut,Et,Jt,zt),T=new Hg(_),$=new Wg(_),st=new ep(F),ge=new Og(F,st),ft=new qg(F,st,zt,ge),K=new jg(F,ft,st,zt),Vt=new $g(F,Et,I),xt=new Bg(ut),wt=new hv(_,T,$,dt,Et,ge,xt),yt=new kv(_,ut),At=new pv,$t=new Mv(dt),Ht=new Fg(_,T,$,_t,K,h,c),It=new Ev(_,K,Et),W=new zv(F,zt,Et,_t),Ut=new kg(F,dt,zt),se=new Yg(F,dt,zt),zt.programs=wt.programs,_.capabilities=Et,_.extensions=dt,_.properties=ut,_.renderLists=At,_.shadowMap=It,_.state=_t,_.info=zt}Ct();const it=new Fv(_,F);this.xr=it,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const D=dt.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=dt.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(D){D!==void 0&&(z=D,this.setSize(L,H,!1))},this.getSize=function(D){return D.set(L,H)},this.setSize=function(D,X,Q=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}L=D,H=X,e.width=Math.floor(D*z),e.height=Math.floor(X*z),Q===!0&&(e.style.width=D+"px",e.style.height=X+"px"),this.setViewport(0,0,D,X)},this.getDrawingBufferSize=function(D){return D.set(L*z,H*z).floor()},this.setDrawingBufferSize=function(D,X,Q){L=D,H=X,z=Q,e.width=Math.floor(D*Q),e.height=Math.floor(X*Q),this.setViewport(0,0,D,X)},this.getCurrentViewport=function(D){return D.copy(E)},this.getViewport=function(D){return D.copy(Z)},this.setViewport=function(D,X,Q,et){D.isVector4?Z.set(D.x,D.y,D.z,D.w):Z.set(D,X,Q,et),_t.viewport(E.copy(Z).multiplyScalar(z).round())},this.getScissor=function(D){return D.copy(nt)},this.setScissor=function(D,X,Q,et){D.isVector4?nt.set(D.x,D.y,D.z,D.w):nt.set(D,X,Q,et),_t.scissor(U.copy(nt).multiplyScalar(z).round())},this.getScissorTest=function(){return mt},this.setScissorTest=function(D){_t.setScissorTest(mt=D)},this.setOpaqueSort=function(D){O=D},this.setTransparentSort=function(D){Y=D},this.getClearColor=function(D){return D.copy(Ht.getClearColor())},this.setClearColor=function(){Ht.setClearColor.apply(Ht,arguments)},this.getClearAlpha=function(){return Ht.getClearAlpha()},this.setClearAlpha=function(){Ht.setClearAlpha.apply(Ht,arguments)},this.clear=function(D=!0,X=!0,Q=!0){let et=0;if(D){let q=!1;if(R!==null){const Mt=R.texture.format;q=Mt===Pl||Mt===Rl||Mt===Cl}if(q){const Mt=R.texture.type,Lt=Mt===ei||Mt===ps||Mt===Xo||Mt===Js||Mt===El||Mt===Tl,Nt=Ht.getClearColor(),Ft=Ht.getClearAlpha(),Xt=Nt.r,Kt=Nt.g,Ot=Nt.b;Lt?(g[0]=Xt,g[1]=Kt,g[2]=Ot,g[3]=Ft,F.clearBufferuiv(F.COLOR,0,g)):(x[0]=Xt,x[1]=Kt,x[2]=Ot,x[3]=Ft,F.clearBufferiv(F.COLOR,0,x))}else et|=F.COLOR_BUFFER_BIT}X&&(et|=F.DEPTH_BUFFER_BIT),Q&&(et|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ht,!1),e.removeEventListener("webglcontextrestored",Dt,!1),e.removeEventListener("webglcontextcreationerror",Pt,!1),At.dispose(),$t.dispose(),ut.dispose(),T.dispose(),$.dispose(),K.dispose(),ge.dispose(),W.dispose(),wt.dispose(),it.dispose(),it.removeEventListener("sessionstart",uu),it.removeEventListener("sessionend",hu),Ji.stop()};function ht(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Dt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const D=zt.autoReset,X=It.enabled,Q=It.autoUpdate,et=It.needsUpdate,q=It.type;Ct(),zt.autoReset=D,It.enabled=X,It.autoUpdate=Q,It.needsUpdate=et,It.type=q}function Pt(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function jt(D){const X=D.target;X.removeEventListener("dispose",jt),be(X)}function be(D){qe(D),ut.remove(D)}function qe(D){const X=ut.get(D).programs;X!==void 0&&(X.forEach(function(Q){wt.releaseProgram(Q)}),D.isShaderMaterial&&wt.releaseShaderCache(D))}this.renderBufferDirect=function(D,X,Q,et,q,Mt){X===null&&(X=lt);const Lt=q.isMesh&&q.matrixWorld.determinant()<0,Nt=wd(D,X,Q,et,q);_t.setMaterial(et,Lt);let Ft=Q.index,Xt=1;if(et.wireframe===!0){if(Ft=ft.getWireframeAttribute(Q),Ft===void 0)return;Xt=2}const Kt=Q.drawRange,Ot=Q.attributes.position;let ae=Kt.start*Xt,xe=(Kt.start+Kt.count)*Xt;Mt!==null&&(ae=Math.max(ae,Mt.start*Xt),xe=Math.min(xe,(Mt.start+Mt.count)*Xt)),Ft!==null?(ae=Math.max(ae,0),xe=Math.min(xe,Ft.count)):Ot!=null&&(ae=Math.max(ae,0),xe=Math.min(xe,Ot.count));const _e=xe-ae;if(_e<0||_e===1/0)return;ge.setup(q,et,Nt,Q,Ft);let rn,ue=Ut;if(Ft!==null&&(rn=st.get(Ft),ue=se,ue.setIndex(rn)),q.isMesh)et.wireframe===!0?(_t.setLineWidth(et.wireframeLinewidth*tt()),ue.setMode(F.LINES)):ue.setMode(F.TRIANGLES);else if(q.isLine){let kt=et.linewidth;kt===void 0&&(kt=1),_t.setLineWidth(kt*tt()),q.isLineSegments?ue.setMode(F.LINES):q.isLineLoop?ue.setMode(F.LINE_LOOP):ue.setMode(F.LINE_STRIP)}else q.isPoints?ue.setMode(F.POINTS):q.isSprite&&ue.setMode(F.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)ue.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(dt.get("WEBGL_multi_draw"))ue.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const kt=q._multiDrawStarts,oi=q._multiDrawCounts,he=q._multiDrawCount,Nn=Ft?st.get(Ft).bytesPerElement:1,ys=ut.get(et).currentProgram.getUniforms();for(let pn=0;pn<he;pn++)ys.setValue(F,"_gl_DrawID",pn),ue.render(kt[pn]/Nn,oi[pn])}else if(q.isInstancedMesh)ue.renderInstances(ae,_e,q.count);else if(Q.isInstancedBufferGeometry){const kt=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,oi=Math.min(Q.instanceCount,kt);ue.renderInstances(ae,_e,oi)}else ue.render(ae,_e)};function fe(D,X,Q){D.transparent===!0&&D.side===ve&&D.forceSinglePass===!1?(D.side=sn,D.needsUpdate=!0,ur(D,X,Q),D.side=fn,D.needsUpdate=!0,ur(D,X,Q),D.side=ve):ur(D,X,Q)}this.compile=function(D,X,Q=null){Q===null&&(Q=D),m=$t.get(Q),m.init(X),M.push(m),Q.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(m.pushLight(q),q.castShadow&&m.pushShadow(q))}),D!==Q&&D.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(m.pushLight(q),q.castShadow&&m.pushShadow(q))}),m.setupLights();const et=new Set;return D.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const Mt=q.material;if(Mt)if(Array.isArray(Mt))for(let Lt=0;Lt<Mt.length;Lt++){const Nt=Mt[Lt];fe(Nt,Q,q),et.add(Nt)}else fe(Mt,Q,q),et.add(Mt)}),M.pop(),m=null,et},this.compileAsync=function(D,X,Q=null){const et=this.compile(D,X,Q);return new Promise(q=>{function Mt(){if(et.forEach(function(Lt){ut.get(Lt).currentProgram.isReady()&&et.delete(Lt)}),et.size===0){q(D);return}setTimeout(Mt,10)}dt.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let Un=null;function si(D){Un&&Un(D)}function uu(){Ji.stop()}function hu(){Ji.start()}const Ji=new Uf;Ji.setAnimationLoop(si),typeof self!="undefined"&&Ji.setContext(self),this.setAnimationLoop=function(D){Un=D,it.setAnimationLoop(D),D===null?Ji.stop():Ji.start()},it.addEventListener("sessionstart",uu),it.addEventListener("sessionend",hu),this.render=function(D,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(X),X=it.getCamera()),D.isScene===!0&&D.onBeforeRender(_,D,X,R),m=$t.get(D,M.length),m.init(X),M.push(m),Tt.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),V.setFromProjectionMatrix(Tt),ct=this.localClippingEnabled,j=xt.init(this.clippingPlanes,ct),p=At.get(D,v.length),p.init(),v.push(p),it.enabled===!0&&it.isPresenting===!0){const Mt=_.xr.getDepthSensingMesh();Mt!==null&&Fa(Mt,X,-1/0,_.sortObjects)}Fa(D,X,0,_.sortObjects),p.finish(),_.sortObjects===!0&&p.sort(O,Y),G=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,G&&Ht.addToRenderList(p,D),this.info.render.frame++,j===!0&&xt.beginShadows();const Q=m.state.shadowsArray;It.render(Q,D,X),j===!0&&xt.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=p.opaque,q=p.transmissive;if(m.setupLights(),X.isArrayCamera){const Mt=X.cameras;if(q.length>0)for(let Lt=0,Nt=Mt.length;Lt<Nt;Lt++){const Ft=Mt[Lt];du(et,q,D,Ft)}G&&Ht.render(D);for(let Lt=0,Nt=Mt.length;Lt<Nt;Lt++){const Ft=Mt[Lt];fu(p,D,Ft,Ft.viewport)}}else q.length>0&&du(et,q,D,X),G&&Ht.render(D),fu(p,D,X);R!==null&&(I.updateMultisampleRenderTarget(R),I.updateRenderTargetMipmap(R)),D.isScene===!0&&D.onAfterRender(_,D,X),ge.resetDefaultState(),S=-1,y=null,M.pop(),M.length>0?(m=M[M.length-1],j===!0&&xt.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,v.pop(),v.length>0?p=v[v.length-1]:p=null};function Fa(D,X,Q,et){if(D.visible===!1)return;if(D.layers.test(X.layers)){if(D.isGroup)Q=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(X);else if(D.isLight)m.pushLight(D),D.castShadow&&m.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||V.intersectsSprite(D)){et&&J.setFromMatrixPosition(D.matrixWorld).applyMatrix4(Tt);const Lt=K.update(D),Nt=D.material;Nt.visible&&p.push(D,Lt,Nt,Q,J.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||V.intersectsObject(D))){const Lt=K.update(D),Nt=D.material;if(et&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),J.copy(D.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),J.copy(Lt.boundingSphere.center)),J.applyMatrix4(D.matrixWorld).applyMatrix4(Tt)),Array.isArray(Nt)){const Ft=Lt.groups;for(let Xt=0,Kt=Ft.length;Xt<Kt;Xt++){const Ot=Ft[Xt],ae=Nt[Ot.materialIndex];ae&&ae.visible&&p.push(D,Lt,ae,Q,J.z,Ot)}}else Nt.visible&&p.push(D,Lt,Nt,Q,J.z,null)}}const Mt=D.children;for(let Lt=0,Nt=Mt.length;Lt<Nt;Lt++)Fa(Mt[Lt],X,Q,et)}function fu(D,X,Q,et){const q=D.opaque,Mt=D.transmissive,Lt=D.transparent;m.setupLightsView(Q),j===!0&&xt.setGlobalState(_.clippingPlanes,Q),et&&_t.viewport(E.copy(et)),q.length>0&&lr(q,X,Q),Mt.length>0&&lr(Mt,X,Q),Lt.length>0&&lr(Lt,X,Q),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function du(D,X,Q,et){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[et.id]===void 0&&(m.state.transmissionRenderTarget[et.id]=new Xn(1,1,{generateMipmaps:!0,type:dt.has("EXT_color_buffer_half_float")||dt.has("EXT_color_buffer_float")?gs:ei,minFilter:Mi,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace}));const Mt=m.state.transmissionRenderTarget[et.id],Lt=et.viewport||E;Mt.setSize(Lt.z,Lt.w);const Nt=_.getRenderTarget();_.setRenderTarget(Mt),_.getClearColor(P),k=_.getClearAlpha(),k<1&&_.setClearColor(16777215,.5),_.clear(),G&&Ht.render(Q);const Ft=_.toneMapping;_.toneMapping=wi;const Xt=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),m.setupLightsView(et),j===!0&&xt.setGlobalState(_.clippingPlanes,et),lr(D,Q,et),I.updateMultisampleRenderTarget(Mt),I.updateRenderTargetMipmap(Mt),dt.has("WEBGL_multisampled_render_to_texture")===!1){let Kt=!1;for(let Ot=0,ae=X.length;Ot<ae;Ot++){const xe=X[Ot],_e=xe.object,rn=xe.geometry,ue=xe.material,kt=xe.group;if(ue.side===ve&&_e.layers.test(et.layers)){const oi=ue.side;ue.side=sn,ue.needsUpdate=!0,pu(_e,Q,et,rn,ue,kt),ue.side=oi,ue.needsUpdate=!0,Kt=!0}}Kt===!0&&(I.updateMultisampleRenderTarget(Mt),I.updateRenderTargetMipmap(Mt))}_.setRenderTarget(Nt),_.setClearColor(P,k),Xt!==void 0&&(et.viewport=Xt),_.toneMapping=Ft}function lr(D,X,Q){const et=X.isScene===!0?X.overrideMaterial:null;for(let q=0,Mt=D.length;q<Mt;q++){const Lt=D[q],Nt=Lt.object,Ft=Lt.geometry,Xt=et===null?Lt.material:et,Kt=Lt.group;Nt.layers.test(Q.layers)&&pu(Nt,X,Q,Ft,Xt,Kt)}}function pu(D,X,Q,et,q,Mt){D.onBeforeRender(_,X,Q,et,q,Mt),D.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),q.onBeforeRender(_,X,Q,et,D,Mt),q.transparent===!0&&q.side===ve&&q.forceSinglePass===!1?(q.side=sn,q.needsUpdate=!0,_.renderBufferDirect(Q,X,et,q,D,Mt),q.side=fn,q.needsUpdate=!0,_.renderBufferDirect(Q,X,et,q,D,Mt),q.side=ve):_.renderBufferDirect(Q,X,et,q,D,Mt),D.onAfterRender(_,X,Q,et,q,Mt)}function ur(D,X,Q){X.isScene!==!0&&(X=lt);const et=ut.get(D),q=m.state.lights,Mt=m.state.shadowsArray,Lt=q.state.version,Nt=wt.getParameters(D,q.state,Mt,X,Q),Ft=wt.getProgramCacheKey(Nt);let Xt=et.programs;et.environment=D.isMeshStandardMaterial?X.environment:null,et.fog=X.fog,et.envMap=(D.isMeshStandardMaterial?$:T).get(D.envMap||et.environment),et.envMapRotation=et.environment!==null&&D.envMap===null?X.environmentRotation:D.envMapRotation,Xt===void 0&&(D.addEventListener("dispose",jt),Xt=new Map,et.programs=Xt);let Kt=Xt.get(Ft);if(Kt!==void 0){if(et.currentProgram===Kt&&et.lightsStateVersion===Lt)return gu(D,Nt),Kt}else Nt.uniforms=wt.getUniforms(D),D.onBeforeCompile(Nt,_),Kt=wt.acquireProgram(Nt,Ft),Xt.set(Ft,Kt),et.uniforms=Nt.uniforms;const Ot=et.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(Ot.clippingPlanes=xt.uniform),gu(D,Nt),et.needsLights=Td(D),et.lightsStateVersion=Lt,et.needsLights&&(Ot.ambientLightColor.value=q.state.ambient,Ot.lightProbe.value=q.state.probe,Ot.directionalLights.value=q.state.directional,Ot.directionalLightShadows.value=q.state.directionalShadow,Ot.spotLights.value=q.state.spot,Ot.spotLightShadows.value=q.state.spotShadow,Ot.rectAreaLights.value=q.state.rectArea,Ot.ltc_1.value=q.state.rectAreaLTC1,Ot.ltc_2.value=q.state.rectAreaLTC2,Ot.pointLights.value=q.state.point,Ot.pointLightShadows.value=q.state.pointShadow,Ot.hemisphereLights.value=q.state.hemi,Ot.directionalShadowMap.value=q.state.directionalShadowMap,Ot.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ot.spotShadowMap.value=q.state.spotShadowMap,Ot.spotLightMatrix.value=q.state.spotLightMatrix,Ot.spotLightMap.value=q.state.spotLightMap,Ot.pointShadowMap.value=q.state.pointShadowMap,Ot.pointShadowMatrix.value=q.state.pointShadowMatrix),et.currentProgram=Kt,et.uniformsList=null,Kt}function mu(D){if(D.uniformsList===null){const X=D.currentProgram.getUniforms();D.uniformsList=Qr.seqWithValue(X.seq,D.uniforms)}return D.uniformsList}function gu(D,X){const Q=ut.get(D);Q.outputColorSpace=X.outputColorSpace,Q.batching=X.batching,Q.batchingColor=X.batchingColor,Q.instancing=X.instancing,Q.instancingColor=X.instancingColor,Q.instancingMorph=X.instancingMorph,Q.skinning=X.skinning,Q.morphTargets=X.morphTargets,Q.morphNormals=X.morphNormals,Q.morphColors=X.morphColors,Q.morphTargetsCount=X.morphTargetsCount,Q.numClippingPlanes=X.numClippingPlanes,Q.numIntersection=X.numClipIntersection,Q.vertexAlphas=X.vertexAlphas,Q.vertexTangents=X.vertexTangents,Q.toneMapping=X.toneMapping}function wd(D,X,Q,et,q){X.isScene!==!0&&(X=lt),I.resetTextureUnits();const Mt=X.fog,Lt=et.isMeshStandardMaterial?X.environment:null,Nt=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:ao,Ft=(et.isMeshStandardMaterial?$:T).get(et.envMap||Lt),Xt=et.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,Kt=!!Q.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),Ot=!!Q.morphAttributes.position,ae=!!Q.morphAttributes.normal,xe=!!Q.morphAttributes.color;let _e=wi;et.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(_e=_.toneMapping);const rn=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,ue=rn!==void 0?rn.length:0,kt=ut.get(et),oi=m.state.lights;if(j===!0&&(ct===!0||D!==y)){const En=D===y&&et.id===S;xt.setState(et,D,En)}let he=!1;et.version===kt.__version?(kt.needsLights&&kt.lightsStateVersion!==oi.state.version||kt.outputColorSpace!==Nt||q.isBatchedMesh&&kt.batching===!1||!q.isBatchedMesh&&kt.batching===!0||q.isBatchedMesh&&kt.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&kt.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&kt.instancing===!1||!q.isInstancedMesh&&kt.instancing===!0||q.isSkinnedMesh&&kt.skinning===!1||!q.isSkinnedMesh&&kt.skinning===!0||q.isInstancedMesh&&kt.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&kt.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&kt.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&kt.instancingMorph===!1&&q.morphTexture!==null||kt.envMap!==Ft||et.fog===!0&&kt.fog!==Mt||kt.numClippingPlanes!==void 0&&(kt.numClippingPlanes!==xt.numPlanes||kt.numIntersection!==xt.numIntersection)||kt.vertexAlphas!==Xt||kt.vertexTangents!==Kt||kt.morphTargets!==Ot||kt.morphNormals!==ae||kt.morphColors!==xe||kt.toneMapping!==_e||kt.morphTargetsCount!==ue)&&(he=!0):(he=!0,kt.__version=et.version);let Nn=kt.currentProgram;he===!0&&(Nn=ur(et,X,q));let ys=!1,pn=!1,mo=!1;const Me=Nn.getUniforms(),Yn=kt.uniforms;if(_t.useProgram(Nn.program)&&(ys=!0,pn=!0,mo=!0),et.id!==S&&(S=et.id,pn=!0),ys||y!==D){_t.buffers.depth.getReversed()?(ot.copy(D.projectionMatrix),L0(ot),D0(ot),Me.setValue(F,"projectionMatrix",ot)):Me.setValue(F,"projectionMatrix",D.projectionMatrix),Me.setValue(F,"viewMatrix",D.matrixWorldInverse);const Pi=Me.map.cameraPosition;Pi!==void 0&&Pi.setValue(F,gt.setFromMatrixPosition(D.matrixWorld)),Et.logarithmicDepthBuffer&&Me.setValue(F,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&Me.setValue(F,"isOrthographic",D.isOrthographicCamera===!0),y!==D&&(y=D,pn=!0,mo=!0)}if(q.isSkinnedMesh){Me.setOptional(F,q,"bindMatrix"),Me.setOptional(F,q,"bindMatrixInverse");const En=q.skeleton;En&&(En.boneTexture===null&&En.computeBoneTexture(),Me.setValue(F,"boneTexture",En.boneTexture,I))}q.isBatchedMesh&&(Me.setOptional(F,q,"batchingTexture"),Me.setValue(F,"batchingTexture",q._matricesTexture,I),Me.setOptional(F,q,"batchingIdTexture"),Me.setValue(F,"batchingIdTexture",q._indirectTexture,I),Me.setOptional(F,q,"batchingColorTexture"),q._colorsTexture!==null&&Me.setValue(F,"batchingColorTexture",q._colorsTexture,I));const go=Q.morphAttributes;if((go.position!==void 0||go.normal!==void 0||go.color!==void 0)&&Vt.update(q,Q,Nn),(pn||kt.receiveShadow!==q.receiveShadow)&&(kt.receiveShadow=q.receiveShadow,Me.setValue(F,"receiveShadow",q.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(Yn.envMap.value=Ft,Yn.flipEnvMap.value=Ft.isCubeTexture&&Ft.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&X.environment!==null&&(Yn.envMapIntensity.value=X.environmentIntensity),pn&&(Me.setValue(F,"toneMappingExposure",_.toneMappingExposure),kt.needsLights&&Ed(Yn,mo),Mt&&et.fog===!0&&yt.refreshFogUniforms(Yn,Mt),yt.refreshMaterialUniforms(Yn,et,z,H,m.state.transmissionRenderTarget[D.id]),Qr.upload(F,mu(kt),Yn,I)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(Qr.upload(F,mu(kt),Yn,I),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&Me.setValue(F,"center",q.center),Me.setValue(F,"modelViewMatrix",q.modelViewMatrix),Me.setValue(F,"normalMatrix",q.normalMatrix),Me.setValue(F,"modelMatrix",q.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const En=et.uniformsGroups;for(let Pi=0,Li=En.length;Pi<Li;Pi++){const xu=En[Pi];W.update(xu,Nn),W.bind(xu,Nn)}}return Nn}function Ed(D,X){D.ambientLightColor.needsUpdate=X,D.lightProbe.needsUpdate=X,D.directionalLights.needsUpdate=X,D.directionalLightShadows.needsUpdate=X,D.pointLights.needsUpdate=X,D.pointLightShadows.needsUpdate=X,D.spotLights.needsUpdate=X,D.spotLightShadows.needsUpdate=X,D.rectAreaLights.needsUpdate=X,D.hemisphereLights.needsUpdate=X}function Td(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(D,X,Q){ut.get(D.texture).__webglTexture=X,ut.get(D.depthTexture).__webglTexture=Q;const et=ut.get(D);et.__hasExternalTextures=!0,et.__autoAllocateDepthBuffer=Q===void 0,et.__autoAllocateDepthBuffer||dt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),et.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(D,X){const Q=ut.get(D);Q.__webglFramebuffer=X,Q.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(D,X=0,Q=0){R=D,b=X,A=Q;let et=!0,q=null,Mt=!1,Lt=!1;if(D){const Ft=ut.get(D);if(Ft.__useDefaultFramebuffer!==void 0)_t.bindFramebuffer(F.FRAMEBUFFER,null),et=!1;else if(Ft.__webglFramebuffer===void 0)I.setupRenderTarget(D);else if(Ft.__hasExternalTextures)I.rebindTextures(D,ut.get(D.texture).__webglTexture,ut.get(D.depthTexture).__webglTexture);else if(D.depthBuffer){const Ot=D.depthTexture;if(Ft.__boundDepthTexture!==Ot){if(Ot!==null&&ut.has(Ot)&&(D.width!==Ot.image.width||D.height!==Ot.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(D)}}const Xt=D.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Lt=!0);const Kt=ut.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(Kt[X])?q=Kt[X][Q]:q=Kt[X],Mt=!0):D.samples>0&&I.useMultisampledRTT(D)===!1?q=ut.get(D).__webglMultisampledFramebuffer:Array.isArray(Kt)?q=Kt[Q]:q=Kt,E.copy(D.viewport),U.copy(D.scissor),N=D.scissorTest}else E.copy(Z).multiplyScalar(z).floor(),U.copy(nt).multiplyScalar(z).floor(),N=mt;if(_t.bindFramebuffer(F.FRAMEBUFFER,q)&&et&&_t.drawBuffers(D,q),_t.viewport(E),_t.scissor(U),_t.setScissorTest(N),Mt){const Ft=ut.get(D.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+X,Ft.__webglTexture,Q)}else if(Lt){const Ft=ut.get(D.texture),Xt=X||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ft.__webglTexture,Q||0,Xt)}S=-1},this.readRenderTargetPixels=function(D,X,Q,et,q,Mt,Lt){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Nt=ut.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Lt!==void 0&&(Nt=Nt[Lt]),Nt){_t.bindFramebuffer(F.FRAMEBUFFER,Nt);try{const Ft=D.texture,Xt=Ft.format,Kt=Ft.type;if(!Et.textureFormatReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Et.textureTypeReadable(Kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=D.width-et&&Q>=0&&Q<=D.height-q&&F.readPixels(X,Q,et,q,Jt.convert(Xt),Jt.convert(Kt),Mt)}finally{const Ft=R!==null?ut.get(R).__webglFramebuffer:null;_t.bindFramebuffer(F.FRAMEBUFFER,Ft)}}},this.readRenderTargetPixelsAsync=async function(D,X,Q,et,q,Mt,Lt){if(!(D&&D.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Nt=ut.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Lt!==void 0&&(Nt=Nt[Lt]),Nt){const Ft=D.texture,Xt=Ft.format,Kt=Ft.type;if(!Et.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Et.textureTypeReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=D.width-et&&Q>=0&&Q<=D.height-q){_t.bindFramebuffer(F.FRAMEBUFFER,Nt);const Ot=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Ot),F.bufferData(F.PIXEL_PACK_BUFFER,Mt.byteLength,F.STREAM_READ),F.readPixels(X,Q,et,q,Jt.convert(Xt),Jt.convert(Kt),0);const ae=R!==null?ut.get(R).__webglFramebuffer:null;_t.bindFramebuffer(F.FRAMEBUFFER,ae);const xe=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await P0(F,xe,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Ot),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Mt),F.deleteBuffer(Ot),F.deleteSync(xe),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(D,X=null,Q=0){D.isTexture!==!0&&(Uo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,D=arguments[1]);const et=Math.pow(2,-Q),q=Math.floor(D.image.width*et),Mt=Math.floor(D.image.height*et),Lt=X!==null?X.x:0,Nt=X!==null?X.y:0;I.setTexture2D(D,0),F.copyTexSubImage2D(F.TEXTURE_2D,Q,0,0,Lt,Nt,q,Mt),_t.unbindTexture()},this.copyTextureToTexture=function(D,X,Q=null,et=null,q=0){D.isTexture!==!0&&(Uo("WebGLRenderer: copyTextureToTexture function signature has changed."),et=arguments[0]||null,D=arguments[1],X=arguments[2],q=arguments[3]||0,Q=null);let Mt,Lt,Nt,Ft,Xt,Kt,Ot,ae,xe;const _e=D.isCompressedTexture?D.mipmaps[q]:D.image;Q!==null?(Mt=Q.max.x-Q.min.x,Lt=Q.max.y-Q.min.y,Nt=Q.isBox3?Q.max.z-Q.min.z:1,Ft=Q.min.x,Xt=Q.min.y,Kt=Q.isBox3?Q.min.z:0):(Mt=_e.width,Lt=_e.height,Nt=_e.depth||1,Ft=0,Xt=0,Kt=0),et!==null?(Ot=et.x,ae=et.y,xe=et.z):(Ot=0,ae=0,xe=0);const rn=Jt.convert(X.format),ue=Jt.convert(X.type);let kt;X.isData3DTexture?(I.setTexture3D(X,0),kt=F.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(I.setTexture2DArray(X,0),kt=F.TEXTURE_2D_ARRAY):(I.setTexture2D(X,0),kt=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,X.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,X.unpackAlignment);const oi=F.getParameter(F.UNPACK_ROW_LENGTH),he=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Nn=F.getParameter(F.UNPACK_SKIP_PIXELS),ys=F.getParameter(F.UNPACK_SKIP_ROWS),pn=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,_e.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,_e.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ft),F.pixelStorei(F.UNPACK_SKIP_ROWS,Xt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Kt);const mo=D.isDataArrayTexture||D.isData3DTexture,Me=X.isDataArrayTexture||X.isData3DTexture;if(D.isRenderTargetTexture||D.isDepthTexture){const Yn=ut.get(D),go=ut.get(X),En=ut.get(Yn.__renderTarget),Pi=ut.get(go.__renderTarget);_t.bindFramebuffer(F.READ_FRAMEBUFFER,En.__webglFramebuffer),_t.bindFramebuffer(F.DRAW_FRAMEBUFFER,Pi.__webglFramebuffer);for(let Li=0;Li<Nt;Li++)mo&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ut.get(D).__webglTexture,q,Kt+Li),D.isDepthTexture?(Me&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ut.get(X).__webglTexture,q,xe+Li),F.blitFramebuffer(Ft,Xt,Mt,Lt,Ot,ae,Mt,Lt,F.DEPTH_BUFFER_BIT,F.NEAREST)):Me?F.copyTexSubImage3D(kt,q,Ot,ae,xe+Li,Ft,Xt,Mt,Lt):F.copyTexSubImage2D(kt,q,Ot,ae,xe+Li,Ft,Xt,Mt,Lt);_t.bindFramebuffer(F.READ_FRAMEBUFFER,null),_t.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Me?D.isDataTexture||D.isData3DTexture?F.texSubImage3D(kt,q,Ot,ae,xe,Mt,Lt,Nt,rn,ue,_e.data):X.isCompressedArrayTexture?F.compressedTexSubImage3D(kt,q,Ot,ae,xe,Mt,Lt,Nt,rn,_e.data):F.texSubImage3D(kt,q,Ot,ae,xe,Mt,Lt,Nt,rn,ue,_e):D.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,q,Ot,ae,Mt,Lt,rn,ue,_e.data):D.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,q,Ot,ae,_e.width,_e.height,rn,_e.data):F.texSubImage2D(F.TEXTURE_2D,q,Ot,ae,Mt,Lt,rn,ue,_e);F.pixelStorei(F.UNPACK_ROW_LENGTH,oi),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,he),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Nn),F.pixelStorei(F.UNPACK_SKIP_ROWS,ys),F.pixelStorei(F.UNPACK_SKIP_IMAGES,pn),q===0&&X.generateMipmaps&&F.generateMipmap(kt),_t.unbindTexture()},this.copyTextureToTexture3D=function(D,X,Q=null,et=null,q=0){return D.isTexture!==!0&&(Uo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Q=arguments[0]||null,et=arguments[1]||null,D=arguments[2],X=arguments[3],q=arguments[4]||0),Uo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(D,X,Q,et,q)},this.initRenderTarget=function(D){ut.get(D).__webglFramebuffer===void 0&&I.setupRenderTarget(D)},this.initTexture=function(D){D.isCubeTexture?I.setTextureCube(D,0):D.isData3DTexture?I.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?I.setTexture2DArray(D,0):I.setTexture2D(D,0),_t.unbindTexture()},this.resetState=function(){b=0,A=0,R=null,_t.reset(),ge.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}class Nl{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Rt(t),this.density=e}clone(){return new Nl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Bf extends ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new dn,this.environmentIntensity=1,this.environmentRotation=new dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Hf extends je{constructor(t=null,e=1,n=1,s,o,r,a,c,l=yn,u=yn,f,d){super(null,r,a,c,l,u,s,o,f,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qn extends le{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Fs=new vt,gh=new vt,Dr=[],xh=new _s,Hv=new vt,yo=new Wt,So=new co;class $e extends Wt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new qn(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Hv)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new _s),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Fs),xh.copy(t.boundingBox).applyMatrix4(Fs),this.boundingBox.union(xh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new co),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Fs),So.copy(t.boundingSphere).applyMatrix4(Fs),this.boundingSphere.union(So)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,o=n.length+1,r=t*o+1;for(let a=0;a<n.length;a++)n[a]=s[r+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(yo.geometry=this.geometry,yo.material=this.material,yo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),So.copy(this.boundingSphere),So.applyMatrix4(n),t.ray.intersectsSphere(So)!==!1))for(let o=0;o<s;o++){this.getMatrixAt(o,Fs),gh.multiplyMatrices(n,Fs),yo.matrixWorld=gh,yo.raycast(t,Dr);for(let r=0,a=Dr.length;r<a;r++){const c=Dr[r];c.instanceId=o,c.object=this,e.push(c)}Dr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new qn(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Hf(new Float32Array(s*this.count),s,this.count,Al,Qn));const o=this.morphTexture.source.data.data;let r=0;for(let l=0;l<n.length;l++)r+=n[l];const a=this.geometry.morphTargetsRelative?1:1-r,c=s*t;o[c]=a,o.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Fl extends Ms{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const oa=new C,ra=new C,vh=new vt,bo=new Sa,Ir=new co,hc=new C,_h=new C;class Gf extends ze{constructor(t=new Gt,e=new Fl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,o=e.count;s<o;s++)oa.fromBufferAttribute(e,s-1),ra.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=oa.distanceTo(ra);t.setAttribute("lineDistance",new at(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ir.copy(n.boundingSphere),Ir.applyMatrix4(s),Ir.radius+=o,t.ray.intersectsSphere(Ir)===!1)return;vh.copy(s).invert(),bo.copy(t.ray).applyMatrix4(vh);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const h=Math.max(0,r.start),g=Math.min(u.count,r.start+r.count);for(let x=h,p=g-1;x<p;x+=l){const m=u.getX(x),v=u.getX(x+1),M=Ur(this,t,bo,c,m,v);M&&e.push(M)}if(this.isLineLoop){const x=u.getX(g-1),p=u.getX(h),m=Ur(this,t,bo,c,x,p);m&&e.push(m)}}else{const h=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let x=h,p=g-1;x<p;x+=l){const m=Ur(this,t,bo,c,x,x+1);m&&e.push(m)}if(this.isLineLoop){const x=Ur(this,t,bo,c,g-1,h);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function Ur(i,t,e,n,s,o){const r=i.geometry.attributes.position;if(oa.fromBufferAttribute(r,s),ra.fromBufferAttribute(r,o),e.distanceSqToSegment(oa,ra,hc,_h)>n)return;hc.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(hc);if(!(c<t.near||c>t.far))return{distance:c,point:_h.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Mh=new C,yh=new C;class Gv extends Gf{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,o=e.count;s<o;s+=2)Mh.fromBufferAttribute(e,s),yh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Mh.distanceTo(yh);t.setAttribute("lineDistance",new at(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ji extends je{constructor(t,e,n,s,o,r,a,c,l){super(t,e,n,s,o,r,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ii{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),o=0;e.push(0);for(let r=1;r<=t;r++)n=this.getPoint(r/t),o+=n.distanceTo(s),e.push(o),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const o=n.length;let r;e?r=e:r=t*n[o-1];let a=0,c=o-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-r,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===r)return s/(o-1);const u=n[s],d=n[s+1]-u,h=(r-u)/d;return(s+h)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const r=this.getPoint(s),a=this.getPoint(o),c=e||(r.isVector2?new rt:new C);return c.copy(a).sub(r).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],o=[],r=[],a=new C,c=new vt;for(let h=0;h<=t;h++){const g=h/t;s[h]=this.getTangentAt(g,new C)}o[0]=new C,r[0]=new C;let l=Number.MAX_VALUE;const u=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=l&&(l=u,n.set(1,0,0)),f<=l&&(l=f,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),o[0].crossVectors(s[0],a),r[0].crossVectors(s[0],o[0]);for(let h=1;h<=t;h++){if(o[h]=o[h-1].clone(),r[h]=r[h-1].clone(),a.crossVectors(s[h-1],s[h]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Re(s[h-1].dot(s[h]),-1,1));o[h].applyMatrix4(c.makeRotationAxis(a,g))}r[h].crossVectors(s[h],o[h])}if(e===!0){let h=Math.acos(Re(o[0].dot(o[t]),-1,1));h/=t,s[0].dot(a.crossVectors(o[0],o[t]))>0&&(h=-h);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],h*g)),r[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ol extends ii{constructor(t=0,e=0,n=1,s=1,o=0,r=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=r,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new rt){const n=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const r=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(r?o=0:o=s),this.aClockwise===!0&&!r&&(o===s?o=-s:o=o-s);const a=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=c-this.aX,h=l-this.aY;c=d*u-h*f+this.aX,l=d*f+h*u+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Vv extends Ol{constructor(t,e,n,s,o,r){super(t,e,n,n,s,o,r),this.isArcCurve=!0,this.type="ArcCurve"}}function kl(){let i=0,t=0,e=0,n=0;function s(o,r,a,c){i=o,t=a,e=-3*o+3*r-2*a-c,n=2*o-2*r+a+c}return{initCatmullRom:function(o,r,a,c,l){s(r,a,l*(a-o),l*(c-r))},initNonuniformCatmullRom:function(o,r,a,c,l,u,f){let d=(r-o)/l-(a-o)/(l+u)+(a-r)/u,h=(a-r)/u-(c-r)/(u+f)+(c-a)/f;d*=u,h*=u,s(r,a,d,h)},calc:function(o){const r=o*o,a=r*o;return i+t*o+e*r+n*a}}}const Nr=new C,fc=new kl,dc=new kl,pc=new kl;class Sn extends ii{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,o=s.length,r=(o-(this.closed?0:1))*t;let a=Math.floor(r),c=r-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/o)+1)*o:c===0&&a===o-1&&(a=o-2,c=1);let l,u;this.closed||a>0?l=s[(a-1)%o]:(Nr.subVectors(s[0],s[1]).add(s[0]),l=Nr);const f=s[a%o],d=s[(a+1)%o];if(this.closed||a+2<o?u=s[(a+2)%o]:(Nr.subVectors(s[o-1],s[o-2]).add(s[o-1]),u=Nr),this.curveType==="centripetal"||this.curveType==="chordal"){const h=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(f),h),x=Math.pow(f.distanceToSquared(d),h),p=Math.pow(d.distanceToSquared(u),h);x<1e-4&&(x=1),g<1e-4&&(g=x),p<1e-4&&(p=x),fc.initNonuniformCatmullRom(l.x,f.x,d.x,u.x,g,x,p),dc.initNonuniformCatmullRom(l.y,f.y,d.y,u.y,g,x,p),pc.initNonuniformCatmullRom(l.z,f.z,d.z,u.z,g,x,p)}else this.curveType==="catmullrom"&&(fc.initCatmullRom(l.x,f.x,d.x,u.x,this.tension),dc.initCatmullRom(l.y,f.y,d.y,u.y,this.tension),pc.initCatmullRom(l.z,f.z,d.z,u.z,this.tension));return n.set(fc.calc(c),dc.calc(c),pc.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Sh(i,t,e,n,s){const o=(n-t)*.5,r=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+o+r)*c+(-3*e+3*n-2*o-r)*a+o*i+e}function Wv(i,t){const e=1-i;return e*e*t}function Xv(i,t){return 2*(1-i)*i*t}function qv(i,t){return i*i*t}function Ho(i,t,e,n){return Wv(i,t)+Xv(i,e)+qv(i,n)}function Yv(i,t){const e=1-i;return e*e*e*t}function Zv(i,t){const e=1-i;return 3*e*e*i*t}function $v(i,t){return 3*(1-i)*i*i*t}function jv(i,t){return i*i*i*t}function Go(i,t,e,n,s){return Yv(i,t)+Zv(i,e)+$v(i,n)+jv(i,s)}class Vf extends ii{constructor(t=new rt,e=new rt,n=new rt,s=new rt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new rt){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(Go(t,s.x,o.x,r.x,a.x),Go(t,s.y,o.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Kv extends ii{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(Go(t,s.x,o.x,r.x,a.x),Go(t,s.y,o.y,r.y,a.y),Go(t,s.z,o.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Wf extends ii{constructor(t=new rt,e=new rt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new rt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new rt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jv extends ii{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xf extends ii{constructor(t=new rt,e=new rt,n=new rt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new rt){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(Ho(t,s.x,o.x,r.x),Ho(t,s.y,o.y,r.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class qf extends ii{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(Ho(t,s.x,o.x,r.x),Ho(t,s.y,o.y,r.y),Ho(t,s.z,o.z,r.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Yf extends ii{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new rt){const n=e,s=this.points,o=(s.length-1)*t,r=Math.floor(o),a=o-r,c=s[r===0?r:r-1],l=s[r],u=s[r>s.length-2?s.length-1:r+1],f=s[r>s.length-3?s.length-1:r+2];return n.set(Sh(a,c.x,l.x,u.x,f.x),Sh(a,c.y,l.y,u.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new rt().fromArray(s))}return this}}var aa=Object.freeze({__proto__:null,ArcCurve:Vv,CatmullRomCurve3:Sn,CubicBezierCurve:Vf,CubicBezierCurve3:Kv,EllipseCurve:Ol,LineCurve:Wf,LineCurve3:Jv,QuadraticBezierCurve:Xf,QuadraticBezierCurve3:qf,SplineCurve:Yf});class Qv extends ii{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new aa[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=n){const r=s[o]-n,a=this.curves[o],c=a.getLength(),l=c===0?0:1-r/c;return a.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,o=this.curves;s<o.length;s++){const r=o[s],a=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,c=r.getPoints(a);for(let l=0;l<c.length;l++){const u=c[l];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new aa[s.type]().fromJSON(s))}return this}}class Yo extends Qv{constructor(t){super(),this.type="Path",this.currentPoint=new rt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Wf(this.currentPoint.clone(),new rt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const o=new Xf(this.currentPoint.clone(),new rt(t,e),new rt(n,s));return this.curves.push(o),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,o,r){const a=new Vf(this.currentPoint.clone(),new rt(t,e),new rt(n,s),new rt(o,r));return this.curves.push(a),this.currentPoint.set(o,r),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Yf(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,o,r){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,o,r),this}absarc(t,e,n,s,o,r){return this.absellipse(t,e,n,n,s,o,r),this}ellipse(t,e,n,s,o,r,a,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+l,e+u,n,s,o,r,a,c),this}absellipse(t,e,n,s,o,r,a,c){const l=new Ol(t,e,n,s,o,r,a,c);if(this.curves.length>0){const f=l.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class zl extends Gt{constructor(t=[new rt(0,-.5),new rt(.5,0),new rt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Re(s,0,Math.PI*2);const o=[],r=[],a=[],c=[],l=[],u=1/e,f=new C,d=new rt,h=new C,g=new C,x=new C;let p=0,m=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:p=t[v+1].x-t[v].x,m=t[v+1].y-t[v].y,h.x=m*1,h.y=-p,h.z=m*0,x.copy(h),h.normalize(),c.push(h.x,h.y,h.z);break;case t.length-1:c.push(x.x,x.y,x.z);break;default:p=t[v+1].x-t[v].x,m=t[v+1].y-t[v].y,h.x=m*1,h.y=-p,h.z=m*0,g.copy(h),h.x+=x.x,h.y+=x.y,h.z+=x.z,h.normalize(),c.push(h.x,h.y,h.z),x.copy(g)}for(let v=0;v<=e;v++){const M=n+v*u*s,_=Math.sin(M),w=Math.cos(M);for(let b=0;b<=t.length-1;b++){f.x=t[b].x*_,f.y=t[b].y,f.z=t[b].x*w,r.push(f.x,f.y,f.z),d.x=v/e,d.y=b/(t.length-1),a.push(d.x,d.y);const A=c[3*b+0]*_,R=c[3*b+1],S=c[3*b+0]*w;l.push(A,R,S)}}for(let v=0;v<e;v++)for(let M=0;M<t.length-1;M++){const _=M+v*t.length,w=_,b=_+t.length,A=_+t.length+1,R=_+1;o.push(w,b,R),o.push(A,R,b)}this.setIndex(o),this.setAttribute("position",new at(r,3)),this.setAttribute("uv",new at(a,2)),this.setAttribute("normal",new at(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zl(t.points,t.segments,t.phiStart,t.phiLength)}}class Bl extends Gt{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const o=[],r=[],a=[],c=[],l=new C,u=new rt;r.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const h=n+f/e*s;l.x=t*Math.cos(h),l.y=t*Math.sin(h),r.push(l.x,l.y,l.z),a.push(0,0,1),u.x=(r[d]/t+1)/2,u.y=(r[d+1]/t+1)/2,c.push(u.x,u.y)}for(let f=1;f<=e;f++)o.push(f,f+1,0);this.setIndex(o),this.setAttribute("position",new at(r,3)),this.setAttribute("normal",new at(a,3)),this.setAttribute("uv",new at(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ne extends Gt{constructor(t=1,e=1,n=1,s=32,o=1,r=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:o,openEnded:r,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const u=[],f=[],d=[],h=[];let g=0;const x=[],p=n/2;let m=0;v(),r===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new at(f,3)),this.setAttribute("normal",new at(d,3)),this.setAttribute("uv",new at(h,2));function v(){const _=new C,w=new C;let b=0;const A=(e-t)/n;for(let R=0;R<=o;R++){const S=[],y=R/o,E=y*(e-t)+t;for(let U=0;U<=s;U++){const N=U/s,P=N*c+a,k=Math.sin(P),L=Math.cos(P);w.x=E*k,w.y=-y*n+p,w.z=E*L,f.push(w.x,w.y,w.z),_.set(k,A,L).normalize(),d.push(_.x,_.y,_.z),h.push(N,1-y),S.push(g++)}x.push(S)}for(let R=0;R<s;R++)for(let S=0;S<o;S++){const y=x[S][R],E=x[S+1][R],U=x[S+1][R+1],N=x[S][R+1];(t>0||S!==0)&&(u.push(y,E,N),b+=3),(e>0||S!==o-1)&&(u.push(E,U,N),b+=3)}l.addGroup(m,b,0),m+=b}function M(_){const w=g,b=new rt,A=new C;let R=0;const S=_===!0?t:e,y=_===!0?1:-1;for(let U=1;U<=s;U++)f.push(0,p*y,0),d.push(0,y,0),h.push(.5,.5),g++;const E=g;for(let U=0;U<=s;U++){const P=U/s*c+a,k=Math.cos(P),L=Math.sin(P);A.x=S*L,A.y=p*y,A.z=S*k,f.push(A.x,A.y,A.z),d.push(0,y,0),b.x=k*.5+.5,b.y=L*.5*y+.5,h.push(b.x,b.y),g++}for(let U=0;U<s;U++){const N=w+U,P=E+U;_===!0?u.push(P,P+1,N):u.push(P+1,P,N),R+=3}l.addGroup(m,R,_===!0?1:2),m+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ne(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ea extends Ne{constructor(t=1,e=1,n=32,s=1,o=!1,r=0,a=Math.PI*2){super(0,t,e,n,s,o,r,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:a}}static fromJSON(t){return new Ea(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Hl extends Gt{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const o=[],r=[];a(s),l(n),u(),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(o.slice(),3)),this.setAttribute("uv",new at(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){const M=new C,_=new C,w=new C;for(let b=0;b<e.length;b+=3)h(e[b+0],M),h(e[b+1],_),h(e[b+2],w),c(M,_,w,v)}function c(v,M,_,w){const b=w+1,A=[];for(let R=0;R<=b;R++){A[R]=[];const S=v.clone().lerp(_,R/b),y=M.clone().lerp(_,R/b),E=b-R;for(let U=0;U<=E;U++)U===0&&R===b?A[R][U]=S:A[R][U]=S.clone().lerp(y,U/E)}for(let R=0;R<b;R++)for(let S=0;S<2*(b-R)-1;S++){const y=Math.floor(S/2);S%2===0?(d(A[R][y+1]),d(A[R+1][y]),d(A[R][y])):(d(A[R][y+1]),d(A[R+1][y+1]),d(A[R+1][y]))}}function l(v){const M=new C;for(let _=0;_<o.length;_+=3)M.x=o[_+0],M.y=o[_+1],M.z=o[_+2],M.normalize().multiplyScalar(v),o[_+0]=M.x,o[_+1]=M.y,o[_+2]=M.z}function u(){const v=new C;for(let M=0;M<o.length;M+=3){v.x=o[M+0],v.y=o[M+1],v.z=o[M+2];const _=p(v)/2/Math.PI+.5,w=m(v)/Math.PI+.5;r.push(_,1-w)}g(),f()}function f(){for(let v=0;v<r.length;v+=6){const M=r[v+0],_=r[v+2],w=r[v+4],b=Math.max(M,_,w),A=Math.min(M,_,w);b>.9&&A<.1&&(M<.2&&(r[v+0]+=1),_<.2&&(r[v+2]+=1),w<.2&&(r[v+4]+=1))}}function d(v){o.push(v.x,v.y,v.z)}function h(v,M){const _=v*3;M.x=t[_+0],M.y=t[_+1],M.z=t[_+2]}function g(){const v=new C,M=new C,_=new C,w=new C,b=new rt,A=new rt,R=new rt;for(let S=0,y=0;S<o.length;S+=9,y+=6){v.set(o[S+0],o[S+1],o[S+2]),M.set(o[S+3],o[S+4],o[S+5]),_.set(o[S+6],o[S+7],o[S+8]),b.set(r[y+0],r[y+1]),A.set(r[y+2],r[y+3]),R.set(r[y+4],r[y+5]),w.copy(v).add(M).add(_).divideScalar(3);const E=p(w);x(b,y+0,v,E),x(A,y+2,M,E),x(R,y+4,_,E)}}function x(v,M,_,w){w<0&&v.x===1&&(r[M]=v.x-1),_.x===0&&_.z===0&&(r[M]=w/2/Math.PI+.5)}function p(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hl(t.vertices,t.indices,t.radius,t.details)}}class Ai extends Yo{constructor(t){super(t),this.uuid=vs(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Yo().fromJSON(s))}return this}}const t1={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let o=Zf(i,0,s,e,!0);const r=[];if(!o||o.next===o.prev)return r;let a,c,l,u,f,d,h;if(n&&(o=o1(i,t,o,e)),i.length>80*e){a=l=i[0],c=u=i[1];for(let g=e;g<s;g+=e)f=i[g],d=i[g+1],f<a&&(a=f),d<c&&(c=d),f>l&&(l=f),d>u&&(u=d);h=Math.max(l-a,u-c),h=h!==0?32767/h:0}return Zo(o,r,e,a,c,h,0),r}};function Zf(i,t,e,n,s){let o,r;if(s===g1(i,t,e,n)>0)for(o=t;o<e;o+=n)r=bh(o,i[o],i[o+1],r);else for(o=e-n;o>=t;o-=n)r=bh(o,i[o],i[o+1],r);return r&&Ta(r,r.next)&&(jo(r),r=r.next),r}function ms(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Ta(e,e.next)||Se(e.prev,e,e.next)===0)){if(jo(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Zo(i,t,e,n,s,o,r){if(!i)return;!r&&o&&u1(i,n,s,o);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,o?n1(i,n,s,o):e1(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),jo(i),i=l.next,a=l.next;continue}if(i=l,i===a){r?r===1?(i=i1(ms(i),t,e),Zo(i,t,e,n,s,o,2)):r===2&&s1(i,t,e,n,s,o):Zo(ms(i),t,e,n,s,o,1);break}}}function e1(i){const t=i.prev,e=i,n=i.next;if(Se(t,e,n)>=0)return!1;const s=t.x,o=e.x,r=n.x,a=t.y,c=e.y,l=n.y,u=s<o?s<r?s:r:o<r?o:r,f=a<c?a<l?a:l:c<l?c:l,d=s>o?s>r?s:r:o>r?o:r,h=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=d&&g.y>=f&&g.y<=h&&Hs(s,a,o,c,r,l,g.x,g.y)&&Se(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function n1(i,t,e,n){const s=i.prev,o=i,r=i.next;if(Se(s,o,r)>=0)return!1;const a=s.x,c=o.x,l=r.x,u=s.y,f=o.y,d=r.y,h=a<c?a<l?a:l:c<l?c:l,g=u<f?u<d?u:d:f<d?f:d,x=a>c?a>l?a:l:c>l?c:l,p=u>f?u>d?u:d:f>d?f:d,m=fl(h,g,t,e,n),v=fl(x,p,t,e,n);let M=i.prevZ,_=i.nextZ;for(;M&&M.z>=m&&_&&_.z<=v;){if(M.x>=h&&M.x<=x&&M.y>=g&&M.y<=p&&M!==s&&M!==r&&Hs(a,u,c,f,l,d,M.x,M.y)&&Se(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=h&&_.x<=x&&_.y>=g&&_.y<=p&&_!==s&&_!==r&&Hs(a,u,c,f,l,d,_.x,_.y)&&Se(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=m;){if(M.x>=h&&M.x<=x&&M.y>=g&&M.y<=p&&M!==s&&M!==r&&Hs(a,u,c,f,l,d,M.x,M.y)&&Se(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=v;){if(_.x>=h&&_.x<=x&&_.y>=g&&_.y<=p&&_!==s&&_!==r&&Hs(a,u,c,f,l,d,_.x,_.y)&&Se(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function i1(i,t,e){let n=i;do{const s=n.prev,o=n.next.next;!Ta(s,o)&&$f(s,n,n.next,o)&&$o(s,o)&&$o(o,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),jo(n),jo(n.next),n=i=o),n=n.next}while(n!==i);return ms(n)}function s1(i,t,e,n,s,o){let r=i;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&d1(r,a)){let c=jf(r,a);r=ms(r,r.next),c=ms(c,c.next),Zo(r,t,e,n,s,o,0),Zo(c,t,e,n,s,o,0);return}a=a.next}r=r.next}while(r!==i)}function o1(i,t,e,n){const s=[];let o,r,a,c,l;for(o=0,r=t.length;o<r;o++)a=t[o]*n,c=o<r-1?t[o+1]*n:i.length,l=Zf(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(f1(l));for(s.sort(r1),o=0;o<s.length;o++)e=a1(s[o],e);return e}function r1(i,t){return i.x-t.x}function a1(i,t){const e=c1(i,t);if(!e)return t;const n=jf(e,i);return ms(n,n.next),ms(e,e.next)}function c1(i,t){let e=t,n=-1/0,s;const o=i.x,r=i.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const d=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=o&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===o))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,c=s.x,l=s.y;let u=1/0,f;e=s;do o>=e.x&&e.x>=c&&o!==e.x&&Hs(r<l?o:n,r,c,l,r<l?n:o,r,e.x,e.y)&&(f=Math.abs(r-e.y)/(o-e.x),$o(e,i)&&(f<u||f===u&&(e.x>s.x||e.x===s.x&&l1(s,e)))&&(s=e,u=f)),e=e.next;while(e!==a);return s}function l1(i,t){return Se(i.prev,i,t.prev)<0&&Se(t.next,i,i.next)<0}function u1(i,t,e,n){let s=i;do s.z===0&&(s.z=fl(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,h1(s)}function h1(i){let t,e,n,s,o,r,a,c,l=1;do{for(e=i,i=null,o=null,r=0;e;){for(r++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),o?o.nextZ=s:i=s,s.prevZ=o,o=s;e=n}o.nextZ=null,l*=2}while(r>1);return i}function fl(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function f1(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Hs(i,t,e,n,s,o,r,a){return(s-r)*(t-a)>=(i-r)*(o-a)&&(i-r)*(n-a)>=(e-r)*(t-a)&&(e-r)*(o-a)>=(s-r)*(n-a)}function d1(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!p1(i,t)&&($o(i,t)&&$o(t,i)&&m1(i,t)&&(Se(i.prev,i,t.prev)||Se(i,t.prev,t))||Ta(i,t)&&Se(i.prev,i,i.next)>0&&Se(t.prev,t,t.next)>0)}function Se(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Ta(i,t){return i.x===t.x&&i.y===t.y}function $f(i,t,e,n){const s=Or(Se(i,t,e)),o=Or(Se(i,t,n)),r=Or(Se(e,n,i)),a=Or(Se(e,n,t));return!!(s!==o&&r!==a||s===0&&Fr(i,e,t)||o===0&&Fr(i,n,t)||r===0&&Fr(e,i,n)||a===0&&Fr(e,t,n))}function Fr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Or(i){return i>0?1:i<0?-1:0}function p1(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&$f(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function $o(i,t){return Se(i.prev,i,i.next)<0?Se(i,t,i.next)>=0&&Se(i,i.prev,t)>=0:Se(i,t,i.prev)<0||Se(i,i.next,t)<0}function m1(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,o=(i.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function jf(i,t){const e=new dl(i.i,i.x,i.y),n=new dl(t.i,t.x,t.y),s=i.next,o=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function bh(i,t,e,n){const s=new dl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function jo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function dl(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function g1(i,t,e,n){let s=0;for(let o=t,r=e-n;o<e;o+=n)s+=(i[r]-i[o])*(i[o+1]+i[r+1]),r=o;return s}class qi{static area(t){const e=t.length;let n=0;for(let s=e-1,o=0;o<e;s=o++)n+=t[s].x*t[o].y-t[o].x*t[s].y;return n*.5}static isClockWise(t){return qi.area(t)<0}static triangulateShape(t,e){const n=[],s=[],o=[];wh(t),Eh(n,t);let r=t.length;e.forEach(wh);for(let c=0;c<e.length;c++)s.push(r),r+=e[c].length,Eh(n,e[c]);const a=t1.triangulate(n,s);for(let c=0;c<a.length;c+=3)o.push(a.slice(c,c+3));return o}}function wh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Eh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Gl extends Gt{constructor(t=new Ai([new rt(.5,.5),new rt(-.5,.5),new rt(-.5,-.5),new rt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],o=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];r(l)}this.setAttribute("position",new at(s,3)),this.setAttribute("uv",new at(o,2)),this.computeVertexNormals();function r(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,h=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:h-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:x1;let M,_=!1,w,b,A,R;m&&(M=m.getSpacedPoints(u),_=!0,d=!1,w=m.computeFrenetFrames(u,!1),b=new C,A=new C,R=new C),d||(p=0,h=0,g=0,x=0);const S=a.extractPoints(l);let y=S.shape;const E=S.holes;if(!qi.isClockWise(y)){y=y.reverse();for(let G=0,tt=E.length;G<tt;G++){const F=E[G];qi.isClockWise(F)&&(E[G]=F.reverse())}}const N=qi.triangulateShape(y,E),P=y;for(let G=0,tt=E.length;G<tt;G++){const F=E[G];y=y.concat(F)}function k(G,tt,F){return tt||console.error("THREE.ExtrudeGeometry: vec does not exist"),G.clone().addScaledVector(tt,F)}const L=y.length,H=N.length;function z(G,tt,F){let St,dt,Et;const _t=G.x-tt.x,zt=G.y-tt.y,ut=F.x-G.x,I=F.y-G.y,T=_t*_t+zt*zt,$=_t*I-zt*ut;if(Math.abs($)>Number.EPSILON){const st=Math.sqrt(T),ft=Math.sqrt(ut*ut+I*I),K=tt.x-zt/st,wt=tt.y+_t/st,yt=F.x-I/ft,At=F.y+ut/ft,$t=((yt-K)*I-(At-wt)*ut)/(_t*I-zt*ut);St=K+_t*$t-G.x,dt=wt+zt*$t-G.y;const xt=St*St+dt*dt;if(xt<=2)return new rt(St,dt);Et=Math.sqrt(xt/2)}else{let st=!1;_t>Number.EPSILON?ut>Number.EPSILON&&(st=!0):_t<-Number.EPSILON?ut<-Number.EPSILON&&(st=!0):Math.sign(zt)===Math.sign(I)&&(st=!0),st?(St=-zt,dt=_t,Et=Math.sqrt(T)):(St=_t,dt=zt,Et=Math.sqrt(T/2))}return new rt(St/Et,dt/Et)}const O=[];for(let G=0,tt=P.length,F=tt-1,St=G+1;G<tt;G++,F++,St++)F===tt&&(F=0),St===tt&&(St=0),O[G]=z(P[G],P[F],P[St]);const Y=[];let Z,nt=O.concat();for(let G=0,tt=E.length;G<tt;G++){const F=E[G];Z=[];for(let St=0,dt=F.length,Et=dt-1,_t=St+1;St<dt;St++,Et++,_t++)Et===dt&&(Et=0),_t===dt&&(_t=0),Z[St]=z(F[St],F[Et],F[_t]);Y.push(Z),nt=nt.concat(Z)}for(let G=0;G<p;G++){const tt=G/p,F=h*Math.cos(tt*Math.PI/2),St=g*Math.sin(tt*Math.PI/2)+x;for(let dt=0,Et=P.length;dt<Et;dt++){const _t=k(P[dt],O[dt],St);ot(_t.x,_t.y,-F)}for(let dt=0,Et=E.length;dt<Et;dt++){const _t=E[dt];Z=Y[dt];for(let zt=0,ut=_t.length;zt<ut;zt++){const I=k(_t[zt],Z[zt],St);ot(I.x,I.y,-F)}}}const mt=g+x;for(let G=0;G<L;G++){const tt=d?k(y[G],nt[G],mt):y[G];_?(A.copy(w.normals[0]).multiplyScalar(tt.x),b.copy(w.binormals[0]).multiplyScalar(tt.y),R.copy(M[0]).add(A).add(b),ot(R.x,R.y,R.z)):ot(tt.x,tt.y,0)}for(let G=1;G<=u;G++)for(let tt=0;tt<L;tt++){const F=d?k(y[tt],nt[tt],mt):y[tt];_?(A.copy(w.normals[G]).multiplyScalar(F.x),b.copy(w.binormals[G]).multiplyScalar(F.y),R.copy(M[G]).add(A).add(b),ot(R.x,R.y,R.z)):ot(F.x,F.y,f/u*G)}for(let G=p-1;G>=0;G--){const tt=G/p,F=h*Math.cos(tt*Math.PI/2),St=g*Math.sin(tt*Math.PI/2)+x;for(let dt=0,Et=P.length;dt<Et;dt++){const _t=k(P[dt],O[dt],St);ot(_t.x,_t.y,f+F)}for(let dt=0,Et=E.length;dt<Et;dt++){const _t=E[dt];Z=Y[dt];for(let zt=0,ut=_t.length;zt<ut;zt++){const I=k(_t[zt],Z[zt],St);_?ot(I.x,I.y+M[u-1].y,M[u-1].x+F):ot(I.x,I.y,f+F)}}}V(),j();function V(){const G=s.length/3;if(d){let tt=0,F=L*tt;for(let St=0;St<H;St++){const dt=N[St];Tt(dt[2]+F,dt[1]+F,dt[0]+F)}tt=u+p*2,F=L*tt;for(let St=0;St<H;St++){const dt=N[St];Tt(dt[0]+F,dt[1]+F,dt[2]+F)}}else{for(let tt=0;tt<H;tt++){const F=N[tt];Tt(F[2],F[1],F[0])}for(let tt=0;tt<H;tt++){const F=N[tt];Tt(F[0]+L*u,F[1]+L*u,F[2]+L*u)}}n.addGroup(G,s.length/3-G,0)}function j(){const G=s.length/3;let tt=0;ct(P,tt),tt+=P.length;for(let F=0,St=E.length;F<St;F++){const dt=E[F];ct(dt,tt),tt+=dt.length}n.addGroup(G,s.length/3-G,1)}function ct(G,tt){let F=G.length;for(;--F>=0;){const St=F;let dt=F-1;dt<0&&(dt=G.length-1);for(let Et=0,_t=u+p*2;Et<_t;Et++){const zt=L*Et,ut=L*(Et+1),I=tt+St+zt,T=tt+dt+zt,$=tt+dt+ut,st=tt+St+ut;gt(I,T,$,st)}}}function ot(G,tt,F){c.push(G),c.push(tt),c.push(F)}function Tt(G,tt,F){J(G),J(tt),J(F);const St=s.length/3,dt=v.generateTopUV(n,s,St-3,St-2,St-1);lt(dt[0]),lt(dt[1]),lt(dt[2])}function gt(G,tt,F,St){J(G),J(tt),J(St),J(tt),J(F),J(St);const dt=s.length/3,Et=v.generateSideWallUV(n,s,dt-6,dt-3,dt-2,dt-1);lt(Et[0]),lt(Et[1]),lt(Et[3]),lt(Et[1]),lt(Et[2]),lt(Et[3])}function J(G){s.push(c[G*3+0]),s.push(c[G*3+1]),s.push(c[G*3+2])}function lt(G){o.push(G.x),o.push(G.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return v1(e,n,t)}static fromJSON(t,e){const n=[];for(let o=0,r=t.shapes.length;o<r;o++){const a=e[t.shapes[o]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new aa[s.type]().fromJSON(s)),new Gl(n,t.options)}}const x1={generateTopUV:function(i,t,e,n,s){const o=t[e*3],r=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],u=t[s*3+1];return[new rt(o,r),new rt(a,c),new rt(l,u)]},generateSideWallUV:function(i,t,e,n,s,o){const r=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],u=t[n*3+1],f=t[n*3+2],d=t[s*3],h=t[s*3+1],g=t[s*3+2],x=t[o*3],p=t[o*3+1],m=t[o*3+2];return Math.abs(a-u)<Math.abs(r-l)?[new rt(r,1-c),new rt(l,1-f),new rt(d,1-g),new rt(x,1-m)]:[new rt(a,1-c),new rt(u,1-f),new rt(h,1-g),new rt(p,1-m)]}};function v1(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const o=i[n];e.shapes.push(o.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Aa extends Hl{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Aa(t.radius,t.detail)}}class Vl extends Gt{constructor(t=new Ai([new rt(0,.5),new rt(-.5,-.5),new rt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],o=[],r=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let u=0;u<t.length;u++)l(t[u]),this.addGroup(a,c,u),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new at(s,3)),this.setAttribute("normal",new at(o,3)),this.setAttribute("uv",new at(r,2));function l(u){const f=s.length/3,d=u.extractPoints(e);let h=d.shape;const g=d.holes;qi.isClockWise(h)===!1&&(h=h.reverse());for(let p=0,m=g.length;p<m;p++){const v=g[p];qi.isClockWise(v)===!0&&(g[p]=v.reverse())}const x=qi.triangulateShape(h,g);for(let p=0,m=g.length;p<m;p++){const v=g[p];h=h.concat(v)}for(let p=0,m=h.length;p<m;p++){const v=h[p];s.push(v.x,v.y,0),o.push(0,0,1),r.push(v.x,v.y)}for(let p=0,m=x.length;p<m;p++){const v=x[p],M=v[0]+f,_=v[1]+f,w=v[2]+f;n.push(M,_,w),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return _1(e,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const r=e[t.shapes[s]];n.push(r)}return new Vl(n,t.curveSegments)}}function _1(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Ki extends Gt{constructor(t=1,e=32,n=16,s=0,o=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:o,thetaStart:r,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(r+a,Math.PI);let l=0;const u=[],f=new C,d=new C,h=[],g=[],x=[],p=[];for(let m=0;m<=n;m++){const v=[],M=m/n;let _=0;m===0&&r===0?_=.5/e:m===n&&c===Math.PI&&(_=-.5/e);for(let w=0;w<=e;w++){const b=w/e;f.x=-t*Math.cos(s+b*o)*Math.sin(r+M*a),f.y=t*Math.cos(r+M*a),f.z=t*Math.sin(s+b*o)*Math.sin(r+M*a),g.push(f.x,f.y,f.z),d.copy(f).normalize(),x.push(d.x,d.y,d.z),p.push(b+_,1-M),v.push(l++)}u.push(v)}for(let m=0;m<n;m++)for(let v=0;v<e;v++){const M=u[m][v+1],_=u[m][v],w=u[m+1][v],b=u[m+1][v+1];(m!==0||r>0)&&h.push(M,_,b),(m!==n-1||c<Math.PI)&&h.push(_,w,b)}this.setIndex(h),this.setAttribute("position",new at(g,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ki(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ca extends Gt{constructor(t=1,e=.4,n=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:o},n=Math.floor(n),s=Math.floor(s);const r=[],a=[],c=[],l=[],u=new C,f=new C,d=new C;for(let h=0;h<=n;h++)for(let g=0;g<=s;g++){const x=g/s*o,p=h/n*Math.PI*2;f.x=(t+e*Math.cos(p))*Math.cos(x),f.y=(t+e*Math.cos(p))*Math.sin(x),f.z=e*Math.sin(p),a.push(f.x,f.y,f.z),u.x=t*Math.cos(x),u.y=t*Math.sin(x),d.subVectors(f,u).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(h/n)}for(let h=1;h<=n;h++)for(let g=1;g<=s;g++){const x=(s+1)*h+g-1,p=(s+1)*(h-1)+g-1,m=(s+1)*(h-1)+g,v=(s+1)*h+g;r.push(x,p,v),r.push(p,m,v)}this.setIndex(r),this.setAttribute("position",new at(a,3)),this.setAttribute("normal",new at(c,3)),this.setAttribute("uv",new at(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ca(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ra extends Gt{constructor(t=new qf(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,n=1,s=8,o=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:o};const r=t.computeFrenetFrames(e,o);this.tangents=r.tangents,this.normals=r.normals,this.binormals=r.binormals;const a=new C,c=new C,l=new rt;let u=new C;const f=[],d=[],h=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new at(f,3)),this.setAttribute("normal",new at(d,3)),this.setAttribute("uv",new at(h,2));function x(){for(let M=0;M<e;M++)p(M);p(o===!1?e:0),v(),m()}function p(M){u=t.getPointAt(M/e,u);const _=r.normals[M],w=r.binormals[M];for(let b=0;b<=s;b++){const A=b/s*Math.PI*2,R=Math.sin(A),S=-Math.cos(A);c.x=S*_.x+R*w.x,c.y=S*_.y+R*w.y,c.z=S*_.z+R*w.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=u.x+n*c.x,a.y=u.y+n*c.y,a.z=u.z+n*c.z,f.push(a.x,a.y,a.z)}}function m(){for(let M=1;M<=e;M++)for(let _=1;_<=s;_++){const w=(s+1)*(M-1)+(_-1),b=(s+1)*M+(_-1),A=(s+1)*M+_,R=(s+1)*(M-1)+_;g.push(w,b,R),g.push(b,A,R)}}function v(){for(let M=0;M<=e;M++)for(let _=0;_<=s;_++)l.x=M/e,l.y=_/s,h.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Ra(new aa[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class ye extends Ms{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ef,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Wl extends ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Rt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class M1 extends Wl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Rt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const mc=new vt,Th=new C,Ah=new C;class Kf{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new rt(512,512),this.map=null,this.mapPass=null,this.matrix=new vt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ba,this._frameExtents=new rt(1,1),this._viewportCount=1,this._viewports=[new oe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Th.setFromMatrixPosition(t.matrixWorld),e.position.copy(Th),Ah.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ah),e.updateMatrixWorld(),mc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(mc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ch=new vt,wo=new C,gc=new C;class y1 extends Kf{constructor(){super(new hn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new rt(4,2),this._viewportCount=6,this._viewports=[new oe(2,1,1,1),new oe(0,1,1,1),new oe(3,1,1,1),new oe(1,1,1,1),new oe(3,0,1,1),new oe(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,o=t.distance||n.far;o!==n.far&&(n.far=o,n.updateProjectionMatrix()),wo.setFromMatrixPosition(t.matrixWorld),n.position.copy(wo),gc.copy(n.position),gc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(gc),n.updateMatrixWorld(),s.makeTranslation(-wo.x,-wo.y,-wo.z),Ch.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ch)}}class S1 extends Wl{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new y1}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class b1 extends Kf{constructor(){super(new Il(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class w1 extends Wl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.shadow=new b1}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Pa extends Gt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}const Rh=new vt;class E1{constructor(t,e,n=0,s=1/0){this.ray=new Sa(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Dl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Rh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Rh),this}intersectObject(t,e=!0,n=[]){return pl(t,this,n,e),n.sort(Ph),n}intersectObjects(t,e=!0,n=[]){for(let s=0,o=t.length;s<o;s++)pl(t[s],this,n,e);return n.sort(Ph),n}}function Ph(i,t){return i.distance-t.distance}function pl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const o=i.children;for(let r=0,a=o.length;r<a;r++)pl(o[r],t,e,!0)}}class Lh{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Re(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class T1 extends xs{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Sl}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Sl);const Dh={type:"change"},Xl={type:"start"},Jf={type:"end"},kr=new Sa,Ih=new mi,A1=Math.cos(70*en.DEG2RAD),Te=new C,an=2*Math.PI,pe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},xc=1e-6;class C1 extends T1{constructor(t,e=null){super(t,e),this.state=pe.NONE,this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:bi.ROTATE,MIDDLE:bi.DOLLY,RIGHT:bi.PAN},this.touches={ONE:Gi.ROTATE,TWO:Gi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new wn,this._lastTargetPosition=new C,this._quat=new wn().setFromUnitVectors(t.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Lh,this._sphericalDelta=new Lh,this._scale=1,this._panOffset=new C,this._rotateStart=new rt,this._rotateEnd=new rt,this._rotateDelta=new rt,this._panStart=new rt,this._panEnd=new rt,this._panDelta=new rt,this._dollyStart=new rt,this._dollyEnd=new rt,this._dollyDelta=new rt,this._dollyDirection=new C,this._mouse=new rt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=P1.bind(this),this._onPointerDown=R1.bind(this),this._onPointerUp=L1.bind(this),this._onContextMenu=k1.bind(this),this._onMouseWheel=U1.bind(this),this._onKeyDown=N1.bind(this),this._onTouchStart=F1.bind(this),this._onTouchMove=O1.bind(this),this._onMouseDown=D1.bind(this),this._onMouseMove=I1.bind(this),this._interceptControlDown=z1.bind(this),this._interceptControlUp=B1.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Dh),this.update(),this.state=pe.NONE}update(t=null){const e=this.object.position;Te.copy(e).sub(this.target),Te.applyQuaternion(this._quat),this._spherical.setFromVector3(Te),this.autoRotate&&this.state===pe.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=an:n>Math.PI&&(n-=an),s<-Math.PI?s+=an:s>Math.PI&&(s-=an),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let o=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const r=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),o=r!=this._spherical.radius}if(Te.setFromSpherical(this._spherical),Te.applyQuaternion(this._quatInverse),e.copy(this.target).add(Te),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let r=null;if(this.object.isPerspectiveCamera){const a=Te.length();r=this._clampDistance(a*this._scale);const c=a-r;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),o=!!c}else if(this.object.isOrthographicCamera){const a=new C(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),o=c!==this.object.zoom;const l=new C(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),r=Te.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;r!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position):(kr.origin.copy(this.object.position),kr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(kr.direction))<A1?this.object.lookAt(this.target):(Ih.setFromNormalAndCoplanarPoint(this.object.up,this.target),kr.intersectPlane(Ih,this.target))))}else if(this.object.isOrthographicCamera){const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),r!==this.object.zoom&&(this.object.updateProjectionMatrix(),o=!0)}return this._scale=1,this._performCursorZoom=!1,o||this._lastPosition.distanceToSquared(this.object.position)>xc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>xc||this._lastTargetPosition.distanceToSquared(this.target)>xc?(this.dispatchEvent(Dh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?an/60*this.autoRotateSpeed*t:an/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Te.setFromMatrixColumn(e,0),Te.multiplyScalar(-t),this._panOffset.add(Te)}_panUp(t,e){this.screenSpacePanning===!0?Te.setFromMatrixColumn(e,1):(Te.setFromMatrixColumn(e,0),Te.crossVectors(this.object.up,Te)),Te.multiplyScalar(t),this._panOffset.add(Te)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Te.copy(s).sub(this.target);let o=Te.length();o*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*o/n.clientHeight,this.object.matrix),this._panUp(2*e*o/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,o=e-n.top,r=n.width,a=n.height;this._mouse.x=s/r*2-1,this._mouse.y=-(o/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(an*this._rotateDelta.x/e.clientHeight),this._rotateUp(an*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(an*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-an*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(an*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-an*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,o=Math.sqrt(n*n+s*s);this._dollyStart.set(0,o)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),o=.5*(t.pageY+n.y);this._rotateEnd.set(s,o)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(an*this._rotateDelta.x/e.clientHeight),this._rotateUp(an*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,o=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,o),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const r=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(r,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new rt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function R1(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function P1(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function L1(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Jf),this.state=pe.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function D1(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case bi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=pe.DOLLY;break;case bi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=pe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=pe.ROTATE}break;case bi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=pe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=pe.PAN}break;default:this.state=pe.NONE}this.state!==pe.NONE&&this.dispatchEvent(Xl)}function I1(i){switch(this.state){case pe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case pe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case pe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function U1(i){this.enabled===!1||this.enableZoom===!1||this.state!==pe.NONE||(i.preventDefault(),this.dispatchEvent(Xl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Jf))}function N1(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function F1(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Gi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=pe.TOUCH_ROTATE;break;case Gi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=pe.TOUCH_PAN;break;default:this.state=pe.NONE}break;case 2:switch(this.touches.TWO){case Gi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=pe.TOUCH_DOLLY_PAN;break;case Gi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=pe.TOUCH_DOLLY_ROTATE;break;default:this.state=pe.NONE}break;default:this.state=pe.NONE}this.state!==pe.NONE&&this.dispatchEvent(Xl)}function O1(i){switch(this._trackPointer(i),this.state){case pe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case pe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case pe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case pe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=pe.NONE}}function k1(i){this.enabled!==!1&&i.preventDefault()}function z1(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function B1(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const pt={paper:15853784,plaster:15656662,stone:13221545,stoneDark:10326916,stoneGrey:11117722,brick:9276037,tile:5986904,tileDark:4013115,ink:2367517,wood:7227955,woodDark:4862242,lacquer:8663583,lacquerDark:6038038,cinnabar:11551532,ochre:12618302,celadon:8365462,lamp:16758632,sun:16761994},Uh=en.degToRad(246),vc=en.degToRad(13.5),ca=new C(Math.sin(Uh)*Math.cos(vc),Math.sin(vc),-Math.cos(Uh)*Math.cos(vc)).normalize();function H1(){let i=null;try{i=new URLSearchParams(location.search).get("q")}catch{}const t=matchMedia("(pointer: coarse)").matches,e=Math.min(window.innerWidth,window.innerHeight)<700,n=navigator.hardwareConcurrency||4,s=navigator.deviceMemory||4;let o=t||e||n<=4||s<=3?"low":"high";return(i==="low"||i==="high")&&(o=i),o}const G1={low:{name:"low",maxDpr:1.5,megapixels:1.6,minScale:.6,msaa:2,shadow:[2048,1024],shadowSoft:!1,bloomStart:4,bloomLevels:3,detail:!1,reflections:!1,terrainSeg:150,grass:.4,trees:.55,books:.5,people:.65,particles:.5,rafters:!1,eaveTiles:!1,curve:8},high:{name:"high",maxDpr:2,megapixels:4.2,minScale:.7,msaa:4,shadow:[4096,2048],shadowSoft:!0,bloomStart:2,bloomLevels:5,detail:!0,reflections:!0,terrainSeg:240,grass:1,trees:1,books:1,people:1,particles:1,rafters:!0,eaveTiles:!0,curve:14}},Oe=1,De={uTime:{value:0},uWindTime:{value:0},uWind:{value:new rt(.75,.32)},uSunDir:{value:ca.clone()},uSunColor:{value:new Rt(pt.sun)},uLamp:{value:1},uLampColor:{value:new Rt(pt.lamp)},uZenith:{value:new Rt(8232124)},uHorizonWarm:{value:new Rt(16761466)},uHorizonCool:{value:new Rt(15123380)},uBelt:{value:new Rt(4203308)},uSunGlow:{value:new Rt(16751173)},uSkyDim:{value:1},uFogFalloff:{value:.035},uFogBase:{value:-2},uFogFar:{value:34e-5},uRoofUnder:{value:new Rt(5910050)}},ho=`
#ifndef LOQ_SKY
#define LOQ_SKY
uniform vec3 uSunDir;
uniform vec3 uZenith;
uniform vec3 uHorizonWarm;
uniform vec3 uHorizonCool;
uniform vec3 uBelt;
uniform vec3 uSunGlow;
uniform float uSkyDim;
// painterly sunset sky; also used for fog colour and water reflections so the
// land always dissolves into exactly the sky behind it
vec3 skyColor( vec3 dir ) {
  float y = clamp( dir.y, 0.0, 1.0 );
  float s = dot( dir, uSunDir );
  vec2 hd = normalize( dir.xz + vec2( 1e-5 ) );
  vec2 hs = normalize( uSunDir.xz );
  float az = dot( hd, hs ) * 0.5 + 0.5;
  vec3 horizon = mix( uHorizonCool, uHorizonWarm, pow( az, 2.4 ) );
  float t = pow( y, 0.42 );
  vec3 col = mix( horizon, uZenith, t );
  col += uBelt * smoothstep( 0.015, 0.09, y ) * smoothstep( 0.34, 0.1, y ) * pow( 1.0 - az, 1.4 );
  float sg = max( s, 0.0 );
  col += uSunGlow * ( pow( sg, 5.0 ) * 0.42 + pow( sg, 42.0 ) * 0.85 ) * ( 1.0 - 0.55 * t );
  return col * uSkyDim;
}
#endif
`,nr=`
#ifndef LOQ_NOISE
#define LOQ_NOISE
float hash12( vec2 p ) {
  vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
  p3 += dot( p3, p3.yzx + 33.33 );
  return fract( ( p3.x + p3.y ) * p3.z );
}
float vnoise( vec2 p ) {
  vec2 i = floor( p );
  vec2 f = fract( p );
  f = f * f * ( 3.0 - 2.0 * f );
  float a = hash12( i );
  float b = hash12( i + vec2( 1.0, 0.0 ) );
  float c = hash12( i + vec2( 0.0, 1.0 ) );
  float d = hash12( i + vec2( 1.0, 1.0 ) );
  return mix( mix( a, b, f.x ), mix( c, d, f.x ), f.y );
}
#endif
`;qt.fog_pars_vertex=`
#ifdef USE_FOG
  varying float vFogDepth;
  varying vec3 vFogWorld;
#endif
`;qt.fog_vertex=`
#ifdef USE_FOG
  vFogDepth = - mvPosition.z;
  vFogWorld = ( vec4( mvPosition.xyz, 0.0 ) * viewMatrix ).xyz;
#endif
`;qt.fog_pars_fragment=`
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying float vFogDepth;
  varying vec3 vFogWorld;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
  uniform float uFogFalloff;
  uniform float uFogBase;
  uniform float uFogFar;
  ${ho}
#endif
`;qt.fog_fragment=`
#ifdef USE_FOG
  {
    float fogDist = length( vFogWorld );
    vec3 fogDir = vFogWorld / max( fogDist, 1e-4 );
    #ifdef FOG_EXP2
      float fogD = fogDensity;
    #else
      float fogD = 0.0;
    #endif
    float fkd = uFogFalloff * vFogWorld.y;
    float fint = exp( - uFogFalloff * max( cameraPosition.y - uFogBase, -15.0 ) );
    fint *= abs( fkd ) > 1e-3 ? ( 1.0 - exp( - fkd ) ) / fkd : 1.0;
    float od = fogD * fogDist * fint + uFogFar * fogDist;
    float fogFactor = 1.0 - exp( - od );
    vec3 fcol = skyColor( normalize( vec3( fogDir.x, max( fogDir.y, 0.0 ) * 0.3, fogDir.z ) ) );
    gl_FragColor.rgb = mix( gl_FragColor.rgb, fcol * fogColor, fogFactor );
  }
#endif
`;function ne(i,t,e,n="after"){return i.includes(t)?n==="replace"?i.replace(t,e):i.replace(t,n==="after"?`${t}
${e}`:`${e}
${t}`):i}function ce(i,t,e=null,n={}){const s=i.onBeforeCompile;i.userData.loqPatched=!0,i.onBeforeCompile=(r,a)=>{Object.assign(r.uniforms,De,n),e&&e(r),s&&s!==Ms.prototype.onBeforeCompile&&s(r,a)};const o=`${t}|${Object.keys(n).join(",")}|${i.defines?JSON.stringify(i.defines):""}`;return i.customProgramCacheKey=()=>o,i}function V1(i){if(!(!i||i.userData.loqPatched)){if(i.isShaderMaterial){i.uniforms=Object.assign(i.uniforms||{},De),i.userData.loqPatched=!0;return}ce(i,"auto")}}const La=`
attribute vec4 aInfo;
varying vec4 vInfo;
#ifdef LOQ_DETAIL
varying vec3 vWorldPos;
varying vec2 vUvS;
#endif
`,Da=`
vInfo = aInfo;
#ifdef LOQ_DETAIL
{
  vec4 swp = vec4( transformed, 1.0 );
  #ifdef USE_INSTANCING
    swp = instanceMatrix * swp;
  #endif
  vWorldPos = ( modelMatrix * swp ).xyz;
  vUvS = uv;
}
#endif
`,Ia=`
varying vec4 vInfo;
#ifdef LOQ_DETAIL
varying vec3 vWorldPos;
varying vec2 vUvS;
#endif
uniform vec3 uLampColor;
uniform float uLamp;
${nr}
`,ir=`
irradiance *= vInfo.w;
`,sr=`
totalEmissiveRadiance += diffuseColor.rgb * uLampColor * ( vInfo.x * uLamp );
`,W1=`
#ifdef LOQ_DETAIL
{
  float kind = vInfo.y;
  vec3 wp = vWorldPos;
  if ( kind > 0.5 && kind < 1.5 ) { // wood
    float g = vnoise( vec2( ( wp.x + wp.z ) * 2.5, wp.y * 0.9 ) ) * 0.6 + vnoise( vec2( wp.y * 2.0 + wp.x, ( wp.z - wp.x ) * 9.0 ) ) * 0.4;
    diffuseColor.rgb *= 0.86 + 0.24 * g;
  } else if ( kind > 1.5 && kind < 2.5 ) { // whitewash with weathering streaks
    float mott = vnoise( wp.xz * 0.8 + wp.y * 0.6 ) * 0.6 + vnoise( ( wp.xz + wp.y ) * 3.7 ) * 0.4;
    float streak = vnoise( vec2( ( wp.x + wp.z ) * 2.6, wp.y * 0.45 ) );
    float top = smoothstep( 0.6, 1.0, vUvS.y );
    float bot = smoothstep( 0.22, 0.0, vUvS.y );
    vec3 c = diffuseColor.rgb * ( 0.95 + 0.08 * mott );
    c *= 1.0 - top * ( 0.32 * streak * streak + 0.05 );
    c = mix( c, c * vec3( 0.74, 0.77, 0.7 ), bot * ( 0.45 + 0.55 * mott ) );
    diffuseColor.rgb = c;
  } else if ( kind > 2.5 && kind < 3.5 ) { // stone
    float n1 = vnoise( wp.xz * 1.6 + wp.y * 1.3 );
    float n2 = vnoise( ( wp.xz - wp.y ) * 9.0 );
    diffuseColor.rgb *= 0.84 + 0.2 * n1 + 0.08 * n2;
  } else if ( kind > 3.5 && kind < 4.5 ) { // lacquer
    diffuseColor.rgb *= 0.9 + 0.14 * vnoise( vec2( ( wp.x + wp.z ) * 6.0, wp.y * 1.5 ) );
  } else if ( kind > 4.5 && kind < 5.5 ) { // square floor bricks 0.6 m
    vec2 c = wp.xz / 0.6;
    vec2 f = fract( c );
    float e = min( min( f.x, 1.0 - f.x ), min( f.y, 1.0 - f.y ) );
    float aa = 1.0 - smoothstep( 0.05, 0.25, fwidth( c.x ) );
    float id = hash12( floor( c ) );
    diffuseColor.rgb *= mix( 1.0, ( 0.86 + 0.2 * id ) * mix( 0.62, 1.0, smoothstep( 0.0, 0.04, e ) ), aa );
  } else if ( kind > 5.5 && kind < 6.5 ) { // floor boards
    float r = wp.z / 0.24;
    float row = floor( r );
    float id = hash12( vec2( row, floor( wp.x / 2.7 + hash12( vec2( row, 7.0 ) ) * 3.0 ) ) );
    float e = min( fract( r ), 1.0 - fract( r ) );
    float aa = 1.0 - smoothstep( 0.05, 0.3, fwidth( r ) );
    diffuseColor.rgb *= mix( 1.0, ( 0.82 + 0.24 * id ) * mix( 0.65, 1.0, smoothstep( 0.0, 0.07, e ) ), aa );
  } else if ( kind > 9.5 && kind < 10.5 ) { // ashlar blocks (platform sides)
    vec2 c = vec2( ( wp.x + wp.z ) / 0.9, wp.y / 0.32 );
    c.x += floor( c.y ) * 0.5;
    vec2 f = fract( c );
    float e = min( min( f.x, 1.0 - f.x ) * 2.8, min( f.y, 1.0 - f.y ) );
    float aa = 1.0 - smoothstep( 0.05, 0.3, fwidth( c.y ) );
    diffuseColor.rgb *= mix( 1.0, ( 0.86 + 0.18 * hash12( floor( c ) ) ) * mix( 0.7, 1.0, smoothstep( 0.0, 0.06, e ) ), aa );
  } else if ( kind > 10.5 && kind < 11.5 ) { // ground
    float n = vnoise( wp.xz * 0.35 ) * 0.5 + vnoise( wp.xz * 2.1 ) * 0.3 + vnoise( wp.xz * 9.0 ) * 0.2;
    diffuseColor.rgb *= 0.86 + 0.26 * n;
  }
}
#endif
`;function Vo({detail:i=!1,roughness:t=.86,map:e=null,side:n=fn}={}){const s=new ye({vertexColors:!0,roughness:t,metalness:0,map:e,side:n});return i&&(s.defines={LOQ_DETAIL:""}),ce(s,"solid",o=>{o.vertexShader=ne(o.vertexShader,"#include <common>",La),o.vertexShader=ne(o.vertexShader,"#include <fog_vertex>",Da),o.fragmentShader=ne(o.fragmentShader,"#include <common>",Ia),o.fragmentShader=ne(o.fragmentShader,"#include <color_fragment>",W1),o.fragmentShader=ne(o.fragmentShader,"#include <roughnessmap_fragment>","roughnessFactor *= ( vInfo.y > 3.5 && vInfo.y < 4.5 ) ? 0.55 : ( vInfo.y > 7.5 && vInfo.y < 8.5 ) ? 0.45 : 1.0;"),o.fragmentShader=ne(o.fragmentShader,"#include <emissivemap_fragment>",sr),o.fragmentShader=ne(o.fragmentShader,"#include <lights_fragment_begin>",ir)})}function X1({detail:i=!1}={}){const t=new ye({vertexColors:!0,roughness:.78,metalness:0,side:ve});return i&&(t.defines={LOQ_DETAIL:""}),ce(t,"roof",e=>{e.vertexShader=ne(e.vertexShader,"#include <common>",La+"varying vec2 vTileUv;"),e.vertexShader=ne(e.vertexShader,"#include <fog_vertex>",Da+"vTileUv = uv;"),e.fragmentShader=ne(e.fragmentShader,"#include <common>",Ia+`
      varying vec2 vTileUv;
      uniform vec3 uRoofUnder;
      mat3 roofFrame( vec3 eye, vec3 N, vec2 uv ) {
        vec3 q0 = dFdx( eye ); vec3 q1 = dFdy( eye );
        vec2 st0 = dFdx( uv ); vec2 st1 = dFdy( uv );
        vec3 q1p = cross( q1, N ); vec3 q0p = cross( N, q0 );
        vec3 T = q1p * st0.x + q0p * st1.x;
        vec3 B = q1p * st0.y + q0p * st1.y;
        float det = max( dot( T, T ), dot( B, B ) );
        float sc = det == 0.0 ? 0.0 : inversesqrt( det );
        return mat3( T * sc, B * sc, N );
      }
    `),e.fragmentShader=ne(e.fragmentShader,"#include <color_fragment>",`
      float tU = vTileUv.x / 0.27;
      float tV = vTileUv.y / 0.25;
      float tAA = 1.0 - smoothstep( 0.2, 0.6, fwidth( tU ) );
      if ( gl_FrontFacing ) {
        float fu = fract( tU );
        float fv = fract( tV );
        float roll = smoothstep( 0.58, 0.66, fu ) * ( 1.0 - smoothstep( 0.95, 1.0, fu ) );
        float id = hash12( floor( vec2( tU, tV ) ) + vec2( roll * 31.0, 0.0 ) );
        vec3 tc = diffuseColor.rgb;
        tc *= mix( 1.0, mix( 0.8, 1.04, roll ) * ( 0.9 + 0.18 * id ), tAA );
        tc *= mix( 1.0, 0.8 + 0.2 * smoothstep( 0.0, 0.2, fv ), tAA * ( 1.0 - 0.6 * roll ) );
        float lic = vnoise( vTileUv * vec2( 0.9, 0.6 ) ) * 0.7 + vnoise( vTileUv * 3.1 ) * 0.3;
        tc = mix( tc, tc * vec3( 0.95, 0.97, 0.84 ), smoothstep( 0.55, 0.85, lic ) * 0.55 );
        diffuseColor.rgb = tc;
      } else {
        float rf = fract( vTileUv.x / 0.34 );
        float rafter = smoothstep( 0.3, 0.38, rf ) * ( 1.0 - smoothstep( 0.62, 0.7, rf ) );
        diffuseColor.rgb = uRoofUnder * mix( 0.62, 1.0, rafter * tAA + ( 1.0 - tAA ) * 0.5 );
      }
    `),e.fragmentShader=ne(e.fragmentShader,"#include <normal_fragment_begin>",`
      if ( gl_FrontFacing ) {
        mat3 tf = roofFrame( - vViewPosition, normal, vTileUv );
        float fu2 = fract( vTileUv.x / 0.27 );
        float dh = fu2 < 0.62 ? - cos( fu2 / 0.62 * 3.14159 ) * 0.8 : cos( ( fu2 - 0.62 ) / 0.38 * 3.14159 ) * 1.5;
        float aa2 = 1.0 - smoothstep( 0.2, 0.6, fwidth( vTileUv.x / 0.27 ) );
        float fv2 = fract( vTileUv.y / 0.25 );
        float step2 = ( 1.0 - smoothstep( 0.0, 0.12, fv2 ) ) * 0.9;
        normal = normalize( normal - tf[0] * dh * 0.42 * aa2 + tf[1] * step2 * aa2 );
      }
    `),e.fragmentShader=ne(e.fragmentShader,"#include <emissivemap_fragment>",sr),e.fragmentShader=ne(e.fragmentShader,"#include <lights_fragment_begin>",ir)})}function Dn({flex:i=1,flutter:t=.05,translucency:e=.35,side:n=ve,map:s=null,alphaTest:o=0,roughness:r=.9}={}){const a=new ye({vertexColors:!0,roughness:r,metalness:0,side:n,map:s,alphaTest:o});return ce(a,"foliage",l=>{l.vertexShader=ne(l.vertexShader,"#include <common>",La+`
        uniform float uWindTime;
        uniform vec2 uWind;
        uniform float uFlex;
        uniform float uFlutter;
        uniform vec3 uSunDir;
        varying vec3 vSunView;
      `),l.vertexShader=ne(l.vertexShader,"#include <begin_vertex>",`
        {
          #ifdef USE_INSTANCING
            vec3 iPos = instanceMatrix[3].xyz;
            float iS2 = max( dot( instanceMatrix[0].xyz, instanceMatrix[0].xyz ), 1e-4 );
          #else
            vec3 iPos = ( modelMatrix * vec4( position, 1.0 ) ).xyz * 0.15;
            float iS2 = 1.0;
          #endif
          float fl = aInfo.z * uFlex;
          float ph = uWindTime * 1.35 + dot( iPos.xz, vec2( 0.37, 0.23 ) );
          float gust = pow( 0.5 + 0.5 * sin( dot( iPos.xz, uWind ) * 0.045 - uWindTime * 0.75 ), 3.0 );
          vec2 sway = uWind * ( 0.22 + gust * 0.95 ) + vec2( sin( ph ), cos( ph * 0.77 ) ) * 0.16;
          float flut = sin( uWindTime * 6.5 + dot( position, vec3( 7.1, 5.3, 6.7 ) ) ) * uFlutter * aInfo.z;
          vec3 off = vec3( sway.x, - 0.15 * length( sway ) * fl, sway.y ) * fl + vec3( flut, flut * 0.5, - flut );
          #ifdef USE_INSTANCING
            off = ( transpose( mat3( instanceMatrix ) ) * off ) / iS2;
          #endif
          transformed += off;
        }
      `),l.vertexShader=ne(l.vertexShader,"#include <fog_vertex>",Da+"vSunView = normalize( ( viewMatrix * vec4( uSunDir, 0.0 ) ).xyz );"),l.fragmentShader=ne(l.fragmentShader,"#include <common>",Ia+"uniform vec3 uSunColor; uniform float uTranslucency; varying vec3 vSunView;"),l.fragmentShader=ne(l.fragmentShader,"#include <color_fragment>","diffuseColor.rgb *= mix( 0.72, 1.0, vInfo.w );"),l.fragmentShader=ne(l.fragmentShader,"#include <emissivemap_fragment>",sr+`
        {
          float back = pow( max( dot( normalize( vViewPosition ), - vSunView ), 0.0 ), 3.0 );
          totalEmissiveRadiance += diffuseColor.rgb * uSunColor * back * uTranslucency * ( 0.35 + 0.65 * vInfo.w );
        }
      `),l.fragmentShader=ne(l.fragmentShader,"#include <lights_fragment_begin>",ir)},{uFlex:{value:i},uFlutter:{value:t},uTranslucency:{value:e}})}function Eo(i,{open:t=!1,glow:e=.55}={}){const n=new ye({vertexColors:!0,roughness:.92,metalness:0,side:ve,alphaTest:t?.5:0}),s={tLattice:{value:i},uPaperGlow:{value:e},uLatWood:{value:new Rt(4860444)},uLatPaper:{value:new Rt(15787212)}};return n.userData.paperGlow=s.uPaperGlow,t&&(n.defines={LATTICE_OPEN:""}),ce(n,t?"latticeOpen":"lattice",o=>{o.vertexShader=ne(o.vertexShader,"#include <common>",La+"varying vec2 vLatUv;"),o.vertexShader=ne(o.vertexShader,"#include <fog_vertex>",Da+"vLatUv = uv;"),o.fragmentShader=ne(o.fragmentShader,"#include <common>",Ia+"uniform sampler2D tLattice; uniform float uPaperGlow; uniform vec3 uLatWood; uniform vec3 uLatPaper; varying vec2 vLatUv; float latPaper;"),o.fragmentShader=ne(o.fragmentShader,"#include <color_fragment>",`
        {
          float cell = floor( vInfo.y + 0.5 );
          vec2 base = vec2( mod( cell, 2.0 ), floor( cell / 2.0 ) ) * 0.5;
          vec2 luv = vLatUv / 0.62;
          vec2 auv = base + fract( luv ) * 0.5;
          vec4 L = textureGrad( tLattice, auv, dFdx( luv ) * 0.5, dFdy( luv ) * 0.5 );
          latPaper = smoothstep( 0.25, 0.75, L.r );
          vec3 woodC = uLatWood * ( 0.75 + 0.5 * L.b );
          vec3 paperC = uLatPaper * ( 0.9 + 0.2 * L.g );
          diffuseColor.rgb *= mix( woodC, paperC, latPaper );
          #ifdef LATTICE_OPEN
            diffuseColor.a = 1.0 - latPaper;
          #endif
        }
      `),o.fragmentShader=ne(o.fragmentShader,"#include <emissivemap_fragment>",sr+`
        #ifndef LATTICE_OPEN
          totalEmissiveRadiance += diffuseColor.rgb * uLampColor * latPaper * uPaperGlow * uLamp;
        #endif
      `),o.fragmentShader=ne(o.fragmentShader,"#include <lights_fragment_begin>",ir)},s)}function la({roughness:i=.9,map:t=null,walk:e=!1}={}){const n=new ye({vertexColors:!0,roughness:i,metalness:0,map:t});return e&&(n.defines={LOQ_WALK:""}),ce(n,e?"maskedWalk":"masked",s=>{s.vertexShader=ne(s.vertexShader,"#include <common>",`
      attribute float aMask;
      attribute vec4 aInfo;
      varying vec4 vInfo;
      uniform float uTime;
      #ifdef LOQ_WALK
        attribute vec2 iWalk; // phase, stride amount
      #endif
    `),s.vertexShader=ne(s.vertexShader,"#include <color_vertex>",`
      #ifdef USE_INSTANCING_COLOR
        vColor.xyz = color.xyz * mix( vec3( 1.0 ), instanceColor.xyz, aMask );
      #endif
      vInfo = aInfo;
    `,"replace"),s.vertexShader=ne(s.vertexShader,"#include <begin_vertex>",`
      #ifdef LOQ_WALK
        {
          float hem = 1.0 - smoothstep( 0.0, 0.75, position.y );
          float sw = sin( uTime * 5.2 + iWalk.x ) * iWalk.y;
          transformed.z += sw * hem * 0.09;
          transformed.x += cos( uTime * 5.2 + iWalk.x ) * iWalk.y * hem * 0.03;
        }
      #endif
    `),s.fragmentShader=ne(s.fragmentShader,"#include <common>","varying vec4 vInfo; uniform vec3 uLampColor; uniform float uLamp;"),s.fragmentShader=ne(s.fragmentShader,"#include <emissivemap_fragment>",sr),s.fragmentShader=ne(s.fragmentShader,"#include <lights_fragment_begin>",ir)})}function ml({intensity:i=3,color:t=pt.lamp,vertexColors:e=!1}={}){const n=new Ri({color:t,vertexColors:e});n.color.multiplyScalar(i);const s={uGlowK:{value:1}};return n.userData.glowK=s.uGlowK,ce(n,"glow",o=>{o.vertexShader=ne(o.vertexShader,"#include <common>","uniform float uTime; varying float vFlick;"),o.vertexShader=ne(o.vertexShader,"#include <begin_vertex>",`
        {
          #ifdef USE_INSTANCING
            vec2 seed = instanceMatrix[3].xz;
          #else
            vec2 seed = position.xz;
          #endif
          float ph = dot( seed, vec2( 1.7, 2.3 ) );
          vFlick = 0.86 + 0.08 * sin( uTime * 7.3 + ph ) + 0.06 * sin( uTime * 13.1 + ph * 1.7 );
        }
      `),o.fragmentShader=ne(o.fragmentShader,"#include <common>","uniform float uLamp; uniform float uGlowK; varying float vFlick;"),o.fragmentShader=ne(o.fragmentShader,"#include <color_fragment>","diffuseColor.rgb *= vFlick * uLamp * uGlowK;")},s)}const q1=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4( position.xy, 0.0, 1.0 );
  }
`,Y1=`
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
`,Z1=`
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
`,$1=`
  uniform sampler2D tSrc;   // lower (smaller) level, already accumulated
  uniform sampler2D tBase;  // this level's downsample
  uniform vec2 uTexel;      // texel of tSrc
  uniform float uSpread;
  varying vec2 vUv;
  void main() {
    vec2 o = uTexel * uSpread;
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
`,j1=`
  #include <tonemapping_pars_fragment>
  uniform sampler2D tScene;
  uniform sampler2D tBloom;
  uniform sampler2D tPaper;
  uniform float uBloom;
  uniform float uVignette;
  uniform float uGrain;
  uniform float uPaper;
  uniform float uSat;
  uniform float uContrast;
  uniform vec3 uShadowTint;
  uniform vec3 uHighTint;
  uniform float uTime;
  uniform float uFade;
  uniform vec2 uRes;
  varying vec2 vUv;
  float hash( vec2 p ) {
    vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
    p3 += dot( p3, p3.yzx + 33.33 );
    return fract( ( p3.x + p3.y ) * p3.z );
  }
  void main() {
    vec3 c = texture2D( tScene, vUv ).rgb;
    c += texture2D( tBloom, vUv ).rgb * uBloom;
    #if defined( TM_ACES )
      c = ACESFilmicToneMapping( c );
    #elif defined( TM_NEUTRAL )
      c = NeutralToneMapping( c );
    #else
      c = AgXToneMapping( c );
    #endif
    // grade
    float l = dot( c, vec3( 0.2126, 0.7152, 0.0722 ) );
    c = mix( vec3( l ), c, uSat );
    c = mix( c * uShadowTint, c * uHighTint, smoothstep( 0.05, 0.75, l ) );
    c = clamp( ( c - 0.5 ) * uContrast + 0.5, 0.0, 1.0 );
    // vignette (elliptical, soft)
    vec2 q = vUv - 0.5;
    q.x *= mix( 1.0, uRes.x / uRes.y, 0.5 );
    float v = smoothstep( 0.82, 0.28, length( q ) );
    c *= mix( 1.0 - uVignette, 1.0, v );
    // xuan paper: fibre texture + fine grain (also dithers gradients)
    float paper = texture2D( tPaper, vUv * uRes / 384.0 ).r - 0.5;
    c *= 1.0 + paper * uPaper;
    c += ( hash( vUv * uRes + fract( uTime ) * 61.0 ) - 0.5 ) * uGrain;
    // fade from paper colour (intro)
    c = mix( vec3( 0.93, 0.88, 0.8 ), c, uFade );
    gl_FragColor = vec4( c, 1.0 );
    #include <colorspace_fragment>
  }
`;function K1(i=256){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d");e.fillStyle="rgb(128,128,128)",e.fillRect(0,0,i,i);let n=9;const s=()=>(n=n*16807%2147483647)/2147483647;for(let r=0;r<900;r++){const a=s()*i,c=s()*i,l=s()*Math.PI,u=6+s()*30;e.strokeStyle=s()<.5?"rgba(170,170,170,0.18)":"rgba(80,80,80,0.14)",e.lineWidth=.6+s()*1.2;for(const f of[-i,0,i])for(const d of[-i,0,i])e.beginPath(),e.moveTo(a+f,c+d),e.quadraticCurveTo(a+f+Math.cos(l)*u*.5+(s()-.5)*6,c+d+Math.sin(l)*u*.5,a+f+Math.cos(l)*u,c+d+Math.sin(l)*u),e.stroke()}for(let r=0;r<2600;r++)e.fillStyle=s()<.5?"rgba(160,160,160,0.25)":"rgba(96,96,96,0.25)",e.fillRect(s()*i,s()*i,1,1);const o=new ji(t);return o.wrapS=o.wrapT=Wo,o.colorSpace=Jn,o}function J1(i,t){const e=i.getContext(),n=i.extensions,o=n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float")?gs:ei,r=e.getParameter(e.MAX_SAMPLES)||0,a=Math.min(t.msaa,r),c={type:o,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1,minFilter:_n,magFilter:_n},l=new Xn(4,4,{type:o,samples:a,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1}),u=t.bloomLevels,f=[],d=[];for(let y=0;y<u;y++)f.push(new Xn(4,4,c)),d.push(new Xn(4,4,c));const h=new Gt;h.setAttribute("position",new at([-1,-1,0,3,-1,0,-1,3,0],3)),h.setAttribute("uv",new at([0,0,2,0,0,2],2));const g=new Il(-1,1,1,-1,0,1),x=new Wt(h,null);x.frustumCulled=!1;const p=new Bf;p.add(x);const m=(y,E)=>new Xe({vertexShader:q1,fragmentShader:y,uniforms:E,depthTest:!1,depthWrite:!1,toneMapped:!1}),v=m(Y1,{tSrc:{value:null},uTexel:{value:new rt},uThreshold:{value:1.05},uKnee:{value:.45}}),M=m(Z1,{tSrc:{value:null},uTexel:{value:new rt}}),_=m($1,{tSrc:{value:null},tBase:{value:null},uTexel:{value:new rt},uSpread:{value:1}}),w=m(j1,{tScene:{value:l.texture},tBloom:{value:d[0].texture},tPaper:{value:K1()},uBloom:{value:.32},uVignette:{value:.32},uGrain:{value:.011},uPaper:{value:.07},uSat:{value:1.12},uContrast:{value:1.04},uShadowTint:{value:new C(.9,.96,1.08)},uHighTint:{value:new C(1.04,1,.95)},uTime:{value:0},uFade:{value:1},uRes:{value:new rt(1,1)}});[v,M,_,w].forEach(y=>y.userData.loqPatched=!0);let b="aces";try{b=new URLSearchParams(location.search).get("tm")||b}catch{}b==="aces"?w.defines={TM_ACES:""}:b==="neutral"&&(w.defines={TM_NEUTRAL:""});const A=new rt;function R(y,E){l.setSize(y,E);let U=Math.max(1,Math.round(y/t.bloomStart)),N=Math.max(1,Math.round(E/t.bloomStart));for(let P=0;P<u;P++)f[P].setSize(U,N),d[P].setSize(U,N),U=Math.max(1,Math.round(U/2)),N=Math.max(1,Math.round(N/2));w.uniforms.uRes.value.set(y,E),A.set(y,E)}function S(y,E){x.material=y,i.setRenderTarget(E),i.render(p,g)}return{sceneRT:l,uniforms:w.uniforms,bright:v.uniforms,setSize:R,render(y,E,U){i.setRenderTarget(l),i.render(y,E),v.uniforms.tSrc.value=l.texture,v.uniforms.uTexel.value.set(1/A.x,1/A.y),S(v,f[0]);for(let P=1;P<u;P++)M.uniforms.tSrc.value=f[P-1].texture,M.uniforms.uTexel.value.set(1/f[P-1].width,1/f[P-1].height),S(M,f[P]);let N=f[u-1];for(let P=u-2;P>=0;P--)_.uniforms.tSrc.value=N.texture,_.uniforms.tBase.value=f[P].texture,_.uniforms.uTexel.value.set(1/N.width,1/N.height),S(_,d[P]),N=d[P];w.uniforms.tBloom.value=u>1?d[0].texture:f[0].texture,w.uniforms.uTime.value=U,S(w,null)}}}function Q1({minScale:i=.6,onChange:t=()=>{}}={}){let e=1,n=0,s=0,o=0,r=16,a=0;return{get scale(){return e},get ms(){return r},sample(c){const l=c*1e3;if(l>250||(a++,a<90)||(r+=(l-r)*.05,n+=l,s++,n<1500))return;const u=n/s;n=0,s=0,u>26&&e>i?(e=Math.max(i,e*.85),o=0,t(e)):u<14.5?(o++,o>=4&&e<1&&(e=Math.min(1,e*1.1),o=0,t(e))):o=0}}}function ee(i=1){let t=i>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function zr(i,t){let e=Math.imul(i|0,374761393)+Math.imul(t|0,668265263);return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}const Nh=i=>i*i*(3-2*i);function Pe(i,t){const e=Math.floor(i),n=Math.floor(t),s=Nh(i-e),o=Nh(t-n),r=zr(e,n),a=zr(e+1,n),c=zr(e,n+1),l=zr(e+1,n+1);return r+(a-r)*s+(c-r)*o+(r-a-c+l)*s*o}function ua(i,t,e=4,n=2.03,s=.5){let o=0,r=.5,a=0;for(let c=0;c<e;c++)o+=Pe(i,t)*r,a+=r,i=i*n+17.3,t=t*n-9.1,r*=s;return o/a}function ha(i,t,e=4){let n=0,s=.5,o=0;for(let r=0;r<e;r++){const a=1-Math.abs(Pe(i,t)*2-1);n+=a*a*s,o+=s,i=i*2.1+5.7,t=t*2.1-3.3,s*=.5}return n/o}const on=(i,t,e)=>i<t?t:i>e?e:i,To=(i,t,e)=>i+(t-i)*e,me=(i,t,e)=>{const n=on((e-i)/(t-i),0,1);return n*n*(3-2*n)};function Ci(i,t=i){const e=document.createElement("canvas");return e.width=i,e.height=t,[e,e.getContext("2d")]}function fo(i,{repeat:t=null,srgb:e=!0}={}){const n=new ji(i);return e&&(n.colorSpace=We),n.anisotropy=8,t&&(n.wrapS=n.wrapT=Wo,n.repeat.set(t,t)),n}function ql(i,t,e,n,s=1){for(let o=0;o<t*e/900;o++){const r=n()*t,a=n()*e,c=6+n()*40;i.fillStyle=`rgba(${n()<.5?"255,250,240":"120,96,70"},${.03*s})`,i.beginPath(),i.arc(r,a,c,0,Math.PI*2),i.fill()}i.lineWidth=1;for(let o=0;o<t*e/500;o++){const r=n()*t,a=n()*e,c=n()*Math.PI,l=3+n()*12;i.strokeStyle=`rgba(110,90,60,${.06*s})`,i.beginPath(),i.moveTo(r,a),i.lineTo(r+Math.cos(c)*l,a+Math.sin(c)*l),i.stroke()}}function t_(i=1024){const[t,e]=Ci(i),n=ee(7);e.fillStyle="#b2a690",e.fillRect(0,0,i,i);let s=0;for(;s<i;){const o=i/(5+Math.floor(n()*3)),r=Math.min(o,i-s);let a=-n()*120;for(;a<i;){const c=110+n()*190,l=74+n()*4,u=n()*6;e.fillStyle=`hsl(${33+u}, ${15+n()*6}%, ${l}%)`,e.fillRect(a+1.5,s+1.5,c-3,r-3);for(let f=0;f<14;f++)e.fillStyle=`rgba(${n()<.5?"255,248,235":"90,75,55"},0.035)`,e.beginPath(),e.ellipse(a+n()*c,s+n()*r,10+n()*50,6+n()*30,n()*3,0,Math.PI*2),e.fill();a+=c}s+=r}return ql(e,i,i,n,.8),fo(t,{repeat:9})}function e_(i=1024,t=128){const[e,n]=Ci(i,t),s=ee(11),o=n.createImageData(i,t),r=48,a=Array.from({length:r},()=>.55+s()*.5),c=Array.from({length:r},()=>s()*10);for(let l=0;l<i;l++){const u=l/i;for(let f=0;f<t;f++){const d=f/t,h=Math.min(r-1,Math.floor(d*r)),g=Math.min(d,1-d)*2;let x=Math.min(1,g*6);const p=en.smoothstep(u,a[h]-.25,a[h]),m=Math.sin(u*80+c[h])*.5+.5;x*=1-p*(.55+.45*m),x*=g>.12+s()*.08?1:.4;const v=(f*i+l)*4;o.data[v]=o.data[v+1]=o.data[v+2]=255,o.data[v+3]=Math.max(0,Math.min(255,x*255*(.85+s()*.15)))}}return n.putImageData(o,0,0),fo(e)}function n_(i=1024,t=384){const[e,n]=Ci(i,t);n.fillStyle="#efe4cf",n.fillRect(0,0,i,t),ql(n,i,t,ee(21),1.2);const s=[{seed:4,tone:"rgba(60,58,56,0.25)",base:.55,amp:.25},{seed:9,tone:"rgba(40,38,36,0.45)",base:.7,amp:.22},{seed:2,tone:"rgba(30,28,26,0.7)",base:.88,amp:.14}];for(const o of s){const r=ee(o.seed),a=[2+r()*3,5+r()*6,13+r()*9],c=a.map(()=>r()*6);n.beginPath(),n.moveTo(0,t);for(let u=0;u<=i;u+=4){const f=u/i,d=Math.sin(f*a[0]+c[0])*.6+Math.sin(f*a[1]+c[1])*.3+Math.sin(f*a[2]+c[2])*.1;n.lineTo(u,t*(o.base-d*o.amp))}n.lineTo(i,t);const l=n.createLinearGradient(0,t*.2,0,t);l.addColorStop(0,o.tone),l.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=l,n.fill()}return n.fillStyle="rgba(176,67,44,0.75)",n.beginPath(),n.arc(i*.78,t*.22,t*.07,0,Math.PI*2),n.fill(),n.fillRect(i*.06,t*.1,t*.07,t*.07),fo(e)}function i_(i=256){const[t,e]=Ci(i),n=e.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);return n.addColorStop(0,"rgba(255,255,255,0)"),n.addColorStop(.72,"rgba(255,255,255,0)"),n.addColorStop(.88,"rgba(255,255,255,0.9)"),n.addColorStop(.94,"rgba(255,255,255,0.35)"),n.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=n,e.fillRect(0,0,i,i),fo(t)}function s_(i=128,t=192){const[e,n]=Ci(i,t);n.fillStyle="#f6eedf",n.fillRect(0,0,i,t),ql(n,i,t,ee(17),1.5);const s=ee(31);n.strokeStyle="rgba(36,32,29,0.75)",n.lineCap="round";for(let o=0;o<3;o++){const r=i*(.72-o*.24);let a=t*.12;for(;a<t*(.6+s()*.3);)n.lineWidth=3+s()*3,n.beginPath(),n.moveTo(r-6+s()*4,a),n.lineTo(r+6-s()*4,a+6+s()*8),n.stroke(),a+=16+s()*6}return n.fillStyle="#b0432c",n.fillRect(i*.12,t*.8,16,16),fo(e)}function o_(i=1024){const[t,e]=Ci(i),n=i/2,s=ee(41),o=[[0,n],[n,n],[0,0],[n,0]],r=e.createImageData(i,i);for(let f=0;f<i;f++)for(let d=0;d<i;d++){const h=(f*i+d)*4;r.data[h]=255,r.data[h+1]=110+Math.floor(s()*60+50*Math.sin(d*.07+f*.013)*Math.sin(f*.05)),r.data[h+2]=128+Math.floor(60*Math.sin(d*.9+Math.sin(f*.05)*3)*.5+s()*30),r.data[h+3]=255}e.putImageData(r,0,0);const a="rgb(0,128,150)",c=n,l=(f,d,h,g,x,p,m)=>{e.save(),e.beginPath(),e.rect(f,d,c,c),e.clip(),e.strokeStyle=a,e.lineWidth=m,e.lineCap="square";for(const v of[-c,0,c])for(const M of[-c,0,c])e.beginPath(),e.moveTo(f+h+v,d+g+M),e.lineTo(f+x+v,d+p+M),e.stroke();e.restore()};{const[f,d]=o[0];for(let h=0;h<4;h++){const g=h/4*c;l(f,d,g,0,g,c,16),l(f,d,0,g,c,g,16)}for(let h=0;h<4;h++){const g=(h+.5)/4*c;l(f,d,g,0,g,c,6)}}{const[f,d]=o[1],h=20;let g=[[[h,h],[c-h,h],[c-h,c-h],[h,c-h]]];const x=p=>{const m=p.reduce((S,y)=>S+y[0],0)/p.length,v=p.reduce((S,y)=>S+y[1],0)/p.length,M=s()*Math.PI,_=Math.cos(M),w=Math.sin(M),b=S=>(S[0]-m)*w-(S[1]-v)*_,A=[],R=[];for(let S=0;S<p.length;S++){const y=p[S],E=p[(S+1)%p.length],U=b(y),N=b(E);if((U>=0?A:R).push(y),U*N<0){const P=U/(U-N),k=[y[0]+(E[0]-y[0])*P,y[1]+(E[1]-y[1])*P];A.push(k),R.push(k)}}return[A,R].filter(S=>S.length>=3)};for(let p=0;p<4;p++)g=g.flatMap(m=>s()<.92?x(m):[m]);e.save(),e.beginPath(),e.rect(f,d,c,c),e.clip(),e.strokeStyle=a,e.lineJoin="miter",e.lineWidth=12;for(const p of g)e.beginPath(),p.forEach(([m,v],M)=>M?e.lineTo(f+m,d+v):e.moveTo(f+m,d+v)),e.closePath(),e.stroke();e.lineWidth=2*h,e.strokeRect(f,d,c,c),e.restore()}{const[f,d]=o[2],h=c/4;l(f,d,0,0,c,0,14),l(f,d,0,0,0,c,14),l(f,d,0,c/2,c,c/2,12),l(f,d,c/2,0,c/2,c,12);for(const[g,x,p,m]of[[h,h*.5,h,h*1.5],[h*3,h*.5,h*3,h*1.5],[h*.5,h*3,h*1.5,h*3],[h*2.5,h*3,h*3.5,h*3],[h*.6,h,h*1.6,h],[h*2.4,h*3,h*2.4,h*3.6]])l(f,d,g,x,p,m,11)}{const[f,d]=o[3],h=c/8,g=[[0,6],[6,6],[6,2],[2,2],[2,4],[4,4]];for(let x=0;x<g.length-1;x++)l(f,d,g[x][0]*h,g[x][1]*h,g[x+1][0]*h,g[x+1][1]*h,12);l(f,d,0,7.5*h,c,7.5*h,10),l(f,d,0,.5*h,c,.5*h,10),l(f,d,8*h-1,.5*h,8*h-1,7.5*h,10)}const u=new ji(t);return u.colorSpace=Jn,u.anisotropy=8,u.generateMipmaps=!0,u.minFilter=Mi,u}function r_(i,{w:t=512,h:e=160,vertical:n=!1,bg:s="#2a1a12",fg:o="#d8b25a",border:r="#c9a24c",font:a='"Noto Serif SC","Songti SC",STSong,"SimSun",serif',weight:c=700}={}){const[l,u]=Ci(t,e);u.fillStyle=s,u.fillRect(0,0,t,e);const f=ee(i.length*13+7);for(let h=0;h<160;h++)u.fillStyle=`rgba(${f()<.5?"255,230,200":"0,0,0"},0.04)`,u.fillRect(f()*t,f()*e,2+f()*40,1+f()*3);u.strokeStyle=r,u.lineWidth=Math.max(4,Math.min(t,e)*.05),u.strokeRect(u.lineWidth,u.lineWidth,t-u.lineWidth*2,e-u.lineWidth*2),u.fillStyle=o,u.textAlign="center",u.textBaseline="middle";const d=[...i];if(n){const h=e*.86/d.length;u.font=`${c} ${Math.min(t*.62,h*.86)}px ${a}`,d.forEach((g,x)=>u.fillText(g,t/2,e*.07+h*(x+.5)))}else{const h=t*.84/d.length;u.font=`${c} ${Math.min(e*.62,h*.9)}px ${a}`,d.forEach((g,x)=>u.fillText(g,t*.08+h*(x+.5),e/2+2))}return fo(l)}function a_(i,t){const e=i.width,n=i.height,s=i.getContext("2d").getImageData(0,0,e,n).data,o=t.getContext("2d").getImageData(0,0,e,n).data,r=new Uint8Array(e*n*4);for(let c=0;c<n;c++)for(let l=0;l<e;l++){const u=(c*e+l)*4,f=((n-1-c)*e+l)*4;r[f]=s[u],r[f+1]=s[u+1],r[f+2]=s[u+2],r[f+3]=o[u]}const a=new Hf(r,e,n,Ln);return a.colorSpace=We,a.generateMipmaps=!0,a.minFilter=Mi,a.magFilter=_n,a.anisotropy=4,a.needsUpdate=!0,a}function Qf(i=512){const[t,e]=Ci(i),[n,s]=Ci(i);e.fillStyle="#d8d8d0",e.fillRect(0,0,i,i),s.fillStyle="#000",s.fillRect(0,0,i,i);const o=i/2,r=ee(61),a=[[0,o],[o,o],[0,0],[o,0]],c=(l,u,f,d,h,g,x)=>{if(l.save(),l.translate(f,d),l.rotate(g),l.fillStyle=x,l.beginPath(),u===0)l.moveTo(0,0),l.quadraticCurveTo(h*.42,-h*.45,0,-h),l.quadraticCurveTo(-h*.42,-h*.45,0,0);else if(u===1)l.moveTo(0,0),l.lineTo(-h*.08,-h*.35),l.quadraticCurveTo(-h*.62,-h*.62,-h*.42,-h*.95),l.quadraticCurveTo(0,-h*1.1,h*.42,-h*.95),l.quadraticCurveTo(h*.62,-h*.62,h*.08,-h*.35),l.closePath();else if(u===3){for(let p=0;p<5;p++){const m=-Math.PI/2+(p-2)/2*1.1,v=p===2?h:h*.8;l.lineTo(Math.cos(m)*v,Math.sin(m)*v),l.lineTo(Math.cos(m+.28)*v*.42,Math.sin(m+.28)*v*.42)}l.lineTo(0,0)}l.fill(),l.restore()};for(let l=0;l<4;l++){const[u,f]=a[l],d=u+o/2,h=f+o/2,g=o*.42;if(l===2){for(let m=0;m<26;m++){const v=r()*Math.PI*2,M=Math.sqrt(r())*g*.75,_=d+Math.cos(v)*M,w=h+Math.sin(v)*M;for(let b=0;b<16;b++){const A=r()*Math.PI*2,R=o*(.06+r()*.06),S=170+Math.floor(r()*85);for(const[y,E]of[[e,`rgb(${S},${S},${S-8})`],[s,"#fff"]])y.strokeStyle=E,y.lineWidth=2,y.beginPath(),y.moveTo(_,w),y.lineTo(_+Math.cos(A)*R,w+Math.sin(A)*R),y.stroke()}}continue}const x=l===0?0:l===1?1:3,p=x===0?60:x===1?46:40;for(let m=0;m<p;m++){const v=r()*Math.PI*2,M=Math.sqrt(r())*g,_=d+Math.cos(v)*M,w=h+Math.sin(v)*M,b=o*(x===0?.13:.12)*(.75+r()*.5),A=v+Math.PI/2+(r()-.5)*1.2,R=196+Math.floor(r()*59);c(e,x,_,w,b,A,`rgb(${R},${R},${R-6})`),c(s,x,_,w,b,A,"#fff")}}return a_(t,n)}const B={plain:0,wood:1,plaster:2,stone:3,lacquer:4,brick:5,boards:6,paint:7,gold:8,cloth:9},An=new C,zn=new C,c_=new C,Br=new Zt,l_=new vt,os=new vt,Zn=new Rt,Gs=new wn,fa=new dn(0,0,0,"YXZ"),ta=new C,td=new C,Fh=new Map;function or(i,t){let e=Fh.get(i);return e||(e=t(),Fh.set(i,e)),e}const gl=()=>or("box",()=>{const i=new Ke(1,1,1);return i.translate(0,.5,0),i}),Oh=(i=12,t=1,e=!1)=>or(`cyl${i}_${t.toFixed(3)}_${e}`,()=>{const n=new Ne(t,1,1,i,1,e);return n.translate(0,.5,0),n}),u_=(i=10)=>or(`sph${i}`,()=>new Ki(1,i,Math.max(4,Math.round(i*.6)))),h_=(i=8)=>or(`cone${i}`,()=>{const t=new Ea(1,1,i,1);return t.translate(0,.5,0),t});function kh(i,t,e,n){const s=`cb${i.toFixed(3)}_${t.toFixed(3)}_${e.toFixed(3)}_${n.toFixed(3)}`;return or(s,()=>{n=Math.min(n,i*.45,t*.45,e*.45);const o=i/2,r=t/2,a=e/2,c=[],l=[],u=[],f=(m,v,M,_,w,b,A)=>{c.push(...m,...v,...M,...m,...M,..._);for(let R=0;R<6;R++)l.push(w,b,A);u.push(0,0,1,0,1,1,0,0,1,1,0,1)},d=(m,v,M,_,w,b)=>{c.push(...m,...v,...M);for(let A=0;A<3;A++)l.push(_,w,b);u.push(0,0,1,0,.5,1)},h=(m,v,M,_)=>{const w=_===0?m*o:m*(o-n),b=_===1?v*r:v*(r-n),A=_===2?M*a:M*(a-n);return[w,b,A]};f(h(1,-1,1,0),h(1,-1,-1,0),h(1,1,-1,0),h(1,1,1,0),1,0,0),f(h(-1,-1,-1,0),h(-1,-1,1,0),h(-1,1,1,0),h(-1,1,-1,0),-1,0,0),f(h(-1,1,1,1),h(1,1,1,1),h(1,1,-1,1),h(-1,1,-1,1),0,1,0),f(h(-1,-1,-1,1),h(1,-1,-1,1),h(1,-1,1,1),h(-1,-1,1,1),0,-1,0),f(h(-1,-1,1,2),h(1,-1,1,2),h(1,1,1,2),h(-1,1,1,2),0,0,1),f(h(1,-1,-1,2),h(-1,-1,-1,2),h(-1,1,-1,2),h(1,1,-1,2),0,0,-1);const g=Math.SQRT1_2;for(const m of[-1,1])for(const v of[-1,1]){const M=h(m,v,-1,0),_=h(m,v,1,0),w=h(m,v,1,1),b=h(m,v,-1,1);m*v>0?f(M,b,w,_,m*g,v*g,0):f(M,_,w,b,m*g,v*g,0)}for(const m of[-1,1])for(const v of[-1,1]){const M=h(-1,m,v,1),_=h(1,m,v,1),w=h(1,m,v,2),b=h(-1,m,v,2);m*v>0?f(M,b,w,_,0,m*g,v*g):f(M,_,w,b,0,m*g,v*g)}for(const m of[-1,1])for(const v of[-1,1]){const M=h(m,-1,v,0),_=h(m,1,v,0),w=h(m,1,v,2),b=h(m,-1,v,2);m*v>0?f(M,_,w,b,m*g,0,v*g):f(M,b,w,_,m*g,0,v*g)}const x=1/Math.sqrt(3);for(const m of[-1,1])for(const v of[-1,1])for(const M of[-1,1]){const _=h(m,v,M,0),w=h(m,v,M,1),b=h(m,v,M,2);m*v*M>0?d(_,w,b,m*x,v*x,M*x):d(_,b,w,m*x,v*x,M*x)}const p=new Gt;return p.setAttribute("position",new at(c,3)),p.setAttribute("normal",new at(l,3)),p.setAttribute("uv",new at(u,2)),p.translate(0,r,0),p})}function Bt(i=0,t=0,e=0,n=0,s=1,o=s,r=s,a=0,c=0,l=new vt){return fa.set(a,n,c,"YXZ"),Gs.setFromEuler(fa),l.compose(td.set(i,t,e),Gs,ta.set(s,o,r))}class f_{constructor(){this.p=[],this.n=[],this.uv=[],this.c=[],this.info=[],this.index=[],this.count=0}}class bn{constructor(t=1){this.buckets=new Map,this.stack=[new vt],this.rand=ee(t),this.lamps=[],this.aoFn=null,this.instancer=null}get frame(){return this.stack[this.stack.length-1]}push(t){return this.stack.push(this.frame.clone().multiply(t)),this}pushT(t=0,e=0,n=0,s=0,o=1){return this.push(Bt(t,e,n,s,o,o,o,0,0,os))}pop(){return this.stack.length>1&&this.stack.pop(),this}toWorld(t,e,n,s=new C){return s.set(t,e,n).applyMatrix4(this.frame)}bucket(t){let e=this.buckets.get(t);return e||(e=new f_,this.buckets.set(t,e)),e}lamp(t,e,n,s=6,o=1){this.lamps.push({p:this.toWorld(t,e,n),r:s,k:o})}clearLamps(){this.lamps.length=0}_glowAt(t,e){let n=0;for(const s of this.lamps){const o=s.p.x-t.x,r=s.p.y-t.y,a=s.p.z-t.z,c=o*o+r*r+a*a;if(c>s.r*s.r)continue;const l=Math.sqrt(c)+1e-4,u=1-l/s.r,f=.35+.65*Math.max(0,(o*e.x+r*e.y+a*e.z)/l);n+=s.k*u*u*f}return Math.min(n,2.5)}add(t,e,n,s,o={}){const r=this.bucket(t),a=l_.multiplyMatrices(this.frame,n);Br.getNormalMatrix(a);const c=e.attributes.position,l=e.attributes.normal,u=e.attributes.uv,f=r.count;typeof s=="number"||typeof s=="string"?Zn.set(s):Zn.copy(s),o.jitter&&Zn.multiplyScalar(1+(this.rand()-.5)*2*o.jitter);const d=Zn.r,h=Zn.g,g=Zn.b,x=o.kind!==void 0?o.kind:0,p=o.ao!==void 0?o.ao:1,m=o.flex||0,v=o.glow!==!1&&this.lamps.length>0,M=o.emit||0;for(let _=0;_<c.count;_++){if(An.fromBufferAttribute(c,_).applyMatrix4(a),l?zn.fromBufferAttribute(l,_).applyMatrix3(Br).normalize():zn.set(0,1,0),r.p.push(An.x,An.y,An.z),r.n.push(zn.x,zn.y,zn.z),o.uv){const R=o.uv(An,_,u);r.uv.push(R[0],R[1])}else u?r.uv.push(u.getX(_),u.getY(_)):r.uv.push(0,0);r.c.push(d,h,g);const w=(v?this._glowAt(An,zn):0)+M;let b=p;this.aoFn&&(b*=this.aoFn(An,zn));const A=o.flexFn?o.flexFn(c_.fromBufferAttribute(c,_),_):m;r.info.push(w,x,A,b)}if(e.index){const _=e.index.array;for(let w=0;w<_.length;w++)r.index.push(f+_[w])}else for(let _=0;_<c.count;_++)r.index.push(f+_);if(a.determinant()<0){const _=r.index.length-(e.index?e.index.count:c.count);for(let w=_;w<r.index.length;w+=3){const b=r.index[w+1];r.index[w+1]=r.index[w+2],r.index[w+2]=b}}return r.count+=c.count,this}quad(t,e,n,s,o,r=0,a=0,c=0,l=1){const u=this.bucket(t),f=this.frame;Br.getNormalMatrix(f),Zn.set(o);const d=u.count;zn.set(n[0],n[1],n[2]).applyMatrix3(Br).normalize();for(let h=0;h<4;h++)An.set(e[h][0],e[h][1],e[h][2]).applyMatrix4(f),u.p.push(An.x,An.y,An.z),u.n.push(zn.x,zn.y,zn.z),u.uv.push(s[h][0],s[h][1]),u.c.push(Zn.r,Zn.g,Zn.b),u.info.push(r,a,typeof c=="function"?c(An):c,l);return u.index.push(d,d+1,d+2,d,d+2,d+3),u.count+=4,this}box(t,e,n,s,o,r=0,a=0,c=0,l={}){const u=l.chamfer?kh(n,s,o,l.chamfer):gl(),f=l.chamfer?Bt(r,a,c,l.ry||0,1,1,1,l.rx||0,l.rz||0,os):Bt(r,a,c,l.ry||0,n,s,o,l.rx||0,l.rz||0,os);return this.add(t,u,f,e,l)}cyl(t,e,n,s,o=0,r=0,a=0,c={}){const l=c.rTop!==void 0?c.rTop:n,u=Oh(c.seg||12,l/n,!!c.open);return this.add(t,u,Bt(o,r,a,c.ry||0,n*(c.sx||1),s,n*(c.sz||1),c.rx||0,c.rz||0,os),e,c)}sphere(t,e,n,s=0,o=0,r=0,a={}){const c=u_(a.seg||10);return this.add(t,c,Bt(s,o,r,a.ry||0,n*(a.sx||1),n*(a.sy||1),n*(a.sz||1),a.rx||0,a.rz||0,os),e,a)}cone(t,e,n,s,o=0,r=0,a=0,c={}){const l=h_(c.seg||8);return this.add(t,l,Bt(o,r,a,c.ry||0,n,s,n,c.rx||0,c.rz||0,os),e,c)}beam(t,e,n,s,o,r,a,c,l,u,f={}){const d=r-n,h=a-s,g=c-o,x=Math.hypot(d,h,g),p=Math.atan2(d,g),m=-Math.atan2(h,Math.hypot(d,g));fa.set(m,p,f.roll||0,"YXZ"),Gs.setFromEuler(fa);const v=f.chamfer?kh(l,u,x,f.chamfer):gl(),M=f.chamfer?new vt().makeTranslation(0,-u/2,0):new vt().makeTranslation(0,-.5,0),_=f.chamfer?ta.set(1,1,1):ta.set(l,u,x),w=new vt().compose(td.set((n+r)/2,(s+a)/2,(o+c)/2),Gs,_).multiply(M);return this.add(t,v,w,e,f)}rod(t,e,n,s,o,r,a,c,l,u={}){const f=new C(n,s,o),h=new C(r,a,c).clone().sub(f),g=h.length();Gs.setFromUnitVectors(new C(0,1,0),h.normalize());const x=Oh(u.seg||6,(u.rTop!==void 0?u.rTop:l)/l,!0),p=new vt().compose(f,Gs,ta.set(l,g,l));return this.add(t,x,p,e,u)}inst(t,e,n,s,o=0,r=1,a=null,c=r,l=0,u=0){const f=new vt().multiplyMatrices(this.frame,Bt(e,n,s,o,r,c,r,l,u,os));return this.instancer.add(t,f,a),this}instM(t,e,n=null){return this.instancer.add(t,new vt().multiplyMatrices(this.frame,e),n),this}build(t,e="built"){const n=new we;n.name=e;for(const[s,o]of this.buckets){if(!o.count)continue;const r=t[s];if(!r){console.warn(`[builder] no material for bucket "${s}"`);continue}const a=new Gt;a.setAttribute("position",new at(o.p,3)),a.setAttribute("normal",new at(o.n,3)),a.setAttribute("uv",new at(o.uv,2)),a.setAttribute("color",new at(o.c,3)),a.setAttribute("aInfo",new at(o.info,4)),a.setIndex(o.count>65535?new sa(o.index,1):new ia(o.index,1)),a.computeBoundingSphere(),a.computeBoundingBox();const c=new Wt(a,r.material);if(c.name=`${e}:${s}`,c.castShadow=r.cast!==!1,c.receiveShadow=r.receive!==!1,r.order!==void 0&&(c.renderOrder=r.order),r.layers)for(const l of r.layers)c.layers.enable(l);c.matrixAutoUpdate=!1,c.updateMatrix(),n.add(c)}return this.buckets.clear(),n}toGeometry(t){const e=this.buckets.get(t);if(!e||!e.count)return null;const n=new Gt;return n.setAttribute("position",new at(e.p,3)),n.setAttribute("normal",new at(e.n,3)),n.setAttribute("uv",new at(e.uv,2)),n.setAttribute("color",new at(e.c,3)),n.setAttribute("aInfo",new at(e.info,4)),n.setIndex(e.count>65535?new sa(e.index,1):new ia(e.index,1)),n.computeBoundingSphere(),this.buckets.delete(t),n}stats(){let t=0,e=0;for(const n of this.buckets.values())t+=n.count,e+=n.index.length/3;return{vertices:t,triangles:e}}}class d_{constructor(){this.defs=new Map}define(t,e,n,s={}){this.defs.set(t,{geometry:e,material:n,opts:s,matrices:[],colors:[]})}has(t){return this.defs.has(t)}add(t,e,n=null){const s=this.defs.get(t);if(!s){console.warn(`[instancer] unknown key "${t}"`);return}s.matrices.push(e),s.colors.push(n)}count(t){const e=this.defs.get(t);return e?e.matrices.length:0}build(){const t=new we;t.name="instances";const e={},n=new Rt;for(const[s,o]of this.defs){if(!o.matrices.length)continue;const r=new $e(o.geometry,o.material,o.matrices.length);r.name=`inst:${s}`;const a=o.colors.some(c=>c!==null);if(o.matrices.forEach((c,l)=>{if(r.setMatrixAt(l,c),a){const u=o.colors[l];u===null?n.setRGB(1,1,1):typeof u=="number"?n.set(u):n.copy(u),r.setColorAt(l,n)}}),r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0),r.castShadow=o.opts.cast!==!1,r.receiveShadow=o.opts.receive!==!1,o.opts.layers)for(const c of o.opts.layers)r.layers.enable(c);o.opts.order!==void 0&&(r.renderOrder=o.opts.order),r.computeBoundingSphere(),t.add(r),e[s]=r}return{group:t,meshes:e}}}const p_=new C(0,1,0);function Vs(i,t,e={}){const n=e.upVec||p_,s=i.length,o=t.length,r=e.closed!==!1,a=[],c=[],l=[],u=new C,f=new C,d=new C;let h=0;for(let p=0;p<s;p++){const m=i[p],v=i[Math.max(0,p-1)],M=i[Math.min(s-1,p+1)];u.subVectors(M,v).normalize(),f.crossVectors(u,n),f.lengthSq()<1e-6&&f.set(1,0,0),f.normalize(),d.crossVectors(f,u).normalize(),p>0&&(h+=m.distanceTo(i[p-1]));const _=e.scale?e.scale(p/(s-1)):1;for(let w=0;w<o;w++){const[b,A]=t[w];a.push(m.x+(f.x*b+d.x*A)*_,m.y+(f.y*b+d.y*A)*_,m.z+(f.z*b+d.z*A)*_),c.push(w/(o-1),h)}}const g=r?o:o-1;for(let p=0;p<s-1;p++)for(let m=0;m<g;m++){const v=p*o+m,M=p*o+(m+1)%o,_=(p+1)*o+m,w=(p+1)*o+(m+1)%o;l.push(v,_,M,M,_,w)}let x=new Gt;if(x.setAttribute("position",new at(a,3)),x.setAttribute("uv",new at(c,2)),x.setIndex(l),x=x.toNonIndexed(),x.computeVertexNormals(),e.caps!==!1&&r){const p=m_(i,t,e,n);x=g_([x,p])}return x}function m_(i,t,e,n){const s=[],o=i.length,r=new C,a=new C,c=new C;for(const[u,f]of[[0,-1],[o-1,1]]){const d=i[u],h=i[Math.max(0,u-1)],g=i[Math.min(o-1,u+1)];r.subVectors(g,h).normalize(),a.crossVectors(r,n).normalize(),c.crossVectors(a,r).normalize();const x=e.scale?e.scale(u/(o-1)):1,p=t.map(([v,M])=>new C(d.x+(a.x*v+c.x*M)*x,d.y+(a.y*v+c.y*M)*x,d.z+(a.z*v+c.z*M)*x)),m=p.reduce((v,M)=>v.add(M),new C).multiplyScalar(1/p.length);for(let v=0;v<p.length;v++){const M=p[v],_=p[(v+1)%p.length];f>0?s.push(m.x,m.y,m.z,M.x,M.y,M.z,_.x,_.y,_.z):s.push(m.x,m.y,m.z,_.x,_.y,_.z,M.x,M.y,M.z)}}const l=new Gt;return l.setAttribute("position",new at(s,3)),l.setAttribute("uv",new at(new Array(s.length/3*2).fill(0),2)),l.computeVertexNormals(),l}function g_(i){const t={position:[],normal:[],uv:[]};for(let n of i){n.index&&(n=n.toNonIndexed()),n.attributes.normal||n.computeVertexNormals();const s=n.attributes.position.array,o=n.attributes.normal.array;for(let r=0;r<s.length;r++)t.position.push(s[r]);for(let r=0;r<o.length;r++)t.normal.push(o[r]);if(n.attributes.uv){const r=n.attributes.uv.array;for(let a=0;a<r.length;a++)t.uv.push(r[a])}else for(let r=0;r<n.attributes.position.count*2;r++)t.uv.push(0)}const e=new Gt;return e.setAttribute("position",new at(t.position,3)),e.setAttribute("normal",new at(t.normal,3)),e.setAttribute("uv",new at(t.uv,2)),e}function ni(i,t=12,e=0,n=Math.PI*2){return new zl(i.map(([s,o])=>new rt(Math.max(1e-4,s),o)),t,e,n)}function Yl(i=2,t=1,e=.25,n=2.2){const s=new Aa(1,i),o=s.attributes.position,r=new C,a=t*13.17;for(let l=0;l<o.count;l++){r.fromBufferAttribute(o,l);const u=Pe(r.x*n+a,r.y*n+r.z*.7*n)*.65+Pe(r.z*n*2.1-a,r.y*n*2.1+r.x)*.35;r.multiplyScalar(1+(u-.5)*2*e),o.setXYZ(l,r.x,r.y,r.z)}const c=ed(s);return c.computeVertexNormals(),c}function ed(i,t=1e-4){const e=i.index?i.toNonIndexed():i,n=e.attributes.position,s=new Map,o=[],r=[],a=[],c=e.attributes.uv,l=1/t;for(let f=0;f<n.count;f++){const d=n.getX(f),h=n.getY(f),g=n.getZ(f),x=`${Math.round(d*l)},${Math.round(h*l)},${Math.round(g*l)}`;let p=s.get(x);p===void 0&&(p=o.length/3,s.set(x,p),o.push(d,h,g),r.push(c?c.getX(f):0,c?c.getY(f):0)),a.push(p)}const u=new Gt;return u.setAttribute("position",new at(o,3)),u.setAttribute("uv",new at(r,2)),u.setIndex(a),u}function fs(i,t,e=6,n=8,s=!0){const o=i.computeFrenetFrames(n,!1),r=[],a=[],c=[],l=new C;for(let f=0;f<=n;f++){const d=f/n;i.getPointAt(d,l);const h=o.normals[f],g=o.binormals[f],x=t(d);for(let p=0;p<=e;p++){const m=p/e*Math.PI*2,v=Math.cos(m),M=Math.sin(m);r.push(l.x+x*(v*h.x+M*g.x),l.y+x*(v*h.y+M*g.y),l.z+x*(v*h.z+M*g.z)),a.push(p/e,d)}}for(let f=0;f<n;f++)for(let d=0;d<e;d++){const h=f*(e+1)+d,g=h+e+1;c.push(h,g,h+1,h+1,g,g+1)}if(s){i.getPointAt(1,l);const f=r.length/3;r.push(l.x,l.y,l.z),a.push(.5,1);const d=n*(e+1);for(let h=0;h<e;h++)c.push(d+h,f,d+h+1)}const u=new Gt;return u.setAttribute("position",new at(r,3)),u.setAttribute("uv",new at(a,2)),u.setIndex(c),u.computeVertexNormals(),u}function x_(i,t,e=new C(1,0,0)){const n=[],s=[],o=[],r=i.length;for(let c=0;c<r;c++){const l=c/(r-1),u=typeof t=="function"?t(l):t,f=i[c];if(n.push(f.x-e.x*u,f.y-e.y*u,f.z-e.z*u,f.x+e.x*u,f.y+e.y*u,f.z+e.z*u),s.push(0,l,1,l),c<r-1){const d=c*2;o.push(d,d+2,d+1,d+1,d+2,d+3)}}const a=new Gt;return a.setAttribute("position",new at(n,3)),a.setAttribute("uv",new at(s,2)),a.setIndex(o),a.computeVertexNormals(),a}function eo(i,t,e=12,n=0){const s=new Gl(i,{depth:t,bevelEnabled:n>0,bevelSize:n,bevelThickness:n,bevelSegments:1,curveSegments:e});return s.translate(0,0,-t/2),s}function v_(i=1,t=.12,e=3,n=.15){const s=[],o=[],r=[];for(let c=0;c<=e;c++){const l=c/e,u=t*Math.sin(Math.PI*Math.min(1,l*1.15))*(1-l*.3),f=l*i,d=-n*l*l*i;if(s.push(-u/2,f,d,u/2,f,d),r.push(0,l,1,l),c<e){const h=c*2;o.push(h,h+2,h+1,h+1,h+2,h+3)}}const a=new Gt;return a.setAttribute("position",new at(s,3)),a.setAttribute("uv",new at(r,2)),a.setIndex(o),a.computeVertexNormals(),a}function nd(i,t,e){let n=!1;for(let s=0,o=e.length-1;s<e.length;o=s++){const r=e[s][0],a=e[s][1],c=e[o][0],l=e[o][1];a>t!=l>t&&i<(c-r)*(t-a)/(l-a)+r&&(n=!n)}return n}function no(i,t,e,n=!1){let s=1/0;const o=e.length,r=n?o:o-1;for(let a=0;a<r;a++){const c=e[a],l=e[(a+1)%o],u=l[0]-c[0],f=l[1]-c[1],d=u*u+f*f||1e-9;let h=((i-c[0])*u+(t-c[1])*f)/d;h=h<0?0:h>1?1:h;const g=c[0]+u*h-i,x=c[1]+f*h-t,p=g*g+x*x;p<s&&(s=p)}return Math.sqrt(s)}function id(i,t=96){return new Sn(i.map(([n,s])=>new C(n,0,s)),!0,"centripetal").getSpacedPoints(t).slice(0,t).map(n=>[n.x,n.z])}function Ve(i,t=64){return new Sn(i.map(([n,s])=>new C(n,0,s)),!1,"centripetal").getSpacedPoints(t).map(n=>[n.x,n.z])}let _c=null;function __(){return _c||(_c=ni([[0,0],[.4,0],[.41,.06],[.38,.1],[.33,.2],[.3,.26],[0,.26]],12)),_c}function Zl(i,t,e,n,s,o=.2,r=pt.lacquer,a=12){i.add("solid",__(),Bt(t,e,n,0,o*2.2,1,o*2.2),pt.stone,{kind:B.stone,ao:.8}),i.cyl("solid",r,o,s-.2,t,e+.2,n,{rTop:o*.88,seg:a,kind:B.lacquer,jitter:.03})}function M_(i=1,t=!0){const e=[],n=new Rt(t?3102048:pt.woodDark),s=new Rt(t?4026204:pt.wood),o=new Rt(t?7089182:pt.woodDark),r=(v,M,_,w,b,A,R,S=0)=>e.push({w:v,h:M,d:_,x:w,y:b,z:A,color:R,rx:S});r(.34,.12,.34,0,0,0,n),r(.26,.06,.26,0,-.05,0,n),r(.96,.13,.11,0,.12,0,s),r(.11,.13,.7,0,.12,.02,s);for(const[v,M]of[[-.42,0],[.42,0],[0,.3],[0,-.26]])r(.15,.09,.15,v,.25,M,n);r(1.24,.13,.11,0,.34,0,s),r(.72,.13,.11,0,.34,.3,s),r(.11,.13,1,0,.34,.14,s);for(const[v,M]of[[-.56,0],[.56,0],[-.3,.3],[.3,.3],[0,.6]])r(.14,.08,.14,v,.47,M,n);r(.86,.12,.11,0,.55,.6,s),r(1.4,.12,.11,0,.55,0,s),r(.12,.16,1.5,0,.5,.36,o,-.22),r(.12,.16,1.1,0,.67,.25,s),r(1.5,.08,.22,0,.83,0,o),r(1,.08,.2,0,.83,.6,o);const a=[],c=[],l=[],u=[],f=gl(),d=new vt,h=new Zt,g=new C,x=new C;for(const v of e){Bt(v.x*i,v.y*i,v.z*i,0,v.w*i,v.h*i,v.d*i,v.rx,0,d),h.getNormalMatrix(d);const M=a.length/3,_=f.attributes.position,w=f.attributes.normal;for(let b=0;b<_.count;b++){g.fromBufferAttribute(_,b).applyMatrix4(d),x.fromBufferAttribute(w,b).applyMatrix3(h).normalize(),a.push(g.x,g.y,g.z),c.push(x.x,x.y,x.z);const A=.7+.3*Math.min(1,Math.max(0,(v.z+.3)/.9))*(x.y<-.5?.6:1);l.push(v.color.r*A,v.color.g*A,v.color.b*A)}for(let b=0;b<f.index.count;b++)u.push(M+f.index.array[b])}const p=new Gt;p.setAttribute("position",new at(a,3)),p.setAttribute("normal",new at(c,3)),p.setAttribute("color",new at(l,3)),p.setAttribute("uv",new at(new Array(a.length/3*2).fill(0),2));const m=[];for(let v=0;v<a.length/3;v++)m.push(0,B.wood,0,.85);return p.setAttribute("aInfo",new at(m,4)),p.setIndex(u),p}function Mc(i,t,e,n,s,o,r={}){const a=r.frame||pt.lacquerDark,c=r.ry||0,l=r.pattern!==void 0?r.pattern:0,u=.06;i.pushT(t,e,n,c),i.box("solid",a,u,o,.07,-s/2+u/2,0,0,{kind:B.lacquer}),i.box("solid",a,u,o,.07,s/2-u/2,0,0,{kind:B.lacquer});const f=o*.36;for(const g of[0,f,f+.18,o-u])i.box("solid",a,s-u*2,u,.07,0,g,0,{kind:B.lacquer});i.box("solid",r.panel||6959136,s-u*2,f-u,.04,0,u,0,{kind:B.lacquer}),i.box("solid",r.panel||6959136,s-u*2,.12,.04,0,f+.03,0,{kind:B.lacquer}),i.box("solid",r.inset||9062956,(s-u*2)*.6,(f-u)*.55,.05,0,u+(f-u)*.22,0,{kind:B.lacquer});const d=f+.18+u,h=o-u-d;Si(i,0,d,0,s-u*2,h,l,r.open),i.pop()}function Si(i,t,e,n,s,o,r=0,a=!1,c={}){const l=new Le(s,o);l.translate(t,e+o/2,n);const u=l.attributes.uv;for(let f=0;f<u.count;f++)u.setXY(f,(u.getX(f)-.5)*s+(c.u0||0),u.getY(f)*o+(c.v0||0));i.add(a?"latticeOpen":i.latticeKey||"lattice",l,c.matrix||new vt,c.color||16777215,{kind:r,ao:c.ao!==void 0?c.ao:1,emit:c.emit||0})}function da(i,t,e,n,s,o,r,a=1,c=pt.stone,l={}){const u=Math.max(2,Math.round(o/.16)),f=o/u,d=r/u;for(let h=0;h<u;h++){const g=o-h*f;i.box("solid",c,s,g,d+.02,t,e,n+a*(h+.5)*d,{kind:B.stone,chamfer:.02,jitter:.04})}if(l.sides!==!1){const h=Math.hypot(o,r),g=Math.atan2(o,r);for(const x of[-1,1])i.box("solid",l.sideColor||pt.stoneDark,.32,.22,h,t+x*(s/2+.16),e+o/2-.16,n+a*r/2,{rx:a*g,kind:B.stone,chamfer:.02}),i.box("solid",l.sideColor||pt.stoneDark,.3,o*.5,r*.5,t+x*(s/2+.16),e,n+a*r*.25,{kind:B.stone})}}function y_(i,t,e,n,s,o,r={}){const a=r.top||pt.stoneGrey;i.box("solid",r.side||10787980,n,o-.12,s,t,0,e,{kind:10}),i.box("solid",r.cap||pt.stone,n+.12,.12,s+.12,t,o-.12,e,{kind:B.stone,chamfer:.03}),i.box("solid",a,n-.3,.02,s-.3,t,o,e,{kind:B.brick}),i.box("solid",9406328,n+.18,.14,s+.18,t,0,e,{kind:B.stone,ao:.75})}function zh(i,t,e=.95,n=pt.lacquerDark,s={}){const o=s.post||.09;for(let r=0;r<t.length-1;r++){const[a,c,l]=t[r],[u,f,d]=t[r+1],h=Math.hypot(u-a,d-l),g=Math.atan2(u-a,d-l);if(i.box("solid",n,o,e+.08,o,a,c,l,{kind:B.lacquer}),r===t.length-2&&i.box("solid",n,o,e+.08,o,u,f,d,{kind:B.lacquer}),i.beam("solid",n,a,c+e,l,u,f+e,d,.08,.07,{kind:B.lacquer}),i.beam("solid",n,a,c+e*.45,l,u,f+e*.45,d,.05,.05,{kind:B.lacquer}),i.beam("solid",n,a,c+.08,l,u,f+.08,d,.06,.06,{kind:B.lacquer}),s.lattice!==!1&&h>.3){const x=Bt((a+u)/2,(c+f)/2,(l+d)/2,g+Math.PI/2);Si(i,0,.11,0,h-o,e*.45-.14,s.pattern!==void 0?s.pattern:2,!0,{matrix:x})}}}function ki(i,t,e=.82,n=pt.stone,s={}){for(let o=0;o<t.length-1;o++){const[r,a,c]=t[o],[l,u,f]=t[o+1],d=Math.hypot(l-r,f-c),h=Math.atan2(l-r,f-c),g=-Math.atan2(u-a,d),x=(r+l)/2,p=(a+u)/2,m=(c+f)/2;i.box("solid",n,.18,e,.18,r,a,c,{kind:B.stone,chamfer:.02}),i.sphere("solid",n,.11,r,a+e+.08,c,{seg:8,sy:1.2,kind:B.stone}),o===t.length-2&&(i.box("solid",n,.18,e,.18,l,u,f,{kind:B.stone,chamfer:.02}),i.sphere("solid",n,.11,l,u+e+.08,f,{seg:8,sy:1.2,kind:B.stone})),i.push(Bt(x,p,m,h,1,1,1,g,0)),i.box("solid",s.panel||n,.1,e*.72,d-.18,0,0,0,{kind:B.stone}),i.box("solid",s.inset||11905943,.12,e*.36,(d-.18)*.7,0,e*.18,0,{kind:B.stone}),i.box("solid",n,.14,.08,d-.12,0,e*.78,0,{kind:B.stone,chamfer:.02}),i.pop()}}function sd(i,t,e,n,s,o,r=pt.lacquerDark,a=1){const c=Math.hypot(n-t,s-e),l=Math.atan2(n-t,s-e);i.push(Bt((t+n)/2,o,(e+s)/2,l)),i.box("solid",r,.42,.06,c,0,.42,0,{kind:B.wood,chamfer:.015}),i.box("solid",r,.06,.4,c,a*.18,.02,0,{kind:B.wood});const u=Math.max(3,Math.floor(c/.16));for(let f=0;f<=u;f++){const d=-c/2+f/u*c,h=[new C(a*.2,.48,d),new C(a*.32,.7,d),new C(a*.46,.88,d)];i.add("solid",Vs(h,[[-.018,-.018],[.018,-.018],[.018,.018],[-.018,.018]]),new vt,r,{kind:B.wood})}i.beam("solid",r,a*.48,.9,-c/2,a*.48,.9,c/2,.07,.06,{kind:B.wood}),i.pop()}function od(i,t=16777215,e=B.plain,n=1,s=0){const o=(i.index,i),r=o.attributes.position.count;if(!o.attributes.color){const a=new Rt(t),c=new Float32Array(r*3);for(let l=0;l<r;l++)c[l*3]=a.r,c[l*3+1]=a.g,c[l*3+2]=a.b;o.setAttribute("color",new le(c,3))}if(!o.attributes.aInfo){const a=new Float32Array(r*4);for(let c=0;c<r;c++)a[c*4+1]=e,a[c*4+2]=s,a[c*4+3]=n;o.setAttribute("aInfo",new le(a,4))}return o.attributes.uv||o.setAttribute("uv",new le(new Float32Array(r*2),2)),o}function S_(i){const t=o_(i.name==="low"?512:1024),e=Vo({detail:i.detail}),n=Vo({detail:i.detail,side:ve}),s=X1({detail:i.detail}),o=Eo(t,{open:!1,glow:.32}),r=Eo(t,{open:!0}),a=Eo(t,{open:!1,glow:.35}),c=Eo(t,{open:!1,glow:.35}),l=Eo(t,{open:!1,glow:.32}),u=ml({intensity:3.2,vertexColors:!0,color:16777215}),f=t_(i.name==="low"?512:1024);f.repeat.set(1,1);const d=Vo({detail:!1,map:f,roughness:.92}),h={solid:{material:e,cast:!0,receive:!0,layers:[Oe]},solidDS:{material:n,cast:!0,receive:!0,layers:[Oe]},roof:{material:s,cast:!0,receive:!0,layers:[Oe]},lattice:{material:o,cast:!0,receive:!0,layers:[Oe]},latticeOpen:{material:r,cast:!0,receive:!0},latticeLib:{material:a,cast:!0,receive:!0,layers:[Oe]},latticeQuiet:{material:c,cast:!0,receive:!0,layers:[Oe]},latticeDlg:{material:l,cast:!0,receive:!0,layers:[Oe]},glow:{material:u,cast:!1,receive:!1,layers:[Oe]},paving:{material:d,cast:!1,receive:!0,layers:[Oe]}},g=new d_;g.define("bracket",M_(1,!0),e,{cast:!0,receive:!0});const x=new Ne(.075,.075,.07,8,1);return x.rotateX(Math.PI/2),g.define("eaveTile",od(x,pt.tileDark,B.plain,.9),e,{cast:!1,receive:!0}),{tier:i,atlas:t,mats:{solid:e,solidDS:n,roof:s,lattice:o,latticeOpen:r,latticeLib:a,latticeQuiet:c,latticeDlg:l,glow:u,paving:d},buckets:h,instancer:g}}const b_=`
  varying vec3 vDir;
  void main() {
    vDir = normalize( position );
    vec4 p = projectionMatrix * vec4( mat3( viewMatrix ) * position, 1.0 );
    gl_Position = p.xyww;
  }
`,w_=`
  ${ho}
  ${nr}
  uniform float uTime;
  uniform vec3 uMoonDir;
  uniform float uClouds;
  varying vec3 vDir;

  float fbm( vec2 p ) {
    float s = 0.0;
    float a = 0.5;
    for ( int i = 0; i < 4; i++ ) {
      s += vnoise( p ) * a;
      p = p * 2.07 + vec2( 3.1, -1.7 );
      a *= 0.5;
    }
    return s;
  }

  void main() {
    vec3 dir = normalize( vDir );
    vec3 col = skyColor( dir );
    float s = dot( dir, uSunDir );

    // clouds on a virtual plane, stretched into horizontal streaks
    if ( dir.y > 0.0 && uClouds > 0.0 ) {
      vec2 cp = dir.xz / ( dir.y + 0.07 );
      cp = cp * 0.55 + vec2( uTime * 0.0035, uTime * 0.0012 );
      float c = fbm( cp * vec2( 0.55, 1.9 ) );
      c += 0.35 * fbm( cp * vec2( 1.6, 5.0 ) + 9.0 ) - 0.18;
      float band = smoothstep( 0.02, 0.1, dir.y ) * ( 1.0 - smoothstep( 0.32, 0.75, dir.y ) );
      float m = smoothstep( 0.42, 0.78, c ) * band * uClouds;
      float sunSide = pow( max( s, 0.0 ), 2.0 );
      // underside lit apricot near the sun, lilac grey away from it
      vec3 lit = mix( vec3( 0.93, 0.62, 0.46 ), vec3( 1.25, 0.82, 0.48 ), sunSide ) * uSkyDim;
      vec3 shade = mix( col * vec3( 0.86, 0.82, 0.86 ), col * 0.9, sunSide );
      float rim = smoothstep( 0.55, 0.85, c );
      vec3 cc = mix( lit, shade, rim * 0.7 );
      col = mix( col, cc, m * 0.75 );
    }

    // sun disc (HDR, so bloom catches it) with a soft corona
    float disc = smoothstep( 0.99955, 0.99975, s );
    col += vec3( 9.0, 6.4, 3.8 ) * disc * uSkyDim;
    col += vec3( 1.0, 0.62, 0.3 ) * pow( max( s, 0.0 ), 900.0 ) * 1.6 * uSkyDim;

    // moon: pale, slightly mottled
    float md = dot( dir, uMoonDir );
    float moon = smoothstep( 0.99968, 0.99982, md );
    if ( moon > 0.0 ) {
      vec3 mc = vec3( 1.0, 0.97, 0.9 ) * ( 0.82 + 0.18 * vnoise( dir.xy * 900.0 ) );
      col = mix( col, mc * 1.15, moon * 0.85 );
    }

    // gentle darkening below the horizon (only seen through gaps)
    col *= 1.0 - 0.25 * smoothstep( 0.0, -0.2, dir.y );
    gl_FragColor = vec4( col, 1.0 );
  }
`;function E_(){const i=en.degToRad(78),t=en.degToRad(17),e=new C(Math.sin(i)*Math.cos(t),Math.sin(t),-Math.cos(i)*Math.cos(t)),n=new Xe({vertexShader:b_,fragmentShader:w_,uniforms:Object.assign({},De,{uMoonDir:{value:e},uClouds:{value:1}}),side:sn,depthWrite:!1,fog:!1});n.userData.loqPatched=!0;const s=new Wt(new Ki(10,48,24),n);return s.name="sky",s.frustumCulled=!1,s.renderOrder=-100,{mesh:s,material:n}}const T_=`
  attribute float aH;      // 0 at the misty foot, 1 at the crest
  attribute float aRidge;  // world height of this column's crest
  varying float vH;
  varying vec3 vWorld;
  varying float vAng;
  void main() {
    vH = aH;
    vec4 wp = modelMatrix * vec4( position, 1.0 );
    vWorld = wp.xyz;
    vAng = atan( position.z, position.x );
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,A_=`
  ${ho}
  ${nr}
  uniform vec3 uInk;
  uniform float uHaze;      // base haze for this layer (0 near … 1 far)
  uniform float uMist;      // how strongly the foot dissolves
  uniform float uSeed;
  uniform vec3 uSunColor;
  varying float vH;
  varying vec3 vWorld;
  varying float vAng;
  void main() {
    vec3 dir = normalize( vWorld - cameraPosition );
    vec3 sky = skyColor( normalize( vec3( dir.x, max( dir.y, 0.0 ) * 0.4, dir.z ) ) );
    // texture strokes: vertical streaks strongest just below the crest
    float strokes = vnoise( vec2( vAng * 260.0 + uSeed, vWorld.y * 0.035 ) ) * 0.6 + vnoise( vec2( vAng * 900.0 - uSeed, vWorld.y * 0.12 ) ) * 0.4;
    float crest = smoothstep( 0.55, 1.0, vH );
    vec3 ink = uInk * ( 0.82 + 0.32 * strokes * ( 0.4 + 0.6 * crest ) );
    // sun-facing slopes catch a little warm light
    vec2 out2 = normalize( vWorld.xz );
    float facing = max( dot( out2, - normalize( uSunDir.xz ) ), 0.0 );
    ink += uSunColor * 0.05 * facing * crest;
    // mist: the foot fades into the sky colour, drifting bands cut across
    float band = vnoise( vec2( vAng * 7.0 + uSeed, vWorld.y * 0.02 ) );
    float mist = pow( 1.0 - vH, 1.6 ) * uMist + band * 0.12 * ( 1.0 - crest );
    float haze = clamp( uHaze + mist, 0.0, 1.0 );
    vec3 col = mix( ink, sky, haze );
    gl_FragColor = vec4( col, 1.0 );
  }
`,Bh=[{r:640,base:-40,h0:40,amp:70,freq:3.5,seed:11,ink:5660767,haze:.38,mist:.75,sharp:.4},{r:980,base:-60,h0:70,amp:120,freq:2.6,seed:23,ink:6056048,haze:.52,mist:.6,sharp:.6},{r:1500,base:-100,h0:110,amp:250,freq:2,seed:37,ink:6976640,haze:.66,mist:.5,sharp:1},{r:2300,base:-150,h0:180,amp:330,freq:1.4,seed:51,ink:8160656,haze:.8,mist:.4,sharp:.8}];function C_(i,t){const e=Math.cos(t)*i.freq,n=Math.sin(t)*i.freq,s=ha(e+i.seed,n-i.seed,5),o=Pe(e*2.3+40+i.seed,n*2.3),r=Math.pow(Math.max(0,Pe(e*4.1+i.seed*2,n*4.1)-.55)/.45,2.2)*i.sharp;let a=i.h0+i.amp*(.55*s+.3*o+.75*r);const c=Math.atan2(ca.z,ca.x);let l=Math.abs((t-c+Math.PI*3)%(Math.PI*2)-Math.PI);const u=Math.exp(-(l*l)/(2*.09*.09));return a*=1-.62*u,a}function R_({low:i=!1}={}){const t=new we;return t.name="mountains",(i?Bh.slice(0,3):Bh).forEach((n,s)=>{const o=i?300:520,r=7,a=[],c=[],l=[],u=[];for(let g=0;g<=o;g++){const x=g/o*Math.PI*2,p=C_(n,x),m=n.r*(1+(Pe(Math.cos(x)*3+n.seed,Math.sin(x)*3)-.5)*.12);for(let v=0;v<=r;v++){const M=v/r,_=n.base+(p-n.base)*Math.pow(M,.8),w=m*(1+(1-M)*.06);a.push(Math.cos(x)*w,_,Math.sin(x)*w),c.push(M),l.push(p)}}for(let g=0;g<o;g++)for(let x=0;x<r;x++){const p=g*(r+1)+x,m=p+r+1;u.push(p,m,p+1,p+1,m,m+1)}const f=new Gt;f.setAttribute("position",new at(a,3)),f.setAttribute("aH",new at(c,1)),f.setAttribute("aRidge",new at(l,1)),f.setIndex(u);const d=new Xe({vertexShader:T_,fragmentShader:A_,uniforms:Object.assign({},De,{uInk:{value:new Rt(n.ink)},uHaze:{value:n.haze},uMist:{value:n.mist},uSeed:{value:n.seed}}),side:ve,fog:!1,depthWrite:!0});d.userData.loqPatched=!0;const h=new Wt(f,d);h.name=`range${s}`,h.frustumCulled=!1,h.renderOrder=-50+s*-1,t.add(h)}),t}const Yt={x0:-58,x1:54,z0:-54,z1:46},Pn={x:0,z:46},Fo={x:0,z:23.5},xl={x:0,z:1},Hn={x:0,z:-32,terraceH:1.25},He={x:-38,z:-31},xn={x:-37.5,z:9.6},vn={x:35.5,z:-27},Oo={x:34,z:25},Ce=-.42,Yi=-1.15,Gn=id([[-53,19],[-47,14.6],[-38,14.2],[-29,15.2],[-23.5,19.5],[-22.5,27],[-26,34],[-33,38.5],[-42,39.5],[-50,36],[-55.5,28]],120),Zs=id([[-45.5,27.5],[-43,25.6],[-40.2,26.6],[-40.4,29.6],[-43.5,31]],32),io=Ve([[-78,-150],[-66,-112],[-58,-84],[-49,-64],[-47.5,-52],[-50,-40],[-53,-26],[-51.5,-12],[-53,-1],[-53.5,10],[-52.5,19]],110),rr=Ve([[-37,39],[-38,43],[-39,47],[-38,55],[-34,63],[-30,71],[-29,77]],40),nn=i=>79+6.5*Math.sin(i*.011+.6)+3*Math.sin(i*.031-1.2),Mn=9.5,gi=[{pts:Ve([[0,46],[0,60],[.5,70]],20),w:3.2,kind:"stone"},{pts:Ve([[.5,88],[2,104],[8,126],[20,150],[24,190]],50),w:2.1,kind:"earth"},{pts:Ve([[1,96],[-20,101],[-50,108],[-80,118],[-105,128]],50),w:1.8,kind:"earth"},{pts:Ve([[-2,62],[-30,63],[-60,67],[-90,70],[-130,66]],50),w:1.5,kind:"earth"},{pts:Ve([[2,62],[30,64],[60,66],[90,64],[120,58]],50),w:1.5,kind:"earth"},{pts:Ve([[-36,-54],[-44,-70],[-62,-100],[-80,-132],[-92,-160]],60),w:1.3,kind:"earth"},{pts:Ve([[54,-20],[72,-26],[96,-36],[118,-44]],40),w:1.3,kind:"earth"}],Ko=[{pts:Ve([[-18.5,-9],[-24,-12],[-30,-17],[-36,-21],[-38,-24.5]],30),w:1.05},{pts:Ve([[-38,-24.5],[-44,-20],[-49,-14],[-52,-8]],20),w:.9},{pts:Ve([[-18.6,13],[-21,11],[-27,9.5],[-31,9.5]],16),w:1},{pts:Ve([[-44,9.5],[-50,10],[-55,14]],12),w:.9},{pts:Ve([[-21,37],[-24,42],[-32,43.5],[-44,43],[-52,41]],24),w:.95},{pts:Ve([[18.6,12],[24,15],[30,20],[34,25]],16),w:1},{pts:Ve([[34,25],[40,30],[46,36],[50,41]],16),w:.9},{pts:Ve([[18.6,-8],[24,-8.5],[30,-9.5]],10),w:1.1}],rd=[];function un(i,t,e,n,s=0){rd.push({x0:Math.min(i,e)-s,z0:Math.min(t,n)-s,x1:Math.max(i,e)+s,z1:Math.max(t,n)+s})}function ad(i,t){for(const e of rd)if(i>e.x0&&i<e.x1&&t>e.z0&&t<e.z1)return!0;return!1}const $l=(i,t,e=0)=>i>Yt.x0+e&&i<Yt.x1-e&&t>Yt.z0+e&&t<Yt.z1-e;function jl(i,t){const e=(Yt.x0+Yt.x1)/2,n=(Yt.z0+Yt.z1)/2,s=(Yt.x1-Yt.x0)/2,o=(Yt.z1-Yt.z0)/2,r=Math.abs(i-e)-s,a=Math.abs(t-n)-o,c=Math.max(r,0),l=Math.max(a,0);return Math.hypot(c,l)+Math.min(Math.max(r,a),0)}function po(i,t){const e=no(i,t,Gn,!0);return nd(i,t,Gn)?-e:e}function Kl(i,t){const e=no(i,t,Zs,!0);return nd(i,t,Zs)?-e:e}const Ua=(i,t)=>Math.min(no(i,t,io),no(i,t,rr));function cd(i,t){let e=1/0;for(const n of gi)e=Math.min(e,no(i,t,n.pts)-n.w);return e}function ld(i,t){let e=1/0;for(const n of Ko)e=Math.min(e,no(i,t,n.pts)-n.w);return e}function P_(i,t,e){return t>-60?Ce-.65:Math.max(Ce-.65,e-1.4)}function Hh(i,t){const e=jl(i,t),n=me(6,34,e),s=me(-66,-300,t),o=me(-76,-320,i),r=me(68,320,i),a=me(230,430,t);let c=Math.max(s,o*.9,r*.85,a*.7);c=c*(.6+.4*c);const l=ua(i*.0058+3.1,t*.0058-1.7,5),u=ha(i*.0085+7,t*.0085+2,4),f=ha(i*.02-3,t*.02+5,3);let d=c*(10+52*l+30*u+9*f);return d+=44*Math.exp(-((i+96)**2+(t+176)**2)/(2*42*42)),d+=24*Math.exp(-((i-124)**2+(t+46)**2)/(2*30*30)),d+=me(0,50,e)*(ua(i*.021,t*.021,3)-.42)*2.6,d*n}function ti(i,t){let e=Hh(i,t);const n=Math.abs(t-nn(i));if(n<Mn+7){const r=me(Mn+7,Mn-1.5,n),a=Yi-1.6*me(Mn+1,0,n)-.3;e=To(e,Math.min(e,a),r)}const s=Ua(i,t);if(s<4.2){const r=t<-60?P_(i,t,Hh(i,t)):t>46?To(Ce-.6,Yi-.5,me(46,76,t)):Ce-.65,a=me(4.2,1.1,s);e=To(e,Math.min(e,r),a)}const o=po(i,t);if(o<2){const r=me(2,-4,o);e=To(e,Math.min(e,-1.6),r);const a=Kl(i,t);a<1.5&&(e=To(e,.35,me(1.5,-1.2,a)))}return e}function Rn(i,t,{pathPad:e=.6,waterPad:n=1}={}){return!(ad(i,t)||po(i,t)<n||Ua(i,t)<1.4+n||Math.abs(t-nn(i))<Mn+n||cd(i,t)<e||$l(i,t,-1)&&ld(i,t)<e)}const L_=Object.freeze(Object.defineProperty({__proto__:null,COMPOUND:Yt,DIALOGUE:xn,GARDEN_PATHS:Ko,GATE:Pn,ISLET:Zs,LIBRARY:Hn,OSMANTHUS:Oo,PAIFANG:Fo,PATHS:gi,POND:Gn,QUIET:He,RIVER_HALF:Mn,RIVER_LEVEL:Yi,STREAM_N:io,STREAM_S:rr,VERIFY:vn,WATER_LEVEL:Ce,WELL:xl,addFootprint:un,clamp:on,compoundDist:jl,gardenPathDist:ld,inCompound:$l,inFootprint:ad,isFree:Rn,isletDist:Kl,pathDist:cd,pondDist:po,riverZ:nn,streamDist:Ua,terrainHeight:ti},Symbol.toStringTag,{value:"Module"})),D_=620,Vn=165,Gh=i=>Math.sign(i)*D_*(.22*Math.abs(i)+.78*Math.abs(i)**3);function so(i,t){if(t<nn(i)+Mn+6||t>215||i<-70&&t<175||i<-190||i>160)return-1;const e=.12,n=i*Math.cos(e)-t*Math.sin(e),s=i*Math.sin(e)+t*Math.cos(e),o=Math.floor(n/26),r=Math.floor(s/15),a=n/26-o,c=s/15-r;if(a<.04||c<.07)return 0;const l=Pe(o*7.1,r*3.3);return l<.42?1:l<.74?2:3}const Cn=i=>{const t=new Rt(i);return[t.r,t.g,t.b]},cn={meadow:Cn(8093509),lush:Cn(6715964),dry:Cn(11049566),forest:Cn(4937523),forestDark:Cn(3818793),rock:Cn(9077363),bund:Cn(9073494),stubble:Cn(12886874),green:Cn(8358472),plough:Cn(8019013),bank:Cn(6117959),deep:Cn(2240557)},$n=(i,t,e)=>{i[0]+=(t[0]-i[0])*e,i[1]+=(t[1]-i[1])*e,i[2]+=(t[2]-i[2])*e};function I_(i,t,e,n,s){const o=ua(i*.03,t*.03,3),r=Pe(i*.09,t*.09);s[0]=cn.meadow[0],s[1]=cn.meadow[1],s[2]=cn.meadow[2],$n(s,cn.lush,me(.5,.25,o)*.8),$n(s,cn.dry,me(.5,.75,r)*.7);const a=me(3,22,e);$n(s,o>.5?cn.forest:cn.forestDark,a),$n(s,cn.rock,me(.5,.9,n));const c=so(i,t);c===0?$n(s,cn.bund,1):c===1?$n(s,cn.stubble,.92):c===2?$n(s,cn.green,.92):c===3&&$n(s,cn.plough,.92);const l=Math.abs(t-nn(i)),u=Math.max(me(Mn+5,Mn-1,l),me(3,-.5,po(i,t)),me(2.6,.8,Ua(i,t)));$n(s,cn.bank,u),e<-.6&&$n(s,cn.deep,me(-.6,-1.8,e))}function U_(i){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=ee(77),s=i/(Vn*2),o=h=>(h+Vn)*s,r=h=>(h+Vn)*s;e.clearRect(0,0,i,i);for(let h=0;h<2400;h++){const g=n()*i,x=n()*i,p=(2+n()*18)*s;e.fillStyle=n()<.5?"rgba(178,160,112,0.13)":"rgba(88,100,58,0.12)",e.beginPath(),e.arc(g,x,p,0,Math.PI*2),e.fill()}for(let h=0;h<3e4;h++)e.fillStyle=n()<.6?"rgba(84,96,52,0.3)":"rgba(196,182,132,0.3)",e.fillRect(n()*i,n()*i,1+n()*2,1+n()*2);const a=Math.max(1,Math.round(i/1024));for(let h=0;h<i;h+=a){const g=h/s-Vn;if(!(g<85))for(let x=0;x<i;x+=a){const p=x/s-Vn,m=so(p,g);if(m<=0)continue;const v=p*Math.cos(.12)-g*Math.sin(.12);Math.abs(Math.sin(v*3.4))<.33&&(e.fillStyle=m===1?"rgba(120,88,46,0.4)":m===2?"rgba(58,76,38,0.35)":"rgba(78,54,38,0.4)",e.fillRect(x,h,a,a))}}const c=(h,g)=>{e.beginPath(),h.forEach(([x,p],m)=>m?e.lineTo(o(x),r(p)):e.moveTo(o(x),r(p))),g&&e.closePath()},l=(h,g,x,p)=>{e.lineCap="round",e.lineJoin="round",p&&(e.strokeStyle=p,e.lineWidth=(g*2+1.1)*s,c(h),e.stroke()),e.strokeStyle=x,e.lineWidth=g*2*s,c(h),e.stroke()};e.lineWidth=3.4*s,e.strokeStyle="rgba(70,72,56,0.45)",c(Gn,!0),e.stroke();for(const h of[io,rr])e.strokeStyle="rgba(70,72,56,0.4)",e.lineWidth=4*s,c(h),e.stroke();for(const h of gi)h.kind==="stone"?l(h.pts,h.w,"rgba(170,163,148,1)","rgba(118,108,88,0.5)"):l(h.pts,h.w,"rgba(168,140,104,0.92)","rgba(120,100,74,0.35)");for(const h of Ko)l(h.pts,h.w,"rgba(150,146,134,1)","rgba(70,66,56,0.7)");for(const h of Ko)for(let g=0;g<h.pts.length-1;g++){const[x,p]=h.pts[g],[m,v]=h.pts[g+1],M=Math.hypot(m-x,v-p)||1,_=-(v-p)/M,w=(m-x)/M;for(let b=0;b<M*60;b++){const A=n(),R=(n()-.5)*h.w*1.8,S=x+(m-x)*A+_*R,y=p+(v-p)*A+w*R;e.fillStyle=n()<.5?"rgba(92,88,78,0.75)":"rgba(205,200,186,0.8)",e.beginPath(),e.arc(o(S),r(y),(.035+n()*.03)*s,0,Math.PI*2),e.fill()}for(let b=0;b<M;b+=1.1){const A=x+(m-x)*b/M,R=p+(v-p)*b/M;e.strokeStyle="rgba(70,66,58,0.7)",e.lineWidth=.06*s,e.beginPath(),e.moveTo(o(A+_*h.w*.8),r(R+w*h.w*.8)),e.lineTo(o(A+(m-x)/M*.5),r(R+(v-p)/M*.5)),e.lineTo(o(A-_*h.w*.8),r(R-w*h.w*.8)),e.stroke()}}e.fillStyle="rgba(160,146,116,0.35)",e.fillRect(o(Yt.x0),r(Yt.z0),(Yt.x1-Yt.x0)*s,(Yt.z1-Yt.z0)*s);for(let h=0;h<1100;h++){const g=Yt.x0+n()*(Yt.x1-Yt.x0),x=Yt.z0+n()*(Yt.z1-Yt.z0);e.fillStyle=n()<.7?"rgba(82,104,58,0.2)":"rgba(112,96,70,0.18)",e.beginPath(),e.ellipse(o(g),r(x),(.6+n()*2.6)*s,(.4+n()*1.6)*s,n()*3,0,Math.PI*2),e.fill()}e.globalCompositeOperation="destination-out";const u=e.createRadialGradient(i/2,i/2,i*.34,i/2,i/2,i*.5);u.addColorStop(0,"rgba(0,0,0,0)"),u.addColorStop(1,"rgba(0,0,0,1)"),e.fillStyle=u,e.fillRect(0,0,i,i),e.globalCompositeOperation="source-over";const f=new ji(t);return f.colorSpace=We,f.wrapS=f.wrapT=Vi,f.anisotropy=8,{tex:f,canvas:t,ctx:e,X:o,Z:r,S:s,dab:(h,g,x,p)=>{e.fillStyle=p,e.beginPath(),e.arc(o(h),r(g),x*s,0,Math.PI*2),e.fill()},rand:n}}function N_(i,t){const e=new ye({vertexColors:!0,roughness:.97,metalness:0,map:i});return t&&(e.defines={LOQ_DETAIL:""}),ce(e,"terrain",n=>{n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aInfo;
varying vec4 vInfo;
varying vec3 vTerrWorld;`).replace("#include <fog_vertex>",`#include <fog_vertex>
vInfo = aInfo;
vTerrWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec4 vInfo;
varying vec3 vTerrWorld;
`+nr).replace("#include <map_fragment>","vec4 gTex = texture2D( map, vMapUv );").replace("#include <color_fragment>",`diffuseColor.rgb *= mix( vColor, gTex.rgb, gTex.a );
        #ifdef LOQ_DETAIL
          {
            vec2 wp = vTerrWorld.xz;
            float n = vnoise( wp * 0.33 ) * 0.45 + vnoise( wp * 1.9 ) * 0.33 + vnoise( wp * 8.5 ) * 0.22;
            diffuseColor.rgb *= 0.86 + 0.26 * n;
          }
        #endif`).replace("#include <lights_fragment_begin>",`#include <lights_fragment_begin>
irradiance *= vInfo.w;`)})}function F_({tier:i}){const t=i.terrainSeg,e=t+1,n=new Float32Array(e*e*3),s=new Float32Array(e*e*3),o=new Float32Array(e*e*2),r=new Float32Array(e*e*4),a=new Float32Array(e*e);for(let x=0;x<e;x++){const p=Gh(x/t*2-1);for(let m=0;m<e;m++){const v=Gh(m/t*2-1);let M=ti(v,p);const _=Math.hypot(v,p);M+=(Math.min(M,38)-M)*me(430,600,_);const w=x*e+m;a[w]=M,n[w*3]=v,n[w*3+1]=M,n[w*3+2]=p,o[w*2]=(v+Vn)/(Vn*2),o[w*2+1]=(p+Vn)/(Vn*2)}}const c=new Le(1,1,t,t),l=new Gt;l.setAttribute("position",new le(n,3)),l.setAttribute("uv",new le(o,2)),l.setIndex(c.index),l.computeVertexNormals(),c.dispose();const u=l.attributes.normal,f=[0,0,0];for(let x=0;x<e*e;x++){const p=n[x*3],m=n[x*3+1],v=n[x*3+2],M=1-u.getY(x);I_(p,v,m,M*3,f);const _=1-me(Vn*.72,Vn*.98,Math.max(Math.abs(p),Math.abs(v))),w=1;s[x*3]=f[0]*w,s[x*3+1]=f[1]*w,s[x*3+2]=f[2]*w;const b=1-.28*(1-me(0,2.2,Math.abs(jl(p,v))));r[x*4]=0,r[x*4+1]=B.plain+11,r[x*4+2]=0,r[x*4+3]=on(b,0,1)*(.9+.1*_)}l.setAttribute("color",new le(s,3)),l.setAttribute("aInfo",new le(r,4)),l.computeBoundingSphere();const d=U_(i.name==="low"?1024:2048),h=N_(d.tex,i.detail),g=new Wt(l,h);return g.name="terrain",g.receiveShadow=!0,g.castShadow=!1,g.matrixAutoUpdate=!1,{mesh:g,map:d}}const O_=`
  attribute vec2 aFlow;
  attribute float aEdge;
  varying vec3 vWorld;
  varying vec2 vFlow;
  varying float vEdge;
  #include <fog_pars_vertex>
  void main() {
    vec4 wp = modelMatrix * vec4( position, 1.0 );
    vWorld = wp.xyz;
    vFlow = aFlow;
    vEdge = aEdge;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,k_=`
  ${ho}
  ${nr}
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSunColor;
  uniform float uOpacity;
  uniform float uRipple;
  uniform float uF0;
  uniform vec4 uRings[4]; // xz centre, start time, strength
  #ifdef USE_MIRROR
    uniform sampler2D tMirror;
    uniform mat4 uMirrorMatrix;
  #endif
  varying vec3 vWorld;
  varying vec2 vFlow;
  varying float vEdge;
  #include <fog_pars_fragment>

  vec2 waveGrad( vec2 p, float t ) {
    vec2 g = vec2( 0.0 );
    g += vec2( 0.8, 0.6 ) * cos( dot( p, vec2( 0.8, 0.6 ) ) * 1.6 + t * 1.2 ) * 0.05;
    g += vec2( -0.5, 0.86 ) * cos( dot( p, vec2( -0.5, 0.86 ) ) * 2.7 + t * 1.7 ) * 0.035;
    g += vec2( 0.2, -0.98 ) * cos( dot( p, vec2( 0.2, -0.98 ) ) * 4.9 + t * 2.5 ) * 0.022;
    g += vec2( 0.97, -0.24 ) * cos( dot( p, vec2( 0.97, -0.24 ) ) * 8.3 + t * 3.3 ) * 0.014;
    g += vec2( -0.71, -0.7 ) * cos( dot( p, vec2( -0.71, -0.7 ) ) * 13.0 + t * 4.1 ) * 0.008;
    return g;
  }

  void main() {
    vec2 p = vWorld.xz - vFlow * uTime;
    vec2 g = waveGrad( p, uTime ) * uRipple;
    // fine value-noise ripples
    vec2 q = p * 3.1 + uTime * 0.25;
    float e = 0.05;
    float n0 = vnoise( q );
    g += vec2( vnoise( q + vec2( e, 0.0 ) ) - n0, vnoise( q + vec2( 0.0, e ) ) - n0 ) / e * 0.012 * uRipple;
    // expanding rings (fish, falling leaves, events)
    for ( int i = 0; i < 4; i++ ) {
      vec4 r = uRings[i];
      float age = uTime - r.z;
      if ( age > 0.0 && age < 4.0 && r.w > 0.0 ) {
        vec2 d = vWorld.xz - r.xy;
        float dist = length( d );
        float rad = age * 1.4;
        float w = exp( - pow( ( dist - rad ) * 3.0, 2.0 ) ) * ( 1.0 - age / 4.0 ) * r.w;
        g += normalize( d + 1e-4 ) * sin( ( dist - rad ) * 14.0 ) * w * 0.25;
      }
    }
    vec3 n = normalize( vec3( - g.x, 1.0, - g.y ) );
    vec3 V = normalize( cameraPosition - vWorld );
    float ndv = max( dot( n, V ), 0.0 );
    float fres = uF0 + ( 1.0 - uF0 ) * pow( 1.0 - ndv, 4.0 );
    vec3 R = reflect( - V, n );
    vec3 refl = skyColor( normalize( vec3( R.x, max( R.y, 0.0 ), R.z ) ) );
    #ifdef USE_MIRROR
      vec4 tc = uMirrorMatrix * vec4( vWorld, 1.0 );
      tc.xy += n.xz * tc.w * 0.06;
      vec3 mc = texture2DProj( tMirror, tc ).rgb;
      refl = mc;
      fres = mix( fres, 0.35 + 0.65 * fres, 0.6 );
    #endif
    float sd = max( dot( R, uSunDir ), 0.0 );
    float glit = pow( sd, 700.0 ) * 24.0 + pow( sd, 60.0 ) * 0.5;
    vec3 deep = mix( uShallow, uDeep, smoothstep( 0.0, 2.5, vEdge ) );
    vec3 col = mix( deep, refl, fres ) + uSunColor * glit;
    // brighter lip right at the shore
    col += vec3( 0.06, 0.055, 0.045 ) * ( 1.0 - smoothstep( 0.0, 0.5, vEdge ) );
    float alpha = mix( uOpacity, 1.0, fres ) * smoothstep( 0.0, 0.3, vEdge );
    gl_FragColor = vec4( col, alpha );
    #include <fog_fragment>
  }
`;function Vh(i){const t=new Xe({vertexShader:O_,fragmentShader:k_,uniforms:lo.merge([bt.fog,{uDeep:{value:new Rt(2898487)},uShallow:{value:new Rt(5200460)},uOpacity:{value:.82},uRipple:{value:1},uF0:{value:.1},uRings:{value:[new oe,new oe,new oe,new oe]},tMirror:{value:null},uMirrorMatrix:{value:new vt}}]),transparent:!0,depthWrite:!1,fog:!0});return Object.assign(t.uniforms,De),i&&(t.defines={USE_MIRROR:""}),t.userData.loqPatched=!0,t}function z_(i,t,e,n,s,o,r,a){const c=Math.ceil((e-i)/s),l=Math.ceil((n-t)/s),u=[],f=[],d=[],h=[],g=[];for(let p=0;p<=l;p++)for(let m=0;m<=c;m++){const v=i+m*s,M=t+p*s,_=r(v,M);u.push(v,o,M),f.push(Math.max(0,_));const w=a(v,M);d.push(w[0],w[1]),g.push(_>-1.6)}for(let p=0;p<l;p++)for(let m=0;m<c;m++){const v=p*(c+1)+m,M=v+1,_=v+c+1,w=_+1;(g[v]||g[M]||g[_]||g[w])&&h.push(v,_,M,M,_,w)}const x=new Gt;return x.setAttribute("position",new at(u,3)),x.setAttribute("aEdge",new at(f,1)),x.setAttribute("aFlow",new at(d,2)),x.setIndex(h),x.computeBoundingSphere(),x}function yc(i,t,e,n){const s=[],o=[],r=[],a=[],c=[-1.25,-.8,-.4,0,.4,.8,1.25],l=i.length;for(let d=0;d<l;d++){const[h,g]=i[d],x=i[Math.max(0,d-1)],p=i[Math.min(l-1,d+1)];let m=p[0]-x[0],v=p[1]-x[1];const M=Math.hypot(m,v)||1;m/=M,v/=M;const _=e(h,g,d/(l-1));for(const w of c)s.push(h-v*w*t,_,g+m*w*t),o.push(Math.max(0,(1-Math.abs(w))*t)),r.push(m*n,v*n)}const u=c.length;for(let d=0;d<l-1;d++)for(let h=0;h<u-1;h++){const g=d*u+h,x=g+1,p=g+u,m=p+1;a.push(g,x,p,x,m,p)}const f=new Gt;return f.setAttribute("position",new at(s,3)),f.setAttribute("aEdge",new at(o,1)),f.setAttribute("aFlow",new at(r,2)),f.setIndex(a),f.computeBoundingSphere(),f}function B_(i){const t=new we;t.name="water";const e=!!i.reflections,n=Vh(e),s=Vh(!1);s.uniforms.uOpacity.value=.86,s.uniforms.uF0.value=.16;let o=1/0,r=-1/0,a=1/0,c=-1/0;for(const[v,M]of Gn)o=Math.min(o,v),r=Math.max(r,v),a=Math.min(a,M),c=Math.max(c,M);const l=z_(o-2,a-2,r+2,c+2,i.name==="low"?1:.6,Ce,(v,M)=>Math.min(-po(v,M),Kl(v,M)),()=>[0,0]),u=new Wt(l,n);u.name="pond",u.renderOrder=2,t.add(u);const f=(v,M)=>M>-58&&M<46?Ce:Math.max(ti(v,M)+.36,Yi+.05),d=new Wt(yc(io.filter(([,v])=>v>-84),.95,f,.35),s),h=new Wt(yc(rr,.95,(v,M,_)=>M<46?Ce:Math.max(Yi+.05,Ce-(M-46)*.025),.4),s);d.renderOrder=h.renderOrder=2,t.add(d,h);const g=[];for(let v=-640;v<=640;v+=6)g.push([v,nn(v)]);const x=new Wt(yc(g,Mn+1.2,()=>Yi,.55),s);x.name="river",x.renderOrder=2,t.add(x);let p=null;if(e){const v=new Xn(4,4,{type:gs,depthBuffer:!0,generateMipmaps:!1}),M=new hn;M.layers.set(Oe);const _=new C(0,1,0),w=new C(0,Ce,0),b=new C,A=new vt,R=new C,S=new C,y=new C,E=new mi,U=new oe,N=new oe,P=n.uniforms.uMirrorMatrix.value,k=l.boundingSphere.clone(),L=new ba,H=new vt;n.uniforms.tMirror.value=v.texture;let z=0;p={setSize(O,Y){v.setSize(Math.max(2,Math.round(O*.5)),Math.max(2,Math.round(Y*.5)))},update(O,Y,Z){if(z++,H.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),L.setFromProjectionMatrix(H),u.visible=L.intersectsSphere(k),!u.visible||z%2||(b.setFromMatrixPosition(Z.matrixWorld),S.subVectors(w,b),S.dot(_)>0))return;S.reflect(_).negate().add(w),A.extractRotation(Z.matrixWorld),R.set(0,0,-1).applyMatrix4(A).add(b),y.subVectors(w,R).reflect(_).negate().add(w),M.position.copy(S),M.up.set(0,1,0).applyMatrix4(A).reflect(_),M.lookAt(y),M.far=Z.far,M.near=Z.near,M.updateMatrixWorld(),M.projectionMatrix.copy(Z.projectionMatrix),P.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),P.multiply(M.projectionMatrix).multiply(M.matrixWorldInverse),E.setFromNormalAndCoplanarPoint(_,w).applyMatrix4(M.matrixWorldInverse),U.set(E.normal.x,E.normal.y,E.normal.z,E.constant);const nt=M.projectionMatrix.elements;N.x=(Math.sign(U.x)+nt[8])/nt[0],N.y=(Math.sign(U.y)+nt[9])/nt[5],N.z=-1,N.w=(1+nt[10])/nt[14],U.multiplyScalar(2/U.dot(N)),nt[2]=U.x,nt[6]=U.y,nt[10]=U.z+1-.003,nt[14]=U.w,M.projectionMatrixInverse.copy(M.projectionMatrix).invert();const mt=O.getRenderTarget(),V=O.shadowMap.autoUpdate;O.shadowMap.autoUpdate=!1,t.visible=!1,O.setRenderTarget(v),O.clear(),O.render(Y,M),t.visible=!0,O.setRenderTarget(mt),O.shadowMap.autoUpdate=V}}}let m=0;return{group:t,pond:u,mirror:p,materials:[n,s],ring(v,M,_=1){n.uniforms.uRings.value[m++%4].set(v,M,De.uTime.value,_)}}}const pa=(i,t=.36,e=2.35)=>t*i+(1-t)*Math.pow(i,e);function Wh(i,t,e){const n=Math.abs(2*i-1)*t,s=Math.min(1,Math.max(0,(n-(t-e))/e));return s*s}new rt;function Be(i,t,e){const{nu:n,nv:s,v0:o,v1:r}=t,a=[],c=[],l=[],u=(h,g,x=new C)=>{const p=t.E0.x+(t.E1.x-t.E0.x)*h,m=t.E0.y+(t.E1.y-t.E0.y)*h,v=t.T0.x+(t.T1.x-t.T0.x)*h,M=t.T0.y+(t.T1.y-t.T0.y)*h;let _=p+(v-p)*g,w=m+(M-m)*g;const b=t.corners?Wh(h,t.halfLen,e.Lc)*(g<e.vl?(1-g/e.vl)**2:0):0,A=h<.5?-1:1;_+=(t.n.x+t.t.x*A)*e.flare*b,w+=(t.n.y+t.t.y*A)*e.flare*b;const R=e.y+e.rise*pa(g,e.pa,e.pk)+e.lift*b;return x.set(_,R,w)},f=new C;for(let h=0;h<=s;h++){const g=o+(r-o)*(h/s);for(let x=0;x<=n;x++){const p=x/n;u(p,g,f),a.push(f.x,f.y,f.z),c.push(f.x*t.t.x+f.z*t.t.y,g*e.slopeLen)}}for(let h=0;h<s;h++)for(let g=0;g<n;g++){const x=h*(n+1)+g,p=x+1,m=x+n+1,v=m+1;l.push(x,p,m,p,v,m)}const d=new Gt;if(d.setAttribute("position",new at(a,3)),d.setAttribute("uv",new at(c,2)),d.setIndex(l),d.computeVertexNormals(),i.add("roof",d,new vt,e.tile,{kind:B.plain,ao:1}),t.v0===0&&e.fascia>0){const h=[],g=[],x=new C;for(let v=0;v<=n;v++)if(u(v/n,0,x),h.push(x.x,x.y+.02,x.z,x.x-t.n.x*.06,x.y-e.fascia,x.z-t.n.y*.06),v<n){const M=v*2;g.push(M,M+1,M+2,M+2,M+1,M+3)}const p=new Gt;p.setAttribute("position",new at(h,3)),p.setIndex(g),p.computeVertexNormals();const m=p.attributes.normal;if(m.getX(0)*t.n.x+m.getZ(0)*t.n.y<0){for(let v=0;v<g.length;v+=3)[g[v+1],g[v+2]]=[g[v+2],g[v+1]];p.setIndex(g),p.computeVertexNormals()}i.add("solid",p,new vt,e.fasciaColor,{kind:B.wood,ao:.85})}if(t.v0===0&&e.eaveTiles){const h=new C,g=new C,x=new rt(t.E1.x-t.E0.x,t.E1.y-t.E0.y).length(),p=Math.max(2,Math.floor(x/.27)),m=Math.atan2(t.n.x,t.n.y);for(let v=0;v<p;v++){const M=(v+.5)/p;u(M,0,h),u(M,.04,g);const _=Math.atan2(g.y-h.y,Math.hypot(g.x-h.x,g.z-h.z));i.instM("eaveTile",Bt(h.x,h.y-.03,h.z,m,1,1,1,_,0))}}if(t.v0===0&&e.rafters){const h=new C,g=new C,x=new rt(t.E1.x-t.E0.x,t.E1.y-t.E0.y).length(),p=Math.max(2,Math.floor(x/.36));for(let m=1;m<p;m++){const v=m/p;t.corners&&Wh(v,t.halfLen,e.Lc)>.05||(u(v,0,h),u(v,e.rafterV,g),i.rod("solid",e.rafterColor,h.x-t.n.x*.05,h.y-e.fascia-.02,h.z-t.n.y*.05,g.x,g.y-.22,g.z,.055,{seg:5,kind:B.wood,ao:.7}))}}return u}function xi(i,t,e,n,s,o=!1,r=!1){const a=[[-e/2,-n*.35],[e/2,-n*.35],[e*.42,n*.65],[-e*.42,n*.65]],c=Vs(t,a,{scale:l=>{let u=1;return o&&(u*=1-.65*Math.max(0,(l-.72)/.28)),r&&(u*=1-.65*Math.max(0,(.28-l)/.28)),u}});i.add("solid",c,new vt,s,{kind:B.plain,ao:.95})}let Hr=null;function H_(){if(Hr)return Hr;const i=new Ai;return i.moveTo(-.32,0),i.lineTo(.18,0),i.quadraticCurveTo(.3,.35,.22,.72),i.quadraticCurveTo(.14,1.02,-.18,1.04),i.quadraticCurveTo(-.42,1,-.38,.8),i.quadraticCurveTo(-.2,.86,-.12,.74),i.quadraticCurveTo(-.04,.5,-.24,.38),i.quadraticCurveTo(-.34,.3,-.32,0),Hr=eo(i,.22,10,.02),Hr}function Xh(i,t,e,n,s,o,r){i.add("solid",H_(),Bt(t,e,n,s>0?Math.PI:0,o),r,{kind:B.plain,ao:.95})}function G_(i,t,e,n,s){for(let o=0;o<n;o++){const r=.18+o/Math.max(1,n)*.55,a=t.x+(e.x-t.x)*r,c=t.y+(e.y-t.y)*r,l=t.z+(e.z-t.z)*r;i.box("solid",s,.08,.16,.12,a,c+.08,l,{kind:B.plain}),i.sphere("solid",s,.06,a,c+.28,l,{seg:6})}}function In(i,t,e={}){const n=t.type||"xieshan",s={y:t.y||0,rise:t.rise||3,lift:t.lift!==void 0?t.lift:.55,flare:t.flare!==void 0?t.flare:.35,Lc:t.Lc||4.2,vl:t.vl||.42,pa:t.pa||.36,pk:t.pk||2.35,tile:t.tile!==void 0?t.tile:pt.tile,fascia:t.fascia!==void 0?t.fascia:.16,fasciaColor:t.fasciaColor||3877408,rafterColor:t.rafterColor||6961702,rafterV:.28,eaveTiles:!!e.eaveTiles&&t.eaveTiles!==!1,rafters:!!e.rafters&&t.rafters!==!1,slopeLen:1},o=t.ridgeColor||pt.tileDark,r=e.low?.6:1,a=k=>Math.max(2,Math.round(k*1.6*r)),c=Math.max(5,Math.round((t.segV||10)*r)),l={ridgeY:s.y+s.rise};if(n==="pyramid"){const k=t.n||4,L=t.R||3;s.slopeLen=Math.hypot(L,s.rise)*1.08;const H=[],z=t.angle0!==void 0?t.angle0:Math.PI/k;for(let V=0;V<k;V++){const j=z+V/k*Math.PI*2;H.push(new rt(Math.cos(j)*L,Math.sin(j)*L))}const O=new rt(0,0),Y=H[0].distanceTo(H[1]);s.Lc=Math.min(s.Lc,Y*.5);const Z=[];for(let V=0;V<k;V++){const j=H[(V+1)%k],ct=H[V],ot=new rt().subVectors(ct,j).normalize(),gt=new rt().addVectors(j,ct).multiplyScalar(.5).clone().normalize();Z.push(Be(i,{E0:j,E1:ct,T0:O,T1:O,v0:0,v1:.985,nu:a(Y),nv:c,n:gt,t:ot,halfLen:Y/2,corners:!0},s))}for(let V=0;V<k;V++){const j=Z[V],ct=[];for(let gt=0;gt<=10;gt++){const J=.97-gt/10*.97,lt=j(0,J);lt.y+=.06,ct.push(lt)}const ot=ct[ct.length-1],Tt=new C(ot.x,0,ot.z).normalize();ct.push(ot.clone().addScaledVector(Tt,.35).add(new C(0,.22,0))),ct.push(ot.clone().addScaledVector(Tt,.6).add(new C(0,.55,0))),xi(i,ct,t.ridgeW||.2,t.ridgeH||.24,o,!0)}const nt=s.y+s.rise*.985,mt=t.finial||.5;return i.cyl("solid",o,.28*mt,.25*mt,0,nt-.05,0,{rTop:.18*mt,seg:10}),i.sphere("solid",t.finialColor||8022602,.26*mt,0,nt+.42*mt,0,{seg:12,sy:1.15,kind:B.gold}),i.cyl("solid",t.finialColor||8022602,.05*mt,.5*mt,0,nt+.6*mt,0,{rTop:.01,seg:6,kind:B.gold}),l.ridgeY=nt,l}const u=t.hx,f=t.hz,d=f;s.slopeLen=Math.hypot(d,s.rise)*1.08;const h=(k,L)=>new rt(k,L),g=h(0,1),x=h(0,-1),p=h(1,0),m=h(-1,0),v=h(1,0),M=h(-1,0),_=h(0,-1),w=h(0,1);if(n==="gable"){s.lift=t.lift!==void 0?t.lift:.12,s.flare=0,s.Lc=Math.min(s.Lc,u*.6);const k=Be(i,{E0:h(-u,f),E1:h(u,f),T0:h(-u,0),T1:h(u,0),v0:0,v1:1,nu:a(u*2),nv:c,n:g,t:v,halfLen:u,corners:!0},s),L=Be(i,{E0:h(u,-f),E1:h(-u,-f),T0:h(u,0),T1:h(-u,0),v0:0,v1:1,nu:a(u*2),nv:c,n:x,t:M,halfLen:u,corners:!0},s);for(const[H,z,O]of[[1,1,0],[-1,0,1]]){const Y=[];for(let nt=0;nt<=8;nt++)Y.push(k(z,nt/8).add(new C(0,.06,0)));const Z=[];for(let nt=0;nt<=8;nt++)Z.push(L(O,nt/8).add(new C(0,.06,0)));if(xi(i,Y,.16,.18,o),xi(i,Z,.16,.18,o),t.barge!==!1){const nt=Y.map(j=>j.clone().add(new C(H*.03,-.12,0))),mt=Z.map(j=>j.clone().add(new C(H*.03,-.12,0))),V=[[-.03,-.18],[.03,-.18],[.03,.06],[-.03,.06]];i.add("solid",Vs(nt,V),new vt,t.bargeColor||4860446,{kind:B.wood}),i.add("solid",Vs(mt,V),new vt,t.bargeColor||4860446,{kind:B.wood})}}return Sc(i,t,-u-.05,u+.05,s.y+s.rise,o),t.gableWall&&V_(i,u-(t.gableInset||.25),f-(t.gableEaveIn||.9),s,t),l}if(n==="hip"||n==="skirt"){const k=n==="skirt"?t.vTop||.55:1;let L,H;if(n==="skirt"){const Z=t.ix,nt=t.iz,mt=1;L=h(-Z,nt),H=h(Z,nt),s.rise=t.rise;const V={E0:h(-u,f),E1:h(u,f),T0:L,T1:H,v0:0,v1:mt,nu:a(u*2),nv:Math.max(4,Math.round(c*.6)),n:g,t:v,halfLen:u,corners:!0},j={E0:h(u,-f),E1:h(-u,-f),T0:h(Z,-nt),T1:h(-Z,-nt),v0:0,v1:mt,nu:a(u*2),nv:V.nv,n:x,t:M,halfLen:u,corners:!0},ct={E0:h(u,f),E1:h(u,-f),T0:h(Z,nt),T1:h(Z,-nt),v0:0,v1:mt,nu:a(f*2),nv:V.nv,n:p,t:_,halfLen:f,corners:!0},ot={E0:h(-u,-f),E1:h(-u,f),T0:h(-Z,-nt),T1:h(-Z,nt),v0:0,v1:mt,nu:a(f*2),nv:V.nv,n:m,t:w,halfLen:f,corners:!0};s.pa=.5,s.pk=1.8,s.slopeLen=Math.hypot(f-nt,s.rise)*1.05;const Tt=Be(i,V,s),gt=Be(i,j,s);Be(i,ct,s),Be(i,ot,s);for(const J of[Tt,gt])for(const lt of[0,1]){const G=[];for(let St=0;St<=6;St++)G.push(J(lt,.95-St/6*.95).add(new C(0,.05,0)));const tt=G[G.length-1],F=new C(tt.x,0,tt.z).normalize();G.push(tt.clone().addScaledVector(F,.3).add(new C(0,.2,0))),G.push(tt.clone().addScaledVector(F,.5).add(new C(0,.48,0))),xi(i,G,.18,.2,o,!0)}return l.ridgeY=s.y+s.rise,l}const z=Math.max(.2,u-f),O=Be(i,{E0:h(-u,f),E1:h(u,f),T0:h(-z,0),T1:h(z,0),v0:0,v1:k,nu:a(u*2),nv:c,n:g,t:v,halfLen:u,corners:!0},s),Y=Be(i,{E0:h(u,-f),E1:h(-u,-f),T0:h(z,0),T1:h(-z,0),v0:0,v1:k,nu:a(u*2),nv:c,n:x,t:M,halfLen:u,corners:!0},s);return Be(i,{E0:h(u,f),E1:h(u,-f),T0:h(z,0),T1:h(z,0),v0:0,v1:k,nu:a(f*2),nv:c,n:p,t:_,halfLen:f,corners:!0},s),Be(i,{E0:h(-u,-f),E1:h(-u,f),T0:h(-z,0),T1:h(-z,0),v0:0,v1:k,nu:a(f*2),nv:c,n:m,t:w,halfLen:f,corners:!0},s),qh(i,O,Y,0,1,o,t),Sc(i,t,-z,z,s.y+s.rise,o),l}const b=t.vS||.42,A=t.overhang!==void 0?t.overhang:.55,R=u-f*b,S=R+A,y=Be(i,{E0:h(-u,f),E1:h(u,f),T0:h(-(u-f),0),T1:h(u-f,0),v0:0,v1:b,nu:a(u*2),nv:Math.max(3,Math.round(c*b)),n:g,t:v,halfLen:u,corners:!0},s),E=Be(i,{E0:h(u,-f),E1:h(-u,-f),T0:h(u-f,0),T1:h(-(u-f),0),v0:0,v1:b,nu:a(u*2),nv:Math.max(3,Math.round(c*b)),n:x,t:M,halfLen:u,corners:!0},s);Be(i,{E0:h(u,f),E1:h(u,-f),T0:h(u-f,0),T1:h(u-f,0),v0:0,v1:b,nu:a(f*2),nv:Math.max(3,Math.round(c*b)),n:p,t:_,halfLen:f,corners:!0},s),Be(i,{E0:h(-u,-f),E1:h(-u,f),T0:h(-(u-f),0),T1:h(-(u-f),0),v0:0,v1:b,nu:a(f*2),nv:Math.max(3,Math.round(c*b)),n:m,t:w,halfLen:f,corners:!0},s);const U=Be(i,{E0:h(-S,f),E1:h(S,f),T0:h(-S,0),T1:h(S,0),v0:b,v1:1,nu:a(S*2),nv:Math.max(4,Math.round(c*(1-b))),n:g,t:v,halfLen:u,corners:!1},s),N=Be(i,{E0:h(S,-f),E1:h(-S,-f),T0:h(S,0),T1:h(-S,0),v0:b,v1:1,nu:a(S*2),nv:Math.max(4,Math.round(c*(1-b))),n:x,t:M,halfLen:u,corners:!1},s),P=s.y+s.rise*pa(b,s.pa,s.pk);for(const k of[-1,1]){const L=k*(R+.05),H=[],z=10;for(let j=0;j<=z;j++){const ct=b+(1-b)*j/z;H.push([f*(1-ct),s.y+s.rise*pa(ct,s.pa,s.pk)-.08])}const O=[],Y=[],Z=[...H,...H.slice(0,-1).reverse().map(([j,ct])=>[-j,ct])];for(let j=0;j<Z.length-1;j++){const[ct,ot]=Z[j],[Tt,gt]=Z[j+1];O.push(L,P,0,L,ot,ct,L,gt,Tt),Y.push(0,0,0,1,0,1)}const nt=new Gt;nt.setAttribute("position",new at(O,3)),nt.setAttribute("uv",new at(Y,2)),nt.computeVertexNormals();const mt=nt.clone(),V=mt.attributes.position.array;for(let j=0;j<V.length;j+=9)for(let ct=0;ct<3;ct++)[V[j+3+ct],V[j+6+ct]]=[V[j+6+ct],V[j+3+ct]];mt.computeVertexNormals(),i.add("solid",nt,new vt,t.gableColor||8141350,{kind:B.wood,ao:.9}),i.add("solid",mt,new vt,t.gableColor||8141350,{kind:B.wood,ao:.9}),i.box("solid",t.gableTrim||15261647,.06,.18,f*(1-b)*2,L+k*.02,P-.02,0,{kind:B.plaster})}for(const[k,L,H]of[[1,1,0],[-1,0,1]]){const z=[],O=[];for(let mt=0;mt<=8;mt++){const V=b+(1-b)*mt/8;z.push(U(L,V).add(new C(0,.07,0))),O.push(N(H,V).add(new C(0,.07,0)))}xi(i,z,.2,.26,o),xi(i,O,.2,.26,o);const Y=[[-.035,-.32],[.035,-.32],[.035,.04],[-.035,.04]],Z=z.map(mt=>mt.clone().add(new C(k*.02,-.1,0))),nt=O.map(mt=>mt.clone().add(new C(k*.02,-.1,0)));i.add("solid",Vs(Z,Y),new vt,t.bargeColor||5909534,{kind:B.wood}),i.add("solid",Vs(nt,Y),new vt,t.bargeColor||5909534,{kind:B.wood}),i.cyl("solid",t.bargeColor||5909534,.16,.05,k*(S+.02),s.y+s.rise-.62,0,{rz:Math.PI/2,seg:10,kind:B.wood})}return qh(i,y,E,0,b,o,t),Sc(i,t,-S-.02,S+.02,s.y+s.rise,o),l.gableX=R,l.skirtY=P,l}function qh(i,t,e,n,s,o,r){for(const a of[t,e])for(const c of[0,1]){const l=[];for(let g=0;g<=8;g++){const x=s*.98-(s*.98-n)*g/8;l.push(a(c,x).add(new C(0,.07,0)))}const f=l[l.length-1],d=l[l.length-2],h=new C(f.x-d.x,0,f.z-d.z).normalize();l.push(f.clone().addScaledVector(h,.35).add(new C(0,.22,0))),l.push(f.clone().addScaledVector(h,.62).add(new C(0,.6,0))),xi(i,l,r.ridgeW?r.ridgeW*.8:.22,r.ridgeH?r.ridgeH*.7:.28,o,!0),r.beasts&&G_(i,l[Math.floor(8*.45)],f,r.beasts,o)}}function Sc(i,t,e,n,s,o){const r=t.ridgeW||.3,a=t.ridgeH||.42,c=t.ridgeEnd||"curl",l=[],u=12;for(let f=0;f<=u;f++){const d=f/u,h=Math.pow(Math.abs(d*2-1),3)*.12;l.push(new C(e+(n-e)*d,s+.02+h,0))}if(c==="swallow"){const f=Math.min(1.4,(n-e)*.18),d=[],h=[];for(let x=1;x<=5;x++){const p=x/5;d.push(new C(e-f*p,s+.14+.85*f*p*p,0)),h.push(new C(n+f*p,s+.14+.85*f*p*p,0))}const g=[...d.reverse(),...l,...h];xi(i,g,r,a,o,!0,!0)}else if(xi(i,l,r,a,o),c==="curl"){const f=t.ornament||.95;Xh(i,e+.12,s+.02+.12,0,-1,f,o),Xh(i,n-.12,s+.02+.12,0,1,f,o)}t.ridgeBand!==!1&&i.box("solid",t.ridgeBandColor||8025712,n-e-.4,a*.22,r*1.02,(e+n)/2,s+a*.18,0,{kind:B.plain})}function V_(i,t,e,n,s){for(const o of[-1,1]){const r=[];for(let f=0;f<=8;f++){const d=f/8;r.push([e*(1-d),n.y+n.rise*pa(d,n.pa,n.pk)-.12])}const c=[],l=[...r,...r.slice(0,-1).reverse().map(([f,d])=>[-f,d])];for(let f=0;f<l.length-1;f++){const[d,h]=l[f],[g,x]=l[f+1];o>0?c.push(o*t,n.y,0,o*t,x,g,o*t,h,d):c.push(o*t,n.y,0,o*t,h,d,o*t,x,g)}const u=new Gt;u.setAttribute("position",new at(c,3)),u.setAttribute("uv",new at(new Array(c.length/3*2).fill(.95),2)),u.computeVertexNormals(),i.add("solid",u,new vt,s.wallColor||pt.plaster,{kind:B.plaster})}}const W_=3103330,X_=4550479;function rs(i,t,e){const n=t.bays,s=t.deep,o=n.reduce((O,Y)=>O+Y,0),r=s.reduce((O,Y)=>O+Y,0),a=t.base!==void 0?t.base:.6,c=t.margin!==void 0?t.margin:1.1,l=t.colH||4,u=t.colR||.2,f=Object.assign({col:pt.lacquer,beam:W_,beam2:X_,wall:pt.plaster,panel:6959136,frame:pt.lacquerDark,dado:pt.brick},t.colors||{}),d=[-o/2];for(const O of n)d.push(d[d.length-1]+O);const h=[-r/2];for(const O of s)h.push(h[h.length-1]+O);const g=e.curve,x=i.frame.clone().invert(),p=new C,m=["open","doorsOpen","rail"].includes(t.front||"doors"),v=i.aoFn,M=a;if(i.aoFn=(O,Y)=>{p.copy(O).applyMatrix4(x);let Z=1;const nt=p.y-M;if(nt>-.05&&(Z*=.7+.3*me(0,.8,nt)),Math.abs(p.x)<o/2+.05&&Math.abs(p.z)<r/2+.05&&nt>-.05){const V=r/2-p.z,j=m?1-me(.5,r*1.1,V):.25;Z*=.58+.38*j}return Y.y<-.4&&(Z*=.78),Z},a>.05){y_(i,0,0,o+c*2,r+c*2,a,{side:t.platformSide,top:t.floorColor});for(const O of t.stairs||[{side:"front"}]){const Y=O.w||Math.min(n[Math.floor(n.length/2)],4),Z=Math.max(.9,a*1.8);O.side==="front"?da(i,O.x||0,0,r/2+c+.02,Y,a,Z,1):O.side==="back"&&da(i,O.x||0,0,-r/2-c-.02,Y,a,Z,-1)}}const _=t.interiorCols!==!1,w=[];for(let O=0;O<d.length;O++)for(let Y=0;Y<h.length;Y++){const Z=O===0||O===d.length-1||Y===0||Y===h.length-1;if(!Z&&!_||!Z&&t.skipCol&&t.skipCol(O,Y))continue;const nt=Z?l:l+(t.innerRise||.6);Zl(i,d[O],a,h[Y],nt,Z?u:u*1.08,f.col,g),w.push([d[O],h[Y],nt])}const b=a+l,A=(O,Y,Z,nt,mt=B.paint)=>{i.box("solid",nt,o+u*2,Y,Z,0,O,r/2,{kind:mt,chamfer:.02}),i.box("solid",nt,o+u*2,Y,Z,0,O,-r/2,{kind:mt,chamfer:.02}),i.box("solid",nt,Z,Y,r+u*2,-o/2,O,0,{kind:mt,chamfer:.02}),i.box("solid",nt,Z,Y,r+u*2,o/2,O,0,{kind:mt,chamfer:.02})};A(b-.36,.34,u*1.6,f.beam),A(b-.7,.22,u*1.3,f.beam2),A(b-.48,.12,u*1,10107428,B.lacquer),A(b-.02,.1,u*2.2,f.frame,B.wood);for(const O of[-1,1])for(const Y of[-1,1])i.box("solid",13214284,.06,.36,u*1.65,O*(o/2-.45),b-.37,Y*r/2,{kind:B.gold}),i.box("solid",13214284,u*1.65,.36,.06,O*o/2,b-.37,Y*(r/2-.45),{kind:B.gold});const R=b+.08;let S=b+.15;if(t.brackets!==!1){const O=t.bracketScale||.85,Y=(V,j,ct,ot,Tt,gt)=>{for(const J of gt)i.inst("bracket",V+(ct-V)*J,R,j+(ot-j)*J,Tt,O)},Z=V=>{const j=[],ct=V[V.length-1]-V[0];for(let ot=0;ot<V.length;ot++)if(ot>0&&ot<V.length-1&&j.push((V[ot]-V[0])/ct),ot<V.length-1){const Tt=V[ot+1]-V[ot],gt=Tt>3.6?2:1;for(let J=1;J<=gt;J++)j.push((V[ot]-V[0]+Tt*J/(gt+1))/ct)}return j},nt=Z(d),mt=Z(h);Y(-o/2,r/2,o/2,r/2,0,nt),Y(o/2,-r/2,-o/2,-r/2,Math.PI,nt),Y(o/2,r/2,o/2,-r/2,Math.PI/2,mt),Y(-o/2,-r/2,-o/2,r/2,-Math.PI/2,mt);for(const V of[-1,1])for(const j of[-1,1])i.inst("bracket",V*o/2,R,j*r/2,Math.atan2(V,j),O*1.05);S=R+.86*O,A(S-.12,.16,.26,f.frame,B.wood)}if(t.framing!==!1){const O=t.roof&&t.roof.rise||3;for(let Z=0;Z<d.length;Z++){const nt=d[Z];i.box("solid",f.frame,.32,.42,r+.3,nt,S-.5,0,{kind:B.wood,chamfer:.03}),i.box("solid",f.frame,.28,.36,r*.55,nt,S-.5+O*.42,0,{kind:B.wood,chamfer:.03});for(const mt of[-1,1])i.box("solid",f.frame,.2,O*.42-.08,.2,nt,S-.08,mt*r*.22,{kind:B.wood});i.box("solid",f.frame,.18,O*.38,.18,nt,S-.14+O*.42+.3,0,{kind:B.wood}),i.box("solid",f.beam,.34,.12,r*.5,nt,S-.6,0,{kind:B.paint})}const Y=Z=>.36*Z+.64*Math.pow(Z,2.35);for(const Z of[.18,.45,.72,.97]){const nt=r/2*(1-Z),mt=S+O*Y(Z)*.92-.22;for(const V of Z>.95?[1]:[-1,1])i.cyl("solid",f.frame,.12,o+.4,-o/2-.2,mt,V*nt,{rz:-Math.PI/2,seg:8,kind:B.wood})}}const y={front:t.front||"doors",back:t.back||"wall",left:t.left||t.sides||"wall",right:t.right||t.sides||"wall"},E=t.porch?h[h.length-2]:r/2,U=l-.72,N=(O,Y,Z,nt,mt,V)=>{const j=Math.hypot(nt-Y,mt-Z),ct=Math.atan2(nt-Y,mt-Z)-Math.PI/2,ot=(Y+nt)/2,Tt=(Z+mt)/2;i.push(Bt(ot,a,Tt,ct));const gt=j-u*2;if(O==="wall")i.box("solid",f.dado,gt,.9,.34,0,0,0,{kind:B.stone,chamfer:.02}),i.box("solid",f.wall,gt,U-.9,.28,0,.9,0,{kind:B.plaster,uv:(J,lt,G)=>[0,G?G.getY(lt):.5]});else if(O==="windows"){i.box("solid",f.dado,gt,.95,.32,0,0,0,{kind:B.stone,chamfer:.02}),i.box("solid",f.frame,gt,.08,.14,0,.95,0,{kind:B.wood});const J=gt>3?4:2,lt=gt/J;for(let G=0;G<J;G++){const tt=-gt/2+lt*(G+.5);i.box("solid",f.frame,.06,U-1.03,.08,tt-lt/2+.03,1.03,0,{kind:B.lacquer}),Si(i,tt,1.03,0,lt-.06,U-1.11,t.pattern!==void 0?t.pattern:1,!1)}i.box("solid",f.frame,gt,.08,.1,0,U-.08,0,{kind:B.wood})}else if(O==="doors"||O==="doorsOpen"){const J=gt>3.3?4:2,lt=gt/J,G=U-.62;Si(i,0,G+.08,0,gt-.1,U-G-.16,0,!1),i.box("solid",f.frame,gt,.1,.12,0,G,0,{kind:B.lacquer}),i.box("solid",f.frame,gt,.12,.14,0,0,0,{kind:B.lacquer});for(let tt=0;tt<J;tt++){const F=-gt/2+lt*(tt+.5);if(O==="doorsOpen"){const St=F<0?-1:1,dt=St<0?tt:J-1-tt,Et=St*(gt/2-.06-dt*.09);Mc(i,Et,.12,-lt/2*.92*V,lt,G-.12,{ry:Math.PI/2+St*.12,pattern:t.pattern||0,frame:f.frame,panel:f.panel})}else Mc(i,F,.12,0,lt-.02,G-.12,{pattern:t.pattern||0,frame:f.frame,panel:f.panel})}}else O==="rail"&&zh(i,[[-gt/2,0,0],[gt/2,0,0]],.62,f.frame,{pattern:2});(O==="open"||O==="rail"||t.fretwork)&&(Si(i,0,U+.2-.36,.02,gt,.32,3,!0),i.box("solid",f.frame,gt,.05,.06,0,U+.2-.4,0,{kind:B.wood})),i.pop()};for(let O=0;O<n.length;O++)N(t.frontBays?t.frontBays[O]:y.front,d[O],E,d[O+1],E,1),N(t.backBays?t.backBays[O]:y.back,d[O+1],-r/2,d[O],-r/2,1),t.porch&&y.front!=="open"&&N("open",d[O],r/2,d[O+1],r/2,1);for(let O=0;O<s.length;O++){if(t.porch&&O===s.length-1){N("open",-o/2,h[O],-o/2,h[O+1],1),N("open",o/2,h[O+1],o/2,h[O],1);continue}N(y.left,-o/2,h[O],-o/2,h[O+1],1),N(y.right,o/2,h[O+1],o/2,h[O],1)}for(const O of t.lamps||[])i.lamp(O[0],a+O[1],O[2],O[3]||6,O[4]||1);let P,k=S;if(t.upper){const O=t.upper,Y=O.skirt||{};In(i,{type:"skirt",hx:o/2+(Y.over||1.5),hz:r/2+(Y.over||1.5),ix:o/2-.1,iz:r/2-.1,y:S-.05,rise:Y.rise||1.3,lift:.45,flare:.3,Lc:3,ridgeW:.18,ridgeH:.2},e);const Z=S+(Y.rise||1.3)+.25,nt=O.balcony||.9;i.box("solid",f.frame,o+nt*2,.22,r+nt*2,0,Z-.22,0,{kind:B.wood,chamfer:.03}),i.box("solid",8018496,o+nt*2-.1,.03,r+nt*2-.1,0,Z,0,{kind:B.boards});const mt=o/2+nt-.1,V=r/2+nt-.1;zh(i,[[-mt,Z,V],[mt,Z,V],[mt,Z,-V],[-mt,Z,-V],[-mt,Z,V]],.92,f.frame,{pattern:2});const j=O.colH||3.4;for(let J=0;J<d.length;J++)for(let lt=0;lt<h.length;lt++)(J===0||J===d.length-1||lt===0||lt===h.length-1)&&i.cyl("solid",f.col,u*.9,j,d[J],Z,h[lt],{rTop:u*.8,seg:g,kind:B.lacquer});const ct=Z+j,ot=(J,lt,G,tt,F=B.paint)=>{i.box("solid",tt,o+u*2,lt,G,0,J,r/2,{kind:F,chamfer:.02}),i.box("solid",tt,o+u*2,lt,G,0,J,-r/2,{kind:F,chamfer:.02}),i.box("solid",tt,G,lt,r+u*2,-o/2,J,0,{kind:F,chamfer:.02}),i.box("solid",tt,G,lt,r+u*2,o/2,J,0,{kind:F,chamfer:.02})};ot(ct-.32,.3,u*1.5,f.beam),ot(ct-.02,.1,u*2,f.frame,B.wood);const Tt=j-.4,gt=(J,lt,G,tt,F)=>{const St=Math.hypot(tt-lt,F-G),dt=Math.atan2(tt-lt,F-G)-Math.PI/2;i.push(Bt((lt+tt)/2,Z,(G+F)/2,dt));const Et=St-u*1.8;if(J==="doors"){const _t=Et>3.3?4:2,zt=Et/_t;for(let ut=0;ut<_t;ut++)Mc(i,-Et/2+zt*(ut+.5),.05,0,zt-.02,Tt-.1,{pattern:1,frame:f.frame,panel:f.panel})}else i.box("solid",f.dado,Et,.7,.24,0,0,0,{kind:B.wood}),Si(i,0,.72,0,Et,Tt-.8,1,!1);i.pop()};for(let J=0;J<n.length;J++)gt(O.front||"doors",d[J],r/2,d[J+1],r/2),gt("windows",d[J+1],-r/2,d[J],-r/2);for(let J=0;J<s.length;J++)gt("windows",-o/2,h[J],-o/2,h[J+1]),gt("windows",o/2,h[J+1],o/2,h[J]);if(t.brackets!==!1){const J=(t.bracketScale||.85)*.8,lt=ct+.08;for(let G=0;G<d.length;G++)if(i.inst("bracket",d[G],lt,r/2,0,J),i.inst("bracket",d[G],lt,-r/2,Math.PI,J),G<d.length-1){const tt=(d[G]+d[G+1])/2;i.inst("bracket",tt,lt,r/2,0,J),i.inst("bracket",tt,lt,-r/2,Math.PI,J)}for(let G=1;G<h.length-1;G++)i.inst("bracket",o/2,lt,h[G],Math.PI/2,J),i.inst("bracket",-o/2,lt,h[G],-Math.PI/2,J);k=lt+.86*J}else k=ct+.1}const L=t.roof||{},H=L.over!==void 0?L.over:1.6;return P=In(i,{type:L.type||"xieshan",hx:o/2+H,hz:r/2+H,y:k-.05,rise:L.rise||3,lift:L.lift!==void 0?L.lift:.6,flare:L.flare!==void 0?L.flare:.4,Lc:L.Lc||Math.min(4.5,(r/2+H)*.8),vS:L.vS||.42,overhang:L.overhang,ridgeEnd:L.ridgeEnd||"curl",ridgeW:L.ridgeW,ridgeH:L.ridgeH,ornament:L.ornament,beasts:L.beasts!==void 0?L.beasts:e.name==="high"?3:0,tile:L.tile,gableColor:L.gableColor,n:L.n,R:L.R,finial:L.finial},e).ridgeY,i.aoFn=v,{W:o,D:r,xs:d,zs:h,base:a,floorY:a,eaveY:S,roofBase:k,ridgeY:P,colPos:w,width:o+c*2,depth:r+c*2}}function Jl(i){const t=i.r||1.25,e=(i.y||0)+t*.94,n=Math.asin(Math.min(.999,e/t));return{r:t,cy:e,a:n,half:Math.cos(n)*t}}function q_(i,t,e){const n=new Ai,s=e.filter(o=>o.type==="moon"||o.type==="vase"||o.type==="door").sort((o,r)=>o.at-r.at);n.moveTo(0,0);for(const o of s)if(o.type==="moon"){const r=Jl(o);n.lineTo(o.at-r.half,0),n.absarc(o.at,r.cy,r.r,Math.PI+r.a,-r.a,!0),n.lineTo(o.at+r.half,0)}else if(o.type==="vase"){const r=o.w||1;n.lineTo(o.at-r*.42,0),n.bezierCurveTo(o.at-r*.95,.9,o.at-r*.9,1.75,o.at-r*.3,2.05),n.lineTo(o.at-r*.3,2.35),n.quadraticCurveTo(o.at,2.55,o.at+r*.3,2.35),n.lineTo(o.at+r*.3,2.05),n.bezierCurveTo(o.at+r*.9,1.75,o.at+r*.95,.9,o.at+r*.42,0)}else{const r=o.w||1.4,a=o.h||2.4;n.lineTo(o.at-r/2,0),n.lineTo(o.at-r/2,a),n.lineTo(o.at+r/2,a),n.lineTo(o.at+r/2,0)}n.lineTo(i,0),n.lineTo(i,t),n.lineTo(0,t),n.closePath();for(const o of e){if(o.type==="moon"||o.type==="vase"||o.type==="door")continue;const r=new Yo;if(o.type==="octagon"){const a=o.r||.55,c=o.y||1.7;for(let l=0;l<8;l++){const u=l/8*Math.PI*2+Math.PI/8,f=o.at+Math.cos(u)*a,d=c+Math.sin(u)*a;l?r.lineTo(f,d):r.moveTo(f,d)}r.closePath()}else{const a=o.w||1.1,c=o.h||.8,l=o.y||1.4;r.moveTo(o.at-a/2,l),r.lineTo(o.at+a/2,l),r.lineTo(o.at+a/2,l+c),r.lineTo(o.at-a/2,l+c),r.closePath()}n.holes.push(r)}return n}function Y_(i,t,e){const n=pt.stoneGrey;if(t.type==="moon"){const{r:s,cy:o}=Jl(t),r=new Ai;r.absarc(0,0,s+.16,0,Math.PI*2,!1);const a=new Yo;a.absarc(0,0,s,0,Math.PI*2,!0),r.holes.push(a);const c=eo(r,e+.08,40);i.add("solid",c,Bt(t.at,o,0),n,{kind:B.stone,ao:.95})}else if(t.type==="octagon"||t.type==="window"){const s=t.type==="octagon"?(t.r||.55)*2:t.w||1.1,o=t.type==="octagon"?(t.r||.55)*2:t.h||.8,r=t.type==="octagon"?(t.y||1.7)-o/2:t.y||1.4;for(const[a,c,l,u]of[[0,-.08,s+.24,.12],[0,o-.04,s+.24,.12],[-s/2-.06,0,.12,o],[s/2+.06,0,.12,o]])i.box("solid",n,l,u,e+.06,t.at+a,r+c,0,{kind:B.stone});Si(i,t.at,r,0,s+.02,o,t.pattern!==void 0?t.pattern:3,!0)}else if(t.type==="door"||t.type==="vase"){const s=t.type==="vase"?(t.w||1)*1.9:t.w||1.4,o=t.type==="vase"?2.55:t.h||2.4;i.box("solid",n,s+.3,.14,e+.08,t.at,o,0,{kind:B.stone}),t.type==="door"&&(i.box("solid",n,.14,o,e+.08,t.at-s/2-.07,0,0,{kind:B.stone}),i.box("solid",n,.14,o,e+.08,t.at+s/2+.07,0,0,{kind:B.stone}))}}function hi(i,t,e={},n={}){const s=e.H||3.6,o=e.T||.5,r=new Map;for(const[a,c]of e.openings||[])r.has(a)||r.set(a,[]),r.get(a).push(c);for(let a=0;a<t.length-1;a++){const[c,l]=t[a],[u,f]=t[a+1],d=Math.hypot(u-c,f-l);if(d<.05)continue;const h=Math.atan2(u-c,f-l)-Math.PI/2,g=r.get(a)||[];i.push(Bt(c,e.y||0,l,h));const x=eo(q_(d,s,g),o,24),p=x.attributes.position;i.add("solid",x,new vt,e.color||pt.plaster,{kind:B.plaster,uv:(_,w)=>[0,p.getY(w)/s]});const m=g.filter(_=>_.type!=="window"&&_.type!=="octagon").map(_=>{const w=_.type==="moon"?Jl(_).half+.05:_.type==="vase"?(_.w||1)*.5:(_.w||1.4)/2;return[_.at-w,_.at+w]});m.sort((_,w)=>_[0]-w[0]);let v=0;const M=(_,w)=>{w-_>.05&&i.box("solid",pt.stoneGrey,w-_,.42,o+.1,(_+w)/2,0,0,{kind:B.stone,ao:.8})};for(const[_,w]of m)M(v,_),v=w;M(v,d);for(const _ of g)Y_(i,_,o);e.coping!==!1&&(i.box("solid",pt.brick,d+.04,.16,o+.12,d/2,s,0,{kind:B.stone}),i.push(Bt(d/2,s+.12,0)),In(i,{type:"gable",hx:d/2+.05,hz:o/2+.38,y:0,rise:.42,lift:0,fascia:.06,ridgeW:.16,ridgeH:.16,ridgeEnd:a===0||a===t.length-2?"swallow":"plain",ridgeBand:!1,barge:!1,segV:4,eaveTiles:!0,rafters:!1},{...n,rafters:!1,low:!0}),i.pop()),i.pop()}}function bc(i,t,e={},n={}){const s=e.w||2.4,o=e.h||2.9,r=e.y||0,a=e.step||3,c=n.curve||10;for(let l=0;l<t.length-1;l++){const[u,f]=t[l],[d,h]=t[l+1],g=Math.hypot(d-u,h-f),x=Math.atan2(d-u,h-f);i.push(Bt((u+d)/2,r,(f+h)/2,x));const p=Math.max(1,Math.round(g/a));i.box("solid",pt.stoneGrey,s+.3,.24,g+.3,0,0,0,{kind:B.brick}),i.box("solid",pt.stone,s+.42,.08,g+.42,0,.18,0,{kind:B.stone});for(let m=0;m<=p;m++){const v=-g/2+m/p*g;for(const M of[-1,1])e.wall&&M===e.wall||Zl(i,M*s/2,.24,v,o,.11,e.colColor||7220252,Math.min(c,10));i.box("solid",pt.lacquerDark,s+.2,.2,.14,0,.24+o-.18,v,{kind:B.wood})}for(const m of[-1,1])if(!(e.wall&&m===e.wall)){i.box("solid",pt.lacquerDark,.16,.24,g+.2,m*s/2,.24+o-.24,0,{kind:B.wood}),i.box("solid",3103330,.17,.1,g+.1,m*s/2,.24+o-.36,0,{kind:B.paint});for(let v=0;v<p;v++){const M=-g/2+v/p*g,_=-g/2+(v+1)/p*g,w=Bt(m*s/2,0,(M+_)/2,Math.PI/2);Si(i,0,.24+o-.62,0,_-M-.24,.26,3,!0,{matrix:w}),e.benches!==!1&&!(e.gaps&&e.gaps.includes(`${l}:${v}`))&&(e.meirenkao?sd(i,m*s/2,M+.14,m*s/2,_-.14,.24,pt.lacquerDark,m):(i.box("solid",pt.lacquerDark,.34,.07,_-M-.22,m*(s/2-.05),.24+.42,(M+_)/2,{kind:B.wood,chamfer:.015}),i.box("solid",pt.lacquerDark,.3,.42,.06,m*(s/2-.05),.24,M+.2,{kind:B.wood}),i.box("solid",pt.lacquerDark,.3,.42,.06,m*(s/2-.05),.24,_-.2,{kind:B.wood})))}}i.push(Bt(0,.24+o+.02,0,Math.PI/2)),In(i,{type:"gable",hx:g/2+(l===0||l===t.length-2?.55:.75),hz:s/2+.75,y:0,rise:.95,lift:.05,fascia:.1,ridgeW:.18,ridgeH:.2,ridgeEnd:e.ridgeEnd||"plain",ridgeBand:!1,barge:!0,segV:6},{...n,low:!0}),i.pop(),i.pop()}for(let l=1;l<t.length-1;l++){const[u,f]=t[l];i.push(Bt(u,r+.24+o+.05,f)),In(i,{type:"pyramid",n:4,R:(s/2+.8)*1.414,rise:1.25,lift:.3,flare:.15,Lc:1.2,angle0:Math.PI/4,finial:.35},{...n,low:!0}),i.pop()}}function Z_(i,t,e,n=0,s={},o={}){const r=o.spans||[3.2,4.4,3.2],a=r.reduce((u,f)=>u+f,0),c=[-a/2];for(const u of r)c.push(c[c.length-1]+u);i.pushT(t,0,e,n);const l=o.post||5909020;return c.forEach((u,f)=>{const h=f===1||f===2?6.4:5.2;for(const g of[-1,1])i.box("solid",pt.stone,.36,.9,.9,u,0,g*.62,{kind:B.stone,chamfer:.03}),i.cyl("solid",pt.stone,.4,.28,u,.85,g*.68,{rz:Math.PI/2,seg:14,kind:B.stone});i.box("solid",pt.stone,.62,.5,.62,u,0,0,{kind:B.stone,chamfer:.03}),i.box("solid",l,.38,h,.38,u,.5,0,{kind:B.lacquer,chamfer:.03})}),r.forEach((u,f)=>{const d=(c[f]+c[f+1])/2,h=f===1,g=h?6.1:4.9;i.box("solid",3103330,u+.3,.34,.32,d,g-1.3,0,{kind:B.paint,chamfer:.02}),i.box("solid",9057826,u-.3,.6,.18,d,g-.95,0,{kind:B.lacquer}),i.box("solid",3103330,u+.3,.3,.32,d,g-.32,0,{kind:B.paint,chamfer:.02});for(const x of[-u*.3,0,u*.3])i.inst("bracket",d+x,g-.02,0,0,.55);for(const x of[-u*.3,0,u*.3])i.inst("bracket",d+x,g-.02,0,Math.PI,.55);i.push(Bt(d,g+.42,0)),In(i,{type:h?"xieshan":"hip",hx:u/2+.75,hz:1.05,y:0,rise:h?1.3:1.05,lift:.4,flare:.25,Lc:1.1,vS:.5,overhang:.25,ridgeEnd:"curl",ornament:.5,ridgeW:.2,ridgeH:.26},{...s,low:!0}),i.pop()}),i.pop(),{W:a,plaqueY:5.15}}function Gr(i,t,e,n,s,o={}){const r=o.n||6,a=o.R||2.6,c=o.base!==void 0?o.base:.5,l=o.colH||3;i.pushT(t,o.y||0,e,n);const u=new Ne(a+.75,a+.85,c,r,1);u.translate(0,c/2,0),u.rotateY(Math.PI/r),i.add("solid",u,new vt,pt.stoneGrey,{kind:10});const f=new Ne(a+.8,a+.8,.1,r,1);f.translate(0,c-.05,0),f.rotateY(Math.PI/r),i.add("solid",f,new vt,pt.stone,{kind:B.stone});const d=[];for(let h=0;h<r;h++){const g=h/r*Math.PI*2+Math.PI/r;d.push([Math.cos(g)*a,Math.sin(g)*a])}d.forEach(([h,g])=>Zl(i,h,c,g,l,.15,o.col||pt.lacquer,s.curve));for(let h=0;h<r;h++){const[g,x]=d[h],[p,m]=d[(h+1)%r];i.beam("solid",3103330,g,c+l-.2,x,p,c+l-.2,m,.2,.28,{kind:B.paint}),i.beam("solid",pt.lacquerDark,g,c+l+.06,x,p,c+l+.06,m,.26,.12,{kind:B.wood});const v=Math.atan2(p-g,m-x),M=Math.hypot(p-g,m-x),_=Bt((g+p)/2,0,(x+m)/2,v+Math.PI/2);if(Si(i,0,c+l-.62,0,M-.3,.3,3,!0,{matrix:_}),!(o.entry!==void 0?h===o.entry:!1)&&o.benches!==!1){const b=(g+p)/2,A=(x+m)/2,R=new rt(b,A).normalize();sd(i,g*.97,x*.97,p*.97,m*.97,c,pt.lacquerDark,Math.sign(R.x*Math.cos(v)-R.y*Math.sin(v))||1)}}return i.push(Bt(0,c+l+.16,0)),o.double?(In(i,{type:"pyramid",n:r,R:a+1.25,rise:.9,lift:.4,flare:.25,Lc:1.3,finial:.01},s),i.cyl("solid",pt.lacquer,a*.62,1.1,0,.5,0,{seg:r,kind:B.lacquer}),i.push(Bt(0,1.6,0)),In(i,{type:"pyramid",n:r,R:a+.6,rise:2,lift:.5,flare:.3,Lc:1.2,finial:.5},s),i.pop()):In(i,{type:"pyramid",n:r,R:a+1.25,rise:o.rise||2.5,lift:.55,flare:.32,Lc:1.3,finial:.5},s),i.pop(),i.pop(),{top:c+l}}function $_(i,t,e,n,s=12,o=4,r=3.2,a=-1.15,c={}){i.pushT(t,0,e,n);const l=s/2+3.5,u=_=>{const w=Math.abs(_),b=w<.78?Math.pow(Math.cos(w/.78*Math.PI/2),1.25):0;return .3+(r+.25)*b},f=s/2,d=a+r-f*.95,h=a-1.4,g=new Ai,x=Math.asin(Math.min(.999,(h-d)/f)),p=Math.cos(x)*f;g.moveTo(-l,h),g.lineTo(-p,h),g.absarc(0,d,f,Math.PI-x,x,!0),g.lineTo(l,h);const m=28;for(let _=m;_>=0;_--){const w=_/m*2-1;g.lineTo(w*l,u(w))}g.closePath();const v=eo(g,o,32);v.rotateY(Math.PI/2),i.add("solid",v,new vt,11774616,{kind:10});for(const _ of[-1,1]){const w=new Ai,b=Math.asin(Math.min(.999,(a-.3-d)/f));w.absarc(0,0,f+.42,b,Math.PI-b,!1),w.absarc(0,0,f,Math.PI-b,b,!0),w.closePath();const A=eo(w,.16,32);i.add("solid",A,Bt(_*(o/2+.04),d,0,Math.PI/2),pt.stone,{kind:B.stone})}const M=22;for(let _=0;_<M;_++){const w=_/M*2-1,b=(_+1)/M*2-1,A=Math.max(u(w),u(b));i.box("solid",pt.stoneGrey,o-.1,.16,(b-w)*l+.02,0,A-.08,(w+b)/2*l,{kind:B.stone,jitter:.05})}for(const _ of[-1,1]){const w=[];for(let b=0;b<=10;b++){const A=b/10*2-1;w.push([_*(o/2-.1),u(A)+.05,A*l*.94])}ki(i,w,.8)}i.pop()}function j_(i,t,e=.05,n=1.6,s={}){for(let o=0;o<t.length-1;o++){const[r,a]=t[o],[c,l]=t[o+1],u=Math.hypot(c-r,l-a),f=Math.atan2(c-r,l-a);i.push(Bt((r+c)/2,0,(a+l)/2,f)),i.box("solid",pt.stone,n,.22,u+n*.6,0,e,0,{kind:B.stone,chamfer:.03,jitter:.04});const d=Math.max(1,Math.round(u/3));for(let h=0;h<=d;h++){const g=-u/2+h/d*u;i.box("solid",10327428,n*.7,1.6,.5,0,e-1.6,g,{kind:B.stone})}i.pop()}for(const o of[-1,1]){const r=[];for(let a=0;a<t.length;a++){const c=t[a],l=t[Math.max(0,a-1)],u=t[Math.min(t.length-1,a+1)],f=u[0]-l[0],d=u[1]-l[1],h=Math.hypot(f,d)||1;r.push([c[0]-d/h*o*(n/2-.08),e+.22,c[1]+f/h*o*(n/2-.08)])}ki(i,r,.5,pt.stone)}}function K_(i,t,e,n,s=7,o={}){i.pushT(t,e,n,Math.PI/8);let r=4.2,a=0;i.cyl("solid",10853514,r+1.6,1.2,0,-.4,0,{seg:8,kind:10}),i.cyl("solid",pt.stone,r+1.2,.5,0,.8,0,{seg:8,kind:B.stone}),a=1.3;for(let l=0;l<s;l++){const u=l===0?4.2:3-l*.12;i.cyl("solid",pt.plaster,r,u,0,a,0,{rTop:r*.97,seg:8,kind:B.plaster});for(let f=0;f<8;f++){const d=f/8*Math.PI*2+Math.PI/8;if(i.box("solid",8007712,.28,u,.28,Math.cos(d)*r*.99,a,Math.sin(d)*r*.99,{ry:-d,kind:B.lacquer}),f%2===l%2){const h=d+Math.PI/8;i.box("solid",2761760,.9,u*.5,.1,Math.cos(h)*r*.93,a+u*.22,Math.sin(h)*r*.93,{ry:Math.PI/2-h,kind:B.plain,ao:.5})}}i.cyl("solid",3103330,r*1.02,.3,0,a+u-.3,0,{seg:8,kind:B.paint}),i.push(Bt(0,a+u,0)),In(i,{type:"pyramid",n:8,R:r+1.6,rise:1.1,lift:.45,flare:.3,Lc:1,angle0:0,finial:.001},{...o,low:!0,eaveTiles:!1,rafters:!1}),i.pop(),i.cyl("solid",pt.stone,r*.98,.25,0,a+u+.75,0,{seg:8,kind:B.stone}),a+=u+.95,r*=.9}i.push(Bt(0,a,0)),In(i,{type:"pyramid",n:8,R:r+1.4,rise:2.4,lift:.5,flare:.3,Lc:1.1,angle0:0,finial:.001},{...o,low:!0}),i.pop();const c=a+2.3;i.cyl("solid",7232058,.5,.5,0,c,0,{rTop:.35,seg:8,kind:B.gold});for(let l=0;l<5;l++)i.cyl("solid",7232058,.42-l*.05,.12,0,c+.7+l*.42,0,{seg:10,kind:B.gold});return i.cyl("solid",7232058,.08,2.4,0,c+.5,0,{rTop:.02,seg:6,kind:B.gold}),i.sphere("solid",9073736,.28,0,c+3,0,{seg:8,kind:B.gold}),i.pop(),{height:c+3.2}}function J_(i,t,e,n,s,o,r,a,c,l={},u={}){i.pushT(t,e,n,s),i.box("solid",pt.stoneGrey,o+.2,.5,r+.2,0,-.3,0,{kind:B.stone}),i.box("solid",u.wall||pt.plaster,o,a,r,0,.2,0,{kind:B.plaster,uv:(g,x,p)=>[0,p?p.getY(x):.5],jitter:.03}),i.box("solid",2892059,1.1,2,.06,0,.2,r/2+.01,{kind:B.wood}),i.box("solid",pt.stoneGrey,1.5,.14,.16,0,2.25,r/2+.05,{kind:B.stone});const f=Math.max(1,Math.floor(o/3));for(let g=0;g<f;g++){const x=-o/2+o/f*(g+.5);if(Math.abs(x)<1.2)continue;const p=c()<.45;i.box("solid",p?16762746:2761760,.7,.6,.05,x,a*.62,r/2+.01,{kind:B.plain,emit:p?1.4:0})}i.push(Bt(0,a+.2,0)),In(i,{type:"gable",hx:o/2-.05,hz:r/2+.55,y:0,rise:r*.32,lift:.04,fascia:.08,ridgeW:.18,ridgeH:.2,ridgeEnd:"plain",ridgeBand:!1,barge:!1,segV:5,eaveTiles:!1},{...l,low:!0,rafters:!1,eaveTiles:!1}),i.pop();const d=u.steps||2,h=r*.32;for(const g of[-1,1])for(let x=0;x<=d;x++){const p=r/2*(1-x/(d+1)),m=a+.2+h*(x/(d+.4))+.7;i.box("solid",pt.plaster,.34,m-a,p*2,g*(o/2+.05),a,0,{kind:B.plaster,uv:()=>[0,.9]}),i.box("solid",pt.tileDark,.62,.12,p*2+.2,g*(o/2+.05),m+0,0,{kind:B.plain}),i.box("solid",pt.tile,.3,.12,p*2+.3,g*(o/2+.05),m+.12,0,{kind:B.plain})}i.pop()}function Q_(i,{w:t=2.4,h:e=.8,vertical:n=!1,bg:s="#2b1a12",fg:o="#d9b45c",border:r="#b8913f",px:a=512}={}){const c=n?Math.round(a*(t/e)):a,l=n?a:Math.round(a*(e/t)),u=r_(i,{w:c,h:l,vertical:n,bg:s,fg:o,border:r}),f=ce(new ye({map:u,roughness:.55,metalness:0,emissive:2759176,emissiveMap:u,emissiveIntensity:.25}),"plaque"),d=new we,h=new Wt(new Le(t,e),f);h.position.z=.051;const g=new Wt(new Ke(t+.08,e+.08,.1),ce(new ye({color:3809558,roughness:.6}),"plaqueBack"));return d.add(g,h),d.traverse(x=>{x.isMesh&&(x.castShadow=!0,x.receiveShadow=!0)}),d}function t2(i,t,e=()=>{}){const n=[],s=new we;s.name="plaques";const o={},r=new bn(11);r.instancer=i.instancer;const a=t.name==="low",c=P=>n.push(r.build(i.buckets,P)),l=(P,k,L,H,z=14077890,O=0,Y="paving")=>{un(P,k,L,H,.2),r.box(Y,z,L-P,.06+O,H-k,(P+L)/2,-.04,(k+H)/2,{kind:B.stone,uv:Z=>[Z.x/7,Z.z/7]})},u=(P,k,L,H,z=0,O=2.4,Y=.8,Z=!1)=>{const nt=Q_(P,{w:O,h:Y,vertical:Z});return nt.position.set(k,L,H),nt.rotation.y=z,nt.updateMatrixWorld(!0),s.add(nt),nt},f=Yt;hi(r,[[-6.7,f.z1],[f.x0,f.z1],[f.x0,f.z0],[f.x1,f.z0],[f.x1,f.z1],[6.7,f.z1]],{H:4.1,T:.6,openings:[[0,{at:-6.7- -38+0,type:"door",w:3,h:1.25}],[0,{at:18,type:"window",w:1.2,h:.9,y:1.8,pattern:2}],[1,{at:14,type:"octagon",r:.6,y:2.2}],[1,{at:30,type:"window",w:1.3,h:.9,y:1.9}],[1,{at:70,type:"window",w:1.3,h:.9,y:1.9,pattern:2}],[1,{at:86,type:"octagon",r:.6,y:2.2}],[2,{at:10.5,type:"door",w:3,h:1.2}],[2,{at:22,type:"door",w:1.7,h:2.5}],[2,{at:60,type:"window",w:1.2,h:.9,y:1.9}],[3,{at:20,type:"octagon",r:.6,y:2.2}],[3,{at:72,type:"window",w:1.3,h:.9,y:1.9,pattern:2}],[4,{at:14,type:"window",w:1.2,h:.9,y:1.8,pattern:2}]]},t),c("walls"),e(.05),r.pushT(Pn.x,0,Pn.z,0),rs(r,{bays:[3.3,4.2,3.3],deep:[2.6,2.6],base:.75,margin:1,colH:3.9,colR:.22,frontBays:["wall","open","wall"],backBays:["wall","open","wall"],sides:"wall",interiorCols:!0,skipCol:(P,k)=>P===1||P===2,stairs:[{side:"front",w:4},{side:"back",w:4}],roof:{type:"xieshan",rise:3.1,over:1.55,lift:.6,flare:.4,ridgeEnd:"curl"},lamps:[[0,2.6,0,5,.8]]},t);for(const P of[-1,1]){r.box("solid",9186332,.12,3,1.85,P*1.9,.82,-.95,{kind:B.lacquer,ry:P*.15});for(let k=0;k<5;k++)for(let L=0;L<4;L++)r.sphere("solid",13214284,.035,P*1.83,1.2+k*.5,-1.6+L*.42,{seg:5,kind:B.gold})}r.box("solid",pt.stone,4,.25,.6,0,.75,0,{kind:B.stone});for(const P of[-1,1])r.box("solid",pt.stone,1,.9,1.5,P*3.7,0,4.8,{kind:B.stone,chamfer:.04}),r.box("solid",pt.stoneDark,1.1,.12,1.6,P*3.7,.9,4.8,{kind:B.stone}),r.sphere("solid",11774356,.42,P*3.7,1.55,4.65,{sx:.8,sy:1.1,kind:B.stone}),r.sphere("solid",11774356,.34,P*3.7,2.2,4.95,{seg:10,kind:B.stone}),r.box("solid",11774356,.7,.55,.9,P*3.7,1,4.85,{kind:B.stone});r.pop(),un(-6.5,Pn.z-3.6,6.5,Pn.z+3.6,.5),u("开放问题图书馆",0,.75+3.9-.15,Pn.z+2.75,0,3.3,.62),o.gate={x:0,z:Pn.z,y:.75},l(-9,f.z1+.3,9,f.z1+11);for(const P of[-1,1])r.box("solid",pt.stone,.7,.5,.7,P*7.6,0,f.z1+7,{kind:B.stone,chamfer:.03}),r.cyl("solid",5913126,.09,9,P*7.6,.5,f.z1+7,{rTop:.06,seg:6,kind:B.wood});c("gate"),e(.1),l(-18,22.3,18,f.z1-2.6),l(-15.6,-20,15.6,22.3),r.box("paving",14867407,3.4,.14,40,0,0,2,{kind:B.stone,uv:P=>[P.x/2.2,P.z/2.2]}),r.box("solid",pt.stoneGrey,3.6,.1,40,0,0,2,{kind:B.stone});const d=Z_(r,Fo.x,Fo.z,0,t);u("问津",0,d.plaqueY+.15,Fo.z+.2,0,1.6,.56),u("问津",0,d.plaqueY+.15,Fo.z-.2,Math.PI,1.6,.56),hi(r,[[-18,22],[-6.3,22]],{H:3.3,T:.45,openings:[[0,{at:5.8,type:"window",w:1.4,h:.9,y:1.4,pattern:1}]]},t),hi(r,[[6.3,22],[18,22]],{H:3.3,T:.45,openings:[[0,{at:5.8,type:"window",w:1.4,h:.9,y:1.4,pattern:1}]]},t),hi(r,[[-18,f.z1-2.6],[-18,22]],{H:3.6,T:.5,openings:[[0,{at:10,type:"vase",w:1.1}]]},t),hi(r,[[18,22],[18,f.z1-2.6]],{H:3.6,T:.5,openings:[[0,{at:11,type:"door",w:1.5,h:2.5}]]},t),hi(r,[[-18,22],[-18,-20.5]],{H:3.9,T:.5,openings:[[0,{at:10,type:"vase",w:1.1}],[0,{at:31,type:"moon",r:1.3}],[0,{at:20.5,type:"window",w:1.2,h:.9,y:1.5}],[0,{at:38,type:"octagon",r:.5,y:1.8}]]},t),hi(r,[[18,-20.5],[18,22]],{H:3.9,T:.5,openings:[[0,{at:11.5,type:"moon",r:1.3}],[0,{at:32.5,type:"door",w:1.5,h:2.5}],[0,{at:22,type:"window",w:1.2,h:.9,y:1.5,pattern:2}],[0,{at:4,type:"octagon",r:.5,y:1.8}]]},t),bc(r,[[-16.75,-20.2],[-16.75,21.6]],{w:2.3,h:2.85,wall:-1,step:3.2,gaps:["0:3","0:9"]},t),bc(r,[[16.75,-20.2],[16.75,21.6]],{w:2.3,h:2.85,wall:1,step:3.2,gaps:["0:5","0:9"]},t),un(-18.2,-20.5,-15.5,22,.2),un(15.5,-20.5,18.2,22,.2),c("central"),e(.2);const h={x0:-14.5,x1:14.5,z0:-43,z1:-20.5},g=Hn.terraceH;r.box("solid",10853773,h.x1-h.x0,g-.12,h.z1-h.z0,0,0,(h.z0+h.z1)/2,{kind:10}),r.box("solid",pt.stone,h.x1-h.x0+.14,.12,h.z1-h.z0+.14,0,g-.12,(h.z0+h.z1)/2,{kind:B.stone,chamfer:.03}),l(h.x0+.2,h.z0+.2,h.x1-.2,h.z1-.2,15261904,g),da(r,0,0,h.z1,6.5,g,2.4,1);for(const P of[-1,1])da(r,P*11.8,0,h.z1,2.2,g,2,1,pt.stone,{sides:!0});ki(r,[[h.x0+.1,g,h.z1-.1],[-12.9,g,h.z1-.1]],.78),ki(r,[[-10.7,g,h.z1-.1],[-3.4,g,h.z1-.1]],.78),ki(r,[[3.4,g,h.z1-.1],[10.7,g,h.z1-.1]],.78),ki(r,[[12.9,g,h.z1-.1],[h.x1-.1,g,h.z1-.1]],.78),ki(r,[[h.x0+.1,g,h.z1-.1],[h.x0+.1,g,h.z0+.1]],.78),ki(r,[[h.x1-.1,g,h.z1-.1],[h.x1-.1,g,h.z0+.1]],.78),r.pushT(Hn.x,g,Hn.z,0),r.latticeKey="latticeLib";const x=rs(r,{bays:[3.2,3.8,4.4,3.8,3.2],deep:[2.6,5,2.6],base:.45,margin:.9,colH:4.3,colR:.24,front:"doorsOpen",back:"windows",sides:"windows",pattern:1,interiorCols:!0,upper:{colH:3.3,balcony:.9,skirt:{over:1.55,rise:1.25}},roof:{type:"xieshan",rise:3.9,over:1.8,lift:.7,flare:.45,ridgeEnd:"curl",ornament:1.15},stairs:[{side:"front",w:4.2}],lamps:[[-5,3.2,-1,6.5,1.1],[5,3.2,-1,6.5,1.1],[0,3.3,1.5,6,1],[0,8.6,0,7,.9]]},t);r.pop(),r.latticeKey=null,un(h.x0,h.z0,h.x1,h.z1,.3),o.library={x:Hn.x,z:Hn.z,floor:g+.45,W:x.W,D:x.D,eaveY:g+x.eaveY,ridgeY:g+x.ridgeY,xs:x.xs,zs:x.zs},u("溯源书库",0,g+.45+4.3-.12,Hn.z+x.D/2+.32,0,2.6,.72),u("一书一线皆有来处",-2.2,g+.45+2.2,Hn.z+x.D/2+.27,0,.36,2.6,!0),u("千问千答各溯其源",2.2,g+.45+2.2,Hn.z+x.D/2+.27,0,.36,2.6,!0),c("library"),e(.3),hi(r,[[f.x0,-2],[-18,-2]],{H:3.5,T:.45,openings:[[0,{at:5,type:"door",w:2.6,h:1.2}],[0,{at:26,type:"moon",r:1.25}],[0,{at:13,type:"octagon",r:.5,y:1.7}],[0,{at:34,type:"window",w:1.2,h:.85,y:1.6,pattern:1}]]},t),r.pushT(He.x,0,He.z,0),r.latticeKey="latticeQuiet";const p=rs(r,{bays:[3.8,4.4,3.8],deep:[2.4,5,2.4],base:.6,margin:1,colH:3.9,colR:.21,porch:!0,front:"doorsOpen",back:"wall",sides:"windows",pattern:0,colors:{col:6173474,beam:4020814,beam2:5072464},roof:{type:"xieshan",rise:3.2,over:1.6,lift:.6,flare:.4,ridgeEnd:"swallow"},lamps:[[-3,2.5,-1.2,5.5,1.1],[3,2.5,-1.2,5.5,1.1],[0,2.5,1,5,.9]]},t);r.pop(),r.latticeKey=null,un(He.x-8,He.z-6.5,He.x+8,He.z+7.5,.4),o.quiet={x:He.x,z:He.z,floor:.6,W:p.W,D:p.D,eaveY:p.eaveY},u("无辅助阅览室",0+He.x,.6+3.9-.12,He.z+p.D/2-2.4+.3,0,2.6,.62),l(He.x-6,He.z+7.5,He.x+6,He.z+11,14209216),c("quiet"),e(.38),r.pushT(xn.x,0,xn.z,0),r.latticeKey="latticeDlg";const m=rs(r,{bays:[4.2,4.6,4.2],deep:[2.6,3.4],base:.55,margin:1,colH:3.5,colR:.19,front:"rail",back:"windows",sides:"open",pattern:2,interiorCols:!1,colors:{col:6958622,beam:3825504,beam2:5402959},roof:{type:"xieshan",rise:2.7,over:1.5,lift:.75,flare:.5,ridgeEnd:"swallow"},stairs:[{side:"back",w:2.4}],lamps:[[-4.4,2.2,0,4.5,1],[0,2.2,0,4.5,1],[4.4,2.2,0,4.5,1]]},t);for(let P=-3;P<=3;P++)r.box("solid",9406586,.7,1.4,.7,P*2.1,-1.3,m.D/2+.7,{kind:B.stone});r.pop(),r.latticeKey=null,un(xn.x-8,xn.z-4.5,xn.x+8,xn.z+4.5,.3),o.dialogue={x:xn.x,z:xn.z,floor:.55,W:m.W,D:m.D,xs:m.xs},u("对话龛",xn.x,.55+3.5-.1,xn.z+m.D/2+.3,0,1.7,.56),j_(r,[[-23.2,23.5],[-27.5,25.5],[-31,23.2],[-35,26.2],[-38.6,24.6],[-41.2,27]],Ce+.25,1.6,t),bc(r,[[-20.4,14.8],[-21.6,21],[-20.6,28.4],[-22.3,35.6],[-21.2,42.2]],{w:2,h:2.7,step:2.8,meirenkao:!0,ridgeEnd:"swallow"},t),Gr(r,-50.5,39.5,.2,t,{n:6,R:2,base:.4,colH:2.7,y:2.2,entry:2,rise:2.3}),o.rockPavilion={x:-50.5,z:39.5,y:2.2},c("garden"),e(.48),hi(r,[[18,4],[f.x1,4]],{H:3.5,T:.45,openings:[[0,{at:18,type:"moon",r:1.3}],[0,{at:8,type:"octagon",r:.5,y:1.7}],[0,{at:28,type:"window",w:1.2,h:.85,y:1.6,pattern:2}]]},t),r.pushT(vn.x,0,vn.z,0);const v=rs(r,{bays:[4,5.2,4],deep:[2.8,4.4],base:.85,margin:1.2,colH:4.1,colR:.22,front:"open",back:"wall",sides:"rail",interiorCols:!1,fretwork:!0,colors:{col:8006684},roof:{type:"xieshan",rise:3.1,over:1.7,lift:.65,flare:.42,ridgeEnd:"curl"},stairs:[{side:"front",w:5.2},{side:"front",w:2.6,x:-5.6},{side:"front",w:2.6,x:5.6}],lamps:[[0,2.8,0,6,1.1],[-4.5,2.6,0,4.5,.8],[4.5,2.6,0,4.5,.8]]},t);r.pop(),un(vn.x-8.6,vn.z-5,vn.x+8.6,vn.z+6,.3),o.verify={x:vn.x,z:vn.z,floor:.85,W:v.W,D:v.D},u("公共核验台",vn.x,.85+4.1-.12,vn.z+v.D/2+.32,0,2.5,.6),l(22,-19.5,50,2.5,14735560),Gr(r,24.5,-44,0,t,{n:4,R:2.4,base:.6,colH:3,double:!0,benches:!1}),r.box("solid",9077880,1.1,.5,.6,24.5,.6,-44,{kind:B.stone}),r.box("solid",7301730,.9,2.2,.28,24.5,1.1,-44,{kind:B.stone,chamfer:.03}),un(21,-47.5,28,-40.5,.3),c("verify"),e(.56),Gr(r,Oo.x,Oo.z,0,t,{n:4,R:2.7,base:.55,colH:3.1,double:!0,entry:2}),o.osmanthus={x:Oo.x,z:Oo.z,floor:.55},r.pushT(47.5,0,25,-Math.PI/2),rs(r,{bays:[3.4,3.6,3.4],deep:[2,3.8],base:.45,margin:.8,colH:3.4,colR:.18,porch:!0,front:"doors",back:"wall",sides:"wall",brackets:!1,colors:{col:5910048},roof:{type:"gable",rise:2.3,over:1.1},lamps:[[0,2.2,0,4,.6]]},t),r.pop(),un(42.5,18,52.5,32,.3),r.pushT(-38,0,-46.5,0),rs(r,{bays:[3.2,3.4,3.2],deep:[2,3.6],base:.4,colH:3.2,porch:!0,front:"doors",back:"wall",sides:"wall",brackets:!1,roof:{type:"gable",rise:2.2,over:1}},t),r.pop(),un(-44,-50.5,-32,-42.5,.3),c("southeast"),e(.62);const M=nn(.5);$_(r,.5,M,0,13,4.2,3.1,-1.15,t),un(-2.6,M-11,3.6,M+11,.2),r.box("solid",pt.stone,1.8,.25,4.2,-32.2,.05,66.2,{kind:B.stone,chamfer:.03,ry:.5}),c("river"),e(.68);const _=-96,w=-176,b=ti(_,w),A=K_(r,_,b-.5,w,7,t);o.pagoda={x:_,z:w,y:b,h:A.height};const R=124,S=-46;Gr(r,R,S,.3,t,{n:8,R:2.6,base:.6,colH:3,y:ti(R,S)-.2}),c("landmarks"),e(.74);const y=[],E=ee(88),U=a?12:22;let N=0;for(;y.length<U&&N++<400;){const P=-160+E()*92,k=102+E()*76;if(k<nn(P)+16)continue;const L=7+E()*5,H=6+E()*3;y.some(z=>Math.abs(z.x-P)<(z.w+L)/2+2.5&&Math.abs(z.z-k)<(z.d+H)/2+2.5)||y.push({x:P,z:k,w:L,d:H})}for(const P of y){const k=ti(P.x,P.z),L=(E()<.5?0:Math.PI)+(E()-.5)*.15;J_(r,P.x,k,P.z,L,P.w,P.d,4.2+E()*1.6,E,t,{steps:E()<.5?2:3}),un(P.x-P.w/2-1,P.z-P.d/2-1,P.x+P.w/2+1,P.z+P.d/2+1)}return o.village=y,c("village"),e(.8),{groups:n,plaques:s,anchors:o}}function e2({trees:i,bamboo:t,grass:e,rocks:n,plants:s,tier:o,groundMap:r,anchors:a}){const c=ee(4242),l=(y,E)=>ti(y,E),u=(y,E,U,N=1,P=null)=>{i.plant(y,E,P===null?l(E,U):P,U,N),f(y,E,U,N)},f=(y,E,U,N)=>{if(!r)return;const P=y==="ginkgo"?[224,176,60]:y==="maple"?[178,64,40]:y==="persimmon"?[190,110,50]:null;if(!P)return;const k=(y==="ginkgo"?5.5:4)*N;for(let L=0;L<260;L++){const H=c()*Math.PI*2,z=Math.pow(c(),.7)*k;r.dab(E+Math.cos(H)*z,U+Math.sin(H)*z,.06+c()*.08,`rgba(${P[0]},${P[1]},${P[2]},${.55+c()*.4})`)}};u("ginkgo",-8.6,33,1.12),u("ginkgo",8.6,33.4,1.05),u("pine",-11.4,-13.2,.95),u("pine",11.4,-12.6,1),u("osmanthus",-11.6,13.5,1),u("osmanthus",11.6,13.2,1.05),u("osmanthus",-11.8,2.5,.85),u("osmanthus",11.8,2.8,.85),u("pine",-11.5,-48.6,.9),u("pine",12.5,-48.4,.95),u("ginkgo",.5,-50.5,.9);for(const[y,E,U]of[[-54.6,22.5,1],[-48.5,12.6,.95],[-27.4,15.3,1.05],[-24.6,33.6,.95],[-45.2,41.8,1],[-33.5,41.4,.9]])u("willow",y,E,U);u("maple",-56,32.5,1),u("maple",-29.5,44.2,.95),u("maple",-24,8.5,.9),u("pine",-54.5,44,.75,2.4),u("pine",-43.2,28.4,.5,.3),u("osmanthus",-29,4.5,.95),u("osmanthus",-47.5,4.2,.9),u("pine",-50.8,-6.5,.9),u("maple",-26.5,-7.5,.85),u("osmanthus",-28.5,-20,.8),u("osmanthus",23.4,-4.6,1.2),u("osmanthus",47.6,-4.4,1.2),u("ginkgo",49,-47,1),u("pine",21.8,-30.5,.85),u("pine",50.4,-32.5,.85);for(const[y,E]of[[28.6,19.4],[39.6,19.6],[28.4,30.8],[39.8,30.6]])u("osmanthus",y,E,.95);u("maple",23.2,41,1),u("maple",44.5,41.5,.95),u("persimmon",50,9.5,.95),u("persimmon",24,9.2,.9),u("pine",-12.5,53.5,1.05),u("pine",12.5,54,1);const d=(y,E)=>Rn(y,E,{pathPad:.8,waterPad:.6})&&$l(y,E,1.4),h=y=>Math.round(y*(o.name==="low"?.5:1));t.grove(-53,-30,6.5,h(70),l,d),t.grove(-52,-16,4.5,h(38),l,d),t.grove(-44,-50,6,h(55),l,d),t.grove(-30,-50,5.5,h(45),l,d),t.grove(-23,-36,4.5,h(40),l,d),t.grove(-22,-14,3.2,h(18),l,d),t.grove(51,-18,3.5,h(26),l,(y,E)=>d(y,E)),t.grove(-56,4,3,h(20),l,d),t.grove(-60,-78,9,h(60),l,(y,E)=>Rn(y,E));for(const[y,E,U]of[[-32,-17.5,1.25],[-41,-18.4,.9],[40.5,13.5,1.3],[-33.5,4.8,1.1],[-44.2,26.5,.9],[-42,29.8,.7],[12.5,18,.95],[-12.5,-5,.8],[27.5,-15.5,1],[-25,26.5,.8]])n.place("taihu",y,l(y,E)-.1,E,U);const g=a.rockPavilion;for(let y=0;y<3;y++){const E=4.6-y*1.5,U=14-y*4;for(let N=0;N<U;N++){const P=N/U*Math.PI*2+y;n.place("boulder",g.x+Math.cos(P)*E,-.3+y*.75,g.z+Math.sin(P)*E,1.5-y*.2,1.4+y*.2)}}n.place("taihu",g.x+3.4,1.4,g.z-3.2,.9),n.place("taihu",g.x-3.8,.8,g.z+1.5,1.1);for(let y=0;y<Gn.length;y+=o.name==="low"?2:1){const[E,U]=Gn[y],N=Gn[(y+1)%Gn.length];if(Math.abs(E+37.5)<9&&U<17)continue;const P=.55+c()*.6;n.place(c()<.6?"slab":"boulder",E+(c()-.5)*.6,Ce-.25-c()*.2,U+(c()-.5)*.6,P*1.4,P,Math.atan2(N[0]-E,N[1]-U))}for(let y=0;y<Zs.length;y+=2)n.place("boulder",Zs[y][0],Ce-.2,Zs[y][1],.7+c()*.4,.6);for(const[y,E]of io.filter((U,N)=>N%3===0))if(!(E<-55||E>18))for(const U of[-1,1])n.place(c()<.5?"slab":"boulder",y+U*(1.5+c()*.4),Ce-.2,E+(c()-.5),.45+c()*.4,.4+c()*.3);for(let y=0;y<4;y++)n.place("slab",-52.2+y*.05,Ce+.12,-12.5+y*.85-1.3,.42,.25);const x=o.name==="low"?160:360;for(let y=0,E=0;y<x&&E<x*8;E++){const U=c()*Math.PI*2,N=70+c()*330,P=Math.cos(U)*N,k=Math.sin(U)*N,L=l(P,k);L<3||!Rn(P,k)||(n.place("boulder",P,L-.4,k,1+c()*2.4,.8+c()*1.8),y++)}for(let y=-150;y<150;y+=4+c()*6)for(const E of[-1,1]){if(c()<.45)continue;const U=nn(y)+E*(Mn+.3+c()*1.5);Math.abs(y)<6||n.place(c()<.5?"slab":"boulder",y,Yi-.15,U,.6+c()*.8,.5+c()*.5)}const p=(y,E,U,N)=>{for(let P=0,k=0;P<N&&k<N*5;k++){const L=c()*Math.PI*2,H=Math.sqrt(c())*U,z=y+Math.cos(L)*H,O=E+Math.sin(L)*H;if(po(z,O)>-.8)continue;const Y=c()<.35;s.pad(z,Ce+.02+c()*.03,O,.32+c()*.35,Y?9075264:c()<.5?5798458:6982212),c()<.3&&s.stalk(z+.2,Ce,O,.8+c()*.6),P++}},m=o.name==="low"?.5:1;p(-30,30,5.5,Math.round(70*m)),p(-49,31,4.5,Math.round(50*m)),p(-36,35.5,3,Math.round(26*m));const v=o.name==="low"?180:420;for(let y=0;y<v;y++){const E=-220+c()*440,U=c()<.5?-1:1,N=nn(E)+U*(Mn-.5+c()*2.2);Math.abs(E)<7||s.reed(E,Math.max(Yi-.1,l(E,N)),N,.8+c()*.6)}for(const[y,E]of[...rr,...io.filter(([,U])=>U<-56)]){if(c()<.5)continue;const U=c()<.5?-1:1;s.reed(y+U*(1.3+c()),l(y+U*1.5,E)-.05,E,.7+c()*.4)}for(let y=0;y<26;y++){const E=Math.floor(c()*Gn.length),[U,N]=Gn[E];N<17&&Math.abs(U+37.5)<10||s.reed(U+(c()-.5),Ce-.05,N+(c()-.5),.6+c()*.3)}const M=o.name==="low"?110:240;for(let y=0,E=0;y<M&&E<M*10;E++){const U=Yt.x0+1+c()*(Yt.x1-Yt.x0-2),N=Yt.z0+1+c()*(Yt.z1-Yt.z0-2);Rn(U,N,{pathPad:.9,waterPad:.8})&&(Pe(U*.15,N*.15)<.45||(i.plant(c()<.8?"shrub":"shrubRed",U,l(U,N)-.05,N,.7+c()*.6),y++))}const _=Math.round(16e3*o.grass),w=[9080658,8227402,10130776,10918494,7307334];for(let y=0,E=0;y<_&&E<_*6;E++){const U=c()<.45;let N,P;if(U)N=Yt.x0+c()*(Yt.x1-Yt.x0),P=Yt.z0+c()*(Yt.z1-Yt.z0);else{const L=c()*Math.PI*2,H=50+Math.pow(c(),1.6)*150;N=Math.cos(L)*H,P=Math.sin(L)*H*.9+10}if(!Rn(N,P,{pathPad:.35,waterPad:.3})||so(N,P)>=0||Pe(N*.08+3,P*.08)<.32)continue;const k=l(N,P);k<Ce+.05||(e.add(N,k,P,.75+c()*.6,w[Math.floor(c()*w.length)]),y++)}const b=Math.round(650*o.grass),A=[15253568,15918792,14263354,12152906,13084632];for(let y=0,E=0;y<b&&E<b*8;E++){const U=Yt.x0+c()*(Yt.x1-Yt.x0),N=Yt.z0+c()*(Yt.z1-Yt.z0);Rn(U,N,{pathPad:.5,waterPad:.6})&&(Pe(U*.2-7,N*.2)<.58||(e.flower(U,l(U,N),N,A[Math.floor(c()*A.length)]),y++))}for(let y=-110;y<120;y+=9+c()*7)if(!(Math.abs(y)<10))for(const E of[-1,1]){if(c()<.35)continue;const U=nn(y)+E*(Mn+2.5+c()*3);Rn(y,U,{waterPad:.5})&&u(c()<.75?"willow":"broad",y,U,.85+c()*.3)}for(let y=0,E=0;y<(o.name==="low"?14:28)&&E<300;E++){const U=-165+c()*105,N=100+c()*85;!Rn(U,N)||N<nn(U)+14||(u(c()<.4?"persimmon":c()<.6?"broad":"ginkgo",U,N,.8+c()*.4),y++)}for(let y=0,E=0;y<(o.name==="low"?40:90)&&E<1500;E++){const U=c()*Math.PI*2,N=66+c()*120,P=Math.cos(U)*N,k=Math.sin(U)*N;if(!Rn(P,k)||so(P,k)>=0)continue;const H=l(P,k)>6?"pine":c()<.5?"broad":c()<.5?"maple":"ginkgo";Pe(P*.03,k*.03)<.4||(u(H,P,k,.8+c()*.45),y++)}const R=Math.round(o.name==="low"?1600:3800),S=[9079368,11035706,7240260,12094014,9066038,6188608,10123834];for(let y=0,E=0;y<R&&E<R*8;E++){const U=c()*Math.PI*2,N=120+Math.pow(c(),.8)*420,P=Math.cos(U)*N,k=Math.sin(U)*N,L=l(P,k);if(L<2.5)continue;const H=ua(P*.012,k*.012,3);if(H<.47||!Rn(P,k,{pathPad:1.5}))continue;const z=L>22||c()<.55,O=1+c()*.9+(H-.47)*2,Y=z?c()<.85?0:2:c()<.5?1:3;i.farTree(Y,P,L-.4,k,O,z?c()<.5?4086340:4612170:S[Math.floor(c()*S.length)]),y++}r&&(r.tex.needsUpdate=!0)}function n2(i,t){const e=i.attributes.position,n=i.attributes.normal,s=new Float32Array(e.count);for(let o=0;o<e.count;o++)s[o]=t(e,n,o);return i.setAttribute("aMask",new le(s,1)),i}function i2(){const i=new Ke(1,1,1);i.translate(0,.5,0);const t=i.attributes.normal,e=i.attributes.uv,n=new Float32Array(t.count*3),s=new Rt(15326400);for(let o=0;o<t.count;o++){const r=t.getZ(o)>.5,a=Math.abs(t.getX(o))>.5,c=r||a?[1,1,1]:[s.r,s.g,s.b];n.set(c,o*3),r?e.setXY(o,e.getX(o)*.5,e.getY(o)):e.setXY(o,.75,.5)}return i.setAttribute("color",new le(n,3)),n2(i,(o,r,a)=>r.getZ(a)>.5||Math.abs(r.getX(a))>.5?1:0),i}function s2(){const i=document.createElement("canvas");i.width=64,i.height=128;const t=i.getContext("2d");t.fillStyle="#fff",t.fillRect(0,0,64,128),t.fillStyle="rgba(0,0,0,0.28)",t.fillRect(0,8,32,5),t.fillRect(0,115,32,5),t.fillStyle="rgba(230,200,120,0.85)",t.fillRect(0,16,32,3),t.fillRect(0,108,32,3),t.fillStyle="rgba(245,236,214,0.95)",t.fillRect(8,30,16,34),t.fillStyle="rgba(40,30,25,0.6)";for(let n=0;n<4;n++)t.fillRect(12,36+n*7,8,2);const e=new ji(i);return e.colorSpace=We,e}function o2(){const i=new Ne(1,1,1,10,1);i.rotateZ(Math.PI/2);const t=new Ne(.7,.7,.12,8);t.rotateZ(Math.PI/2),t.translate(-.56,0,0);const e=t.clone();e.translate(1.12,0,0);const n=[i,t,e].map(l=>l.toNonIndexed()),s=[],o=[],r=[],a=[];n.forEach((l,u)=>{s.push(...l.attributes.position.array),o.push(...l.attributes.normal.array);for(let f=0;f<l.attributes.position.count;f++)r.push(...u===0?[1,1,1]:[.2,.12,.08]),a.push(u===0?1:0)});const c=new Gt;return c.setAttribute("position",new at(s,3)),c.setAttribute("normal",new at(o,3)),c.setAttribute("color",new at(r,3)),c.setAttribute("aMask",new at(a,1)),c.setAttribute("uv",new at(new Array(s.length/3*2).fill(.75),2)),c}function Yh(i){return i==="paper"?new Ne(.2,.2,.42,14,1):ni([[.05,-.27],[.2,-.22],[.28,-.08],[.29,.04],[.26,.16],[.18,.25],[.05,.28]],14)}function r2(i,t){const e=i.instancer,n=la({roughness:.85,map:s2()}),s=la({roughness:.8});e.define("book",i2(),n,{cast:!0,receive:!0}),e.define("scroll",o2(),s,{cast:!0,receive:!0});const o=ml({intensity:2.6,color:16777215}),r=ml({intensity:2.4,color:16777215});i.lanternMats=[o,r],e.define("lanternRed",Yh("red"),o,{cast:!1,receive:!1}),e.define("lanternPaper",Yh("paper"),r,{cast:!1,receive:!1});const a=new Ne(.12,.15,.06,10);a.translate(0,.3,0);const c=a.clone();c.translate(0,-.6,0);const l=new Ne(.015,.05,.3,6);l.translate(0,-.48,0);const u=od(a2([a,c,l]),3810328,B.wood,.9);return e.define("lanternCap",u,i.mats.solid,{cast:!0,receive:!1}),i.halos=[],{books:n,masked:s}}function a2(i){const t=[],e=[];for(const s of i){const o=s.index?s.toNonIndexed():s;t.push(...o.attributes.position.array),e.push(...o.attributes.normal.array)}const n=new Gt;return n.setAttribute("position",new at(t,3)),n.setAttribute("normal",new at(e,3)),n}const ma=[9194034,6056536,11569746,4147794,13351316,8019016,10189630,5061424,3097174,7024166,14208952],vl=[3097174,3820124,2504266,5924464];function ud(i,t,e,n,s,o=1.8,r=3,a=.45,c=5,l=Math.random,u={}){i.pushT(t,e,n,s);const f=u.wood||7227954,d=.05;i.box("solid",f,d,r,a,-o/2+d/2,0,0,{kind:B.wood}),i.box("solid",f,d,r,a,o/2-d/2,0,0,{kind:B.wood}),u.open||i.box("solid",5913126,o,r,.03,0,0,-a/2+.015,{kind:B.wood}),i.box("solid",f,o+.12,.08,a+.08,0,r,0,{kind:B.wood,chamfer:.015}),i.box("solid",f,o,.1,a,0,0,0,{kind:B.wood});const h=(r-.15)/c,g=u.density!==void 0?u.density:1;for(let x=0;x<c;x++){const p=.1+x*h;i.box("solid",f,o-d*2,.035,a-.02,0,p,0,{kind:B.wood});const m=u.scrolls&&l()<.35?"scroll":"books";let v=-o/2+d+.02;const M=o/2-d-.02;if(m==="scroll"){const _=Math.max(2,Math.floor((h-.06)/.09));for(let w=0;w<_;w++)for(let b=0;b<3;b++){if(l()>g*.95)continue;const A=(o-.2)/3-.06;i.inst("scroll",-o/2+.12+(b+.5)*((o-.2)/3),p+.08+w*.085,(l()-.5)*.06,0,1,l()<.5?15260864:14206106,1,0,0);const R=i.instancer.defs.get("scroll");R.matrices[R.matrices.length-1].multiply(new vt().makeScale(A,.035,.035))}continue}for(;v<M-.03;){if(l()>g){v+=.08+l()*.15;continue}if(l()<.12){const y=.22+l()*.08;if(v+y>M)break;const E=2+Math.floor(l()*5);for(let U=0;U<E;U++){const N=vl[Math.floor(l()*vl.length)],P=Bt(v+y/2,p+.035+U*.045,.02,(l()-.5)*.12,1,1,1,0,Math.PI/2);P.multiply(new vt().makeScale(.042,y,a*.7)),i.instM("book",P,N)}v+=y+.02;continue}const _=.035+l()*.05,w=Math.min(h-.06,(h-.06)*(.62+l()*.35)),b=a*(.62+l()*.28);if(v+_>M)break;const A=l()<.07?(l()<.5?-1:1)*(.15+l()*.25):0,R=new Rt(ma[Math.floor(l()*ma.length)]).multiplyScalar(.8+l()*.35),S=Bt(v+_/2,p+.035,a/2-b/2-.02-l()*.02,0,1,1,1,0,A);S.multiply(new vt().makeScale(_,w,b)),i.instM("book",S,R),v+=_+.004+(A?.04:0)}}i.pop()}function Ql(i,t,e,n,s,o,r=0){for(let a=0;a<s;a++){const c=.18+o()*.08,l=.24+o()*.06,u=Bt(t+(o()-.5)*.03,e+a*.032,n+(o()-.5)*.03,r+(o()-.5)*.3,1,1,1,0,Math.PI/2);u.multiply(new vt().makeScale(.03,c,l)),i.instM("book",u,o()<.5?vl[Math.floor(o()*4)]:ma[Math.floor(o()*ma.length)])}}function hd(i,t,e,n,s=0){for(const o of[-1,1])i.box("solid",15787728,.2,.012,.28,t+Math.cos(s)*o*.1,e,n-Math.sin(s)*o*.1,{ry:s,rz:-o*.08,kind:B.plain});i.box("solid",4864558,.42,.008,.3,t,e-.006,n,{ry:s,kind:B.cloth})}function tu(i,t,e,n,s,o,r,a=.78,c=8016438){i.pushT(t,e,n,s),i.box("solid",c,o,.06,r,0,a-.06,0,{kind:B.wood,chamfer:.012}),i.box("solid",4861984,o-.12,.08,r-.1,0,a-.14,0,{kind:B.wood});for(const l of[-1,1])for(const u of[-1,1])i.box("solid",c,.06,a-.06,.06,l*(o/2-.08),0,u*(r/2-.07),{kind:B.wood});for(const l of[-1,1])i.box("solid",c,o-.2,.04,.03,0,.12,l*(r/2-.07),{kind:B.wood});i.pop()}function Jo(i,t,e,n,s,o,r=6964784){i.pushT(t,e,n,s),i.box("solid",r,o,.06,.32,0,.4,0,{kind:B.wood,chamfer:.012});for(const a of[-1,1])i.box("solid",r,.06,.4,.26,a*(o/2-.12),0,0,{kind:B.wood});i.pop()}function fd(i,t,e,n,s=pt.stone,o=.22,r=.45){i.cyl("solid",s,o,r,t,e,n,{rTop:o*.85,seg:10,kind:B.stone})}function c2(i,t,e,n,s){i.cyl("solid",s,.28,.1,t,e,n,{rTop:.25,seg:12,kind:B.cloth,jitter:.05})}function Zh(i,t,e,n,s,o=2.8,r=.22){i.pushT(t,e,n,s);for(const a of[-1,1])i.box("solid",8018490,.05,o,.05,a*.22,0,0,{rx:-r,kind:B.wood});for(let a=1;a<Math.floor(o/.32);a++){const c=a*.32;i.box("solid",8018490,.44,.03,.03,0,c,-Math.sin(r)*c,{kind:B.wood})}i.pop()}function oo(i,t,e,n,s,o="red",r=null){const a=o==="red"?16734762:16767392;t.inst(o==="red"?"lanternRed":"lanternPaper",e,n,s,0,1,a),t.inst("lanternCap",e,n,s,0,o==="paper"?.9:1),r!==null&&t.rod("solid",2760216,e,n+.3,s,e,r,s,.008,{seg:3});const c=t.toWorld(e,n,s);i.halos.push({x:c.x,y:c.y,z:c.z,s:o==="red"?1.6:1.4,c:o==="red"?16742976:16763008})}function dd(i,t,e,n,s,o=1){t.pushT(e,n,s,0,o),t.box("solid",pt.stone,.6,.18,.6,0,0,0,{kind:B.stone,chamfer:.02}),t.cyl("solid",pt.stone,.1,.75,0,.18,0,{seg:8,kind:B.stone}),t.box("solid",pt.stone,.5,.1,.5,0,.93,0,{kind:B.stone}),t.box("solid",pt.stoneGrey,.36,.34,.36,0,1.03,0,{kind:B.stone}),t.box("glow",16756832,.26,.2,.38,0,1.1,0,{kind:B.plain}),t.box("glow",16756832,.38,.2,.26,0,1.1,0,{kind:B.plain}),t.cone("solid",pt.stone,.42,.32,0,1.37,0,{seg:6,kind:B.stone}),t.sphere("solid",pt.stone,.07,0,1.74,0,{seg:6,kind:B.stone}),t.pop();const r=t.toWorld(e,n+1.15*o,s);i.halos.push({x:r.x,y:r.y,z:r.z,s:1.1*o,c:16756832})}function pd(i,t,e,n,s){t.box("solid",4863014,.12,2.1,.12,e,n,s,{kind:B.wood}),t.box("solid",3811872,.42,.06,.42,e,n+2.1,s,{kind:B.wood}),t.box("glow",16764816,.3,.38,.3,e,n+2.16,s,{kind:B.plain}),t.cone("solid",3024416,.32,.22,e,n+2.54,s,{seg:4,ry:Math.PI/4});const o=t.toWorld(e,n+2.35,s);i.halos.push({x:o.x,y:o.y,z:o.z,s:1.3,c:16760944})}function l2(i,t,e,n){i.box("solid",pt.stone,1.5,.35,1.5,t,e,n,{kind:B.stone,chamfer:.04});const s=ni([[0,0],[.45,.02],[.62,.22],[.66,.5],[.6,.72],[.68,.78],[.68,.84],[.55,.84]],16);i.add("solid",s,Bt(t,e+.75,n),4867124,{kind:B.gold,ao:.85});for(let o=0;o<3;o++){const r=o/3*Math.PI*2;i.cyl("solid",4078126,.07,.42,t+Math.cos(r)*.38,e+.35,n+Math.sin(r)*.38,{rTop:.1,seg:6,kind:B.gold})}for(const o of[-1,1])i.box("solid",4867124,.08,.4,.3,t+o*.58,e+1.55,n,{kind:B.gold});return i.cyl("solid",2762272,.5,.05,t,e+1.56,n,{seg:14,kind:B.plain}),{x:t,y:e+1.62,z:n}}function $h(i,t,e,n){const s=ni([[0,0],[.55,.05],[.78,.4],[.82,.8],[.78,.98],[.7,.98],[.7,.9]],18);i.box("solid",pt.stone,1.4,.3,1.4,t,e,n,{kind:B.stone,chamfer:.03}),i.add("solid",s,Bt(t,e+.3,n),5983286,{kind:B.gold,ao:.85}),i.cyl("solid",2240556,.7,.02,t,e+1.15,n,{seg:18,kind:B.plain,ao:.6})}function u2(i,t,e,n,s,o=3.2,r=Math.random){i.pushT(t,e,n,s);for(const c of[-1,1])i.box("solid",4861984,.14,2.5,.14,c*(o/2),0,0,{kind:B.wood});i.box("solid",6965808,o,1.3,.06,0,.95,0,{kind:B.wood}),i.box("solid",3811872,o+.5,.08,.5,0,2.5,0,{kind:B.wood}),i.cone("solid",4013115,(o+.8)*.72,.4,0,2.55,0,{seg:4,ry:Math.PI/4,kind:B.plain});let a=-o/2+.25;for(;a<o/2-.3;){const c=.36+r()*.2,l=.5+r()*.3,u=1+r()*(1.15-l);i.box("solid",15919314,c,l,.01,a+c/2,u,.04,{kind:B.plain,rz:(r()-.5)*.05});for(let f=0;f<4;f++)i.box("solid",4866104,c*.7,.012,.012,a+c/2,u+l-.1-f*.06,.05,{kind:B.plain});r()<.5&&i.box("solid",11551532,.07,.07,.012,a+c-.1,u+.08,.05,{kind:B.plain}),a+=c+.08+r()*.1}i.pop()}function jh(i,t,e,n,s=Math.random){i.cyl("solid",pt.stone,.35,.65,t,e,n,{rTop:.25,seg:10,kind:B.stone}),i.box("solid",12103064,.8,.1,.8,t,e+.65,n,{kind:B.stone,chamfer:.02}),i.box("solid",9075290,.62,.005,.62,t,e+.75,n,{kind:B.plain});for(let o=0;o<26;o++)i.cyl("solid",s()<.5?1841688:15921128,.014,.012,t+(Math.floor(s()*13)-6)*.045,e+.755,n+(Math.floor(s()*13)-6)*.045,{seg:6,kind:B.plain});for(let o=0;o<4;o++){const r=o/4*Math.PI*2+Math.PI/4;fd(i,t+Math.cos(r)*.85,e,n+Math.sin(r)*.85,pt.stone,.2,.42)}}function ga(i,t,e,n,s=Math.random){i.cyl("solid",6969928,.24,.32,t,e,n,{rTop:.3,seg:10,kind:B.stone});for(let o=0;o<5;o++)i.sphere("solid",s()<.3?8018474:4086324,.14+s()*.1,t+(s()-.5)*.3,e+.42+s()*.3,n+(s()-.5)*.3,{seg:6,kind:B.plain})}function h2(i,t,e,n,s=1){i.cyl("solid",13150304,.9*s,1.1*s,t,e,n,{rTop:1*s,seg:10,kind:B.plain,jitter:.06}),i.cone("solid",12097626,1.05*s,1*s,t,e+1.1*s,n,{seg:10,kind:B.plain}),i.cyl("solid",5917232,.04,.6*s,t,e+2*s,n,{seg:4})}function f2(i){const t=i.length,e=new Le(1,1),n=new Pa;n.index=e.index,n.attributes.position=e.attributes.position,n.attributes.uv=e.attributes.uv;const s=new Float32Array(t*4),o=new Float32Array(t*3),r=new Rt;i.forEach((l,u)=>{s.set([l.x,l.y,l.z,l.s],u*4),r.set(l.c),o.set([r.r,r.g,r.b],u*3)}),n.setAttribute("iOff",new qn(s,4)),n.setAttribute("iCol",new qn(o,3)),n.instanceCount=t;const a=new Xe({uniforms:Object.assign({},De,{uHalo:{value:1}}),vertexShader:`
      attribute vec4 iOff;
      attribute vec3 iCol;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vFlick;
      void main() {
        vUv = uv;
        vCol = iCol;
        float ph = dot( iOff.xz, vec2( 1.7, 2.3 ) );
        vFlick = 0.85 + 0.09 * sin( uTime * 7.3 + ph ) + 0.06 * sin( uTime * 13.1 + ph * 1.7 );
        vec4 mv = viewMatrix * vec4( iOff.xyz, 1.0 );
        mv.xy += position.xy * iOff.w;
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      uniform float uLamp;
      uniform float uHalo;
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vFlick;
      void main() {
        float d = length( vUv - 0.5 ) * 2.0;
        float a = exp( - d * d * 5.0 ) * ( 1.0 - smoothstep( 0.75, 1.0, d ) );
        gl_FragColor = vec4( vCol * a * 0.85 * vFlick * uLamp * uHalo, 1.0 );
      }
    `,transparent:!0,depthWrite:!1,blending:Tc,fog:!1});a.userData.loqPatched=!0;const c=new Wt(n,a);return c.frustumCulled=!1,c.renderOrder=5,c.name="halos",c}function d2({B:i,kit:t,crowd:e,tier:n,anchors:s}){const o=ee(777),r=ti,a=n.name==="low";for(const v of[1,-1])for(const M of[-1,1])oo(t,i,M*2.6,3.65,Pn.z+v*3.35,"red",4.55);e.place("stand",-3.2,0,Pn.z+8.2,2.6,null),e.place("stand",-2.5,0,Pn.z+8.9,-2.9,null),e.place("stand",5.4,0,Pn.z+10.5,.4,null),e.place("stand",4.8,0,Pn.z+6.4,-.9,null,null,.66);for(const v of[-1,1])Jo(i,v*8.6,0,37.6,0,2.6,6176298),e.place("sit",v*8.6-.6,0,37.65,Math.PI,null),v>0&&e.place("sitRead",v*8.6+.6,0,37.65,Math.PI,null);e.place("stand",-4.6,0,29.6,.6,null),e.place("stand",-3.9,0,30.2,-2.4,null);for(const[v,M,_]of[[-15.75,-6.2,Math.PI/2],[-15.75,9.4,Math.PI/2],[15.75,-12.6,-Math.PI/2],[15.75,3.4,-Math.PI/2]])e.place(o()<.5?"sitRead":"sit",v,.24,M,_,null);for(const[v,M]of[[-24.5,13.8],[-52.4,13.6],[-26.4,38.4],[-44.2,30.6]])dd(t,i,v,r(v,M),M,.9);e.place("stand",-31.2,-.17,23.4,.3,15262420),e.place("stand",-31.9,-.17,23.1,1.1,6961726),e.place("stand",-38.4,-.17,24.9,2.8,null,null,.66);const c=s.rockPavilion;e.place("sit",c.x+.9,c.y+.4,c.z+1.2,-2.6,null),e.place("sit",c.x-1.1,c.y+.4,c.z+.8,2.3,4016732);const l=s.osmanthus;jh(i,l.x,l.floor,l.z,o),[[l.x+.85,l.z+.85],[l.x-.85,l.z-.85]].forEach(([v,M],_)=>e.place("sit",v,l.floor-.03,M,Math.atan2(l.x-v,l.z-M),_?4016732:12165754)),e.place("stand",l.x+1.6,l.floor,l.z-.9,-1.2,null),e.place("stand",l.x-1.4,l.floor,l.z+1.6,2.4,8034954),jh(i,42.5,0,36.5,o),e.place("sit",43.35,0,37.35,Math.atan2(-.85,-.85),null),e.place("sit",41.65,0,35.65,Math.atan2(.85,.85),null),ga(i,l.x+3.6,0,l.z-3.6,o),ga(i,l.x-3.6,0,l.z-3.6,o),e.place("stand",3.8,0,-47.6,.7,7230528),e.place("sitRead",-9.6,0,-47.2,.4,null),Jo(i,-9.6,0,-47.6,0,1.8,6176298);for(const v of[50.5,56,62,67.5])for(const M of[-1,1])pd(t,i,M*4.4,r(M*4.4,v),v);const f=a?10:22;for(let v=0,M=0;v<f&&M<600;M++){const _=-60+o()*180,w=100+o()*90;so(_,w)===1&&(h2(i,_,r(_,w),w,.8+o()*.5),v++)}for(let v=0,M=0;v<(a?6:12)&&M<600;M++){const _=-50+o()*160,w=100+o()*80;so(_,w)<=0||(e.place("stand",_,r(_,w),w,o()*6.28,o()<.5?5925498:9078400),v++)}for(const v of(s.village||[]).slice(0,a?5:10)){const M=v.x+(o()-.5)*6,_=v.z+v.d/2+1.5+o()*2;Rn(M,_,{pathPad:0})&&e.place("stand",M,r(M,_),_,o()*6.28,null,null,o()<.25?.66:1)}const d=-24;e.place("sit",d,r(d,nn(d)-11),nn(d)-11,Math.PI,5925498);const h=(v,M)=>e.walker(v,M);h([[0,.14,21],[.3,.14,10],[3.2,.14,6.5],[3.4,.14,-4],[.4,.14,-8],[0,.14,-18.5]],{speed:.8}),h([[0,.14,21],[-.4,.14,12],[-3.6,.14,7],[-3.4,.14,-5],[0,.14,-17]],{speed:.7}),h([[0,0,43],[.5,0,33],[.2,0,24.5]],{speed:.9}),h([[-16.75,.24,-19],[-16.75,.24,20]],{speed:.75}),h([[16.75,.24,19.5],[16.75,.24,-19]],{speed:.8}),h([[16.75,.24,-5],[16.75,.24,15]],{speed:.6,child:!0});for(const v of[0,2,4,5,7])h(Ko[v].pts,{speed:.7});h([[5,0,56],[1,0,62],[.5,0,70]],{speed:.85}),h(gi[3].pts.slice(0,30),{speed:.9}),h(gi[4].pts.slice(0,26),{speed:.85}),h(gi[2].pts.slice(4,40),{speed:.8}),h(gi[1].pts.slice(4,36),{speed:.9}),a||(h(gi[2].pts.slice(10,48),{speed:.7,child:!0}),h([[25,0,-2],[30,0,-12],[40,0,-14],[48,0,-6]],{speed:.6}),h([[-34,0,-3.5],[-28,0,-6],[-22,0,-9],[-18.6,0,-9]],{speed:.7}),h(gi[5].pts.slice(0,30),{speed:.7}));const g=nn(.5),x=13/2+3.5,p=v=>{const M=Math.abs(v),_=M<.78?Math.pow(Math.cos(M/.78*Math.PI/2),1.25):0;return .3+(3.1+.25)*_},m=[];for(let v=0;v<=12;v++){const M=v/12*2-1;m.push([.5+(v%2?.3:-.3)*0,p(M)+.02,g+M*x*.98])}h([[.5,r(.5,g-x-6),g-x-6],...m,[.6,r(.6,g+x+6),g+x+6]],{speed:.75}),h([[.9,r(.9,g-x-9),g-x-9],...m.map(([v,M,_])=>[v+.8,M,_]),[1.3,r(1.3,g+x+9),g+x+9]],{speed:.65,u:.3}),e.place("stand",-.6,p(0)+.02,g+.4,Math.PI/2,4016732),e.place("stand",-.5,p(0)+.02,g-.5,Math.PI/2+.3,14208176)}function p2(){const i=new we;i.name="fx";const t=i_(),e=Array.from({length:5},()=>{const s=new Wt(new Le(1,1),ce(new Ri({map:t,color:pt.ink,transparent:!0,opacity:0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4}),"ripple"));return s.rotation.x=-Math.PI/2,s.visible=!1,s.renderOrder=2,s.userData={age:0,dur:3.4,maxR:14},i.add(s),s});let n=0;return{group:i,pulse(s,o,r=14,a=.06){const c=e[n++%e.length];c.position.set(s,a,o),c.userData.age=0,c.userData.maxR=r,c.scale.set(1,1,1),c.visible=!0},update(s){for(const o of e){if(!o.visible)continue;const r=o.userData;r.age+=s;const a=r.age/r.dur;if(a>=1){o.visible=!1;continue}const c=1+(1-Math.pow(1-a,2.2))*r.maxR*2;o.scale.set(c,c,1),o.material.opacity=.34*(1-a)*Math.min(1,a*8)}}}}const te=(i,t,e)=>new C(i,t,e),Zi=new vt,m2={broad:[0,0],ginkgo:[.5,0],pine:[0,.5],maple:[.5,.5]},Ao=new C,ln=new C,Vr=new C,Co=new C,Kh=new Rt;function ro(i,t,e,n,s,o,r,a,c,l,u,f=1){for(let d=0;d<u;d++){Ao.set(r()*2-1,r()*1.6-.6,r()*2-1).normalize();const h=d<u*.25?.25+r()*.35:.6+r()*.45,g=t.x+Ao.x*e*h,x=t.y+Ao.y*e*h*n,p=t.z+Ao.z*e*h;Co.set(g-a.x,(x-a.y)*1.2,p-a.z).normalize().multiplyScalar(.7).addScaledVector(Ao,.3).normalize(),Vr.set(r()*2-1,r()*2-1,r()*2-1).normalize(),ln.crossVectors(Vr,Math.abs(Vr.y)>.9?te(1,0,0):te(0,1,0)).normalize();const m=new C().crossVectors(ln,Vr).normalize(),v=e*(.62+r()*.36)*f,M=[[g-ln.x*v-m.x*v,x-ln.y*v-m.y*v,p-ln.z*v-m.z*v],[g+ln.x*v-m.x*v,x+ln.y*v-m.y*v,p+ln.z*v-m.z*v],[g+ln.x*v+m.x*v,x+ln.y*v+m.y*v,p+ln.z*v+m.z*v],[g-ln.x*v+m.x*v,x-ln.y*v+m.y*v,p-ln.z*v+m.z*v]],[_,w]=m2[s],b=.004,A=[[_+b,w+b],[_+.5-b,w+b],[_+.5-b,w+.5-b],[_+b,w+.5-b]],R=Math.hypot(g-a.x,(x-a.y)*1.2,p-a.z)/c,S=on(.45+.65*R,.4,1),y=(.95+.3*(r()-.5))*(.88+.22*Math.max(0,Co.y))*(h<.6?.86:1);Kh.set(o).multiplyScalar(y),i.quad("cards",M,[Co.x,Co.y,Co.z],A,Kh.clone(),0,0,l(te(g,x,p)),S)}}const vi={pine:4864559,ginkgo:5917246,maple:5061427,willow:5195064,osman:4866104,persim:4076075,broad:5260346},eu=i=>t=>Math.pow(on(t.y/i,0,1),1.7)*.9;function nu(i){if(!i)return;const t=i.attributes.color,e=i.attributes.position,n=i.attributes.aInfo;for(let s=0;s<e.count;s++){const o=.72+.38*me(0,4,e.getY(s))+.12*(Pe(e.getX(s)*9,e.getY(s)*3)-.5);t.setXYZ(s,t.getX(s)*o,t.getY(s)*o,t.getZ(s)*o),n.setW(s,.55+.45*me(0,3,e.getY(s)))}}function g2(i,t,e){const n=ee(i),s=new bn(i),o=(n()-.5)*.7,r=n()*6,a=[];for(let x=0;x<=6;x++){const p=x/6;a.push(te(o*t*p*p*.35+Math.sin(p*4+r)*.38*p,t*p,Math.cos(p*3.4+r)*.32*p))}const c=new Sn(a),l=eu(t);s.add("wood",fs(c,x=>.42*(1-.78*x)+.05,7,12),Zi,vi.pine,{kind:B.wood,flexFn:l});const u=te(o*t*.2,t*.72,0),f=[],d=6+Math.floor(n()*3);for(let x=0;x<d;x++){const p=.36+.56*(x/d)+(n()-.5)*.05,m=c.getPoint(p),v=x*2.39+n()*.7,M=(1.25-p)*(2.6+n()*1.8)*(t/10),_=te(Math.cos(v),.12+n()*.22,Math.sin(v)),w=m.clone().addScaledVector(_,M*.55).add(te(0,-.25,0)),b=m.clone().addScaledVector(_,M).add(te(0,.35,0));s.add("wood",fs(new Sn([m,w,b]),R=>(.13*(1-p)+.04)*(1-.7*R),5,6),Zi,vi.pine,{kind:B.wood,flexFn:l});const A=.75+M*.36;f.push([b.clone().add(te(0,.12,0)),A]),M>1.8&&f.push([w.clone().add(te(_.x*.2,.45,_.z*.2)),A*.7])}const h=c.getPoint(1);f.push([h.clone().add(te(0,.2,0)),1.45]),f.push([h.clone().add(te(.4,-.6,-.3)),1.15]);for(const[x,p]of f)ro(s,x,p,.36,"pine",n()<.5?3428410:4152382,n,u,t*.45,l,e.cards,1.05);const g=s.toGeometry("wood");return nu(g),{wood:g,cards:s.toGeometry("cards")}}function Ro(i,t,e){const n=ee(i),s=new bn(i),o=t.H*(.85+n()*.3),r=eu(o),a=o*t.trunkFrac,c=(n()-.5)*.35,l=new Sn([te(0,0,0),te(c*.4,a*.5,.1),te(c,a,-.05)]);s.add("wood",fs(l,p=>t.r0*(1-.45*p),7,6),Zi,t.bark,{kind:B.wood,flexFn:r});const u=te(c,a+(o-a)*.5,0),f=Math.max(t.cr,(o-a)*.5),d=t.limbs+Math.floor(n()*2),h=[];for(let p=0;p<d;p++){const m=p/d*Math.PI*2+n()*.8,v=t.upright*(.7+n()*.5),M=(o-a)*(.55+n()*.35),_=l.getPoint(1),w=te(Math.cos(m)*(1-v),v,Math.sin(m)*(1-v)).normalize(),b=_.clone().addScaledVector(w,M),A=_.clone().lerp(b,.5).add(te((n()-.5)*.5,.2,(n()-.5)*.5));s.add("wood",fs(new Sn([_,A,b]),R=>t.r0*.55*(1-.75*R),5,5),Zi,t.bark,{kind:B.wood,flexFn:r});for(let R=0;R<2;R++){const S=_.clone().lerp(b,.55+n()*.35),y=S.clone().add(te((n()-.5)*1.6,.4+n()*.6,(n()-.5)*1.6));s.add("wood",fs(new Sn([S,S.clone().lerp(y,.5),y]),E=>t.r0*.2*(1-.8*E),4,3),Zi,t.bark,{kind:B.wood,flexFn:r}),h.push(y)}h.push(b,A)}const g=t.blobs;for(let p=0;p<g;p++){let m;if(p<h.length)m=h[p].clone();else{const _=n()*Math.PI*2,w=(n()-.35)*1.4;m=u.clone().add(te(Math.cos(_)*t.cr*(.5+n()*.5),w*(o-a)*.4,Math.sin(_)*t.cr*(.5+n()*.5)))}const v=t.bs*(.75+n()*.5),M=t.colors[Math.floor(n()*t.colors.length)];ro(s,m,v,t.flat,t.cell,M,n,u,f,r,e.cards)}if(t.fruit)for(let p=0;p<t.fruit;p++){const m=n()*Math.PI*2,v=u.clone().add(te(Math.cos(m)*t.cr*.85,(n()-.4)*(o-a)*.5,Math.sin(m)*t.cr*.85));s.sphere("extra",15231516,.11,v.x,v.y,v.z,{seg:6,flexFn:r})}const x=s.toGeometry("wood");return nu(x),{wood:x,cards:s.toGeometry("cards"),extra:s.toGeometry("extra")}}function x2(i,t){const e=ee(i),n=new bn(i),s=7.5+e()*2,o=eu(s),r=.6+e()*.8,a=new Sn([te(0,0,0),te(r*.3,s*.35,.1),te(r*.8,s*.62,-.1),te(r*1.1,s*.8,0)]);n.add("wood",fs(a,h=>.36*(1-.6*h)+.05,7,8),Zi,vi.willow,{kind:B.wood,flexFn:o});const c=a.getPoint(1),l=te(r,s*.82,0),u=[];for(let h=0;h<5;h++){const g=h/5*Math.PI*2+e(),x=1.8+e()*1.4,p=c.clone().add(te(Math.cos(g)*x,.7+e()*.9,Math.sin(g)*x));n.add("wood",fs(new Sn([c,c.clone().lerp(p,.5).add(te(0,.4,0)),p]),m=>.12*(1-.8*m),5,5),Zi,vi.willow,{kind:B.wood,flexFn:o}),u.push(p),ro(n,p.clone().add(te(0,.1,0)),1.1,.6,"broad",9411148,e,l,3.5,o,Math.round(t.cards*.6),.8)}const f=t.strands;for(let h=0;h<f;h++){const g=u[h%u.length],x=e()*Math.PI*2,p=e()*1.5,m=g.clone().add(te(Math.cos(x)*p,-.1+e()*.4,Math.sin(x)*p)),v=2.6+e()*3.2,M=te(Math.cos(x)*.25,0,Math.sin(x)*.25),_=[];for(let R=0;R<=6;R++){const S=R/6;_.push(m.clone().add(te(M.x*S*(1+S),-v*S,M.z*S*(1+S))))}const w=te(Math.cos(x+Math.PI/2),0,Math.sin(x+Math.PI/2)),b=x_(_,R=>.045*(1-.5*R),w),A=o(te(0,m.y,0));n.add("extra",b,Zi,e()<.5?11842658:10398294,{flexFn:R=>A+on((m.y-R.y)/v,0,1)*1.4,ao:.85})}const d=n.toGeometry("wood");return nu(d),{wood:d,cards:n.toGeometry("cards"),extra:n.toGeometry("extra")}}const Jh={pine:(i,t)=>g2(i,9+i%3*1.5,t),ginkgo:(i,t)=>Ro(i,{H:14,trunkFrac:.4,r0:.38,limbs:5,upright:.62,cr:3,blobs:18,bs:1.25,flat:.95,cell:"ginkgo",bark:vi.ginkgo,colors:[14264380,14726216,13605428,13148746,12098122]},t),maple:(i,t)=>Ro(i,{H:7.5,trunkFrac:.3,r0:.26,limbs:4,upright:.42,cr:3.2,blobs:16,bs:1.15,flat:.8,cell:"maple",bark:vi.maple,colors:[11879212,12868144,11024682,13135930,10107436]},t),osmanthus:(i,t)=>Ro(i,{H:5.2,trunkFrac:.22,r0:.18,limbs:4,upright:.5,cr:2.2,blobs:14,bs:1,flat:.95,cell:"broad",bark:vi.osman,colors:[4284474,4876350,3823156,5795903]},t),persimmon:(i,t)=>Ro(i,{H:6.5,trunkFrac:.3,r0:.22,limbs:5,upright:.45,cr:2.8,blobs:10,bs:.85,flat:.75,cell:"broad",bark:vi.persim,colors:[10902064,12088892,9194026,10119736],fruit:26},t),broad:(i,t)=>Ro(i,{H:10,trunkFrac:.35,r0:.3,limbs:5,upright:.5,cr:3.6,blobs:16,bs:1.35,flat:.85,cell:"broad",bark:vi.broad,colors:[6122556,7041858,8024124,9075264,5399610]},t),willow:(i,t)=>x2(i,t),shrub:(i,t)=>Qh(i,t,[5073468,5796930,4546618]),shrubRed:(i,t)=>Qh(i,t,[10111532,9067056,7236154])};function Qh(i,t,e){const n=ee(i),s=new bn(i),o=te(0,.55,0),r=4+Math.floor(n()*3),a=c=>on(c.y/1.4,0,1)*.5;for(let c=0;c<r;c++){const l=c/r*Math.PI*2+n(),u=c===0?0:.35+n()*.3,f=te(Math.cos(l)*u,.45+n()*.35,Math.sin(l)*u);ro(s,f,.5+n()*.25,.8,"broad",e[Math.floor(n()*e.length)],n,o,1,a,Math.round(t.cards*.7),.9)}return{wood:null,cards:s.toGeometry("cards"),extra:null}}function v2(i){const t=ee(500+i*7),e=new bn(500+i),n=i===2?7:i===0?6:5;e.cyl("w",3812902,.12,n*.45,0,0,0,{seg:4,rTop:.06});const s=a=>on(a.y/n,0,1)*.5,o=te(0,n*.62,0),r=i===0||i===2?"pine":"broad";if(i===0||i===2){const a=i===2?4:3;for(let c=0;c<a;c++){const l=n*(.35+c/a*.6),u=(i===2?.9:1.7)*(1-c/(a+.6));ro(e,te(0,l,0),u,.6,r,16777215,t,o,n*.5,s,5,1.15)}}else{const a=i===3?4:3;for(let c=0;c<a;c++){const l=c/a*Math.PI*2+t(),u=c===0?0:.9;ro(e,te(Math.cos(l)*u,n*(.6+t()*.15),Math.sin(l)*u),i===3?1.5:1.7,.85,r,16777215,t,o,n*.5,s,6,1.1)}}return{wood:e.toGeometry("w"),cards:e.toGeometry("cards")}}function _2(i){const t=i.name==="low",e={cards:t?20:32,strands:t?120:220},n=Qf(t?256:512),s=Dn({flex:.35,flutter:0,translucency:0,side:fn}),o=Dn({flex:.35,flutter:.035,translucency:.5,map:n,alphaTest:.45,side:ve}),r=Dn({flex:.55,flutter:.05,translucency:.45}),a=Dn({flex:.15,flutter:0,translucency:.3,map:n,alphaTest:.45,side:ve}),c={},l=t?2:3;for(const g of Object.keys(Jh)){c[g]=[];for(let x=0;x<l;x++)c[g].push(Jh[g](101+x*17+g.length*7,e))}const u=[0,1,2,3].map(v2),f={},d=(g,x,p=null)=>(f[g]||(f[g]=[])).push({m:x,c:p}),h=ee(909);return{variants:c,plant(g,x,p,m,v=1,M=null){const _=c[g],w=Math.floor(h()*_.length);d(`${g}${w}`,Bt(x,p,m,M===null?h()*Math.PI*2:M,v*(.9+h()*.2)))},farTree(g,x,p,m,v,M){d(`far${g}`,Bt(x,p,m,h()*6,v,v*(.85+h()*.35),v),M)},build(){const g=new we;g.name="trees";const x=(p,m,v,M,_)=>{if(!p||!v||!v.length)return;const w=new $e(p,m,v.length),b=new Rt,A=v.some(R=>R.c!==null&&R.c!==void 0);v.forEach((R,S)=>{var y;w.setMatrixAt(S,R.m),A&&w.setColorAt(S,b.set((y=R.c)!=null?y:16777215))}),w.castShadow=M,w.receiveShadow=!0,_&&w.layers.enable(Oe),w.computeBoundingSphere(),g.add(w)};for(const p of Object.keys(c))c[p].forEach((m,v)=>{const M=f[`${p}${v}`];x(m.wood,s,M,!0,!0),x(m.cards,o,M,!0,!0),x(m.extra,r,M,!0,!0)});return u.forEach((p,m)=>{x(p.wood,s,f[`far${m}`],!1,!1),x(p.cards,a,f[`far${m}`],!t,!1)}),{group:g,materials:{wood:s,cards:o,extra:r,far:a}}}}}const _l=new vt;function M2(){const i=new bn(7),t=8,e=10,n=new Ne(.035,.05,t,6,e,!0);n.translate(0,t/2,0),i.add("culm",n,_l,7309894,{kind:B.plain,flexFn:c=>Math.pow(c.y/t,2)*1.2});for(let c=1;c<e;c++){const l=c/e*t,u=new Ne(.052-c/e*.014,.052-c/e*.014,.05,6,1,!1);u.translate(0,l,0),i.add("culm",u,_l,5927480,{kind:B.plain,flexFn:f=>Math.pow(f.y/t,2)*1.2})}const s=ee(13),o=v_(.32,.05,3,.25);for(let c=0;c<46;c++){const l=t*(.42+s()*.56),u=s()*Math.PI*2,f=.1+s()*.5,d=Bt(Math.cos(u)*f,l,Math.sin(u)*f,-u+Math.PI/2,1+s()*.5,1+s()*.5,1,1.1+s()*.8,(s()-.5)*.6),h=s()<.5?7244872:s()<.5?6126143:9083474;i.add("leaf",o,d,h,{flexFn:g=>Math.pow(l/t,2)*1.2+.15})}const r=i.toGeometry("leaf"),a=i.toGeometry("culm");for(const c of[r,a]){const l=c.attributes.aInfo,u=c.attributes.position;for(let f=0;f<u.count;f++)l.setW(f,.45+.55*me(0,t,u.getY(f)))}return{culm:a,leaf:r}}function y2(i){const t=M2(),e=Dn({flex:1,flutter:0,translucency:.15,side:fn,roughness:.6}),n=Dn({flex:1,flutter:.06,translucency:.5}),s=[],o=ee(31);return{grove(r,a,c,l,u,f=()=>!0){let d=0,h=0;for(;d<l&&h++<l*6;){const g=o()*Math.PI*2,x=Math.sqrt(o())*c,p=r+Math.cos(g)*x,m=a+Math.sin(g)*x;if(!f(p,m))continue;const v=.7+o()*.45,M=.8+o()*.5,_=Bt(p,u(p,m),m,o()*6,M,v,M,(o()-.5)*.12,(o()-.5)*.12);s.push(_),d++}},build(){const r=new we;if(r.name="bamboo",!s.length)return{group:r};const a=new $e(t.culm,e,s.length),c=new $e(t.leaf,n,s.length);s.forEach((l,u)=>{a.setMatrixAt(u,l),c.setMatrixAt(u,l)});for(const l of[a,c])l.castShadow=!0,l.receiveShadow=!0,l.layers.enable(Oe),l.computeBoundingSphere(),r.add(l);return{group:r,count:s.length}}}}function S2(i=7,t=.42){const e=[],n=[],s=ee(3);for(let l=0;l<i;l++){const u=l/i*Math.PI*2+s()*.6,f=.12+s()*.22,d=t*(.6+s()*.6),h=.028+s()*.02,g=Math.cos(u)*.04,x=Math.sin(u)*.04,p=g+Math.cos(u)*f*d,m=x+Math.sin(u)*f*d,v=-Math.sin(u)*h,M=Math.cos(u)*h;e.push(g-v,0,x-M,g+v,0,x+M,p,d,m),n.push(0,0,0,.55,0,0,0,.55,0,0,1,1)}const o=new Gt;o.setAttribute("position",new at(e,3)),o.setAttribute("aInfo",new at(n,4));const r=e.length/3,a=[],c=[];for(let l=0;l<r;l++){a.push(0,1,0);const u=l%3===2;c.push(u?1.15:.6,u?1.15:.62,u?1.05:.55)}return o.setAttribute("normal",new at(a,3)),o.setAttribute("color",new at(c,3)),o.setAttribute("uv",new at(new Array(r*2).fill(0),2)),o}function b2(){const i=new bn(9);i.add("f",Yl(0,3,.2),Bt(0,.16,0,0,.26,.2,.26),4677690,{flexFn:()=>.3});const t=ee(5);for(let e=0;e<4;e++){const n=t()*6.28;i.sphere("f",16777215,.06,Math.cos(n)*.12,.34+t()*.1,Math.sin(n)*.12,{seg:6,sy:.6,flexFn:()=>.8})}return i.toGeometry("f")}function w2(i){const t=Dn({flex:.6,flutter:.03,translucency:.35,side:ve}),e=Dn({flex:.4,flutter:.02,translucency:.25,side:fn}),n=S2(),s=b2(),o=s.attributes.color,r=s.attributes.position;for(let u=0;u<r.count;u++)r.getY(u)<.3&&o.setXYZ(u,.06,.11,.05);const a=[],c=[],l=ee(77);return{add(u,f,d,h,g){a.push({m:Bt(u,f,d,l()*6.28,h,h*(.8+l()*.5),h),c:g})},flower(u,f,d,h){c.push({m:Bt(u,f,d,l()*6.28,.9+l()*.5),c:h})},build(){const u=new we;u.name="grass";const f=(d,h,g,x)=>{if(!g.length)return null;const p=new $e(d,h,g.length),m=new Rt;return g.forEach((v,M)=>{p.setMatrixAt(M,v.m),p.setColorAt(M,m.set(v.c))}),p.castShadow=x,p.receiveShadow=!0,p.computeBoundingSphere(),u.add(p),p};return f(n,t,a,!1),f(s,e,c,!1),{group:u,count:a.length}}}}function wc(i){const t=new Aa(1,3),e=t.attributes.position,n=new C,s=i*7.1;for(let u=0;u<e.count;u++){n.fromBufferAttribute(e,u);const f=ha(n.x*2.2+s,n.y*2.4+n.z*1.7,3),h=.62+.55*Pe(n.x*1.3-s,n.z*1.3+n.y)-.45*Math.pow(f,2.2);n.multiplyScalar(Math.max(.18,h)),n.x*=.62,n.z*=.55,n.y=n.y*1.25+1;const g=1-.28*Math.exp(-((n.y-.9)**2)*2.5);n.x*=g,n.z*=g,e.setXYZ(u,n.x,n.y,n.z)}const o=ed(t);o.computeVertexNormals();const r=o.attributes.position.count,a=new Float32Array(r*3),c=new Float32Array(r*4),l=o.attributes.position;for(let u=0;u<r;u++){const f=l.getX(u),d=l.getY(u)-1,h=l.getZ(u),g=Math.sqrt((f/.6)**2+(d/1.25)**2+(h/.55)**2),x=on(.45+.6*g,.3,1.05),p=new Rt(12170925);a[u*3]=p.r*x,a[u*3+1]=p.g*x,a[u*3+2]=p.b*x*1.03,c[u*4+1]=B.stone,c[u*4+3]=on(.3+.75*g,0,1)}return o.setAttribute("color",new le(a,3)),o.setAttribute("aInfo",new le(c,4)),o}function Po(i,t=.6){const e=Yl(2,i,.32,1.6),n=e.attributes.position;for(let c=0;c<n.count;c++)n.setY(c,n.getY(c)*t+t*.55);e.computeVertexNormals();const s=n.count,o=new Float32Array(s*3),r=new Float32Array(s*4),a=new Rt(10787980);for(let c=0;c<s;c++){const l=e.attributes.normal.getY(c),u=.75+.3*l+.12*(Pe(n.getX(c)*3+i,n.getZ(c)*3)-.5),f=l>.6&&Pe(n.getX(c)*2-i,n.getZ(c)*2)>.55;o[c*3]=(f?.17:a.r)*u,o[c*3+1]=(f?.22:a.g)*u,o[c*3+2]=(f?.09:a.b)*u,r[c*4+1]=B.stone,r[c*4+3]=on(.55+.45*(n.getY(c)/(t*1.6)),0,1)}return e.setAttribute("color",new le(o,3)),e.setAttribute("aInfo",new le(r,4)),e}function E2(i){const t=Vo({detail:i.detail,roughness:.95}),e={taihu:[wc(1),wc(2),wc(3)],boulder:[Po(4,.6),Po(5,.5),Po(6,.75)],slab:[Po(7,.22),Po(8,.18)]},n={},s=ee(55);return{place(o,r,a,c,l,u=l,f=null){const d=`${o}${Math.floor(s()*e[o].length)}`;(n[d]||(n[d]=[])).push(Bt(r,a,c,f===null?s()*6.28:f,l,u,l))},build(){const o=new we;o.name="rocks";for(const[r,a]of Object.entries(e))a.forEach((c,l)=>{const u=n[`${r}${l}`];if(!u)return;const f=new $e(c,t,u.length);u.forEach((d,h)=>f.setMatrixAt(h,d)),f.castShadow=r!=="slab",f.receiveShadow=!0,f.layers.enable(Oe),f.computeBoundingSphere(),o.add(f)});return{group:o}}}}function T2(){const i=new Ai,t=20;for(let a=0;a<=t;a++){const c=.25+a/t*(Math.PI*2-.5),l=1+.06*Math.sin(c*7);a||i.moveTo(0,0),i.lineTo(Math.cos(c)*l,Math.sin(c)*l)}i.closePath();const e=new Vl(i,4);e.rotateX(-Math.PI/2);const n=e.attributes.position;for(let a=0;a<n.count;a++){const c=Math.hypot(n.getX(a),n.getZ(a));n.setY(a,c*c*.08)}e.computeVertexNormals();const s=n.count,o=new Float32Array(s*3),r=new Float32Array(s*4);for(let a=0;a<s;a++){const c=Math.hypot(n.getX(a),n.getZ(a)),l=.7+.35*c;o[a*3]=l,o[a*3+1]=l,o[a*3+2]=l,r[a*4+2]=c*.5,r[a*4+3]=1}return e.setAttribute("color",new le(o,3)),e.setAttribute("aInfo",new le(r,4)),e}function A2(){const i=new bn(3),t=[new C(0,-.3,0),new C(.05,.6,0),new C(.18,1.1,.02),new C(.36,1.18,.04)],e=new Sn(t),n=new Ra(e,6,.018,4,!1);return i.add("s",n,_l,6969914,{flexFn:s=>on(s.y,0,1.2)*.6}),i.add("s",new Ne(.09,.05,.1,8),Bt(.38,1.12,.04,0,1,1,1,0,-1.9),5917232,{flexFn:()=>.8}),i.toGeometry("s")}function C2(){const i=[],t=[],e=[],n=ee(8);for(let r=0;r<9;r++){const a=n()*6.28,c=1+n()*.9,l=.08+n()*.2,u=.025,f=Math.cos(a)*.08,d=Math.sin(a)*.08,h=f+Math.cos(a)*l*c,g=d+Math.sin(a)*l*c,x=-Math.sin(a)*u,p=Math.cos(a)*u;i.push(f-x,0,d-p,f+x,0,d+p,h,c,g),t.push(0,0,0,.6,0,0,0,.6,0,0,1.2,1),e.push(.5,.48,.3,.5,.48,.3,.95,.85,.6),r%2===0&&(i.push(h-x*2.5,c-.25,g-p*2.5,h+x*2.5,c-.25,g+p*2.5,h+Math.cos(a)*.08,c+.12,g+Math.sin(a)*.08),t.push(0,0,1.1,1,0,0,1.1,1,0,0,1.3,1),e.push(1,.92,.78,1,.92,.78,1.05,1,.9))}const s=new Gt;s.setAttribute("position",new at(i,3)),s.setAttribute("aInfo",new at(t,4)),s.setAttribute("color",new at(e,3));const o=i.length/3;return s.setAttribute("normal",new at(new Array(o).fill([0,1,0]).flat(),3)),s.setAttribute("uv",new at(new Array(o*2).fill(0),2)),s}function tf(i){const t=Yl(2,i,.2,2.6),e=t.attributes.position;for(let r=0;r<e.count;r++)e.setY(r,e.getY(r)*.75+.6);t.computeVertexNormals();const n=e.count,s=new Float32Array(n*3),o=new Float32Array(n*4);for(let r=0;r<n;r++){const c=.7+.35*t.attributes.normal.getY(r)+.15*(Pe(e.getX(r)*5+i,e.getY(r)*5)-.5);s[r*3]=c,s[r*3+1]=c,s[r*3+2]=c,o[r*4+2]=on(e.getY(r)/1.4,0,1)*.5,o[r*4+3]=on(.4+.6*(e.getY(r)/1.3),0,1)}return t.setAttribute("color",new le(s,3)),t.setAttribute("aInfo",new le(o,4)),t}function R2(i){const t=Dn({flex:.15,flutter:.01,translucency:.25,side:ve,roughness:.55}),e=Dn({flex:.5,flutter:0,translucency:.1,side:fn}),n=Dn({flex:.9,flutter:.04,translucency:.4}),s=Dn({flex:.2,flutter:.02,translucency:.3,side:fn}),o={pad:T2(),stalk:A2(),reed:C2(),shrub:tf(3),shrub2:tf(9)},r={pad:[],stalk:[],reed:[],shrub:[],shrub2:[]},a=ee(66);return{pad(c,l,u,f,d){r.pad.push({m:Bt(c,l,u,a()*6.28,f,1,f,(a()-.5)*.08,(a()-.5)*.08),c:d})},stalk(c,l,u,f){r.stalk.push({m:Bt(c,l,u,a()*6.28,f),c:null})},reed(c,l,u,f){r.reed.push({m:Bt(c,l,u,a()*6.28,f,f*(.8+a()*.4),f),c:null})},shrub(c,l,u,f,d){r[a()<.5?"shrub":"shrub2"].push({m:Bt(c,l,u,a()*6.28,f,f*(.75+a()*.35),f),c:d})},build(){const c=new we;c.name="waterPlants";const l={pad:t,stalk:e,reed:n,shrub:s,shrub2:s};for(const u of Object.keys(r)){const f=r[u];if(!f.length)continue;const d=new $e(o[u],l[u],f.length),h=new Rt,g=f.some(x=>x.c!==null);f.forEach((x,p)=>{d.setMatrixAt(p,x.m),g&&d.setColorAt(p,h.set(x.c!==null?x.c:16777215))}),d.castShadow=u==="shrub"||u==="shrub2",d.receiveShadow=!0,(u==="shrub"||u==="shrub2"||u==="pad")&&d.layers.enable(Oe),d.computeBoundingSphere(),c.add(d)}return{group:c}}}}const ef=[4016732,5925498,11043914,14208176,15262420,8034954,6961726,7230528,9078400,10107436,5201226,12165754],nf=13806991,Wr=1972760;function iu(i){const t=[],e=[],n=[],s=[],o=new Rt;for(const{geo:a,mask:c,color:l}of i){const u=a.index?a.toNonIndexed():a,f=u.attributes.position.array,d=u.attributes.normal.array;o.set(l);for(let h=0;h<f.length;h++)t.push(f[h]);for(let h=0;h<d.length;h++)e.push(d[h]);for(let h=0;h<f.length/3;h++)n.push(o.r,o.g,o.b),s.push(c)}const r=new Gt;return r.setAttribute("position",new at(t,3)),r.setAttribute("normal",new at(e,3)),r.setAttribute("color",new at(n,3)),r.setAttribute("aMask",new at(s,1)),r.setAttribute("uv",new at(new Array(t.length/3*2).fill(0),2)),r.computeBoundingSphere(),r}const Qo=(i,t)=>i.clone().applyMatrix4(t),Ws=(i,t=10)=>new Ki(i,t,Math.max(5,Math.round(t*.7))),su=(i,t,e,n=8)=>{const s=new Ne(t,i,e,n,1);return s.translate(0,e/2,0),s};function xa(i,t,e,n,s=7){const o=new C().subVectors(t,i),r=o.length(),a=su(e,n,r,s),c=new wn().setFromUnitVectors(new C(0,1,0),o.normalize());return a.applyMatrix4(new vt().compose(i,c,new C(1,1,1)))}const Wi=(i,t,e)=>new C(i,t,e);function ou(i,t,e,n=0){const s=[],o=new vt().makeRotationX(n),r=(a,c,l,u)=>Qo(a,new vt().makeTranslation(c,l-i,u-t).premultiply(o).premultiply(new vt().makeTranslation(0,i,t)));if(s.push({geo:r(su(.045,.045,.1,6),0,i-.12,t),mask:0,color:nf}),s.push({geo:r(Ws(.105,12),0,i,t),mask:0,color:nf}),e==="cap")s.push({geo:r(new Ke(.2,.12,.2),0,i+.1,t-.01),mask:0,color:Wr}),s.push({geo:r(Ws(.108,10).scale(1,.75,1),0,i+.02,t-.02),mask:0,color:Wr});else if(e==="straw"){const a=new Ne(.06,.28,.12,12,1);s.push({geo:r(a,0,i+.12,t),mask:0,color:13150312})}else s.push({geo:r(Ws(.11,10).scale(1,.85,1.05),0,i+.025,t-.02),mask:0,color:Wr}),s.push({geo:r(Ws(.05,8),0,i+.11,t-.05),mask:0,color:Wr});return s}function Lo(i="bun"){const t=ni([[0,0],[.27,0],[.255,.12],[.21,.52],[.17,.9],[.19,1.15],[.215,1.31],[.16,1.4],[.07,1.45],[0,1.46]],12);t.scale(1,1,.74);const e=[{geo:t,mask:1,color:16777215}];e.push({geo:Qo(su(.18,.178,.07,12),new vt().makeScale(1,1,.76).setPosition(0,.87,0)),mask:1,color:8025456});for(const n of[-1,1])e.push({geo:xa(Wi(n*.2,1.33,0),Wi(n*.08,.98,.13),.075,.105,8),mask:1,color:15790320});return e.push({geo:Qo(Ws(.07,8),new vt().makeScale(1.6,.9,1).setPosition(0,.96,.17)),mask:1,color:15790320}),e.push(...ou(1.57,.01,i)),iu(e)}function sf(i=.18,t="bun"){const e=[],n=ni([[0,.45],[.22,.45],[.2,.62],[.175,.86],[.2,1.05],[.21,1.2],[.15,1.28],[.06,1.33],[0,1.34]],12);n.scale(1,1,.76),n.applyMatrix4(new vt().makeTranslation(0,-.45,0).premultiply(new vt().makeRotationX(i)).premultiply(new vt().makeTranslation(0,.45,-.05))),e.push({geo:n,mask:1,color:16777215}),e.push({geo:Qo(new Ke(.4,.17,.46),new vt().makeTranslation(0,.5,.17)),mask:1,color:15921906}),e.push({geo:xa(Wi(0,.02,.43),Wi(0,.5,.4),.24,.2,10).scale(1,1,.55),mask:1,color:15263976});for(const s of[-1,1])e.push({geo:xa(Wi(s*.19,1.15-i*.3,.02+i*.3),Wi(s*.11,.78,.36),.07,.09,7),mask:1,color:15790320});return e.push(...ou(1.45-i*.15,.03+i*.5,t,i*.9)),iu(e)}function P2(i=.08){const t=[],e=ni([[0,.1],[.26,.1],[.21,.3],[.175,.52],[.2,.72],[.21,.86],[.15,.94],[.06,.99],[0,1]],12);e.scale(1,1,.76),e.applyMatrix4(new vt().makeRotationX(i)),t.push({geo:e,mask:1,color:16777215}),t.push({geo:Qo(Ws(1,12),new vt().makeScale(.42,.13,.3).setPosition(0,.13,.14)),mask:1,color:15658734});for(const n of[-1,1])t.push({geo:xa(Wi(n*.2,.82,.02),Wi(n*.1,.36,.26),.07,.09,7),mask:1,color:15790320});return t.push(...ou(1.11,.05+i*.4,"bun",i)),iu(t)}function L2(i,{terrainHeight:t}){const e={standA:Lo("bun"),standB:Lo("cap"),standC:Lo("straw"),walk:Lo("bun"),walkB:Lo("cap"),sit:sf(.12,"bun"),sitRead:sf(.38,"cap"),floor:P2(.1)},n=la({roughness:.9}),s=la({roughness:.9,walk:!0}),o=ee(1717),r={},a=[],c={},l=(d,h,g,x)=>{(r[d]||(r[d]=[])).push({m:h,color:g}),x&&(c[x]={key:d,index:r[d].length-1})},u=()=>ef[Math.floor(o()*ef.length)],f={people:c,meshes:{},place(d,h,g,x,p,m=null,v=null,M=1){const _=d==="stand"?["standA","standB","standA","standC"][Math.floor(o()*4)]:d;l(_,Bt(h,g,x,p,M*(.94+o()*.1)),m!=null?m:u(),v)},walker(d,h={}){var p,m;const g=d.map(v=>v.length===3?new C(v[0],v[1],v[2]):new C(v[0],t(v[0],v[1]),v[1])),x=new Sn(g,!1,"centripetal");a.push({curve:x,len:x.getLength(),u:(p=h.u)!=null?p:o(),dir:o()<.5?1:-1,speed:(h.speed||.85)*(.8+o()*.4),pause:0,phase:o()*10,color:(m=h.color)!=null?m:u(),key:o()<.65?"walk":"walkB",scale:h.child?.66:.95+o()*.1,fixedY:d[0].length===3})},build(){const d=new we;d.name="crowd";const h=new Rt;for(const[N,P]of Object.entries(r)){const k=new $e(e[N],n,P.length);P.forEach((L,H)=>{k.setMatrixAt(H,L.m),k.setColorAt(H,h.set(L.color))}),k.castShadow=!0,k.receiveShadow=!0,k.layers.enable(Oe),k.computeBoundingSphere(),d.add(k),f.meshes[N]=k}const g={walk:[],walkB:[]};a.forEach(N=>g[N.key].push(N));const x=[];for(const N of["walk","walkB"]){const P=g[N];if(!P.length)continue;const k=e[N].clone(),L=new Float32Array(P.length*2);P.forEach((O,Y)=>{L[Y*2]=O.phase,L[Y*2+1]=1,O.mesh=null,O.index=Y});const H=new qn(L,2);k.setAttribute("iWalk",H);const z=new $e(k,s,P.length);z.instanceMatrix.setUsage(ko),P.forEach((O,Y)=>{z.setColorAt(Y,h.set(O.color)),O.mesh=z}),z.castShadow=!1,z.receiveShadow=!0,z.frustumCulled=!1,d.add(z),x.push(z)}const p=(()=>{const N=document.createElement("canvas");N.width=N.height=64;const P=N.getContext("2d"),k=P.createRadialGradient(32,32,0,32,32,32);return k.addColorStop(0,"rgba(0,0,0,0.55)"),k.addColorStop(1,"rgba(0,0,0,0)"),P.fillStyle=k,P.fillRect(0,0,64,64),new ji(N)})(),m=new Le(1,1);m.rotateX(-Math.PI/2);const v=ce(new Ri({map:p,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),"blob"),M=new $e(m,v,Math.max(1,a.length));M.instanceMatrix.setUsage(ko),M.frustumCulled=!1,M.renderOrder=1,d.add(M);const _=new C,w=new C,b=new vt,A=new wn,R=new C,S=new C(0,1,0);f.update=(N,P,k)=>{a.forEach((L,H)=>{L.pause>0?L.pause-=N*P:(L.u+=L.dir*L.speed*N*P/L.len,L.u>1||L.u<0?(L.u=on(L.u,0,1),L.dir*=-1,L.pause=2+o()*5):o()<N*.02&&(L.pause=1.5+o()*3)),L.curve.getPointAt(L.u,_),L.curve.getTangentAt(L.u,w);const z=Math.atan2(w.x*L.dir,w.z*L.dir),O=L.pause>0?0:1,Y=O*Math.abs(Math.sin(k*5.2+L.phase))*.025,Z=L.fixedY?_.y:t(_.x,_.z);A.setFromAxisAngle(S,z),b.compose(_.set(_.x,Z+Y,_.z),A,R.setScalar(L.scale)),L.mesh.setMatrixAt(L.index,b);const nt=L.mesh.geometry.attributes.iWalk;nt.array[L.index*2+1]=O,b.compose(_.set(_.x,Z+.03,_.z),A,R.set(.75*L.scale,1,.75*L.scale)),M.setMatrixAt(H,b)});for(const L of x)L.instanceMatrix.needsUpdate=!0,L.geometry.attributes.iWalk.needsUpdate=!0;M.instanceMatrix.needsUpdate=!0},f.update(0,1,0);const y={},E=new vt,U=new vt;return f.lean=(N,P)=>{const k=c[N];if(!k)return;const L=f.meshes[k.key];L&&(y[N]||(y[N]=new vt,L.getMatrixAt(k.index,y[N])),U.makeRotationX(P),E.multiplyMatrices(y[N],U),L.setMatrixAt(k.index,E),L.instanceMatrix.needsUpdate=!0)},{group:d}},update(){},lean(){}};return f}function of(){const i=[0,0,.32,.05,0,0,0,.04,-.22,0,0,.32,0,.04,-.22,-.05,0,0,0,.02,-.18,.09,.01,-.36,-.09,.01,-.36,0,.01,.12,-.62,0,-.02,0,.01,-.1,0,.01,.12,0,.01,-.1,.62,0,-.02],t=[0,0,0,0,0,0,0,0,0,0,-1,0,0,0,1],e=new Gt;return e.setAttribute("position",new at(i,3)),e.setAttribute("aFlap",new at(t,1)),e.computeVertexNormals(),e}function rf(i){const t=new Ri({color:i,side:ve});return ce(t,"bird",e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute float aFlap;
uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        {
          #ifdef USE_INSTANCING
            float ph = dot( instanceMatrix[3].xyz, vec3( 0.37, 0.11, 0.29 ) );
            float rate = 7.0 + fract( ph ) * 3.0;
          #else
            float ph = 0.0; float rate = 8.0;
          #endif
          float f = sin( uTime * rate + ph * 6.28 );
          transformed.y += aFlap * aFlap * f * 0.38;
          transformed.x *= 1.0 - 0.18 * aFlap * aFlap * max( f, 0.0 );
        }`)})}function D2(){const i=new Ki(1,10,6);i.scale(.09,.06,.3);const t=new Ea(.08,.16,4);t.rotateX(-Math.PI/2),t.scale(1,.25,1),t.translate(0,0,-.34);const e=[i.toNonIndexed(),t.toNonIndexed()],n=[];for(const c of e)n.push(...c.attributes.position.array);const s=new Gt;s.setAttribute("position",new at(n,3)),s.computeVertexNormals();const o=n.length/3,r=new Float32Array(o*3),a=new Float32Array(o);for(let c=0;c<o;c++){const l=n[c*3+2],u=n[c*3],f=Pe(l*14+3,u*20)>.55;r.set(f?[1,.97,.92]:[1,1,1],c*3),a[c]=f?0:1}return s.setAttribute("color",new le(r,3)),s.setAttribute("aMask",new le(a,1)),s}function I2(){const i=new ye({vertexColors:!0,roughness:.35,metalness:0});return ce(i,"koi",t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute float aMask;
uniform float uTime;`).replace("#include <color_vertex>",`#include <color_vertex>
        #ifdef USE_INSTANCING_COLOR
          vColor.xyz = color.xyz * mix( vec3( 1.0 ), instanceColor.xyz, aMask );
        #endif`).replace("#include <begin_vertex>",`#include <begin_vertex>
        {
          float ph = dot( instanceMatrix[3].xz, vec2( 3.1, 1.7 ) );
          float tail = max( - position.z - 0.05, 0.0 );
          transformed.x += sin( uTime * 6.0 + ph ) * tail * tail * 0.9;
        }`)})}function U2(i,t,e){const n=new Le(1,1),s=new Pa;s.index=n.index,s.attributes.position=n.attributes.position,s.attributes.uv=n.attributes.uv;const o=new Float32Array(t*4),r=new Float32Array(t*4),a=new Float32Array(t*3),c=ee(616),l=new Rt;for(let d=0;d<t;d++){const h=i[d%i.length],g=c()*Math.PI*2,x=Math.sqrt(c())*h.r;o.set([h.x+Math.cos(g)*x,h.z+Math.sin(g)*x,h.y0+h.h*(.6+c()*.4),c()],d*4),r.set([h.ground,7+c()*9,h.size*(.8+c()*.5),h.cell],d*4),l.set(h.colors[Math.floor(c()*h.colors.length)]),a.set([l.r,l.g,l.b],d*3)}s.setAttribute("iSeed",new qn(o,4)),s.setAttribute("iPar",new qn(r,4)),s.setAttribute("iCol",new qn(a,3)),s.instanceCount=t;const u=new Xe({uniforms:lo.merge([bt.fog,{tLeaf:{value:e}}]),vertexShader:`
      attribute vec4 iSeed;  // x, z, top y, phase
      attribute vec4 iPar;   // ground y, period, size, atlas cell
      attribute vec3 iCol;
      uniform float uTime;
      uniform vec2 uWind;
      uniform vec3 uSunDir;
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vLight;
      varying float vFade;
      #include <fog_pars_vertex>
      void main() {
        float t = fract( uTime / iPar.y + iSeed.w );
        float h = iSeed.z - iPar.x;
        float y = iSeed.z - t * h;
        float ph = iSeed.w * 40.0 + uTime * 1.3;
        vec3 p = vec3( iSeed.x, y, iSeed.y );
        p.xz += vec2( sin( ph ), cos( ph * 0.8 ) ) * 0.6 + uWind * t * h * 0.35;
        // tumbling orientation
        float a = ph * 1.7;
        float b = ph * 1.1;
        mat3 R = mat3( cos( a ), 0.0, sin( a ), 0.0, 1.0, 0.0, - sin( a ), 0.0, cos( a ) )
               * mat3( 1.0, 0.0, 0.0, 0.0, cos( b ), - sin( b ), 0.0, sin( b ), cos( b ) );
        vec3 local = R * vec3( position.xy * iPar.z, 0.0 );
        vec3 n = R * vec3( 0.0, 0.0, 1.0 );
        vLight = 0.55 + 0.6 * abs( dot( n, uSunDir ) );
        vFade = smoothstep( 0.0, 0.06, t ) * ( 1.0 - smoothstep( 0.94, 1.0, t ) );
        float cell = iPar.w;
        vUv = ( vec2( mod( cell, 2.0 ), floor( cell / 2.0 ) ) + uv ) * 0.5;
        vCol = iCol;
        vec4 mvPosition = viewMatrix * vec4( p + local, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,fragmentShader:`
      uniform sampler2D tLeaf;
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vLight;
      varying float vFade;
      #include <fog_pars_fragment>
      void main() {
        vec4 L = texture2D( tLeaf, vUv );
        if ( L.a < 0.5 || vFade < 0.02 ) discard;
        gl_FragColor = vec4( vCol * L.rgb * vLight * vFade, 1.0 );
        #include <fog_fragment>
      }
    `,side:ve,fog:!0});Object.assign(u.uniforms,De),u.userData.loqPatched=!0;const f=new Wt(s,u);return f.frustumCulled=!1,f.name="leaves",f}function md(i=64,t=!1){const e=document.createElement("canvas");e.width=e.height=i;const n=e.getContext("2d");if(t){const o=ee(12);for(let r=0;r<60;r++){const a=i*(.2+o()*.6),c=i*(.38+o()*.24),l=i*(.1+o()*.2),u=n.createRadialGradient(a,c,0,a,c,l);u.addColorStop(0,"rgba(255,255,255,0.12)"),u.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=u,n.fillRect(0,0,i,i)}}else{const o=n.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);o.addColorStop(0,"rgba(255,255,255,1)"),o.addColorStop(.5,"rgba(255,255,255,0.45)"),o.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=o,n.fillRect(0,0,i,i)}return new ji(e)}function N2(i,t){const e=new Le(1,1),n=new Pa;n.index=e.index,n.attributes.position=e.attributes.position,n.attributes.uv=e.attributes.uv;const s=i.length*t,o=new Float32Array(s*4),r=new Float32Array(s*4),a=ee(91);let c=0;for(const f of i)for(let d=0;d<t;d++,c++)o.set([f.x,f.y,f.z,d/t+a()*.02],c*4),r.set([f.rise,f.spread,f.period,f.alpha],c*4);n.setAttribute("iSeed",new qn(o,4)),n.setAttribute("iPar",new qn(r,4)),n.instanceCount=s;const l=new Xe({uniforms:lo.merge([bt.fog,{tSoft:{value:md(64)}}]),vertexShader:`
      attribute vec4 iSeed;
      attribute vec4 iPar; // rise, spread, period, alpha
      uniform float uTime;
      uniform vec2 uWind;
      varying vec2 vUv;
      varying float vA;
      #include <fog_pars_vertex>
      void main() {
        float t = fract( uTime / iPar.z + iSeed.w );
        vec3 p = iSeed.xyz + vec3( 0.0, t * iPar.x, 0.0 );
        p.xz += uWind * t * t * iPar.x * 0.5 + vec2( sin( t * 6.0 + iSeed.w * 20.0 ), cos( t * 5.0 + iSeed.w * 13.0 ) ) * 0.15 * t;
        float size = 0.25 + t * iPar.y;
        vA = iPar.w * smoothstep( 0.0, 0.12, t ) * ( 1.0 - t );
        vUv = uv;
        vec4 mvPosition = viewMatrix * vec4( p, 1.0 );
        mvPosition.xy += position.xy * size;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,fragmentShader:`
      uniform sampler2D tSoft;
      uniform vec3 uSunColor;
      varying vec2 vUv;
      varying float vA;
      #include <fog_pars_fragment>
      void main() {
        float a = texture2D( tSoft, vUv ).a * vA;
        gl_FragColor = vec4( mix( vec3( 0.78, 0.76, 0.74 ), uSunColor * 0.9, 0.25 ), a );
        #include <fog_fragment>
      }
    `,transparent:!0,depthWrite:!1,fog:!0});Object.assign(l.uniforms,De),l.userData.loqPatched=!0;const u=new Wt(n,l);return u.frustumCulled=!1,u.renderOrder=4,u.name="smoke",u}function F2(i){const t=new Le(1,1),e=new Pa;e.index=t.index,e.attributes.position=t.attributes.position,e.attributes.uv=t.attributes.uv;const n=new Float32Array(i.length*4);i.forEach((r,a)=>n.set([r.x,r.y,r.z,r.s],a*4)),e.setAttribute("iSeed",new qn(n,4)),e.instanceCount=i.length;const s=new Xe({uniforms:lo.merge([bt.fog,{tSoft:{value:md(128,!0)}}]),vertexShader:`
      attribute vec4 iSeed;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vWorld;
      #include <fog_pars_vertex>
      void main() {
        vec3 p = iSeed.xyz + vec3( sin( uTime * 0.02 + iSeed.x ) * 6.0, 0.0, cos( uTime * 0.017 + iSeed.z ) * 3.0 );
        vUv = uv;
        vWorld = p;
        vec4 mvPosition = viewMatrix * vec4( p, 1.0 );
        mvPosition.xy += position.xy * vec2( iSeed.w, iSeed.w * 0.18 );
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,fragmentShader:`
      ${ho}
      uniform sampler2D tSoft;
      uniform float uMist;
      varying vec2 vUv;
      varying vec3 vWorld;
      #include <fog_pars_fragment>
      void main() {
        float d = length( vWorld - cameraPosition );
        float a = texture2D( tSoft, vUv ).a * uMist * smoothstep( 40.0, 140.0, d );
        vec3 dir = normalize( vWorld - cameraPosition );
        vec3 c = skyColor( normalize( vec3( dir.x, 0.02, dir.z ) ) ) * 1.04;
        gl_FragColor = vec4( c, a );
      }
    `,transparent:!0,depthWrite:!1,fog:!0});Object.assign(s.uniforms,De,{uMist:{value:.32}}),s.userData.loqPatched=!0;const o=new Wt(e,s);return o.frustumCulled=!1,o.renderOrder=6,o.name="mist",o}function O2({tier:i,kit:t,layout:e,water:n,anchors:s}){const o=new we;o.name="life";const r=ee(3131),a=i.name==="low",{terrainHeight:c,POND:l,pondDist:u,WATER_LEVEL:f,RIVER_LEVEL:d,riverZ:h}=e,g=a?26:48,x=rf(2762276),p=new $e(of(),x,g);p.frustumCulled=!1,p.instanceMatrix.setUsage(ko),o.add(p);const m=Array.from({length:g},(ut,I)=>({off:new C((r()-.5)*22,(r()-.5)*8,(r()-.5)*22),lag:r()*3,s:.9+r()*.6,perched:I<(a?4:9)})),v=[[s.library.x-6,s.library.ridgeY+.5,s.library.z],[s.library.x-5.4,s.library.ridgeY+.5,s.library.z],[s.library.x+4.2,s.library.ridgeY+.5,s.library.z],[0,7.85,46.2],[1.2,7.85,46.2],[-40,4.65,-54],[30,4.65,46],[31,4.65,46],[-58,4.65,10]],M=rf(15921128),_=new $e(of(),M,2);_.frustumCulled=!1,o.add(_);const w=a?10:18,b=new $e(D2(),I2(),w);b.frustumCulled=!1,b.instanceMatrix.setUsage(ko);const A=[14706206,15788768,13777438,15241262,2761760,15908960],R=[],S=()=>{for(let ut=0;ut<50;ut++){const I=Math.floor(r()*l.length),T=-38+(l[I][0]+38)*r()*.9,$=27+(l[I][1]-27)*r()*.9;if(u(T,$)<-1.2)return new C(T,0,$)}return new C(-38,0,27)};for(let ut=0;ut<w;ut++){const I=S();R.push({p:I,v:new C((r()-.5)*.4,0,(r()-.5)*.4),target:S(),s:.9+r()*.6,depth:.12+r()*.25}),b.setColorAt(ut,new Rt(A[ut%A.length]))}o.add(b);const y=new bn(4);y.sphere("d",16777215,1,0,.1,0,{sx:.16,sy:.11,sz:.26,seg:8}),y.sphere("d",16777215,.085,0,.27,.17,{seg:8}),y.cone("d",14191162,.025,.08,0,.26,.26,{rx:Math.PI/2,seg:4});const E=y.toGeometry("d"),U=Vo({}),N=new $e(E,U,3);N.instanceMatrix.setUsage(ko),N.frustumCulled=!1,[9067066,6974066,11037242].forEach((ut,I)=>N.setColorAt(I,new Rt(ut))),N.layers.enable(Oe),o.add(N);const P=Qf(256),k=[{x:-8.6,z:33,y0:6,h:9,r:4.5,ground:.1,size:.16,cell:1,colors:[15251516,14263600,15779920]},{x:8.6,z:33.4,y0:6,h:9,r:4.5,ground:.1,size:.16,cell:1,colors:[15251516,14263600,15779920]},{x:.5,z:-50.5,y0:5,h:8,r:4,ground:.1,size:.16,cell:1,colors:[15251516,14263600]},{x:-29.5,z:44.2,y0:2,h:5,r:3.5,ground:.05,size:.15,cell:3,colors:[12599338,13784364,11744292]},{x:-56,z:32.5,y0:2,h:5,r:3.5,ground:.05,size:.15,cell:3,colors:[12599338,14182960]},{x:23.2,z:41,y0:2,h:5,r:3.5,ground:.05,size:.15,cell:3,colors:[12599338,13784364]},{x:34,z:25,y0:1.5,h:4,r:7,ground:.6,size:.06,cell:0,colors:[15773744,16765024]},{x:0,z:1,y0:4,h:6,r:14,ground:.05,size:.15,cell:1,colors:[15251516,14263600]}];o.add(U2(k,Math.round(520*i.particles),P));const L=[];s.incense&&L.push({...s.incense,rise:7,spread:1.6,period:9,alpha:.35});for(const ut of(s.village||[]).slice(0,a?3:6)){const I=c(ut.x,ut.z);L.push({x:ut.x+ut.w*.25,y:I+7.2,z:ut.z,rise:16,spread:4.5,period:16,alpha:.28})}L.push({x:-36,y:5.2,z:-46.5,rise:12,spread:3.5,period:14,alpha:.25}),o.add(N2(L,a?14:24));const H=[];for(let ut=-260;ut<=260;ut+=26)H.push({x:ut,y:d+2.5+r()*2,z:h(ut)+(r()-.5)*10,s:60+r()*40});for(let ut=0;ut<10;ut++){const I=r()*Math.PI-Math.PI,T=160+r()*160;H.push({x:Math.cos(I)*T,y:c(Math.cos(I)*T,Math.sin(I)*T)+8+r()*10,z:Math.sin(I)*T,s:90+r()*60})}o.add(F2(H));const z=-66,O=h(z)+8.6,Y=d+1.9,Z=new bn(6),nt=12;for(let ut=0;ut<nt;ut++){const I=ut/nt*Math.PI*2;Z.beam("w",5914672,0,0,0,0,Math.sin(I)*2.3,Math.cos(I)*2.3,.08,.08,{kind:B.wood}),Z.box("w",6965812,.9,.06,.5,0,Math.sin(I)*2.4-.03,Math.cos(I)*2.4,{rx:-I,kind:B.wood})}for(const ut of[-.42,.42]){const I=new Ca(2.3,.06,4,24);I.rotateY(Math.PI/2),Z.add("w",I,Bt(ut,0,0),4863014,{kind:B.wood})}Z.cyl("w",3811872,.14,1.2,-.6,0,0,{rz:-Math.PI/2,seg:8,kind:B.wood});const mt=Z.toGeometry("w"),V=new Wt(mt,t.mats.solid);V.position.set(z,Y,O),V.castShadow=!0,o.add(V);const j=new bn(8),ct=ni([[0,-.3],[.55,-.25],[.8,.05],[.85,.25]],10);ct.scale(1,1,4.2),j.add("b",ct,Bt(0,0,0,0,1,1,1),4864556,{kind:B.wood});const ot=new Ne(.85,.85,2.2,10,1,!0,-Math.PI/2,Math.PI);ot.rotateX(-Math.PI/2),j.add("b",ot,Bt(0,.3,0),2236448,{kind:B.cloth}),j.cyl("b",4016732,.2,1.2,0,.25,-2.4,{rTop:.15,seg:8}),j.sphere("b",k2,.11,0,1.58,-2.4,{seg:8}),j.cone("b",13150312,.3,.15,0,1.64,-2.4,{seg:10}),j.rod("b",6967352,.2,-.8,-2,-.35,3.2,-2.9,.025,{seg:4});const Tt=j.toGeometry("b"),gt=new Wt(Tt,t.mats.solidDS);gt.castShadow=!0,gt.rotation.order="YXZ",o.add(gt);const J=new vt,lt=new wn,G=new dn(0,0,0,"YXZ"),tt=new C,F=new C,St=new C,dt=new C;let Et=0,_t=0;function zt(ut,I){Et+=ut*I;const T=Et,$=(K,wt)=>wt.set(Math.sin(K*.035)*150,48+Math.sin(K*.06)*10,Math.sin(K*.07)*70-20);m.forEach((K,wt)=>{if(K.perched){const xt=v[wt%v.length];G.set(0,wt*1.7+Math.sin(T*.3+wt)*.4,0),lt.setFromEuler(G),J.compose(tt.set(xt[0],xt[1],xt[2]),lt,F.setScalar(.45)),p.setMatrixAt(wt,J);return}$(T-K.lag,St),$(T-K.lag-.2,dt),tt.copy(St).add(K.off),tt.x+=Math.sin(T*.4+wt)*2,tt.y+=Math.sin(T*.5+wt*2)*1.2;const yt=St.x-dt.x,At=St.z-dt.z,$t=St.y-dt.y;G.set(-Math.atan2($t,Math.hypot(yt,At)),Math.atan2(yt,At),Math.sin(T*.7+wt)*.25),lt.setFromEuler(G),J.compose(tt,lt,F.setScalar(K.s)),p.setMatrixAt(wt,J)}),p.instanceMatrix.needsUpdate=!0;const st=T*2.2%520-260;if(tt.set(st,14+Math.sin(T*.2)*3,h(st)-4),G.set(0,Math.PI/2,Math.sin(T*.5)*.1),lt.setFromEuler(G),J.compose(tt,lt,F.setScalar(1.8)),_.setMatrixAt(0,J),G.set(0,-.8,0),lt.setFromEuler(G),J.compose(tt.set(-24.6,f+.6,30.2),lt,F.setScalar(1e-4)),_.setMatrixAt(1,J),_.instanceMatrix.needsUpdate=!0,R.forEach((K,wt)=>{const yt=tt.subVectors(K.target,K.p);yt.length()<1.2&&(K.target=S()),yt.normalize().multiplyScalar(.25*ut*I),K.v.add(yt).multiplyScalar(1-.6*ut*I);const $t=K.v.length();$t>.5&&K.v.multiplyScalar(.5/$t),K.p.addScaledVector(K.v,ut*I*1.4),u(K.p.x,K.p.z)>-.6&&(K.target=S(),K.v.multiplyScalar(-.5)),G.set(0,Math.atan2(K.v.x,K.v.z),0),lt.setFromEuler(G),J.compose(tt.set(K.p.x,f-K.depth,K.p.z),lt,F.setScalar(K.s)),b.setMatrixAt(wt,J)}),b.instanceMatrix.needsUpdate=!0,n&&De.uTime.value-_t>2.2&&I>.3){_t=De.uTime.value;const K=R[Math.floor(r()*R.length)];n.ring(K.p.x,K.p.z,.6)}for(let K=0;K<3;K++){const wt=T*.04+K*.5,yt=-40+Math.cos(wt)*6+K*.7,At=30+Math.sin(wt*1.3)*4+K*.4;G.set(0,Math.atan2(-Math.sin(wt),Math.cos(wt)*1.3)+Math.PI/2,0),lt.setFromEuler(G),J.compose(tt.set(yt,f-.05+Math.sin(T*2+K)*.01,At),lt,F.setScalar(1)),N.setMatrixAt(K,J)}N.instanceMatrix.needsUpdate=!0,V.rotation.x-=ut*I*.6;const ft=Math.sin(T*.012)*120-20;gt.position.set(ft,d+.05+Math.sin(T*1.3)*.03,h(ft)+2.5),gt.rotation.y=Math.PI/2+(Math.cos(T*.012)>0?0:Math.PI)+Math.sin(T*.5)*.03,gt.rotation.z=Math.sin(T*1.1)*.02}return zt(0,1),{group:o,update:zt}}const k2=13806991,z2=[{id:"well",color:"#3e5c76",x:xl.x,z:xl.z,labelHeight:10.2},{id:"provenance",color:"#b0432c",x:Hn.x,z:Hn.z,labelHeight:17.8},{id:"dialogue",color:"#6b8a4e",x:xn.x,z:xn.z,labelHeight:9.6},{id:"quiet",color:"#b07a2e",x:He.x,z:He.z,labelHeight:10.6},{id:"verify",color:"#4f7d74",x:vn.x,z:vn.z,labelHeight:11.4}];function ar(i,{hit:t=[6,7,6],hitOffset:e=[0,0,0]}={}){const n=new we;n.name=`zone:${i.id}`;const s=new Ri;s.userData.loqPatched=!0;const o=new Wt(new Ke(t[0],t[1],t[2]),s);o.position.set(i.x+e[0],t[1]/2+e[1],i.z+e[2]),o.visible=!1,o.userData.zoneId=i.id,n.add(o);const r={def:i,group:n,hits:[o],focused:!1,focusMix:0,energy:0,lamp:{x:i.x,y:3,z:i.z,intensity:6,distance:14},anchor(a){return a.set(i.x,i.labelHeight,i.z)},trigger(){r.energy=1},baseUpdate(a){r.energy=Math.max(0,r.energy-a*.26),r.focusMix+=((r.focused?1:0)-r.focusMix)*Math.min(1,a*3)},activate(){r.trigger()},update(a,c){r.baseUpdate(c)}};return r}function Do(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}const cr=(i,t,e,n,s,o)=>({position:new C(i,t,e),target:new C(n,s,o)}),B2=`
  varying vec2 vUv;
  varying vec3 vWorld;
  #include <fog_pars_vertex>
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4( position, 1.0 );
    vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,H2=`
  ${ho}
  uniform float uTime;
  uniform float uPulse;
  uniform vec3 uDeep;
  varying vec2 vUv;
  varying vec3 vWorld;
  #include <fog_pars_fragment>
  void main() {
    vec2 d = vUv - 0.5;
    float r = length( d ) * 2.0;
    float rip = smoothstep( 0.86, 1.0, sin( r * 16.0 - uTime * 0.9 ) ) * smoothstep( 1.0, 0.25, r ) * 0.05;
    float ring = exp( - pow( ( r - uPulse * 0.7 ) * 9.0, 2.0 ) ) * ( 1.0 - smoothstep( 0.6, 1.5, uPulse ) );
    vec3 V = normalize( cameraPosition - vWorld );
    float fres = 0.04 + 0.96 * pow( 1.0 - max( V.y, 0.0 ), 5.0 );
    vec3 R = reflect( - V, vec3( 0.0, 1.0, 0.0 ) );
    vec3 sky = skyColor( normalize( vec3( R.x, max( R.y, 0.0 ), R.z ) ) );
    vec3 col = mix( uDeep, sky, fres * 0.85 + 0.06 );
    col += sky * ( rip + ring * 0.55 );
    gl_FragColor = vec4( col, 1.0 );
    #include <fog_fragment>
  }
`;function G2(i=2.5,t=Math.PI*1.84,e=160){const n=[],s=[],o=[],r=Math.PI*.42;for(let c=0;c<=e;c++){const l=c/e,u=r-l*t,f=.55*Math.min(1,l*9)*(1-.62*Math.pow(l,1.6))+.05,d=i*(1+Math.sin(l*9)*.012+l*.035),h=Math.cos(u),g=Math.sin(u);if(n.push(h*(d-f/2),g*(d-f/2),0,h*(d+f/2),g*(d+f/2),0),s.push(l,0,l,1),c<e){const x=c*2;o.push(x,x+1,x+2,x+1,x+3,x+2)}}const a=new Gt;return a.setAttribute("position",new at(n,3)),a.setAttribute("uv",new at(s,2)),a.setIndex(o),a}function V2(i,t){const e=ar(i,{hit:[12,11,12]}),n=e.group,{B:s,crowd:o,kit:r}=t,a=ee(5),c=i.x,l=i.z;e.lamp={x:c,y:3.2,z:l,intensity:7,distance:16};const u=[[3.05,.45],[3.1,.85],[3.22,.98],[3.42,1.03],[3.62,.97],[3.72,.82],[3.78,.32],[4.75,.3],[4.86,.22],[4.88,0]];s.add("solidDS",ni(u,64),new vt().makeTranslation(c,0,l),14208440,{kind:B.stone,ao:.95}),s.add("solid",ni([[3.8,.5],[3.86,.52],[3.86,.62],[3.8,.64]],64),new vt().makeTranslation(c,0,l),12168600,{kind:B.stone});const f=new Xe({vertexShader:B2,fragmentShader:H2,uniforms:lo.merge([bt.fog,{uPulse:{value:10},uDeep:{value:new Rt(1317918)}}]),fog:!0});Object.assign(f.uniforms,De),f.userData.loqPatched=!0;const d=new Wt(new Bl(3.1,64),f);d.rotation.x=-Math.PI/2,d.position.set(c,.78,l),n.add(d);for(let y=0;y<7;y++){const E=y/7*Math.PI*2+.3,U=6.4,N=c+Math.cos(E)*U,P=l+Math.sin(E)*U;fd(s,N,0,P,13155237,.24,.45),y%3!==1&&o.place("sit",N-Math.cos(E)*.12,0,P-Math.sin(E)*.12,Math.atan2(-Math.cos(E),-Math.sin(E)),null,`well${y}`)}o.place("stand",c+5.2,0,l-6.8,-2.4,null),o.place("stand",c+6,0,l-6.2,-2,null),o.place("stand",c-7.5,0,l+4.2,1.2,null),t.anchors.incense=l2(s,c,0,-16.2),$h(s,-6.2,0,-17.6),$h(s,6.2,0,-17.6);for(const[y,E]of[[-12.8,-17.5],[12.8,-17.5],[-12.8,18.5],[12.8,18.5]])dd(r,s,y,0,E,1.05);const h=ce(new Ri({map:e_(),color:pt.ink,transparent:!0,side:ve,depthWrite:!1}),"enso"),g=new Wt(G2(),h);g.position.set(c,7.6,l),g.renderOrder=3,n.add(g);const x=new Wt(new Ke(.34,.34,.08),ce(new ye({color:pt.cinnabar,roughness:.7}),"seal"));x.position.set(2.65,-2.1,0),g.add(x);const p=t.tier.name==="low"?18:30,m=ce(new ye({map:s_(),roughness:.95,side:ve}),"slip"),v=new $e(new Le(.32,.48),m,p);v.castShadow=!1,v.frustumCulled=!1;const M=Array.from({length:p},(y,E)=>({p:E/p,a:a()*Math.PI*2,r:.6+a()*2.4,sp:.75+a()*.5,ph:a()*6}));n.add(v);const _=new vt,w=new wn,b=new dn,A=new C,R=new C;let S=0;return e.activate=()=>{e.trigger(),f.uniforms.uPulse.value=0,t.fx.pulse(c,l,20)},e.update=(y,E)=>{e.baseUpdate(E);const U=e.energy,N=t.world.speed;f.uniforms.uPulse.value+=E,S+=E*N*(.08+U*1.1),g.rotation.y=S,g.position.y=7.6+Math.sin(y*.4)*.12,M.forEach((P,k)=>{P.p+=E*N*.05*P.sp*(1+U*4),P.p>1&&(P.p-=1,P.a=a()*Math.PI*2,P.r=.6+a()*2.4);const L=P.p,H=P.a+L*2.4,z=en.lerp(P.r,2.5,L*L);A.set(c+Math.cos(H)*z,.85+L*6.7,l+Math.sin(H)*z),b.set(Math.sin(y*1.3+P.ph)*.35,-H,Math.cos(y+P.ph)*.25);const O=Math.min(1,L*10)*(1-en.smoothstep(L,.82,1));R.setScalar(Math.max(.001,O)),v.setMatrixAt(k,_.compose(A,w.setFromEuler(b),R))}),v.instanceMatrix.needsUpdate=!0},e.cameraView=cr(c+9,9.5,l+17,c,3.6,l-2),e}function W2(i,t){const e=t.anchors.library,n=ar(i,{hit:[e.W+2,15,e.D+2],hitOffset:[0,0,0]}),s=n.group,{B:o,crowd:r,kit:a}=t,c=ee(12),l=e.x,u=e.z,f=e.floor,d=e.W,h=e.D,g=t.tier.books;n.lamp={x:l,y:f+3,z:u+1,intensity:9,distance:14};const x=[],p=(L,H,z,O,Y,Z={})=>{const nt=a.instancer.count("book");ud(o,L,f,H,z,O,Y,.42,Z.shelves||6,c,{density:g*(Z.density||1),scrolls:Z.scrolls,open:Z.open});for(let mt=0;mt<6;mt++){const V=(c()-.5)*(O-.4),j=.5+c()*(Y-.9),ct=Math.cos(z),ot=Math.sin(z);x.push({p:new C(L+V*ct+.24*ot,f+j,H-V*ot+.24*ct),case:`${L.toFixed(1)}:${H.toFixed(1)}:${z.toFixed(2)}`})}return a.instancer.count("book")-nt},m=u-h/2+.38,v=e.xs;for(let L=0;L<v.length-1;L++){const H=v[L+1]-v[L],z=l+(v[L]+v[L+1])/2;L===2?(p(z-H/2+.95,m,0,1.5,3.3,{scrolls:!0}),p(z+H/2-.95,m,0,1.5,3.3,{scrolls:!0})):(p(z-H/4+.05,m,0,H/2-.25,3.3),p(z+H/4-.05,m,0,H/2-.25,3.3))}for(const L of[-1,1])for(let H=0;H<3;H++)p(l+L*(d/2-.36),u-3+H*2.4,-L*Math.PI/2,2.1,3.3,{scrolls:H===1});for(const L of[0,1,3,4]){const H=l+(v[L]+v[L+1])/2,z=v[L+1]-v[L];for(const O of[u-2.4,u+.4])p(H,O+.23,0,z-.9,2.6,{shelves:5,open:!0}),p(H,O-.23,Math.PI,z-.9,2.6,{shelves:5,open:!0})}tu(o,l,f,u+.2,Math.PI/2,4.6,1.1,.78);for(const L of[-1,1])Jo(o,l+L*.95,f,u+.2,Math.PI/2,4.4);for(let L=0;L<4;L++){const H=u-1.6+L*1.2;hd(o,l+(L%2?.25:-.25),f+.79,H,Math.PI/2+(L%2?Math.PI:0)),L%2&&Ql(o,l-.3,f+.79,H+.4,3+Math.floor(c()*3),c,Math.PI/2)}r.place("sitRead",l-.95,f,u-1.2,Math.PI/2,4016732,"libr1"),r.place("sitRead",l+.95,f,u+.6,-Math.PI/2,11043914,"libr2"),r.place("sit",l-.95,f,u+1.5,Math.PI/2,8034954,"libr3"),Zh(o,l-1.4,f,m+.75,0,3),Zh(o,l+5.9,f,m+.8,0,3),r.place("stand",l-5.2,f,u+2.6,Math.PI*.95,7230528,"steward1"),r.place("stand",l+4.6,f,u+2.2,-Math.PI*.9,10107436,"steward2"),r.place("stand",l+7.6,f,u-.9,Math.PI,14208176),r.place("stand",l-7.7,f,u-.9,Math.PI,5925498),r.place("stand",l+5.9,f+1.1,m+1.05,Math.PI,5201226),r.place("stand",l-3.5,e.eaveY+1.55,u+h/2+.55,.2,15262420);for(const[L,H]of[[0,-1.2],[0,1.6],[-5.4,-1],[5.4,-1],[-5.4,2.2],[5.4,2.2]])oo(a,o,l+L,f+3,u+H,"paper",f+4.6);for(const L of[-1,1])oo(a,o,l+L*4.2,f+3.5,u+h/2+.9,"red",f+4.5);const M=ce(new ye({color:pt.cinnabar,roughness:.55,emissive:pt.cinnabar,emissiveIntensity:.25}),"thread"),_=[],w=t.tier.name==="low"?10:16;let b=0;for(;_.length<w&&b++<400;){const L=x[Math.floor(c()*x.length)],H=x[Math.floor(c()*x.length)];if(L.case===H.case)continue;const z=L.p.distanceTo(H.p);if(z<2.2||z>7.5)continue;const O=L.p.clone().lerp(H.p,.5);O.y=Math.max(f+.9,Math.min(L.p.y,H.p.y)-.4-c()*.5);const Y=new Sn([L.p,L.p.clone().lerp(O,.5).add(new C(0,-.15,0)),O,H.p.clone().lerp(O,.5).add(new C(0,-.15,0)),H.p]),Z=new Wt(new Ra(Y,40,.013,5,!1),M);s.add(Z),_.push(Y)}const A=ce(new ye({color:pt.paper,roughness:.9,side:ve}),"tag"),R=new $e(new Le(.12,.18),A,_.length*2);R.frustumCulled=!1,s.add(R);const S=[];_.forEach((L,H)=>{for(let z=0;z<2;z++)S.push({c:L,u:c(),dir:(H+z)%2?1:-1})});const y=new C,E=new C,U=new vt,N=new wn,P=new dn,k=new C(1,1,1);return n.update=(L,H)=>{n.baseUpdate(H);const z=n.energy;M.emissiveIntensity=.25+n.focusMix*.3+z*2.2,S.forEach((O,Y)=>{O.u=(O.u+H*t.world.speed*(.025+z*.32)*O.dir+1)%1,O.c.getPointAt(O.u,E),O.c.getPointAt(Math.min(.999,O.u+.01),y),E.y-=.1,P.set(0,Math.atan2(y.x-E.x,y.z-E.z)+Math.PI/2,Math.sin(L*2+O.u*20)*.15),R.setMatrixAt(Y,U.compose(E,N.setFromEuler(P),k))}),R.instanceMatrix.needsUpdate=!0,a.mats.latticeLib&&(a.mats.latticeLib.userData.paperGlow.value=.35+n.focusMix*.25+z*.6)},n.cameraView=cr(l+3.2,f+3.4,u+h/2+9.5,l-.4,f+2.4,u-.5),n}const X2=[pt.celadon,pt.ochre,pt.cinnabar],Xr=10;function q2(i,t){const e=t.anchors.dialogue,n=ar(i,{hit:[e.W+3,7,e.D+4],hitOffset:[0,0,1]}),s=n.group,{B:o,crowd:r,kit:a}=t,c=ee(23),l=e.x,u=e.z,f=e.floor,d=e.D;n.lamp={x:l,y:f+2.4,z:u,intensity:7,distance:13};const h=d-.25,g=3.5-.72,x=new Ai;x.moveTo(-h/2,0),x.lineTo(h/2,0),x.lineTo(h/2,g),x.lineTo(-h/2,g),x.closePath();const p=new Yo;p.absarc(0,g*.5,Math.min(g,h)*.44,0,Math.PI*2,!0),x.holes.push(p);const m=eo(x,.12,40),v=new Ca(Math.min(g,h)*.44,.06,6,48);for(const S of[e.xs[1],e.xs[2]]){const y=new vt().makeRotationY(Math.PI/2).setPosition(l+S,f,u);o.add("solid",m,y,5910047,{kind:B.lacquer,ao:.85}),o.add("solid",v,new vt().makeRotationY(Math.PI/2).setPosition(l+S,f+g*.5,u),13214284,{kind:B.gold})}const M=new Ki(.17,20,14),_=[];[(e.xs[0]+e.xs[1])/2,(e.xs[1]+e.xs[2])/2,(e.xs[2]+e.xs[3])/2].forEach((S,y)=>{const E=l+S,U=u+.3;o.cyl("solid",9071176,1.75,.12,E,f,U,{seg:28,kind:B.wood}),o.cyl("solid",13482378,1.62,.02,E,f+.12,U,{seg:28,kind:B.cloth});const N=[];for(let z=0;z<4;z++){const O=z/4*Math.PI*2+.4+y,Y=E+Math.cos(O)*1.18,Z=U+Math.sin(O)*1.18;c2(o,Y,f+.13,Z,[9390902,11569746,6056536][(z+y)%3]);const nt=`dlg${y}_${z}`;r.place("floor",Y,f+.18,Z,Math.atan2(E-Y,U-Z),null,nt),N.push(nt)}oo(a,o,E,f+2.55,U,"paper",f+3.4);const P=X2.map((z,O)=>{const Y=new Wt(M,ce(new ye({color:z,roughness:.18,metalness:0,emissive:z,emissiveIntensity:.06}),"tutor"));return Y.castShadow=!0,Y.userData={phase:O/3*Math.PI*2,r:.5+O*.09},s.add(Y),Y}),k=new Gt;k.setAttribute("position",new le(new Float32Array(3*Xr*2*3),3));const L=ce(new Fl({color:pt.ink,transparent:!0,opacity:.35,depthWrite:!1}),"arc"),H=new Gv(k,L);H.frustumCulled=!1,s.add(H),_.push({cx:E,cz:U,tutors:P,arc:H,arcMat:L,people:N,spin:c()*10,speed:.4+y*.1})}),r.place("stand",l+7.6,0,u-4.4,-2.6,null),r.place("stand",l-8.2,0,u-3.6,2.2,null);const b=new C,A=new C,R=new C;return n.activate=()=>n.trigger(),n.update=(S,y)=>{n.baseUpdate(y);const E=n.energy;for(const U of _){U.spin+=y*U.speed*(1+E*3.5)*t.world.speed,U.tutors.forEach((k,L)=>{const H=k.userData,z=H.r*(1-E*.4),O=U.spin*(1+L*.25)+H.phase;k.position.set(U.cx+Math.cos(O)*z,f+1.05+Math.sin(U.spin*1.7+L*2)*.18,U.cz+Math.sin(O)*z),k.material.emissiveIntensity=.06+E*.5*(.5+.5*Math.sin(S*6+L*2))});const N=U.arc.geometry.attributes.position.array;let P=0;for(let k=0;k<3;k++){A.copy(U.tutors[k].position),R.copy(U.tutors[(k+1)%3].position);const L=.22+E*.28;for(let H=0;H<Xr;H++)for(const z of[H/Xr,(H+1)/Xr])b.lerpVectors(A,R,z),b.y+=Math.sin(z*Math.PI)*L,N[P++]=b.x,N[P++]=b.y,N[P++]=b.z}U.arc.geometry.attributes.position.needsUpdate=!0,U.arcMat.opacity=.3+n.focusMix*.12+E*.5*(.6+.4*Math.sin(S*9)),U.people.forEach((k,L)=>r.lean(k,.05+E*.32+Math.sin(S*.8+L*1.7)*.03))}a.mats.latticeDlg&&(a.mats.latticeDlg.userData.paperGlow.value=.32+n.focusMix*.2+E*.9)},n.cameraView=cr(l+4.5,4.2,u+19,l-.5,f+1.3,u+.5),n}function Y2(i,t){const e=t.anchors.quiet,n=ar(i,{hit:[e.W+3,9,e.D+4],hitOffset:[0,0,.5]}),s=n.group,{B:o,crowd:r,kit:a}=t,c=ee(8),l=e.x,u=e.z,f=e.floor,d=e.D;n.lamp={x:l,y:f+2.6,z:u-1,intensity:8,distance:12};const h=u-d/2,g=[u-2.2,u+.5];let x=0;g.forEach((A,R)=>{tu(o,l,f,A,0,6.4,1.05,.76,8016438);for(const S of[-1,1])Jo(o,l,f,A+S*.82,0,6.2);for(let S=0;S<5;S++){const y=l-2.5+S*1.25+(c()-.5)*.2,E=(S+R)%2?1:-1;hd(o,y,f+.77,A+E*.22,E>0?Math.PI:0),S%2===0&&Ql(o,y+.45,f+.77,A-E*.24,2+Math.floor(c()*3),c),(S+R)%3!==2&&r.place(c()<.6?"sitRead":"sit",y,f,A+E*.82,E>0?Math.PI:0,null,`quiet${x++}`)}for(let S=-1;S<=1;S++)oo(a,o,l+S*2.3,f+2.7,A,"paper",f+3.9)});for(const A of[-1,1])for(let R=0;R<2;R++)ud(o,l+A*(e.W/2-.35),f,u-3.6+R*2.3,-A*Math.PI/2,2,2.6,.4,5,c,{density:t.tier.books});ga(o,l-5.2,f,u+1.9,c),ga(o,l+5.2,f,u+1.9,c),r.place("sitRead",l-3.6,f-.15,u+d/2+.55,.15,14208176),r.place("stand",l+4.5,0,u+8.5,2.8,7230528);const p=n_(),m=ce(new ye({map:p,roughness:.95,side:ve}),"screen"),v=ce(new ye({color:4861728,roughness:.7}),"screenFrame"),M=6,_=1.05,w=2.1;let b=l-(M-1)*_*.94/2;for(let A=0;A<M;A++){const R=new Le(_,w),S=R.attributes.uv;for(let U=0;U<S.count;U++)S.setX(U,(A+S.getX(U))/M);const y=new Wt(R,m);y.position.set(b,f+w/2+.12,h+.75+(A%2?0:.18)),y.rotation.y=A%2?-.3:.3;const E=new Wt(new Ke(_+.08,w+.08,.04),v);E.position.z=-.03,y.add(E),y.castShadow=!0,y.receiveShadow=!0,s.add(y),b+=_*.94}return n.activate=()=>{n.trigger(),t.world.hush(8)},n.update=(A,R)=>{n.baseUpdate(R);const S=n.energy;for(const y of a.lanternMats||[])y.userData.glowK.value=1+S*1.1;a.mats.latticeQuiet&&(a.mats.latticeQuiet.userData.paperGlow.value=.35+n.focusMix*.25+S*.7)},n.cameraView=cr(l+5.5,3.6,u+16,l-.5,f+1.6,u-1.5),n}const Ml=["zh","en"],gd="loq-lang",af={docTitle:{zh:"开放问题图书馆",en:"The Library of Open Questions"},metaDescription:{zh:"开放问题图书馆：一座 AI 时代之后的公共图书馆，以交互式程序化 3D 场景呈现。",en:"The Library of Open Questions: an interactive, procedural 3D vision of a public library after AI."},eyebrow:{zh:"AI 之后的公共图书馆",en:"A public library, after AI"},titleHtml:{zh:"<em>开放问题</em>图书馆",en:"The Library of <em>Open Questions</em>"},hintTouch:{zh:"单指拖动环视 · 双指缩放 · 轻点一处区域",en:"Drag to orbit · pinch to zoom · tap a zone"},hintMouse:{zh:"拖动环视 · 滚轮缩放 · 点击一处区域",en:"Drag to orbit · scroll to zoom · click a zone"},before:{zh:"AI 之前",en:"Before AI"},now:{zh:"如今",en:"Now"},overview:{zh:"回到全景",en:"Overview"},close:{zh:"关闭",en:"Close panel"},zonebar:{zh:"图书馆分区",en:"Library zones"},canvas:{zh:"可交互的 3D 图书馆庭院",en:"Interactive 3D library courtyard"},langToggle:{zh:"切换语言",en:"Switch language"},loader:{zh:"研墨中……",en:"Grinding the ink…"},noWebGL:{zh:"此设备不支持 WebGL。",en:"WebGL is not available on this device."}},Z2={well:{zh:{short:"问题井",name:"问题之井",kicker:"中庭 · 中心",body:"来访者把尚未成形的问题投入井中，打磨过的问题化作纸笺，缓缓升向井上那一笔未合拢的圆相。答案如今唾手可得，图书馆于是把力气花在更好的问题上。",before:"检索台与目录卡：带着关键词进来，借走几本书离开。",after:"问题工作室：馆员帮你想清楚，你真正想问的是什么。",action:"泛起涟漪"},en:{short:"Well",name:"The Question Well",kicker:"Centre · Courtyard",body:"Visitors drop half-formed questions into the well. Refined versions rise as paper slips toward the unclosed brush circle above. Answers are cheap now, so the library spends its effort on better questions.",before:"A search desk and a catalogue: you arrived with a query and left with items.",after:"A question studio: librarians help you sharpen what you are actually asking.",action:"Ripple the well"}},provenance:{zh:{short:"溯源",name:"溯源书库",kicker:"第二区 · 源流",body:"每一本书、每一篇论文、每一份 AI 生成的摘要，都用红线系回它的出处，无论来源是人还是机器。来访者既读文字，也读红线。",before:"书架按学科排列，出处藏在没人翻看的脚注里。",after:"书架按源流排列，每一条论断都看得见它从何而来。",action:"循线溯源"},en:{short:"Stacks",name:"Provenance Stacks",kicker:"Zone 2 · Lineage",body:"Every book, paper and generated summary is tied by red thread back to its sources, human or machine. Visitors read the threads as well as the text.",before:"Shelves sorted by subject; sources hidden in footnotes nobody followed.",after:"Shelves sorted by lineage; every claim visibly tethered to where it came from.",action:"Follow the threads"}},dialogue:{zh:{short:"对话",name:"对话龛",kicker:"第三区 · 研讨",body:"纸屏围成的小圆龛里，几个人与几位“刻意意见不合”的 AI 导师同坐。这里没有唯一的神谕：人们看着观点相撞，再选择自己的立场。",before:"供独自苦读的安静隔间，小组讨论室按小时预约。",after:"研讨圆龛：由人来主持机器之间的公开争论。",action:"开始辩论"},en:{short:"Dialogue",name:"Dialogue Alcoves",kicker:"Zone 3 · Seminar",body:"Inside small alcoves of curved paper screens, a few people sit with several AI tutors that are designed to disagree. Nobody gets one oracle; people learn by watching arguments collide and then taking a side.",before:"Quiet carrels for solitary study; group rooms booked by the hour.",after:"Seminar rings where humans moderate machine disagreement out loud.",action:"Start the argument"}},quiet:{zh:{short:"静读",name:"无辅助阅览室",kicker:"第四区 · 避静",body:"没有屏幕，没有助手，只有纸、灯笼和长桌。不借外力的专注如今最为稀缺，图书馆有意守护它。",before:"安静是一条规定，靠“嘘”声维持。",after:"安静是一处精心设计的避难所，也是全馆最抢手的房间。",action:"让全馆静下来"},en:{short:"Unassisted",name:"The Unassisted Room",kicker:"Zone 4 · Refuge",body:"There are no screens or assistants here, only paper, lanterns and long tables. Slow, unaided attention is the scarce resource now, and the library protects it on purpose.",before:"Silence was a rule enforced by shushing.",after:"Silence is a designed refuge, and the most requested room in the building.",action:"Hush the library"}},verify:{zh:{short:"核验",name:"公共核验台",kicker:"第五区 · 信任",body:"无论是否由 AI 生成，每一条论断都挂上核验台公开检验：逐条核对出处，盖上朱红印章。谁核验了什么，记录对所有人公开。",before:"信任来自书脊上出版社的标志。",after:"信任在公开处赢得，一次一枚印章。",action:"进行一次核验"},en:{short:"Verify",name:"Verification Commons",kicker:"Zone 5 · Trust",body:"Claims, generated or not, are hung on the bench and tested in public. Each source is checked and the result is sealed in cinnabar. The record of who checked what stays open to everyone.",before:"Trust was implied by the publisher’s logo on the spine.",after:"Trust is earned in the open, one seal at a time.",action:"Run a verification"}}},$2={zh:{number:"论断 第 2041-117 号",claim:["“行道树可使夏日","人行道降温","最多 5 °C。”"],sources:["2031 年实地测量","卫星热成像数据","AI 模型摘要","同行独立复现"],pending:"待核验",seal:["核验","无误"]},en:{number:"CLAIM No. 2041-117",claim:["“Street trees cool","summer pavements by","up to 5 °C.”"],sources:["Field survey, 2031","Satellite thermal set","Model summary (AI)","Peer replication"],pending:"UNVERIFIED",seal:["VERI","FIED"]}};function j2(){try{const i=new URLSearchParams(location.search).get("lang");if(i&&Ml.includes(i.slice(0,2)))return i.slice(0,2);const t=localStorage.getItem(gd);if(Ml.includes(t))return t}catch{}return"zh"}let Ti=j2();const yl=new Set,xd=()=>Ti,us=i=>af[i]?af[i][Ti]:i,cf=i=>Z2[i][Ti],K2=()=>$2[Ti];function J2(i){if(!(!Ml.includes(i)||i===Ti)){Ti=i;try{localStorage.setItem(gd,i)}catch{}ru();for(const t of yl)t(Ti)}}function vd(i){return yl.add(i),()=>yl.delete(i)}function ru(i=document){document.documentElement.lang=Ti==="zh"?"zh-CN":"en",document.title=us("docTitle");const t=document.querySelector('meta[name="description"]');t&&t.setAttribute("content",us("metaDescription")),i.querySelectorAll("[data-i18n]").forEach(e=>e.textContent=us(e.dataset.i18n)),i.querySelectorAll("[data-i18n-html]").forEach(e=>e.innerHTML=us(e.dataset.i18nHtml)),i.querySelectorAll("[data-i18n-aria]").forEach(e=>e.setAttribute("aria-label",us(e.dataset.i18nAria))),i.querySelectorAll("[data-lang]").forEach(e=>{const n=e.dataset.lang===Ti;e.classList.toggle("is-active",n),e.setAttribute("aria-pressed",String(n))})}const Bi=512,ds=760,zs=2.1,fi=zs*ds/Bi,_d=372,Md=54,yd=640,Qe=118,Q2='"Noto Serif SC", "Source Han Serif SC", "Songti SC", STSong, "SimSun", serif',tM='Georgia, "Iowan Old Style", "Noto Serif", serif';function eM(i,t,e){const n=i.getContext("2d"),s=K2(),o=xd()==="zh",r=o?Q2:tM,a=ee(4);n.fillStyle="#c4ad84",n.fillRect(0,0,Bi,ds),n.fillStyle="#f4ecdc",n.fillRect(26,34,Bi-52,ds-68);for(let c=0;c<500;c++)n.fillStyle=`rgba(${a()<.5?"255,250,240":"120,96,70"},0.04)`,n.beginPath(),n.arc(26+a()*(Bi-52),34+a()*(ds-68),4+a()*26,0,Math.PI*2),n.fill();if(n.textBaseline="alphabetic",n.fillStyle="rgba(36,32,29,0.6)",n.font=`500 ${o?24:22}px ${r}`,n.fillText(s.number,58,94),n.fillRect(58,110,Bi-116,2),n.fillStyle="#24201d",n.font=`${o?600:"italic 400"} ${o?40:37}px ${r}`,s.claim.forEach((c,l)=>n.fillText(c,58,176+l*54)),n.font=`${o?26:24}px ${r}`,s.sources.forEach((c,l)=>{const u=_d+l*Md,f=l<t;f?(n.strokeStyle="#b0432c",n.lineWidth=5,n.lineCap="round",n.beginPath(),n.moveTo(60,u-10),n.lineTo(70,u),n.lineTo(88,u-24),n.stroke()):(n.strokeStyle="rgba(36,32,29,0.35)",n.lineWidth=2,n.beginPath(),n.arc(74,u-9,10,0,Math.PI*2),n.stroke()),n.fillStyle=f?"#24201d":"rgba(36,32,29,0.7)",n.fillText(c,104,u)}),n.save(),n.translate(Bi/2,yd),e){n.rotate(-.04),n.fillStyle="#b0432c",n.fillRect(-Qe/2,-Qe/2,Qe,Qe),n.fillStyle="#f4ecdc";for(let c=0;c<40;c++)n.fillRect((a()-.5)*Qe,(a()<.5?-1:1)*Qe*.5-2+a()*4,2+a()*3,2+a()*3);n.strokeStyle="#f4ecdc",n.lineWidth=3,n.strokeRect(-Qe/2+8,-Qe/2+8,Qe-16,Qe-16),n.textAlign="center",n.textBaseline="middle",n.font=`700 ${o?40:30}px ${r}`,n.fillText(s.seal[0],0,-22),n.fillText(s.seal[1],0,24)}else n.setLineDash([8,8]),n.strokeStyle="rgba(192,138,62,0.9)",n.lineWidth=3,n.strokeRect(-Qe/2,-Qe/2,Qe,Qe),n.setLineDash([]),n.fillStyle="#a8742f",n.textAlign="center",n.textBaseline="middle",n.font=`600 ${o?28:19}px ${r}`,n.fillText(s.pending,0,0);n.restore()}function nM(i,t){const e=t.anchors.verify,n=ar(i,{hit:[e.W+3,9,e.D+8],hitOffset:[0,0,2]}),s=n.group,{B:o,crowd:r,kit:a}=t,c=ee(31),l=e.x,u=e.z,f=e.floor,d=u-1,h=f+2.75;n.lamp={x:l,y:f+3,z:u+1.5,intensity:8,distance:14};const g=4.2;for(const J of[-1,1])o.box("solid",6175784,.2,4.9,.2,l+J*(g/2),f,d-.15,{kind:B.wood,chamfer:.02}),o.box("solid",6175784,.5,.25,.9,l+J*(g/2),f,d-.15,{kind:B.wood});o.box("solid",6175784,g+.5,.22,.26,l,f+4.9,d-.15,{kind:B.wood,chamfer:.02});const x=document.createElement("canvas");x.width=Bi,x.height=ds;const p=new ji(x);p.colorSpace=We,p.anisotropy=8;let m={checked:-1,sealed:null,lang:null};const v=(J,lt)=>{const G=xd();m.checked===J&&m.sealed===lt&&m.lang===G||(m={checked:J,sealed:lt,lang:G},eM(x,J,lt),p.needsUpdate=!0)};v(0,!1);const M=new Wt(new Le(zs,fi),ce(new ye({map:p,roughness:.92,side:ve,emissive:16777215,emissiveMap:p,emissiveIntensity:.12}),"scroll"));M.position.set(l,h,d),M.castShadow=!0,s.add(M);const _=ce(new ye({color:3876377,roughness:.6}),"roller"),w=new Ne(.05,.05,zs+.24,10);w.rotateZ(Math.PI/2);for(const J of[1,-1]){const lt=new Wt(w,_);lt.position.set(l,h+J*fi/2,d+.02),lt.castShadow=!0,s.add(lt)}o.rod("solid",3811872,l-.7,h+fi/2,d,l,f+4.85,d-.1,.01,{seg:3}),o.rod("solid",3811872,l+.7,h+fi/2,d,l,f+4.85,d-.1,.01,{seg:3});const b=new we,A=new Wt(new Ke(zs+.4,.06,.06),ce(new ye({color:10119749,roughness:.6}),"rule")),R=new Wt(new Le(zs,.34),ce(new Ri({color:16773584,transparent:!0,opacity:0,depthWrite:!1}),"band"));R.position.set(0,-.18,-.02),b.add(A,R),b.position.set(l,h+fi/2,d+.1),b.visible=!1,s.add(b),o.cyl("solid",12562842,.42,1,l+2.6,f,d+1.3,{rTop:.36,seg:8,kind:B.stone});const S=new we,y=Qe/Bi*zs,E=new Wt(new Ke(y,.6,y),ce(new ye({color:13088666,roughness:.5}),"sealBody"));E.position.y=.3;const U=new Wt(new Ke(y*1.01,.04,y*1.01),ce(new ye({color:pt.cinnabar,roughness:.8}),"sealFace"));U.position.y=.02;const N=new Wt(new Ki(.15,14,10),ce(new ye({color:7311228,roughness:.3}),"sealKnob"));N.position.y=.68,N.scale.y=.8,S.add(E,U,N),S.traverse(J=>J.isMesh&&(J.castShadow=!0)),s.add(S);const P=new C(l+2.6,f+1,d+1.3),k=h+(.5-yd/ds)*fi,L=new C(l,k,d+.9),H=new C(l,k,d+.03);S.position.copy(P);const z=new Le(.26,.4),O=new Rt(pt.paper),Y=new Rt(13229263),Z=[-1.55,-1.3,1.3,1.55].map((J,lt)=>{const G=new we;G.position.set(l+J,f+4.78,d-.05+lt%2*.12);const tt=ce(new ye({color:pt.paper,roughness:.95,side:ve}),"evidence"),F=new Wt(z,tt);F.position.y=-.55-lt%2*.35;const St=new Gf(new Gt().setFromPoints([new C(0,0,0),new C(0,F.position.y+.2,0)]),ce(new Fl({color:pt.cinnabar}),"string"));return G.add(F,St),G.userData.phase=lt*1.7,s.add(G),{pivot:G,mat:tt}});for(const J of[-1,1])tu(o,l+J*4.4,f,u+.6,0,1.8,.8,.8,6964784),Ql(o,l+J*4.4-.4,f+.8,u+.6,4,c),r.place("stand",l+J*4.4,f,u-.3,0,J<0?4016732:6961726,`exam${J}`);r.place("stand",l-1.6,f,u+2.4,.4,15262420),r.place("stand",l+1.7,f,u+2.6,-.5,8034954);for(const J of[-1,1])oo(a,o,l+J*2.6,f+3.7,u+e.D/2+.85,"red",f+4.6);const nt=u+e.D/2+4.5;for(let J=0;J<3;J++)for(let lt=0;lt<4;lt++){const G=l-7.2+lt*4.8,tt=nt+J*3.2;Jo(o,G,0,tt,0,3.2,5914154);for(let F=0;F<3;F++)c()<.38||r.place(c()<.2?"sitRead":"sit",G-1+F*1,0,tt+.05,Math.PI,null)}for(let J=0;J<3;J++)u2(o,52.2,0,-16+J*6.2,-Math.PI/2,3.4,c);r.place("stand",50.6,0,-13.2,Math.PI/2,null),r.place("stand",50.4,0,-7,Math.PI/2+.3,null),r.place("stand",50.8,0,-1.4,Math.PI/2-.2,null);for(const[J,lt]of[[24,-18],[47,-18],[24,1],[47,1]])pd(a,o,J,0,lt);let mt="idle",V=0,j=0;const ct=J=>{mt=J,V=0},ot=2.8,Tt=2.2,gt=J=>h+(.5-(_d+J*Md-10)/ds)*fi;return n.activate=()=>{n.trigger(),j=0,v(0,!1),S.position.copy(P),S.rotation.set(0,0,0),ct("reading")},n.onLang=()=>v(m.checked,m.sealed),n.update=(J,lt)=>{if(n.baseUpdate(lt),V+=lt,mt==="reading"){const G=Math.min(1,V/ot),tt=h+fi/2-Do(G)*(fi-.2);b.visible=!0,b.position.y=tt,R.material.opacity=.45*Math.sin(G*Math.PI);let F=0;for(let St=0;St<4;St++)tt<gt(St)&&(F=St+1);v(F,!1),G>=1&&(b.visible=!1,ct("stamping"))}else if(mt==="stamping"){const G=V/Tt;if(G<.35){const tt=Do(G/.35);S.position.lerpVectors(P,L,tt),S.position.y+=Math.sin(tt*Math.PI)*.6,S.rotation.x=Math.PI/2*tt}else if(G<.5)S.position.lerpVectors(L,H,Do((G-.35)/.15));else if(G<.62)m.sealed||(v(4,!0),t.fx.pulse(l,u+e.D/2+6,12)),S.position.lerpVectors(H,L,Do((G-.5)/.12));else if(G<1){const tt=Do((G-.62)/.38);S.position.lerpVectors(L,P,tt),S.position.y+=Math.sin(tt*Math.PI)*.6,S.rotation.x=Math.PI/2*(1-tt)}else S.position.copy(P),S.rotation.x=0,ct("sealed");j=m.sealed?Math.min(1,j+lt*1.5):0}else mt==="sealed"?(j=Math.min(1,j+lt*1.5),V>14&&(v(0,!1),ct("idle"))):j=Math.max(0,j-lt*.8);M.rotation.y=Math.sin(J*.35)*.035;for(const G of Z)G.pivot.rotation.z=Math.sin(J*.9+G.pivot.userData.phase)*.08,G.pivot.rotation.x=Math.sin(J*.6+G.pivot.userData.phase)*.05,G.mat.color.copy(O).lerp(Y,j)},n.cameraView=cr(l+2.8,4.1,u+e.D/2+9.5,l,f+2.6,d),n}const iM=()=>new Promise(i=>requestAnimationFrame(()=>i()));async function sM({scene:i,tier:t,world:e,onProgress:n=()=>{}}){const s=performance.now(),o=async(P,k)=>{n(P,k),await iM()},r=S_(t);r2(r),i.fog=new Nl(16777215,.00125);const a=E_();a.mesh.layers.enable(Oe),i.add(a.mesh);const c=R_({low:t.name==="low"});c.traverse(P=>P.layers.enable(Oe)),i.add(c);const l=F_({tier:t});i.add(l.mesh),await o(.12,"terrain");const u=t2(r,t);for(const P of u.groups)i.add(P);i.add(u.plaques),await o(.4,"architecture");const f=L2(t,{terrainHeight:ti}),d=p2();i.add(d.group);const h=new bn(21);h.instancer=r.instancer;const g={tier:t,kit:r,B:h,crowd:f,fx:d,world:e,anchors:u.anchors},x={well:V2,provenance:W2,dialogue:q2,quiet:Y2,verify:nM},p=z2.map(P=>x[P.id](P,g));for(const P of p)i.add(P.group);d2({B:h,kit:r,crowd:f,tier:t,anchors:u.anchors}),i.add(h.build(r.buckets,"furnishing")),await o(.55,"interiors");const m=_2(t),v=y2(),M=w2(),_=E2(t),w=R2();e2({trees:m,bamboo:v,grass:M,rocks:_,plants:w,tier:t,groundMap:l.map,anchors:u.anchors});for(const P of[m,v,M,_,w])i.add(P.build().group);await o(.75,"gardens");const b=B_(t);i.add(b.group),i.add(r.instancer.build().group),i.add(f2(r.halos)),i.add(f.build().group);const A=O2({tier:t,kit:r,layout:L_,water:b,anchors:u.anchors});i.add(A.group),await o(.88,"life");const R=new M1(11846354,9071180,2.1),S=new w1(pt.sun,3.4),y=new C(-2,0,12);S.position.copy(y).addScaledVector(ca,420),S.target.position.copy(y),S.castShadow=!0,S.shadow.mapSize.set(t.shadow[0],t.shadow[1]);const E=S.shadow.camera;E.left=-112,E.right=112,E.top=52,E.bottom=-52,E.near=250,E.far=640,S.shadow.bias=-35e-5,S.shadow.normalBias=.045,S.shadow.radius=t.shadowSoft?3:1,i.add(R,S,S.target);let U=null;t.name==="high"&&(U=new S1(pt.lamp,0,14,1.6),U.position.set(0,3,0),i.add(U)),i.traverse(P=>{P.material&&(Array.isArray(P.material)?P.material:[P.material]).forEach(V1)}),await o(.95,"lights"),console.info(`[world] built in ${(performance.now()-s).toFixed(0)} ms`);let N=null;return new C,{kit:r,zones:p,water:b,sun:S,hemi:R,sky:a,terrain:l,crowd:f,fx:d,anchors:u.anchors,setFocusZone(P){N=P,P&&U&&U.position.set(P.lamp.x,P.lamp.y,P.lamp.z)},update(P,k,L,H){S.intensity=3.4-H*.8,De.uSkyDim.value=1-H*.08,De.uWind.value.set(.75,.32).multiplyScalar(1-H*.7),De.uLamp.value=1+H*.35,f.update(k,L,P),A.update(k,L),d.update(k);for(const z of p)z.update(P,k);if(U){const z=N,O=z?z.lamp.intensity*(.5+z.focusMix*.6+z.energy*1.4):0;U.intensity+=(O-U.intensity)*Math.min(1,k*3),z&&(U.distance=z.lamp.distance)}}}}function oM({zones:i,onSelect:t,onActivate:e,onOverview:n}){const s=g=>document.getElementById(g),o=s("zonebar"),r=s("labels"),a=s("panel");let c=null;const l=i.map((g,x)=>{const p=g.def,m=document.createElement("button");m.className="zone-btn",m.style.setProperty("--zc",p.color),m.innerHTML=`<span class="zone-num">${x+1}</span><span class="zone-name"></span>`,m.addEventListener("click",()=>t(p.id)),o.appendChild(m);const v=document.createElement("button");return v.className="label",v.tabIndex=-1,v.style.setProperty("--zc",p.color),v.innerHTML='<span class="label-dot"></span><span class="label-text"></span>',v.addEventListener("click",()=>t(p.id)),r.appendChild(v),{zone:g,btn:m,label:v,anchor:new C,ndc:new C}});function u(){for(const g of l){const x=cf(g.zone.def.id);g.btn.querySelector(".zone-name").textContent=x.short,g.btn.setAttribute("aria-label",x.name),g.label.querySelector(".label-text").textContent=x.name}c&&f(c)}function f(g){const x=cf(g.def.id);a.style.setProperty("--zc",g.def.color),s("panel-kicker").textContent=x.kicker,s("panel-title").textContent=x.name,s("panel-body").textContent=x.body,s("panel-before").textContent=x.before,s("panel-after").textContent=x.after,s("panel-activate").textContent=x.action}s("panel-close").addEventListener("click",()=>n()),s("panel-overview").addEventListener("click",()=>n()),s("panel-activate").addEventListener("click",()=>e()),document.querySelectorAll("[data-lang]").forEach(g=>g.addEventListener("click",()=>J2(g.dataset.lang))),ru(),u(),vd(u);const d=new C,h=new C;return{show(g){c=g,f(g),a.hidden=!1,a.classList.remove("is-in"),a.offsetWidth,a.classList.add("is-in"),document.body.classList.add("has-panel")},hide(){c=null,a.hidden=!0,a.classList.remove("is-in"),document.body.classList.remove("has-panel")},setActive(g){for(const x of l){const p=x.zone.def.id===g;x.btn.classList.toggle("is-active",p),x.btn.setAttribute("aria-pressed",String(p)),x.label.classList.toggle("is-active",p)}},updateLabels(g,x,p){g.getWorldDirection(h);for(const m of l){m.zone.anchor(m.anchor),d.copy(m.anchor).sub(g.position);const v=d.length(),M=d.dot(h)<=0;if(m.ndc.copy(m.anchor).project(g),M||Math.abs(m.ndc.x)>1.1||Math.abs(m.ndc.y)>1.1){m.label.style.opacity="0",m.label.style.pointerEvents="none";continue}const w=(m.ndc.x*.5+.5)*x,b=(-m.ndc.y*.5+.5)*p,A=en.clamp(1.25-v/55,.6,1);m.label.style.transform=`translate3d(${w.toFixed(1)}px, ${b.toFixed(1)}px, 0) translate(-50%, -100%) scale(${A.toFixed(3)})`,m.label.style.opacity=String(en.clamp(1.5-v/45,.45,1)),m.label.style.pointerEvents="auto"}}}}ru();const $i=G1[H1()],tr=matchMedia("(pointer: coarse)").matches,va=matchMedia("(prefers-reduced-motion: reduce)").matches;document.documentElement.dataset.tier=$i.name;const zi=document.getElementById("scene"),au=document.getElementById("loader"),lf=document.getElementById("loader-progress");let ke;try{ke=new Bv({canvas:zi,antialias:!1,powerPreference:"high-performance",stencil:!1})}catch(i){throw au.innerHTML=`<span>${us("noWebGL")}</span>`,i}ke.toneMapping=wi;ke.toneMappingExposure=1;ke.shadowMap.enabled=!0;ke.shadowMap.type=$i.shadowSoft?df:bl;ke.shadowMap.autoUpdate=!1;const _a=Q1({minScale:$i.minScale,onChange:()=>Na()});function rM(){const i=window.devicePixelRatio||1,t=Math.sqrt($i.megapixels*1e6/(window.innerWidth*window.innerHeight));return Math.max(.5,Math.min(i,$i.maxDpr,t)*_a.scale)}const er=new Bf,ie=new hn(50,window.innerWidth/window.innerHeight,.3,4e3),cu=J1(ke,$i),Qt=new C1(ie,zi);Qt.enableDamping=!0;Qt.dampingFactor=.075;Qt.enablePan=!0;Qt.screenSpacePanning=!1;Qt.panSpeed=tr?1.1:.9;Qt.minDistance=3.5;Qt.maxDistance=300;Qt.maxPolarAngle=Math.PI*.485;Qt.minPolarAngle=Math.PI*.06;Qt.rotateSpeed=tr?.65:.5;Qt.zoomSpeed=.9;Qt.zoomToCursor=!tr;Qt.autoRotate=!1;Qt.autoRotateSpeed=.18;Qt.touches={ONE:Gi.ROTATE,TWO:Gi.DOLLY_PAN};Qt.mouseButtons={LEFT:bi.ROTATE,MIDDLE:bi.DOLLY,RIGHT:bi.PAN};Qt.enabled=!1;let Hi=0;const jn={speed:1,hushUntil:0,hush(i){jn.hushUntil=Hi+i}},_i={position:new C,target:new C};function Sd(){const i=ie.aspect<.85;ie.fov=i?62:48,ie.updateProjectionMatrix(),i?(_i.position.set(70,92,128),_i.target.set(-8,0,0)):(_i.position.set(56,46,82),_i.target.set(-7,2,-4))}Sd();ie.position.set(260,210,380);Qt.target.set(-20,0,-40);ie.lookAt(Qt.target);let Ge=null;function qr(i,t=1.9){const e=ie.position.clone(),n=e.distanceTo(i.position);Ge={fromPos:e,fromTarget:Qt.target.clone(),toPos:i.position.clone(),toTarget:i.target.clone(),lift:Math.min(28,n*.22),t:0,duration:va?.01:t},Qt.autoRotate=!1}const aM=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2;Qt.addEventListener("start",()=>{Ge=null,Qt.autoRotate=!1,lu=Hi});let Ae=null,hs=null,Bn=null,lu=0;function uf(i){lf&&(lf.style.transform=`scaleX(${Math.max(.04,i).toFixed(3)})`)}async function cM(){Na(),Ae=await sM({scene:er,tier:$i,world:jn,onProgress:x=>uf(x)});const i=Ae.zones,t=Object.fromEntries(i.map(x=>[x.def.id,x])),e=i.flatMap(x=>x.hits);vd(()=>i.forEach(x=>x.onLang&&x.onLang())),hs=oM({zones:i,onSelect:x=>n(x),onActivate:()=>Bn&&Bn.activate(),onOverview:()=>s()});function n(x){const p=t[x];if(!p)return;Bn&&Bn!==p&&(Bn.focused=!1),Bn=p,p.focused=!0,p.activate(),Ae.setFocusZone(p),hs.setActive(x),hs.show(p);const m=p.cameraView,v=ie.aspect<.85?1.55:1;qr({target:m.target,position:m.position.clone().sub(m.target).multiplyScalar(v).add(m.target)})}function s(){Bn&&(Bn.focused=!1),Bn=null,Ae.setFocusZone(null),hs.setActive(null),hs.hide(),qr(_i,2.2)}window.__select=n;const o=new E1,r=new rt,a=new Map;let c=null,l={time:0,x:0,y:0};const u=x=>{const p=zi.getBoundingClientRect();r.set((x.clientX-p.left)/p.width*2-1,-((x.clientY-p.top)/p.height)*2+1)};zi.addEventListener("pointerdown",x=>{a.set(x.pointerId,!0),c=a.size===1?{x:x.clientX,y:x.clientY,time:performance.now(),id:x.pointerId}:null}),zi.addEventListener("pointerup",x=>{if(a.delete(x.pointerId),!c||c.id!==x.pointerId)return;const p=Math.hypot(x.clientX-c.x,x.clientY-c.y),m=performance.now()-c.time<450;if(c=null,p>(tr?12:6)||!m)return;u(x),o.setFromCamera(r,ie);const v=performance.now(),M=v-l.time<360&&Math.hypot(x.clientX-l.x,x.clientY-l.y)<30;if(l={time:v,x:x.clientX,y:x.clientY},M){const w=o.intersectObject(Ae.terrain.mesh,!1)[0];if(w){const b=ie.position.clone().sub(Qt.target).normalize(),A=en.clamp(ie.position.distanceTo(Qt.target),14,40),R=w.point.clone().add(new C(0,1.4,0));qr({target:R,position:R.clone().addScaledVector(b,A)},1.6)}return}const _=o.intersectObjects(e,!1)[0];_&&n(_.object.userData.zoneId)}),zi.addEventListener("pointercancel",x=>{a.delete(x.pointerId),c=null}),tr||zi.addEventListener("pointermove",x=>{a.size||(u(x),o.setFromCamera(r,ie),zi.style.cursor=o.intersectObjects(e,!1).length?"pointer":"grab")});const f=new Set;window.addEventListener("keydown",x=>{if(x.target&&(x.target.tagName==="INPUT"||x.target.tagName==="TEXTAREA"))return;x.key==="Escape"&&s();const p=Number(x.key);p>=1&&p<=i.length&&n(i[p-1].def.id),f.add(x.key.toLowerCase())}),window.addEventListener("keyup",x=>f.delete(x.key.toLowerCase())),window.addEventListener("blur",()=>f.clear()),Ae.walkKeys=f,await ke.compileAsync(er,ie).catch(()=>{}),ke.shadowMap.needsUpdate=!0,uf(1),au.classList.add("is-done"),document.body.classList.add("is-ready");const d=new URLSearchParams(location.search),h=d.get("zone"),g=d.get("cam");if(g){const x=g.split(",").map(Number);ie.position.set(x[0],x[1],x[2]),Qt.target.set(x[3],x[4],x[5])}else t[h]?(ie.position.copy(_i.position).add(new C(0,30,40)),d.get("intro")==="0"&&(Ge=null),n(h),d.get("intro")==="0"&&(Ge.duration=.01)):d.get("intro")==="0"?(ie.position.copy(_i.position),Qt.target.copy(_i.target)):qr(_i,va?.01:4.2);d.get("stats")&&(ke.info.autoReset=!1,window.__stats=()=>({...ke.info.render})),Qt.enabled=!0,lu=Hi}const Io=new rt;function Na(){const i=window.innerWidth,t=window.innerHeight;ke.setPixelRatio(rM()),ke.setSize(i,t,!1),ie.aspect=i/t,Sd(),ke.getDrawingBufferSize(Io),cu.setSize(Io.x,Io.y),Ae&&Ae.water.mirror&&Ae.water.mirror.setSize(Io.x,Io.y)}window.addEventListener("resize",Na);window.addEventListener("orientationchange",()=>setTimeout(Na,200));let hf=performance.now(),Yr=0,ff=0;const di=new C,Os=new C,Ec=new C;function bd(i){requestAnimationFrame(bd);const t=(i-hf)/1e3;if(hf=i,document.hidden)return;const e=Math.min(t,1/20);_a.sample(t);const n=va?.35:1;Hi+=e*n;const s=Hi<jn.hushUntil,o=s?.08:1;jn.speed+=(o-jn.speed)*Math.min(1,e*(o<jn.speed?2.2:.8)),document.body.classList.toggle("is-hushed",s);const r=1-(jn.speed-.08)/.92;De.uTime.value+=e*n*jn.speed,ff+=e*n*(.35+.65*jn.speed),De.uWindTime.value=ff;const c=Bn&&window.innerWidth<=720?window.innerHeight*.2:0;if(Yr+=(c-Yr)*Math.min(1,e*4),Math.abs(Yr)>.5?ie.setViewOffset(window.innerWidth,window.innerHeight,0,Yr,window.innerWidth,window.innerHeight):ie.view&&ie.view.enabled&&ie.clearViewOffset(),Ge){Ge.t+=e/Ge.duration;const u=aM(Math.min(1,Ge.t));ie.position.lerpVectors(Ge.fromPos,Ge.toPos,u),ie.position.y+=Math.sin(u*Math.PI)*Ge.lift,Qt.target.lerpVectors(Ge.fromTarget,Ge.toTarget,u),Ge.t>=1&&(Ge=null)}if(Ae&&Ae.walkKeys&&Ae.walkKeys.size&&!Ge){ie.getWorldDirection(Os),Os.y=0,Os.normalize(),Ec.crossVectors(Os,ie.up).normalize(),di.set(0,0,0);const u=Ae.walkKeys;if((u.has("w")||u.has("arrowup"))&&di.add(Os),(u.has("s")||u.has("arrowdown"))&&di.sub(Os),(u.has("d")||u.has("arrowright"))&&di.add(Ec),(u.has("a")||u.has("arrowleft"))&&di.sub(Ec),di.lengthSq()>0){const f=en.clamp(ie.position.distanceTo(Qt.target)*.9,6,60)*e;di.normalize().multiplyScalar(f),ie.position.add(di),Qt.target.add(di)}}Ae&&!Bn&&!Ge&&Hi-lu>14&&!va&&(Qt.autoRotate=!0),Qt.update(e),Qt.target.x=en.clamp(Qt.target.x,-190,190),Qt.target.z=en.clamp(Qt.target.z,-210,210),Qt.target.y=en.clamp(Qt.target.y,-1,28);const l=ti(ie.position.x,ie.position.z)+1.2;ie.position.y<l&&(ie.position.y=l),Ae&&(Ae.update(Hi,e,jn.speed,r),Ae.water.mirror&&_a.scale>.75&&Ae.water.mirror.update(ke,er,ie)),ke.info.autoReset||ke.info.reset(),cu.render(er,ie,Hi),hs&&hs.updateLabels(ie,window.innerWidth,window.innerHeight)}requestAnimationFrame(bd);cM().catch(i=>{console.error(i),au.innerHTML=`<span>${us("noWebGL")}</span>`});window.__loq={scene:er,camera:ie,renderer:ke,U:De,post:cu,controls:Qt,governor:_a,tier:$i,get world(){return Ae}};
