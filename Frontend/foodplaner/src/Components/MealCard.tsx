import React, { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService';
import { Meal } from '../Datatypes/Meal';
import { Draggable } from 'react-beautiful-dnd';

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

        <div
            className='m-2 px-4 py-1 flex flex-row justify-center items-center rounded-md truncate bg-slate-300'>
            {meal?.id}
            {meal?.title}
        </div>


    )
}

export default MealCard