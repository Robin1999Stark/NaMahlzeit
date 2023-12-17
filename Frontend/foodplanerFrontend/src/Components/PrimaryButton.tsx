import React from 'react'

type Props = {
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    title: string;
}

function PrimaryButton({ onClick, title }: Props) {
    return (
        <button onClick={onClick} className='border border-[#181818] my-3 px-3 rounded-md text-[#181818] text-base font-semibold flex flex-row items-center justify-center'>
            {title}
        </button>
    )
}

export default PrimaryButton