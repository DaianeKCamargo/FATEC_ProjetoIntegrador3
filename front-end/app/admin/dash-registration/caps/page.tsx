'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdRecycling } from 'react-icons/md';
import styles from '@/styles/caps-registration.module.css';
import capsService from '@/services/capsService';

export default function CapsPage() {
  const router = useRouter();

  const [data, setData] = useState('');
  const [kg, setKg] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!data || !kg) {
      setError('Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);

      await capsService.create({
        data,
        quantidadeKg: Number(kg),
      });

      setMessage('Registro salvo com sucesso!');
      setData('');
      setKg('');
    } catch (err) {
      setError('Erro ao salvar registro.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.topBar}>
        <button
          className={styles.backButton}
          onClick={() => router.push('/admin/dash-registration')}
        >
          <MdArrowBack size={20} />
          Voltar
        </button>
      </div>

      <div className={styles.adminContent}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <MdRecycling size={34} />
          </div>

          <div>
            <h1 className={styles.title}>Registro de Tampinhas</h1>
            <p className={styles.subtitle}>
              Cadastre a quantidade de tampinhas arrecadadas
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Quantidade (kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={kg}
                onChange={(e) =>
                  setKg(
                    e.target.value === ''
                      ? ''
                      : Number(e.target.value)
                  )
                }
              />
            </div>
          </div>

          {message && (
            <p className={styles.success}>{message}</p>
          )}

          {error && (
            <p className={styles.error}>{error}</p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => router.push('/admin/dash-registration')}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={styles.primary}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}