import { createContext, Dispatch, SetStateAction } from 'react';
import { Meal } from '../Datatypes/Meal';

interface MealContextType {
    meals: Meal[];
    setMeals: Dispatch<SetStateAction<Meal[]>>;
}

export const MealContext = createContext<MealContextType | undefined>(undefined);

