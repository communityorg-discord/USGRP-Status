'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Status' },
        { href: '/changelogs', label: 'Changelogs' },
        { href: '/suggestions', label: 'Suggestions' },
        { href: '/roadmap', label: 'Roadmap' },
    ];

    return (
        <header className="site-header">
            <div className="header-content">
                <Link href="/" className="header-brand" style={{ textDecoration: 'none' }}>
                    <div className="brand-icon">🏛️</div>
                    <div className="brand-text">
                        <h1>USGRP Status</h1>
                        <span>System Status & Updates</span>
                    </div>
                </Link>

                <nav className="header-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/admin" className="nav-link" style={{ color: 'var(--gov-gold)' }}>
                        Admin
                    </Link>
                </nav>
            </div>
        </header>
    );
}
