# Quick Setup Guide

Follow these steps to get Joan's Barbershop running in under 30 minutes.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Text editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## Step-by-Step Setup

### Step 1: Database Setup (5 minutes)

```bash
# Create database
createdb barbershop

# Run schema
psql -d barbershop -f lib/db/schema.sql

# Verify tables were created
psql -d barbershop -c "\dt"
```

You should see these tables:
- users
- customers
- appointments
- services
- business_settings
- blocked_times

### Step 2: Environment Configuration (5 minutes)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
code .env  # or use your preferred editor
```

**Required** environment variables:

```env
DATABASE_URL="postgresql://localhost:5432/barbershop"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

**Optional** (for testing):
```env
ELEVENLABS_API_KEY="get-from-elevenlabs.io"
SMS_API_KEY="get-from-twilio.com"
SMS_API_SECRET="get-from-twilio.com"
```

### Step 3: Install Dependencies (3 minutes)

```bash
npm install
```

This installs:
- Next.js framework
- React and React DOM
- NextAuth for authentication
- PostgreSQL client
- Date utilities
- UI libraries

### Step 4: Start Development Server (1 minute)

```bash
npm run dev
```

Server will start at `http://localhost:3000`

### Step 5: First Login (2 minutes)

1. Open browser to `http://localhost:3000`
2. Click "Login to Dashboard"
3. Use default credentials:
   - Email: `booklovers159@gmail.com`
   - Password: `Saint159753!!`
4. **Change password immediately!**

### Step 6: Configure Business Settings (5 minutes)

1. Go to Settings page
2. Update:
   - Business name
   - Phone number
   - Business hours for each day
   - Buffer time between appointments
3. Click "Save Settings"

### Step 7: Test the System (5 minutes)

#### Create a Test Appointment

1. Go to Calendar page
2. Click "New Appointment"
3. Fill in:
   - Customer Name: "Test Customer"
   - Phone: "809-555-0001"
   - Service: "Haircut"
   - Date: Tomorrow
   - Time: 10:00 AM
4. Click "Save"

You should see the appointment on the calendar!

#### View Customer

1. Go to Customers page
2. You should see "Test Customer"
3. View their details

### Step 8: Test API Endpoints (Optional)

```bash
# Get appointments
curl http://localhost:3000/api/appointments

# Get services
curl http://localhost:3000/api/services

# Get business settings (requires auth)
curl http://localhost:3000/api/settings
```

## Production Deployment

### Quick Deploy to Vercel (10 minutes)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables (copy from your `.env`)
6. Click "Deploy"

7. Get a production database:
   - [Neon.tech](https://neon.tech) - Free PostgreSQL
   - Copy connection string to Vercel environment variables
   - Run schema on production database

8. Update NEXTAUTH_URL to your Vercel domain

Done! Your app is live.

## Troubleshooting

### Database Won't Connect

```bash
# Check if PostgreSQL is running
pg_isready

# If not, start it
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
net start postgresql-x64-14
```

### Port 3000 Already in Use

```bash
# Find what's using port 3000
# macOS/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# Kill the process or use a different port
PORT=3001 npm run dev
```

### Can't Install Dependencies

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### TypeScript Errors

```bash
# Regenerate TypeScript cache
rm -rf .next
npm run dev
```

### Database Schema Issues

```bash
# Drop and recreate database
dropdb barbershop
createdb barbershop
psql -d barbershop -f lib/db/schema.sql
```

## Next Steps

### Immediate Tasks

1. **Change Default Password**
   - Settings > Profile > Change Password

2. **Configure Business Hours**
   - Settings > Business Hours
   - Set correct hours for each day

3. **Add Real Phone Number**
   - Settings > Business Information
   - Update phone number

4. **Test Appointment Flow**
   - Create, edit, and cancel test appointments
   - Verify they appear on calendar

### Optional Enhancements

5. **Set Up Voice AI**
   - Create 11 Labs account
   - Configure voice agent
   - Test booking via phone

6. **Enable SMS**
   - Set up Twilio account
   - Configure SMS in `.env`
   - Test notifications

7. **Custom Domain**
   - Purchase domain
   - Configure in Vercel
   - Update NEXTAUTH_URL

## Development Workflow

### Making Changes

```bash
# 1. Make your changes in code
# 2. App auto-reloads in development
# 3. Test changes
# 4. Commit to git

git add .
git commit -m "Description of changes"
git push
```

### Database Changes

```bash
# 1. Modify lib/db/schema.sql
# 2. Apply to local database
psql -d barbershop -f lib/db/schema.sql

# 3. Apply to production database
psql YOUR_PRODUCTION_DATABASE_URL -f lib/db/schema.sql
```

### Adding New API Endpoints

1. Create file in `app/api/your-endpoint/route.ts`
2. Export GET, POST, PUT, or DELETE functions
3. Test with curl or Postman
4. Update types in `types/index.ts`

## Security Checklist

Before going live:

- [ ] Changed default admin password
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enabled HTTPS (automatic with Vercel)
- [ ] Removed test data from database
- [ ] Configured proper backup strategy
- [ ] Added rate limiting (optional)
- [ ] Reviewed all environment variables
- [ ] Tested all user flows

## Performance Checklist

- [ ] Database has proper indexes (included in schema)
- [ ] Images are optimized
- [ ] Enabled caching where appropriate
- [ ] Tested on mobile devices
- [ ] Verified load times < 2 seconds
- [ ] Checked for console errors

## Getting Help

If you're stuck:

1. Check the main README.md
2. Review the MVP-PLAN.md
3. Check database logs: `psql -d barbershop`
4. Check application logs in terminal
5. Review API responses in browser DevTools

## Success Criteria

Your system is ready when:

- ✅ You can log in
- ✅ You can create appointments
- ✅ Calendar displays correctly
- ✅ Customers are tracked
- ✅ Settings can be updated
- ✅ No errors in console
- ✅ Database is backed up
- ✅ Default password changed

## Estimated Time Breakdown

- Database setup: 5 min
- Environment config: 5 min
- Install dependencies: 3 min
- Start server: 1 min
- First login: 2 min
- Configure settings: 5 min
- Test system: 5 min
- **Total: ~25 minutes**

Production deployment: +10 min

---

**Good luck! 🚀**

For support, refer to README.md or create an issue.
