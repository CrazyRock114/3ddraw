import React, { useState } from 'react';
import { Compass, SunMedium, Eye, BookOpen, Palette, ArrowRight, CheckCircle2, Layers, Sparkles } from 'lucide-react';
import MathFormula from './MathFormula';

export default function HomeView({ setActiveTab }) {
  const [cubeStage, setCubeStage] = useState('shaded'); // flat, perspective, shaded, floating

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-8 lg:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              零基础初学者 · 极简几何到大师立体画
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-serif leading-tight">
              一张平面的白纸，<br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                如何欺骗大脑看见三维立体？
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              立体绘画绝不是深奥的魔法。只要掌握了<strong className="text-amber-300">射影透视的灭点</strong>、
              <strong className="text-amber-300">朗伯光影的余弦梯度</strong>以及<strong className="text-amber-300">单应性逆透视错觉</strong>，
              任何人只需一支普通铅笔，就能在 10 分钟内画出令人惊叹的“破纸而出”立体杰作。
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('tutorials')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>立即上手：4个零基础实战</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('perspective')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>探索透视互动实验室</span>
              </button>
            </div>
          </div>

          {/* Interactive Micro-Experiment Widget */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  纸面立体感进化过程
                </span>
                <span className="text-[11px] font-mono text-amber-400/80">点击下方阶段感受差异</span>
              </div>

              {/* Dynamic SVG / Canvas Visualization */}
              <div className="h-56 bg-slate-900/90 rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-800/60 p-4">
                {/* Paper background grid */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

                <svg viewBox="0 0 280 200" className="w-full h-full max-w-[260px] drop-shadow-xl overflow-visible">
                  {cubeStage === 'flat' && (
                    <g className="transition-all duration-300">
                      <rect x="90" y="50" width="100" height="100" fill="#334155" stroke="#94a3b8" strokeWidth="3" rx="2" />
                      <text x="140" y="105" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">纯二维平面 (无深度)</text>
                    </g>
                  )}

                  {cubeStage === 'perspective' && (
                    <g className="transition-all duration-300">
                      {/* Top Face */}
                      <polygon points="140,25 210,50 140,75 70,50" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
                      {/* Left Face */}
                      <polygon points="70,50 140,75 140,155 70,130" fill="#334155" stroke="#cbd5e1" strokeWidth="2" />
                      {/* Right Face */}
                      <polygon points="140,75 210,50 210,130 140,155" fill="#334155" stroke="#cbd5e1" strokeWidth="2" />
                      <text x="140" y="185" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="sans-serif">引入灭点透视：出现几何纵深</text>
                    </g>
                  )}

                  {cubeStage === 'shaded' && (
                    <g className="transition-all duration-300">
                      {/* Ground Contact Shadow */}
                      <ellipse cx="140" cy="165" rx="75" ry="12" fill="#020617" opacity="0.6" />
                      {/* Top Face (Brightest) */}
                      <polygon points="140,25 210,50 140,75 70,50" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                      {/* Left Face (Midtone) */}
                      <polygon points="70,50 140,75 140,155 70,130" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
                      {/* Right Face (Shadow) */}
                      <polygon points="140,75 210,50 210,130 140,155" fill="#334155" stroke="#475569" strokeWidth="1" />
                      {/* Specular Highlight */}
                      <circle cx="140" cy="45" r="5" fill="#ffffff" opacity="0.8" />
                      <text x="140" y="190" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="sans-serif">朗伯光影五大调：具有实体雕塑质感</text>
                    </g>
                  )}

                  {cubeStage === 'floating' && (
                    <g className="transition-all duration-300">
                      {/* Floating Cast Shadow - Separated from the cube! */}
                      <polygon points="60,165 170,150 220,175 110,190" fill="#020617" opacity="0.75" />
                      {/* Soft shadow blur */}
                      <ellipse cx="140" cy="172" rx="70" ry="14" fill="#090d16" opacity="0.5" />

                      {/* Elevated Cube */}
                      {/* Top Face */}
                      <polygon points="140,10 210,35 140,60 70,35" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                      {/* Left Face */}
                      <polygon points="70,35 140,60 140,130 70,105" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
                      {/* Right Face */}
                      <polygon points="140,60 210,35 210,105 140,130" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                      {/* Suspension gap indicator */}
                      <line x1="140" y1="130" x2="140" y2="160" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
                      <text x="140" y="196" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold">断开投影：瞬间产生悬空立体错觉！</text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Stage Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                {[
                  { id: 'flat', label: '1. 扁平线框', desc: '纯2D' },
                  { id: 'perspective', label: '2. 透视框架', desc: '形体纵深' },
                  { id: 'shaded', label: '3. 朗伯光影', desc: '实体厚度' },
                  { id: 'floating', label: '4. 悬浮投影', desc: '破纸而出' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCubeStage(s.id)}
                    className={`px-2 py-2 rounded-lg text-left transition-all ${
                      cubeStage === s.id
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="text-xs font-semibold">{s.label}</div>
                    <div className="text-[10px] opacity-70 font-mono">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Pillars of 3D Art */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            立体绘画的三大基石与数学原理
          </h2>
          <p className="text-slate-400 text-sm">
            画出逼真立体的秘诀并非苦练上千小时，而是洞悉光与空间几何在纸面上的投影规律。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="math-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">1. 射影透视学</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                研究“近大远小”与平行线相交的科学。通过灭点与视平线，构建出从二维画布穿透到无限深空的虚拟空间。
              </p>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1 font-mono">针孔相机几何公式：</div>
                <MathFormula math="x' = f \cdot \frac{X}{Z}, \quad y' = f \cdot \frac{Y}{Z}" block />
                <div className="text-[11px] text-slate-400 mt-1">
                  投影尺寸与物体距离 <MathFormula math="Z" /> 严格成反比，此即透视缩减的数学源头。
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('perspective')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 pt-2"
            >
              进入透视实验室 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="math-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <SunMedium className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">2. 朗伯光影与五大调</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                仅有线稿只是空架子，光影赋予物体实体重量感。明暗交界线由物体表面法向量与光线的点积唯一确定。
              </p>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1 font-mono">朗伯漫反射余弦定律：</div>
                <MathFormula math="I = I_0 \cdot k_d \cdot (\vec{N} \cdot \vec{L}) = I_0 \cdot k_d \cos\theta" block />
                <div className="text-[11px] text-slate-400 mt-1">
                  当夹角 <MathFormula math="\theta = 90^\circ" /> 时点积为0，精确定义了物体的“明暗交界线”。
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('shading')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 pt-2"
            >
              进入光影实验室 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="math-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">3. 单应性视错觉</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                网络上爆火的“3D立体天梯”、“黑洞纸画”，本质是故意拉伸画面，在特定手机拍照角度下完美抵消投影畸变。
              </p>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1 font-mono">逆透视单应性变换：</div>
                <MathFormula math="\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} \sim \mathbf{H} \begin{bmatrix} X \\ Y \\ 1 \end{bmatrix}" block />
                <div className="text-[11px] text-slate-400 mt-1">
                  通过 <MathFormula math="3 \times 3" /> 单应矩阵将直立 3D 虚拟空间逆向压缩拉伸到画纸平面上。
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('anamorphic')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-2"
            >
              进入视错觉实验室 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Beginner 4-Step Practical Curriculum */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 lg:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-white">零基础 4 门经典实战课</h2>
            <p className="text-slate-400 text-sm mt-1">包含逐步手把手绘制引导、半透明参考线、物理技巧与几何内幕</p>
          </div>
          <button
            onClick={() => setActiveTab('tutorials')}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold transition-all inline-flex items-center gap-2 self-start sm:self-center"
          >
            <span>全部开始学习</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              id: 'floating-cube',
              title: '实战 1: 悬浮正方体',
              difficulty: '初学入门 · 5分钟',
              desc: '掌握平行四边形顶面、垂直竖棱与脱离地面的分离投影技巧，瞬间让方块悬空。',
              tag: '悬浮之魂'
            },
            {
              id: 'paper-hole',
              title: '实战 2: 纸面深渊黑洞',
              difficulty: '进阶构图 · 8分钟',
              desc: '利用同心椭圆透视缩放与弯曲棋盘格经纬线，平地造出深不见底的陷阱。',
              tag: '曲率错觉'
            },
            {
              id: 'folded-ladder',
              title: '实战 3: 90°折纸通天梯',
              difficulty: '空间折叠 · 10分钟',
              desc: '在对折卡纸两侧精确偏转梯子角度，立在桌上时梯子仿佛穿透纸面直通云霄。',
              tag: '折痕定理'
            },
            {
              id: 'shading-sphere',
              title: '实战 4: 极度写实石膏球',
              difficulty: '质感大师 · 12分钟',
              desc: '彻底理解五大调：明暗交界线弧度、反光呼吸感与贴地闭塞AO阴影。',
              tag: '朗伯五调'
            },
          ].map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveTab('tutorials')}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400/90 font-semibold">0{idx + 1}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-serif">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-900 pt-3">
                <span>{item.difficulty}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3D Desk Feature Highlight */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              独家功能 · 3D书桌真实检验台
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              画完之后，在真实三维书桌上旋转检验！
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              你可以在网页的交互画板上自由绘制或涂鸦，也可以随时点击“3D检验”：
              系统会立刻将你的作品作为画纸放置在 3D 虚拟书桌上（配有真实台灯、铅笔与咖啡杯）。
              用鼠标任意旋转倾斜视点，亲眼见证你绘制的立体错觉在真实光线与拍摄角度下的神奇变化！
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('studio')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Palette className="w-4 h-4" />
                <span>进入自由画板与3D检验</span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-amber-500/20 to-blue-500/10 border border-amber-500/40 p-1 flex items-center justify-center shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                <Box className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
                <span className="text-xs font-bold text-white">Three.js 驱动</span>
                <span className="text-[10px] text-slate-400 mt-1">光影渲染 · 任意轨道环绕</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
