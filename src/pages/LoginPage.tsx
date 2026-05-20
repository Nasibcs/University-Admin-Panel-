import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";

const parseApiError = async (response: Response) => {
  const fallback = `Request failed with status ${response.status}`;
  const text = await response.text();
  if (!text) return fallback;

  try {
    const data = JSON.parse(text) as { message?: string; errors?: Record<string, string> };
    if (data.errors && Object.keys(data.errors).length > 0) {
      return `${data.message || "Validation failed"} - ${Object.entries(data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(", ")}`;
    }
    return data.message || fallback;
  } catch {
    return text;
  }
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    form: "",
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {
      username: "",
      password: "",
      form: "",
    };

    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (touched.username || touched.password) {
      validate();
    }
  }, [username, password, touched]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });

    if (!validate()) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, form: "" }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      const data = await response.json() as {
        token: string;
        profile: { username: string; email: string; profilePicture: string };
      };
      localStorage.setItem("admin-token", data.token);
      localStorage.setItem("admin-profile", JSON.stringify(data.profile));
      navigate("/dashboard");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: error instanceof Error ? error.message : "An error occurred. Please try again later.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 via-slate-100 to-amber-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md rounded-2xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-950/10 dark:border-slate-700/80 dark:bg-slate-900/95">
          <div className="bg-gradient-to-r from-slate-800 via-teal-700 to-amber-500 px-8 py-7 text-center text-white">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/25">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-200" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.052a.75.75 0 01.75.75v2.448a1 1 0 00.553.894l3 1.5a1 1 0 00.894 0l3-1.5A1 1 0 0014 11.25V8.802a.75.75 0 01.75-.75l2.644-1.132a1 1 0 000-1.84l-7-3z" />
                <path d="M5 10.768v2.482a3 3 0 001.659 2.683l3 1.5a3 3 0 002.682 0l3-1.5A3 3 0 0017 13.25v-2.482l-2 .857v1.625a1 1 0 01-.553.894l-3 1.5a1 1 0 01-.894 0l-3-1.5A1 1 0 017 13.25v-1.625l-2-.857z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold">Academic Portal</h1>
            <p className="mt-1 text-sm text-white/85">
              Administrator Access
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-gradient-to-br from-stone-50/90 to-slate-100/50 p-6 dark:bg-slate-900/80 sm:p-8"
            noValidate
          >
            {errors.form && (
              <div className="mb-6 flex items-center rounded-xl border border-red-200/80 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-900/30 dark:text-red-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.5a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4zM10 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {errors.form}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700 dark:text-stone-200">
                Username
              </label>

              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => handleBlur("username")}
                  className={`w-full rounded-lg border px-4 py-2 pr-10 text-slate-900 shadow-sm transition focus:ring-2 dark:bg-slate-800/80 dark:text-stone-100 ${
                    errors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/25 dark:border-red-500"
                      : "border-slate-200/90 focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700"
                  }`}
                  placeholder="Enter your username"
                  required
                />

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-stone-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {errors.username && touched.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-stone-200">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full rounded-lg border px-4 py-2 pr-10 text-slate-900 shadow-sm transition focus:ring-2 dark:bg-slate-800/80 dark:text-stone-100 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/25 dark:border-red-500"
                      : "border-slate-200/90 focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700"
                  }`}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition hover:text-teal-700 dark:text-stone-400 dark:hover:text-amber-300"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600 dark:border-slate-700 dark:bg-slate-800"
                />

                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-stone-200">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-amber-300 dark:hover:text-amber-200">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-lg border border-transparent bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                isLoading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="border-t border-slate-200/80 bg-stone-50/90 px-8 py-4 text-center dark:border-slate-700/80 dark:bg-slate-800/80">
            <p className="text-xs text-slate-500 dark:text-stone-300">
              © {new Date().getFullYear()} Academic Portal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
