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
  const [animalForm, setAnimalForm] = useState({
    data: '',
    tipoAnimal: 'gato',
    quantidade: '',
  });

  const [capCreateForm, setCapCreateForm] = useState({ data: '', quantidadeKg: '' });
  const [animalCreateForm, setAnimalCreateForm] = useState({
    data: '',
    tipoAnimal: 'gato',
    quantidade: '',
  });

  /* ✅ LOAD */
  const loadData = async () => {
    try {
      setLoading(true);

      const [capsData, animalsData] = await Promise.all([
        capsService.getAll(),
        animalsService.getAll()
      ]);

      setCaps(capsData);
      setAnimals(animalsData);

    } catch (err) {
      console.error(err);
      alert('Erro ao carregar registros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ✅ CREATE */
  const createCap = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await capsService.create({
        data: capCreateForm.data,
        quantidadeKg: Number(capCreateForm.quantidadeKg),
      });

      setCapCreateForm({ data: '', quantidadeKg: '' });
      loadData();

    } catch {
      alert('Erro ao criar tampinha');
    }
  };

  const createAnimal = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await animalsService.create({
        data: animalCreateForm.data,
        tipoAnimal: animalCreateForm.tipoAnimal,
        quantidade: Number(animalCreateForm.quantidade),
      });

      setAnimalCreateForm({ data: '', tipoAnimal: 'gato', quantidade: '' });
      loadData();

    } catch {
      alert('Erro ao criar animal');
    }
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
    setCapForm({ data: '', quantidadeKg: '' });
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
    setAnimalForm({ data: '', tipoAnimal: 'gato', quantidade: '' });
    loadData();
  };

  /* ✅ TOTALS */
  const totalCats = useMemo(() =>
    animals.reduce((sum, a) =>
      a.tipoAnimal === 'gato' ? sum + Number(a.quantidade) : sum
    , 0)
  , [animals]);

  const totalDogs = useMemo(() =>
    animals.reduce((sum, a) =>
      a.tipoAnimal === 'cachorro' ? sum + Number(a.quantidade) : sum
    , 0)
  , [animals]);

  return (
    <div className={styles.page}>

      {/* VOLTAR */}
      <button
        className={styles.backButton}
        onClick={() => router.push('/admin')}
      >
        <MdArrowBack /> Voltar
      </button>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {/* ✅ CAPS */}
          <h2>Tampinhas</h2>

          <form onSubmit={createCap}>
            <input
              type="date"
              value={capCreateForm.data}
              onChange={e => setCapCreateForm({ ...capCreateForm, data: e.target.value })}
            />

            <input
              type="number"
              value={capCreateForm.quantidadeKg}
              onChange={e => setCapCreateForm({ ...capCreateForm, quantidadeKg: e.target.value })}
            />

            <button type="submit">Cadastrar</button>
          </form>

          {caps.map(item =>
            editingCapId === item.id ? (
              <form key={item.id} onSubmit={updateCap}>
                <input
                  type="date"
                  value={capForm.data}
                  onChange={e => setCapForm({ ...capForm, data: e.target.value })}
                />

                <input
                  type="number"
                  value={capForm.quantidadeKg}
                  onChange={e => setCapForm({ ...capForm, quantidadeKg: e.target.value })}
                />

                <button><MdSave /> Salvar</button>
                <button type="button" onClick={() => setEditingCapId(null)}>
                  <MdClose /> Cancelar
                </button>
              </form>
            ) : (
              <div key={item.id} className={styles.card}>
                <p>{new Date(item.data).toLocaleDateString()}</p>
                <p>{item.quantidadeKg} kg</p>

                <button onClick={() => {
                  setEditingCapId(item.id);
                  setCapForm({
                    data: item.data.slice(0, 10),
                    quantidadeKg: String(item.quantidadeKg)
                  });
                }}>
                  <MdEdit /> Editar
                </button>

                <button onClick={() => deleteCap(item.id)}>
                  <MdDelete /> Excluir
                </button>
              </div>
            )
          )}

          {/* ✅ ANIMALS */}
          <h2>Animais</h2>

          <form onSubmit={createAnimal}>
            <input
              type="date"
              value={animalCreateForm.data}
              onChange={e => setAnimalCreateForm({ ...animalCreateForm, data: e.target.value })}
            />

            <select
              value={animalCreateForm.tipoAnimal}
              onChange={e => setAnimalCreateForm({ ...animalCreateForm, tipoAnimal: e.target.value })}
            >
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>

            <input
              type="number"
              value={animalCreateForm.quantidade}
              onChange={e => setAnimalCreateForm({ ...animalCreateForm, quantidade: e.target.value })}
            />

            <button type="submit">Cadastrar</button>
          </form>

          {animals.map(item =>
            editingAnimalId === item.id ? (
              <form key={item.id} onSubmit={updateAnimal}>
                <input
                  type="date"
                  value={animalForm.data}
                  onChange={e => setAnimalForm({ ...animalForm, data: e.target.value })}
                />

                <select
                  value={animalForm.tipoAnimal}
                  onChange={e => setAnimalForm({ ...animalForm, tipoAnimal: e.target.value })}
                >
                  <option value="gato">Gato</option>
                  <option value="cachorro">Cachorro</option>
                </select>

                <input
                  type="number"
                  value={animalForm.quantidade}
                  onChange={e => setAnimalForm({ ...animalForm, quantidade: e.target.value })}
                />

                <button><MdSave /> Salvar</button>
                <button type="button" onClick={() => setEditingAnimalId(null)}>
                  <MdClose /> Cancelar
                </button>
              </form>
            ) : (
              <div key={item.id} className={styles.card}>
                <p>{new Date(item.data).toLocaleDateString()}</p>

                <p>
                  {item.tipoAnimal === 'cachorro' ? <FaDog /> : <FaCat />}
                  {item.tipoAnimal}
                </p>

                <p>{item.quantidade}</p>

                <button onClick={() => {
                  setEditingAnimalId(item.id);
                  setAnimalForm({
                    data: item.data.slice(0, 10),
                    tipoAnimal: item.tipoAnimal,
                    quantidade: String(item.quantidade)
                  });
                }}>
                  <MdEdit /> Editar
                </button>

                <button onClick={() => deleteAnimal(item.id)}>
                  <MdDelete /> Excluir
                </button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}