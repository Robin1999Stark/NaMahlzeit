import { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService'
import { useNavigate } from 'react-router-dom'
import { Meal } from '../Datatypes/Meal';
import { TagService } from '../Endpoints/TagService';
import { TagDT } from '../Datatypes/Tag';
import debounce from 'lodash/debounce';
import MealListItem from '../Components/MealListItem';
import { MdAdd } from 'react-icons/md';
import { LuFilter, LuList, LuSquareStack } from 'react-icons/lu';
import MealCard from '../Components/MealCard';
import { PlanerService } from '../Endpoints/PlanerService';

function MealsOverview() {
    const navigate = useNavigate();
    const [meals, setMeals] = useState<Meal[]>();
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>();
    const [searchString, setSearchString] = useState<string>("");
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [isList, setIsList] = useState<boolean>(true);

    const handleAddMeal = async (to: Date, mealId: number) => {
        try {
            console.log(to)
            const addedPlanerItem = await PlanerService.addMealToPlaner(to, mealId);
            console.log(addedPlanerItem)
            if (!addedPlanerItem) {
                console.error('Failed to add meal to planner.');
                return;
            }
        } catch (error) {
            console.error('Error adding meal to planner:', error);
        }
    }
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

    debounce(searchForMeals, 500);

    async function searchForMeals(search: string) {
        if (search === undefined || search === null || search === "") {
            setFilteredMeals(meals);
        } else {
            let filteredMeals = meals;
            const lowerCaseSearch = search.toLowerCase();
            const mealsFromTags = await Promise.all(
                (await TagService.getMealTagsFromTagList([new TagDT(lowerCaseSearch)])).map((tag) => tag.mealID)
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
        if (searchString !== "" && searchString !== undefined && searchString !== null) {

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
        } else {
            setFilteredMeals(meals);
        }
    }, [searchString]);

    const mealList = () => {
        return (

            <ul className='mx-5'>
                {filteredMeals ? filteredMeals?.map((meal, index) => {
                    let prefix = <></>;
                    const firstChar = meal.title.charAt(0).toUpperCase();

                    if (index === 0) {
                        prefix = <li className='p-2 font-semibold text-base text-[#7A8587]' key={prefix + firstChar}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredMeals[index - 1];
                        if (lastElement.title.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-base text-[#7A8587]' key={prefix + firstChar}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }
                    }
                    return <>
                        {prefix}
                        <span
                            key={meal.id}
                            className='py-[0.2rem] px-2 flex flex-row justify-between overflow-hidden rounded-sm bg-white bg-opacity-10'>
                            <MealListItem
                                meal={meal}
                                addMealToPlaner={handleAddMeal}
                                deleteMeal={deleteMeal} />
                        </span>
                    </>
                }) : <></>}
            </ul>
        )
    }

    const mealCards = () => {
        return (
            <ul className='w-full h-full flex px-7 py-4 flex-row flex-wrap flex-grow'>
                {filteredMeals ? filteredMeals?.map((meal, _index) => {
                    return <li className='mr-2'>
                        <MealCard meal={meal} deleteMeal={deleteMeal} />
                    </li>
                }
                ) : <></>}
            </ul>
        )
    }

    return (
        <>
            {/* Only visible in mobile version */}
            <section className='w-full my-4 px-7 md:hidden flex flex-row items-center justify-between flex-grow '>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Rezepte ({filteredMeals?.length})
                </h1>
                <button
                    className='p-3 text-lg bg-[#046865] text-white rounded-full'
                    onClick={() => navigate('/meals/create')}  >
                    <MdAdd />
                </button>
            </section >

            <section className='w-full my-4 px-7 flex flex-row items-center justify-between flex-grow'>
                <h1 className='truncate text-[#011413] hidden md:block text-xl font-semibold flex-1'>
                    Rezepte ({filteredMeals?.length})
                </h1>
                <div className='flex flex-grow flex-row justify-center items-center'>
                    <input
                        type="text"
                        value={searchString}
                        onChange={(e) => {
                            setSearchString(e.target.value);
                            // debounced search - delays search
                            if (debounceTimeout) {
                                clearTimeout(debounceTimeout);
                            }
                        }}
                        autoFocus={true}
                        className='bg-white w-full focus:ring-0 py-2 text-start shadow-md px-6 rounded-full mr-2'
                        placeholder='Nach Rezepten Suchen ...' />
                    <button
                        className='p-3 text-lg bg-[#046865] text-white rounded-full'
                        onClick={() => searchForMeals(searchString)} >
                        <LuFilter />
                    </button>
                </div>
                <div className='flex-row flex-1 hidden md:flex justify-end items-center w-full '>
                    <button
                        className={`${isList ? 'text-[#FF6B00] border-[#FF6B00]' : 'text-[#046865] border-[#046865]'} invisible lg:visible border-2 rounded-full p-2.5 mr-3 text-lg`}
                        onClick={() => setIsList(true)} >
                        <LuList />
                    </button>
                    <button
                        className={`${!isList ? 'text-[#FF6B00] border-[#FF6B00]' : 'text-[#046865] border-[#046865]'} invisible lg:visible border-2 rounded-full p-2.5 mr-3 text-lg`}
                        onClick={() => setIsList(false)} >
                        <LuSquareStack />
                    </button>
                    <button
                        className='p-3 text-lg bg-[#046865] text-white rounded-full'
                        onClick={() => navigate('/meals/create')}  >
                        <MdAdd />
                    </button>
                </div>
            </section>

            {
                isList ? mealList() : mealCards()
            }
        </>
    )
}
export default MealsOverview