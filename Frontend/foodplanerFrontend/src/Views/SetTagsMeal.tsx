import { useEffect, useState } from 'react'
import { Tag } from '../Datatypes/Tag';
import { useNavigate, useParams } from 'react-router-dom';
import { TagService } from '../Endpoints/TagService';
import { useFieldArray, useForm } from 'react-hook-form';
import { Meal, MealTags } from '../Datatypes/Meal';
import { MealService } from '../Endpoints/MealService';

function SetTagsMeal() {
    const navigate = useNavigate();
    const { mealID } = useParams();
    const [tags, setTags] = useState<Tag[]>();
    const [mealTags, setMealTags] = useState<MealTags>();
    const [meal, setMeal] = useState<Meal>();

    useEffect(() => {
        async function fetchData() {
            if (!mealID) return;
            try {
                const [mealTags, tags, meal] = await Promise.all([
                    TagService.getAllTagsFromMeal(Number(mealID)),
                    TagService.getAllTags(),
                    MealService.getMeal(mealID)
                ]);

                if (mealTags !== null) setMealTags(mealTags);
                if (tags !== null) setTags(tags);
                if (meal !== null) setMeal(meal);

                // Manually set default values
                setValue('tags', mealTags.tags || []);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, []);

    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors } } = useForm<MealTags>({
            defaultValues: {
                mealID: Number(mealID),
                tags: [],
            },
            mode: 'all'
        });

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "tags"
    });


    const onSubmit = (data: MealTags) => {
        try {
            console.log(data)
            TagService.createOrUpdateMealTags(data);
            //navigate(-1);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                Set Tags for {meal?.title}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className='h-100 px-3'>
                    <ul className='flex flex-col justify-center my-3 mx-1'>

                        <li key={"tags-key"} className="flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3">
                            <label htmlFor="tags" className="text-xs truncate text-left align-middle mb-3">
                                Ingredient Titles:
                            </label>
                            <div>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex">
                                        {/* Use a dropdown/select for ingredient titles */}
                                        <select
                                            key={"select-" + field.id}
                                            {...register(`tags.${index}` as const, {
                                                required: true,
                                            })}
                                            defaultValue={tags ? tags[0].name : 0} // Ensure a valid initial value
                                            className="border-slate-200 text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
                                        >
                                            <option key={"select-ingredient"} value="">Select Ingredient</option>
                                            {tags ? tags.map((tag) => (
                                                <option
                                                    key={tag.name}
                                                    value={tag.name}>
                                                    {tag.name}
                                                </option>
                                            )) : <></>}
                                        </select>

                                        <button type="button" onClick={() => remove(index)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => append(0)}>
                                    Add Tag
                                </button>
                            </div>
                            {errors.tags && (
                                <p className="text-red-500">Please enter ingredient IDs for all fields.</p>
                            )}
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

export default SetTagsMeal