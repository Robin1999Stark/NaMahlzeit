import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IngredientService } from '../Endpoints/IngredientService'
import PrimaryButton from '../Components/PrimaryButton'
import { Ingredient } from '../Datatypes/Ingredient'

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

    return (
        <>
            <div className='w-full my-4 flex flex-row justify-center'>
                <input
                    type="text"
                    value={searchString}
                    onChange={(e) => {
                        setSearchString(e.target.value);
                        searchForIngredients(e.target.value.trim());
                    }}
                    autoFocus={true}
                    className='bg-[#F2F2F2] w-full lg:w-2/3 py-3 px-4 placeholder:text-center placeholder:text-[#A7B1C1] rounded-md m-3'
                    placeholder='Search for Ingredients' />
                <PrimaryButton title='Filter' onClick={() => searchForIngredients(searchString)} />
            </div>
            <div className='flex flex-row justify-between w-full'>
                <h1 className='truncate m x-5 my-5 text-2xl font-semibold'>
                    Ingredients ({filteredIngredients?.length})
                </h1>
                <PrimaryButton onClick={() => navigate('/ingredients/create')} title='+ Create Ingredient' />
            </div>

            <ul className='mx-5'>
                {filteredIngredients ? filteredIngredients?.map((ingredient, index) => {
                    let prefix = <></>;
                    const firstChar = ingredient.title.charAt(0).toUpperCase();

                    if (index === 0) {
                        prefix = <li className='p-2 font-semibold text-lg text-[#74768C]' key={prefix + firstChar}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredIngredients[index - 1];
                        if (lastElement.title.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-lg text-[#74768C]' key={prefix + firstChar}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }

                    }

                    return <>
                        {prefix}
                        <li key={ingredient.title} className='p-2 flex flex-row justify-between'>
                            <Link to={`/ingredients/${ingredient.title}`}>{ingredient.title}</Link>
                            <button onClick={() => deleteIngredient(ingredient.title)} className='px-3 bg-red-400 py-1 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                                x
                            </button>
                        </li>
                    </>
                }
                ) : <h1>Loading...</h1>}
            </ul>
        </>
    )
}

export default IngredientsOverView