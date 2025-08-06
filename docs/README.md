# Zalo Medical Mini App Documentation

## Overview

This is a comprehensive medical/healthcare Zalo Mini App built with React, TypeScript, and Tailwind CSS. The application provides medical services, doctor consultations, appointment booking, and health-related features.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Features](#features)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Documentation Structure

### Core Documentation

- **[Architecture](./ARCHITECTURE.md)** - Detailed system architecture and code organization
- **[API Documentation](./API.md)** - API services, endpoints, and data management
- **[Components](./COMPONENTS.md)** - React components documentation and usage
- **[Styling](./STYLING.md)** - Styling system, themes, and design guidelines
- **[Development](./DEVELOPMENT.md)** - Development setup, workflow, and best practices
- **[Testing](./TESTING.md)** - Testing strategies, tools, and examples
- **[Deployment](./DEPLOYMENT.md)** - Deployment process and environment configuration

### Component-Specific Documentation

#### Header Components

- **[Header Migration Guide](./HEADER_MIGRATION_GUIDE.md)** - Migration guide for header component updates
- **[Medical Header Redesign](./MEDICAL_HEADER_REDESIGN.md)** - Medical-specific header enhancements

#### Footer Components

- **[Footer Architecture v2.0](./FOOTER_ARCHITECTURE_V2.md)** - Complete refactor overview and new modular architecture
- **[Mobile Footer Components](./MOBILE_FOOTER_COMPONENTS.md)** - Detailed footer component documentation
- **[Footer Quick Reference](./FOOTER_QUICK_REFERENCE.md)** - Quick reference guide for footer usage
- **[Footer Redesign Summary](./MOBILE_FOOTER_REDESIGN_SUMMARY.md)** - Summary of footer improvements and changes

#### Page Documentation

- **[About Page](./ABOUT_PAGE.md)** - Comprehensive documentation for the About page component, animations, and content management

## Project Structure

```
zalo/
├── docs/                    # Documentation
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Styling and themes
│   ├── contexts/           # React contexts
│   ├── data/               # Static data
│   └── static/             # Static assets
├── app-config.json         # ZMP app configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.mts         # Vite build configuration
└── zmp-cli.json           # ZMP CLI configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Zalo Mini Program CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd zalo

# Install dependencies
yarn install

# Start development server
yarn start
```

### Available Scripts

- `yarn start` - Start development server
- `yarn deploy` - Deploy to Zalo Mini Program platform
- `yarn format` - Format code with Prettier
- `yarn login` - Login to ZMP CLI

## Architecture

### Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, SCSS
- **State Management**: Jotai
- **Routing**: React Router DOM v7
- **Build Tool**: Vite
- **UI Components**: ZMP UI
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Key Libraries

- `zmp-sdk` - Zalo Mini Program SDK
- `zmp-ui` - Zalo Mini Program UI components
- `@tanstack/react-virtual` - Virtual scrolling
- `react-hot-toast` - Toast notifications
- `jotai` - State management

## Features

### Core Features

- Medical service browsing
- Doctor profiles and consultations
- Appointment booking system
- Medical department exploration
- Health news and articles
- User profile management
- Search functionality
- Feedback system

### Technical Features

- Responsive design for mobile devices
- iOS-specific optimizations
- Performance monitoring
- Accessibility support
- Error boundary handling
- Loading states and skeletons
- Virtual scrolling for large lists
- Optimized API caching

### Navigation & UI Components

#### Header System

- **Modular Header Architecture**: Platform-specific header components (iOS, Android, Web)
- **Medical Theming**: Healthcare-specific styling and branding
- **Performance Optimized**: Lazy loading, memoization, and optimized rendering
- **Accessibility Compliant**: WCAG 2.1 AA compliance with skip links and navigation status
- **Error Boundary Protection**: Graceful error handling with fallback UI

#### Footer System

- **Modular Footer Architecture**: Platform-specific footer components (iOS, Android, Web)
- **Medical Context Integration**: Emergency mode, trust indicators, and health status
- **Automatic Platform Detection**: Smart detection and rendering of appropriate footer
- **Unified Design System**: iOS-style design across all platforms for consistency
- **Accessibility Compliant**: Full keyboard navigation, screen reader support, and ARIA labels
- **Performance Optimized**: Lazy loading, shared components, and optimized animations
- **Haptic Feedback**: Native-like touch interactions on supported devices

#### About Page

- **Comprehensive Landing Page**: Hospital showcase with modern animations
- **Content Management System**: Centralized content with easy localization support
- **Accessibility Optimized**: WCAG 2.1 AA compliance with motion preference respect
- **Performance Focused**: Lazy loading, code splitting, and optimized animations

## Development

### Code Organization

- **Components**: Reusable UI components organized by feature
- **Pages**: Route-level components
- **Services**: API integration and data fetching
- **Hooks**: Custom React hooks for shared logic
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions
- **Styles**: Theme system and styling utilities

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write accessible components
- Optimize for mobile performance
- Follow the established folder structure

## Deployment

The application is deployed using the Zalo Mini Program platform:

```bash
# Login to ZMP CLI
yarn login

# Deploy to production
yarn deploy
```

## Contributing

1. Follow the existing code style and structure
2. Write TypeScript for all new code
3. Test on both iOS and Android devices
4. Ensure accessibility compliance
5. Update documentation for new features

## Support

For issues and questions, please refer to the Zalo Mini Program documentation or contact the development team.
