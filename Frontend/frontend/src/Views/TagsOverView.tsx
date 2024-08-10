import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TagDT } from '../Datatypes/Tag';
import { TagService } from '../Endpoints/TagService';
import { LuFilter } from 'react-icons/lu';
import ButtonRound from '../Components/ButtonRound';
import { MdAdd, MdDeleteForever } from 'react-icons/md';

function TagsOverView() {
    const navigate = useNavigate();
    const [tags, setTags] = useState<TagDT[]>();
    const [filteredTags, setFilteredTags] = useState<TagDT[]>();

    const [searchString, setSearchString] = useState<string>("");
    async function fetchData() {
        try {
            const data = await TagService.getAllTags()
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
            await TagService.deleteTag(tag);
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
            <section className='w-full my-4 px-7 flex flex-row items-center justify-between flex-grow'>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Meals ({filteredTags?.length})
                </h1>
                <div className='flex flex-grow flex-row justify-center items-center'>
                    <input type="text" value={searchString}
                        onChange={(e) => {
                            setSearchString(e.target.value);
                            searchForTags(e.target.value.trim());
                        }}
                        autoFocus={true}
                        className='bg-white w-full focus:ring-0 py-2 text-start shadow-md px-6 rounded-full mr-2'
                        placeholder='Search for Tags' />

                    <button
                        className='p-3 text-lg bg-[#046865] text-white rounded-full'
                        onClick={() => searchForTags(searchString)} >
                        <LuFilter />
                    </button>
                </div>

                <div className='flex-row flex-1 flex justify-end items-center w-full'>
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
                    return <>
                        {prefix}
                        <li
                            key={tag.name}
                            className='select-none w-full h-full py-3 my-2 flex flex-row justify-between items-center rounded-md border-l-[6px] border-[#046865] truncate bg-[#fff]'>
                            <h1 className='text-start ml-3 text-base'>
                                {tag.name}
                            </h1>
                            <button className='mr-4 underline' onClick={() => deleteTag(tag.name)}>
                                Remove
                            </button>

                        </li>
                    </>


                }
                ) : <></>}
            </ul>



        </>
    )
}

export default TagsOverView
