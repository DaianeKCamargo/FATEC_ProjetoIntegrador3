'use client';

import { useEffect, useState } from 'react';
import capsService from '@/services/capsService';
import animalsService from '@/services/animalsService';

export default function DeletePage() {

  const [caps, setCaps] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setCaps(await capsService.getAll());
      setAnimals(await animalsService.getAll());
    };

    fetchData();
  }, []);

  const handleDeleteCap = async (id: number) => {
    await capsService.remove(String(id));
    location.reload();
  };

  const handleDeleteAnimal = async (id: number) => {
    await animalsService.remove(String(id));
    location.reload();
  };

  return (
    <div className="adminContainer">

      <h1>Excluir Registros</h1>

      <div className="adminsplitContainer">

        {/* CAPS */}
        <div>
          <h2>Tampinhas</h2>

          {caps.map((item) => (
            <div key={item.id} className="adminrow">
              {item.quantidadeKg} kg
              <button onClick={() => handleDeleteCap(item.id)}>
                Excluir
              </button>
            </div>
          ))}

        </div>

        {/* ANIMAIS */}
        <div>
          <h2>Animais</h2>

          {animals.map((item) => (
            <div key={item.id} className="adminrow">
              {item.tipoAnimal}
              <button onClick={() => handleDeleteAnimal(item.id)}>
                Excluir
              </button>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}