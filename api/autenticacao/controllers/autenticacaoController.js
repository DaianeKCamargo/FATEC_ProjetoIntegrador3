const model = require("../models/autenticacaoModels");

/**
 * Listar todos os administradores
 */
async function listar(req, res) {
    try {
        const admins = await model.listar();
        return res.status(200).json(admins);
    } catch (erro) {
        return res.status(500).json({ message: erro.message });
    }
}

/**
 * Buscar administrador por ID
 */
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

/**
 * Registrar novo administrador
 */
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

/**
 * Atualizar administrador
 */
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

/**
 * Remover administrador
 */
async function remover(req, res) {
    try {
        const idAdmin = Number(req.params.idAdmin);
        await model.remover(idAdmin);

        return res.status(204).send();
    } catch (erro) {
        if (erro.message.includes("não encontrado")) {
            return res.status(404).json({ message: erro.message });
        }
        return res.status(500).json({ message: erro.message });
    }
}

/**
 * Fazer login
 */
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
        return res.status(401).json({ message: erro.message });
    }
}

/**
 * Fazer logout
 */
async function logout(req, res) {
    req.session.destroy((erro) => {
        if (erro) {
            return res.status(500).json({ message: "Erro ao fazer logout" });
        }
        return res.status(200).json({ message: "Logout realizado com sucesso" });
    });
}

/**
 * Solicitar recuperação de senha
 */
async function solicitarRecuperacao(req, res) {
    try {
        const { emailUser } = req.body;

        if (!emailUser) {
            return res.status(400).json({ message: "Email é obrigatório" });
        }

        const resetToken = await model.gerarTokenRecuperacao(emailUser);

        // TODO: Enviar email com link de recuperação
        // const linkRecuperacao = `${process.env.APP_URL}/recuperar-senha?email=${emailUser}&token=${resetToken}`;
        // await enviarEmail(emailUser, linkRecuperacao);

        return res.status(200).json({
            message: "Email de recuperação enviado (implementar envio de email)",
            resetToken // Remover em produção
        });
    } catch (erro) {
        return res.status(400).json({ message: erro.message });
    }
}

/**
 * Validar token de recuperação
 */
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

/**
 * Redefinir senha
 */
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
