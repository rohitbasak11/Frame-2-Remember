import pkg from 'pg';
const { Client } = pkg;

export default async function handler(req, res) {
    const { key } = req.query;
    // Security check
    if (key !== 'f2r_proof_889') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Starting DB Connection via Vercel...');
    
    // Switch to IPv4 Pooler which is more reliable for cloud-to-cloud
    const client = new Client({
        connectionString: 'postgresql://postgres.octgqfaufggixsytmjmn:AslxYdFt7zuf5DVC@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres',
        ssl: {
            rejectUnauthorized: false
        },
        connectionTimeoutMillis: 5000,
    });

    try {
        await client.connect();
        
        // The Proof Task: Add an admin_notes column
        await client.query('ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS admin_notes TEXT;');
        
        await client.end();
        return res.status(200).json({ 
            success: true, 
            message: 'Direct DB Edit Success: Added admin_notes column to enquiries table.' 
        });
    } catch (err) {
        if (client) await client.end();
        return res.status(500).json({ success: false, error: err.message });
    }
}
