import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IngredientService } from '../Endpoints/IngredientService'
import { Ingredient } from '../Datatypes/Ingredient'
import { LuFilter } from 'react-icons/lu'
import ButtonRound from '../Components/ButtonRound'
import { MdAdd } from 'react-icons/md'
import IngredientListItem from '../Components/IngredientListItem'

function IngredientsOverView() {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>();
    const [searchString, setSearchString] = useState<string>("");

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
            return;
            console.log(error)
        }
    }

    function searchForIngredients(search: string) {
        if (search === undefined || search === null || search === "") {
            setFilteredIngredients(ingredients);
        } else {
            let filteredIngredients = ingredients;
            const lowerCaseSearch = search.toLowerCase();
            filteredIngredients = filteredIngredients?.filter((ingredient) => ingredient.title.toLowerCase().includes(lowerCaseSearch));
            setFilteredIngredients(filteredIngredients);
        }
    }

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

                <div className=' flex flex-grow flex-row justify-center items-center'>
                    <input
                        type="text"
                        value={searchString}
                        onChange={(e) => {
                            setSearchString(e.target.value);
                            searchForIngredients(e.target.value.trim());
                        }}
                        autoFocus={true}
                        className='bg-[rgba(237, 237, 240, 0.85)] w-full focus:ring-0 lg:w-2/3 py-3 text-center px-4 rounded-full my-3 ml-3 mr-2'
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