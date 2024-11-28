const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Path to the jobs.json file
const jobsFilePath = path.join(__dirname, "data", "jobs.json");

// Function to read all jobs
const getJobsData = () => {
  try {
    const data = fs.readFileSync(jobsFilePath, 'utf8');
    return JSON.parse(data); // Parse the data into an array
  } catch (error) {
    console.error("Error reading jobs file:", error);
    return [];
  }
};

// Get all jobs
app.get("/api/jobs", (req, res) => {
  const jobs = getJobsData();
  res.json(jobs);
});

// Get a single job by ID
app.get("/api/jobs/:id", (req, res) => {
  const jobs = getJobsData();
  const job = jobs.find((job) => job.id === req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.json(job);
});

// Add a job
app.post("/api/jobs", (req, res) => {
  const jobs = getJobsData();
  const newJob = { id: Date.now().toString(), ...req.body };
  jobs.push(newJob);
  fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2));
  res.status(201).json(newJob);
});

// Update a job
app.put("/api/jobs/:id", (req, res) => {
  const jobs = getJobsData();
  const jobIndex = jobs.findIndex((job) => job.id === req.params.id);

  if (jobIndex === -1)
    return res.status(404).json({ message: "Job not found" });

  jobs[jobIndex] = { ...jobs[jobIndex], ...req.body };
  fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2));
  res.json(jobs[jobIndex]);
});

// Delete a job
app.delete("/api/jobs/:id", (req, res) => {
  const jobs = getJobsData();
  const updatedJobs = jobs.filter((job) => job.id !== req.params.id);

  if (jobs.length === updatedJobs.length)
    return res.status(404).json({ message: "Job not found" });

  fs.writeFileSync(jobsFilePath, JSON.stringify(updatedJobs, null, 2));
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
