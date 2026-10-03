import { useState } from "react";

function TeacherDashboard() {
  const [students, setStudents] = useState([
    { id: 1, name: "Ahmed ", level: "L2 Computer Science", progress: 75, attempts: 18 },
    { id: 2, name: "Yacine Karim", level: "L1 Mathematics", progress: 62, attempts: 11 },
    { id: 3, name: "Lina Said", level: "L2 Computer Science", progress: 91, attempts: 24 },
    { id: 4, name: "Amine Haddad", level: "L3 Physics", progress: 68, attempts: 15 },
  ]);

  const [search, setSearch] = useState("");

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateProgress = (id, amount) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, progress: Math.min(100, Math.max(0, s.progress + amount)) }
          : s
      )
    );
  };

  const average = Math.round(
    students.reduce((total, s) => total + s.progress, 0) / students.length
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-gray-500">
            Follow your students and update their progress.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <StatCard title="My Students" value={students.length} color="text-indigo-600" />
          <StatCard title="Average Progress" value={average + "%"} color="text-green-600" />
          <StatCard
            title="Total Attempts"
            value={students.reduce((total, s) => total + s.attempts, 0)}
            color="text-purple-600"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold">Students</h2>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a student..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left text-sm text-gray-500">Student</th>
                  <th className="py-3 text-left text-sm text-gray-500">Level</th>
                  <th className="py-3 text-left text-sm text-gray-500">Progress</th>
                  <th className="py-3 text-left text-sm text-gray-500">Attempts</th>
                  <th className="py-3 text-left text-sm text-gray-500">Update</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100">
                    <td className="py-4 font-semibold">{student.name}</td>
                    <td className="py-4">{student.level}</td>

                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-indigo-600"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{student.progress}%</span>
                      </div>
                    </td>

                    <td className="py-4 font-semibold">{student.attempts}</td>

                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateProgress(student.id, -5)}
                          className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
                        >
                          -5%
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProgress(student.id, 5)}
                          className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                        >
                          +5%
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No student found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

export default TeacherDashboard;