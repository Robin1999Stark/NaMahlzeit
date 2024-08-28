import { useEffect, useState } from 'react'
import { TagDT } from '../Datatypes/Tag';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Meal, MealTags } from '../Datatypes/Meal';
import { LuMinus } from 'react-icons/lu';
import { MdAdd } from 'react-icons/md';
import { getMeal } from '../Endpoints/MealService';
import { getAllTags, getAllTagsFromMeal, createOrUpdateMealTags } from '../Endpoints/TagService';

type FormValues = {
    meal: number;
    tags: Array<string>;
}

function SetTagsMeal() {
    const navigate = useNavigate();
    const { mealID } = useParams();
    const [tags, setTags] = useState<TagDT[]>();
    const [meal, setMeal] = useState<Meal>();
    const [localTags, setLocalTags] = useState<string[]>([]);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors } } = useForm<FormValues>({
            defaultValues: {
                meal: Number(mealID),
                tags: [],
            },
            mode: 'all'
        });

    useEffect(() => {
        async function fetchData() {
            if (!mealID) return;
            try {
                const fetchedTags = await getAllTags();
                const fetchedMeal = await getMeal(mealID);
                let mealTags: MealTags | null = null;

                try {
                    mealTags = await getAllTagsFromMeal(Number(mealID));
                } catch (error: unknown) {
                    const axiosError = error as ErrorResponse;
                    if (axiosError.status === 404) {
                        console.log('MealTags not found (404)');
                    } else {
                        console.error('Error fetching MealTags:', error);
                    }
                }
                if (!fetchedMeal) return;
                setTags(fetchedTags ? fetchedTags.sort((a, b) => a.name.localeCompare(b.name)) : []);
                setMeal(fetchedMeal);
                setLocalTags(mealTags ? mealTags.tags : []);
                setValue('tags', mealTags ? mealTags.tags : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [mealID, setValue]);

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

            await createOrUpdateMealTags({
                mealID: data.meal,
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
                                <p className="text-red-500">Please enter meal IDs for all fields.</p>
                            )}
                        </li>

                    </ul>
                    <span className='w-full flex flex-row justify-end mb-6'>
                        <button
                            className='bg-[#046865] text-white font-semibold py-2.5 px-4 rounded-md text-base'
                            type='submit'>
                            Speichern und Zurück
                        </button>
                    </span>
                </form>
            </section>

        </>
    )
}

export default SetTagsMeal