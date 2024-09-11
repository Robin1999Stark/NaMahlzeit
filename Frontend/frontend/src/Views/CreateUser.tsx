import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserService } from "../Endpoints/UserService";
import NavIcon from "../Components/NavIcon";

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function CreateUser() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>();
    const navigate = useNavigate();

    const password = watch("password", "");

    const onSubmit = async (data: FormData) => {
        try {
            const birthday = new Date(Date.now());
            const userName = data.username;
            const password = data.password;
            const email = data.email;
            const profilePicture = null;
            // Send a POST request to your backend to create a new user
            const response = await UserService.createUser({ username: userName, password1: password, password2: password, email: email, birthday: birthday, profilePicture: profilePicture })
            if (response && response.status === 201) {
                navigate('/login'); // Redirects to the login page on success
            } else {
                // Handle cases where response status is not 201
                console.error('Unexpected response status:', response?.status);
            }
            // You can add a redirect or a success message here
        } catch (error) {
            console.error("Error creating user:", error);
            // Handle error: display error message to the user
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
                <h1 className='truncate text-[#011413] w-full max-w-[30rem] text-xl font-semibold flex-1'>
                    Neuer Nutzer
                </h1>
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <ul className='flex flex-col justify-center mt-3'>

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
                        <li key={"li-email"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor="email"
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Email:
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Please enter a valid email address",
                                    },
                                })}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </li>
                        <li key={"li-password1"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor="password"
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Passwort:
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters long" },
                                })}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </li>
                        <li key={"li-password2"} className='flex w-100 flex-col flex-1 justify-between items-start my-3'>
                            <label
                                htmlFor="confirmPassword"
                                className={`text-sm mb-2 text-[#011413] font-semibold truncate text-left align-middle`} >
                                Passwort Bestätigen:
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === password || "Passwords do not match",
                                })}
                                className='bg-white w-full shadow-sm focus:shadow-lg py-2 text-start  px-3 rounded-md mr-1' />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </li>
                        <span className='w-full flex flex-row flex-wrap-reverse justify-end mt-6'>

                            <button
                                type="button"
                                className='bg-slate-200 mr-0 text-[#011413] mt-2 hover:bg-slate-300 w-full font-semibold py-2.5 px-4 rounded-md text-base'
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                            <button
                                type="submit"
                                className='bg-[#046865] text-white w-full font-semibold py-2.5 px-4 rounded-md text-base'
                            >
                                Account Erstellen
                            </button>
                        </span>
                    </ul>
                </form>
            </div>
        </section>
    );
}

export default CreateUser;