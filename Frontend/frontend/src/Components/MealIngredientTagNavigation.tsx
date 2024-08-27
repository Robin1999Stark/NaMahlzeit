import { useLocation, Link } from 'react-router-dom';
import { PiBowlFood } from "react-icons/pi";
import { PiCarrot } from "react-icons/pi";
import { TbTag } from "react-icons/tb";
import { useEffect, useState } from 'react';

function MealIngredientTagNavigation() {

    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(0);

    const isActive = (path: string) => location.pathname.startsWith(path);

    useEffect(() => {
        if (isActive('/meals')) setActiveIndex(0);
        if (isActive('/ingredients')) setActiveIndex(1);
        if (isActive('/tags')) setActiveIndex(2);
    }, [location]);

    const positions = [
        { transform: 'translateX(0%)' },
        { transform: 'translateX(100%)' },
        { transform: 'translateX(193%)' }
    ];

    return (
        <span className='absolute left-0 right-0 py-1 bottom-20 bg-white'>
            <ul className='relative flex flex-row justify-between mx-4 items-center bg-[#E8E9EB] rounded-full p-1'>
                {/* Sliding background */}
                <span
                    className='absolute top-1 bottom-1 left-1 w-1/3 bg-[#004A41] rounded-full transition-transform duration-300 ease-in-out'
                    style={positions[activeIndex]}>
                </span>
                <li className='w-full'>
                    <Link
                        className={`relative py-1 cursor-pointer w-full flex flex-row justify-center items-center ${isActive('/meals') ? 'text-white font-bold' : 'text-[#011413]'}`}
                        to={'/meals'}>
                        <PiBowlFood className='size-5 mr-2' />
                        <p className='text-sm'>
                            Rezepte
                        </p>
                    </Link>
                </li>
                <li className='w-full'>
                    <Link
                        className={`relative py-1 cursor-pointer w-full flex flex-row justify-center items-center ${isActive('/ingredients') ? 'text-white font-bold' : 'text-[#011413]'}`}
                        to={'/ingredients'}>
                        <PiCarrot className='size-5 mr-2' />
                        <p className='text-sm'>
                            Zutaten
                        </p>
                    </Link>
                </li>
                <li className='w-full'>
                    <Link
                        className={`relative py-1 cursor-pointer w-full flex flex-row justify-center items-center ${isActive('/tags') ? 'text-white font-bold' : 'text-[#011413]'}`}
                        to={'/tags'}>
                        <TbTag className='size-5 mr-2' />
                        <p className='text-sm'>
                            Tags
                        </p>
                    </Link>
                </li>
            </ul>
        </span >
    )
}

export default MealIngredientTagNavigation