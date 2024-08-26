import React from 'react'
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
    onAddMeal?: (to: Date, mealId: number) => void,
};

function MealDragList({ listId, listType, meals, onAddMeal }: Props) {
    return (
        <section className='flex w-full flex-col items-center justify-start'>
            <Droppable
                droppableId={listId}
                isDropDisabled={true}
                type={listType}
                direction="vertical"
                isCombineEnabled={false}>
                {dropProvided => {
                    return (
                        <ul
                            className='w-full'
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}>
                            {meals.map((food, index) => (
                                <Draggable
                                    key={listId + "-" + food.id}
                                    draggableId={listId + "-" + food.id}
                                    index={index}>
                                    {
                                        (dragProvided, snapshot) => {
                                            return (
                                                <MealDragElement
                                                    mealID={food.id}
                                                    dragProvided={dragProvided}
                                                    snapshot={snapshot}
                                                    index={index}
                                                    onAddMeal={onAddMeal}
                                                    date={new Date(Date.now())}
                                                    showMore={false} />
                                            )
                                        }
                                    }
                                </Draggable>
                            ))}
                            {dropProvided.placeholder}
                        </ul>
                    )
                }}
            </Droppable>

        </section>

    )
}

export default MealDragList