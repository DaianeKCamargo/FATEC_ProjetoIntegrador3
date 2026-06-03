"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import styles from "@/styles/admin-collection-point.module.css";
import { FaCheck, FaClock, FaEdit, FaEye, FaMapMarkedAlt, FaSave, FaStoreAlt, FaTimes } from "react-icons/fa";

type CollectionPoint = {
    idPc: number;
    status: string;
    rejectionReason?: string | null;
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
    createdAt?: string;
    updatedAt?: string;
    address: {
        street: string;
        number: string;
        complement?: string | null;
        district: string;
        city: string;
        postCode: string;
        latitude: number | null;
        longitude: number | null;
    };
};

type EditableCollectionPoint = Omit<CollectionPoint, "idPc" | "status">;
type EditableFieldName =
    | Exclude<keyof EditableCollectionPoint, "address">
    | `address.${keyof EditableCollectionPoint["address"]}`;
type EditableAddress = EditableCollectionPoint["address"];

type ViaCepResponse = {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    latitude?: number | null;
    longitude?: number | null;
    erro?: boolean;
};

type GeocodeResult = {
    lat: string;
    lon: string;
};

const editableFields: {
    section: string;
    fields: {
        label: string;
        name: EditableFieldName;
        type?: string;
        apiReadonly?: boolean;
    }[];
}[] = [
    {
        section: "Dados do responsavel",
        fields: [
            { label: "Nome", name: "nameUser" },
            { label: "CPF", name: "cpfUser" },
            { label: "Celular", name: "celUser" },
            { label: "Email", name: "emailUser", type: "email" },
        ],
    },
    {
        section: "Dados do ponto",
        fields: [
            { label: "Nome do ponto", name: "namePoint" },
            { label: "CNPJ", name: "cnpjPoint" },
            { label: "Link da foto", name: "linkPhoto" },
            { label: "Dias de funcionamento", name: "opensDay" },
            { label: "Horario inicial", name: "hourInit" },
            { label: "Horario final", name: "hourFinal" },
        ],
    },
    {
        section: "Endereco",
        fields: [
            { label: "CEP", name: "address.postCode" },
            { label: "Rua", name: "address.street", apiReadonly: true },
            { label: "Numero", name: "address.number" },
            { label: "Complemento", name: "address.complement" },
            { label: "Bairro", name: "address.district", apiReadonly: true },
            { label: "Cidade", name: "address.city", apiReadonly: true },
        ],
    },
];

function createEditForm(point: CollectionPoint): EditableCollectionPoint {
    return {
        nameUser: point.nameUser || "",
        cpfUser: point.cpfUser || "",
        celUser: point.celUser || "",
        emailUser: point.emailUser || "",
        linkPhoto: point.linkPhoto || "",
        namePoint: point.namePoint || "",
        cnpjPoint: point.cnpjPoint || "",
        opensDay: point.opensDay || "",
        hourInit: point.hourInit || "",
        hourFinal: point.hourFinal || "",
        address: {
            street: point.address?.street || "",
            number: point.address?.number || "",
            complement: point.address?.complement || "",
            district: point.address?.district || "",
            city: point.address?.city || "",
            postCode: point.address?.postCode || "",
            latitude: point.address?.latitude ?? null,
            longitude: point.address?.longitude ?? null,
        },
    };
}

function formatDate(value?: string) {
    if (!value) {
        return "Nao informado";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}

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

function hasAddressChanged(original: CollectionPoint, form: EditableCollectionPoint) {
    const originalAddress = createEditForm(original).address;

    return Object.entries(form.address).some(([key, value]) => {
        const field = key as keyof EditableAddress;
        return value !== originalAddress[field];
    });
}

function buildUpdatePayload(
    original: CollectionPoint,
    form: EditableCollectionPoint
) {
    const originalForm = createEditForm(original);
    const payload: Partial<EditableCollectionPoint> = {};
    const addressPayload: Record<string, string | number | null> = {};

    Object.entries(form).forEach(([key, value]) => {
        if (key === "address") {
            return;
        }

        const field = key as Exclude<keyof EditableCollectionPoint, "address">;

        if (value !== originalForm[field]) {
            payload[field] = value as string;
        }
    });

    Object.entries(form.address).forEach(([key, value]) => {
        const field = key as keyof EditableAddress;

        if (value !== originalForm.address[field]) {
            addressPayload[field] = value;
        }
    });

    if (Object.keys(addressPayload).length > 0) {
        payload.address = addressPayload as EditableAddress;
    }

    return payload;
}

async function geocodeAddress(address: EditableAddress) {
    const searchAddress = [
        address.street,
        address.number,
        address.district,
        address.city,
        address.postCode,
        "Brasil",
    ].filter(Boolean).join(", ");

    if (!address.street || !address.city || !address.number) {
        return { latitude: null, longitude: null };
    }

    try {
        const response = await fetch(`/api/address/geocode?q=${encodeURIComponent(searchAddress)}`);

        if (!response.ok) {
            return { latitude: null, longitude: null };
        }

        const data = await response.json() as GeocodeResult[];
        const firstResult = Array.isArray(data) ? data[0] : null;
        const latitude = firstResult ? Number(firstResult.lat) : null;
        const longitude = firstResult ? Number(firstResult.lon) : null;

        if (latitude === null || longitude === null || Number.isNaN(latitude) || Number.isNaN(longitude)) {
            return { latitude: null, longitude: null };
        }

        return { latitude, longitude };
    } catch {
        return { latitude: null, longitude: null };
    }
}

async function getApiError(response: Response) {
    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    const message =
        typeof body === "object" && body !== null && "message" in body
            ? String(body.message)
            : typeof body === "string" && body
                ? body
                : response.statusText;

    return { status: response.status, message };
}

export default function RegistrationReview() {
    const [points, setPoints] = useState<CollectionPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
    const [editForm, setEditForm] = useState<EditableCollectionPoint | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressStatus, setAddressStatus] = useState("");

    useEffect(() => {
        async function loadPendingPoints() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collection-point`);

                if (!response.ok) {
                    throw new Error("Erro ao buscar solicitacoes pendentes");
                }

                const data = await response.json();
                setPoints(data);
            } catch (error) {
                console.error("Erro ao carregar solicitacoes:", error);
            } finally {
                setLoading(false);
            }
        }

        loadPendingPoints();
    }, []);

    const pendingPoints = points.filter((point) => point.status === "PENDENTE");

    function abrirDetalhes(point: CollectionPoint) {
        setSelectedPoint(point);
        setEditForm(createEditForm(point));
        setIsEditing(false);
        setAddressStatus("");
    }

    function fecharDetalhes() {
        setSelectedPoint(null);
        setEditForm(null);
        setIsEditing(false);
        setAddressStatus("");
        setAddressLoading(false);
    }

    async function fetchAddressByCep(cep: string, currentAddress: EditableAddress) {
        const cleanCep = onlyDigits(cep);

        if (cleanCep.length !== 8) {
            return;
        }

        setAddressLoading(true);
        setAddressStatus("Buscando endereco pelo CEP...");

        try {
            const response = await fetch(`/api/address/cep?cep=${cleanCep}`);

            if (!response.ok) {
                throw new Error(`Falha ao buscar CEP (${response.status})`);
            }

            const data = await response.json() as ViaCepResponse;

            if (data.erro) {
                setAddressStatus("CEP nao encontrado.");
                return;
            }

            const addressFromCep: EditableAddress = {
                ...currentAddress,
                street: data.logradouro || "",
                district: data.bairro || "",
                city: data.localidade || "",
                postCode: formatCep(data.cep || cleanCep),
                latitude: data.latitude ?? null,
                longitude: data.longitude ?? null,
            };
            const coordinates = addressFromCep.latitude !== null && addressFromCep.longitude !== null
                ? { latitude: addressFromCep.latitude, longitude: addressFromCep.longitude }
                : await geocodeAddress(addressFromCep);

            setEditForm((prev) => prev
                ? {
                    ...prev,
                    address: {
                        ...prev.address,
                        ...addressFromCep,
                        ...coordinates,
                    },
                }
                : prev
            );
            setAddressStatus(coordinates.latitude !== null && coordinates.longitude !== null
                ? "Endereco preenchido pelo CEP e geolocalizacao atualizada."
                : "Endereco preenchido pelo CEP. Confira o numero para localizar melhor.");
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setAddressStatus("Nao foi possivel buscar o CEP informado.");
        } finally {
            setAddressLoading(false);
        }
    }

    function handleEditChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = event.target;

        setEditForm((prev) => {
            if (!prev) {
                return prev;
            }

            if (name.startsWith("address.")) {
                const field = name.split(".")[1] as keyof EditableAddress;
                const nextValue = field === "postCode"
                    ? formatCep(value)
                    : type === "number" && value !== "" ? Number(value) : value;

                return {
                    ...prev,
                    address: {
                        ...prev.address,
                        [field]: value === "" && type === "number" ? null : nextValue,
                        latitude: null,
                        longitude: null,
                    },
                };
            }

            return {
                ...prev,
                [name as Exclude<keyof EditableCollectionPoint, "address">]: value,
            };
        });
    }

    async function salvarEdicao() {
        if (!selectedPoint || !editForm) {
            return;
        }

        setSaving(true);

        try {
            let formToSave = editForm;

            if (hasAddressChanged(selectedPoint, editForm)) {
                const coordinates = await geocodeAddress(editForm.address);

                if (coordinates.latitude === null || coordinates.longitude === null) {
                    alert("Nao foi possivel localizar o endereco. Confira CEP, rua, numero, bairro e cidade antes de salvar.");
                    return;
                }

                formToSave = {
                    ...editForm,
                    address: {
                        ...editForm.address,
                        ...coordinates,
                    },
                };
            }

            const payload = buildUpdatePayload(selectedPoint, formToSave);

            if (Object.keys(payload).length === 0) {
                setIsEditing(false);
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/collection-point/${selectedPoint.idPc}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const apiError = await getApiError(response);
                throw new Error(`Erro ao salvar solicitacao (${apiError.status}): ${apiError.message}`);
            }

            const updatedPoint = await response.json();

            setPoints((prev) =>
                prev.map((point) =>
                    point.idPc === selectedPoint.idPc ? updatedPoint : point
                )
            );
            setSelectedPoint(updatedPoint);
            setEditForm(createEditForm(updatedPoint));
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao salvar solicitacao:", error);
            alert(error instanceof Error ? error.message : "Erro ao salvar solicitacao.");
        } finally {
            setSaving(false);
        }
    }

    async function alterarStatus(idPc: number, status: "APROVADO" | "REJEITADO") {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/collection-point/${idPc}/status`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        status,
                        ...(status === "REJEITADO"
                            ? { reason: "Solicitacao recusada pelo administrador" }
                            : {}),
                    }),
                }
            );

            if (!response.ok) {
                const apiError = await getApiError(response);
                throw new Error(`Erro ao atualizar status (${apiError.status}): ${apiError.message}`);
            }

            setPoints((prev) => prev.filter((point) => point.idPc !== idPc));
            fecharDetalhes();
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert(error instanceof Error ? error.message : "Erro ao atualizar status.");
        }
    }

    function getEditValue(name: EditableFieldName) {
        if (!editForm) {
            return "";
        }

        if (String(name).startsWith("address.")) {
            const field = String(name).split(".")[1] as keyof EditableAddress;
            return editForm.address[field] ?? "";
        }

        return editForm[name as Exclude<keyof EditableCollectionPoint, "address">] ?? "";
    }

    return (
        <div className={styles.adminContainer}>
            <div className={styles.adminContent}>
                <span className={styles.kicker}>
                    Revisao de pontos de coleta
                </span>

                <section className={styles.listPanel}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionTag}>
                                Pendentes
                            </span>

                            <h2 className={styles.sectionTitle}>
                                Solicitações de Ponto de Coleta
                            </h2>
                        </div>

                        <div className={styles.sectionTools}>
                            <span className={styles.sectionHint}>
                                Visualize, edite, aprove ou recuse os cadastros pendentes.
                            </span>

                            <span className={styles.reviewBadge}>
                                {pendingPoints.length} pendentes
                            </span>
                        </div>
                    </div>

                    {selectedPoint && editForm && (
                        <div className={styles.modalOverlay}>
                            <article className={`${styles.detailPanel} ${styles.modalContent}`}>
                            <div className={styles.detailHeader}>
                                <div>
                                    <span className={`${styles.pointStatus} ${styles.pendente}`}>
                                        Pendente
                                    </span>
                                    <h3 className={styles.detailTitle}>
                                        {selectedPoint.namePoint}
                                    </h3>
                                </div>

                            </div>

                            <div className={styles.detailGrid}>
                                <section className={styles.detailGroup}>
                                    <h4>Foto do ponto</h4>

                                    <div className={styles.photoPreview}>
                                        {selectedPoint.linkPhoto ? (
                                            <img
                                                src={selectedPoint.linkPhoto}
                                                alt={`Foto do ponto ${selectedPoint.namePoint}`}
                                            />
                                        ) : (
                                            <span>Imagem nao informada.</span>
                                        )}
                                    </div>
                                </section>

                                <section className={styles.detailGroup}>
                                    <h4>Informacoes do cadastro</h4>

                                    <div className={styles.detailFields}>
                                        <label className={styles.detailField}>
                                            <span>ID</span>
                                            <input className={styles.detailInput} value={selectedPoint.idPc} readOnly />
                                        </label>
                                        <label className={styles.detailField}>
                                            <span>Status</span>
                                            <input className={styles.detailInput} value={selectedPoint.status} readOnly />
                                        </label>
                                        <label className={styles.detailField}>
                                            <span>Cadastrado em</span>
                                            <input className={styles.detailInput} value={formatDate(selectedPoint.createdAt)} readOnly />
                                        </label>
                                        <label className={styles.detailField}>
                                            <span>Atualizado em</span>
                                            <input className={styles.detailInput} value={formatDate(selectedPoint.updatedAt)} readOnly />
                                        </label>
                                    </div>
                                </section>

                                {editableFields.map((group) => (
                                    <section className={styles.detailGroup} key={group.section}>
                                        <h4>{group.section}</h4>

                                        <div className={styles.detailFields}>
                                            {group.fields.map((field) => (
                                                <label className={styles.detailField} key={field.name}>
                                                    <span>{field.label}</span>
                                                    <input
                                                        className={styles.detailInput}
                                                        name={field.name}
                                                        type={field.type || "text"}
                                                        value={getEditValue(field.name)}
                                                        onChange={handleEditChange}
                                                        onBlur={() => {
                                                            if (!isEditing || field.apiReadonly || !editForm || !String(field.name).startsWith("address.")) {
                                                                return;
                                                            }

                                                            if (field.name === "address.postCode") {
                                                                fetchAddressByCep(String(getEditValue(field.name)), editForm.address);
                                                            }
                                                        }}
                                                        readOnly={!isEditing || field.apiReadonly}
                                                    />
                                                </label>
                                            ))}
                                        </div>

                                        {group.section === "Endereco" && (addressLoading || addressStatus) && (
                                            <p className={styles.addressStatus}>
                                                {addressLoading ? "Atualizando endereco..." : addressStatus}
                                            </p>
                                        )}
                                    </section>
                                ))}
                            </div>

                            <div className={`${styles.detailActions} ${styles.detailFooterActions}`}>
                                {isEditing ? (
                                    <>
                                        <button
                                            className={styles.pointAction}
                                            type="button"
                                            onClick={salvarEdicao}
                                            disabled={saving}
                                        >
                                            <FaSave /> {saving ? "Salvando..." : "Salvar"}
                                        </button>
                                        <button
                                            className={styles.pointAction}
                                            type="button"
                                            onClick={() => {
                                                setEditForm(createEditForm(selectedPoint));
                                                setIsEditing(false);
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className={styles.pointAction}
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <FaEdit /> Editar
                                    </button>
                                )}

                                <button
                                    className={styles.pointAction}
                                    type="button"
                                    onClick={fecharDetalhes}
                                >
                                    Fechar
                                </button>
                                <button
                                    className={`${styles.pointAction} ${styles.successAction}`}
                                    type="button"
                                    onClick={() => alterarStatus(selectedPoint.idPc, "APROVADO")}
                                >
                                    <FaCheck /> Aprovar
                                </button>
                                <button
                                    className={`${styles.pointAction} ${styles.dangerAction}`}
                                    type="button"
                                    onClick={() => alterarStatus(selectedPoint.idPc, "REJEITADO")}
                                >
                                    <FaTimes /> Recusar
                                </button>
                            </div>
                            </article>
                        </div>
                    )}

                    {loading ? (
                        <p>Carregando solicitações...</p>
                    ) : pendingPoints.length === 0 ? (
                        <p>Nenhuma solicitação pendente.</p>
                    ) : (
                        <div className={styles.pointsList}>
                            {pendingPoints.map((point) => (
                                <article
                                    key={point.idPc}
                                    className={styles.pointRow}
                                >
                                    <div className={styles.pointThumb}>
                                        {point.linkPhoto ? (
                                            <img
                                                src={point.linkPhoto}
                                                alt={`Foto do ponto ${point.namePoint}`}
                                            />
                                        ) : (
                                            <FaStoreAlt />
                                        )}
                                    </div>

                                    <div className={styles.pointInfo}>
                                        <div className={styles.pointHeading}>
                                            <h3>{point.namePoint}</h3>

                                            <span className={`${styles.pointStatus} ${styles.pendente}`}>
                                                Pendente
                                            </span>
                                        </div>

                                        <p>
                                            {point.address.street}, {point.address.number}
                                        </p>

                                        <div className={styles.pointMeta}>
                                            <span>
                                                <FaMapMarkedAlt /> {point.address.city}
                                            </span>

                                            <span>
                                                <FaClock /> {point.opensDay} | {point.hourInit} as {point.hourFinal}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className={styles.pointAction}
                                        type="button"
                                        onClick={() => abrirDetalhes(point)}
                                    >
                                        <FaEye /> Visualizar
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
