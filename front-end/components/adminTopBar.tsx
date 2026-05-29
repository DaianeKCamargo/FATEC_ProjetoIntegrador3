'use client'

import { useRouter } from 'next/navigation'
import { MdAdminPanelSettings, MdLogout } from 'react-icons/md'
import styles from '../styles/admin-shell.module.css'

function clearAuthCookie() {
    document.cookie = 'tampets_admin_auth=; path=/; max-age=0; samesite=lax'
}

export default function AdminTopBar() {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('isLogged')
        localStorage.removeItem('role')
        localStorage.removeItem('admin')
        clearAuthCookie()
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