import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";

function NavBar() {
    const componentRef = useRef<HTMLDivElement>(null);
    const [clickedOutside, setClickedOutside] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const navItems = [
        { link: "/ingredients", title: "Ingredients" },
        { link: "/meals", title: "Meals" },
        { link: "/planer", title: "Planer" },
        { link: "/inventory", title: "Inventory" },
        { link: "/shoppinglist", title: "Shoppinglist" },

    ];

    const handleClickOutside = (event: MouseEvent) => {
        if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
            setClickedOutside(true);
            setOpen(false)
        }
    };

    useEffect(() => {
        // Add a click event listener when the component mounts
        document.addEventListener('click', handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Reset the clickedOutside state when the component is clicked
    const handleComponentClick = () => {
        setClickedOutside(false);
    };

    return (
        <nav className='flex flex-row h-14 bg-[#181818] z-10 justify-between shadow-md w-full'>
            {
                open ?
                    <button
                        className='text-3xl text-white p-4'
                        onClick={(event) => {
                            event.stopPropagation();
                            setOpen(!open)
                        }}>
                        <MdClose />

                    </button>
                    :
                    <button
                        className='text-3xl text-white p-4'
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
                        className='bg-white absolute z-10 m-2 top-14 h-fit w-fit shadow-md'>
                        {
                            navItems.map((item) => (
                                <Link to={item.link}>
                                    <div className='px-6 py-2 m-3 text-lg font-normal rounded-md hover:bg-[#181818] hover:text-white' key={item.title}>
                                        {item.title}
                                    </div>
                                </Link>
                            ))
                        }
                    </div> : <></>
            }

        </nav>
    )
}

export default NavBar