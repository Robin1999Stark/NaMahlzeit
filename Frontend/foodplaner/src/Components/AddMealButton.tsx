import React from 'react'

type Props = {
    title: string,
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

function AddMealButton({ title, onClick }: Props) {
    return (
        <div onClick={onClick} className='m-2 h-full px-4 py-1 flex flex-row justify-center items-center rounded-md truncate border border-slate-600 border-dotted'>
            <h6 className='text-base text-center align-middle truncate text-slate-500 mr-2'>
                {title}
            </h6>
        </div>
    )
}

export default AddMealButton