"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/collection-point-modal.module.css";
import collectionPointService from "@/services/collectionPointService";

interface CollectionPointModalProps {
    open: boolean;
    onClose: () => void;
}

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

export default function CollectionPointModal({ open, onClose }: CollectionPointModalProps) {
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!open) {
            setFormData(initialFormState);
            setSuccessMessage("");
            setErrorMessage("");
            setIsSubmitting(false);
        }
    }, [open]);

    if (!open) return null;

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

            setSuccessMessage("Cadastro enviado com sucesso. Ele ficará pendente para aprovação do admin.");
            setFormData(initialFormState);
        } catch (error: any) {
            const message = error?.response?.data?.message || "Não foi possível cadastrar o ponto de coleta.";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={styles.modalContent}>
                <h2>Cadastro do Ponto de Coleta</h2>
                <p className={styles.modalDescription}>
                    Preencha os dados abaixo para enviar seu cadastro ao sistema. O pedido será salvo como pendente e ficará disponível para aprovação do admin.
                </p>

                <form className={styles.formGrid} onSubmit={handleSubmit}>
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

                    {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
                    {successMessage ? <p className={styles.successMessage}>{successMessage}</p> : null}

                    <div className={styles.btnArea}>
                        <button type="submit" className={styles.sendBtn} disabled={isSubmitting}>
                            {isSubmitting ? "Enviando..." : "Cadastrar"}
                        </button>
                        <button type="button" onClick={onClose} className={styles.closeBtn}>
                            Fechar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}