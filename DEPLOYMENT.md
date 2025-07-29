# Vercel Deployment Guide

## Prerequisites

Before deploying to Vercel, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket Repository**: Your code should be in a Git repository
3. **Database**: Set up a PostgreSQL database (recommended: Neon, Supabase, or Vercel Postgres)
4. **Kinde Authentication**: Configure your Kinde application
5. **Sentry Account**: For error monitoring (optional but recommended)

## Environment Variables Setup

### 1. Database Configuration
Set up your PostgreSQL database and get the connection string:
```
DATABASE_URL="postgresql://username:password@host:port/database"
```

### 2. Kinde Authentication
Configure your Kinde application and add these environment variables:
```
KINDE_DOMAIN="your-domain.kinde.com"
KINDE_CLIENT_ID="your-client-id"
KINDE_CLIENT_SECRET="your-client-secret"
KINDE_ISSUER_URL="https://your-domain.kinde.com"
KINDE_SITE_URL="https://your-app.vercel.app"
KINDE_LOGOUT_REDIRECT_URL="https://your-app.vercel.app"
KINDE_LOGIN_REDIRECT_URL="https://your-app.vercel.app"
```

### 3. Kinde Management API
For user management features:
```
KINDE_MANAGEMENT_CLIENT_ID="your-management-client-id"
KINDE_MANAGEMENT_CLIENT_SECRET="your-management-client-secret"
```

### 4. Manager Permissions
Set up manager emails for fallback permissions:
```
MANAGER_EMAILS="manager1@example.com,manager2@example.com"
```

### 5. Sentry Configuration (Optional)
For error monitoring:
```
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="your-sentry-project"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
```

### 6. Application Configuration
```
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

## Deployment Steps

### 1. Connect Repository to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the repository containing your Computer Repair Shop app

### 2. Configure Project Settings
1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: Leave as default (if your app is in the root)
3. **Build Command**: `yarn build`
4. **Install Command**: `yarn install`
5. **Output Directory**: `.next` (default)

### 3. Add Environment Variables
1. In the Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add all the environment variables listed above
3. Make sure to set them for "Production", "Preview", and "Development" environments

### 4. Database Setup
1. **Option A - Vercel Postgres**:
   - Go to "Storage" in your Vercel dashboard
   - Create a new Postgres database
   - Vercel will automatically add the `DATABASE_URL` environment variable

2. **Option B - External Database**:
   - Set up Neon, Supabase, or any PostgreSQL provider
   - Add the `DATABASE_URL` environment variable manually

### 5. Run Database Migrations
After deployment, you'll need to run database migrations:

```bash
# Option 1: Using Vercel CLI
vercel env pull .env.local
yarn db:migrate

# Option 2: Using Vercel Functions
# Create a migration API route or use Vercel's CLI
```

### 6. Deploy
1. Click "Deploy" in the Vercel dashboard
2. Vercel will build and deploy your application
3. Monitor the build logs for any issues

## Post-Deployment Setup

### 1. Update Kinde Configuration
1. Go to your Kinde dashboard
2. Update the redirect URLs to use your Vercel domain
3. Update the site URL to your Vercel domain

### 2. Test the Application
1. Visit your deployed application
2. Test authentication flow
3. Test user management features
4. Test ticket and customer management

### 3. Set Up Custom Domain (Optional)
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with the new domain

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from Vercel
   - Ensure database migrations have been run

3. **Authentication Issues**:
   - Verify Kinde environment variables
   - Check redirect URLs in Kinde dashboard
   - Ensure `KINDE_SITE_URL` matches your Vercel domain

4. **Environment Variables**:
   - Double-check all environment variables are set
   - Ensure they're set for the correct environments
   - Restart deployment after adding new variables

### Performance Optimization

1. **Enable Vercel Analytics** (optional)
2. **Configure Edge Functions** for API routes if needed
3. **Enable Image Optimization** (already configured in Next.js)
4. **Monitor performance** using Vercel's built-in analytics

## Monitoring and Maintenance

### 1. Set Up Monitoring
- Configure Sentry for error tracking
- Set up Vercel Analytics
- Monitor database performance

### 2. Regular Updates
- Keep dependencies updated
- Monitor for security updates
- Update environment variables as needed

### 3. Backup Strategy
- Regular database backups
- Version control for all changes
- Document configuration changes

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **Database Security**: Use connection pooling and SSL
3. **Authentication**: Regularly rotate Kinde secrets
4. **HTTPS**: Vercel provides automatic HTTPS
5. **CORS**: Configure CORS settings if needed

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Kinde Documentation**: [kinde.com/docs](https://kinde.com/docs)
- **Sentry Documentation**: [sentry.io/docs](https://sentry.io/docs)