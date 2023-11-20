import React, { useEffect, useState } from 'react'
import { FoodplanerItem, Meal } from '../Datatypes/Meal';
import { PlanerService } from '../Endpoints/PlanerService';
import { MealService } from '../Endpoints/MealService';
import MealCard from './MealCard';
import { DragDropContext } from 'react-beautiful-dnd';

function MealList() {


    const [meals, setMeals] = useState<Meal[]>();

    useEffect(() => {

        async function fetchData() {
            try {
                const data: Meal[] = await MealService.getAllMeals();
                setMeals(data)
            } catch (error) {
                console.error('Error fetching meals:', error);
            }
        }
        fetchData()
    }, [])


    return (
        <div className='w-full'>
            <ul className='p-4'>
                {meals?.map(meal => (
                    <li className='my-3'>
                        <MealCard mealID={meal.id + ""} />
                    </li>))}
            </ul>
        </div>
    )
}

export default MealList