import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        setSubmitStatus('success');
        
        // Reset form after animation
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
          setSubmitStatus('idle');
        }, 3000);
      } else {
        // Error
        setSubmitStatus('error');
        
        // Reset error state after animation
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      
      // Reset error state after animation
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Loading overlay */}
        <AnimatePresence>
          {isSubmitting && submitStatus === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-12 h-12 mx-auto relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 border-2 border-primary-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <motion.div
                    className="absolute inset-2 border-2 border-accent-500 border-t-transparent rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-neutral-300 text-sm font-medium"
                >
                  Sending your message...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success overlay */}
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
              className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-accent-500/20 to-primary-500/20 backdrop-blur-md rounded-xl z-20 flex items-center justify-center"
            >
              <div className="text-center space-y-6 relative">
                {/* Large animated checkmark */}
                <motion.div
                  className="w-24 h-24 mx-auto relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1
                  }}
                >
                  {/* Background circle pulse */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary-500/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                  {/* Checkmark circle */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2
                    }}
                  >
                    <motion.svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4,
                        ease: 'easeOut'
                      }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </motion.div>
                </motion.div>
                
                {/* Success text */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <motion.h3
                    className="text-2xl font-bold text-white"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                  >
                    Message Sent!
                  </motion.h3>
                  <motion.p
                    className="text-neutral-200 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    I'll get back to you soon.
                  </motion.p>
                </motion.div>

                {/* Particles effect */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary-400 rounded-full"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      x: [
                        Math.cos((i * 30) * Math.PI / 180) * 100,
                        Math.cos((i * 30) * Math.PI / 180) * 150,
                      ],
                      y: [
                        Math.sin((i * 30) * Math.PI / 180) * 100,
                        Math.sin((i * 30) * Math.PI / 180) * 150,
                      ],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.5 + i * 0.05,
                      ease: 'easeOut',
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error overlay with glow */}
        <AnimatePresence>
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500/10 border-2 border-red-500/50 rounded-xl z-10 pointer-events-none"
            >
              <motion.div
                className="absolute inset-0 bg-red-500/20 rounded-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error shake animation */}
        <motion.form
          onSubmit={handleSubmit}
          className="card space-y-6 relative"
          animate={
            submitStatus === 'error'
              ? {
                  x: [0, -10, 10, -10, 10, -5, 5, 0],
                  transition: {
                    duration: 0.5,
                    ease: 'easeInOut'
                  }
                }
              : {}
          }
        >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg 
                       text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 
                       focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg 
                       text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 
                       focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg 
                       text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 
                       focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="What's this about?"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg 
                       text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 
                       focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            placeholder="Your message here..."
          ></textarea>
        </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            aria-label="Send message"
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.span
                  key="sending"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2"
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  Sending...
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Send Message
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      </div>
    </>
  );
}