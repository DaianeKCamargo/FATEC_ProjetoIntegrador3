"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/styles/cadastro-ponto-coleta.module.css";
import collectionPointService from "@/services/collectionPointService";

type FormState = {
    nameUser: string;
    cpfUser: string;
    celUser: string;
    emailUser: string;
    linkPhoto: string;
    namePoint: string;
    cnpjPoint: string;
    opensDay: string;
    hourInit: string;
    hourFinal: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    postCode: string;
};

const initialFormState: FormState = {
    nameUser: "",
    cpfUser: "",
    celUser: "",
    emailUser: "",
    linkPhoto: "",
    namePoint: "",
    cnpjPoint: "",
    opensDay: "",
    hourInit: "",
    hourFinal: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    postCode: "",
};

export default function CadastroPontoColetaPage() {
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setSuccessMessage("");
        setErrorMessage("");
    }, []);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await collectionPointService.create({
                nameUser: formData.nameUser,
                cpfUser: formData.cpfUser,
                celUser: formData.celUser,
                emailUser: formData.emailUser,
                linkPhoto: formData.linkPhoto,
                namePoint: formData.namePoint,
                cnpjPoint: formData.cnpjPoint,
                opensDay: formData.opensDay,
                hourInit: formData.hourInit,
                hourFinal: formData.hourFinal,
                address: {
                    street: formData.street,
                    number: formData.number,
                    complement: formData.complement,
                    district: formData.district,
                    city: formData.city,
                    postCode: formData.postCode,
                },
            });

            setSuccessMessage("Cadastro enviado com sucesso. Seu ponto de coleta ficará pendente para aprovação do admin.");
            setFormData(initialFormState);
        } catch (error: any) {
            const message = error?.response?.data?.message || "Não foi possível cadastrar o ponto de coleta.";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <span className={styles.tag}>Cadastro de Ponto de Coleta</span>
                <h1>Preencha o formulário e envie seu local para análise do admin</h1>
                <p>
                    Este cadastro salva suas informações no sistema com status pendente.
                    Depois disso, a equipe administrativa poderá aprovar o ponto de coleta.
                </p>
                <Link href="/" className={styles.backLink}>
                    Voltar para a página inicial
                </Link>
            </section>

            <section className={styles.formSection}>
                <form className={styles.formCard} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Seu nome</label>
                            <input name="nameUser" value={formData.nameUser} onChange={handleChange} placeholder="Nome completo" required />
                        </div>
                        <div className={styles.field}>
                            <label>CPF</label>
                            <input name="cpfUser" value={formData.cpfUser} onChange={handleChange} placeholder="000.000.000-00" required />
                        </div>
                        <div className={styles.field}>
                            <label>Celular</label>
                            <input name="celUser" value={formData.celUser} onChange={handleChange} placeholder="(00) 00000-0000" required />
                        </div>
                        <div className={styles.field}>
                            <label>E-mail</label>
                            <input name="emailUser" type="email" value={formData.emailUser} onChange={handleChange} placeholder="email@exemplo.com" required />
                        </div>
                        <div className={styles.fieldWide}>
                            <label>Link da foto</label>
                            <input name="linkPhoto" type="url" value={formData.linkPhoto} onChange={handleChange} placeholder="https://..." required />
                        </div>
                        <div className={styles.fieldWide}>
                            <label>Nome do ponto</label>
                            <input name="namePoint" value={formData.namePoint} onChange={handleChange} placeholder="Nome do estabelecimento" required />
                        </div>
                        <div className={styles.field}>
                            <label>CNPJ</label>
                            <input name="cnpjPoint" value={formData.cnpjPoint} onChange={handleChange} placeholder="00.000.000/0000-00" required />
                        </div>
                        <div className={styles.field}>
                            <label>Dias de funcionamento</label>
                            <input name="opensDay" value={formData.opensDay} onChange={handleChange} placeholder="Segunda a sexta" required />
                        </div>
                        <div className={styles.field}>
                            <label>Hora de abertura</label>
                            <input name="hourInit" type="time" value={formData.hourInit} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Hora de fechamento</label>
                            <input name="hourFinal" type="time" value={formData.hourFinal} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Rua</label>
                            <input name="street" value={formData.street} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Número</label>
                            <input name="number" value={formData.number} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Complemento</label>
                            <input name="complement" value={formData.complement} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label>Bairro</label>
                            <input name="district" value={formData.district} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Cidade</label>
                            <input name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>CEP</label>
                            <input name="postCode" value={formData.postCode} onChange={handleChange} placeholder="00000-000" required />
                        </div>
                    </div>

                    {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
                    {successMessage ? <p className={styles.successMessage}>{successMessage}</p> : null}

                    <div className={styles.btnArea}>
                        <button type="submit" className={styles.sendBtn} disabled={isSubmitting}>
                            {isSubmitting ? "Enviando..." : "Cadastrar"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
