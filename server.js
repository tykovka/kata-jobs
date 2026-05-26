const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const jobsData = require('./data.json');

app.use(cors());

let jobsDatabase = [...jobsData];

app.get('/api/jobs', (req, res) => {
  let jobs = [...jobsDatabase];
  
  const search = req.query.search;
  if (search) {
    const searchLower = search.toLowerCase();
    jobs = jobs.filter(job => 
      job.company_name.toLowerCase().includes(searchLower) || 
      job.name.toLowerCase().includes(searchLower)
    );
  }
  
  const skillsParam = req.query.skills;
  if (skillsParam) {
    const skillWords = skillsParam.split(',').map(s => s.trim().toLowerCase());
    jobs = jobs.filter(job => {
      const jobSkillsLower = job.skills.toLowerCase();
      return skillWords.some(skillWord => jobSkillsLower.includes(skillWord));
    });
  }
  
  const space = req.query.space;
  if (space) {
    jobs = jobs.filter(job => job.space.toLowerCase() === space.toLowerCase());
  }
  
  const city = req.query.city;
  if (city) {
    jobs = jobs.filter(job => job.city.toLowerCase() === city.toLowerCase());
  }
  
  const minSalary = req.query.minSalary;
  const maxSalary = req.query.maxSalary;
  if (minSalary) {
    jobs = jobs.filter(job => parseInt(job.salary) >= parseInt(minSalary));
  }
  if (maxSalary) {
    jobs = jobs.filter(job => parseInt(job.salary) <= parseInt(maxSalary));
  }
  
  const sortBy = req.query.sortBy;
  if (sortBy) {
    switch(sortBy) {
      case 'salary_asc': jobs.sort((a, b) => parseInt(a.salary) - parseInt(b.salary)); break;
      case 'salary_desc': jobs.sort((a, b) => parseInt(b.salary) - parseInt(a.salary)); break;
      case 'date_asc': jobs.sort((a, b) => new Date(a.published_at) - new Date(b.published_at)); break;
      case 'date_desc': jobs.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)); break;
    }
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedJobs = jobs.slice(startIndex, endIndex);
  
  const jobsList = paginatedJobs.map(job => ({
    id: job.id,
    company_name: job.company_name,
    name: job.name,
    city: job.city,
    salary: job.salary,
    published_at: job.published_at,
    short_description: job.short_description,
    space: job.space,
    skills: job.skills
  }));
  
  res.json({
    success: true,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(jobs.length / limit),
      totalItems: jobs.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < jobs.length,
      hasPrevPage: startIndex > 0
    },
    jobs: jobsList
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const job = jobsDatabase.find(j => j.id === id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Вакансия не найдена',
      message: `Вакансия с ID ${id} не существует`
    });
  }
  
  res.json({
    success: true,
    job: {
      id: job.id,
      published_at: job.published_at,
      company_name: job.company_name,
      name: job.name,
      city: job.city,
      salary: job.salary,
      skills: job.skills,
      short_description: job.short_description,
      description: job.description,
      space: job.space,
      about_company: job.about_company
    }
  });
});

app.get('/api/cities', (req, res) => {
  const cities = [...new Set(jobsDatabase.map(job => job.city))].sort();
  res.json({ success: true, cities });
});

app.get('/api/spaces', (req, res) => {
  const spaces = [...new Set(jobsDatabase.map(job => job.space))].sort();
  res.json({ success: true, spaces });
});

app.get('/', (req, res) => {
  res.send('Job Server is running! Use /api/jobs to get vacancies.');
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📋 Вакансии: http://localhost:${PORT}/api/jobs`);
  console.log(`📄 Детально: http://localhost:${PORT}/api/jobs/1`);
});
