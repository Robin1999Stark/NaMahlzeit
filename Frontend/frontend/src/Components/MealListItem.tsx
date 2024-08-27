import { Link } from 'react-router-dom'
import { Meal, MealTags } from '../Datatypes/Meal'
import { useEffect, useRef, useState } from 'react'
import { TagService } from '../Endpoints/TagService';
import Tag from './Tag';
import PlaceholderMealImage from './PlaceholderMealImage';
import { Menu, MenuButton, MenuItem, SubMenu } from '@szhsin/react-menu';
import { IoIosMore } from 'react-icons/io';
import CustomDatePicker from './CustomDatePicker';

type Props = {
    meal: Meal,
    deleteMeal: (id: number) => Promise<void>;
    addMealToPlaner?: (to: Date, mealId: number) => void;
}

function MealListItem({ meal, deleteMeal, addMealToPlaner }: Props) {
    const SIZE_MOBILE = 700;
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [tags, setTags] = useState<MealTags>();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchTags(id: number) {
            try {
                const response = await TagService.getAllTagsFromMeal(id);
                response ? setTags(response) : console.log("Error")
            } catch (error) {
                console.error("error");
            }
        }
        fetchTags(meal.id);
    }, []);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setShowDatePicker(false);
        if (date && addMealToPlaner) {

            addMealToPlaner(date, meal.id);
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
                className='select-none w-full h-full py-3 flex flex-row justify-between items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'>
                <article className='text-center  flex flex-row justify-start ml-3 items-center w-full whitespace-normal text-[#011413] text-base '>
                    <figure className='w-7 h-7 rounded-full mr-3'>
                        <PlaceholderMealImage rounded />
                    </figure>
                    <Link className='text-[#011413] underline' to={`/meals/${meal.id}`}>
                        <h3 className='text-start'>
                            {meal?.title}
                        </h3>
                    </Link>
                </article>
                <ul className='w-full hidden sm:flex flex-row justify-start items-start flex-wrap'>
                    {tags?.tags.map(tag => (
                        <li className='my-1 mr-1' key={`${meal.id}-${tag}`}>
                            <Tag title={tag} />
                        </li>
                    ))}
                </ul>
                <Menu menuButton={<MenuButton><IoIosMore className='size-5 text-[#011413] mr-3' /></MenuButton>} transition>
                    <MenuItem onClick={() => {

                        deleteMeal(meal.id)
                    }}>
                        Löschen
                    </MenuItem>
                    <SubMenu label='Speiseplan'>
                        <MenuItem onClick={() => {
                            const today = new Date(Date.now())
                            const to: Date = new Date(today);
                            to.setDate(to.getDate());
                            if (addMealToPlaner !== undefined) {
                                addMealToPlaner(to, meal.id);
                            }
                        }}>
                            Heute
                        </MenuItem>
                        <MenuItem onClick={() => {
                            const today = new Date(Date.now())
                            const to: Date = new Date(today);
                            to.setDate(to.getDate() + 1);
                            if (addMealToPlaner !== undefined) {
                                addMealToPlaner(to, meal.id);
                            }
                        }}>
                            Morgen
                        </MenuItem>
                        <MenuItem onClick={() => setShowDatePicker(true)}>
                            Anderer Tag
                        </MenuItem>
                    </SubMenu>
                </Menu>
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

export default MealListItem