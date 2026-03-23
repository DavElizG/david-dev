import { useState, useEffect, useRef } from 'react';
import NavBar from '../NavBar';
import { usePersonalInfo } from '../../../hooks';
import logo from '../../../assets/images/logo/optimized/JDSnoppyLogo-small.webp';

const Header = () => {
    const { personalInfo, loading } = usePersonalInfo();
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            if (currentY < 80) {
                setVisible(true);
            } else if (delta > 6) {
                setVisible(false);
            } else if (delta < -6) {
                setVisible(true);
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50"
            style={{
                transform: visible ? 'translateY(0)' : 'translateY(-110%)',
                transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
        >
            <div className="container mx-auto px-8 py-6 flex justify-between items-center">
                {/* Logo / Name */}
                <a
                    href="#hero"
                    className="flex items-center gap-3 hover:opacity-60 transition-opacity duration-300"
                    style={{ color: 'var(--space-text)' }}
                >
                    <img
                        src={logo}
                        alt="Logo JD"
                        className="h-7 w-7 opacity-90"
                        width="28"
                        height="28"
                    />
                    <span
                        className="text-xs font-medium uppercase tracking-[0.2em]"
                        style={{ color: 'var(--space-accent-2)' }}
                    >
                        {loading ? '' : personalInfo?.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                </a>

                <NavBar />
            </div>
        </header>
    );
};

export default Header;
