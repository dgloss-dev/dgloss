import { setUserCookie } from '../utils/handleSessionCookies';
import { ICurrentUser } from '@workspace/types/interfaces/user';
import { create } from 'zustand';

type State = {
  isAuthenticated: boolean;
  user: ICurrentUser | undefined;
};
type Action = {
  setIsAuthenticatedAction: (isAuthenticated: boolean) => void;
  setUserAction: (user: any) => void;
  resetAction: () => void;
};
const initialState: State = {
  isAuthenticated: false,
  user: undefined,
};

export const useAuthStore = create<State & Action>((set) => ({
  ...initialState,
  setIsAuthenticatedAction: (isAuthenticated: boolean) =>
    set(() => ({
      isAuthenticated,
    })),
  setUserAction: (user: any) => {
    setUserCookie(user);
    set(() => ({
      user,
    }));
  },
  resetAction: () => set(initialState),
}));
