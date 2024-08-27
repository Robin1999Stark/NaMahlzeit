import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Ingredient } from '../Datatypes/Ingredient'
import { createIngredient } from '../Endpoints/IngredientService'

function CreateIngredient() {
    const navigate = useNavigate();
    const [, setWikiResult] = useState<string>('');

    async function handleWikiSearch(searchTerm: string) {
        try {
            const response = await axios.get(
                `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${searchTerm}`
            );
            const pageId = Object.keys(response.data.query.pages)[0];
            const extract = response.data.query.pages[pageId].extract;

            setWikiResult(extract);
        } catch (error) {
            console.error('Error fetching data from Wikipedia:', error);
        }
    }
    useEffect(() => {

    }, [])
    const {
        register,
        handleSubmit,
        formState: { errors } } = useForm<Ingredient>({
            defaultValues: {
                title: "",
                description: "",
                preferedUnit: "",
            },
            mode: 'all'
        });
    console.log(errors)

    async function onSubmit(data: Ingredient) {
        try {
            await createIngredient({ title: data.title, description: data.description, preferedUnit: data.preferedUnit })
            navigate('/ingredients')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>

            <section className='w-full my-4 px-7 flex flex-col justify-start items-start flex-grow'>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Neue Zutat erstellen
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
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
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
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                        </li>
                    </ul>
                    <div className='w-full flex flex-col-reverse justify-end mb-6 sm:flex-row'>
                        <button className='py-2.5 bg-slate-200 text-[#011413] px-4 rounded-md text-base mt-2 sm:mt-0 mr-0 sm:mr-2' onClick={() => {
                            handleWikiSearch('Ajvar')
                        }}>Autofill with wikipedia</button>
                        <button
                            className='bg-[#046865] text-white font-semibold py-2.5 px-4 rounded-md text-base'
                            type='submit'>
                            Zutat erstellen
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default CreateIngredient