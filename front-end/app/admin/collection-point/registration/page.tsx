'use client';

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Search } from "lucide-react";
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
    latitude?: number | null;
    longitude?: number | null;
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
    const [searchLoading, setSearchLoading] = useState(false);
    const [addressStatus, setAddressStatus] = useState("");
    const [addressLookup, setAddressLookup] = useState({
        state: "",
        city: "",
        street: "",
    });
    const [addressSuggestions, setAddressSuggestions] = useState<ViaCepResponse[]>([]);
    const [showAddressLookup, setShowAddressLookup] = useState(false);

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

    function getStateUf(state?: string) {
        if (!state) {
            return "";
        }

        if (state.length === 2) {
            return state.toUpperCase();
        }

        const states: Record<string, string> = {
            acre: "AC",
            alagoas: "AL",
            amapa: "AP",
            amazonas: "AM",
            bahia: "BA",
            ceara: "CE",
            distrito: "DF",
            "distrito federal": "DF",
            "espirito santo": "ES",
            goias: "GO",
            maranhao: "MA",
            "mato grosso": "MT",
            "mato grosso do sul": "MS",
            "minas gerais": "MG",
            para: "PA",
            paraiba: "PB",
            parana: "PR",
            pernambuco: "PE",
            piaui: "PI",
            "rio de janeiro": "RJ",
            "rio grande do norte": "RN",
            "rio grande do sul": "RS",
            rondonia: "RO",
            roraima: "RR",
            "santa catarina": "SC",
            "sao paulo": "SP",
            sergipe: "SE",
            tocantins: "TO",
        };
        const normalizedState = state
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        return states[normalizedState] || "";
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
            const res = await fetch(`/api/address/geocode?q=${encodeURIComponent(searchAddress)}`);

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
            const response = await fetch(`/api/address/cep?cep=${cleanCep}`);

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
                latitude: data.latitude ?? null,
                longitude: data.longitude ?? null,
            };

            const coordinates = addressFromCep.latitude !== null && addressFromCep.longitude !== null
                ? { latitude: addressFromCep.latitude, longitude: addressFromCep.longitude }
                : await geocodeAddress(addressFromCep);

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

    function handleAddressLookupChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setAddressLookup((prev) => ({
            ...prev,
            [name]: name === "state" ? value.toUpperCase().slice(0, 2) : value,
        }));
    }

    async function fetchAddressSuggestions() {
        const uf = getStateUf(addressLookup.state);
        const city = addressLookup.city.trim();
        const street = addressLookup.street.trim();

        if (!uf || city.length < 3 || street.length < 3) {
            setAddressSuggestions([]);
            setAddressStatus("Informe UF, cidade e rua para buscar sugestoes.");
            return;
        }

        setSearchLoading(true);
        setAddressStatus("Buscando sugestoes pelo endereco...");

        try {
            const response = await fetch(`/api/address/cep?uf=${encodeURIComponent(uf)}&city=${encodeURIComponent(city)}&street=${encodeURIComponent(street)}`);

            if (!response.ok) {
                setAddressSuggestions([]);
                setAddressStatus("Nao foi possivel buscar sugestoes. Confira UF, cidade e rua.");
                return;
            }

            const data = await response.json() as ViaCepResponse[];
            const suggestions = Array.isArray(data) ? data : [];

            setAddressSuggestions(suggestions);
            setAddressStatus(suggestions.length > 0
                ? "Selecione uma sugestao de endereco."
                : "Nenhuma sugestao encontrada para esse endereco.");
        } catch (error) {
            console.error("Erro ao buscar sugestoes de endereco:", error);
            setAddressSuggestions([]);
            setAddressStatus("Nao foi possivel buscar sugestoes. Tente informar o CEP.");
        } finally {
            setSearchLoading(false);
        }
    }

    async function selectAddressSuggestion(suggestion: ViaCepResponse) {
        const nextAddress: Address = {
            ...form.address,
            street: suggestion.logradouro || "",
            district: suggestion.bairro || "",
            city: suggestion.localidade || "",
            state: suggestion.uf || "",
            postCode: formatCep(suggestion.cep || ""),
            latitude: null,
            longitude: null,
        };

        await fetchAddressByCep(nextAddress.postCode, nextAddress);

        setAddressSuggestions([]);
        setShowAddressLookup(false);
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
            alert("Informe um CEP valido ou selecione um endereco pela busca para carregar a geolocalizacao.");
            return;
        }

        if (onlyDigits(form.address.postCode).length !== 8) {
            alert("O endereco selecionado nao retornou um CEP valido. Escolha outra sugestao ou informe o CEP manualmente.");
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
                <p className={styles.subtitle}>Preencha as informacoes do ponto e informe o CEP ou busque pelo endereco para completar os dados automaticamente.</p>

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

                    <button
                        className={styles.lookupToggle}
                        type="button"
                        onClick={() => setShowAddressLookup((prev) => !prev)}
                    >
                        {showAddressLookup ? "Buscar pelo CEP" : "Nao sei o CEP"}
                    </button>

                    {showAddressLookup && (
                        <div className={styles.lookupArea}>
                            <div className={styles.fieldGrid}>
                                <input
                                    className={styles.input}
                                    name="state"
                                    placeholder="UF"
                                    value={addressLookup.state}
                                    onChange={handleAddressLookupChange}
                                />
                                <input
                                    className={styles.input}
                                    name="city"
                                    placeholder="Cidade"
                                    value={addressLookup.city}
                                    onChange={handleAddressLookupChange}
                                />
                            </div>

                            <div className={styles.searchField}>
                                <input
                                    className={styles.searchInput}
                                    name="street"
                                    placeholder="Buscar por rua ou avenida"
                                    value={addressLookup.street}
                                    onChange={handleAddressLookupChange}
                                />
                                <button
                                    className={styles.searchButton}
                                    type="button"
                                    onClick={fetchAddressSuggestions}
                                    aria-label="Buscar endereco"
                                >
                                    <Search size={20} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    )}

                    {searchLoading && <p className={styles.statusMessage}>Buscando sugestoes...</p>}

                    <div className={styles.divider} />

                    {addressSuggestions.length > 0 && (
                        <ul className={styles.list}>
                            {addressSuggestions.map((suggestion) => (
                                <li
                                    key={`${suggestion.cep}-${suggestion.logradouro}-${suggestion.bairro}`}
                                    onClick={() => selectAddressSuggestion(suggestion)}
                                >
                                    {[suggestion.logradouro, suggestion.bairro, suggestion.localidade, suggestion.uf, formatCep(suggestion.cep)].filter(Boolean).join(", ")}
                                </li>
                            ))}
                        </ul>
                    )}

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
