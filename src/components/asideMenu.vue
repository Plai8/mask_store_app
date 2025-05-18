<script>
import { useStoresInfo } from '@/stores/storesInfo'

export default {
    name: "asideMenu",
    data() {
        return {
            selectedCity: "臺北市",
            selectedArea: "中正區",
            store: null, // 初始化 store
            keyWord: ''
        }
    },

    computed: {
        districtList() {
            let currentCityIndex = this.store.locations?.findIndex(d => d.name === this.selectedCity);
            return this.store?.locations[currentCityIndex]?.districts || []
        },
        filteredStore() {
            return this.store.filteredStores;
        },
        seachStore() {
            if (this.store?.currentCity) {
                this.keyWord !== "" ? this.store.keyWord = this.keyWord : this.store.keyWord = null
            }
        }
    },
    methods: {
        openInfoBox(sid) {
            this.store.$patch({
                showModal: true,
                infoBoxSid: sid
            });
        },
        setCurrCity(city) {
            this.store.$patch({
                currentCity: city,
            })
        },
        seCurrDistrict(district) {
            this.store.$patch({
                currentAdministrativeArea: district
            })
        },
        keyWordHighlight(val) {
            return val.replace(new RegExp(this.keyWord, "g"), `<span class="highlight" style="color:#f08d49">${this.keyWord}</span>`)
        }
    },
    async created() {
        this.store = useStoresInfo()
        await this.store.fecthPharmacies()
        await this.store.fetchLocations()
        console.log(this.store.locations)
    },
    watch: {
        selectedCity(newCity) {
            this.setCurrCity(newCity);
        },
        selectedArea(newDistrict) {
            this.seCurrDistrict(newDistrict)
        },
        seachStore(keyWord) {
            this.seachStore(keyWord);
        }
    }
}
</script>

<template>
    <aside>
        <div class="city-input-wrapper">
            <p class="location-select">縣市：
                <select name="cities" id="cities" v-model.lazy="selectedCity">
                    <option disabled>請選擇縣市</option>
                    <option v-for="city in store.locations" :key="city.name" :value="city.name">{{ city.name }}</option>
                </select>
            </p>
            <p class="location-select">行政區：
                <select name="administrative-area" id="administrative-area" v-model="selectedArea">
                    <option disabled>請選擇行政區</option>
                    <option v-for="district in districtList" :key="district.name" :value="district.name">{{
                        district.name
                        }}</option>
                </select>
            </p>
        </div>
        <div class="key-word-search-area">
            <h3><font-awesome-icon class="fa-icon" :icon="['fas', 'magnifying-glass']" />關鍵字搜尋：</h3>
            <div class="search-input-wrapper">
                <input type="text" name="key-word" id="key-word" placeholder="請輸入關鍵字" v-model="keyWord">
            </div>
        </div>
        <div class="mask-stores-result-area">
            <div class="mask-store-info-card" v-for="store in filteredStore" :key="store.id">
                <div class="store-info">
                    <h4 v-html="keyWordHighlight(store.name)"></h4>
                    <ul>
                        <li>大人口罩：{{ store.mask_child }}個</li>
                        <li>小孩口罩：{{ store.mask_adult }}個</li>
                    </ul>
                    <p>最後更新時間：{{ store.updated }}</p>
                </div>
                <div class="store-more-info-btn" @click=" openInfoBox(store.id)">
                    <font-awesome-icon :icon="['fas', 'location-dot']" />
                    <p>詳細資訊</p>
                </div>
            </div>
        </div>
    </aside>
</template>

<style lang="scss" scoped>
* {
    color: #000;
    box-sizing: border-box;

    aside {
        width: 100%;
        height: 100vh;
        background-color: #F1EFEC;

        div:first-child {
            border-top: none
        }


        >div {
            padding: 20px;
            border-top: 1px solid #000;
            width: 100%;
            margin: 0px auto;

        }

        .location-select {
            margin-bottom: 20px;
            width: 50%;
            display: flex;
            justify-content: space-between;

            select {
                width: 50%;
            }

        }

        .key-word-search-area {
            h3 {
                margin-bottom: 10px;

                .fa-icon {
                    margin-right: 5px;
                }
            }
        }

        .search-input-wrapper input {
            width: 100%;
            padding: 10px;
            border: none
        }

        .mask-stores-result-area {
            overflow: auto;
            width: 100%;
            height: 70vh;
            padding: 0;

            .mask-store-info-card {
                display: flex;
                padding: 20px;
                border-bottom: 1px solid #000;
                justify-content: space-between;
                position: relative;
                background-color: #FFFDF6;

                h4 {
                    font-size: 20px;
                    font-weight: 400;
                    margin: 15px 0;

                    .highlight {
                        color: #f08d49;
                    }

                }

                ul li,
                p {
                    margin: 10px 0;
                }

                .store-more-info-btn {
                    position: absolute;
                    top: 40%;
                    transform: translateY(-50%);
                    right: 15px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    cursor: pointer;
                    padding: 10px;
                    background-color: #E9F5BE;
                    border-radius: 5px;
                }
            }
        }

    }
}
</style>