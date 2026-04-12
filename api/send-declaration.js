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
        const { name, email, time, message, pdfBase64 } = req.body;

        if (!supabase) {
            console.error('Database connection missing (Supabase keys not set).');
            return res.status(503).json({ error: 'Database not configured' });
        }

        // 1. Save to Database
        const { data, error: dbError } = await supabase
            .from('declarations')
            .insert([{
                name: name || null,
                email: email || null,
                time: time || null,
                message: message || null,
                pdf_base64: pdfBase64 || null
            }])
            .select();

        if (dbError) {
            console.error('Supabase Declarations Insert Error:', dbError);
            return res.status(500).json({ error: 'Failed to save to database' });
        }

        // Return success now that email is disabled
        return res.status(200).json({ 
            success: true, 
            message: 'Declaration saved to dashboard',
            data: data[0]
        });

    } catch (error) {
        console.error('Server error handling declaration:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
