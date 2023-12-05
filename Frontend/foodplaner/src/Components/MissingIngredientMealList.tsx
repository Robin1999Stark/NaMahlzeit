import React, { useEffect, useState } from 'react'
import { FoodPlaner, FoodplanerItem, Meal } from '../Datatypes/Meal'
import { PlanerService } from '../Endpoints/PlanerService';
import { MealService } from '../Endpoints/MealService';

function MissingIngredientMealList() {
    const [planers, setPlaners] = useState<FoodplanerItem[]>();

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
        async function fetchDataMeals(ids: number[]): Promise<Meal[]> {
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
        }
        async function combineMealsFromMultPlaner(planers: FoodplanerItem[]) {
            try {

                let allMeals: Meal[] = []
                for (const planer of planers) {
                    const meals = await fetchDataMeals(planer.meals);
                    console.log(meals)
                    meals.forEach(meal => {
                        console.log("meal", meal)
                        allMeals.push(meal)
                    })
                }
                return allMeals;
            } catch (error) {
                console.error(error)
            }
        }

        async function fetchPipline() {

            const planers = await fetchDataPlaner();
            if (!planers) return;
            setPlaners(planers);
            console.log(planers)
            const allMeals = await combineMealsFromMultPlaner(planers);
            console.log(allMeals)
        }
        fetchPipline();
    }, [])

    return (
        <div>
            <h2>Next Meals</h2>
            <ul className='flex flex-row justify-start items-center'>
                {
                    planers?.map(planer => (
                        <li>
                            {planer.meals}
                        </li>
                    ))
                }
            </ul>
        </div>


    )
}

export default MissingIngredientMealList