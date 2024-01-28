import { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService';
import { Meal } from '../Datatypes/Meal';
import { GrDrag } from 'react-icons/gr'


type Props = {
    mealID: string
    index?: number
}

function MealDragElement({ mealID }: Props) {
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

        <>
            <div className='bg-[#18A192] h-full py-5 px-2 text-[#C8FFF8]'>
                <GrDrag />

            </div>
            <div className='text-center flex flex-row justify-start ml-3 items-center w-full whitespace-normal text-[#C8EFEA] font-semibold text-sm'>

                <h3 className='text-start'>
                    {meal?.title}

                </h3>

            </div>
            <div></div>

        </>


    )
}

export default MealDragElement