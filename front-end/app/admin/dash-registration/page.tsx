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

  /* ✅ filtros */
  const [filterCapDate, setFilterCapDate] = useState('');
  const [filterAnimalDate, setFilterAnimalDate] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'gato' | 'cachorro'>('todos');

  /* ✅ forms */
  const [capCreateForm, setCapCreateForm] = useState({ data: '', quantidadeKg: '' });
  const [animalCreateForm, setAnimalCreateForm] = useState({ data: '', tipoAnimal: 'gato', quantidade: '' });

  const [previewQtd, setPreviewQtd] = useState<number | null>(null);

  /* ✅ carregar dados */
  const loadData = async () => {
    const [capsData, animalsData] = await Promise.all([
      capsService.getAll(),
      animalsService.getAll(),
    ]);

    setCaps(capsData);
    setAnimals(animalsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ✅ conversão via microserviço */
  const calcularTampinhas = async (kg: number) => {
    try {
      const res = await fetch('http://localhost:5506/converter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kg }),
      });

      const data = await res.json();
      setPreviewQtd(data.quantidade_tampinhas);
    } catch {
      setPreviewQtd(null);
    }
  };

  /* ✅ filtro caps */
  const filteredCaps = useMemo(() => {
    return caps.filter(c =>
      !filterCapDate || c.data?.slice(0, 10) === filterCapDate
    );
  }, [caps, filterCapDate]);

  /* ✅ filtro animals */
  const filteredAnimals = useMemo(() => {
    return animals.filter(a => {
      const byDate = !filterAnimalDate || a.data?.slice(0, 10) === filterAnimalDate;
      const byType = filterType === 'todos' || a.tipoAnimal === filterType;
      return byDate && byType;
    });
  }, [animals, filterAnimalDate, filterType]);

  /* ✅ CREATE */
  const createCap = async (e: FormEvent) => {
    e.preventDefault();

    await capsService.create({
      data: capCreateForm.data,
      quantidadeKg: Number(capCreateForm.quantidadeKg),
    });

    setCapCreateForm({ data: '', quantidadeKg: '' });
    setPreviewQtd(null);
    loadData();
  };

  const createAnimal = async (e: FormEvent) => {
    e.preventDefault();

    await animalsService.create({
      data: animalCreateForm.data,
      tipoAnimal: animalCreateForm.tipoAnimal,
      quantidade: Number(animalCreateForm.quantidade),
    });

    setAnimalCreateForm({ data: '', tipoAnimal: 'gato', quantidade: '' });
    loadData();
  };

  /* ✅ delete */
  const deleteCap = async (id: number) => {
    if (!confirm('Excluir?')) return;
    await capsService.remove(id.toString());
    loadData();
  };

  const deleteAnimal = async (id: number) => {
    if (!confirm('Excluir?')) return;
    await animalsService.remove(id.toString());
    loadData();
  };

  return (
    <div className={styles.page}>

      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.push('/admin')}>
          <MdArrowBack /> Voltar
        </button>

        <div className={styles.pageHeading}>
          <h1 className={styles.title}>Registros</h1>
          <p className={styles.subtitle}>Gerencie tampinhas e animais</p>
        </div>
      </div>

      <div className={styles.grid}>

        {/* ✅ TAMPNINHAS */}
        <div className={styles.panel}>

          <h2 className={styles.panelTitle}>Tampinhas</h2>

          {/* ✅ filtro */}
          <div className={styles.filterBar}>
            <input type="date" value={filterCapDate} onChange={e => setFilterCapDate(e.target.value)} />
            <button onClick={() => setFilterCapDate('')}>Limpar</button>
          </div>

          {/* ✅ cadastro + cálculo */}
          <form onSubmit={createCap} className={styles.rowForm}>

            <div className={styles.rowFields}>

              <label className={styles.field}>
                <span>Data</span>
                <input
                  type="date"
                  value={capCreateForm.data}
                  onChange={e => setCapCreateForm({ ...capCreateForm, data: e.target.value })}
                />
              </label>

              <label className={styles.field}>
                <span>KG</span>
                <input
                  type="number"
                  value={capCreateForm.quantidadeKg}
                  onChange={e => {
                    setCapCreateForm({ ...capCreateForm, quantidadeKg: e.target.value });
                    calcularTampinhas(Number(e.target.value));
                  }}
                />
              </label>

              <div className={styles.readOnlyField}>
                <span>Quantidade tampinhas</span>
                <strong>{previewQtd ?? '-'}</strong>
              </div>

            </div>

          </form>

          {/* ✅ lista */}
          {filteredCaps.map(item => (
            <div key={item.id} className={styles.rowCard}>

              <p><strong>Data:</strong> {new Date(item.data).toLocaleDateString()}</p>
              <p><strong>Kg Tampinhas:</strong> {item.quantidadeKg}</p>
              <p><strong>Quantidade Tampinhas:</strong> {item.quantidade_tampinhas ?? item.quantidadeKg * 500}</p>

              <div className={styles.actions}>
                <button><MdEdit /> Editar</button>
                <button className={styles.dangerButton} onClick={() => deleteCap(item.id)}>
                  <MdDelete /> Excluir
                </button>
              </div>

            </div>
          ))}

        </div>

        {/* ✅ ANIMAIS */}
        <div className={styles.panel}>

          <h2 className={styles.panelTitle}>Animais</h2>

          <div className={styles.filterBar}>
            <input type="date" value={filterAnimalDate} onChange={e => setFilterAnimalDate(e.target.value)} />

            <select value={filterType} onChange={e => setFilterType(e.target.value as any)}>
              <option value="todos">Todos</option>
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>

            <button onClick={() => {
              setFilterAnimalDate('');
              setFilterType('todos');
            }}>Limpar</button>
          </div>

          {/* cadastro */}
          <form onSubmit={createAnimal} className={styles.rowForm}>
            <input type="date" value={animalCreateForm.data}
              onChange={e => setAnimalCreateForm({ ...animalCreateForm, data: e.target.value })}
            />

            <select
              value={animalCreateForm.tipoAnimal}
              onChange={e => setAnimalCreateForm({ ...animalCreateForm, tipoAnimal: e.target.value })}
            >
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>

            <input type="number"
              value={animalCreateForm.quantidade}
              onChange={e => setAnimalCreateForm({ ...animalCreateForm, quantidade: e.target.value })}
            />
          </form>

          {/* lista */}
          {filteredAnimals.map(item => (
            <div key={item.id} className={styles.rowCard}>

              <p><strong>Data:</strong> {new Date(item.data).toLocaleDateString()}</p>

              <p>
                <strong>Tipo:</strong>
                {item.tipoAnimal === 'cachorro' ? <FaDog /> : <FaCat />}
                {item.tipoAnimal}
              </p>

              <p><strong>Quantidade:</strong> {item.quantidade}</p>

              <div className={styles.actions}>
                <button><MdEdit /> Editar</button>
                <button className={styles.dangerButton} onClick={() => deleteAnimal(item.id)}>
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