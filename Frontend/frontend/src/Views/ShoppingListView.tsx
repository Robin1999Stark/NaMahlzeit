import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { InventoryItem } from '../Datatypes/Inventory';
import { IngredientService } from '../Endpoints/IngredientService';
import { ShoppingList, ShoppingListItem } from '../Datatypes/ShoppingList';
import { ShoppingListService } from '../Endpoints/ShoppingListService';
import MissingIngredientMealList from '../Components/MissingIngredientMealList';
import { InventoryService } from '../Endpoints/InventoryService';
import { Ingredient } from '../Datatypes/Ingredient';

function ShoppingListView() {
    const [shoppingList, setShoppingList] = useState<ShoppingList>();
    const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>();
    const [ingredients, setIngredients] = useState<Ingredient[]>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [selectedIngredient, _setSelectedIngredient] = useState<Ingredient>();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors } } = useForm<ShoppingListItem>({
            defaultValues: {
                ingredient: "",
                amount: 0,
                unit: "kg",
            },
            mode: 'all'
        });
    console.log(errors)
    const selectedIngredientID = watch('ingredient');

    /*const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "ingredients"
    });*/
    async function fetchDataIngredients(): Promise<Ingredient[] | null> {

        try {
            const data = await IngredientService.getAllIngredients()
            return data === undefined ? null : data;
        } catch (error) {
            console.log(error)
        }
        return null;
    }
    async function fetchDataShoppingList(): Promise<ShoppingList | null> {

        try {
            const data = await ShoppingListService.getAllShoppingLists();
            const list = data.pop();
            return list === undefined ? null : list
        } catch (error) {
            console.log(error)
        }
        return null;
    }

    async function fetchDataShoppingListItems(items: number[]): Promise<ShoppingListItem[] | null> {
        try {
            const data = await ShoppingListService.getAllShoppingListItems();
            const actualItems = data.filter(item => items?.includes(item.id))
            return actualItems === undefined ? null : actualItems;
        } catch (error) {
            console.log(error)
        }
        return null;
    }
    async function fetchPipeline() {
        const list = await fetchDataShoppingList();
        console.log(list)
        list ? setShoppingList(list) : console.log("fehler")
        const ingredients = await fetchDataIngredients();
        ingredients ? setIngredients(ingredients) : setIngredients([])
        const ids: number[] = list?.items ? list.items : []
        const items = await fetchDataShoppingListItems(ids);
        items ? setShoppingListItems(items) : setShoppingListItems([])
        setLoaded(true);
    }
    async function fetchIngredient(id: string): Promise<Ingredient | null> {
        try {
            const ingredient = await IngredientService.getIngredient(id);
            return ingredient;
        } catch (error) {
            console.log(error)
        }
        return null
    }
    async function handleUnitChange() {
        const ingredient = await fetchIngredient(selectedIngredientID);
        ingredient ? setValue('unit', ingredient?.preferedUnit) : setValue('unit', 'kg')
    }
    useEffect(() => {
        fetchPipeline();
        if (selectedIngredientID) {
            handleUnitChange();
        }
    }, [selectedIngredientID, setValue, loaded]);

    async function handleAddItemToShoppingList(data: InventoryItem | InventoryService.CreateInventoryItemInterface) {
        try {
            if (shoppingList) {
                const item = await ShoppingListService.createItemAndAddToShoppingList(shoppingList, { ingredient: data.ingredient, amount: data.amount, unit: data.unit, notes: "" })
                if (item) {
                    const newItems = shoppingListItems;
                    newItems?.push(item);
                    setShoppingListItems(newItems);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function onSubmit(data: InventoryItem) {
        await handleAddItemToShoppingList(data);
    }
    async function deleteShoppingListItem(id: number) {
        try {
            await ShoppingListService.deleteShoppingListItem(id);
            fetchPipeline();
        } catch (error) {
            console.log(error)
        }
    }

    if (loaded) {
        return (
            <>
                <MissingIngredientMealList handleAddItemToShoppingList={handleAddItemToShoppingList} />

                <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                    Shopping list
                </h1>
                <div className='mx-4 w-full'>
                    <form className='grid grid-cols-3 gap-2' onSubmit={handleSubmit(onSubmit)}>
                        <select
                            key={"select-ingredient"}
                            {...register(`ingredient` as const, {
                                required: true,
                            })}
                            defaultValue={ingredients ? ingredients[0]?.title : 0} // Ensure a valid initial value
                            className="bg-white h-12 text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
                        >
                            <option key={"select-ingredient-empty"} value="">Select Ingredient</option>
                            {ingredients ? ingredients.map((ingredient) => (
                                <option
                                    key={ingredient.title}
                                    value={ingredient.title}>
                                    {ingredient.title}
                                </option>
                            )) : <></>}
                        </select>
                        <div className='flex h-12 flex-row'>
                            <input
                                key={'amount'}
                                type='number'
                                id='amount'
                                step={0.1}
                                {...register(`amount` as const, {
                                    valueAsNumber: true,
                                    min: 0,
                                    max: 50000,
                                    required: true,
                                })}
                                defaultValue={1}
                                className="border-slate-200 h-12 truncate text-base font-semibold align-middle mr-2 focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                            <input
                                key={'unit'}
                                type='text'
                                id='unit'
                                {...register(`unit` as const, {
                                    required: true,
                                })}
                                defaultValue={selectedIngredient ? selectedIngredient?.preferedUnit : "kg"}
                                className="border-slate-200 truncate h-12 text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </div>
                        <div className='flex h-12 flex-row'>
                            <button key={'add-item'} className='p-2 ml-4 bg-green-400 text-gray-900 px-4 truncate w-full rounded-md text-lg' type='submit'>+ Add</button>
                        </div>

                        {shoppingListItems ? shoppingListItems?.map(item => (
                            item ?
                                <>
                                    <div key={item.ingredient + Math.random()} className='p-2 flex flex-row font-semibold items-center'>
                                        {item.ingredient}
                                    </div>
                                    <div key={item.ingredient + Math.random() + "unit"} className='p-2 flex font-semibold flex-row justify-between items-center'>
                                        {item.amount + " " + item.unit}
                                    </div>
                                    <div key={item.ingredient + Math.random() + "delete-notes"} className='p-2 flex font-semibold flex-row justify-between items-center'>
                                        <div key={item.ingredient + Math.random() + "notes"}>
                                            {item.notes}
                                        </div>
                                        <button key={item.ingredient + Math.random() + "delete"} onClick={() => deleteShoppingListItem(item.id)} className='px-3 bg-red-400 py-1 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                                            x
                                        </button>
                                    </div>
                                </> : <>
                                    <h1 key={"loading1"}>Loading...</h1>
                                    <h1 key={"loading2"}>Loading...</h1>
                                </>
                        )) : <h1>Loading...</h1>}
                    </form>
                </div>

            </>
        )
    } else {
        return (<div>
            loading
        </div>
        )
    }

}

export default ShoppingListView