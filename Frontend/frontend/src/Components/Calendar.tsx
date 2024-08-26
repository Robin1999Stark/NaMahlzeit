import React from 'react';
import { FoodPlaner, FoodplanerItem } from '../Datatypes/FoodPlaner'
import { FaCheckCircle } from 'react-icons/fa';

type Props = {
    planer: FoodPlaner;
    maxEntries?: number;
}

function Calendar({ planer, maxEntries = 10 }: Props) {

    function displayDay(day_str: string, planerItem: FoodplanerItem) {
        const isEmpty = planerItem.meals.length === 0;
        const isToday = new Date(Date.now()).toDateString() === new Date(planerItem.date).toDateString();
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

        const date = new Date(day_str);
        const day = days[date.getDay()];

        return (
            <React.Fragment key={day_str}>
                <a href={'#' + day_str}>
                    <li className='text-[#011413] flex flex-col justify-start mt-2 text-base items-center mb-4'>
                        {isToday ? isEmpty ?
                            <p className='mb-2 bg-[#F96E46] text-white px-[0.3rem] rounded-full'>
                                {day}
                            </p> :
                            <p className='mb-2 bg-[#046865] text-white px-[0.3rem] rounded-full'>
                                {day}
                            </p> :
                            <p className='mb-2 px-[0.3rem]'>
                                {day}
                            </p>}
                        <FaCheckCircle className={`${isEmpty ? 'text-slate-200' : 'text-[#046865]'} size-4`} />
                    </li>
                </a>
                {date.getDay() === 0 &&
                    <li className='h-full w-[1px] bg-gray-200'></li>
                }
            </React.Fragment>
        );
    }

    const entries = Object.entries(planer).slice(0, maxEntries);

    return (
        <ul className='w-full flex flex-row justify-between items-center overflow-y-hidden h-fit overflow-x-scroll sm:overflow-x-hidden mt-2 mb-8'>
            {entries.map(([key, value]) => (
                displayDay(key, value)
            ))}
        </ul>
    )
}

export default Calendar