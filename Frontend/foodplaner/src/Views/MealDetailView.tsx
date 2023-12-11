import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Ingredient, IngredientAmount, Meal } from '../Datatypes/Meal'
import { MealService } from '../Endpoints/MealService'
import { Link } from 'react-router-dom'
import { MealIngredientService } from '../Endpoints/MealIngredientService'
import PlaceholderMealImage from '../Components/PlaceholderMealImage'

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
            <div className='flex flex-wrap mt-12'>
                <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4 flex flex-row justify-center items-start">
                    <div className='w-full max-w-[42rem] min-w-[200px]'>
                        <PlaceholderMealImage />
                    </div>

                </div>
                <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4 min-w-[200px]">
                    <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                        {meal?.title}
                    </h1>
                    <blockquote className='mx-6 mb-6 text-base font-medium text-[#3E4C62]'>
                        {meal?.description}
                    </blockquote>
                    <div className='bg-[#D6D9DE] text-[#272727] py-3 rounded-lg min-w-[200px]'>
                        <h3 className='truncate mx-5 my-2 text-lg font-bold text-[#181818]'>
                            Ingredients:
                        </h3>
                        {
                            mealIngredients ?
                                <ul className='mx-5 h-full my-2 text-[#1F2632]'>
                                    {mealIngredients?.map(ingredient => (
                                        <li key={ingredient.ingredient + Math.random()} className='px-3 py-1 w-full flex flex-row text-base font-semibold justify-between'>
                                            <Link to={`/ingredients/${ingredient.ingredient}`}>{ingredient.ingredient}</Link>
                                            {ingredient.amount + " " + ingredient.unit + " "}

                                        </li>))}
                                </ul> : <h2>Loading ...</h2>
                        }
                    </div>

                </div>
                <div className='p-4 mx-4 w-full flex flex-col justify-start items-center'>
                    <article className='my-6'>
                        <h2 className='text-xl mb-2 font-semibold text-center'>
                            Step 1:
                        </h2>
                        <p className='text-base text-center font-medium text-[#3E4C62]'>
                            Lorem ipsum dolor sit amet consectetur. Amet enim venenatis adipiscing mauris eget nullam felis semper. Sapien et urna viverra habitasse proin turpis ultrices in. Id scelerisque at tempus et elementum malesuada augue. Feugiat libero eu nulla enim natoque urna vel.
                        </p>
                    </article>
                    <article className='my-6'>
                        <h2 className='text-xl mb-2 font-semibold text-center'>
                            Step 2:
                        </h2>
                        <p className='text-base text-center font-medium text-[#3E4C62]'>
                            Lorem ipsum dolor sit amet consectetur. Amet enim venenatis adipiscing mauris eget nullam felis semper. Sapien et urna viverra habitasse proin turpis ultrices in. Id scelerisque at tempus et elementum malesuada augue. Feugiat libero eu nulla enim natoque urna vel.
                        </p>
                    </article>
                    <article className='my-6'>
                        <h2 className='text-xl mb-2 font-semibold text-center'>
                            Step 3:
                        </h2>
                        <p className='text-base text-center font-medium text-[#3E4C62]'>
                            Lorem ipsum dolor sit amet consectetur. Amet enim venenatis adipiscing mauris eget nullam felis semper. Sapien et urna viverra habitasse proin turpis ultrices in. Id scelerisque at tempus et elementum malesuada augue. Feugiat libero eu nulla enim natoque urna vel.
                        </p>
                    </article>

                </div>


            </div>

        </>
    )
}

export default MealDetailView