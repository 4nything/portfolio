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
├── public/              # Static assets (images, favicons)
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── islands/     # React interactive components
│   │   │   ├── Background3D.tsx    # 3D particle background
│   │   │   ├── ContactBot.tsx      # Floating 3D contact widget
│   │   │   └── ScrollReveal.tsx    # Scroll animation wrapper
│   │   ├── sections/    # Astro section components
│   │   │   ├── Hero.astro
│   │   │   ├── About.astro
│   │   │   ├── Experience.astro
│   │   │   ├── Projects.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Contact.astro
│   │   │   └── Footer.astro
│   │   └── Navigation.astro
│   ├── layouts/
│   │   └── BaseLayout.astro    # Base layout with SEO & meta
│   ├── pages/
│   │   └── index.astro         # Main page
│   ├── styles/
│   │   └── global.css          # Global styles & Tailwind setup
│   └── env.d.ts
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 📝 Content Replacement Guide

### 1. Personal Information

**Hero Section** (`src/components/sections/Hero.astro`):
- Line ~11: Update name "Luca Smigoski" to your name
- Line ~16: Update role "Software Engineer" to your role
- Line ~20-23: Replace lorem ipsum description with your bio

**Footer** (`src/components/sections/Footer.astro`):
- Line ~8: The footer already includes "Designed & built by Luca Smigoski" - update to your name

**Navigation** (`src/components/Navigation.astro`):
- Line ~10: Update "Luca Smigoski" link text to your name

**SEO & Meta** (`src/pages/index.astro`):
- Lines 12-13: Update title and description for SEO

### 2. Social Media Links

**Hero Section** (`src/components/sections/Hero.astro`):
- Lines ~38-73: Update the `href` attributes for social icons (GitHub, LinkedIn, Twitter, Email)
- Replace `#` placeholders with your actual social media URLs

**Contact Section** (`src/components/sections/Contact.astro`):
- Line ~93: Update email `luca@example.com` to your actual email
- Lines ~95-120: Update social links

**Contact Bot** (`src/components/islands/ContactBot.tsx`):
- Line ~93: Update placeholder email `luca@example.com` to your actual email

### 3. About Section

**About Section** (`src/components/sections/About.astro`):
- Lines ~11-16: Replace lorem ipsum with your actual bio
- Lines ~24-57: Update tech stack badges - replace placeholder tech names and icons
- Lines ~61-73: Update highlights/metrics cards with your actual achievements

### 4. Experience Section

**Experience Section** (`src/components/sections/Experience.astro`):
- Lines ~7-35: Replace the `experiences` array with your actual work history
  - Update `title`, `company`, `period`, `description`, and `tech` arrays
  - Add or remove experience entries as needed

### 5. Projects Section

**Projects Section** (`src/components/sections/Projects.astro`):
- Lines ~7-40: Replace the `projects` array with your actual projects
  - Update `title`, `description`, and `tech` arrays
  - Set `featured: true` for one project to feature it prominently
  - Update links in buttons (lines ~52, ~69) when you have project URLs
  - Currently shows placeholder preview images - replace with actual project screenshots in `public/` folder

### 6. Skills Section

**Skills Section** (`src/components/sections/Skills.astro`):
- Lines ~7-48: Update the `skillCategories` array with your actual skills
  - Modify categories (Frontend, Backend, DevOps, Tools) as needed
  - Update skill names and proficiency levels (0-100)
  - Add or remove skills/categories

### 7. Images & Assets

**Profile Picture** (if you want to add one):
- Add your profile image to `public/profile.jpg`
- Reference it in components as `/profile.jpg`

**Project Images**:
- Add project screenshots/previews to `public/` folder
- Update image paths in `Projects.astro` (currently using placeholder divs)

**Favicon**:
- Replace `public/favicon.png` with your own favicon

### 8. Color Scheme (Optional)

**Tailwind Config** (`tailwind.config.mjs`):
- Lines ~6-40: Update color palette in the `theme.extend.colors` section
- Primary colors: Currently purple (`primary`) and blue (`accent`)
- Adjust to match your brand/theme

**Global Styles** (`src/styles/global.css`):
- Line ~11: Update CSS custom properties if you change color scheme

### 9. Contact Form

**Contact Section** (`src/components/sections/Contact.astro`):
- The form is currently non-functional (placeholder)
- To make it functional:
  1. Set up a form handler service (Formspree, Netlify Forms, etc.)
  2. Update the `form` action attribute and method
  3. Add form validation and submission handling

## 🎨 Design System

### Colors
- **Primary**: Purple (`primary-500`: #a855f7)
- **Accent**: Blue (`accent-500`: #0ea5e9)
- **Neutral**: Dark theme with white/transparent overlays

### Typography
- **Sans**: Inter (body text)
- **Mono**: Fira Code (code/technical text)

### Components
- Glass cards with backdrop blur
- Gradient text effects
- Hover animations and micro-interactions
- Scroll reveal animations (with reduced motion support)

## 🔧 Configuration

### Performance Optimizations
- 3D components use `client:load` for progressive enhancement
- Canvas resolution capped at devicePixelRatio max 2
- Animations pause when tab is hidden
- Reduced motion preferences respected

### Accessibility
- Keyboard navigation throughout
- Focus styles on all interactive elements
- ARIA labels on icons and buttons
- Semantic HTML structure
- Reduced motion support

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- WebGL support required for 3D elements (graceful fallback included)
- Progressive enhancement for older browsers

## 🚀 Deployment

### Build Command
```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment to:
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- Any static hosting service

### Environment Variables
No environment variables required for basic functionality. Add them if you implement:
- Contact form backend
- Analytics
- API integrations

## 📄 License

This portfolio is personal work. Feel free to use as inspiration, but replace all content with your own.

## 🤝 Credits

- Built with [Astro](https://astro.build)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- 3D powered by [Three.js](https://threejs.org)
- Animations with [Framer Motion](https://www.framer.com/motion/)

---

**Designed & built by Luca Smigoski**
