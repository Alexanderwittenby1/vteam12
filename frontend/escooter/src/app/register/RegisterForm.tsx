"use client";
import React, { useState } from "react";
import { redirect } from "next/navigation";

function RegisterForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hantera formulärsändning
  const handleSubmit = async (event: React.FormEvent) => {
    setIsSubmitting(true);

    const userData = { email, password };

    try {
      const response = await fetch("http://localhost:4000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseBody = await response.json();

      if (response.ok) {
        setErrorMessage(null);

        setTimeout(() => {
          redirect("/");
        }, 1000);
      } else {
        setErrorMessage(
          responseBody.message || "Något gick fel vid registreringen."
        );
      }
    } catch (error) {
      setErrorMessage("Ett fel inträffade. Försök igen senare.");
      console.error("An error occurred:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="vh-100">
      <div className="mask d-flex align-items-center h-100 bg-color-1">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9-col-lg-7 col-xl-6">
              <div className="card shadow" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5 text-accent-2">
                    Register
                  </h2>
                  <form action={(e) => handleSubmit(e)}>
                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="registerformemail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="registerformemail">
                        Email
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="registerformpassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control form-control-lg"
                      />
                      <label
                        className="form-label"
                        htmlFor="registerformpassword"
                      >
                        Password
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </button>

                    {errorMessage && (
                      <div className="alert alert-danger mt-3">
                        {errorMessage}
                      </div>
                    )}

                    <p className="text-center">
                      Already have an account?{" "}
                      <a href="/login" className="fw-bold text-accent-1">
                        Login here
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterForm;
