import NavBar from '../NavBar';
import ThemeToggle from '../../common/ThemeToggle';
import { usePersonalInfo } from '../../../hooks';
import { useTheme } from '../../../context';
import { ThreeDHeader } from '../../common/3DModel';

const Header = () => {
    const { personalInfo, loading } = usePersonalInfo();
    const { darkMode } = useTheme();
    
    return (
        <>
            {/* Barra de navegación fija */}
            <header className={`fixed top-0 left-0 right-0 z-50 shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo/Nombre */}
                    <div className="text-xl font-bold">
                        {loading ? 'Cargando...' : personalInfo?.name.split(' ').slice(0, 2).join(' ')}
                    </div>

                    {/* Componente de navegación separado */}
                    <div className="flex items-center">
                        <NavBar />

                        {/* Componente ThemeToggle para cambiar entre modo claro y oscuro */}
                        <div className="ml-4">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Espacio para compensar la barra fija */}
            <div className="h-16"></div>
            
            {/* Componente 3D interactivo */}
            <div className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} relative`}>
                <ThreeDHeader />
            </div>
        </>
    );
};

export default Header;