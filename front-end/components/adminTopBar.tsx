'use client'

import { useRouter } from 'next/navigation'
import { MdAdminPanelSettings, MdLogout } from 'react-icons/md'
import { useAuth } from '@/context/AuthContext'
import styles from '../styles/admin-shell.module.css'

export default function AdminTopBar() {
    const router = useRouter()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout({ redirect: false })
        router.replace('/login')
    }

    return (
        <header className={styles.topBar}>
            <div className={styles.brandBlock}>
                <div className={styles.brandIcon}>
                    <MdAdminPanelSettings size={24} />
                </div>
                <div>
                    <p className={styles.kicker}>Área restrita</p>
                    <h1 className={styles.title}>Painel Administrativo</h1>
                </div>
            </div>

            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                <MdLogout size={18} />
                Sair
            </button>
        </header>
    )
}