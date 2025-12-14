import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error';
}

export default function Toast({ message, show, onClose, duration = 3000, type = 'success' }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const isError = type === 'error';
  const iconColor = isError ? 'text-red-400' : 'text-primary-400';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed top-24 right-8 z-[60] glass-strong rounded-lg px-4 py-3 shadow-glow 
                     border ${isError ? 'border-red-500/30' : 'border-white/20'} backdrop-blur-xl`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3">
            {isError ? (
              <svg 
                className={`w-5 h-5 ${iconColor} flex-shrink-0`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            ) : (
              <svg 
                className={`w-5 h-5 ${iconColor} flex-shrink-0`}
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
            )}
            <span className="text-neutral-100 text-sm font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
