import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { InventoryItem } from '../Datatypes/Inventory';
import { IngredientService } from '../Endpoints/IngredientService';
import { ShoppingList, ShoppingListItem } from '../Datatypes/ShoppingList';
import { ShoppingListService } from '../Endpoints/ShoppingListService';
import { InventoryService } from '../Endpoints/InventoryService';
import { Ingredient } from '../Datatypes/Ingredient';
import { Menu, MenuButton, MenuItem, SubMenu } from '@szhsin/react-menu';
import { IoIosMore } from 'react-icons/io';
import { MdAdd } from 'react-icons/md';
import AutoCompleteInput from '../Components/AutoCompleteInput';
import Cookies from 'js-cookie';

type Props = {
    shoppingList: ShoppingList | undefined;
    setShoppingList: React.Dispatch<React.SetStateAction<ShoppingList | undefined>>
}

function ShoppingListView({ shoppingList, setShoppingList }: Props) {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>();
    const [ingredients, setIngredients] = useState<Ingredient[]>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [itemAdded, setItemAdded] = useState<boolean>(false);
    const [showBought, setShowBought] = useState<boolean>(false);
    const [selectedIngredient, _setSelectedIngredient] = useState<Ingredient | string>("");

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
    const selectedIngredientID = watch('ingredient');
    useEffect(() => {
        if (selectedIngredientID) {
            handleUnitChange();
        }
    }, [selectedIngredientID]);

    async function fetchIngredient(id: string): Promise<Ingredient | null> {
        try {
            const ingredient = await IngredientService.getIngredient(id);
            return ingredient;
        } catch (error) {
            console.log(error)
        }
        return null
    }
    async function fetchAllIngredients(): Promise<Ingredient[] | null> {

        try {
            const data = await IngredientService.getAllIngredients()
            return data === undefined ? null : data;
        } catch (error) {
            console.log(error)
        }
        return null;
    }
    async function fetchDataShoppingLists(): Promise<ShoppingList[]> {
        try {
            const data = await ShoppingListService.getAllShoppingLists();
            return data
        } catch (error) {
            console.log(error)
        }
        return [];
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
    async function fetchPipeline(list?: ShoppingList) {
        const lists = await fetchDataShoppingLists();
        setShoppingLists(lists);

        const savedListId = Cookies.get('selectedShoppingListId')
        let selectedList = list;

        if (!selectedList && savedListId) {
            selectedList = lists.find((l) => l.id === parseInt(savedListId, 10));
        }

        selectedList = selectedList || lists[0];

        if (selectedList) {
            setShoppingList(selectedList);
            Cookies.set('selectedShoppingListId', selectedList.id.toString(), { sameSite: 'strict' });
        } else {
            console.log("No shopping list available");
        }

        const ingredients = await fetchAllIngredients();
        setIngredients(ingredients || []);

        const ids: number[] = selectedList?.items ? selectedList.items : [];
        let items = await fetchDataShoppingListItems(ids);

        const savedShowBought = Cookies.get('showBought')
        const initialShowBought = savedShowBought === 'true';
        setShowBought(initialShowBought)


        if (!initialShowBought) {
            items = items && items.filter(item => !item.bought)
        }
        setShoppingListItems(items ? sortItems(items) : []);
        setLoaded(true);
    }
    function sortItems(items: ShoppingListItem[]): ShoppingListItem[] {

        return items.sort((a, b) => {
            if (a.bought !== b.bought) {
                return a.bought ? -1 : 1;
            }
            return new Date(a.added).getTime() - new Date(b.added).getTime();
        });
    }
    async function handleCreateShoppingList() {
        const items: number[] = []
        const list = await ShoppingListService.createShoppingList({ items });
        if (list === null)
            return;
        fetchPipeline(list);
    }
    async function handleUnitChange() {
        const ingredient = await fetchIngredient(selectedIngredientID);
        ingredient ? setValue('unit', ingredient?.preferedUnit) : setValue('unit', 'kg')
    }
    async function handleAddItemToShoppingList(data: InventoryItem | InventoryService.CreateInventoryItemInterface) {
        try {
            if (!shoppingList) {
                const list = await ShoppingListService.createShoppingList({ items: [] })
                if (!list) return
                setShoppingList(list)
            }
            if (shoppingList) {
                const item = await ShoppingListService.createItemAndAddToShoppingList(shoppingList, {
                    ingredient: data.ingredient,
                    amount: data.amount,
                    unit: data.unit,
                    notes: "",
                });
                if (item) {
                    setShoppingListItems((prevItems) => [...(prevItems || []), item]);
                    setItemAdded(true);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    async function handleDeleteShoppingListItem(id: number) {
        try {
            await ShoppingListService.deleteShoppingListItem(id);
            fetchPipeline();
        } catch (error) {
            console.log(error)
        }
    }
    const handleIngredientSelect = (ingredient: Ingredient | string) => {
        _setSelectedIngredient(ingredient);
        if (typeof ingredient === 'string') {
            setValue('ingredient', ingredient);
        } else {
            setValue('ingredient', ingredient.title);
        }
    };
    async function handleAutoCompleteSearch(query: string) {
        try {
            const data = await IngredientService.getAllIngredients()
            const results: string[] = data.map((ingredient) => ingredient.title).filter((title) => title.toLowerCase().includes(query.toLowerCase()));
            return results

        } catch (error) {
            return [];
        }
    }
    async function handleDeleteShoppingList(id: number | undefined) {
        if (!id)
            return;
        const result = await ShoppingListService.deleteShoppingList(id);
        if (result) {
            const updatedLists = await fetchDataShoppingLists();
            setShoppingLists(updatedLists);
            if (updatedLists.length > 0) {
                setShoppingList(updatedLists[0]);
            } else {
                setShoppingList(undefined);
                setShoppingListItems([]);
            }

        }
    }
    async function handleCheckboxChange(item: ShoppingListItem) {
        try {
            const updatedItem = { ...item, bought: !item.bought };
            const list = shoppingList;

            if (list) {
                setShoppingListItems(prevItems => {
                    if (prevItems) {
                        const updatedItems = prevItems.map(existingItem =>
                            existingItem.id === item.id ? updatedItem : existingItem
                        );
                        return sortItems(updatedItems);
                    }
                    return prevItems;
                });

                await ShoppingListService.updateItemAndList(list, updatedItem);

                setTimeout(async () => {
                    const ids: number[] = list.items ? list.items : [];
                    const updatedItems = await fetchDataShoppingListItems(ids);
                    if (updatedItems) {
                        setShoppingListItems(sortItems(updatedItems));
                    }
                }, 500);
            }
        } catch (error) {
            console.log(error);
        }
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


    async function onSubmit(data: InventoryItem) {
        if (!data.ingredient || typeof data.ingredient !== 'string') {
            console.log('Please select a valid ingredient.');
            return;
        }
        await handleAddItemToShoppingList(data);
    }
    //<MissingIngredientMealList handleAddItemToShoppingList={handleAddItemToShoppingList} />
    if (loaded) {
        return (
            <>
                <span className='flex flex-row justify-between items-center'>
                    <h1 className='mb-4 font-semibold text-[#011413] text-xl'>
                        Einkaufsliste ({shoppingList && shoppingList.created.toLocaleDateString() + " - " + shoppingList.created.getHours() + ":" + shoppingList.created.getMinutes()})
                    </h1>

                    <Menu menuButton={<MenuButton><IoIosMore className='size-5 mr-4 text-[#011413]' /></MenuButton>} transition>

                        <MenuItem onClick={() => handleDeleteShoppingList(shoppingList?.id)}>Liste löschen</MenuItem>
                        <SubMenu label='Listen'>
                            {
                                shoppingLists.map((list) => <MenuItem onClick={() => {
                                    fetchPipeline(list);
                                }}>
                                    <p className={`${shoppingList?.id === list.id && 'font-bold underline-offset-1'}`}>
                                        {list.created.toLocaleDateString() + " - " + list.created.getHours() + ":" + list.created.getMinutes()}
                                    </p>
                                </MenuItem>)
                            }
                            <MenuItem onClick={() => {
                                handleCreateShoppingList();
                            }}>
                                <p>
                                    + Neue Liste
                                </p>
                            </MenuItem>
                        </SubMenu>
                        <MenuItem type='checkbox' checked={showBought} onClick={(e) => {
                            if (e.checked === undefined)
                                return;
                            setShowBought(e.checked);
                            Cookies.set('showBought', e.checked.toString(), { sameSite: 'strict' });
                            fetchPipeline();
                        }}>
                            Gekauftes anzeigen
                        </MenuItem>
                    </Menu>
                </span>
                <ul className='overflow-y-scroll h-5/6 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#046865] scrollbar-track-slate-100'>
                    {shoppingListItems ? shoppingListItems?.map(item => (
                        item ?
                            <li className='w-full flex flex-row justify-between items-center'>
                                <div key={item.id} className='p-2 text-[#011413] flex flex-row font-semibold items-center'>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 mr-6 cursor-pointer rounded-full border border-gray-300 appearance-none checked:bg-[#046865] checked:border-transparent"
                                        id={`checkbox-${item.id}`}
                                        checked={item.bought}
                                        onChange={() => handleCheckboxChange(item)}
                                    />
                                    <p className={`${item.bought ? 'text-gray-400 line-through' : 'text-[#011413]'}`}>
                                        {item.ingredient}
                                    </p>
                                </div>
                                <div key={item.ingredient + Math.random() + "unit"} className='p-2 flex text-[#011413] font-semibold flex-row justify-between items-center'>
                                    <p className={`${item.bought ? 'text-gray-400 line-through' : 'text-[#011413]'}`}>
                                        {item.amount + " " + item.unit}
                                    </p>
                                </div>
                                <span className='flex flex-row justify-end pr-6'>
                                    <Menu menuButton={<MenuButton><IoIosMore className='size-5 text-[#011413]' /></MenuButton>} transition>
                                        <MenuItem onClick={() => handleDeleteShoppingListItem(item.id)}>Löschen</MenuItem>
                                    </Menu>
                                </span>

                            </li> : <>
                                <h1 key={"loading1"}>Loading...</h1>
                            </>
                    )) : <h1>Loading...</h1>}
                    <div ref={bottomRef}></div>

                </ul>
                <form className='w-full h-fit py-4 flex flex-row justify-between items-center pr-1' onSubmit={handleSubmit(onSubmit)}>
                    <span className='w-3/5 mr-1'>
                        <AutoCompleteInput search={handleAutoCompleteSearch} onSelect={handleIngredientSelect} />
                    </span>
                    <div className='flex w-2/5 flex-row'>
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
                            className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1'
                        />
                        <input
                            key={'unit'}
                            type='text'
                            id='unit'
                            {...register(`unit` as const, {
                                required: true,
                            })}
                            defaultValue={selectedIngredient && typeof selectedIngredient !== 'string' ? selectedIngredient?.preferedUnit : "kg"}
                            className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start px-3 rounded-md'
                        />
                    </div>
                    <button
                        type='submit'
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