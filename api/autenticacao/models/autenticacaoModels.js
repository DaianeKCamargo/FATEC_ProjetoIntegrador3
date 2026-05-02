const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); // Para hashing de senhas
const crypto = require("crypto"); // Para geração de tokens de recuperação de senha

const prisma = new PrismaClient();


async function criar(dados) {
    const { username, senha, emailUser } = dados;

    // Validar campos obrigatórios
    if (!username || !senha || !emailUser) {
        throw new Error("Username, senha e email são obrigatórios");
    }

    // Verificar se username já existe
    const usuarioExistente = await prisma.adminUser.findUnique({
        where: { username }
    });

    if (usuarioExistente) {
        throw new Error("Username já cadastrado");
    }

    // Verificar se email já existe
    const emailExistente = await prisma.adminUser.findUnique({
        where: { emailUser }
    });

    if (emailExistente) {
        throw new Error("Email já cadastrado");
    }

    // Hash da senha
    const passHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const novoAdmin = await prisma.adminUser.create({
        data: {
            username,
            passHash,
            emailUser
        }
    });

    // Não retornar a senha
    const { passHash: _, ...admin } = novoAdmin;
    return admin;
}

async function login(username, senha) {
    if (!username || !senha) {
        throw new Error("Username e senha são obrigatórios");
    }

    const admin = await prisma.adminUser.findUnique({
        where: { username }
    });

    if (!admin) {
        throw new Error("Username ou senha inválidos");
    }

    // Comparar senhas
    const senhaValida = await bcrypt.compare(senha, admin.passHash);

    if (!senhaValida) {
        throw new Error("Username ou senha inválidos");
    }

    // Não retornar a senha
    const { passHash: _, ...adminSeguro } = admin;
    return adminSeguro;
}

async function buscarPorId(idAdmin) {
    const admin = await prisma.adminUser.findUnique({
        where: { idAdmin }
    });

    if (!admin) return null;

    const { passHash: _, ...adminSeguro } = admin;
    return adminSeguro;
}

async function buscarPorUsername(username) {
    const admin = await prisma.adminUser.findUnique({
        where: { username }
    });

    if (!admin) return null;

    const { passHash: _, ...adminSeguro } = admin;
    return adminSeguro;
}

async function listar() {
    const admins = await prisma.adminUser.findMany();

    // Não retornar senhas
    return admins.map(({ passHash: _, ...admin }) => admin);
}

async function gerarTokenRecuperacao(emailUser) {
    const admin = await prisma.adminUser.findUnique({
        where: { emailUser }
    });

    if (!admin) {
        throw new Error("Email não encontrado");
    }

    // Gerar token aleatório
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expira em 1 hora
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Salvar token no banco
    await prisma.adminUser.update({
        where: { emailUser },
        data: {
            resetToken,
            resetTokenExpiry
        }
    });

    return resetToken;
}

async function validarTokenRecuperacao(emailUser, resetToken) {
    const admin = await prisma.adminUser.findUnique({
        where: { emailUser }
    });

    if (!admin) {
        throw new Error("Email não encontrado");
    }

    if (admin.resetToken !== resetToken) {
        throw new Error("Token inválido");
    }

    if (!admin.resetTokenExpiry || admin.resetTokenExpiry < new Date()) {
        throw new Error("Token expirado");
    }

    return true;
}

async function redefinirSenha(emailUser, resetToken, novaSenha) {
    // Validar token
    await validarTokenRecuperacao(emailUser, resetToken);

    // Hash da nova senha
    const passHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha e limpar token
    const admin = await prisma.adminUser.update({
        where: { emailUser },
        data: {
            passHash,
            resetToken: null,
            resetTokenExpiry: null
        }
    });

    const { passHash: _, ...adminSeguro } = admin;
    return adminSeguro;
}

async function atualizar(idAdmin, dados) {
    const admin = await prisma.adminUser.findUnique({
        where: { idAdmin }
    });

    if (!admin) {
        throw new Error("Usuário não encontrado");
    }

    const atualizacao = {};

    if (dados.username) {
        const usernameExistente = await prisma.adminUser.findUnique({
            where: { username: dados.username }
        });

        if (usernameExistente && usernameExistente.idAdmin !== idAdmin) {
            throw new Error("Username já cadastrado");
        }

        atualizacao.username = dados.username;
    }

    if (dados.emailUser) {
        const emailExistente = await prisma.adminUser.findUnique({
            where: { emailUser: dados.emailUser }
        });

        if (emailExistente && emailExistente.idAdmin !== idAdmin) {
            throw new Error("Email já cadastrado");
        }

        atualizacao.emailUser = dados.emailUser;
    }

    if (dados.senha) {
        atualizacao.passHash = await bcrypt.hash(dados.senha, 10);
    }

    const adminAtualizado = await prisma.adminUser.update({
        where: { idAdmin },
        data: atualizacao
    });

    const { passHash: _, ...adminSeguro } = adminAtualizado;
    return adminSeguro;
}

async function remover(idAdmin) {
    const admin = await prisma.adminUser.findUnique({
        where: { idAdmin }
    });

    if (!admin) {
        throw new Error("Usuário não encontrado");
    }

    await prisma.adminUser.delete({
        where: { idAdmin }
    });

    return true;
}

module.exports = {
    criar,
    login,
    buscarPorId,
    buscarPorUsername,
    listar,
    gerarTokenRecuperacao,
    validarTokenRecuperacao,
    redefinirSenha,
    atualizar,
    remover
};
