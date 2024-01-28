import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: string | JSX.Element | JSX.Element[];
};

function ButtonSquare({ children, className = '', ...buttonProps }: Props) {
    // Define your default styles
    const defaultStyles =
        'aspect-w-1 aspect-h-1 bg-white bg-opacity-10 backdrop-filter rounded-full p-3 backdrop-blur-sm border-2 border-[#57D1C2] text-[#57D1C2] hover:text-[#FF6B00] hover:border-[#FF6B00]';

    return (
        <button className={`${defaultStyles} ${className}`} {...buttonProps}>
            {children}
        </button>
    );
}

export default ButtonSquare;
