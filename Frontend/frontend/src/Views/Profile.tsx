import { Menu, MenuButton } from '@szhsin/react-menu'
import { IoIosMore } from 'react-icons/io'
import { exportMeals } from '../Endpoints/MealService'
import { exportTags } from '../Endpoints/TagService';
import { exportIngredients } from '../Endpoints/IngredientService';

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

                <span className='flex w-full flex-row justify-between items-center'>
                    <h1 className='mb-4 font-semibold text-[#011413] text-xl'>
                        Profil
                    </h1>
                    <Menu menuButton={<MenuButton><IoIosMore className='size-5 mr-4 text-[#011413]' /></MenuButton>} transition>
                    </Menu>
                </span>
                <ul>
                    <li className='w-full flex felx-col justify-start items-start'>
                        <h2 className='mb-4 font-semibold text-[#011413] text-lg'>
                            Rezepte
                        </h2>
                        <button onClick={() => handleDownloadMeals()}>
                            Download
                        </button>

                    </li>
                    <li className='w-full flex felx-col justify-start items-start'>
                        <h2 className='mb-4 font-semibold text-[#011413] text-lg'>
                            Zutaten
                        </h2>
                        <button onClick={() => handleDownloadIngredients()}>
                            Download
                        </button>
                    </li>
                    <li className='w-full flex felx-col justify-start items-start'>
                        <h2 className='mb-4 font-semibold text-[#011413] text-lg'>
                            Tags
                        </h2>
                        <button onClick={() => handleDownloadTags()}>
                            Download
                        </button>
                    </li>
                </ul>
            </section>


        </>
    )
}

export default Profile