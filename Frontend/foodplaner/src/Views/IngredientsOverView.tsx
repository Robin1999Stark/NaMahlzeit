import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ingredient, Meal } from '../Datatypes/Meal'
import { IngredientService } from '../Endpoints/IngredientService'

function IngredientsOverView() {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    async function fetchData() {
        try {
            const data = await IngredientService.getAllIngredients()
            const sortedIngredientsByTitle = data.sort((a, b) => a.title.localeCompare(b.title))
            setIngredients(sortedIngredientsByTitle)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    async function deleteIngredient(ingredient: string) {
        try {
            await IngredientService.deleteIngredient(ingredient);
            fetchData();

        } catch (error) {
            console.log(error)
        }
    }

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
                    <li key={Ingredient.title} className='p-2 flex flex-row justify-between'>
                        <Link to={`/ingredients/${Ingredient.title}`}>{Ingredient.title}</Link>
                        <button onClick={() => deleteIngredient(Ingredient.title)} className='px-3 bg-red-400 py-1 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                            x
                        </button>
                    </li>)) : <h1>Loading...</h1>}
            </ul>
        </>
    )
}

export default IngredientsOverView