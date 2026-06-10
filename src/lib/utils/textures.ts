export function createProceduralTexture(
  width: number = 1024,
  height: number = 512,
  type: 'planet' | 'normal' | 'roughness' = 'planet'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const u = x / width;
      const v = y / height;
      
      if (type === 'planet') {
        const noise1 = Math.sin(u * 20 + v * 10) * 0.5 + 0.5;
        const noise2 = Math.sin(u * 5 + v * 15 + noise1 * 5) * 0.5 + 0.5;
        const noise3 = Math.sin(u * 50 + v * 20) * 0.5 + 0.5;
        
        const elevation = noise1 * 0.6 + noise2 * 0.3 + noise3 * 0.1;
        const latitude = (v - 0.5) * 2;
        const polarFactor = 1 - Math.abs(latitude);
        
        let r = 0, g = 0, b = 0;
        
        if (elevation < 0.3) {
          const t = elevation / 0.3;
          r = Math.floor((0.02 + t * 0.05) * 255);
          g = Math.floor((0.05 + t * 0.1) * 255);
          b = Math.floor((0.15 + t * 0.2) * 255);
        } else if (elevation < 0.5) {
          const t = (elevation - 0.3) / 0.2;
          r = Math.floor((0.05 + t * 0.15) * 255);
          g = Math.floor((0.15 + t * 0.2) * 255);
          b = Math.floor((0.2 + t * 0.1) * 255);
        } else if (elevation < 0.7) {
          const t = (elevation - 0.5) / 0.2;
          r = Math.floor((0.2 + t * 0.2) * 255);
          g = Math.floor((0.35 + t * 0.15) * 255);
          b = Math.floor((0.1 + t * 0.1) * 255);
        } else {
          const t = (elevation - 0.7) / 0.3;
          r = Math.floor((0.4 + t * 0.3) * 255);
          g = Math.floor((0.5 + t * 0.2) * 255);
          b = Math.floor((0.2 + t * 0.1) * 255);
        }
        
        if (polarFactor < 0.2) {
          const ice = (0.2 - polarFactor) / 0.2;
          r = Math.floor((r + ice * 100) * 255 / 255);
          g = Math.floor((g + ice * 120) * 255 / 255);
          b = Math.floor((b + ice * 150) * 255 / 255);
        }
        
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      } else if (type === 'normal') {
        const noise = Math.sin(u * 30 + v * 15) * 0.5 + 0.5;
        const bump = Math.sin(u * 100 + v * 50) * 0.5 + 0.5;
        
        const nx = (noise - 0.5) * 0.5 + 0.5;
        const ny = (bump - 0.5) * 0.5 + 0.5;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        
        data[i] = Math.floor(nx * 255);
        data[i + 1] = Math.floor(ny * 255);
        data[i + 2] = Math.floor(nz * 255);
        data[i + 3] = 255;
      } else if (type === 'roughness') {
        const noise = Math.sin(u * 40 + v * 20) * 0.5 + 0.5;
        const val = noise * 0.5 + 0.3;
        
        data[i] = Math.floor(val * 255);
        data[i + 1] = Math.floor(val * 255);
        data[i + 2] = Math.floor(val * 255);
        data[i + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function createTextureDataURL(
  width: number = 1024,
  height: number = 512,
  type: 'planet' | 'normal' | 'roughness' = 'planet'
): string {
  if (typeof window === 'undefined') return '';
  const canvas = createProceduralTexture(width, height, type);
  return canvas.toDataURL('image/png');
}