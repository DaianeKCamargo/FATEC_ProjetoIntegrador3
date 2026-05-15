function notifyAdmin(evento, payload) {
    console.log(
        `[NOTIFY_ADMIN] evento=${evento} ponto=${payload.namePoint} solicitacao=${payload.idPc || "n/a"}`
    );
}

function notifyUser(email, mensagem) {
    console.log(`[NOTIFY_USER] destino=${email} mensagem=${mensagem}`);
}

module.exports = {
    notifyAdmin,
    notifyUser,
};
