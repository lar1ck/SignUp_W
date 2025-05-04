import { Outlet } from 'react-router'
import SideBar from '../../components/sideBar/SideBar'
import Menu from '../../components/menu/Menu'

const DashboardLayout = () => {
    return (
        <div className='h-screen'>
            <Menu />
            <div className='flex gap-1 '>
                <SideBar />
                <div className=' w-screen p-3'>
                <Outlet />
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout