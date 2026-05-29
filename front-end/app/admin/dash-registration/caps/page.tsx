'use client';

import { useState } from 'react';
import capsService from '@/services/capsService';

export default function CapsPage() {

  const [kg, setKg] = useState(0);
  const [data, setData] = useState('');

  const handleSubmit = async () => {
    await capsService.create({
      quantidadeKg: kg,
      data
    });

    alert('Tampinhas cadastradas!');
  };

  return (
    <div className="adminContainer">

      <h1>Registro de Tampinhas</h1>

      <div className="adminformContainer">
        <input
          type="number"
          placeholder="Quantidade (kg)"
          onChange={(e) => setKg(Number(e.target.value))}
        />

        <input
          type="date"
          onChange={(e) => setData(e.target.value)}
        />

        <button onClick={handleSubmit}>Salvar</button>
      </div>

    </div>
  );
}