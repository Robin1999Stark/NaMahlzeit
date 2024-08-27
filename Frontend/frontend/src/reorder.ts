import { DraggableLocation } from "react-beautiful-dnd";
import { mealListID } from "./App";
import { FoodPlaner, FoodplanerItem } from "./Datatypes/FoodPlaner";
import { updatePlanerItem } from "./Endpoints/PlanerService";

export const reorder = (
    list: number[],
    startIndex: number,
    endIndex: number
): number[] => {
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
    mealList: number[],
    destination: DraggableLocation
): FoodPlaner => {
    const currentFoodplanerItem: FoodplanerItem = plan[source.droppableId];
    const currentFood: number[] = [...currentFoodplanerItem.meals];
    const nextFoodplanerItem: FoodplanerItem = plan[destination.droppableId];
    const nextFood: number[] = [...nextFoodplanerItem.meals];
    const target = currentFood[source.index];

    if (source.droppableId === mealListID && destination.droppableId === mealListID) {
        return plan;
    }

    // moving to same list
    if (source.droppableId === destination.droppableId) {
        const reordered = reorder(currentFood, source.index, destination.index);
        const reorderedFoodplanerItem: FoodplanerItem = {
            ...currentFoodplanerItem,
            meals: reordered
        };
        return {
            ...plan,
            [source.droppableId]: reorderedFoodplanerItem
        };
    }

    // moving to different list
    // moving from meal list to planer list
    if (source.droppableId === mealListID) {
        // insert into nextFood
        const resourceTarget = mealList[source.index];
        nextFood.splice(destination.index, 0, resourceTarget);
        const updatedDestinationItem: FoodplanerItem = {
            ...nextFoodplanerItem,
            meals: removeDoubles(nextFood)
        };
        if (destination.droppableId !== mealListID) {
            updatePlanerItem(updatedDestinationItem.date, updatedDestinationItem);
        }
        return {
            ...plan,
            [destination.droppableId]: updatedDestinationItem
        };
    }

    if (destination.droppableId === mealListID) {
        // TODO if something is dropped into meal list
        return plan;
    }

    // moving from planer list to planer list
    // remove from original
    currentFood.splice(source.index, 1);
    // insert into nextFood
    nextFood.splice(destination.index, 0, target);

    const updatedSourceItem: FoodplanerItem = {
        ...currentFoodplanerItem,
        meals: currentFood
    };

    const updatedDestinationItem: FoodplanerItem = {
        ...nextFoodplanerItem,
        meals: removeDoubles(nextFood)
    };

    // update Planer
    if (source.droppableId !== mealListID) {
        updatePlanerItem(updatedSourceItem.date, updatedSourceItem);
    }
    if (destination.droppableId !== mealListID) {
        updatePlanerItem(updatedDestinationItem.date, updatedDestinationItem);
    }

    return {
        ...plan,
        [source.droppableId]: updatedSourceItem,
        [destination.droppableId]: updatedDestinationItem
    };
};