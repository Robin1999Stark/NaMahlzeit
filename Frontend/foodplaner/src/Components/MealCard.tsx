import React, { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService';
import { Meal } from '../Datatypes/Meal';

type Props = {
    mealID: string
}

function MealCard({ mealID }: Props) {
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
        <div className='m-2 px-4 py-1 flex flex-row justify-center items-center rounded-md truncate bg-slate-300'>
            {meal?.title}
        </div>
    )
}

export default MealCard