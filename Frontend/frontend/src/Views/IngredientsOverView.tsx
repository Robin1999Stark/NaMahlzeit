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
                        prefix = <li className='p-2 font-semibold text-lg text-[#57D1C2]' key={prefix + firstChar}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredIngredients[index - 1];
                        if (lastElement.title.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-lg text-[#57D1C2]' key={prefix + firstChar}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }

                    }

                    return <>
                        {prefix}
                        <li
                            key={ingredient.title}
                            className='py-4 px-2 my-4 flex flex-row justify-between overflow-hidden rounded-sm bg-white bg-opacity-10'>
                            <IngredientListItem ingredient={ingredient} deleteIngredient={deleteIngredient} />
                        </li>
                    </>
                }
                ) : <h1>Loading...</h1>}
            </ul>
        )
    }

    return (
        <>
            <div className='w-full my-4 flex flex-row justify-center flex-grow'>

                <div className='flex flex-grow flex-row justify-center items-center'>
                    <input
                        type="text"
                        value={searchString}
                        onChange={(e) => {
                            console.log(searchString)
                            setSearchString(e.target.value);
                            // debounced search - delays search
                            if (debounceTimeout) {
                                clearTimeout(debounceTimeout);
                            }
                        }}
                        autoFocus={true}
                        className='bg-white opacity-95 w-full focus:ring-0 lg:w-2/3 py-3 text-center px-4 rounded-full my-3 ml-3 mr-2'
                        placeholder='Search for Ingredients' />
                    <ButtonRound
                        className='my-3 mr-3 text-xl'
                        onClick={() => searchForIngredients(searchString)}  >
                        <LuFilter />
                    </ButtonRound>
                </div>


            </div>

            <div className='flex flex-row justify-between w-full'>
                <h1 className='truncate text-[#57D1C2] mx-5 my-5 text-2xl font-semibold'>
                    Ingredients ({filteredIngredients?.length})
                </h1>
                <ButtonRound
                    className='m-3 text-xl'
                    onClick={() => navigate('/ingredients/create')}>
                    <MdAdd />
                </ButtonRound>
            </div>
            {ingredientList()}

        </>
    )
}

export default IngredientsOverView