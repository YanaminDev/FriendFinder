import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Logo from "../../components/logo";
import { LuEyeClosed } from "react-icons/lu";
import { GiBoltEye } from "react-icons/gi";
import Footer from "../footer/Footer";
import { useAuth } from "../../hooks";

export default function Register() {
    const [formData, setFormData] = useState<{
        user_show_name: string;
        username: string;
        password: string;
        confirmPassword: string;
        sex: 'male' | 'female' | 'lgbtq';
        age: number;
        birth_of_date: string;
        interested_gender: 'male' | 'female' | 'lgbtq';
    }>({
        user_show_name: "",
        username: "",
        password: "",
        confirmPassword: "",
        sex: "male",
        age: 1,
        birth_of_date: "",
        interested_gender: "female",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "age" ? (value ? parseInt(value) : "") : value,
        }));
    };

    const validateForm = () => {
        if (!formData.user_show_name) return "Display name is required";
        if (formData.user_show_name.length > 50) return "Display name must be max 50 characters";
        if (!formData.username) return "Username is required";
        if (!formData.password) return "Password is required";
        if (formData.password.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(formData.password)) return "Password must contain uppercase letter";
        if (!/[a-z]/.test(formData.password)) return "Password must contain lowercase letter";
        if (!/\d/.test(formData.password)) return "Password must contain number";
        if (!/[@$!%*?&]/.test(formData.password)) return "Password must contain special character (@$!%*?&)";
        if (formData.password !== formData.confirmPassword) return "Passwords do not match";
        if (!formData.age || formData.age < 1) return "Valid age is required";
        if (!formData.birth_of_date) return "Date of birth is required";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await register({
                user_show_name: formData.user_show_name,
                username: formData.username,
                password: formData.password,
                sex: formData.sex,
                age: formData.age,
                birth_of_date: formData.birth_of_date,
                interested_gender: formData.interested_gender,
            });

            // Navigate to login page on success
            navigate("/login", { state: { message: "Registration successful! Please log in." } });
        } catch (err) {
            // Error is already set in useAuth hook's error state
            console.error("Registration error:", err);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-pink-100 to-purple-200 relative overflow-hidden py-8">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl animate-pulse" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse" />
            </div>

            <main className="flex flex-1 w-full justify-center items-center px-4">
                <form
                    onSubmit={handleSubmit}
                    className="z-10 w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12 flex flex-col items-center gap-6 sm:gap-8 border border-white/60"
                >
                    <Logo />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2 mb-4 sm:mb-6 tracking-tight drop-shadow-sm text-center w-full">Create Account</h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-full animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Display Name */}
                        <Input
                            placeholder="Display Name"
                            name="user_show_name"
                            value={formData.user_show_name}
                            onChange={handleChange}
                            disabled={loading}
                            className="rounded-xl border-gray-300 focus:border-blue-400 shadow-sm w-full"
                        />

                        {/* Username */}
                        <Input
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading}
                            className="rounded-xl border-gray-300 focus:border-blue-400 shadow-sm w-full"
                        />

                        {/* Password */}
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                className="pr-12 rounded-xl border-gray-300 focus:border-blue-400 shadow-sm w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-blue-600 text-gray-500 transition"
                                tabIndex={-1}
                            >
                                {showPassword ? <LuEyeClosed size={22} /> : <GiBoltEye size={22} />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                className="pr-12 rounded-xl border-gray-300 focus:border-blue-400 shadow-sm w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-blue-600 text-gray-500 transition"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <LuEyeClosed size={22} /> : <GiBoltEye size={22} />}
                            </button>
                        </div>

                        {/* Sex */}
                        <select
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            disabled={loading}
                            className="rounded-xl px-4 py-3 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 shadow-sm w-full bg-white"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="lgbtq">LGBTQ+</option>
                        </select>

                        {/* Age */}
                        <Input
                            type="number"
                            placeholder="Age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            disabled={loading}
                            className="rounded-xl border-gray-300 focus:border-blue-400 shadow-sm w-full"
                        />

                        {/* Birth Date */}
                        <Input
                            type="date"
                            placeholder="Birth Date"
                            name="birth_of_date"
                            value={formData.birth_of_date}
                            onChange={handleChange}
                            disabled={loading}
                            className="rounded-xl border-gray-300 focus:border-blue-400 shadow-sm w-full md:col-span-2"
                        />

                        {/* Interested Gender */}
                        <select
                            name="interested_gender"
                            value={formData.interested_gender}
                            onChange={handleChange}
                            disabled={loading}
                            className="rounded-xl px-4 py-3 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 shadow-sm w-full bg-white md:col-span-2"
                        >
                            <option value="male">Interested in Male</option>
                            <option value="female">Interested in Female</option>
                            <option value="lgbtq">Interested in LGBTQ+</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        size="md"
                        className="w-full mt-4 sm:mt-6"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Register"}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center mt-2">
                        <span className="text-gray-600 text-sm">Already have an account? </span>
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-800 font-semibold transition"
                        >
                            Login here
                        </Link>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}
