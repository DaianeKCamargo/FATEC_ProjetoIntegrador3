'use client'

import Image from "next/image";
import styles from '@/styles/home.module.css';
import { motion, useInView, Variants } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import WhatsModal from "@/components/whatsModal";
import CountUp from "@/components/countUp";
import { FaCat, FaDog } from "react-icons/fa";
import { AiFillGold } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface InstagramMediaItem {
  id: string
  caption?: string
  media_url: string
  permalink: string
  media_type: string
  thumbnail_url?: string
}


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

interface SwapCardsProps {
  imagem: string
  titulo: string
  descricao: string
  src?: string
  label: string
  onOpenModal?: () => void
}

function SwapCards({ imagem, titulo, descricao, src, label, onOpenModal }: SwapCardsProps) {
  const content = (
    <div>
      <Image src={imagem} alt={titulo} width={300} height={300} />
      <h3>{titulo}</h3>
      <p>{descricao}</p>
      <span>{label}</span>
    </div>
  )

  if (onOpenModal) {
    return <button type="button" onClick={onOpenModal}>{content}</button>
  }

  if (src) {
    return <a href={src}>{content}</a>
  }

  return content
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


export default function Home() {


  // Voluntario
  const [openModal, setOpenModal] = useState(false);

  // Hero carousel state: slides are left blank for you to replace later
  const slides: string[] = ["/folder_home.png", "/reduct_animal.png", "/donate.png"]; // fill these with image paths later

  const [slideIndex, setSlideIndex] = useState(0);

  const prevSlide = () => setSlideIndex((i) => (i - 1 + slides.length) % slides.length);

  const nextSlide = () => setSlideIndex((i) => (i + 1) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;

    const autoplay = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(autoplay);
  }, [slides.length]);

  // Instagram media state

  const [instagramMedia, setInstagramMedia] = useState<InstagramMediaItem[]>([]);

  const [instagramLoading, setInstagramLoading] = useState(true);

  const [instagramError, setInstagramError] = useState<string | null>(null);

  const getCarouselObjectPosition = (src: string) => {
    if (src === "/folder_home.png") {
      return "center center";
    }

    return "left center";
  };

  useEffect(() => {
    const loadInstagramMedia = async () => {
      try {
        setInstagramLoading(true);
        setInstagramError(null);

        const response = await fetch('/api/instagram-media');

        if (!response.ok) {
          throw new Error('Não foi possível carregar a galeria do Instagram.');
        }

        const data = await response.json();
        setInstagramMedia(Array.isArray(data.items) ? data.items : []);
      } catch (error) {
        setInstagramMedia([]);
        setInstagramError(error instanceof Error ? error.message : 'Erro ao carregar a galeria.');
      } finally {
        setInstagramLoading(false);
      }
    };

    loadInstagramMedia();
  }, []);

  return (
    <div>

      <div className={styles.hero}>
        <div className={styles.heroCarousel}>
          <div className={styles.carouselSlides} style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
            {slides.map((src, i) => (
              <div className={styles.carouselSlide} key={i}>
                <img
                  className={styles.folder}
                  src={src || "/folder_home.png"}
                  data-src={src}
                  style={{ objectPosition: getCarouselObjectPosition(src || "/folder_home.png") }}
                  alt={`Hero slide ${i + 1}`}
                />
              </div>
            ))}
          </div>

          <div className={styles.carouselControls}>
            <button aria-label="Previous slide" onClick={prevSlide} className={styles.carouselButton}>
              <BiChevronLeft />
            </button>
            <button aria-label="Next slide" onClick={nextSlide} className={styles.carouselButton}>
              <BiChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.doar}>
        <div className={styles.texto}>
          <Section>Doe sua Tampinhas!</Section>
          <p>Transforme suas tampinhas em ações...</p>

          <motion.div
            className={styles.box1}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
          </motion.div>
          <button className={styles.btn14}>Read More</button>
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

      <div className={styles.instagramGallery}>
        <div className={styles.texto1}>
          <Section>Galeria do Instagram</Section>
          <p>Veja as publicações mais recentes do projeto.</p>
        </div>

        {instagramLoading && <p className={styles.instagramStatus}>Carregando publicações...</p>}

        {!instagramLoading && instagramError && (
          <p className={styles.instagramStatus}>{instagramError}</p>
        )}

        {!instagramLoading && !instagramError && (
          <div className={styles.instagramGrid}>
            {instagramMedia.slice(0, 6).map((item) => {
              const previewUrl = item.media_type === 'VIDEO' ? item.thumbnail_url || item.media_url : item.media_url;

              return (
                <a
                  key={item.id}
                  href={item.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.instagramCard}
                >
                  <img
                    src={previewUrl}
                    alt={item.caption || 'Publicação do Instagram'}
                    className={styles.instagramImage}
                  />
                  <div className={styles.instagramOverlay}>
                    <span>Ver no Instagram</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div >
  );
}