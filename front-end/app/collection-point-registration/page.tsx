'use client';

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import styles from "@/styles/collection-point-registration.module.css";
import { createCollectionPoint } from "@/services/collectionPointService";

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
        city?: string;
        town?: string;
        village?: string;
        postcode?: string;
    };
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
    address: Address;
};

export default function CadastroPontoColetaPage() {
    const [formData, setFormData] = useState<FormState>({
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
        address: {
            street: "",
            number: "",
            district: "",
            city: "",
            postCode: "",
            latitude: null,
            longitude: null,
        },
    });

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AddressSuggestion[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setResults([]);
    }, []);

    async function fetchAddress(q: string) {
        setQuery(q);

        if (q.trim().length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=br&q=${encodeURIComponent(q)}`;

            const res = await fetch(url, {
                headers: {
                    "Accept-Language": "pt-BR,pt;q=0.9",
                },
            });

            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function selectAddress(item: AddressSuggestion) {
        const addr = item.address || {};

        const number = addr.house_number || "";
        const road = addr.road || "";

        setFormData((prev) => ({
            ...prev,
            address: {
                street: [road, number].filter(Boolean).join(" "),
                number,
                district: addr.suburb || addr.neighbourhood || "",
                city: addr.city || addr.town || addr.village || "",
                postCode: addr.postcode || "",
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
            },
        }));

        setQuery(item.display_name);
        setResults([]);
    }

    function handleChange(
        e: ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const field = name.split(".")[1];

            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value,
                },
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.address.latitude || !formData.address.longitude) {
            alert("Selecione um endereço válido da lista");
            return;
        }

        try {
            await createCollectionPoint({
                ...formData,
            });

            alert("Cadastro enviado com sucesso!");
        } catch (err: any) {
            alert(err?.response?.data?.message || "Erro ao cadastrar");
        }
    };

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <h1>Cadastro de Ponto de Coleta</h1>
                <Link href="/">Voltar</Link>
            </section>

            <form className={styles.formCard} onSubmit={handleSubmit}>
                <h2 className={styles.sectionTitle}>Informações do Proprietário</h2>

                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <input
                            name="nameUser"
                            placeholder="Nome"
                            value={formData.nameUser}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            name="cpfUser"
                            placeholder="CPF"
                            value={formData.cpfUser}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            name="celUser"
                            placeholder="Celular"
                            value={formData.celUser}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            name="emailUser"
                            placeholder="Email"
                            value={formData.emailUser}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <h2 className={styles.sectionTitle}>Informações do Ponto de Coleta</h2>

                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <input
                            name="namePoint"
                            placeholder="Nome do Ponto de Coleta"
                            value={formData.namePoint}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            name="cnpjPoint"
                            placeholder="CNPJ"
                            value={formData.cnpjPoint}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            name="linkPhoto"
                            placeholder="Link da Foto"
                            value={formData.linkPhoto}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            name="opensDay"
                            placeholder="Dias de Funcionamento"
                            value={formData.opensDay}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            type="time"
                            name="hourInit"
                            placeholder="Início"
                            value={formData.hourInit}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            type="time"
                            name="hourFinal"
                            placeholder="Final"
                            value={formData.hourFinal}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <h2 className={styles.sectionTitle}>Endereço</h2>

                <div className={styles.field}>
                <input
                    className={styles.searchInput}
                    placeholder="Procurar Endereço"
                    value={query}
                    onChange={(e) => fetchAddress(e.target.value)}
                />
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <input
                            name="address.number"
                            placeholder="Número"
                            value={formData.address.number}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            name="address.district"
                            placeholder="Bairro"
                            value={formData.address.district}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            name="address.city"
                            placeholder="Cidade"
                            value={formData.address.city}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <input
                            name="address.postCode"
                            placeholder="CEP"
                            value={formData.address.postCode}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.btnArea}>
                    <button type="submit" className={styles.sendBtn}>
                        Cadastrar
                    </button>
                </div>

            </form>
        </main>
    );
}   
