import { Suspense } from "react";
import ReceipePlanerView from "./Views/ReceipePlanerView";
import { Route, Routes } from "react-router-dom";
import CreateMeal from "./Views/CreateMeal";

export const mealListID = "meal-list";

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading ...</div>}>
        <Routes>
          <Route path="/" element={<ReceipePlanerView />} />
          <Route path="/planer" element={<ReceipePlanerView />} />
          <Route path="/meals/create" element={<CreateMeal />} />

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