import NavBar from '../NavBar';
import { usePersonalInfo } from '../../../hooks';
import logo from '../../../assets/images/logo/optimized/JDSnoppyLogo-small.webp';

const Header = () => {
    const { personalInfo, loading } = usePersonalInfo();

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50"
            style={{
                background: 'rgba(6,5,15,0.7)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--space-border)',
            }}
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo / Name */}
                <a
                    href="#hero"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--space-text)' }}
                >
                    <img
                        src={logo}
                        alt="Logo JD"
                        className="h-8 w-8"
                        width="32"
                        height="32"
                    />
                    <span className="text-lg font-bold tracking-wide">
                        {loading ? '' : personalInfo?.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                </a>

                <NavBar />
            </div>
        </header>
    );
};

export default Header;