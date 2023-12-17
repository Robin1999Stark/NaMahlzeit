import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Ingredient, Meal } from '../Datatypes/Meal'
import { IngredientService } from '../Endpoints/IngredientService'
import URLify from '../Helperfunctions/urlify'

function IngredientDetailView() {
    const navigate = useNavigate();
    const { ingredientID } = useParams();

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
            <blockquote className='mx-5 mb-4 font-semibold'>
                prefered Unit:
                {" " + ingredient?.preferedUnit}
            </blockquote>
            <div className='w-full flex flex-row justify-start py-3 items-center'>
                <div className='mb-4 mx-6'>
                    <button className='p-2 bg-slate-500 text-white px-4 rounded-md text-lg' onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        </>
    )
}
export default IngredientDetailView