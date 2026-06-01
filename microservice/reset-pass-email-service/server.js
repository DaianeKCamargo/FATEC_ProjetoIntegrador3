const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());

const PORT = Number(process.env.MS_RESET_PASS_EMAIL_PORT || 5509);
const APP_NAME = process.env.APP_NAME || 'Tampets';
const EMAIL_DRY_RUN = String(process.env.EMAIL_DRY_RUN || 'false').toLowerCase() === 'true';

const parseBoolean = (value) => String(value).toLowerCase() === 'true';

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: parseBoolean(process.env.SMTP_SECURE || false),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildResetEmailTemplate({ userName, token, expiresInMinutes }) {
    const safeName = userName ? String(userName) : 'Cliente';

    return `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #1f2b3d;">
            <h2 style="margin: 0 0 12px;">Recuperacao de senha - ${APP_NAME}</h2>
            <p>Ola, ${safeName}.</p>
            <p>Recebemos uma solicitacao para recuperar sua senha.</p>
            <p>Use o token abaixo para continuar o processo:</p>
            <p style="font-size: 24px; font-weight: 700; letter-spacing: 2px; margin: 14px 0;">${token}</p>
            <p>Validade: ${expiresInMinutes} minutos.</p>
            <p>Se voce nao solicitou essa alteracao, ignore este e-mail.</p>
        </div>
    `;
}

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'ms-reset-pass-email' });
});

app.post('/api/reset-pass-email/send-token', async (req, res) => {
    try {
        const {
            email,
            token,
            userName,
            expiresInMinutes = 15,
            subject = `Token de recuperacao de senha - ${APP_NAME}`,
        } = req.body || {};

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'E-mail invalido.' });
        }

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: 'Token invalido.' });
        }

        if (!Number.isFinite(Number(expiresInMinutes)) || Number(expiresInMinutes) <= 0) {
            return res.status(400).json({ message: 'expiresInMinutes deve ser um numero positivo.' });
        }

        const html = buildResetEmailTemplate({
            userName,
            token,
            expiresInMinutes: Number(expiresInMinutes),
        });

        if (EMAIL_DRY_RUN) {
            return res.status(200).json({
                message: 'Modo simulacao: e-mail nao enviado, mas payload validado com sucesso.',
                data: {
                    to: email,
                    subject,
                },
            });
        }

        const transporter = createTransporter();
        const from = process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim();

        if (!from) {
            return res.status(500).json({ message: 'MAIL_FROM ou SMTP_USER nao configurado.' });
        }

        const info = await transporter.sendMail({
            from,
            to: email,
            subject,
            html,
        });

        return res.status(200).json({
            message: 'Token enviado por e-mail com sucesso.',
            data: {
                messageId: info.messageId,
                accepted: info.accepted,
                rejected: info.rejected,
            },
        });
    } catch (error) {
        console.error('Erro ao enviar e-mail de recuperacao:', error);
        return res.status(500).json({
            message: 'Erro interno ao enviar e-mail de recuperacao.',
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Microsservico reset-pass-email em execucao na porta ${PORT}`);
});

module.exports = app;
