import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Ingredient, IngredientAmount, Meal } from '../Datatypes/Meal'
import { MealService } from '../Endpoints/MealService'
import { Link } from 'react-router-dom'
import { MealIngredientService } from '../Endpoints/MealIngredientService'

function MealDetailView() {
    const { mealID } = useParams()

    const [meal, setMeal] = useState<Meal>()
    const [error, setError] = useState<string>("")
    const [mealIngredients, setMealIngredients] = useState<IngredientAmount[]>([])

    useEffect(() => {

        async function fetchMeal() {
            try {
                const response = await MealService.getMeal(mealID!)
                response ? setMeal(response) : setError("Error occured while fetching Meal")
            } catch (e) {
                console.log(e)
            }
        }


        async function fetchMealIngredients() {
            try {
                const response = await MealIngredientService.getAllMealIngredients(Number(mealID!))
                response ? setMealIngredients(response) : setMealIngredients([])
                console.log(mealIngredients)
            } catch (e) {
                console.log(e)
            }
        }
        async function fetchAllData() {
            try {
                await fetchMeal();
                await fetchMealIngredients();
            } catch (e) {
                console.log(e)
            }
        }
        fetchAllData()

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
            {
                mealIngredients ?
                    <ul className='mx-5'>
                        {mealIngredients?.map(ingredient => (
                            <li key={ingredient.ingredient + Math.random()} className='px-3 py-1'>
                                {ingredient.amount + " " + ingredient.unit + " "}<Link to={`/ingredients/${ingredient.ingredient}`}>{ingredient.ingredient}</Link>
                            </li>))}
                    </ul> : <h2>Loading ...</h2>
            }
        </>
    )
}

export default MealDetailView