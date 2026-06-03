const axios = require("axios");
const model = require("../models/admin-usersModels");

const RESET_PASS_EMAIL_SERVICE_URL = (process.env.PASSWORD_RESET_EMAIL_SERVICE_URL || "http://localhost:5509").replace(/\/$/, "");

async function enviarTokenRecuperacaoPorEmail({ emailUser, resetToken }) {
    await axios.post(
        `${RESET_PASS_EMAIL_SERVICE_URL}/api/reset-pass-email/send-token`,
        {
            email: emailUser,
            token: resetToken,
            expiresInMinutes: 60,
            subject: "Token de recuperacao de senha - Tampets",
        },
        {
            timeout: 10000,
        }
    );
}


async function listar(req, res) {
    try {
        const admins = await model.listar();
        return res.status(200).json(admins);
    } catch (erro) {
        return res.status(500).json({ message: erro.message });
    }
}


async function buscarPorId(req, res) {
    try {
        const idAdmin = Number(req.params.idAdmin);
        const admin = await model.buscarPorId(idAdmin);

        if (!admin) {
            return res.status(404).json({ message: "Administrador não encontrado" });
        }

        return res.status(200).json(admin);
    } catch (erro) {
        return res.status(500).json({ message: erro.message });
    }
}

async function criar(req, res) {
    try {
        const { username, senha, emailUser } = req.body;

        const novoAdmin = await model.criar({
            username,
            senha,
            emailUser
        });

        return res.status(201).json(novoAdmin);
    } catch (erro) {
        if (erro.message.includes("já cadastrado")) {
            return res.status(409).json({ message: erro.message });
        }
        return res.status(400).json({ message: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const idAdmin = Number(req.params.idAdmin);
        const atualizado = await model.atualizar(idAdmin, req.body);

        return res.status(200).json(atualizado);
    } catch (erro) {
        if (erro.message.includes("não encontrado")) {
            return res.status(404).json({ message: erro.message });
        }
        return res.status(400).json({ message: erro.message });
    }
}

async function remover(req, res) {
    try {
        const idAdmin = Number(req.params.idAdmin);
        await model.remover(idAdmin);

        return res.status(200).json({ message: "Administrador removido com sucesso" });
    } catch (erro) {
        if (erro.message.includes("não encontrado")) {
            return res.status(404).json({ message: erro.message });
        }
        return res.status(500).json({ message: erro.message });
    }
}

async function login(req, res) {
    try {
        const { username, senha } = req.body;

        const admin = await model.login(username, senha);

        // Salvar informações de sessão
        req.session.admin = admin;
        req.session.logado = true;

        return res.status(200).json({
            message: "Login realizado com sucesso",
            admin
        });
    } catch (erro) {
        if (erro.message === "Usuário não encontrado") {
            return res.status(404).json({ message: erro.message });
        }

        if (erro.message === "Senha incorreta") {
            return res.status(401).json({ message: erro.message });
        }

        return res.status(401).json({ message: erro.message });
    }
}

async function logout(req, res) {
    req.session.destroy((erro) => {
        if (erro) {
            return res.status(500).json({ message: "Erro ao fazer logout" });
        }
        return res.status(200).json({ message: "Logout realizado com sucesso" });
    });
}

async function solicitarRecuperacao(req, res) {
    try {
        const { emailUser } = req.body;

        if (!emailUser) {
            return res.status(400).json({ message: "Email é obrigatório" });
        }

        const resetToken = await model.gerarTokenRecuperacao(emailUser);

        try {
            await enviarTokenRecuperacaoPorEmail({ emailUser, resetToken });
        } catch (erroEmail) {
            await model.limparTokenRecuperacao(emailUser);

            return res.status(502).json({
                message: "Não foi possível enviar o e-mail de recuperação. Tente novamente em instantes.",
                error: erroEmail.message,
            });
        }

        return res.status(200).json({
            message: "Token de recuperação enviado para o e-mail cadastrado.",
        });
    } catch (erro) {
        if (erro.message === "Email não encontrado") {
            return res.status(404).json({ message: erro.message });
        }

        return res.status(400).json({ message: erro.message });
    }
}

async function validarToken(req, res) {
    try {
        const { emailUser, resetToken } = req.body;

        if (!emailUser || !resetToken) {
            return res.status(400).json({ message: "Email e token são obrigatórios" });
        }

        await model.validarTokenRecuperacao(emailUser, resetToken);

        return res.status(200).json({ message: "Token válido" });
    } catch (erro) {
        return res.status(400).json({ message: erro.message });
    }
}

async function redefinirSenha(req, res) {
    try {
        const { emailUser, resetToken, novaSenha } = req.body;

        if (!emailUser || !resetToken || !novaSenha) {
            return res.status(400).json({ message: "Email, token e nova senha são obrigatórios" });
        }

        const admin = await model.redefinirSenha(emailUser, resetToken, novaSenha);

        return res.status(200).json({
            message: "Senha redefinida com sucesso",
            admin
        });
    } catch (erro) {
        return res.status(400).json({ message: erro.message });
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
    login,
    logout,
    solicitarRecuperacao,
    validarToken,
    redefinirSenha
};
