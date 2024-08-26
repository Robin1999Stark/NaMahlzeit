import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TagDT } from '../Datatypes/Tag';
import { TagService } from '../Endpoints/TagService';

function CreateTag() {

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors } } = useForm<TagDT>({
            defaultValues: {
                name: ""
            },
            mode: 'all'
        });
    console.log(errors)

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
            <section className='w-full my-4 px-7 flex flex-col justify-start items-start flex-grow'>
                <h1 className='truncate text-[#011413] text-xl font-semibold flex-1'>
                    Neuen Tag erstellen
                </h1>
                <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                    <ul className='flex flex-col justify-center my-3'>
                        <li key={"li-name"} className='flex w-100 flex-col flex-1 justify-between items-start mx-2 my-3'>
                            <label
                                htmlFor='name'
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Name:
                            </label>
                            <input
                                type='text'
                                id='name'
                                autoFocus={true}
                                {...register("name", {
                                    required: true,
                                })}
                                defaultValue={"tag"}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                        </li>

                    </ul>
                    <span className='w-full flex flex-row justify-end mb-6'>
                        <button
                            className='bg-[#046865] text-white font-semibold py-2.5 px-4 rounded-md text-base'
                            type='submit'>
                            Tag erstellen
                        </button>
                    </span>
                </form>
            </section>
        </>
    )
}

export default CreateTag