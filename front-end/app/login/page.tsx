'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../styles/login.module.css'

const motivationalPhrases = [
    'Cada novo dia é uma chance de recomeçar.',
    'O progresso de hoje constrói a conquista de amanhã.',
    'Pequenos passos também levam a grandes resultados.',
    'A constância vence a pressa.',
    'O melhor momento para começar é agora.',
]

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [activeTab, setActiveTab] = useState<'login' | 'reset'>('login')
    const [phraseIndex] = useState(() => Math.floor(Math.random() * motivationalPhrases.length))
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // redireciona para a interface admin (rota /admin)
        router.push('/admin')
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginShell}>
                <section className={styles.welcomePanel} aria-label="Mensagem de boas-vindas">
                    <h1 className={styles.welcomeTitle}>Bem Vindo, estamos felizes em ter você por aqui!</h1>
                    <p className={styles.welcomePhrase}>{motivationalPhrases[phraseIndex]}</p>
                </section>

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
        </div>
    )
}

