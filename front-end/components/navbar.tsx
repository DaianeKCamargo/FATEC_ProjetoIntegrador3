'use client';
import styles from '@/styles/navbar.module.css';
import Link from 'next/link';
import { FaBarsStaggered } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FaixaColorida from '@/components/colorLine';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { BiSolidHomeHeart, BiChevronDown } from "react-icons/bi";

export default function NavbarLogout() {
    const [role, setRole] = useState<string | null>(null);
    const socialLinks = [
        {
            href: 'https://wa.me/5515988327955',
            label: 'WhatsApp',
            icon: <FaWhatsapp />,
            className: styles.whatsapp,
        },
        {
            href: 'https://www.facebook.com/ProjetoTampets/',
            label: 'Facebook',
            icon: <FaFacebookF />,
            className: styles.facebook,
        },
        {
            href: 'https://www.instagram.com/tampetsorocaba',
            label: 'Instagram',
            icon: <FaInstagram />,
            className: styles.instagram,
        },
    ];

    useEffect(() => {
        const r = localStorage.getItem("role");
        setRole(r);
    }, []);

    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();

    const handleFechado = () => setOpenMenu(false);
    const handleAberto = () => setOpenMenu(true);


    return (
        <>
            <FaixaColorida />

            <nav className={styles.navbar}>
                <div className={styles.logotampets}>
                    <Link href="/">
                        <img
                            className={styles.logo}
                            src="/logo_tampets.png"
                            alt="Logo Tampets"
                            width={200}
                            height={100}
                        />
                    </Link>
                </div>

                {/* DESKTOP */}
                <div className={styles.navitems}>
                    <details className={styles.dropdown}>
                        <summary className={styles.dropdownToggle}>
                            O Projeto <BiChevronDown className={styles.dropdownIcon} />
                        </summary>
                        <div className={styles.dropdownMenu}>
                            <Link className={styles.item} href="/user/about-us">
                                Sobre Nós
                            </Link>
                            <Link className={styles.item} href="/user/news">
                                Tampets na Mídia
                            </Link>
                        </div>
                    </details>

                    <Link className={styles.item} href="/user/dashboard">Relatório</Link>
                    <Link className={styles.item} href="/user/collection-point">Ponto de Coleta</Link>
                    <Link className={styles.item} href="/user/how-donate">Como Doar</Link>
                </div>

                <div className={styles.socialLinks} aria-label="Redes sociais">
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            className={`${styles.socialLink} ${social.className}`}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={social.label}
                            title={social.label}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

                {/* HAMBURGUER MOBILE */}
                <div className={styles.navhamburguer}>
                    <FaBarsStaggered size={20} onClick={handleAberto} style={{ cursor: 'pointer' }} />
                </div>
            </nav >

            {/* MOBILE MENU */}
            {openMenu && (
                <div className={styles.meuoffcanvas}>
                    <div className={styles.bodylateral}>
                        <div className={styles.navlateral}>
                            <div>
                                <Link href="/" onClick={handleFechado}>
                                    <BiSolidHomeHeart size={30} color='#D7C216' />
                                </Link>
                            </div>

                            <div className={styles.items}>
                                <details className={styles.dropdownMobile}>
                                    <summary className={styles.dropdownToggle}>
                                        O Projeto <BiChevronDown className={styles.dropdownIcon} />
                                    </summary>
                                    <div className={styles.dropdownMenuMobile}>
                                        <Link className={styles.item} href="/user/about-us" onClick={handleFechado}>
                                            Sobre Nós
                                        </Link>
                                        <Link className={styles.item} href="/user/news" onClick={handleFechado}>
                                            Tampets na Mídia
                                        </Link>
                                    </div>
                                </details>
                                <Link className={styles.item} href="/user/dashboard" onClick={handleFechado}>
                                    Relatório
                                </Link>
                                <Link className={styles.item} href="/user/collection-point" onClick={handleFechado}>
                                    Ponto de Coleta
                                </Link>
                                <Link className={styles.item} href="/user/how-donate" onClick={handleFechado}>
                                    Como Doar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}