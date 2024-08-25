import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { TagDT } from '../Datatypes/Tag';
import { TagService } from '../Endpoints/TagService';
import { Ingredient, IngredientTags } from '../Datatypes/Ingredient';
import { IngredientService } from '../Endpoints/IngredientService';
import { MdAdd } from 'react-icons/md';
import { LuMinus } from 'react-icons/lu';

function SetTagsIngredient() {
    const navigate = useNavigate();
    const { ingredientID } = useParams();
    const [tags, setTags] = useState<TagDT[]>();
    const [ingredient, setMeal] = useState<Ingredient>();
    const {
        register,
        control,
        setValue,
        handleSubmit,
        formState: { errors } } = useForm<IngredientTags>({
            defaultValues: {
                ingredient: ingredientID,
                tags: [],
            },
            mode: 'all'
        });

    useEffect(() => {
        async function fetchData() {
            if (!ingredientID) return;
            try {
                const tags = await TagService.getAllTags();
                const ingredient = await IngredientService.getIngredient(ingredientID);
                let ingredientTags = null;

                try {
                    ingredientTags = await TagService.getAllTagsFromIngredient(ingredientID);
                } catch (error: any) {
                    // Handle 404 or other errors for ingredientTags
                    if (error.response && error.response.status === 404) {
                        console.log('MealTags not found (404)');
                    } else {
                        console.error('Error fetching MealTags:', error);
                    }
                }

                // Set states based on the retrieved data
                if (tags !== null) setTags(tags.sort((a, b) => a.name.localeCompare(b.name)));
                if (ingredient !== null) setMeal(ingredient);

                // Set ingredientTags in the form
                setValue('tags', ingredientTags ? ingredientTags.tags : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [ingredientID, setValue]);

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "tags"
    });


    const onSubmit = async (data: IngredientTags) => {
        try {
            console.log(data)
            await TagService.createOrUpdateIngredientTags(data);
            navigate(-1);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <section className='w-full my-4 px-7 flex flex-col justify-start items-start flex-grow'>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Tags für '{ingredient?.title}' verwalten
                </h1>
                <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                    <ul className='flex flex-col justify-center my-3'>
                        <li key={"tags-key"} className="flex flex-col flex-1 justify-between items-start mx-2 my-3">
                            <span className='w-full mb-3 flex flex-row justify-between items-center'>
                                <label
                                    htmlFor="ingredients"
                                    className={`text-sm text-[#011413] font-semibold truncate text-left align-middle `} >
                                    Tags:
                                </label>
                                <span className='flex flex-row justify-end items-center'>
                                    <label className='mr-2 text-base font-semibold' htmlFor='add_ingredient'>
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
                                    <li key={field.id} className="w-full flex flex-row justify-between mb-4 items-center">
                                        {/* Use a dropdown/select for ingredient titles */}
                                        <select
                                            key={"select-" + field.id}
                                            {...register(`tags.${index}` as const, {
                                                required: true,
                                            })}
                                            defaultValue={tags && tags.length > 0 ? tags[0].name : ""}
                                            className='bg-white flex-1 w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-2' >

                                            <option key={"select-ingredient" + field.id} value="">Select Ingredient</option>
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
                                <p className="text-red-500">Please enter ingredient IDs for all fields.</p>
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

export default SetTagsIngredient