# 🚀 Deployment Checklist

## Pre-Deployment

### ✅ Code Preparation
- [ ] All features tested locally
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Images optimized and compressed
- [ ] Social sharing tested

### ✅ Supabase Setup
- [ ] Project created on Supabase
- [ ] Database schema deployed (`schema.sql`)
- [ ] Display ID migration (`add-display-id.sql`)
- [ ] Price constraint fix (`fix-price-constraint.sql`)
- [ ] RLS policies updated (`fix-rls-all.sql`)
- [ ] Auth settings configured
- [ ] Storage bucket created (if needed)

### ✅ Environment Variables
```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXTAUTH_SECRET=your-32-char-random-string
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com
NODE_ENV=production
```

## Render Deployment Steps

### 1. GitHub Repository
```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - Ready for production"

# Push to GitHub
git remote add origin https://github.com/yourusername/motorcycle-marketplace.git
git branch -M main
git push -u origin main
```

### 2. Render Service Creation
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure service:
   - **Name**: `vuong-cuong-68-motorcycle`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (upgrade later if needed)

### 3. Environment Variables Setup
Add all environment variables in Render dashboard under "Environment" tab.

### 4. Deploy
- Click "Create Web Service"
- Monitor build logs
- Wait for deployment completion

## Post-Deployment

### ✅ Verification Checklist
- [ ] Website loads successfully
- [ ] All pages accessible
- [ ] Admin login works
- [ ] Database connections working
- [ ] Image uploads functional
- [ ] Social sharing previews correct
- [ ] Mobile responsiveness verified
- [ ] Performance acceptable
- [ ] SSL certificate active

### ✅ Testing
- [ ] Create test motorcycle listing
- [ ] Test image upload
- [ ] Test admin functions
- [ ] Test contact forms
- [ ] Test social media sharing
- [ ] Test on different devices
- [ ] Test page transitions

### ✅ SEO & Social
- [ ] Test Open Graph with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test Twitter Cards with [Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Submit to Google Search Console
- [ ] Set up Google Analytics (optional)

## Monitoring

### Health Checks
- Health endpoint: `https://your-app.onrender.com/health`
- Monitor uptime and performance
- Set up alerts for downtime

### Logs
- Monitor Render logs for errors
- Check Supabase logs for database issues
- Monitor performance metrics

## Maintenance

### Regular Tasks
- [ ] Monitor disk usage
- [ ] Update dependencies monthly
- [ ] Backup database regularly
- [ ] Monitor security updates
- [ ] Review performance metrics

### Updates
```bash
# For updates
git add .
git commit -m "Update: description of changes"
git push origin main
# Render will auto-deploy
```

## Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version compatibility
2. **Environment Variables**: Ensure all required vars are set
3. **Database Connection**: Verify Supabase credentials
4. **Image Issues**: Check file size limits and formats
5. **Social Sharing**: Verify meta tags and image URLs

### Support Resources
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

## 🎉 Success!

Your motorcycle marketplace is now live at:
**https://your-app-name.onrender.com**

Share the link and start selling motorcycles! 🏍️