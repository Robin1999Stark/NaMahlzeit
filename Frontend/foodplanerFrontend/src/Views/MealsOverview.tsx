import React, { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService'
import { Link, useNavigate } from 'react-router-dom'
import PrimaryButton from '../Components/PrimaryButton';
import { Meal } from '../Datatypes/Meal';
import { TagService } from '../Endpoints/TagService';
import { Tag } from '../Datatypes/Tag';
import debounce from 'lodash/debounce';

function MealsOverview() {
    const navigate = useNavigate();
    const [meals, setMeals] = useState<Meal[]>();
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>();
    const [searchString, setSearchString] = useState<string>("");
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

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

    const debouncedSearchForMeals = debounce(searchForMeals, 500);

    async function searchForMeals(search: string) {
        if (search === undefined || search === null || search === "") {
            setFilteredMeals(meals);
        } else {
            let filteredMeals = meals;
            const lowerCaseSearch = search.toLowerCase();
            const mealsFromTags = await Promise.all(
                (await TagService.getMealTagsFromTagList([new Tag(lowerCaseSearch)])).map((tag) => tag.mealID)
            );

            filteredMeals = filteredMeals?.filter((meal) => {

                if (meal.title.toLowerCase().includes(lowerCaseSearch)) return true
                if (mealsFromTags.includes(meal.id)) return true
                return false
            });
            setFilteredMeals(filteredMeals);
        }
    }
    // Debounce the searchForMeals function with a delay before making the API call
    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeoutId = window.setTimeout(() => {
            searchForMeals(searchString.trim());
        }, 500);

        setDebounceTimeout(timeoutId);

        // Cleanup function to clear the timeout when the component unmounts or when searchString changes
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [searchString]);

    return (
        <>
            <div className='w-full my-4 flex flex-row justify-center'>
                <input type="text" value={searchString}
                    onChange={(e) => {
                        setSearchString(e.target.value);
                        // debounced search - delays search
                        if (debounceTimeout) {
                            clearTimeout(debounceTimeout);
                        }
                    }}
                    autoFocus={true}
                    className='bg-[#F2F2F2] w-1/2 py-3 text-center px-4 rounded-md m-3'
                    placeholder='Search for Meals' />
                <PrimaryButton title='Filter' onClick={() => searchForMeals(searchString)} />
            </div>
            <div className='flex flex-row justify-between w-full'>
                <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                    Meals ({meals?.length})
                </h1>
                <PrimaryButton title='+ Create Meal' onClick={() => navigate('/meals/create')} />
            </div>

            <ul className='mx-5'>
                {filteredMeals ? filteredMeals?.map((meal, index) => {
                    let prefix = <></>;
                    const firstChar = meal.title.charAt(0).toUpperCase();

                    if (index === 0) {
                        prefix = <li className='p-2 font-semibold text-lg text-[#74768C]' key={prefix + firstChar}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredMeals[index - 1];
                        if (lastElement.title.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-lg text-[#74768C]' key={prefix + firstChar}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }

                    }
                    return <>
                        {prefix}
                        <li key={meal.id} className='p-2 flex flex-row justify-between'>
                            <Link to={`/meals/${meal.id}`}>{meal.title}</Link>
                            <button onClick={() => deleteMeal(meal.id)} className='px-3 bg-red-400 py-1 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                                x
                            </button>
                        </li>
                    </>


                }
                ) : <></>}
            </ul>
        </>
    )
}
export default MealsOverview