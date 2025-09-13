# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a personal portfolio website showcasing Quang Nguyen's work and skills. The project is built as a modern single-page application using Vite and vanilla JavaScript, with automatic deployment to GitHub Pages.

### Technology Stack
- **Build Tool**: Vite 6.3.3 (ES modules)
- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Custom Properties (CSS Variables)
- **Deployment**: GitHub Pages via GitHub Actions
- **Version Control**: Git with GitHub

### Project Structure
- `src/main.js` - Application entry point that initializes all components
- `src/components/` - Reusable UI components (navbar, footer)
- `src/sections/` - Page sections (hero, about, skills, projects, certificates, resume)
- `src/utils/` - Utility functions (animations, theme management)
- `src/styles/` - CSS files organized by purpose (reset, variables, animations, main styles)
- `public/` - Static assets (images, resume PDF, favicon)
- `Old website/` - Previous React/TypeScript version (deprecated)

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev
# Opens at http://localhost:5173

# Preview production build locally
npm run preview
```

### Build and Deployment
```bash
# Create production build
npm run build
# Outputs to ./dist directory

# Deploy to GitHub Pages (automatic via GitHub Actions on main branch push)
# Manual deployment not typically needed
```

## Architecture and Code Organization

### Component System
The application uses a modular component-based architecture without a framework:
- Each section is initialized through `src/main.js`
- Components are self-contained modules with their own styles and logic
- All components export an `init` function that sets up DOM content and event listeners

### Styling Architecture
- CSS Custom Properties defined in `src/styles/variables.css` for consistent theming
- Design system with predefined color palettes, typography scales, and spacing
- Dark/light mode support via CSS `prefers-color-scheme` and `[data-theme]` attributes
- Glassmorphism effects and animations throughout
- Responsive design with mobile-first approach

### Project Data Management
- Project information is stored as JavaScript objects in `src/sections/projects.js`
- Projects are categorized by status: `release`, `alpha`, `beta`, `complete`, `in development`, `on hold`
- Technology icons and status colors are configurable via object mappings
- Supports GitHub, GitLab, and external links for each project

### Animation System
- Custom animation utilities in `src/utils/animations.js`
- Reveal animations on scroll with Intersection Observer patterns
- Smooth transitions and hover effects using CSS custom properties
- Skill progress bar animations triggered by section visibility

## GitHub Pages Deployment

The site automatically deploys to GitHub Pages via GitHub Actions workflow (`.github/workflows/deploy.yml`):
- Triggers on pushes to `main` branch
- Uses Node.js 18 with npm caching
- Builds with `npm run build` and uploads `./dist` folder
- Configured for GitHub Pages environment

### Build Configuration
- Vite configured for GitHub Pages deployment (base path handling)
- ES module output format
- Assets organized in `./dist/assets/` directory
- Automatic code splitting and optimization

## Common Development Patterns

### Adding New Sections
1. Create new file in `src/sections/[name].js`
2. Export `init[Name]` function that sets up DOM and event listeners
3. Add section HTML element to `src/main.js` template
4. Import and call init function in `src/main.js`
5. Add navigation link to `src/components/navbar.js`

### Adding New Projects
1. Add project object to `projectsData` array in `src/sections/projects.js`
2. Include required fields: `id`, `title`, `category`, `image`, `description`, `tags`, `status`
3. Add `fullDescription` with HTML for expanded view
4. Include appropriate links (`githubLink`, `gitlabLink`, `externalLink`)

### Styling Guidelines
- Use CSS Custom Properties from `src/styles/variables.css`
- Follow the established color system and spacing scale
- Maintain glassmorphism design patterns with `backdrop-filter` and transparency
- Ensure responsive behavior with appropriate breakpoints
- Test both light and dark color schemes

### Animation Implementation
- Use `.reveal` class for scroll-triggered animations
- Add appropriate delay classes (`.delay-200`, `.delay-300`, etc.)
- Implement smooth transitions using CSS custom property values
- Consider performance impact of animations and use `transform` over layout properties

## File Management

### Images and Assets
- Project images: `public/images/`
- Technology icons: `public/icons/`
- Resume and documents: `public/`
- Favicon: `public/Letter-Q-.png`

### CSS Organization
- Global styles and resets: `src/styles/reset.css`
- Design system variables: `src/styles/variables.css`
- Animation definitions: `src/styles/animations.css`
- Main application styles: `src/styles/style.css`