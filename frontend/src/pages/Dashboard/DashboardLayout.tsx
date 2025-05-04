import { Outlet } from 'react-router'
import SideBar from '../../components/sideBar/SideBar'

const DashboardLayout = () => {
    return (
        <div className='h-screen flex flex-col'>
            <div className='flex flex-1 overflow-hidden'>
                <div className='h-screen overflow-y-auto] w-[20%]'>
                    <SideBar />
                </div>
                <div className='flex-1 p-3 overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout