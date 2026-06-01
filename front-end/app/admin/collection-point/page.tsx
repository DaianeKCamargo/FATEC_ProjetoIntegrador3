"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/admin-collection-point.module.css";
import Link from "next/link";

import {
    FaClipboardList,
    FaCheckCircle,
    FaMapMarkedAlt,
    FaRoute,
    FaStoreAlt,
    FaClock,
} from "react-icons/fa";

type CollectionPoint = {
    idPc: number;
    status: string;
    namePoint: string;
    opensDay: string;
    hourInit: string;
    hourFinal: string;
    address: {
        street: string;
        number: string;
        city: string;
    };
};

export default function CollectionPointPage() {
    const [registeredPoints, setRegisteredPoints] = useState<CollectionPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarPontos() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/collection-point`
                );

                if (!response.ok) {
                    throw new Error("Erro ao buscar pontos");
                }

                const data = await response.json();
                setRegisteredPoints(data);
            } catch (error) {
                console.error("Erro ao carregar pontos:", error);
            } finally {
                setLoading(false);
            }
        }

        carregarPontos();
    }, []);

    return (
        <div className={styles.adminContainer}>
            <div className={styles.adminContent}>
                <span className={styles.kicker}>
                    Administração de pontos de coleta
                </span>

                <div className={styles.cardsGrid}>
                    <section className={styles.card}>
                        <div className={styles.cardIcon}>
                            <FaClipboardList size={42} />
                        </div>

                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>
                                Registrar Ponto de Coleta
                            </h2>
                            <p className={styles.cardDescription}>
                                Acesse o formulário para criar um novo ponto com
                                endereço, contato e horários.
                            </p>
                        </div>

                        <Link
                            className={styles.cardButton}
                            href="/admin/collection-point/registration"
                        >
                            Abrir registro
                        </Link>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardIcon}>
                            <FaCheckCircle size={42} />
                        </div>

                        <div className={styles.cardContent}>
                            <div className={styles.cardHeading}>
                                <h2 className={styles.cardTitle}>
                                    Revisar Solicitações
                                </h2>
                                <span className={styles.reviewBadge}>
                                    {registeredPoints.filter(
                                        (point) => point.status === "PENDENTE"
                                    ).length}{" "}
                                    pendentes
                                </span>
                            </div>

                            <p className={styles.cardDescription}>
                                Avalie as solicitações pendentes e defina se o
                                ponto segue para publicação.
                            </p>
                        </div>

                        <div className={styles.reviewActions}>
                            <button
                                className={styles.cardButton}
                                type="button"
                            >
                                Revisar agora
                            </button>
                        </div>
                    </section>
                </div>

                <section className={styles.listPanel}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionTag}>
                                Visualização
                            </span>

                            <h2 className={styles.sectionTitle}>
                                Pontos de Coleta Cadastrados
                            </h2>
                        </div>

                        <span className={styles.sectionHint}>
                            Lista resumida dos pontos já cadastrados no sistema.
                        </span>
                    </div>

                    {loading ? (
                        <p>Carregando pontos...</p>
                    ) : registeredPoints.length === 0 ? (
                        <p>Nenhum ponto de coleta cadastrado.</p>
                    ) : (
                        <div className={styles.pointsList}>
                            {registeredPoints.map((point) => (
                                <article
                                    key={point.idPc}
                                    className={styles.pointRow}
                                >
                                    <div className={styles.pointIcon}>
                                        <FaStoreAlt />
                                    </div>

                                    <div className={styles.pointInfo}>
                                        <div className={styles.pointHeading}>
                                            <h3>{point.namePoint}</h3>

                                            <span
                                                className={`${styles.pointStatus} ${
                                                    styles[
                                                        point.status.toLowerCase()
                                                    ]
                                                }`}
                                            >
                                                {point.status}
                                            </span>
                                        </div>

                                        <p>
                                            {point.address.street},{" "}
                                            {point.address.number}
                                        </p>

                                        <div className={styles.pointMeta}>
                                            <span>
                                                <FaMapMarkedAlt />{" "}
                                                {point.address.city}
                                            </span>

                                            <span>
                                                <FaClock /> {point.opensDay} |{" "}
                                                {point.hourInit} às{" "}
                                                {point.hourFinal}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className={styles.pointAction}
                                        type="button"
                                    >
                                        Detalhes <FaRoute />
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}