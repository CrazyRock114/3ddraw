import React, { useState, useRef, useEffect } from 'react';
import { Eye, RotateCw, Sparkles, Layers, Sliders, CheckCircle2, Maximize2, Scissors } from 'lucide-react';
import MathFormula from './MathFormula';

export default function AnamorphicLab() {
  // Angle of observation: 0 = Top-down (flat distorted), 55 = Golden Angle (3D popping)
  const [viewAngle, setViewAngle] = useState(55);
  // Selected illusion preset
  const [selectedPreset, setSelectedPreset] = useState('cube'); // 'cube', 'ladder', 'hole'
  // Toggle show ray lines
  const [showRays, setShowRays] = useState(false);
  // Cut paper illusion trick
  const [cutPaperTrick, setCutPaperTrick] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Eye className="w-3.5 h-3.5" />
          模块三 · 视错觉立体画与单应性逆透视
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
          视错觉艺术：破纸而出的科学骗局
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          你一定在网上见过那些“跨越折痕的天梯”和“悬浮在画本上的魔方”——拿起手机从斜上方一拍，平面画作瞬间跃出纸面！
          其奥秘正是<strong className="text-amber-300">逆透视单应性变换（Homography）</strong>：
          在纸面上故意拉伸畸变，当用人眼或手机以特定倾斜角度观察时，纸面的透视收缩恰好抵消拉伸，重构出真实的直立三维光波！
        </p>
      </div>

      {/* Main Interactive Anamorphic Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visualizer 3D viewport */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Top Presets bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'cube', label: '1. 悬浮魔方 (Floating Cube)' },
                { id: 'ladder', label: '2. 90°折纸通天梯 (Folded Ladder)' },
                { id: 'hole', label: '3. 纸面深渊黑洞 (Paper Hole)' },
              ].map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedPreset === preset.id
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Cut paper toggle */}
            <button
              onClick={() => setCutPaperTrick(!cutPaperTrick)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                cutPaperTrick
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>剪去纸张上沿 (破界秘籍)</span>
            </button>
          </div>

          {/* 3D Scene Viewport (CSS 3D perspective projection) */}
          <div className="h-[480px] bg-slate-950 flex items-center justify-center relative overflow-hidden p-6 select-none">
            {/* Ambient table surface */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />

            {/* 3D Table / Paper Container */}
            <div
              className="relative transition-all duration-200 ease-out"
              style={{
                perspective: '900px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Paper Sheet on desk */}
              <div
                className="w-80 sm:w-96 h-[340px] bg-slate-100 rounded-lg shadow-2xl relative transition-transform duration-300 ease-out overflow-hidden border border-slate-300"
                style={{
                  transform: `rotateX(${viewAngle}deg)`,
                  transformOrigin: 'center bottom',
                  boxShadow: `0 ${viewAngle * 0.8}px ${viewAngle * 1.5}px rgba(0, 0, 0, 0.6)`,
                }}
              >
                {/* Paper Texture Grid Lines */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] bg-[size:16px_16px]" />

                {/* Cutaway edge overlay */}
                {cutPaperTrick && selectedPreset === 'cube' && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-28 bg-slate-950/95 pointer-events-none transition-all duration-300 border-b border-dashed border-amber-400/50"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 70%, 75% 70%, 50% 10%, 25% 70%, 0 70%)'
                    }}
                  >
                    <span className="text-[10px] font-mono text-amber-400/70 absolute top-2 left-3">沿轮廓剪掉此区域</span>
                  </div>
                )}

                {/* Drawn Illusion Graphics */}
                <div className="w-full h-full relative flex items-center justify-center p-4">
                  {/* Preset 1: Floating Cube */}
                  {selectedPreset === 'cube' && (
                    <svg viewBox="0 0 300 300" className="w-full h-full">
                      {/* Detached Cast Shadow (drawn at lower paper) */}
                      <ellipse cx="150" cy="240" rx="65" ry="18" fill="#0f172a" opacity="0.8" />
                      <ellipse cx="150" cy="240" rx="45" ry="10" fill="#020617" opacity="0.95" />

                      {/* Vertically stretched anamorphic cube */}
                      {/* Top Face */}
                      <polygon
                        points="150,20 220,55 150,90 80,55"
                        fill="#ffffff"
                        stroke="#0f172a"
                        strokeWidth="2"
                      />
                      {/* Left Face (Elongated) */}
                      <polygon
                        points="80,55 150,90 150,185 80,140"
                        fill="#94a3b8"
                        stroke="#0f172a"
                        strokeWidth="2"
                      />
                      {/* Right Face (Elongated) */}
                      <polygon
                        points="150,90 220,55 220,140 150,185"
                        fill="#334155"
                        stroke="#0f172a"
                        strokeWidth="2"
                      />
                      {/* Height guide indicating suspension */}
                      <line x1="150" y1="185" x2="150" y2="235" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="150" cy="235" r="3" fill="#f59e0b" />
                    </svg>
                  )}

                  {/* Preset 2: Folded Paper Ladder */}
                  {selectedPreset === 'ladder' && (
                    <div className="w-full h-full relative">
                      {/* Crease line in the middle */}
                      <div className="absolute top-1/2 left-0 right-0 border-b-2 border-dashed border-red-500/70" />
                      <span className="absolute top-[48%] right-2 text-[10px] font-mono text-red-600 bg-red-100/90 px-1 rounded">
                        纸张 90° 折痕线
                      </span>

                      <svg viewBox="0 0 300 300" className="w-full h-full">
                        {/* Upper Wall section (vertical ladder) */}
                        <line x1="120" y1="30" x2="120" y2="150" stroke="#1e293b" strokeWidth="4" />
                        <line x1="180" y1="30" x2="180" y2="150" stroke="#1e293b" strokeWidth="4" />
                        {/* Upper steps */}
                        {[50, 75, 100, 125].map(y => (
                          <line key={y} x1="120" y1={y} x2="180" y2={y} stroke="#334155" strokeWidth="3" />
                        ))}

                        {/* Lower Table section (leaning ladder) */}
                        <line x1="120" y1="150" x2="95" y2="270" stroke="#1e293b" strokeWidth="4" />
                        <line x1="180" y1="150" x2="155" y2="270" stroke="#1e293b" strokeWidth="4" />
                        {/* Lower steps */}
                        {[175, 205, 235, 260].map(y => {
                          const t = (y - 150) / 120;
                          const x1 = 120 - 25 * t;
                          const x2 = 180 - 25 * t;
                          return <line key={y} x1={x1} y1={y} x2={x2} y2={y} stroke="#334155" strokeWidth="3" />;
                        })}

                        {/* Cast Shadow of the ladder on the lower paper */}
                        <line x1="120" y1="150" x2="185" y2="245" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                        <line x1="180" y1="150" x2="245" y2="245" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                        <line x1="140" y1="180" x2="200" y2="180" stroke="#94a3b8" strokeWidth="2.5" opacity="0.5" />
                        <line x1="160" y1="210" x2="220" y2="210" stroke="#94a3b8" strokeWidth="2.5" opacity="0.5" />
                      </svg>
                    </div>
                  )}

                  {/* Preset 3: Paper Hole Trap */}
                  {selectedPreset === 'hole' && (
                    <svg viewBox="0 0 300 300" className="w-full h-full">
                      {/* Deep black bottom hole */}
                      <ellipse cx="150" cy="180" rx="40" ry="18" fill="#020617" />

                      {/* Perspective Funnel Curves */}
                      {[
                        { rx: 110, ry: 45, cy: 110, op: 0.15 },
                        { rx: 90, ry: 38, cy: 130, op: 0.3 },
                        { rx: 70, ry: 30, cy: 150, op: 0.5 },
                        { rx: 50, ry: 22, cy: 168, op: 0.8 },
                      ].map((ring, idx) => (
                        <ellipse
                          key={idx}
                          cx="150"
                          cy={ring.cy}
                          rx={ring.rx}
                          ry={ring.ry}
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="2.5"
                          opacity={ring.op}
                        />
                      ))}

                      {/* Funnel vertical lines converging down */}
                      {[-80, -40, 0, 40, 80].map((offset, i) => (
                        <path
                          key={i}
                          d={`M ${150 + offset} 110 Q ${150 + offset * 0.5} 145 ${150 + offset * 0.25} 180`}
                          fill="none"
                          stroke="#334155"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Status Badge */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700/80 px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 shadow-xl">
              {viewAngle >= 48 && viewAngle <= 62 ? (
                <div className="text-emerald-400 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>已进入奇迹视角 ({viewAngle}°)！画面破纸腾空！</span>
                </div>
              ) : viewAngle < 20 ? (
                <div className="text-amber-400">
                  <span>当前为纸面平视 ({viewAngle}°)，呈拉伸畸变状态</span>
                </div>
              ) : (
                <div className="text-slate-300">
                  <span>正在过渡中 ({viewAngle}°)，请滑至 55° 观察奇迹</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Camera Angle Slider */}
          <div className="p-5 bg-slate-950/80 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white font-serif">手机拍摄倾斜角度 (Observation Angle)</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">0° 平铺</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">{viewAngle}°</span>
                <span className="text-slate-400">75° 俯拍</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="75"
              value={viewAngle}
              onChange={(e) => setViewAngle(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <button
                onClick={() => setViewAngle(0)}
                className="hover:text-amber-300 underline underline-offset-4"
              >
                点此看纸面真实拉伸图 (0°)
              </button>
              <button
                onClick={() => setViewAngle(55)}
                className="hover:text-emerald-300 text-amber-400 font-bold underline underline-offset-4"
              >
                一键对准黄金拍摄视点 (55°) ✨
              </button>
            </div>
          </div>
        </div>

        {/* Right Math & Secret Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {/* Secret 1: Anamorphic Stretch */}
          <div className="math-card space-y-3 border-emerald-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm font-serif flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                立体错觉画的三大作画秘笈
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-amber-300 font-semibold">秘笈一：拉长纵向比例（逆透视缩水补偿）</div>
                <div className="text-[11px] text-slate-400">
                  倾斜纸张看时，纸张上部的视觉高度会被压缩 <MathFormula math="\sin\alpha" /> 倍。因此作画时必须将纵深人为拉长 2~3 倍！
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-amber-300 font-semibold">秘笈二：画出脱离主体的悬浮阴影</div>
                <div className="text-[11px] text-slate-400">
                  人类大脑判断“物体离地多高”，完全依靠物体底部与地表阴影之间的缝隙。阴影画得越远、越孤立，悬浮感越强。
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-amber-300 font-semibold">秘笈三：打破纸张边界（剪纸法）</div>
                <div className="text-[11px] text-slate-400">
                  用剪刀剪掉纸张上部多余的白纸！当物体顶角凸出纸张边缘时，大脑原有的“纸张矩形边界参考系”被瞬间摧毁，立体感瞬间爆发。
                </div>
              </div>
            </div>
          </div>

          {/* Secret 2: Homography Matrix Math */}
          <div className="math-card space-y-3">
            <h4 className="font-bold text-white text-xs font-serif flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-blue-400" />
              单应性变换矩阵 (Homography)
            </h4>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                计算机视觉与数学中，任意两个平面之间的射影对应关系可以由一个 <MathFormula math="3 \times 3" /> 单应性矩阵完全表征：
              </p>
              <MathFormula math="\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} \sim \begin{bmatrix} h_{11} & h_{12} & h_{13} \\ h_{21} & h_{22} & h_{23} \\ h_{31} & h_{32} & 1 \end{bmatrix} \begin{bmatrix} X \\ Y \\ 1 \end{bmatrix}" block />
              <p className="text-[11px] text-slate-400">
                矩阵拥有 8 个自由度。画师只需要在纸上选定 4 个基准点（例如虚拟方块底面的 4 个角），即可唯一确定整幅画的逆透视拉伸比例。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
