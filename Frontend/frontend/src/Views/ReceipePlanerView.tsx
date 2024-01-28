import { useEffect, useState } from 'react'
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
    const [_timeSpan, setTimeSpan] = useState<{ start: Date, end: Date }>({ start: new Date(Date.now()), end: new Date(Date.now()) });


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
                dates.map(async (date, _index) => {
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
        <div className='flex flex-col justify-start items-center mt-4'>

            <DragDropContext onDragEnd={({ destination, source }) => {
                if (!destination)
                    return;
                setPlaner(reorderPlan(planer, source, destination));
            }}>
                <div className='md:flex static md:flex-row md:relative h-full mt-4 md:justify-center w-full'>

                    <div className='grid flex-grow grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 overflow-hidden mr-4'>
                        {Object.entries(planer).slice(0, -1).map(([key, value], index) => {
                            if (index === 0) {
                                return <div className='col-span-full '>
                                    <PlanerList
                                        internalScroll
                                        key={key}
                                        listId={key}
                                        listType='LIST'
                                        planerItem={value}
                                    />
                                </div>
                            } else {

                                return (
                                    <div className='w-full'>
                                        <PlanerList
                                            internalScroll
                                            key={key}
                                            listId={key}
                                            listType='LIST'
                                            planerItem={value}
                                        />
                                    </div>
                                )
                            }

                        })}
                    </div>
                    <div className='flex md:min-w-[20rem] lg:min-w-[30rem]'></div>

                    <div className='hidden md:flex  md:min-w-[20rem] lg:min-w-[30rem] fixed top-0 right-0'>
                        <PlanerResourceCol mealListID={mealListID} />
                    </div>
                </div>

            </DragDropContext>

        </div>

    );
}


export default ReceipePlanerView

/*
  <div
                        className='md:w-[50%] lg:w-[30%] w-full z-20 p-2 sticky md:relative bottom-0 left-0 right-0 pt-3 bg-black md:bg-transparent rounded-md h-[50vh] md:h-full'>
                        <PlanerResourceCol mealListID={mealListID} />
                    </div>
*/