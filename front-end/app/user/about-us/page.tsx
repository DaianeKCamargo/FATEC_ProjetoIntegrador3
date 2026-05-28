'use client'

import style from '@/styles/about-us.module.css';
import Image from 'next/image';

import { PawPrint, Recycle, Info } from "lucide-react";
import { div } from 'framer-motion/client';

export default function SobreNos() {
    return (
        <section className={style.page}>

            <div className={style.hero}>
                <div className={style.heroContent}>
                    <h1>Sobre Nós</h1>
                    <p>Não conhece nosso projeto? Você está no lugar certo!</p>
                </div>
            </div>
            <div className={style.sectionBox}>
                <div className={style.sectionContent}>
                <p>
                    Diante da realidade dos animais abandonados e maltratados,
                    o <strong>Projeto TamPets</strong> busca contribuir para o controle da superpopulação animal por meio da reciclagem de tampinhas PET,
                    destinando os recursos a castrações.
                </p>

                <p>
                    Embora existam iniciativas voltadas à causa animal em Sorocaba e região, o fator financeiro
                    ainda impede que muitos tutores, abrigos e protetores independentes tenham acesso à castração.
                </p>

                <p>
                    Com base nisso, o <strong>Projeto TamPets</strong> tem como objetivo <strong>coletar e vender tampinhas plásticas</strong>,
                    criando um fundo destinado exclusivamente à realização dessas cirurgias para animais em situações
                    de vulnerabilidade.
                </p>

                <p>
                    A castração evita abandono, maus-tratos, fome, ninhadas indesejadas e diversas doenças.
                </p>
            </div>
            </div>
            
                {/* ---------------------- O QUE FAZEMOS ---------------------- */ }
        <div className={style.sectionBox}>
        <div className={style.sectionHeader}>
            <Recycle size={28} />
            <h2>O Que Fazemos</h2>
        </div>

        <div className={style.sectionContent}>
            <p><strong>Uma iniciativa independente em prol dos animais.</strong></p>

            <p>
                A coleta das tampinhas acontece por meio de parcerias com pessoas físicas e jurídicas
                que apoiam voluntariamente o projeto.
            </p>

            <p>
                O peso total arrecadado mensalmente é divulgado nas redes sociais do projeto.
            </p>

            <p>
                Todos os recursos obtidos com a venda das tampinhas são destinados <strong>direta e exclusivamente</strong>
                aos responsáveis pelos atendimentos — ONGs, abrigos e clínicas veterinárias parceiras.
            </p>

            <p>
                O sucesso desse trabalho depende do engajamento da população de Sorocaba e região, que pode colaborar
                coletando tampinhas e entregando-as nos pontos de coleta parceiros.
            </p>
        </div>
        </div>

        {/* ---------------------- IMPORTANTE SABER ---------------------- */ }
        <div className={style.sectionBox}>
            <div className={style.sectionHeader}>
                <Info size={28} />
                <h2>Importante Saber</h2>
            </div>

            <div className={style.sectionContent}>
                <ul>
                    <li><strong>O Projeto TamPets não é uma ONG</strong>;</li>
                    <li><strong>Não possui vínculos políticos</strong>;</li>
                    <li><strong>Não possui abrigo</strong>;</li>
                    <li><strong>Não realiza resgates</strong>;</li>
                    <li><strong>Não promove feiras de adoção ou mutirões de castração</strong> — apenas apoia através da divulgação;</li>
                    <li><strong>Não aceita doações em dinheiro</strong>, exceto quando realizadas <strong>diretamente à clínica parceira</strong>.</li>
                </ul>

            <p id='client'>
                <strong>Eliada Marcos (Lia)</strong><br />
                Idealizadora do Projeto TamPets
            </p>
        </div>
        </div>

            
    </section >
    );
}