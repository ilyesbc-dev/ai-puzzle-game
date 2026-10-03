

const N8N_REMINDER_WEBHOOK = "https://your-n8n-instance.com/webhook/student-reminder";

export const sendStudentReminder = async ({ studentName, studentEmail, assignmentTitle, courseName, dueDate }) => {
  try {
    const response = await fetch(N8N_REMINDER_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentName,
        studentEmail,
        assignmentTitle,
        courseName,
        dueDate,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send reminder: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error triggering n8n reminder:", error);
    throw error;
  }
};