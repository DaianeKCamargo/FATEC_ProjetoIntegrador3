'use client';

import { useEffect, useState } from 'react';
import { Accessibility, Contrast, Eye, RotateCcw, Type } from 'lucide-react';
import styles from '@/styles/accessibility-widget.module.css';

type FontSize = 'normal' | 'large' | 'larger';

interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  grayscale: boolean;
}

const STORAGE_KEY = 'tampets-accessibility';

const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  grayscale: false,
};

function applySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;

  root.classList.remove('access-font-large', 'access-font-larger');

  if (settings.fontSize === 'large') {
    root.classList.add('access-font-large');
  }

  if (settings.fontSize === 'larger') {
    root.classList.add('access-font-larger');
  }

  root.classList.toggle('access-high-contrast', settings.highContrast);
  root.classList.toggle('access-grayscale', settings.grayscale);
}

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = window.localStorage.getItem(STORAGE_KEY);

    if (!savedSettings) {
      applySettings(defaultSettings);
      return;
    }

    try {
      const parsedSettings = JSON.parse(savedSettings) as AccessibilitySettings;
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    } catch {
      applySettings(defaultSettings);
    }
  }, []);

  function updateSettings(nextSettings: AccessibilitySettings) {
    setSettings(nextSettings);
    applySettings(nextSettings);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
  }

  function cycleFontSize() {
    const nextFontSize: FontSize =
      settings.fontSize === 'normal'
        ? 'large'
        : settings.fontSize === 'large'
          ? 'larger'
          : 'normal';

    updateSettings({
      ...settings,
      fontSize: nextFontSize,
    });
  }

  function resetSettings() {
    updateSettings(defaultSettings);
  }

  return (
    <div className={styles.widget} aria-label="Ferramentas de acessibilidade">
      <button
        type="button"
        className={styles.floatingButton}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label="Abrir ferramentas de acessibilidade"
      >
        <Accessibility aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <strong>Acessibilidade</strong>
            <span>Personalize a leitura</span>
          </div>

          <button type="button" className={styles.optionButton} onClick={cycleFontSize}>
            <Type aria-hidden="true" />
            Fonte: {settings.fontSize === 'normal' ? 'normal' : settings.fontSize === 'large' ? 'grande' : 'maior'}
          </button>

          <button
            type="button"
            className={`${styles.optionButton} ${settings.highContrast ? styles.optionActive : ''}`}
            onClick={() => updateSettings({ ...settings, highContrast: !settings.highContrast })}
          >
            <Contrast aria-hidden="true" />
            Alto contraste
          </button>

          <button
            type="button"
            className={`${styles.optionButton} ${settings.grayscale ? styles.optionActive : ''}`}
            onClick={() => updateSettings({ ...settings, grayscale: !settings.grayscale })}
          >
            <Eye aria-hidden="true" />
            Escala de cinza
          </button>

          <button type="button" className={styles.resetButton} onClick={resetSettings}>
            <RotateCcw aria-hidden="true" />
            Restaurar
          </button>
        </div>
      )}
    </div>
  );
}
