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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-6">Entrar</h1>

                <label className="block mb-4">
                    <span className="text-sm">Usuário</span>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full border rounded px-3 py-2"
                        placeholder="Digite seu usuário"
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-sm">Senha</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full border rounded px-3 py-2"
                        placeholder="Digite sua senha"
                    />
                </label>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Entrar como Admin
                </button>
            </form>
        </div>
    )
}

