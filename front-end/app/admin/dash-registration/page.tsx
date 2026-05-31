'use client';

import { useEffect, useMemo, useState } from 'react';
import { MdArrowBack, MdDelete, MdEdit, MdSave, MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';

import capsService from '@/services/capsService';
import animalsService from '@/services/animalsService';

import styles from '@/styles/admin-dash-registration-records.module.css';

export default function DashRegistration() {

  const router = useRouter();

  // ✅ DADOS
  const [caps, setCaps] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ FILTROS
  const [filterCapDate, setFilterCapDate] = useState('');
  const [filterAnimalDate, setFilterAnimalDate] = useState('');
  const [filterType, setFilterType] = useState<'todos'|'gato'|'cachorro'>('todos');

  // ✅ FORM CREATE
  const [capCreateForm, setCapCreateForm] = useState({ data:'', quantidadeKg:'' });
  const [animalCreateForm, setAnimalCreateForm] = useState({
    data:'',
    tipoAnimal:'gato',
    quantidade:''
  });

  // ✅ edição
  const [editingCapId, setEditingCapId] = useState<number|null>(null);
  const [editingAnimalId, setEditingAnimalId] = useState<number|null>(null);

  const [capForm, setCapForm] = useState({ data:'', quantidadeKg:'' });
  const [animalForm, setAnimalForm] = useState({
    data:'',
    tipoAnimal:'gato',
    quantidade:''
  });

  // ✅ LOAD
  const loadData = async () => {
    try {
      setLoading(true);
      const [capsData, animalsData] = await Promise.all([
        capsService.getAll(),
        animalsService.getAll()
      ]);
      setCaps(capsData);
      setAnimals(animalsData);
    } catch {
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ CREATE
  const createCap = async (e:any) => {
    e.preventDefault();

    await capsService.create({
      data: capCreateForm.data,
      quantidadeKg: Number(capCreateForm.quantidadeKg)
    });

    setCapCreateForm({ data:'', quantidadeKg:'' });
    loadData();
  };

  const createAnimal = async (e:any) => {
    e.preventDefault();

    await animalsService.create({
      data: animalCreateForm.data,
      tipoAnimal: animalCreateForm.tipoAnimal,
      quantidade: Number(animalCreateForm.quantidade)
    });

    setAnimalCreateForm({ data:'', tipoAnimal:'gato', quantidade:'' });
    loadData();
  };

  // ✅ DELETE
  const deleteCap = async (id:number) => {
    if(!confirm('Excluir registro?')) return;
    await capsService.remove(id.toString());
    loadData();
  };

  const deleteAnimal = async (id:number) => {
    if(!confirm('Excluir registro?')) return;
    await animalsService.remove(id.toString());
    loadData();
  };

  // ✅ UPDATE
  const updateCap = async () => {
    await capsService.update(editingCapId!.toString(), {
      data: capForm.data,
      quantidadeKg: Number(capForm.quantidadeKg)
    });

    setEditingCapId(null);
    loadData();
  };

  const updateAnimal = async () => {
    await animalsService.update(editingAnimalId!.toString(), {
      data: animalForm.data,
      tipoAnimal: animalForm.tipoAnimal,
      quantidade: Number(animalForm.quantidade)
    });

    setEditingAnimalId(null);
    loadData();
  };

  // ✅ FILTROS
  const filteredCaps = useMemo(() => {
    return caps.filter(c =>
      !filterCapDate || c.data.slice(0,10) === filterCapDate
    );
  },[caps,filterCapDate]);

  const filteredAnimals = useMemo(() => {
    return animals.filter(a => {
      const byDate = !filterAnimalDate || a.data.slice(0,10) === filterAnimalDate;
      const byType = filterType === 'todos' || a.tipoAnimal === filterType;
      return byDate && byType;
    });
  },[animals,filterAnimalDate,filterType]);

  return (
    <div className={styles.page}>

      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={()=>router.push('/admin')}>
          <MdArrowBack/> Voltar
        </button>
        <h1 className={styles.title}>Registros</h1>
      </div>

      {loading ? <p>Carregando...</p> : (

      <div className={styles.grid}>

        {/* ================= CAPS ================= */}
        <div className={styles.section}>
          <h2>Tampinhas</h2>

          {/* CREATE */}
          <div className={styles.box}>
            <h3>Cadastrar</h3>

            <form onSubmit={createCap} className={styles.row}>
              <input type="date"
                value={capCreateForm.data}
                onChange={e=>setCapCreateForm({...capCreateForm,data:e.target.value})}
              />

              <input type="number"
                value={capCreateForm.quantidadeKg}
                onChange={e=>setCapCreateForm({...capCreateForm,quantidadeKg:e.target.value})}
              />

              <button type="submit">Salvar</button>
            </form>
          </div>

          {/* FILTER */}
          <div className={styles.filter}>
            <input type="date"
              value={filterCapDate}
              onChange={e=>setFilterCapDate(e.target.value)}
            />
            <button onClick={()=>setFilterCapDate('')}>Limpar</button>
          </div>

          {/* LIST */}
          <div className={styles.list}>
            {filteredCaps.map(item => {

              const qtd = item.quantidade_tampinhas ?? Math.round(item.quantidadeKg * 500);

              return editingCapId === item.id ? (
                <div key={item.id} className={styles.card}>

                  <input type="date"
                    value={capForm.data}
                    onChange={e=>setCapForm({...capForm,data:e.target.value})}
                  />

                  <input type="number"
                    value={capForm.quantidadeKg}
                    onChange={e=>setCapForm({...capForm,quantidadeKg:e.target.value})}
                  />

                  <p>Qtd: {qtd}</p>

                  <button onClick={updateCap}><MdSave/>Salvar</button>
                  <button onClick={()=>setEditingCapId(null)}><MdClose/>Cancelar</button>

                </div>
              ) : (

              <div key={item.id} className={styles.card}>
                <p><b>Data:</b> {new Date(item.data).toLocaleDateString()}</p>
                <p><b>Kg:</b> {item.quantidadeKg}</p>
                <p><b>Qtd:</b> {qtd}</p>

                <div className={styles.actions}>
                  <button
                    className={styles.editButton}
                    onClick={()=>{
                      setEditingCapId(item.id);
                      setCapForm({
                        data:item.data.slice(0,10),
                        quantidadeKg:item.quantidadeKg
                      });
                    }}
                  >
                    <MdEdit/> Editar
                  </button>

                  <button
                    className={styles.deleteButton}
                    onClick={()=>deleteCap(item.id)}
                  >
                    <MdDelete/> Excluir
                  </button>
                </div>
              </div>);
            })}
          </div>
        </div>

        {/* ================= ANIMALS ================= */}
        <div className={styles.section}>
          <h2>Animais</h2>

          {/* CREATE */}
          <div className={styles.box}>
            <h3>Cadastrar</h3>

            <form onSubmit={createAnimal} className={styles.row}>
              <input type="date"
                value={animalCreateForm.data}
                onChange={e=>setAnimalCreateForm({...animalCreateForm,data:e.target.value})}
              />

              <select
                value={animalCreateForm.tipoAnimal}
                onChange={e=>setAnimalCreateForm({...animalCreateForm,tipoAnimal:e.target.value})}
              >
                <option value="gato">Gato</option>
                <option value="cachorro">Cachorro</option>
              </select>

              <input type="number"
                value={animalCreateForm.quantidade}
                onChange={e=>setAnimalCreateForm({...animalCreateForm,quantidade:e.target.value})}
              />

              <button type="submit">Salvar</button>
            </form>
          </div>

          {/* FILTER */}
          <div className={styles.filter}>
            <input type="date"
              value={filterAnimalDate}
              onChange={e=>setFilterAnimalDate(e.target.value)}
            />

            <select
              value={filterType}
              onChange={e=>setFilterType(e.target.value as any)}
            >
              <option value="todos">Todos</option>
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>

            <button onClick={()=>{
              setFilterAnimalDate('');
              setFilterType('todos');
            }}>
              Limpar
            </button>
          </div>

          {/* LIST */}
          <div className={styles.list}>
            {filteredAnimals.map(item => {

              return editingAnimalId === item.id ? (
                <div key={item.id} className={styles.card}>

                  <input type="date"
                    value={animalForm.data}
                    onChange={e=>setAnimalForm({...animalForm,data:e.target.value})}
                  />

                  <select
                    value={animalForm.tipoAnimal}
                    onChange={e=>setAnimalForm({...animalForm,tipoAnimal:e.target.value})}
                  >
                    <option value="gato">Gato</option>
                    <option value="cachorro">Cachorro</option>
                  </select>

                  <input type="number"
                    value={animalForm.quantidade}
                    onChange={e=>setAnimalForm({...animalForm,quantidade:e.target.value})}
                  />

                  <button onClick={updateAnimal}><MdSave/>Salvar</button>
                  <button onClick={()=>setEditingAnimalId(null)}><MdClose/>Cancelar</button>
                </div>

              ) : (

              <div key={item.id} className={styles.card}>
                <p><b>Data:</b> {new Date(item.data).toLocaleDateString()}</p>
                <p><b>Tipo:</b> {item.tipoAnimal}</p>
                <p><b>Qtd:</b> {item.quantidade}</p>

                <div className={styles.actions}>
                  <button className={styles.editButton}
                    onClick={()=>{
                      setEditingAnimalId(item.id);
                      setAnimalForm({
                        data:item.data.slice(0,10),
                        tipoAnimal:item.tipoAnimal,
                        quantidade:item.quantidade
                      });
                    }}>
                    <MdEdit/> Editar
                  </button>

                  <button className={styles.deleteButton}
                    onClick={()=>deleteAnimal(item.id)}>
                    <MdDelete/> Excluir
                  </button>
                </div>
              </div>);
            })}
          </div>

        </div>

      </div>
      )}
    </div>
  );
}