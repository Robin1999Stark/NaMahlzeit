import { useEffect, useState } from 'react'
import { Ingredient } from '../Datatypes/Ingredient'
import { Link } from 'react-router-dom'
import { TagService } from '../Endpoints/TagService';
import Tag from './Tag';
import { MdDeleteForever } from 'react-icons/md';

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
            }
        }
        fetchTags(ingredient.title);
    }, [])


    return (
        <>

            <li
                className='select-none w-full h-full py-3 flex flex-row justify-between items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'>
                <article className='text-center  flex flex-row justify-start ml-3 items-center w-full whitespace-normal text-[#011413] text-base '>

                    <Link className='text-[#011413] ml-2 underline' to={`/ingredients/${ingredient.title}`}>
                        <h3 className='text-start'>
                            {ingredient.title}
                        </h3>
                    </Link>
                </article>
                <ul className='w-full'>
                    {tags?.map((tag: string) => (
                        <li className='my-1'>
                            <Tag title={tag} />
                        </li>
                    ))}
                </ul>

                <button className='mr-4' onClick={() => deleteIngredient(ingredient.title)}>
                    Remove
                </button>
            </li>


        </>
    )
}

export default IngredientListItem