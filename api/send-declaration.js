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
        const { name, email, time, message, pdfBase64 } = req.body;

        const { data, error } = await resend.emails.send({
            from: 'Frame 2 Remember <onboarding@resend.dev>',
            to: 'rohitbasaknote@gmail.com',
            reply_to: email || undefined,
            subject: `F2R Declaration Signed: ${esc(name)}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px;">
                    <h2>New Client Declaration Received</h2>
                    <p><strong>Client Name:</strong> ${esc(name)}</p>
                    <p><strong>Submitted At:</strong> ${esc(time)}</p>
                    <div style="margin-top: 20px; padding: 15px; border-radius: 8px; background: #f9f9f9; border: 1px solid #ddd;">
                        <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${esc(message)}</pre>
                    </div>
                    <p style="margin-top: 20px; font-weight: bold; color: #000;">
                        📄 The fully signed digital document is attached as a PDF.
                    </p>
                </div>
            `,
            attachments: pdfBase64 ? [
                {
                    filename: `${esc(name).replace(/[^a-zA-Z0-9]/g, '_')}_Declaration.pdf`,
                    content: pdfBase64.split('base64,')[1] || pdfBase64,
                }
            ] : []
        });

        if (error) {
            console.error('Resend payload error:', error);
            return res.status(400).json({ error });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Server error handling declaration email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
