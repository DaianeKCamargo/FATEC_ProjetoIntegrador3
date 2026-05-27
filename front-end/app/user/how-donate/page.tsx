'use client';

import Image from 'next/image';
import 'bootstrap-icons/font/bootstrap-icons.css';
import style from '@/styles/how-donate.module.css';
import { TriangleAlert, Bone } from 'lucide-react';

export default function ComoDoar() {
  return (
    <section className={style.page}>

      {/* ===== HERO ===== */}
      <div className={style.hero}>
        <div className={style.heroContent}>
          <h1>Como doar</h1>
          <p>Está com dúvida de como você pode nos ajudar?</p>
        </div>
      </div>

      {/* ===== CONTEÚDO ===== */}
      <div className={style.doar}>

        {/* COMO DOAR */}
        <div className={style.sectionBox}>
          <div className={style.sectionHeader}>
            <Bone size={28} />
            <h2>Como faço para doar?</h2>
          </div>

          <div className={style.sectionContent}>
            <p>
              Junte suas tampinhas e procure o ponto de coleta mais próximo de você!
            </p>

            <p>
              Não conhece nenhum ponto de coleta?
              Procure um na nossa aba Ponto de coleta.
            </p>
          </div>
        </div>

        {/* ATENÇÃO */}
        <div className={style.sectionBox}>
          <div className={style.sectionHeader}>
            <TriangleAlert size={28} />
            <h2>ATENÇÃO!</h2>
          </div>

          <div className={style.sectionContent}>
            <p>Para facilitar a triagem das tampinhas, não coloque junto delas:</p>

            <ul>
              <li>Itens não recicláveis</li>
              <li>Lacres</li>
              <li>Pregos, parafusos, etc.</li>
              <li>Plásticos que não sejam tampinhas</li>
              <li>Vidros</li>
              <li>Cartela de remédio</li>
            </ul>
          </div>
        </div>

        {/* TIPOS DE TAMPINHAS */}
        <div className={style.sectionBox}>
          <div className={style.sectionHeader}>
            <h2>Que tipo de tampinhas aceitamos:</h2>
          </div>

          <div className={style.gridImages}>

            <div>
              <h3>Alimentos</h3>
              /Tampinhasplasticas.jpg
              <p>
                Tampas de refrigerantes, sucos, margarina, maionese,
                molhos, requeijão, óleo de cozinha etc.
              </p>
            </div>

            <div>
              <h3>Produtos de limpeza</h3>
              /ProdLimpeza.jpeg
              <p>
                Tampas de amaciante, cloro, cândida,
                desinfetante, desengordurante, etc.
              </p>
            </div>

            <div>
              <h3>Produtos de higiene</h3>
              /ProdHigiene.jpg
              <p>
                Tampas de shampoo, condicionador, cremes,
                pasta de dentes, sabonete líquido, hidratantes, etc.
              </p>
            </div>

          </div>
        </div>

        {/* FAZ / NÃO FAZ */}
        <div className={style.sectionBox}>
          <div className={style.sectionHeader}>
            <h2>O que a Tampets FAZ e NÃO FAZ</h2>
          </div>

          <div className={style.doubleColumn}>

            <div>
              <h3>FAZ</h3>
              <ul>
                <li><i className="bi bi-check2-circle"></i>Divulga feirinhas de adoção</li>
                <li><i className="bi bi-check2-circle"></i>Divulga animais perdidos</li>
                <li><i className="bi bi-check2-circle"></i>Divulga animais encontrados</li>
                <li><i className="bi bi-check2-circle"></i>Divulga campanhas públicas</li>
                <li><i className="bi bi-check2-circle"></i>Divulga eventos beneficentes</li>
              </ul>
            </div>

            <div>
              <h3>NÃO FAZ</h3>
              <ul>
                <li><i className="bi bi-x-circle"></i>Não indica clínicas veterinárias</li>
                <li><i className="bi bi-x-circle"></i>Não tem abrigo</li>
                <li><i className="bi bi-x-circle"></i>Não faz rifas</li>
                <li><i className="bi bi-x-circle"></i>Não divulga pedidos de pix</li>
                <li><i className="bi bi-x-circle"></i>Não paga castrações específicas</li>
                <li><i className="bi bi-x-circle"></i>Não indica ONGs</li>
                <li><i className="bi bi-x-circle"></i>Não troca tampinhas</li>
                <li><i className="bi bi-x-circle"></i>Não paga tratamentos veterinários</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}