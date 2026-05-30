'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdDelete, MdEdit, MdClose, MdSave, MdPets, MdInventory } from 'react-icons/md';
import { FaCat, FaDog } from 'react-icons/fa6';
import capsService from '@/services/capsService';
import animalsService from '@/services/animalsService';
import styles from '@/styles/admin-dash-registration-records.module.css';

type CapsRecord = {
  id: number;
  data: string;
  quantidadeKg: number;
  quantidade_tampinhas?: number;
};

type AnimalRecord = {
  id: number;
  data: string;
  tipoAnimal: string;
  quantidade: number;
};

type CapFormState = {
  data: string;
  quantidadeKg: string;
};

type AnimalFormState = {
  data: string;
  tipoAnimal: 'gato' | 'cachorro';
  quantidade: string;
};

const emptyCapForm: CapFormState = {
  data: '',
  quantidadeKg: '',
};

const emptyAnimalForm: AnimalFormState = {
  data: '',
  tipoAnimal: 'gato',
  quantidade: '',
};

function toInputDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('pt-BR');
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '-';
}

export default function DashRegistration() {
  const router = useRouter();

  const [caps, setCaps] = useState<CapsRecord[]>([]);
  const [animals, setAnimals] = useState<AnimalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingType, setSavingType] = useState<'caps' | 'animals' | null>(null);
  const [creatingType, setCreatingType] = useState<'caps' | 'animals' | null>(null);
  const [editingCapId, setEditingCapId] = useState<number | null>(null);
  const [editingAnimalId, setEditingAnimalId] = useState<number | null>(null);
  const [mobileCategory, setMobileCategory] = useState<'caps' | 'animals'>('caps');
  const [capForm, setCapForm] = useState<CapFormState>(emptyCapForm);
  const [animalForm, setAnimalForm] = useState<AnimalFormState>(emptyAnimalForm);
  const [capCreateForm, setCapCreateForm] = useState<CapFormState>(emptyCapForm);
  const [animalCreateForm, setAnimalCreateForm] = useState<AnimalFormState>(emptyAnimalForm);

  const totalCaps = useMemo(() => caps.length, [caps]);
  const totalAnimals = useMemo(() => animals.length, [animals]);
  const totalCapsKg = useMemo(
    () => caps.reduce((sum, item) => sum + Number(item.quantidadeKg || 0), 0),
    [caps]
  );
  const totalCapsUnits = useMemo(
    () => caps.reduce((sum, item) => sum + Number(item.quantidade_tampinhas || 0), 0),
    [caps]
  );
  const totalCats = useMemo(
    () => animals.filter((item) => item.tipoAnimal?.toLowerCase() === 'gato').length,
    [animals]
  );
  const totalDogs = useMemo(
    () => animals.filter((item) => item.tipoAnimal?.toLowerCase() === 'cachorro').length,
    [animals]
  );

  const loadRecords = async () => {
    setLoading(true);

    try {
      const [capsList, animalsList] = await Promise.all([
        capsService.getAll(),
        animalsService.getAll(),
      ]);

      setCaps(capsList);
      setAnimals(animalsList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const startEditCap = (item: CapsRecord) => {
    setEditingAnimalId(null);
    setAnimalForm(emptyAnimalForm);
    setEditingCapId(item.id);
    setCapForm({
      data: toInputDate(item.data),
      quantidadeKg: String(item.quantidadeKg ?? ''),
    });
  };

  const startEditAnimal = (item: AnimalRecord) => {
    setEditingCapId(null);
    setCapForm(emptyCapForm);
    setEditingAnimalId(item.id);
    setAnimalForm({
      data: toInputDate(item.data),
      tipoAnimal: item.tipoAnimal as 'gato' | 'cachorro',
      quantidade: String(item.quantidade ?? ''),
    });
  };

  const cancelCapEdit = () => {
    setEditingCapId(null);
    setCapForm(emptyCapForm);
  };

  const cancelAnimalEdit = () => {
    setEditingAnimalId(null);
    setAnimalForm(emptyAnimalForm);
  };

  const handleDeleteCap = async (id: number) => {
    const confirmed = window.confirm('Deseja excluir este registro de tampinhas?');

    if (!confirmed) {
      return;
    }

    await capsService.remove(String(id));
    await loadRecords();
  };

  const handleDeleteAnimal = async (id: number) => {
    const confirmed = window.confirm('Deseja excluir este registro de animais?');

    if (!confirmed) {
      return;
    }

    await animalsService.remove(String(id));
    await loadRecords();
  };

  const handleCreateCap = async (event: FormEvent) => {
    event.preventDefault();

    if (!capCreateForm.data || !capCreateForm.quantidadeKg) {
      return;
    }

    setCreatingType('caps');

    try {
      await capsService.create({
        data: capCreateForm.data,
        quantidadeKg: Number(capCreateForm.quantidadeKg),
      });

      setCapCreateForm(emptyCapForm);
      await loadRecords();
    } finally {
      setCreatingType(null);
    }
  };

  const handleCreateAnimal = async (event: FormEvent) => {
    event.preventDefault();

    if (!animalCreateForm.data || !animalCreateForm.quantidade) {
      return;
    }

    setCreatingType('animals');

    try {
      await animalsService.create({
        data: animalCreateForm.data,
        tipoAnimal: animalCreateForm.tipoAnimal,
        quantidade: Number(animalCreateForm.quantidade),
      });

      setAnimalCreateForm(emptyAnimalForm);
      await loadRecords();
    } finally {
      setCreatingType(null);
    }
  };

  const handleSubmitCap = async (event: FormEvent) => {
    event.preventDefault();

    if (!editingCapId) {
      return;
    }

    setSavingType('caps');

    try {
      await capsService.update(String(editingCapId), {
        data: capForm.data,
        quantidadeKg: Number(capForm.quantidadeKg),
      });

      cancelCapEdit();
      await loadRecords();
    } finally {
      setSavingType(null);
    }
  };

  const handleSubmitAnimal = async (event: FormEvent) => {
    event.preventDefault();

    if (!editingAnimalId) {
      return;
    }

    setSavingType('animals');

    try {
      await animalsService.update(String(editingAnimalId), {
        data: animalForm.data,
        tipoAnimal: animalForm.tipoAnimal,
        quantidade: Number(animalForm.quantidade),
      });

      cancelAnimalEdit();
      await loadRecords();
    } finally {
      setSavingType(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.push('/admin')}>
          <MdArrowBack size={20} />
          Voltar
        </button>

        <div className={styles.pageHeading}>
          <span className={styles.kicker}>Painel de registros</span>
          <h1 className={styles.title}>Tampinhas e animais castrados</h1>
          <p className={styles.subtitle}>
            Acesse os cadastros no topo e gerencie a lista de registros logo abaixo, com edição e exclusão por item.
          </p>
        </div>

        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
              <span className={styles.summaryCardTitle}>Tampinhas</span>
              <strong>{totalCaps}</strong>
            </div>
            <div className={styles.summaryCardBody}>
              <div className={styles.summaryStatItem}>
                <span>Kg</span>
                <strong>{totalCapsKg.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className={styles.summaryStatItem}>
                <span>Unidades</span>
                <strong>{totalCapsUnits.toLocaleString('pt-BR')}</strong>
              </div>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
              <span className={styles.summaryCardTitle}>Animais</span>
              <strong>{totalAnimals}</strong>
            </div>
            <div className={styles.summaryCardBody}>
              <div className={styles.summaryStatItem}>
                <span>Gatos</span>
                <strong>{totalCats}</strong>
              </div>
              <div className={styles.summaryStatItem}>
                <span>Cachorros</span>
                <strong>{totalDogs}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mobileSelector}>
        <label className={styles.mobileSelectorLabel}>
          <span>Escolha o registro</span>
          <select value={mobileCategory} onChange={(event) => setMobileCategory(event.target.value as 'caps' | 'animals')}>
            <option value="caps">Tampinhas</option>
            <option value="animals">Animais</option>
          </select>
        </label>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.categoryGroup} ${mobileCategory !== 'caps' ? styles.categoryHidden : ''}`}>
          <section className={styles.panel}>
            <form className={styles.rowForm} onSubmit={handleCreateCap}>
               <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Registro de Tampinhas</h2>
                </div>
            </div>
              <div className={styles.rowFields}>
                <label className={styles.field}>
                  <span>Data</span>
                  <input
                    type="date"
                    value={capCreateForm.data}
                    onChange={(event) => setCapCreateForm((current) => ({ ...current, data: event.target.value }))}
                  />
                </label>
                <label className={styles.field}>
                  <span>Quantidade kg</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={capCreateForm.quantidadeKg}
                    onChange={(event) => setCapCreateForm((current) => ({ ...current, quantidadeKg: event.target.value }))}
                  />
                </label>
                <div className={styles.readOnlyField}>
                  <span>Qtd. unidade</span>
                  <strong>{capCreateForm.quantidadeKg ? Math.round(Number(capCreateForm.quantidadeKg) * 500).toLocaleString('pt-BR') : '-'}</strong>
                </div>
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.primaryButton} disabled={creatingType === 'caps'}>
                  <MdInventory size={18} />
                  {creatingType === 'caps' ? 'Salvando...' : 'Cadastrar tampinhas'}
                </button>
              </div>
            </form>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.panelTag}>Tampinhas</span>
                  <h2 className={styles.panelTitle}>Histórico de tampinhas</h2>
                </div>
                <span className={styles.panelHint}>Data, quantidade em kg e quantidade em unidades.</span>
              </div>

              {loading ? (
                <p className={styles.emptyState}>Carregando registros...</p>
              ) : caps.length === 0 ? (
                <p className={styles.emptyState}>Nenhum registro de tampinhas encontrado.</p>
              ) : (
                <div className={styles.list}>
                  {caps.map((item) => {
                    const isEditing = editingCapId === item.id;

                    return isEditing ? (
                      <form key={item.id} className={styles.rowForm} onSubmit={handleSubmitCap}>
                        <div className={styles.rowFields}>
                          <label className={styles.field}>
                            <span>Data</span>
                            <input
                              type="date"
                              value={capForm.data}
                              onChange={(event) => setCapForm((current) => ({ ...current, data: event.target.value }))}
                            />
                          </label>
                          <label className={styles.field}>
                            <span>Quantidade kg</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={capForm.quantidadeKg}
                              onChange={(event) => setCapForm((current) => ({ ...current, quantidadeKg: event.target.value }))}
                            />
                          </label>
                          <div className={styles.readOnlyField}>
                            <span>Qtd. unidade</span>
                            <strong>{item.quantidade_tampinhas?.toLocaleString('pt-BR') ?? '-'}</strong>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <button type="button" className={styles.secondaryButton} onClick={cancelCapEdit}>
                            <MdClose size={18} />
                            Cancelar
                          </button>
                          <button type="submit" className={styles.primaryButton} disabled={savingType === 'caps'}>
                            <MdSave size={18} />
                            {savingType === 'caps' ? 'Salvando...' : 'Salvar'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <article key={item.id} className={styles.rowCard}>
                        <div className={styles.rowFields}>
                          <div className={styles.readOnlyField}>
                            <span>Data</span>
                            <strong>{formatDisplayDate(item.data)}</strong>
                          </div>
                          <div className={styles.readOnlyField}>
                            <span>Quantidade kg</span>
                            <strong>{Number(item.quantidadeKg).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className={styles.readOnlyField}>
                            <span>Qtd. unidade</span>
                            <strong>{item.quantidade_tampinhas?.toLocaleString('pt-BR') ?? '-'}</strong>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <button type="button" className={styles.secondaryButton} onClick={() => startEditCap(item)}>
                            <MdEdit size={18} />
                            Editar
                          </button>
                          <button type="button" className={styles.dangerButton} onClick={() => handleDeleteCap(item.id)}>
                            <MdDelete size={18} />
                            Excluir
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </section>
        </div>

        <div className={`${styles.categoryGroup} ${mobileCategory !== 'animals' ? styles.categoryHidden : ''}`}>
          <section className={styles.panel}>


            <form className={styles.rowForm} onSubmit={handleCreateAnimal}>
                <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Registro de Animais</h2>
              </div>
            </div>
              <div className={styles.rowFields}>
                <label className={styles.field}>
                  <span>Data</span>
                  <input
                    type="date"
                    value={animalCreateForm.data}
                    onChange={(event) => setAnimalCreateForm((current) => ({ ...current, data: event.target.value }))}
                  />
                </label>
                <label className={styles.field}>
                  <span>Tipo animal</span>
                  <select
                    value={animalCreateForm.tipoAnimal}
                    onChange={(event) => setAnimalCreateForm((current) => ({ ...current, tipoAnimal: event.target.value as 'gato' | 'cachorro' }))}
                  >
                    <option value="gato">Gato</option>
                    <option value="cachorro">Cachorro</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Quantidade</span>
                  <input
                    type="number"
                    min="1"
                    value={animalCreateForm.quantidade}
                    onChange={(event) => setAnimalCreateForm((current) => ({ ...current, quantidade: event.target.value }))}
                  />
                </label>
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.primaryButton} disabled={creatingType === 'animals'}>
                  <MdPets size={18} />
                  {creatingType === 'animals' ? 'Salvando...' : 'Cadastrar animais'}
                </button>
              </div>
            </form>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.panelTag}>Animais</span>
                  <h2 className={styles.panelTitle}>Histórico de animais</h2>
                </div>
                <span className={styles.panelHint}>Data, tipo do animal e quantidade registrada.</span>
              </div>

              {loading ? (
                <p className={styles.emptyState}>Carregando registros...</p>
              ) : animals.length === 0 ? (
                <p className={styles.emptyState}>Nenhum registro de animais encontrado.</p>
              ) : (
                <div className={styles.list}>
                  {animals.map((item) => {
                    const isEditing = editingAnimalId === item.id;

                    return isEditing ? (
                      <form key={item.id} className={styles.rowForm} onSubmit={handleSubmitAnimal}>
                        <div className={styles.rowFields}>
                          <label className={styles.field}>
                            <span>Data</span>
                            <input
                              type="date"
                              value={animalForm.data}
                              onChange={(event) => setAnimalForm((current) => ({ ...current, data: event.target.value }))}
                            />
                          </label>
                          <label className={styles.field}>
                            <span>Tipo animal</span>
                            <select
                              value={animalForm.tipoAnimal}
                              onChange={(event) => setAnimalForm((current) => ({ ...current, tipoAnimal: event.target.value as 'gato' | 'cachorro' }))}
                            >
                              <option value="gato">Gato</option>
                              <option value="cachorro">Cachorro</option>
                            </select>
                          </label>
                          <label className={styles.field}>
                            <span>Quantidade</span>
                            <input
                              type="number"
                              min="1"
                              value={animalForm.quantidade}
                              onChange={(event) => setAnimalForm((current) => ({ ...current, quantidade: event.target.value }))}
                            />
                          </label>
                        </div>

                        <div className={styles.actions}>
                          <button type="button" className={styles.secondaryButton} onClick={cancelAnimalEdit}>
                            <MdClose size={18} />
                            Cancelar
                          </button>
                          <button type="submit" className={styles.primaryButton} disabled={savingType === 'animals'}>
                            <MdSave size={18} />
                            {savingType === 'animals' ? 'Salvando...' : 'Salvar'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <article key={item.id} className={styles.rowCard}>
                        <div className={styles.rowFields}>
                          <div className={styles.readOnlyField}>
                            <span>Data</span>
                            <strong>{formatDisplayDate(item.data)}</strong>
                          </div>
                          <div className={styles.readOnlyField}>
                            <span>Tipo animal</span>
                            <strong className={styles.animalTypeValue}>
                              {item.tipoAnimal?.toLowerCase() === 'cachorro' ? <FaDog size={16} /> : <FaCat size={16} />}
                              {capitalize(item.tipoAnimal)}
                            </strong>
                          </div>
                          <div className={styles.readOnlyField}>
                            <span>Quantidade</span>
                            <strong>{Number(item.quantidade).toLocaleString('pt-BR')}</strong>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <button type="button" className={styles.secondaryButton} onClick={() => startEditAnimal(item)}>
                            <MdEdit size={18} />
                            Editar
                          </button>
                          <button type="button" className={styles.dangerButton} onClick={() => handleDeleteAnimal(item.id)}>
                            <MdDelete size={18} />
                            Excluir
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}