import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IngredientService } from '../Endpoints/IngredientService'
import URLify from '../Helperfunctions/urlify'
import { Ingredient, IngredientTags } from '../Datatypes/Ingredient';
import { TagService } from '../Endpoints/TagService';
import Tag from '../Components/Tag';

function IngredientDetailView() {
    const navigate = useNavigate();
    const { ingredientID } = useParams();

    const [ingredient, setIngredient] = useState<Ingredient>()
    const [error, setError] = useState<string>("")
    const [tags, setTags] = useState<string[]>();

    useEffect(() => {
        async function fetchData() {
            try {
                const ingredientResponse = await IngredientService.getIngredient(ingredientID!);
                if (ingredientResponse) {
                    setIngredient(ingredientResponse);
                } else {
                    setError("Error occurred while fetching Ingredient");
                }
            } catch (ingredientError) {
                // Handle 404 or other errors specific to fetching ingredient
                console.log("Error fetching ingredient:", ingredientError);
                setError("Error occurred while fetching Ingredient");
            }

            try {
                const tagsResponse = await TagService.getAllTagsFromIngredient(ingredientID!);
                if (tagsResponse && tagsResponse.tags) {
                    setTags(tagsResponse.tags);
                } else {
                    setTags([]); // Set tags to an empty array if there are no tags or response is undefined
                }
            } catch (tagsError) {
                // Handle 404 or other errors specific to fetching tags
                console.log("Error fetching tags:", tagsError);
                setError("Error while fetching Tags occurred");
            }
        }

        fetchData();
    }, [ingredientID]);


    return (
        <>
            <div className='w-full h-full flex flex-col justify-start items-start'>

                <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                    {ingredient?.title}
                </h1>
                <div className='w-full flex flex-row justify-start mx-5 mb-4 flex-wrap items-center'>
                    {tags?.map(tag => (
                        <Tag title={tag} />
                    ))}
                </div>
                <blockquote className='mx-5 mb-4'>
                    {ingredient?.description ? <URLify text={ingredient?.description} /> : <></>}
                </blockquote>
                <blockquote className='mx-5 mb-4 font-semibold'>
                    prefered Unit:
                    {" " + ingredient?.preferedUnit}
                </blockquote>
                <div className='w-full flex flex-row justify-start py-3 items-center'>
                    <div className='mb-4 mx-6'>
                        <button className='p-2 bg-slate-500 text-white px-4 rounded-md text-lg' onClick={() => navigate(-1)}>Go Back</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default IngredientDetailView