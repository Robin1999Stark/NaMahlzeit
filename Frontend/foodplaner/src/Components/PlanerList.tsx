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
            <div className='flex flex-col justify-center items-center w-32 h-full rounded-xl p-2 bg-[#181818]'>
                <h2 className='text-white text-2xl font-semibold'>
                    {new Date(planerItem.date).getDate() + "." + new Date(planerItem.date).getMonth() + "."}

                </h2>
                <h3 className='font-base text-xs text-gray-500'>
                    {planerItem.date instanceof Date ? Weekday[planerItem.date.getDay()] : Weekday[new Date(planerItem.date).getDay()]}
                </h3>
            </div>

        )
    }
    const displayPlaceholder = () => {
        if (isMealList) {
            return <AddMealButton title='Remove' />
        }
        if (planerItem.meals.length === 0) {
            return <AddMealButton title='Add Meal' />
        }
        return <></>
    }
    return (
        <div className='flex w-full flex-row items-center justify-start'>

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
                            {planerItem.meals.map((food, index) => (
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
                            {displayPlaceholder()}

                            {dropProvided.placeholder}
                        </div>
                    )
                }}
            </Droppable>

        </div>


    )
}

export default PlanerList