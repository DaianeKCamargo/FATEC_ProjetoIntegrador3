const express = require("express");
const cors = require("cors");

const CollectionPointRoute = require("./routes/collection-pointRoute.js");
const newsRoute = require("./routes/newsRoute.js");
const capsRegistrationRoute = require("../api/caps-registration/routes/caps-registrationRoute.js");
const registrosAnimaisRoute = require("../api/animals-registration/routes/animals-registrationRoute.js");

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "app-principal" });
});

app.use("/api/collection-point", CollectionPointRoute);
app.use("/api/news", newsRoute);
app.use("/api/caps-registration", capsRegistrationRoute);
app.use("/api/animals-registration", registrosAnimaisRoute);

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`App principal em execucao na porta ${PORT}`);
});

module.exports = app;