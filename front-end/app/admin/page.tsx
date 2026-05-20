'use client'

import { useRouter } from 'next/navigation'
import { MdPlace, MdArticle, MdSecurity, MdPets } from 'react-icons/md'
import styles from '../../styles/admin.module.css'

interface MenuItem {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    route: string
}

export default function AdminPage() {
    const router = useRouter()

    const menuItems: MenuItem[] = [
        {
            id: 'collection-point',
            title: 'Ponto de Coleta',
            description: 'Gerenciar pontos de coleta de resíduos',
            icon: <MdPlace size={40} />,
            route: '/admin/colletion-point'
        },
        {
            id: 'caps-animals',
            title: 'Registro de Tampinhas e Animais Castrados',
            description: 'Registrar tampinhas e animais que foram castrados',
            icon: <MdPets size={40} />,
            route: '/admin/dash-registration'
        },
        {
            id: 'news',
            title: 'Registro de Notícias',
            description: 'Criar e gerenciar notícias do sistema',
            icon: <MdArticle size={40} />,
            route: '/admin/news-registry'
        },
        {
            id: 'credentials',
            title: 'Credenciais',
            description: 'Gerenciar credenciais e acesso',
            icon: <MdSecurity size={40} />,
            route: '/admin/credentials'
        }
    ]

    const handleCardClick = (route: string) => {
        router.push(route)
    }

    return (
        <div className={styles.adminContainer}>
            <div className={styles.adminContent}>
                <h1 className={styles.adminTitle}>Painel de Administração</h1>
                <p className={styles.adminSubtitle}>Selecione uma opção para gerenciar o sistema</p>

                <div className={styles.cardsGrid}>
                    {menuItems.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.cardIcon}>{item.icon}</div>
                            <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>{item.title}</h2>
                                <p className={styles.cardDescription}>{item.description}</p>
                            </div>
                            <button
                                className={styles.cardButton}
                                onClick={() => handleCardClick(item.route)}
                            >
                                Acessar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
