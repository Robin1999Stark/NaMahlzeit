import { Link } from 'react-router-dom'
import { Meal, MealTags } from '../Datatypes/Meal'
import { useEffect, useState } from 'react'
import { TagService } from '../Endpoints/TagService';
import Tag from './Tag';
import PlaceholderMealImage from './PlaceholderMealImage';
import { MdDeleteForever } from 'react-icons/md';

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
            <div className='w-full flex flex-row items-center justify-start'>
                <div className='w-[4rem] md:w-full max-w-[4rem] min-w-[2rem] h-fit mr-4'>
                    <PlaceholderMealImage />
                </div>
                <Link className='w-full flex flex-row  text-lg font-semibold text-white underline justify-start items-center' to={`/meals/${meal.id}`}>{meal.title}</Link>
            </div>

            <div className='w-full hidden lg:flex flex-row flex-wrap justify-start items-center'>
                {tags?.tags.map(tag => (
                    <div className='my-1'>
                        <Tag title={tag} />
                    </div>
                ))}
            </div>
            <div className='w-fit flex flex-row flex-shrink justify-end items-center'>
                <button onClick={() => deleteMeal(meal.id)} className='px-3 bg-red-400 py-3 mx-2 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                    <MdDeleteForever />
                </button>
            </div>

        </>

    )
}

export default MealListItem