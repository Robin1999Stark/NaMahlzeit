import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ingredient } from '../Datatypes/Ingredient'
import { LuFilter } from 'react-icons/lu'
import { MdAdd } from 'react-icons/md'
import IngredientListItem from '../Components/IngredientListItem'
import { TagDT } from '../Datatypes/Tag'
import { debounce } from 'lodash'
import { getAllIngredients } from '../Endpoints/IngredientService'
import { getIngredientTagsFromTagList } from '../Endpoints/TagService'

function IngredientsOverView() {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>();
    const [searchString, setSearchString] = useState<string>("");
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

    const navigate = useNavigate();
    async function fetchData() {
        try {
            const data = await getAllIngredients()
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
            await deleteIngredient(ingredient);
            fetchData();

        } catch (error) {
            console.log(error)
        }
    }

    const searchForIngredients = useCallback(async (search: string) => {
        if (!search) {
            setFilteredIngredients(ingredients);
            return;
        }

        const lowerCaseSearch = search.toLowerCase();
        const ingredientsFromTags = await Promise.all(
            (await getIngredientTagsFromTagList([new TagDT(lowerCaseSearch)])).map((tag) => tag.ingredient)
        );
        if (!ingredients) return;

        const filtered = ingredients.filter((ingredient) => {
            return ingredient.title.toLowerCase().includes(lowerCaseSearch) || ingredientsFromTags.includes(ingredient.title);
        });

        setFilteredIngredients(filtered);
    }, [ingredients]);


    debounce(searchForIngredients, 500);


    useEffect(() => {
        if (searchString !== "" && searchString !== undefined && searchString !== null) {

            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeoutId = globalThis.setTimeout(() => {
                searchForIngredients(searchString.trim());
            }, 500);

            setDebounceTimeout(timeoutId);

            return () => {
                if (debounceTimeout) {
                    clearTimeout(debounceTimeout);
                }
            };
        } else {
            setFilteredIngredients(ingredients);
        }
    }, [searchString, ingredients, searchForIngredients]);

    const ingredientList = () => {
        return (
            <ul className='mx-5'>
                {filteredIngredients ? filteredIngredients?.map((ingredient, index) => {
                    let prefix = <></>;
                    const firstChar = ingredient.title.charAt(0).toUpperCase();

                    if (index === 0) {
                        prefix = <li className='p-2 font-semibold text-base text-[#7A8587]' key={`prefix-${index}`}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredIngredients[index - 1];
                        if (lastElement.title.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-base text-[#7A8587]' key={`prefix-${index}`}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }
                    }
                    return <>
                        {prefix}
                        <li
                            key={`prefix-${ingredient.title}-${index}`}
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
            {/* Only visible in mobile version */}
            <section className='w-full my-4 px-7 md:hidden flex flex-row items-center justify-between flex-grow '>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Zutaten ({filteredIngredients?.length})
                </h1>
                <button
                    className='p-3 text-lg bg-[#046865] text-white rounded-full'
                    onClick={() => navigate('/ingredients/create')}  >
                    <MdAdd />
                </button>
            </section >
            <section className='w-full my-4 px-7 flex flex-row items-center justify-between flex-grow'>
                <h1 className='truncate text-[#011413] hidden md:block text-xl font-semibold flex-1'>
                    Zutaten ({filteredIngredients?.length})
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
                        autoFocus={false}
                        className='bg-white w-full focus:ring-0 py-2 text-start shadow-md px-6 rounded-full mr-2'
                        placeholder='Zutaten Suchen ...' />
                    <button
                        className='p-3 text-lg bg-[#046865] text-white rounded-full'
                        onClick={() => searchForIngredients(searchString)} >
                        <LuFilter />
                    </button>
                </div>

                <div className='flex-row flex-1 hidden md:flex justify-end items-center w-full '>
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