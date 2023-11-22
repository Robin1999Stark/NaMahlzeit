import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { FoodPlaner, FoodplanerItem } from "./Datatypes/Meal";
import { PlanerService } from "./Endpoints/PlanerService";
import { reorderPlan } from "./reorder";
import PlanerList from "./Components/PlanerList";

function App() {

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
    async function fetchData() {
      try {
        const data: FoodplanerItem[] = await PlanerService.getAllPlanerItems();
        const end = new Date();
        end.setDate(end.getDate() + 13);
        const filledData: FoodplanerItem[] = fillWithEmptyDays(data, new Date(Date.now()), end);
        const foodPlaner = createFoodPlaner(data);
        setPlaner(foodPlaner);

      } catch (error) {
        console.error('Error fetching planer:', error);
      }
    }
    fetchData()
  }, [])
  return (

    <DragDropContext onDragEnd={({ destination, source }) => {
      console.log(destination, source)
      if (!destination)
        return;

      setPlaner(reorderPlan(planer, source, destination));
    }}>
      <div className='flex flex-row justify-between'>
        <div className='my-6 mx-4 w-[90%] grid grid-flow-row grid-cols-7 gap-3 justify-between'>
          {Object.entries(planer).map(([key, value]) => (
            <PlanerList
              internalScroll
              key={key}
              listId={key}
              listType='CARD'
              planerItem={value}
            />
          ))}
        </div>
        <div className='w-[10%] h-full bg-black'>

        </div>
      </div>

    </DragDropContext>

  );
}

export default App;


//<DndProvider backend={HTML5Backend}>