import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Tag } from '../Datatypes/Tag';
import { TagService } from '../Endpoints/TagService';
import PrimaryButton from '../Components/PrimaryButton';

function TagsOverView() {
    const navigate = useNavigate();
    const [tags, setTags] = useState<Tag[]>();
    const [filteredTags, setFilteredTags] = useState<Tag[]>();

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
            <div className='w-full my-4 flex flex-row justify-center'>
                <input type="text" value={searchString}
                    onChange={(e) => {
                        setSearchString(e.target.value);
                        searchForTags(e.target.value.trim());
                    }}
                    autoFocus={true}
                    className='bg-[#F2F2F2] w-full lg:w-2/3 py-3 text-center px-4 rounded-md m-3'
                    placeholder='Search for Tags' />
                <PrimaryButton title='Filter' onClick={() => {
                    TagService.getMealTagsFromTagList([new Tag("obst"), new Tag("vegetarisch")])
                }} />
            </div>
            <div className='flex flex-row justify-between w-full'>
                <h1 className='truncate mx-5 my-5 text-2xl font-semibold'>
                    Tags ({filteredTags?.length})
                </h1>
                <PrimaryButton title='+ Create Tag' onClick={() => navigate('/tags/create')} />
            </div>

            <ul className='mx-5'>
                {filteredTags ? filteredTags?.map((tag, index) => {
                    let prefix = <></>;
                    const firstChar = tag.name.charAt(0).toUpperCase();

                    if (index === 0) {
                        prefix = <li className='p-2 font-semibold text-lg text-[#74768C]' key={prefix + firstChar}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredTags[index - 1];
                        if (lastElement.name.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-lg text-[#74768C]' key={prefix + firstChar}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }

                    }
                    return <>
                        {prefix}
                        <li key={tag.name} className='p-2 flex flex-row justify-between'>
                            {tag.name}
                            <button onClick={() => deleteTag(tag.name)} className='px-3 bg-red-400 py-1 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                                x
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
