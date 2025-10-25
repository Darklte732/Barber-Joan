import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export { pool };

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper to get a client from the pool for transactions
export async function getClient() {
  const client = await pool.connect();
  const originalQuery = client.query;
  const originalRelease = client.release;

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  (client as any).query = (...args: any[]) => {
    // @ts-ignore - Monkey patching requires bypassing strict types
    return originalQuery.apply(client, args);
  };

  (client as any).release = () => {
    // Clear our timeout
    clearTimeout(timeout);
    // Set the methods back to their old un-monkey-patched version
    (client as any).query = originalQuery;
    (client as any).release = originalRelease;
    return originalRelease.apply(client);
  };

  return client;
}

// Database helper functions

export const db = {
  // Users
  async getUserByEmail(email: string) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async createUser(email: string, name: string, passwordHash: string, role: string = 'barber') {
    const result = await query(
      'INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, name, passwordHash, role]
    );
    return result.rows[0];
  },

  // Customers
  async getCustomerByPhone(phone: string) {
    const result = await query('SELECT * FROM customers WHERE phone = $1', [phone]);
    return result.rows[0];
  },

  async getCustomerById(id: string) {
    const result = await query('SELECT * FROM customers WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createCustomer(data: { name: string; phone: string; email?: string; preferred_language?: string; notes?: string }) {
    const result = await query(
      'INSERT INTO customers (name, phone, email, preferred_language, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data.name, data.phone, data.email, data.preferred_language || 'es', data.notes]
    );
    return result.rows[0];
  },

  async updateCustomer(id: string, data: Partial<{ name: string; phone: string; email: string; notes: string }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

    const result = await query(
      `UPDATE customers SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },

  async getAllCustomers() {
    const result = await query('SELECT * FROM customers ORDER BY created_at DESC');
    return result.rows;
  },

  // Services
  async getAllServices() {
    const result = await query('SELECT * FROM services WHERE active = true ORDER BY price');
    return result.rows;
  },

  async getServiceById(id: string) {
    const result = await query('SELECT * FROM services WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Appointments
  async createAppointment(data: {
    customer_id: string;
    service_id: string;
    start_time: Date;
    end_time: Date;
    price: number;
    notes?: string;
    created_by?: string;
  }) {
    const result = await query(
      `INSERT INTO appointments (customer_id, service_id, start_time, end_time, price, notes, created_by, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
      [
        data.customer_id,
        data.service_id,
        data.start_time,
        data.end_time,
        data.price,
        data.notes,
        data.created_by || 'manual',
      ]
    );
    return result.rows[0];
  },

  async getAppointmentById(id: string) {
    const result = await query(
      `SELECT a.*,
              c.name as customer_name, c.phone as customer_phone, c.preferred_language,
              s.name as service_name, s.name_es as service_name_es, s.duration_minutes
       FROM appointments a
       JOIN customers c ON a.customer_id = c.id
       JOIN services s ON a.service_id = s.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async getAppointmentsByDateRange(startDate: Date, endDate: Date) {
    const result = await query(
      `SELECT a.*,
              c.name as customer_name, c.phone as customer_phone, c.preferred_language,
              s.name as service_name, s.name_es as service_name_es, s.duration_minutes
       FROM appointments a
       JOIN customers c ON a.customer_id = c.id
       JOIN services s ON a.service_id = s.id
       WHERE a.start_time >= $1 AND a.start_time < $2
       AND a.status != 'cancelled'
       ORDER BY a.start_time`,
      [startDate, endDate]
    );
    return result.rows;
  },

  async updateAppointment(id: string, data: Partial<{
    start_time: Date;
    end_time: Date;
    status: string;
    notes: string;
    reminder_sent: boolean;
  }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

    const result = await query(
      `UPDATE appointments SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },

  async cancelAppointment(id: string) {
    const result = await query(
      `UPDATE appointments SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  // Business Settings
  async getBusinessSettings() {
    const result = await query('SELECT * FROM business_settings LIMIT 1');
    return result.rows[0];
  },

  async updateBusinessSettings(data: Partial<{
    business_name: string;
    phone_number: string;
    timezone: string;
    business_hours: any;
    buffer_minutes: number;
    advance_booking_days: number;
  }>) {
    const settings = await this.getBusinessSettings();
    if (!settings) {
      throw new Error('Business settings not found');
    }

    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

    const result = await query(
      `UPDATE business_settings SET ${setClause} WHERE id = $1 RETURNING *`,
      [settings.id, ...values]
    );
    return result.rows[0];
  },

  // Blocked Times
  async getBlockedTimesByDateRange(startDate: Date, endDate: Date) {
    const result = await query(
      `SELECT * FROM blocked_times
       WHERE (start_time >= $1 AND start_time < $2)
       OR (end_time > $1 AND end_time <= $2)
       OR (start_time <= $1 AND end_time >= $2)
       ORDER BY start_time`,
      [startDate, endDate]
    );
    return result.rows;
  },

  async createBlockedTime(startTime: Date, endTime: Date, reason?: string) {
    const result = await query(
      'INSERT INTO blocked_times (start_time, end_time, reason) VALUES ($1, $2, $3) RETURNING *',
      [startTime, endTime, reason]
    );
    return result.rows[0];
  },

  async deleteBlockedTime(id: string) {
    const result = await query('DELETE FROM blocked_times WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};
