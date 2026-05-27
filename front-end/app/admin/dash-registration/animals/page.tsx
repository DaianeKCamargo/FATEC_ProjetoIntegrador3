'use client';

import { useState } from 'react';
import animalsService from '@/services/animalsService';
import '@/styles/dashboard.css';

export default function AnimalsPage() {

  const [tipo, setTipo] = useState('gato');
  const [quantidade, setQuantidade] = useState(0);
  const [data, setData] = useState('');

  const handleSubmit = async () => {
    await animalsService.create({
      tipoAnimal: tipo,
      quantidade,
      data
    });

    alert('Animal cadastrado!');
  };

  return (
    <div className="adminContainer">

      <h1>Registro de Animais</h1>

      <div className="adminformContainer">

        <select onChange={(e) => setTipo(e.target.value)}>
          <option value="gato">Gato</option>
          <option value="cachorro">Cachorro</option>
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          onChange={(e) => setQuantidade(Number(e.target.value))}
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