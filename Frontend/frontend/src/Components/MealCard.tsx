import { useEffect, useState } from 'react'
import { Meal, MealTags } from '../Datatypes/Meal'
import PlaceholderMealImage from './PlaceholderMealImage'
import { TagService } from '../Endpoints/TagService';
import Tag from './Tag';
import { Link } from 'react-router-dom';


type Props = {
    meal: Meal,
    deleteMeal?: (id: number) => Promise<void>,
}


function MealCard({ meal }: Props) {

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
        <div className='min-w-[14rem] max-w-[28rem] flex-grow flex-1 m-5 pb-4 rounded-md flex flex-col items-center justify-start bg-white bg-opacity-10 p-2'>
            <div className='w-full'>
                <PlaceholderMealImage />
            </div>
            <Link className='w-full flex flex-row  text-lg font-semibold justify-start py-2 px-5 items-center text-[#DFF9FF]' to={`/meals/${meal.id}`}>{meal.title}</Link>

            <blockquote className='flex flex-row justify-start items-center w-full px-5 text-base text-[#DFF9FF]'>
                {meal.description}
            </blockquote>
            <div className='flex flex-row justify-start items-center flex-wrap px-5 my-2 w-full'>
                {
                    tags ? tags.tags.map((tag) =>
                        <div className='py-1'>
                            <Tag title={tag} />
                        </div>
                    ) : <></>
                }
            </div>

        </div>

    )
}

export default MealCard
