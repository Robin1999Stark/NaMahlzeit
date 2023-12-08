import React from 'react'
import MealList from './MealList';
import PlanerResourceColSearchOptions from './PlanerResourceColSearchOptions';

type Props = {
    mealListID: string;

}

function PlanerResourceCol({ mealListID }: Props) {
    return (
        <div className='flex flex-row h-20 justify-end'>
            <div className='w-[50%]'>
                <MealList
                    internalScroll
                    key={mealListID}
                    listId={mealListID}
                    listType='LIST'
                />
            </div>
            <div className='w-[10%]'>
                <PlanerResourceColSearchOptions />
            </div>

        </div>

    )
}

export default PlanerResourceCol