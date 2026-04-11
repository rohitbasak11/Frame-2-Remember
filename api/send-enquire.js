import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/** Escape HTML special chars to prevent XSS in email bodies */
const esc = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, phone, shootType, message } = req.body;

        const { data, error } = await resend.emails.send({
            from: 'Frame 2 Remember <onboarding@resend.dev>',
            to: 'rohitbasaknote@gmail.com',
            reply_to: email,
            subject: `New Enquiry: ${esc(name)} (${esc(shootType)})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px;">
                    <h2>New Shoot Enquiry</h2>
                    <p><strong>Name:</strong> ${esc(name) || 'N/A'}</p>
                    <p><strong>Email:</strong> ${esc(email) || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${esc(phone) || 'Not provided'}</p>
                    <p><strong>Shoot Type:</strong> ${esc(shootType) || 'N/A'}</p>
                    <br/>
                    <h3>Message:</h3>
                    <div style="padding: 15px; border-radius: 8px; background: #f9f9f9; border: 1px solid #ddd;">
                        <p style="white-space: pre-wrap; font-family: inherit; margin: 0;">${esc(message) || 'No additional message.'}</p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Resend payload error:', error);
            return res.status(400).json({ error });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Server error handling enquiry email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
