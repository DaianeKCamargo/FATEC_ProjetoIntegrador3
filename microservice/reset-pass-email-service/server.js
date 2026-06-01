// back-end/api/reset-pass-email/index.js
const nodemailer = require('nodemailer');

const APP_NAME = process.env.APP_NAME || 'Tampets';

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildResetEmailTemplate({ userName, token, expiresInMinutes }) {
    const safeName = userName ? String(userName) : 'Cliente';
    return `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #1f2b3d;">
            <h2 style="margin: 0 0 12px;">Recuperação de senha - ${APP_NAME}</h2>
            <p>Olá, ${safeName}.</p>
            <p>Use o token abaixo para continuar o processo:</p>
            <p style="font-size: 24px; font-weight: 700; letter-spacing: 2px; margin: 14px 0;">${token}</p>
            <p>Validade: ${expiresInMinutes} minutos.</p>
            <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
        </div>
    `;
}

module.exports = async (req, res) => {
    // CORS para chamadas internas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method === 'GET' && req.url?.includes('health')) {
        return res.status(200).json({ status: 'ok', service: 'ms-reset-pass-email' });
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido.' });
    }

    try {
        const {
            email,
            token,
            userName,
            expiresInMinutes = 15,
            subject = `Token de recuperação de senha - ${APP_NAME}`,
        } = req.body || {};

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'E-mail inválido.' });
        }
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: 'Token inválido.' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const from = (process.env.SMTP_USER || process.env.MAIL_FROM || '').trim();
        if (!from) {
            return res.status(500).json({ message: 'SMTP_USER ou MAIL_FROM não configurado.' });
        }

        const html = buildResetEmailTemplate({ userName, token, expiresInMinutes: Number(expiresInMinutes) });

        const info = await transporter.sendMail({ from, replyTo: from, to: email, subject, html });

        return res.status(200).json({
            message: 'Token enviado por e-mail com sucesso.',
            data: { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected },
        });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).json({ message: 'Erro interno ao enviar e-mail.', error: error.message });
    }
};