const pontoColetaModel = require("../models/pontoColetaModels");

function listarPontosColeta(req, res) {
    res.status(200).json(pontoColetaModel.listar());
}

function buscarPontoColetaPorId(req, res) {
    const id = Number(req.params.id);
    const ponto = pontoColetaModel.buscarPorId(id);

    if (!ponto) {
        return res.status(404).json({ message: "Ponto de coleta nao encontrado" });
    }

    return res.status(200).json(ponto);
}

function criarPontoColeta(req, res) {
    const { nomeEmpresa, endereco } = req.body;
    if (!nomeEmpresa || !endereco) {
        return res
            .status(400)
            .json({ message: "nomeEmpresa e endereco sao obrigatorios" });
    }

    const novoPonto = pontoColetaModel.criar(req.body);
    return res.status(201).json(novoPonto);
}

function atualizarPontoColeta(req, res) {
    const id = Number(req.params.id);
    const pontoAtualizado = pontoColetaModel.atualizar(id, req.body);

    if (!pontoAtualizado) {
        return res.status(404).json({ message: "Ponto de coleta nao encontrado" });
    }

    return res.status(200).json(pontoAtualizado);
}

function removerPontoColeta(req, res) {
    const id = Number(req.params.id);
    const removido = pontoColetaModel.remover(id);

    if (!removido) {
        return res.status(404).json({ message: "Ponto de coleta nao encontrado" });
    }

    return res.status(204).send();
}

module.exports = {
    listarPontosColeta,
    buscarPontoColetaPorId,
    criarPontoColeta,
    atualizarPontoColeta,
    removerPontoColeta,
};
