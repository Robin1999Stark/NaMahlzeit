import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TagDT } from '../Datatypes/Tag';
import { LuFilter } from 'react-icons/lu';
import { MdAdd } from 'react-icons/md';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { IoIosMore } from 'react-icons/io';
import { getAllTags } from '../Endpoints/TagService';
import React from 'react';

function TagsOverView() {
    const navigate = useNavigate();
    const [tags, setTags] = useState<TagDT[]>();
    const [filteredTags, setFilteredTags] = useState<TagDT[]>();

    const [searchString, setSearchString] = useState<string>("");
    async function fetchData() {
        try {
            const data = await getAllTags()
            if (data !== null) {
                const sortedTagsByName = data.sort((a, b) => a.name.localeCompare(b.name))
                setTags(sortedTagsByName);
                setFilteredTags(sortedTagsByName);

            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    async function deleteTag(tag: string) {
        try {
            await deleteTag(tag);
            fetchData();
        } catch (error) {
            console.log(error)
        }
    }
    function searchForTags(search: string) {
        if (search === undefined || search === null || search === "") {
            setFilteredTags(tags);
        } else {
            let filteredTags = tags;
            const lowerCaseSearch = search.toLowerCase();
            filteredTags = filteredTags?.filter((tag) => tag.name.toLowerCase().includes(lowerCaseSearch));
            setFilteredTags(filteredTags);
        }
    }

    return (
        <>
            {/* Only visible in mobile version */}
            <section className='w-full my-4 px-7 md:hidden flex flex-row items-center justify-between flex-grow '>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Tags ({filteredTags?.length})
                </h1>
                <button
                    className='p-3 text-lg bg-[#046865] text-white rounded-full'
                    onClick={() => navigate('/tags/create')}  >
                    <MdAdd />
                </button>
            </section >
            <section className='w-full my-4 px-7 flex flex-row items-center justify-between flex-grow'>
                <h1 className='truncate text-[#011413] hidden md:block text-xl font-semibold flex-1'>
                    Tags ({filteredTags?.length})
                </h1>
                <div className='flex flex-grow flex-row justify-center items-center'>
                    <input type="text" value={searchString}
                        onChange={(e) => {
                            setSearchString(e.target.value);
                            searchForTags(e.target.value.trim());
                        }}
                        autoFocus={false}
                        className='bg-white w-full focus:ring-0 py-2 text-start shadow-md px-6 rounded-full mr-2'
                        placeholder='Tags Suchen ...' />
                    <button
                        className='p-3 text-lg bg-[#046865] text-white rounded-full'
                        onClick={() => searchForTags(searchString)} >
                        <LuFilter />
                    </button>
                </div>

                <div className='flex-row flex-1 hidden md:flex justify-end items-center w-full '>
                    <button
                        className='p-3 text-lg bg-[#046865] text-white rounded-full'
                        onClick={() => navigate('/tags/create')}>
                        <MdAdd />
                    </button>
                </div>
            </section>
            <ul className='mx-5'>
                {filteredTags ? filteredTags?.map((tag, index) => {
                    let prefix = <></>;
                    const firstChar = tag.name.charAt(0).toUpperCase();

                    if (index === 0) {
                        prefix = <li className='p-2 font-semibold text-base text-[#7A8587]' key={prefix + firstChar}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredTags[index - 1];
                        if (lastElement.name.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-base text-[#7A8587]' key={prefix + firstChar}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }
                    }
                    return (
                        <React.Fragment key={tag.name}>
                            {prefix}
                            <li
                                key={tag.name}
                                className='select-none w-full h-full py-3 my-2 flex flex-row justify-between items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'>
                                <h1 className='text-start ml-3 text-base'>
                                    {tag.name}
                                </h1>
                                <Menu menuButton={<MenuButton><IoIosMore className='size-5 text-[#011413] mr-3' /></MenuButton>} transition>
                                    <MenuItem onClick={() => deleteTag(tag.name)}>
                                        Löschen
                                    </MenuItem>
                                </Menu>
                            </li>
                        </React.Fragment>
                    )
                }
                ) : <></>}
            </ul>



        </>
    )
}

export default TagsOverView
