# Quick Start Guide (Without PostgreSQL)

Since PostgreSQL is not installed on your system, here are alternative options to get started quickly:

## Option 1: Use Online PostgreSQL (Easiest)

### Using Neon (Free PostgreSQL Database)

1. **Sign up for Neon**
   - Go to https://neon.tech
   - Create a free account
   - Create a new project

2. **Get your connection string**
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb
   ```

3. **Update your `.env` file**
   ```env
   DATABASE_URL="your-neon-connection-string-here"
   ```

4. **Initialize the database**
   - Copy the contents of `lib/db/schema.sql`
   - Go to Neon's SQL Editor
   - Paste and run the schema

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Login**
   - URL: `http://localhost:3000`
   - Email: `booklovers159@gmail.com`
   - Password: `Saint159753!!`

## Option 2: Use Supabase (Also Free)

1. **Sign up for Supabase**
   - Go to https://supabase.com
   - Create a free account
   - Create a new project

2. **Get your connection string**
   - Go to Project Settings → Database
   - Copy the "Connection string" (use "Pooler" mode for better performance)

3. **Update your `.env` file**
   ```env
   DATABASE_URL="your-supabase-connection-string"
   ```

4. **Initialize the database**
   - Go to Supabase SQL Editor
   - Paste contents of `lib/db/schema.sql`
   - Run it

5. **Start the application**
   ```bash
   npm run dev
   ```

## Option 3: Install PostgreSQL Locally

### Windows
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use chocolatey:
choco install postgresql

# After installation:
cd app
psql -U postgres -c "CREATE DATABASE barbershop;"
psql -U postgres -d barbershop -f lib/db/schema.sql
```

### macOS
```bash
brew install postgresql
brew services start postgresql
cd app
createdb barbershop
psql -d barbershop -f lib/db/schema.sql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb barbershop
sudo -u postgres psql -d barbershop -f lib/db/schema.sql
```

## Option 4: Use Docker (If Docker is installed)

```bash
# Start PostgreSQL in Docker
docker run --name barbershop-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=barbershop \
  -p 5432:5432 \
  -d postgres:15

# Wait a few seconds for PostgreSQL to start

# Run schema
docker exec -i barbershop-db psql -U postgres -d barbershop < lib/db/schema.sql
```

Then update `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/barbershop"
```

## Recommended: Neon or Supabase

For the fastest setup without installing anything, I recommend **Neon** or **Supabase**:

### Why Neon?
- ✅ Free tier (no credit card required)
- ✅ No installation needed
- ✅ Fast setup (< 2 minutes)
- ✅ Automatic backups
- ✅ Built-in SQL editor

### Why Supabase?
- ✅ Free tier (no credit card required)
- ✅ Includes extra features (Auth, Storage, Realtime)
- ✅ Nice dashboard
- ✅ SQL editor included

## After Database Setup

Once your database is ready:

1. **Test the connection**
   ```bash
   cd app
   npm run dev
   ```

2. **Open your browser**
   - Go to `http://localhost:3000`
   - Click "Login to Dashboard"
   - Use credentials: `booklovers159@gmail.com` / `Saint159753!!`

3. **You're ready!**
   - Create test appointments
   - Explore the dashboard
   - Configure your business settings

## Troubleshooting

**Can't connect to database?**
- Check your DATABASE_URL in `.env` is correct
- Make sure you ran the schema.sql
- Try restarting the dev server

**Login not working?**
- Password is: `Saint159753!!` (exactly, case-sensitive)
- Email is: `booklovers159@gmail.com`
- Clear your browser cache and try again

**Still having issues?**
Check the terminal for error messages and verify:
1. `.env` file exists
2. DATABASE_URL is set
3. Database schema was applied
4. Port 3000 is not in use

---

**Need help?** Check the main README.md or SETUP.md for more detailed instructions.
