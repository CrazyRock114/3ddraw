# 3D Drawing Academy (立体绘画教学与数学原理)

> 深入浅出教会零基础初学者如何画出有立体效果的图画，并系统讲解其中的数学几何与物理原理。

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.170-black.svg)](https://threejs.org)
[![KaTeX](https://img.shields.io/badge/KaTeX-Math-green.svg)](https://katex.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com)

---

## 🎨 项目特色

1. **射影透视学实验室 (Perspective Lab)**
   - 交互式拖拽**视平线（Eye Level）**与**灭点（VP1 / VP2 / VP3）**。
   - 实时演示 1点透视、2点透视与3点透视下的立方体几何形变与投影辐射线。
   - **数学公式推导**：针孔相机相似三角形模型（$x' = f \frac{X}{Z}$）、射影平面 $\mathbb{RP}^2$ 与齐次坐标、交比守恒与画家对角线分割法。

2. **朗伯光影与素描五大调 (Shading Lab)**
   - 360° 拖拽虚拟光源方位角与高度角，实时渲染石膏球与圆柱体。
   - **表面微元数学探针**：鼠标悬停实时计算表面法向量 $\vec{N}$、光照向量 $\vec{L}$、入射角 $\theta$ 以及基于朗伯漫反射定律 $I = I_0 \cdot \max(0, \vec{N} \cdot \vec{L})$ 的精确亮度。
   - 一键分离高亮高光（Highlight）、灰面（Halftone）、明暗交界线（Terminator）、地面反光（Bounce）与地面投影（Shadow）。

3. **视错觉与折纸立体画 (Anamorphic Lab)**
   - 悬浮魔方、90°折纸通天梯、纸面黑洞陷阱三大经典错觉。
   - **摄影机角度滑块**：从 0°（纸面真实拉伸图）滑动到 55°（黄金拍摄视点），体验平面图形瞬间“破纸直立、腾空而起”的视觉冲击。
   - **单应性逆透视矩阵推导**：解析 8 自由度平面射影变换（Homography Matrix $\mathbf{H}$）与视错觉三大作画秘笈。

4. **零基础初学者 4 门经典分步实战工坊 (Step-by-Step Lessons)**
   - 实战 1：1分钟掌握“悬浮正方体”
   - 实战 2：纸面深渊黑洞陷阱
   - 实战 3：90°折纸通天阶梯
   - 实战 4：从圆圈到超写实石膏球
   - 配备半透明步骤指引虚线，支持初学者在线跟画临摹。

5. **自由创作画板与 3D 书桌实景检验台 (Creative Studio & 3D Desk)**
   - 提供 2B / 4B / 6B 铅笔、纸擦笔（晕染）、透视直尺与橡皮擦。
   - **Three.js 3D 书桌实景检验台**：画完后一键将作品置于放有台灯、铅笔与咖啡杯的虚拟 3D 书桌上，支持 360° 自由旋转轨道检验真实立体效果！

---

## 🛠️ 本地开发

```bash
# 克隆仓库
git clone https://github.com/CrazyRock114/3ddraw.git
cd 3ddraw

# 安装依赖
npm install

# 启动本地开发服务
npm run dev

# 生产构建
npm run build
```

---

## 📄 开源许可

MIT License
