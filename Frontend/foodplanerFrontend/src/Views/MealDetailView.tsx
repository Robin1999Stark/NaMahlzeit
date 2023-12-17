import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MealService } from '../Endpoints/MealService'
import { Link } from 'react-router-dom'
import { MealIngredientService } from '../Endpoints/MealIngredientService'
import PlaceholderMealImage from '../Components/PlaceholderMealImage'
import URLify from '../Helperfunctions/urlify'
import { LuClock } from "react-icons/lu";
import { PlanerService } from '../Endpoints/PlanerService'
import { CiEdit } from "react-icons/ci";
import { IngredientAmount } from '../Datatypes/Ingredient'
import { Meal, MealTags } from '../Datatypes/Meal'
import { TagService } from '../Endpoints/TagService'
import Tag from '../Components/Tag'

function MealDetailView() {
    const navigate = useNavigate();
    const { mealID } = useParams();

    const [meal, setMeal] = useState<Meal>()
    const [error, setError] = useState<string>("")
    const [mealIngredients, setMealIngredients] = useState<IngredientAmount[]>([])
    const [isPlanned, setIsPlanned] = useState<PlanerService.IsPlannedResponse>();
    const [tags, setTags] = useState<MealTags>();

    function displayIsPlanned() {
        if (isPlanned && isPlanned.isPlanned) {
            return <p aria-label='planned for' className='text-[#FFC200] mr-1 font-semibold p-1 ring-1 ring-[#FFC200] text-center text-sm w-24 rounded-full'>{new Date(isPlanned.plannedDate!).toLocaleDateString()}</p>
        } else {
            return <></>
        }
    }
    useEffect(() => {

        async function fetchTags(id: string) {
            try {
                const response = await TagService.getAllTagsFromMeal(Number(id));
                response ? setTags(response) : setError("No Meal Found");
            } catch (error) {
                setError("Error while fetching Tags occured");
            }
        }

        async function fetchMeal() {
            try {
                const response = await MealService.getMeal(mealID!)
                response ? setMeal(response) : setError("Error occured while fetching Meal")
            } catch (e) {
                console.log(e)
            }
        }


        async function fetchMealIngredients() {
            try {
                const response = await MealIngredientService.getAllMealIngredients(Number(mealID!))
                response ? setMealIngredients(response) : setMealIngredients([])
                console.log(mealIngredients)
            } catch (e) {
                console.log(e)
            }
        }

        async function checkIsPlanned(mealId: string) {
            try {
                const response = await PlanerService.isPlanned(Number(mealId));
                return response;
            } catch (error) {
                console.error(error)
            }
            return null;
        }
        async function fetchAllData() {
            if (mealID === undefined) return;
            fetchMeal();
            fetchTags(mealID);
            fetchMealIngredients();
            const planned = await checkIsPlanned(mealID!);
            if (!planned) return;
            setIsPlanned(planned);
        }
        fetchAllData()

    }, [])

    return (
        <>
            <div className='flex flex-wrap mt-12 w-full rounded-sm min-w-[200px] bg-[#1E1E1E]'>
                <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4 flex flex-row justify-start items-start">
                    <div className='w-full max-w-[42rem] '>
                        <PlaceholderMealImage />
                    </div>

                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-between h-full lg:w-1/2 xl:w-1/2 p-4 min-w-[200px]">

                    <h1 className='truncate flex flex-row flex-wrap justify-between h-full items-center text-[#EBECF4] mx-5 my-3 text-2xl font-semibold'>
                        {meal?.title}
                        {
                            displayIsPlanned()
                        }
                    </h1>

                    <blockquote className='mx-6 mb-6 text-base font-medium text-[#CED0E0]'>
                        {meal?.description ?
                            <URLify text={meal?.description} /> :
                            <></>
                        }

                    </blockquote>
                    <div className=' text-[#EBECF4] py-3 rounded-lg min-w-[200px]'>
                        <h3 className='truncate mx-5 my-2 text-lg font-bold text-[#CED0E0]'>
                            Ingredients:
                        </h3>
                        {
                            mealIngredients ?
                                <ul className='mx-5 h-full my-2 text-[#CED0E0]'>
                                    {mealIngredients?.map(ingredient => (
                                        <li key={ingredient.ingredient + Math.random()} className='px-3 py-1 w-full flex flex-row text-base font-semibold justify-between'>
                                            <Link to={`/ingredients/${ingredient.ingredient}`}>{ingredient.ingredient}</Link>
                                            {ingredient.amount + " " + ingredient.unit + " "}

                                        </li>))}
                                </ul> : <h2>Loading ...</h2>
                        }
                    </div>


                </div>
            </div>
            <div className='p-4 w-full flex flex-col justify-start items-center min-w-[200px]'>
                <div className='w-full flex flex-row justify-start h-full flex-wrap items-center'>
                    {tags?.tags.map(tag => (
                        <Tag title={tag} />
                    ))}
                </div>
                <div className='flex w-full text-[#3E4C62] py-3 flex-row justify-end'>
                    <button className='p-2 bg-slate-400 text-white rounded-md flex flex-row justify-between items-center' onClick={() => navigate(`edit`)}>
                        <p className='mx-2'>
                            Edit

                        </p>
                        <CiEdit />
                    </button>
                    <div className='ml-5 flex flex-row justify-end items-center'>
                        <LuClock />
                        <p className='ml-2 font-semibold'>
                            {meal?.duration} min

                        </p>

                    </div>
                </div>
                <article className='my-6'>
                    <h2 className='text-xl mb-2 font-semibold text-center'>
                        Preparation:
                    </h2>
                    <p className='text-base text-center font-medium text-[#3E4C62]'>
                        {meal?.preparation ? <URLify text={meal.preparation} /> : "No Preparation found"}
                    </p>
                </article>

            </div>
        </>
    )
}

export default MealDetailView