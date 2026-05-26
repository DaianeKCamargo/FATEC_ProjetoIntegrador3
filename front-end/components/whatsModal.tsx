"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/whats-modal.module.css";

interface WhatsModalProps {
  numero: string; // exemplo "5515999999999"
  open: boolean;
  kind?: 'partner' | 'volunteer' | null;
  onClose: () => void;
}

export default function WhatsModal({ numero, open, kind, onClose }: WhatsModalProps) {
  const [nome, setNome] = useState("");
  const [bairro, setBairro] = useState("");
  const mensagem = kind === 'partner'
    ? "Olá, quero me tornar um parceiro do projeto Tampets. Poderia me passar mais detalhes sobre como posso ajudar? Fico no aguardo do seu retorno."
    : "Olá, quero me tornar um voluntário do projeto Tampets. Poderia me passar mais detalhes sobre como posso ajudar? Fico no aguardo do seu retorno.";

  useEffect(() => {
    if (!open) {
      setNome("");
      setBairro("");
    }
  }, [open]);

  if (!open) return null;

  const handleSend = () => {
    const texto = `Olá, meu nome é ${nome}, moro no bairro ${bairro}. ${mensagem}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
        <h2>Enviar mensagem</h2>

        <label>Qual é o seu nome?</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
        />

        <label>Qual é o seu bairro?</label>
        <input
          type="text"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          placeholder="Seu Bairro"
        />

        <label>Mensagem:</label>
        <textarea
          value={mensagem}
        />

        <div className={styles.btnArea}>
          <button onClick={handleSend} className={styles.sendBtn}>Enviar no WhatsApp</button>
          <button onClick={onClose} className={styles.closeBtn}>Fechar</button>
        </div>
      </div>
    </div>
  );
}