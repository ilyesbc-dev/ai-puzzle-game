import { Link } from "react-router-dom";

const roles = [
  {
    title: "Students",
    text: "See your courses, your progress and your latest quiz scores without asking anyone.",
    to: "/student",
    link: "Open student page",
  },
  {
    title: "Teachers",
    text: "Follow your students, update their progress after a class and spot who needs help.",
    to: "/teacher",
    link: "Open teacher page",
  },
  {
    title: "Administration",
    text: "Get the full picture: teachers, students, attempts and average progress.",
    to: "/admin",
    link: "Open admin page",
  },
];

function Home() {
  return (
    <div className="bg-stone-50 text-stone-900">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-medium text-indigo-700">
            LearnFlow
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Know where every student{" "}
            <span className="underline decoration-indigo-500 decoration-4 underline-offset-4">
              really stands
            </span>
            .
          </h1>

          <p className="mt-6 max-w-lg text-lg text-stone-600">
            Track student progress, attempts, and quiz results—all in one place. 
            Say goodbye to spreadsheet chaos for teachers, and give students total clarity on their growth.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-indigo-700 px-6 py-3 font-medium text-white transition hover:bg-indigo-800"
            >
              Create an account
            </Link>

            <Link
              to="/login"
              className="font-medium text-stone-700 underline underline-offset-4 hover:text-indigo-700"
            >
              I already have one
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 -rotate-3 rounded-2xl border border-stone-200 bg-amber-100" />

          <div className="relative rotate-2 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Ahmed Mansouri</p>
                <p className="text-sm text-stone-500">L2 Computer Science</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                16/20
              </span>
            </div>

            <p className="mt-5 text-sm text-stone-500">Programming</p>

            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-stone-200">
                <div className="h-2 w-3/4 rounded-full bg-indigo-600" />
              </div>
              <span className="text-sm font-medium">75%</span>
            </div>

            <p className="mt-5 border-t border-stone-100 pt-4 text-sm text-stone-500">
              Updated by Ms. Benali, 2 days ago
            </p>
          </div>
        </div>
      </section>

      
      <section className="bg-stone-900">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
          <h1>ALl right reservedProgramming Quiz</h1>
        </div>
      </section>

     
      <footer className="bg-stone-900 pb-8">
        <p className="mx-auto max-w-6xl border-t border-stone-800 px-6 pt-6 text-sm text-stone-500">
          © {new Date().getFullYear()} 
        </p>
      </footer>
    </div>
  );
}

export default Home;