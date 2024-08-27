import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdOutlinePerson3 } from "react-icons/md";
import { Menu, MenuItem } from '@szhsin/react-menu';
import { LuLibrary } from "react-icons/lu";
import { RxCalendar } from "react-icons/rx";
import { RiShoppingCartLine } from 'react-icons/ri';

function NavBar() {

    const SIZE_MOBILE = 700;

    const navigate = useNavigate();
    const location = useLocation();

    const componentRef = useRef<HTMLUListElement>(null);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isActive = (path: string) => location.pathname.startsWith(path);

    if (windowSize.width > SIZE_MOBILE) {
        return (
            <nav className='flex col-span-2 flex-row h-16 relative bg-[#004A41] z-10 items-center justify-between w-full'>
                <ul className='w-full flex flex-row justify-end items-center mr-6'>
                    <li key={'nav-planer'}>
                        <Link to={'/planer'}>
                            <p className='h-full cursor-pointer text-lg px-4 py-2 font-medium text-white rounded-md hover:bg-[#007A6B]'>
                                Speiseplan
                            </p>
                        </Link>
                    </li>
                    <li key={'nav-library'}>
                        <Menu
                            menuClassName={'bg-[#004A41] text-white absolute left-0 right-0 mt-4'}
                            className={'absolute left-0 right-0'}
                            menuButton={<p className='h-full cursor-pointer text-lg px-4 py-2 font-medium text-white rounded-md hover:bg-[#007A6B]'>
                                Bibliothek
                            </p>}>
                            <MenuItem
                                className={'hover:bg-[#007A6B] text-white text-lg'}
                                onClick={() => navigate("/meals")}>
                                Gerichte
                            </MenuItem>
                            <MenuItem
                                className={'hover:bg-[#007A6B] text-white text-lg'}
                                onClick={() => navigate("/ingredients")}>
                                Zutaten
                            </MenuItem>
                            <MenuItem
                                className={'hover:bg-[#007A6B] text-white text-lg'}
                                onClick={() => navigate("/tags")}>
                                Tags
                            </MenuItem>
                        </Menu>
                    </li>
                    <li key={'nav-lists'}>
                        <Link to={'/lists'}>
                            <p className='h-full cursor-pointer text-lg px-4 py-2 font-medium text-white rounded-md hover:bg-[#007A6B]'>
                                Listen
                            </p>
                        </Link>
                    </li>
                </ul>

            </nav>
        )
    } else {
        return (
            <>
                <nav className='flex flex-row fixed bottom-0 left-0 right-0 z-10 justify-between shadow-md w-full rounded-br-full'>
                    <ul
                        ref={componentRef}
                        className='bg-white w-full flex flex-row px-4 pb-6 pt-4 justify-around items-center'>
                        {
                            (() => {
                                const showActive = isActive('/meals') || isActive('/ingredients') || isActive('/tags')
                                return (
                                    <li>
                                        <Link
                                            className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} flex flex-col justify-start items-center`}
                                            to={'/meals'}>
                                            <LuLibrary className='size-6' />
                                            <p className={`${showActive ? 'block' : 'hidden'} text-sm font-semibold`}>
                                                Bibliothek
                                            </p>
                                        </Link>
                                    </li>
                                );
                            })()
                        }
                        {
                            (() => {
                                const showActive = isActive('/planer')
                                return (
                                    <li>
                                        <Link
                                            className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} flex flex-col justify-start items-center`}
                                            to={'/planer'}>
                                            <RxCalendar className='size-6' />
                                            <p className={`${showActive ? 'block' : 'hidden'} text-sm font-semibold`}>
                                                Speiseplan
                                            </p>
                                        </Link>
                                    </li>
                                );
                            })()
                        }
                        {
                            (() => {
                                const showActive = isActive('/lists')
                                return (
                                    <li>
                                        <Link
                                            className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} flex flex-col justify-start items-center`}
                                            to={'/lists'}>
                                            <RiShoppingCartLine className='size-6' />
                                            <p className={`${showActive ? 'block' : 'hidden'} text-sm font-semibold`}>
                                                Einkausliste
                                            </p>
                                        </Link>
                                    </li>
                                );
                            })()
                        }
                        {
                            (() => {
                                const showActive = isActive('/profile')
                                return (
                                    <li>
                                        <Link
                                            className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} flex flex-col justify-start items-center`}
                                            to={'/profile'}>
                                            <MdOutlinePerson3 className='size-6' />
                                            <p className={`${showActive ? 'block' : 'hidden'} text-sm font-semibold`}>
                                                Profil
                                            </p>
                                        </Link>
                                    </li>
                                );
                            })()
                        }
                    </ul>
                </nav>
            </>
        )
    }

}

export default NavBar