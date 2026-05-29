'use client';

import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "@/styles/admin-collection-point-registration.module.css";

interface Address {
    street: string;
    number: string;
    district: string;
    city: string;
    postCode: string;
    latitude: number | null;
    longitude: number | null;
}

interface AddressSuggestion {
    display_name: string;
    lat: string;
    lon: string;
    address?: {
        house_number?: string;
        road?: string;
        suburb?: string;
        neighbourhood?: string;
        city_district?: string;
        city?: string;
        town?: string;
        village?: string;
        postcode?: string;
    };
}

interface FormState {
    nameUser: string;
    cpfUser: string;
    celUser: string;
    emailUser: string;
    namePoint: string;
    cnpjPoint: string;
    opensDay: string;
    hourInit: string;
    hourFinal: string;
    linkPhoto: string;
    address: Address;
}

export default function CreateCollectionPoint() {
    const [form, setForm] = useState<FormState>({
        nameUser: "",
        cpfUser: "",
        celUser: "",
        emailUser: "",
        namePoint: "",
        cnpjPoint: "",
        opensDay: "",
        hourInit: "",
        hourFinal: "",
        linkPhoto: "",
        address: {
            street: "",
            number: "",
            district: "",
            city: "",
            postCode: "",
            latitude: null,
            longitude: null,
        } as Address,
    });

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AddressSuggestion[]>([]);
    const [loading, setLoading] = useState(false);

    async function fetchAddress(q: string) {
        setQuery(q);

        if (q.trim().length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(q)}`;

            const res = await fetch(url, {
                headers: {
                    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
                },
            });

            if (!res.ok) {
                throw new Error(`Falha ao buscar endereço (${res.status})`);
            }

            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function selectAddress(item: AddressSuggestion) {
        const address = item.address || {};
        const number = address.house_number || "";
        const road = address.road || "";
        const street = [number, road].filter(Boolean).join(" ");

        setForm((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                street,
                number,
                district: address.suburb || address.neighbourhood || address.city_district || "",
                city: address.city || address.town || address.village || "",
                postCode: address.postcode || "",
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
            },
        }));

        setResults([]);
        setQuery(item.display_name);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value,
                },
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!form.address.latitude || !form.address.longitude) {
            alert("Please select a valid address!");
            return;
        }

        const res = await fetch("http://localhost:3000/pontos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            alert("Successfully submitted!");
        } else {
            alert("Error submitting data");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <h1 className={styles.title}>Cadastrar Ponto de Coleta</h1>
                <p className={styles.subtitle}>Preencha as informações do ponto e utilize a busca por endereço para completar os dados automaticamente.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.sectionTitle}>Informações do Proprietário</h2>

                    <div className={styles.fieldGrid}>
                        <input className={styles.input} name="nameUser" placeholder="Nome" onChange={handleChange} />
                        <input className={styles.input} name="cpfUser" placeholder="CPF" onChange={handleChange} />
                        <input className={styles.input} name="celUser" placeholder="Celular" onChange={handleChange} />
                        <input className={styles.input} name="emailUser" placeholder="Email" onChange={handleChange} />
                    </div>

                    <h2 className={styles.sectionTitle}>Informações do Ponto de Coleta</h2>

                    <div className={styles.fieldGrid}>
                        <input className={styles.input} name="namePoint" placeholder="Nome do Ponto de Coleta" onChange={handleChange} />
                        <input className={styles.input} name="cnpjPoint" placeholder="CNPJ" onChange={handleChange} />
                        <input className={styles.input} name="linkPhoto" placeholder="Link da Foto" onChange={handleChange} />
                        <input className={styles.input} name="opensDay" placeholder="Dias de Funcionamento" onChange={handleChange} />
                        <input className={styles.input} name="hourInit" placeholder="Início (HH:mm)" onChange={handleChange} />
                        <input className={styles.input} name="hourFinal" placeholder="Final (HH:mm)" onChange={handleChange} />
                    </div>

                    <h2 className={styles.sectionTitle}>Endereço</h2>

                    <input
                        className={styles.searchInput}
                        placeholder="Procurar Endereço"
                        value={query}
                        onChange={(e) => fetchAddress(e.target.value)} />

                {loading && <p>Procurando...</p>}

                <ul className={styles.list}>
                    {results.map((item, i) => (
                        <li key={i} onClick={() => selectAddress(item)}>
                            {item.display_name}
                        </li>
                    ))}
                </ul>

                    <div className={styles.fieldGrid}>
                        <input
                            className={styles.input}
                            name="address.number"
                            placeholder="Número"
                            value={form.address.number}
                            onChange={handleChange}
                        />
                        <input
                            className={styles.input}
                            name="address.district"
                            placeholder="Bairro"
                            value={form.address.district}
                            onChange={handleChange}
                        />
                        <input
                            className={styles.input}
                            name="address.city"
                            placeholder="Cidade"
                            value={form.address.city}
                            onChange={handleChange}
                        />
                        <input
                            className={styles.input}
                            name="address.postCode"
                            placeholder="CEP"
                            value={form.address.postCode}
                            onChange={handleChange}
                        />
                    </div>

                    <button className={styles.submitButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}