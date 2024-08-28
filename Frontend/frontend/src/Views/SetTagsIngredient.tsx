import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import { TagDT } from '../Datatypes/Tag';
import { Ingredient, IngredientTags } from '../Datatypes/Ingredient';
import { MdAdd } from 'react-icons/md';
import { LuMinus } from 'react-icons/lu';
import { getIngredient } from '../Endpoints/IngredientService';
import { getAllTags, getAllTagsFromIngredient, createOrUpdateIngredientTags } from '../Endpoints/TagService';

type FormValues = {
    ingredient: string;
    tags: Array<string>;
}

function SetTagsIngredient() {
    const navigate = useNavigate();
    const { ingredientID } = useParams();
    const [tags, setTags] = useState<TagDT[]>();
    const [ingredient, setIngredient] = useState<Ingredient>();
    const [localTags, setLocalTags] = useState<string[]>([]);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors } } = useForm<FormValues>({
            defaultValues: {
                ingredient: ingredientID || '',
                tags: [],
            },
            mode: 'all'
        });


    useEffect(() => {
        async function fetchData() {
            if (!ingredientID) return;
            try {
                const fetchedTags = await getAllTags();
                const fetchedIngredient = await getIngredient(ingredientID);
                let ingredientTags: IngredientTags | null = null;

                try {
                    ingredientTags = await getAllTagsFromIngredient(ingredientID);
                } catch (error: unknown) {
                    const axiosError = error as ErrorResponse;
                    if (axiosError.status === 404) {
                        console.log('Tags not found (404)');
                    } else {
                        console.error('Error fetching tags:', error);
                    }
                }

                setTags(fetchedTags ? fetchedTags.sort((a, b) => a.name.localeCompare(b.name)) : []);
                setIngredient(fetchedIngredient);
                setLocalTags(ingredientTags ? ingredientTags.tags : []);
                setValue('tags', ingredientTags ? ingredientTags.tags : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [ingredientID, setValue]);


    const addTag = () => {
        setLocalTags([...localTags, '']);
    };

    const removeTag = (index: number) => {
        setLocalTags(prevTags => prevTags.filter((_, i) => i !== index));
    };


    const handleTagChange = (index: number, value: string) => {
        setLocalTags(prevTags => {
            const updatedTags = [...prevTags];
            updatedTags[index] = value;
            setValue('tags', updatedTags);
            return updatedTags;
        });
    };

    const onSubmit = async (data: FormValues) => {
        try {
            setValue('tags', localTags);

            await createOrUpdateIngredientTags({
                ingredient: data.ingredient,
                tags: localTags
            });

            navigate(-1);
        } catch (error) {
            console.error(error);
        }
    };

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
                                        onClick={addTag}>
                                        <MdAdd className='size-5' />
                                    </button>
                                </span>
                            </span>
                            <ul className='w-full'>
                                {localTags.map((tag, index) => (
                                    <li key={index} className="w-full flex flex-row justify-between mb-4 items-center">
                                        <select
                                            {...register(`tags.${index}` as const, {
                                                required: true,
                                            })}
                                            value={tag}
                                            onChange={(e) => handleTagChange(index, e.target.value)}
                                            className='bg-white flex-1 w-full shadow-sm focus:shadow-lg py-2 text-start px-3 rounded-md mr-2'>
                                            <option value="">Select Tag</option>
                                            {tags && tags.map((tag) => (
                                                <option
                                                    key={tag.name}
                                                    value={tag.name}>
                                                    {tag.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type='button'
                                            className='bg-[#046865] p-2.5 w-fit text-white rounded-full'
                                            onClick={() => removeTag(index)}>
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