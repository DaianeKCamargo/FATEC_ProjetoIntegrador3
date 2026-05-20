"use client";

import styles from "@/styles/swap-cards.module.css";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import WhatsModal from "@/components/whatsModal";

interface SwapCardProps {
    imagem: string;
    titulo: string;
    descricao: string;
    src?: string;
    label: string;
    onOpenModal?: () => void;
}

export default function SwapCard({ imagem, titulo, descricao, src, label, onOpenModal }: SwapCardProps) {

    const router = useRouter();

    const navPage = () => {
        if (src) router.push(src);
    };

    const handleClick = () => {
        if (onOpenModal) {
            onOpenModal();   // abre modal
        } else {
            navPage();       // navega normalmente
        }
    };


    return (
        <section className={styles.document}>
            <section className={styles.cardArea}>

                <figure className={styles.card}>
                    <svg viewBox="0 0 400 425" className={styles.cardBorder}>
                        <rect
                            x="1"
                            y="1"
                            width="398"
                            height="423"
                            rx="9"
                            fill="none"
                            stroke="url(#paintGradient)"
                            strokeWidth="5"
                            strokeDasharray="0,255,0,255,5,1626.1842041015625"
                        >
                            <animate
                                attributeType="XML"
                                attributeName="stroke-dasharray"
                                repeatCount="indefinite"
                                dur="7.9s"
                                values="
                  0,0,0,0,0,1626.18; 
                  0,0,0,482.61,178.33,965.23;
                  0,0,542.06,0,1084.12,1626.18;
                  0,0,1084.12,0,542.06,1626.18;
                  0,0,1355.15,271.03,0,0;
                  0,1626.18,0,542.06,0,1626.18
                "
                            />
                        </rect>

                        <defs>
                            <linearGradient
                                id="paintGradient"
                                x1="0"
                                y1="0"
                                x2="400"
                                y2="425"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="#d7c216" />
                                <stop offset="25%" stopColor="#5f81b7" />
                                <stop offset="50%" stopColor="#9d43c2" />
                                <stop offset="75%" stopColor="#d66555" />
                                <stop offset="100%" stopColor="#17991b" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Aqui você coloca o que quiser dentro do card */}
                    <img
                        src={imagem}
                        alt="Card image"
                        className={styles.cardImage}
                    />

                    <h2>{titulo}</h2>
                    <figcaption>{descricao}</figcaption>

                    <button className={styles.button} onClick={handleClick} >
                        {label}
                    </button>
                </figure>

            </section>
        </section>
    );
}