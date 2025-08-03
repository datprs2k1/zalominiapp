# Zalo Healthcare App

A modern healthcare application built on the Zalo Mini App platform, enabling users to find doctors, book appointments, explore medical services, view health news, and manage their healthcare needs.

> **Project Status**: ✅ Recently cleaned up and optimized for better maintainability and performance (January 2025).

## Features

- **Doctor Discovery**: Find and filter doctors by specialty and location
- **Appointment Booking**: Schedule medical appointments with preferred doctors
- **Service Exploration**: Browse available healthcare services and treatments
- **Health News**: Access the latest articles and information on healthcare topics
- **User Profile**: View appointment history, test results, and manage personal information
- **Search Functionality**: Search across doctors, services, and departments
- **Mobile-Optimized**: Responsive design with mobile-first approach

## Getting Started

### Prerequisites

- Node.js (v16+)
- Yarn package manager
- Zalo Mini App CLI

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-repo/zalo-healthcare.git
   cd zalo-healthcare
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Login to Zalo Mini App platform:

   ```
   yarn login
   ```

4. Start the development server:
   ```
   yarn start
   ```

## Project Structure

```
src/
├── app.ts                 # Application entry point
├── components/            # Shared UI components
│   ├── button.tsx         # Button component
│   ├── form/              # Form-related components
│   ├── icons/             # SVG icons as React components
│   ├── items/             # List item components
│   └── ...
├── contexts/              # React context providers
├── css/                   # Global styles
├── data/                  # Mock data and constants
├── pages/                 # Application pages/routes
│   ├── home/              # Home page components
│   ├── booking/           # Appointment booking flow
│   ├── profile/           # User profile pages
│   └── ...
├── services/              # API services
├── static/                # Static assets
├── styles/                # Component-specific styles
├── utils/                 # Utility functions
└── router.tsx             # Application routing
```

## Development

### Available Scripts

- `yarn start` - Starts the development server
- `yarn deploy` - Deploys the app to the Zalo Mini App platform
- `yarn format` - Formats code using Prettier

### Key Technologies

- React 18
- TypeScript
- Tailwind CSS
- Jotai (State Management)
- React Router
- Framer Motion (Animations)

## Documentation

For comprehensive documentation, see the [Documentation Index](docs/INDEX.md) or refer to specific guides:

### Core Documentation

- [Architecture Overview](docs/architecture-overview.md) - System architecture, key technologies, and design patterns
- [Component Documentation](docs/component-documentation.md) - Detailed documentation of key components and their usage
- [API Services Guide](docs/api-services-guide.md) - Information about API services and data flow

### Design & UI

- [UI Design System](docs/ui-design-system.md) - Complete design system guidelines
- [UI Visual Style Guide](docs/ui-visual-style-guide.md) - Visual styling and design patterns
- [UI Theme Customization](docs/ui-theme-customization.md) - Theme customization guidelines
- [UI Accessibility Guide](docs/ui-accessibility-guide.md) - Accessibility implementation guide
- [Mobile Optimization Guide](docs/mobile-optimization-guide.md) - Mobile-specific optimizations

### Implementation Guides

- [Development Guide](docs/development-guide.md) - Development setup and guidelines
- [State Management Guide](docs/state-management-guide.md) - State management patterns and best practices
- [Testing Guide](docs/testing-guide.md) - Testing strategies and implementation
- [Deployment Guide](docs/deployment-guide.md) - Deployment procedures and configuration
- [UI Animation & Interaction](docs/ui-animation-interaction.md) - Animation and interaction patterns

## Project Structure Cleanup

This project has been cleaned up to remove:

- Duplicate components and utilities
- Test and debug files
- Unused HTML preview files
- Temporary documentation files
- Redundant skeleton and loading components

The cleanup ensures a cleaner, more maintainable codebase with consolidated functionality.

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m 'Add amazing feature'`
3. Push to the branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## License

This project is licensed under the UNLICENSED license.
