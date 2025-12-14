import { useState } from 'react';
import type { FormEvent } from 'react';
import Toast from './Toast';

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

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
        setToastMessage(result.message || 'Message sent successfully!');
        setToastType('success');
        setShowToast(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        // Error
        setToastMessage(result.error || 'Failed to send message. Please try again.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setToastMessage('Network error. Please check your connection and try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="card space-y-6">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
    </>
  );
}