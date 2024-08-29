import { Suspense, useEffect, useState } from "react";
import ReceipePlanerView from "./Views/ReceipePlanerView";
import { Route, Routes, useLocation } from "react-router-dom";
import CreateMeal from "./Views/CreateMeal";
import CreateIngredient from "./Views/CreateIngredient";
import IngredientsOverView from "./Views/IngredientsOverView";
import MealsOverview from "./Views/MealsOverview";
import MealDetailView from "./Views/MealDetailView";
import IngredientDetailView from "./Views/IngredientDetailView";
import NavBar from "./Components/NavBar";
import EditMeal from "./Views/EditMeal";
import TagsOverView from "./Views/TagsOverView";
import CreateTag from "./Views/CreateTag";
import EditTag from "./Views/EditTag";
import SetTagsMeal from "./Views/SetTagsMeal";
import SetTagsIngredient from "./Views/SetTagsIngredient";
import EditIngredient from "./Views/EditIngredient";
import InventoryShoppingList from "./Views/InventoryShoppingList";
import MealIngredientTagNavigation from "./Components/MealIngredientTagNavigation";
import Profile from "./Views/Profile";
import CreateUser from "./Views/CreateUser";
import Login from "./Views/Login";

export const mealListID = "meal-list";

function App() {
  const SIZE_MOBILE = 700;
  const [windowSize, setWindowSize] = useState({
    width: globalThis.innerWidth,
    height: globalThis.innerHeight,
  })

  const handleResize = () => {
    setWindowSize({
      width: globalThis.innerWidth,
      height: globalThis.innerHeight,
    });
  };
  useEffect(() => {
    globalThis.addEventListener('resize', handleResize);
    return () => {
      globalThis.removeEventListener('resize', handleResize);
    };
  }, []);

  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const showMITNav = isActive('/meals') || isActive('/ingredients') || isActive('/tags')

  return (
    <>
      <span className="h-screen flex flex-col">
        <NavBar />
        {/* Placeholder for mobile */}
        <span className={`${windowSize.width > SIZE_MOBILE} ? 'hidden' : 'block' h-4`}>
        </span>
        <span className={`${windowSize.width <= SIZE_MOBILE && showMITNav ? 'block' : 'hidden'}`}>
          <MealIngredientTagNavigation />
        </span>
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<div>Loading ...</div>}>
            <Routes>
              <Route path="/" element={<CreateUser />} />
              <Route path="/login" element={<Login />} />
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
              <Route path="/lists/" element={<InventoryShoppingList />} />
              <Route path="/tags" element={<TagsOverView />} />
              <Route path="/tags/create" element={<CreateTag />} />
              <Route path="/tags/:tagID/edit" element={<EditTag />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </main>
        {/* Placeholder for mobile bottom nav bar */}
        <span className={`${windowSize.width > SIZE_MOBILE ? 'hidden' : 'block'} h-[90px]`}>
        </span>
        {/* Placeholder for mobile bottom nav bar */}
        <span className={`${windowSize.width <= SIZE_MOBILE && showMITNav ? 'block' : 'hidden'} h-[4.2rem]`}>
        </span>
      </span>
    </>
  );
}

export default App;
