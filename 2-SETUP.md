# Setup Guide

Complete setup instructions for AccountaPod MVP development and deployment.

## Prerequisites

### System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (comes with Node.js)
- **Git**: Latest version
- **OS**: macOS, Windows, or Linux

### Required Accounts

- **Supabase Account**: [Create account](https://supabase.com) for database and auth
- **GitHub Account**: For version control and deployment

## Environment Configuration

### 1. Supabase Setup

1. Create a new project in [Supabase Dashboard](https://app.supabase.com)
2. Navigate to Settings → API
3. Copy your project URL and anon key

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: Keep your `.env` file secure and never commit it to version control.

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd accountabiltiy-app-mvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Run the Supabase migration to create the profiles table:

```bash
# If using Supabase CLI (optional)
supabase db push

# Or manually run the SQL in your Supabase dashboard:
# superbase/supabase/migrations/20250424165253_create_profiles_table.sql
```

## Running the Application

### Development Mode

```bash
npm run dev
```

- Opens at `http://localhost:5173`
- Hot module reloading enabled
- Development tools available

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
npm run lint
```

## Database Reset

To reset your development database:

1. Go to Supabase Dashboard → Settings → Database
2. Click "Reset Database" (⚠️ **This will delete all data**)
3. Re-run migrations if needed

## Testing

Currently, the project uses mock data for development. Authentication flows through Supabase, but user data is mocked.

### Test Users

Available in `security/testUsers.txt`:
- Use any email/password combination for testing
- Authentication state is managed by Supabase
- User data comes from `src/data/mockData.ts`

## Troubleshooting Setup

### Common Issues

**Node.js Version Error**
```bash
# Check version
node --version

# Update if needed (using nvm)
nvm install 18
nvm use 18
```

**Supabase Connection Issues**
- Verify environment variables are set correctly
- Check Supabase project status in dashboard
- Ensure API keys are copied without spaces

**Port Already in Use**
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or specify different port
npm run dev -- --port 3000
```

For more issues, see [Troubleshooting Guide](TROUBLESHOOTING.md).

## Next Steps

- Read the [Architecture Guide](ARCHITECTURE.md) to understand the codebase
- Review [Contributing Guidelines](CONTRIBUTING.md) for development workflow
- Check [API Reference](API_REFERENCE.md) for integration details
