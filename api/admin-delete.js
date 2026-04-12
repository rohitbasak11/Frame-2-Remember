import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, password, table, id } = req.body;

        // Verify Authentication
        if (username !== 'rohit' || password !== 'frame2remember') {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        if (!supabase) {
            return res.status(503).json({ error: 'Database not configured yet.' });
        }

        if (!table || !id) {
            return res.status(400).json({ error: 'Table and ID are required' });
        }

        // Must strictly check table name to prevent arbitrary table deletion injection
        if (table !== 'enquiries' && table !== 'declarations') {
            return res.status(403).json({ error: 'Invalid table specified' });
        }

        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Delete Record Error:', error);
        return res.status(500).json({ error: 'Failed to delete record' });
    }
}
