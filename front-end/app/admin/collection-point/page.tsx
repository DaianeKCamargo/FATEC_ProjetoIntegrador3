"use client";

import styles from "@/styles/admin-collection-point.module.css";
import Link from "next/link";

import {
    FaArrowRight,
    FaClipboardList,
    FaCheckCircle,
    FaMapMarkedAlt,
    FaRoute,
    FaStoreAlt,
    FaClock,
    FaEye,
} from "react-icons/fa";

const reviewItems = [
    {
        title: "Lar Esperança",
        location: "Centro - São Paulo",
        status: "Pendente",
        description: "Novo cadastro aguardando validação de documentos e endereço.",
    },
    {
        title: "Pet Vida",
        location: "Jardim América - Campinas",
        status: "Em análise",
        description: "Cadastro com foto e horário recebidos, pronto para aprovação.",
    },
    {
        title: "Clínica Amigos do Pet",
        location: "Vila Mariana - São Paulo",
        status: "Revisado",
        description: "Solicitação validada com dados completos para publicação.",
    },
];

const registeredPoints = [
    {
        name: "Ponto Solidário da Vila",
        address: "Rua das Palmeiras, 245",
        city: "Sorocaba - SP",
        status: "Aprovado",
        schedule: "Seg. a sex. | 8h às 18h",
    },
    {
        name: "Recicla Pet",
        address: "Av. Brasil, 1830",
        city: "Ribeirão Preto - SP",
        status: "Aprovado",
        schedule: "Ter. a sáb. | 9h às 17h",
    },
    {
        name: "Casa de Apoio Animal",
        address: "Rua Aurora, 67",
        city: "Bauru - SP",
        status: "Pendente",
        schedule: "Todos os dias | 10h às 16h",
    },
    {
        name: "Projeto Patas Unidas",
        address: "Av. Integração, 910",
        city: "Piracicaba - SP",
        status: "Rejeitado",
        schedule: "Verificar documentação",
    },
];

export default function CollectionPointPage() {
    return (
        <div className={styles.adminContainer}>
            <div className={styles.adminContent}>
                <span className={styles.kicker}>Administração de pontos de coleta</span>

                <div className={styles.cardsGrid}>
                    <section className={styles.card}>
                        <div className={styles.cardIcon}>
                            <FaClipboardList size={42} />
                        </div>

                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>Registrar Ponto de Coleta</h2>
                            <p className={styles.cardDescription}>
                                Acesse o formulário para criar um novo ponto com endereço, contato e horários.
                            </p>
                        </div>

                        <Link className={styles.cardButton} href="/admin/collection-point/registration">
                            Abrir registro
                        </Link>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardIcon}>
                            <FaCheckCircle size={42} />
                        </div>

                        <div className={styles.cardContent}>
                            <div className={styles.cardHeading}>
                                <h2 className={styles.cardTitle}>Revisar Solicitações</h2>
                                <span className={styles.reviewBadge}>3 pendentes</span>
                            </div>
                            <p className={styles.cardDescription}>
                                Avalie as solicitações pendentes e defina se o ponto segue para publicação.
                            </p>
                        </div>

                        <div className={styles.reviewActions}>
                            <button className={styles.cardButton} type="button">
                                Revisar agora
                            </button>
                        </div>
                    </section>
                </div>


                <section className={styles.listPanel}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionTag}>Visualização</span>
                            <h2 className={styles.sectionTitle}>Pontos de Coleta Cadastrados</h2>
                        </div>
                        <span className={styles.sectionHint}>
                            Lista resumida dos pontos já cadastrados no sistema.
                        </span>
                    </div>

                    <div className={styles.pointsList}>
                        {registeredPoints.map((point) => (
                            <article key={point.name} className={styles.pointRow}>
                                <div className={styles.pointIcon}>
                                    <FaStoreAlt />
                                </div>
                                <div className={styles.pointInfo}>
                                    <div className={styles.pointHeading}>
                                        <h3>{point.name}</h3>
                                        <span className={`${styles.pointStatus} ${styles[point.status.toLowerCase()]}`}>
                                            {point.status}
                                        </span>
                                    </div>
                                    <p>{point.address}</p>
                                    <div className={styles.pointMeta}>
                                        <span><FaMapMarkedAlt /> {point.city}</span>
                                        <span><FaClock /> {point.schedule}</span>
                                    </div>
                                </div>
                                <button className={styles.pointAction} type="button">
                                    Detalhes <FaRoute />
                                </button>
                            </article>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}