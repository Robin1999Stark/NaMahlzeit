import { useEffect, useState } from 'react'
import { InventoryItem } from '../Datatypes/Inventory'
import { InventoryService } from '../Endpoints/InventoryService'
import { useForm } from 'react-hook-form';
import { IngredientService } from '../Endpoints/IngredientService';
import { Ingredient } from '../Datatypes/Ingredient';
import { IoRemove } from 'react-icons/io5';

function InventoryListView() {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    const [inventory, setInventory] = useState<InventoryItem[]>();
    const [add, setAdd] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors } } = useForm<InventoryItem>({
            defaultValues: {
                ingredient: "",
                amount: 0,
                unit: "kg",
            },
            mode: 'all'
        });
    console.log(errors)
    /*const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "ingredients"
});*/
    async function fetchDataIngredients() {
        try {
            const data = await IngredientService.getAllIngredients()
            setIngredients(data)
        } catch (error) {
            console.log(error)
        }
    }
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
        console.log('Form submitted', data)
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
            <h1 className='truncate text-[#57D1C2] mx-5 my-5 text-2xl font-semibold'>
                Inventory
            </h1>
            <div className='mx-4 w-full'>
                <form className='grid grid-cols-2 gap-2' onSubmit={handleSubmit(onSubmit)}>
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
                            className="border-slate-200 bg-white h-12 truncate text-base font-semibold align-middle mr-2 focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        <input
                            type='text'
                            id='unit'
                            {...register(`unit` as const, {
                                required: true,
                            })}
                            defaultValue={"kg"}
                            className="border-slate-200 bg-white truncate h-12 text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />

                        <button onClick={() => setAdd(true)} className='p-2 ml-4 bg-green-400 text-gray-900 px-4 truncate w-full rounded-md text-lg' type='submit'>+ Add</button>
                        <button onClick={() => setAdd(false)} className='p-2 ml-4 bg-red-400 text-white px-4 truncate w-full rounded-md text-lg' type='submit'>- Subtract</button>

                    </div>
                    {inventory ? inventory?.map(inv => (
                        <>
                            <div key={inv.ingredient + Math.random()} className='p-2 flex text-white flex-row font-semibold items-center'>
                                {inv.ingredient}
                            </div>
                            <div className='p-2 flex font-semibold flex-row justify-between text-white items-center'>
                                {inv.amount + " " + inv.unit}
                                <button onClick={() => deleteInventoryItem(inv.id)} className='px-3 bg-red-400 py-3 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                                    <IoRemove />
                                </button>
                            </div>
                        </>
                    )) : <h1>Loading...</h1>}
                </form>
            </div>

        </>
    )
}

export default InventoryListView