import React, { useEffect, useState } from 'react'
import { Ingredient, Meal } from '../Datatypes/Meal'
import { MealService } from '../Endpoints/MealService'
import { Link, useNavigate } from 'react-router-dom'
import PrimaryButton from '../Components/PrimaryButton';

function MealsOverview() {
    const navigate = useNavigate();
    const [meals, setMeals] = useState<Meal[]>();
    async function fetchData() {
        try {
            const data = await MealService.getAllMeals()
            const sortedMealsByTitle = data.sort((a, b) => a.title.localeCompare(b.title))
            setMeals(sortedMealsByTitle)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    async function deleteMeal(id: number) {
        try {
            await MealService.deleteMeal(id);
            fetchData();
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div className='flex flex-row justify-between w-full'>
                <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                    Meals
                </h1>
                <PrimaryButton title='+ Create Meal' onClick={() => navigate('/meals/create')} />
            </div>

            <ul className='mx-5'>
                {meals?.map(meal => (
                    <li key={meal.id} className='p-2 flex flex-row justify-between'>
                        <Link to={`/meals/${meal.id}`}>{meal.title}</Link>
                        <button onClick={() => deleteMeal(meal.id)} className='px-3 bg-red-400 py-1 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                            x
                        </button>
                    </li>))}
            </ul>
        </>
    )
}
export default MealsOverview