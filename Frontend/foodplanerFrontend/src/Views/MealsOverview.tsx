import { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService'
import { useNavigate } from 'react-router-dom'
import { Meal } from '../Datatypes/Meal';
import { TagService } from '../Endpoints/TagService';
import { TagDT } from '../Datatypes/Tag';
import debounce from 'lodash/debounce';
import MealListItem from '../Components/MealListItem';
import ButtonRound from '../Components/ButtonRound';
import { MdAdd } from 'react-icons/md';
import { LuFilter, LuList, LuSquareStack } from 'react-icons/lu';
import MealCard from '../Components/MealCard';

function MealsOverview() {
    const navigate = useNavigate();
    const [meals, setMeals] = useState<Meal[]>();
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>();
    const [searchString, setSearchString] = useState<string>("");
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [isList, setIsList] = useState<boolean>(true);

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
                        prefix = <li className='p-2 font-semibold text-lg text-[#57D1C2]' key={prefix + firstChar}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredMeals[index - 1];
                        if (lastElement.title.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-lg text-[#57D1C2]' key={prefix + firstChar}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }

                    }
                    return <>
                        {prefix}
                        <li
                            key={meal.id}
                            className='py-4 px-2 my-4 flex flex-row justify-between overflow-hidden rounded-sm bg-white bg-opacity-10'>
                            <MealListItem meal={meal} deleteMeal={deleteMeal} />
                        </li>
                    </>


                }
                ) : <></>}
            </ul>
        )
    }

    const mealCards = () => {
        return (
            <div className='w-full h-full flex flex-row flex-wrap flex-grow'>
                {filteredMeals ? filteredMeals?.map((meal, index) => {
                    return <>
                        <MealCard meal={meal} deleteMeal={deleteMeal} />
                    </>
                }
                ) : <></>}
            </div>
        )
    }

    return (
        <>
            <div className='w-full my-4 flex flex-row justify-between flex-grow'>
                <div className='flex-1 hidden lg:flex'></div>
                <div className=' flex flex-grow flex-row justify-center items-center'>
                    <input type="text" value={searchString}
                        onChange={(e) => {
                            setSearchString(e.target.value);
                            // debounced search - delays search
                            if (debounceTimeout) {
                                clearTimeout(debounceTimeout);
                            }
                        }}
                        autoFocus={true}
                        className='bg-[rgba(237, 237, 240, 0.85)] w-full focus:ring-0 lg:w-2/3 py-3 text-center px-4 rounded-full my-3 ml-3 mr-2'
                        placeholder='Search for Meals' />
                    <ButtonRound className='my-3 mr-3 text-xl' onClick={() => searchForMeals(searchString)} >
                        <LuFilter />
                    </ButtonRound>
                </div>

                <div className='flex-row flex-1 hidden md:flex justify-end items-center w-full'>
                    <ButtonRound className={isList ? ' text-[#FF6B00] border-[#FF6B00] my-3 mr-2 text-xl' : 'my-3 mr-2 text-xl'} onClick={() => setIsList(true)} >
                        <LuList />
                    </ButtonRound>
                    <ButtonRound className={!isList ? ' text-[#FF6B00] border-[#FF6B00] my-3 mr-3 text-xl' : 'my-3 mr-3 text-xl'} onClick={() => setIsList(false)} >
                        <LuSquareStack />
                    </ButtonRound>

                </div>

            </div>
            <div className='flex flex-row justify-between w-full'>
                <h1 className='truncate text-[#57D1C2] mx-5 my-5 text-2xl font-semibold'>
                    Meals ({filteredMeals?.length})
                </h1>
                <ButtonRound
                    className='m-3 text-xl'
                    onClick={() => navigate('/meals/create')}  >
                    <MdAdd />
                </ButtonRound>
            </div>

            {
                isList ? mealList() : mealCards()
            }
        </>
    )
}
export default MealsOverview