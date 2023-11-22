import { DraggableLocation } from "react-beautiful-dnd";
import { FoodPlaner, FoodplanerItem } from "./Datatypes/Meal";
import { PlanerService } from "./Endpoints/PlanerService";

export const reorder = (
    list: any[],
    startIndex: number,
    endIndex: number
): any[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

function removeDoubles(list: number[]): number[] {
    return Array.from(new Set(list));
}

export const reorderPlan = (
    plan: FoodPlaner,
    source: DraggableLocation,
    destination: DraggableLocation
): FoodPlaner => {
    const currentFoodplanerItem: FoodplanerItem = plan[source.droppableId]
    const currentFood = [...plan[source.droppableId].meals];
    const nextFoodplanerItem: FoodplanerItem = plan[destination.droppableId]
    const nextFood = [...plan[destination.droppableId].meals];
    const target = currentFood[source.index];
    console.log("plan:", plan)
    console.log("current", currentFoodplanerItem)
    console.log("next", nextFoodplanerItem)
    console.log("target", nextFoodplanerItem)


    // moving to same list
    if (source.droppableId === destination.droppableId) {
        const reordered = reorder(currentFood, source.index, destination.index);
        const reorderedFoodplanerItem: FoodplanerItem = {
            ...nextFoodplanerItem,
            meals: reordered
        }
        return {
            ...plan,
            [source.droppableId]: reorderedFoodplanerItem
        };
    }

    // moving to different list
    // moving from meal list to planer list


    // moving from planer list to planer list
    // remove from original
    currentFood.splice(source.index, 1);
    // insert into nextFood
    nextFood.splice(destination.index, 0, target);

    const updatedSourceItem: FoodplanerItem = {
        ...currentFoodplanerItem,
        meals: currentFood
    }

    const updatedDestinationItem: FoodplanerItem = {
        ...nextFoodplanerItem,
        meals: removeDoubles(nextFood)
    }

    // update Planer
    console.log(updatedSourceItem.id)
    console.log(updatedDestinationItem.id)
    PlanerService.updatePlanerItem(updatedSourceItem.id, updatedSourceItem);
    PlanerService.updatePlanerItem(updatedDestinationItem.id, updatedDestinationItem);
    console.log("plan:", plan)
    console.log("source", updatedSourceItem)
    console.log("dest", updatedDestinationItem)
    return {
        ...plan,
        [source.droppableId]: updatedSourceItem,
        [destination.droppableId]: updatedDestinationItem
    };
};