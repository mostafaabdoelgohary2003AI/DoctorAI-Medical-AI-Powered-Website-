# DoctorAI Frontend Documentation

## Overview

The DoctorAI frontend is a modern, responsive web application built with React 18 and TypeScript. It provides an intuitive interface for healthcare professionals to interact with AI-powered medical diagnosis models through image uploads and medical consultations.

## Technology Stack

### Core Technologies
- **React 18.x**: Frontend framework with modern hooks and concurrent features
- **TypeScript 5.x**: Static type checking for enhanced development experience
- **Vite 5.x**: Fast build tool with Hot Module Replacement (HMR)
- **Tailwind CSS 3.x**: Utility-first CSS framework for responsive design

### State Management & Data Fetching
- **Redux Toolkit 2.x**: Modern Redux implementation with less boilerplate
- **RTK Query**: Data fetching and caching solution
- **React Router 6.x**: Client-side routing with code splitting

### Development Tools
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **PostCSS**: CSS processing with Tailwind

## Project Structure

```
react-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components (Loading, Error)
│   │   └── navigation/     # Navigation components
│   ├── pages/              # Route-based page components
│   ├── layouts/            # Layout wrapper components
│   ├── store/              # Redux store configuration
│   │   └── slices/        # Redux state slices
│   ├── services/           # API service layer
│   ├── assets/             # Static assets (images, icons)
│   └── types/              # TypeScript type definitions
├── public/                 # Static public assets
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite build configuration
└── tsconfig.json          # TypeScript configuration
```

## Architecture & Design Patterns

### Component Architecture
- **Functional Components**: All components use React hooks
- **Component Composition**: Reusable components with clear interfaces
- **Code Splitting**: Lazy loading for route-based code splitting
- **Error Boundaries**: Graceful error handling with fallback components

### State Management Strategy
- **Global State**: Redux Toolkit for application-wide state
- **Local State**: React hooks for component-specific state
- **Server State**: RTK Query for API data management
- **Form State**: Controlled components with validation

### Routing Structure
```
/ (Home)
├── /diagnostics          # Medical image analysis interface
├── /image-analysis       # Multi-model image upload
├── /chat                 # Medical chatbot interface
├── /symptom-checker      # Symptom analysis form
├── /dashboard           # User dashboard
├── /login               # Authentication
├── /register            # User registration
└── /404                 # Not found page
```

## Key Components

### Layout Components
- **MainLayout**: Primary application layout with header, sidebar, and footer
- **Header**: Navigation menu with user authentication status
- **Sidebar**: Model selection and navigation menu
- **Footer**: Application information and links

### Page Components
- **Home**: Landing page with application overview
- **Diagnostics**: Main interface for medical image analysis
- **ImageAnalysis**: Multi-model selection and image upload
- **Chat**: Medical chatbot conversation interface
- **SymptomChecker**: Form-based symptom analysis

### Common Components
- **Loading**: Spinner and progress indicators
- **ErrorFallback**: Error boundary fallback component
- **NotificationsContainer**: Toast notification system

## State Management

### Redux Store Structure
```typescript
interface RootState {
  auth: AuthState;           // User authentication
  diagnostics: DiagnosticsState;  // Model predictions
  ui: UIState;               // Loading states, modals
}
```

### Auth Slice
- User authentication state
- JWT token management
- Login/logout actions
- Protected route handling

### Diagnostics Slice
- Model prediction results
- Image upload progress
- Prediction history
- Model selection state

### UI Slice
- Loading states for different operations
- Modal visibility states
- Notification messages
- Theme preferences

## API Integration

### Service Layer Architecture
- **Base API Client**: Axios instance with interceptors
- **Authentication**: JWT token attachment
- **Error Handling**: Global error response handling
- **Type Safety**: Full TypeScript integration

### API Endpoints Integration
```typescript
// Medical Image Analysis APIs
predictLungColon(file: File)     // Lung/Colon cancer detection
predictMonkeypox(file: File)     // Monkeypox detection
predictTumor(file: File)         // Brain tumor analysis

// System APIs
getHealth()                      // System health check
authenticate(credentials)        // User authentication
```

## User Interface Design

### Design System
- **Color Scheme**: Medical-themed color palette with accessibility
- **Typography**: Clean, readable fonts optimized for medical content
- **Spacing**: Consistent spacing using Tailwind utilities
- **Components**: Modular design system with reusable components

### Responsive Design
- **Mobile-First**: Designed primarily for mobile devices
- **Breakpoints**: Tailwind's responsive breakpoint system
- **Touch-Friendly**: Large touch targets for mobile interactions
- **Adaptive Layout**: Components adapt to different screen sizes

### Accessibility Features
- **ARIA Labels**: Screen reader accessibility
- **Keyboard Navigation**: Full keyboard navigation support
- **Color Contrast**: WCAG-compliant color combinations
- **Focus Management**: Clear focus indicators

## User Workflows

### Medical Image Analysis Workflow
1. **Model Selection**: User selects appropriate AI model
2. **Image Upload**: Drag-and-drop or file picker interface
3. **Validation**: Client-side image format and size validation
4. **Processing**: Upload with progress indicator
5. **Results Display**: Prediction results with confidence scores
6. **History**: Save results to user's diagnosis history

### Medical Chatbot Workflow
1. **Chat Interface**: Clean conversation interface
2. **Message Input**: Text input with send button
3. **Language Detection**: Automatic Arabic/English detection
4. **Response Display**: Formatted AI responses with disclaimers
5. **Conversation History**: Persistent chat history

## Performance Optimizations

### Build Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization
- **Bundle Analysis**: Regular bundle size monitoring

### Runtime Optimizations
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists (future implementation)
- **Image Lazy Loading**: Progressive image loading

### Caching Strategy
- **Browser Caching**: Static asset caching
- **Service Worker**: Offline functionality (future)
- **RTK Query Cache**: API response caching
- **Local Storage**: User preferences persistence

## Security Implementation

### Client-Side Security
- **Input Sanitization**: XSS prevention in user inputs
- **File Validation**: Image file type and size validation
- **Token Management**: Secure JWT token storage
- **HTTPS Enforcement**: Secure communication requirement

### Authentication Flow
- **JWT Tokens**: Stateless authentication
- **Token Refresh**: Automatic token renewal
- **Protected Routes**: Route-level authentication
- **Logout Handling**: Secure session termination

## Development Workflow

### Local Development
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

### Code Quality Tools
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatting
npm run format

# Testing
npm test
```

### Environment Configuration
```typescript
// Environment variables
VITE_API_URL=http://localhost:8000
NODE_ENV=development|production
```

## Testing Strategy

### Testing Framework
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for testing
- **Cypress**: End-to-end testing (future implementation)

### Testing Coverage
- **Component Tests**: Critical component functionality
- **Integration Tests**: Page-level workflow testing
- **API Tests**: Service layer testing
- **Accessibility Tests**: a11y compliance testing

## Deployment Configuration

### Production Build
- **Asset Optimization**: Minification and compression
- **Environment Variables**: Production API endpoints
- **Docker Integration**: Containerized deployment
- **Health Checks**: Application health monitoring

### Docker Configuration
- **Multi-stage Build**: Optimized production image
- **Nginx Server**: Static file serving
- **Health Endpoint**: Container health checking
- **Port Configuration**: 5173 external, 4173 internal

## Future Enhancements

### Planned Features
- **PWA Support**: Progressive Web App capabilities
- **Offline Mode**: Basic offline functionality
- **Push Notifications**: Real-time updates
- **Advanced Analytics**: User interaction tracking
- **Mobile App**: React Native implementation

### Performance Improvements
- **Service Worker**: Advanced caching strategies
- **WebAssembly**: Performance-critical operations
- **CDN Integration**: Global asset delivery
- **Bundle Optimization**: Further size reduction

## Troubleshooting

### Common Issues
- **Build Failures**: Check Node.js version compatibility
- **API Connection**: Verify backend service availability
- **Authentication**: Check JWT token validity
- **Routing Issues**: Verify React Router configuration

### Development Tips
- **Hot Reload**: Automatic on file changes
- **Error Overlay**: Detailed error information in development
- **Redux DevTools**: State debugging and time-travel
- **TypeScript**: Compile-time error detection

## Contributing Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow established linting rules
- **Prettier**: Consistent code formatting
- **Component Structure**: Follow established patterns

### Component Development
- **Props Interface**: Define clear TypeScript interfaces
- **Error Handling**: Implement proper error boundaries
- **Accessibility**: Follow WCAG guidelines
- **Documentation**: Document complex components

This frontend documentation provides a comprehensive overview of the DoctorAI web application's client-side architecture, implementation details, and development workflow. 