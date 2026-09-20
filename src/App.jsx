import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import PerspectiveLab from './components/PerspectiveLab';
import ShadingLab from './components/ShadingLab';
import AnamorphicLab from './components/AnamorphicLab';
import StepByStepStudio from './components/StepByStepStudio';
import CreativeStudio from './components/CreativeStudio';
import { Box, Heart, BookOpen, Compass, SunMedium, Eye, Palette } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === 'perspective' && <PerspectiveLab />}
        {activeTab === 'shading' && <ShadingLab />}
        {activeTab === 'anamorphic' && <AnamorphicLab />}
        {activeTab === 'tutorials' && <StepByStepStudio />}
        {activeTab === 'studio' && <CreativeStudio />}
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
