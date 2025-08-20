# Troubleshooting Guide

Common issues, solutions, and debugging tips for AccountaPod MVP.

## Installation & Setup Issues

### Node.js Version Problems

**Error**: `Unsupported engine`
```bash
npm ERR! notsup Unsupported engine
npm ERR! Required: {"node":">=18.0.0"}
```

**Solution**:
```bash
# Check current version
node --version

# Install Node 18+ using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### npm Installation Failures

**Error**: `ERESOLVE unable to resolve dependency tree`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps

# Or use exact versions
npm ci
```

**Error**: `Permission denied` (macOS/Linux)

**Solution**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use nvm to avoid permission issues
```

### Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

## Supabase Configuration Issues

### Environment Variables Not Loading

**Error**: Missing Supabase environment variables

**Symptoms**:
- Login fails silently
- Console error: "Missing Supabase environment variables"

**Solution**:
1. Verify `.env` file exists in project root:
   ```bash
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Restart development server after adding environment variables:
   ```bash
   npm run dev
   ```

3. Check Supabase dashboard for correct values:
   - Go to Settings → API
   - Copy Project URL and anon/public key

### Supabase Connection Errors

**Error**: `Failed to fetch` or network errors

**Troubleshooting**:
1. **Check Supabase project status**:
   - Login to Supabase dashboard
   - Verify project is active and not paused

2. **Verify environment variables**:
   ```javascript
   // Add to component for debugging
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Has anon key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

3. **Test connection manually**:
   ```javascript
   // Add to Login component temporarily
   const testConnection = async () => {
     try {
       const { data } = await supabase.auth.getSession();
       console.log('Connection successful:', data);
     } catch (error) {
       console.error('Connection failed:', error);
     }
   };
   ```

### Authentication Issues

**Error**: `Invalid login credentials` for test users

**Solution**:
The app uses mock data for user information, but authentication still goes through Supabase:

1. **Create test account in Supabase**:
   - Use signup form in the app
   - Or create via Supabase dashboard → Authentication → Users

2. **Use real email/password combinations**:
   ```
   Email: test@example.com
   Password: testpassword123
   ```

3. **Check authentication table**:
   - Go to Supabase dashboard → Authentication
   - Verify user exists and is confirmed

## Development Issues

### Hot Module Replacement Not Working

**Symptoms**: Changes don't reflect in browser automatically

**Solutions**:
1. **Check file watchers** (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Restart development server**:
   ```bash
   # Stop with Ctrl+C, then restart
   npm run dev
   ```

3. **Check browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or open DevTools → Network → check "Disable cache"

### TypeScript Errors

**Error**: `Property 'X' does not exist on type 'Y'`

**Common Causes**:
1. **Missing type imports**:
   ```typescript
   // Add missing import
   import { User, Goal, Milestone } from '../types';
   ```

2. **Incorrect prop types**:
   ```typescript
   // Fix component props
   interface MyComponentProps {
     goal: Goal; // Make sure this matches the type definition
   }
   ```

3. **Outdated type definitions**:
   - Check `src/types/index.ts` for current interfaces
   - Update component props to match

### CSS/Styling Issues

**Error**: Tailwind classes not applying

**Solutions**:
1. **Check Tailwind config**:
   ```javascript
   // tailwind.config.js should include:
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
   ```

2. **Restart development server** after Tailwind config changes

3. **Check for typos** in class names:
   ```typescript
   // ✅ Correct
   className="bg-teal-600 text-white"
   
   // ❌ Wrong
   className="bg-teel-600 text-white"
   ```

4. **Purged classes** - if using custom Tailwind classes, make sure they're included in content paths

## Browser Issues

### Page Not Loading

**Symptoms**: Blank page or loading forever

**Debugging Steps**:
1. **Check browser console** (F12 → Console tab):
   - Look for JavaScript errors
   - Note any failed network requests

2. **Check network tab** (F12 → Network tab):
   - Look for failed requests to Supabase
   - Check if environment variables are loaded

3. **Try incognito/private browsing**:
   - Rules out browser extension conflicts
   - Clears any cached data

4. **Clear browser data**:
   - Clear localStorage: DevTools → Application → Local Storage
   - Clear cookies for localhost

### Authentication State Issues

**Problem**: User appears logged in but gets redirected to login

**Solutions**:
1. **Check session in DevTools**:
   ```javascript
   // In browser console
   await supabase.auth.getSession()
   ```

2. **Clear authentication state**:
   ```javascript
   // In browser console
   localStorage.clear()
   location.reload()
   ```

3. **Check for expired sessions**:
   - Sessions expire after a period of inactivity
   - Try logging in again

### Mobile/Responsive Issues

**Problem**: Layout broken on mobile devices

**Debugging**:
1. **Use DevTools mobile emulation**:
   - F12 → Toggle device toolbar
   - Test common viewports (375px, 768px, 1024px)

2. **Check viewport meta tag** (should be in `index.html`):
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

3. **Review responsive classes**:
   ```typescript
   // Make sure responsive classes are included
   className="text-sm md:text-base lg:text-lg"
   ```

## Production Build Issues

### Build Failures

**Error**: Build fails with TypeScript errors

**Solution**:
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Fix all TypeScript errors before building
npm run build
```

**Error**: Environment variables not available in production

**Solution**:
1. **Prefix with VITE_**:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```

2. **Configure deployment platform**:
   - Vercel: Add environment variables in dashboard
   - Netlify: Add in site settings
   - Other platforms: Check their documentation

### Performance Issues

**Problem**: Slow loading or large bundle size

**Investigation**:
1. **Analyze bundle size**:
   ```bash
   npm run build
   npx serve dist
   # Check network tab for asset sizes
   ```

2. **Check for large dependencies**:
   ```bash
   npm ls --depth=0
   # Look for unnecessarily large packages
   ```

3. **Optimize images**:
   - Use WebP format where possible
   - Implement lazy loading for images
   - Consider using a CDN

## Debugging Tips

### Enable Debug Logging

Add temporary logging for debugging:

```typescript
// In AppContext.tsx
const addGoal = (goal) => {
  console.log('Adding goal:', goal);
  // ... existing logic
  console.log('Goal added successfully');
};

// In components
useEffect(() => {
  console.log('Component mounted, currentUser:', currentUser);
}, [currentUser]);
```

### Browser DevTools Usage

**Console Tab**:
- View JavaScript errors and logs
- Test API calls manually
- Check variable values

**Network Tab**:
- Monitor API requests to Supabase
- Check request/response headers
- Identify slow or failed requests

**Application Tab**:
- View localStorage and sessionStorage
- Inspect service workers
- Check cookies and authentication tokens

### React DevTools

Install React DevTools browser extension:
1. **Components tab**: Inspect component tree and props
2. **Profiler tab**: Identify performance bottlenecks
3. **Search components**: Find specific components quickly

## Common Error Messages

### `Cannot read property 'X' of undefined`

**Cause**: Trying to access property on null/undefined object

**Solution**:
```typescript
// Add optional chaining
const userName = currentUser?.name || 'Guest';

// Or use conditional rendering
{currentUser && (
  <div>{currentUser.name}</div>
)}
```

### `Hydration mismatch` (if using SSR)

**Cause**: Client render doesn't match server render

**Solution**: Ensure consistent rendering between server and client

### `Module not found: Can't resolve 'X'`

**Cause**: Import path is incorrect

**Solutions**:
1. **Check file path**:
   ```typescript
   // Relative to current file
   import Button from '../ui/Button';
   
   // Absolute from src
   import { useApp } from '../../context/AppContext';
   ```

2. **Check file extension**:
   ```typescript
   // Include .tsx for TypeScript files
   import Component from './Component.tsx';
   ```

## Getting Additional Help

### Community Resources

- **GitHub Issues**: Report bugs or ask questions
- **GitHub Discussions**: General questions and ideas
- **React Documentation**: [reactjs.org](https://reactjs.org)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Tailwind Documentation**: [tailwindcss.com](https://tailwindcss.com)

### Creating Bug Reports

When reporting issues, include:

1. **Environment details**:
   - Operating system
   - Node.js version
   - npm version
   - Browser and version

2. **Steps to reproduce**:
   - Clear, numbered steps
   - Expected vs actual behavior
   - Screenshots if relevant

3. **Error messages**:
   - Full error text from console
   - Network errors from DevTools
   - Any relevant logs

4. **Code context**:
   - Relevant code snippets
   - Configuration files if related

### Before Asking for Help

1. **Search existing issues** on GitHub
2. **Check this troubleshooting guide**
3. **Review error messages carefully**
4. **Try basic debugging steps** (restart, clear cache, etc.)
5. **Create minimal reproduction** if possible

Remember: Include as much context as possible when asking for help! 🔍
