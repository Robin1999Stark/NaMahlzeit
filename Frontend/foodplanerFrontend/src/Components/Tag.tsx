
type Props = {
    title: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined
}

function Tag({ title, onClick }: Props) {
    return (
        <span onClick={onClick} className="bg-[#2C8E83] border border-[#18A192] text-[#C8EFEA] text-xs cursor-pointer font-medium me-2 px-2.5 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">
            {title}
        </span>
    )
}

export default Tag