'use client';

import { useEffect, useState } from 'react';
import capsService from '@/services/capsService';
import animalsService from '@/services/animalsService';
import '@/styles/dashboard.css';

export default function EditPage() {

  const [caps, setCaps] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const capsData = await capsService.getAll();
      const animalsData = await animalsService.getAll();

      setCaps(capsData);
      setAnimals(animalsData);
    };

    fetchData();
  }, []);

  return (
    <div className="adminContainer">

      <h1>Editar Registros</h1>

      <div className="adminsplitContainer">

        {/* CAPS */}
        <div>
          <h2>Tampinhas</h2>

          {caps.map((item) => (
            <div key={item.id} className="adminrow">
              {item.quantidadeKg} kg - {new Date(item.data).toLocaleDateString()}
            </div>
          ))}

        </div>

        {/* ANIMALS */}
        <div>
          <h2>Animais</h2>

          {animals.map((item) => (
            <div key={item.id} className="adminrow">
              {item.tipoAnimal} - {item.quantidade}
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}