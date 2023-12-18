import React, { useEffect, useState } from 'react'
import MealList from './MealList';
import { Meal } from '../Datatypes/Meal';
import { MealService } from '../Endpoints/MealService';

type Props = {
    mealListID: string;
}

function PlanerResourceCol({ mealListID }: Props) {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [shuffleFkt, setShuffleFkt] = useState<(meals: Meal[], numberOfResults: number) => Meal[]>();

    useEffect(() => {
        async function fetchData() {
            try {
                const data: Meal[] = await MealService.getAllMeals();
                setMeals(data)
            } catch (error) {
                console.error('Error fetching planer:', error);
            }
        }
        fetchData()
    }, [])
    function shuffleFromAll(meals: Meal[], numberOfResults: number): Meal[] {
        const shuffled = meals.sort((a, b) => 0.5 - Math.random()).slice(0, numberOfResults);
        return shuffled;
    }

    function shuffle(meals: Meal[], shuffleFkt: ((meals: Meal[], numberOfResults: number) => Meal[]) | undefined) {
        const shuffled = shuffleFromAll(meals, 10);
        setMeals(shuffled);
    }

    return (
        <>

            <div className='flex flex-col w-full h-full justify-between items-center'>
                <h2 className='mx-2 p-1 text-lg font-semibold'>MealList</h2>
                <div className='w-full xl:w-[70%] h-full overflow-y-scroll md:overflow-y-visible flex flex-col-reverse md:flex-col justify-start'>

                    <MealList
                        meals={meals}
                        setMeals={setMeals}
                        internalScroll
                        key={mealListID}
                        listId={mealListID}
                        listType='LIST'
                    />

                </div>
                <button
                    className='bg-slate-500 m-2 p-1 mb-5 w-full xl:w-2/3 min-w-[10rem]'
                    onClick={() => shuffle(meals, shuffleFkt)}>
                    Shuffle
                </button>

            </div>

        </>

    )
}

export default PlanerResourceCol
