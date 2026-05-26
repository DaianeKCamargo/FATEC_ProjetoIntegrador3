'use client'
import Image from 'next/image';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Tittle from '@/components/tittle';
import style from '@/styles/how-donate.module.css';
import { TriangleAlert, Bone } from 'lucide-react';

export default function ComoDoar() {
  return (
    <section className={style.page}>
      <Tittle 
        src="/img_titulo_amarelo.png" 
        tittle="Como doar" 
        label=" Está com duvída de como você pode nos ajudar?"/>

    <div className={style.doar}>
      <div>
        {/* não utiliza esse formato de style no className, conforme conversamos utilizar o module, já estou deixando importado aqui */}
        <header>
          <div className={style.sectionBox}>
            <div className={style.sectionHeader}>
              <Bone size={28}/>
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
        </header>

        <div className={style.sectionBox}>
          <div className={style.sectionHeader}>
             <TriangleAlert size={28} />
            <h2>ATENÇÃO!</h2>
          </div>

          <div className={style.sectionContent}>
            <p>Para facilitar a triagem das tampinhas, não coloque junto delas:</p>
            <ul>
              <li>- Itens não recicláveis</li>
              <li>- Lacres</li>
              <li>- Pregos, parafusos, etc.</li>
              <li>- Plásticos que não sejam tampinhas</li>
              <li>- Vidros</li>
              <li>- Cartela de remédio</li>
            </ul>
          </div>
        </div>

        <div className={style.sectionBox}>
          <div className={style.sectionHeader}>
            <h2>Que tipo de tampinhas aceitamos:</h2>
          </div>

          <div className={style.sectionContent}>
            <h3>Alimentos</h3>
            <Image
                src={"/Tampinhasplasticas.jpg"} 
                alt={'tampinhas plasticas'}
                width={250}
                height={400}
                className={style["Image-banner"]}/>

            <p>Tampas de refrigerantes, sucos, margarina, maionese, molhos, 
            requeijão, óleo de cozinha etc.</p>
          </div>
          <div className={style.sectionContent}>
            <h3>Produtos de limpeza</h3>
            <Image
                src={"/ProdLimpeza.jpeg"} 
                alt={'Produtos de limpeza'}
                width={280}
                height={200}
                className={style["Image-banner"]}/>
            <p>Tampas de amaciante, cloro, cândida, desinfetante, desengordurante, etc.</p>
          </div>
          <div className={style.sectionContent}>
            <h3>Produtos de Higiene</h3>
            <Image
                  src={"/ProdHigiene.jpg"} 
                  alt={'Produtos de higiene'}
                  width={280}
                  height={200}
                  className={style["Image-banner"]}/>
            <p>Tampas de shampoo, condicionador, cremes,
            pasta de dentes, sabonete líquido, hidratantes, etc.</p>
          </div>
        </div>

        <div className={style.sectionBox}>
          <div className={style.sectionHeader}>
            <h2>O que a Tampets FAZ e NÃO FAZ</h2>
          </div>

          <div className={style.sectionContent}>
            <h3>FAZ</h3>
              <ul>
                <li><i className="bi bi-check2-circle">Divulga feirinhas de adoção</i></li>
                <li><i className="bi bi-check2-circle">Divulga pedidos de tutores cujo animais fugiram </i></li>
                <li><i className="bi bi-check2-circle">Divulga animais que foram encontrados e precisam voltar para casa</i></li>
                <li><i className="bi bi-check2-circle">Divulga campanhas de castração realizadas pelas prefeituras da região</i></li>
                <li><i className="bi bi-check2-circle"
                >Divulga eventos beneficientes de arrecadação de dinheiro para ajudar abrigos, protetores ou ONGs
                </i></li>
              </ul>
          </div>

          <div className={style.sectionContent}>
            <h3>NÃO FAZ</h3>
              <ul> 
                <li><i className="bi bi-x-circle">Não indica clínicas veterinárias</i></li>
                <li><i className="bi bi-x-circle">Não tem abrigo</i></li>
                <li><i className="bi bi-x-circle">Não faz rifas</i></li>
                <li><i className="bi bi-x-circle">Não divulga pedidos de pix ou transfência de valores</i></li>
                <li><i className="bi bi-x-circle">Não paga castrações de animais de raça ou de filhotes</i></li>
                <li><i className="bi bi-x-circle">Não indica abrigos, lar temporário ou ONGs que resgatam animais</i></li>
                <li><i className="bi bi-x-circle">Não troca tampinhas por ração</i></li>
                <li><i className="bi bi-x-circle">Não troca tampinhas por castrações</i></li>
                <li><i className="bi bi-x-circle">Não paga tratamentos veterinários</i></li>
                <li><i className="bi bi-x-circle">Não divulga nas redes sociais animais para adoção</i></li>
              </ul> 
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}