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

  const [editingCapId, setEditingCapId] = useState<number | null>(null);
  const [editingAnimalId, setEditingAnimalId] = useState<number | null>(null);

  const [capForm, setCapForm] = useState({ data: '', quantidadeKg: '' });
  const [animalForm, setAnimalForm] = useState({ data: '', tipoAnimal: 'gato', quantidade: '' });

  const [capCreateForm, setCapCreateForm] = useState({ data: '', quantidadeKg: '' });
  const [animalCreateForm, setAnimalCreateForm] = useState({ data: '', tipoAnimal: 'gato', quantidade: '' });

  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'gato' | 'cachorro'>('todos');

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

  /* ✅ FILTRO */
  const filteredAnimals = useMemo(() => {
    return animals.filter(a => {
      const byDate = !filterDate || a.data?.slice(0, 10) === filterDate;
      const byType = filterType === 'todos' || a.tipoAnimal === filterType;
      return byDate && byType;
    });
  }, [animals, filterDate, filterType]);

  /* ✅ CREATE */
  const createCap = async (e: FormEvent) => {
    e.preventDefault();

    await capsService.create({
      data: capCreateForm.data,
      quantidadeKg: Number(capCreateForm.quantidadeKg)
    });

    setCapCreateForm({ data: '', quantidadeKg: '' });
    loadData();
  };

  const createAnimal = async (e: FormEvent) => {
    e.preventDefault();

    await animalsService.create({
      data: animalCreateForm.data,
      tipoAnimal: animalCreateForm.tipoAnimal,
      quantidade: Number(animalCreateForm.quantidade)
    });

    setAnimalCreateForm({ data: '', tipoAnimal: 'gato', quantidade: '' });
    loadData();
  };

  /* ✅ DELETE */
  const deleteCap = async (id: number) => {
    if (!confirm('Excluir registro?')) return;
    await capsService.remove(id.toString());
    loadData();
  };

  const deleteAnimal = async (id: number) => {
    if (!confirm('Excluir registro?')) return;
    await animalsService.remove(id.toString());
    loadData();
  };

  /* ✅ UPDATE */
  const updateCap = async (e: FormEvent) => {
    e.preventDefault();

    if (!editingCapId) return;

    await capsService.update(editingCapId.toString(), {
      data: capForm.data,
      quantidadeKg: Number(capForm.quantidadeKg)
    });

    setEditingCapId(null);
    loadData();
  };

  const updateAnimal = async (e: FormEvent) => {
    e.preventDefault();

    if (!editingAnimalId) return;

    await animalsService.update(editingAnimalId.toString(), {
      data: animalForm.data,
      tipoAnimal: animalForm.tipoAnimal,
      quantidade: Number(animalForm.quantidade)
    });

    setEditingAnimalId(null);
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
          <p className={styles.subtitle}>
            Gerencie tampinhas e animais
          </p>
        </div>
      </div>

      <div className={styles.grid}>

        {/* ✅ TAMPNINHAS */}
        <div className={styles.panel}>

          <h2 className={styles.panelTitle}>Tampinhas</h2>

          {/* CREATE */}
          <form onSubmit={createCap} className={styles.rowForm}>
            <div className={styles.rowFields}>

              <label className={styles.field}>
                <span>Data</span>
                <input
                  type="date"
                  value={capCreateForm.data}
                  onChange={(e) => setCapCreateForm({ ...capCreateForm, data: e.target.value })}
                />
              </label>

              <label className={styles.field}>
                <span>Kg</span>
                <input
                  type="number"
                  value={capCreateForm.quantidadeKg}
                  onChange={(e) => setCapCreateForm({ ...capCreateForm, quantidadeKg: e.target.value })}
                />
              </label>

            </div>
          </form>

          {/* LIST */}
          {caps.map(item => {

            const unidades = item.quantidadeKg * 500;

            if (editingCapId === item.id) {
              return (
                <form key={item.id} onSubmit={updateCap} className={styles.rowForm}>
                  <input
                    type="date"
                    value={capForm.data}
                    onChange={(e) => setCapForm({ ...capForm, data: e.target.value })}
                  />

                  <input
                    type="number"
                    value={capForm.quantidadeKg}
                    onChange={(e) => setCapForm({ ...capForm, quantidadeKg: e.target.value })}
                  />

                  <button><MdSave /></button>
                  <button type="button" onClick={() => setEditingCapId(null)}>
                    <MdClose />
                  </button>
                </form>
              );
            }

            return (
              <div key={item.id} className={styles.rowCard}>

                <p><strong>Data:</strong> {new Date(item.data).toLocaleDateString()}</p>
                <p><strong>Kg Tampinhas:</strong> {item.quantidadeKg}</p>
                <p><strong>Quantidade Tampinhas:</strong> {unidades}</p>

                <div className={styles.actions}>
                  <button onClick={() => {
                    setEditingCapId(item.id);
                    setCapForm({
                      data: item.data.slice(0, 10),
                      quantidadeKg: item.quantidadeKg
                    });
                  }}>
                    <MdEdit /> Editar
                  </button>

                  <button className={styles.dangerButton} onClick={() => deleteCap(item.id)}>
                    <MdDelete /> Excluir
                  </button>
                </div>

              </div>
            );

          })}

        </div>

        {/* ✅ ANIMAIS */}
        <div className={styles.panel}>

          <h2 className={styles.panelTitle}>Animais</h2>

          {/* FILTRO */}
          <div className={styles.filterBar}>

            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />

            <select value={filterType} onChange={e => setFilterType(e.target.value as any)}>
              <option value="todos">Todos</option>
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>

            <button onClick={() => {
              setFilterDate('');
              setFilterType('todos');
            }}>Limpar</button>

          </div>

          {/* CREATE */}
          <form onSubmit={createAnimal} className={styles.rowForm}>
            <input type="date"
              value={animalCreateForm.data}
              onChange={(e) => setAnimalCreateForm({ ...animalCreateForm, data: e.target.value })}
            />

            <select
              value={animalCreateForm.tipoAnimal}
              onChange={(e) => setAnimalCreateForm({ ...animalCreateForm, tipoAnimal: e.target.value })}
            >
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>

            <input
              type="number"
              value={animalCreateForm.quantidade}
              onChange={(e) => setAnimalCreateForm({ ...animalCreateForm, quantidade: e.target.value })}
            />
          </form>

          {/* LIST */}
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
                <button onClick={() => {
                  setEditingAnimalId(item.id);
                  setAnimalForm({
                    data: item.data.slice(0, 10),
                    tipoAnimal: item.tipoAnimal,
                    quantidade: item.quantidade
                  });
                }}>
                  <MdEdit /> Editar
                </button>

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