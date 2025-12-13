import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported');
        return;
      }
    } catch (e) {
      console.warn('WebGL check failed');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '0';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particle system - lightweight and performant
    const particleCount = prefersReducedMotion ? 200 : 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xa855f7); // primary-500
    const color2 = new THREE.Color(0x0ea5e9); // accent-500

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation
    let time = 0;
    const animate = () => {
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      time += 0.005;
      
      // Slow rotation
      particles.rotation.x = time * 0.1;
      particles.rotation.y = time * 0.15;

      // Gentle floating movement
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + positions[i] * 0.1) * 0.0001;
        positions[i + 1] += Math.cos(time + positions[i + 1] * 0.1) * 0.0001;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      } else {
        animate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
