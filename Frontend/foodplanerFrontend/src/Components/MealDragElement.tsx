import { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService';
import { Meal } from '../Datatypes/Meal';
import { GrDrag } from 'react-icons/gr'
import PlaceholderMealImage from './PlaceholderMealImage';


type Props = {
    mealID: string
    index: number
}

function MealDragElement({ mealID, index }: Props) {
    const [meal, setMeal] = useState<Meal>();
    const [_error, setError] = useState<boolean>(false);
    useEffect(() => {
        async function fetchMeal() {
            try {
                const response = await MealService.getMeal(mealID)
                response ? setMeal(response) : setError(true)
            } catch (e) {
                console.log(e)
            }
        }
        fetchMeal()
    }, [])

    return (

        <div className='xl:mx-2 my-1 select-none h-full flex flex-row backdrop-filter backdrop-blur-lg justify-between items-center rounded-md font-semibold truncate border-2 border-solid border-[#18A192] bg-black bg-opacity-10'>
            <div className='bg-[#18A192] h-full py-5 px-2 text-[#C8FFF8]'>
                <GrDrag />

            </div>
            <h3 className='text-center flex flex-row justify-start items-center w-full whitespace-normal text-[#C8EFEA] font-semibold text-sm'>
                <div className='w-[3rem] ml-1 mr-3'>
                    <PlaceholderMealImage />
                </div>
                <h3 className='text-start'>
                    {meal?.title}

                </h3>

            </h3>
            <div></div>
        </div>


    )
}

export default MealDragElement