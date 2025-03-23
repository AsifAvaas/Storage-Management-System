# Storage Management System

## Overview
This is a **Storage Management System** built using **Node.js, Express.js, and MongoDB**, following the **MVC (Model-View-Controller) design pattern**. This project is designed to manage file storage, including file uploads, user authentication, and role-based access control.

## Features
- User authentication using JWT
- File upload and storage using Cloudinary
- CRUD operations on stored files
- Role-based access control
- Nodemailer integration for email notifications
- RESTful API endpoints

## Project Structure
```
📂 storage-management-system
├── 📂 src
│   ├── 📁 controllers        # Contains all controller logic
│   ├── 📁 models             # Database schema definitions
│   ├── 📁 routes             # API routes
│   ├── 📁 services           # Business logic and reusable functions
│   ├── 📁 middlewares        # Authentication and other middleware
│   ├── 📁 config             # Configuration files (DB connection, etc.)
│   ├── 📁 utils              # Utility functions
├── app.js
├── index.js
├── .env.example              # Example environment variables
├── postman_collection.json   # Postman collection for API testing
├── package.json              # Project dependencies
├── README.md                 # Documentation
```



## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)
- Cloudinary account (for file uploads)

### 1. Clone the Repository
```sh
git clone https://github.com/AsifAvaas/Storage-Management-System.git
cd Storage-Management-System
```
### 2. Install Dependencies
```sh
npm install
```
### 3. Configure Environment Variable
```sh
cp .env.example .env
```

### Modify .env file with your actual credentials:

### 4. Run the Server
```sh
nodemon index.js
```
## API Documentation
The Postman collection is available in the GitHub repository (Storage management.postman_collection.json). Import it into Postman to test the endpoints.

## Contact
For any queries, feel free to reach out.

**Author:** Asif A Khuda  
**GitHub:** [AsifAvaas](https://github.com/AsifAvaas)  
**LinkedIn:** [Asif A Khuda](https://www.linkedin.com/in/asifavaas)





