'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_BASE_URL } from '@/services/apiBase';
import styles from '@/styles/user-collection-point.module.css';
import { ArrowRight, Clock3, LocateFixed, MapPinned, Search } from 'lucide-react';

type PointAddress = {
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    district?: string | null;
    city?: string | null;
    postCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
};

type CollectionPoint = {
    id: number;
    namePoint: string;
    opensDay?: string | null;
    hourInit?: string | null;
    hourFinal?: string | null;
    linkPhoto?: string | null;
    status?: string | null;
    rejectionReason?: string | null;
    address: PointAddress;
};

type SearchPosition = {
    label: string;
    latitude: number;
    longitude: number;
};

type RawCollectionPoint = {
    idPc?: number | string;
    id?: number | string;
    namePoint?: string;
    opensDay?: string | null;
    hourInit?: string | null;
    hourFinal?: string | null;
    linkPhoto?: string | null;
    status?: string | null;
    rejectionReason?: string | null;
    address?: Partial<PointAddress> | null;
};

const fallbackPoints: CollectionPoint[] = [
    {
        id: 1,
        namePoint: 'Ponto Solidário da Vila',
        opensDay: 'Seg. a sex.',
        hourInit: '08:00',
        hourFinal: '18:00',
        linkPhoto: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
        status: 'APROVADO',
        address: {
            street: 'Rua das Palmeiras',
            number: '245',
            district: 'Vila Mariana',
            city: 'São Paulo',
            postCode: '04101-001',
            latitude: -23.587414,
            longitude: -46.635349,
        },
    },
    {
        id: 2,
        namePoint: 'Recicla Pet',
        opensDay: 'Ter. a sáb.',
        hourInit: '09:00',
        hourFinal: '17:00',
        linkPhoto: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80',
        status: 'APROVADO',
        address: {
            street: 'Av. Brasil',
            number: '1830',
            district: 'Centro',
            city: 'Campinas',
            postCode: '13013-000',
            latitude: -22.90556,
            longitude: -47.06103,
        },
    },
    {
        id: 3,
        namePoint: 'Casa de Apoio Animal',
        opensDay: 'Todos os dias',
        hourInit: '10:00',
        hourFinal: '16:00',
        linkPhoto: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80',
        status: 'APROVADO',
        address: {
            street: 'Rua Aurora',
            number: '67',
            district: 'Jardim América',
            city: 'Sorocaba',
            postCode: '18045-000',
            latitude: -23.506653,
            longitude: -47.455806,
        },
    },
];

function normalizePoint(point: RawCollectionPoint, index: number): CollectionPoint {
    const address = point?.address ?? {};

    return {
        id: Number(point?.idPc ?? point?.id ?? index),
        namePoint: point?.namePoint ?? 'Ponto de coleta',
        opensDay: point?.opensDay ?? 'Horário não informado',
        hourInit: point?.hourInit ?? null,
        hourFinal: point?.hourFinal ?? null,
        linkPhoto: point?.linkPhoto ?? null,
        status: point?.status ?? 'APROVADO',
        rejectionReason: point?.rejectionReason ?? null,
        address: {
            street: address?.street ?? null,
            number: address?.number ?? null,
            complement: address?.complement ?? null,
            district: address?.district ?? null,
            city: address?.city ?? null,
            postCode: address?.postCode ?? null,
            latitude: typeof address?.latitude === 'number' ? address.latitude : null,
            longitude: typeof address?.longitude === 'number' ? address.longitude : null,
        },
    };
}

function formatAddress(address: PointAddress) {
    const street = [address.street, address.number].filter(Boolean).join(', ');
    const neighborhood = [address.district, address.city].filter(Boolean).join(' - ');
    const extras = [street, address.complement, neighborhood, address.postCode]
        .filter(Boolean)
        .join(' • ');

    return extras || 'Endereço não informado';
}

function parseCoordinate(value: number | null | undefined) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return null;
    }

    return value;
}

function haversineDistanceKm(
    origin: SearchPosition,
    destination: { latitude?: number | null; longitude?: number | null },
) {
    const destinationLatitude = parseCoordinate(destination.latitude);
    const destinationLongitude = parseCoordinate(destination.longitude);

    if (destinationLatitude === null || destinationLongitude === null) {
        return null;
    }

    const toRadians = (value: number) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const deltaLatitude = toRadians(destinationLatitude - origin.latitude);
    const deltaLongitude = toRadians(destinationLongitude - origin.longitude);
    const lat1 = toRadians(origin.latitude);
    const lat2 = toRadians(destinationLatitude);

    const a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

function formatDistance(distanceKm: number | null) {
    if (distanceKm === null) {
        return 'distância estimada';
    }

    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }

    return `${distanceKm.toFixed(1)} km`;
}

async function geocodeAddress(query: string) {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('q', query);

    const response = await fetch(url.toString(), {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Falha ao geocodificar o endereço');
    }

    const result = await response.json();

    if (!Array.isArray(result) || result.length === 0) {
        return null;
    }

    const item = result[0];
    const latitude = Number(item.lat);
    const longitude = Number(item.lon);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return null;
    }

    return {
        label: item.display_name || query,
        latitude,
        longitude,
    } as SearchPosition;
}

function scorePoint(point: CollectionPoint, query: string) {
    const normalizedQuery = query.toLowerCase();
    const searchableParts = [
        point.namePoint,
        point.address.street,
        point.address.district,
        point.address.city,
        point.address.postCode,
    ]
        .filter(Boolean)
        .map((part) => String(part).toLowerCase());

    return searchableParts.reduce((score, part) => {
        if (part === normalizedQuery) {
            return score + 4;
        }

        if (part.includes(normalizedQuery)) {
            return score + 2;
        }

        const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

        if (tokens.every((token) => part.includes(token))) {
            return score + 1;
        }

        return score;
    }, 0);
}

function buildMapUrl(point: CollectionPoint | null) {
    const latitude = parseCoordinate(point?.address.latitude);
    const longitude = parseCoordinate(point?.address.longitude);

    if (latitude === null || longitude === null) {
        return '';
    }

    return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
}

export default function CollectionPointsPage() {
    const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
    const [isLoadingPoints, setIsLoadingPoints] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchPosition, setSearchPosition] = useState<SearchPosition | null>(null);
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState('Digite seu endereço para encontrar o ponto mais próximo.');

    useEffect(() => {
        let active = true;

        async function loadPoints() {
            setIsLoadingPoints(true);

            try {
                const response = await fetch(`${API_BASE_URL}/collection-point/approved`, {
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('Falha ao carregar pontos de coleta');
                }

                const data = await response.json();
                const normalizedPoints = Array.isArray(data) ? data.map(normalizePoint) : [];

                if (!active) {
                    return;
                }

                const pointsToUse = normalizedPoints.length > 0 ? normalizedPoints : fallbackPoints;
                setCollectionPoints(pointsToUse);
                setSelectedPointId((current) => current ?? pointsToUse[0]?.id ?? null);

                if (normalizedPoints.length === 0) {
                    setStatusMessage('A API ainda não retornou pontos aprovados. Mostrando exemplos de navegação para você testar a experiência.');
                }
            } catch {
                if (!active) {
                    return;
                }

                setCollectionPoints(fallbackPoints);
                setSelectedPointId((current) => current ?? fallbackPoints[0]?.id ?? null);
                setStatusMessage('Não foi possível acessar a API agora. A tela está usando pontos de demonstração para manter a busca funcionando.');
            } finally {
                if (active) {
                    setIsLoadingPoints(false);
                }
            }
        }

        loadPoints();

        return () => {
            active = false;
        };
    }, []);

    const nearestPoints = useMemo(() => {
        return collectionPoints
            .map((point) => ({
                point,
                distanceKm: searchPosition ? haversineDistanceKm(searchPosition, point.address) : null,
            }))
            .sort((left, right) => {
                if (left.distanceKm === null && right.distanceKm === null) {
                    return 0;
                }

                if (left.distanceKm === null) {
                    return 1;
                }

                if (right.distanceKm === null) {
                    return -1;
                }

                return left.distanceKm - right.distanceKm;
            })
            .slice(0, 3);
    }, [collectionPoints, searchPosition]);

    const selectedPoint = useMemo(
        () => collectionPoints.find((point) => point.id === selectedPointId) ?? nearestPoints[0]?.point ?? collectionPoints[0] ?? null,
        [collectionPoints, nearestPoints, selectedPointId],
    );

    const mapUrl = buildMapUrl(selectedPoint);
    const totalPoints = collectionPoints.length;

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const query = searchValue.trim();

        if (!query) {
            setStatusMessage('Digite um endereço completo, bairro ou cidade para começar.');
            return;
        }

        setIsSearching(true);

        try {
            const geocodedPosition = await geocodeAddress(query);

            if (geocodedPosition) {
                setSearchPosition(geocodedPosition);

                const nearestWithCoordinates = collectionPoints
                    .map((point) => ({
                        point,
                        distanceKm: haversineDistanceKm(geocodedPosition, point.address),
                    }))
                    .filter((item) => item.distanceKm !== null)
                    .sort((left, right) => (left.distanceKm ?? 0) - (right.distanceKm ?? 0));

                if (nearestWithCoordinates[0]) {
                    setSelectedPointId(nearestWithCoordinates[0].point.id);
                }

                setStatusMessage(`Localizamos ${geocodedPosition.label}. Aqui estão os pontos mais próximos para você comparar.`);
                return;
            }

            const bestTextMatch = [...collectionPoints]
                .map((point) => ({ point, score: scorePoint(point, query) }))
                .sort((left, right) => right.score - left.score)[0]?.point;

            if (bestTextMatch) {
                setSelectedPointId(bestTextMatch.id);
                setStatusMessage('Não encontramos o endereço exato, então mostramos o ponto com a melhor correspondência textual.');
            } else {
                setStatusMessage('Nenhum ponto foi encontrado para essa pesquisa. Tente informar rua, bairro ou cidade.');
            }
        } catch {
            const bestTextMatch = [...collectionPoints]
                .map((point) => ({ point, score: scorePoint(point, query) }))
                .sort((left, right) => right.score - left.score)[0]?.point;

            if (bestTextMatch) {
                setSelectedPointId(bestTextMatch.id);
                setStatusMessage('A busca por endereço falhou, mas encontramos uma correspondência segura com base no texto digitado.');
            } else {
                setStatusMessage('Não foi possível resolver o endereço neste momento. Tente novamente em instantes.');
            }
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <main className={styles.page}>
            <section className={styles.topSection}>
                <h1 className={styles.title}>Encontre o ponto de coleta mais perto do endereço</h1>

                <div className={styles.introCard}>
                    <ol>
                        <li>Digite seu endereço (rua, número, bairro ou cidade) e clique em "Encontrar ponto".</li>
                        <li>O mapa exibirá o ponto mais próximo; confira as sugestões pela foto, endereço e horário de atendimento.</li>
                        <li>Clique em um ponto para selecioná-lo e abrir a rota/direções até o local.</li>
                    </ol>
                </div>
            </section>
            <section className={styles.searchSection}>
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <label className={styles.searchField}>
                        <Search size={18} />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Ex.: Rua das Flores, Centro, São Paulo"
                            aria-label="Digite seu endereço"
                        />
                    </label>

                    <button type="submit" className={styles.searchButton} disabled={isSearching || isLoadingPoints}>
                        {isSearching ? 'Buscando...' : 'Encontrar ponto'}
                    </button>
                </form>

                <p className={styles.statusMessage}>{statusMessage}</p>
            </section>

            <section className={styles.mapSection}>
                <div className={styles.mapPanel}>
                    <div className={styles.mapHeader}>
                        <MapPinned size={18} />
                        <span>Ponto mais próximo no mapa</span>
                    </div>

                    {selectedPoint && mapUrl ? (
                        <iframe
                            title={`Mapa do ponto ${selectedPoint.namePoint}`}
                            src={mapUrl}
                            className={styles.mapFrame}
                            loading="lazy"
                        />
                    ) : (
                        <div className={styles.emptyMap}>
                            <LocateFixed size={30} />
                            <p>Digite um endereço para visualizar o mapa do ponto mais próximo.</p>
                        </div>
                    )}
                </div>

                <div className={styles.nearbySection}>
                    <div className={styles.nearbyHeader}>
                        <h2>Pontos próximos</h2>
                        <span>Até 3 sugestões ordenadas da mais próxima para a mais distante</span>
                    </div>

                    <div className={styles.nearbyList}>
                        {isLoadingPoints ? (
                            <div className={styles.loadingState}>Carregando pontos...</div>
                        ) : (
                            nearestPoints.map(({ point, distanceKm }) => {
                                const isActive = point.id === selectedPoint?.id;

                                return (
                                    <button
                                        key={point.id}
                                        type="button"
                                        className={`${styles.nearbyCard} ${isActive ? styles.nearbyCardActive : ''}`}
                                        onClick={() => setSelectedPointId(point.id)}
                                    >
                                        <div className={styles.nearbyPhotoWrap}>
                                            {point.linkPhoto ? (
                                                <Image
                                                    src={point.linkPhoto}
                                                    alt={point.namePoint}
                                                    fill
                                                    sizes="120px"
                                                    className={styles.nearbyPhoto}
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className={styles.nearbyPhotoFallback}>
                                                    <LocateFixed size={22} />
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.nearbyInfo}>
                                            <div className={styles.nearbyTopRow}>
                                                <h3>{point.namePoint}</h3>
                                                <span>{formatDistance(distanceKm)}</span>
                                            </div>

                                            <p>{formatAddress(point.address)}</p>

                                            <div className={styles.nearbyMeta}>
                                                <span>
                                                    <Clock3 size={14} />
                                                    {point.opensDay ?? 'Horário não informado'}
                                                </span>
                                                <span>{point.hourInit && point.hourFinal ? `${point.hourInit} às ${point.hourFinal}` : 'Horário flexível'}</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.bottomCards}>
                <article className={styles.bottomCard}>
                    <span className={styles.bottomLabel}>Total de pontos</span>
                    <strong>{String(totalPoints).padStart(2, '0')}</strong>
                    <p>Pontos de coleta disponíveis para consulta agora.</p>
                </article>

                <article className={styles.bottomCard}>
                    <span className={styles.bottomLabel}>Como doar</span>
                    <strong>Passo a passo simples</strong>
                    <p>Separe as tampinhas, encontre o ponto mais próximo e acompanhe a rota até o local.</p>
                    <Link href="/user/how-donate" className={styles.bottomLink}>
                        Ver como doar <ArrowRight size={16} />
                    </Link>
                </article>

                <article className={styles.bottomCard}>
                    <span className={styles.bottomLabel}>Cadastre-se</span>
                    <strong>Torne-se um ponto de coleta</strong>
                    <p>Cadastre seu estabelecimento e ajude mais pessoas a encontrar um local de apoio perto de casa.</p>
                    <Link href="/cadastro-ponto-coleta" className={styles.bottomLink}>
                        Quero participar <ArrowRight size={16} />
                    </Link>
                </article>
            </section>
        </main>
    );
}