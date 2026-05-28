'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import api from '@/services/api'
import { API_BASE_URL } from '@/services/apiBase'
import { useAuth } from '@/context/AuthContext'
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
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMessage('')
        setLoading(true)

        try {
            const response = await api.post('/credentials/login', {
                username,
                senha: password,
            })

            const admin = response.data?.admin
            const role = admin?.role || 'admin'

            if (typeof window !== 'undefined' && admin) {
                localStorage.setItem('admin', JSON.stringify(admin))
            }

            login(role)
            router.push('/admin')
        } catch (error: unknown) {
            let message = 'Não foi possível fazer login.'

            if (error instanceof AxiosError) {
                const status = error.response?.status
                const backendMessage = error.response?.data?.message

                if (status === 404) {
                    message = backendMessage || 'Usuário não encontrado.'
                } else if (status === 401) {
                    message = backendMessage || 'Senha incorreta para o usuário informado.'
                } else if (status === 400) {
                    message = backendMessage || 'Informe usuário e senha para continuar.'
                } else if (status === 500) {
                    message = backendMessage || 'Erro interno na API de autenticação.'
                } else if (!error.response) {
                    message = `Não foi possível conectar à API de autenticação em ${API_BASE_URL}.`
                } else {
                    message = backendMessage || `Falha ao autenticar. Status HTTP ${status ?? 'desconhecido'}.`
                }
            }
            setErrorMessage(message)
        } finally {
            setLoading(false)
        }
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

                    {errorMessage && (
                        <p className={styles.loginFeedback} role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                </form>
            </div>
        </div>
    )
}

