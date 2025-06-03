import { create } from 'zustand';

type State = {
  isLoading: boolean;
  loaderCount: number;
};
type Action = {
  setIsLoadingAction: (isLoading: boolean) => void;
  resetAction: () => void;
};
const initialState: State = {
  isLoading: true,
  loaderCount: 0,
};

export const useAppStore = create<State & Action>((set) => ({
  ...initialState,
  setIsLoadingAction: (isLoading: boolean) =>
    set((state: State) => ({
      loaderCount: isLoading ? state.loaderCount + 1 : Math.max(0, state.loaderCount - 1),
      isLoading: isLoading || state.loaderCount - 1 > 0,
    })),
  resetAction: () => set(initialState),
}));
