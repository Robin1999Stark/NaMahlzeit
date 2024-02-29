import { useEffect, useState } from 'react'
import MealDragList from './MealDragList';
import { Meal } from '../Datatypes/Meal';
import { MealService } from '../Endpoints/MealService';
import { BiShuffle } from 'react-icons/bi';
import debounce from 'lodash/debounce';
import { TagDT } from '../Datatypes/Tag';
import { TagService } from '../Endpoints/TagService';

type Props = {
    mealListID: string;
}

function PlanerResourceCol({ mealListID }: Props) {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
    const [searchString, setSearchString] = useState<string>("");
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [shuffleFkt, _setShuffleFkt] = useState<(meals: Meal[], numberOfResults: number) => Meal[]>();

    async function fetchData() {
        try {
            const data: Meal[] = await MealService.getAllMeals();
            const sortedMealsByTitle = data.sort((a, b) => a.title.localeCompare(b.title))
            setMeals(sortedMealsByTitle);
            setFilteredMeals(sortedMealsByTitle);

        } catch (error) {
            console.error('Error fetching planer:', error);
        }
    }
    useEffect(() => {

        fetchData()
    }, [])

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
    function shuffleFromAll(meals: Meal[], numberOfResults: number): Meal[] {
        const shuffled = meals.sort((_a, _b) => 0.5 - Math.random()).slice(0, numberOfResults);
        return shuffled;
    }

    function shuffle(meals: Meal[], _shuffleFkt: ((meals: Meal[], numberOfResults: number) => Meal[]) | undefined) {
        const shuffled = shuffleFromAll(meals, 10);
        setMeals(shuffled);
    }

    return (


        <ul className='flex flex-col w-full h-screen pt-4 justify-between items-center'>
            <li className='w-full flex flex-row justify-start mb-3'>
                <input
                    type="search"
                    value={searchString}
                    onChange={(e) => {
                        setSearchString(e.target.value);
                        // debounced search - delays search
                        if (debounceTimeout) {
                            clearTimeout(debounceTimeout);
                        }
                    }}
                    autoFocus={true}
                    className='bg-white  w-full focus:ring-0 py-2 text-center px-4 rounded-full  mr-2'
                    placeholder='Search for Meals' />
                <button
                    className='bg-[#046865] text-white p-3 rounded-full'
                    onClick={() => shuffle(meals, shuffleFkt)}>
                    <BiShuffle />
                </button>
            </li>

            <div className='w-full h-full overflow-y-scroll md:overflow-y-visible flex flex-col-reverse md:flex-col justify-start'>
                {
                    filteredMeals && setFilteredMeals ? <MealDragList
                        meals={filteredMeals}
                        setMeals={setFilteredMeals}
                        internalScroll
                        key={mealListID}
                        listId={mealListID}
                        listType='LIST'
                    /> : <></>
                }


            </div>


        </ul>


    )
}

export default PlanerResourceCol
