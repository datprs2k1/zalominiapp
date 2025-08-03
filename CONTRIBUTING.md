# Contributing to Zalo Healthcare Mini App

Thank you for your interest in contributing to the Zalo Healthcare Mini App! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation Guidelines](#documentation-guidelines)
- [Medical Content Guidelines](#medical-content-guidelines)

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js (v16+)
- Yarn package manager
- Git configured with your GitHub account
- Access to the Zalo Mini App platform
- Understanding of healthcare/medical application requirements

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/zalo-healthcare.git
   cd zalo-healthcare
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-repo/zalo-healthcare.git
   ```
4. **Install dependencies**:
   ```bash
   yarn install
   ```
5. **Set up environment** following the [Development Guide](docs/getting-started/development-guide.md)

## 🔄 Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (`feature/doctor-search`)
- **bugfix/**: Bug fixes (`bugfix/appointment-booking`)
- **hotfix/**: Critical production fixes

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Push branch to your fork
git push -u origin feature/your-feature-name
```

### Commit Message Convention

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(booking): add appointment scheduling functionality
fix(api): resolve doctor search timeout issue
docs(readme): update installation instructions
style(components): format medical card component
```

## 📝 Code Standards

### TypeScript Guidelines

- **Use strict TypeScript**: Enable all strict mode options
- **Type everything**: Avoid `any` types, use proper interfaces
- **Medical types**: Use specific medical terminology in type definitions

```typescript
// Good
interface DoctorProfile {
  id: string;
  name: string;
  specialty: MedicalSpecialty;
  availability: AvailabilitySchedule;
  credentials: MedicalCredentials;
}

// Avoid
interface Doctor {
  id: any;
  data: any;
}
```

### React Component Guidelines

- **Functional components**: Use function components with hooks
- **Props interface**: Define clear props interfaces
- **Medical accessibility**: Ensure WCAG 2.1 AA compliance

```typescript
interface MedicalCardProps {
  doctor: DoctorProfile;
  variant?: 'default' | 'emergency' | 'consultation';
  onBookAppointment?: (doctorId: string) => void;
  'aria-label'?: string;
}

export const MedicalCard: React.FC<MedicalCardProps> = ({
  doctor,
  variant = 'default',
  onBookAppointment,
  'aria-label': ariaLabel,
}) => {
  // Component implementation
};
```

### Styling Guidelines

- **Tailwind CSS**: Use utility classes for styling
- **Medical theme**: Follow the medical design system
- **Responsive design**: Mobile-first approach

```tsx
// Good
<div className="bg-medical-blue-50 border border-medical-blue-200 rounded-lg p-4 shadow-sm">
  <h3 className="text-lg font-semibold text-medical-blue-900">
    Dr. {doctor.name}
  </h3>
</div>

// Avoid inline styles
<div style={{ backgroundColor: '#f0f9ff', padding: '16px' }}>
```

### File Organization

```
src/
├── components/
│   ├── medical/          # Medical-specific components
│   ├── form/            # Form components
│   └── common/          # Shared components
├── pages/
│   ├── booking/         # Appointment booking
│   ├── doctor/          # Doctor-related pages
│   └── profile/         # User profile
├── services/
│   ├── api/             # API services
│   └── cache/           # Caching logic
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── types/               # TypeScript type definitions
```

## 🔍 Pull Request Process

### Before Submitting

1. **Update your branch**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/your-feature
   git rebase main
   ```

2. **Run quality checks**:
   ```bash
   yarn type-check
   yarn format:check
   yarn test
   ```

3. **Test thoroughly**:
   - Unit tests for new functionality
   - Integration tests for API changes
   - Manual testing on mobile devices
   - Accessibility testing

### Pull Request Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Medical Context
- [ ] Affects patient data handling
- [ ] Changes medical workflows
- [ ] Impacts accessibility
- [ ] Requires medical review

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Accessibility testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by at least one maintainer
3. **Medical review** for healthcare-related changes
4. **Testing verification** in staging environment
5. **Final approval** and merge

## 🧪 Testing Requirements

### Required Tests

- **Unit tests**: For all new functions and components
- **Integration tests**: For API endpoints and data flow
- **Accessibility tests**: For UI components
- **Medical workflow tests**: For healthcare-specific features

### Test Coverage

- Minimum 80% code coverage
- 100% coverage for critical medical functions
- All edge cases covered for patient data handling

### Running Tests

```bash
# Run all tests
yarn test

# Run with coverage
yarn test:coverage

# Run specific test suites
yarn test:services
yarn test:components
```

## 📚 Documentation Guidelines

### Required Documentation

- **Code comments**: For complex medical logic
- **README updates**: For new features
- **API documentation**: For service changes
- **User guides**: For new workflows

### Documentation Standards

- Use clear, medical-appropriate language
- Include code examples
- Provide Vietnamese translations for user-facing content
- Update relevant documentation files

## 🏥 Medical Content Guidelines

### Healthcare Compliance

- **Patient Privacy**: Follow HIPAA-like privacy principles
- **Medical Accuracy**: Ensure medical information is accurate
- **Accessibility**: Meet healthcare accessibility standards
- **Localization**: Provide Vietnamese medical terminology

### Medical Data Handling

- Never log sensitive medical data
- Use proper encryption for data transmission
- Implement proper data validation
- Follow medical data retention policies

### Content Review

Medical content changes require:
1. Technical review by development team
2. Medical accuracy review by healthcare professionals
3. Accessibility compliance verification
4. User experience testing with medical scenarios

## 🆘 Getting Help

### Resources

- [Development Guide](docs/getting-started/development-guide.md)
- [Architecture Overview](docs/development/architecture-overview.md)
- [API Documentation](docs/development/api-services-guide.md)
- [Component Library](docs/development/component-documentation.md)

### Support Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Code Reviews**: For implementation guidance
- **Team Meetings**: For complex architectural decisions

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Zalo Healthcare Mini App!**

Your contributions help improve healthcare accessibility and user experience for our community.
