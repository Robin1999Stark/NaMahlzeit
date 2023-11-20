import './App.css';
import MealList from './Components/MealList';
import ReceipePlanerView from './Views/ReceipePlanerView';

function App() {
  return (
    <>
      <div className='absolute w-full grid grid-cols-4 gap-4 justify-between left-[50%] translate-x-[-50%] top-10'>
        <ReceipePlanerView />
        <MealList />

      </div>
    </>
  );
}

export default App;
