import React, { useEffect, useState } from 'react'
import { Ingredient, Meal } from '../Datatypes/Meal'
import { MealService } from '../Endpoints/MealService'
import { Link, useNavigate } from 'react-router-dom'
import PrimaryButton from '../Components/PrimaryButton';

function MealsOverview() {
    const navigate = useNavigate();
    const [meals, setMeals] = useState<Meal[]>();
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>();
    const [searchString, setSearchString] = useState<string>("");

    async function fetchData() {
        try {
            const data = await MealService.getAllMeals()
            const sortedMealsByTitle = data.sort((a, b) => a.title.localeCompare(b.title))
            setMeals(sortedMealsByTitle);
            setFilteredMeals(sortedMealsByTitle);
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

    function searchForMeals(search: string) {
        console.log(search)
        if (search === undefined || search === null || search === "") {
            setFilteredMeals(meals);
        } else {
            let filteredMeals = meals;
            const lowerCaseSearch = search.toLowerCase();
            filteredMeals = filteredMeals?.filter((meal) => meal.title.toLowerCase().includes(lowerCaseSearch));
            setFilteredMeals(filteredMeals);
        }
    }


    return (
        <>
            <div className='w-full my-4 flex flex-row justify-center'>
                <input type="text" value={searchString}
                    onChange={(e) => {
                        setSearchString(e.target.value);
                        searchForMeals(e.target.value.trim());
                    }}
                    className='bg-[#F2F2F2] w-1/2 py-3 px-4 rounded-md m-3'
                    placeholder='Search for Meals' />
                <PrimaryButton title='Filter' onClick={() => searchForMeals(searchString)} />
            </div>
            <div className='flex flex-row justify-between w-full'>
                <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                    Meals
                </h1>
                <PrimaryButton title='+ Create Meal' onClick={() => navigate('/meals/create')} />
            </div>

            <ul className='mx-5'>
                {filteredMeals?.map(meal => (
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