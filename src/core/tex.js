import {
  WebGLRenderTarget,
  ShaderMaterial,
  Mesh,
  Scene,
  OrthographicCamera,
  BufferGeometry,
  Float32BufferAttribute,
  RepeatWrapping,
  MirroredRepeatWrapping,
  LinearMipmapLinearFilter,
  LinearFilter,
  SRGBColorSpace,
  NoColorSpace,
  UnsignedByteType,
  Vector2
} from 'three';

// Procedural PBR textures, baked once on the GPU.
// Each material is a small GLSL "recipe" with three functions over a tile
// measured in millimetres:  height(p) → normal map,  albedo(p) → sRGB colour
// map,  rough(p) → roughness.  Noise is periodic over the tile, so every map
// repeats seamlessly. Baking a 1024² map takes well under a millisecond, which
// keeps phones from spending seconds on CPU texture synthesis.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4( position.xy, 0.0, 1.0 ); }
`;

export const NOISE = /* glsl */ `
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
`;

// ---------------------------------------------------------------- recipes
// p is in mm inside a tile of uSize mm. Each recipe defines height, albedo
// (linear RGB) and rough; 'bump' scales the normal. tn / tfbm / tworley take
// a whole number of lattice cells across the tile, so the result is periodic.
export const RECIPES = {
  // pale white-oak desk: boards along x, noise-warped grain, rays and pores
  // (mirrored wrapping hides the tile edge, so this one need not be periodic)
  oak: {
    size: [1600, 800],
    bump: 1.6,
    glsl: /* glsl */ `
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
    `
  },

  // slate-blue linoleum desk pad: mottled with light and dark flecks
  lino: {
    size: [120, 120],
    bump: 0.5,
    glsl: /* glsl */ `
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
    `
  },

  // paper: albedo is a near-white multiplier, fibres show in the normal map
  paper: {
    size: [36, 36],
    bump: 0.28,
    glsl: /* glsl */ `
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
    `
  },

  // plain-weave bookcloth: 24 threads per 6 mm tile, over-under, with slubs
  weave: {
    size: [6, 6],
    bump: 0.55,
    glsl: /* glsl */ `
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
    `
  },

};

// ---------------------------------------------------------------- baker
export function createBaker(renderer) {
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  geo.setAttribute('uv', new Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
  const quad = new Mesh(geo, null);
  quad.frustumCulled = false;
  const scene = new Scene();
  scene.add(quad);
  const cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const cache = new Map();

  function target(w, h, { srgb = false, mirrored = false } = {}) {
    const rt = new WebGLRenderTarget(w, h, {
      type: UnsignedByteType,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: true,
      minFilter: LinearMipmapLinearFilter,
      magFilter: LinearFilter,
      wrapS: mirrored ? MirroredRepeatWrapping : RepeatWrapping,
      wrapT: mirrored ? MirroredRepeatWrapping : RepeatWrapping,
      anisotropy,
      colorSpace: srgb ? SRGBColorSpace : NoColorSpace
    });
    return rt;
  }

  function run(material, rt) {
    quad.material = material;
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(rt);
    renderer.render(scene, cam);
    renderer.setRenderTarget(prev);
  }

  // bake one recipe into { map, normalMap, roughnessMap, size: [mmX, mmY] }
  function bake(name, { res = 512, mirrored = false } = {}) {
    const key = `${name}:${res}`;
    if (cache.has(key)) return cache.get(key);
    const r = RECIPES[name];
    const aspect = r.size[0] / r.size[1];
    const w = Math.round(res * Math.max(1, aspect));
    const h = Math.round(res / Math.min(1, aspect));
    const uniforms = {
      uSize: { value: new Vector2(r.size[0], r.size[1]) },
      uRes: { value: new Vector2(w, h) },
      uBump: { value: r.bump }
    };
    const frag = (mode) => /* glsl */ `
      uniform vec2 uSize;
      uniform vec2 uRes;
      uniform float uBump;
      varying vec2 vUv;
      ${NOISE}
      // tile-periodic helpers: 'cells' lattice cells across the whole tile
      float tn( vec2 p, vec2 cells ) { return pnoise( p / uSize * cells, cells ); }
      float tfbm( vec2 p, vec2 cells, int oct ) { return pfbm( p / uSize * cells, cells, oct ); }
      vec3 tworley( vec2 p, vec2 cells ) { return pworley( p / uSize * cells, cells ); }
      ${r.glsl}
      void main() {
        vec2 p = vUv * uSize;
        #if ${mode} == 0
          gl_FragColor = vec4( albedo( p ), 1.0 );
        #elif ${mode} == 1
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
    `;
    const out = { size: r.size };
    ['map', 'normalMap', 'roughnessMap'].forEach((slot, mode) => {
      const rt = target(w, h, { srgb: mode === 0, mirrored });
      const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: frag(mode), uniforms, depthTest: false, depthWrite: false });
      run(mat, rt);
      mat.dispose();
      out[slot] = rt.texture;
      out[slot + 'RT'] = rt;
    });
    cache.set(key, out);
    return out;
  }

  // run an arbitrary fragment shader into a target (used for cookies, etc.)
  function shader(frag, { width, height, uniforms = {}, srgb = false, mips = true, wrap = RepeatWrapping } = {}) {
    const rt = new WebGLRenderTarget(width, height, {
      type: UnsignedByteType,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: mips,
      minFilter: mips ? LinearMipmapLinearFilter : LinearFilter,
      magFilter: LinearFilter,
      wrapS: wrap,
      wrapT: wrap,
      anisotropy,
      colorSpace: srgb ? SRGBColorSpace : NoColorSpace
    });
    const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: `varying vec2 vUv;\n${NOISE}\n${frag}`, uniforms, depthTest: false, depthWrite: false });
    run(mat, rt);
    mat.dispose();
    return rt.texture;
  }

  return { bake, shader, anisotropy };
}
