import React, { useEffect, useState } from 'react'
import MealCard from '../Components/MealCard'
import { PlanerService } from '../Endpoints/PlanerService'
import { FoodplanerItem } from '../Datatypes/Meal'

enum Weekday {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 0,
}

function ReceipePlanerView() {

    const [foodPlaner, setFoodPlaner] = useState<FoodplanerItem[]>()

    useEffect(() => {

        async function fetchData() {
            try {
                const data: FoodplanerItem[] = await PlanerService.getAllPlanerItems();
                setFoodPlaner(data)
                console.log(data)
            } catch (error) {
                console.error('Error fetching gas stations:', error);
            }
        }
        fetchData()
        console.log("foodplaner", foodPlaner)
    }, [])
    return (
        <div className='flex flex-col items-center'>
            <h1 className='mb-4 text-2xl font-semibold text-[#181818]'>Foodplaner</h1>
            <ul className='flex flex-row w-full justify-between p-3'>
                {foodPlaner ? foodPlaner?.map((plan, index) => (
                    <li className='p-4 flex flex-col justify-start items-center min-w-[8rem]'>
                        <h2 className='text text-base font-semibold '>
                            {plan.date instanceof Date ? Weekday[plan.date.getDay()] : Weekday[new Date(plan.date).getDay()]}

                        </h2>

                        <ul>
                            {plan.food?.map((meal, index) => (
                                <li key={index}>
                                    <MealCard mealID={meal + ""} />
                                </li>
                            ))}

                        </ul>
                    </li>
                )) : <></>}
            </ul>

        </div>
    )
}

export default ReceipePlanerView