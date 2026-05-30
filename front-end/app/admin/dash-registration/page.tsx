'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdDelete, MdEdit } from 'react-icons/md';
import { FaDog, FaCat } from 'react-icons/fa6';

import capsService from '@/services/capsService';
import animalsService from '@/services/animalsService';
import styles from '@/styles/admin-dash-registration-records.module.css';

export default function DashRegistration() {
  const router = useRouter();

  const [caps, setCaps] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);

  const [filterCapDate, setFilterCapDate] = useState('');
  const [filterAnimalDate, setFilterAnimalDate] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'gato' | 'cachorro'>('todos');

  const [capCreateForm, setCapCreateForm] = useState({ data: '', quantidadeKg: '' });
  const [animalCreateForm, setAnimalCreateForm] = useState({ data: '', tipoAnimal: 'gato', quantidade: '' });

  const [previewQtd, setPreviewQtd] = useState<number | null>(null);

  // ✅ carregar dados
  const loadData = async () => {
    const [c, a] = await Promise.all([
      capsService.getAll(),
      animalsService.getAll()
    ]);
    setCaps(c);
    setAnimals(a);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ microsserviço cálculo
  const calcular = async (kg: number) => {
    try {
      const res = await fetch('http://localhost:5506/converter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kg })
      });
      const data = await res.json();
      setPreviewQtd(data.quantidade_tampinhas);
    } catch {
      setPreviewQtd(null);
    }
  };

  // ✅ filtros
  const filteredCaps = useMemo(() =>
    caps.filter(c => !filterCapDate || c.data.slice(0,10) === filterCapDate),
    [caps, filterCapDate]
  );

  const filteredAnimals = useMemo(() =>
    animals.filter(a => {
      const byDate = !filterAnimalDate || a.data.slice(0,10) === filterAnimalDate;
      const byType = filterType === 'todos' || a.tipoAnimal === filterType;
      return byDate && byType;
    }),
  [animals, filterAnimalDate, filterType]);

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.push('/admin')}>
          <MdArrowBack/> Voltar
        </button>

        <div className={styles.pageHeading}>
          <span className={styles.kicker}>Painel de registros</span>
          <h1 className={styles.title}>Tampinhas e animais</h1>
          <p className={styles.subtitle}>Gerencie tudo em um só lugar</p>
        </div>
      </div>

      <div className={styles.grid}>

        {/* ================== CAPS ================== */}
        <section className={styles.panel}>

          {/* CADASTRO */}
          <h2 className={styles.panelTitle}>Registro de Tampinhas</h2>

          <div className={styles.rowFields}>
            <input
              className={styles.input}
              type="date"
              value={capCreateForm.data}
              onChange={(e)=>setCapCreateForm({...capCreateForm,data:e.target.value})}
            />

            <input
              className={styles.input}
              type="number"
              placeholder="KG"
              value={capCreateForm.quantidadeKg}
              onChange={(e)=>{
                setCapCreateForm({...capCreateForm, quantidadeKg:e.target.value});
                calcular(Number(e.target.value));
              }}
            />

            <div className={styles.preview}>
              {previewQtd ?? '-'}
            </div>
          </div>

          {/* FILTRO */}
          <div className={styles.filterBar}>
            <input
              type="date"
              value={filterCapDate}
              onChange={e=>setFilterCapDate(e.target.value)}
            />
            <button onClick={()=>setFilterCapDate('')}>Limpar</button>
          </div>

          {/* LISTA */}
          {filteredCaps.map(item => {

            const qtd = item.quantidade_tampinhas ?? Math.round(item.quantidadeKg * 500);

            return (
              <div className={styles.card} key={item.id}>

                <p><b>Data:</b> {new Date(item.data).toLocaleDateString()}</p>
                <p><b>Kg:</b> {item.quantidadeKg}</p>
                <p><b>Quantidade Tampinhas:</b> {qtd}</p>

                <div className={styles.actions}>
                  <button><MdEdit/> Editar</button>
                  <button className={styles.delete}><MdDelete/> Excluir</button>
                </div>

              </div>
            );

          })}

        </section>

        {/* ================== ANIMALS ================== */}
        <section className={styles.panel}>

          <h2 className={styles.panelTitle}>Animais</h2>

          {/* CADASTRO */}
          <div className={styles.rowFields}>
            <input
              type="date"
              value={animalCreateForm.data}
              onChange={(e)=>setAnimalCreateForm({...animalCreateForm,data:e.target.value})}
            />

            <select
              value={animalCreateForm.tipoAnimal}
              onChange={(e)=>setAnimalCreateForm({...animalCreateForm,tipoAnimal:e.target.value})}
            >
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>

            <input
              type="number"
              value={animalCreateForm.quantidade}
              onChange={(e)=>setAnimalCreateForm({...animalCreateForm,quantidade:e.target.value})}
            />
          </div>

          {/* FILTRO */}
          <div className={styles.filterBar}>
            <input type="date" value={filterAnimalDate} onChange={e=>setFilterAnimalDate(e.target.value)} />

            <select value={filterType} onChange={e=>setFilterType(e.target.value as any)}>
              <option value="todos">Todos</option>
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>

            <button onClick={()=>{setFilterAnimalDate('');setFilterType('todos')}}>
              Limpar
            </button>
          </div>

          {/* LISTA */}
          {filteredAnimals.map(item => (
            <div key={item.id} className={styles.card}>

              <p><b>Data:</b> {new Date(item.data).toLocaleDateString()}</p>

              <p>
                <b>Tipo:</b>
                {item.tipoAnimal === 'cachorro' ? <FaDog/> : <FaCat/>}
                {item.tipoAnimal}
              </p>

              <p><b>Quantidade:</b> {item.quantidade}</p>

              <div className={styles.actions}>
                <button><MdEdit/> Editar</button>
                <button className={styles.delete}><MdDelete/> Excluir</button>
              </div>

            </div>
          ))}

        </section>

      </div>
    </div>
  );
}