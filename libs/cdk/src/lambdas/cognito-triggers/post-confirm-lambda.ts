import axios from 'axios';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

export const handler = async (event: PostConfirmationTriggerEvent) => {
  try {
    const API_KEY = process.env.INTERNAL_API_KEY;
    const email = event.request.userAttributes['email'];

    // Clear user log in attempts on successful confirmation
    await axios.put(
      `${process.env.API_URL}/auth/failed-attempt`,
      { email },
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    return event;
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};
