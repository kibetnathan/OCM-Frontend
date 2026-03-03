
# Church Management System – Frontend

This is the React frontend for the Church Management System built for Mavuno Young & Fearless and other churches that may require a structured data management platform.

This client application consumes a REST API and provides a modern, responsive user interface for church administration and member engagement.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [User Roles](#user-roles)
- [Dashboards](#dashboards)
- [Messaging Board](#messaging-board)
- [Data & Forms](#data--forms)
- [Technical](#technical)
- [Setup](#setup)
- [License](#license)
- [Contact Information](#contact-information)

---

## About

This repository contains the frontend client application for the Church Management System.

It is designed for churches with less rigid leadership hierarchies and flexible organisational structures.

### Target Denominations

- Non-Denominational Churches  
- Baptist Churches  
- Pentecostal Churches  

### Supported Organisational Structures

- Congregationalism  
- Elder-led models  
- Moses model leadership structures  

Future iterations may include UI adaptations for more structured church systems such as Orthodox and Catholic churches.

---

## Features

### 1. Role-Based Access (UI Level)

The frontend dynamically renders views and dashboards based on authenticated user roles.

Pastors and leaders have expanded access to administrative views, while members have limited and relevant access.

---

### 2. Member Group Management

Members are organised into structured groups such as:

- Serving Teams  
- Discipleship Groups (DGs)  
- Age Groups  
- Leadership Teams  
- Ropes Classes  
- Campus Trend  

Each group view provides linked data, member listings, and administrative controls where permitted.

---

### 3. Dashboards

Each user role has a dedicated dashboard with:

- Data summaries  
- Visual insights  
- Quick navigation tools  
- Management controls (where authorised)  

---

### 4. Messaging Board

A simple forum-style messaging system with:

- Posts  
- Comments  
- Role-based posting permissions  

---

## User Roles

The frontend supports the following roles:

1. Pastors  
2. Leaders  
3. DG Leaders  
4. Members  

Each role sees a different navigation structure and dashboard layout.

---

## Dashboards

### Pastor Dashboard

The Pastor dashboard provides near-admin level visibility and control.

Editable or manageable data includes:

**Ropes Classes**
- Members  
- Leaders  

**Age Groups**
- Name  
- Description  
- Assigned Pastor  
- Members  

**Discipleship Groups (DGs)**
- Name  
- Leaders  
- Members  

The UI reflects permissions received from the backend API.

---

## Messaging Board

The messaging board behaves similarly to a forum:

- Create posts  
- Comment on posts  
- View threads  
- Role-based moderation (if enabled via backend)  

---

## Data & Forms

The frontend provides structured forms for collecting church member data.

### Collected Data Fields

- Name  
- Age  
- Date of Birth  
- Address / Residence  
- Phone Number  
- Email Address  
- School / Workplace  
- Campus  
- Discipleship Group  
- Serving Status  
- Assigned Groups  
- Profile Photo  

### Related Models (via API)

- Profile  
- Personal Information  
- Ministry Data  

---

## Technical

### Technologies Used

- React  
- Vite  
- Tailwind CSS  
- Axios or Fetch (for API communication)  
- React Router  
- Context API or other state management solution  

### Architecture Highlights

- Component-based structure  
- Role-aware rendering  
- Protected routes  
- API-driven UI  
- JWT authentication support  
- Responsive design  

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd church-management-frontend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Run development server

```bash
npm run dev
```

---

## License

This project is currently under development. Licensing terms will be specified upon production release.

---

## Contact Information

If you encounter any bugs, have feedback, questions, or feature requests, please reach out:

**Email:** [bg1b9xany@mozmail.com](mailto:bg1b9xany@mozmail.com)