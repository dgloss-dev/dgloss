import { create } from 'zustand';
import { ICallList } from '@workspace/types/interfaces/callList/callList.interface';

type State = {
  selectedRows: ICallList[];
  callListData: ICallList[];
  callListCount: number;
};
type Action = {
  setSelectedRows: (selectedRows: ICallList[]) => void;
  setCallListData: (callListData: ICallList[]) => void;
  setCallListCount: (callListCount: number) => void;
};
const initialState: State = {
  selectedRows: [],
  callListData: [],
  callListCount: 0,
};

export const useCallListStore = create<State & Action>((set) => ({
  ...initialState,
  setSelectedRows: (selectedRows: ICallList[]) => set({ selectedRows }),
  setCallListData: (callListData: ICallList[]) => set({ callListData }),
  setCallListCount: (callListCount: number) => set({ callListCount }),
}));
