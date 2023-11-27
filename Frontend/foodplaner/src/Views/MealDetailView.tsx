import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Ingredient, Meal } from '../Datatypes/Meal'
import { MealService } from '../Endpoints/MealService'
import { Link } from 'react-router-dom'

function MealDetailView() {
    const { mealID } = useParams()

    const [meal, setMeal] = useState<Meal>()
    const [error, setError] = useState<string>("")

    useEffect(() => {
        async function fetchMeal() {
            try {
                const response = await MealService.getMeal(mealID!)
                response ? setMeal(response) : setError("Error occured while fetching Meal")
            } catch (e) {
                console.log(e)
            }
        }
        fetchMeal();
    }, [])

    return (
        <>
            <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                {meal?.title}
            </h1>
            <blockquote className='mx-5 mb-4'>
                {meal?.description}
            </blockquote>
            <h3 className='truncate mx-5 my-2 text-lg font-semibold'>
                Ingredients:
            </h3>
            <ul className='mx-5'>
                {meal?.ingredients?.map(ingredient => (
                    <li key={ingredient} className='px-3 py-1'>
                        <Link to={`/ingredients/${ingredient}`}>{ingredient}</Link>
                    </li>))}
            </ul>
        </>
    )
}

export default MealDetailView