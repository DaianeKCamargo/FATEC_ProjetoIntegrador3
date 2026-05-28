import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminTopBar from '@/components/adminTopBar'
import styles from '../../styles/admin-shell.module.css'

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('tampets_admin_auth')?.value

    if (authCookie !== 'true') {
        redirect('/login')
    }

    return (
        <div className={styles.adminShell}>
            <AdminTopBar />
            <main className={styles.contentArea}>{children}</main>
        </div>
    )
}