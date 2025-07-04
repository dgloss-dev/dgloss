import { create } from 'zustand';

type State = {
  isLoading: boolean;
  loaderCount: number;
  openModals: {
    [key: string]: boolean;
  };
  filterValues: Record<string, string | number>;
  refresh: boolean;
};
type Action = {
  setIsLoadingAction: (isLoading: boolean) => void;
  resetAction: () => void;
  setOpenModalAction: (modalName: string, isOpen: boolean) => void;
  setFilterValues: (filterValues: Record<string, string | number>) => void;
  setRefreshAction: (refresh: boolean) => void;
};
const initialState: State = {
  isLoading: true,
  loaderCount: 0,
  openModals: {},
  filterValues: {},
  refresh: false,
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
  setFilterValues: (filterValues: Record<string, string | number>) =>
    set((state: State) => ({
      filterValues: {
        ...state.filterValues,
        ...filterValues,
      },
    })),
  setRefreshAction: (refresh: boolean) => set((state: State) => ({ refresh })),
  clearFilterValues: () => set((state: State) => ({ filterValues: {} })),
}));
