import React from 'react'

type Props = {
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

function DropMealPlaceholder({ onClick }: Props) {
    return (
        <div onClick={onClick} className='mx-2 min-h-12 my-4 px-4 select-none py-3 flex flex-row justify-center items-center rounded-md truncate border border-[#CED4D7] border-dotted'>
        </div>
    )
}

export default DropMealPlaceholder