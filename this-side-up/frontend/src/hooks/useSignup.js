import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext"; // if you auto-login post-signup

export default function useSignup() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext); // optional

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("https://thissideup-website.onrender.com/api/user/register", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Get response text first
      const text = await res.text();

      // Try parsing JSON safely
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Success: login user if token returned
      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, error, isLoading };
}