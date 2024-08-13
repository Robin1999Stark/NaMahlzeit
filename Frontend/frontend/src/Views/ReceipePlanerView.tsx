import { useContext, useEffect, useState } from 'react'
import { PlanerService } from '../Endpoints/PlanerService'
import { DragDropContext } from 'react-beautiful-dnd'
import { mealListID } from '../App'
import MealDropList from '../Components/MealDropList'
import { MealService } from '../Endpoints/MealService'
import { reorderPlan } from '../reorder'
import PlanerResourceCol from '../Components/PlanerResourceCol'
import { FoodPlaner, FoodplanerItem } from '../Datatypes/FoodPlaner'
import { MealContext } from '../Components/MealContext'
import Calendar from '../Components/Calendar'


function ReceipePlanerView() {

    const context = useContext(MealContext);

    if (!context) {
        throw new Error('PlanerResourceCol must be used within a MealProvider');
    }
    const { meals, setMeals } = context;

    const [planer, setPlaner] = useState<FoodPlaner>({})
    const [_timeSpan, setTimeSpan] = useState<{ start: Date, end: Date }>({
        start: new Date(Date.now()),
        end: new Date(Date.now())
    });

    const updatePlanerItem = (id: string, updatedItem: FoodplanerItem) => {
        setPlaner(prevPlaner => ({
            ...prevPlaner,
            [id]: updatedItem
        }));
    };

    const handleMoveToPlanerItem = async (from: Date, to: Date, mealId: number) => {
        try {
            const response = await PlanerService.moveMealBetweenPlanerItemsByDate(mealId, from, to);
            console.log(response)
            setPlaner(prevPlaner => {
                // Create a copy of the previous state
                const updatedPlaner = { ...prevPlaner };

                // Find the source planner item
                const fromKey = Object.keys(updatedPlaner).find(key =>
                    new Date(updatedPlaner[key].date).getTime() === new Date(from).getTime()
                );

                // Find the target planner item
                const toKey = Object.keys(updatedPlaner).find(key =>
                    new Date(updatedPlaner[key].date).getTime() === new Date(to).getTime()
                );

                if (fromKey && toKey) {
                    // Remove the meal from the source planner item
                    updatedPlaner[fromKey] = {
                        ...updatedPlaner[fromKey],
                        meals: updatedPlaner[fromKey].meals.filter(id => id !== mealId),
                    };

                    // Add the meal to the target planner item
                    updatedPlaner[toKey] = {
                        ...updatedPlaner[toKey],
                        meals: [...updatedPlaner[toKey].meals, mealId],
                    };
                }

                return updatedPlaner;
            });
        } catch (error) {
            console.error('Moving removing meal:', error);
        }
    }

    const handleRemoveMeal = async (planerId: string, mealId: number) => {
        try {
            console.log("remove");
            await PlanerService.removeMealFromPlaner(planerId, mealId);

            // Update the local state to reflect the removal
            setPlaner(prevPlaner => {
                // Create a copy of the previous state
                const updatedPlaner = { ...prevPlaner };

                // Find the correct entry by planerId
                for (const [key, value] of Object.entries(updatedPlaner)) {
                    if (value.date.toString() === planerId) {
                        // Remove the mealId from the meals array
                        updatedPlaner[key] = {
                            ...value,
                            meals: value.meals.filter(id => id !== mealId),
                        };
                        break;  // Exit loop once the correct entry is found and updated
                    }
                }

                return updatedPlaner;
            });

        } catch (error) {
            console.error('Error removing meal:', error);
        }
    };


    async function updateTimeSpan(from: Date, to: Date): Promise<[start: Date, end: Date]> {
        const start = new Date(from);
        const end = new Date(to);
        setTimeSpan({ start: start, end: end });
        return [start, end];
    }

    useEffect(() => {

        async function fillWithEmptyDays(planer: FoodplanerItem[], from: Date, to: Date): Promise<FoodplanerItem[]> {
            const dates: Date[] = [];
            const currentDate = new Date(from.getFullYear(), from.getMonth(), from.getDate());
            const newPlaner: FoodplanerItem[] = []
            planer.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            while (currentDate <= to) {
                dates.push(new Date(currentDate.getTime()));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            for (const date of dates) {
                // Normalize date to remove time components
                const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                // Find the planer item that matches the normalized date
                const existingItem = planer.find(item => {
                    const itemDate = new Date(item.date);
                    const normalizedItemDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
                    return normalizedItemDate.getTime() === normalizedDate.getTime();
                });

                if (existingItem) {
                    newPlaner.push(existingItem);
                } else {
                    // Only create a new item if it doesn't already exist
                    const newItem = await PlanerService.createPlanerItem({ date: normalizedDate, meals: [] });
                    if (newItem) {
                        newPlaner.push(newItem);
                    }
                }
            }


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
            const mealList: FoodplanerItem = new FoodplanerItem(new Date(Date.now()), foodList);
            planer[mealListID] = mealList;
        }
        async function fetchData() {
            try {
                const data: FoodplanerItem[] = await PlanerService.getAllPlanerItems();
                const end = new Date(Date.now());
                end.setDate(end.getDate() + 17);
                const [from, to] = await updateTimeSpan(new Date(Date.now()), end);
                console.log(from, to)
                const filledData: FoodplanerItem[] = await fillWithEmptyDays(data, from, to);
                console.log(filledData)
                const foodPlaner = createFoodPlaner(filledData);
                await addMealList(foodPlaner)
                setPlaner(foodPlaner);

            } catch (error) {
                console.error('Error fetching planer:', error);
            }
        }
        fetchData()
    }, [meals]);
    const handleDragEnd = ({ destination, source }: { destination: any; source: any }) => {
        if (!destination)
            return;
        const mealList = meals.map((m) => m.id)

        setPlaner(prevPlaner => {
            const updatedPlaner = reorderPlan(prevPlaner, source, mealList, destination);
            return updatedPlaner;
        });
    };

    return (
        <section className='flex flex-row pt-4 h-full justify-start items-start'>
            <DragDropContext onDragEnd={handleDragEnd}>
                <section className='flex-1 h-full flex flex-col pl-6 pr-4'>
                    <h1 className='mb-4 font-semibold text-[#011413] text-xl'>Foodplaner</h1>
                    <Calendar planer={planer} />
                    <ul className='h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#046865] scrollbar-track-slate-100'>
                        {Object.entries(planer).slice(0, -1).map(([key, value]) => (
                            <li id={key} className='w-full pr-4' key={key}>
                                <MealDropList
                                    internalScroll
                                    listId={key}
                                    listType='LIST'
                                    onRemoveMeal={handleRemoveMeal}
                                    onMoveMeal={handleMoveToPlanerItem}
                                    planerItem={planer[key]}
                                />
                            </li>
                        ))}
                    </ul>
                </section>
                <PlanerResourceCol mealListID={mealListID} />
            </DragDropContext>
        </section>

    );
}


export default ReceipePlanerView
