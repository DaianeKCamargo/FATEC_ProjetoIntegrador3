'use client';

import Link from 'next/link';
import '@/styles/dashboard.css';

export default function DashRegistration() {

  return (
    <div className="adminContainer">

      <h1>Painel de Registros</h1>
      <p className="adminsubtitle">Selecione uma opção</p>

      <div className="adminmenuGrid">

        <Link href="/admin/dash-registration/caps" className="adminmenuCard">
          <h2>Registro de Tampinhas</h2>
          <p>Cadastro de quantidade em kg</p>
        </Link>

        <Link href="/admin/dash-registration/animals" className="adminmenuCard">
          <h2>Registro de Animais</h2>
          <p>Cadastrar gatos e cães</p>
        </Link>

        <Link href="/admin/dash-registration/edit" className="adminmenuCard">
          <h2>Editar Registros</h2>
          <p>Alterar dados existentes</p>
        </Link>

        <Link href="/admin/dash-registration/delete" className="adminmenuCard">
          <h2>Excluir Registros</h2>
          <p>Remover dados existentes</p>
        </Link>

      </div>

    </div>
  );
}