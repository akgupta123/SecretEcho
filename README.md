SecretEcho is a real-time, scalable AI companion messaging web application built with React, Next.js, Node.js, Express, and MongoDB. It features JWT authentication, real-time chat with simulated AI responses, and persistent message history.

Features
User Authentication: JWT-based login/signup

Real-time Messaging: Socket.io powered chat

AI Companion: Simulated AI responses

Persistent Chat History: Messages saved to database

Responsive UI: Works on mobile and desktop

Typing Indicators: Visual feedback for AI responses

Technologies
Frontend:

React 18

Next.js 13

Socket.io Client

CSS Modules

Backend:

Node.js 16+

Express

MongoDB

Mongoose

Socket.io

JSON Web Tokens (JWT)

Project Setup
Prerequisites
Node.js v16+

MongoDB

npm or yarn
Running Locally
Option 1: Without Docker

Start MongoDB:

Make sure MongoDB is running locally on default port 27017

Run the backend:

bash
cd server
npm run dev
Run the frontend:

bash
cd ../client
npm run dev
Option 2: With Docker

Build and start containers:

bash
docker-compose up --build
Access the application:

Frontend: http://localhost:3000

Backend: http://localhost:5001

Architecture Overview
Frontend Structure
client/
├── components/       # Reusable UI components
├── pages/            # Next.js page routes
├── hooks/            # Custom React hooks
├── services/         # API service modules
├── styles/           # CSS Modules
├── public/           # Static assets
└── utils/            # Utility functions
Backend Structure
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/           # Mongoose models
├── routes/           # API route definitions
├── services/         # Business logic
├── sockets/          # Socket.io handlers
├── utils/            # Utility functions
└── validators/       # Request validators
Data Flow
Authentication:

User logs in → JWT issued → Stored in HTTP-only cookie

Subsequent requests include JWT for authorization

Messaging:

User sends message → Optimistic UI update → Message sent to server

Server processes message → Broadcasts via Socket.io → AI response simulated

All messages persisted to MongoDB

Real-time Updates:

Socket.io maintains persistent connection

Server broadcasts new messages to all connected clients

Known Trade-offs and Limitations
Frontend
Optimistic Updates:

Messages appear immediately but may need rollback if API fails

No retry logic implemented for failed sends

Mobile Experience:

Basic responsive design but not fully optimized for all mobile devices

State Management:

Uses Context API which may not scale as well as Redux for very large apps

Backend
AI Simulation:

Simple rule-based responses rather than actual AI

No conversation memory or context

Scalability:

Socket.io without Redis adapter limits horizontal scaling

No message pagination implemented

Security:

Basic rate limiting but no advanced DDoS protection

No email verification for user registration

General
Testing:

Only basic backend tests included

No frontend testing or end-to-end tests

Error Handling:

Basic error handling but could be more comprehensive

No error tracking or logging service integrated

Future Improvements
Enhanced AI:

Integrate with real AI APIs (OpenAI, etc.)

Add conversation memory

Advanced Features:

Message editing/deleting

Read receipts

Typing indicators

License
This project is licensed under the MIT License - see the LICENSE file for details.
