import React, { useState, ReactNode, useEffect } from 'react';
import { Meal } from '../Datatypes/Meal';
import { MealContext } from './meal-context';
import { getAllMeals } from '../Endpoints/MealService';

const MealProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [meals, setMeals] = useState<Meal[]>([]);


    useEffect(() => {
        async function fetchMeals() {
            try {
                const fetchedMeals = await getAllMeals();
                setMeals(fetchedMeals);
            } catch (error) {
                console.error('Error fetching meals:', error);
            }
        }

        fetchMeals();
    }, []);

    return (
        <MealContext.Provider value={{ meals, setMeals }}>
            {children}
        </MealContext.Provider>
    );
};

export { MealProvider };