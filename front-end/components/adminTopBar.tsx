'use client'

import { usePathname, useRouter } from 'next/navigation'
import { MdAdminPanelSettings, MdArrowBack, MdLogout } from 'react-icons/md'
import { useAuth } from '@/context/AuthContext'
import styles from '../styles/admin-shell.module.css'

export default function AdminTopBar() {
    const router = useRouter()
    const pathname = usePathname()
    const { logout } = useAuth()
    const isAdminHome = pathname === '/admin' || pathname === '/admin/'

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
                    <p className={styles.kicker}>Área restrita do Administrador</p>
                </div>
            </div>


            <div className={styles.topActions}>
                {!isAdminHome && (
                    <button type="button" className={styles.backButton} onClick={() => router.back()}>
                        <MdArrowBack size={18} />
                        Voltar
                    </button>
                )}

                <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                    <MdLogout size={18} />
                    Sair
                </button>
            </div>
        </header>
    )
}
