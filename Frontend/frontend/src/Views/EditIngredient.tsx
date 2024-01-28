import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { MealService } from '../Endpoints/MealService';
import { IngredientService } from '../Endpoints/IngredientService';
import { useNavigate, useParams } from 'react-router-dom';
import { MealIngredientService } from '../Endpoints/MealIngredientService';
import { Ingredient } from '../Datatypes/Ingredient';
import { Meal, MealWithIngredientAmountMIID } from '../Datatypes/Meal';

function EditIngredient() {
    const navigate = useNavigate();
    const { ingredientID } = useParams();

    const [ingredientData, setIngredientData] = useState<Ingredient | null>(null);



    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors } } = useForm<Ingredient>({
            defaultValues: {
                title: ingredientData?.title || "",
                description: ingredientData?.description || "",
                preferedUnit: ingredientData?.preferedUnit || ""
            },
            mode: 'all'
        });

    useEffect(() => {
        async function fetchData() {
            if (!ingredientID) return;
            try {
                const [ingredient] = await Promise.all([
                    IngredientService.getIngredient(ingredientID),
                ]);
                if (ingredient !== null) setIngredientData(ingredient);

                // Manually set default values
                setValue('title', ingredient?.title || '');
                setValue('description', ingredient?.description || '');
                setValue('preferedUnit', ingredient?.preferedUnit || '');

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [ingredientID, setValue]);


    const onSubmit = (data: Ingredient) => {
        try {
            IngredientService.updateIngredient(data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                Edit Ingredient
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className='h-100 px-3'>
                    <ul className='flex flex-col justify-center my-3 mx-1'>
                        <li className='ml-2 text-xl font-semibold'>
                            {ingredientData?.title}
                        </li>
                        <li key={"li-description"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='description'
                                className={`text-xs truncate text-left align-middle mb-3`} >
                                Description:
                            </label>
                            <input
                                type='text'
                                id='description'
                                {...register("description", {
                                    required: true,
                                })}
                                defaultValue={"Lorem Ipsum"}
                                className="border-slate-200 truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>
                        <li key={"li-preferedUnit"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='preferedUnit'
                                className={`text-xs truncate text-left align-middle mb-3`} >
                                prefered Unit:
                            </label>
                            <input
                                type='text'
                                id='preferedUnit'
                                {...register("preferedUnit", {
                                    required: true,
                                })}
                                defaultValue={"Lorem Ipsum"}
                                className="border-slate-200 truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>
                    </ul>
                </div>
                <div className='w-100 my-4 flex flex-1 justify-center align-middle'>

                    <div className='mb-4 mx-6'>
                        <button className='p-2 bg-slate-500 text-white px-4 rounded-md text-lg' type='submit'>Save</button>
                    </div>
                </div>
            </form>
            <div className='mb-4 mx-6'>
                <button className='p-2 bg-slate-500 text-white px-4 rounded-md text-lg' onClick={() => navigate(-1)}>Go Back</button>
            </div>
        </>
    )
}

export default EditIngredient