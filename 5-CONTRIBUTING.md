# Contributing to AccountaPod MVP

Thank you for your interest in contributing to AccountaPod! This guide will help you get started with the development process.

## Development Environment Setup

### Prerequisites

Before contributing, ensure you have completed the [Setup Guide](SETUP.md):

- Node.js v18+ installed
- Supabase account configured
- Environment variables set
- Dependencies installed via `npm install`

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/accountabiltiy-app-mvp.git
   cd accountabiltiy-app-mvp
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Make Changes & Test**
   - Write your code
   - Test manually in browser
   - Run linting: `npm run lint`

## Code Style & Standards

### TypeScript Guidelines

- **Strict typing**: Use proper TypeScript types, avoid `any`
- **Interface definitions**: Define interfaces for all data structures
- **Component props**: Always type component props explicitly

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  // implementation
};

// ❌ Avoid
const Button = ({ variant, children, onClick }: any) => {
  // implementation
};
```

### React Best Practices

- **Functional components**: Use function components with hooks
- **Custom hooks**: Extract reusable logic into custom hooks
- **Component naming**: Use PascalCase for components
- **File naming**: Match component name to file name

```typescript
// ✅ Good - components/ui/Button.tsx
export const Button: React.FC<ButtonProps> = () => {
  // implementation
};

// ✅ Good - hooks/useGoals.ts
export const useGoals = () => {
  // custom hook logic
};
```

### Styling Guidelines

- **Tailwind CSS**: Use Tailwind utility classes for styling
- **Consistent spacing**: Use Tailwind's spacing scale (p-4, m-2, etc.)
- **Responsive design**: Include responsive breakpoints where needed
- **Component variants**: Support multiple visual variants

```typescript
// ✅ Good
const buttonClasses = `
  inline-flex items-center justify-center 
  rounded-md font-medium transition-colors
  px-4 py-2 text-sm
  ${variant === 'primary' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800'}
  hover:opacity-90 focus:outline-none focus:ring-2
`;

// ❌ Avoid inline styles
const buttonStyles = {
  padding: '8px 16px',
  backgroundColor: '#14b8a6'
};
```

### ESLint Configuration

The project uses ESLint for code quality. Fix all linting errors before submitting:

```bash
npm run lint
```

**Common ESLint Rules**:
- No unused variables
- Consistent import ordering
- React hooks rules
- TypeScript recommended rules

## File Organization

### Directory Structure

Follow the established directory structure:

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components  
│   ├── forms/          # Form components
│   ├── layout/         # Layout components (Navbar, Sidebar)
│   └── ui/             # Reusable UI components
├── context/            # React Context providers
├── data/               # Mock data and constants
├── lib/                # External integrations (Supabase)
├── pages/              # Route components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Component Guidelines

**UI Components** (`src/components/ui/`):
- Keep components small and focused
- Support common props (className, children)
- Include size and variant options
- Export default and named exports

**Page Components** (`src/pages/`):
- One component per route
- Handle data fetching via Context
- Manage local page state
- Include loading and error states

**Form Components** (`src/components/forms/`):
- Use controlled components
- Include validation
- Handle loading states
- Provide clear error messages

## Git Workflow

### Branch Naming

Use descriptive branch names:

```bash
feature/goal-milestone-tracking
fix/authentication-redirect-bug
refactor/simplify-goal-context
docs/update-api-reference
```

### Commit Messages

Follow conventional commit format:

```bash
feat: add milestone completion tracking
fix: resolve authentication state persistence
refactor: simplify goal creation form
docs: update contributing guidelines
style: fix button component spacing
test: add goal creation unit tests
```

### Pull Request Process

1. **Create descriptive PR title**:
   - `feat: Add weekly check-in functionality`
   - `fix: Resolve goal progress calculation bug`

2. **Include PR description**:
   ```markdown
   ## Changes
   - Add check-in form component
   - Integrate with AppContext
   - Update weekly view layout
   
   ## Testing
   - Manual testing on Chrome/Firefox
   - Verified mobile responsiveness
   
   ## Screenshots
   [Include relevant screenshots]
   ```

3. **Request review** from maintainers

4. **Address feedback** and update branch

5. **Merge** after approval

## Testing Guidelines

### Manual Testing

Since automated tests are not yet implemented, follow this checklist:

**Authentication Flow**:
- [ ] Sign up with valid email/password
- [ ] Sign in with valid credentials  
- [ ] Sign in with invalid credentials shows error
- [ ] Sign out redirects to login page
- [ ] Protected routes redirect when not authenticated

**Goal Management**:
- [ ] Create life and work goals
- [ ] Edit goal details
- [ ] Update goal progress
- [ ] View goals by quarter

**Milestone Tracking**:
- [ ] Add milestones to goals
- [ ] Mark milestones complete
- [ ] View milestone progress by week

**Responsive Design**:
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1024px+ width)

### Browser Compatibility

Test in these browsers:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Adding New Features

### Planning Phase

1. **Check existing issues** for similar requests
2. **Create issue** to discuss the feature
3. **Get approval** from maintainers before starting
4. **Review [Architecture](ARCHITECTURE.md)** to understand current patterns

### Implementation Phase

1. **Create types** in `src/types/index.ts` if needed
2. **Add to AppContext** if global state is required
3. **Build UI components** following existing patterns
4. **Add to routing** if new page is needed
5. **Update mock data** to support the feature

### Example: Adding Goal Categories

```typescript
// 1. Update types
interface Goal {
  // ... existing fields
  category?: 'fitness' | 'career' | 'education' | 'personal';
}

// 2. Update Context
const AppContext = createContext<{
  // ... existing
  updateGoalCategory: (goalId: string, category: string) => void;
}>();

// 3. Create UI component
const CategorySelector: React.FC<CategorySelectorProps> = () => {
  // implementation
};

// 4. Update mock data
export const mockGoals: Goal[] = [
  {
    // ... existing
    category: 'fitness'
  }
];
```

## Documentation

### Code Documentation

- **JSDoc comments** for complex functions
- **README updates** for new setup requirements
- **Type definitions** for all interfaces
- **Component prop documentation**

### Architecture Documentation

When adding significant features:
- Update [Architecture](ARCHITECTURE.md) with new patterns
- Update [API Reference](API_REFERENCE.md) with new endpoints
- Add examples to documentation

## Getting Help

### Resources

- **Codebase questions**: Review [Architecture Guide](ARCHITECTURE.md)
- **Setup issues**: Check [Troubleshooting](TROUBLESHOOTING.md)
- **API questions**: See [API Reference](API_REFERENCE.md)

### Communication

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and ideas
- **Pull Request Comments**: For code review discussions

### Common Questions

**Q: How do I add a new page?**
1. Create component in `src/pages/`
2. Add route to `src/App.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx`

**Q: How do I modify the data structure?**
1. Update types in `src/types/index.ts`
2. Update mock data in `src/data/mockData.ts`
3. Update Context operations in `src/context/AppContext.tsx`

**Q: How do I add new UI components?**
1. Create in `src/components/ui/`
2. Follow existing component patterns
3. Export from component file
4. Use Tailwind for styling

## Code Review Checklist

### For Reviewers

- [ ] Code follows TypeScript guidelines
- [ ] Components are properly typed
- [ ] Tailwind classes are used correctly
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Mobile responsiveness is maintained
- [ ] Accessibility considerations included

### For Contributors

Before submitting PR:
- [ ] Code is linted and formatted
- [ ] Manual testing completed
- [ ] Documentation updated if needed
- [ ] No breaking changes to existing features
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

## Release Process

1. **Version bump** in package.json
2. **Update CHANGELOG** with new features/fixes
3. **Create release PR** with all changes
4. **Tag release** after merge
5. **Deploy to staging** for testing
6. **Deploy to production** after validation

Thank you for contributing to AccountaPod! 🚀
