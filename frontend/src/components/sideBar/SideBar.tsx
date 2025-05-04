import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronDown, ChevronRight } from 'lucide-react'

const SideBar = () => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        Products: false,
        Bala: false
    });
    const navigate = useNavigate();

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section]
        }));
    }

    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate("/authpage")
    }

    return (
        <div className='relative w-64 h-full bg-background border-r border-muted flex flex-col'>
            <div className='p-4 border-b border-muted'>
                <h2 className='text-lg font-semibold text-foreground'>Inventory System</h2>
            </div>

            <div className='flex-1 overflow-y-auto p-2 space-y-1'>
                <div className='rounded-md overflow-hidden'>
                    <button
                        onClick={() => navigate('/dashboard-analytics')}
                        className='w-full flex items-center justify-between p-2 text-sm font-medium text-foreground hover:bg-accent transition-colors'
                    >
                        <span>Dashboard</span>
                    </button>
                    <button
                        onClick={() => toggleSection('Products')}
                        className='w-full flex items-center justify-between p-2 text-sm font-medium text-foreground hover:bg-accent transition-colors'
                    >
                        <span>Products</span>
                        {openSections.Products ? (
                            <ChevronDown className='h-4 w-4' />
                        ) : (
                            <ChevronRight className='h-4 w-4' />
                        )}
                    </button>

                    {openSections.Products && (
                        <div className='ml-4 space-y-1 py-1'>
                            <Link
                                to='/products-database'
                                className='block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors'
                            >
                                Products Database
                            </Link>
                            <Link
                                to='/view-products'
                                className='block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors'
                            >
                                Edit Products
                            </Link>
                        </div>
                    )}
                </div>

                <div className='rounded-md overflow-hidden'>
                    <button
                        onClick={() => toggleSection('Bala')}
                        className='w-full flex items-center justify-between p-2 text-sm font-medium text-foreground hover:bg-accent transition-colors'
                    >
                        <span>Bala</span>
                        {openSections.Bala ? (
                            <ChevronDown className='h-4 w-4' />
                        ) : (
                            <ChevronRight className='h-4 w-4' />
                        )}
                    </button>

                    {openSections.Bala && (
                        <div className='ml-4 space-y-1 py-1'>
                            <Link
                                to='/'
                                className='block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors'
                            >
                                Pcts
                            </Link>
                            <Link
                                to='/'
                                className='block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors'
                            >
                                Eroducts
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className='p-4 border-t border-muted sticky bottom-0 bg-background'>
                <button
                    onClick={handleLogOut}
                    className='w-full px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors border border-destructive'
                >
                    Log out
                </button>
            </div>
        </div>
    )
}

export default SideBar