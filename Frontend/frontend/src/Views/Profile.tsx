import { Menu, MenuButton } from '@szhsin/react-menu'
import { IoIosMore } from 'react-icons/io'
import { exportMeals } from '../Endpoints/MealService'
import { exportTags } from '../Endpoints/TagService';
import { exportIngredients } from '../Endpoints/IngredientService';
import { MdOutlineFileDownload } from "react-icons/md";
function Profile() {

    async function handleDownloadMeals() {
        try {
            const response = await exportMeals();

            const blob = new Blob([JSON.stringify(response)], { type: 'application/json' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = 'meals.json';

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error exporting Meals: ', error);
        }
    }
    async function handleDownloadIngredients() {
        try {
            const response = await exportIngredients();

            const blob = new Blob([JSON.stringify(response)], { type: 'application/json' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = 'ingredients.json';

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error exporting Ingredients: ', error);
        }
    }
    async function handleDownloadTags() {
        try {
            const response = await exportTags();

            const blob = new Blob([JSON.stringify(response)], { type: 'application/json' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = 'tags.json';

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error exporting Tags: ', error);
        }
    }


    return (
        <>
            <section className='flex flex-col px-6 pt-4 h-full justify-start items-start'>

                <span className='flex mb-4 w-full flex-row justify-between items-center'>
                    <h1 className='font-semibold text-[#011413] text-xl'>
                        Profil
                    </h1>
                    <Menu menuButton={<MenuButton><IoIosMore className='size-5 mr-4 text-[#011413]' /></MenuButton>} transition>
                    </Menu>
                </span>
                <ul className='w-full'>
                    <li className='w-full mb-4 flex felx-col justify-between items-center'>
                        <h2 className='font-semibold text-[#011413] text-lg'>
                            Rezepte
                        </h2>
                        <span className='flex flex-row w-fit justify-end items-center'>
                            <label className='text-sm text-[#011413] font-semibold'>
                                Export JSON
                            </label>
                            <button
                                className='bg-[#046865] ml-2 w-fit text-white p-3 rounded-full'
                                onClick={() => handleDownloadMeals()}>
                                <MdOutlineFileDownload className='size-5' />
                            </button>
                        </span>
                    </li>
                    <li className='w-full mb-4 flex felx-col justify-between items-center'>
                        <h2 className=' font-semibold text-[#011413] text-lg'>
                            Zutaten
                        </h2>
                        <span className='flex flex-row w-fit justify-end items-center'>
                            <label className='text-sm text-[#011413] font-semibold'>
                                Export JSON
                            </label>
                            <button
                                className='bg-[#046865] ml-2 w-fit text-white p-3 rounded-full'
                                onClick={() => handleDownloadIngredients()}>
                                <MdOutlineFileDownload className='size-5' />
                            </button>
                        </span>
                    </li>
                    <li className='w-full mb-4 flex felx-col justify-between items-center'>
                        <h2 className=' font-semibold text-[#011413] text-lg'>
                            Tags
                        </h2>
                        <span className='flex flex-row w-fit justify-end items-center'>
                            <label className='text-sm text-[#011413] font-semibold'>
                                Export JSON
                            </label>
                            <button
                                className='bg-[#046865] ml-2 w-fit text-white p-3 rounded-full'
                                onClick={() => handleDownloadTags()}>
                                <MdOutlineFileDownload className='size-5' />
                            </button>
                        </span>
                    </li>
                </ul>
            </section>


        </>
    )
}

export default Profile