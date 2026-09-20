import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Compass, HelpCircle, RefreshCw, Eye, Move, Grid, Check, Sliders, Layers } from 'lucide-react';
import MathFormula from './MathFormula';

export default function PerspectiveLab() {
  const [perspectiveMode, setPerspectiveMode] = useState(2); // 1, 2, or 3 points
  const [activeMathTab, setActiveMathTab] = useState('pinhole'); // 'pinhole', 'projective', 'crossratio'

  // Canvas state
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  const [horizonY, setHorizonY] = useState(250);
  const [vp1, setVp1] = useState({ x: 120, y: 250 });
  const [vp2, setVp2] = useState({ x: 680, y: 250 });
  const [vp3, setVp3] = useState({ x: 400, y: 40 }); // Zenith for 3-point
  
  // Interactive Cube position and size
  const [boxPos, setBoxPos] = useState({ x: 400, y: 320 });
  const [boxDimensions, setBoxDimensions] = useState({ width: 140, height: 110, depth: 0.5 });
  
  // View options
  const [showRays, setShowRays] = useState(true);
  const [showGroundGrid, setShowGroundGrid] = useState(true);
  const [showShading, setShowShading] = useState(true);

  // Dragging state
  const [draggingTarget, setDraggingTarget] = useState(null); // 'horizon', 'vp1', 'vp2', 'vp3', 'box'

  // Pinhole camera math simulator interactive state
  const [mathSimZ, setMathSimZ] = useState(4); // Distance Z (1 to 10)
  const [mathSimF, setMathSimF] = useState(30); // Focal length f (15 to 80)
  const [mathSimObjH, setMathSimObjH] = useState(5); // Object height (1 to 10)

  // Sync VPs with horizon line
  useEffect(() => {
    setVp1(prev => ({ ...prev, y: horizonY }));
    setVp2(prev => ({ ...prev, y: horizonY }));
  }, [horizonY]);

  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const width = Math.min(container.clientWidth, 960);
        const height = 500;
        setCanvasSize({ width, height });
        // adjust default positions
        setHorizonY(height * 0.45);
        setVp1({ x: width * 0.12, y: height * 0.45 });
        setVp2({ x: width * 0.88, y: height * 0.45 });
        setVp3({ x: width * 0.5, y: 35 });
        setBoxPos({ x: width * 0.5, y: height * 0.65 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main canvas render function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSize;

    ctx.clearRect(0, 0, width, height);

    // 1. Background (Sky & Ground)
    const skyGradient = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGradient.addColorStop(0, '#090d16');
    skyGradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, horizonY);

    const groundGradient = ctx.createLinearGradient(0, horizonY, 0, height);
    groundGradient.addColorStop(0, '#0f172a');
    groundGradient.addColorStop(1, '#020617');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, horizonY, width, height - horizonY);

    // 2. Ground Grid Tiles
    if (showGroundGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;

      if (perspectiveMode === 1) {
        // 1-Point Perspective Ground Grid
        const vpCenter = { x: (vp1.x + vp2.x) / 2, y: horizonY };
        for (let x = -width * 0.5; x <= width * 1.5; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, height);
          ctx.lineTo(vpCenter.x, vpCenter.y);
          ctx.stroke();
        }
        // Horizontal distance lines (closer = spaced wider)
        for (let i = 1; i <= 15; i++) {
          const depthRatio = Math.pow(i / 15, 2.2);
          const y = horizonY + (height - horizonY) * depthRatio;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else {
        // 2-Point / 3-Point Grid
        const linesCount = 14;
        for (let i = 0; i <= linesCount; i++) {
          const t = i / linesCount;
          const gx = vp1.x + (vp2.x - vp1.x) * t;
          const gy = height + 40;

          // rays from VP1
          ctx.beginPath();
          ctx.moveTo(vp1.x, vp1.y);
          ctx.lineTo(gx + 120, gy);
          ctx.stroke();

          // rays from VP2
          ctx.beginPath();
          ctx.moveTo(vp2.x, vp2.y);
          ctx.lineTo(gx - 120, gy);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 3. Horizon Line (视平线 / Eye Level)
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(width, horizonY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Horizon line label
    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px sans-serif';
    ctx.fillText('视平线 (Eye Level / Horizon Line)', 20, horizonY - 8);
    ctx.restore();

    // 4. Calculate 3D Box Vertices
    const halfW = boxDimensions.width / 2;
    const h = boxDimensions.height;
    const depthT = boxDimensions.depth; // 0.2 - 0.8 interpolation to VP

    let corners = {};

    if (perspectiveMode === 1) {
      // 1-Point Box
      const centerVP = { x: (vp1.x + vp2.x) / 2, y: horizonY };
      // Front Face
      const f_tl = { x: boxPos.x - halfW, y: boxPos.y - h };
      const f_tr = { x: boxPos.x + halfW, y: boxPos.y - h };
      const f_bl = { x: boxPos.x - halfW, y: boxPos.y };
      const f_br = { x: boxPos.x + halfW, y: boxPos.y };

      // Back Face (projected toward centerVP)
      const b_tl = { x: f_tl.x + (centerVP.x - f_tl.x) * depthT, y: f_tl.y + (centerVP.y - f_tl.y) * depthT };
      const b_tr = { x: f_tr.x + (centerVP.x - f_tr.x) * depthT, y: f_tr.y + (centerVP.y - f_tr.y) * depthT };
      const b_bl = { x: f_bl.x + (centerVP.x - f_bl.x) * depthT, y: f_bl.y + (centerVP.y - f_bl.y) * depthT };
      const b_br = { x: f_br.x + (centerVP.x - f_br.x) * depthT, y: f_br.y + (centerVP.y - f_br.y) * depthT };

      corners = { f_tl, f_tr, f_bl, f_br, b_tl, b_tr, b_bl, b_br, vp: centerVP };

      // Rays
      if (showRays) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        [f_tl, f_tr, f_bl, f_br].forEach(pt => {
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(centerVP.x, centerVP.y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
      }

      // Draw 1-Point Faces
      const isAboveEye = boxPos.y - h < horizonY;
      const isBelowEye = boxPos.y > horizonY;
      const isLeft = boxPos.x < centerVP.x;
      const isRight = boxPos.x > centerVP.x;

      // Top or Bottom face
      if (isBelowEye) {
        ctx.fillStyle = showShading ? '#f1f5f9' : '#334155';
        ctx.beginPath();
        ctx.moveTo(f_tl.x, f_tl.y);
        ctx.lineTo(f_tr.x, f_tr.y);
        ctx.lineTo(b_tr.x, b_tr.y);
        ctx.lineTo(b_tl.x, b_tl.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.stroke();
      } else if (isAboveEye) {
        ctx.fillStyle = showShading ? '#1e293b' : '#334155';
        ctx.beginPath();
        ctx.moveTo(f_bl.x, f_bl.y);
        ctx.lineTo(f_br.x, f_br.y);
        ctx.lineTo(b_br.x, b_br.y);
        ctx.lineTo(b_bl.x, b_bl.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.stroke();
      }

      // Side faces
      if (isLeft) {
        ctx.fillStyle = showShading ? '#475569' : '#334155';
        ctx.beginPath();
        ctx.moveTo(f_tr.x, f_tr.y);
        ctx.lineTo(b_tr.x, b_tr.y);
        ctx.lineTo(b_br.x, b_br.y);
        ctx.lineTo(f_br.x, f_br.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.stroke();
      } else if (isRight) {
        ctx.fillStyle = showShading ? '#94a3b8' : '#334155';
        ctx.beginPath();
        ctx.moveTo(f_tl.x, f_tl.y);
        ctx.lineTo(b_tl.x, b_tl.y);
        ctx.lineTo(b_bl.x, b_bl.y);
        ctx.lineTo(f_bl.x, f_bl.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.stroke();
      }

      // Front Face
      ctx.fillStyle = showShading ? '#64748b' : '#334155';
      ctx.fillRect(f_tl.x, f_tl.y, halfW * 2, h);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(f_tl.x, f_tl.y, halfW * 2, h);

    } else {
      // 2-Point and 3-Point Box
      // Center Leading Vertical Edge
      let topCenter = { x: boxPos.x, y: boxPos.y - h };
      let bottomCenter = { x: boxPos.x, y: boxPos.y };

      // In 3-Point mode, vertical edge converges toward VP3
      if (perspectiveMode === 3) {
        // Line from bottomCenter towards VP3
        const dirX = vp3.x - boxPos.x;
        const dirY = vp3.y - boxPos.y;
        const dist = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        topCenter = {
          x: boxPos.x + (dirX / dist) * h,
          y: boxPos.y + (dirY / dist) * h,
        };
      }

      // Left corners (project towards VP1)
      const leftDepth = depthT * 0.9;
      const b_left = { x: bottomCenter.x + (vp1.x - bottomCenter.x) * leftDepth, y: bottomCenter.y + (vp1.y - bottomCenter.y) * leftDepth };
      const t_left = { x: topCenter.x + (vp1.x - topCenter.x) * leftDepth, y: topCenter.y + (vp1.y - topCenter.y) * leftDepth };

      // Right corners (project towards VP2)
      const rightDepth = depthT * 0.9;
      const b_right = { x: bottomCenter.x + (vp2.x - bottomCenter.x) * rightDepth, y: bottomCenter.y + (vp2.y - bottomCenter.y) * rightDepth };
      const t_right = { x: topCenter.x + (vp2.x - topCenter.x) * rightDepth, y: topCenter.y + (vp2.y - topCenter.y) * rightDepth };

      // Back top & bottom corners: intersection of lines (t_left -> VP2) and (t_right -> VP1)
      // Line from t_left to VP2: P = t_left + u * (vp2 - t_left)
      // Line from t_right to VP1: Q = t_right + v * (vp1 - t_right)
      const t_back = {
        x: (t_left.x + t_right.x) / 2 + (boxPos.x - width / 2) * 0.05,
        y: (t_left.y + t_right.y) - topCenter.y,
      };
      const b_back = {
        x: (b_left.x + b_right.x) / 2 + (boxPos.x - width / 2) * 0.05,
        y: (b_left.y + b_right.y) - bottomCenter.y,
      };

      // Draw Perspective Guide Rays
      if (showRays) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        // to VP1
        [topCenter, bottomCenter, t_right, b_right].forEach(pt => {
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(vp1.x, vp1.y);
          ctx.stroke();
        });

        // to VP2
        [topCenter, bottomCenter, t_left, b_left].forEach(pt => {
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(vp2.x, vp2.y);
          ctx.stroke();
        });

        // to VP3
        if (perspectiveMode === 3) {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
          [bottomCenter, b_left, b_right].forEach(pt => {
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(vp3.x, vp3.y);
            ctx.stroke();
          });
        }

        ctx.setLineDash([]);
      }

      // Draw Box Faces
      const isBelowHorizon = bottomCenter.y > horizonY;
      const isAboveHorizon = topCenter.y < horizonY;

      // 1. Top Face (if below horizon line)
      if (isBelowHorizon) {
        ctx.fillStyle = showShading ? '#f8fafc' : '#475569';
        ctx.beginPath();
        ctx.moveTo(topCenter.x, topCenter.y);
        ctx.lineTo(t_left.x, t_left.y);
        ctx.lineTo(t_back.x, t_back.y);
        ctx.lineTo(t_right.x, t_right.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 2. Bottom Face (if above horizon line)
      if (isAboveHorizon) {
        ctx.fillStyle = showShading ? '#0f172a' : '#1e293b';
        ctx.beginPath();
        ctx.moveTo(bottomCenter.x, bottomCenter.y);
        ctx.lineTo(b_left.x, b_left.y);
        ctx.lineTo(b_back.x, b_back.y);
        ctx.lineTo(b_right.x, b_right.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 3. Left Face
      ctx.fillStyle = showShading ? '#94a3b8' : '#334155';
      ctx.beginPath();
      ctx.moveTo(topCenter.x, topCenter.y);
      ctx.lineTo(t_left.x, t_left.y);
      ctx.lineTo(b_left.x, b_left.y);
      ctx.lineTo(bottomCenter.x, bottomCenter.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. Right Face
      ctx.fillStyle = showShading ? '#475569' : '#1e293b';
      ctx.beginPath();
      ctx.moveTo(topCenter.x, topCenter.y);
      ctx.lineTo(t_right.x, t_right.y);
      ctx.lineTo(b_right.x, b_right.y);
      ctx.lineTo(bottomCenter.x, bottomCenter.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Leading edge highlight
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(topCenter.x, topCenter.y);
      ctx.lineTo(bottomCenter.x, bottomCenter.y);
      ctx.stroke();
    }

    // 5. Draw Vanishing Point Handles
    const drawVPHandle = (x, y, label, color = '#f59e0b') => {
      ctx.save();
      // Outer ring
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.shadowBlur = 0;
      ctx.fill();

      // Text Tag
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x - 15, y - 14);
      ctx.restore();
    };

    if (perspectiveMode === 1) {
      const centerVP = { x: (vp1.x + vp2.x) / 2, y: horizonY };
      drawVPHandle(centerVP.x, centerVP.y, '灭点 VP');
    } else if (perspectiveMode === 2) {
      drawVPHandle(vp1.x, vp1.y, '左灭点 VP1');
      drawVPHandle(vp2.x, vp2.y, '右灭点 VP2');
    } else if (perspectiveMode === 3) {
      drawVPHandle(vp1.x, vp1.y, '左灭点 VP1');
      drawVPHandle(vp2.x, vp2.y, '右灭点 VP2');
      drawVPHandle(vp3.x, vp3.y, '天顶/地底灭点 VP3', '#a855f7');
    }

    // 6. Draw Box Position Handle
    ctx.save();
    ctx.beginPath();
    ctx.arc(boxPos.x, boxPos.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#6ee7b7';
    ctx.fillText('拖拽立方体', boxPos.x - 24, boxPos.y + 18);
    ctx.restore();

  }, [canvasSize, perspectiveMode, horizonY, vp1, vp2, vp3, boxPos, boxDimensions, showRays, showGroundGrid, showShading]);

  // Redraw when state changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Coordinate extractor with responsive scaling and touch support
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvasSize.width,
      y: ((clientY - rect.top) / rect.height) * canvasSize.height,
    };
  };

  // Mouse & Touch drag handling on canvas
  const handleMouseDown = (e) => {
    if (e.touches && e.touches.length > 1) return;
    const { x: mouseX, y: mouseY } = getCanvasCoords(e);

    // Check hit on handles
    const dist = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);

    if (perspectiveMode === 1) {
      const centerVP = { x: (vp1.x + vp2.x) / 2, y: horizonY };
      if (dist(mouseX, mouseY, centerVP.x, centerVP.y) < 28) {
        setDraggingTarget('vp1'); // use vp1 to slide
        return;
      }
    } else {
      if (dist(mouseX, mouseY, vp1.x, vp1.y) < 28) {
        setDraggingTarget('vp1');
        return;
      }
      if (dist(mouseX, mouseY, vp2.x, vp2.y) < 28) {
        setDraggingTarget('vp2');
        return;
      }
      if (perspectiveMode === 3 && dist(mouseX, mouseY, vp3.x, vp3.y) < 28) {
        setDraggingTarget('vp3');
        return;
      }
    }

    // Check hit on Box handle
    if (dist(mouseX, mouseY, boxPos.x, boxPos.y) < 35) {
      setDraggingTarget('box');
      return;
    }

    // Check hit near Horizon Line
    if (Math.abs(mouseY - horizonY) < 20) {
      setDraggingTarget('horizon');
      return;
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingTarget) return;
    if (e.cancelable && e.touches) e.preventDefault();
    const { x: rawX, y: rawY } = getCanvasCoords(e);
    const mouseX = Math.max(10, Math.min(canvasSize.width - 10, rawX));
    const mouseY = Math.max(10, Math.min(canvasSize.height - 10, rawY));

    if (draggingTarget === 'horizon') {
      setHorizonY(mouseY);
    } else if (draggingTarget === 'vp1') {
      setVp1({ x: mouseX, y: horizonY });
    } else if (draggingTarget === 'vp2') {
      setVp2({ x: mouseX, y: horizonY });
    } else if (draggingTarget === 'vp3') {
      setVp3({ x: mouseX, y: mouseY });
    } else if (draggingTarget === 'box') {
      setBoxPos({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = () => {
    setDraggingTarget(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12">
      {/* Title & Introduction */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
          <Compass className="w-3.5 h-3.5" />
          模块一 · 射影透视学与几何基础
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
          透视法则：平面的无限纵深引擎
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          文艺复兴时期的艺术家达芬奇将透视学称为“绘画的缰绳与舵轮”。
          现实三维世界经过人眼晶状体投射在视网膜上，是一次严格的<strong className="text-amber-300">中心射影变换</strong>。
          理解视平线与灭点，是画出立体感的第一步。
        </p>
      </div>

      {/* Main Interactive Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Workspace */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Top Bar Controls */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
            {/* Perspective Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {[
                { mode: 1, name: '一点透视', desc: '室内 / 走廊' },
                { mode: 2, name: '两点透视', desc: '建筑角 / 盒子' },
                { mode: 3, name: '三点透视', desc: '仰视 / 鸟瞰' },
              ].map(item => (
                <button
                  key={item.mode}
                  onClick={() => setPerspectiveMode(item.mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    perspectiveMode === item.mode
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Display Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRays(!showRays)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  showRays
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>透视辐射线</span>
              </button>

              <button
                onClick={() => setShowGroundGrid(!showGroundGrid)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  showGroundGrid
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>地砖网格</span>
              </button>

              <button
                onClick={() => setShowShading(!showShading)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  showShading
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>受光面上色</span>
              </button>
            </div>
          </div>

          {/* Canvas Rendering Area */}
          <div className="relative select-none bg-slate-950 flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              className="w-full max-h-[500px] cursor-crosshair rounded-xl border border-slate-800/80 shadow-inner touch-none"
            />
            {/* Interactive floating helper hint */}
            <div className="absolute bottom-4 left-4 pointer-events-none bg-slate-900/85 backdrop-blur border border-slate-700/60 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 flex items-center gap-2">
              <Move className="w-3 h-3 text-amber-400" />
              <span>拖动黄色圆点调节灭点位置，拖动视平线或绿色圆点改变方块视角</span>
            </div>
          </div>

          {/* Quick Sliders */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>方块宽度 (Width)</span>
                <span className="font-mono text-amber-400">{boxDimensions.width}px</span>
              </div>
              <input
                type="range"
                min="60"
                max="240"
                value={boxDimensions.width}
                onChange={(e) => setBoxDimensions(d => ({ ...d, width: Number(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>方块高度 (Height)</span>
                <span className="font-mono text-amber-400">{boxDimensions.height}px</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={boxDimensions.height}
                onChange={(e) => setBoxDimensions(d => ({ ...d, height: Number(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>透视深度比 (Depth Ratio)</span>
                <span className="font-mono text-amber-400">{Math.round(boxDimensions.depth * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.8"
                step="0.05"
                value={boxDimensions.depth}
                onChange={(e) => setBoxDimensions(d => ({ ...d, depth: Number(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Explanation & Tips Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="math-card space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base font-serif flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                当前模式深度剖析
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {perspectiveMode === 1 ? '1-Point' : perspectiveMode === 2 ? '2-Point' : '3-Point'}
              </span>
            </div>

            {perspectiveMode === 1 && (
              <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-amber-300">一点透视（平行透视）：</strong>
                  物体正对观察者，有一组水平线与一组垂直线与画纸严格平行（保持矩形正面不变形），唯独纵深方向的第三组线条向着视平线上的唯一灭点（VP）汇聚。
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="text-amber-400 font-semibold">生活应用：</div>
                  <div>站在笔直的马路中间、火车站长廊、正面看向一间房间的墙壁。</div>
                </div>
              </div>
            )}

            {perspectiveMode === 2 && (
              <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-amber-300">两点透视（成角透视）：</strong>
                  物体的一个转角正对观察者，垂直棱线保持竖直，而两条水平边的方向分别向左侧灭点（VP1）与右侧灭点（VP2）汇聚。
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="text-amber-400 font-semibold">核心观察定律：</div>
                  <div>方块若在视平线<strong>下方</strong>，露出<strong>顶面</strong>；在视平线<strong>上方</strong>，露出<strong>底面</strong>；穿过视平线时只看得见左右两侧。</div>
                </div>
              </div>
            )}

            {perspectiveMode === 3 && (
              <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-amber-300">三点透视（倾斜透视）：</strong>
                  当人的视线向上仰视或向下俯视时，原本垂直地面的竖棱也不再平行，而是在高空天顶（Zenith）或地底深处（Nadir）产生第三个灭点（VP3）。
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="text-amber-400 font-semibold">视觉震撼感：</div>
                  <div>仰望摩天大楼时的压迫感（巨物感）、站在高空俯瞰城市的“鸟瞰视角”。</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Drawing Golden Rule */}
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
              <Check className="w-4 h-4 text-amber-400" />
              零基础初学者口诀
            </h4>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li><span className="text-amber-200">近粗远细、近浓远淡：</span>靠近眼睛的棱线画粗，远离眼睛的虚化。</li>
              <li><span className="text-amber-200">视平线等同于人眼高度：</span>蹲下画视平线降低，站在椅子上画视平线抬高。</li>
              <li><span className="text-amber-200">灭点必须在视平线上：</span>所有的水平平行线组，最终必落在视平线上同一个点。</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Deep Mathematical Foundations */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-serif text-white">透视背后的三大数学与几何原理</h2>
            <p className="text-xs text-slate-400 mt-1">从欧氏几何到射影几何，数学公式如何严谨预测每一条辅助线的交点</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'pinhole', label: '1. 相似三角形与针孔模型' },
              { id: 'projective', label: '2. 齐次坐标与无穷远线' },
              { id: 'crossratio', label: '3. 对角线等分与交比守恒' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveMathTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMathTab === tab.id
                    ? 'bg-blue-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Pinhole Model & Similar Triangles */}
        {activeMathTab === 'pinhole' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-bold text-white font-serif">
                针孔相机与相似三角形：近大远小的代数根源
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                人眼成像原理在几何上等效于理想的针孔相机模型。设三维空间中物体的实际高度为 <MathFormula math="Y" />，
                距离人眼/镜头的纵深为 <MathFormula math="Z" />，镜头焦距（视网膜距离）为 <MathFormula math="f" />。
              </p>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-mono">依据初中欧几里得几何的相似三角形对应边成比例：</div>
                <MathFormula math="\frac{y'}{f} = \frac{Y}{Z} \implies y' = f \cdot \frac{Y}{Z}" block />
                <div className="text-xs text-slate-300 leading-relaxed">
                  结论极其深刻且直观：画纸上的投影高度 <MathFormula math="y'" />，与物体的距离 <MathFormula math="Z" /> 严格成反比例！
                  当一个物体的距离翻倍时（<MathFormula math="Z \to 2Z" />），画纸上的尺寸正好缩为原来的一半（<MathFormula math="y' \to \frac{1}{2}y'" />）。
                </div>
              </div>
            </div>

            {/* Interactive Pinhole Simulator */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-4">
              <div className="text-xs font-semibold text-amber-400 flex items-center justify-between">
                <span>实时参数模拟器</span>
                <span className="font-mono text-[11px] text-slate-400">
                  计算投影尺寸: <strong className="text-white font-mono">{((mathSimF * mathSimObjH) / mathSimZ).toFixed(1)} mm</strong>
                </span>
              </div>

              {/* Visual ray diagram */}
              <div className="h-32 bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-800">
                <svg viewBox="0 0 300 120" className="w-full h-full">
                  {/* Optical Axis */}
                  <line x1="10" y1="60" x2="290" y2="60" stroke="#475569" strokeDasharray="3 3" strokeWidth="1" />
                  {/* Pin hole / lens */}
                  <line x1="100" y1="15" x2="100" y2="105" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="100" cy="60" r="3" fill="#38bdf8" />
                  <text x="100" y="115" textAnchor="middle" fill="#38bdf8" fontSize="9">瞳孔/针孔</text>

                  {/* Object on the right */}
                  {(() => {
                    const objX = 100 + mathSimZ * 17; // 117 to 270
                    const objTopY = 60 - mathSimObjH * 4.5;
                    const objBottomY = 60 + mathSimObjH * 4.5;
                    // Inverted projected image on the left
                    const projHeight = (mathSimF * mathSimObjH * 4.5) / (mathSimZ * 17);
                    const sensorX = 100 - (mathSimF / 80) * 75;

                    return (
                      <g>
                        {/* Light rays through pinhole */}
                        <line x1={objX} y1={objTopY} x2={sensorX} y2={60 + projHeight} stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
                        <line x1={objX} y1={objBottomY} x2={sensorX} y2={60 - projHeight} stroke="#f59e0b" strokeWidth="1" opacity="0.6" />

                        {/* Real Object */}
                        <line x1={objX} y1={objTopY} x2={objX} y2={objBottomY} stroke="#10b981" strokeWidth="3" />
                        <polygon points={`${objX-3},${objTopY+6} ${objX+3},${objTopY+6} ${objX},${objTopY}`} fill="#10b981" />
                        <text x={objX} y="115" textAnchor="middle" fill="#10b981" fontSize="9">物体 (Z)</text>

                        {/* Projected Image */}
                        <line x1={sensorX} y1={60 - projHeight} x2={sensorX} y2={60 + projHeight} stroke="#ef4444" strokeWidth="2.5" />
                        <polygon points={`${sensorX-3},${60+projHeight-6} ${sensorX+3},${60+projHeight-6} ${sensorX},${60+projHeight}`} fill="#ef4444" />
                        <text x={sensorX} y="115" textAnchor="middle" fill="#ef4444" fontSize="9">纸面像 (y')</text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>物体实际距离 Z: {mathSimZ} 米</span>
                  <span>焦距 f: {mathSimF} mm</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="9"
                  step="0.5"
                  value={mathSimZ}
                  onChange={(e) => setMathSimZ(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Projective Space & Homogeneous Coordinates */}
        {activeMathTab === 'projective' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-serif">
              射影几何与齐次坐标：为什么平行线会在纸面上相交？
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              在初中学习的欧氏几何中，“平行线永不相交”是一条公理。然而在透视画中，平行的铁轨却在视平线上清晰地交于一点！
              为了从数学上统一这种现象，数学家创立了<strong className="text-amber-300">射影几何（Projective Geometry）</strong>并引入了<strong className="text-amber-300">齐次坐标（Homogeneous Coordinates）</strong>。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-amber-400 font-bold text-xs">欧氏平面 vs 射影平面 $\mathbb{RP}^2$</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  在射影平面中，二维点 <MathFormula math="(X, Y)" /> 被升维表示为三元组 <MathFormula math="[x, y, w]^T" />，且任意标量倍代表同一个点：
                  <MathFormula math="[x, y, w] \sim [\lambda x, \lambda y, \lambda w]" />。
                  普通欧氏点的映射为 <MathFormula math="X = x/w, Y = y/w" />。
                </p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-amber-400 font-bold text-xs">无穷远点即是灭点（Vanishing Point）</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  当 <MathFormula math="w = 0" /> 时，点坐标为 <MathFormula math="[d_x, d_y, 0]^T" />，此时它代表沿方向 <MathFormula math="(d_x, d_y)" /> 的<strong>无穷远点</strong>。
                  所有平行于该方向的直线在射影几何中全部交于此点。经画家的眼睛投影后，这个无穷远点就正好落在了视平线上，成为我们所画的“灭点”！
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Diagonal Splitting & Cross Ratio */}
        {activeMathTab === 'crossratio' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-serif">
              交比守恒与画家对角线等分法（如何画等距地砖与电线杆）
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              在透视中画一排间距相同的路灯，或者连续的地砖时，初学者常常苦恼：后面的路灯应该画多密？
              由于透视缩短效应是非线性的，绝不能用直尺等分。古典画师发明了精巧的<strong>对角线连线法</strong>，其背后的数学依据是<strong>射影交比不变性（Invariance of Cross-Ratio）</strong>。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-amber-400 font-semibold">实战作图 3 步法：</div>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>画出第一块透视矩形，连接其两条对角线，交点即为该平面的<strong>几何中心点</strong>。</li>
                    <li>从灭点引一条直线穿过该中心点，将矩形远边平分。</li>
                    <li>从近角向该对边中点引对角线并向外延长，与另一侧透视线相交，立刻精准求出下一根电线杆的精确位置！</li>
                  </ol>
                </div>
                <p className="text-slate-400 text-[11px]">
                  数学证明：四点在直线上的交比 <MathFormula math="(A, B; C, D) = \frac{(a-c)(b-d)}{(b-c)(a-d)}" /> 在透视投影下是严格守恒的，因此中心对称点依然精确映射为透视中心。
                </p>
              </div>

              {/* Graphic Demonstration */}
              <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 p-3 flex items-center justify-center">
                <svg viewBox="0 0 280 140" className="w-full h-full">
                  {/* Horizon and VP */}
                  <line x1="0" y1="20" x2="280" y2="20" stroke="#38bdf8" strokeDasharray="3 3" />
                  <circle cx="140" cy="20" r="3" fill="#38bdf8" />
                  <text x="140" y="14" textAnchor="middle" fill="#38bdf8" fontSize="9">灭点 VP</text>

                  {/* Ground perspective rails */}
                  <line x1="140" y1="20" x2="20" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="140" y1="20" x2="260" y2="135" stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Tile 1 */}
                  <line x1="50" y1="120" x2="230" y2="120" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="75" y1="90" x2="205" y2="90" stroke="#cbd5e1" strokeWidth="2" />
                  {/* Diagonals */}
                  <line x1="50" y1="120" x2="205" y2="90" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="230" y1="120" x2="75" y2="90" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                  {/* Center Ray */}
                  <circle cx="140" cy="103" r="2.5" fill="#f59e0b" />
                  <line x1="140" y1="20" x2="140" y2="120" stroke="#10b981" strokeWidth="1" />

                  {/* Tile 2 (calculated by projecting through midpoint) */}
                  <line x1="93" y1="68" x2="187" y2="68" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="50" y1="120" x2="140" y2="90" stroke="#ec4899" strokeWidth="1.2" />
                  <circle cx="187" cy="68" r="2.5" fill="#ec4899" />

                  <text x="210" y="65" fill="#ec4899" fontSize="8">下一块交点</text>
                </svg>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
