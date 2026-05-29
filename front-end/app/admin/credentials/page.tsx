'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { MdAddCircleOutline, MdDelete, MdEdit, MdRefresh } from 'react-icons/md'
import { authApi } from '@/services/api'
import styles from '../../../styles/admin-credentials.module.css'

interface AdminCredential {
    idAdmin: number
    username: string
    emailUser: string
    createdAt?: string
    updatedAt?: string
}

interface AdminFormState {
    username: string
    emailUser: string
    senha: string
}

const emptyForm: AdminFormState = {
    username: '',
    emailUser: '',
    senha: '',
}

export default function CredentialsAdminPage() {
    const [admins, setAdmins] = useState<AdminCredential[]>([])
    const [form, setForm] = useState<AdminFormState>(emptyForm)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const loadAdmins = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await authApi.get('/credentials')
            setAdmins(response.data)
        } catch {
            setError('Não foi possível carregar as credenciais do banco de dados.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void Promise.resolve().then(() => loadAdmins())
    }, [])

    const resetForm = () => {
        setForm(emptyForm)
        setEditingId(null)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSaving(true)
        setMessage('')
        setError('')

        try {
            if (editingId) {
                const payload: Record<string, string> = {
                    username: form.username,
                    emailUser: form.emailUser,
                }

                if (form.senha.trim()) {
                    payload.senha = form.senha
                }

                await authApi.put(`/credentials/${editingId}`, payload)
                setMessage('Credencial atualizada com sucesso.')
            } else {
                await authApi.post('/credentials', {
                    username: form.username,
                    emailUser: form.emailUser,
                    senha: form.senha,
                })
                setMessage('Credencial criada com sucesso.')
            }

            resetForm()
            await loadAdmins()
        } catch (requestError: unknown) {
            const fallback = editingId
                ? 'Não foi possível atualizar a credencial.'
                : 'Não foi possível criar a credencial.'

            if (requestError && typeof requestError === 'object' && 'response' in requestError) {
                const responseError = requestError as { response?: { data?: { message?: string } } }
                setError(responseError.response?.data?.message || fallback)
            } else {
                setError(fallback)
            }
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (admin: AdminCredential) => {
        setEditingId(admin.idAdmin)
        setForm({
            username: admin.username,
            emailUser: admin.emailUser,
            senha: '',
        })
        setMessage('')
        setError('')
    }

    const handleDelete = async (idAdmin: number) => {
        const confirmed = window.confirm('Deseja remover esta credencial?')

        if (!confirmed) {
            return
        }

        setError('')
        setMessage('')

        try {
            await authApi.delete(`/credentials/${idAdmin}`)
            setMessage('Credencial removida com sucesso.')
            await loadAdmins()
        } catch (requestError: unknown) {
            const fallback = 'Não foi possível remover a credencial.'

            if (requestError && typeof requestError === 'object' && 'response' in requestError) {
                const responseError = requestError as { response?: { data?: { message?: string } } }
                setError(responseError.response?.data?.message || fallback)
            } else {
                setError(fallback)
            }
        }
    }

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div>
                    <h2 className={styles.heroTitle}>Gerenciamento de credenciais</h2>
                    <p className={styles.heroDescription}>
                        Cadastre, edite e remova administradores diretamente na tabela AdminUser.
                    </p>
                </div>

                <div className={styles.heroActions}>
                    <button type="button" className={styles.secondaryButton} onClick={() => void loadAdmins()}>
                        <MdRefresh size={18} />
                        Atualizar lista
                    </button>
                    <Link href="/admin" className={styles.secondaryButton}>
                        Voltar ao menu principal
                    </Link>
                </div>
            </section>

            {(message || error) && (
                <div className={message ? styles.successBanner : styles.errorBanner} role="status">
                    {message || error}
                </div>
            )}

            <div className={styles.grid}>
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <p className={styles.cardKicker}>{editingId ? 'Editando' : 'Novo cadastro'}</p>
                            <h3 className={styles.cardTitle}>{editingId ? 'Atualizar credencial' : 'Criar credencial'}</h3>
                        </div>

                        {editingId && (
                            <button type="button" className={styles.linkButton} onClick={resetForm}>
                                Cancelar edição
                            </button>
                        )}
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.field}>
                            <span>Usuário</span>
                            <input
                                className={styles.input}
                                value={form.username}
                                onChange={(event) => setForm({ ...form, username: event.target.value })}
                                required
                                placeholder="Nome de usuário"
                            />
                        </label>

                        <label className={styles.field}>
                            <span>E-mail</span>
                            <input
                                className={styles.input}
                                type="email"
                                value={form.emailUser}
                                onChange={(event) => setForm({ ...form, emailUser: event.target.value })}
                                required
                                placeholder="email@exemplo.com"
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Senha {editingId ? '(deixe em branco para manter a atual)' : ''}</span>
                            <input
                                className={styles.input}
                                type="password"
                                value={form.senha}
                                onChange={(event) => setForm({ ...form, senha: event.target.value })}
                                required={!editingId}
                                placeholder="Senha de acesso"
                            />
                        </label>

                        <button type="submit" className={styles.primaryButton} disabled={saving}>
                            <MdAddCircleOutline size={18} />
                            {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar credencial'}
                        </button>
                    </form>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <p className={styles.cardKicker}>Tabela AdminUser</p>
                            <h3 className={styles.cardTitle}>Credenciais cadastradas</h3>
                        </div>
                        <span className={styles.countBadge}>{admins.length} registros</span>
                    </div>

                    {loading ? (
                        <div className={styles.emptyState}>Carregando credenciais...</div>
                    ) : admins.length === 0 ? (
                        <div className={styles.emptyState}>Nenhuma credencial encontrada no banco de dados.</div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Usuário</th>
                                        <th>E-mail</th>
                                        <th>Criado em</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((admin) => (
                                        <tr key={admin.idAdmin}>
                                            <td>{admin.username}</td>
                                            <td>{admin.emailUser}</td>
                                            <td>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button type="button" className={styles.iconButton} onClick={() => handleEdit(admin)}>
                                                        <MdEdit size={16} />
                                                        Editar
                                                    </button>
                                                    <button type="button" className={styles.iconButtonDanger} onClick={() => handleDelete(admin.idAdmin)}>
                                                        <MdDelete size={16} />
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}