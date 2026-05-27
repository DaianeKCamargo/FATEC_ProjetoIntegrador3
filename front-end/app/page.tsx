'use client'

import Link from "next/link";
import Image from "next/image";
import styles from '@/styles/home.module.css';
import { motion, useInView, Variants } from "framer-motion";
import Script from 'next/script';
import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import WhatsModal from "@/components/whatsModal";
import CountUp from "@/components/countUp";
import capsService from "@/services/capsService";
import animalsService from "@/services/animalsService";
import api from "@/services/api";
import { FaCat, FaDog, FaHandHoldingHeart, FaMapMarkerAlt, FaPaw, FaClock, FaRoute } from "react-icons/fa";
import { AiFillGold } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";


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
  src?: string
  modalKind?: 'partner' | 'volunteer'
  onOpenModal?: (kind?: 'partner' | 'volunteer') => void
}

function SwapCards({ imagem, titulo, src, modalKind, onOpenModal }: SwapCardsProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onOpenModal && modalKind) {
      onOpenModal(modalKind);
      return;
    }

    if (onOpenModal) {
      onOpenModal();
      return;
    }

    if (src) {
      router.push(src);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={titulo}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div>
        <Image src={imagem} alt={titulo} width={300} height={300} />
        <h3>{titulo}</h3>
      </div>
    </div>
  )
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


  const [openModal, setOpenModal] = useState(false);
  const [modalKind, setModalKind] = useState<'partner' | 'volunteer' | null>(null);

  // Hero carousel state: slides are left blank for you to replace later
  const slides: string[] = ["/folder_home.png", "/reduct_animal.png", "/donate.png"]; // fill these with image paths later

  const [slideIndex, setSlideIndex] = useState(0);

  // Resumo / Resultados
  const [gatosCastrados, setGatosCastrados] = useState(0);
  const [cachorrosCastrados, setCachorrosCastrados] = useState(0);
  const [tampinhasUnidades, setTampinhasUnidades] = useState(0);
  const [mesTitulo, setMesTitulo] = useState("");

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    setMesTitulo(monthNames[month]);

    async function loadResumo() {
      try {
        const [caps, animals] = await Promise.all([
          capsService.getAll(),
          animalsService.getAll(),
        ]);

        // Tampinhas: soma o campo quantidade_tampinhas quando disponível,
        // fallback para conversão a partir de quantidadeKg usando fator 500
        const tampinhasSum = caps
          .filter((it: any) => {
            const d = new Date(it.data);
            return d.getMonth() === month && d.getFullYear() === year;
          })
          .reduce((s: number, it: any) => {
            const unidades = it.quantidade_tampinhas ?? Math.round((Number(it.quantidadeKg) || 0) * 500);
            return s + unidades;
          }, 0);

        // Animais: soma por tipo
        const gatosSum = animals
          .filter((it: any) => {
            const d = new Date(it.data);
            return d.getMonth() === month && d.getFullYear() === year;
          })
          .reduce((s: number, it: any) => s + ((String(it.tipoAnimal).toLowerCase() === "gato") ? (Number(it.quantidade) || 0) : 0), 0);

        const cachorrosSum = animals
          .filter((it: any) => {
            const d = new Date(it.data);
            return d.getMonth() === month && d.getFullYear() === year;
          })
          .reduce((s: number, it: any) => s + ((String(it.tipoAnimal).toLowerCase() === "cachorro") ? (Number(it.quantidade) || 0) : 0), 0);

        setTampinhasUnidades(tampinhasSum);
        setGatosCastrados(gatosSum);
        setCachorrosCastrados(cachorrosSum);
      } catch (err) {
        console.error("Erro ao carregar resumo (home):", err);
      }
    }

    loadResumo();
  }, []);

  const prevSlide = () => setSlideIndex((i) => (i - 1 + slides.length) % slides.length);

  const nextSlide = () => setSlideIndex((i) => (i + 1) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;

    const autoplay = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(autoplay);
  }, [slides.length]);


  const getCarouselObjectPosition = (src: string) => {
    if (src === "/folder_home.png") {
      return "center center";
    }

    return "left center";
  };

  const donationSteps = [
    {
      icon: <FaPaw />,
      title: "Separe as tampinhas",
      text: "Junte tampinhas limpas e secas para facilitar a triagem e a reciclagem.",
    },
    {
      icon: <FaHandHoldingHeart />,
      title: "Confirme o destino",
      text: "Veja se o ponto escolhido aceita o material e quais horários funcionam melhor.",
    },
    {
      icon: <FaRoute />,
      title: "Entregue com facilidade",
      text: "Leve sua doação ao ponto mais próximo e acompanhe o impacto do projeto.",
    },
  ];

  const pickupDetails = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Locais parceiros",
      text: "Encontre estabelecimentos e instituições cadastradas para receber suas tampinhas.",
    },
    {
      icon: <FaClock />,
      title: "Horários de atendimento",
      text: "Consulte os melhores períodos para entrega antes de sair de casa.",
    },
    {
      icon: <FaHandHoldingHeart />,
      title: "Entrega organizada",
      text: "Cada ponto ajuda a transformar sua doação em cuidado real com os animais.",
    },
  ];


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
        <div className={styles.donateCard}>
          <div className={styles.donateIntro}>
            <span className={styles.sectionTag}>Como doar</span>
            <Section>Doe suas tampinhas em poucos passos</Section>
            <p>Uma forma simples de ajudar: leve tampinhas limpas, escolha o ponto de coleta e acompanhe o impacto da sua entrega.</p>

            <div className={styles.donateHighlights}>
              <span>Prático</span>
              <span>Rápido</span>
              <span>Solidário</span>
            </div>

            <Link className={styles.btn14} href="/cadastro">Quero doar agora</Link>
          </div>

          <div className={styles.donateSteps}>
            {donationSteps.map((step, index) => (
              <motion.article
                className={styles.donateStepCard}
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: index * 0.12 }}
              >
                <div className={styles.stepIcon}>{step.icon}</div>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.pontocoleta}>
        <div className={styles.imagem}>
          <ContainerImagens img="/localizacao.png" color="#5f81b7" />
        </div>

        <div className={styles.pickupCard}>
          <div className={styles.pickupIntro}>
            <span className={styles.pickupSectionTag}>Ponto de coleta</span>
            <Section>Encontre o local ideal para entregar suas tampinhas</Section>
            <p>Veja pontos parceiros, horários de atendimento e informações essenciais para realizar sua entrega com facilidade.</p>

            <Link className={styles.btnOutline} href="/ponto-coleta">Ver pontos de coleta</Link>
          </div>

          <div className={styles.pickupDetails}>
            {pickupDetails.map((item) => (
              <motion.div
                className={styles.pickupDetailCard}
                key={item.title}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className={styles.pickupDetailHead}>
                  <div className={styles.stepIcon}>{item.icon}</div>
                  <strong>{item.title}</strong>
                </div>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ajuda}>
        <div className={styles.texto1}>
          <Section> Faça parte do projeto! </Section>
          <p className={styles.ajudaDescricao}>
            Você pode colaborar como ponto de coleta, parceiro ou voluntário e ajudar a transformar pequenas doações em cuidado real. <strong>Para participar, basta clicar em alguns dos cards abaixo.</strong>
          </p>
        </div>

        <div className={styles.cardsAjuda}>
          <div className={styles.pontodecoleta}>
            <SwapCards
              imagem={"/collection-point.png"}
              titulo={"Seja um Ponto de Coleta"}
              src={"/cadastro-ponto-coleta"}
            />
          </div>
          <div className={styles.parceiro}>
            <SwapCards
              imagem={"/partner.jpg"}
              titulo={"Seja uma Parceiro"}
              modalKind="partner"
              onOpenModal={(kind) => {
                setModalKind(kind ?? null);
                setOpenModal(true);
              }}
            />
          </div>
          <div className={styles.voluntario}>
            <SwapCards
              imagem={"/volunters.png"}
              titulo={"Seja um voluntário"}
              modalKind="volunteer"
              onOpenModal={(kind) => {
                setModalKind(kind ?? null);
                setOpenModal(true);
              }}
            />
          </div>

          <WhatsModal
            numero={"5515988327955"}
            open={openModal}
            kind={modalKind}
            onClose={() => {
              setOpenModal(false);
              setModalKind(null);
            }}
          />
        </div>
      </div>

      <div className={styles.resumoRelatorio}>
        <div className={styles.texto2}>
          <Section> Resultados do Mês de {mesTitulo} </Section>
        </div>

        <a className={styles.paginas} href="/relatorio">
          <div className={styles.animacao}>
            <div className={styles.gatos}>
              <div className={styles.circle}>
                <p><FaCat size={40} color="" /></p>
                <CountUp
                  to={gatosCastrados}
                  duration={2}
                  className={styles.textCount}
                />
                <h2>Gatos Castrados</h2>
              </div>
            </div>
            <div className={styles.cachorros}>
              <div className={styles.circle}>
                <p><FaDog size={40} color="" /></p>
                <CountUp
                  to={cachorrosCastrados}
                  duration={2}
                  className={styles.textCount}
                />
                <h2>Cachorros Castrados</h2>
              </div>
            </div>
            <div className={styles.tampinhas}>
              <div className={styles.circle}>
                <p><AiFillGold size={40} color="" /></p>
                <CountUp
                  to={tampinhasUnidades}
                  duration={2}
                  className={styles.textCount}
                />
                <h2>Tampinhas Coletadas (un)</h2>
              </div>
            </div>
          </div>
        </a>
      </div>

      <div className={styles.instagramGallery}>
        <div className="elfsight-app-ebf19717-0590-4628-8b2d6de712ac" data-elfsight-app-lazy></div>
        <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
      </div>
    </div>
  )
}