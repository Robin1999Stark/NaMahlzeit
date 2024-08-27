import { useLocation, Link } from 'react-router-dom';
import { PiBowlFood } from "react-icons/pi";
import { PiCarrot } from "react-icons/pi";
import { TbTag } from "react-icons/tb";

function MealIngredientTagNavigation() {

    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <span className='absolute left-0 right-0 py-1 bottom-20 bg-white'>
            <ul className='flex flex-row justify-between mx-4 items-center bg-[#E8E9EB] rounded-full p-1'>
                {
                    (() => {
                        const showActive = isActive('/meals')
                        return (
                            <li className='w-full'>
                                <Link
                                    className={`${showActive ? 'bg-[#004A41] text-white font-bold' : 'text-[#011413]'} py-1 cursor-pointer w-full flex flex-row justify-center items-center rounded-full`}
                                    to={'/meals'}>
                                    <PiBowlFood className='size-5 mr-2' />
                                    <p className='text-sm'>
                                        Rezepte
                                    </p>
                                </Link>
                            </li>
                        );
                    })()
                }
                {
                    (() => {
                        const showActive = isActive('/ingredients')
                        return (
                            <li className='w-full'>
                                <Link
                                    className={`${showActive ? 'bg-[#004A41] text-white font-bold' : 'text-[#011413]'} py-1 cursor-pointer w-full flex flex-row justify-center items-center rounded-full`}
                                    to={'/ingredients'}>
                                    <PiCarrot className='size-5 mr-2' />
                                    <p className='text-sm'>
                                        Zutaten
                                    </p>
                                </Link>
                            </li>
                        );
                    })()
                }
                {
                    (() => {
                        const showActive = isActive('/tags')
                        return (
                            <li className='w-full'>
                                <Link
                                    className={`${showActive ? 'bg-[#004A41] text-white font-bold' : 'text-[#011413]'} py-1 cursor-pointer w-full flex flex-row justify-center items-center rounded-full`}
                                    to={'/tags'}>
                                    <TbTag className='size-5 mr-2' />
                                    <p className='text-sm'>
                                        Tags
                                    </p>
                                </Link>
                            </li>
                        );
                    })()
                }
            </ul>
        </span >
    )
}

export default MealIngredientTagNavigation