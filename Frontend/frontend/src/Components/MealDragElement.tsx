import { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService';
import { Meal } from '../Datatypes/Meal';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import PlaceholderMealImage from './PlaceholderMealImage';
import { CSSProperties } from 'react';

type Props = {
    mealID: number
    planerID?: string
    dragProvided: DraggableProvided
    snapshot: DraggableStateSnapshot
    customStyle?: React.CSSProperties
    onRemoveMeal?: (planerId: string, mealId: number) => void;
    index?: number
}

function MealDragElement({ mealID, dragProvided, snapshot, customStyle, planerID, onRemoveMeal }: Props) {
    const [meal, setMeal] = useState<Meal>();
    const [_error, setError] = useState<boolean>(false);

    useEffect(() => {
        async function fetchMeal() {
            try {
                const response = await MealService.getMeal(mealID + "")
                response ? setMeal(response) : setError(true)
            } catch (e) {
                console.log(e)
            }
        }
        fetchMeal()
    }, [mealID]);


    async function handleRemoveMeal(planerID: string, mealID: number) {

        if (onRemoveMeal === undefined) return;
        const result = await onRemoveMeal(planerID, mealID);
    }




    const getDraggableStyle = (snapshot: DraggableStateSnapshot, dragProvided: DraggableProvided): CSSProperties => {
        const style: CSSProperties = {
            // Apply the base styles
            left: snapshot.isDragging ? `0 !important` : 'auto !important',
            top: snapshot.isDragging ? `0 !important` : 'auto !important',
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

    const style = getDraggableStyle(snapshot, dragProvided);
    return (

        <li
            {...dragProvided.dragHandleProps}
            {...dragProvided.draggableProps}
            className='select-none h-full my-2 flex flex-row justify-between items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'
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
            {
                planerID && <button onClick={() => handleRemoveMeal(planerID, mealID)}>
                    Remove
                </button>
            }

        </li>
    )
}

export default MealDragElement