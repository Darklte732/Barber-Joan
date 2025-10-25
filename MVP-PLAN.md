# Joan's Barbershop - Voice AI Appointment System MVP Plan

## Executive Summary

**Business Owner:** Joan (Hispanic barber from El Seibo, Dominican Republic)

**Core Problem:** Automate appointment scheduling through voice AI, reducing manual booking work and missed calls.

**Solution:** Web app integrated with 11 Labs voice AI that allows customers to book, modify, and cancel appointments through natural voice conversations.

---

## MVP Goals

1. **Primary Goal:** Launch a functional voice-powered appointment booking system within 4-6 weeks
2. **Success Metrics:**
   - 80% of calls result in successful bookings
   - Reduce missed appointments by 30%
   - Free up 5+ hours/week of manual scheduling time
   - Handle 20+ appointments per week automatically

---

## Core Features (MVP Phase 1)

### 1. Voice AI Appointment Booking
- **Natural language processing** for appointment requests
- **Bilingual support** (English & Spanish) - critical for Dominican clientele
- Capture essential information:
  - Customer name
  - Phone number
  - Preferred date/time
  - Service type (haircut, beard trim, both)
- Confirm appointment details before booking
- Send SMS confirmation to customer

### 2. Web Dashboard for Joan
- **Daily calendar view** showing all appointments
- **Appointment management:**
  - View upcoming appointments
  - Manual add/edit/cancel appointments
  - Mark appointments as completed/no-show
- **Business hours configuration**
- **Services & pricing management**
- **Blocked time/days off management**

### 3. Customer Information System
- Basic customer database:
  - Name, phone number
  - Appointment history
  - Preferred language
  - Notes (allergies, style preferences, etc.)

### 4. Automated Notifications
- SMS appointment confirmations
- Reminder sent 24 hours before appointment
- Cancellation confirmations

### 5. Simple Booking Rules Engine
- Prevent double-bookings
- Respect business hours
- Service duration blocking (e.g., haircut = 45 min)
- Buffer time between appointments (10-15 min)

---

## Features EXCLUDED from MVP (Phase 2+)

- Payment processing
- Complex staff scheduling (Joan is solo for now)
- Customer mobile app
- Online review collection
- Marketing automation
- Detailed analytics/reporting
- Loyalty programs
- Walk-in queue management
- Photo gallery of haircuts

---

## Technical Architecture

### Frontend (Web Dashboard)
**Tech Stack:**
- **Framework:** React (Next.js for server-side rendering)
- **Styling:** Tailwind CSS
- **State Management:** React Context or Zustand
- **Calendar Component:** FullCalendar or react-big-calendar

**Key Pages:**
1. Login/Authentication
2. Dashboard (calendar view)
3. Appointments list
4. Customer management
5. Settings (business hours, services, profile)

### Backend (API & Business Logic)
**Tech Stack:**
- **Framework:** Node.js with Express or Next.js API routes
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js or similar
- **SMS Service:** To be configured

**Key API Endpoints:**
```
POST   /api/appointments         - Create appointment
GET    /api/appointments         - List appointments (with filters)
GET    /api/appointments/:id     - Get specific appointment
PUT    /api/appointments/:id     - Update appointment
DELETE /api/appointments/:id     - Cancel appointment

POST   /api/voice/webhook        - Handle 11 Labs voice requests
POST   /api/voice/availability   - Check available time slots

GET    /api/customers            - List customers
POST   /api/customers            - Create customer
GET    /api/customers/:id        - Get customer details

GET    /api/settings             - Get business settings
PUT    /api/settings             - Update business settings
```

### Voice AI Integration (11 Labs)
**Architecture:**
1. Phone call comes in → triggers 11 Labs voice AI
2. Voice AI captures intent and information
3. Webhook sent to backend API
4. Backend processes request:
   - Check availability
   - Create appointment
   - Update customer record
5. Backend returns response to 11 Labs
6. Voice AI confirms to customer
7. SMS sent to customer

**Voice AI Conversation Flow:**
```
AI: "¡Hola! Thank you for calling Joan's Barbershop.
     Would you like to continue in English or Spanish?"

Customer: "Spanish" / "Español"

AI: "Perfecto. ¿En qué puedo ayudarte hoy?"

Customer: "I need a haircut"

AI: "Great! What day works best for you?"

Customer: "This Friday"

AI: "And what time would you prefer?"

Customer: "Around 2pm"

AI: [Checks availability]
    "I have 2:00 PM and 2:45 PM available on Friday.
     Which works better?"

Customer: "2 PM"

AI: "Perfect! Can I get your name please?"

Customer: "Carlos Rodriguez"

AI: "Thank you Carlos. And your phone number?"

Customer: "809-555-1234"

AI: "Got it. What service do you need?
     Haircut, beard trim, or both?"

Customer: "Just a haircut"

AI: "Perfect! So I have you booked for a haircut
     this Friday at 2:00 PM. You'll receive a
     confirmation text shortly. Is there anything
     else I can help you with?"
```

---

## Database Schema

### Tables

**users**
- id (UUID, primary key)
- email (unique)
- name
- role (admin/barber)
- created_at
- updated_at

**customers**
- id (UUID, primary key)
- name
- phone (unique)
- email (optional)
- preferred_language (en/es)
- notes
- created_at
- updated_at

**appointments**
- id (UUID, primary key)
- customer_id (foreign key)
- start_time (timestamp)
- end_time (timestamp)
- service_type (haircut/beard/both)
- status (pending/confirmed/completed/cancelled/no_show)
- price (decimal)
- notes
- created_by (voice_ai/manual/customer)
- reminder_sent (boolean)
- created_at
- updated_at

**services**
- id (UUID, primary key)
- name
- name_es (Spanish name)
- duration_minutes
- price
- active (boolean)
- created_at
- updated_at

**business_settings**
- id (UUID, primary key)
- business_name
- phone_number
- timezone
- business_hours (JSON: {monday: {open: "09:00", close: "18:00"}, ...})
- buffer_minutes (between appointments)
- advance_booking_days (how far ahead customers can book)
- updated_at

**blocked_times**
- id (UUID, primary key)
- start_time (timestamp)
- end_time (timestamp)
- reason (vacation/break/other)
- created_at

---

## User Flows

### Flow 1: Customer Books via Voice AI
1. Customer calls the phone number
2. 11 Labs AI answers and greets in bilingual manner
3. AI determines preferred language
4. AI collects: name, phone, date, time, service
5. AI checks availability via webhook
6. AI confirms appointment details
7. System creates appointment in database
8. System sends SMS confirmation to customer
9. Joan sees appointment in dashboard

### Flow 2: Joan Manually Books Appointment
1. Joan logs into web dashboard
2. Clicks "New Appointment" on calendar
3. Selects date/time slot
4. Searches for existing customer or creates new
5. Selects service type
6. Adds optional notes
7. Saves appointment
8. System sends SMS confirmation

### Flow 3: Appointment Reminder
1. Cron job runs every hour
2. Checks for appointments 24 hours away
3. Sends SMS reminder to customers
4. Marks reminder as sent

### Flow 4: Customer Cancels via Voice AI
1. Customer calls to cancel
2. AI asks for phone number or name
3. AI looks up upcoming appointments
4. AI confirms which appointment to cancel
5. AI cancels appointment
6. System sends cancellation confirmation SMS
7. Time slot becomes available again

---

## Development Phases

### Week 1-2: Foundation
- Set up development environment
- Database schema implementation
- Basic authentication system
- Create API endpoints for appointments
- Build basic dashboard UI with calendar

### Week 3-4: Core Features
- Implement appointment CRUD operations
- Business hours and service management
- SMS integration
- Basic customer management
- Appointment validation logic

### Week 5: Voice AI Integration
- Design webhook endpoints for 11 Labs
- Implement availability checking logic
- Build conversation handlers
- Test voice AI flows
- Create fallback responses

### Week 6: Testing & Launch
- End-to-end testing
- Voice AI conversation refinement
- Bilingual content review
- Load testing
- Deploy to production
- Connect phone number
- Train Joan on dashboard

---

## Voice AI Prompt Strategy

### System Prompt for 11 Labs
```
You are a friendly, bilingual receptionist for Joan's Barbershop
in El Seibo, Dominican Republic. Your job is to help customers
book haircut appointments.

PERSONALITY:
- Warm, professional, and efficient
- Fluent in English and Spanish
- Patient with customers
- Culturally aware of Dominican communication style

CAPABILITIES:
- Book new appointments
- Check appointment availability
- Cancel/reschedule appointments
- Answer basic questions about services and hours

SERVICES OFFERED:
- Haircut ($20, 45 minutes)
- Beard Trim ($10, 15 minutes)
- Haircut + Beard ($25, 60 minutes)

BUSINESS HOURS:
- Monday-Saturday: 9:00 AM - 6:00 PM
- Sunday: Closed

PROCESS:
1. Greet customer and ask language preference
2. Determine intent (book/cancel/reschedule/question)
3. Collect necessary information
4. Verify availability via API call
5. Confirm details with customer
6. Complete the action
7. Say goodbye professionally

IMPORTANT RULES:
- Always confirm details before booking
- Be specific about date and time
- Use 12-hour format with AM/PM
- If a time is unavailable, suggest alternatives
- For cancellations, confirm customer identity first
- Never make assumptions about customer preferences
```

---

## MVP Launch Checklist

### Pre-Launch
- [ ] Database deployed and configured
- [ ] Web dashboard deployed and accessible
- [ ] Joan's account created with admin access
- [ ] SMS service configured with credits
- [ ] Test appointments created and verified
- [ ] Business hours and services configured
- [ ] 11 Labs voice AI integrated and tested
- [ ] Phone number connected and tested
- [ ] Bilingual content reviewed by native Spanish speaker
- [ ] Backup/recovery plan in place

### Launch Day
- [ ] Announce new system to existing customers
- [ ] Update business phone number if needed
- [ ] Monitor first 10 calls closely
- [ ] Have fallback plan (Joan's cell) ready
- [ ] Collect immediate feedback

### Post-Launch (Week 1)
- [ ] Daily monitoring of appointment creation
- [ ] Review voice AI conversation logs
- [ ] Fix any critical bugs immediately
- [ ] Gather Joan's feedback on dashboard
- [ ] Track SMS delivery rates
- [ ] Monitor no-show rates

---

## Cost Estimation (Monthly)

### Infrastructure
- **Hosting:** $0-20
- **Database:** $0-25
- **Domain:** $1-2

### Services
- **11 Labs Voice AI:** $20-100 (depends on call volume)
- **SMS Service:** $20-50 (est. 200 messages)
- **Phone Number:** $5-15

**Total Estimated Monthly Cost:** $46-212

### One-Time Development
- **DIY (Joan or friend building):** Time investment
- **Freelance Developer:** $2,000-5,000
- **Agency:** $8,000-15,000

---

## Success Metrics to Track

### Week 1
- Number of calls received
- Successful booking rate (target: 70%+)
- System uptime
- Critical bugs identified

### Month 1
- Total appointments booked
- Voice AI vs manual booking ratio
- No-show rate
- Customer feedback
- Time saved per week

### Month 3
- Customer retention rate
- Repeat bookings through voice AI
- Revenue impact
- System stability
- Feature requests for Phase 2

---

## Risk Mitigation

### Technical Risks
- **Voice AI misunderstanding:** Implement fallback to human
- **System downtime:** Have Joan's cell as backup
- **SMS delivery failure:** Add email backup notifications
- **Data loss:** Daily automated backups

### Business Risks
- **Customer adoption:** Clear signage and announcement
- **Language barriers:** Ensure truly bilingual AI
- **Over-booking:** Conservative buffer times initially
- **Technical support:** Document everything for Joan

---

## Phase 2 Features (Post-MVP)

Once MVP is stable (2-3 months), consider:
1. **Payment integration** (deposits for no-shows)
2. **Customer self-service portal** (view/manage appointments)
3. **WhatsApp integration** (popular in Dominican Republic)
4. **Basic analytics dashboard**
5. **Multiple barber support** (if Joan expands)
6. **Service packages/memberships**
7. **Photo gallery** of Joan's work
8. **Google Business integration** for reviews
9. **Waitlist management**
10. **Marketing automation** (birthday messages, promos)

---

## Next Steps

1. **Review this plan with Joan** - Get feedback and priorities
2. **Choose tech stack** - Confirm technology decisions
3. **Set up development environment**
4. **Create project timeline** with specific deadlines
5. **Design simple mockups** of dashboard (optional)
6. **Prepare 11 Labs integration details** when ready
7. **Get phone number** for testing
8. **Start building!**

---

## Questions to Clarify with Joan

1. What are your exact business hours?
2. Current services and pricing?
3. How long does each service take?
4. Do you want to block lunch breaks?
5. How many days in advance can customers book?
6. What's your preferred language for the dashboard? (English/Spanish)
7. Do you have a business email already?
8. What phone number will be used for the voice AI?
9. Do you need to track any specific customer preferences?
10. Any services you DON'T want to offer online booking for?

---

**Document Version:** 1.0
**Created:** October 23, 2025
**For:** Joan's Barbershop, El Seibo
