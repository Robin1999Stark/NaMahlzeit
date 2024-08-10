import { Link } from 'react-router-dom'
import { Meal, MealTags } from '../Datatypes/Meal'
import { useEffect, useState } from 'react'
import { TagService } from '../Endpoints/TagService';
import Tag from './Tag';
import PlaceholderMealImage from './PlaceholderMealImage';

type Props = {
    meal: Meal,
    deleteMeal: (id: number) => Promise<void>,
}

function MealListItem({ meal, deleteMeal }: Props) {
    const [tags, setTags] = useState<MealTags>();
    useEffect(() => {

        async function fetchTags(id: number) {
            try {
                const response = await TagService.getAllTagsFromMeal(id);
                response ? setTags(response) : console.log("Error")
            } catch (error) {
                console.error("error");
            }
        }
        fetchTags(meal.id);
    }, [])

    return (
        <>

            <li
                className='select-none w-full h-full py-3 flex flex-row justify-between items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'>
                <article className='text-center  flex flex-row justify-start ml-3 items-center w-full whitespace-normal text-[#011413] text-base '>
                    <figure className='w-7 h-7 rounded-full mr-3'>
                        <PlaceholderMealImage rounded />
                    </figure>
                    <Link className='text-[#011413] underline' to={`/meals/${meal.id}`}>
                        <h3 className='text-start'>
                            {meal?.title}
                        </h3>
                    </Link>
                </article>
                <ul className='w-full'>
                    {tags?.tags.map(tag => (
                        <li className='my-1'>
                            <Tag title={tag} />
                        </li>
                    ))}
                </ul>

                <button className='mr-4' onClick={() => deleteMeal(meal.id)}>
                    Remove
                </button>
            </li>

        </>

    )
}

export default MealListItem