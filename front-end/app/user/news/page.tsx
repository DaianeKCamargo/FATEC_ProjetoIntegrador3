// Criar aqui a página de exibição das notícias (TamPets na Mídia)
// Fazer a ligação com o banco de dados
// Fazer a página responsiva e de acordo com o atual design do projeto
// GET (Apresentar as notícias)
"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "../../../styles/newsuser.module.css";

interface Noticia {
  id: number;
  titulo: string;
  link: string;
  imagem: string;
}

export default function NoticiasPage() {

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [erro, setErro] = useState("");

  const carregarNoticias = useCallback(async () => {

    try {
      setErro("");

      const response = await fetch(
        "/api/news",
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(`Falha ao carregar noticias (${response.status})`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Resposta invalida da API de noticias");
      }

      setNoticias(data);

    } catch (error) {
      console.error(error);
      setNoticias([]);
      setErro("Nao foi possivel carregar as noticias agora.");
    }
  }, []);

  useEffect(() => {
    carregarNoticias();
  }, [carregarNoticias]);

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