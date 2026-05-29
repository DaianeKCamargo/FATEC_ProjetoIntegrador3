'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdPets } from 'react-icons/md';
import styles from '@/styles/animals-registration.module.css';
import animalsService from '@/services/animalsService';

export default function AnimalsRegistrationPage() {
  const router = useRouter();

  const [data, setData] = useState('');
  const [tipoAnimal, setTipoAnimal] = useState<'gato' | 'cachorro'>('gato');
  const [quantidade, setQuantidade] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!data || !quantidade) {
      setError('Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);

      await animalsService.create({
        data,
        tipoAnimal,
        quantidade: Number(quantidade),
      });

      setMessage('Registro salvo com sucesso!');
      setData('');
      setQuantidade('');

    } catch (err) {
      setError('Erro ao salvar registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>

      {/* BOTÃO VOLTAR */}
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
            <MdPets size={34} />
          </div>

          <div>
            <h1 className={styles.title}>Registro de Animais</h1>
            <p className={styles.subtitle}>
              Cadastre cães e gatos castrados
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.grid}>

            {/* DATA */}
            <div className={styles.formGroup}>
              <label>Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            {/* TIPO */}
            <div className={styles.formGroup}>
              <label>Tipo de Animal</label>
              <select
                value={tipoAnimal}
                onChange={(e) =>
                  setTipoAnimal(e.target.value as 'gato' | 'cachorro')
                }
              >
                <option value="gato">Gato</option>
                <option value="cachorro">Cachorro</option>
              </select>
            </div>

            {/* QUANTIDADE */}
            <div className={styles.formGroupFull}>
              <label>Quantidade</label>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>

          </div>

          {/* FEEDBACK */}
          {message && <p className={styles.success}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}

          {/* BOTÕES */}
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