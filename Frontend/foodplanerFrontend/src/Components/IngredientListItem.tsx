import { useEffect, useState } from 'react'
import { Ingredient } from '../Datatypes/Ingredient'
import { Link } from 'react-router-dom'
import { TagService } from '../Endpoints/TagService';
import Tag from './Tag';

type Props = {
    ingredient: Ingredient,
    deleteIngredient: (ingredient: string) => Promise<void>,
}

function IngredientListItem({ ingredient, deleteIngredient }: Props) {

    const [tags, setTags] = useState<string[]>();

    useEffect(() => {

        async function fetchTags(ingredient: string) {
            try {
                const response = await TagService.getAllTagsFromIngredient(ingredient);
                if (response === null || response === undefined) return;
                setTags(response.tags)
            } catch (error) {
                return;
                console.error("error");
            }
        }
        fetchTags(ingredient.title);
    }, [])


    return (
        <>
            <Link
                className='w-full flex flex-row ml-4 text-lg font-semibold justify-start items-center'
                to={`/ingredients/${ingredient.title}`}>
                {ingredient.title}
            </Link>
            <div className='w-full hidden lg:flex flex-row flex-wrap justify-start items-center'>
                {tags?.map((tag: string) => (
                    <div className='my-1'>
                        <Tag title={tag} />
                    </div>
                ))}
            </div>
            <div className='w-fit flex flex-row flex-shrink justify-end items-center'>

                <button
                    onClick={() => deleteIngredient(ingredient.title)}
                    className='px-3 bg-red-400 py-1 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                    x
                </button>
            </div>
        </>
    )
}

export default IngredientListItem