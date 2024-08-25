import { useEffect, useState } from 'react'
import { TagDT } from '../Datatypes/Tag';
import { useNavigate, useParams } from 'react-router-dom';
import { TagService } from '../Endpoints/TagService';
import { useFieldArray, useForm } from 'react-hook-form';
import { Meal, MealTags } from '../Datatypes/Meal';
import { MealService } from '../Endpoints/MealService';
import { LuMinus } from 'react-icons/lu';
import { MdAdd } from 'react-icons/md';

function SetTagsMeal() {
    const navigate = useNavigate();
    const { mealID } = useParams();
    const [tags, setTags] = useState<TagDT[]>();
    const [_mealTags, _setMealTags] = useState<MealTags>();
    const [meal, setMeal] = useState<Meal>();
    const {
        register,
        control,
        setValue,
        handleSubmit,
        formState: { errors } } = useForm<MealTags>({
            defaultValues: {
                mealID: Number(mealID),
                tags: [],
            },
            mode: 'all'
        });

    useEffect(() => {
        async function fetchData() {
            if (!mealID) return;
            try {
                const tags = await TagService.getAllTags();
                const meal = await MealService.getMeal(mealID);
                let mealTags = null;

                try {
                    mealTags = await TagService.getAllTagsFromMeal(Number(mealID));
                } catch (error: any) {
                    // Handle 404 or other errors for mealTags
                    if (error.response && error.response.status === 404) {
                        console.log('MealTags not found (404)');
                    } else {
                        console.error('Error fetching MealTags:', error);
                    }
                }

                // Set states based on the retrieved data
                if (tags !== null) setTags(tags.sort((a, b) => a.name.localeCompare(b.name)));
                if (meal !== null) setMeal(meal);

                // Set mealTags in the form
                setValue('tags', mealTags ? mealTags.tags : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [mealID, setValue]);

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "tags"
    });


    const onSubmit = async (data: MealTags) => {
        try {
            console.log(data)
            await TagService.createOrUpdateMealTags(data);
            navigate(-1);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <section className='w-full my-4 px-7 flex flex-col justify-start items-start flex-grow'>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Tags für '{meal?.title}' verwalten
                </h1>
                <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                    <ul className='flex flex-col justify-center my-3'>
                        <li key={"tags-key"} className="flex flex-col flex-1 justify-between items-start mx-2 my-3">
                            <span className='w-full mb-3 flex flex-row justify-between items-center'>
                                <label
                                    htmlFor="meals"
                                    className={`text-sm text-[#011413] font-semibold truncate text-left align-middle `} >
                                    Tags:
                                </label>
                                <span className='flex flex-row justify-end items-center'>
                                    <label className='mr-2 text-base font-semibold' htmlFor='add_meal'>
                                        Hinzufügen
                                    </label>
                                    <button
                                        type='button'
                                        key={'add_meal'}
                                        className='bg-[#046865] p-2.5 w-fit text-white rounded-full'
                                        onClick={() => append(0)}>
                                        <MdAdd className='size-5' />
                                    </button>
                                </span>
                            </span>
                            <ul className='w-full'>
                                {fields.map((field, index) => (
                                    <li key={field.id} className="w-full flex flex-row justify-between mb-4 items-center">
                                        <select
                                            key={"select-" + field.id}
                                            {...register(`tags.${index}` as const, {
                                                required: true,
                                            })}
                                            defaultValue={tags && tags.length > 0 ? tags[0].name : ""}
                                            className='bg-white flex-1 w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-2' >

                                            <option key={"select-meal" + field.id} value="">Select Ingredient</option>
                                            {tags ? tags.map((tag) => (
                                                <option
                                                    key={tag.name + field.id}
                                                    value={tag.name}>
                                                    {tag.name}
                                                </option>
                                            )) : <></>}
                                        </select>
                                        <button
                                            type='button'
                                            className='bg-[#046865] p-2.5 w-fit text-white rounded-full'
                                            onClick={() => remove(index)}>
                                            <LuMinus className='size-5' />
                                        </button>
                                    </li>
                                ))}

                            </ul>
                            {errors.tags && (
                                <p className="text-red-500">Please enter meal IDs for all fields.</p>
                            )}
                        </li>

                    </ul>
                    <span className='w-full flex flex-row justify-end mb-6'>
                        <button className='bg-[#046865] text-white font-semibold py-2.5 px-4 rounded-md text-base' type='submit'>
                            Speichern und Zurück
                        </button>
                    </span>
                </form>
            </section>

        </>
    )
}

export default SetTagsMeal