import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { MealService } from '../Endpoints/MealService';
import { IngredientService } from '../Endpoints/IngredientService';
import { useNavigate } from 'react-router-dom';
import { Ingredient } from '../Datatypes/Ingredient';
import { MealWithIngredientAmount } from '../Datatypes/Meal';
import { IoRemove } from 'react-icons/io5';

function CreateMeal() {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    const [_selectedIngredient, _setSelectedIngredient] = useState<Ingredient>();


    useEffect(() => {
        async function fetchData() {
            try {
                const data = await IngredientService.getAllIngredients()
                setIngredients(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();

    }, [])
    const {
        register,
        control,
        handleSubmit,
        formState: { errors } } = useForm<MealWithIngredientAmount>({
            defaultValues: {
                title: "",
                description: "",
                ingredients: [],
            },
            mode: 'all'
        });
    //const selectedIngredientID = watch('ingredients');

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "ingredients"
    });

    async function onSubmit(data: MealWithIngredientAmount) {
        try {
            const meal = await MealService.createMealWithAmounts({
                title: data.title,
                description: data.description,
                ingredients: data.ingredients,
                preparation: data.preparation,
                duration: data.duration,
            })
            if (meal) {
                navigate(-1);
            } else {
                console.log("Error when creating a meal")
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <h1 className='truncate text-[#57D1C2] mx-5 my-5 text-2xl font-semibold'>
                Create Meal
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className='h-100 px-3'>
                    <ul className='flex flex-col justify-center my-3 mx-1'>
                        <li key={"li-title"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='title'
                                className={`text-md text-[#57D1C2] font-bold truncate text-left align-middle mb-3`} >
                                Title:
                            </label>
                            <input
                                type='text'
                                id='title'
                                autoFocus={true}
                                {...register("title", {
                                    required: true,
                                })}
                                defaultValue={"Expert Model"}
                                className="border-slate-200 bg-white truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>
                        <li key={"li-description"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='description'
                                className={`text-md text-[#57D1C2] font-bold truncate text-left align-middle mb-3`} >
                                Description:
                            </label>
                            <textarea
                                rows={7}
                                id='description'
                                {...register("description", {
                                    required: true,
                                })}
                                defaultValue={"Lorem Ipsum"}
                                className="border-slate-200 bg-white truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>


                        <li key={"ingredients-key"} className="flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3">
                            <label
                                htmlFor="ingredients"
                                className={`text-md text-[#57D1C2] font-bold truncate text-left align-middle mb-3`} >
                                Ingredients:
                            </label>
                            <ul className='w-full'>
                                {fields.map((field, index) => (
                                    <li key={field.id} className="flex w-full mb-4">
                                        {/* Use a dropdown/select for ingredient titles */}
                                        <select
                                            key={"select-" + field.id}
                                            {...register(`ingredients.${index}.ingredient` as const, {
                                                required: true,
                                            })}
                                            defaultValue={ingredients ? ingredients[0].title : 0} // Ensure a valid initial value
                                            className="border-slate-200 bg-white mr-4 text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
                                        >
                                            <option key={"select-ingredient"} value="">Select Ingredient</option>
                                            {ingredients ? ingredients.map((ingredient) => (
                                                <option
                                                    key={ingredient.title}
                                                    value={ingredient.title}>
                                                    {ingredient.title}
                                                </option>
                                            )) : <></>}
                                        </select>
                                        <div className='flex flex-col mr-4 justify-start'>
                                            <input
                                                type='number'
                                                id='amount'
                                                step={0.01}
                                                {...register(`ingredients.${index}.amount` as const, {
                                                    valueAsNumber: true,
                                                    min: 0,
                                                    max: 50000,

                                                    required: true,
                                                })}
                                                defaultValue={1}
                                                className="border-slate-200 bg-white truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />

                                        </div>
                                        <div className='flex flex-col justify-start'>
                                            <input
                                                type='text'
                                                id='unit'
                                                {...register(`ingredients.${index}.unit` as const, {
                                                    required: true,
                                                })}
                                                defaultValue={"kg"}
                                                className="border-slate-200 bg-white truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />

                                        </div>

                                        <button type="button" onClick={() => remove(index)} className='px-3 bg-red-400 py-3 rounded-md text-white ml-4 text-base font-semibold flex flex-row items-center justify-center'>
                                            <IoRemove />
                                        </button>
                                    </li>
                                ))}
                                <li className='w-full flex flex-row justify-end items-center'>
                                    <button
                                        type="button"
                                        className='p-2 bg-[#FF6B00] text-white rounded-md flex flex-row justify-between items-center'
                                        onClick={() => append(0)}>
                                        Add Ingredient
                                    </button>
                                </li>

                            </ul>
                            {errors.ingredients && (
                                <p className="text-red-500">Please enter ingredient IDs for all fields.</p>
                            )}
                        </li>
                        <li key={"li-prep"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='preparation'
                                className={`text-md text-[#57D1C2] font-bold truncate text-left align-middle mb-3`} >
                                Preparation:
                            </label>
                            <input
                                type='text'
                                id='preparation'
                                {...register("preparation", {
                                    required: false,
                                })}
                                defaultValue={"Step 1"}
                                className="border-slate-200 bg-white truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>
                        <li key={"li-duration"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='duration'
                                className={`text-md text-[#57D1C2] font-bold truncate text-left align-middle mb-3`} >
                                Duration (in min):
                            </label>
                            <input
                                type='number'
                                id='duration'
                                step={1}
                                {...register("duration", {
                                    required: true,
                                    valueAsNumber: true,
                                    min: 0,
                                    max: 1000,
                                })}
                                defaultValue={10}
                                className="border-slate-200 truncate bg-white text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>
                    </ul>
                </div>
                <div className='w-full flex flex-row justify-end mb-6'>
                    <button className='p-2 bg-[#FF6B00] mr-6 text-white px-4 rounded-md text-lg' type='submit'>
                        Save Meal
                    </button>
                </div>
            </form>

        </>
    )
}

export default CreateMeal