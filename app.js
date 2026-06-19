import express from 'express';
import { PORT } from './config/env.js';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';    

const app = express();
app.set('trust proxy', 3);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(arcjetMiddleware)


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Subscription Tracker API',
    description:
      'A REST API for managing users, subscriptions, renewal reminders, and automated workflows.',
    status: 'Operational',
    version: '1.0.0',
    endpoints: {
      authentication: '/api/v1/auth',
      users: '/api/v1/users',
      subscriptions: '/api/v1/subscriptions',
      workflows: '/api/v1/workflows',
    },
    documentation: 'See the project README for API usage and examples.',
  });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);



try {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}
export default app; 
