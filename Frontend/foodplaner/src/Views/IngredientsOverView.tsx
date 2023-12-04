import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ingredient, Meal } from '../Datatypes/Meal'
import { IngredientService } from '../Endpoints/IngredientService'

function IngredientsOverView() {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await IngredientService.getAllIngredients()
                const sortedIngredientsByTitle = data.sort((a, b) => a.title.localeCompare(b.title))
                setIngredients(sortedIngredientsByTitle)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <div className='flex flex-row justify-between w-full'>
                <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                    Ingredients
                </h1>
                <div className='bg-slate-600 my-3 px-3 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                    <Link to={'/ingredients/create'}>+ Create Ingredient</Link>
                </div>
            </div>

            <ul className='mx-5'>
                {ingredients ? ingredients?.map(Ingredient => (
                    <li key={Ingredient.title} className='p-2'>
                        <Link to={`/ingredients/${Ingredient.title}`}>{Ingredient.title}</Link>
                    </li>)) : <h1>Loading...</h1>}
            </ul>
        </>
    )
}

export default IngredientsOverView