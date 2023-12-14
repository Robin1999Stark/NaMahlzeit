import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Ingredient, Meal } from '../Datatypes/Meal'
import { MealService } from '../Endpoints/MealService'
import { IngredientService } from '../Endpoints/IngredientService'
import URLify from '../Helperfunctions/urlify'

function IngredientDetailView() {
    const { ingredientID } = useParams()

    const [ingredient, setIngredient] = useState<Ingredient>()
    const [error, setError] = useState<string>("")

    useEffect(() => {
        async function fetchMeal() {
            try {
                const response = await IngredientService.getIngredient(ingredientID!)
                response ? setIngredient(response) : setError("Error occured while fetching Ingredient")
            } catch (e) {
                console.log(e)
            }
        }
        fetchMeal();
    }, [])

    return (
        <>
            <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                {ingredient?.title}
            </h1>
            <blockquote className='mx-5 mb-4'>
                {ingredient?.description ? <URLify text={ingredient?.description} /> : <></>}
            </blockquote>
        </>
    )
}
export default IngredientDetailView