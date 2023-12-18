import { Link } from 'react-router-dom'
import { Meal, MealTags } from '../Datatypes/Meal'
import { useEffect, useState } from 'react'
import { TagService } from '../Endpoints/TagService';
import Tag from './Tag';

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
            <Link className='w-full flex flex-row justify-start items-center' to={`/meals/${meal.id}`}>{meal.title}</Link>
            <div className='w-full flex flex-row flex-wrap justify-start items-center'>
                {tags?.tags.map(tag => (
                    <div className='my-1'>
                        <Tag title={tag} />

                    </div>
                ))}
            </div>
            <div className='w-full flex flex-row justify-end items-center'>
                <button onClick={() => deleteMeal(meal.id)} className='px-3 bg-red-400 py-1 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                    x
                </button>
            </div>

        </>

    )
}

export default MealListItem