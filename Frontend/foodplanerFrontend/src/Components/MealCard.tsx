import React, { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService';
import { Meal } from '../Datatypes/Meal';
import { GrDrag } from 'react-icons/gr'


type Props = {
    mealID: string
    index: number
}

function MealCard({ mealID, index }: Props) {
    const [meal, setMeal] = useState<Meal>();
    const [error, setError] = useState<boolean>(false);
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

        <div className='xl:mx-2 my-1 px-4 select-none py-2 h-full flex flex-row justify-between items-center rounded-md font-semibold truncate border border-solid border-gray-400 bg-white'>
            <GrDrag className='text-gray-400' />
            <h3 className='text-center whitespace-normal font-medium text-sm'>
                {meal?.title}

            </h3>
            <div></div>
        </div>


    )
}

export default MealCard