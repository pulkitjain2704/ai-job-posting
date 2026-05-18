// Static library of common Indian SME job templates.
// Used for job suggestion cards when the recruiter types a vague role.

export const JOB_TEMPLATES = [
  // ── Sales & Business ──────────────────────────────────────────────────────
  {
    id: 'sales-executive',
    title: 'Sales Executive',
    category: 'Sales',
    mandatorySkills: ['Sales', 'Communication', 'Client Handling', 'Target Achievement'],
    optionalSkills: ['Lead Generation', 'CRM Software'],
    qualification: 'Graduate',
    industry: ['FMCG', 'Retail', 'Distribution'],
    keywords: ['sales', 'sell', 'executive', 'bde', 'business', 'development'],
  },
  {
    id: 'sales-manager',
    title: 'Sales Manager',
    category: 'Sales',
    mandatorySkills: ['Sales', 'Team Handling', 'Target Achievement', 'Client Handling'],
    optionalSkills: ['CRM Software', 'B2B Sales', 'Lead Generation'],
    qualification: 'Graduate',
    industry: ['FMCG', 'Retail', 'Distribution'],
    keywords: ['sales', 'manager', 'team', 'business', 'revenue'],
  },
  {
    id: 'bde',
    title: 'Business Development Executive',
    category: 'Sales',
    mandatorySkills: ['Business Development', 'Lead Generation', 'Communication', 'Client Handling'],
    optionalSkills: ['CRM Software', 'Cold Calling', 'Negotiation'],
    qualification: 'Graduate',
    industry: ['IT Services', 'Consulting', 'Finance'],
    keywords: ['bde', 'business', 'development', 'executive', 'bd'],
  },
  {
    id: 'telecaller',
    title: 'Telecaller',
    category: 'Sales',
    mandatorySkills: ['Communication', 'Cold Calling', 'Customer Handling', 'Convincing Skills'],
    optionalSkills: ['CRM Software', 'Data Entry'],
    qualification: '12th',
    industry: ['Banking', 'Insurance', 'Telecom'],
    keywords: ['tele', 'caller', 'call', 'telecalling', 'bpo', 'inbound', 'outbound'],
  },
  {
    id: 'field-sales',
    title: 'Field Sales Officer',
    category: 'Sales',
    mandatorySkills: ['Field Sales', 'Client Visit', 'Target Achievement', 'Communication'],
    optionalSkills: ['Two-Wheeler', 'Route Planning'],
    qualification: '12th',
    industry: ['FMCG', 'Pharma', 'Distribution'],
    keywords: ['field', 'sales', 'officer', 'fso', 'territory', 'area'],
  },

  // ── Finance & Accounting ──────────────────────────────────────────────────
  {
    id: 'accountant',
    title: 'Accountant',
    category: 'Finance',
    mandatorySkills: ['Tally', 'Excel', 'GST', 'Accounting'],
    optionalSkills: ['TDS', 'Invoicing', 'Bank Reconciliation'],
    qualification: 'Graduate',
    industry: ['Manufacturing', 'Retail', 'Trading'],
    keywords: ['account', 'accountant', 'finance', 'tally', 'gst', 'billing'],
  },
  {
    id: 'finance-executive',
    title: 'Finance Executive',
    category: 'Finance',
    mandatorySkills: ['Excel', 'Financial Reporting', 'Accounting', 'MIS Reports'],
    optionalSkills: ['Tally', 'SAP', 'Budget Planning'],
    qualification: 'Graduate',
    industry: ['Banking', 'Finance', 'Corporate'],
    keywords: ['finance', 'executive', 'financial', 'accounts', 'mba'],
  },

  // ── Technology ────────────────────────────────────────────────────────────
  {
    id: 'java-developer',
    title: 'Java Developer',
    category: 'Technology',
    mandatorySkills: ['Java', 'Spring Boot', 'REST APIs', 'SQL'],
    optionalSkills: ['Microservices', 'AWS', 'Docker'],
    qualification: 'B.Tech / BE',
    industry: ['IT Services', 'Software Development', 'Product'],
    keywords: ['java', 'developer', 'backend', 'j2ee', 'spring'],
  },
  {
    id: 'fullstack-developer',
    title: 'Full Stack Developer',
    category: 'Technology',
    mandatorySkills: ['React', 'Node.js', 'JavaScript', 'SQL'],
    optionalSkills: ['MongoDB', 'AWS', 'Docker'],
    qualification: 'B.Tech / BE',
    industry: ['IT Services', 'Software Development', 'Startup'],
    keywords: ['fullstack', 'full stack', 'full-stack', 'developer', 'react', 'node'],
  },
  {
    id: 'python-developer',
    title: 'Python Developer',
    category: 'Technology',
    mandatorySkills: ['Python', 'Django/Flask', 'REST APIs', 'SQL'],
    optionalSkills: ['Machine Learning', 'AWS', 'Docker'],
    qualification: 'B.Tech / BE',
    industry: ['IT Services', 'Software Development', 'Fintech'],
    keywords: ['python', 'developer', 'django', 'flask', 'backend'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Technology',
    mandatorySkills: ['Excel', 'SQL', 'Data Analysis', 'Power BI / Tableau'],
    optionalSkills: ['Python', 'R', 'Google Analytics'],
    qualification: 'B.Tech / BE',
    industry: ['IT Services', 'E-commerce', 'Finance'],
    keywords: ['data', 'analyst', 'analysis', 'analytics', 'bi', 'reporting'],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Executive',
    category: 'Marketing',
    mandatorySkills: ['Social Media Marketing', 'Google Ads', 'SEO', 'Content Writing'],
    optionalSkills: ['Meta Ads', 'Email Marketing', 'Canva'],
    qualification: 'Graduate',
    industry: ['E-commerce', 'Retail', 'EdTech'],
    keywords: ['digital', 'marketing', 'social media', 'seo', 'ads', 'google'],
  },

  // ── HR & Admin ────────────────────────────────────────────────────────────
  {
    id: 'hr-executive',
    title: 'HR Executive',
    category: 'HR',
    mandatorySkills: ['Recruitment', 'HR Policies', 'Onboarding', 'MS Office'],
    optionalSkills: ['Payroll', 'HRMS', 'Labour Laws'],
    qualification: 'Graduate',
    industry: ['IT Services', 'Manufacturing', 'Retail'],
    keywords: ['hr', 'human resource', 'recruitment', 'recruiter', 'talent'],
  },
  {
    id: 'receptionist',
    title: 'Receptionist',
    category: 'Admin',
    mandatorySkills: ['English Communication', 'MS Office', 'Customer Handling', 'Front Desk'],
    optionalSkills: ['Scheduling', 'Data Entry'],
    qualification: '12th',
    industry: ['Healthcare', 'Hospitality', 'Corporate'],
    keywords: ['receptionist', 'front desk', 'front office', 'admin', 'office'],
  },
  {
    id: 'admin-executive',
    title: 'Admin Executive',
    category: 'Admin',
    mandatorySkills: ['MS Office', 'Communication', 'Office Management', 'Coordination'],
    optionalSkills: ['Vendor Management', 'Data Entry', 'Scheduling'],
    qualification: 'Graduate',
    industry: ['Corporate', 'Manufacturing', 'IT Services'],
    keywords: ['admin', 'administration', 'executive', 'office', 'coordinator'],
  },

  // ── Operations ────────────────────────────────────────────────────────────
  {
    id: 'operations-executive',
    title: 'Operations Executive',
    category: 'Operations',
    mandatorySkills: ['Operations Management', 'Coordination', 'Excel', 'Problem Solving'],
    optionalSkills: ['ERP Software', 'Process Improvement'],
    qualification: 'Graduate',
    industry: ['E-commerce', 'Logistics', 'Manufacturing'],
    keywords: ['operations', 'ops', 'executive', 'coordinator', 'process'],
  },
  {
    id: 'store-manager',
    title: 'Store Manager',
    category: 'Retail',
    mandatorySkills: ['Inventory Management', 'Team Handling', 'Customer Service', 'Cash Management'],
    optionalSkills: ['Visual Merchandising', 'POS Software'],
    qualification: '12th',
    industry: ['Retail', 'FMCG', 'Apparel'],
    keywords: ['store', 'shop', 'manager', 'retail', 'outlet', 'showroom'],
  },
  {
    id: 'warehouse-executive',
    title: 'Warehouse Executive',
    category: 'Operations',
    mandatorySkills: ['Inventory Management', 'Stock Management', 'MS Excel', 'Dispatch'],
    optionalSkills: ['WMS Software', 'Forklift Operation'],
    qualification: '12th',
    industry: ['Logistics', 'E-commerce', 'Manufacturing'],
    keywords: ['warehouse', 'store', 'inventory', 'stock', 'godown', 'logistics'],
  },

  // ── Customer Support ──────────────────────────────────────────────────────
  {
    id: 'customer-support',
    title: 'Customer Support Executive',
    category: 'Support',
    mandatorySkills: ['Communication', 'Customer Handling', 'Problem Solving', 'Email & Chat Support'],
    optionalSkills: ['CRM Software', 'Ticketing Tools'],
    qualification: '12th',
    industry: ['E-commerce', 'Telecom', 'Banking'],
    keywords: ['customer', 'support', 'service', 'helpdesk', 'care', 'cs'],
  },

  // ── Blue Collar ───────────────────────────────────────────────────────────
  {
    id: 'driver',
    title: 'Driver',
    category: 'Driver',
    mandatorySkills: ['Valid Driving License', 'Vehicle Knowledge', 'Route Navigation'],
    optionalSkills: ['Heavy Vehicle', 'GPS Navigation'],
    qualification: '10th',
    industry: ['Logistics', 'Corporate', 'Transport'],
    keywords: ['driver', 'drive', 'chauffeur', 'vehicle', 'car', 'transport'],
  },
  {
    id: 'delivery-executive',
    title: 'Delivery Executive',
    category: 'Delivery',
    mandatorySkills: ['Bike Riding', 'Route Knowledge', 'Smartphone Literacy', 'Valid License'],
    optionalSkills: ['App Navigation', 'Customer Interaction'],
    qualification: '10th',
    industry: ['E-commerce', 'Food Delivery', 'Logistics'],
    keywords: ['delivery', 'boy', 'executive', 'rider', 'courier', 'last mile'],
  },
  {
    id: 'security-guard',
    title: 'Security Guard',
    category: 'Security',
    mandatorySkills: ['Physical Fitness', 'Vigilance', 'Punctuality', 'Patrolling'],
    optionalSkills: ['CCTV Monitoring', 'First Aid'],
    qualification: '10th',
    industry: ['Real Estate', 'Corporate', 'Manufacturing'],
    keywords: ['security', 'guard', 'watchman', 'gateman', 'bouncer'],
  },
  {
    id: 'cook',
    title: 'Cook / Chef',
    category: 'Kitchen',
    mandatorySkills: ['Cooking', 'Kitchen Management', 'Food Safety & Hygiene', 'Meal Planning'],
    optionalSkills: ['Baking', 'North Indian Cuisine', 'South Indian Cuisine'],
    qualification: 'Any',
    industry: ['Hospitality', 'Restaurant', 'Corporate Catering'],
    keywords: ['cook', 'chef', 'kitchen', 'food', 'catering', 'hotel'],
  },
  {
    id: 'electrician',
    title: 'Electrician / Technician',
    category: 'Technical',
    mandatorySkills: ['Electrical Work', 'Wiring', 'Troubleshooting', 'Safety Compliance'],
    optionalSkills: ['Panel Work', 'AC Servicing', 'PLC'],
    qualification: 'Diploma',
    industry: ['Manufacturing', 'Construction', 'Real Estate'],
    keywords: ['electrician', 'electric', 'technician', 'iti', 'wiring', 'fitter'],
  },
];

// Returns the best matching templates for a list of suggested titles from Claude
export function getTemplatesByTitles(titles) {
  if (!titles?.length) return [];
  return titles
    .map((title) =>
      JOB_TEMPLATES.find(
        (t) => t.title.toLowerCase() === title.toLowerCase()
      ) || JOB_TEMPLATES.find(
        (t) => t.title.toLowerCase().includes(title.toLowerCase()) ||
               title.toLowerCase().includes(t.title.toLowerCase())
      )
    )
    .filter(Boolean)
    .slice(0, 4);
}

// All template titles — injected into system prompt so Claude picks from this exact list
export const TEMPLATE_TITLES = JOB_TEMPLATES.map((t) => t.title);
