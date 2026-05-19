'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../styles/login.module.css'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // redireciona para a interface admin (rota /admin)
        router.push('/admin')
    }

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h1 className={styles.loginTitle}>Login</h1>

                <label className={styles.loginLabel}>
                    <span className={styles.loginLabelText}>Usuário</span>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={styles.loginInput}
                        placeholder="Digite seu usuário"
                    />
                </label>

                <label className={styles.loginLabel}>
                    <span className={styles.loginLabelText}>Senha</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.loginInput}
                        placeholder="Digite sua senha"
                    />
                </label>

                <button type="submit" className={styles.loginButton}>
                    Entrar
                </button>
            </form>
        </div>
    )
}

