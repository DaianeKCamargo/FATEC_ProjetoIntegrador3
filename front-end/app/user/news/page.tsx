// Criar aqui a página de exibição das notícias (TamPets na Mídia)
// Fazer a ligação com o banco de dados
// Fazer a página responsiva e de acordo com o atual design do projeto
// GET (Apresentar as notícias)
"use client";

import { useEffect, useState } from "react";
import styles from "../../../styles/newsuser.module.css";

const API_BASE_URL = (process.env.NEXT_PUBLIC_APP_NAME || "http://localhost:5500/api").replace(/\/$/, "");

interface Noticia {
  id: number;
  titulo: string;
  link: string;
  imagem: string;
}

export default function NoticiasPage() {

  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    carregarNoticias();
  }, []);

  const carregarNoticias = async () => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/news`
      );

      const data = await response.json();

      setNoticias(data);

    } catch (error) {
      console.error(error);
    }
  };

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