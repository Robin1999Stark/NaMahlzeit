import React from 'react'
import DropMealPlaceholder from './DropMealPlaceholder';
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

function MealDragList({ listId, listType, meals }: Props) {
    return (
        <section className='flex w-full flex-col items-center justify-start'>
            <Droppable
                droppableId={listId}
                isDropDisabled={true}
                type={listType}
                direction="vertical"
                isCombineEnabled={false}
            >
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
                                                <MealDragElement mealID={food.id} dragProvided={dragProvided} snapshot={snapshot} index={index} />
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