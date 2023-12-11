import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";

function NavBar() {

    const SIZE_MOBILE = 600;

    const componentRef = useRef<HTMLDivElement>(null);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    const [clickedOutside, setClickedOutside] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const navItems = [
        { link: "/ingredients", title: "Ingredients" },
        { link: "/meals", title: "Meals" },
        { link: "/planer", title: "Planer" },
        { link: "/inventory", title: "Inventory" },
        { link: "/shoppinglist", title: "Shoppinglist" },

    ];

    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        console.log(windowSize.width)
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
            <nav className='flex flex-row h-20 bg-[#181818] z-10 items-center justify-between shadow-md w-full'>
                <div>

                </div>

                <div className='w-[60%] flex flex-row justify-end items-center mr-8'>
                    {navItems.map((item) => (
                        <Link to={item.link}>
                            <div className='h-full text-lg px-4 py-2 font-semibold text-[#EBECF4] rounded-sm hover:bg-[#fff1] hover:ring-2 ring-[#FFC200]  hover:text-[#FFC200]' key={item.title}>
                                {item.title}
                            </div>
                        </Link>
                    ))
                    }

                </div>

            </nav>
        )
    } else {

        return (

            <>
                <nav className='flex flex-row fixed h-20 bg-[#181818] z-10 justify-between shadow-md w-full'>
                    {
                        open ?
                            <button
                                className='text-3xl hover:fill-[#FFC200] text-[#EBECF4] p-4'
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setOpen(!open)
                                }}>
                                <MdClose />

                            </button>
                            :
                            <button
                                className='text-3xl text-[#EBECF4] p-4'
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setOpen(!open)
                                }}>
                                <RxHamburgerMenu />
                            </button>
                    }

                    {
                        open ?
                            <div
                                ref={componentRef}
                                onClick={handleComponentClick}
                                className='bg-[#EBECF4] absolute z-10 m-2 top-20 h-fit w-fit shadow-md'>
                                {
                                    navItems.map((item) => (
                                        <Link to={item.link}>
                                            <div className='px-6 py-2 m-3 text-lg font-normal rounded-md hover:bg-[#181818] hover:text-[#EBECF4]' key={item.title}>
                                                {item.title}
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div> : <></>
                    }

                </nav>
                <div className='h-20'>

                </div>
            </>
        )
    }

}

export default NavBar