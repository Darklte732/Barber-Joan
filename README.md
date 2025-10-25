# Joan's Barbershop - Voice AI Appointment System

A complete appointment booking system with 11 Labs voice AI integration for Joan's Barbershop in El Seibo, Dominican Republic.

## Features

- ✅ **Voice AI Booking** - Natural language appointment booking via 11 Labs
- ✅ **Bilingual Support** - English and Spanish
- ✅ **Calendar Management** - Visual weekly calendar with drag-and-drop
- ✅ **Customer Database** - Track customer information and preferences
- ✅ **SMS Notifications** - Automated confirmations and reminders
- ✅ **Business Settings** - Configurable hours, services, and pricing
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Authentication** - Secure login for staff

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Voice AI**: 11 Labs
- **SMS**: Configurable (Twilio, AWS SNS, etc.)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and npm/yarn installed
- PostgreSQL database
- 11 Labs account and API key
- SMS service account (optional for MVP testing)

## Installation

### 1. Clone and Install Dependencies

```bash
cd app
npm install
```

### 2. Set Up Database

Create a PostgreSQL database:

```bash
createdb barbershop
```

Run the schema migration:

```bash
psql -d barbershop -f lib/db/schema.sql
```

This will:
- Create all necessary tables
- Insert default services (Haircut, Beard Trim, Haircut + Beard)
- Insert default business settings
- Create a default admin user

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/barbershop"

# NextAuth - Generate a secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"

# 11 Labs Voice AI
ELEVENLABS_API_KEY="your-elevenlabs-api-key"
ELEVENLABS_AGENT_ID="your-agent-id"

# SMS Service (optional for testing)
SMS_API_KEY="your-sms-api-key"
SMS_API_SECRET="your-sms-api-secret"
SMS_PHONE_NUMBER="+1234567890"

# Business Configuration
BUSINESS_TIMEZONE="America/Santo_Domingo"
BUSINESS_PHONE="+1-809-XXX-XXXX"
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Default Login Credentials

**Email**: `booklovers159@gmail.com`
**Password**: `Saint159753!!`

**⚠️ IMPORTANT**: Change this password immediately after first login!

## Database Schema

### Tables

- **users** - Staff accounts and authentication
- **customers** - Customer information and preferences
- **appointments** - Booking records with status tracking
- **services** - Available services (haircut, beard, etc.)
- **business_settings** - Business hours, timezone, buffer time
- **blocked_times** - Vacations, breaks, closed days

### Key Relationships

```
customers (1) ----< (*) appointments
services  (1) ----< (*) appointments
```

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Appointments

- `GET /api/appointments` - List appointments (with date filters)
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Customers

- `GET /api/customers` - List all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer

### Voice AI

- `POST /api/voice/webhook` - 11 Labs webhook for voice interactions
- `POST /api/voice/availability` - Check available time slots

### Settings

- `GET /api/settings` - Get business settings
- `PUT /api/settings` - Update business settings (admin only)

### Services

- `GET /api/services` - List active services

## Voice AI Integration

### 11 Labs Setup

1. Create an account at [elevenlabs.io](https://elevenlabs.io)
2. Create a new Conversational AI agent
3. Use the prompt from `/voice-ai-prompt.md`
4. Configure webhook to point to your deployment:
   ```
   https://your-domain.com/api/voice/webhook
   ```
5. Add your API key to `.env`

### Voice AI Features

- Book new appointments
- Cancel existing appointments
- Reschedule appointments
- Answer service inquiries
- Check availability
- Bilingual (English/Spanish)

### Example Voice Flow

```
Customer: "Hola, quiero hacer una cita"
AI: "¡Perfecto! ¿Qué servicio necesitas?"
Customer: "Un corte de pelo"
AI: "¿Para qué día?"
Customer: "Este viernes"
AI: "¿A qué hora?"
Customer: "A las 2"
AI: *checks availability*
AI: "Tengo disponible a las 2:00 PM. ¿Tu nombre?"
Customer: "Carlos Rodriguez"
AI: "¿Y tu número de teléfono?"
Customer: "809-555-1234"
AI: "¡Listo! Confirmada tu cita para corte el viernes a las 2:00 PM"
```

## SMS Notifications

### Setup with Twilio (Recommended)

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Update `.env`:
   ```env
   SMS_API_KEY="your_account_sid"
   SMS_API_SECRET="your_auth_token"
   SMS_PHONE_NUMBER="+1234567890"
   ```

5. Update `lib/sms.ts` to use Twilio client (code example included in comments)

### SMS Templates

- **Confirmation**: "Tu cita para [service] está confirmada para [date/time]"
- **Reminder**: "Recordatorio: tienes una cita mañana a las [time]"
- **Cancellation**: "Tu cita del [date] ha sido cancelada"
- **Reschedule**: "Tu cita se cambió del [old] al [new]"

## Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

Vercel will automatically:
- Build your Next.js app
- Set up SSL
- Provide a domain

### Option 2: Railway

1. Sign up at [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add PostgreSQL database
4. Add environment variables
5. Deploy

### Option 3: Self-Hosted (VPS)

```bash
# Build the application
npm run build

# Start with PM2
pm2 start npm --name "barbershop" -- start

# Set up Nginx reverse proxy
# Point to http://localhost:3000
```

### Database Hosting

**Recommended Options:**
- [Neon](https://neon.tech) - Free PostgreSQL
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - PostgreSQL included
- [AWS RDS](https://aws.amazon.com/rds/) - Production scale

## Configuration

### Business Hours

1. Log in to dashboard
2. Go to Settings
3. Update business hours for each day
4. Set buffer time between appointments
5. Configure advance booking window

### Services

Default services included:
- Haircut - $20 (45 min)
- Beard Trim - $10 (15 min)
- Haircut + Beard - $25 (60 min)

To add/modify services, update the database directly or extend the Settings page.

### Blocked Times

For vacations or breaks:

```sql
INSERT INTO blocked_times (start_time, end_time, reason)
VALUES ('2025-11-01 09:00:00', '2025-11-01 18:00:00', 'Vacation');
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql -d barbershop -U your_user

# Check if tables exist
\dt

# View appointment data
SELECT * FROM appointments LIMIT 10;
```

### Voice AI Not Working

1. Check webhook URL is accessible
2. Verify ELEVENLABS_API_KEY in `.env`
3. Check webhook logs in 11 Labs dashboard
4. Test endpoint: `curl -X POST http://localhost:3000/api/voice/webhook`

### SMS Not Sending

1. Verify SMS credentials in `.env`
2. Check SMS provider dashboard for errors
3. Ensure phone numbers are in E.164 format: `+1234567890`
4. Check `lib/sms.ts` implementation

### Login Issues

```bash
# Reset admin password (run in psql)
UPDATE users
SET password_hash = '$2a$10$jievieVsGqwrs7amsx3Gvu6J4vzG5CFZfP7IcTTTx4i1IU58122zO'
WHERE email = 'booklovers159@gmail.com';

# Password will be: Saint159753!!
```

## Development

### Project Structure

```
app/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── appointments/     # Appointment endpoints
│   │   ├── customers/        # Customer endpoints
│   │   ├── voice/            # Voice AI webhooks
│   │   ├── settings/         # Settings endpoint
│   │   └── auth/             # Authentication
│   ├── dashboard/            # Dashboard pages
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── dashboard/            # Dashboard components
│   ├── appointments/         # Appointment components
│   ├── customers/            # Customer components
│   └── ui/                   # Reusable UI components
├── lib/                      # Utilities and helpers
│   ├── db/                   # Database connection and queries
│   ├── validations/          # Validation logic
│   ├── auth.ts               # Authentication config
│   └── sms.ts                # SMS service
├── types/                    # TypeScript type definitions
├── public/                   # Static assets
└── package.json              # Dependencies
```

### Adding New Features

1. Create API endpoint in `app/api/`
2. Add database queries in `lib/db/index.ts`
3. Create UI components in `components/`
4. Add page in `app/dashboard/`
5. Update types in `types/index.ts`

### Running Tests

```bash
# Add tests
npm install --save-dev jest @testing-library/react

# Run tests
npm test
```

## Security

### Best Practices Implemented

- ✅ Password hashing with bcrypt
- ✅ JWT session tokens
- ✅ SQL injection prevention (parameterized queries)
- ✅ CSRF protection (Next.js built-in)
- ✅ Environment variable secrets
- ✅ API route authentication

### Additional Security Steps

1. **Change default password immediately**
2. **Use strong NEXTAUTH_SECRET**
3. **Enable HTTPS in production**
4. **Implement rate limiting** for API routes
5. **Regular database backups**
6. **Monitor logs** for suspicious activity

## Performance

### Optimizations

- Server-side rendering for fast initial load
- API route caching where appropriate
- Database indexes on frequently queried columns
- Connection pooling for database
- Image optimization (Next.js built-in)

### Monitoring

Monitor these metrics:
- Response time for API endpoints
- Database query performance
- Voice AI webhook success rate
- SMS delivery rate
- User session duration

## Support

### Getting Help

- Check the MVP Plan: `/MVP-PLAN.md`
- Voice AI Prompt: `/voice-ai-prompt.md`
- Database Schema: `lib/db/schema.sql`

### Common Questions

**Q: How do I add more barbers?**
A: Extend the user system with barber profiles and multi-calendar support.

**Q: Can customers book online without calling?**
A: Yes, you can add a public booking page (Phase 2 feature).

**Q: How do I export appointment data?**
A: Query the database directly or add an export feature to the dashboard.

**Q: Can I integrate with Google Calendar?**
A: Yes, use the Google Calendar API to sync appointments.

## License

Private project for Joan's Barbershop.

## Credits

Built with:
- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- 11 Labs
- NextAuth.js

---

**Version**: 1.0.0
**Created**: October 2025
**For**: Joan's Barbershop, El Seibo, Dominican Republic
