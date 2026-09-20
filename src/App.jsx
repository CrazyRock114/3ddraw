import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import PerspectiveLab from './components/PerspectiveLab';
import ShadingLab from './components/ShadingLab';
import AnamorphicLab from './components/AnamorphicLab';
import StepByStepStudio from './components/StepByStepStudio';
import CreativeStudio from './components/CreativeStudio';
import { Box, Heart, BookOpen, Compass, SunMedium, Eye, Palette } from 'lucide-react';

// Error Boundary component to prevent blank screen crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-slate-900 border border-red-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-white font-serif">模块渲染出现意外</h2>
          <p className="text-xs text-slate-400 font-mono">
            {this.state.error?.message || "未知运行时异常"}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow hover:bg-amber-400 transition-all"
          >
            刷新重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area with ErrorBoundary */}
      <main className="flex-1 pb-16">
        <ErrorBoundary>
          {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
          {activeTab === 'perspective' && <PerspectiveLab />}
          {activeTab === 'shading' && <ShadingLab />}
          {activeTab === 'anamorphic' && <AnamorphicLab />}
          {activeTab === 'tutorials' && <StepByStepStudio />}
          {activeTab === 'studio' && <CreativeStudio />}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 px-4 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200 font-serif text-sm">3D Drawing Academy</div>
              <div className="text-[11px] text-slate-500">立体绘画教学与数学几何原理交互探索平台</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <button onClick={() => setActiveTab('perspective')} className="hover:text-amber-400 transition-colors">
              射影透视学
            </button>
            <button onClick={() => setActiveTab('shading')} className="hover:text-amber-400 transition-colors">
              朗伯漫反射
            </button>
            <button onClick={() => setActiveTab('anamorphic')} className="hover:text-amber-400 transition-colors">
              单应性错觉
            </button>
            <button onClick={() => setActiveTab('tutorials')} className="hover:text-amber-400 transition-colors">
              4堂实战课
            </button>
            <button onClick={() => setActiveTab('studio')} className="hover:text-amber-400 transition-colors">
              3D书桌沙盒
            </button>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>用科学透视与严谨数学，点亮艺术之美</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
