'use client';

import { useRouter } from 'next/navigation';
import { MdPets, MdInventory, MdArrowBack } from 'react-icons/md';
import styles from '@/styles/admin-dashboard.module.css';

export default function DashRegistration() {
  const router = useRouter();

  return (
    <div className={styles.container}>

      {/* ✅ BOTÃO VOLTAR */}
      <button
        className={styles.backButton}
        onClick={() => router.push('/admin')}
      >
        <MdArrowBack size={20} />
        Voltar
      </button>

      <div className={styles.content}>
        <h1 className={styles.title}>Painel de Registros</h1>
        <p className={styles.subtitle}>Selecione uma opção</p>

        <div className={styles.cards}>

          {/* TAMPNHAS */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <MdInventory size={32} />
            </div>

            <div className={styles.cardContent}>
              <h2>Registro de Tampinhas</h2>
              <p>Cadastro de quantidade em kg</p>
            </div>

            <button
              className={styles.button}
              onClick={() => router.push('/admin/dash-registration/caps')}
            >
              Acessar
            </button>
          </div>

          {/* ANIMAIS */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <MdPets size={32} />
            </div>

            <div className={styles.cardContent}>
              <h2>Registro de Animais</h2>
              <p>Cadastrar gatos e cães</p>
            </div>

            <button
              className={styles.button}
              onClick={() => router.push('/admin/dash-registration/animals')}
            >
              Acessar
            </button>
          </div>

          {/* REGISTROS */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <MdInventory size={32} />
            </div>

            <div className={styles.cardContent}>
              <h2>Registros</h2>
              <p>Editar e excluir dados existentes</p>
            </div>

            <button
              className={styles.button}
              onClick={() => router.push('/admin/dash-registration/records')}
            >
              Acessar
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}