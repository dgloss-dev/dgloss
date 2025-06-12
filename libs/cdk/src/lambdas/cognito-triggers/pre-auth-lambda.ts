import axios from 'axios';
import { PreAuthenticationTriggerEvent } from 'aws-lambda';

export const handler = async (event: PreAuthenticationTriggerEvent) => {
  try {
    const API_KEY = process.env.INTERNAL_API_KEY;
    const email = event.request.userAttributes['email'];

    // Log user authentication attempt
    await axios.post(
      `${process.env.API_URL}/auth/failed-attempt`,
      { email },
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    // Check if user account is locked
    const response = await axios.post(
      `${process.env.API_URL}/auth/user-by-email`,
      { email },
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    const user = response.data?.data;
    if (user.status === 'locked') {
      throw new Error('User account locked');
    }

    return event;
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};
