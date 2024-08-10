import { useContext, useEffect, useState } from 'react'
import MealDragList from './MealDragList';
import { Meal } from '../Datatypes/Meal';
import { BiShuffle } from 'react-icons/bi';
import { TagDT } from '../Datatypes/Tag';
import { TagService } from '../Endpoints/TagService';
import { MealContext } from './MealContext';

type Props = {
    mealListID: string;
}

function PlanerResourceCol({ mealListID }: Props) {

    const context = useContext(MealContext);

    if (!context) {
        throw new Error('PlanerResourceCol must be used within a MealProvider');
    }


    const { meals, setMeals } = context;
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
    const [searchString, setSearchString] = useState<string>("");
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [shuffleFkt, _setShuffleFkt] = useState<(meals: Meal[], numberOfResults: number) => Meal[]>();

    useEffect(() => {
        setFilteredMeals(meals);
    }, [meals]);

    useEffect(() => {
        if (searchString) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeoutId = window.setTimeout(() => {
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
    }, [searchString, meals]);


    async function searchForMeals(search: string) {
        if (search === "") {
            setFilteredMeals(meals);
        } else {
            const lowerCaseSearch = search.toLowerCase();
            const mealsFromTags = await Promise.all(
                (await TagService.getMealTagsFromTagList([new TagDT(lowerCaseSearch)])).map((tag) => tag.mealID)
            );

            const filtered = meals.filter((meal) =>
                meal.title.toLowerCase().includes(lowerCaseSearch) || mealsFromTags.includes(meal.id)
            );
            setFilteredMeals(filtered);
        }
    }

    function shuffle() {
        console.log(meals)
        const shuffled = [...meals].sort(() => 0.5 - Math.random()).slice(0, 10);
        setMeals(shuffled);
    }


    return (
        <section className='flex-1 h-full flex flex-col pr-6 pl-4'>
            <span className='w-full flex flex-row justify-start mb-3'>
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
                    className='bg-white w-full focus:ring-0 py-2 text-start shadow-md px-6 rounded-full mr-2'
                    placeholder='Search for Meals' />
                <button
                    className='bg-[#046865] text-white p-3 rounded-full'
                    onClick={shuffle}>
                    <BiShuffle />
                </button>
            </span>
            <ul className='flex flex-col justify-start items-start w-full h-full overflow-y-scroll pr-4 pt-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#046865] scrollbar-track-slate-100'>
                <li className='w-full h-full flex flex-col justify-start'>
                    {
                        filteredMeals.length > 0 ? <MealDragList
                            meals={filteredMeals}
                            setMeals={setFilteredMeals}
                            internalScroll
                            key={mealListID}
                            listId={mealListID}
                            listType='LIST'
                        /> : <></>
                    }
                </li>
            </ul>
        </section>
    );
}


export default PlanerResourceCol
