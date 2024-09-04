"use client";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as Yup from "yup";
import { debounce } from "lodash";
import Modal from "@/components/Modal";
import LoadingDots from "@/components/LoadingDots";

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface EmailStatus {
  method: string;
  exists: boolean;
  verified: boolean;
  role: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loginError, setLoginError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect if already authenticated
    }
  }, [status, router]);

  const fetchCheckEmail = async (email: string) => {
    setIsCheckingEmail(true);
    try {
      const response = await fetch(`${apiUrl}/auth/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setEmailStatus({
          method: data.data.method,
          exists: data.data.exists,
          verified: data.data.verified,
          role:data.data.role,
        });
      } else {
        setEmailStatus(null);
      }
    } catch (error) {
      console.error("Error fetching email status:", error);
      setEmailStatus(null);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEmailChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setEmailStatus(null);
    fetchCheckEmail(e.target.value);
  }, 1500);

  const resendVerification = async (email: string) => {
    try {
      const response = await fetch(`${apiUrl}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {        
      alert(
        data.success
          ? "Verification email resent. Please check your inbox."
          : "Failed to resend verification email. Please try again later."
      );
      } else {
        console.error(
          "Failed to resend verification:",
          data.statusMessage || "Unknown error"
        );
        alert("Failed to resend verification. Please try again later.");
      }
      
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert("An error occurred while resending the verification email.");
    }
  };

  const registerEmail = async (email: string, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(true); // Disable the button
    try {
      const response = await fetch(`${apiUrl}/auth/register/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Email successfully registered. Please check your inbox.");
        onSuccess(); // Perform success actions like closing the modal
      } else {
        console.error(
          "Failed to register user:",
          data.statusMessage || "Unknown error"
        );
        alert("Failed to register email. Please try again later.");
      }
    } catch (error) {
      console.error("Error registering email:", error);
      alert("An error occurred while registering the email.");
    } finally {
      setSubmitting(false); // Re-enable the button
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().when("email", {
      is: (val: string) => emailStatus && emailStatus.method === "email",
      then: (schema) => schema.required("Password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoginError(null);
    // console.log(values.email, values.password)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      } else {
        onSuccess();
        onClose();
        router.push(`/`);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setLoginError(
        "Your email and password combination is incorrect. Please try again."
      );
    }

    setSubmitting(false);
  };

  return (
    <Modal>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden relative z-50 max-w-md w-full">
        <button
          className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">
            Log In/Register
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleChange, values, setSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter your email address"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleEmailChange(e);
                      }}
                    />
                    {isCheckingEmail && (
                      <div className="absolute right-3 top-2">
                        <LoadingDots />
                      </div>
                    )}
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>

                {emailStatus?.exists &&
                  emailStatus?.method === "email" &&
                  emailStatus?.role.toLowerCase() === "user" &&
                  emailStatus.verified && (
                    <div className="mb-2">
                      <label
                        htmlFor="password"
                        className="block text-gray-700 text-sm font-bold mb-1"
                      >
                        Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your password"
                      />
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="text-red-500 text-xs italic"
                      />
                      <div className=" text-right font-semibold text-blue-800">
                        <a href="#">Forgot password?</a>
                      </div>
                    </div>
                  )}

                {emailStatus?.exists && emailStatus?.role.toLowerCase() === "user" && emailStatus?.method !== "email" && (
                  <p className="text-red-500 text-xs italic mb-4">
                    This email is registered with social login. Please use the
                    respective method to log in.
                  </p>
                )}

                {emailStatus?.exists && emailStatus?.role.toLowerCase() !== "user" && (
                  <p className="text-red-500 text-xs italic mb-4">
                  This email already registered as Tenant. Please use another email to log in.
                </p>
                )}

                {emailStatus && !emailStatus.exists && (
                  <button
                    type="button"
                    className="bg-orange-600 hover:bg-orange-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => registerEmail(values.email, setSubmitting)}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>
                )}

                {emailStatus?.exists && !emailStatus.verified && (
                  <button
                    type="button"
                    className="bg-orange-600 hover:bg-orange-500 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                    onClick={() => resendVerification(values.email)}
                  >
                    Resend Verification Email
                  </button>
                )}

                {emailStatus?.method === "email" && emailStatus?.role.toLowerCase() === "user" && emailStatus?.verified && (
                  <button
                    type="submit"
                    className="bg-indigo-800 hover:bg-indigo-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging In..." : "Log In"}
                  </button>
                )}

                {loginError && (
                  <p className="text-red-500 text-xs italic mb-4">
                    {loginError}
                  </p>
                )}
              </Form>
            )}
          </Formik>

          <div className="my-4 flex items-center justify-center text-sm text-gray-500">
            <div className="border-t border-gray-300 flex-grow mr-3"></div>
            or log in/register with
            <div className="border-t border-gray-300 flex-grow ml-3"></div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="w-full py-2 flex items-center justify-center bg-white border border-blue-300 rounded-md text-blue-500 hover:bg-gray-100"
              onClick={() => signIn("google")}
            >
              <Image
                src="https://img.icons8.com/color/48/google-logo.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full py-2 flex items-center justify-center bg-white border border-blue-300 rounded-md text-blue-500 hover:bg-gray-100"
              onClick={() => signIn("facebook")}
            >
              <Image
                src="https://img.icons8.com/color/48/facebook-new.png"
                alt="Facebook"
                width={20}
                height={20}
                className="mr-2"
              />
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
