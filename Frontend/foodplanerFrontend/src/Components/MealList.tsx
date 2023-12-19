import React, { useEffect, useState } from 'react'
import AddMealButton from './AddMealButton';
import MealDragElement from './MealDragElement';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Meal } from '../Datatypes/Meal';

interface Props {
    listId: string,
    listType?: string,
    internalScroll?: boolean,
    isCombinedEnabled?: boolean,
    isMealList?: boolean,
    meals: Meal[],
    setMeals: React.Dispatch<React.SetStateAction<Meal[]>>,
};

function MealList({ listId, listType, internalScroll, meals, setMeals }: Props) {



    return (
        <div className='flex w-full flex-col items-center justify-start'>
            <Droppable
                droppableId={listId}
                type={listType}
                direction="vertical"
                isCombineEnabled={false}
            >
                {dropProvided => {
                    return (
                        <div
                            className='w-full'
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}>
                            {meals.map((food, index) => (
                                <Draggable
                                    key={listId + "-" + food.id + "-" + index}
                                    draggableId={listId + "-" + food.id + "-" + index}
                                    index={index}>
                                    {
                                        dragProvided => {
                                            return (
                                                <div
                                                    {...dragProvided.dragHandleProps}
                                                    {...dragProvided.draggableProps}
                                                    ref={dragProvided.innerRef}>
                                                    <MealDragElement mealID={food.id + ""} index={index} />

                                                </div>
                                            )
                                        }
                                    }
                                </Draggable>
                            ))}
                            <AddMealButton title='Remove' />

                            {dropProvided.placeholder}
                        </div>
                    )
                }}
            </Droppable>

        </div>

    )
}

export default MealList