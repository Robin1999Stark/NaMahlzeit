import { useEffect, useState } from 'react'
import { Meal, MealTags } from '../Datatypes/Meal'
import PlaceholderMealImage from './PlaceholderMealImage'
import Tag from './Tag';
import { Link } from 'react-router-dom';
import { getAllTagsFromMeal } from '../Endpoints/TagService';


type Props = {
    meal: Meal,
    deleteMeal?: (id: number) => Promise<void>,
}


function MealCard({ meal }: Props) {

    const [tags, setTags] = useState<MealTags>();
    const [imageError, setImageError] = useState<boolean>(false);

    useEffect(() => {

        async function fetchTags(id: number) {
            try {
                const response = await getAllTagsFromMeal(id);
                response ? setTags(response) : console.log("Error")
            } catch (_error) {
                console.error("error", _error);
            }
        }
        fetchTags(meal.id);
    }, [meal]);

    function handleImageError() {
        setImageError(true);
    }

    return (
        <section className='min-w-[8rem] max-w-[12rem] flex-grow flex-1 pb-4 rounded-md h-fit flex flex-col items-center justify-start bg-white p-2'>
            <span className='w-full'>
                {imageError || !meal?.picture ? (
                    <PlaceholderMealImage />
                ) : (
                    <img
                        src={meal.picture}
                        alt="Meal"
                        className='w-full h-full object-cover aspect-square'
                        onError={handleImageError}
                    />
                )}
            </span>

            <Link className='w-full flex flex-row text-base underline font-semibold justify-start py-2 px-3 items-center text-[#011413]' to={`/meals/${meal.id}`}>{meal.title}</Link>
            <ul className='flex flex-row justify-start items-center flex-wrap px-3 my-2 w-full'>
                {
                    tags ? tags.tags.map((tag) =>
                        <li className='py-1'>
                            <Tag title={tag} />
                        </li>
                    ) : <></>
                }
            </ul>
        </section>

    )
}

export default MealCard
