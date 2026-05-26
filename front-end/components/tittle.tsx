import styles from '@/styles/tittle.module.css';

interface tittleProps {
    src: string;
    tittle: string;
    label: string;
}

export default function Tittle(props: tittleProps) {
    const { src, tittle, label } = props;

    return (
        <div className={styles.tittle}>
            <img className={styles.imgt} src={src} alt="Fundo Título" />

            <h1 className={styles.escritat}> {tittle} </h1>

            <p className={styles.escritap}>{label} </p>
        </div>
    );
}