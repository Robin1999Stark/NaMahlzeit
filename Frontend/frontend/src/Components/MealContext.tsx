import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Meal } from '../Datatypes/Meal';
import { getAllMeals } from '../Endpoints/MealService';

interface MealContextType {
    meals: Meal[];
    setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

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

export { MealProvider, MealContext };