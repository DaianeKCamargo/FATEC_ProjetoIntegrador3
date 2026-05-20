"use client";

import { useEffect, useState } from "react";

interface Noticia {
  id: number;
  titulo: string;
  link: string;
  imagem: string;
}

export default function CadastroNoticias() {

  const [formData, setFormData] = useState({
    titulo: "",
    link: "",
    imagem: "",
  });

  const [noticias, setNoticias] = useState<Noticia[]>([]);

  const [editandoId, setEditandoId] = useState<number | null>(null);

  // =========================
  // BUSCAR NOTÍCIAS
  // =========================
  const carregarNoticias = async () => {
    try {

      const response = await fetch(
        "http://localhost:5505/api/news"
      );

      const data = await response.json();

      setNoticias(data);

    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // CARREGA AO ABRIR
  // =========================
  useEffect(() => {
    carregarNoticias();
  }, []);

  // =========================
  // INPUTS
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CADASTRAR / EDITAR
  // =========================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {

      const url = editandoId
        ? `http://localhost:5505/api/news/${editandoId}`
        : "http://localhost:5505/api/news";

      const metodo = editandoId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro");
      }

      alert(
        editandoId
          ? "Notícia atualizada!"
          : "Notícia cadastrada!"
      );

      // limpa form
      setFormData({
        titulo: "",
        link: "",
        imagem: "",
      });

      setEditandoId(null);

      carregarNoticias();

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar notícia");
    }
  };

  // =========================
  // EDITAR
  // =========================
  const editarNoticia = (noticia: Noticia) => {

    setEditandoId(noticia.id);

    setFormData({
      titulo: noticia.titulo,
      link: noticia.link,
      imagem: noticia.imagem,
    });
  };

  // =========================
  // EXCLUIR
  // =========================
  const excluirNoticia = async (id: number) => {

    const confirmar = confirm(
      "Deseja realmente excluir?"
    );

    if (!confirmar) return;

    try {

      const response = await fetch(
        `http://localhost:5505/api/news/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro");
      }

      alert("Notícia removida!");

      carregarNoticias();

    } catch (error) {
      console.error(error);
      alert("Erro ao remover notícia");
    }
  };

  return (
    <div className="container mt-5">

      {/* FORM */}
      <div className="card shadow p-4 mb-5">

        <h2 className="text-center mb-4">

          {editandoId
            ? "Editar Notícia"
            : "Cadastro de Notícias"}

        </h2>

        <form onSubmit={handleSubmit}>

          {/* Título */}
          <div className="mb-3">
            <label className="form-label">
              Título
            </label>

            <input
              type="text"
              name="titulo"
              className="form-control"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Imagem */}
          <div className="mb-3">
            <label className="form-label">
              Link da imagem
            </label>

            <input
              type="url"
              name="imagem"
              className="form-control"
              value={formData.imagem}
              onChange={handleChange}
              required
            />
          </div>

          {/* Link */}
          <div className="mb-4">
            <label className="form-label">
              Link da notícia
            </label>

            <input
              type="url"
              name="link"
              className="form-control"
              value={formData.link}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn w-100 ${
              editandoId
                ? "btn-warning"
                : "btn-success"
            }`}
          >
            {editandoId
              ? "Salvar Alterações"
              : "Cadastrar"}
          </button>

        </form>
      </div>

      {/* LISTA */}
      <div>

        <h3 className="mb-4">
          Notícias cadastradas
        </h3>

        <div className="row">

          {noticias.map((noticia) => (

            <div
              className="col-md-4 mb-4"
              key={noticia.id}
            >

              <div className="card h-100 shadow">

                <img
                  src={noticia.imagem}
                  className="card-img-top"
                  alt={noticia.titulo}
                  style={{
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body d-flex flex-column">

                  <h5 className="card-title">
                    {noticia.titulo}
                  </h5>

                  <a
                    href={noticia.link}
                    target="_blank"
                    className="btn btn-primary mb-2"
                  >
                    Ver notícia
                  </a>

                  <button
                    className="btn btn-warning mb-2"
                    onClick={() =>
                      editarNoticia(noticia)
                    }
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      excluirNoticia(noticia.id)
                    }
                  >
                    Excluir
                  </button>

                </div>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}