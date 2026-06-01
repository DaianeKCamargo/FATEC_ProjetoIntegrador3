'use client';

import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "@/styles/admin-collection-point-registration.module.css";

interface Address {
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    postCode: string;
    latitude: number | null;
    longitude: number | null;
}

interface ViaCepResponse {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

interface GeocodeResult {
    lat: string;
    lon: string;
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
            complement: "",
            district: "",
            city: "",
            state: "",
            postCode: "",
            latitude: null,
            longitude: null,
        },
    });

    const [loading, setLoading] = useState(false);
    const [addressStatus, setAddressStatus] = useState("");

    function onlyDigits(value: string) {
        return value.replace(/\D/g, "");
    }

    function formatCep(value: string) {
        const digits = onlyDigits(value).slice(0, 8);

        if (digits.length > 5) {
            return `${digits.slice(0, 5)}-${digits.slice(5)}`;
        }

        return digits;
    }

    async function geocodeAddress(address: Address) {
        const searchAddress = [
            address.street,
            address.number,
            address.district,
            address.city,
            address.state,
            address.postCode,
            "Brasil",
        ].filter(Boolean).join(", ");

        if (!address.street || !address.city || !address.state) {
            return { latitude: null, longitude: null };
        }

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(searchAddress)}`;

            const res = await fetch(url, {
                headers: {
                    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
                },
            });

            if (!res.ok) {
                throw new Error(`Falha ao buscar geolocalizacao (${res.status})`);
            }

            const data = await res.json() as GeocodeResult[];
            const firstResult = Array.isArray(data) ? data[0] : null;
            const latitude = firstResult ? Number(firstResult.lat) : null;
            const longitude = firstResult ? Number(firstResult.lon) : null;

            if (latitude === null || longitude === null || Number.isNaN(latitude) || Number.isNaN(longitude)) {
                return { latitude: null, longitude: null };
            }

            return { latitude, longitude };
        } catch (error) {
            console.error("Erro ao buscar geolocalizacao:", error);
            return { latitude: null, longitude: null };
        }
    }

    async function fetchAddressByCep(cep: string, currentAddress: Address) {
        const cleanCep = onlyDigits(cep);

        if (cleanCep.length !== 8) {
            return;
        }

        setLoading(true);
        setAddressStatus("Buscando endereco pelo CEP...");

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

            if (!response.ok) {
                throw new Error(`Falha ao buscar CEP (${response.status})`);
            }

            const data = await response.json() as ViaCepResponse;

            if (data.erro) {
                setAddressStatus("CEP nao encontrado.");
                setForm((prev) => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        street: "",
                        district: "",
                        city: "",
                        state: "",
                        latitude: null,
                        longitude: null,
                    },
                }));
                return;
            }

            const addressFromCep: Address = {
                ...currentAddress,
                street: data.logradouro || "",
                district: data.bairro || "",
                city: data.localidade || "",
                state: data.uf || "",
                postCode: formatCep(data.cep || cleanCep),
                latitude: null,
                longitude: null,
            };

            const coordinates = await geocodeAddress(addressFromCep);

            setForm((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    ...addressFromCep,
                    ...coordinates,
                },
            }));

            setAddressStatus(coordinates.latitude !== null && coordinates.longitude !== null
                ? "Endereco preenchido automaticamente."
                : "Endereco preenchido. Informe o numero e confira os dados para localizar melhor.");
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setAddressStatus("Nao foi possivel buscar o CEP informado.");
        } finally {
            setLoading(false);
        }
    }

    async function updateCurrentGeolocation(address: Address) {
        const coordinates = await geocodeAddress(address);

        setForm((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                ...coordinates,
            },
        }));

        if (coordinates.latitude !== null && coordinates.longitude !== null) {
            setAddressStatus("Geolocalizacao do endereco atualizada.");
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const field = name.split(".")[1] as keyof Address;
            const nextValue = field === "postCode" ? formatCep(value) : value;
            const nextAddress = {
                ...form.address,
                [field]: nextValue,
                latitude: null,
                longitude: null,
            };

            setForm((prev) => ({
                ...prev,
                address: nextAddress,
            }));

            if (field === "postCode") {
                setAddressStatus("");
                fetchAddressByCep(nextValue, nextAddress);
            }

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (
            form.address.latitude === null ||
            form.address.longitude === null
        ) {
            alert("Informe um CEP valido para carregar a geolocalizacao do endereco.");
            return;
        }

        const payload = {
            ...form,
            address: {
                street: form.address.street,
                number: form.address.number,
                complement: form.address.complement,
                district: form.address.district,
                city: form.address.city,
                postCode: form.address.postCode,
                latitude: form.address.latitude,
                longitude: form.address.longitude,
            },
        };

        const res = await fetch(
            "http://localhost:5501/api/collection-point",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

        if (res.ok) {
            alert("Cadastro enviado com sucesso!");
        } else {
            alert("Erro ao enviar cadastro.");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <h1 className={styles.title}>Cadastrar Ponto de Coleta</h1>
                <p className={styles.subtitle}>Preencha as informacoes do ponto e informe o CEP para completar o endereco automaticamente.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.sectionTitle}>Informacoes do Proprietario</h2>

                    <div className={styles.fieldGrid}>
                        <input className={styles.input} name="nameUser" placeholder="Nome" onChange={handleChange} />
                        <input className={styles.input} name="cpfUser" placeholder="CPF" onChange={handleChange} />
                        <input className={styles.input} name="celUser" placeholder="Celular" onChange={handleChange} />
                        <input className={styles.input} name="emailUser" placeholder="Email" onChange={handleChange} />
                    </div>

                    <h2 className={styles.sectionTitle}>Informacoes do Ponto de Coleta</h2>

                    <div className={styles.fieldGrid}>
                        <input className={styles.input} name="namePoint" placeholder="Nome do Ponto de Coleta" onChange={handleChange} />
                        <input className={styles.input} name="cnpjPoint" placeholder="CNPJ" onChange={handleChange} />
                        <input className={styles.input} name="linkPhoto" placeholder="Link da Foto" onChange={handleChange} />
                        <input className={styles.input} name="opensDay" placeholder="Dias de Funcionamento" onChange={handleChange} />
                        <input className={styles.input} name="hourInit" placeholder="Inicio (HH:mm)" onChange={handleChange} />
                        <input className={styles.input} name="hourFinal" placeholder="Final (HH:mm)" onChange={handleChange} />
                    </div>

                    <h2 className={styles.sectionTitle}>Endereco</h2>

                    <div className={styles.fieldGrid}>
                        <input
                            className={styles.input}
                            name="address.postCode"
                            placeholder="CEP"
                            value={form.address.postCode}
                            onChange={handleChange}
                        />
                        <input
                            className={styles.input}
                            name="address.street"
                            placeholder="Rua"
                            value={form.address.street}
                            onChange={handleChange}
                        />
                        <input
                            className={styles.input}
                            name="address.number"
                            placeholder="Numero"
                            value={form.address.number}
                            onBlur={() => updateCurrentGeolocation(form.address)}
                            onChange={handleChange}
                        />
                        <input
                            className={styles.input}
                            name="address.complement"
                            placeholder="Complemento"
                            value={form.address.complement}
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
                    </div>

                    {loading && <p className={styles.statusMessage}>Buscando endereco...</p>}
                    {addressStatus && !loading && <p className={styles.statusMessage}>{addressStatus}</p>}

                    <button className={styles.submitButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}
