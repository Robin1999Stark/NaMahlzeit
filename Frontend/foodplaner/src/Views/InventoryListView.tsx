import React, { useEffect, useState } from 'react'
import { InventoryItem } from '../Datatypes/Inventory'
import { InventoryService } from '../Endpoints/InventoryService'
import { useForm, useFieldArray } from 'react-hook-form';
import { Ingredient, MealWithIngredientAmount } from '../Datatypes/Meal';
import { MealService } from '../Endpoints/MealService';
import { IngredientService } from '../Endpoints/IngredientService';

function InventoryListView() {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    const [inventory, setInventory] = useState<InventoryItem[]>();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors } } = useForm<InventoryItem>({
            defaultValues: {
                ingredient: "",
                amount: 0,
                unit: "kg",
            },
            mode: 'all'
        });
    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "ingredients"
    });
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

            InventoryService.createInventoryItem({ ingredient: data.ingredient, amount: data.amount, unit: data.unit })
            fetchPipeline();
        } catch (error) {
            console.log(error)
        }
        console.log('Form submitted', data)
    }


    return (
        <>
            <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                Inventory
            </h1>
            <ul className='mx-5'>
                <li key={'create'} className='flex flex-row justify-start'>
                    <form className='flex flex-row' onSubmit={handleSubmit(onSubmit)}>
                        <select
                            key={"select-ingredient"}
                            {...register(`ingredient` as const, {
                                required: true,
                            })}
                            defaultValue={ingredients ? ingredients?.at(0)?.title : 0} // Ensure a valid initial value
                            className="border-slate-200 text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
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
                        <div className='flex flex-col justify-start'>
                            <input
                                type='number'
                                id='amount'
                                step={0.01}
                                {...register(`amount` as const, {
                                    valueAsNumber: true,
                                    min: 0,
                                    max: 50000,

                                    required: true,
                                })}
                                defaultValue={1}
                                className="border-slate-200 truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />

                        </div>
                        <div className='flex flex-col justify-start'>
                            <input
                                type='text'
                                id='unit'
                                {...register(`unit` as const, {
                                    required: true,
                                })}
                                defaultValue={"kg"}
                                className="border-slate-200 truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />

                        </div>
                        <div className='mb-4 mx-6'>
                            <button className='p-2 bg-slate-500 text-white px-4 rounded-md text-lg' type='submit'>Save</button>
                        </div>
                    </form>

                </li>
                {inventory ? inventory?.map(inv => (
                    <li key={inv.ingredient + Math.random()} className='p-2'>
                        {inv.ingredient + " : " + inv.amount + inv.unit}
                    </li>)) : <h1>Loading...</h1>}
            </ul>
        </>
    )
}

export default InventoryListView