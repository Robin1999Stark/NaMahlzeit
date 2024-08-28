import { useEffect, useState } from 'react'
import { Ingredient } from '../Datatypes/Ingredient'
import { Link } from 'react-router-dom'
import Tag from './Tag';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { IoIosMore } from 'react-icons/io';
import { getAllTagsFromIngredient } from '../Endpoints/TagService';

type Props = {
    ingredient: Ingredient,
    deleteIngredient: (ingredient: string) => Promise<void>,
}

function IngredientListItem({ ingredient, deleteIngredient }: Props) {

    const [tags, setTags] = useState<string[]>();

    useEffect(() => {
        async function fetchTags(ingredient: string) {
            try {
                const response = await getAllTagsFromIngredient(ingredient);
                if (response === null || response === undefined) return;
                setTags(response.tags)
            } catch (_error) {
                return;
            }
        }
        fetchTags(ingredient.title);
    }, [ingredient])

    return (
        <>
            <span
                className='select-none w-full h-full py-3 flex flex-row justify-between items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'>
                <article className='text-center  flex flex-row justify-start ml-3 items-center w-full whitespace-normal text-[#011413] text-base '>
                    <Link className='text-[#011413] ml-2 underline' to={`/ingredients/${ingredient.title}`}>
                        <h3 className='text-start'>
                            {ingredient.title}
                        </h3>
                    </Link>
                </article>
                <ul className='w-full hidden sm:flex flex-row justify-start items-start flex-wrap'>
                    {tags?.map((tag: string) => (
                        <li key={`${ingredient.title}-${tag}`} className='my-1 mr-1'>
                            <Tag title={tag} />
                        </li>
                    ))}
                </ul>
                <Menu menuButton={<MenuButton><IoIosMore className='size-5 text-[#011413] mr-3' /></MenuButton>} transition>
                    <MenuItem onClick={() => {
                        deleteIngredient(ingredient.title)
                    }}>
                        Löschen
                    </MenuItem>
                </Menu>

            </span>


        </>
    )
}

export default IngredientListItem