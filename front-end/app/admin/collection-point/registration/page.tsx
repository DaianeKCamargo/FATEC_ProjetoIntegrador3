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

type ApiErrorResponse = {
    message?: string;
    errors?: {
        field?: string;
        message?: string;
    }[];
};

const initialForm: FormState = {
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
};

export default function CreateCollectionPoint() {
    const [form, setForm] = useState<FormState>(initialForm);

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

    function getGeocodeQueries(address: Address) {
        return [
            [
                address.street,
                address.number,
                address.district,
                address.city,
                address.state,
                address.postCode,
                "Brasil",
            ],
            [
                address.postCode,
                address.number,
                address.city,
                address.state,
                "Brasil",
            ],
            [
                address.street,
                address.district,
                address.city,
                address.state,
                "Brasil",
            ],
            [
                address.postCode,
                address.city,
                "Brasil",
            ],
        ]
            .map((parts) => parts.filter(Boolean).join(", "))
            .filter(Boolean);
    }

    async function geocodeAddress(address: Address) {
        const queries = getGeocodeQueries(address);

        if (!address.city || (!address.street && !address.postCode)) {
            return { latitude: null, longitude: null };
        }

        for (const query of queries) {
            try {
                const res = await fetch(`/api/address/geocode?q=${encodeURIComponent(query)}`);

                if (!res.ok) {
                    continue;
                }

                const data = await res.json() as GeocodeResult[];
                const firstResult = Array.isArray(data) ? data[0] : null;
                const latitude = firstResult ? Number(firstResult.lat) : null;
                const longitude = firstResult ? Number(firstResult.lon) : null;

                if (latitude !== null && longitude !== null && !Number.isNaN(latitude) && !Number.isNaN(longitude)) {
                    return { latitude, longitude };
                }
            } catch {
                continue;
            }
        }

        return { latitude: null, longitude: null };
    }

    async function resolveAddressByCep(address: Address) {
        const cleanCep = onlyDigits(address.postCode);

        if (cleanCep.length !== 8) {
            return address;
        }

        try {
            const response = await fetch(`/api/address/cep?cep=${cleanCep}`);

            if (!response.ok) {
                return address;
            }

            const data = await response.json() as ViaCepResponse;

            if (data.erro) {
                return address;
            }

            return {
                ...address,
                street: data.logradouro || address.street,
                district: data.bairro || address.district,
                city: data.localidade || address.city,
                state: data.uf || address.state,
                postCode: formatCep(data.cep || cleanCep),
                latitude: data.latitude ?? address.latitude,
                longitude: data.longitude ?? address.longitude,
            };
        } catch (error) {
            console.error("Erro ao resolver CEP no envio:", error);
            return address;
        }
    }

    async function fetchAddressByCep(cep: string, currentAddress: Address) {
        const cleanCep = onlyDigits(cep);

        if (cleanCep.length !== 8) {
            return;
        }

        setLoading(true);
        setAddressStatus("Buscando endereço pelo CEP...");

        try {
            const response = await fetch(`/api/address/cep?cep=${cleanCep}`);

            if (!response.ok) {
                throw new Error(`Falha ao buscar CEP (${response.status})`);
            }

            const data = await response.json() as ViaCepResponse;

            if (data.erro) {
                setAddressStatus("CEP não encontrado.");
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
                ? "Endereço preenchido automaticamente."
                : "Endereço preenchido. Informe o número e confira os dados para localizar melhor.");
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setAddressStatus("Não foi possível buscar o CEP informado.");
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
            setAddressStatus("Informe UF, cidade e rua para buscar sugestões.");
            return;
        }

        setSearchLoading(true);
        setAddressStatus("Buscando sugestões pelo endereço...");

        try {
            const response = await fetch(`/api/address/cep?uf=${encodeURIComponent(uf)}&city=${encodeURIComponent(city)}&street=${encodeURIComponent(street)}`);

            if (!response.ok) {
                setAddressSuggestions([]);
                setAddressStatus("Não foi possível buscar sugestões. Confira UF, cidade e rua.");
                return;
            }

            const data = await response.json() as ViaCepResponse[];
            const suggestions = Array.isArray(data) ? data : [];

            setAddressSuggestions(suggestions);
            setAddressStatus(suggestions.length > 0
                ? "Selecione uma sugestão de endereço."
                : "Nenhuma sugestão encontrada para esse endereço.");
        } catch (error) {
            console.error("Erro ao buscar sugestões de endereço:", error);
            setAddressSuggestions([]);
            setAddressStatus("Nao foi possivel buscar sugestões. Tente informar o CEP.");
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
            setAddressStatus("Geolocalizacao do endereço atualizada.");
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

    async function getApiErrorMessage(response: Response) {
        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            const text = await response.text();
            return text || `Erro ${response.status}: ${response.statusText}`;
        }

        const data = await response.json() as ApiErrorResponse;
        const details = Array.isArray(data.errors)
            ? data.errors
                .map((error) => [error.field, error.message].filter(Boolean).join(": "))
                .filter(Boolean)
                .join("\n")
            : "";

        return [
            data.message || `Erro ${response.status}: ${response.statusText}`,
            details,
        ].filter(Boolean).join("\n");
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let addressToSubmit = await resolveAddressByCep(form.address);

        if (
            addressToSubmit.latitude === null ||
            addressToSubmit.longitude === null
        ) {
            const coordinates = await geocodeAddress(addressToSubmit);

            if (
                coordinates.latitude === null ||
                coordinates.longitude === null
            ) {
                alert("Não foi possível carregar a geolocalizacao. Confira CEP, numero e cidade ou selecione outro endereço pela busca.");
                return;
            }

            addressToSubmit = {
                ...addressToSubmit,
                ...coordinates,
            };

            setForm((prev) => ({
                ...prev,
                address: addressToSubmit,
            }));
        } else if (addressToSubmit !== form.address) {
            setForm((prev) => ({
                ...prev,
                address: addressToSubmit,
            }));
        }

        if (onlyDigits(addressToSubmit.postCode).length !== 8) {
            alert("O endereco selecionado nãoo retornou um CEP válido. Escolha outra sugestão ou informe o CEP manualmente.");
            return;
        }

        const payload = {
            ...form,
            address: {
                street: addressToSubmit.street,
                number: addressToSubmit.number,
                complement: addressToSubmit.complement,
                district: addressToSubmit.district,
                city: addressToSubmit.city,
                postCode: addressToSubmit.postCode,
                latitude: addressToSubmit.latitude,
                longitude: addressToSubmit.longitude,
            },
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/collection-point`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

        if (res.ok) {
            alert("Cadastro enviado com sucesso!");
            setForm(initialForm);
            setAddressLookup({
                state: "",
                city: "",
                street: "",
            });
            setAddressSuggestions([]);
            setAddressStatus("");
            setShowAddressLookup(false);
        } else {
            const errorMessage = await getApiErrorMessage(res);
            alert(`Erro ao enviar cadastro:\n${errorMessage}`);
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
                        <input className={styles.input} name="nameUser" placeholder="Nome" value={form.nameUser} onChange={handleChange} />
                        <input className={styles.input} name="cpfUser" placeholder="CPF" value={form.cpfUser} onChange={handleChange} />
                        <input className={styles.input} name="celUser" placeholder="Celular" value={form.celUser} onChange={handleChange} />
                        <input className={styles.input} name="emailUser" placeholder="Email" value={form.emailUser} onChange={handleChange} />
                    </div>

                    <h2 className={styles.sectionTitle}>Informacoes do Ponto de Coleta</h2>

                    <div className={styles.fieldGrid}>
                        <input className={styles.input} name="namePoint" placeholder="Nome do Ponto de Coleta" value={form.namePoint} onChange={handleChange} />
                        <input className={styles.input} name="cnpjPoint" placeholder="CNPJ" value={form.cnpjPoint} onChange={handleChange} />
                        <input className={styles.input} name="linkPhoto" placeholder="Link da Foto" value={form.linkPhoto} onChange={handleChange} />
                        <input className={styles.input} name="opensDay" placeholder="Dias de Funcionamento" value={form.opensDay} onChange={handleChange} />
                        <input className={styles.input} name="hourInit" placeholder="Inicio (HH:mm)" value={form.hourInit} onChange={handleChange} />
                        <input className={styles.input} name="hourFinal" placeholder="Final (HH:mm)" value={form.hourFinal} onChange={handleChange} />
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
                                    aria-label="Buscar endereço"
                                >
                                    <Search size={20} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    )}

                    {searchLoading && <p className={styles.statusMessage}>Buscando sugestões...</p>}

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
                            readOnly
                        />
                        <input
                            className={styles.input}
                            name="address.number"
                            placeholder="Número"
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
                            readOnly
                        />
                        <input
                            className={styles.input}
                            name="address.city"
                            placeholder="Cidade"
                            value={form.address.city}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    {loading && <p className={styles.statusMessage}>Buscando endereço...</p>}
                    {addressStatus && !loading && <p className={styles.statusMessage}>{addressStatus}</p>}

                    <button className={styles.submitButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}
