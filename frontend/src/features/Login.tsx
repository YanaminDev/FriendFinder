import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import Logo from "../components/logo"
import { LuEyeClosed } from "react-icons/lu";
import { GiBoltEye } from "react-icons/gi";
import Footer from "./Footer"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        navigate("/home")
    }

    return (
        <div className="bg-gradient-to-br from-[#FD7979] to-pink-400 justify-center items-center flex w-screen min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="w-[95%] md:w-[90%] lg:w-[50%] xl:w-[40%]  bg-white/90 
                    backdrop-blur-md 
                    rounded-3xl shadow-xl px-8 py-10 flex flex-col 
                    items-center gap-6 m-5"
            >
                <Logo />

                <div className="w-full flex flex-col gap-4 mt-10">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                    />

                    <div className="relative">
                        <Input
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="pr-12"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-black text-gray-600  transition"
                        >
                            {showPass ? <LuEyeClosed size={24} /> : <GiBoltEye size={24} />}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        size="md"
                        className="m-auto mt-10 mb-16"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loggin..." : "Login"}
                    </Button>
                </div>
            </form>
            <Footer/>
        </div>
    )
}