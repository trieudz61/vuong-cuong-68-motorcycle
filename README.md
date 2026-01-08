# 🏍️ Vương Cường 68 - Xe Máy Cũ

Trang web mua bán xe máy cũ uy tín tại 06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An.

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Render
- **Features**: 
  - Responsive design (Mobile-first)
  - Social media sharing (Open Graph)
  - Image watermarking
  - Admin panel
  - Real-time updates
  - Page transitions

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd motorcycle-marketplace
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. **Database setup**
- Go to Supabase SQL Editor
- Run files in `/supabase/` folder in order:
  1. `schema.sql`
  2. `add-display-id.sql`
  3. `fix-price-constraint.sql`
  4. `fix-rls-all.sql`

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🌐 Production Deployment

### Render Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

2. **Create Render Service**
- Go to [Render Dashboard](https://dashboard.render.com)
- Click "New +" → "Web Service"
- Connect GitHub repository
- Use these settings:
  - **Name**: `vuong-cuong-68-motorcycle`
  - **Environment**: `Node`
  - **Build Command**: `npm ci && npm run build`
  - **Start Command**: `npm start`
  - **Plan**: Free (or paid for better performance)

3. **Environment Variables**
Set these in Render dashboard:
```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=generate_random_32_char_string
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com
```

4. **Deploy**
- Click "Create Web Service"
- Wait for build and deployment
- Your app will be live at `https://your-app-name.onrender.com`

### Supabase Configuration

1. **RLS Policies**: Ensure all SQL files are run
2. **Auth Settings**: 
   - Add your Render URL to allowed origins
   - Configure redirect URLs
3. **Storage**: Set up image storage bucket if needed

## 📱 Features

### Public Features
- **Homepage**: Hero section, featured motorcycles, shop gallery
- **Motorcycle Listing**: Search, filter, pagination
- **Motorcycle Details**: Image gallery, specs, contact info
- **Social Sharing**: Rich previews on Facebook, Zalo, etc.
- **Responsive Design**: Mobile-optimized

### Admin Features
- **Dashboard**: Overview statistics
- **Motorcycle Management**: CRUD operations
- **Image Upload**: Multiple images with compression
- **Status Toggle**: Mark as sold/available
- **Pawn Services**: Manage pawn requests

### Technical Features
- **Page Transitions**: Smooth Harley animation
- **Image Watermarking**: Automatic logo overlay
- **SEO Optimized**: Meta tags, structured data
- **Performance**: Image optimization, lazy loading
- **Security**: CSRF protection, input validation

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXTAUTH_SECRET` | Random secret for auth | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL | `https://your-app.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | Site URL for social sharing | `https://your-app.onrender.com` |

### Database Schema

See `/supabase/` folder for complete database setup:
- **motorcycles**: Main product table
- **pawn_services**: Pawn service requests
- **users**: User management
- **RLS policies**: Row-level security

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📞 Contact Information

- **Address**: 06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An
- **Phone 1**: 0941 231 619
- **Phone 2**: 0975 965 678
- **Facebook**: [bommobile.net](https://www.facebook.com/bommobile.net)
- **Zalo**: 0941 231 619 / 0975 965 678
- **Group**: [Facebook Group](https://www.facebook.com/groups/305902860342012)

## 📄 License

Private project for Vương Cường 68 motorcycle business.

---

**Built with ❤️ for Vương Cường 68**