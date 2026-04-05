import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Logo from "../../components/logo";
import Footer from "../footer/Footer";
import { useAuth } from "../../hooks";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const { forgotPassword, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            await forgotPassword({ email });
            
            setSuccess("If an account exists with this email, you will receive a password reset link shortly.");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            console.error("Forgot password error:", err);
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2 mb-4 sm:mb-6 tracking-tight drop-shadow-sm text-center w-full">Reset Password</h2>

                    <p className="text-gray-600 text-center text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <div className="w-full flex flex-col gap-4 sm:gap-5">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center animate-shake">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
                                {success}
                            </div>
                        )}

                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="rounded-xl border-gray-300 focus:border-blue-400 shadow-sm w-full"
                        />

                        <Button
                            type="submit"
                            size="md"
                            className="w-full mt-4 sm:mt-6"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>

                        {/* Back to Login */}
                        <div className="text-center mt-2">
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-800 font-semibold transition text-sm"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}
