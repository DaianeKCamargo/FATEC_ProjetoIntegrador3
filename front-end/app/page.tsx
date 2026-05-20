'use client'

import Image from "next/image";
import styles from '@/styles/home.module.css';
import { motion, useInView, Variants } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import SwapCards from "@/components/home/SwapCards";
import WhatsModal from "@/components/home/WhatsModal";
import CountUp from "@/components/countUp";
import { FaCat, FaDog } from "react-icons/fa";
import { AiFillGold } from "react-icons/ai";
import PartnersCarousel from "@/components/partners/Carrossel";
import { CiCirclePlus } from "react-icons/ci";


// Animação dos titulos
type SectionProps = { children: ReactNode }

function Section({ children }: SectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className={styles.section}>
      <span
        style={{
          transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
        }}
      >
        {children}
      </span>
    </section>
  )
}

// Card voluntarios (AGORA COM IMAGEM + COR)
interface CardProps {
  img: string
  color: string
}

const cardVariants: Variants = {
  offscreen: { y: 300 },
  onscreen: {
    y: 50,
    rotate: -10,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
}

function ContainerImagens({ img, color }: CardProps) {
  return (
    <motion.div
      className={styles.cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
    >
      <div className={styles.splash} style={{ background: color }} />

      <motion.div className={styles.card} variants={cardVariants}>
        <Image className={styles.img} src={img} alt="icone" width={500} height={600} />
      </motion.div>
    </motion.div>
  )
}

// Lista dos cards como doar e ponto de coleta - imagens
const cardsData = [
  { img: "/doar.png", color: "#FAF9DD" },
  { img: "/localizacao.png", color: "#5f81b7" }
]


export default function Home() {


  // Voluntario
  const [openModal, setOpenModal] = useState(false);

  return (
    <div>

      <div className={styles.hero}>
        <img className={styles.folder} src="/folder_home.png" alt="folder home" />
      </div>

      <div className={styles.doar}>
        <div className={styles.texto}>
          <Section>Doe sua Tampinhas!</Section>

          <motion.div
            className={styles.box1}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <a className={styles.paginas} href="/como-doar">
              <p>Transforme suas tampinhas em ações...</p>
              <p><b>Clique aqui e saiba mais!</b></p>
            </a>
          </motion.div>
        </div>

        <div className={styles.imagem}>
          <ContainerImagens img="/doar.png" color="#d7c216" />
        </div>
      </div>

      <div className={styles.pontocoleta}>
        <div className={styles.imagem}>
          <ContainerImagens img="/localizacao.png" color="#5f81b7" />
        </div>

        <div className={styles.texto}>
          <Section>Pontos de coleta</Section>

          <motion.div
            className={styles.box2}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <a className={styles.paginas} href="/ponto-coleta">
              <p>Veja os pontos de coleta mais próximos...</p>
              <p><b>Clique aqui e saiba mais!</b></p>
            </a>
          </motion.div>
        </div>
      </div>

      <div className={styles.ajuda}>
        <div className={styles.texto1}>
          <Section> Faça parte do projeto! </Section>
        </div>

        <div className={styles.cardsAjuda}>
          <div className={styles.pontodecoleta}>
            <SwapCards
              imagem={"/ponto_coleta.png"}
              titulo={"Seja um Ponto de Coleta"}
              descricao={"Você que tem um estabelecimento, você pode nos ajudar aceitando receber as tampinhas. "}
              src={"/cadastro"}
              label={"Ser Ponto de Coleta "} />
          </div>
          <div className={styles.parceiro}>
            <SwapCards
              imagem={"/parceiro.png"}
              titulo={"Seja uma Parceiro"}
              descricao={"Aqui você pode nos ajudar de alguma outra forma, clique no botão e saiba mais."}
              src={"/cadastro"}
              label={"Ser Parceiro"} />
          </div>
          <div className={styles.voluntario}>
            <SwapCards
              imagem={"/voluntario.png"}
              titulo={"Seja um voluntário"}
              descricao={"Venha fazer parte desse projeto e ajudar aqueles animaiszinhos que mais tanto precisam."}
              label={"Ser voluntário "}
              onOpenModal={() => setOpenModal(true)}
            />
          </div>

          <WhatsModal
            numero={"5515988327955"}
            open={openModal}
            onClose={() => setOpenModal(false)}
          />
        </div>
      </div>

      <div className={styles.resumoRelatorio}>
        <div className={styles.texto2}>
          <Section> Resultados </Section>
        </div>

        <a className={styles.paginas} href="/relatorio">
          <div className={styles.animacao}>
            <div className={styles.gatos}>
              <div className={styles.circle}>
                <p><FaCat size={40} color="" /></p>
                <CountUp
                  to={50}
                  duration={8}
                  className={styles.textCount}
                />
                <h2>Gatos Castrados</h2>
              </div>
            </div>
            <div className={styles.cachorros}>
              <div className={styles.circle}>
                <p><FaDog size={40} color="" /></p>
                <CountUp
                  to={12}
                  duration={8}
                  className={styles.textCount}
                />
                <h2>Cachorros Castrados</h2>
              </div>
            </div>
            <div className={styles.tampinhas}>
              <div className={styles.circle}>
                <p><AiFillGold size={40} color="" /></p>
                <CountUp
                  to={1458521}
                  duration={8}
                  className={styles.textCount}
                />
                <h2>Tampinhas Coletadas(un)</h2>
              </div>
            </div>
          </div>
        </a>
      </div>

      <div className={styles.parceiros}>
        <div className={styles.texto3}>
          <h1> Conheça nossos parceiros</h1>
          <a href="/parceiros" className={styles.paginas}>
            <CiCirclePlus size={30} />
          </a>
        </div>
        <div className={styles.carrossel}>
          <PartnersCarousel />
        </div>
      </div>
    </div >
  );
}