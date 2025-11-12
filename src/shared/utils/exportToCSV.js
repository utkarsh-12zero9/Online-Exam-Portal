export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csvContent = headers.join(',') + '\n';

  // Add rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape commas and quotes in values
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    });
    csvContent += values.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// 
// const exportDetailedAttempts = () => {
//   const data = [];

//   enrollments.forEach((enrollment) => {
//     const user = users.find((u) => u.id === enrollment.userId);
//     const course = courses.find((c) => c.id === enrollment.courseId);

//     enrollment.attempts.forEach((attempt) => {
//       data.push({
//         'Student Name': user?.name || 'Unknown',
//         'Student Email': user?.email || 'Unknown',
//         'Course Title': course?.title || 'Unknown',
//         'Attempt Date': new Date(attempt.submittedAt).toLocaleString(),
//         'Score': attempt.score,
//         'Total Marks': attempt.totalMarks,
//         'Percentage': attempt.percentage,
//         'Violation Count': attempt.violationCount || 0,
//         'Auto Submitted': attempt.autoSubmitted ? 'Yes' : 'No',
//         'Submission Reason': attempt.submissionReason || 'User submitted',
//         'Status': attempt.status,
//       });
//     });
//   });

//   exportToCSV(data, `detailed-attempts-${new Date().toISOString().split('T')[0]}.csv`);
//   toast.success('Detailed attempts data exported successfully!');
// };
