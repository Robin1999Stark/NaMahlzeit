import React, { useState } from 'react'

interface Props {
    debounceTimeout: number | null
    searchString: string
    setDebounceTimeout: React.Dispatch<React.SetStateAction<number | null>>
    setSearchString: React.Dispatch<React.SetStateAction<string>>
}

function Searchbar({ debounceTimeout, searchString, setDebounceTimeout, setSearchString }: Props) {

    return (
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
            autoFocus={true}
            className='bg-white opacity-95 w-full focus:ring-0 lg:w-2/3 py-3 text-center px-4 rounded-full my-3 ml-3 mr-2'
            placeholder='Search for Meals' />
    )
}

export default Searchbar