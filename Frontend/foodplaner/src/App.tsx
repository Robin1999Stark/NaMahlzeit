import { Suspense } from "react";
import ReceipePlanerView from "./Views/ReceipePlanerView";
import { Route, Routes } from "react-router-dom";
import CreateMeal from "./Views/CreateMeal";
import CreateIngredient from "./Views/CreateIngredient";
import IngredientsOverView from "./Views/IngredientsOverView";
import MealsOverview from "./Views/MealsOverview";
import MealDetailView from "./Views/MealDetailView";
import IngredientDetailView from "./Views/IngredientDetailView";

export const mealListID = "meal-list";

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading ...</div>}>
        <Routes>
          <Route path="/" element={<ReceipePlanerView />} />
          <Route path="/planer" element={<ReceipePlanerView />} />
          <Route path="/meals/create" element={<CreateMeal />} />
          <Route path="/meals" element={<MealsOverview />} />
          <Route path="/meals/:mealID" element={<MealDetailView />} />
          <Route path="/ingredients/create" element={<CreateIngredient />} />
          <Route path="/ingredients" element={<IngredientsOverView />} />
          <Route path="/ingredients/:ingredientID" element={<IngredientDetailView />} />


        </Routes>
      </Suspense>
    </>
  );
}

export default App;

/*
   <Suspense fallback={<div>Loading ...</div>}>
        <Routes>
          <Route path="/" element={<ReceipePlanerView />} />
          <Route path="/planer" element={<ReceipePlanerView />} />
          <Route path="/meals/create" element={<CreateMeal />} />

        </Routes>
      </Suspense>
*/