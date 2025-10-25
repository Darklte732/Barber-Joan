#!/bin/bash
# Database Setup Script for Joan's Barbershop

echo "🏪 Joan's Barbershop - Database Setup"
echo "======================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed"
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql"
    echo "  Windows: Download from postgresql.org"
    exit 1
fi

echo "✅ PostgreSQL found"
echo ""

# Database name
DB_NAME="barbershop"

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping database..."
        dropdb $DB_NAME
        echo "✅ Database dropped"
    else
        echo "Keeping existing database"
        exit 0
    fi
fi

# Create database
echo "Creating database '$DB_NAME'..."
createdb $DB_NAME

if [ $? -eq 0 ]; then
    echo "✅ Database created"
else
    echo "❌ Failed to create database"
    exit 1
fi

# Run schema
echo ""
echo "Running schema migration..."
psql -d $DB_NAME -f lib/db/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema applied successfully"
else
    echo "❌ Failed to apply schema"
    exit 1
fi

# Verify tables
echo ""
echo "Verifying tables..."
TABLES=$(psql -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

if [ "$TABLES" -ge 6 ]; then
    echo "✅ All tables created ($TABLES tables)"
else
    echo "⚠️  Expected 6 tables, found $TABLES"
fi

# Show table list
echo ""
echo "📊 Database Tables:"
psql -d $DB_NAME -c "\dt"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env"
echo "  2. Update DATABASE_URL in .env"
echo "  3. Run: npm install"
echo "  4. Run: npm run dev"
echo ""
echo "Default login:"
echo "  Email: admin@joansbarbershop.com"
echo "  Password: admin123"
echo ""
echo "⚠️  Remember to change the default password!"
