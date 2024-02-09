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
            <div className='w-full my-4 flex flex-row justify-center'>
                <input type="text" value={searchString}
                    onChange={(e) => {
                        setSearchString(e.target.value);
                        searchForTags(e.target.value.trim());
                    }}
                    autoFocus={true}
                    className='bg-white opacity-95 w-full focus:ring-0 lg:w-2/3 py-3 text-center px-4 rounded-full my-3 ml-3 mr-2'
                    placeholder='Search for Tags' />
                <ButtonRound
                    className='my-3 mr-3 text-xl'
                    onClick={() => {
                        TagService.getMealTagsFromTagList([new TagDT("obst"), new TagDT("vegetarisch")])
                    }}>
                    <LuFilter />
                </ButtonRound>

            </div>
            <div className='flex flex-row justify-between w-full'>
                <h1 className='truncate mx-5 my-5 text-[#57D1C2] text-2xl font-semibold'>
                    Tags ({filteredTags?.length})
                </h1>
                <ButtonRound
                    className='m-3 text-xl'
                    onClick={() => navigate('/tags/create')}>
                    <MdAdd />
                </ButtonRound>
            </div>

            <ul className='mx-5'>
                {filteredTags ? filteredTags?.map((tag, index) => {
                    let prefix = <></>;
                    const firstChar = tag.name.charAt(0).toUpperCase();

                    if (index === 0) {
                        prefix = <li className='p-2 font-semibold text-lg text-[#57D1C2]' key={prefix + firstChar}>
                            - {firstChar.toUpperCase()} -

                        </li>
                    } else if (index > 0) {
                        const lastElement = filteredTags[index - 1];
                        if (lastElement.name.charAt(0).toUpperCase() !== firstChar) {
                            prefix = <li className='p-2 font-semibold text-lg text-[#57D1C2]' key={prefix + firstChar}>
                                - {firstChar.toUpperCase()} -
                            </li>
                        }

                    }
                    return <>
                        {prefix}
                        <li key={tag.name} className='p-2 text-white text-lg font-bold flex flex-row justify-between'>
                            {tag.name}
                            <button onClick={() => deleteTag(tag.name)} className='px-3 bg-red-400 py-3 rounded-md text-white text-base font-semibold flex flex-row items-center justify-center'>
                                <MdDeleteForever />
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
