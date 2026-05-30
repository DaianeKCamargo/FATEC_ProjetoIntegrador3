'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdDelete, MdEdit, MdClose, MdSave } from 'react-icons/md';
import { FaCat, FaDog } from 'react-icons/fa6';

import capsService from '@/services/capsService';
import animalsService from '@/services/animalsService';
import styles from '@/styles/admin-dash-registration-records.module.css';

export default function DashRegistration() {

  const router = useRouter();

  const [caps, setCaps] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'gato' | 'cachorro'>('todos');

  const loadData = async () => {
    try {
      setLoading(true);

      const [capsData, animalsData] = await Promise.all([
        capsService.getAll(),
        animalsService.getAll(),
      ]);

      setCaps(capsData);
      setAnimals(animalsData);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAnimals = useMemo(() => {
    return animals.filter(a => {
      const byDate = !filterDate || a.data?.slice(0, 10) === filterDate;
      const byType = filterType === 'todos' || a.tipoAnimal === filterType;
      return byDate && byType;
    });
  }, [animals, filterDate, filterType]);

  return (
    <div className={styles.page}>

      <div className={styles.topBar}>
        <button
          className={styles.backButton}
          onClick={() => router.push('/admin')}
        >
          <MdArrowBack /> Voltar
        </button>

        <div className={styles.pageHeading}>
          <h1 className={styles.title}>Registros</h1>
          <p className={styles.subtitle}>Gerencie tampinhas e animais</p>
        </div>
      </div>

      <div className={styles.grid}>

        {/* ✅ CAPS */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Tampinhas</h2>

          {caps.map(item => (
            <div key={item.id} className={styles.rowCard}>
              <p>{new Date(item.data).toLocaleDateString()}</p>
              <p>{item.quantidadeKg} kg</p>

              <div className={styles.actions}>
                <button
                  className={styles.dangerButton}
                  onClick={() => capsService.remove(item.id)}
                >
                  <MdDelete /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ ANIMALS */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Animais</h2>

          {/* ✅ FILTROS */}
          <div className={styles.filterBar}>

            <div className={styles.filterItem}>
              <span>Data</span>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className={styles.filterItem}>
              <span>Tipo</span>
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as 'todos' | 'gato' | 'cachorro')
                }
              >
                <option value="todos">Todos</option>
                <option value="gato">Gato</option>
                <option value="cachorro">Cachorro</option>
              </select>
            </div>

            <button
              className={styles.clearFilter}
              onClick={() => {
                setFilterDate('');
                setFilterType('todos');
              }}
            >
              Limpar
            </button>

          </div>

          {filteredAnimals.map(item => (
            <div key={item.id} className={styles.rowCard}>
              <p>{new Date(item.data).toLocaleDateString()}</p>

              <p className={styles.animalTypeValue}>
                {item.tipoAnimal === 'cachorro' ? <FaDog /> : <FaCat />}
                {item.tipoAnimal}
              </p>

              <p>{item.quantidade}</p>

              <div className={styles.actions}>
                <button
                  className={styles.dangerButton}
                  onClick={() => animalsService.remove(item.id)}
                >
                  <MdDelete /> Excluir
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}