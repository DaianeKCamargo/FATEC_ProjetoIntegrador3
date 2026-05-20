'use client'

import { useState } from 'react';


export default function Relatorio() {
    
    // Filtros dos cards
    const [cardMonth, setCardMonth] = useState(1);
    const [cardYear, setCardYear] = useState(2025);

    // Filtro do gráfico de tampinhas
    const [tampinhasYear, setTampinhasYear] = useState(2025);

    // Filtro do gráfico de CO2
    const [co2Year, setCo2Year] = useState(2025);

    const anosDisponiveis = [2025, 2024, 2023];


    return (
        <section>

            

            {/* Filtros dos cards */}
            <div>
                <div>
                    <div>
                        <label>Mês:</label>
                        <select
                            value={cardMonth}
                            onChange={(e) => setCardMonth(Number(e.target.value))}
                        >
                           
                        </select>
                    </div>

                    <div>
                        <label>Ano:</label>
                        <select
                            value={cardYear}
                            onChange={(e) => setCardYear(Number(e.target.value))}
                        >
                            {anosDisponiveis.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                </div>

                {/* Cards */}
                

                {/* Gráfico de Tampinhas */}
                <div>
                    <div>
                        <div>
                            <label>Ano:</label>
                            <select
                                value={tampinhasYear}
                                onChange={(e) => setTampinhasYear(Number(e.target.value))}
                            >
                                {anosDisponiveis.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                </div>

                {/* Gráfico CO2 */}
                <div>
                    <div>
                        <div>
                            <label>Ano:</label>
                            <select
                                value={co2Year}
                                onChange={(e) => setCo2Year(Number(e.target.value))}
                            >
                                {anosDisponiveis.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}