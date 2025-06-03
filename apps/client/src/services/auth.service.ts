import { BACKEND_BASE_URL } from '@workspace/types/constants/config';
import { httpGet } from './httpClient.service';
import { APIS, AUTH_APIS } from '@workspace/types/constants/api';
import { IUser } from '@workspace/types/interfaces/user';

const URL = `${BACKEND_BASE_URL}/${APIS.AUTH}`;

const getCurrentUser = async (): Promise<IUser> => {
  try {
    const response = await httpGet(`${URL}/${AUTH_APIS.CURRENT_USER}`);
    const data = response?.data?.data;
    return data;
  } catch (error: any) {
    throw error?.data?.error;
  }
};
export { getCurrentUser };
