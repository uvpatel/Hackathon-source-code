# Career Guidance AI Platform

A smart career guidance platform that combines skills assessment with AI-powered career suggestions using the Gemini API.

## Features

- User Authentication System
- Skills Assessment Module
- AI-Powered Career Suggestions
- Interactive Chatbot Interface
- Profile Builder
- Personal Dashboard

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: MySQL
- AI Integration: Google Gemini API

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   composer install
   ```
3. Configure your environment:
   - Copy `.env.example` to `.env`
   - Update database credentials
   - Add your Gemini API key
4. Import database schema:
   ```bash
   mysql -u your_username -p your_database < database/schema.sql
   ```
5. Start your local PHP server:
   ```bash
   php -S localhost:8000
   ```

## Project Structure

```
hackathon2/
├── api/          # Backend API endpoints
├── config/       # Configuration files
├── css/          # Stylesheets
├── database/     # Database schema
├── js/           # JavaScript files
├── models/       # PHP models
├── src/          # Source files
├── tests/        # Unit tests
└── vendor/       # Dependencies
```

## Contributing

This is a hackathon project. Feel free to fork and improve!

## License

MIT License 