import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { MealService } from '../Endpoints/MealService';
import { IngredientService } from '../Endpoints/IngredientService';
import { useNavigate, useParams } from 'react-router-dom';
import { MealIngredientService } from '../Endpoints/MealIngredientService';
import { IngredientAmountWithMeal, Ingredient } from '../Datatypes/Ingredient';
import { Meal, MealWithIngredientAmountMIID } from '../Datatypes/Meal';
import { IoRemove } from 'react-icons/io5';
import { LuMinus } from 'react-icons/lu';
import { MdAdd } from 'react-icons/md';

function EditMeal() {
    const navigate = useNavigate();
    const { mealID } = useParams();

    const [mealData, setMealData] = useState<Meal | null>(null);
    const [mealIngredients, setMealIngredients] = useState<IngredientAmountWithMeal[]>([])

    const [ingredients, setIngredients] = useState<Ingredient[]>()
    const [_selectedIngredient, _setSelectedIngredient] = useState<Ingredient>();


    const {
        register,
        control,
        setValue,
        handleSubmit,
        formState: { errors } } = useForm<MealWithIngredientAmountMIID>({
            defaultValues: {
                title: mealData?.title || "",
                description: mealData?.description || "",
                ingredients: mealIngredients || [],
                preparation: mealData?.preparation || "",
                duration: mealData?.duration || 0,
            },
            mode: 'all'
        });

    useEffect(() => {
        async function fetchData() {
            if (!mealID) return;
            try {
                const [meal, allIngredients, mealIngredients] = await Promise.all([
                    MealService.getMeal(mealID),
                    IngredientService.getAllIngredients(),
                    MealIngredientService.getAllMealIngredients(Number(mealID))
                ]);
                if (meal !== null) setMealData(meal);
                if (allIngredients !== null) setIngredients(allIngredients);
                if (mealIngredients !== null) setMealIngredients(mealIngredients);

                setValue('title', meal?.title || '');
                setValue('description', meal?.description || '');
                setValue('preparation', meal?.preparation || '');
                setValue('duration', meal?.duration || 0);
                setValue('ingredients', mealIngredients || []);

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [mealID, setValue]);

    //const selectedIngredientID = watch('ingredients');

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "ingredients"
    });

    const onSubmit = (data: MealWithIngredientAmountMIID) => {
        try {
            MealService.updateMeal(Number(mealID), data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <section className='w-full my-4 px-7 flex flex-col justify-start items-start flex-grow'>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Gericht '{mealData?.title}' anpassen
                </h1>
                <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                    <ul className='flex flex-col justify-center my-3'>
                        <li key={"li-title"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor='title'
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Titel:
                            </label>
                            <input
                                type='text'
                                title='Titel'
                                id='title'
                                autoFocus={true}
                                {...register("title", {
                                    required: true,
                                })}
                                defaultValue={"Gericht"}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start px-3 rounded-md mr-1' />
                        </li>
                        <li key={"li-description"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor='description'
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Beschreibung:
                            </label>
                            <textarea
                                rows={7}
                                id='description'
                                {...register("description", {
                                    required: true,
                                })}
                                defaultValue={"Lorem Ipsum"}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start px-3 rounded-md mr-1' />
                        </li>
                        <li key={"ingredients-key"} className="flex w-100 flex-col flex-1 justify-between items-start my-3">
                            <span className='w-full mb-3 flex flex-row justify-between items-center'>
                                <label
                                    htmlFor="ingredients"
                                    className={`text-sm text-[#011413] font-semibold truncate text-left align-middle `} >
                                    Zutaten:
                                </label>
                                <span className='flex flex-row justify-end items-center'>
                                    <label className='mr-2 text-sm font-semibold' htmlFor='add_ingredient'>
                                        Hinzufügen
                                    </label>
                                    <button
                                        type='button'
                                        key={'add_ingredient'}
                                        className='bg-[#046865] p-2.5 w-fit text-white rounded-full'
                                        onClick={() => append(0)}>
                                        <MdAdd className='size-5' />
                                    </button>
                                </span>
                            </span>
                            <ul className='w-full'>
                                {fields.map((field, index) => (
                                    <li key={field.id} className="flex w-full mb-4">
                                        <select
                                            key={"select-" + field.id}
                                            {...register(`ingredients.${index}.ingredient` as const, {
                                                required: true,
                                            })}
                                            defaultValue={ingredients ? ingredients[0].title : 0} // Ensure a valid initial value
                                            className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' >
                                            <option key={"select-ingredient"} value="">Select Ingredient</option>
                                            {ingredients ? ingredients.map((ingredient) => (
                                                <option
                                                    key={ingredient.title}
                                                    value={ingredient.title}>
                                                    {ingredient.title}
                                                </option>
                                            )) : <></>}
                                        </select>
                                        <span className='flex flex-col mr-1 justify-start'>
                                            <input
                                                type='number'
                                                id='amount'
                                                step={1}
                                                {...register(`ingredients.${index}.amount` as const, {
                                                    valueAsNumber: true,
                                                    min: 0,
                                                    max: 5000,
                                                    required: true,
                                                })}
                                                defaultValue={1}
                                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start px-3 rounded-md mr-1' />
                                        </span>
                                        <span className='flex flex-col justify-start'>
                                            <input
                                                type='text'
                                                id='unit'
                                                {...register(`ingredients.${index}.unit` as const, {
                                                    required: true,
                                                })}
                                                defaultValue={"kg"}
                                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                                        </span>
                                        <button
                                            type='button'
                                            className='bg-[#046865] p-2.5 w-fit text-white rounded-full'
                                            onClick={() => remove(index)}>
                                            <LuMinus className='size-5' />
                                        </button>

                                    </li>
                                ))}

                            </ul>
                            {errors.ingredients && (
                                <p className="text-red-500">Please enter ingredient IDs for all fields.</p>
                            )}
                        </li>
                        <li key={"li-prep"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor='preparation'
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Zubereitung:
                            </label>
                            <input
                                type='text'
                                id='preparation'
                                {...register("preparation", {
                                    required: false,
                                })}
                                defaultValue={"Step 1"}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                        </li>
                        <li key={"li-duration"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor='duration'
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Zubereitungs Dauer (in Minuten):
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
                                defaultValue={60}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                        </li>
                    </ul>
                    <div className='w-full flex flex-row justify-end mb-6'>
                        <button
                            className='bg-[#046865] text-white font-semibold sm:w-fit w-full py-2.5 px-4 rounded-md text-base'
                            type='submit'>
                            Gericht Speichern
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default EditMeal