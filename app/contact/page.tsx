import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

const ContactUs: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto pt-16 text-slate-700">
        <div className=" flex justify-center items-center p-10 bg-indigo-500">
          <h1 className=" text-4xl font-bold text-white">Contact Us</h1>
        </div>
        <section className="mb-8 pt-4 px-32" >
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="font-semibold text-xl">Customer Support</h3>
              <p>
                If you have any questions or need assistance, please contact our
                support team:
              </p>
              <p className="mt-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@roomio.com"
                  className="text-blue-500 underline"
                >
                  support@roomio.com
                </a>
              </p>
              <p className="mt-2">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p className="mt-2">
                <strong>Hours:</strong> Mon-Fri, 9 AM - 5 PM (EST)
              </p>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="font-semibold text-xl">Feedback & Suggestions</h3>
              <p>
                Your feedback is important to us! Share your thoughts and
                suggestions:
              </p>
              <form className="mt-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-1">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-2 border rounded"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-2 border rounded"
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block mb-1">
                    Message:
                  </label>
                  <textarea
                    id="message"
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="Your Message"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
