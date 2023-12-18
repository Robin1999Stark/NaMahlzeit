
type Props = {
    title: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined
}

function Tag({ title, onClick }: Props) {
    return (
        <span onClick={onClick} className="bg-gray-100 text-gray-800 text-xs cursor-pointer font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
            {title}
        </span>
    )
}

export default Tag