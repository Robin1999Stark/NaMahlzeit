import React from 'react'
import { FoodplanerItem } from '../Datatypes/Meal'
import AddMealButton from './AddMealButton';
import MealCard from './MealCard';
import { Draggable } from 'react-beautiful-dnd';

type Props = {
    planer: FoodplanerItem;
    index: number;
}

function MealList({ planer, index }: Props) {
    return (
        <ul key={'list' + index} className='flex flex-col justify-start'>
            {planer.food?.map((meal, index) => (

                <li key={index}>
                    <div


                        className='m-2 px-4 py-1 flex flex-row justify-center items-center rounded-md truncate bg-slate-300'>

                        <MealCard mealID={meal + ""} index={index} />
                    </div>
                </li>
            ))}

            <li>
                <AddMealButton title='Add Meal' />
            </li>

        </ul>
    )
}

export default MealList