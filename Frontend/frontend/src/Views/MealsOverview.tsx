import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Meal } from '../Datatypes/Meal';
import { TagDT } from '../Datatypes/Tag';
import debounce from 'lodash/debounce';
import MealListItem from '../Components/MealListItem';
import { MdAdd } from 'react-icons/md';
import { LuFilter, LuList, LuSquareStack } from 'react-icons/lu';
import MealCard from '../Components/MealCard';
import { addMealToPlaner } from '../Endpoints/PlanerService';
import { deleteMeal, getAllMeals } from '../Endpoints/MealService';
import { getMealTagsFromTagList } from '../Endpoints/TagService';

function MealsOverview() {
    const navigate = useNavigate();
    const [meals, setMeals] = useState<Meal[]>();
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>();
    const [searchString, setSearchString] = useState<string>("");
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [isList, setIsList] = useState<boolean>(true);

    const handleAddMeal = async (to: Date, mealId: number) => {
        try {
            const addedPlanerItem = await addMealToPlaner(to, mealId);
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
            const data = await getAllMeals()
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

    async function handleDeleteMeal(id: number) {
        try {
            await deleteMeal(id);
            fetchData();
        } catch (error) {
            console.log(error)
        }
    }


    const searchForMeals = useCallback(async (search: string) => {
        if (!search) {
            setFilteredMeals(meals);
            return;
        }

        const lowerCaseSearch = search.toLowerCase();
        const mealsFromTags = await Promise.all(
            (await getMealTagsFromTagList([new TagDT(lowerCaseSearch)])).map((tag) => tag.mealID)
        );
        if (!meals) return;

        const filtered = meals.filter((meal) => {
            return meal.title.toLowerCase().includes(lowerCaseSearch) || mealsFromTags.includes(meal.id);
        });

        setFilteredMeals(filtered);
    }, [meals]);

    debounce(searchForMeals, 500);

    // Debounce the searchForMeals function with a delay before making the API call
    useEffect(() => {
        if (searchString !== "" && searchString !== undefined && searchString !== null) {

            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeoutId = globalThis.setTimeout(() => {
                searchForMeals(searchString.trim());
            }, 500);

            setDebounceTimeout(timeoutId);

            return () => {
                if (debounceTimeout) {
                    clearTimeout(debounceTimeout);
                }
            };
        } else {
            setFilteredMeals(meals);
        }
    }, [searchString, meals, searchForMeals]);

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
                                deleteMeal={handleDeleteMeal} />
                        </span>
                    </>
                }) : <></>}
            </ul>
        )
    }

    const mealCards = () => {
        return (
            <ul className='w-full h-full flex px-7 py-4 flex-row flex-wrap flex-grow'>
                {filteredMeals ? filteredMeals?.map((meal,) => {
                    return <li className='mr-2'>
                        <MealCard meal={meal} deleteMeal={handleDeleteMeal} />
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
                        autoFocus={false}
                        className='bg-white w-full focus:ring-0 py-2 text-start shadow-md px-6 rounded-full mr-2'
                        placeholder='Rezepte Suchen ...' />
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