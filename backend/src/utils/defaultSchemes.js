const defaultSchemes = [
  {
    schemeName: "National Means-cum-Merit Scholarship",
    ministry: "Ministry of Education",
    lifeEvent: "Education",
    eligibility: [
      { label: "maxIncome", value: "350000" },
      { label: "minAge", value: "13" }
    ],
    benefitDetails: "Financial assistance for meritorious students from economically weaker families.",
    benefitType: "Scholarship",
    officialUrl: "https://scholarships.gov.in",
    status: "Active"
  },
  {
    schemeName: "Central Sector Scheme of Scholarships for College and University Students",
    ministry: "Department of Higher Education",
    lifeEvent: "Education",
    eligibility: [
      { label: "maxIncome", value: "450000" },
      { label: "minAge", value: "17" }
    ],
    benefitDetails: "Scholarship support for meritorious students pursuing higher education after Class 12.",
    benefitType: "Scholarship",
    officialUrl: "https://scholarships.gov.in",
    status: "Active"
  },
  {
    schemeName: "Pre-Matric Scholarship for Students from Minority Communities",
    ministry: "Ministry of Minority Affairs",
    lifeEvent: "Education",
    eligibility: [
      { label: "maxIncome", value: "100000" },
      { label: "minAge", value: "11" }
    ],
    benefitDetails: "Financial support to school students from minority communities to reduce dropout rates.",
    benefitType: "Scholarship",
    officialUrl: "https://scholarships.gov.in",
    status: "Active"
  },
  {
    schemeName: "Prime Minister Employment Generation Programme",
    ministry: "Ministry of MSME",
    lifeEvent: "Employment",
    eligibility: [
      { label: "minAge", value: "18" },
      { label: "occupation", value: "self-employed" }
    ],
    benefitDetails: "Credit-linked subsidy support for generating self-employment opportunities.",
    benefitType: "Subsidy",
    officialUrl: "https://www.kviconline.gov.in/pmegpeportal",
    status: "Active"
  },
  {
    schemeName: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
    ministry: "Ministry of Rural Development",
    lifeEvent: "Employment",
    eligibility: [
      { label: "minAge", value: "15" },
      { label: "maxAge", value: "35" }
    ],
    benefitDetails: "Skill training and placement support for rural youth from poor households.",
    benefitType: "Skill Development",
    officialUrl: "https://ddugky.gov.in",
    status: "Active"
  },
  {
    schemeName: "Pradhan Mantri Kaushal Vikas Yojana",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    lifeEvent: "Employment",
    eligibility: [
      { label: "minAge", value: "18" }
    ],
    benefitDetails: "Industry-relevant skill training and certification to improve employability.",
    benefitType: "Training",
    officialUrl: "https://www.pmkvyofficial.org",
    status: "Active"
  },
  {
    schemeName: "Mukhyamantri Kanya Vivah Yojana",
    ministry: "Department of Social Justice",
    lifeEvent: "Marriage",
    eligibility: [
      { label: "maxIncome", value: "250000" },
      { label: "minAge", value: "18" }
    ],
    benefitDetails: "One-time financial assistance for eligible women at the time of marriage.",
    benefitType: "Direct Benefit Transfer",
    officialUrl: "https://serviceonline.gov.in",
    status: "Active"
  },
  {
    schemeName: "Chief Minister Kanya Utthan Yojana",
    ministry: "Department of Education",
    lifeEvent: "Marriage",
    eligibility: [
      { label: "maxIncome", value: "300000" },
      { label: "minAge", value: "18" }
    ],
    benefitDetails: "Financial assistance to encourage education and social security for eligible women.",
    benefitType: "Direct Benefit Transfer",
    officialUrl: "https://medhasoft.bih.nic.in",
    status: "Active"
  },
  {
    schemeName: "Inter-Caste Marriage Scheme",
    ministry: "Ministry of Social Justice and Empowerment",
    lifeEvent: "Marriage",
    eligibility: [
      { label: "minAge", value: "18" }
    ],
    benefitDetails: "Incentive support for eligible inter-caste marriages to promote social inclusion.",
    benefitType: "Incentive",
    officialUrl: "https://socialjustice.gov.in",
    status: "Active"
  },
  {
    schemeName: "Stand-Up India",
    ministry: "Department of Financial Services",
    lifeEvent: "Business",
    eligibility: [
      { label: "minAge", value: "18" }
    ],
    benefitDetails: "Bank loans for greenfield enterprises by women and SC/ST entrepreneurs.",
    benefitType: "Loan",
    officialUrl: "https://www.standupmitra.in",
    status: "Active"
  },
  {
    schemeName: "Pradhan Mantri MUDRA Yojana",
    ministry: "Ministry of Finance",
    lifeEvent: "Business",
    eligibility: [
      { label: "minAge", value: "18" }
    ],
    benefitDetails: "Collateral-free loans for micro and small business activities under Shishu, Kishor, and Tarun categories.",
    benefitType: "Loan",
    officialUrl: "https://www.mudra.org.in",
    status: "Active"
  },
  {
    schemeName: "Credit Guarantee Fund Trust for Micro and Small Enterprises",
    ministry: "Ministry of MSME",
    lifeEvent: "Business",
    eligibility: [
      { label: "minAge", value: "18" }
    ],
    benefitDetails: "Credit guarantee cover to support collateral-free loans for micro and small enterprises.",
    benefitType: "Credit Guarantee",
    officialUrl: "https://www.cgtmse.in",
    status: "Active"
  },
  {
    schemeName: "Atal Pension Yojana",
    ministry: "Ministry of Finance",
    lifeEvent: "Retirement",
    eligibility: [
      { label: "minAge", value: "18" },
      { label: "maxAge", value: "40" }
    ],
    benefitDetails: "Guaranteed pension support for workers in the unorganized sector.",
    benefitType: "Pension",
    officialUrl: "https://www.npscra.nsdl.co.in/scheme-details.php",
    status: "Active"
  },
  {
    schemeName: "Pradhan Mantri Matru Vandana Yojana",
    ministry: "Ministry of Women and Child Development",
    lifeEvent: "Pregnancy",
    eligibility: [
      { label: "minAge", value: "16" },
      { label: "maxIncome", value: "800000" }
    ],
    benefitDetails: "Maternity benefit support for eligible pregnant and lactating mothers for the first live birth.",
    benefitType: "Cash Assistance",
    officialUrl: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
    status: "Active"
  },
  {
    schemeName: "Janani Suraksha Yojana",
    ministry: "Ministry of Health and Family Welfare",
    lifeEvent: "Pregnancy",
    eligibility: [
      { label: "minAge", value: "16" }
    ],
    benefitDetails: "Safe motherhood intervention scheme that promotes institutional delivery through cash assistance.",
    benefitType: "Health Benefit",
    officialUrl: "https://nhm.gov.in",
    status: "Active"
  },
  {
    schemeName: "Janani Shishu Suraksha Karyakram",
    ministry: "Ministry of Health and Family Welfare",
    lifeEvent: "Pregnancy",
    eligibility: [
      { label: "minAge", value: "15" }
    ],
    benefitDetails: "Free delivery, C-section, diagnostics, medicines, diet, and transport support for pregnant women in public health institutions.",
    benefitType: "Healthcare Support",
    officialUrl: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
    status: "Active"
  },
  {
    schemeName: "RKSK Adolescent Maternal Health Support",
    ministry: "Ministry of Health and Family Welfare",
    lifeEvent: "Pregnancy",
    eligibility: [
      { label: "minAge", value: "14" },
      { label: "maxAge", value: "19" }
    ],
    benefitDetails: "Referral, counselling, nutrition guidance, and maternal health support intended for adolescent and teenage pregnancy care.",
    benefitType: "Healthcare Support",
    officialUrl: "https://nhm.gov.in",
    status: "Active"
  },
  {
    schemeName: "Pradhan Mantri Vaya Vandana Yojana",
    ministry: "Ministry of Finance",
    lifeEvent: "Retirement",
    eligibility: [
      { label: "minAge", value: "60" }
    ],
    benefitDetails: "Pension-oriented insurance scheme providing assured returns for senior citizens.",
    benefitType: "Pension",
    officialUrl: "https://licindia.in",
    status: "Active"
  },
  {
    schemeName: "Senior Citizens Savings Scheme",
    ministry: "Ministry of Finance",
    lifeEvent: "Retirement",
    eligibility: [
      { label: "minAge", value: "60" }
    ],
    benefitDetails: "Government-backed small savings scheme offering regular income after retirement.",
    benefitType: "Savings",
    officialUrl: "https://www.indiapost.gov.in",
    status: "Active"
  }
];

export default defaultSchemes;
