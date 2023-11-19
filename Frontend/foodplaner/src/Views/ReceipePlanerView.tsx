import React, { useEffect, useState } from 'react'
import MealCard from '../Components/MealCard'


enum Weekday {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 0,
}

export type Meal = {
    title: string
}

export type FoodplanerItem = {
    date: Date,
    food: Meal[]
}

function ReceipePlanerView() {

    const [foodPlaner, setFoodPlaner] = useState<FoodplanerItem[]>()
    function addDaysToDate(originalDate: Date, daysToAdd: number) {
        const newDate = new Date(originalDate);
        newDate.setDate(originalDate.getDate() + daysToAdd);
        return newDate;
    }
    useEffect(() => {
        const planer: FoodplanerItem[] = [
            {
                date: addDaysToDate(new Date(), 0),
                food: [{ title: 'Lasagne' }, { title: 'Spaghetti' }]
            },
            {
                date: addDaysToDate(new Date(), 1),
                food: [{ title: 'Pizza' }, { title: 'Salad' }]
            },
            {
                date: addDaysToDate(new Date(), 2),
                food: [{ title: 'Burger' }, { title: 'Fries' }]
            },
            {
                date: addDaysToDate(new Date(), 3),
                food: [{ title: 'Sushi' }, { title: 'Miso Soup' }]
            },
            {
                date: addDaysToDate(new Date(), 4),
                food: [{ title: 'Sushi' }, { title: 'Miso Soup' }]
            },
            {
                date: addDaysToDate(new Date(), 5),
                food: [{ title: 'Sushi' }, { title: 'Miso Soup' }]
            },
            {
                date: addDaysToDate(new Date(), 6),
                food: [{ title: 'Sushi' }, { title: 'Miso Soup' }]
            }
        ];
        setFoodPlaner(planer);
    }, [])
    return (
        <div className='flex flex-col items-center'>
            <h1 className='mb-4 text-2xl font-semibold text-[#181818]'>Foodplaner</h1>
            <ul className='flex flex-row w-full justify-between p-3'>
                {foodPlaner?.map((plan, index) => (
                    <li className='p-4 flex flex-col justify-start items-center min-w-[8rem]'>
                        <h2 className='text text-base font-semibold '>
                            {Weekday[plan.date.getDay()]}

                        </h2>
                        <ul>
                            {plan.food?.map((meal, index) => (
                                <li key={index}>
                                    <MealCard meal={meal} />
                                </li>
                            ))}

                        </ul>
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default ReceipePlanerView