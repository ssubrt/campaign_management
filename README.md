
# Campaign Craft - AI Outreach System

A campaign management system that allows users to create, manage campaigns and generate personalized LinkedIn outreach messages using AI.

## Features

- Campaign management with CRUD operations
- AI-powered personalized message generation based on LinkedIn profiles
- Clean, responsive UI with modern design

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- React Query for data fetching
- React Router for navigation

### Backend
- Node.js with Express and TypeScript
- MongoDB with Mongoose
- OpenAI API for message generation

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance (local or Atlas)
- OpenAI API key (optional, mock responses will be used if not provided)

### Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd campaign-craft
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Environment setup
   - Create a `.env` file based on `.env.example`
   - Add your MongoDB connection string
   - Add your OpenAI API key (optional)

4. Start the development servers

   For frontend:
   ```
   npm run dev
   ```

   For backend:
   ```
   npm run server
   ```

5. Access the application
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## API Endpoints

### Campaign APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /campaigns | Fetch all campaigns (excluding DELETED) |
| GET    | /campaigns/:id | Fetch a single campaign by ID |
| POST   | /campaigns | Create a new campaign |
| PUT    | /campaigns/:id | Update campaign details |
| DELETE | /campaigns/:id | Soft delete (set status to DELETED) |

### LinkedIn Message API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /personalized-message | Generate a personalized outreach message |

## Deployment

This application can be deployed on platforms like Vercel, Netlify, or Render.

1. Frontend deployment:
   - Build the frontend: `npm run build`
   - Deploy the `dist` folder to your hosting platform

2. Backend deployment:
   - Deploy the backend to a Node.js hosting service
   - Set up environment variables on your hosting platform

## License

This project is licensed under the MIT License.
