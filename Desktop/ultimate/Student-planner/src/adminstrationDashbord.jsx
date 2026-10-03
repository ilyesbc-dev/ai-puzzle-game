import { useState } from "react";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  extra: "", 
  password: "",
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("teachers");
  const [modalRole, setModalRole] = useState(null); // "teacher" | "student" | null
  const [notice, setNotice] = useState("");

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "ilyes Bouchaala",
      email: "ilyesbouchaaala@gmail.com",
      subject: "Mathematics",
      students: 12,
      progress: 78,
      activity: "Updated ilyes's progress",
    },
    {
      id: 2,
      name: "Mohamed mohamed",
      email: "mohamed@gmail.com",
      subject: "Physics",
      students: 18,
      progress: 65,
      activity: "Added a new exercise",
    },
    {
      id: 3,
      name: "Lina lina",
      email: "lina@gmail.com",
      subject: "Computer Science",
      students: 15,
      progress: 84,
      activity: "Updated student results",
    },
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ahmed Ahmed",
      email: "ahmed@gmail.com",
      level: "L2 Computer Science",
      progress: 75,
      attempts: 18,
      lastActivity: "Math Quiz",
    },
    {
      id: 2,
      name: "Yacine Karim",
      email: "yacine@gmail.com",
      level: "L1 Mathematics",
      progress: 62,
      attempts: 11,
      lastActivity: "Physics Exercise",
    },
    {
      id: 3,
      name: "Lina Lina",
      email: "lina@gmail.com",
      level: "L2 Computer Science",
      progress: 91,
      attempts: 24,
      lastActivity: "Programming Quiz",
    },
    {
      id: 4,
      name: "Amine Haddad",
      email: "amine@gmail.com",
      level: "L3 Physics",
      progress: 68,
      attempts: 15,
      lastActivity: "Physics Test",
    },
  ]);

  const showNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  };

  const emailExists = (email) =>
    [...teachers, ...students].some(
      (person) => person.email.toLowerCase() === email.toLowerCase()
    );

  // Called by the modal once the form is valid
  const handleAdd = async (role, data) => {
    const name = `${data.firstName.trim()} ${data.lastName.trim()}`;

   
    //    
    if (role === "teacher") {
      const created = {
        id: Date.now(),
        name,
        email: data.email.trim(),
        subject: data.extra.trim(),
        students: 0,
        progress: 0,
        activity: "Account created",
      };
      setTeachers((prev) => [created, ...prev]);
      setActiveTab("teachers");
    } else {
      const created = {
        id: Date.now(),
        name,
        email: data.email.trim(),
        level: data.extra.trim(),
        progress: 0,
        attempts: 0,
        lastActivity: "-",
      };
      setStudents((prev) => [created, ...prev]);
      setActiveTab("students");
    }

    setModalRole(null);
    showNotice(`${role === "teacher" ? "Teacher" : "Student"} ${name} added`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <p className="text-sm text-gray-500">Monitor teachers and students</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="font-bold text-indigo-700">A</span>
            </div>

            <div>
              <p className="font-semibold">Administrator</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome + add buttons */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500 mt-2">
              See teacher activity, student progress and attempts.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setModalRole("student")}
              className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              + Add Student
            </button>

            <button
              type="button"
              onClick={() => setModalRole("teacher")}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              + Add Teacher
            </button>
          </div>
        </div>

        {/* Success message */}
        {notice && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {notice}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Teachers"
            value={teachers.length}
            color="text-indigo-600"
          />

          <StatCard
            title="Students"
            value={students.length}
            color="text-blue-600"
          />

          <StatCard
            title="Total Attempts"
            value={students.reduce((total, student) => total + student.attempts, 0)}
            color="text-purple-600"
          />

          <StatCard
            title="Average Progress"
            value={
              students.length === 0
                ? "0%"
                : Math.round(
                    students.reduce((total, student) => total + student.progress, 0) /
                      students.length
                  ) + "%"
            }
            color="text-green-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("teachers")}
                className={`py-4 font-semibold border-b-2 ${
                  activeTab === "teachers"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Teachers
              </button>

              <button
                onClick={() => setActiveTab("students")}
                className={`py-4 font-semibold border-b-2 ${
                  activeTab === "students"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Students
              </button>
            </div>
          </div>

          {/* Teachers */}
          {activeTab === "teachers" && (
            <div className="p-6">
              <h3 className="text-xl font-bold mb-5">Teacher Activity</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm text-gray-500">Teacher</th>
                      <th className="text-left py-3 text-sm text-gray-500">Subject</th>
                      <th className="text-left py-3 text-sm text-gray-500">Students</th>
                      <th className="text-left py-3 text-sm text-gray-500">Progress</th>
                      <th className="text-left py-3 text-sm text-gray-500">Last Activity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <p className="font-semibold">{teacher.name}</p>
                          <p className="text-sm text-gray-500">{teacher.email}</p>
                        </td>

                        <td className="py-4">{teacher.subject || "-"}</td>

                        <td className="py-4">{teacher.students}</td>

                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${teacher.progress}%` }}
                              />
                            </div>

                            <span className="text-sm">{teacher.progress}%</span>
                          </div>
                        </td>

                        <td className="py-4 text-sm text-gray-500">
                          {teacher.activity || "-"}
                        </td>
                      </tr>
                    ))}

                    {teachers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No teacher yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Students */}
          {activeTab === "students" && (
            <div className="p-6">
              <h3 className="text-xl font-bold mb-5">Student Progress & Attempts</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm text-gray-500">Student</th>
                      <th className="text-left py-3 text-sm text-gray-500">Level</th>
                      <th className="text-left py-3 text-sm text-gray-500">Progress</th>
                      <th className="text-left py-3 text-sm text-gray-500">Attempts</th>
                      <th className="text-left py-3 text-sm text-gray-500">Last Activity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </td>

                        <td className="py-4">{student.level || "-"}</td>

                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>

                            <span className="text-sm">{student.progress}%</span>
                          </div>
                        </td>

                        <td className="py-4 font-semibold">{student.attempts}</td>

                        <td className="py-4 text-sm text-gray-500">
                          {student.lastActivity || "-"}
                        </td>
                      </tr>
                    ))}

                    {students.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No student yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      {modalRole && (
        <AddUserModal
          role={modalRole}
          emailExists={emailExists}
          onClose={() => setModalRole(null)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  );
}

// Popup form used for both teacher and student
function AddUserModal({ role, emailExists, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const isTeacher = role === "teacher";
  const extraLabel = isTeacher ? "Subject" : "Level";
  const extraPlaceholder = isTeacher ? "Mathematics" : "L2 Computer Science";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (emailExists(form.email.trim())) {
      newErrors.email = "This email is already used";
    }

    if (!form.extra.trim()) newErrors.extra = `${extraLabel} is required`;

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setSaving(true);

    try {
      await onSubmit(role, form);
    } catch (err) {
      setServerError(err.message || "Something went wrong");
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 focus:outline-none ${
      errors[field]
        ? "border-red-500"
        : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Add {isTeacher ? "Teacher" : "Student"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {serverError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={inputClass("firstName")}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={inputClass("lastName")}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="extra" className="mb-1 block text-sm font-medium text-gray-700">
              {extraLabel}
            </label>
            <input
              id="extra"
              name="extra"
              value={form.extra}
              onChange={handleChange}
              placeholder={extraPlaceholder}
              className={inputClass("extra")}
            />
            {errors.extra && (
              <p className="mt-1 text-xs text-red-600">{errors.extra}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Temporary Password
            </label>
            <input
              id="password"
              name="password"
              type="text"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className={inputClass("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
            >
              {saving ? "Saving..." : `Add ${isTeacher ? "Teacher" : "Student"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-sm text-gray-500">{title}</p>

      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

export default AdminDashboard;