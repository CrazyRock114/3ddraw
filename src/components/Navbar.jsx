import React from 'react';
import { Compass, SunMedium, Eye, BookOpen, Palette, Sparkles, Box } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: '奥秘导读', icon: Sparkles, badge: 'Overview' },
    { id: 'perspective', label: '透视几何', icon: Compass, badge: 'Projective' },
    { id: 'shading', label: '光影明暗', icon: SunMedium, badge: 'Lambert' },
    { id: 'anamorphic', label: '视错觉立绘', icon: Eye, badge: 'Illusion' },
    { id: 'tutorials', label: '新手实战', icon: BookOpen, badge: '4 Lessons' },
    { id: 'studio', label: '画板与3D检验', icon: Palette, badge: 'Sandbox' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Box className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wide text-white font-serif">3D Drawing</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                Academy
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">立体绘画教学与数学原理</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`hidden md:inline-block text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
