import { Suspense } from "react";
import ReceipePlanerView from "./Views/ReceipePlanerView";
import { Route, Routes } from "react-router-dom";
import CreateMeal from "./Views/CreateMeal";
import CreateIngredient from "./Views/CreateIngredient";
import IngredientsOverView from "./Views/IngredientsOverView";
import MealsOverview from "./Views/MealsOverview";
import MealDetailView from "./Views/MealDetailView";
import IngredientDetailView from "./Views/IngredientDetailView";
import InventoryListView from "./Views/InventoryListView";
import NavBar from "./Components/NavBar";

export const mealListID = "meal-list";

function App() {
  return (
    <>
      <NavBar />
      <div className="absolute w-[95%] h-full left-[50%] translate-x-[-50%]">
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
            <Route path="/inventory" element={<InventoryListView />} />
          </Routes>
        </Suspense>
      </div>

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