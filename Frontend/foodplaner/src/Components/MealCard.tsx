import React from 'react'
import { Meal } from '../Views/ReceipePlanerView'

type Props = {
    meal: Meal
}

function MealCard({ meal }: Props) {
    return (
        <div className='m-2 px-4 py-1 flex flex-row justify-center items-center rounded-md truncate bg-slate-300'>
            {meal.title}
        </div>
    )
}

export default MealCard