'use client';

import { useEffect, useMemo, useState } from 'react';
import { MdArrowBack, MdDelete, MdEdit } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import styles from '@/styles/admin-dash-registration-records.module.css';

export default function Page() {

  const router = useRouter();

  // ✅ DADOS
  const [caps, setCaps] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);

  // ✅ FILTROS
  const [filterCapDate, setFilterCapDate] = useState('');
  const [filterAnimalDate, setFilterAnimalDate] = useState('');
  const [filterType, setFilterType] = useState<'todos'|'gato'|'cachorro'>('todos');

  // ✅ FORM CAPS
  const [capCreateForm, setCapCreateForm] = useState({ data:'', quantidadeKg:'' });
  const [previewQtd, setPreviewQtd] = useState<number|null>(null);

  // ✅ FORM ANIMALS
  const [animalCreateForm, setAnimalCreateForm] = useState({
    data:'',
    tipoAnimal:'gato',
    quantidade:''
  });

  // ✅ EDIÇÃO
  const [editingCapId, setEditingCapId] = useState<number|null>(null);
  const [editingAnimalId, setEditingAnimalId] = useState<number|null>(null);

  const [capForm, setCapForm] = useState({ data:'', quantidadeKg:'' });
  const [animalForm, setAnimalForm] = useState({
    data:'',
    tipoAnimal:'gato',
    quantidade:''
  });

  // ✅ MICRO SERVIÇO
  useEffect(()=>{
    if(!capCreateForm.quantidadeKg){
      setPreviewQtd(null);
      return;
    }

    const t = setTimeout(async ()=>{
      try{
        const res = await fetch('http://localhost:5506/converter',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({kg:Number(capCreateForm.quantidadeKg)})
        });

        const data = await res.json();
        setPreviewQtd(data.quantidade_tampinhas);

      }catch{
        setPreviewQtd(null);
      }
    },300);

    return ()=> clearTimeout(t);

  },[capCreateForm.quantidadeKg]);

  // ✅ FILTRO CAPS
  const filteredCaps = useMemo(()=>{
    return caps.filter(c =>
      !filterCapDate || c.data.slice(0,10) === filterCapDate
    );
  },[caps, filterCapDate]);

  // ✅ FILTRO ANIMALS
  const filteredAnimals = useMemo(()=>{
    return animals.filter(a=>{
      const byDate = !filterAnimalDate || a.data.slice(0,10) === filterAnimalDate;
      const byType = filterType === 'todos' || a.tipoAnimal === filterType;
      return byDate && byType;
    });
  },[animals, filterAnimalDate, filterType]);

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={()=>router.push('/admin')}>
          <MdArrowBack/> Voltar
        </button>
        <h1 className={styles.title}>Registros</h1>
      </div>

      <div className={styles.grid}>

        {/* ================= TAMPNINHAS ================= */}
        <div className={styles.section}>

          <h2>Tampinhas</h2>

          {/* CADASTRO */}
          <div className={styles.box}>
            <h3>Registrar tampinhas</h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Data</label>
                <input type="date"
                  value={capCreateForm.data}
                  onChange={e=>setCapCreateForm({...capCreateForm,data:e.target.value})}
                />
              </div>

              <div className={styles.field}>
                <label>KG</label>
                <input type="number"
                  value={capCreateForm.quantidadeKg}
                  onChange={e=>setCapCreateForm({...capCreateForm,quantidadeKg:e.target.value})}
                />
              </div>

              <div className={styles.field}>
                <label>Qtd</label>
                <div className={styles.preview}>
                  {previewQtd ?? '-'}
                </div>
              </div>
            </div>
          </div>

          {/* FILTRO */}
          <div className={styles.filter}>
            <input type="date" value={filterCapDate}
              onChange={e=>setFilterCapDate(e.target.value)}
            />
            <button onClick={()=>setFilterCapDate('')}>Limpar</button>
          </div>

          {/* LISTA */}
          <div className={styles.list}>
            {filteredCaps.map(item => {

              const qtd = item.quantidade_tampinhas ?? Math.round(item.quantidadeKg * 500);
              const isEditing = editingCapId === item.id;

              return isEditing ? (
                <div key={item.id} className={styles.card}>
                  <input type="date"
                    value={capForm.data}
                    onChange={e=>setCapForm({...capForm,data:e.target.value})}
                  />

                  <input type="number"
                    value={capForm.quantidadeKg}
                    onChange={e=>setCapForm({...capForm,quantidadeKg:e.target.value})}
                  />

                  <div>{qtd}</div>
                </div>
              ) : (

                <div key={item.id} className={styles.card}>
                  <p><b>Data:</b> {new Date(item.data).toLocaleDateString()}</p>
                  <p><b>Kg:</b> {item.quantidadeKg}</p>
                  <p><b>Qtd:</b> {qtd}</p>

                  <div className={styles.actions}>
                    <button className={styles.editButton}
                      onClick={()=> {
                        setEditingCapId(item.id);
                        setCapForm({data:item.data.slice(0,10),quantidadeKg:item.quantidadeKg});
                      }}>
                      <MdEdit/> Editar
                    </button>

                    <button className={styles.deleteButton}>
                      <MdDelete/> Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ================= ANIMAIS ================= */}
        <div className={styles.section}>

          <h2>Animais</h2>

          {/* CADASTRO */}
          <div className={styles.box}>
            <h3>Registrar animais</h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Data</label>
                <input type="date"
                  value={animalCreateForm.data}
                  onChange={e=>setAnimalCreateForm({...animalCreateForm,data:e.target.value})}
                />
              </div>

              <div className={styles.field}>
                <label>Tipo</label>
                <select
                  value={animalCreateForm.tipoAnimal}
                  onChange={e=>setAnimalCreateForm({...animalCreateForm,tipoAnimal:e.target.value})}
                >
                  <option value="gato">Gato</option>
                  <option value="cachorro">Cachorro</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Qtd</label>
                <input type="number"
                  value={animalCreateForm.quantidade}
                  onChange={e=>setAnimalCreateForm({...animalCreateForm,quantidade:e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* FILTRO */}
          <div className={styles.filter}>
            <input type="date" value={filterAnimalDate}
              onChange={e=>setFilterAnimalDate(e.target.value)}
            />

            <select value={filterType}
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

          {/* LISTA */}
          <div className={styles.list}>
            {filteredAnimals.map(item => {

              const isEditing = editingAnimalId === item.id;

              return (
                <div key={item.id} className={styles.card}>
                  <p><b>Data:</b> {new Date(item.data).toLocaleDateString()}</p>
                  <p><b>Tipo:</b> {item.tipoAnimal}</p>
                  <p><b>Qtd:</b> {item.quantidade}</p>

                  <div className={styles.actions}>
                    <button className={styles.editButton}>
                      <MdEdit/> Editar
                    </button>

                    <button className={styles.deleteButton}>
                      <MdDelete/> Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}