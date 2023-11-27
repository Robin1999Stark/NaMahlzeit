import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ingredient, Meal } from '../Datatypes/Meal'
import { MealService } from '../Endpoints/MealService'
import { IngredientService } from '../Endpoints/IngredientService'

function IngredientsOverView() {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await IngredientService.getAllIngredients()
                setIngredients(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                Ingredients
            </h1>
            <ul className='mx-5'>
                {ingredients?.map(Ingredient => (
                    <li key={Ingredient.title} className='p-2'>
                        <Link to={`/ingredients/${Ingredient.title}`}>{Ingredient.title}</Link>
                    </li>))}
            </ul>
        </>
    )
}

export default IngredientsOverView