import React from 'react'

type Props = {
    title: string,
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

function AddMealButton({ title, onClick }: Props) {
    return (
        <div onClick={onClick} className='mx-2 my-4 px-4 select-none py-3 flex flex-row justify-center items-center rounded-md truncate border border-[#57D1C2] border-dotted'>
            <h6 className='text-sm font-medium text-center align-middle truncate text-[#57D1C2] mr-2'>
                {title}
            </h6>
        </div>
    )
}

export default AddMealButton