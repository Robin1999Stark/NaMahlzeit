import React, { useEffect, useState } from 'react'
import { Ingredient, Meal } from '../Datatypes/Meal'
import { IngredientService } from '../Endpoints/IngredientService'
import { MealService } from '../Endpoints/MealService'
import { Link } from 'react-router-dom'

function MealsOverview() {

    const [meals, setMeals] = useState<Meal[]>()
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await MealService.getAllMeals()
                setMeals(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                Meals
            </h1>
            <ul className='mx-5'>
                {meals?.map(meal => (
                    <li key={meal.id} className='p-2'>
                        <Link to={`/meals/${meal.id}`}>{meal.title}</Link>
                    </li>))}
            </ul>
        </>
    )
}
export default MealsOverview