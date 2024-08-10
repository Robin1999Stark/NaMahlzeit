
type Props = {
    title: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined
}

function Tag({ title, onClick }: Props) {
    return (
        <span onClick={onClick} className="border-2 border-[#18A192] text-sm cursor-pointer px-2 py-0.5 rounded-full">
            #{title}
        </span>
    )
}

export default Tag