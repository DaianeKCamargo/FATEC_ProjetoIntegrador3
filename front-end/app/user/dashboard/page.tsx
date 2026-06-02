'use client'

import { useEffect, useState } from 'react'
import capsService from '@/services/capsService'
import animalsService from '@/services/animalsService'
import CapsChart from '@/components/capsChart'
import Co2Chart from '@/components/co2Chart' // ✅ NOVO
import styles from '@/styles/dashboard.module.css'

const meses = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]

export default function Relatorio() {

  const [cardMonth, setCardMonth] = useState(1)
  const [cardYear, setCardYear] = useState(2026)
  const [tampinhasYear, setTampinhasYear] = useState(2026)

  // ✅ NOVO ESTADO CO2
  const [co2Year, setCo2Year] = useState(2026)
  const [co2ChartData, setCo2ChartData] = useState<any[]>([])
  const [totalCo2, setTotalCo2] = useState(0)

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

  // ✅ GRAFICO TAMPINHAS
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

  // ✅ CARDS
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

  // ✅ NOVO: CALCULO CO2
  useEffect(() => {
    if (!capsData.length) return

    const calcularCo2 = async () => {

      const mesesMap = Array(12).fill(0)

      capsData.forEach((item) => {
        const date = new Date(item.data)

        if (date.getFullYear() === co2Year) {
          mesesMap[date.getMonth()] += item.quantidadeKg
        }
      })

      let total = 0
      const resultado: any[] = []

      for (let i = 0; i < 12; i++) {

        const kg = mesesMap[i]

        // converte kg → tampinhas
        const tampinhas = Math.round((kg * 1000) / 2)

        try {
          const res = await fetch('http://localhost:5508/converter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tampinhas })
          })

          const data = await res.json()

          resultado.push({
            month: meses[i],
            co2: data.co2_evitado_kg || 0
          })

          total += data.co2_evitado_kg || 0

        } catch {
          resultado.push({
            month: meses[i],
            co2: 0
          })
        }
      }

      setCo2ChartData(resultado)
      setTotalCo2(Number(total.toFixed(2)))
    }

    calcularCo2()

  }, [capsData, co2Year])

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Relatório de Atividades</h1>
      <h2 className={styles.subtitle}>Acompanhamento mensal das arrecadações, impacto animal e redução de CO₂</h2>
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

      {/* grafico tampinhas */}
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

      {/* ========================= */}
      {/* ✅ NOVO DASHBOARD CO2 */}
      {/* ========================= */}

      <div className={styles.filterChart} style={{ marginTop: '3rem' }}>
        <label>Ano:</label>
        <select value={co2Year} onChange={e => setCo2Year(Number(e.target.value))}>
          {anosDisponiveis.map(a => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>CO₂ reduzido (kg)</h3>
          <span>{totalCo2}</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3 style={{ marginBottom: '1rem' }}>
          Redução de CO₂ (kg)
        </h3>

        <Co2Chart data={co2ChartData} />
      </div>

    </section>
  )
}