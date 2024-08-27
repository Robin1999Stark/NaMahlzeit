import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import URLify from '../Helperfunctions/urlify'
import { Ingredient } from '../Datatypes/Ingredient';
import Tag from '../Components/Tag';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { IoIosMore } from 'react-icons/io';
import { getAllTagsFromIngredient } from '../Endpoints/TagService';
import { getIngredient } from '../Endpoints/IngredientService';

function IngredientDetailView() {
    const navigate = useNavigate();
    const { ingredientID } = useParams();

    const [ingredient, setIngredient] = useState<Ingredient>()
    const [, setError] = useState<string>("")
    const [tags, setTags] = useState<string[]>();

    useEffect(() => {
        async function fetchData() {
            try {
                const ingredientResponse = await getIngredient(ingredientID!);
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
                const tagsResponse = await getAllTagsFromIngredient(ingredientID!);
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
            <section className='w-full absolute left-[50%] translate-x-[-50%] px-8 mt-8 max-w-[70rem]'>
                <span className='flex flex-row justify-between items-center'>
                    <span className='flex flex-row justify-start items-center'>
                        <h1 className='font-semibold text-[#011413] text-2xl mx-2'>
                            Zutat: {ingredient?.title}
                        </h1>

                    </span>

                    <Menu menuButton={<MenuButton><IoIosMore className='size-5 mr-4 text-[#011413]' /></MenuButton>} transition>
                        <MenuItem onClick={() => navigate(`tags`)}>Tags Anpassen</MenuItem>
                        <MenuItem onClick={() => navigate(`edit`)}>Zutat Anpassen</MenuItem>
                    </Menu>
                </span>
                <hr className='my-4' />
                <span className='w-full flex px-3 flex-row justify-between items-start'>
                    {
                        tags !== undefined && tags?.length > 0 ? <ul className='w-full flex flex-1 flex-row justify-start h-full flex-wrap items-center'>
                            {tags?.map(tag => (
                                <li className='mr-1' key={tag}>
                                    <Tag title={tag} />
                                </li>
                            ))}
                        </ul> : <p className='text-base'>
                            Noch keine Tags
                        </p>
                    }

                    <blockquote className='font-semibold'>
                        Bevorzugte Einheit:
                        {" " + ingredient?.preferedUnit}
                    </blockquote>
                </span>
                <hr className='my-4' />
                <blockquote className='mx-3 mb-4'>
                    {ingredient?.description ? <URLify text={ingredient?.description} /> : <></>}
                </blockquote>
            </section>

        </>
    )
}
export default IngredientDetailView