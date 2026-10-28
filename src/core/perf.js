// Adaptive resolution governor: watches frame times and steps the render
// scale down when the device struggles, back up when it has headroom.
// Hysteresis keeps it from oscillating.
export function createGovernor({ minScale = 0.6, onChange = () => {} } = {}) {
  let scale = 1;
  let acc = 0;
  let frames = 0;
  let good = 0;
  let ema = 16;
  let warm = 0;
  return {
    get scale() {
      return scale;
    },
    get ms() {
      return ema;
    },
    // dt in seconds (unclamped real frame time)
    sample(dt) {
      const ms = dt * 1000;
      if (ms > 250) return; // tab switch / hitch
      warm++;
      if (warm < 90) return; // let shaders and caches settle
      ema += (ms - ema) * 0.05;
      acc += ms;
      frames++;
      if (acc < 1500) return;
      const avg = acc / frames;
      acc = 0;
      frames = 0;
      if (avg > 26 && scale > minScale) {
        scale = Math.max(minScale, scale * 0.85);
        good = 0;
        onChange(scale);
      } else if (avg < 14.5) {
        good++;
        if (good >= 4 && scale < 1) {
          scale = Math.min(1, scale * 1.1);
          good = 0;
          onChange(scale);
        }
      } else good = 0;
    }
  };
}
