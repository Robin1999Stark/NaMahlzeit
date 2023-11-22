import React, { useState } from 'react';
import { useDrop } from 'react-dnd/dist/hooks';

const mealList = [
    { id: 1, title: "Pizza" },
    { id: 2, title: "Spaghetti" },
    { id: 3, title: "Pasta" },
];

const ReceipePlanerView1: React.FC = () => {
    const [boards, setBoards] = useState<{ id: number; title: string }[][]>([[]]);
    const [activeID, setActiveID] = useState<number>()

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "meal",
        drop: (item: any) => addImageToBoard(item.id, 0), // Drop onto the first board
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const addImageToBoard = (id: number, boardIndex: number) => {
        const mL = mealList.find((meal) => id === meal.id);
        console.log(mL)
        if (mL) {
            console.log(id, boardIndex)
            const mealIncluded = boards[boardIndex].find((meal) => id === meal.id)
            console.log(boards)
            if ((mealIncluded === undefined)) {

                setBoards((prevBoards) => {
                    const newBoards = [...prevBoards];
                    newBoards[boardIndex] = [...newBoards[boardIndex], mL];
                    return newBoards;
                });
                console.log(boards)
            }
        }
    };

    const addNewBoard = () => {
        setBoards((prevBoards) => [...prevBoards, []]);
    };

    return (
        <>
            <div className='meals w-30 flex flex-col items-center justify-center min-h-[20rem] bg-slate-300'>
                {mealList.map((meal) => (
                    <></>
                ))}
            </div>
            <button onClick={addNewBoard}>Add New Board</button>
            <div className='planer-container'>
                {boards.map((board, index) => (
                    <div key={index} className='planer w-30 min-h-[20rem] bg-slate-300 my-4' ref={drop}>
                        {board.map((meal) => (
                            <></>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default ReceipePlanerView1;
