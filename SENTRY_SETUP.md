# Sentry Configuration for Computer Repair Shop

## Overview
Sentry has been configured for error monitoring and performance tracking in the Computer Repair Shop application.

## Installation
Sentry Next.js SDK (`@sentry/nextjs v9.40.0`) has been installed and configured.

## Configuration Files

### Core Configuration Files
- `sentry.client.config.ts` - Browser-side error tracking configuration
- `sentry.server.config.ts` - Server-side error tracking configuration  
- `sentry.edge.config.ts` - Edge runtime error tracking configuration
- `next.config.ts` - Updated with Sentry webpack integration

### Environment Variables Required
Create a `.env.local` file in the project root with the following variables:

```env
# Sentry Configuration
SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here

# Optional: Enable debug mode during development
SENTRY_DEBUG=false

# For source map uploads (CI/CD)
SENTRY_ORG=nick-yf
SENTRY_PROJECT=javascript-nextjs
SENTRY_AUTH_TOKEN=your_auth_token_here
```

## Getting Your Sentry DSN

1. Log in to [Sentry.io](https://sentry.io)
2. Navigate to your project: `nick-yf/javascript-nextjs`
3. Go to **Settings** → **Client Keys (DSN)**
4. Copy the DSN and add it to your `.env.local` file

## Features Configured

### Error Tracking
- Automatic capturing of unhandled errors
- Client-side and server-side error monitoring
- Edge runtime error tracking

### Session Replay
- 10% of sessions recorded for debugging
- 100% of error sessions recorded
- Privacy settings: text masking and media blocking enabled

### Performance Monitoring
- Automatic performance instrumentation
- Source map uploads for better stack traces
- Vercel Cron Monitor integration (when using Vercel)

## Testing Sentry Integration

A test page has been created at `/sentry-example-page` (only visible in development mode).

### Testing Steps:
1. Start the development server: `npm run dev`
2. Navigate to `/sentry-example-page`
3. Click any of the error trigger buttons
4. Check your Sentry dashboard for the captured errors

### Alternative Testing:
Add this code anywhere in your application to trigger a test error:
```javascript
// This will trigger an error that Sentry will capture
myUndefinedFunction();
```

## Sentry Dashboard
Once errors are triggered, you can view them in your Sentry dashboard:
- Organization: `nick-yf`
- Project: `javascript-nextjs`
- URL: `https://nick-yf.sentry.io/projects/javascript-nextjs/`

## Production Considerations

### Source Maps
- Source maps are automatically uploaded during build
- They are hidden from client bundles for security
- Requires `SENTRY_AUTH_TOKEN` for CI/CD environments

### Performance
- Logger statements are automatically tree-shaken in production
- Replay sampling is set to 10% to balance insight and performance
- Error replay sampling is 100% for debugging critical issues

### Security
- DSN is exposed to the client (this is normal and expected)
- Source maps are uploaded but hidden from public access
- Personal data masking is enabled in session replays

## Troubleshooting

### Common Issues:
1. **No errors appearing in Sentry**: Check that DSN is correctly set in environment variables
2. **Source maps not working**: Ensure `SENTRY_AUTH_TOKEN` is set for build environments
3. **Build errors**: Verify all Sentry configuration files are properly formatted

### Debug Mode:
Set `debug: true` in the Sentry configuration files to see console output during development.

## Additional Resources
- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay Documentation](https://docs.sentry.io/product/session-replay/) 