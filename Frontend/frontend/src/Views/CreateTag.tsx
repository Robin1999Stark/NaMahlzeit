import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TagDT } from '../Datatypes/Tag';
import { TagService } from '../Endpoints/TagService';

function CreateTag() {

    const navigate = useNavigate();
    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors } } = useForm<TagDT>({
            defaultValues: {
                name: ""
            },
            mode: 'all'
        });


    const onSubmit = (data: TagDT) => {
        try {
            TagService.createTag({
                name: data.name
            })
            navigate(-1);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <h1 className='truncate text-[#57D1C2] mx-5 my-5 text-2xl font-semibold'>
                Create Tag
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className='h-100 px-3'>
                    <ul className='flex flex-col justify-center my-3 mx-1'>
                        <li key={"li-name"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='name'
                                className={`text-xs truncate text-left align-middle mb-3`} >
                                Title:
                            </label>
                            <input
                                type='text'
                                id='name'
                                autoFocus={true}
                                {...register("name", {
                                    required: true,
                                })}
                                defaultValue={"tag"}
                                className="border-slate-200 bg-white truncate text-base font-semibold align-middle focus:text-left p-2 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
                        </li>

                    </ul>
                </div>
                <div className='w-100 my-4 flex flex-1 justify-center align-middle'>
                    <div className='mb-4 mx-6'>
                        <button className='p-2 bg-[#FF6B00] text-white px-4 rounded-md text-lg' type='submit'>Save</button>
                    </div>
                </div>
            </form>

        </>
    )
}

export default CreateTag