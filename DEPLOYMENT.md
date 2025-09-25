# Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables

- [ ] Copy `.env.example` to `.env.local` for local development
- [ ] Set up Convex deployment: `npx convex dev`
- [ ] Configure Clerk authentication
- [ ] Set up webhook endpoints

### 2. Convex Setup

- [ ] Initialize Convex: `npx convex dev`
- [ ] Deploy schema and functions: `npx convex deploy --prod`
- [ ] Configure production environment variables in Convex dashboard
- [ ] Set up Clerk integration in Convex

### 3. Clerk Setup

- [ ] Create Clerk application
- [ ] Configure sign-in/sign-up flows
- [ ] Set up webhooks pointing to Convex HTTP endpoints
- [ ] Add production domain to allowed origins
- [ ] Configure OAuth providers (optional)

## Deployment Steps

### Vercel Deployment

1. [ ] Push code to GitHub repository
2. [ ] Connect repository to Vercel
3. [ ] Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_JWT_ISSUER_DOMAIN`
   - `CLERK_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. [ ] Deploy from Vercel dashboard
5. [ ] Test deployment

### Post-Deployment

- [ ] Update Clerk webhook URLs to production domain
- [ ] Test authentication flow
- [ ] Test real-time messaging
- [ ] Test group functionality
- [ ] Verify all features work in production

## Production Environment Variables

```env
# Convex
CONVEX_DEPLOYMENT=prod:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Troubleshooting

### Common Issues

1. **Build fails**: Check TypeScript errors with `npm run type-check`
2. **Clerk auth not working**: Verify domain settings and webhook URLs
3. **Convex connection issues**: Check environment variables and deployment status
4. **Styling issues**: Ensure Tailwind CSS is properly configured

### Debug Commands

- `npm run build` - Test local build
- `npm run type-check` - Check TypeScript
- `npm run lint` - Check code quality
- `npx convex dev` - Local Convex development
