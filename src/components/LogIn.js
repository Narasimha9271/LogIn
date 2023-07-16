import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LogIn() {
    const [inputs, setInputs] = useState({});
    const [alert, setAlert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        // Load Google Sign-In API script dynamically
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: "YOUR_CLIENT_ID",
                callback: handleGoogleSignIn,
            });

            // Render Google Sign-In button
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin"),
                { theme: "filled_blue", size: "large", type: "standard" }
            );
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });

        // Check if email meets the requirements
        if (name === "email") {
            setIsEmailValid(/^\S+@\S+\.\S+$/.test(value));
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRememberMe = (event) => {
        setRememberMe(event.target.checked);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputs);

        let errorMessages = [];

        // Validate email format
        if (!isEmailValid) {
            errorMessages.push("Please enter a valid email address.");
        }

        // Validate password requirements
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
        if (!passwordRegex.test(inputs.password)) {
            errorMessages.push(
                "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long."
            );
        }

        if (errorMessages.length > 0) {
            console.log("Error(s):");
            errorMessages.forEach((error) => console.log(error));
            return;
        }

        // Perform login
        if (isEmailValid && passwordRegex.test(inputs.password)) {
            handleLogin();
        }
    };

    const handleLogin = () => {
        setAlert(true);
        setTimeout(() => {
            setAlert(false);
        }, 3000);
        console.log("Logged in successfully");
    };

    const handleGoogleSignIn = (response) => {
        console.log("Google sign-in response:", response);
        // Perform login using the Google response
    };

    const isInputValid = (inputName) => {
        return inputs[inputName] && inputs[inputName].length > 0;
    };

    const isPasswordValid = () => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
        return passwordRegex.test(inputs.password);
    };

    return (
        <>
            {alert && (
                <Alert severity="success">
                    Congrats! You have successfully logged in.
                </Alert>
            )}
            <form
                onSubmit={handleSubmit}
                className="grid w-full max-w-xs mx-auto space-y-2 mt-10"
            >
                <h1 className="text-black font-bold text-3xl text-center">
                    Hello Again!
                </h1>

                <TextField
                    id="outlined-basic"
                    label="Email"
                    name="email"
                    variant="outlined"
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {isInputValid("email") && !isEmailValid && (
                                    <div
                                        style={{
                                            width: "15px",
                                            height: "15px",
                                            backgroundColor: "red",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "white",
                                                fontSize: "12px",
                                                lineHeight: 1,
                                            }}
                                        >
                                            !
                                        </span>
                                    </div>
                                )}
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    id="outlined-basic"
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {isInputValid("password") && (
                                    <div
                                        style={{
                                            width: "15px",
                                            height: "15px",
                                            backgroundColor: isPasswordValid()
                                                ? "transparent"
                                                : "red",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "white",
                                                fontSize: "12px",
                                                lineHeight: 1,
                                            }}
                                        >
                                            !
                                        </span>
                                    </div>
                                )}
                                <IconButton
                                    onClick={handleTogglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <div className="flex items-center justify-between">
                    <div>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={rememberMe}
                            onChange={handleRememberMe}
                        />
                        <label htmlFor="rememberMe" className="text-black">
                            Remember me
                        </label>
                    </div>
                    <a href="#forgot-password" className="text-black-700">
                        Forgot Password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-[50%] ml-20 mt-20 px-4 py-2 text-black border  border-black "
                    onClick={handleSubmit}
                >
                    Log In
                </button>

                <div
                    id="google-signin"
                    className="text-center mt-4 ml-10"
                    style={{ width: "240px", height: "50px" }}
                ></div>

                <p className="text-center ">
                    Don't Have an Account?{" "}
                    <a
                        href="https://www.example.com/signup"
                        className="text-black-700"
                    >
                        Sign Up
                    </a>
                </p>
            </form>
        </>
    );
}
