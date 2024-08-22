"use client";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as Yup from "yup";
import Modal from "../Modal";

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to your desired page after successful login
      router.push("/"); // Replace with your desired route
    }
  }, [status, router]);

  const [loginError, setLoginError] = useState<string | null>(null);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
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

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/your-callback-url', redirect: false }).then((result) => {
      if (result?.error) {
        console.error(result.error);
      }
    });
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
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your email address"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
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
                </div>
                <div>
                  {loginError && (
                    <p className="text-red-500 text-xs italic mb-4">
                      {loginError}
                    </p>
                  )}
                </div>
              </Form>
            )}
          </Formik>

          <div className="my-4 flex items-center justify-center text-sm text-gray-500">
            <div className="border-t border-gray-300 flex-grow mr-3"></div>
            or log in/register with
            <div className="border-t border-gray-300 flex-grow ml-3"></div>
          </div>

          <div className=" flex flex-col gap-2">
            <button
              className="w-full py-2 flex items-center justify-center bg-white border border-blue-300 rounded-md text-blue-500 hover:bg-gray-100"
              onClick={() => signIn("google")}
            >
              <Image
                src="https://img.icons8.com/color/48/google-logo.png"
                alt="Google icon"
                className="w-5 h-5 mr-2"
                width={40}
                height={40}
              />
              Continue with Google
            </button>

            <button
              className="w-full py-2 flex items-center justify-center bg-white border border-blue-300 rounded-md text-blue-500 hover:bg-gray-100"
              onClick={() => signIn("facebook")}
            >
              <Image
                src="https://img.icons8.com/color/48/facebook-new.png"
                alt="Facebook icon"
                className="w-6 h-6 mr-2"
                width={40}
                height={40}
              />
              Continue with Facebook
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            By registering, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms & Conditions
            </a>{" "}
            and that you have read our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Notice
            </a>
            .
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default LoginModal;
