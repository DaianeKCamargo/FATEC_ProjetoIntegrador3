"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from '../../../styles/login.module.css'

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [activeTab, setActiveTab] = useState<'login' | 'reset'>('reset')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // estrutura pronta; integração com back-end entra depois
    }

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.toggle} role="tablist" aria-label="Login or Recover password">
                    <button
                        type="button"
                        className={activeTab === 'login' ? styles.toggleActive : styles.toggleButton}
                        onClick={() => {
                            setActiveTab('login')
                            router.push('/login')
                        }}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={activeTab === 'reset' ? styles.toggleActive : styles.toggleButton}
                        onClick={() => {
                            setActiveTab('reset')
                            router.push('/login/reset-pass')
                        }}
                    >
                        Recuperar Senha
                    </button>
                </div>

                <h1 className={styles.loginTitle}>Recuperar Senha</h1>

                <p className={styles.loginActions} style={{ marginTop: 0 }}>
                    Informe o e-mail cadastrado para iniciar a recuperação.
                </p>

                <label className={styles.loginLabel}>
                    <span className={styles.loginLabelText}>E-mail</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.loginInput}
                        placeholder="Digite seu e-mail"
                        autoComplete="email"
                    />
                </label>

                <button type="submit" className={styles.loginButton}>
                    Enviar link de recuperação
                </button>

            </form>
        </div>
    )
}