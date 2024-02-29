import { useEffect, useState } from 'react'
import { MealService } from '../Endpoints/MealService';
import { Meal } from '../Datatypes/Meal';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import PlaceholderMealImage from './PlaceholderMealImage';


type Props = {
    mealID: string
    dragProvided: DraggableProvided
    snapshot: DraggableStateSnapshot
    index?: number
}

function MealDragElement({ mealID, dragProvided, snapshot }: Props) {
    const [meal, setMeal] = useState<Meal>();
    const [_error, setError] = useState<boolean>(false);
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
    }, [])

    return (

        <li
            {...dragProvided.dragHandleProps}
            {...dragProvided.draggableProps}
            className='select-none h-full my-2 flex flex-row justify-start items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'
            style={{
                left: '0 !important',
                top: '0 !important',
                bottom: '0 !important',
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '3.4rem',
                borderColor: snapshot.isDragging ? '#046865' : '#18A192',
                color: snapshot.isDragging ? '#046865' : '#18A192',
                ...dragProvided.draggableProps.style
            }}
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