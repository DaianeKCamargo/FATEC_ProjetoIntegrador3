import { PiCopyrightThin } from "react-icons/pi";
import styles from "@/styles/copyright.module.css";
import FaixaColorida from "@/components/colorLine";

export default function Copyright() {
    return (
        <>
            <div className={styles.direitosautorais}>
                <p>Politica de Privacidade | <PiCopyrightThin style={{ display: "inline-block", marginRight: "2px" }} /> 2026 Code & Cloud. Todos os direitos reservados.</p>
            </div>
            <FaixaColorida />
        </>
    )
}