import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { Menu, MenuItem } from '@szhsin/react-menu';

function NavBar() {

    const SIZE_MOBILE = 700;

    const navigate = useNavigate();

    const componentRef = useRef<HTMLUListElement>(null);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    const [_clickedOutside, setClickedOutside] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const navItems = [
        { link: "/planer", title: "Planer" },
        { link: "/ingredients", title: "Ingredients" },
        { link: "/meals", title: "Meals" },
        { link: "/lists", title: "Shoppinglist" },
        { link: "/tags", title: "Tags" },
    ];

    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
            setClickedOutside(true);
            setOpen(false)
        }
    };

    useEffect(() => {
        // Add a click event listener when the component mounts
        document.addEventListener('click', handleClickOutside);

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Reset the clickedOutside state when the component is clicked
    const handleComponentClick = () => {
        setClickedOutside(false);
    };
    if (windowSize.width > SIZE_MOBILE) {
        return (
            <nav className='flex col-span-2 flex-row h-16 relative bg-[#004A41] z-10 items-center justify-between w-full'>
                <ul className='w-full flex flex-row justify-end items-center mr-6'>
                    <li key={'nav-planer'}>
                        <Link to={'/planer'}>
                            <p className='h-full cursor-pointer text-lg px-4 py-2 font-medium text-white rounded-md hover:bg-[#007A6B]'>
                                Planer
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
                <nav className='flex flex-row fixed top-0 left-0 right-0 h-16 bg-[#004A41] z-10 justify-between shadow-md w-full rounded-br-full'>
                    {
                        open ?
                            <button
                                className='text-3xl hover:fill-[#FFC200] bg-[#004A41] text-[#EBECF4] p-2 m-2'
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setOpen(!open)
                                }}>
                                <MdClose />
                            </button>
                            :
                            <button
                                className='text-3xl bg-[#004A41] text-[#EBECF4] p-2 m-2'
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setOpen(!open)
                                }}>
                                <RxHamburgerMenu />
                            </button>
                    }

                    {
                        open ?
                            <ul
                                ref={componentRef}
                                onClick={handleComponentClick}
                                className='bg-[#004A41] absolute z-10 top-16 h-screen w-2/3 shadow-md'>
                                <li>

                                </li>
                                {
                                    navItems.map((item) => (
                                        <Link to={item.link}>
                                            <div className='px-6 py-2 m-3 text-lg font-normal text-white rounded-md hover:bg-[#181818] hover:text-[#57D1C2]' key={item.title}>
                                                {item.title}
                                            </div>
                                        </Link>
                                    ))
                                }
                            </ul> : <></>
                    }

                </nav>
                <div className='h-16'>

                </div>
            </>
        )
    }

}

export default NavBar