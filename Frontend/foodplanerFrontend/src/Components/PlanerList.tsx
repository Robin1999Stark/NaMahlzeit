import { useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import MealDragElement from './MealDragElement';
import { Weekday } from '../Datatypes/Weekday';
import AddMealButton from './AddMealButton';
import { FoodplanerItem } from '../Datatypes/FoodPlaner';

interface Props {
    planerItem: FoodplanerItem,
    listId: string,
    listType?: string,
    internalScroll?: boolean,
    isCombinedEnabled?: boolean,
};

function PlanerList({ listId, listType, planerItem }: Props) {
    const [isEmpty, setIsEmpty] = useState<boolean>(planerItem.meals.length === 0);

    useEffect(() => {
        if (planerItem.meals.length === 0) setIsEmpty(true)
        else setIsEmpty(false)
        console.log("test")
    }, [isEmpty])

    const displayTitle = () => {
        const isToday = new Date(Date.now()).getDate() === new Date(planerItem.date).getDate()

        return (
            <div className='flex select-none flex-row justify-between items-center min-h-[3rem]  w-full mb-2  h-full rounded-md px-4 bg-[#181818]'>
                <h2 className={isToday ? 'text-[#FFC200] text-2xl font-semibold' : 'text-white text-2xl font-semibold'}>
                    {new Date(planerItem.date).getDate() + "." + (new Date(planerItem.date).getMonth() + 1) + "."}
                </h2>
                <h3 className='font-base text-xs text-gray-500'>
                    {planerItem.date instanceof Date ? Weekday[planerItem.date.getDay()] : Weekday[new Date(planerItem.date).getDay()]}
                </h3>
            </div>

        )
    }
    const displayPlaceholder = () => {
        if (planerItem.meals.length === 0) {
            return <AddMealButton title='Add Meal' />
        }
        return <></>

    }
    return (
        <div className={'flex w-full flex-col items-start justify-start'} >

            {displayTitle()}


            <Droppable
                droppableId={listId}
                type={listType}
                direction="vertical"
                isCombineEnabled={false}
            >
                {(dropProvided, snapshot) => {
                    return (
                        <div
                            style={{ scrollbarWidth: 'none' }}
                            className={snapshot.isDraggingOver ? 'w-full h-[12rem] overflow-y-auto overflow-x-visible border-2 border-dotted border-[#FF6B00]' : 'w-full h-[12rem] overflow-y-scroll rounded-md border-2 border-dotted border-[#006054]'}
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}>
                            {planerItem.meals.map((food, index) => (
                                <Draggable
                                    key={listId + "-" + food + "-" + index}
                                    draggableId={listId + "-" + food + "-" + index}
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

                                                    <MealDragElement mealID={food + ""} index={index} />

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