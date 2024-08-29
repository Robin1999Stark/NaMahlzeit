import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserService } from "../Endpoints/UserService";
import { User } from "../Datatypes/User";
import Cookies from "js-cookie";

interface FormData {
    username: string;
    password: string;
}

type LoginProps = {
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

function Login({ setUser, setLoggedIn }: LoginProps) {
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
                console.log("User logged in successfully:", user);

                Cookies.set("authToken", user.token, {
                    expires: 7,
                    sameSite: 'None',
                    //secure: true 
                });

                navigate('/planer');
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <section className='w-full my-4 px-7 flex flex-col justify-start items-center flex-grow'>
            <h1 className='truncate text-[#011413] w-full max-w-[30rem] text-xl font-semibold flex-1'>
                Login
            </h1>
            <form className="w-full max-w-[30rem]" onSubmit={handleSubmit(onSubmit)}>
                <ul className='flex flex-col justify-center my-3'>
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
                <span className='w-full flex flex-row flex-wrap-reverse justify-end mb-6'>
                    <button
                        type="button"
                        className='bg-slate-200 mr-0 sm:mr-2 text-[#011413] mt-2 sm:mt-0 hover:bg-slate-300 sm:w-fit w-full font-semibold py-2.5 px-4 rounded-md text-base'
                        onClick={() => navigate('../')}
                    >
                        Neuer Account
                    </button>
                    <button
                        type="submit"
                        className='bg-[#046865] text-white sm:w-fit w-full font-semibold py-2.5 px-4 rounded-md text-base'
                    >
                        Einloggen
                    </button>
                </span>
            </form>
        </section>
    );
}

export default Login;