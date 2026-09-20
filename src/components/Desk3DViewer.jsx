import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCw, Sun, Moon, Maximize2, X, Sparkles } from 'lucide-react';

export default function Desk3DViewer({ sourceCanvas, onClose }) {
  const mountRef = useRef(null);
  const [cameraPreset, setCameraPreset] = useState('illusion'); // 'top', 'illusion', 'side'
  const [lightingMode, setLightingMode] = useState('warm'); // 'warm', 'day'
  
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const paperMeshRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Initial position for 45° anamorphic angle
    camera.position.set(0, 4.2, 5.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const deskLight = new THREE.SpotLight(0xfff3d6, 2.8);
    deskLight.position.set(-3.5, 6, 3.5);
    deskLight.angle = Math.PI / 4;
    deskLight.penumbra = 0.5;
    deskLight.castShadow = true;
    deskLight.shadow.mapSize.width = 1024;
    deskLight.shadow.mapSize.height = 1024;
    scene.add(deskLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.4);
    fillLight.position.set(3, 4, -2);
    scene.add(fillLight);

    // 5. Wooden Desk Tabletop
    const deskGeometry = new THREE.PlaneGeometry(16, 12);
    const deskMaterial = new THREE.MeshStandardMaterial({
      color: 0x271e18, // Rich walnut wood tone
      roughness: 0.6,
      metalness: 0.1,
    });
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    desk.rotation.x = -Math.PI / 2;
    desk.position.y = -0.01;
    desk.receiveShadow = true;
    scene.add(desk);

    // 6. Sketchbook Paper Sheet with User Canvas as Texture
    const paperGeometry = new THREE.PlaneGeometry(3.6, 2.8);
    let paperTexture;
    if (sourceCanvas) {
      paperTexture = new THREE.CanvasTexture(sourceCanvas);
      paperTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    } else {
      // Fallback blank canvas
      const dummy = document.createElement('canvas');
      dummy.width = 512;
      dummy.height = 512;
      const ctx = dummy.getContext('2d');
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 512, 512);
      paperTexture = new THREE.CanvasTexture(dummy);
    }

    const paperMaterial = new THREE.MeshStandardMaterial({
      map: paperTexture,
      roughness: 0.9,
      metalness: 0.05,
    });
    const paperMesh = new THREE.Mesh(paperGeometry, paperMaterial);
    paperMesh.rotation.x = -Math.PI / 2;
    paperMesh.position.set(0, 0.01, 0);
    paperMesh.receiveShadow = true;
    paperMesh.castShadow = true;
    scene.add(paperMesh);
    paperMeshRef.current = paperMesh;

    // 7. Desk Props (Vintage Lamp, Pencil, Coffee Mug)
    // Coffee Mug
    const mugGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.8, 24);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-2.4, 0.4, -0.6);
    mug.castShadow = true;
    scene.add(mug);

    // Wooden Pencil
    const pencilGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12);
    const pencilMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const pencil = new THREE.Mesh(pencilGeo, pencilMat);
    pencil.rotation.z = Math.PI / 2 + 0.2;
    pencil.position.set(2.4, 0.04, 0.5);
    pencil.castShadow = true;
    scene.add(pencil);

    // Rubber Eraser
    const eraserGeo = new THREE.BoxGeometry(0.5, 0.15, 0.8);
    const eraserMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
    const eraser = new THREE.Mesh(eraserGeo, eraserMat);
    eraser.rotation.y = 0.4;
    eraser.position.set(2.5, 0.075, -0.8);
    eraser.castShadow = true;
    scene.add(eraser);

    // 8. Interactive Orbit Controls (Manual dragging & Touch support)
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let initialPinchDist = null;
    let spherical = { radius: 6.8, theta: Math.PI / 4, phi: 0 }; // spherical coordinates

    const updateCamera = () => {
      // Clamp theta (altitude) so it doesn't go below desk
      spherical.theta = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.theta));
      const x = spherical.radius * Math.sin(spherical.theta) * Math.sin(spherical.phi);
      const y = spherical.radius * Math.cos(spherical.theta);
      const z = spherical.radius * Math.sin(spherical.theta) * Math.cos(spherical.phi);
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

      spherical.phi -= deltaX * 0.008;
      spherical.theta += deltaY * 0.008;
      updateCamera();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch controls for mobile / tablet
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDragging = false;
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouse.x;
        const deltaY = e.touches[0].clientY - prevMouse.y;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        spherical.phi -= deltaX * 0.008;
        spherical.theta += deltaY * 0.008;
        updateCamera();
      } else if (e.touches.length === 2 && initialPinchDist) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = initialPinchDist - dist;
        spherical.radius = Math.max(3.5, Math.min(10, spherical.radius + diff * 0.01));
        initialPinchDist = dist;
        updateCamera();
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      initialPinchDist = null;
    };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(3.5, Math.min(10, spherical.radius + e.deltaY * 0.005));
      updateCamera();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 9. Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 10. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [sourceCanvas]);

  // Preset camera angle transitions
  const setPresetAngle = (type) => {
    setCameraPreset(type);
    const camera = cameraRef.current;
    if (!camera) return;

    if (type === 'top') {
      camera.position.set(0, 6.8, 0.01);
      camera.lookAt(0, 0, 0);
    } else if (type === 'illusion') {
      camera.position.set(0, 4.2, 5.2);
      camera.lookAt(0, 0, 0);
    } else if (type === 'side') {
      camera.position.set(0, 1.8, 6.2);
      camera.lookAt(0, 0, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                3D 书桌实景检验台
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Three.js 渲染
                </span>
              </h3>
              <p className="text-xs text-slate-400">鼠标按住自由拖拽旋转视角，检验纸上绘画在三维空间的立体感</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Viewport */}
        <div ref={mountRef} className="flex-1 relative bg-slate-950 cursor-grab active:cursor-grabbing">
          {/* Preset Buttons Floating on the 3D Canvas */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-1.5 rounded-2xl flex items-center gap-1.5 z-10 text-xs">
            <button
              onClick={() => setPresetAngle('illusion')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                cameraPreset === 'illusion' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              ✨ 黄金错觉视角 (45°)
            </button>

            <button
              onClick={() => setPresetAngle('top')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                cameraPreset === 'top' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              📐 俯视全貌 (90°)
            </button>

            <button
              onClick={() => setPresetAngle('side')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                cameraPreset === 'side' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              🔍 掠射侧视 (15°)
            </button>
          </div>

          <div className="absolute bottom-4 left-4 pointer-events-none bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <span>🖱️ 鼠标滚轮可放大缩小 · 拖拽旋转桌面视线</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>真实的台灯投影与木质纹理环境，直观还原摄影机拍出的立体视错觉</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
          >
            返回画板继续绘制
          </button>
        </div>
      </div>
    </div>
  );
}
