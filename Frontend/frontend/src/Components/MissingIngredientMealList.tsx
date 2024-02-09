import { useEffect, useState } from 'react'
import { PlanerService } from '../Endpoints/PlanerService';
import MissingIngredientMealListItem from './MissingIngredientMealListItem';
import { InventoryItem } from '../Datatypes/Inventory';
import { InventoryService } from '../Endpoints/InventoryService';
import { IngredientAmountWithMeal } from '../Datatypes/Ingredient';
import { FoodplanerItem } from '../Datatypes/FoodPlaner';

type Props = {
    handleAddItemToShoppingList: (data: InventoryItem | InventoryService.CreateInventoryItemInterface) => Promise<void>
}

function MissingIngredientMealList({ handleAddItemToShoppingList }: Props) {
    const [_planers, setPlaners] = useState<FoodplanerItem[]>();
    const [ingredients, setIngredients] = useState<IngredientAmountWithMeal[]>([]);
    const [_inventoryItems, _setInventoryItems] = useState<InventoryItem[]>([]);

    useEffect(() => {
    }, [])

    async function handleAddAllToShoppingList() {
        ingredients.forEach(async (ingr) => {
            const inv: InventoryService.CreateInventoryItemInterface = { ingredient: ingr.ingredient, amount: ingr.amount, unit: ingr.unit };
            await handleAddItemToShoppingList(inv);
        })
    }

    useEffect(() => {
        async function fetchDataPlaner(): Promise<FoodplanerItem[] | null> {
            try {
                const data: FoodplanerItem[] = await PlanerService.getAllPlanerItems();
                setPlaners(data);
                return data;
            } catch (error) {
                console.error('Error fetching planer:', error);
            }
            return null;
        }
        /*async function fetchDataMeals(ids: number[]): Promise<Meal[]> {
            const meals: Meal[] = [];
            try {

                ids.forEach(async (id) => {
                    const data = await MealService.getMeal(id + "")
                    data ? meals.push(data) : console.log("error");
                })
                return meals;
            } catch (error) {
                console.log(error);
            }
            return meals;
        }*/
        async function fetchIngredientsFromPlaner(start: Date, end: Date): Promise<IngredientAmountWithMeal[] | null> {
            try {
                const data = await PlanerService.getAllIngredientsFromPlanerInTimeRange(start, end);
                return data;
            } catch (error) {
                console.log(error)
            }
            return null;
        }
        /*async function combineMealsFromMultPlaner(planers: FoodplanerItem[]) {
            try {

                let allMeals: Meal[] = []
                for (const planer of planers) {
                    const meals = await fetchDataMeals(planer.meals);
                    meals.forEach(meal => {
                        allMeals.push(meal)
                    })
                }
                return allMeals;
            } catch (error) {
                console.error(error)
            }
        }*/

        async function fetchPipline() {

            const planers = await fetchDataPlaner();
            if (!planers) return;
            setPlaners(planers);
            //const allMeals = await combineMealsFromMultPlaner(planers);
            const ingredients = await fetchIngredientsFromPlaner(new Date(Date.now()), new Date('2023-12-12'));
            if (!ingredients) return;
            setIngredients(ingredients)
        }
        fetchPipline();
    }, [])

    return (
        <div className='mx-4 w-full'>
            <div className='flex flex-row justify-between items-center'>

                <h1 className='truncate text-[#57D1C2] my-5 text-2xl font-semibold'>
                    Needed Ingredients from Planer
                </h1>
                <div className='flex h-12 flex-row'>
                    <button onClick={() => handleAddAllToShoppingList()} className='p-2 ml-4 bg-green-400 text-gray-900 px-4 truncate w-full rounded-md text-lg' type='submit'>+ Add All To Shopping</button>
                </div>
            </div>
            <div className='grid grid-cols-3 gap-2'>
                {
                    ingredients?.map(ingredient => (
                        <MissingIngredientMealListItem ingredient={ingredient} />
                    ))
                }
            </div>
        </div>


    )
}

export default MissingIngredientMealList