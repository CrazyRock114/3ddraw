import React, { useState, useRef, useEffect } from 'react';
import { Palette, PenTool, Sparkles, Eraser, RotateCcw, Download, Eye, Box, Sliders, Grid } from 'lucide-react';
import Desk3DViewer from './Desk3DViewer';

export default function CreativeStudio() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pencil'); // 'pencil', 'blend', 'eraser', 'line'
  const [pencilGrade, setPencilGrade] = useState('4B'); // '2B', '4B', '6B'
  const [brushSize, setBrushSize] = useState(3);
  const [guideOverlay, setGuideOverlay] = useState('none'); // 'none', '1point', '2point', 'anamorphic'
  
  // Undo history
  const [history, setHistory] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [lineStart, setLineStart] = useState(null);

  // 3D Desk Preview Modal
  const [show3DDesk, setShow3DDesk] = useState(false);

  // Initialize white paper
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  }, []);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(prev => [...prev.slice(-15), canvas.toDataURL()]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // remove current
    const previousState = newHistory[newHistory.length - 1];
    setHistory(newHistory);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  };

  // Load Template Outlines
  const loadTemplate = (type) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;

    if (type === 'cube') {
      // Top face
      ctx.strokeRect(0, 0, 0, 0);
      ctx.beginPath();
      ctx.moveTo(350, 100); ctx.lineTo(470, 140); ctx.lineTo(350, 180); ctx.lineTo(230, 140); ctx.closePath();
      ctx.stroke();
      // Verticals
      ctx.beginPath();
      ctx.moveTo(230, 140); ctx.lineTo(230, 270);
      ctx.moveTo(350, 180); ctx.lineTo(350, 310);
      ctx.moveTo(470, 140); ctx.lineTo(470, 270);
      ctx.stroke();
      // Bottom
      ctx.beginPath();
      ctx.moveTo(230, 270); ctx.lineTo(350, 310); ctx.lineTo(470, 270);
      ctx.stroke();
      // Detached shadow guide
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(350, 410, 120, 28, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (type === 'sphere') {
      ctx.beginPath();
      ctx.arc(350, 240, 120, 0, Math.PI * 2);
      ctx.stroke();
      // Terminator arc
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(390, 240, 60, 115, 0.1, 0, Math.PI * 2);
      ctx.stroke();
      // Shadow
      ctx.beginPath();
      ctx.ellipse(440, 355, 120, 30, 0.2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (type === 'hole') {
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(350, 180 + i * 40, 160 - i * 35, 60 - i * 14, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
    saveHistory();
  };

  // Drawing event handlers
  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    setIsDrawing(true);
    setLastPoint({ x, y });
    setLineStart({ x, y });
  };

  const draw = (e) => {
    if (!isDrawing || !lastPoint) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (tool === 'line') {
      // preview line can be drawn in a buffer or direct
      return;
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);

    if (tool === 'eraser') {
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = brushSize * 5;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else if (tool === 'blend') {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = brushSize * 4;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else {
      // Pencil mode
      const alpha = pencilGrade === '2B' ? 0.35 : pencilGrade === '4B' ? 0.65 : 0.9;
      const baseWidth = pencilGrade === '2B' ? brushSize * 0.8 : pencilGrade === '4B' ? brushSize : brushSize * 1.4;
      ctx.strokeStyle = `rgba(15, 23, 42, ${alpha})`;
      ctx.lineWidth = baseWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    setLastPoint({ x, y });
  };

  const stopDraw = (e) => {
    if (!isDrawing) return;
    if (tool === 'line' && lineStart) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

      const alpha = pencilGrade === '2B' ? 0.4 : pencilGrade === '4B' ? 0.7 : 0.95;
      ctx.strokeStyle = `rgba(15, 23, 42, ${alpha})`;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(lineStart.x, lineStart.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setIsDrawing(false);
    setLastPoint(null);
    setLineStart(null);
    saveHistory();
  };

  // Download user artwork
  const downloadArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'my-3d-drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
            <Palette className="w-3.5 h-3.5" />
            模块五 · 自由画板与三维书桌检验
          </div>
          <h1 className="text-3xl font-extrabold font-serif text-white">
            自由画板：挥洒创意，一键上桌检验
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            配备模拟素描铅笔、纸擦笔和透视直尺。画好后点击“在 3D 书桌上检验”，置入真实虚拟房间旋转视点！
          </p>
        </div>

        {/* Big 3D Desk Preview Button */}
        <button
          onClick={() => setShow3DDesk(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <Box className="w-4 h-4" />
          <span>在 3D 书桌上检验效果 ✨</span>
        </button>
      </div>

      {/* Main Studio Canvas Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Toolbar Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-4">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setTool('pencil')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'pencil' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>铅笔</span>
            </button>

            <button
              onClick={() => setTool('blend')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'blend' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>纸擦笔 (晕染)</span>
            </button>

            <button
              onClick={() => setTool('line')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'line' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>透视直尺</span>
            </button>

            <button
              onClick={() => setTool('eraser')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'eraser' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>橡皮擦</span>
            </button>
          </div>

          {/* Pencil Grades */}
          {tool !== 'eraser' && (
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-[10px] text-slate-500 px-2">浓度:</span>
              {['2B', '4B', '6B'].map(g => (
                <button
                  key={g}
                  onClick={() => setPencilGrade(g)}
                  className={`px-2.5 py-1 rounded-lg ${
                    pencilGrade === g ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          {/* Brush Size Slider */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>笔刷大小:</span>
            <input
              type="range"
              min="1"
              max="16"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono text-amber-400 w-5">{brushSize}</span>
          </div>

          {/* Guide Overlay Selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <Grid className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <span className="text-[10px] text-slate-500 px-1">透视网格:</span>
            {[
              { id: 'none', label: '无' },
              { id: '1point', label: '一点透视' },
              { id: '2point', label: '两点透视' },
              { id: 'anamorphic', label: '45°错觉梯形' },
            ].map(g => (
              <button
                key={g.id}
                onClick={() => setGuideOverlay(g.id)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  guideOverlay === g.id ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="撤销"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={downloadArtwork}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="保存画作到本地"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawing Canvas Area with Overlays */}
        <div className="relative bg-[#f8fafc] w-full h-[540px] flex items-center justify-center overflow-hidden select-none">
          {/* Perspective Guides (Semi-transparent overlay) */}
          {guideOverlay !== 'none' && (
            <svg viewBox="0 0 700 540" className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {guideOverlay === '1point' && (
                <g stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="0" y1="240" x2="700" y2="240" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1.5" />
                  <circle cx="350" cy="240" r="4" fill="#38bdf8" />
                  {[0, 100, 200, 300, 400, 500, 600, 700].map(x => (
                    <line key={x} x1="350" y1="240" x2={x} y2="540" />
                  ))}
                </g>
              )}

              {guideOverlay === '2point' && (
                <g stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="0" y1="240" x2="700" y2="240" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1.5" />
                  <circle cx="80" cy="240" r="4" fill="#f59e0b" />
                  <circle cx="620" cy="240" r="4" fill="#f59e0b" />
                  {[200, 300, 400, 500].map(x => (
                    <React.Fragment key={x}>
                      <line x1="80" y1="240" x2={x} y2="540" />
                      <line x1="620" y1="240" x2={x} y2="540" />
                    </React.Fragment>
                  ))}
                </g>
              )}

              {guideOverlay === 'anamorphic' && (
                <g stroke="rgba(16, 185, 129, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" fill="none">
                  <polygon points="120,80 580,80 480,480 220,480" />
                  <line x1="350" y1="80" x2="350" y2="480" />
                  <text x="350" y="70" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">
                    45° 视错觉拉伸参考框 (上方画得越宽越高，立起来越震撼)
                  </text>
                </g>
              )}
            </svg>
          )}

          {/* User Canvas */}
          <canvas
            ref={canvasRef}
            width={700}
            height={540}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            className="w-full h-full cursor-crosshair"
          />
        </div>

        {/* Canvas Bottom Preset Templates Bar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">快速底稿加载：</span>
            <button
              onClick={() => loadTemplate('cube')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            >
              悬浮立方体轮廓
            </button>
            <button
              onClick={() => loadTemplate('sphere')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            >
              石膏球体与五调
            </button>
            <button
              onClick={() => loadTemplate('hole')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            >
              深渊陷阱同心椭圆
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-800/40"
            >
              清空白纸
            </button>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            画板支持任意涂写 · 点击右上角“在 3D 书桌上检验”进入全景空间
          </div>
        </div>
      </div>

      {/* 3D Desk Modal */}
      {show3DDesk && (
        <Desk3DViewer
          sourceCanvas={canvasRef.current}
          onClose={() => setShow3DDesk(false)}
        />
      )}
    </div>
  );
}
