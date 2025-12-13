import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from './Toast';

interface ContactBotProps {
  onOpen: () => void;
}

function Bot3D({ onOpen }: ContactBotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported for contact bot');
        return;
      }
    } catch (e) {
      console.warn('WebGL check failed for contact bot');
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    const size = 80;
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create a simple geometric shape (octahedron for a futuristic look)
    const geometry = new THREE.OctahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x4c1d95,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Add subtle light
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    let time = 0;
    const animate = () => {
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      time += 0.01;

      if (meshRef.current) {
        meshRef.current.rotation.x = time * 0.5;
        meshRef.current.rotation.y = time * 0.7;

        // Gentle float
        meshRef.current.position.y = Math.sin(time * 2) * 0.1;

        // Hover effect
        if (isHovered) {
          meshRef.current.scale.setScalar(1.1);
          material.emissiveIntensity = 0.5;
        } else {
          meshRef.current.scale.setScalar(1);
          material.emissiveIntensity = 0.2;
        }
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

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
    animate();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
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
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="w-20 h-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
    />
  );
}

export default function ContactBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const copyEmail = () => {
    const email = 'contact@lucasmigoski.com.ar';
    navigator.clipboard.writeText(email).then(() => {
      setShowToast(true);
    }).catch(() => {
      // Fallback if clipboard API fails
      setShowToast(true);
    });
  };

  return (
    <>
      <motion.button
        className="fixed bottom-8 right-8 z-50 w-20 h-20 rounded-full glass-strong hover:shadow-glow 
                   flex items-center justify-center focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
                   focus:ring-offset-neutral-950 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open contact panel"
      >
        <Bot3D onOpen={() => setIsOpen(true)} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-8 z-50 w-96 max-w-[calc(100vw-4rem)] glass-strong rounded-2xl p-6 
                       shadow-glow-lg backdrop-blur-xl border border-white/20"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold gradient-text">Get in Touch</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors focus:ring-2 focus:ring-primary-500 rounded p-1"
                aria-label="Close contact panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-neutral-300 text-sm">
                Want to work together or have a question? Copy my email or use the contact form below.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={copyEmail}
                  className="flex-1 btn-primary text-sm"
                  aria-label="Copy email address"
                >
                  Copy Email
                </button>
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 btn-secondary text-sm text-center"
                >
                  Contact Form
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast 
        message="Email copied to clipboard!" 
        show={showToast} 
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
