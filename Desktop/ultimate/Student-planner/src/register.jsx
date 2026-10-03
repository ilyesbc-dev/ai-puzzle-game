import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!terms) {
      setMessage("Please accept the terms and conditions.");
      return;
    }

    setMessage("Account created successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <svg
            width="45"
            height="45"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="logoGradient"
                x1="20"
                y1="10"
                x2="80"
                y2="90"
              >
                <stop offset="0%" stopColor="#18B5F4" />
                <stop offset="55%" stopColor="#1534D4" />
                <stop offset="100%" stopColor="#08B5F5" />
              </linearGradient>
            </defs>

            <path
              d="M10 30 C10 12 30 5 43 18 C55 30 65 30 77 18 C90 5 98 14 90 35 C85 48 72 50 60 43 C50 37 45 37 35 43 C22 51 10 44 10 30Z"
              fill="url(#logoGradient)"
            />

            <rect
              x="38"
              y="52"
              width="24"
              height="40"
              rx="12"
              fill="url(#logoGradient)"
            />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account and join us
          </p>
        </div>

        {/* Form */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"> 
                   <h2 className="text-xl font-bold text-gray-900 mb-6">
            Your Information
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>

                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Phone */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+213 555 123 456"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

          
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Administration</option>
              </select>
            </div>

         
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-start gap-2 mt-5">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-1"
              />

              <p className="text-sm text-gray-600">
                I agree to the{" "}
                <span className="text-blue-600">
                  Terms and Conditions
                </span>{" "}
                and Privacy Policy.
              </p>
            </div>

        
            {message && (
              <p className="mt-4 text-sm text-blue-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Create Account
            </button>

          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;