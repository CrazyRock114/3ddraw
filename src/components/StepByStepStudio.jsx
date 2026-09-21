import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Check, ArrowRight, ArrowLeft, RotateCcw, Sparkles, Lightbulb,
  PenTool, Eye, Eraser, Scissors, AlertTriangle, CheckCircle2, Sliders, Maximize2
} from 'lucide-react';
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
        instruction: '在画纸稍偏上的位置，用铅笔轻轻画一个扁平的平行四边形。上下两条横线严格水平，左右两条斜线保持平行。',
        secret: '这代表立方体的顶面受光面。之所以画成平行四边形，是因为我们是从斜上方俯视它，矩形在人眼中产生了透视变形。',
        actionTip: '握笔放平，轻描淡写，不要用重力下压。',
        mistakeTip: '画成了正四边形或菱形角过直，导致看起来像贴在墙上的瓷砖，失去俯视透视感。',
        correctTip: '上下边保持纯水平，左右边倾斜约 25°~30°，扁平度越高，俯视感越真实。',
        guideType: 'cube_top'
      },
      {
        stepNum: 2,
        title: '垂直下拉三条等长竖棱',
        instruction: '从平行四边形的左、中、右三个角，各垂直向下画一条直线。三条竖线长度完全相等（例如各 5 厘米）。',
        secret: '在两点透视中，所有坚立在地面上的垂直棱线严格保持与重力方向平行，绝不能倾斜！',
        actionTip: '可以用直尺或铅笔笔杆比划，确保三条竖线严格垂直且一样长。',
        mistakeTip: '竖线画歪或长短不一，方块瞬间变成扭曲倒塌的纸盒。',
        correctTip: '垂直棱必须与画纸左右两边缘严格平行（90° 垂直纸底）。',
        guideType: 'cube_verticals'
      },
      {
        stepNum: 3,
        title: '连接底部封闭立方体实体',
        instruction: '从左侧竖线底端连接到中间底端，再从中间底端连接到右侧底端。线条倾斜度与顶部的两条斜线严格平行。',
        secret: '几何对应性：底部的两条边与顶部的对应边互为空间平行线，在平视下呈现相同的倾斜角。',
        actionTip: '此时一个悬在半空的立方体骨架已经成型！',
        mistakeTip: '底边的倾斜角与顶边不一致，导致方块上下不对称。',
        correctTip: '底边就是顶边向正下方平移得到的复制线条。',
        guideType: 'cube_bottom'
      },
      {
        stepNum: 4,
        title: '灵魂一笔：画出断开的悬空阴影',
        instruction: '【最关键核心】在立方体下方，故意空出 2~3 厘米空白，画一个扁平的阴影！阴影与立方体底部完全脱离。',
        secret: '人类大脑判断物体悬空高度的唯一视觉线索就是【物体与阴影的物理分离间隙】。间隙越大，方块悬浮得越高！若阴影紧贴底角，方块就会跌回地面。',
        actionTip: '用 4B/6B 铅笔将这个阴影涂黑，边缘稍微软化。',
        mistakeTip: '习惯性地把阴影画在方块底边接触处，立体方块瞬间“跌落粘死”在纸面上！',
        correctTip: '务必留白 2~3cm 空隙！这片空白就是人眼感知到的“悬空高度”。',
        guideType: 'cube_shadow'
      },
      {
        stepNum: 5,
        title: '铺设朗伯五大调',
        instruction: '假设光源来自左上方：顶面保留最亮（留白），左侧面涂浅灰色（2B打底），右侧面涂深色（4B加重），下方阴影涂最黑。',
        secret: '依据朗伯余弦定律：顶面和左面迎光（夹角小，明度高），右面背光（夹角大于90°，直接光为0）。',
        actionTip: '用纸巾或手指将铅笔粉末轻轻抹匀，消除生硬的排线痕迹。',
        mistakeTip: '三个面涂成了一样深浅的灰色，丢失了立体体块感。',
        correctTip: '牢记明度对比：顶面白(100%) > 左面浅灰(70%) > 右面深灰(30%) > 投影死黑(5%)。',
        guideType: 'cube_shading'
      },
      {
        stepNum: 6,
        title: '破界操作：剪纸大功告成！',
        instruction: '拿出剪刀，将画纸上半部分沿着立方体的顶部轮廓剪掉（留空纸面）。平放桌面斜 45 度拿起手机拍照！',
        secret: '破坏平面的物理边框后，大脑失去矩形画纸作为“二维参照物”，悬浮错觉瞬间达到顶峰！',
        actionTip: '斜着拍照时用一只手拿铅笔指着立方体，立体感更震撼！',
        mistakeTip: '没有剪纸或者直接俯视垂直观察，二维纸框会提醒大脑“这是一张平面图”。',
        correctTip: '沿红虚线剪掉上半页，从斜45°低角度观察，方块犹如真物悬在书桌上空！',
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
        instruction: '在画纸偏上方用铅笔勾勒一个扁平的水平大椭圆作为深渊的开口边缘。',
        secret: '正圆在倾斜视角下投影即为椭圆方程 (x^2/a^2 + y^2/b^2 = 1)。',
        actionTip: '线条要圆润对称，横向长，纵向扁。',
        mistakeTip: '画成了尖头橄榄形或直角圆角矩形。',
        correctTip: '长轴为短轴的 2.5 倍左右，两端转折弧度平滑圆润。',
        guideType: 'hole_step1'
      },
      {
        stepNum: 2,
        title: '向内绘制多层等距加速椭圆',
        instruction: '在大椭圆内部，依次向内画出 3~4 个越来越小的同心椭圆。越靠近内部，椭圆间的间距越来越密。',
        secret: '非线性透视收缩：等距的深度在视觉上按几何级数 1/Z 压缩，越深看起来越紧凑。',
        actionTip: '最深处的椭圆尽量画得非常小，位置稍稍往下移。',
        mistakeTip: '每一层椭圆间距均等，看起来像平面的靶心，缺乏向下陷入的下坠感。',
        correctTip: '间距逐级减半递减，营造向地心极速坠落的视界收缩。',
        guideType: 'hole_step2'
      },
      {
        stepNum: 3,
        title: '绘制弯曲的向心下陷经线',
        instruction: '从最外层椭圆向内层画出多条弧形射线，注意这些线不是笔直的，而是带有朝向中心内凹的弧度！',
        secret: '空间曲率引导（Curvature Flow）：大脑直觉认为弯曲的线条代表受重力牵拉下陷的漏斗曲面。',
        actionTip: '像画漏斗内壁或蛛网经线一样，线条向中心凹陷汇聚。',
        mistakeTip: '画成完全笔直的放射线，显得表面是平坦的圆盘。',
        correctTip: '用弧线！弧线的弯曲度是大脑感受深度凹陷的核心视觉线索。',
        guideType: 'hole_step3'
      },
      {
        stepNum: 4,
        title: '棋盘格黑白填色与深渊奇点',
        instruction: '将划分出的网格像国际象棋棋盘一样，一格填黑、一格留白。最中央的极深处全部涂成死黑！',
        secret: '极度对比：纯黑代表光线无法逸出的深渊，棋盘格的变形进一步强化了视错觉扭曲。',
        actionTip: '中央深处用 6B/8B 铅笔涂满压实，越往内黑白对比越强烈。',
        mistakeTip: '填色太浅、中心留白，失去吞噬一切的黑洞深渊感。',
        correctTip: '中心画一个极黑的实心椭圆，黑白交替块强化曲面扭曲。',
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
        title: '标出折痕中轴线与正交基准',
        instruction: '将画纸横向对折，在正中间折痕处用铅笔画一道参考虚线。上方代表立直的墙面，下方代表水平桌面。',
        secret: '空间分解：整幅画由两个互相垂直的正交平面（竖直面与水平面）构成。',
        actionTip: '作画时纸张铺平，但心中要明白上下两半处于不同空间维度。',
        mistakeTip: '折痕画歪或者上下比例失衡，折叠后梯子上下端点无法对应。',
        correctTip: '严格在纸张中央 1/2 处画水平虚线。',
        guideType: 'ladder_step1'
      },
      {
        stepNum: 2,
        title: '上半部分画出垂直梯身与横档',
        instruction: '在折痕线的上方，垂直画出两条平行的梯轨（宽约 8~9 厘米），并在中间画上等间距的横档。',
        secret: '上半部分贴在垂直墙面上，因而其在正面观察时保持绝对竖直。',
        actionTip: '横档保持纯水平，间距均匀，梯轨垂直折痕。',
        mistakeTip: '上半部分画成了倾斜梯子，折叠后梯子会歪斜贴墙。',
        correctTip: '两条梯轨垂直于折痕中线（90° 垂直向上）。',
        guideType: 'ladder_step2'
      },
      {
        stepNum: 3,
        title: '下半部分按倾斜角度向外偏折',
        instruction: '从折痕处的两个端点出发，在下半部分将梯腿向外侧倾斜偏转约 15~20 度画出梯脚并画上横档！',
        secret: '【折痕偏角法则】：当纸张弯折 90 度立在桌上时，人眼以斜视掠射角观察，下半段向外张开的透视变形恰好补偿变直，在人脑中拼为一根笔直通天的直梯！',
        actionTip: '向外张开的角度大约左右各偏 15 度，横档间距适当拉大。',
        mistakeTip: '下半段也画成笔直向下的垂直线，折纸后梯子在折痕处彻底“折断脱节”。',
        correctTip: '必须向外撇！左腿往左下撇，右腿往右下撇，形成喇叭形张开。',
        guideType: 'ladder_step3'
      },
      {
        stepNum: 4,
        title: '绘制梯子在水平纸面上的右侧投影',
        instruction: '从折痕处开始，在下半纸面上向右侧画出斜向的梯身与横档虚影，并涂成浅灰色。',
        secret: '阴影是三维悬空的铁证：阴影落在下半张纸上，强行欺骗大脑认定梯子是一根悬空靠在墙上的真实立体物。',
        actionTip: '用纸擦笔或 2B 铅笔画出柔和的影子。折纸 90° 闭上一只眼斜视！',
        mistakeTip: '忘记画阴影，或者阴影画到了竖直面上，削弱了三维悬浮感。',
        correctTip: '影子严格落在下半部分的桌面上，朝向右侧延伸。',
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
        instruction: '先轻轻画一个正方形辅助框，标出四边中点，再切去四个角，反复修饰得到一个干净饱满的正圆形轮廓。',
        secret: '几何辅助框架能防止初学者画出歪斜的“土豆圆”。',
        actionTip: '画完圆后，用橡皮把外面的正方形虚线轻轻擦淡。',
        mistakeTip: '徒手一笔画圆，导致边缘凹凸不平变成鸡蛋或土豆。',
        correctTip: '先切四角，再切八角，八边形顺滑连成正圆。',
        guideType: 'sphere_step1'
      },
      {
        stepNum: 2,
        title: '锁定光源与弧形明暗交界线',
        instruction: '假设光源来自左上角 45 度。在右下侧画出一道弯曲的月牙形明暗交界线（注意：交界线必须沿着球体弧度弯曲）。',
        secret: '光线与球面的切点集合在空间中是一个大圆截面，投影到二维平面就是一道平滑的弧线。',
        actionTip: '这是球体最关键的一条分界线，交界线最暗，决定了球体的圆润体量。',
        mistakeTip: '画成笔直的直线或者反向弯曲的线，破坏了球面球体透视。',
        correctTip: '弧线凸向右下方，像一个弯弯的娥眉月牙。',
        guideType: 'sphere_step2'
      },
      {
        stepNum: 3,
        title: '暗面排线与保留反光呼吸区',
        instruction: '用 2B/4B 铅笔将交界线向右下侧加深。切记：不要涂到球体最边缘！在右下角边缘保留一层淡淡的灰色反光！',
        secret: '地面漫反射：光线打在桌面上会反弹至球体底部暗部。如果把暗面边缘涂得漆黑死板，球体立刻失去空气透明感。',
        actionTip: '交界线最黑，向内到反光区逐渐变淡。',
        mistakeTip: '把整个暗面一直涂黑到圆圈边缘，球体立刻变成黑铁饼，失去空间呼吸感。',
        correctTip: '边缘留出 1~2 毫米的浅灰带（桌面反弹光），球体立刻饱满鼓起来！',
        guideType: 'sphere_step3'
      },
      {
        stepNum: 4,
        title: '地面投影 + 接触闭塞 AO + 高光点',
        instruction: '在右下侧地面画出一个压扁的深灰色椭圆投影。在球体正下方与地面接触的 1 毫米极小缝隙，用力涂成极黑（接触闭塞AO）！受光面点出高光。',
        secret: '光线衰减与微小缝隙闭塞：球体落地的接触点几乎无法接收任何光子，这是整个画面的几何锚固点。',
        actionTip: '用高光橡皮在左上方受光面轻轻点出一个白亮的小圆点！',
        mistakeTip: '投影画得像黑尾巴，接触点没有压实纯黑，球体像是漂浮在水面。',
        correctTip: '接触点那 1 毫米用 6B 铅笔最用力压到极黑，外围投影渐变羽化。',
        guideType: 'sphere_step4'
      }
    ]
  }
];

export default function StepByStepStudio() {
  const [activeLessonId, setActiveLessonId] = useState('floating-cube');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showGhostGuide, setShowGhostGuide] = useState(true);

  // 2D Drawing Canvas state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [tool, setTool] = useState('pencil'); // 'pencil', 'blend', 'eraser'
  const [pencilGrade, setPencilGrade] = useState('4B'); // '2B', '4B', '6B'

  // 3D Inspection Mode
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
  const [foldAngle, setFoldAngle] = useState(90); // for folded ladder: 90 (L-shape) to 180 (flat)
  const [cutPaperTrick, setCutPaperTrick] = useState(true);

  const currentLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];
  const currentStep = currentLesson.steps[currentStepIdx] || currentLesson.steps[0];
  const isLastStep = currentStepIdx === currentLesson.steps.length - 1;

  // Clear user canvas
  const clearUserCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Trigger celebration confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
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
    setViewMode('2d');
    clearUserCanvas();
  };

  // Helper to extract normalized canvas coordinates
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  // Drawing logic
  const startDraw = (e) => {
    if (viewMode === '3d') return; // in 3D mode, interaction is for rotating/viewing
    if (e.touches && e.touches.length > 1) return;
    const pos = getCoords(e);
    setIsDrawing(true);
    setLastPoint(pos);
  };

  const draw = (e) => {
    if (!isDrawing || !lastPoint || viewMode === '3d') return;
    if (e.touches && e.touches.length > 1) return;
    if (e.cancelable && e.touches) e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getCoords(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(pos.x, pos.y);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else if (tool === 'blend') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.18)';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      const alpha = pencilGrade === '2B' ? 0.5 : pencilGrade === '4B' ? 0.8 : 0.95;
      const width = pencilGrade === '2B' ? 2 : pencilGrade === '4B' ? 3 : 4.5;
      ctx.strokeStyle = `rgba(30, 41, 59, ${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    setLastPoint(pos);
  };

  const stopDraw = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  // Auto-demonstration helper: draws the strokes of a given step directly onto the user canvas
  const autoDrawStep = (targetStepIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawPencilLine = (x1, y1, x2, y2, width = 3, alpha = 0.85) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(30, 41, 59, ${alpha})`;
      ctx.lineWidth = width;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    if (activeLessonId === 'floating-cube') {
      if (targetStepIdx === 0) {
        // Top parallelogram
        ctx.beginPath();
        ctx.moveTo(250, 70);
        ctx.lineTo(350, 115);
        ctx.lineTo(250, 160);
        ctx.lineTo(150, 115);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (targetStepIdx === 1) {
        // 3 verticals
        drawPencilLine(150, 115, 150, 240, 3.5);
        drawPencilLine(250, 160, 250, 285, 3.5);
        drawPencilLine(350, 115, 350, 240, 3.5);
      } else if (targetStepIdx === 2) {
        // Bottom edges
        drawPencilLine(150, 240, 250, 285, 3.5);
        drawPencilLine(250, 285, 350, 240, 3.5);
      } else if (targetStepIdx === 3) {
        // Detached shadow
        ctx.beginPath();
        ctx.ellipse(250, 375, 100, 26, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
        ctx.fill();
      } else if (targetStepIdx === 4) {
        // Left face halftone
        ctx.beginPath();
        ctx.moveTo(150, 115);
        ctx.lineTo(250, 160);
        ctx.lineTo(250, 285);
        ctx.lineTo(150, 240);
        ctx.closePath();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
        ctx.fill();
        // Right face deep shadow
        ctx.beginPath();
        ctx.moveTo(250, 160);
        ctx.lineTo(350, 115);
        ctx.lineTo(350, 240);
        ctx.lineTo(250, 285);
        ctx.closePath();
        ctx.fillStyle = 'rgba(51, 65, 85, 0.85)';
        ctx.fill();
      } else if (targetStepIdx === 5) {
        // Cut paper preview notification
        triggerCelebration();
      }
    } else if (activeLessonId === 'folded-ladder') {
      if (targetStepIdx === 0) {
        // Fold line
        ctx.save();
        ctx.setLineDash([8, 6]);
        drawPencilLine(30, 230, 470, 230, 2, 0.6);
        ctx.restore();
      } else if (targetStepIdx === 1) {
        // Upper ladder rails
        drawPencilLine(205, 60, 205, 230, 4);
        drawPencilLine(295, 60, 295, 230, 4);
        // Upper rungs
        [85, 115, 145, 175, 205].forEach(y => {
          drawPencilLine(205, y, 295, y, 3);
        });
      } else if (targetStepIdx === 2) {
        // Lower flared legs
        drawPencilLine(205, 230, 160, 400, 4);
        drawPencilLine(295, 230, 340, 400, 4);
        // Lower rungs
        const rungs = [
          { y: 265, x1: 196, x2: 304 },
          { y: 305, x1: 185, x2: 315 },
          { y: 345, x1: 174, x2: 326 },
          { y: 385, x1: 164, x2: 336 },
        ];
        rungs.forEach(r => {
          drawPencilLine(r.x1, r.y, r.x2, r.y, 3);
        });
      } else if (targetStepIdx === 3) {
        // Ground shadow extending right
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(205, 230);
        ctx.lineTo(280, 420);
        ctx.lineTo(380, 420);
        ctx.lineTo(295, 230);
        ctx.closePath();
        ctx.fillStyle = 'rgba(71, 85, 105, 0.25)';
        ctx.fill();
        drawPencilLine(205, 230, 280, 420, 2, 0.4);
        drawPencilLine(295, 230, 380, 420, 2, 0.4);
        ctx.restore();
      }
    } else if (activeLessonId === 'paper-hole') {
      if (targetStepIdx === 0) {
        ctx.beginPath();
        ctx.ellipse(250, 180, 170, 65, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.lineWidth = 3.5;
        ctx.stroke();
      } else if (targetStepIdx === 1) {
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.ellipse(250, 210, 125, 48, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(250, 235, 80, 30, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(250, 255, 45, 16, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(250, 270, 20, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#090d16'; ctx.fill();
      } else if (targetStepIdx === 2) {
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.lineWidth = 2;
        const curves = [
          [[80, 180], [150, 240], [230, 270]],
          [[120, 140], [180, 220], [240, 268]],
          [[200, 118], [230, 200], [248, 266]],
          [[300, 118], [270, 200], [252, 266]],
          [[380, 140], [320, 220], [260, 268]],
          [[420, 180], [350, 240], [270, 270]],
        ];
        curves.forEach(([p1, p2, p3]) => {
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.quadraticCurveTo(p2[0], p2[1], p3[0], p3[1]);
          ctx.stroke();
        });
      } else if (targetStepIdx === 3) {
        ctx.beginPath();
        ctx.ellipse(250, 270, 30, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#020617';
        ctx.fill();
      }
    } else if (activeLessonId === 'shading-sphere') {
      if (targetStepIdx === 0) {
        ctx.beginPath();
        ctx.arc(240, 200, 110, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (targetStepIdx === 1) {
        // Terminator crescent curve
        ctx.beginPath();
        ctx.moveTo(200, 95);
        ctx.bezierCurveTo(280, 140, 280, 260, 200, 305);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3.5;
        ctx.stroke();
      } else if (targetStepIdx === 2) {
        // Shade the dark side with bounce light rim
        const grad = ctx.createRadialGradient(240, 200, 50, 240, 200, 110);
        grad.addColorStop(0, 'rgba(241, 245, 249, 0)');
        grad.addColorStop(0.65, 'rgba(51, 65, 85, 0.6)');
        grad.addColorStop(0.9, 'rgba(15, 23, 42, 0.85)');
        grad.addColorStop(1, 'rgba(203, 213, 225, 0.3)'); // reflected bounce light rim
        ctx.beginPath();
        ctx.arc(240, 200, 108, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      } else if (targetStepIdx === 3) {
        // Ground shadow
        ctx.beginPath();
        ctx.ellipse(320, 305, 110, 25, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
        ctx.fill();
        // Contact occlusion AO under sphere
        ctx.beginPath();
        ctx.ellipse(240, 310, 22, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#020617';
        ctx.fill();
        // Highlight point
        ctx.beginPath();
        ctx.arc(190, 150, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    }
    ctx.restore();
  };

  // Auto-complete the whole drawing
  const autoCompleteAllSteps = () => {
    clearUserCanvas();
    for (let i = 0; i <= currentLesson.steps.length - 1; i++) {
      autoDrawStep(i);
    }
    setCurrentStepIdx(currentLesson.steps.length - 1);
    triggerCelebration();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
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
          不用担心没有美术底子！我们把立体画拆解为机械式的简单步骤。
          提供实时<strong>【步骤指引线】</strong>、<strong>【一键示范】</strong>与<strong>【3D错觉检视】</strong>。
          切换 3D 视角，亲眼见证平面的线条如何在桌面上直立拔起！
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
              <div className={`text-xs sm:text-sm font-bold font-serif line-clamp-1 ${isActive ? 'text-amber-300' : 'text-slate-200'}`}>
                {l.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Instruction & Step Stepper */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step Progress Tracker */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-semibold">当前步骤</span>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif mt-0.5">
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

              {/* Mistake vs Master Tip Card (新手避坑指南) */}
              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 space-y-1">
                  <div className="text-red-400 font-bold flex items-center gap-1.5 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    ❌ 新手最容易踩的坑
                  </div>
                  <p className="text-xs text-red-200/90 leading-relaxed">{currentStep.mistakeTip}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ✔️ 大师立体心法 (几何原理)
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">{currentStep.correctTip}</p>
                </div>
              </div>

              {/* Math Secret Card */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  背后的科学秘密
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentStep.secret}</p>
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIdx === 0}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentStepIdx === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>上一步</span>
              </button>

              {/* Auto Trace Step Button */}
              <button
                onClick={() => autoDrawStep(currentStepIdx)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
                title="自动将当前步的标准笔迹绘制到画板中"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>示范本步</span>
              </button>

              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
              >
                <span>{isLastStep ? '完成 🎉' : '下一步'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Math Badge */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400">本课核心数学模型：</span>
            <div className="text-amber-300 font-bold font-mono text-xs">{currentLesson.mathHighlight}</div>
          </div>
        </div>

        {/* Right Guided Practice Canvas */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Top Canvas Viewport Switcher & Tools */}
          <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* View Mode Mode: 2D Flat vs 3D Illusion Tilt */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('2d')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === '2d'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>2D 平面作画</span>
              </button>

              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === '3d'
                    ? 'bg-emerald-500 text-slate-950 shadow animate-pulse'
                    : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>📐 3D 黄金错觉检视</span>
              </button>
            </div>

            {/* Quick Auto-Complete All */}
            <div className="flex items-center gap-2">
              <button
                onClick={autoCompleteAllSteps}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-medium"
                title="一键将整幅立体画的标准成品画完"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>一键全图成品</span>
              </button>

              <button
                onClick={clearUserCanvas}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700"
                title="清空用户涂鸦"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>清空</span>
              </button>
            </div>
          </div>

          {/* Sub Toolbar for 2D mode */}
          {viewMode === '2d' && (
            <div className="px-3.5 py-2 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Drawing Tools */}
              <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setTool('pencil')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${
                    tool === 'pencil' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  <PenTool className="w-3 h-3" />
                  <span>铅笔</span>
                </button>
                <button
                  onClick={() => setTool('blend')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${
                    tool === 'blend' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>纸擦笔</span>
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${
                    tool === 'eraser' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  <Eraser className="w-3 h-3" />
                  <span>橡皮</span>
                </button>
              </div>

              {/* Pencil Grade Select */}
              {tool === 'pencil' && (
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <span className="text-slate-500">铅笔硬度:</span>
                  {['2B', '4B', '6B'].map(g => (
                    <button
                      key={g}
                      onClick={() => setPencilGrade(g)}
                      className={`px-2 py-0.5 rounded ${
                        pencilGrade === g ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}

              {/* Ghost Guide Toggle */}
              <button
                onClick={() => setShowGhostGuide(!showGhostGuide)}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all text-xs ${
                  showGhostGuide
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>辅助指引线 {showGhostGuide ? '已开启' : '已隐藏'}</span>
              </button>
            </div>
          )}

          {/* Sub Toolbar for 3D mode controls */}
          {viewMode === '3d' && (
            <div className="px-4 py-2.5 border-b border-slate-800 bg-emerald-950/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                <Maximize2 className="w-4 h-4 text-emerald-400" />
                <span>3D 错觉实景视角激活：模拟从斜前方 45° 俯视观察画纸</span>
              </div>

              {activeLessonId === 'folded-ladder' && (
                <div className="flex items-center gap-3 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px]">卡纸折叠角度:</span>
                  <input
                    type="range"
                    min="90"
                    max="180"
                    step="1"
                    value={foldAngle}
                    onChange={(e) => setFoldAngle(Number(e.target.value))}
                    className="w-24 accent-emerald-500"
                  />
                  <span className="font-mono text-emerald-400 font-bold">{foldAngle}° {foldAngle === 90 ? '(直角直立 ⭐)' : '(平摊)'}</span>
                </div>
              )}

              {activeLessonId === 'floating-cube' && (
                <button
                  onClick={() => setCutPaperTrick(!cutPaperTrick)}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                    cutPaperTrick ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{cutPaperTrick ? '剪纸破界已生效 (顶端透明)' : '未剪纸'}</span>
                </button>
              )}
            </div>
          )}

          {/* Interactive Layered Canvas Stage */}
          <div className="relative bg-[#0b1120] w-full h-[470px] select-none flex items-center justify-center overflow-hidden p-4">
            {/* 3D Scene Container */}
            <div
              className="relative transition-all duration-300 ease-out flex items-center justify-center"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                width: '100%',
                height: '100%',
              }}
            >
              {/* Paper Canvas Board */}
              <div
                className="relative bg-[#f8fafc] rounded-xl shadow-2xl transition-transform duration-500 ease-out overflow-hidden border border-slate-300"
                style={{
                  width: '480px',
                  height: '440px',
                  transform:
                    viewMode === '3d'
                      ? activeLessonId === 'folded-ladder'
                        ? 'rotateX(40deg) translateY(20px)'
                        : 'rotateX(45deg) rotateZ(-3deg) translateY(25px)'
                      : 'none',
                  transformOrigin: 'center bottom',
                  boxShadow:
                    viewMode === '3d'
                      ? '0 30px 60px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.5)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Paper texture dot grid */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

                {/* Scissors Cut overlay for floating cube in 3D */}
                {viewMode === '3d' && activeLessonId === 'floating-cube' && cutPaperTrick && (
                  <div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 10%, #0b1120 40%, transparent 80%)',
                      opacity: 0.95,
                    }}
                  />
                )}

                {/* Special 3D Fold for Folded Ladder */}
                {viewMode === '3d' && activeLessonId === 'folded-ladder' && (
                  <div
                    className="absolute inset-0 pointer-events-none z-15 transition-opacity"
                    style={{
                      background: `linear-gradient(to bottom, rgba(15,23,42,${(180 - foldAngle) / 200}) 0%, transparent 48%, rgba(0,0,0,0.3) 50%, transparent 52%)`,
                    }}
                  />
                )}

                {/* SVG Ghost Guide Layer (Rendered underneath user canvas) */}
                {showGhostGuide && (
                  <svg viewBox="0 0 500 460" className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" />
                      </filter>
                      <linearGradient id="shadingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f8fafc" />
                        <stop offset="50%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                    </defs>

                    {/* LESSON 1: FLOATING CUBE */}
                    {activeLessonId === 'floating-cube' && (
                      <g>
                        {/* Step 1: Top parallelogram */}
                        <polygon
                          points="250,70 350,115 250,160 150,115"
                          fill={currentStepIdx >= 4 ? '#ffffff' : currentStepIdx === 0 ? 'rgba(245, 158, 11, 0.15)' : 'none'}
                          stroke={currentStepIdx === 0 ? '#f59e0b' : '#64748b'}
                          strokeWidth={currentStepIdx === 0 ? 3.5 : 2}
                          strokeDasharray={currentStepIdx === 0 ? '5 3' : 'none'}
                          filter={currentStepIdx === 0 ? 'url(#glow)' : 'none'}
                        />
                        {currentStepIdx === 0 && (
                          <text x="250" y="120" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="bold">
                            ① 顶面平行四边形 (俯视受光)
                          </text>
                        )}

                        {/* Step 2: Vertical edges */}
                        {currentStepIdx >= 1 && (
                          <g stroke={currentStepIdx === 1 ? '#f59e0b' : '#64748b'} strokeWidth={currentStepIdx === 1 ? 3.5 : 2} strokeDasharray={currentStepIdx === 1 ? '5 3' : 'none'}>
                            <line x1="150" y1="115" x2="150" y2="240" />
                            <line x1="250" y1="160" x2="250" y2="285" />
                            <line x1="350" y1="115" x2="350" y2="240" />
                            {currentStepIdx === 1 && (
                              <text x="250" y="225" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="bold">
                                ② 三条垂直竖棱 (长度严格相等)
                              </text>
                            )}
                          </g>
                        )}

                        {/* Step 3: Bottom edges */}
                        {currentStepIdx >= 2 && (
                          <g stroke={currentStepIdx === 2 ? '#f59e0b' : '#64748b'} strokeWidth={currentStepIdx === 2 ? 3.5 : 2} strokeDasharray={currentStepIdx === 2 ? '5 3' : 'none'}>
                            <line x1="150" y1="240" x2="250" y2="285" />
                            <line x1="250" y1="285" x2="350" y2="240" />
                          </g>
                        )}

                        {/* Step 4: Detached cast shadow */}
                        {currentStepIdx >= 3 && (
                          <g>
                            <ellipse
                              cx="250"
                              cy="375"
                              rx="100"
                              ry="26"
                              fill="rgba(15, 23, 42, 0.45)"
                              stroke={currentStepIdx === 3 ? '#f59e0b' : 'none'}
                              strokeWidth="3"
                              strokeDasharray="5 3"
                            />
                            {/* Height Separation Gap Indicator */}
                            <line x1="250" y1="285" x2="250" y2="350" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                            <polygon points="250,285 246,295 254,295" fill="#f59e0b" />
                            <polygon points="250,350 246,340 254,340" fill="#f59e0b" />
                            <text x="260" y="322" fill="#d97706" fontSize="11" fontWeight="bold">
                              留白 2~3cm (悬浮间隙)
                            </text>
                          </g>
                        )}

                        {/* Step 5: Five Values Shading */}
                        {currentStepIdx >= 4 && (
                          <g>
                            {/* Left face halftone */}
                            <polygon points="150,115 250,160 250,285 150,240" fill="rgba(148, 163, 184, 0.5)" />
                            {/* Right face deep shadow */}
                            <polygon points="250,160 350,115 350,240 250,285" fill="rgba(51, 65, 85, 0.85)" />
                            <text x="190" y="210" fill="#475569" fontSize="11" fontWeight="bold">中间灰</text>
                            <text x="310" y="210" fill="#f8fafc" fontSize="11" fontWeight="bold">深阴影</text>
                          </g>
                        )}

                        {/* Step 6: Scissors Cut Line */}
                        {currentStepIdx === 5 && (
                          <g>
                            <path
                              d="M 30 160 L 150 115 L 250 70 L 350 115 L 470 160"
                              stroke="#ef4444"
                              strokeWidth="2.5"
                              strokeDasharray="6 4"
                              fill="none"
                            />
                            <text x="250" y="50" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">
                              ✂️ 沿红虚线剪掉上方纸张（打破平面边界）
                            </text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* LESSON 2: PAPER HOLE ABYSS */}
                    {activeLessonId === 'paper-hole' && (
                      <g>
                        {/* Step 1: Rim Ellipse */}
                        <ellipse
                          cx="250"
                          cy="180"
                          rx="170"
                          ry="65"
                          fill="none"
                          stroke={currentStepIdx === 0 ? '#f59e0b' : '#64748b'}
                          strokeWidth={currentStepIdx === 0 ? 3.5 : 2}
                          strokeDasharray={currentStepIdx === 0 ? '5 3' : 'none'}
                        />
                        {currentStepIdx === 0 && (
                          <text x="250" y="170" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="bold">
                            ① 洞口外沿大椭圆 (水平横向展开)
                          </text>
                        )}

                        {/* Step 2: Compressing inner ellipses */}
                        {currentStepIdx >= 1 && (
                          <g stroke={currentStepIdx === 1 ? '#f59e0b' : '#64748b'} strokeWidth={currentStepIdx === 1 ? 3 : 1.5} fill="none">
                            <ellipse cx="250" cy="210" rx="125" ry="48" strokeDasharray={currentStepIdx === 1 ? '4 3' : 'none'} />
                            <ellipse cx="250" cy="235" rx="80" ry="30" strokeDasharray={currentStepIdx === 1 ? '4 3' : 'none'} />
                            <ellipse cx="250" cy="255" rx="45" ry="16" strokeDasharray={currentStepIdx === 1 ? '4 3' : 'none'} />
                            <ellipse cx="250" cy="270" rx="20" ry="8" fill="#090d16" />
                            {currentStepIdx === 1 && (
                              <text x="250" y="225" textAnchor="middle" fill="#d97706" fontSize="11" fontWeight="bold">
                                ② 几何级数 1/Z 递减收缩
                              </text>
                            )}
                          </g>
                        )}

                        {/* Step 3: Curved sink lines */}
                        {currentStepIdx >= 2 && (
                          <g stroke={currentStepIdx === 2 ? '#f59e0b' : '#64748b'} strokeWidth={currentStepIdx === 2 ? 2.5 : 1.5} fill="none">
                            <path d="M 80 180 Q 150 240 230 270" />
                            <path d="M 120 140 Q 180 220 240 268" />
                            <path d="M 200 118 Q 230 200 248 266" />
                            <path d="M 300 118 Q 270 200 252 266" />
                            <path d="M 380 140 Q 320 220 260 268" />
                            <path d="M 420 180 Q 350 240 270 270" />
                            {currentStepIdx === 2 && (
                              <text x="250" y="145" textAnchor="middle" fill="#d97706" fontSize="11" fontWeight="bold">
                                ③ 弯曲向心下陷经线 (曲率引导深度)
                              </text>
                            )}
                          </g>
                        )}

                        {/* Step 4: Final Checkerboard vortex */}
                        {currentStepIdx >= 3 && (
                          <g>
                            <ellipse cx="250" cy="270" rx="35" ry="14" fill="#020617" />
                            <text x="250" y="320" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
                              ④ 深渊奇点涂极黑，棋盘黑白交错填色
                            </text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* LESSON 3: FOLDED LADDER (FIXED & FULLY IMPLEMENTED) */}
                    {activeLessonId === 'folded-ladder' && (
                      <g>
                        {/* Step 1: Fold Crease Center Line */}
                        <line
                          x1="20"
                          y1="230"
                          x2="480"
                          y2="230"
                          stroke={currentStepIdx === 0 ? '#f59e0b' : '#94a3b8'}
                          strokeWidth={currentStepIdx === 0 ? 3 : 1.5}
                          strokeDasharray="8 5"
                        />
                        <text x="250" y="220" textAnchor="middle" fill={currentStepIdx === 0 ? '#d97706' : '#64748b'} fontSize="11" fontWeight="bold">
                          折痕中轴线 (此处向上折 90°)
                        </text>
                        <text x="50" y="100" fill="#94a3b8" fontSize="10">▲ 上半张：垂直立面 (墙)</text>
                        <text x="50" y="360" fill="#94a3b8" fontSize="10">▼ 下半张：水平桌面 (地)</text>

                        {/* Step 2: Upper Vertical Ladder Rails & Rungs */}
                        {currentStepIdx >= 1 && (
                          <g stroke={currentStepIdx === 1 ? '#f59e0b' : '#334155'} strokeWidth={currentStepIdx === 1 ? 3.5 : 2.5}>
                            <line x1="205" y1="60" x2="205" y2="230" />
                            <line x1="295" y1="60" x2="295" y2="230" />
                            {/* Rungs */}
                            {[85, 115, 145, 175, 205].map(y => (
                              <line key={y} x1="205" y1={y} x2="295" y2={y} strokeWidth="2.5" />
                            ))}
                            {currentStepIdx === 1 && (
                              <text x="250" y="50" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="bold">
                                ② 上半段梯身：严格垂直折痕
                              </text>
                            )}
                          </g>
                        )}

                        {/* Step 3: Lower Flared Ladder Legs */}
                        {currentStepIdx >= 2 && (
                          <g stroke={currentStepIdx === 2 ? '#f59e0b' : '#334155'} strokeWidth={currentStepIdx === 2 ? 3.5 : 2.5}>
                            {/* Flared Legs (15 degree spread) */}
                            <line x1="205" y1="230" x2="160" y2="400" />
                            <line x1="295" y1="230" x2="340" y2="400" />
                            {/* Lower slanted rungs */}
                            <line x1="196" y1="265" x2="304" y2="265" strokeWidth="2.5" />
                            <line x1="185" y1="305" x2="315" y2="305" strokeWidth="2.5" />
                            <line x1="174" y1="345" x2="326" y2="345" strokeWidth="2.5" />
                            <line x1="164" y1="385" x2="336" y2="385" strokeWidth="2.5" />

                            {currentStepIdx === 2 && (
                              <g>
                                <text x="250" y="325" textAnchor="middle" fill="#d97706" fontSize="11" fontWeight="bold">
                                  ③ 折痕偏角法则：下半段向外张开 15°
                                </text>
                                <text x="250" y="342" textAnchor="middle" fill="#64748b" fontSize="10">
                                  (折叠立起后，人眼透视刚好将其补偿变直！)
                                </text>
                              </g>
                            )}
                          </g>
                        )}

                        {/* Step 4: Cast Shadow on desk */}
                        {currentStepIdx >= 3 && (
                          <g>
                            <polygon
                              points="205,230 280,420 380,420 295,230"
                              fill="rgba(100, 116, 139, 0.2)"
                            />
                            <line x1="205" y1="230" x2="280" y2="420" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
                            <line x1="295" y1="230" x2="380" y2="420" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
                            {currentStepIdx === 3 && (
                              <text x="350" y="310" fill="#d97706" fontSize="11" fontWeight="bold">
                                ④ 水平桌面投影 (梯子凌空立起的关键)
                              </text>
                            )}
                          </g>
                        )}
                      </g>
                    )}

                    {/* LESSON 4: SHADING SPHERE */}
                    {activeLessonId === 'shading-sphere' && (
                      <g>
                        {/* Step 1: Bounding square + Circle */}
                        {currentStepIdx === 0 && (
                          <rect
                            x="130"
                            y="90"
                            width="220"
                            height="220"
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                          />
                        )}
                        <circle
                          cx="240"
                          cy="200"
                          r="110"
                          fill={currentStepIdx >= 2 ? 'url(#shadingGrad)' : 'none'}
                          stroke={currentStepIdx === 0 ? '#f59e0b' : '#475569'}
                          strokeWidth={currentStepIdx === 0 ? 3.5 : 2.5}
                          strokeDasharray={currentStepIdx === 0 ? '5 3' : 'none'}
                        />
                        {currentStepIdx === 0 && (
                          <text x="240" y="80" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="bold">
                            ① 正方形切角法画正圆 (严防土豆圆)
                          </text>
                        )}

                        {/* Step 2: Light source & Terminator */}
                        {currentStepIdx >= 1 && (
                          <g>
                            {/* Light arrow from top-left */}
                            <line x1="100" y1="60" x2="160" y2="120" stroke="#f59e0b" strokeWidth="2.5" />
                            <polygon points="160,120 148,114 154,108" fill="#f59e0b" />
                            <text x="100" y="50" fill="#d97706" fontSize="11" fontWeight="bold">45° 入射光</text>

                            {/* Crescent Terminator line */}
                            <path
                              d="M 200 95 C 280 140 280 260 200 305"
                              fill="none"
                              stroke={currentStepIdx === 1 ? '#f59e0b' : '#1e293b'}
                              strokeWidth={currentStepIdx === 1 ? 3.5 : 2.5}
                              strokeDasharray={currentStepIdx === 1 ? '5 3' : 'none'}
                            />
                            {currentStepIdx === 1 && (
                              <text x="310" y="190" fill="#d97706" fontSize="11" fontWeight="bold">
                                ② 弧形明暗交界线 (月牙形)
                              </text>
                            )}
                          </g>
                        )}

                        {/* Step 3: Reflected Bounce Light highlight */}
                        {currentStepIdx >= 2 && (
                          <g>
                            {/* Bounce light indicator */}
                            <path
                              d="M 240 308 A 110 110 0 0 0 345 220"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="2.5"
                              strokeDasharray="3 3"
                            />
                            <text x="360" y="270" fill="#0284c7" fontSize="10" fontWeight="bold">
                              反光呼吸区 (不可涂死黑!)
                            </text>
                          </g>
                        )}

                        {/* Step 4: Cast Shadow + AO + Specular */}
                        {currentStepIdx >= 3 && (
                          <g>
                            {/* Ground Shadow */}
                            <ellipse cx="320" cy="305" rx="110" ry="25" fill="rgba(15, 23, 42, 0.45)" />
                            {/* Contact Occlusion (AO) */}
                            <ellipse cx="240" cy="310" rx="22" ry="5" fill="#020617" />
                            <text x="370" y="325" fill="#d97706" fontSize="11" fontWeight="bold">
                              接触闭塞AO (最黑1毫米压死)
                            </text>
                            {/* Specular highlight */}
                            <circle cx="190" cy="150" r="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                            <text x="150" y="145" fill="#d97706" fontSize="11" fontWeight="bold">高光点</text>
                          </g>
                        )}
                      </g>
                    )}
                  </svg>
                )}

                {/* Active User Drawing Canvas Layer */}
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={460}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={stopDraw}
                  className={`absolute inset-0 w-full h-full z-10 touch-none ${
                    viewMode === '3d' ? 'cursor-default pointer-events-none' : 'cursor-crosshair'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Bottom Canvas Footer */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              {viewMode === '2d'
                ? '支持鼠标或触摸笔自由绘制 · 随时点击【示范本步】观察标准笔迹'
                : '当前处于 3D 黄金倾斜视角，观察平面线条如何在视网膜中重构为立体三维！'}
            </span>
            <span className="font-mono text-amber-400/90">
              {viewMode === '2d'
                ? `当前笔刷：${tool === 'pencil' ? `铅笔 (${pencilGrade})` : tool === 'blend' ? '纸擦笔' : '橡皮'}`
                : '3D 视点模拟已就绪'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
