import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";

function NavBar() {

    const SIZE_MOBILE = 700;

    const componentRef = useRef<HTMLDivElement>(null);
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
                <div>

                </div>

                <div className='w-[60%] flex flex-row justify-end items-center mr-8'>
                    {navItems.map((item) => (
                        <Link key={item.title} to={item.link}>
                            <div className='h-full text-lg px-4 py-2 font-medium text-[#EBECF4] rounded-full hover:bg-[#fff1] hover:ring-2 ring-[#FF6B00]  hover:text-[#FF6B00]' key={item.title}>
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
                <nav className='flex flex-row fixed top-0 left-0 right-0 h-20 bg-[#008979] z-10 justify-between shadow-md w-full'>
                    {
                        open ?
                            <button
                                className='text-3xl hover:fill-[#FFC200] bg-[#008979] text-[#EBECF4] p-2 m-2'
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setOpen(!open)
                                }}>
                                <MdClose />

                            </button>
                            :
                            <button
                                className='text-3xl bg-[#008979] text-[#EBECF4] p-2 m-2'
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
                                className='bg-[#008979] absolute z-10 m-2 top-20 h-screen w-1/2 shadow-md'>
                                {
                                    navItems.map((item) => (
                                        <Link to={item.link}>
                                            <div className='px-6 py-2 m-3 text-lg font-normal rounded-md hover:bg-[#181818] hover:text-[#57D1C2]' key={item.title}>
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