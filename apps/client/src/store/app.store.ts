import { create } from 'zustand';

type State = {
  isLoading: boolean;
  loaderCount: number;
  openModals: {
    [key: string]: boolean;
  };
};
type Action = {
  setIsLoadingAction: (isLoading: boolean) => void;
  resetAction: () => void;
  setOpenModalAction: (modalName: string, isOpen: boolean) => void;
};
const initialState: State = {
  isLoading: true,
  loaderCount: 0,
  openModals: {},
};

export const useAppStore = create<State & Action>((set) => ({
  ...initialState,
  setIsLoadingAction: (isLoading: boolean) =>
    set((state: State) => ({
      loaderCount: isLoading ? state.loaderCount + 1 : Math.max(0, state.loaderCount - 1),
      isLoading: isLoading || state.loaderCount - 1 > 0,
    })),
  resetAction: () => set(initialState),
  setOpenModalAction: (modalName: string, isOpen: boolean) =>
    set((state: State) => ({
      openModals: {
        ...state.openModals,
        [modalName]: isOpen,
      },
    })),
}));
