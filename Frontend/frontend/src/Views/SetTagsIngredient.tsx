import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { TagDT } from '../Datatypes/Tag';
import { TagService } from '../Endpoints/TagService';
import { Ingredient, IngredientTags } from '../Datatypes/Ingredient';
import { IngredientService } from '../Endpoints/IngredientService';

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
            <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                Set Tags for {ingredient?.title}
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
                                            defaultValue={tags && tags.length > 0 ? tags[0].name : ""}
                                            className="border-slate-200 text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
                                        >
                                            <option key={"select-ingredient" + field.id} value="">Select Ingredient</option>
                                            {tags ? tags.map((tag) => (
                                                <option
                                                    key={tag.name + field.id}
                                                    value={tag.name}>
                                                    {tag.name}
                                                </option>
                                            )) : <></>}
                                        </select>

                                        <button key={'remove-' + field.id} type="button" onClick={() => remove(index)}>
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
                        <button className='p-2 bg-slate-500 text-white px-4 rounded-md text-lg' type='submit'>Save and Go Back</button>
                    </div>
                </div>
            </form>

        </>
    )
}

export default SetTagsIngredient