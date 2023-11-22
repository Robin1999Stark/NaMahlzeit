import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Meal } from '../Datatypes/Meal';
import { MealService } from '../Endpoints/MealService';

function CreateMeal() {

    const [meal, setMeal] = useState<Meal>();

    const form = useForm<Meal>({
        defaultValues: {
            title: "",
            description: "",
            ingredientIDs: [],
        },
        mode: 'all'
    });
    const { register, control, handleSubmit } = form


    const onSubmit = (data: Meal) => {
        try {
            MealService.createMeal({ title: data.title, description: data.description, ingredients: data.ingredientIDs })
        } catch (error) {
            console.log(error)
        }
        console.log('Form submitted', data)
    }
    return (
        <>
            <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                Create Meal
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className='h-100 px-3'>
                    <ul className='flex flex-col justify-center my-3 mx-1'>
                        <li className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='title'
                                className={`text-xs truncate text-left align-middle mb-3`} >
                                Title:
                            </label>
                            <input
                                type='text'
                                id='title'
                                {...register("title", {
                                    required: true,
                                })}
                                defaultValue={"Expert Model"}
                                className="border-slate-200 truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>
                        <li className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
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

                    </ul>
                </div>
                <div className='w-100 my-4 flex flex-1 justify-center align-middle'>
                    <div className='mb-4 mx-6'>
                        <button className='p-2 bg-slate-500 text-white px-4 rounded-md text-lg' type='submit'>Save</button>
                    </div>

                </div>
            </form>
        </>
    )
}

export default CreateMeal