import { useEffect, useState } from 'react'
import { Meal } from '../Datatypes/Meal'
import { IngredientAmountWithMeal } from '../Datatypes/Ingredient';
import { getMeal } from '../Endpoints/MealService';

interface Props {
    ingredient: IngredientAmountWithMeal
}

function MissingIngredientMealListItem({ ingredient }: Props) {
    const [meal, setMeal] = useState<Meal>();
    useEffect(() => {
        async function fetchMeal(mealID: number): Promise<Meal | null> {
            try {
                const data = await getMeal(mealID + "");
                return data;
            } catch (error) {
                console.log(error)
            }
            return null;
        }
        async function handleMealFetching() {
            const meal = await fetchMeal(ingredient.meal);
            if (!meal) return;
            setMeal(meal);
        }
        handleMealFetching();
    }, [ingredient.meal]);

    return (
        <>

            <div key={ingredient.ingredient + ingredient.meal + Math.random()} className='p-2 flex flex-row font-semibold items-center'>
                {ingredient.ingredient}
            </div>
            <div key={ingredient.ingredient + ingredient.meal + Math.random() + "amount"} className='p-2 flex font-semibold flex-row justify-between s-center'>
                {ingredient.amount + " " + ingredient.unit}

            </div>
            <div key={ingredient.ingredient + ingredient.meal + Math.random() + "amount"} className='p-2 flex font-semibold flex-row justify-between s-center'>
                {"for " + meal?.title}
            </div>
        </>
    )
}

export default MissingIngredientMealListItem