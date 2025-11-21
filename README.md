# Crystal 💎

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tech](https://img.shields.io/badge/stack-React%20|%20TypeScript%20|%20Vite%20|%20Docker-cyan.svg)

**Crystal** is a modern, minimalist web application designed specifically for tracking **static calisthenics exercises** (isometrics). Unlike traditional fitness trackers that focus on reps, Crystal focuses on *Time Under Tension* and calculates volume based on bodyweight leverage.

![Dashboard Preview](./public/screenshot.png)
*(Note: Add a screenshot of your dashboard to the public folder and rename it to screenshot.png)*

## ✨ Features

* **Static Focus:** Specialized tracking for Planche, Front Lever, L-Sit, and other isometric holds.
* **Performance Crystal:** A radar chart visualization that shows your skill balance and max volume.
* **Dark Mode UI:** "Arrow" aesthetic designed for focus and battery saving on OLED screens.
* **Local Storage:** Privacy-focused data persistence (works offline).
* **Gamification:** Achievements system and weekly streaks.
* **Dockerized:** Ready for deployment on any platform.

## 🛠️ Tech Stack

* **Core:** React 18, TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS, Shadcn/UI
* **Visualization:** Recharts
* **Infrastructure:** Docker

## 🚀 Getting Started

You can run the application locally using Node.js or Docker.

### Option 1: Using Docker (Recommended)

Ensure you have Docker installed.

1.  **Build the image:**
    ```bash
    docker build -t crystal-app .
    ```

2.  **Run the container:**
    ```bash
    docker run -p 3000:5173 crystal-app
    ```

3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Using NPM

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start development server:**
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173).

## 📂 Project Structure
