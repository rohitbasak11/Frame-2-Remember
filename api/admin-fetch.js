import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        // Hardcoded basic authentication as requested
        if (username !== 'rohit' || password !== 'frame2remember') {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        if (!supabase) {
            return res.status(503).json({ error: 'Database not configured yet. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' });
        }

        // Fetch data simultaneously
        const [enquiriesResponse, declarationsResponse] = await Promise.all([
            supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
            supabase.from('declarations').select('*').order('created_at', { ascending: false })
        ]);

        if (enquiriesResponse.error) throw enquiriesResponse.error;
        if (declarationsResponse.error) throw declarationsResponse.error;

        return res.status(200).json({
            success: true,
            data: {
                enquiries: enquiriesResponse.data,
                declarations: declarationsResponse.data
            }
        });

    } catch (error) {
        console.error('Admin Fetch Error:', error);
        return res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
}
