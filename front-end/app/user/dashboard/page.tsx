'use client'

import { useEffect, useState } from 'react'
import capsService from '@/services/capsService'
import animalsService from '@/services/animalsService'
import CapsChart from '@/components/capsChart'
import styles from '@/styles/dashboard.module.css'

const meses = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]

export default function Relatorio() {

  const [cardMonth, setCardMonth] = useState(1)
  const [cardYear, setCardYear] = useState(2026)
  const [tampinhasYear, setTampinhasYear] = useState(2026)

  const [capsData, setCapsData] = useState<any[]>([])
  const [animalsData, setAnimalsData] = useState<any[]>([])

  const [chartData, setChartData] = useState<any[]>([])
  const [cats, setCats] = useState(0)
  const [dogs, setDogs] = useState(0)
  const [totalCaps, setTotalCaps] = useState(0)

  const anosDisponiveis = [2026, 2025, 2024, 2023]

  useEffect(() => {
    const fetchData = async () => {
      const caps = await capsService.getAll()
      const animals = await animalsService.getAll()
      setCapsData(caps)
      setAnimalsData(animals)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!capsData.length) return

    const mesesMap = Array(12).fill(0)

    capsData.forEach((item) => {
      const date = new Date(item.data)
      if (date.getFullYear() === tampinhasYear) {
        mesesMap[date.getMonth()] += item.quantidadeKg
      }
    })

    setChartData(meses.map((mes, index) => ({
      month: mes,
      total: mesesMap[index]
    })))
  }, [capsData, tampinhasYear])

  useEffect(() => {
    let totalCats = 0
    let totalDogs = 0
    let totalCapsMonth = 0

    animalsData.forEach((item) => {
      const date = new Date(item.data)

      if (
        date.getFullYear() === cardYear &&
        date.getMonth() + 1 === cardMonth
      ) {
        item.tipoAnimal === 'gato' && (totalCats += item.quantidade)
        item.tipoAnimal === 'cachorro' && (totalDogs += item.quantidade)
      }
    })

    capsData.forEach((item) => {
      const date = new Date(item.data)

      if (
        date.getFullYear() === cardYear &&
        date.getMonth() + 1 === cardMonth
      ) {
        totalCapsMonth += item.quantidadeKg
      }
    })

    setCats(totalCats)
    setDogs(totalDogs)
    setTotalCaps(totalCapsMonth)

  }, [animalsData, capsData, cardMonth, cardYear])

  return (
    <section className={styles.container}>

      {/* filtros */}
      <div className={styles.filters}>
        <div>
          <label>Mês:</label>
          <select value={cardMonth} onChange={e => setCardMonth(Number(e.target.value))}>
            {meses.map((m, i) => (
              <option key={i+1} value={i+1}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Ano:</label>
          <select value={cardYear} onChange={e => setCardYear(Number(e.target.value))}>
            {anosDisponiveis.map(a => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Gatos</h3>
          <span>{cats}</span>
        </div>

        <div className={styles.card}>
          <h3>Cães</h3>
          <span>{dogs}</span>
        </div>

        <div className={styles.card}>
          <h3>Tampinhas (kg)</h3>
          <span>{totalCaps}</span>
        </div>
      </div>

      <div className={styles.filterChart}>
        <label>Ano:</label>
        <select value={tampinhasYear} onChange={e => setTampinhasYear(Number(e.target.value))}>
          {anosDisponiveis.map(a => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className={styles.chartContainer}>
        <CapsChart data={chartData} />
      </div>

    </section>
  )
}