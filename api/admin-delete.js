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
        console.log(`Auth check: username='${username}', password length=${password?.length || 0}, body keys=${Object.keys(req.body || {}).join(',')}`);
        if (username !== 'rohit' || password !== 'frame2remember') {
            return res.status(401).json({ 
                error: `Unauthorized. Received user='${username || '(empty)'}', pw_len=${password?.length || 0}` 
            });
        }

        if (!supabase) {
            return res.status(503).json({
                error: 'Database not configured.',
                debug: { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey }
            });
        }

        if (!table || !id) {
            return res.status(400).json({ error: 'Table and ID are required', debug: { table, id } });
        }

        // Must strictly check table name to prevent arbitrary table deletion injection
        if (table !== 'enquiries' && table !== 'declarations') {
            return res.status(403).json({ error: 'Invalid table specified' });
        }

        console.log(`Attempting delete: table=${table}, id=${id}, type=${typeof id}`);

        const { data, error, count } = await supabase
            .from(table)
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Supabase delete error:', JSON.stringify(error));
            return res.status(500).json({
                error: 'Database deletion failed',
                details: error.message || error.code || JSON.stringify(error)
            });
        }

        console.log(`Delete result: affected ${data?.length ?? 0} rows`);

        return res.status(200).json({ success: true, deleted: data?.length ?? 0 });

    } catch (error) {
        console.error('Delete Record Error:', error);
        return res.status(500).json({
            error: 'Failed to delete record',
            details: error.message || String(error)
        });
    }
}

