"use client";

import { useEffect, useState } from "react";
import styles from "../../../styles/news.module.css";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api").replace(/\/$/, "");

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
  // CARREGAR NOTÍCIAS
  // =========================
  const carregarNoticias = async () => {
    try {

      const response = await fetch(
        `${API_BASE_URL}/news`
      );

      console.log("STATUS:", response.status);

      const data = await response.json();

      console.log("DADOS:", data);

      setNoticias(data);

    } catch (error) {

      console.error("ERRO:", error);

    }
  };
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
  // SALVAR
  // =========================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {

      const url = editandoId
        ? `${API_BASE_URL}/news/${editandoId}`
        : `${API_BASE_URL}/news`;

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
        `${API_BASE_URL}/news/${id}`,
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
    <div className={styles.container}>

      {/* FORM */}
      <div className={styles.formCard}>

        <h2 className={styles.titulo}>
          {editandoId
            ? "Editar Notícia"
            : "Cadastro de Notícias"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className={styles.inputGroup}>
            <label>Título</label>

            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Link da imagem</label>

            <input
              type="url"
              name="imagem"
              value={formData.imagem}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Link da notícia</label>

            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={
              editandoId
                ? styles.botaoEditar
                : styles.botaoCadastrar
            }
          >
            {editandoId
              ? "Salvar Alterações"
              : "Cadastrar"}
          </button>

        </form>

      </div>

      {/* LISTA */}
      <div>

        <h3 className={styles.subtitulo}>
          Notícias cadastradas
        </h3>

        <div className={styles.grid}>

          {noticias.map((noticia) => (

            <div
              className={styles.card}
              key={noticia.id}
            >

              <img
                src={noticia.imagem}
                alt={noticia.titulo}
                className={styles.imagem}
              />

              <div className={styles.cardBody}>

                <h5>{noticia.titulo}</h5>

                <a
                  href={noticia.link}
                  target="_blank"
                  className={styles.botaoLink}
                >
                  Ver notícia
                </a>

                <button
                  className={styles.botaoEditar}
                  onClick={() =>
                    editarNoticia(noticia)
                  }
                >
                  Editar
                </button>

                <button
                  className={styles.botaoExcluir}
                  onClick={() =>
                    excluirNoticia(noticia.id)
                  }
                >
                  Excluir
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}