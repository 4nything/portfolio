import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, show, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-24 right-8 z-[60] glass-strong rounded-lg px-4 py-3 shadow-glow 
                     border border-white/20 backdrop-blur-xl"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            <svg 
              className="w-5 h-5 text-primary-400 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <span className="text-neutral-100 text-sm font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
