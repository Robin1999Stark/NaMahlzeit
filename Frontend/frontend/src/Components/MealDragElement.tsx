import { useEffect, useRef, useState } from 'react'
import { MealService } from '../Endpoints/MealService';
import { Meal } from '../Datatypes/Meal';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import PlaceholderMealImage from './PlaceholderMealImage';
import { CSSProperties } from 'react';
import { IoIosMore } from 'react-icons/io';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import { MdAdd } from 'react-icons/md';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDatePicker from './CustomDatePicker';
import LoadingSpinner from './LoadingSpinner';

type Props = {
    mealID: number
    planerID?: string
    dragProvided: DraggableProvided
    snapshot: DraggableStateSnapshot
    customStyle?: React.CSSProperties
    showMore?: boolean
    date: Date
    onRemoveMeal?: (planerDate: Date, mealId: number) => void;
    onMoveMeal?: (from: Date, to: Date, mealId: number) => void;
    onAddMeal?: (to: Date, mealId: number) => void;
    index?: number;
}

function MealDragElement({ mealID, dragProvided, snapshot, date, customStyle, planerID, onAddMeal, onRemoveMeal, onMoveMeal, showMore = true }: Props) {
    const SIZE_MOBILE = 700;
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [meal, setMeal] = useState<Meal>();
    const [_error, setError] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

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


    async function handleRemoveMeal(planerDate: Date | undefined, mealID: number) {

        if (planerDate === undefined) return;
        if (onRemoveMeal === undefined) return;
        const result = await onRemoveMeal(planerDate, mealID);
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

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setShowDatePicker(false);
        if (date && onAddMeal) {
            onAddMeal(date, mealID);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
            setShowDatePicker(false);
        }
    };

    useEffect(() => {
        if (showDatePicker) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDatePicker]);

    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <li
                {...dragProvided.dragHandleProps}
                {...dragProvided.draggableProps}
                className='select-none h-full my-2 flex flex-row relative justify-between items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'
                style={style}
                ref={dragProvided.innerRef}>
                <article className='text-center  flex flex-row justify-start ml-3 items-center w-full whitespace-normal text-[#011413] text-base '>
                    <figure className='w-7 h-7 rounded-full mr-3'>
                        <PlaceholderMealImage rounded />
                    </figure>
                    {
                        meal !== undefined ? <a className='text-[#011413] underline' href={`/meals/${meal!.id}`}>
                            <h1 className='text-start'>
                                {meal?.title}
                            </h1>
                        </a> : <LoadingSpinner />
                    }
                </article>
                {
                    showMore ?
                        <Menu menuButton={<MenuButton><IoIosMore className='size-5 text-[#011413] mr-3' /></MenuButton>} transition>
                            <MenuItem>Öffnen</MenuItem>
                            <MenuItem onClick={() => {

                                handleRemoveMeal(date, mealID)
                            }}>Löschen</MenuItem>
                            <SubMenu label="Verschieben">
                                <MenuItem onClick={() => {
                                    const to: Date = new Date(date);
                                    to.setDate(to.getDate() + 1);
                                    if (onMoveMeal !== undefined) {
                                        onMoveMeal(date, to, mealID);
                                    }
                                }}>
                                    +1 Tag
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    const to: Date = new Date(date);
                                    to.setDate(to.getDate() + 2);
                                    if (onMoveMeal !== undefined) {
                                        onMoveMeal(date, to, mealID);
                                    }
                                }}>
                                    +2 Tage
                                </MenuItem>
                                <MenuItem>Anderer Tag</MenuItem>
                            </SubMenu>
                        </Menu> :
                        <Menu menuButton={<MenuButton><MdAdd className='size-5 text-[#011413] mr-3' /></MenuButton>} transition>
                            <MenuItem onClick={() => {
                                const today = new Date(Date.now())
                                const to: Date = new Date(today);
                                to.setDate(to.getDate());
                                console.log(onAddMeal)
                                if (onAddMeal !== undefined) {
                                    onAddMeal(to, mealID);
                                }
                            }}>
                                Heute
                            </MenuItem>
                            <MenuItem onClick={() => {
                                const today = new Date(Date.now())
                                const to: Date = new Date(today);
                                to.setDate(to.getDate() + 1);
                                if (onAddMeal !== undefined) {
                                    onAddMeal(to, mealID);
                                }
                            }}>
                                Morgen
                            </MenuItem>
                            <MenuItem onClick={() => setShowDatePicker(true)}>
                                Anderer Tag
                            </MenuItem>
                        </Menu>
                }
                {
                    showDatePicker && (windowSize.width > SIZE_MOBILE) && <div className="absolute right-24 flex justify-center items-center z-50">
                        <div ref={datePickerRef}>
                            <CustomDatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>
                }
            </li>
            {showDatePicker && ((windowSize.width <= SIZE_MOBILE) &&
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                    <div ref={datePickerRef}>
                        <CustomDatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>
            )}
        </>

    )
}

export default MealDragElement