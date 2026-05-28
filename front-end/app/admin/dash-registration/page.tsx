'use client';

import Link from 'next/link';
import { MdPets, MdInventory } from 'react-icons/md';
import styles from '@/styles/admin-dashboard.module.css';

export default function DashRegistration() {
  return (
    <div className={styles.container}>

      <h1 className={styles.title}>
        Painel de Registros
      </h1>

      <p className={styles.subtitle}>
        Selecione uma opção
      </p>

      <div className={styles.menuGrid}>

        {/* TAMPNHAS */}
        <Link href="/admin/dash-registration/caps" className={styles.menuCard}>
          <div className={styles.icon}>
            <MdInventory size={40} />
          </div>
          <h2>Registro de Tampinhas</h2>
          <p>Cadastro de quantidade em kg</p>
        </Link>

        {/* ANIMAIS */}
        <Link href="/admin/dash-registration/animals" className={styles.menuCard}>
          <div className={styles.icon}>
            <MdPets size={40} />
          </div>
          <h2>Registro de Animais</h2>
          <p>Cadastrar gatos e cães</p>
        </Link>

        {/* REGISTROS (EDITAR + DELETAR) */}
        <Link href="/admin/dash-registration/records" className={styles.menuCard}>
          <div className={styles.icon}>
            <MdInventory size={40} />
          </div>
          <h2>Registros</h2>
          <p>Editar e excluir dados existentes</p>
        </Link>

      </div>

    </div>
  );
}