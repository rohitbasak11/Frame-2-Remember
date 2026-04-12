import pkg from 'pg';
const { Client } = pkg;

export default async function handler(req, res) {
    // Basic security: require a secret token passed in query
    const { token } = req.query;
    if (token !== 'rohit_db_init_2026') {
        return res.status(401).send('Unauthorized');
    }

    const client = new Client({
        connectionString: 'postgresql://postgres:AslxYdFt7zuf5DVC@db.octgqfaufggixsytmjmn.supabase.co:5432/postgres',
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        
        // Run the SQL commands
        await client.query(`
            CREATE TABLE IF NOT EXISTS enquiries (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT,
                phone TEXT,
                shoot_type TEXT,
                message TEXT,
                shoot_length TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now())
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS declarations (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT,
                time TEXT,
                message TEXT,
                pdf_base64 TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now())
            );
        `);

        // Add shoot_length if it somehow missed being created in IF NOT EXISTS table creation
        await client.query('ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS shoot_length TEXT;');

        await client.end();
        return res.status(200).json({ success: true, message: 'Database initialized successfully via Vercel.' });
    } catch (err) {
        if (client) await client.end();
        return res.status(500).json({ success: false, error: err.message });
    }
}
