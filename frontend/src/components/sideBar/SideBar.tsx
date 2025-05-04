import { Link } from 'react-router'
import { useState } from 'react'
import { useNavigate } from 'react-router';

const SideBar = () => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        product: false
    });
    const navigate = useNavigate();


    const toogleopenSections = (section: string) => {
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
        <div className='w-[20%] bg-gray-700 '>
            SideBar <br />
            <button onClick={() => toogleopenSections('Products')}>
                Products
            </button> <br />
            {openSections.Products &&
                <div className='ml-2 bg-blue-100'>
                    <Link to='/products-database'>Products Database</Link> <br />
                    <Link to='/view-products'>Edit Products</Link>
                </div>
            }
            <button onClick={() => toogleopenSections('Bala')}>
                Bala
            </button>
            {openSections.Bala &&
                <div className='ml-2 bg-blue-100'>
                    <Link to='/'>Pcts</Link> <br />
                    <Link to='/'>Eroducts</Link>
                </div>
            }
            <br />

            <button onClick={handleLogOut} className='px-3 py-1 bg-white text-red-500 hover:bg-red-500 hover:text-white font-bold duration-200 hover:cursor-pointer'>Log out</button>
        </div>

    )
}

export default SideBar