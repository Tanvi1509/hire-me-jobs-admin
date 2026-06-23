export const statsData = {
  totalJobs: 1284,
  activeJobs: 847,
  totalApplications: 15640,
  pendingReview: 342,
  totalCandidates: 9821,
  totalCompanies: 216,
  hiredThisMonth: 128,
  interviewsToday: 34,
};

export const jobsData = [
  { id: 1, title: 'Senior React Developer', company: 'TechNova Inc.', location: 'San Francisco, CA', type: 'Full-time', salary: '$120k–$150k', applications: 84, status: 'Active', posted: '2024-06-01', category: 'Engineering' },
  { id: 2, title: 'Product Designer', company: 'Designly', location: 'Remote', type: 'Full-time', salary: '$90k–$115k', applications: 61, status: 'Active', posted: '2024-06-03', category: 'Design' },
  { id: 3, title: 'Data Scientist', company: 'DataStream', location: 'New York, NY', type: 'Full-time', salary: '$130k–$160k', applications: 47, status: 'Active', posted: '2024-06-05', category: 'Data' },
  { id: 4, title: 'Marketing Manager', company: 'GrowthLab', location: 'Austin, TX', type: 'Full-time', salary: '$80k–$100k', applications: 102, status: 'Closed', posted: '2024-05-20', category: 'Marketing' },
  { id: 5, title: 'DevOps Engineer', company: 'CloudBase', location: 'Seattle, WA', type: 'Full-time', salary: '$125k–$145k', applications: 38, status: 'Active', posted: '2024-06-07', category: 'Engineering' },
  { id: 6, title: 'Content Writer', company: 'MediaForge', location: 'Remote', type: 'Part-time', salary: '$40k–$55k', applications: 76, status: 'Active', posted: '2024-06-08', category: 'Content' },
  { id: 7, title: 'iOS Developer', company: 'AppWorks', location: 'Los Angeles, CA', type: 'Full-time', salary: '$115k–$140k', applications: 29, status: 'Draft', posted: '2024-06-10', category: 'Engineering' },
  { id: 8, title: 'HR Business Partner', company: 'PeopleFirst', location: 'Chicago, IL', type: 'Full-time', salary: '$70k–$90k', applications: 55, status: 'Active', posted: '2024-06-11', category: 'HR' },
  { id: 9, title: 'Backend Engineer (Node.js)', company: 'ServerStack', location: 'Boston, MA', type: 'Full-time', salary: '$110k–$135k', applications: 43, status: 'Active', posted: '2024-06-12', category: 'Engineering' },
  { id: 10, title: 'UX Researcher', company: 'Insightful', location: 'Remote', type: 'Contract', salary: '$75/hr', applications: 19, status: 'Active', posted: '2024-06-13', category: 'Design' },
];

export const applicationsData = [
  { id: 1, name: 'Jordan Lee', job: 'Senior React Developer', company: 'TechNova Inc.', applied: '2024-06-10', status: 'Interview', score: 92, avatar: null },
  { id: 2, name: 'Priya Sharma', job: 'Product Designer', company: 'Designly', applied: '2024-06-11', status: 'Shortlisted', score: 88, avatar: null },
  { id: 3, name: 'Marcus Chen', job: 'Data Scientist', company: 'DataStream', applied: '2024-06-12', status: 'Pending', score: 75, avatar: null },
  { id: 4, name: 'Elena Rossi', job: 'DevOps Engineer', company: 'CloudBase', applied: '2024-06-12', status: 'Rejected', score: 61, avatar: null },
  { id: 5, name: 'Aiden Walsh', job: 'Backend Engineer', company: 'ServerStack', applied: '2024-06-13', status: 'Pending', score: 83, avatar: null },
  { id: 6, name: 'Lena Kovacs', job: 'UX Researcher', company: 'Insightful', applied: '2024-06-13', status: 'Hired', score: 96, avatar: null },
  { id: 7, name: 'David Kim', job: 'iOS Developer', company: 'AppWorks', applied: '2024-06-14', status: 'Shortlisted', score: 79, avatar: null },
  { id: 8, name: 'Sarah O\'Brien', job: 'Marketing Manager', company: 'GrowthLab', applied: '2024-06-14', status: 'Interview', score: 85, avatar: null },
  { id: 9, name: 'Raj Patel', job: 'Content Writer', company: 'MediaForge', applied: '2024-06-15', status: 'Pending', score: 70, avatar: null },
  { id: 10, name: 'Nina Torres', job: 'HR Business Partner', company: 'PeopleFirst', applied: '2024-06-15', status: 'Shortlisted', score: 80, avatar: null },
];

export const companiesData = [
  { id: 1, name: 'TechNova Inc.', industry: 'Technology', location: 'San Francisco, CA', employees: '500–1000', activeJobs: 12, totalHires: 34, status: 'Verified', joined: '2023-01-15' },
  { id: 2, name: 'Designly', industry: 'Design', location: 'Remote', employees: '50–200', activeJobs: 5, totalHires: 12, status: 'Verified', joined: '2023-03-22' },
  { id: 3, name: 'DataStream', industry: 'Analytics', location: 'New York, NY', employees: '200–500', activeJobs: 8, totalHires: 19, status: 'Verified', joined: '2023-02-10' },
  { id: 4, name: 'GrowthLab', industry: 'Marketing', location: 'Austin, TX', employees: '100–200', activeJobs: 3, totalHires: 8, status: 'Pending', joined: '2024-01-05' },
  { id: 5, name: 'CloudBase', industry: 'Cloud Computing', location: 'Seattle, WA', employees: '1000+', activeJobs: 20, totalHires: 56, status: 'Verified', joined: '2022-11-01' },
  { id: 6, name: 'MediaForge', industry: 'Media', location: 'Remote', employees: '10–50', activeJobs: 4, totalHires: 6, status: 'Verified', joined: '2023-07-18' },
  { id: 7, name: 'AppWorks', industry: 'Mobile', location: 'Los Angeles, CA', employees: '50–200', activeJobs: 6, totalHires: 14, status: 'Suspended', joined: '2023-05-20' },
  { id: 8, name: 'ServerStack', industry: 'Technology', location: 'Boston, MA', employees: '200–500', activeJobs: 9, totalHires: 22, status: 'Verified', joined: '2023-04-12' },
];

export const candidatesData = [
  { id: 1, name: 'Jordan Lee', email: 'jordan@example.com', title: 'Senior Developer', location: 'San Francisco, CA', experience: '7 years', skills: ['React', 'Node.js', 'TypeScript'], status: 'Active', applications: 3, joined: '2024-01-10' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', title: 'UX Designer', location: 'Remote', experience: '5 years', skills: ['Figma', 'UX Research', 'Prototyping'], status: 'Active', applications: 2, joined: '2024-02-14' },
  { id: 3, name: 'Marcus Chen', email: 'marcus@example.com', title: 'Data Scientist', location: 'New York, NY', experience: '4 years', skills: ['Python', 'ML', 'SQL'], status: 'Active', applications: 1, joined: '2024-03-05' },
  { id: 4, name: 'Elena Rossi', email: 'elena@example.com', title: 'DevOps Engineer', location: 'Seattle, WA', experience: '6 years', skills: ['AWS', 'Docker', 'Kubernetes'], status: 'Inactive', applications: 4, joined: '2023-11-20' },
  { id: 5, name: 'Aiden Walsh', email: 'aiden@example.com', title: 'Backend Engineer', location: 'Boston, MA', experience: '3 years', skills: ['Node.js', 'PostgreSQL', 'Redis'], status: 'Active', applications: 2, joined: '2024-04-01' },
  { id: 6, name: 'Lena Kovacs', email: 'lena@example.com', title: 'UX Researcher', location: 'Remote', experience: '8 years', skills: ['User Testing', 'Analytics', 'Figma'], status: 'Active', applications: 1, joined: '2024-01-25' },
  { id: 7, name: 'David Kim', email: 'david@example.com', title: 'iOS Developer', location: 'Los Angeles, CA', experience: '5 years', skills: ['Swift', 'SwiftUI', 'Objective-C'], status: 'Active', applications: 1, joined: '2024-05-10' },
  { id: 8, name: 'Sarah O\'Brien', email: 'sarah@example.com', title: 'Marketing Lead', location: 'Chicago, IL', experience: '9 years', skills: ['SEO', 'Content', 'Analytics'], status: 'Active', applications: 2, joined: '2023-10-15' },
];

export const chartApplicationsData = [
  { month: 'Jan', applications: 480, hired: 52 },
  { month: 'Feb', applications: 620, hired: 71 },
  { month: 'Mar', applications: 710, hired: 88 },
  { month: 'Apr', applications: 890, hired: 102 },
  { month: 'May', applications: 1050, hired: 115 },
  { month: 'Jun', applications: 1240, hired: 128 },
];

export const jobCategoryData = [
  { name: 'Engineering', value: 38, color: '#3b82f6' },
  { name: 'Design', value: 18, color: '#8b5cf6' },
  { name: 'Marketing', value: 14, color: '#f59e0b' },
  { name: 'Data', value: 12, color: '#10b981' },
  { name: 'HR', value: 10, color: '#ef4444' },
  { name: 'Content', value: 8, color: '#06b6d4' },
];

export const recentActivities = [
  { id: 1, type: 'application', message: 'Jordan Lee applied for Senior React Developer', time: '5 min ago', color: 'blue' },
  { id: 2, type: 'hired', message: 'Lena Kovacs was hired at Insightful', time: '18 min ago', color: 'green' },
  { id: 3, type: 'company', message: 'GrowthLab submitted company verification', time: '45 min ago', color: 'yellow' },
  { id: 4, type: 'job', message: 'New job posted: iOS Developer at AppWorks', time: '1h ago', color: 'purple' },
  { id: 5, type: 'interview', message: 'Interview scheduled with Sarah O\'Brien', time: '2h ago', color: 'cyan' },
  { id: 6, type: 'rejected', message: 'Elena Rossi application rejected at CloudBase', time: '3h ago', color: 'red' },
];
