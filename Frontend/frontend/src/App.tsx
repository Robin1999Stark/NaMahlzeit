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
import ShoppingListView from "./Views/ShoppingListView";
import EditMeal from "./Views/EditMeal";
import TagsOverView from "./Views/TagsOverView";
import CreateTag from "./Views/CreateTag";
import EditTag from "./Views/EditTag";
import SetTagsMeal from "./Views/SetTagsMeal";
import SetTagsIngredient from "./Views/SetTagsIngredient";
import EditIngredient from "./Views/EditIngredient";
import InventoryShoppingList from "./Views/InventoryShoppingList";

export const mealListID = "meal-list";

function App() {
  return (
    <>
      <span className="h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<div>Loading ...</div>}>
            <Routes>
              <Route path="/" element={<ReceipePlanerView />} />
              <Route path="/planer" element={<ReceipePlanerView />} />
              <Route path="/meals/create" element={<CreateMeal />} />
              <Route path="/meals" element={<MealsOverview />} />
              <Route path="/meals/:mealID" element={<MealDetailView />} />
              <Route path="/meals/:mealID/edit" element={<EditMeal />} />
              <Route path="/meals/:mealID/tags" element={<SetTagsMeal />} />
              <Route path="/ingredients/create" element={<CreateIngredient />} />
              <Route path="/ingredients" element={<IngredientsOverView />} />
              <Route path="/ingredients/:ingredientID" element={<IngredientDetailView />} />
              <Route path="/ingredients/:ingredientID/edit" element={<EditIngredient />} />
              <Route path="/ingredients/:ingredientID/tags" element={<SetTagsIngredient />} />
              <Route path="/inventory" element={<InventoryShoppingList />} />
              <Route path="/tags" element={<TagsOverView />} />
              <Route path="/tags/create" element={<CreateTag />} />
              <Route path="/tags/:tagID/edit" element={<EditTag />} />
            </Routes>
          </Suspense>
        </main>
      </span>

    </>
  );
}

export default App;
