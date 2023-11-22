import React from 'react';
import { FoodplanerItem, Meal } from '../Datatypes/Meal';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import MealCard from './MealCard';
import { Weekday } from '../Datatypes/Weekday';
import AddMealButton from './AddMealButton';

interface Props {
    planerItem: FoodplanerItem,
    listId: string,
    listType?: string,
    internalScroll?: boolean,
    isCombinedEnabled?: boolean,
    isMealList?: boolean,
};

function PlanerList({ listId, listType, planerItem, isMealList = false }: Props) {
    const displayTitle = () => {
        if (isMealList) {
            return (<h2>Meallist</h2>)
        }
        return (
            <h2>
                {planerItem.date instanceof Date ? Weekday[planerItem.date.getDay()] : Weekday[new Date(planerItem.date).getDay()]}
            </h2>
        )
    }
    return (
        <div className='flex w-full flex-col items-center justify-start'>

            {displayTitle()}

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
                            {planerItem.food.map((food, index) => (
                                <Draggable
                                    key={listId + "-" + food + "-" + index}
                                    draggableId={listId + "-" + food + "-" + index}
                                    index={index}>
                                    {
                                        dragProvided => {
                                            return (
                                                <div
                                                    {...dragProvided.dragHandleProps}
                                                    {...dragProvided.draggableProps}
                                                    ref={dragProvided.innerRef}>
                                                    <MealCard mealID={food + ""} index={index} />

                                                </div>
                                            )
                                        }
                                    }
                                </Draggable>
                            ))}
                            {isMealList ? <AddMealButton title='Remove' /> : <AddMealButton title='Add Meal' />}

                            {dropProvided.placeholder}
                        </div>
                    )
                }}
            </Droppable>

        </div>


    )
}

export default PlanerList