"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";


export default function ConditionalNavbar() {
    const mounted = useSyncExternalStore(() => () => { }, () => true, () => false);
    const pathname = usePathname() || "/";

    // caminhos onde NÃO quer a navbar — ajuste conforme necessário
    const hideOn = ["/admin", "/login"];

    // esconde se pathname começar por um dos itens (para incluir sub-rotas)
    const shouldHide = hideOn.some((p) => pathname === p || pathname.startsWith(p + "/"));

    if (!mounted) return null;
    if (shouldHide) return null;
    return <Navbar />;
}