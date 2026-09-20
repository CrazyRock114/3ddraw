import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SunMedium, Sparkles, HelpCircle, Eye, Sliders, ArrowRight, ShieldCheck, Crosshair } from 'lucide-react';
import MathFormula from './MathFormula';
import { calculateLambertShading, vec3, normalize3, dot3 } from '../utils/mathUtils';

export default function ShadingLab() {
  const canvasRef = useRef(null);
  
  // Object type: 'sphere', 'cylinder', 'cube'
  const [objectType, setObjectType] = useState('sphere');

  // Light parameters
  const [lightAngleDeg, setLightAngleDeg] = useState(45); // 0 to 360 deg azimuth
  const [lightHeight, setLightHeight] = useState(0.7); // 0.2 to 1.0 elevation (z)
  const [lightIntensity, setLightIntensity] = useState(1.0);
  const [bounceIntensity, setBounceIntensity] = useState(0.25); // Reflected ground light
  const [aoIntensity, setAoIntensity] = useState(0.4); // Ambient occlusion

  // Inspection mode
  const [highlightZone, setHighlightZone] = useState('all'); // 'all', 'highlight', 'halftone', 'terminator', 'bounce', 'shadow'
  const [hoverCoord, setHoverCoord] = useState({ x: 300, y: 220 });
  const [isHovering, setIsHovering] = useState(false);

  // Probe math data
  const [probeData, setProbeData] = useState({
    nx: 0, ny: 0, nz: 1,
    lx: 0.7, ly: 0.7, lz: 0.7,
    dot: 0.8,
    angleDeg: 36,
    brightness: 0.85
  });

  const canvasWidth = 640;
  const canvasHeight = 440;

  // Render the shading simulator
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Light direction vector (normalized)
    const rad = (lightAngleDeg * Math.PI) / 180;
    const lx = Math.cos(rad);
    const ly = -Math.sin(rad); // screen Y is down, so light from top has negative Y
    const lz = lightHeight;
    const lightDir = normalize3(vec3(lx, ly, lz));

    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2 - 20;
    const radius = 110;

    // 1. Draw Cast Shadow on Floor
    const groundY = cy + radius;
    // Shadow offset depends on light position
    const shadowOffsetX = -lightDir.x * 120 * (1 / Math.max(0.3, lightHeight));
    const shadowOffsetY = 15 + lightDir.y * 30;
    const shadowRadiusX = radius * (1.2 + Math.abs(lightDir.x) * 0.4);
    const shadowRadiusY = radius * 0.28;

    ctx.save();
    const shadowGrad = ctx.createRadialGradient(
      cx + shadowOffsetX * 0.5, groundY + shadowOffsetY * 0.6, 5,
      cx + shadowOffsetX * 0.5, groundY + shadowOffsetY * 0.6, shadowRadiusX
    );

    const isShadowActive = highlightZone === 'all' || highlightZone === 'shadow';
    if (isShadowActive) {
      shadowGrad.addColorStop(0, 'rgba(2, 6, 23, 0.95)');
      shadowGrad.addColorStop(0.3, 'rgba(15, 23, 42, 0.75)');
      shadowGrad.addColorStop(0.7, 'rgba(30, 41, 59, 0.35)');
      shadowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.beginPath();
      ctx.ellipse(
        cx + shadowOffsetX * 0.5,
        groundY + shadowOffsetY * 0.6,
        shadowRadiusX,
        shadowRadiusY,
        (-lightDir.x * 0.3),
        0,
        Math.PI * 2
      );
      ctx.fillStyle = shadowGrad;
      ctx.fill();
    }
    ctx.restore();

    // 2. Pixel-level Rendering of the 3D Sphere / Cylinder with Lambert + Bounce + Specular
    const imgData = ctx.createImageData(canvasWidth, canvasHeight);
    const data = imgData.data;

    let probeResult = null;

    if (objectType === 'sphere') {
      for (let py = 0; py < canvasHeight; py++) {
        for (let px = 0; px < canvasWidth; px++) {
          const dx = px - cx;
          const dy = py - cy;
          const distSq = dx * dx + dy * dy;

          if (distSq <= radius * radius) {
            const index = (py * canvasWidth + px) * 4;

            // Compute surface normal
            const nz = Math.sqrt(Math.max(0, radius * radius - distSq)) / radius;
            const nx = dx / radius;
            const ny = dy / radius;
            const normal = vec3(nx, ny, nz);

            // Lambert direct diffuse term: N · L
            const nDotL = dot3(normal, lightDir);
            const directCos = Math.max(0, nDotL);

            // Ground reflected light term: light bouncing upwards from ground (Ny > 0 means pointing down)
            const bounceCos = Math.max(0, ny) * (1 - Math.max(0, -lightDir.y * 0.5));
            const bounce = bounceCos * bounceIntensity;

            // Ambient Occlusion near base contact
            const distToBase = Math.max(0, (radius - dy) / radius);
            const ao = (dy > radius * 0.5) ? (1 - Math.pow(1 - (radius - dy) / (radius * 0.5), 2) * aoIntensity) : 1;

            // Specular highlight: Half-vector approximation with view vector V = (0, 0, 1)
            const hx = lightDir.x;
            const hy = lightDir.y;
            const hz = lightDir.z + 1.0;
            const hNorm = normalize3(vec3(hx, hy, hz));
            const nDotH = Math.max(0, dot3(normal, hNorm));
            const specular = Math.pow(nDotH, 28) * 0.65 * lightIntensity;

            // Total gray intensity
            let totalIntensity = (directCos * 0.8 * lightIntensity + bounce + 0.08) * ao + specular;
            totalIntensity = Math.min(1, Math.max(0, totalIntensity));

            // Zone Filtering for education
            let r = totalIntensity * 255;
            let g = totalIntensity * 255;
            let b = totalIntensity * 255;

            // If user selected a specific zone to highlight
            if (highlightZone === 'highlight') {
              if (specular > 0.15) {
                r = 255; g = 220; b = 50; // Yellow glow for highlight
              } else {
                r *= 0.3; g *= 0.3; b *= 0.3;
              }
            } else if (highlightZone === 'terminator') {
              // Terminator: where N · L is close to 0 (-0.15 to 0.15)
              if (Math.abs(nDotL) < 0.15) {
                r = 239; g = 68; b = 68; // Red for terminator
              } else {
                r *= 0.25; g *= 0.25; b *= 0.25;
              }
            } else if (highlightZone === 'bounce') {
              if (ny > 0.3 && nDotL < 0.2) {
                r = 56; g = 189; b = 248; // Sky blue for bounce reflection
              } else {
                r *= 0.25; g *= 0.25; b *= 0.25;
              }
            } else if (highlightZone === 'halftone') {
              if (nDotL > 0.15 && nDotL < 0.7) {
                r = 52; g = 211; b = 153; // Green for halftone
              } else {
                r *= 0.25; g *= 0.25; b *= 0.25;
              }
            }

            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = 255;

            // Check if this pixel matches user probe hover
            if (Math.abs(px - hoverCoord.x) < 2 && Math.abs(py - hoverCoord.y) < 2) {
              const angle = Math.round((Math.acos(Math.min(1, Math.max(-1, nDotL))) * 180) / Math.PI);
              probeResult = {
                nx: Number(nx.toFixed(2)),
                ny: Number(ny.toFixed(2)),
                nz: Number(nz.toFixed(2)),
                lx: Number(lightDir.x.toFixed(2)),
                ly: Number(lightDir.y.toFixed(2)),
                lz: Number(lightDir.z.toFixed(2)),
                dot: Number(nDotL.toFixed(2)),
                angleDeg: angle,
                brightness: Number(totalIntensity.toFixed(2)),
              };
            }
          }
        }
      }
    } else if (objectType === 'cylinder') {
      // Cylinder rendering
      const cylW = radius * 1.5;
      const cylH = radius * 1.8;
      const left = cx - cylW / 2;
      const right = cx + cylW / 2;
      const top = cy - cylH / 2;
      const bottom = cy + cylH / 2;

      for (let py = 0; py < canvasHeight; py++) {
        for (let px = 0; px < canvasWidth; px++) {
          if (px >= left && px <= right && py >= top && py <= bottom) {
            const index = (py * canvasWidth + px) * 4;
            const normX = ((px - left) / cylW) * 2 - 1; // -1 to 1
            const nz = Math.sqrt(Math.max(0, 1 - normX * normX));
            const nx = normX;
            const ny = 0;
            const normal = vec3(nx, ny, nz);

            const nDotL = dot3(normal, lightDir);
            const directCos = Math.max(0, nDotL);
            const bounce = (normX > 0.5 ? 0.2 : 0) * bounceIntensity;
            let intensity = directCos * 0.85 * lightIntensity + bounce + 0.1;
            intensity = Math.min(1, Math.max(0, intensity));

            data[index] = intensity * 255;
            data[index + 1] = intensity * 255;
            data[index + 2] = intensity * 255;
            data[index + 3] = 255;

            if (Math.abs(px - hoverCoord.x) < 2 && Math.abs(py - hoverCoord.y) < 2) {
              const angle = Math.round((Math.acos(Math.min(1, Math.max(-1, nDotL))) * 180) / Math.PI);
              probeResult = {
                nx: Number(nx.toFixed(2)), ny: 0, nz: Number(nz.toFixed(2)),
                lx: Number(lightDir.x.toFixed(2)), ly: Number(lightDir.y.toFixed(2)), lz: Number(lightDir.z.toFixed(2)),
                dot: Number(nDotL.toFixed(2)), angleDeg: angle, brightness: Number(intensity.toFixed(2))
              };
            }
          }
        }
      }
    } else {
      // Cube faces rendering
      // Top face, front face, side face
    }

    ctx.putImageData(imgData, 0, 0);

    // 3. Draw Light Source Position Icon
    const lightDist = 180;
    const lightScreenX = cx + Math.cos(rad) * lightDist;
    const lightScreenY = cy - Math.sin(rad) * lightDist * 0.7;

    ctx.save();
    // Glowing sun
    ctx.beginPath();
    ctx.arc(lightScreenX, lightScreenY, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.fill();

    // Ray pointing to sphere
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lightScreenX, lightScreenY);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(`光源 θ=${lightAngleDeg}°`, lightScreenX - 25, lightScreenY - 18);
    ctx.restore();

    // 4. Draw Probe Indicator & Vectors if hovering
    if (probeResult) {
      setProbeData(probeResult);
    }

    if (isHovering) {
      ctx.save();
      // Target crosshair
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hoverCoord.x, hoverCoord.y, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Normal Vector N (Green)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(hoverCoord.x, hoverCoord.y);
      ctx.lineTo(hoverCoord.x + probeData.nx * 40, hoverCoord.y + probeData.ny * 40);
      ctx.stroke();

      // Draw Light Vector L (Yellow)
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(hoverCoord.x, hoverCoord.y);
      ctx.lineTo(hoverCoord.x + lightDir.x * 40, hoverCoord.y + lightDir.y * 40);
      ctx.stroke();

      // Vector labels
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('N', hoverCoord.x + probeData.nx * 45, hoverCoord.y + probeData.ny * 45);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('L', hoverCoord.x + lightDir.x * 45, hoverCoord.y + lightDir.y * 45);

      ctx.restore();
    }

  }, [lightAngleDeg, lightHeight, lightIntensity, bounceIntensity, aoIntensity, objectType, highlightZone, hoverCoord, isHovering]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverCoord({ x, y });
    setIsHovering(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <SunMedium className="w-3.5 h-3.5" />
          模块二 · 朗伯光影与素描五大调
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
          光影明暗：雕刻体积的余弦魔法
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          线稿决定了物体的骨架，而光影赋予物体重量、厚度与质感。
          1760年物理学家朗伯发现：<strong className="text-amber-300">表面的明暗只取决于法向量与入射光线的夹角余弦</strong>。
          掌握素描“五大调”，就是学会用铅笔在纸面上执行这道物理公式。
        </p>
      </div>

      {/* Main Studio Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Canvas Panel */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
            {/* Shape Select */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'sphere', label: '石膏球体 (Sphere)' },
                { id: 'cylinder', label: '圆柱体 (Cylinder)' },
              ].map(shape => (
                <button
                  key={shape.id}
                  onClick={() => setObjectType(shape.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    objectType === shape.id
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {shape.label}
                </button>
              ))}
            </div>

            {/* Five Values Zone Highlighter */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs py-0.5">
              {[
                { id: 'all', label: '全部五调' },
                { id: 'highlight', label: '高光 (Highlight)' },
                { id: 'halftone', label: '灰面 (Halftone)' },
                { id: 'terminator', label: '明暗交界线' },
                { id: 'bounce', label: '反光 (Bounce)' },
                { id: 'shadow', label: '投影 (Shadow)' },
              ].map(zone => (
                <button
                  key={zone.id}
                  onClick={() => setHighlightZone(zone.id)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    highlightZone === zone.id
                      ? 'bg-slate-800 border border-amber-500/50 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="relative select-none bg-slate-950 flex items-center justify-center p-3">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsHovering(false)}
              className="w-full max-h-[440px] cursor-crosshair rounded-xl border border-slate-800/80 shadow-inner"
            />
            {/* Hover instruction */}
            <div className="absolute bottom-4 left-4 pointer-events-none bg-slate-900/85 backdrop-blur border border-slate-700/60 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>鼠标在球体上移动，实时探查该点表面法向量 N 与光向量 L 的数学点积</span>
            </div>
          </div>

          {/* Sliders */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>光源方位角 (Azimuth)</span>
                <span className="font-mono text-amber-400">{lightAngleDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={lightAngleDeg}
                onChange={(e) => setLightAngleDeg(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>地面反光强度 (Bounce Light)</span>
                <span className="font-mono text-amber-400">{Math.round(bounceIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.6"
                step="0.05"
                value={bounceIntensity}
                onChange={(e) => setBounceIntensity(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>贴地闭塞阴影 (Ambient Occlusion)</span>
                <span className="font-mono text-amber-400">{Math.round(aoIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={aoIntensity}
                onChange={(e) => setAoIntensity(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Math Inspector & Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Vector Probe Card */}
          <div className="math-card space-y-3 border-amber-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm font-serif flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-amber-400" />
                表面微元实时数学探针
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Live Inspector
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-0.5">法向量 N (Normal)</span>
                  <span className="text-slate-300">[{probeData.nx}, {probeData.ny}, {probeData.nz}]</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-0.5">光照向量 L (Light)</span>
                  <span className="text-slate-300">[{probeData.lx}, {probeData.ly}, {probeData.lz}]</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>入射夹角 θ：</span>
                  <span className="font-mono text-amber-400 font-bold">{probeData.angleDeg}°</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>点积 cos(θ) = N · L：</span>
                  <span className="font-mono text-white font-bold">{probeData.dot}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>该点综合亮度：</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(probeData.brightness * 100)}%</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                {probeData.angleDeg < 40 ? (
                  <span className="text-amber-300">🔥 处于高光亮区：法向量几乎正对光源，单位面积接收的光子通量最高。</span>
                ) : probeData.angleDeg >= 85 && probeData.angleDeg <= 95 ? (
                  <span className="text-red-400">⚡ 处于明暗交界线：光线与表面相切，直接光强归零！</span>
                ) : probeData.angleDeg > 95 ? (
                  <span className="text-blue-300">🌑 处于背光暗区：此时直接光为0，亮度完全来自地面弹射反光（Bounce Light）。</span>
                ) : (
                  <span className="text-emerald-300">🌿 处于中间调（灰面）：余弦值平缓过渡，展现出石膏温润的曲面质感。</span>
                )}
              </div>
            </div>
          </div>

          {/* The 5 Values Cheat Sheet */}
          <div className="math-card space-y-3">
            <h4 className="font-bold text-white text-xs font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              素描初学必背“五大调”
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { name: '1. 高光 (Highlight)', desc: '光源镜像反射点，通常留白或点上最浅的铅笔色。', color: 'bg-white' },
                { name: '2. 亮面与灰面 (Halftone)', desc: '受光均匀面，余弦值从 1 缓慢递减到 0.2。', color: 'bg-slate-300' },
                { name: '3. 明暗交界线 (Terminator)', desc: '整个球体最暗的带状区域！也是画出球体转折的关键。', color: 'bg-slate-700' },
                { name: '4. 反光 (Reflected Light)', desc: '地面将光线反弹至球体底部暗部，绝不能画得比亮面还亮。', color: 'bg-slate-500' },
                { name: '5. 投影与闭塞 (Shadow & AO)', desc: '接触缝隙处光线无法进入（AO），是整张画最深的一笔。', color: 'bg-slate-950' },
              ].map((item, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                  <div className={`w-3 h-3 rounded-full mt-0.5 shrink-0 border border-slate-600 ${item.color}`} />
                  <div>
                    <div className="font-bold text-slate-200">{item.name}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Principles of Shading */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-serif text-white">光影背后的物理与数学原理</h2>
          <p className="text-xs text-slate-400">为什么平滑的球体会有弯曲的明暗交界线？为什么投影是严格的椭圆？</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Lambert's Cosine Law */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-amber-300 font-serif">1. 朗伯漫反射余弦定律 (1760)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              假设一束截面积为 <MathFormula math="\Delta A" /> 的平行光束倾斜照射到表面上。
              由于倾斜，原本集中在小面积上的光通量被摊散到了更大的面积 <MathFormula math="\Delta A / \cos\theta" /> 上。
              因此，单位表面积接收到的辐照度与入射角的余弦成正比：
            </p>
            <MathFormula math="I_{\text{diffuse}} = I_{\text{light}} \cdot k_d \cdot \max(0, \vec{N} \cdot \vec{L}) = I_{\text{light}} \cdot k_d \cdot \cos\theta" block />
            <p className="text-xs text-slate-400">
              这就是为什么素描大师总是强调“转过去就变暗”。只要表面法向量偏转一度，<MathFormula math="\cos\theta" /> 就会相应下降，形成连续的灰度渐变。
            </p>
          </div>

          {/* Card 2: Shadow Geometry & Conic Sections */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-amber-300 font-serif">2. 投影几何与圆锥截线方程</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              点光源发出的光线与球体相切，形成的切线包络面是一个<strong>三维直圆锥</strong>。
              当这个圆锥与平面的画纸/地面相交时，根据圆锥截线（Conic Sections）几何理论：
            </p>
            <MathFormula math="\frac{(x - x_0)^2}{a^2} + \frac{(y - y_0)^2}{b^2} = 1 \quad (a > b)" block />
            <p className="text-xs text-slate-400">
              只要地面水平且光线倾斜，投影就<strong>必然是一个严格的椭圆</strong>！长轴 <MathFormula math="a" /> 的长度严格由光源高度角决定：
              光源越低，圆锥截角越斜，投影椭圆被拉得越长；正午时投影则收缩为正圆。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
