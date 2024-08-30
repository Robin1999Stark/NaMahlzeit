import { Suspense, useEffect, useState } from "react";
import ReceipePlanerView from "./Views/ReceipePlanerView";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import { User } from "./Datatypes/User";
import LoadingSpinner from "./Components/LoadingSpinner";
import ProtectedRoute from "./Components/ProtectedRoute";
import { UserService } from "./Endpoints/UserService";
import Cookies from "js-cookie";

export const mealListID = "meal-list";

function App() {

  const showCreateUser = false;
  const SIZE_MOBILE = 700;
  const [windowSize, setWindowSize] = useState({
    width: globalThis.innerWidth,
    height: globalThis.innerHeight,
  });

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = Cookies.get('authToken');
      if (token) {
        try {
          const userData = await UserService.getUserDataFromToken(token);
          if (userData) {
            setUser(userData);
            setLoggedIn(true);
          } else {
            Cookies.remove('authToken');
            setLoggedIn(false);
          }
        } catch (error) {
          console.error("Failed to fetch user data from token", error);
          Cookies.remove('authToken');
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
    };

    checkAuthToken();
  }, []);


  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const showMITNav = isActive('/meals') || isActive('/ingredients') || isActive('/tags')

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <span className="h-screen flex flex-col">
        <NavBar />
        {/* Placeholder for mobile */}
        <span className={`${windowSize.width > SIZE_MOBILE ? 'hidden' : 'block'} h-4`}>
        </span>
        <span className={`${windowSize.width <= SIZE_MOBILE && showMITNav ? 'block' : 'hidden'}`}>
          <MealIngredientTagNavigation />
        </span>
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              {!loggedIn && (
                <>
                  {showCreateUser && <Route path="/" element={<CreateUser />} />}
                  <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUser={setUser} showCreateUser={showCreateUser} />} />
                </>
              )}

              {/* Protected Routes */}
              <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
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
              </Route>

              {/* Redirect to login if trying to access protected routes while not logged in */}
              <Route path="*" element={<Navigate to={loggedIn ? "/planer" : "/login"} />} />
            </Routes>
          </Suspense>
        </main>
        {/* Placeholder for mobile bottom nav bar */}
        <span className={`${windowSize.width > SIZE_MOBILE ? 'hidden' : 'block'} h-[70px]`}>
        </span>
        {/* Placeholder for mobile bottom nav bar */}
        <span className={`${windowSize.width <= SIZE_MOBILE && showMITNav ? 'block' : 'hidden'} h-[70px]`}>
        </span>
      </span>
    </>
  );
}

export default App;
