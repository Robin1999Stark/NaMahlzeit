import React from 'react'
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

function MealList({ listId, listType, meals }: Props) {

    return (
        <div className='flex w-full flex-col items-center justify-start'>
            <Droppable
                droppableId={listId}
                isDropDisabled={true}
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
                                        (dragProvided, snapshot) => {
                                            return (
                                                <div
                                                    {...dragProvided.dragHandleProps}
                                                    {...dragProvided.draggableProps}
                                                    className='my-1 select-none h-full flex flex-row justify-between items-center rounded-md font-semibold truncate border-2 border-solid bg-[#17635A] border-[#18A192]'
                                                    style={{
                                                        left: '0 !important',
                                                        top: '0 !important',
                                                        bottom: '0 !important',
                                                        userSelect: 'none',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        width: '100%',
                                                        height: '4rem',
                                                        borderColor: snapshot.isDragging ? '#FF6B00' : '#18A192',
                                                        color: snapshot.isDragging ? '#FF6B00' : '#18A192',

                                                        ...dragProvided.draggableProps.style
                                                    }}
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