import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdOutlinePerson3 } from "react-icons/md";
import { Menu, MenuItem } from '@szhsin/react-menu';
import { LuLibrary } from "react-icons/lu";
import { RxCalendar } from "react-icons/rx";
import { RiShoppingCartLine } from 'react-icons/ri';
import { PiBowlFood, PiCarrot } from 'react-icons/pi';
import { TbTag } from 'react-icons/tb';

function NavBar() {

    const SIZE_MOBILE = 700;

    const navigate = useNavigate();
    const location = useLocation();

    const componentRef = useRef<HTMLUListElement>(null);
    const [windowSize, setWindowSize] = useState({
        width: globalThis.innerWidth,
        height: globalThis.innerHeight,
    })

    const handleResize = () => {
        setWindowSize({
            width: globalThis.innerWidth,
            height: globalThis.innerHeight,
        });
    };
    useEffect(() => {
        globalThis.addEventListener('resize', handleResize);
        return () => {
            globalThis.removeEventListener('resize', handleResize);
        };
    }, []);

    const isActive = (path: string) => location.pathname.startsWith(path);

    if (windowSize.width > SIZE_MOBILE) {
        return (
            <nav className='flex col-span-2 flex-row h-16 relative z-10 shadow-md items-center justify-between bg-white w-full'>
                <figure className='h-fit w-fit'>
                    <img
                        src={"../Assets/LogoFoodplaner.svg"}
                        alt=""
                        className='w-full h-full object-cover aspect-square'
                    />
                </figure>
                <ul
                    ref={componentRef}
                    className='w-3/5 max-w-[40rem] flex flex-row px-4 py-4 justify-around items-center'>
                    {
                        (() => {
                            const showActive = isActive('/planer')
                            return (
                                <li>
                                    <Link
                                        className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} flex flex-row justify-start items-center`}
                                        to={'/planer'}>
                                        <RxCalendar className='size-6 mr-2' />
                                        <p className={`${showActive ? 'block' : 'hidden'} text-base font-semibold`}>
                                            Speiseplan
                                        </p>
                                    </Link>
                                </li>
                            );
                        })()
                    }
                    {
                        (() => {
                            const showActive = isActive('/meals') || isActive('/ingredients') || isActive('/tags')

                            const handleBibliothekClick = () => {
                                if (!showActive) {
                                    navigate('/meals');
                                }
                            };

                            return (
                                <li>

                                    <Menu
                                        menuClassName={'bg-white flex flex-row h-10 px-0 py-0 text-white'}
                                        className={'absolute left-0 right-0'}
                                        menuButton={<span
                                            onClick={handleBibliothekClick}
                                            className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} cursor-pointer flex flex-row justify-start items-center`}>
                                            <LuLibrary className='size-6 mr-2' />
                                            <p className={`${showActive ? 'block' : 'hidden'} text-base font-semibold`}>
                                                Bibliothek
                                            </p>
                                        </span>}>
                                        {
                                            (() => {
                                                const showActive = isActive('/meals')
                                                return (
                                                    <MenuItem
                                                        className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} py-2 cursor-pointer flex flex-row justify-start items-center`}
                                                        onClick={() => navigate("/meals")}>
                                                        <PiBowlFood className='size-5 mr-2' />
                                                        <p className={`text-base font-semibold`}>
                                                            Rezepte
                                                        </p>
                                                    </MenuItem>
                                                );
                                            })()
                                        }
                                        {
                                            (() => {
                                                const showActive = isActive('/ingredients')
                                                return (
                                                    <MenuItem
                                                        className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} py-2  cursor-pointer flex flex-row justify-start items-center`}
                                                        onClick={() => navigate("/ingredients")}>
                                                        <PiCarrot className='size-5 mr-2' />
                                                        <p className={`text-base font-semibold`}>
                                                            Zutaten
                                                        </p>
                                                    </MenuItem>
                                                );
                                            })()
                                        }
                                        {
                                            (() => {
                                                const showActive = isActive('/tags')
                                                return (
                                                    <MenuItem
                                                        className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} py-2  cursor-pointer flex flex-row justify-start items-center`}
                                                        onClick={() => navigate("/tags")}>
                                                        <TbTag className='size-5 mr-2' />
                                                        <p className={`text-base font-semibold`}>
                                                            Tags
                                                        </p>
                                                    </MenuItem>
                                                );
                                            })()
                                        }

                                    </Menu>
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
                                        className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} flex flex-row justify-start items-center`}
                                        to={'/lists'}>
                                        <RiShoppingCartLine className='size-6 mr-2' />
                                        <p className={`${showActive ? 'block' : 'hidden'} text-base font-semibold`}>
                                            Listen
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
                                        className={`${showActive ? 'text-[#004A41]' : 'text-[#7D8698]'} flex flex-row justify-start items-center`}
                                        to={'/profile'}>
                                        <MdOutlinePerson3 className='size-6 mr-2' />
                                        <p className={`${showActive ? 'block' : 'hidden'} text-base font-semibold`}>
                                            Profil
                                        </p>
                                    </Link>
                                </li>
                            );
                        })()
                    }
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