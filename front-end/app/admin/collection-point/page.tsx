"use client";

import styles from "@/styles/admin-collection-point.module.css";

import {
    FaClipboardList,
    FaCheckCircle,
    FaMapMarkedAlt
} from "react-icons/fa";

export default function CollectionPointPage() {
    return (
        <div className={styles.adminContainer}>
            <div className={styles.adminContent}>

                <h1 className={styles.adminTitle}>
                    Administração de Pontos de Coleta
                </h1>

                <p className={styles.adminSubtitle}>
                    Gerencie os cadastros e acompanhe os pontos de coleta.
                </p>

                <div className={styles.cardsGrid}>

                    <div className={styles.card}>

                        <div className={styles.cardIcon}>
                            <FaClipboardList size={42} />
                        </div>

                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>
                                Registrar Ponto de Coleta
                            </h2>

                            <p className={styles.cardDescription}>
                                Cadastre novos pontos de coleta no sistema.
                            </p>
                        </div>

                        <button className={styles.cardButton}>
                            Acessar
                        </button>

                    </div>

                    <div className={styles.card}>

                        <div className={styles.cardIcon}>
                            <FaCheckCircle size={42} />
                        </div>

                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>
                                Revisar Solicitações
                            </h2>

                            <p className={styles.cardDescription}>
                                Aprove ou recuse solicitações enviadas pelos usuários.
                            </p>
                        </div>

                        <button className={styles.cardButton}>
                            Acessar
                        </button>

                    </div>

                    <div className={styles.card}>

                        <div className={styles.cardIcon}>
                            <FaMapMarkedAlt size={42} />
                        </div>

                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>
                                Visualizar Pontos
                            </h2>

                            <p className={styles.cardDescription}>
                                Veja todos os pontos cadastrados, aprovados ou recusados.
                            </p>
                        </div>

                        <button className={styles.cardButton}>
                            Acessar
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}