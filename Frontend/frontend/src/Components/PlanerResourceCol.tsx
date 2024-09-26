import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import MealDragList from './MealDragList';
import { Meal } from '../Datatypes/Meal';
import { BiShuffle } from 'react-icons/bi';
import { TagDT } from '../Datatypes/Tag';
import { MealContext } from './MealContext';
import { getMealsFromTagList } from '../Endpoints/TagService';

type Props = {
    mealListID: string;
    onAddMeal?: (to: Date, mealId: number) => void;
}

function PlanerResourceCol({ mealListID, onAddMeal }: Props) {
    const context = useContext(MealContext);

    if (!context) {
        throw new Error('PlanerResourceCol must be used within a MealProvider');
    }
    const { meals, setMeals } = context;
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
    const [searchString, setSearchString] = useState<string>("");
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        setFilteredMeals(meals);
    }, [meals]);

    const searchForMeals = useCallback(async (search: string) => {
        if (search === "") {
            setFilteredMeals(meals);
        } else {
            const lowerCaseSearch = search.toLowerCase();
            const mealsFromTags = await Promise.all(
                (await getMealsFromTagList([new TagDT(lowerCaseSearch)])).map((tag) => tag.mealID)
            );

            const filtered = meals.filter((meal) =>
                meal.title.toLowerCase().includes(lowerCaseSearch) || mealsFromTags.includes(meal.id)
            );
            setFilteredMeals(filtered);
        }
    }, [meals]);

    useEffect(() => {
        if (searchString) {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            debounceTimeoutRef.current = globalThis.setTimeout(() => {
                searchForMeals(searchString.trim());
            }, 500);

            return () => {
                if (debounceTimeoutRef.current) {
                    clearTimeout(debounceTimeoutRef.current);
                }
            };
        } else {
            setFilteredMeals(meals);
        }
    }, [searchString, meals, searchForMeals]);


    function shuffle() {
        const shuffled = [...meals].sort(() => 0.5 - Math.random()).slice(0, 10);
        setMeals(shuffled);
    }


    return (
        <section className='flex-1 h-full flex flex-col sm:pr-6 sm:pl-4'>
            <span className='w-full flex flex-row justify-start mb-3'>
                <input
                    type="search"
                    value={searchString}
                    autoFocus={false}
                    onChange={(e) => setSearchString(e.target.value)}
                    className='bg-white w-full focus:ring-0 py-2 text-start shadow-md px-6 rounded-full mr-2'
                    placeholder='Rezepte Suchen ...' />
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
                            onAddMeal={onAddMeal}
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
