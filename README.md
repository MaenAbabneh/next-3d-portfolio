# 🐾 Interactive 3D Portfolio

A high-performance, immersive 3D portfolio universe built with Next.js, Three.js, and GSAP. This project blends technical software engineering with creative motion design to showcase projects in a "locked 60fps" interactive environment.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-black?logo=three.js)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-green?logo=greensock)](https://greensock.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

![Portfolio Demo Preview](https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775844757/room-banner_mdfips.png)

## 👨‍💻 Live Demo

**Website:** [https://maenababneh.com](https://maenababneh.com)

## ✨ Core Features

* **Immersive 3D Environment**: A fully interactive 3D room built with `@react-three/fiber` and `@react-three/drei`.
* **Dynamic MDX Blog**: A robust article system using MDX for high-quality technical writing with dynamic slugs and canonical links.
* **Performance Optimized**: Hard-targeted 60fps animations using GSAP and optimized React rendering with Turbopack support.
* **Bilingual SEO**: Full English and Arabic integration with optimized metadata for both languages.
* **Interactive Accessories**:
    * **Pino & Fish**: Animated characters within the 3D scene.
    * **Interactive Screen**: A working virtual monitor for browsing content.
    * **Custom Piano**: A playable 3D piano with spatial audio and dedicated settings.
* **Audio System**: Integrated background music (BGM) and UI sound effects (SFX) managed via Zustand.

## 🛠️ Technical Stack

* **Framework**: [Next.js 16](https://nextjs.org/)
* **3D Engine**: [Three.js](https://threejs.org/) with [R3F](https://github.com/pmndrs/react-three-fiber)
* **Animation**: [GSAP](https://greensock.com/gsap/) 
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand)
* **Backend/Database**: [Upstash Redis](https://upstash.com/) for view counts and engagement analytics.

## 🚀 Getting Started

### Prerequisites

* Node.js 18.x or later
* npm or pnpm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/maenababneh/next-3d-portfolio.git](https://github.com/maenababneh/next-3d-portfolio.git)
    cd next-3d-portfolio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env.local` file and add your Upstash and Cloudinary credentials.

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📁 Project Structure

* `app/`: Next.js App Router, Metadata, and SEO configurations (Robots & Sitemap).
* `components/room/`: Core 3D scene, camera logic, and environmental effects.
* `components/accessories/`: Individual interactive 3D models and UI triggers.
* `content/articles/`: MDX source files for the technical blog.
* `store/`: Zustand global state for audio, settings, and UI overlays.

## 📧 Contact

**Maen Ababneh** - Full-Stack Developer & Software Engineer

* **GitHub**: [github.com/maenababneh](https://github.com/maenababneh)
* **LinkedIn**: [Maen Ababneh](https://www.linkedin.com/in/maenababneh/)
* **Portfolio**: [maenababneh.com](https://maenababneh.com)

---
*Created with passion by Maen Ababneh. 🐾*
