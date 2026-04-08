import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Logo from "../../components/logo";
import { LuEyeClosed } from "react-icons/lu";
import { GiBoltEye } from "react-icons/gi";
import Footer from "../footer/Footer";
import { useAuth } from "../../hooks";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();
    const { login, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login({ username, password });
            navigate("/home");
        } catch (err) {
            // Error is handled in useAuth hook and stored in error state
            console.error("Login error:", err);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-pink-100 to-purple-200 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl animate-pulse" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse" />
            </div>
            <main className="flex flex-1 w-full justify-center items-center px-4">
                <form
                    onSubmit={handleSubmit}
                    className="z-10 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12 flex flex-col items-center gap-6 sm:gap-8 border border-white/60"
                >
                    <Logo />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2 mb-4 sm:mb-6 tracking-tight drop-shadow-sm text-center w-full">Welcome Back</h2>
                    <div className="w-full flex flex-col gap-4 sm:gap-5">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center animate-shake">
                                {error}
                            </div>
                        )}
                        <Input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            className="rounded-xl border-gray-300 focus:border-blue-400 shadow-sm w-full"
                        />
                        <div className="relative w-full">
                            <Input
                                type={showPass ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="pr-12 rounded-xl border-gray-300 focus:border-blue-400 shadow-sm w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-blue-600 text-gray-500 transition"
                                tabIndex={-1}
                            >
                                {showPass ? <LuEyeClosed size={22} /> : <GiBoltEye size={22} />}
                            </button>
                        </div>
                        

                        <Button
                            type="submit"
                            size="md"
                            className="w-full mt-4 sm:mt-6"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>

                        {/* Register Link */}
                        <div className="text-center mt-2">
                            
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}
