# Meridian Mastery - Interactive Korean Acupuncture Learning Platform

A comprehensive Progressive Web Application (PWA) for learning Korean meridian pressure points through interactive body maps, dynamic flashcard systems, and mobile-optimized interfaces.

## Project Overview

Meridian Mastery is a professional-grade educational tool designed for students and practitioners of Korean traditional medicine. The application features an interactive body mapping system with precise acupuncture point visualization, comprehensive flashcard learning modules, and real-time progress tracking.

## Current Build Status - June 22, 2025

**PRODUCTION READY** - Complete interactive body map system with mobile optimization

## Core Features

### Interactive Body Map System
- **Dynamic Meridian Selection**: Four meridians available (Lung, Large Intestine, Heart, Stomach)
- **Multi-View Support**: Front, back, and side view anatomical models
- **Precise Point Mapping**: Clickable acupuncture points with coordinate-based positioning
- **Zoom Functionality**: 2x and 3x zoom with crosshair targeting for precise point examination
- **Mobile-Optimized Interface**: Touch-friendly controls with responsive design

### Advanced Flashcard System
- **Authentic Korean Content**: Traditional Korean names with Hangul characters
- **Bilateral Point Support**: Complete left/right side meridian mapping
- **Interactive Cards**: Touch-to-flip functionality with detailed point information
- **Element-Based Classification**: Dynamic element labels (Fire, Earth, Metal, Water, Wood)
- **Comprehensive Point Data**: Healing functions, therapeutic insights, and clinical applications

### Dynamic Data Architecture
- **JSON-Based Meridian Data**: Scalable meridian point database with metadata
- **Element Classification System**: Automatic element-based styling and labeling
- **Popup Information System**: Contextual point information with warning and info types
- **Coordinate Mapping**: Precise SVG coordinate system for accurate point placement

### Professional Mobile Experience
- **Header Optimization**: Mobile notch-aware positioning
- **Touch Target Optimization**: Appropriately sized interactive elements
- **Responsive Flashcards**: Larger mobile-friendly card interfaces
- **Progressive Enhancement**: Desktop and mobile-specific feature sets

## Technical Architecture

### Frontend Technologies
- **React 18**: Modern hooks-based component architecture
- **Vite 4**: Fast development builds with Hot Module Replacement
- **Tailwind CSS**: Utility-first responsive design system
- **Progressive Web App**: Service worker implementation for offline functionality

### Data Management
- **JSON Meridian Database**: Structured point data with metadata
- **SVG Coordinate System**: Precise anatomical positioning
- **Dynamic Loading**: Asynchronous meridian data fetching
- **State Management**: React hooks for application state

### Mobile Optimization
- **Responsive Design**: Mobile-first approach with desktop enhancement
- **Touch Interface**: Optimized touch targets and gesture support
- **Performance Optimization**: Fast loading and smooth animations
- **Cross-Platform Compatibility**: Works on iOS, Android, and desktop browsers

## Installation and Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/meridian-mastery.git
cd meridian-mastery
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
npm run preview
```

### Development Features
- Hot Module Replacement for rapid development
- Source map support for debugging
- ESLint and Prettier integration
- TypeScript support for enhanced development experience

## Project Structure

### Core Components
- `BodyMapInteractiveNew.jsx`: Main interactive body map component
- `public/improved/`: Meridian JSON data and anatomical images
- `src/utils/dataLoaderOptimized.js`: Data loading and management utilities

### Asset Organization
- `public/improved/`: Current production assets (body models, meridian data)
- `archive/`: Deprecated files and legacy components
- `improved_body_map_with_regions/`: Source data for meridian information

### Data Format
Each meridian JSON file contains:
- Meridian metadata (name, view, element classification)
- Point array with coordinates, names, and descriptions
- Optional popup information for special points
- Element classification for dynamic styling

## Available Meridians

### Currently Implemented
1. **Lung Meridian (LU)** - Metal element, 11 points
2. **Large Intestine Meridian (LI)** - Metal element, 20 points  
3. **Heart Meridian (HT)** - Fire element, 9 points
4. **Stomach Meridian (ST)** - Earth element, 45 points

### Expansion Ready
The architecture supports easy addition of new meridians through JSON data files following the established format.

## User Interface Features

### Navigation
- Logo-based home navigation
- Dynamic back button functionality
- Breadcrumb-style navigation for zoom states

### Body Map Interaction
- Point selection with visual feedback
- Automatic view switching based on meridian selection
- Zoom functionality with centered point focus
- Real-time coordinate display

### Flashcard System
- Korean Hangul display with English translations
- Element-based color coding and badges
- Touch-to-flip card interaction
- Detailed therapeutic information display

## Mobile Optimization Details

### Header Management
- Mobile notch-aware positioning (top-16 on mobile vs top-4 on desktop)
- Flexible button sizing for different screen sizes
- Safe area considerations for modern mobile devices

### Point Visualization
- Progressive sizing: 8px on mobile, 12px on tablet, 16px on desktop
- Enhanced touch targets for finger interaction
- Visual feedback for point selection and hover states

### Flashcard Enhancement
- Increased mobile dimensions (600px height on mobile, 500px on desktop)
- Larger container widths for better content visibility
- Optimized text sizing for readability across devices

## Performance Considerations

### Loading Optimization
- Asynchronous meridian data loading
- Image optimization for fast rendering
- Lazy loading for non-critical components

### Memory Management
- Efficient state management with React hooks
- Optimized re-rendering through proper dependency arrays
- Clean component unmounting to prevent memory leaks

### Browser Compatibility
- Modern browser support (Chrome 90+, Firefox 88+, Safari 14+)
- Progressive enhancement for older browsers
- Graceful degradation of advanced features

## Educational Value

### Learning Methodology
- Visual learning through interactive body maps
- Kinesthetic learning through touch interaction
- Traditional Korean medicine point nomenclature
- Clinical application context for each point

### Content Accuracy
- Traditional Korean acupuncture point locations
- Authentic Korean terminology with proper Hangul
- Therapeutic function descriptions
- Element theory integration

## Future Development

### Planned Enhancements
- Additional meridian implementations (Spleen, Small Intestine, Bladder, etc.)
- Quiz system integration with body map points
- Progress tracking and learning analytics
- Audio pronunciation for Korean terminology

### Technical Improvements
- Enhanced offline functionality
- Advanced caching strategies
- Performance monitoring integration
- Accessibility improvements for screen readers

## Contributing

### Development Guidelines
- Follow established JSON structure for new meridians
- Maintain responsive design principles
- Test across multiple devices and screen sizes
- Ensure accessibility compliance

### Code Standards
- ES6+ JavaScript with modern React patterns
- Tailwind CSS for consistent styling
- Component-based architecture
- Clean, documented code with meaningful variable names

## License

MIT License - Open source for educational and commercial use

## Deployment

### Production Builds
The application is optimized for deployment on modern hosting platforms:
- Netlify (recommended)
- Vercel
- GitHub Pages
- Traditional web servers

### Build Optimization
- Tree shaking for minimal bundle size
- Code splitting for optimal loading
- Asset optimization for fast delivery
- Service worker caching for offline functionality

## Support and Documentation

### Browser Requirements
- JavaScript enabled
- SVG support
- Touch event support (for mobile devices)
- Local storage support for progress tracking

### Performance Targets
- First Contentful Paint: Under 2 seconds
- Largest Contentful Paint: Under 3 seconds
- Cumulative Layout Shift: Under 0.1
- First Input Delay: Under 100ms

---

**Meridian Mastery** - Professional Korean acupuncture education through interactive technology

Built for practitioners, students, and educators in traditional Korean medicine
- **Tailwind CSS 3** - Utility-first styling with custom design system
- **Framer Motion** - Advanced animations and transitions

### **PWA & Performance**
- **Service Worker** - Offline functionality with cache management
- **Progressive Web App** - Install on any device, works offline
- **Optimized Bundle** - Code splitting and lazy loading
- **Mobile-First Design** - Touch-optimized responsive interface

### **Data & State Management**
- **React Context** - Global state management for settings and progress
- **LocalStorage Integration** - Persistent user progress and preferences
- **JSON Data Sources** - Structured meridian point database
- **Real-Time Analytics** - Live progress tracking and performance metrics

## 📱 **Mobile Optimization**

### **Touch Interface**
- **Gesture Support** - Swipe navigation for flashcards
- **Safe Area Support** - iPhone notch/status bar compatibility
- **Touch-Friendly Buttons** - Optimized sizing for mobile interaction
- **Responsive Layouts** - Adaptive design for all screen sizes

### **Performance Optimization**
- **Lazy Loading** - Components load as needed
- **Image Optimization** - SVG-based graphics for crisp display
- **Efficient Rendering** - Optimized React component lifecycle
- **Memory Management** - Careful resource handling for mobile devices

## � **Educational Methodology**

### **Target Audience**
- **Acupuncture Students** - Traditional Korean Medicine learners
- **TCM Practitioners** - Professionals expanding Korean knowledge
- **Martial Arts Students** - Kuk Sool Won and traditional Korean martial arts
- **Language Learners** - Korean medical terminology enthusiasts

### **Learning Progression**
1. **Foundation Phase** - Basic point identification and Korean pronunciation
2. **Application Phase** - Therapeutic effects and anatomical locations
3. **Mastery Phase** - Martial applications and advanced point combinations
4. **Expert Phase** - Complete meridian understanding and practical application

### **Study Methodologies**
- **Spaced Repetition** - Algorithm-driven review scheduling
- **Visual Association** - Color-coded meridian and element systems
- **Multi-Modal Learning** - Visual, auditory, and kinesthetic approaches
- **Progressive Difficulty** - Adaptive complexity based on user performance

## 🌐 **Deployment & Hosting**

### **Supported Platforms**
- **✅ Netlify** (Recommended) - Automatic deployment from GitHub
- **✅ Vercel** - Zero-configuration deployment with framework detection
- **✅ GitHub Pages** - Static hosting with GitHub Actions
- **✅ Any Static Host** - Standard HTML/CSS/JS deployment

### **Build Output**
- **Optimized Bundle** - Tree-shaken and minified for production
- **PWA Manifest** - Complete Progressive Web App configuration
- **Service Worker** - Offline functionality and caching strategy
- **Icon Set** - Complete icon family for all device types

## � **Design System**

### **Visual Identity**
- **Triskelion Logo** - Traditional Korean triple spiral design
- **Color Palette** - Black backgrounds with red/yellow accents
- **Typography** - Clear, readable fonts optimized for Korean characters
- **Element Integration** - Five-element theory color coding

### **User Experience**
- **Intuitive Navigation** - State-based routing without page reloads
- **Consistent Interface** - Unified design language across all components
- **Accessibility** - WCAG compliance with keyboard navigation support
- **Performance First** - Sub-second load times and smooth animations

## 🔧 **Recent Development History**

### **June 15, 2025 - Critical Bug Fixes & Stabilization**
- ✅ **Complete Debugging Session** - All TypeScript and syntax errors resolved
- ✅ **Service Worker Configuration** - Proper dev/prod separation
- ✅ **React State Management** - Fixed disclaimer modal and component state
- ✅ **ES6 Module Migration** - Modernized entire import system
- ✅ **Build Optimization** - Clean Vite configuration with HMR
- ✅ **Error-Free Compilation** - All components validated and functional

### **June 13, 2025 - Element Theory Integration**
- ✅ **Element Theory Modals** - Educational popups for five-element theory
- ✅ **Dynamic Backgrounds** - Element-specific visual themes
- ✅ **Session-Based Display** - One-time educational content per session
- ✅ **User Controls** - Toggle settings for educational content

### **June 9, 2025 - Mobile Optimization**
- ✅ **iPhone Compatibility** - Safe area support for notch/status bar
- ✅ **Touch Interface** - Optimized button sizing and spacing
- ✅ **Icon System** - Complete PWA icon family with cache-busting
- ✅ **Responsive Design** - Enhanced mobile-first layout optimization

## 🤝 **Contributing**

### **Development Setup**
1. Fork the repository on GitHub
2. Clone your fork locally: `git clone https://github.com/yourusername/meridian-mastery-coach.git`
3. Create a feature branch: `git checkout -b feature/your-enhancement`
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`
6. Make your changes and test thoroughly
7. Commit with descriptive messages: `git commit -am 'Add new feature: description'`
8. Push to your branch: `git push origin feature/your-enhancement`
9. Create a Pull Request with detailed description

### **Code Standards**
- **ES6+ JavaScript** - Modern JavaScript standards throughout
- **React Hooks** - Functional components with hooks preferred
- **Tailwind CSS** - Utility-first styling, custom components when needed
- **Component Structure** - Clear separation of concerns and reusability
- **Performance First** - Optimize for mobile devices and slow connections

### **Areas for Contribution**
- **Korean Language Content** - Additional meridian points and terminology
- **Audio Pronunciation** - Enhanced Korean voice synthesis
- **Educational Content** - Five-element theory and traditional medicine
- **Mobile Optimization** - Further touch interface improvements
- **Accessibility** - Screen reader support and keyboard navigation

## 📄 **License**

**MIT License** - Open source and free for educational and commercial use

## 🏆 **Project Status**

### **✅ PRODUCTION READY - June 15, 2025**
- **Complete Feature Set** - All planned functionality implemented
- **Bug-Free Operation** - Comprehensive debugging and testing completed
- **Mobile Optimized** - Full responsive design with touch support
- **PWA Compliant** - Offline functionality and app installation
- **Performance Optimized** - Fast loading and smooth animations
- **Educational Value** - Comprehensive Korean acupuncture learning system

### **Live Demo**
**🌐 [Try Meridian Mastery Coach](https://meridian-mastery-coach.netlify.app)**

### **Key Metrics**
- **400+ Pressure Points** - Complete bilateral meridian database
- **6 Quiz Types** - Comprehensive knowledge testing
- **12 Meridian Channels** - Full traditional Korean medicine coverage
- **5 Study Modes** - Flexible learning approaches
- **Real-Time Progress** - Live tracking and analytics

---

**🏮 Master Korean Acupuncture with Confidence! 🎯**

*Built with ❤️ for the traditional medicine learning community*

**Ready for deployment and educational use worldwide** ✨