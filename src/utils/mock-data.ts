
/**
 * Mock data utility for development and testing
 * This provides fallback data when the backend is not available
 */

// Mock categories
export const mockCategories = [
  { id: 1, name: 'Workshop', description: 'Hands-on learning experiences for healthcare professionals' },
  { id: 2, name: 'Seminar', description: 'Educational presentations and discussions on healthcare topics' },
  { id: 3, name: 'Conference', description: 'Healthcare conferences and professional events' },
  { id: 4, name: 'Webinar', description: 'Online educational sessions for healthcare providers' },
  { id: 5, name: 'Training', description: 'Specialized training programs for healthcare practitioners' }
];

// Mock events with data inspired by maabaraonline.com
export const mockEvents = [
  {
    id: 1,
    title: "Antimicrobial Stewardship for Healthcare Providers",
    description: "This comprehensive workshop focuses on the principles and practices of antimicrobial stewardship in healthcare settings. Participants will learn evidence-based approaches to optimize antimicrobial use, reduce resistance, and improve patient outcomes.",
    date: "2025-06-15",
    time: "09:00:00",
    location: "Maabara Hub, Nairobi",
    price: 2500,
    is_free: 0,
    category_id: 1,
    category_name: "Workshop",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2025-04-01 10:00:00",
    updated_at: "2025-04-01 10:00:00",
    cpd_points: 5,
    target_audience: "Physicians, Pharmacists, Nurses",
    learning_objectives: [
      "Understand the principles of antimicrobial stewardship",
      "Apply evidence-based strategies to reduce antimicrobial resistance",
      "Develop skills for implementing stewardship programs in clinical settings"
    ],
    facilitator: "Dr. Sarah Kimani",
    facilitator_bio: "Infectious Disease Specialist with 15 years of experience in antimicrobial stewardship",
    is_certified: true,
    available_tickets: 45
  },
  {
    id: 2,
    title: "Medical Laboratory Quality Management Systems",
    description: "An in-depth seminar on implementing and maintaining quality management systems in medical laboratories. This program covers ISO 15189 standards, quality control procedures, and continuous improvement methodologies.",
    date: "2025-07-10",
    time: "08:30:00",
    location: "Kenya Medical Training College, Nairobi",
    price: 0,
    is_free: 1,
    category_id: 2,
    category_name: "Seminar",
    image_url: "/placeholder.svg",
    has_webinar: 1,
    webinar_link: "https://zoom.us/j/example",
    webinar_time: "2025-07-10 09:00:00",
    created_by: "admin@maabara.co.ke",
    created_at: "2025-04-02 11:30:00",
    updated_at: "2025-04-02 11:30:00",
    cpd_points: 3,
    target_audience: "Medical Laboratory Technologists, Laboratory Managers",
    learning_objectives: [
      "Understand ISO 15189 requirements for medical laboratories",
      "Implement effective quality control procedures",
      "Develop strategies for continuous quality improvement"
    ],
    facilitator: "Prof. James Mwangi",
    facilitator_bio: "Laboratory Quality Management Expert and ISO Auditor",
    is_certified: true,
    available_tickets: 60
  },
  {
    id: 3,
    title: "Annual Healthcare Innovation Conference",
    description: "The premier healthcare innovation conference in East Africa, bringing together healthcare professionals, researchers, and technology experts to explore cutting-edge advancements in healthcare delivery and medical technology.",
    date: "2025-08-20",
    time: "08:00:00",
    location: "Kenyatta International Convention Centre, Nairobi",
    price: 5000,
    is_free: 0,
    category_id: 3,
    category_name: "Conference",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2025-04-03 09:15:00",
    updated_at: "2025-04-03 09:15:00",
    cpd_points: 10,
    target_audience: "All Healthcare Professionals",
    learning_objectives: [
      "Explore emerging technologies in healthcare",
      "Network with healthcare innovators and thought leaders",
      "Gain insights into future trends in healthcare delivery"
    ],
    facilitator: "Multiple Speakers",
    sponsors: ["Ministry of Health", "Kenya Medical Association", "Maabara Hub Africa"],
    is_certified: true,
    available_tickets: 200
  },
  {
    id: 4,
    title: "Essential Mental Health Skills for Primary Care Providers",
    description: "This virtual training program equips primary care providers with essential skills for recognizing, assessing, and managing common mental health conditions in primary care settings.",
    date: "2025-09-05",
    time: "14:00:00",
    location: "Virtual Event",
    price: 1500,
    is_free: 0,
    category_id: 4,
    category_name: "Webinar",
    image_url: "/placeholder.svg",
    has_webinar: 1,
    webinar_link: "https://zoom.us/j/mentalhealthtraining",
    webinar_time: "2025-09-05 14:00:00",
    created_by: "admin@maabara.co.ke",
    created_at: "2025-04-04 14:45:00",
    updated_at: "2025-04-04 14:45:00",
    cpd_points: 4,
    target_audience: "Primary Care Physicians, Clinical Officers, Nurses",
    learning_objectives: [
      "Screen and assess common mental health conditions",
      "Implement evidence-based interventions in primary care",
      "Recognize when to refer to specialized mental health services"
    ],
    facilitator: "Dr. Mary Otieno",
    facilitator_bio: "Psychiatrist and Mental Health Integration Specialist",
    is_certified: true,
    available_tickets: 100
  },
  {
    id: 5,
    title: "Advanced Pediatric Life Support (APLS)",
    description: "An intensive training program that provides healthcare professionals with the knowledge and skills needed to recognize and manage critically ill children and prevent cardiopulmonary arrest.",
    date: "2025-10-10",
    time: "08:00:00",
    location: "Aga Khan University Hospital, Nairobi",
    price: 8000,
    is_free: 0,
    category_id: 5,
    category_name: "Training",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2025-04-05 16:30:00",
    updated_at: "2025-04-05 16:30:00",
    cpd_points: 15,
    target_audience: "Pediatricians, Emergency Physicians, Pediatric Nurses",
    learning_objectives: [
      "Recognize and manage critically ill infants and children",
      "Perform pediatric resuscitation procedures effectively",
      "Implement post-resuscitation care and stabilization"
    ],
    facilitator: "Dr. David Njoroge",
    facilitator_bio: "Pediatric Emergency Medicine Specialist and APLS Instructor",
    is_certified: true,
    available_tickets: 30
  },
  {
    id: 6,
    title: "Infection Prevention and Control in Healthcare Settings",
    description: "A comprehensive workshop on implementing effective infection prevention and control measures in healthcare facilities. The program covers standard precautions, transmission-based precautions, and outbreak management strategies.",
    date: "2025-11-15",
    time: "09:00:00",
    location: "Kenyatta National Hospital, Nairobi",
    price: 0,
    is_free: 1,
    category_id: 1,
    category_name: "Workshop",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2025-04-06 11:00:00",
    updated_at: "2025-04-06 11:00:00",
    cpd_points: 6,
    target_audience: "Nurses, Infection Control Practitioners, Healthcare Administrators",
    learning_objectives: [
      "Implement standard precautions in healthcare settings",
      "Apply transmission-based precautions appropriately",
      "Develop effective outbreak management strategies"
    ],
    facilitator: "Dr. Jane Wangari",
    facilitator_bio: "Infection Control Specialist with experience in multiple healthcare settings",
    is_certified: true,
    available_tickets: 75
  }
];

// Mock users
export const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@maabara.co.ke",
    phone: "0700000000",
    role: "admin",
    created_at: "2025-03-01 10:00:00",
    last_login: "2025-04-05 09:15:00"
  },
  {
    id: 2,
    name: "Dr. John Kimani",
    email: "john.kimani@example.com",
    phone: "0712345678",
    role: "attendee",
    created_at: "2025-03-05 11:30:00",
    last_login: "2025-04-01 14:20:00"
  },
  {
    id: 3,
    name: "Jane Muthoni",
    email: "jane.muthoni@example.com",
    phone: "0723456789",
    role: "attendee",
    created_at: "2025-03-10 14:15:00",
    last_login: "2025-04-02 10:10:00"
  }
];

// Mock bookings
export const mockBookings = [
  {
    id: 1,
    event_id: 1,
    user_id: 2,
    customer_name: "Dr. John Kimani",
    customer_email: "john.kimani@example.com",
    customer_phone: "0712345678",
    booking_date: "2025-04-15 09:30:00",
    tickets: 2,
    total_amount: 5000,
    status: "confirmed",
    webinar_access: false,
    attendance_status: "unverified",
    created_at: "2025-04-15 09:30:00"
  },
  {
    id: 2,
    event_id: 2,
    user_id: 3,
    customer_name: "Jane Muthoni",
    customer_email: "jane.muthoni@example.com",
    customer_phone: "0723456789",
    booking_date: "2025-04-16 14:45:00",
    tickets: 1,
    total_amount: 0,
    status: "confirmed",
    webinar_access: true,
    attendance_status: "unverified",
    created_at: "2025-04-16 14:45:00"
  }
];

// Mock payments
export const mockPayments = [
  {
    id: "PAY001",
    booking_id: 1,
    user_id: 2,
    event_id: 1,
    amount: 5000,
    payment_date: "2025-04-15 09:35:00",
    method: "M-Pesa",
    status: "completed",
    transaction_code: "MPE123456789"
  },
  {
    id: "PAY002",
    booking_id: 2,
    user_id: 3,
    event_id: 2,
    amount: 0,
    payment_date: "2025-04-16 14:50:00",
    method: "Free Event",
    status: "completed",
    transaction_code: "FREE001"
  }
];

// Mock activity logs
export const mockActivityLogs = [
  {
    id: 1,
    timestamp: "2025-04-15 09:35:00",
    action: "Payment Received",
    user: "system",
    details: "Payment of KES 5000.00 received for booking #1",
    ip: "127.0.0.1",
    level: "info"
  },
  {
    id: 2,
    timestamp: "2025-04-15 10:00:00",
    action: "User Login",
    user: "admin@maabara.co.ke",
    details: "Admin user logged in",
    ip: "127.0.0.1",
    level: "info"
  },
  {
    id: 3,
    timestamp: "2025-04-16 14:50:00",
    action: "Booking Confirmed",
    user: "system",
    details: "Free booking confirmed for user jane.muthoni@example.com, event #2",
    ip: "127.0.0.1",
    level: "info"
  }
];

// Function to get mock data based on entity type
export const getMockData = (entity: string) => {
  switch (entity.toLowerCase()) {
    case 'events':
      return mockEvents;
    case 'categories':
      return mockCategories;
    case 'users':
      return mockUsers;
    case 'bookings':
      return mockBookings;
    case 'payments':
      return mockPayments;
    case 'activity_logs':
      return mockActivityLogs;
    default:
      return [];
  }
};

export default {
  mockEvents,
  mockCategories,
  mockUsers,
  mockBookings,
  mockPayments,
  mockActivityLogs,
  getMockData
};
