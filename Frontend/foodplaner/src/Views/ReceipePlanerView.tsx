import React, { useEffect, useState } from 'react'
import { PlanerService } from '../Endpoints/PlanerService'
import { DragDropContext } from 'react-beautiful-dnd'
import { mealListID } from '../App'
import PlanerList from '../Components/PlanerList'
import { MealService } from '../Endpoints/MealService'
import { reorderPlan } from '../reorder'
import PlanerResourceCol from '../Components/PlanerResourceCol'
import { FoodPlaner, FoodplanerItem } from '../Datatypes/FoodPlaner'


function ReceipePlanerView() {

    const [planer, setPlaner] = useState<FoodPlaner>({})
    const [timeSpan, setTimeSpan] = useState<{ start: Date, end: Date }>({ start: new Date(Date.now()), end: new Date(Date.now()) });


    async function updateTimeSpan(from: Date, to: Date): Promise<[start: Date, end: Date]> {
        const start = new Date(from);
        const end = new Date(to);
        setTimeSpan({ start: start, end: end });
        return [start, end];
    }

    useEffect(() => {

        async function fillWithEmptyDays(planer: FoodplanerItem[], from: Date, to: Date): Promise<FoodplanerItem[]> {
            const dates: Date[] = [];
            const currentDate = new Date(from.getTime());
            const newPlaner: FoodplanerItem[] = []
            planer.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            while (currentDate <= to) {
                dates.push(new Date(currentDate.getTime()));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Use Promise.all to wait for all asynchronous calls
            await Promise.all(
                dates.map(async (date, index) => {
                    const item = planer.find((item) => new Date(item.date).getUTCDate() === new Date(date).getUTCDate());

                    if (item === undefined) {
                        // if a day is missing, create a new Planer for the day in the DB
                        const newItem = await PlanerService.createPlanerItem({ date, meals: [] });
                        newPlaner.push(newItem!);
                    } else {
                        newPlaner.push(item);
                    }
                })
            );

            return newPlaner
        }

        function createFoodPlaner(items: FoodplanerItem[]): FoodPlaner {
            const foodPlaner: FoodPlaner = {};
            items.forEach((item) => {
                foodPlaner[new Date(item.date).toISOString()] = item;
            })
            return foodPlaner;
        }

        async function addMealList(planer: FoodPlaner) {
            const foodList: number[] = (await MealService.getAllMeals()).map(meal => meal.id);
            const mealList: FoodplanerItem = new FoodplanerItem(-1, new Date(Date.now()), foodList);
            planer[mealListID] = mealList;
        }
        async function fetchData() {
            try {
                const data: FoodplanerItem[] = await PlanerService.getAllPlanerItems();
                const end = new Date();
                end.setDate(end.getDate() + 17);
                const [from, to] = await updateTimeSpan(new Date(Date.now()), end);
                const filledData: FoodplanerItem[] = await fillWithEmptyDays(data, from, to);
                const foodPlaner = createFoodPlaner(filledData);
                await addMealList(foodPlaner)
                setPlaner(foodPlaner);

            } catch (error) {
                console.error('Error fetching planer:', error);
            }
        }
        fetchData()
    }, [])
    return (
        <div className='flex flex-col justify-start items-start'>
            <h2>
                <button onClick={() => updateTimeSpan(new Date('2023-12-01'), new Date(Date.now()))}>
                    Last Week
                </button>
                This Week
            </h2>

            <DragDropContext onDragEnd={({ destination, source }) => {
                if (!destination)
                    return;
                setPlaner(reorderPlan(planer, source, destination));
            }}>
                <div className='flex flex-row h-full justify-between'>
                    <div className='my-6 mx-4 h-full w-[70%] grid grid-cols-3 grid-rows-6 grid-flow-col gap-3'>
                        {Object.entries(planer).slice(0, -1).map(([key, value]) => (
                            <PlanerList
                                internalScroll
                                key={key}
                                listId={key}
                                listType='LIST'
                                planerItem={value}
                            />
                        ))}
                    </div>
                    <div className='w-[30%] my-6 h-full'>
                        <PlanerResourceCol mealListID={mealListID} />
                    </div>
                </div>

            </DragDropContext>

        </div>

    );
}


export default ReceipePlanerView