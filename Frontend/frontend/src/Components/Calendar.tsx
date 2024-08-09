import { FoodPlaner, FoodplanerItem } from '../Datatypes/FoodPlaner'
import { FaCheckCircle } from 'react-icons/fa';
import { IoMdWarning } from 'react-icons/io';

type Props = {
    planer: FoodPlaner
}

function Calendar({ planer }: Props) {

    function displayDay(day_str: string, planerItem: FoodplanerItem) {
        const isEmpty = planerItem.meals.length === 0
        const isToday = new Date(Date.now()).getDate() === new Date(planerItem.date).getDate()
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

        const date = new Date(day_str);
        const day = days[date.getDay()];
        return <a href={'#' + day_str}>
            <li className='text-[#7A8587] flex flex-col justify-start mt-2 text-base items-center mb-4'>
                {isToday ? isEmpty ?

                    <p className='mb-2 bg-[#F96E46] text-white font-semibold px-[0.3rem] rounded-full'>
                        {day}
                    </p> : <p className='mb-2 bg-[#046865] text-white font-semibold px-[0.3rem] rounded-full'>
                        {day}
                    </p> : <p className='mb-2'>
                    {day}
                </p>}

                {isEmpty ? <IoMdWarning title='Nothing planed for now' className='text-[#F96E46] w-[16px] h-[16px] ' /> : <FaCheckCircle className='text-[#046865] w-[16px] h-[16px] ' />}
            </li>
            {date.getDay() === 0 ? <li className='h-full w-[1px] bg-gray-200'>

            </li> : <></>}
        </a>

    }

    return (
        <ul className='w-full flex flex-row justify-between items-center overflow-y-hidden h-fit overflow-x-hidden mt-2 mb-8'>
            {Object.entries(planer).slice(0, -1).map(([key, value]) => (
                displayDay(key, planer[key])
            ))}
        </ul>
    )
}

export default Calendar