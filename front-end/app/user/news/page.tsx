import React from "react";
import styles from "../../../styles/newsuser.module.css";

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5500/api"
).replace(/\/$/, "");

interface Noticia {
  id: number;
  titulo: string;
  link: string;
  imagem: string;
}

async function buscarNoticias(): Promise<{ noticias: Noticia[]; erro: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/news`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return { noticias: [], erro: `Falha ao carregar noticias (${response.status})` };
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return { noticias: [], erro: "Resposta invalida da API de noticias" };
    }

    return { noticias: data, erro: "" };
  } catch (error) {
    console.error(error);
    return { noticias: [], erro: "Nao foi possivel carregar as noticias agora." };
  }
}

export default async function NoticiasPage() {
  const { noticias, erro } = await buscarNoticias();

  return (
    <main className={styles.container}>

      {/* HEADER */}
      <section className={styles.header}>

        <h1>
          TamPets na Mídia
        </h1>

        <p>
          Confira as notícias e reportagens onde o
          projeto TamPets marcou presença.
        </p>

      </section>

      {/* GRID */}
      <section className={styles.grid}>

        {erro && <p>{erro}</p>}

        {!erro && noticias.length === 0 && (
          <p>Nenhuma noticia cadastrada no momento.</p>
        )}

        {noticias.map((noticia) => (

          <article
            key={noticia.id}
            className={styles.card}
          >

            <img
              src={noticia.imagem}
              alt={noticia.titulo}
              className={styles.imagem}
            />

            <div className={styles.cardBody}>

              <h2>
                {noticia.titulo}
              </h2>

              <a
                href={noticia.link}
                target="_blank"
                rel="noreferrer"
                className={styles.botao}
              >
                Ler notícia
              </a>

            </div>

          </article>
        ))}

      </section>

    </main>
  );
}