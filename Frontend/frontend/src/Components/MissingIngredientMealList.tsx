import { useEffect, useState } from 'react'
import MissingIngredientMealListItem from './MissingIngredientMealListItem';
import { InventoryItem } from '../Datatypes/Inventory';
import { IngredientAmountWithMeal } from '../Datatypes/Ingredient';
import { FoodplanerItem } from '../Datatypes/FoodPlaner';
import { CreateInventoryItemInterface } from '../Endpoints/InventoryService';
import { getAllPlanerItems, getAllIngredientsFromPlanerInTimeRange } from '../Endpoints/PlanerService';

type Props = {
    handleAddItemToShoppingList: (data: InventoryItem | CreateInventoryItemInterface) => Promise<void>
}

function MissingIngredientMealList({ handleAddItemToShoppingList }: Props) {
    const [, setPlaners] = useState<FoodplanerItem[]>();
    const [ingredients, setIngredients] = useState<IngredientAmountWithMeal[]>([]);

    function handleAddAllToShoppingList() {
        ingredients.forEach(async (ingr) => {
            const inv: CreateInventoryItemInterface = { ingredient: ingr.ingredient, amount: ingr.amount, unit: ingr.unit };
            await handleAddItemToShoppingList(inv);
        })
    }

    useEffect(() => {
        async function fetchDataPlaner(): Promise<FoodplanerItem[] | null> {
            try {
                const data: FoodplanerItem[] = await getAllPlanerItems();
                setPlaners(data);
                return data;
            } catch (error) {
                console.error('Error fetching planer:', error);
            }
            return null;
        }

        async function fetchIngredientsFromPlaner(start: Date, end: Date): Promise<IngredientAmountWithMeal[] | null> {
            try {
                const data = await getAllIngredientsFromPlanerInTimeRange(start, end);
                return data;
            } catch (error) {
                console.log(error)
            }
            return null;
        }

        async function fetchPipline() {

            const planers = await fetchDataPlaner();
            if (!planers) return;
            setPlaners(planers);
            const today = new Date();
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + 14);
            const ingredients = await fetchIngredientsFromPlaner(today, futureDate);
            if (!ingredients) return;
            setIngredients(ingredients)
        }
        fetchPipline();
    }, []);

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