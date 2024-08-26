import { useEffect, useState } from 'react'
import { InventoryItem } from '../Datatypes/Inventory'
import { InventoryService } from '../Endpoints/InventoryService'
import { useForm } from 'react-hook-form';
import { IngredientService } from '../Endpoints/IngredientService';
import { Ingredient } from '../Datatypes/Ingredient';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { IoIosMore } from 'react-icons/io';
import { MdAdd } from 'react-icons/md';
import { LuMinus } from "react-icons/lu";
import AutoCompleteInput from '../Components/AutoCompleteInput';
import LoadingSpinner from '../Components/LoadingSpinner';

function InventoryListView() {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    const [inventory, setInventory] = useState<InventoryItem[]>();
    const [add, setAdd] = useState<boolean>(false);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | string>("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors } } = useForm<InventoryItem>({
            defaultValues: {
                ingredient: "",
                amount: 0,
                unit: "kg",
            },
            mode: 'all'
        });

    async function fetchDataIngredients() {
        try {
            const data = await IngredientService.getAllIngredients()
            setIngredients(data)
        } catch (error) {
            console.log(error)
        }
    }
    async function handleAutoCompleteSearch(query: string) {
        try {
            const data = await IngredientService.getAllIngredients()
            const results: string[] = data.map((ingredient) => ingredient.title).filter((title) => title.toLowerCase().includes(query.toLowerCase()));
            return results

        } catch (error) {
            return [];
        }
    }
    const handleIngredientSelect = (ingredient: Ingredient | string) => {
        setSelectedIngredient(ingredient);
        if (typeof ingredient === 'string') {
            setValue('ingredient', ingredient);
        } else {
            setValue('ingredient', ingredient.title);
        }
    };
    async function fetchDataInventory() {
        try {
            const data = await InventoryService.getAllInventoryItems()
            //const sorted = data.sort((a, b) => a.ingredient.localeCompare(b.ingredient))
            setInventory(data)
        } catch (error) {
            console.log(error)
        }
    }
    async function fetchPipeline() {
        await fetchDataIngredients();
        await fetchDataInventory();
    }

    useEffect(() => {
        fetchPipeline();
    }, []);

    const onSubmit = (data: InventoryItem) => {
        try {
            if (add) {
                InventoryService.createInventoryItem({ ingredient: data.ingredient, amount: data.amount, unit: data.unit })
                fetchPipeline();

            } else {
                InventoryService.createInventoryItem({ ingredient: data.ingredient, amount: -data.amount, unit: data.unit })
                fetchPipeline();

            }
            fetchPipeline();
        } catch (error) {
            console.log(error)
        }
    }
    async function deleteInventoryItem(id: number) {
        try {
            await InventoryService.deleteInventoryItem(id);
            fetchPipeline();
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <span className='flex flex-row justify-between items-center'>
                <h1 className='mb-4 font-semibold text-[#011413] text-xl'>
                    Bestandsliste
                </h1>
                <Menu menuButton={<MenuButton><IoIosMore className='size-5 mr-4 text-[#011413]' /></MenuButton>} transition>
                </Menu>
            </span>
            <ul className='overflow-y-scroll h-5/6 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#046865] scrollbar-track-slate-100'>
                {inventory ? inventory?.map(inv => (
                    <li className='w-full flex flex-row justify-between items-center'>
                        <div key={inv.id} className='px-1 text-[#011413] flex flex-row font-semibold items-center'>

                            <p>
                                {inv.ingredient}
                            </p>
                        </div>
                        <div key={inv.ingredient + "unit"} className='p-2 flex text-[#011413] font-semibold flex-row justify-between items-center'>
                            {inv.amount + " " + inv.unit}
                        </div>
                        <span className='flex flex-row justify-end pr-4 sm:pr-6'>
                            <Menu menuButton={<MenuButton><IoIosMore className='size-5 text-[#011413]' /></MenuButton>} transition>
                                <MenuItem onClick={() => deleteInventoryItem(inv.id)}>Löschen</MenuItem>
                            </Menu>
                        </span>

                    </li>

                )) : <LoadingSpinner />}
            </ul>
            <form className='w-full h-fit py-4 flex flex-row justify-between items-center pr-0 sm:pr-1' onSubmit={handleSubmit(onSubmit)}>
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
                        className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start px-3 rounded-md mr-1'
                    />
                    <input
                        key={'unit'}
                        type='text'
                        id='unit'
                        {...register(`unit` as const, {
                            required: true,
                        })}
                        defaultValue={"kg"}
                        className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start px-3 rounded-md'
                    />
                </div>
                <button
                    className='bg-[#046865] ml-2 w-fit text-white p-3 rounded-full'
                    onClick={() => setAdd(true)}>
                    <MdAdd className='size-5' />
                </button>
                <button
                    className='bg-[#046865] ml-2 w-fit text-white p-3 rounded-full'
                    onClick={() => setAdd(false)}>
                    <LuMinus className='size-5' />
                </button>
            </form>

        </>
    )
}

export default InventoryListView