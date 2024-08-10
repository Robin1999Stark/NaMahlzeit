import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IngredientService } from '../Endpoints/IngredientService'
import { Ingredient } from '../Datatypes/Ingredient'
import { LuFilter } from 'react-icons/lu'
import ButtonRound from '../Components/ButtonRound'
import { MdAdd } from 'react-icons/md'
import IngredientListItem from '../Components/IngredientListItem'
import { TagDT } from '../Datatypes/Tag'
import { TagService } from '../Endpoints/TagService'
import { debounce } from 'lodash'

function IngredientsOverView() {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>();
    const [searchString, setSearchString] = useState<string>("");
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

    const navigate = useNavigate();
    async function fetchData() {
        try {
            const data = await IngredientService.getAllIngredients()
            const sortedIngredientsByTitle = data.sort((a, b) => a.title.localeCompare(b.title))
            setIngredients(sortedIngredientsByTitle)
            setFilteredIngredients(sortedIngredientsByTitle);

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    async function deleteIngredient(ingredient: string) {
        try {
            await IngredientService.deleteIngredient(ingredient);
            fetchData();

        } catch (error) {
            console.log(error)
        }
    }
    debounce(searchForIngredients, 500);


    async function searchForIngredients(search: string) {
        console.log("search")
        if (search === undefined || search === null || search === "") {
            setFilteredIngredients(ingredients);
        } else {
            let filteredIngredients = ingredients;
            const lowerCaseSearch = search.toLowerCase();

            const ingredientsFromTags = await Promise.all(
                (await TagService.getIngredientTagsFromTagList([new TagDT(lowerCaseSearch)])).map((tag) => tag.ingredient)
            );
            filteredIngredients = filteredIngredients?.filter((ingredient) => {

                if (ingredient.title.toLowerCase().includes(lowerCaseSearch)) return true
                if (ingredientsFromTags.includes(ingredient.title)) return true
                return false
            });

            setFilteredIngredients(filteredIngredients);
        }
    }


    // Debounce the searchForIngredients function with a delay before making the API call
    useEffect(() => {
        if (searchString !== "" && searchString !== undefined && searchString !== null) {

            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeoutId = window.setTimeout(() => {
                searchForIngredients(searchString.trim());
            }, 500);

            setDebounceTimeout(timeoutId);

            // Cleanup function to clear the timeout when the component unmounts or when searchString changes
            return () => {
                if (debounceTimeout) {
                    clearTimeout(debounceTimeout);
                }
            };
        } else {
            setFilteredIngredients(ingredients);
        }
    }, [searchString]);

    const ingredientList = () => {
        return (
            <ul className='mx-5'>
                {filteredIngredients ? filteredIngredients?.map((ingredient, index) => {
                    let prefix = <></>;
                    const firstChar = ingredient.title.charAt(0).toUpperCase();

                    if (index === 0) {
                        prefix = <li className='p-2 font-semibold text-base text-[#7A8587]' key={prefix + firstChar}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredIngredients[index - 1];
                        if (lastElement.title.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-base text-[#7A8587]' key={prefix + firstChar}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }

                    }
                    return <>
                        {prefix}
                        <li
                            key={ingredient.title}
                            className='py-[0.2rem] px-2 flex flex-row justify-between overflow-hidden rounded-sm bg-white bg-opacity-10'>
                            <IngredientListItem ingredient={ingredient} deleteIngredient={deleteIngredient} />
                        </li>
                    </>


                }
                ) : <></>}
            </ul>
        )
    }

    return (
        <>

            <section className='w-full my-4 px-7 flex flex-row items-center justify-between flex-grow'>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Ingredients ({filteredIngredients?.length})
                </h1>
                <div className='flex flex-grow flex-row justify-center items-center'>
                    <input
                        type="text"
                        value={searchString}
                        onChange={(e) => {
                            setSearchString(e.target.value);
                            // debounced search - delays search
                            if (debounceTimeout) {
                                clearTimeout(debounceTimeout);
                            }
                        }}
                        autoFocus={true}
                        className='bg-white w-full focus:ring-0 py-2 text-start shadow-md px-6 rounded-full mr-2'
                        placeholder='Search for Meals' />
                    <button
                        className='p-3 text-lg bg-[#046865] text-white rounded-full'
                        onClick={() => searchForIngredients(searchString)} >
                        <LuFilter />
                    </button>
                </div>

                <div className='flex-row flex-1 flex justify-end items-center w-full'>
                    <button
                        className='p-3 text-lg bg-[#046865] text-white rounded-full'
                        onClick={() => navigate('/ingredients/create')}>
                        <MdAdd />
                    </button>

                </div>

            </section>

            {ingredientList()}

        </>
    )
}

export default IngredientsOverView