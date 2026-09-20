import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Check, ArrowRight, ArrowLeft, RotateCcw, Sparkles, Lightbulb, PenTool, Eye, Eraser, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import MathFormula from './MathFormula';

// 4 Detailed Step-by-Step Lessons
const LESSONS = [
  {
    id: 'floating-cube',
    title: '实战 1: 1分钟掌握“悬浮正方体”',
    subtitle: '最适合新手的立体画奇迹，用分离投影击穿纸面',
    difficulty: '入门 ⭐',
    time: '5 分钟',
    mathHighlight: '投影视差与阴影脱离定理 (Parallax & Detached Shadow)',
    steps: [
      {
        stepNum: 1,
        title: '画出顶面平行四边形',
        instruction: '在画纸稍偏上的位置，用铅笔轻轻画一个略微扁平的平行四边形。上下两条横线严格水平，左右两条斜线保持平行。',
        secret: '这代表立方体的顶面受光面。之所以画成平行四边形，是因为我们是从斜上方俯视它，矩形在人眼中产生了角度透视变形。',
        actionTip: '握笔放平，轻描淡写，不要用重力下压。',
        guideType: 'cube_top'
      },
      {
        stepNum: 2,
        title: '垂直下拉三条等长竖棱',
        instruction: '从平行四边形的左、中、右三个角，各垂直向下画一条直线。三条竖线长度完全相等（例如各5厘米）。',
        secret: '在两点透视中，所有坚立在地面上的垂直棱线严格保持与重力方向平行，绝不能倾斜！',
        actionTip: '可以用铅笔笔杆作为直尺量一下，确保三条竖线一样长。',
        guideType: 'cube_verticals'
      },
      {
        stepNum: 3,
        title: '连接底部封闭立方体实体',
        instruction: '从左侧竖线底端连接到中间底端，再从中间底端连接到右侧底端。线条倾斜度与顶部的两条斜线严格平行。',
        secret: '几何对应性：底部的两条边与顶部的对应边互为空间平行线，在平视下呈现相同的倾斜角。',
        actionTip: '此时一个悬在半空的立方体骨架已经成型！',
        guideType: 'cube_bottom'
      },
      {
        stepNum: 4,
        title: '灵魂一笔：画出断开的悬空阴影',
        instruction: '【最关键一步】在立方体下方，空出 2~3 厘米的距离，画一个扁平的阴影！阴影外形同样近似平行四边形，但与立方体底部完全脱离。',
        secret: '人类大脑判断物体悬空高度的唯一视觉线索就是【物体与阴影的物理分离间隙】。间隙越大，方块悬浮得越高！若阴影紧贴底角，方块就会跌回地面。',
        actionTip: '用 4B/6B 铅笔将这个阴影涂黑，边缘稍微软化。',
        guideType: 'cube_shadow'
      },
      {
        stepNum: 5,
        title: '铺设明暗五大调',
        instruction: '假设光源来自左上方：顶面保留最亮（留白），左侧面涂浅灰色（2B打底），右侧面涂深深色（4B加重），下方阴影涂最黑。',
        secret: '依据朗伯余弦定律：顶面和左面迎光（夹角小，明度高），右面背光（夹角大于90°，直接光为0）。',
        actionTip: '用纸巾或手指将铅笔粉末轻轻抹匀，质感瞬间高级。',
        guideType: 'cube_shading'
      },
      {
        stepNum: 6,
        title: '破界操作：剪纸大功告成！',
        instruction: '拿出剪刀，将画纸上半部分沿着立方体的顶部轮廓剪掉（留空纸面）。将纸平放在桌上，斜45度拿起手机拍张照！',
        secret: '破坏平面的物理边框后，大脑失去矩形画纸作为“二维参照物”，悬浮错觉瞬间达到顶峰！',
        actionTip: '斜着拍照时一只手拿铅笔指着立方体，立体感更震撼！',
        guideType: 'cube_cut'
      }
    ]
  },
  {
    id: 'paper-hole',
    title: '实战 2: 纸面深渊黑洞陷阱',
    subtitle: '利用同心椭圆收缩与弯曲经纬线，制造深不见底的恐惧深度',
    difficulty: '进阶 ⭐⭐',
    time: '8 分钟',
    mathHighlight: '空间曲率与透视收缩级数 (Curvature & Perspective Compression)',
    steps: [
      {
        stepNum: 1,
        title: '画出洞口的水平大椭圆',
        instruction: '在画纸正中央用铅笔勾勒一个扁平的水平大椭圆作为深渊的开口边缘。',
        secret: '正圆在倾斜视角下投影即为椭圆方程 (x^2/a^2 + y^2/b^2 = 1)。',
        actionTip: '线条要流畅圆润，不要画成两头尖的梭形。',
        guideType: 'hole_step1'
      },
      {
        stepNum: 2,
        title: '向内绘制多层等距加速椭圆',
        instruction: '在大椭圆内部，依次向内画出 3~4 个越来越小的同心椭圆。越靠近内部，椭圆间的间距越来越密。',
        secret: '非线性透视收缩：等距的深度在视觉上按几何级数 1/Z 压缩，越深看起来越紧凑。',
        actionTip: '最深处的椭圆尽量画小。',
        guideType: 'hole_step2'
      },
      {
        stepNum: 3,
        title: '绘制弯曲的经向辐射下陷线',
        instruction: '从最外层椭圆向内层画出多条弧形射线，注意这些线不是笔直的，而是带有朝向中心内凹的弧度！',
        secret: '空间曲率引导（Curvature Flow）：大脑直觉认为弯曲的线条代表受重力牵拉下陷的漏斗曲面。',
        actionTip: '像画蜘蛛网的径向骨架一样均匀分布。',
        guideType: 'hole_step3'
      },
      {
        stepNum: 4,
        title: '棋盘格黑白交错填色',
        instruction: '将划分出的网格像国际象棋棋盘一样，一格填黑、一格留白。最中央的极深处全部涂成纯黑！',
        secret: '极度对比：纯黑代表光线无法逸出的深渊，棋盘格的变形进一步强化了视错觉扭曲。',
        actionTip: '中央深处可以用黑色彩笔或最软的 8B 铅笔涂满。',
        guideType: 'hole_step4'
      }
    ]
  },
  {
    id: 'folded-ladder',
    title: '实战 3: 90°折纸通天阶梯',
    subtitle: '在折叠卡纸两侧精确偏转，让梯子立在折痕之上',
    difficulty: '高阶 ⭐⭐⭐',
    time: '10 分钟',
    mathHighlight: '正交双平面相交投影 (Orthogonal Bi-Planar Projection)',
    steps: [
      {
        stepNum: 1,
        title: '画纸对折，标出折痕中轴线',
        instruction: '将卡纸对折成 90 度的“L”形，用铅笔在折痕处轻轻划一道参考线。',
        secret: '空间分解：整幅画由两个互相垂直的正交平面（竖直面与水平面）构成。',
        actionTip: '暂时先把纸张铺平作画，最后再折起来。',
        guideType: 'ladder_step1'
      },
      {
        stepNum: 2,
        title: '上半部分画出垂直梯身',
        instruction: '在折痕线的上方，笔直画出两条垂直的平行梯轨，并填上横档。',
        secret: '上半部分贴在垂直墙面上，因而其在正面观察时保持绝对竖直。',
        actionTip: '横档间距要均匀。',
        guideType: 'ladder_step2'
      },
      {
        stepNum: 3,
        title: '下半部分按倾斜角度向外偏折',
        instruction: '从折痕处的两个端点出发，在下半部分将梯腿向外侧倾斜偏转约 15~20 度画出梯脚！',
        secret: '折痕偏角法则：当纸张弯折 90 度后，视线掠射角发生突变，平面梯子立在桌上时这两段会瞬间无缝拼接成笔直的斜梯！',
        actionTip: '斜度不要太大，稍微张开即可。',
        guideType: 'ladder_step3'
      },
      {
        stepNum: 4,
        title: '绘制梯子在水平纸面上的投影',
        instruction: '从折痕处的梯腿向右侧画出一道平行的浅灰色阴影，并在下半纸面上画出横档的投影。',
        secret: '阴影是三维悬空的铁证：阴影落在下半张纸上，强行欺骗大脑认定梯子是一根悬空靠在墙上的真实立体物。',
        actionTip: '最后将纸张立在书桌上折成90度，闭上一只眼斜视！',
        guideType: 'ladder_step4'
      }
    ]
  },
  {
    id: 'shading-sphere',
    title: '实战 4: 从圆圈到超写实石膏球',
    subtitle: '掌握明暗交界线弧度、反光呼吸感与接触阴影',
    difficulty: '进阶 ⭐⭐',
    time: '12 分钟',
    mathHighlight: '朗伯球面漫反射微积分 (Spherical Diffuse Calculus)',
    steps: [
      {
        stepNum: 1,
        title: '正方形切角画出正圆',
        instruction: '先轻画一个正方形，取四边中点，再切去四个角，反复修饰得到一个干净的正圆形轮廓。',
        secret: '几何辅助框架能防止初学者画出歪斜的“土豆圆”。',
        actionTip: '用可塑橡皮将辅助线轻轻擦至若隐若现。',
        guideType: 'sphere_step1'
      },
      {
        stepNum: 2,
        title: '锁定光源与弧形明暗交界线',
        instruction: '假设光源来自左上角 45 度。在右下侧画出一道弯曲的月牙形明暗交界线（注意：交界线必须沿着球体弧度弯曲）。',
        secret: '光线与球面的切点集合在空间中是一个大圆截面，投影到二维平面就是一道平滑的弧线。',
        actionTip: '这是球体最关键的一条分界线，决定了球体是否圆润。',
        guideType: 'sphere_step2'
      },
      {
        stepNum: 3,
        title: '铺设暗面与底部的反光呼吸区',
        instruction: '用 2B/4B 铅笔将交界线向右下侧排线加深。切记：不要涂到球体最边缘！在右下角边缘保留一层淡淡的灰色反光！',
        secret: '地面漫反射：光线打在桌面上会反弹至球体底部暗部。如果把暗面边缘涂得漆黑死板，球体立刻失去空气透明感。',
        actionTip: '交界线最黑，向内到反光区逐渐变淡。',
        guideType: 'sphere_step3'
      },
      {
        stepNum: 4,
        title: '地面椭圆投影与接触闭塞AO',
        instruction: '在右下侧地面画出一个被压扁的椭圆投影。在球体正下方与地面接触的一毫米缝隙里，用力涂成极黑（闭塞阴影AO）！',
        secret: '光线衰减与微小缝隙闭塞：球体落地的接触点几乎无法接收任何光子，这是整个画面的锚固点。',
        actionTip: '最后用高光橡皮在左上方受光面轻轻点出白色高光点！',
        guideType: 'sphere_step4'
      }
    ]
  }
];

export default function StepByStepStudio() {
  const [activeLessonId, setActiveLessonId] = useState('floating-cube');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showGhostGuide, setShowGhostGuide] = useState(true);

  // Drawing canvas for user practice
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [tool, setTool] = useState('pencil'); // 'pencil', 'blend', 'eraser'
  const [pencilGrade, setPencilGrade] = useState('4B'); // '2B', '4B', '6B'

  const currentLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];
  const currentStep = currentLesson.steps[currentStepIdx] || currentLesson.steps[0];
  const isLastStep = currentStepIdx === currentLesson.steps.length - 1;

  // Clear or reset canvas when step changes
  const clearUserCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Trigger celebration confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleNextStep = () => {
    if (isLastStep) {
      triggerCelebration();
    } else {
      setCurrentStepIdx(idx => idx + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(idx => idx - 1);
    }
  };

  // Switch lesson
  const selectLesson = (id) => {
    setActiveLessonId(id);
    setCurrentStepIdx(0);
    clearUserCanvas();
  };

  // Drawing logic
  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setLastPoint({ x, y });
  };

  const draw = (e) => {
    if (!isDrawing || !lastPoint) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else if (tool === 'blend') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      // Pencil grades: 2B (lighter), 4B (mid), 6B (dark)
      const alpha = pencilGrade === '2B' ? 0.45 : pencilGrade === '4B' ? 0.75 : 0.95;
      const width = pencilGrade === '2B' ? 2 : pencilGrade === '4B' ? 3 : 4.5;
      ctx.strokeStyle = `rgba(15, 23, 42, ${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    setLastPoint({ x, y });
  };

  const stopDraw = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          模块四 · 零基础初学者分步实战工坊
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
          手把手通关：从第一笔到震撼立体画
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          不用担心没有美术底子！我们把每个经典的立体技法拆解为 4~6 个极其简单的机械式动作。
          右侧画板带有半透明辅助参考线，拿起笔跟随引导，每一笔都解释其背后的数学秘密。
        </p>
      </div>

      {/* Lesson Selector Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LESSONS.map(l => {
          const isActive = l.id === activeLessonId;
          return (
            <button
              key={l.id}
              onClick={() => selectLesson(l.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">
                  {l.difficulty}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{l.time}</span>
              </div>
              <div className={`text-xs font-bold font-serif line-clamp-1 ${isActive ? 'text-amber-300' : 'text-slate-200'}`}>
                {l.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Instruction & Step Stepper */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step Progress Tracker */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-semibold">步骤进度</span>
                <h3 className="text-lg font-bold text-white font-serif mt-0.5">
                  步骤 {currentStep.stepNum} / {currentLesson.steps.length}: {currentStep.title}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {currentLesson.steps.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                      idx === currentStepIdx
                        ? 'bg-amber-500 text-slate-950 scale-110 shadow-md'
                        : idx < currentStepIdx
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx < currentStepIdx ? '✓' : idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Instruction Body */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                  <PenTool className="w-3.5 h-3.5" />
                  作画动作引导
                </div>
                <p className="text-slate-200">{currentStep.instruction}</p>
                <div className="text-[11px] text-amber-300/80 font-mono pt-1">
                  💡 握笔建议：{currentStep.actionTip}
                </div>
              </div>

              {/* Secret Card */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  背后的几何小心机
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentStep.secret}</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIdx === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentStepIdx === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>上一步</span>
              </button>

              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
              >
                <span>{isLastStep ? '完成作品 🎉' : '下一步'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Math Highlight Tag */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400">本课核心数学模型：</span>
            <div className="text-amber-300 font-bold font-mono text-xs">{currentLesson.mathHighlight}</div>
          </div>
        </div>

        {/* Right Guided Practice Canvas */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Canvas Toolbar */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Tools */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTool('pencil')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  tool === 'pencil' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>铅笔</span>
              </button>

              <button
                onClick={() => setTool('blend')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  tool === 'blend' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>纸擦笔 (晕染)</span>
              </button>

              <button
                onClick={() => setTool('eraser')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  tool === 'eraser' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>橡皮</span>
              </button>
            </div>

            {/* Pencil Grade Select */}
            {tool === 'pencil' && (
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                {['2B', '4B', '6B'].map(g => (
                  <button
                    key={g}
                    onClick={() => setPencilGrade(g)}
                    className={`px-2 py-0.5 rounded-md ${
                      pencilGrade === g ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            {/* Ghost Guide Toggle & Clear */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGhostGuide(!showGhostGuide)}
                className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                  showGhostGuide
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>步骤指引线</span>
              </button>

              <button
                onClick={clearUserCanvas}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700"
                title="清空画板"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重画</span>
              </button>
            </div>
          </div>

          {/* Interactive Layered Canvas */}
          <div className="relative bg-[#f8fafc] w-full h-[460px] select-none flex items-center justify-center overflow-hidden">
            {/* Sketch paper texture lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* SVG Ghost Guide Layer (Rendered underneath for the user to trace) */}
            {showGhostGuide && (
              <svg viewBox="0 0 500 460" className="absolute inset-0 w-full h-full pointer-events-none">
                {activeLessonId === 'floating-cube' && (
                  <g>
                    {/* Step 1: Top parallelogram */}
                    {currentStepIdx >= 0 && (
                      <polygon
                        points="250,70 340,110 250,150 160,110"
                        fill="none"
                        stroke={currentStepIdx === 0 ? '#f59e0b' : '#94a3b8'}
                        strokeWidth={currentStepIdx === 0 ? 3 : 1.5}
                        strokeDasharray={currentStepIdx === 0 ? '4 4' : 'none'}
                      />
                    )}

                    {/* Step 2: Vertical edges */}
                    {currentStepIdx >= 1 && (
                      <g stroke={currentStepIdx === 1 ? '#f59e0b' : '#94a3b8'} strokeWidth={currentStepIdx === 1 ? 3 : 1.5} strokeDasharray={currentStepIdx === 1 ? '4 4' : 'none'}>
                        <line x1="160" y1="110" x2="160" y2="230" />
                        <line x1="250" y1="150" x2="250" y2="270" />
                        <line x1="340" y1="110" x2="340" y2="230" />
                      </g>
                    )}

                    {/* Step 3: Bottom edges */}
                    {currentStepIdx >= 2 && (
                      <g stroke={currentStepIdx === 2 ? '#f59e0b' : '#94a3b8'} strokeWidth={currentStepIdx === 2 ? 3 : 1.5} strokeDasharray={currentStepIdx === 2 ? '4 4' : 'none'}>
                        <line x1="160" y1="230" x2="250" y2="270" />
                        <line x1="250" y1="270" x2="340" y2="230" />
                      </g>
                    )}

                    {/* Step 4: Detached cast shadow */}
                    {currentStepIdx >= 3 && (
                      <g>
                        <ellipse
                          cx="250"
                          cy="360"
                          rx="90"
                          ry="25"
                          fill="rgba(15, 23, 42, 0.4)"
                          stroke={currentStepIdx === 3 ? '#f59e0b' : 'none'}
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        {currentStepIdx === 3 && (
                          <g>
                            <line x1="250" y1="270" x2="250" y2="340" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                            <text x="260" y="310" fill="#d97706" fontSize="12" fontWeight="bold">脱离间隙 2~3cm</text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* Step 5: Shading */}
                    {currentStepIdx >= 4 && (
                      <g opacity="0.35">
                        <polygon points="160,110 250,150 250,270 160,230" fill="#94a3b8" />
                        <polygon points="250,150 340,110 340,230 250,270" fill="#334155" />
                      </g>
                    )}

                    {/* Step 6: Cut indicator */}
                    {currentStepIdx === 5 && (
                      <path
                        d="M 50 150 L 160 110 L 250 70 L 340 110 L 450 150"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        fill="none"
                      />
                    )}
                  </g>
                )}

                {activeLessonId === 'paper-hole' && (
                  <g>
                    {/* Ellipses */}
                    <ellipse cx="250" cy="200" rx="140" ry="50" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                    {currentStepIdx >= 1 && (
                      <>
                        <ellipse cx="250" cy="230" rx="100" ry="35" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                        <ellipse cx="250" cy="255" rx="60" ry="20" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                        <ellipse cx="250" cy="275" rx="30" ry="10" fill="#020617" />
                      </>
                    )}
                  </g>
                )}

                {activeLessonId === 'shading-sphere' && (
                  <g>
                    <circle cx="250" cy="210" r="110" fill="none" stroke={currentStepIdx === 0 ? '#f59e0b' : '#94a3b8'} strokeWidth="2" strokeDasharray="4 4" />
                    {currentStepIdx >= 1 && (
                      <path d="M 210 105 Q 310 210 250 320" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" />
                    )}
                    {currentStepIdx >= 3 && (
                      <ellipse cx="320" cy="315" rx="110" ry="25" fill="rgba(15, 23, 42, 0.4)" />
                    )}
                  </g>
                )}
              </svg>
            )}

            {/* Active User Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={500}
              height={460}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10"
            />
          </div>

          <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>支持鼠标或数位板绘制 · 随意涂抹无压力</span>
            <span className="font-mono text-amber-400/90">当前笔触：{tool === 'pencil' ? `铅笔 (${pencilGrade})` : tool === 'blend' ? '纸擦笔' : '橡皮'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
