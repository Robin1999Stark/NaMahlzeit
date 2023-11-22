import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { FoodPlaner, FoodplanerItem } from "./Datatypes/Meal";
import { PlanerService } from "./Endpoints/PlanerService";
import { reorderPlan } from "./reorder";
import PlanerList from "./Components/PlanerList";
import { MealService } from "./Endpoints/MealService";
import MealList from "./Components/MealList";

function App() {

  const mealListID = "meal-list";
  const [planer, setPlaner] = useState<FoodPlaner>({})

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
        end.setDate(end.getDate() + 13);
        const filledData: FoodplanerItem[] = fillWithEmptyDays(data, new Date(Date.now()), end);
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

    <DragDropContext onDragEnd={({ destination, source }) => {
      if (!destination)
        return;

      setPlaner(reorderPlan(planer, source, destination));
      console.log(planer)
    }}>
      <div className='flex flex-row justify-between'>
        <div className='my-6 mx-4 w-[85%] grid grid-flow-row grid-cols-7 gap-3 justify-between'>
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
        <div className='w-[15%] h-full'>
          <MealList
            internalScroll
            key={mealListID}
            listId={mealListID}
            listType='LIST'
          />

        </div>
      </div>

    </DragDropContext>

  );
}

export default App;


/*<PlanerList

internalScroll
key={"meal-list"}
listId={"meal-list"}
listType='CARD'
isMealList
planerItem={planer["meal-list"]}
/>*/