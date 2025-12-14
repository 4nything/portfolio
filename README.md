# Luca Smigoski - Personal Portfolio

A premium, production-grade personal developer portfolio built with Astro, Tailwind CSS, React, and Three.js. Features a modern design with glassmorphism effects, smooth animations, 3D interactive elements, and full accessibility support.

## 🚀 Features

- **Modern Stack**: Astro + Tailwind CSS + React (islands) + Three.js
- **3D Elements**: Animated particle background and floating contact bot widget
- **Premium Design**: Glassmorphism, gradient accents, smooth micro-interactions
- **Performance Optimized**: Code splitting, lazy loading, reduced motion support
- **Fully Accessible**: Keyboard navigation, ARIA labels, focus styles
- **SEO Ready**: Meta tags, semantic HTML, optimized structure
- **Responsive**: Mobile-first design for all screen sizes
- **Cloudflare Pages**: Configured for deployment on Cloudflare Pages with serverless functions

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:4321` in development mode.

## 🏗️ Project Structure

```
/
├── functions/            # Cloudflare Pages Functions
│   └── api/
│       └── contact.ts   # Contact form API endpoint
├── public/              # Static assets (images, favicons)
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── islands/     # React interactive components
│   │   │   ├── Background3D.tsx    # 3D particle background
│   │   │   ├── ContactBot.tsx      # Floating 3D contact widget
│   │   │   ├── ContactForm.tsx     # Contact form with API integration
│   │   │   ├── ScrollReveal.tsx    # Scroll animation wrapper
│   │   │   └── Toast.tsx           # Toast notifications
│   │   ├── sections/    # Astro section components
│   │   │   ├── Hero.astro
│   │   │   ├── About.astro
│   │   │   ├── Experience.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Contact.astro
│   │   │   └── Footer.astro
│   │   └── Navigation.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs     # Astro configuration with Cloudflare adapter
├── tailwind.config.mjs  # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## ☁️ Cloudflare Pages Functions

This project is configured to use Cloudflare Pages Functions for serverless API endpoints. The contact form uses a serverless function located at `functions/api/contact.ts`.

### Contact Form API

The contact form endpoint is available at `/api/contact` and accepts POST requests with the following format:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'd like to discuss a project..."
}
```

### Customizing the Contact Function

To add email notifications or database storage, update `functions/api/contact.ts`:

1. **Email Notifications**: Integrate with services like:
   - [Resend](https://resend.com/) (recommended for Cloudflare)
   - SendGrid
   - Mailgun

2. **Database Storage**: Use Cloudflare's data storage options:
   - [D1](https://developers.cloudflare.com/d1/) - SQLite database
   - [KV](https://developers.cloudflare.com/kv/) - Key-value store
   - External databases via fetch

3. **Environment Variables**: Add secrets in Cloudflare Pages dashboard:
   - Go to Settings → Environment Variables
   - Add variables like `RESEND_API_KEY`, `DB_URL`, etc.
   - Access via `context.env.YOUR_VARIABLE` in functions

### Example: Adding Resend Email Integration

```typescript
// In functions/api/contact.ts
const RESEND_API_KEY = context.env.RESEND_API_KEY;

const emailResponse = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Portfolio <noreply@yourdomain.com>',
    to: ['contact@lucasmigoski.com.ar'],
    subject: `New Contact: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  }),
});
```

## 🚀 Deployment

### Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Deploy!

The Cloudflare adapter is already configured in `astro.config.mjs`.

### Environment Variables

Add any required environment variables in the Cloudflare Pages dashboard:
- Settings → Environment Variables
- Add production/preview variables as needed

## 🔧 Development

### Running Locally

```bash
npm run dev
```

For local testing of Cloudflare Functions, use Wrangler:

```bash
npx wrangler pages dev dist
```

## 📝 License

This project is private and proprietary.

## 👤 Author

**Luca Smigoski**
- Website: https://lucasmigoski.com.ar
- Email: contact@lucasmigoski.com.ar
- GitHub: [@4nything](https://github.com/4nything)
- LinkedIn: [Luca Smigoski](https://www.linkedin.com/in/luca-smigoski/)
