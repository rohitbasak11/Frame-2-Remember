import { createClient } from '@supabase/supabase-js';

// Safely initialize Supabase if keys exist
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, phone, shootType, shootLength, message } = req.body;

        if (!supabase) {
            console.error('Database connection missing (Supabase keys not set).');
            return res.status(503).json({ error: 'Database not configured' });
        }

        // 1. Save to Database
        const { data, error: dbError } = await supabase
            .from('enquiries')
            .insert([{
                name: name || null,
                email: email || null,
                phone: phone || null,
                shoot_type: shootType || null,
                shoot_length: shootLength || null,
                message: message || null
            }])
            .select();

        if (dbError) {
            console.error('Supabase Enquiries Insert Error:', dbError);
            return res.status(500).json({ error: 'Failed to save to database' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Enquiry saved to dashboard',
            data: data[0]
        });

    } catch (error) {
        console.error('Server error handling enquiry:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
