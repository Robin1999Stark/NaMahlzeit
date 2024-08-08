import { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService';
import { Meal } from '../Datatypes/Meal';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import PlaceholderMealImage from './PlaceholderMealImage';
import { CSSProperties } from 'react';

type Props = {
    mealID: string
    dragProvided: DraggableProvided
    snapshot: DraggableStateSnapshot
    customStyle?: React.CSSProperties
    index?: number
}

function MealDragElement({ mealID, dragProvided, snapshot, customStyle }: Props) {
    const [meal, setMeal] = useState<Meal>();
    const [_error, setError] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        async function fetchMeal() {
            try {
                const response = await MealService.getMeal(mealID)
                response ? setMeal(response) : setError(true)
            } catch (e) {
                console.log(e)
            }
        }
        fetchMeal()
    }, [mealID]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setCursorPosition({ x: event.pageX, y: event.pageY });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [snapshot.isDragging]);


    const getDraggableStyle = (snapshot: DraggableStateSnapshot, cursorPosition: { x: number; y: number }, dragProvided: DraggableProvided): CSSProperties => {
        console.log(cursorPosition)
        const style: CSSProperties = {
            // Apply the base styles
            left: snapshot.isDragging ? `${cursorPosition.x}px !important` : 'auto !important',
            top: snapshot.isDragging ? `${cursorPosition.y}px !important` : 'auto !important',
            userSelect: 'none',
            position: snapshot.isDragging ? 'fixed' : 'static',
            flexDirection: 'row',
            width: '100%',
            height: '3.4rem',
            margin: '0 0 8px 0',
            color: snapshot.isDragging ? '#046865' : '#18A192',
            borderColor: snapshot.isDragging ? '#046865' : '#18A192',
            transform: snapshot.isDragging
                ? `translate(10rem, 10rem})`
                : 'none',
            zIndex: snapshot.isDragging ? 1000 : 'auto',
            ...dragProvided.draggableProps.style,
            ...customStyle,
        };
        return style;


    };

    const style = getDraggableStyle(snapshot, cursorPosition, dragProvided);
    return (

        <li
            {...dragProvided.dragHandleProps}
            {...dragProvided.draggableProps}
            className='select-none h-full my-2 flex flex-row justify-start items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'
            style={style}
            ref={dragProvided.innerRef}>
            <article className='text-center  flex flex-row justify-start ml-3 items-center w-full whitespace-normal text-[#011413] text-base '>
                <figure className='w-7 h-7 rounded-full mr-3'>
                    <PlaceholderMealImage rounded />
                </figure>
                <h3 className='text-start'>
                    {meal?.title}
                </h3>
            </article>
        </li>
    )
}

export default MealDragElement