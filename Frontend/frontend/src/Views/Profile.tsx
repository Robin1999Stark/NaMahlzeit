import { Menu, MenuButton } from '@szhsin/react-menu'
import { IoIosMore } from 'react-icons/io'

function Profile() {
    return (
        <>
            <section className='flex flex-col px-6 pt-4 h-full justify-start items-start'>

                <span className='flex w-full flex-row justify-between items-center'>
                    <h1 className='mb-4 font-semibold text-[#011413] text-xl'>
                        Profil
                    </h1>
                    <Menu menuButton={<MenuButton><IoIosMore className='size-5 mr-4 text-[#011413]' /></MenuButton>} transition>
                    </Menu>
                </span>
                <ul>
                    <li className='w-full flex felx-col justify-start items-start'>
                        <h2 className='mb-4 font-semibold text-[#011413] text-lg'>
                            Rezepte
                        </h2>

                    </li>
                    <li className='w-full flex felx-col justify-start items-start'>
                        <h2 className='mb-4 font-semibold text-[#011413] text-lg'>
                            Zutaten
                        </h2>
                    </li>
                    <li className='w-full flex felx-col justify-start items-start'>
                        <h2 className='mb-4 font-semibold text-[#011413] text-lg'>
                            Tags
                        </h2>
                    </li>
                </ul>
            </section>


        </>
    )
}

export default Profile