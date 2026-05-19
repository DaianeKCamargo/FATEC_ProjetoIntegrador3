'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h1 className="login-title">Entrar</h1>

                <label className="login-label">
                    <span className="login-label-text">Usuário</span>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="login-input"
                        placeholder="Digite seu usuário"
                    />
                </label>

                <label className="login-label">
                    <span className="login-label-text">Senha</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                        placeholder="Digite sua senha"
                    />
                </label>

                <button type="submit" className="login-button">
                    Entrar como Admin
                </button>
            </form>
        </div>
    )
}

