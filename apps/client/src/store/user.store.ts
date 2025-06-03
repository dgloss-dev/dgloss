import { IUser } from '@workspace/types';
import { create } from 'zustand';

type State = {
  users: IUser[];
  count: number;
};

type Action = {
  setUsersAction: (users: IUser[]) => void;
  setUsersCountAction: (count: number) => void;
};

const initialState: State = {
  users: [],
  count: 0,
};

export const useUserStore = create<State & Action>((set) => ({
  ...initialState,
  setUsersAction: (users: IUser[]) =>
    set(() => ({
      users,
    })),
  setUsersCountAction: (count: number) =>
    set(() => ({
      count,
    })),
}));
