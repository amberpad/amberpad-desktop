import Store from 'electron-store'

type StoreType = {
  sidebarAperture?: string,
  isSidebarOpen?: boolean,
  selectedPageID?: string,
}

const store = new Store<StoreType>({
  defaults: {
    sidebarAperture: undefined,
    isSidebarOpen: undefined,
    selectedPageID: undefined,
  }
}) as Store<StoreType> & { set: (key: string, any) => void, get: (key: string) => any, clear: () => void, store: any }

export default store