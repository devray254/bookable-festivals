
// Logs related utilities

// Mock data for logs
const mockLogs = [
  {
    id: 1,
    timestamp: "2023-08-25 09:30:45",
    action: "Event Created",
    user: "admin@maabara.co.ke",
    details: "Created new event: Science Exhibition",
    ip: "192.168.1.1",
    level: "info"
  },
  {
    id: 2,
    timestamp: "2023-08-25 10:15:22",
    action: "Payment Completed",
    user: "john@example.com",
    details: "Payment for Science Exhibition successful",
    ip: "192.168.1.15",
    level: "info"
  }
];

// Log activity
export const logActivity = async (activity: any) => {
  console.log('Logging activity:', activity);
  
  const newId = mockLogs.length + 1;
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  const newLog = {
    id: newId,
    timestamp,
    ip: "127.0.0.1",
    ...activity
  };
  
  mockLogs.unshift(newLog);
  
  return { success: true };
};

// Fetch activity logs from database
export const fetchActivityLogs = async () => {
  return mockLogs;
};
