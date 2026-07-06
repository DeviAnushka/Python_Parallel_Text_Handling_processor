# Python Parallel Text Handling Processor

A full-stack web application designed to efficiently process and analyze large-scale textual datasets using parallel processing techniques. The system enables users to upload text datasets, perform multiple Natural Language Processing (NLP) operations, generate analytical reports, and maintain searchable records through an interactive dashboard.

---

## Project Overview

The Python Parallel Text Handling Processor is developed to improve the efficiency of large-scale text processing by leveraging Python's parallel processing capabilities. The application performs multiple text analysis operations such as sentiment analysis, pattern matching, search indexing, and report generation while providing a user-friendly web interface.

The system integrates secure authentication, database management, email notifications, and scalable text processing to simplify analytical workflows for researchers, analysts, and organizations handling textual datasets.

---

## Objectives

- Develop an efficient parallel text processing system.
- Perform sentiment analysis using rule-based techniques.
- Provide fast and searchable indexing of processed data.
- Generate downloadable reports and email summaries.
- Store processed information in a structured database.
- Improve text processing performance for large datasets.

---

## Features

### User Management
- User Registration
- Secure Login Authentication
- Session Management

### Text Processing
- Upload CSV/Text datasets
- Parallel text processing
- Rule-based sentiment analysis
- Pattern matching
- Batch text analysis

### Search & Reports
- Search processed records
- Analysis history
- Inbox notifications
- Email report generation
- CSV report generation

### Database Management
- SQLite database integration
- Search indexing
- Activity history storage
- Efficient retrieval of processed records

---

## System Architecture

```
                    User
                      │
                      ▼
              Next.js Frontend
                      │
               REST API Requests
                      │
                      ▼
               Flask Backend API
                      │
        ┌─────────────┼──────────────┐
        │             │              │
        ▼             ▼              ▼
 Text Processing   SQLite DB   Email Service
        │
        ▼
 NLP Analysis Engine
```

---

## Modules

### 1. Text Breaker and Loader
- Processes large text datasets in parallel.
- Performs preprocessing and text segmentation.
- Supports batch processing of CSV files.

### 2. Rule Checker and Scorer
- Performs rule-based sentiment analysis.
- Executes multiple analysis operations simultaneously.
- Stores processed results in the database.

### 3. Search Checker and Report Generator
- Enables searching across processed datasets.
- Generates CSV reports.
- Sends automated email summaries.

### 4. Text Storage Optimizer
- Creates searchable indexes.
- Maintains optimized database records.
- Supports efficient retrieval of historical analysis.

---

## Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Python
- Flask
- Flask-CORS

### Database
- SQLite

### NLP
- NLTK
- Rule-Based Text Processing

### Tools
- Git
- GitHub
- VS Code
- Render
- Vercel

---

## Project Workflow

1. User Registration/Login
2. Upload Text Dataset
3. Select Analysis Operations
4. Parallel Text Processing
5. Sentiment & Pattern Analysis
6. Store Results
7. Generate Reports
8. Search Historical Records

---

## REST API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/api/signup` | Register User |
| POST | `/api/login` | User Login |
| POST | `/api/analyze` | Analyze Uploaded Text |
| GET | `/api/search` | Search Processed Data |
| GET | `/api/history` | View Analysis History |
| GET | `/api/inbox` | View Notifications |
| POST | `/api/contact` | Contact Support |
| POST | `/api/cleanup` | Clear Analysis Logs |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/DeviAnushka/Python_Parallel_Text_Handling_Processor.git
```

### Backend

```bash
cd backend

pip install -r requirements.txt

python app.py
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Deployment

### Frontend
- Vercel

### Backend
- Render

---

## Project Outcomes

- Efficient processing of large text datasets.
- Faster execution using parallel processing.
- Accurate rule-based sentiment analysis.
- Searchable text indexing.
- Automated report generation.
- Secure user authentication.
- Cloud deployment with separate frontend and backend services.

---

## Future Enhancements

- AI-based text summarization
- Named Entity Recognition (NER)
- Keyword extraction
- Multi-language text processing
- PDF report generation
- Role-based access control
- Cloud database integration
- Machine Learning based sentiment analysis

---

## Screenshots

### Login Page

<img width="1907" height="1022" alt="image" src="https://github.com/user-attachments/assets/bcada4f8-6ab4-4f80-a26b-ecda7245563e" />


### Dashboard

<img width="1918" height="1035" alt="image" src="https://github.com/user-attachments/assets/bdede2af-0943-427a-83f7-380136b028ce" />

### Analysis Results

<img width="1885" height="435" alt="image" src="https://github.com/user-attachments/assets/c414235c-9823-4399-ad3b-3ab46a95931b" />

<img width="1883" height="1022" alt="image" src="https://github.com/user-attachments/assets/e36f4a64-bb1e-4145-a55e-fbd5780582e9" />


### Search Module

<img width="1460" height="732" alt="image" src="https://github.com/user-attachments/assets/8b504889-9a85-48b8-a561-c00a7c70d5f6" />


## Live Demo

Frontend:
https://python-parallel-text-handling-front.vercel.app/

Backend API:
https://python-parallel-text-handling-processor-39gb.onrender.com/

---

## Repository

GitHub:
https://github.com/DeviAnushka/Python_Parallel_Text_Handling_Processor

---

## Author

**Devi Anushka**

Bachelor of Technology (Computer Science & Engineering)

GitHub: https://github.com/DeviAnushka

LinkedIn: https://www.linkedin.com/in/devianushka
