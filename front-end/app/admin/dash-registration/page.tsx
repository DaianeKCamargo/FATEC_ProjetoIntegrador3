'use client';

import { useEffect, useMemo, useState } from 'react';
import { MdArrowBack, MdDelete, MdEdit } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import styles from '@/styles/admin-dash-registration-records.module.css';

export default function Page() {

  const router = useRouter();

  const [caps, setCaps] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);

  const [kg, setKg] = useState('');
  const [previewQtd, setPreviewQtd] = useState<number | null>(null);

  const [filterDate, setFilterDate] = useState('');

  // ✅ MICRO SERVIÇO (CORRIGIDO)
  useEffect(() => {

    if (!kg) {
      setPreviewQtd(null);
      return;
    }

    const timeout = setTimeout(async () => {

      try {
        const res = await fetch('http://localhost:5506/converter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ kg: Number(kg) })
        });

        const data = await res.json();

        setPreviewQtd(data.quantidade_tampinhas);

      } catch {
        setPreviewQtd(null);
      }

    }, 300); // debounce ✅

    return () => clearTimeout(timeout);

  }, [kg]);

  // ✅ FILTRO
  const filteredCaps = useMemo(() => {
    return caps.filter(c =>
      !filterDate || c.data.slice(0, 10) === filterDate
    );
  }, [caps, filterDate]);

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.push('/admin')}>
          <MdArrowBack /> Voltar
        </button>

        <h1 className={styles.title}>Registros</h1>
      </div>

      <div className={styles.grid}>

        {/* ================= TAMPNINHAS ================= */}
        <div className={styles.section}>

          <h2>Tampinhas</h2>

          {/* ✅ CADASTRO */}
          <div className={styles.box}>

            <h3>Registrar tampinhas</h3>

            <div className={styles.row}>

              <div className={styles.field}>
                <label>Data</label>
                <input type="date" />
              </div>

              <div className={styles.field}>
                <label>KG</label>
                <input
                  type="number"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
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

          {/* ✅ FILTRO */}
          <div className={styles.filter}>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <button onClick={() => setFilterDate('')}>Limpar</button>
          </div>

          {/* ✅ LISTA */}
          <div className={styles.list}>
            {filteredCaps.map(item => {

              const qtd = item.quantidade_tampinhas ?? item.quantidadeKg * 500;

              return (
                <div key={item.id} className={styles.card}>

                  <p><b>Data:</b> {new Date(item.data).toLocaleDateString()}</p>
                  <p><b>Kg:</b> {item.quantidadeKg}</p>
                  <p><b>Qtd:</b> {qtd}</p>

                  <div className={styles.actions}>
                    <button className={styles.edit}>
                      <MdEdit /> Editar
                    </button>

                    <button className={styles.delete}>
                      <MdDelete /> Excluir
                    </button>
                  </div>

                </div>
              )
            })}
          </div>

        </div>

        {/* ================= ANIMAIS ================= */}
        <div className={styles.section}>
          <h2>Animais</h2>

          <div className={styles.box}>
            <h3>Registrar animais</h3>

            <div className={styles.row}>

              <div className={styles.field}>
                <label>Data</label>
                <input type="date" />
              </div>

              <div className={styles.field}>
                <label>Tipo</label>
                <select>
                  <option>Gato</option>
                  <option>Cachorro</option>
                </select>
              </div>

            </div>
          </div>

          {/* lista */}
          <div className={styles.list}>
            {animals.map(item => (
              <div key={item.id} className={styles.card}>
                <p><b>Data:</b> {new Date(item.data).toLocaleDateString()}</p>
                <p><b>Tipo:</b> {item.tipoAnimal}</p>
                <p><b>Qtd:</b> {item.quantidade}</p>

                <div className={styles.actions}>
                  <button className={styles.edit}>
                    <MdEdit /> Editar
                  </button>

                  <button className={styles.delete}>
                    <MdDelete /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}