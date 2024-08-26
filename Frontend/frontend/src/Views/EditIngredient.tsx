import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { IngredientService } from '../Endpoints/IngredientService';
import { useNavigate, useParams } from 'react-router-dom';
import { Ingredient } from '../Datatypes/Ingredient';

function EditIngredient() {
    const navigate = useNavigate();
    const { ingredientID } = useParams();

    const [ingredientData, setIngredientData] = useState<Ingredient | null>(null);

    const {
        register,
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
            <section className='w-full my-4 px-7 flex flex-col justify-start items-start flex-grow'>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Zutat '{ingredientData?.title}' anpassen
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
                        <li key={"li-pU"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor='preferedUnit'
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Bevorzugte Einheit:
                            </label>
                            <input
                                type='text'
                                id='preferedUnit'
                                {...register("preferedUnit", {
                                    required: true,
                                })}
                                defaultValue={"kg"}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start px-3 rounded-md mr-1' />
                        </li>
                    </ul>
                    <div className='w-full flex flex-row justify-end mb-6'>
                        <button
                            className='bg-[#046865] text-white font-semibold py-2.5 px-4 rounded-md text-base'
                            type='submit'>
                            Zutat Speichern
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default EditIngredient