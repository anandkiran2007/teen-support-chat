# Teen Support Chat

A supportive chat application for teens, built with Next.js, TypeScript, and OpenAI's GPT-3.5.

## Features

- User authentication
- Private conversations
- AI-powered responses
- Dark mode support
- Responsive design
- Secure data storage

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key
- Vercel account (for deployment)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/teen-support-chat.git
cd teen-support-chat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

## Production Deployment

1. Set up a PostgreSQL database (e.g., using Supabase, Railway, or DigitalOcean)

2. Update environment variables in your deployment platform:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure random string
   - `NEXTAUTH_URL`: Your production URL
   - `OPENAI_API_KEY`: Your OpenAI API key

3. Deploy to Vercel:
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Configure environment variables in Vercel
   - Deploy!

## Database Setup

1. Create a new PostgreSQL database
2. Update the `DATABASE_URL` in your environment variables
3. Run migrations:
```bash
npx prisma migrate deploy
```

## Security Considerations

- All passwords are hashed using bcrypt
- Sessions are managed securely with NextAuth.js
- API routes are protected
- Environment variables are properly configured
- Database connections are encrypted

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
