import { ChangeEvent, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Ingredient } from '../Datatypes/Ingredient';
import { MealWithIngredientAmount } from '../Datatypes/Meal';
import { LuMinus } from 'react-icons/lu';
import { MdAdd } from 'react-icons/md';
import { getAllIngredients } from '../Endpoints/IngredientService';
import { createMealWithAmounts } from '../Endpoints/MealService';
import { AiOutlineEdit } from 'react-icons/ai';
import PlaceholderMealImage from '../Components/PlaceholderMealImage';
function CreateMeal() {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState<Ingredient[]>();
    const [pictureURL, setPictureURL] = useState<string | null>(null);
    const [picture, setPicture] = useState<File | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllIngredients()
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
                portion_size: 4,
                picture: null,
            },
            mode: 'all'
        });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients"
    });

    function handlePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setPicture(file);
        if (file) {
            // Create an object URL and set it as the picture preview
            const objectURL = URL.createObjectURL(file);
            setPictureURL(objectURL);
        }
    }
    async function onSubmit(data: MealWithIngredientAmount) {
        try {
            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('preparation', data.preparation || "");
            formData.append('duration', data.duration.toString());
            formData.append('portion_size', data.portion_size.toString());

            data.ingredients.forEach((ingredient, index) => {
                formData.append(`ingredients[${index}].ingredient`, ingredient.ingredient);
                formData.append(`ingredients[${index}].amount`, ingredient.amount.toString());
                formData.append(`ingredients[${index}].unit`, ingredient.unit);
            });

            if (picture) {
                formData.append('picture', picture);
            }

            const response = await createMealWithAmounts(formData);
            if (response) {
                navigate(-1);
            } else {
                console.log("Error when creating a meal");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <section className='w-full my-4 px-7 flex flex-col justify-start items-start flex-grow'>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Neues Gericht erstellen
                </h1>
                <form className='w-full' onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <ul className='flex flex-col justify-center my-3'>
                        <li className='flex w-100 flex-col justify-between items-start my-3'>
                            <label htmlFor='picture' className='text-sm mb-2 text-[#011413] font-semibold'>
                                Bild:
                            </label>
                            <input
                                type='file'
                                id='picture'
                                accept='image/*'
                                onChange={handlePictureChange}
                                className='hidden'
                            />
                            <div className='relative w-full max-w-[24rem] max-h-[24rem]'>
                                <label htmlFor='picture' className='cursor-pointer  hover:opacity-90'>
                                    {pictureURL ? (
                                        <img
                                            src={pictureURL}
                                            alt="Selected"
                                            className='w-full h-full rounded-full object-cover aspect-square'
                                        />
                                    ) : (
                                        <PlaceholderMealImage rounded border='full' />
                                    )}

                                    {/* Overlay Icon */}
                                    <span className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-black bg-opacity-70 text-white rounded-full p-6'>
                                        <AiOutlineEdit className='size-8' />
                                    </span>
                                </label>
                            </div>
                        </li>
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
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
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
                                <label htmlFor="ingredients" className={`text-sm text-[#011413] font-semibold truncate text-left align-middle `} >
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
                                        onClick={() => append({ ingredient: "", amount: 1, unit: "g" })}>
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
                                        <span className='flex flex-col mr-4 justify-start'>
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
                                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
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
                                defaultValue={10}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                        </li>
                        <li key={"li-portion-size"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label htmlFor='portion_size' className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Portionsgröße:
                            </label>
                            <input
                                type='number'
                                id='portion_size'
                                step={1}
                                {...register("portion_size", {
                                    required: true,
                                    valueAsNumber: true,
                                    min: 1,
                                    max: 1000,
                                })}
                                defaultValue={4}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start px-3 rounded-md mr-1' />
                        </li>

                    </ul>
                    <span className='w-full flex flex-row justify-end mb-6'>
                        <button
                            className='bg-[#046865] text-white sm:w-fit w-full font-semibold py-2.5 px-4 rounded-md text-base'
                            type='submit'>
                            Gericht erstellen
                        </button>
                    </span>
                </form>
            </section>
        </>
    )
}

export default CreateMeal