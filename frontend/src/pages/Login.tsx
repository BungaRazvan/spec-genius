import React, { useState } from "react";
import { Input } from "ui/input";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    navigate("/dashboard");
  };

  return (
    <div className="flex w-full h-screen">
      <div className="flex w-1/2 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-start sm:mx-auto sm:items-start sm:w-full sm:max-w-sm">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt=""
            className="h-10"
          />
          <h2 className="mt-5 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm/6 text-gray-500">
            Dont have an account yet?
            <a
              href="#"
              className="pl-2 font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Create One
            </a>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block-text text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <Input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <a
                    href="#"
                    className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              <div className="mt-2">
                <Input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-10 flex items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="px-3 text-gray-500 text-sm font-bold">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border-1 px-3 py-1.5 text-sm/6 font-semibold text-black shadow-xs hover:bg-indigo-600 hover:text-white"
            >
              SSO
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        />
      </div>
    </div>
  );
};

export default Login;
