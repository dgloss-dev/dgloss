import { BACKEND_BASE_URL } from '@workspace/types/constants/config';
import { APIS } from '@workspace/types/constants/api';
import { httpGet, httpPost, httpPatch, httpDeleteWithData } from './httpClient.service';
import { FilterCallListDto } from '@workspace/types/dto/callList';
import {
  CreateCallListDto,
  UpdateCallListDto,
  DeleteCallListDto,
} from '@workspace/types/dto/callList';
import { ICallList } from '@workspace/types/interfaces/callList';
import { convertToQuery } from '@client/utils/toQueryString.utils';

const URL = `${BACKEND_BASE_URL}/${APIS.CALL_LISTS}`;

export type GetAllCallListType = {
  rows: ICallList[];
  count: number;
};

// Get all call lists with optional filtering
const getAllCallListsClient = async (
  params?: FilterCallListDto | undefined,
): Promise<GetAllCallListType> => {
  try {
    const urlParams = convertToQuery(params);
    const response = await httpGet(`${URL}?${urlParams}`);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.data?.error;
  }
};

const createCallListClient = async (data: CreateCallListDto): Promise<ICallList> => {
  try {
    const response = await httpPost(URL, data);
    const responseData = response?.data;
    return responseData;
  } catch (error: any) {
    throw error?.data?.error;
  }
};

const updateCallListClient = async (id: number, data: UpdateCallListDto): Promise<ICallList> => {
  try {
    const response = await httpPatch(`${URL}/${id}`, data);
    const responseData = response?.data;
    return responseData;
  } catch (error: any) {
    throw error?.data?.error;
  }
};

const bulkDeleteCallListsClient = async (
  data: DeleteCallListDto,
): Promise<{ deletedCount: number }> => {
  try {
    const payload = {
      ids: data,
    };
    const response = await httpDeleteWithData(URL, payload);
    const responseData = response?.data;
    return responseData;
  } catch (error: any) {
    throw error?.data?.error;
  }
};

export {
  getAllCallListsClient,
  createCallListClient,
  updateCallListClient,
  bulkDeleteCallListsClient,
};
