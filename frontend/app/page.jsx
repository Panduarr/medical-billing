"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const questions = [
  {
    key: "providers",
    question:
      "How many medical providers are in your practice?",
    options: ["1-2", "3-5", "6-10", "11+"],
  },
  {
    key: "practiceType",
    question:
      "What type of practice do you have?",
    options: [
      "Primary Care",
      "Specialty Care",
      "Dental",
      "Mental Health",
    ],
  },
  {
    key: "softwareType",
    question:
      "What type of medical software are you looking for?",
    options: [
      "Electronic Health Records",
      "Practice Management",
      "Medical Billing",
      "Complete Solution",
    ],
  },
  {
    key: "features",
    question:
      "Which feature is most important to you?",
    options: [
      "Patient Management",
      "Billing & Payments",
      "Scheduling",
      "Reporting",
    ],
  },
  {
    key: "timeline",
    question:
      "How soon are you looking to switch software?",
    options: [
      "Immediately",
      "Within 1 Month",
      "Within 3 Months",
      "Just Researching",
    ],
  },
];

export default function Page() {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState("");
  const [moving, setMoving] = useState(false);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    bookingDate: "",
    bookingTime: "",
    timezone: "Asia/Kolkata",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const totalSteps = questions.length + 1;
  const contactPage = page === questions.length;

  const progress = Math.round(
    ((page + 1) / totalSteps) * 100
  );

  function selectOption(option) {
    if (moving) return;

    const question = questions[page];

    setAnswers((current) => ({
      ...current,
      [question.key]: option,
    }));

    setSelected(option);
    setMoving(true);

    setTimeout(() => {
      setPage((current) => current + 1);
      setSelected("");
      setMoving(false);
    }, 300);
  }

  function goBack() {
    if (moving || page === 0) return;

    const previousPage = page - 1;

    setPage(previousPage);

    setSelected(
      answers[questions[previousPage].key] || ""
    );
  }

  function changeContact(event) {
    const { name, value } = event.target;

    setContact((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitBooking(event) {
    event.preventDefault();

    setError("");

    if (
      !contact.name.trim() ||
      !contact.email.trim() ||
      !contact.phone.trim() ||
      !contact.bookingDate ||
      !contact.bookingTime
    ) {
      setError(
        "Please complete all contact and booking details."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...contact,
            ...answers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to create booking."
        );
      }

      setResult(data);
    } catch (error) {
      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-white text-[#243f61]">
        <header className="px-5 py-8 text-center">
          <h1 className="text-2xl font-bold md:text-3xl">
            Save by Comparing Medical Software Quotes
          </h1>
        </header>

        <main className="mx-auto flex min-h-[70vh] w-[90%] max-w-[850px] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#eef5ff] text-4xl font-bold text-[#477abd]">
            ✓
          </div>

          <h2 className="text-3xl font-bold md:text-4xl">
            Booking Confirmed!
          </h2>

          <p className="mt-4 max-w-[650px] text-lg leading-8 text-gray-600">
            Thank you, {contact.name}. Your booking
            has been created and a confirmation email
            has been sent to {contact.email}.
          </p>

          <a
            href={result.meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 rounded-lg bg-[#477abd] px-10 py-4 text-lg font-bold text-white shadow-md transition hover:bg-[#3869aa]"
          >
            Join Google Meet
          </a>

          <p className="mt-5 text-sm text-gray-500">
            Booking ID: {result.id}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#243f61]">
      <header className="px-5 py-8 text-center">
        <h1 className="text-2xl font-bold md:text-3xl">
          Save by Comparing Medical Software Quotes
        </h1>
      </header>

      <div className="bg-[#f5f5f5] px-5 py-2 text-center text-black">
        Progress: {progress}%

        <div className="mt-2 h-1 w-full overflow-hidden">
          <div
            className="h-full bg-[#4678bd] transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <main className="mx-auto w-[90%] max-w-[1000px] py-8">
        {!contactPage ? (
          <div
            className={`transition-all duration-300 ${
              moving
                ? "translate-x-3 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <h2 className="mb-8 text-center text-2xl font-semibold md:text-4xl">
              {questions[page].question}
            </h2>

            <div className="flex flex-col gap-[18px]">
              {questions[page].options.map(
                (option) => {
                  const chosen =
                    selected === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={moving}
                      onClick={() =>
                        selectOption(option)
                      }
                      className={`flex min-h-[74px] w-full items-center rounded-md px-6 text-left shadow-[0_2px_5px_rgba(0,0,0,0.08)] transition md:px-8 ${
                        chosen
                          ? "border-2 border-[#4678bd] bg-[#eef5ff]"
                          : "border border-[#7890ad] hover:border-[#4678bd] hover:bg-[#f7faff]"
                      }`}
                    >
                      <span
                        className={`mr-5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border ${
                          chosen
                            ? "border-[#4678bd]"
                            : "border-[#7188a5]"
                        }`}
                      >
                        {chosen && (
                          <span className="h-4 w-4 rounded-full bg-[#4678bd]" />
                        )}
                      </span>

                      <span className="text-lg font-semibold md:text-xl">
                        {option}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        ) : (
          <form
            onSubmit={submitBooking}
            className="mx-auto max-w-[700px]"
          >
            <h2 className="mb-3 text-center text-2xl font-semibold md:text-4xl">
              Book Your Consultation
            </h2>

            <p className="mb-8 text-center text-gray-600">
              Enter your details and choose a convenient
              date and time.
            </p>

            <div className="space-y-5">
              <input
                name="name"
                value={contact.name}
                onChange={changeContact}
                placeholder="Full Name"
                className="w-full rounded-md border border-[#7890ad] px-5 py-4 outline-none focus:border-[#4678bd]"
              />

              <input
                name="email"
                type="email"
                value={contact.email}
                onChange={changeContact}
                placeholder="Email Address"
                className="w-full rounded-md border border-[#7890ad] px-5 py-4 outline-none focus:border-[#4678bd]"
              />

              <input
                name="phone"
                type="tel"
                value={contact.phone}
                onChange={changeContact}
                placeholder="Phone Number"
                className="w-full rounded-md border border-[#7890ad] px-5 py-4 outline-none focus:border-[#4678bd]"
              />

              <label className="block text-sm font-semibold">
                Consultation Date
                <input
                  name="bookingDate"
                  type="date"
                  value={contact.bookingDate}
                  onChange={changeContact}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className="mt-2 w-full rounded-md border border-[#7890ad] px-5 py-4 outline-none focus:border-[#4678bd]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Consultation Time
                <input
                  name="bookingTime"
                  type="time"
                  value={contact.bookingTime}
                  onChange={changeContact}
                  className="mt-2 w-full rounded-md border border-[#7890ad] px-5 py-4 outline-none focus:border-[#4678bd]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Time Zone
                <select
                  name="timezone"
                  value={contact.timezone}
                  onChange={changeContact}
                  className="mt-2 w-full rounded-md border border-[#7890ad] px-5 py-4 outline-none focus:border-[#4678bd]"
                >
                  <option value="Asia/Kolkata">
                    India — Asia/Kolkata
                  </option>
                  <option value="America/New_York">
                    Eastern Time
                  </option>
                  <option value="America/Chicago">
                    Central Time
                  </option>
                  <option value="America/Denver">
                    Mountain Time
                  </option>
                  <option value="America/Los_Angeles">
                    Pacific Time
                  </option>
                  <option value="Europe/London">
                    London
                  </option>
                </select>
              </label>
            </div>

            {error && (
              <p className="mt-4 text-center text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 h-[70px] w-full rounded-lg bg-[#477abd] text-xl font-bold text-white shadow-md transition hover:bg-[#3869aa] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Booking..."
                : "Confirm Booking"}
            </button>
          </form>
        )}

        {page > 0 && (
          <button
            type="button"
            disabled={moving || loading}
            onClick={goBack}
            className="mt-8 rounded-lg border border-[#477abd] bg-white px-7 py-3 text-lg font-semibold text-[#477abd] transition hover:bg-[#eef5ff]"
          >
            ← Back
          </button>
        )}
      </main>

      <footer className="mx-auto flex w-[90%] max-w-[1000px] justify-between py-5">
        <span>⏱ It only takes a minute!</span>
        <span>🔒 Privacy Policy</span>
      </footer>
    </div>
  );
}
