import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { InventoryItem } from '../Datatypes/Inventory';
import { IngredientService } from '../Endpoints/IngredientService';
import { ShoppingList, ShoppingListItem } from '../Datatypes/ShoppingList';
import { ShoppingListService } from '../Endpoints/ShoppingListService';
import { InventoryService } from '../Endpoints/InventoryService';
import { Ingredient } from '../Datatypes/Ingredient';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { IoIosMore } from 'react-icons/io';
import { MdAdd } from 'react-icons/md';
import AutoCompleteInput from '../Components/AutoCompleteInput';

type Props = {
    shoppingList: ShoppingList | undefined;
    setShoppingList: React.Dispatch<React.SetStateAction<ShoppingList | undefined>>
}

function ShoppingListView({ shoppingList, setShoppingList }: Props) {
    const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>();
    const [ingredients, setIngredients] = useState<Ingredient[]>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [itemAdded, setItemAdded] = useState<boolean>(false);
    const [selectedIngredient, _setSelectedIngredient] = useState<Ingredient>();
    const [selectedIngredient2, _setSelectedIngredient2] = useState<Ingredient | string>("");

    const bottomRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (itemAdded && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
            setItemAdded(false);
        }
    }, [shoppingListItems, itemAdded]);

    async function handleAddItemToShoppingList(data: InventoryItem | InventoryService.CreateInventoryItemInterface) {
        try {
            if (!shoppingList) {
                const list = await ShoppingListService.CreateShoppingList({ items: [] })
                if (!list) return
                setShoppingList(list)
            }
            if (shoppingList) {
                const item = await ShoppingListService.createItemAndAddToShoppingList(shoppingList, { ingredient: data.ingredient, amount: data.amount, unit: data.unit, notes: "" })
                if (item) {
                    const newItems = shoppingListItems;
                    newItems?.push(item);
                    setShoppingListItems(newItems);
                    setItemAdded(true);
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
    const handleIngredientSelect = (ingredient: Ingredient | string) => {
        _setSelectedIngredient2(ingredient);
        // You can also update other form states or perform actions here
        console.log("Selected ingredient:", ingredient);
    };
    //<MissingIngredientMealList handleAddItemToShoppingList={handleAddItemToShoppingList} />
    if (loaded) {
        return (
            <>
                <h1 className='mb-4 font-semibold text-[#011413] text-xl'>Einkaufsliste</h1>
                <ul className='overflow-y-scroll h-5/6 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#046865] scrollbar-track-slate-100'>
                    {shoppingListItems ? shoppingListItems?.map(item => (
                        item ?
                            <li className='w-full flex flex-row justify-between items-center'>

                                <div key={item.ingredient + Math.random()} className='p-2 text-[#011413] flex flex-row font-semibold items-center'>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 mr-6 cursor-pointer rounded-full border border-gray-300 appearance-none checked:bg-[#046865] checked:border-transparent focus:ring-2 focus:ring-[#0f302f]"
                                        id="checkbox"
                                    />
                                    {item.ingredient}
                                </div>
                                <div key={item.ingredient + Math.random() + "unit"} className='p-2 flex text-[#011413] font-semibold flex-row justify-between items-center'>
                                    {item.amount + " " + item.unit}
                                </div>
                                <span className='flex flex-row justify-end pr-6'>
                                    <Menu menuButton={<MenuButton><IoIosMore className='size-5 text-[#011413]' /></MenuButton>} transition>
                                        <MenuItem >Löschen</MenuItem>
                                    </Menu>
                                </span>

                            </li> : <>
                                <h1 key={"loading1"}>Loading...</h1>
                            </>
                    )) : <h1>Loading...</h1>}
                    <div ref={bottomRef}></div>

                </ul>
                <AutoCompleteInput onSelectIngredient={handleIngredientSelect} />
                <form className='w-full h-fit py-4 flex flex-row justify-between items-center' onSubmit={handleSubmit(onSubmit)}>


                    <select
                        key={"select-ingredient"}
                        {...register(`ingredient` as const, {
                            required: true,
                        })}
                        defaultValue={ingredients ? ingredients[0]?.title : 0}
                        className="bg-white h-12 mr-2 text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
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
                            className="border-slate-200 bg-white h-12 rounded-md truncate text-base font-semibold align-middle mr-2 focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        <input
                            key={'unit'}
                            type='text'
                            id='unit'
                            {...register(`unit` as const, {
                                required: true,
                            })}
                            defaultValue={selectedIngredient ? selectedIngredient?.preferedUnit : "kg"}
                            className="border-slate-200 bg-white truncate rounded-md h-12 text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                    </div>
                    <button
                        className='bg-[#046865] ml-2 w-fit text-white p-3 rounded-full'>
                        <MdAdd className='size-5' />
                    </button>
                </form>


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