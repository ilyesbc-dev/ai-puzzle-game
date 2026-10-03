import { useState } from "react";

const courses = [
  { id: 1, title: "Mathematics", teacher: "Sara sara", progress: 78, attempts: 6 },
  { id: 2, title: "Physics", teacher: "Mohamed bounane", progress: 62, attempts: 4 },
  { id: 3, title: "Computer Science", teacher: "aymen aymen", progress: 91, attempts: 8 },
];

const history = [
  { id: 1, name: "Math ", score: 16, date: "2 days ago" },
  { id: 2, name: "sience", score: 18, date: "4 days ago" },
  { id: 3, name: "Physics ", score: 12, date: "1 week ago" },
];

function StudentDashboard() {
  const [filter, setFilter] = useState("all");

  const visibleCourses = courses.filter((course) => {
    if (filter === "done") return course.progress >= 80;
    if (filter === "progress") return course.progress < 80;
    return true;
  });

  const average = Math.round(
    courses.reduce((total, c) => total + c.progress, 0) / courses.length
  );

  const filterClass = (name) =>
    `rounded-lg px-4 py-2 text-sm font-medium ${
      filter === name
        ? "bg-indigo-600 text-white"
        : "border border-gray-300 text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
          <p className="mt-2 text-gray-500">
            Check your progress and your latest results.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <StatCard title="Courses" value={courses.length} color="text-indigo-600" />
          <StatCard title="Average Progress" value={average + "%"} color="text-green-600" />
          <StatCard
            title="Total Attempts"
            value={courses.reduce((total, c) => total + c.attempts, 0)}
            color="text-purple-600"
          />
        </div>

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">My Courses</h2>

            <div className="flex gap-2">
              <button type="button" onClick={() => setFilter("all")} className={filterClass("all")}>
                All
              </button>
              <button type="button" onClick={() => setFilter("progress")} className={filterClass("progress")}>
                In progress
              </button>
              <button type="button" onClick={() => setFilter("done")} className={filterClass("done")}>
                Almost done
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map((course) => (
              <div key={course.id} className="rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-bold">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.teacher}</p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-sm">{course.progress}%</span>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  {course.attempts} attempts
                </p>
              </div>
            ))}

            {visibleCourses.length === 0 && (
              <p className="text-gray-500">No course in this category</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-bold">Recent Results</h2>

          <ul>
            {history.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>

                <span
                  className={`font-bold ${
                    item.score >= 15 ? "text-green-600" : "text-orange-500"
                  }`}
                >
                  {item.score}/20
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default StudentDashboard;