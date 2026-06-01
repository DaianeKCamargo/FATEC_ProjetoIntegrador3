"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from '../../../styles/login.module.css'

type ResetStep = 'email' | 'token' | 'password'

const resetSteps = [
    {
        key: 'email' as const,
        title: '1. Confirme seu e-mail',
        description: 'Informe o e-mail cadastrado para receber o token de autenticação.',
    },
    {
        key: 'token' as const,
        title: '2. Valide o token',
        description: 'Digite o token enviado para liberar a redefinição de senha.',
    },
    {
        key: 'password' as const,
        title: '3. Crie uma nova senha',
        description: 'Escolha uma senha nova e confirme para concluir o processo.',
    },
]

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [activeTab, setActiveTab] = useState<'login' | 'reset'>('reset')
    const [step, setStep] = useState<ResetStep>('email')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (step === 'email') {
            setMessage('')
            setStep('token')
            return
        }

        if (step === 'token') {
            if (!token.trim()) {
                setMessage('Informe o token recebido por e-mail.')
                return
            }

            setMessage('')
            setStep('password')
            return
        }

        if (password.length < 6) {
            setMessage('A nova senha deve ter pelo menos 6 caracteres.')
            return
        }

        if (password !== confirmPassword) {
            setMessage('A confirmação de senha precisa ser igual à nova senha.')
            return
        }

        setLoading(true)
        setMessage('Senha atualizada com sucesso. Redirecionando para o login...')

        window.setTimeout(() => {
            setLoading(false)
            router.push('/login')
        }, 900)
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginShell}>
                <section className={styles.welcomePanel} aria-label="Instruções para recuperação de senha">
                    <p className={styles.welcomeEyebrow}>Etapas</p>
                    <h1 className={styles.welcomeTitle}>Recuperação de senha em 3 passos</h1>
                    <ul className={styles.resetStepList}>
                        {resetSteps.map((item) => (
                            <li
                                key={item.key}
                                className={step === item.key ? styles.resetStepItemActive : styles.resetStepItem}
                                aria-current={step === item.key ? 'step' : undefined}
                            >
                                <strong>{item.title}</strong>
                                <span>{item.description}</span>
                            </li>
                        ))}
                    </ul>
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

                    <div className={styles.resetHeader}>
                        <p className={styles.resetEyebrow}>Etapa {resetSteps.findIndex((item) => item.key === step) + 1} de 3</p>
                        <h2 className={styles.resetFormTitle}>
                            {step === 'email' && 'Informe seu e-mail'}
                            {step === 'token' && 'Digite o token recebido'}
                            {step === 'password' && 'Defina sua nova senha'}
                        </h2>
                        <p className={styles.resetFormText}>
                            {step === 'email' && 'Comece digitando o e-mail cadastrado para receber o token de autenticação.'}
                            {step === 'token' && 'Agora informe o token enviado para o seu e-mail.'}
                            {step === 'password' && 'Finalize com a nova senha e a confirmação para concluir o acesso.'}
                        </p>
                    </div>

                    {message && (
                        <p className={styles.loginFeedback} role="alert">
                            {message}
                        </p>
                    )}

                    <div className={styles.resetFields}>
                        {step === 'email' && (
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
                        )}

                        {step === 'token' && (
                            <>
                                <label className={styles.loginLabel}>
                                    <span className={styles.loginLabelText}>E-mail</span>
                                    <input
                                        type="email"
                                        value={email}
                                        readOnly
                                        className={styles.loginInput}
                                        placeholder="Digite seu e-mail"
                                        autoComplete="email"
                                    />
                                </label>

                                <label className={styles.loginLabel}>
                                    <span className={styles.loginLabelText}>Token de autenticação</span>
                                    <input
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        required
                                        className={styles.loginInput}
                                        placeholder="Digite o token recebido"
                                        autoComplete="one-time-code"
                                    />
                                </label>
                            </>
                        )}

                        {step === 'password' && (
                            <>
                                <label className={styles.loginLabel}>
                                    <span className={styles.loginLabelText}>Nova senha</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className={styles.loginInput}
                                        placeholder="Digite a nova senha"
                                        autoComplete="new-password"
                                    />
                                </label>

                                <label className={styles.loginLabel}>
                                    <span className={styles.loginLabelText}>Confirmar senha</span>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className={styles.loginInput}
                                        placeholder="Repita a nova senha"
                                        autoComplete="new-password"
                                    />
                                </label>
                            </>
                        )}
                    </div>

                    <div className={styles.resetActions}>
                        {step !== 'email' && (
                            <button
                                type="button"
                                className={styles.resetSecondaryButton}
                                onClick={() => {
                                    setMessage('')
                                    setStep(step === 'password' ? 'token' : 'email')
                                }}
                            >
                                Voltar
                            </button>
                        )}

                        <button type="submit" className={styles.loginButton} disabled={loading}>
                            {step === 'email' && 'Receber token'}
                            {step === 'token' && 'Confirmar token'}
                            {step === 'password' && (loading ? 'Salvando...' : 'Salvar nova senha')}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}