import React, { useEffect, useState } from 'react'
import MealList from './MealList';
import PlanerResourceColSearchOptions from './PlanerResourceColSearchOptions';
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

            <div className='flex flex-row h-20 justify-end'>
                <div className='w-[50%] flex flex-col justify-start'>
                    <button
                        className='bg-slate-500 m-2 p-1 mb-5'
                        onClick={() => shuffle(meals, shuffleFkt)}>
                        Shuffle
                    </button>
                    <MealList
                        meals={meals}
                        setMeals={setMeals}
                        internalScroll
                        key={mealListID}
                        listId={mealListID}
                        listType='LIST'
                    />

                </div>


            </div>

        </>

    )
}

export default PlanerResourceCol

/*
<div className='w-[10%]'>
                    <PlanerResourceColSearchOptions
                        shuffleFkt={shuffleFkt}
                        setShuffleFkt={setShuffleFkt}
                        meals={meals}
                        setMeals={setMeals}
                    />
                </div>
*/