import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { InventoryItem } from '../Datatypes/Inventory';
import { ShoppingList, ShoppingListItem } from '../Datatypes/ShoppingList';
import { Ingredient } from '../Datatypes/Ingredient';
import { Menu, MenuButton, MenuItem, SubMenu } from '@szhsin/react-menu';
import { IoIosMore } from 'react-icons/io';
import { MdAdd } from 'react-icons/md';
import AutoCompleteInput from '../Components/AutoCompleteInput';
import Cookies from 'js-cookie';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getIngredient, getAllIngredients } from '../Endpoints/IngredientService';
import { getAllShoppingLists, getAllShoppingListItems, createShoppingList, createItemAndAddToShoppingList, deleteShoppingListItem, deleteShoppingList, updateItemAndList } from '../Endpoints/ShoppingListService';
import { CreateInventoryItemInterface } from '../Endpoints/InventoryService';
import { getAllIngredientsFromPlanerInTimeRange } from '../Endpoints/PlanerService';

type Props = {
    shoppingList: ShoppingList | undefined;
    setShoppingList: React.Dispatch<React.SetStateAction<ShoppingList | undefined>>
}

function ShoppingListView({ shoppingList, setShoppingList }: Props) {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>();
    const [, setIngredients] = useState<Ingredient[]>();
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
        formState: { } } = useForm<ShoppingListItem>({
            defaultValues: {
                ingredient: "",
                amount: 0,
                unit: "kg",
            },
            mode: 'all'
        });
    const selectedIngredientID = watch('ingredient');

    const fetchIngredient = useCallback(async (id: string): Promise<Ingredient | null> => {
        try {
            const ingredient = await getIngredient(id);
            return ingredient;
        } catch (_error) {
            console.log(_error);
        }
        return null;
    }, []);

    const fetchAllIngredients = useCallback(async (): Promise<Ingredient[] | null> => {
        try {
            const data = await getAllIngredients();
            return data === undefined ? null : data;
        } catch (_error) {
            console.log(_error);
        }
        return null;
    }, []);

    const fetchDataShoppingLists = useCallback(async (): Promise<ShoppingList[]> => {
        try {
            const data = await getAllShoppingLists();
            return data;
        } catch (_error) {
            console.log(_error);
        }
        return [];
    }, []);

    const fetchDataShoppingListItems = useCallback(async (items: number[]): Promise<ShoppingListItem[] | null> => {
        try {
            const data = await getAllShoppingListItems();
            const actualItems = data.filter(item => items?.includes(item.id));
            return actualItems === undefined ? null : actualItems;
        } catch (_error) {
            console.log(_error);
        }
        return null;
    }, []);

    const fetchPipeline = useCallback(async (list?: ShoppingList) => {
        const lists = await fetchDataShoppingLists();
        setShoppingLists(lists);

        const savedListId = Cookies.get('selectedShoppingListId');
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

        const savedShowBought = Cookies.get('showBought');
        const initialShowBought = savedShowBought === 'true';
        setShowBought(initialShowBought);

        if (!initialShowBought) {
            items = items && items.filter(item => !item.bought);
        }
        setShoppingListItems(items ? sortItems(items) : []);
        setLoaded(true);
    }, [fetchDataShoppingLists, fetchAllIngredients, fetchDataShoppingListItems, setShoppingList]);

    const handleUnitChange = useCallback(async () => {
        const ingredient = await fetchIngredient(selectedIngredientID);
        ingredient ? setValue('unit', ingredient?.preferedUnit) : setValue('unit', 'kg');
    }, [fetchIngredient, selectedIngredientID, setValue]);


    const handleAddItemsToShoppingList = useCallback(async (itemsData: InventoryItem[] | CreateInventoryItemInterface[]) => {
        try {
            let list: ShoppingList | undefined | null = shoppingList;
    
            if (!list) {
                // Erstelle die Liste nur einmal, falls sie noch nicht existiert
                list = await createShoppingList({ items: [] });
                if (!list) return;
                setShoppingList(list);
            }
    
            // Iteriere über alle Items und füge sie zur existierenden Liste hinzu
            for (const data of itemsData) {
                const item = await createItemAndAddToShoppingList(list, {
                    ingredient: data.ingredient,
                    unit: data.unit,
                    amount: data.amount,
                    notes: ''
                });
    
                if (item) {
                    console.log("Item hinzugefügt", item);
                    // Die Einkaufsliste und die Liste der Items aktualisieren
                    setShoppingListItems((prevItems) => {
                        const updatedItems = prevItems ? [...prevItems, item] : [item];
                        return updatedItems;
                    });
                }
            }
    
            setItemAdded(true);
        } catch (_error) {
            console.log(_error);
        }
    }, [shoppingList, setShoppingList]);
    
    
    const handleAddPlannedIngredients = useCallback(async () => {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 14);
        try {
            const ingredients = await getAllIngredientsFromPlanerInTimeRange(today, futureDate);
            if (!ingredients) return;

            const list = await handleAddItemsToShoppingList(ingredients);


        } catch (_error) {
            console.error('Error adding planned ingredients:', _error);
        }
    }, [handleAddItemsToShoppingList]);

    const handleDeleteShoppingListItem = useCallback(async (id: number) => {
        try {
            await deleteShoppingListItem(id);
            fetchPipeline();
        } catch (_error) {
            console.log(_error);
        }
    }, [fetchPipeline]);


    useEffect(() => {
        if (selectedIngredientID) {
            handleUnitChange();
        }
    }, [selectedIngredientID]);


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
        const list = await createShoppingList({ items });
        if (list === null)
            return;
        fetchPipeline(list);
    }

    const handleIngredientSelect = (ingredient: Ingredient | string) => {
        _setSelectedIngredient(ingredient);
        if (typeof ingredient === 'string') {
            setValue('ingredient', ingredient);
        } else {
            setValue('ingredient', ingredient.title);
        }
    };

    const handleAutoCompleteSearch = useCallback(async (query: string) => {
        try {
            const data = await getAllIngredients();
            const results: string[] = data.map((ingredient) => ingredient.title).filter((title) => title.toLowerCase().includes(query.toLowerCase()));
            return results;
        } catch (_error) {
            return [];
        }
    }, []);

    const handleDeleteShoppingList = useCallback(async (id: number | undefined) => {
        if (!id) return;
        try {
            const result = await deleteShoppingList(id);
            if (result) {
                const updatedLists = await fetchDataShoppingLists();
                if (updatedLists.length > 0) {
                    const lastList = updatedLists[updatedLists.length - 1];
                    setShoppingLists(updatedLists);
                    setShoppingList(lastList);

                    const updatedItems = await fetchDataShoppingListItems(lastList.items);
                    setShoppingListItems(updatedItems ? sortItems(updatedItems) : []);
                } else {
                    setShoppingLists([]);
                    setShoppingList(undefined);
                    setShoppingListItems([]);
                }
            }
        } catch (_error) {
            console.error("Error deleting the shopping list:", _error);
        }
    }, [fetchDataShoppingLists, fetchDataShoppingListItems, setShoppingList]);

    const handleCheckboxChange = useCallback(async (item: ShoppingListItem) => {
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

                await updateItemAndList(list, updatedItem);

                setTimeout(async () => {
                    const ids: number[] = list.items ? list.items : [];
                    const updatedItems = await fetchDataShoppingListItems(ids);
                    if (updatedItems) {
                        setShoppingListItems(sortItems(updatedItems));
                    }
                }, 500);
            }
        } catch (_error) {
            console.log(_error);
        }
    }, [shoppingList, fetchDataShoppingListItems]);

    useEffect(() => {
        fetchPipeline();
    }, [fetchPipeline]);


    useEffect(() => {
        if (itemAdded && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
            setItemAdded(false);
        }
    }, [shoppingListItems, itemAdded]);

    useEffect(() => {
        if (selectedIngredientID) {
            handleUnitChange();
        }
    }, [selectedIngredientID, handleUnitChange]);

    async function onSubmit(data: InventoryItem) {
        if (!data.ingredient || typeof data.ingredient !== 'string') {
            console.log('Please select a valid ingredient.');
            return;
        }
        await handleAddItemsToShoppingList([data]);
    }

    if (loaded) {
        return (
            <>
                <div className='flex flex-col h-full'>
                    <div className='h-[90%]'>
                        <span className='flex mb-4 flex-row justify-between items-center'>
                            <h1 className='font-semibold truncate text-[#011413] text-xl'>
                                Einkaufsliste ({shoppingList && shoppingList.created.toLocaleDateString() + " - " + shoppingList.created.getHours() + ":" + shoppingList.created.getMinutes()})
                            </h1>
                            <Menu menuButton={<MenuButton><IoIosMore className='size-5 mr-4 text-[#011413]' /></MenuButton>} transition>
                                <MenuItem onClick={() => handleAddPlannedIngredients()}>
                                    Geplantes Hinzufügen
                                </MenuItem>
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
                                <MenuItem onClick={() => handleDeleteShoppingList(shoppingList?.id)}>Liste löschen</MenuItem>

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
                        <ul className='overflow-y-scroll h-[90%] scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#046865] scrollbar-track-slate-100'>
                            {shoppingListItems ? shoppingListItems?.map(item => (
                                item ?
                                    <li className='w-full flex flex-row justify-between items-center'>
                                        <div key={item.id} className='text-[#011413] flex flex-row font-semibold items-center'>
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 mr-4 cursor-pointer rounded-full border border-gray-300 appearance-none checked:bg-[#046865] checked:border-transparent"
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
                                        <span className='flex flex-row justify-end pr-4 sm:pr-6'>
                                            <Menu menuButton={<MenuButton><IoIosMore className='size-5 text-[#011413]' /></MenuButton>} transition>
                                                <MenuItem onClick={() => handleDeleteShoppingListItem(item.id)}>Löschen</MenuItem>
                                            </Menu>
                                        </span>

                                    </li> : <>
                                        <LoadingSpinner />
                                    </>
                            )) : <LoadingSpinner />}
                            <div ref={bottomRef}></div>
                        </ul>
                    </div>
                    <form className='w-[90%] sm:w-full fixed sm:relative bottom-[7.4rem] sm:bottom-0 h-fit py-4 flex flex-row justify-between items-center pr-0 sm:pr-1' onSubmit={handleSubmit(onSubmit)}>
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
                                    min: 0.1,
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
                </div>

            </>
        )
    } else {
        return (<LoadingSpinner />)
    }

}

export default ShoppingListView