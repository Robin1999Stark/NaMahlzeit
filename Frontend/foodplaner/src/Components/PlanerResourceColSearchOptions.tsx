import React from 'react'

function PlanerResourceColSearchOptions() {

    const options = [
        { title: 'Random Shuffle', icon: <></> },
        { title: '', icon: <></> },
        { title: 'Random Shuffle', icon: <></> },
        { title: 'Random Shuffle', icon: <></> },
    ];


    return (
        <>
            {options.map(opt => <div>
                {opt.title}
            </div>)}
        </>
    )
}

export default PlanerResourceColSearchOptions