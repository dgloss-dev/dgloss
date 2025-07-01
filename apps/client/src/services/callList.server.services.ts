import { APIS } from '@workspace/types/constants/api';
import { BACKEND_BASE_URL } from '@workspace/types/constants/config';
import { ICallList } from '@workspace/types/interfaces/callList';
import { FilterCallListDto } from '@workspace/types/dto/callList';

import { serverHttpGet } from './httpServer.service';

const URL = `${BACKEND_BASE_URL}/${APIS.CALL_LISTS}`;

type GetAllCallListsType = {
  data: {
    rows: ICallList[];
    count: number;
  };
};

const getServerAllCallLists = async (filters?: FilterCallListDto): Promise<GetAllCallListsType> => {
  try {
    const response = await serverHttpGet(`${URL}`, filters);
    const data = response?.data;
    return data;
  } catch (error: any) {
    console.log(error);
    return { data: { rows: [], count: 0 } };
  }
};

export { getServerAllCallLists };
