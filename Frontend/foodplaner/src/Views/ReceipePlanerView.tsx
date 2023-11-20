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

    const [foodPlaner, setFoodPlaner] = useState<FoodplanerItem[][]>()
    const [currentIndex, setCurrentIndex] = useState<number>(0)


    useEffect(() => {
        /*function fillWithEmptyDays(planer: FoodplanerItem[], from: Date, to: Date): FoodplanerItem[] {
            console.log("planer", planer)
            const dict = new Map<Date, FoodplanerItem>();
            const currentDate = new Date(from.getTime());

            while (currentDate <= to) {
                dict.set(new Date(currentDate.getTime()), new FoodplanerItem(-1, new Date(currentDate.getTime()), []));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            console.log(dict)
            planer.forEach(planerItem => {
                const existingItem = dict.get(new Date(planerItem.date));

                if (existingItem) {
                    // If there's already an item, update its properties
                    existingItem.id = planerItem.id;
                    existingItem.food = existingItem.food.concat(planerItem.food);
                } else {
                    dict.set(new Date(planerItem.date), planerItem);
                }
            });

            const array = Array.from(dict.values());
            console.log(array);
            return array;
        }*/
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
                                    <th className='p-4justify-start items-center min-w-[8rem]'>
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