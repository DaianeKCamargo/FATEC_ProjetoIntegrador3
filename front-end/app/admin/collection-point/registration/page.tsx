"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "@/styles/admin-register-point.module.css";

export default function RegisterCollectionPointPage() {

    const router = useRouter();

    const [formData, setFormData] = useState({
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
        postCode: ""
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:3001/collection-point",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao cadastrar");
            }

            router.push("/admin/collection-point/list");

        } catch (error) {

            console.error(error);

            alert("Erro ao cadastrar ponto");
        }
    }

    return (
        <div className={styles.container}>

            <h1 className={styles.title}>
                Cadastrar Ponto de Coleta
            </h1>

            <form
                onSubmit={handleSubmit}
                className={styles.form}
            >

                <input
                    type="text"
                    name="nameUser"
                    placeholder="Nome do responsável"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="cpfUser"
                    placeholder="CPF"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="celUser"
                    placeholder="Celular"
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="emailUser"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="linkPhoto"
                    placeholder="Link da foto"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="namePoint"
                    placeholder="Nome do ponto"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="cnpjPoint"
                    placeholder="CNPJ"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="opensDay"
                    placeholder="Dias de funcionamento"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="hourInit"
                    placeholder="Hora inicial"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="hourFinal"
                    placeholder="Hora final"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="street"
                    placeholder="Rua"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="number"
                    placeholder="Número"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="complement"
                    placeholder="Complemento"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="district"
                    placeholder="Bairro"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="city"
                    placeholder="Cidade"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="postCode"
                    placeholder="CEP"
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Cadastrar
                </button>

            </form>

        </div>
    );
}