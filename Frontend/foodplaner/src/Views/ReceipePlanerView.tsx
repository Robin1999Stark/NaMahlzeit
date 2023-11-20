import React, { useEffect, useState } from 'react'
import MealCard from '../Components/MealCard'
import { PlanerService } from '../Endpoints/PlanerService'
import { FoodplanerItem } from '../Datatypes/Meal'
import AddMealButton from '../Components/AddMealButton'

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

    const [foodPlaner, setFoodPlaner] = useState<FoodplanerItem[][]>()
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    useEffect(() => {
        function fillWithEmptyDays(planer: FoodplanerItem[], from: Date, to: Date): FoodplanerItem[] {
            const dates: Date[] = [];
            const currentDate = new Date(from.getTime());
            const newPlaner: FoodplanerItem[] = []
            planer.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            while (currentDate <= to) {
                dates.push(new Date(currentDate.getTime()));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            dates.forEach((date, index) => {
                const item = planer.find((item) => new Date(item.date).getUTCDate() === new Date(date).getUTCDate())
                if (item === undefined) {
                    newPlaner.push(new FoodplanerItem(-index, date, []))
                } else {
                    newPlaner.push(item)
                }
            }
            )
            return newPlaner
        }

        function splitFoodPlaner(planer: FoodplanerItem[], splitSize: number): FoodplanerItem[][] {
            const batches: FoodplanerItem[][] = []
            for (let i = 0; i < planer.length; i += splitSize) {
                batches.push(planer.slice(i, i + splitSize))
            }
            return batches;
        }
        async function fetchData() {
            try {
                const data: FoodplanerItem[] = await PlanerService.getAllPlanerItems();
                const end = new Date();
                end.setDate(end.getDate() + 13);
                const stuffedDate: FoodplanerItem[] = fillWithEmptyDays(data, new Date(Date.now()), end);
                const splitData: FoodplanerItem[][] = splitFoodPlaner(stuffedDate, 7);
                setFoodPlaner(splitData)
                console.log(splitData)
            } catch (error) {
                console.error('Error fetching planer:', error);
            }
        }
        fetchData()
    }, [])
    return (
        <div className='flex flex-col items-center max-w-[20rem]'>
            <h1 className='mb-4 text-2xl font-semibold text-[#181818]'>Foodplaner</h1>

            <table className='table-fixed p-3 m-8'>
                {foodPlaner ? foodPlaner?.map((planerBatch, idx) => (
                    <>
                        <thead>
                            <tr>
                                {planerBatch ? planerBatch?.map((plan, index) => (
                                    <th className='p-4 justify-start items-center min-w-[8rem]'>
                                        <h2 className='text text-base font-semibold '>
                                            {plan.date instanceof Date ? Weekday[plan.date.getDay()] : Weekday[new Date(plan.date).getDay()]}
                                        </h2>
                                    </th>
                                )) : <></>}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {planerBatch ? planerBatch?.map((plan, index) => (
                                    <td className='align-top'>
                                        <ul className='flex flex-col justify-start'>
                                            {plan.food?.map((meal, index) => (
                                                <li key={index}>
                                                    <MealCard mealID={meal + ""} />
                                                </li>
                                            ))}
                                            <li>
                                                <AddMealButton title='Add Meal' />
                                            </li>

                                        </ul>
                                    </td>

                                )) : <></>}
                            </tr>

                        </tbody>


                    </>
                )) : <></>}

            </table>

        </div>
    )
}

export default ReceipePlanerView