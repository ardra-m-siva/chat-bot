import React from 'react'
import Sidebar from './Sidebar'
import HomePage from '../pages/HomePage'

const MainLayout = () => {
    return (
        <>
            <div className='h-screen flex'>
                {/* #09637E
#088395
#7AB2B2
#EBF4F6 */}
                <div className='w-80 bg-[#09637E]'>
                    <Sidebar />
                </div>
                <div className='flex-1 flex flex-col bg-[#EBF4F6]'>
                    <div className="h-17 flex items-center px-4 bg-[#EBF4F6] ">
                        Chat Header
                    </div>
                    <HomePage />
                </div>
            </div>
        </>
    )
}

export default MainLayout