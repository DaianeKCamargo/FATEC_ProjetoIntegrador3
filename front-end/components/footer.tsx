'use client';

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import styles from "@/styles/footer.module.css";
import FaixaColorida from "@/components/colorLine";

export default function Footer() {
    const menuItems = [
        { href: "/sobre-nos", label: "Sobre Nós" },
        { href: "/user/news", label: "Tampets na Mídia" },
        { href: "/relatorio", label: "Relatório" },
        { href: "/ponto-coleta", label: "Ponto de Coleta" },
        { href: "/como-doar", label: "Como Doar" },
    ];

    const socialLinks = [
        {
            href: "https://wa.me/5515988327955",
            label: "WhatsApp",
            icon: <FaWhatsapp />,
            className: styles.whatsapp,
        },
        {
            href: "https://www.facebook.com/ProjetoTampets/",
            label: "Facebook",
            icon: <FaFacebookF />,
            className: styles.facebook,
        },
    ];

    return (
        <>
            <FaixaColorida />
            <div className={styles.footer}>
                <div className={styles.column}>
                    <Link href="/" className={styles.logoLink} aria-label="Ir para a página inicial">
                        <Image src="/logo_tampets.png" alt="Logo Tampets" width={200} height={300} priority className={styles.logo} />
                    </Link>
                </div>

                <div className={styles.column}>
                    <div className={styles.menuArea}>
                        <h3 className={styles.titulo}>Menu</h3>
                        <nav className={styles.menu} aria-label="Menu do rodapé">
                            {menuItems.map((item) => (
                                <Link key={item.label} href={item.href} className={styles.menuLink}>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className={styles.column}>
                    <div className={styles.redessociais}>
                        <h3 className={styles.titulo}>Acompanhe-nos</h3>
                        <div className={styles.icons}>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    className={`${styles.iconLink} ${social.className}`}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    title={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}