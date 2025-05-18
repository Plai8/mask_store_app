import { defineStore } from 'pinia'

export const useStoresInfo = defineStore('storesInfo', {
  state: () => ({
    currentCity: "臺北市",
    currentAdministrativeArea: "中正區",
    locations: [],
    stores: [],
    showModal: false,
    infoBoxSid: null,
    keyWord: null,
  }),
  getters: {
    currDistrictInfo(state) {
      if (state.locations.filter(city => city.name === state.currentCity)) {
        return state.locations.filter(city => city.name === state.currentCity)[0]?.districts.filter(d => d.name === state.currentAdministrativeArea);
      }
    },
    filteredStores(state) {
      return state.keyWord
        ? state.stores.filter(d => d.name.includes(state.keyWord))
        : state.stores.filter(store => store.county === state.currentCity && store.town === state.currentAdministrativeArea);
    }

  },
  actions: {
    // 取得行政區資料
    async fetchLocations() {
      try {
        const json = await fetch('https://raw.githubusercontent.com/kurotanshi/mask-map/master/raw/area-location.json')
          .then(res => res.json());
        this.locations = json;
      } catch (err) {
        return err
      }
    },
    async fecthPharmacies() {
      try {
        const json = await fetch("https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json")
          .then(res => res.json());
        this.stores = json.features.map(d => ({
          ...d.properties,
          latitude: d.geometry.coordinates[0],
          longitude: d.geometry.coordinates[1],
        }));
      } catch (err) {
        return err
      }
    }
  },
})
