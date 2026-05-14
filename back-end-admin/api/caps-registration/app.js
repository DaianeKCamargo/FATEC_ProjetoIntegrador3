const express = require("express");
const capsRegistrationRoutes = require("./routes/caps-registrationRoutes");

const app = express();
const PORT = process.env.CAPS_REGISTRATION_PORT || 5504;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-caps-registration" });
});

app.use("/api/caps-registration", capsRegistrationRoutes);

// Rota raiz para orientar uso via API/Postman
app.get("/", (req, res) => {
    return res.status(200).json({
        service: "ms-caps-registration",
        status: "ok",
        endpoints: {
            health: "GET /health",
            listar: "GET /api/caps-registration",
            buscarPorId: "GET /api/caps-registration/:id",
            criar: "POST /api/caps-registration",
            atualizar: "PUT /api/caps-registration/:id",
            deletar: "DELETE /api/caps-registration/:id"
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`Microservico caps-registration em execucao na porta ${PORT}`);
});
