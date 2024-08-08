import { useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import MealDragElement from './MealDragElement';
import { Weekday } from '../Datatypes/Weekday';
import DropMealPlaceholder from './DropMealPlaceholder';
import { FoodplanerItem } from '../Datatypes/FoodPlaner';
import { FaCheckCircle } from 'react-icons/fa';
import { IoMdWarning } from "react-icons/io";

interface Props {
    planerItem: FoodplanerItem,
    listId: string,
    listType?: string,
    internalScroll?: boolean,
    isCombinedEnabled?: boolean,
};

function MealDropList({ listId, listType, planerItem }: Props) {
    const [isEmpty, setIsEmpty] = useState<boolean>(planerItem.meals.length === 0);
    const [mealIDs, setMealIDs] = useState<number[]>(planerItem.meals)

    useEffect(() => {
        if (isEmpty)
            setIsEmpty(true)
        else
            setIsEmpty(false)
    }, [mealIDs.length])

    const displayTitle = (isEmpty: boolean) => {
        const isToday = new Date(Date.now()).getDate() === new Date(planerItem.date).getDate()

        return (
            <span className='flex select-none flex-row justify-start items-center w-full rounded-md my-4'>
                {isEmpty ? <IoMdWarning className='w-5 h-5 text-[#F96E46] mr-2' /> : <FaCheckCircle className='w-5 h-5 text-[#046865] mr-2' />}

                <h2 className={isToday ? 'text-[#046865] text-base font-bold' : 'text-[#7A8587] text-base font-bold'}>
                    {planerItem.date instanceof Date ? Weekday[planerItem.date.getDay()] : Weekday[new Date(planerItem.date).getDay()]}
                    {", " + new Date(planerItem.date).getDate() + "." + (new Date(planerItem.date).getMonth() + 1) + "." + (new Date(planerItem.date).getFullYear())}
                </h2>
            </span>

        )
    }
    const displayPlaceholder = () => {
        if (isEmpty)
            return <DropMealPlaceholder />;
        return null;

    }
    return (
        <span className={'flex w-full flex-col items-start justify-start'} >

            {displayTitle(isEmpty)}

            <Droppable
                droppableId={listId}
                type={listType}
                direction="vertical"
                isCombineEnabled={false}
            >
                {(dropProvided, snapshot) => {
                    return (
                        <ul
                            style={{ scrollbarWidth: 'none' }}
                            className={snapshot.isDraggingOver ? 'w-full min-h-4 border-2 border-dotted border-[#046865]' : 'w-full min-h-4 border-2 border-[#00000000]'}
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
                                                <MealDragElement mealID={food + ""} dragProvided={dragProvided} snapshot={snapshot} index={index} />
                                            )
                                        }
                                    }
                                </Draggable>
                            ))}
                            {isEmpty ? displayPlaceholder() : <></>}


                            {dropProvided.placeholder}
                        </ul>
                    )
                }}
            </Droppable>
        </span>

    )
}

export default MealDropList