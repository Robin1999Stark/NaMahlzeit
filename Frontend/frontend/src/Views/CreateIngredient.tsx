import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IngredientService } from '../Endpoints/IngredientService'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Ingredient } from '../Datatypes/Ingredient'

function CreateIngredient() {
    const navigate = useNavigate();
    const [wikiResult, setWikiResult] = useState<string>('');

    async function handleWikiSearch(searchTerm: string) {
        try {
            const response = await axios.get(
                `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${searchTerm}`
            );
            console.log(response)
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

    async function onSubmit(data: Ingredient) {
        try {
            await IngredientService.createIngredient({ title: data.title, description: data.description, preferedUnit: data.preferedUnit })
            navigate('/ingredients')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <h1 className='truncate text-[#57D1C2] mx-5 my-5 text-2xl font-semibold'>
                Create Ingredient
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className='h-100 px-3'>
                    <ul className='flex flex-col justify-center my-3 mx-1'>
                        <li key={"li-title"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='title'
                                className={`text-xs truncate text-left align-middle mb-3`} >
                                Title:
                            </label>
                            <input
                                type='text'
                                id='title'
                                autoFocus={true}
                                {...register("title", {
                                    required: true,
                                })}
                                defaultValue={"Expert Model"}
                                className="border-slate-200 bg-white truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>
                        <li key={"li-description"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='description'
                                className={`text-xs truncate text-left align-middle mb-3`} >
                                Description:
                            </label>
                            <textarea
                                cols={50}
                                rows={6}
                                id='description'
                                {...register("description", {
                                    required: true,
                                })}
                                defaultValue={"Lorem Ipsum"}
                                style={{ whiteSpace: 'pre-line' }}
                                className="border-slate-200 bg-white truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>
                        <li key={"li-pU"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='preferedUnit'
                                className={`text-xs truncate text-left align-middle mb-3`} >
                                Prefered Unit:
                            </label>
                            <input
                                type='text'
                                id='preferedUnit'
                                {...register("preferedUnit", {
                                    required: true,
                                })}
                                defaultValue={"kg"}
                                className="border-slate-200 bg-white truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>
                    </ul>
                </div>
                <div className='w-100 my-4 flex flex-1 justify-center align-middle'>
                    <div className='mb-4 mx-6'>
                        <button className='p-2 bg-[#FF6B00] text-white px-4 rounded-md text-lg' type='submit'>Save and Return</button>
                    </div>

                </div>
            </form>
            <div className='mb-4 mx-6'>
                <button className='p-2 bg-slate-500 text-white px-4 rounded-md text-lg' onClick={() => {
                    handleWikiSearch('Ajvar')
                    console.log(wikiResult)
                }}>Autofill with wikipedia</button>
            </div>
        </>
    )
}

export default CreateIngredient