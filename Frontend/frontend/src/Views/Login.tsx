import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserService } from "../Endpoints/UserService";
import { User } from "../Datatypes/User";
import Cookies from "js-cookie";
import NavIcon from "../Components/NavIcon";

interface FormData {
    username: string;
    password: string;
}

type LoginProps = {
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    showCreateUser: boolean,
}

function Login({ setUser, setLoggedIn, showCreateUser }: LoginProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {
        try {

            const user = await UserService.getUserByUserName(data.username, data.password);
            if (user) {
                setUser(user);
                setLoggedIn(true);

                Cookies.set("authToken", user.token, {
                    expires: 7,
                    sameSite: 'strict',
                    secure: true 
                });

                navigate('/planer');
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <section className='w-full my-4 px-7 flex flex-col justify-start items-center flex-grow'>
            <div className="flex flex-col justify-center items-center mb-4">
                <figure className='size-40'>
                    <NavIcon />
                </figure>
                <h1 className='w-fit flex flex-row justify-start items-center font-cairo text-2xl text-[#011413]'>
                    Na
                    <p className='font-bold'>
                        Mahlzeit!
                    </p>
                </h1>
            </div>

            <div className="max-w-[24rem] w-full md:w-1/2 md:border md:border-slate-200 md:px-8 py-6 md:rounded-sm">
                <h1 className='truncate text-[#011413] w-full text-xl font-semibold flex-1'>
                    Login
                </h1>
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <ul className='flex flex-col justify-center mt-3 mb-8'>
                        <li key={"li-username"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor="username"
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Benutzername:
                            </label>
                            <input
                                id="username"
                                type="text"
                                {...register("username", { required: "Username is required" })}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </li>
                        <li key={"li-password"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor="password"
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Passwort:
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </li>
                    </ul>
                    <span className='w-full flex flex-row flex-wrap-reverse justify-end'>
                        {showCreateUser && <button
                            type="button"
                            className='bg-slate-200 mr-0 text-[#011413] mt-2 hover:bg-slate-300 w-full font-semibold py-2.5 px-4 rounded-md text-base'
                            onClick={() => navigate('../')}
                        >
                            Neuer Account
                        </button>}

                        <button
                            type="submit"
                            className='bg-[#046865] text-white w-full font-semibold py-2.5 px-4 rounded-md text-base'
                        >
                            Einloggen
                        </button>
                    </span>
                </form>

            </div>

        </section>
    );
}

export default Login;