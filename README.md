<div align="center">

# ✨ Trackify

<p style="font-size:1.2em; font-style:italic;">Build Habits That Last</p>

<img src="https://img.shields.io/badge/Trackify-Habit%20Tracking%20Made%20Beautiful-6366F1?style=for-the-badge&logo=checkmarx&logoColor=white" alt="Trackify Logo" />

<p>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react" alt="React" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express" alt="Express" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-5.x-47A248?style=flat-square&logo=mongodb" alt="MongoDB" /></a>
  <a href="https://clerk.dev/"><img src="https://img.shields.io/badge/Clerk-Authentication-4B6BFB?style=flat-square" alt="Clerk" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
</p>

<hr style="width:70%; border:2px solid #6366F1; border-radius:5px;" />

</div>

## Overview

Trackify is a full-stack web application designed to help users build and maintain habits through consistent daily tracking. The application provides a beautiful, intuitive interface for tracking habits, building streaks, and visualizing progress over time.

<p align="center">
  <img src="https://via.placeholder.com/800x200?text=Trackify+App+Preview" alt="App Preview" style="border-radius:8px; box-shadow:0 4px 8px rgba(0,0,0,0.1);" />
</p>

## ✨ Features

- **User Authentication**: Secure authentication via Clerk
- **Habit Tracking**: Create and track daily habits
- **Defined Period Tracking**: Set specific timeframes for goal-based habits
- **Streak Monitoring**: Automatically track and display current and longest streaks
- **Progress Visualization**: Visual calendar displays of marked days
- **Responsive Design**: Beautiful UI that works on mobile and desktop
- **Dark/Light Mode**: Toggle between color schemes for comfortable viewing
- **Multiple Views**: Grid and list views for different preferences
- **Statistics Dashboard**: Overview of tracking metrics and achievements

<details>
<summary><b>Feature Details</b></summary>
<table>
  <tr>
    <td width="30%"><b>Streak System</b></td>
    <td>Track consecutive days of habit completion with visual indicators that change color based on streak length</td>
  </tr>
  <tr>
    <td><b>Calendar Visualization</b></td>
    <td>See your progress with an intuitive calendar display that highlights marked days</td>
  </tr>
  <tr>
    <td><b>Analytics</b></td>
    <td>View statistics including total days tracked, active streaks, and personal records</td>
  </tr>
</table>
</details>

## 🛠 Technologies

<table>
  <tr>
    <th width="50%">Frontend</th>
    <th width="50%">Backend</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>React.js</li>
        <li>Tailwind CSS</li>
        <li>Clerk Authentication</li>
        <li>Vite (build tool)</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Node.js</li>
        <li>Express.js</li>
        <li>MongoDB with Mongoose</li>
        <li>Clerk SDK for Node</li>
      </ul>
    </td>
  </tr>
</table>

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Clerk account for authentication

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/Himanshu-Saraswat-01122004/trackify.git
cd trackify
```

### Backend Setup

```bash
cd trackify-backend
npm install
```

Create a `.env` file in the `trackify-backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Frontend Setup

```bash
cd ../trackify-frontend
npm install
```

Create a `.env` file in the `trackify-frontend` directory with the following variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

<table>
  <tr>
    <td width="50%">
      <h3>Backend</h3>
      <pre><code>cd trackify-backend
npm run dev</code></pre>
      <p>Server will start on port 5000</p>
    </td>
    <td width="50%">
      <h3>Frontend</h3>
      <pre><code>cd trackify-frontend
npm run dev</code></pre>
      <p>Available at http://localhost:5173</p>
    </td>
  </tr>
</table>

## 📱 Usage

1. **Sign Up/Login**: Use Clerk authentication to create an account or log in
2. **Create Trackers**: Add new habits to track with optional defined periods
3. **Mark Days**: Click "Mark Today" each day you complete your habit
4. **Track Progress**: View your streaks and calendar to see your consistency
5. **Toggle Views**: Switch between grid and list views as needed

## 📷 Screenshots

<div align="center">
<table>
  <tr>
    <td><img src="https://via.placeholder.com/400x225?text=Trackify+Dashboard" alt="Dashboard" style="border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.1);"/></td>
    <td><img src="https://via.placeholder.com/400x225?text=Trackify+Login" alt="Login" style="border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.1);"/></td>
  </tr>
  <tr>
    <td align="center"><b>Dashboard View</b></td>
    <td align="center"><b>Login Page</b></td>
  </tr>
  <tr>
    <td><img src="https://via.placeholder.com/400x225?text=Create+Tracker" alt="Create Tracker" style="border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.1);"/></td>
    <td><img src="https://via.placeholder.com/400x225?text=Statistics+View" alt="Statistics" style="border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.1);"/></td>
  </tr>
  <tr>
    <td align="center"><b>Tracker Creation</b></td>
    <td align="center"><b>Statistics View</b></td>
  </tr>
</table>
</div>

## 🔑 Environment Variables

<table>
  <tr>
    <th width="50%">Backend (.env)</th>
    <th width="50%">Frontend (.env)</th>
  </tr>
  <tr>
    <td>
      <table>
        <tr>
          <td><code>PORT</code></td>
          <td>Port on which the server will run</td>
        </tr>
        <tr>
          <td><code>MONGO_URI</code></td>
          <td>MongoDB connection string</td>
        </tr>
        <tr>
          <td><code>CLERK_SECRET_KEY</code></td>
          <td>Secret key from Clerk dashboard</td>
        </tr>
      </table>
    </td>
    <td>
      <table>
        <tr>
          <td><code>VITE_CLERK_PUBLISHABLE_KEY</code></td>
          <td>Publishable key from Clerk dashboard</td>
        </tr>
        <tr>
          <td><code>VITE_API_URL</code></td>
          <td>URL of the backend API</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

## 🗂 Project Structure

```
trackify/
├── trackify-backend/    # Backend Express application
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── server.js         # Entry point
│
└── trackify-frontend/   # React frontend application
    ├── public/           # Static assets
    └── src/              # Source files
        ├── components/   # Reusable components
        ├── pages/        # Page components
        ├── api/          # API integration
        └── main.jsx      # Entry point
```

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

<div align="center">
  <h3>Himanshu Saraswat</h3>
  <a href="https://github.com/Himanshu-Saraswat-01122004">
    <img src="https://img.shields.io/badge/GitHub-Himanshu%20Saraswat-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
</div>

---

<div align="center">
  <p style="font-style:italic;">Build better habits, one day at a time.</p>
</div>