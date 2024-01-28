import React from 'react'
import { Meal } from '../Datatypes/Meal';

type Props = {
    meals?: Meal[],
    setMeals?: React.Dispatch<React.SetStateAction<Meal[]>>,
    shuffleFkt?: ((meals: Meal[], numberOfResults: number) => Meal[]) | undefined,
    setShuffleFkt: React.Dispatch<React.SetStateAction<((meals: Meal[], numberOfResults: number) => Meal[]) | undefined>>
}

function PlanerResourceColSearchOptions({ setShuffleFkt }: Props) {

    function shuffleFromAll(meals: Meal[], _numberOfResults: number): Meal[] {
        const shuffled = meals.sort((_a, _b) => 0.5 - Math.random());
        return shuffled;
    }

    function shuffleFromLibrary(meals: Meal[], _numberOfResults: number): Meal[] {
        const shuffled = meals.sort((_a, _b) => 0.5 - Math.random());
        return shuffled;
    }

    const options = [
        { title: 'Random Shuffle', icon: <></>, fkt: shuffleFromAll },
        { title: 'Random Shuffle', icon: <></>, fkt: shuffleFromLibrary },
    ];

    return (
        <>
            {options.map(opt => <button
                onClick={() => {
                    setShuffleFkt(opt.fkt);
                }} className='bg-slate-500 m-2 p-1'>
                {opt.title}
            </button>)}
        </>
    )
}

export default PlanerResourceColSearchOptions