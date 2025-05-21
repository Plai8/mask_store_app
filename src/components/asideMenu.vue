<script>
import { useStoresInfo } from '@/stores/storesInfo'

export default {
    name: "asideMenu",
    data() {
        return {
            selectedCity: "臺北市",
            selectedArea: "中正區",
            store: null, // 初始化 store
            keyWord: '',
            isShow: true
        }
    },

    computed: {
        districtList() {
            let currentCityIndex = this.store.locations?.filter(d => d.name === this.selectedCity)[0];
            return currentCityIndex?.districts || []
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
        resetKeyWord() {
            this.keyWord = "";
            this.store?.$patch({
                keyWord: this.keyWord
            })
        },
        updataCurrArea() {
            this.resetKeyWord();
            this.selectedArea = this.districtList[0].name
        },
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
    <transition name="slide">
        <aside v-show="isShow">
            <div class="city-input-wrapper">
                <div class="location-select"><span class="select-title">縣市：</span>
                    <div class="location-select-wrapper">
                        <p class="selected-city"><span>{{ selectedCity }}</span> <font-awesome-icon
                                :icon="['fas', 'chevron-down']" />
                        </p>
                        <select name="cities" id="cities" v-model.lazy="selectedCity" @change="updataCurrArea">
                            <option disabled>請選擇縣市</option>
                            <option v-for="city in store.locations" :key="city.name" :value="city.name">{{ city.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="location-select"><span class="select-title">行政區：</span>
                    <div class="location-select-wrapper">
                        <p class="selected-district"><span>{{ selectedArea }}</span><font-awesome-icon
                                :icon="['fas', 'chevron-down']" />
                        </p>
                        <select name="administrative-area" id="administrative-area" v-model="selectedArea"
                            @change="resetKeyWord">
                            <option disabled>請選擇行政區</option>
                            <option v-for="district in districtList" :key="district.name" :value="district.name">{{
                                district.name
                            }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="key-word-search-area">
                <h3><font-awesome-icon class="fa-icon" :icon="['fas', 'magnifying-glass']" />關鍵字搜尋：</h3>
                <div class="search-input-wrapper">
                    <input type="text" name="key-word" id="key-word" placeholder="請輸入關鍵字" v-model="keyWord">
                </div>
            </div>
            <div class="mask-stores-result-area">
                <div class="mask-store-info-card" v-for="store in filteredStore" :key="store.id"
                    @click=" openInfoBox(store.id)">
                    <div class="store-info">
                        <h4 v-html="keyWordHighlight(store.name)"></h4>
                        <ul>
                            <li>大人口罩：{{ store.mask_child }}個</li>
                            <li>小孩口罩：{{ store.mask_adult }}個</li>
                        </ul>
                        <p>最後更新時間：{{ store.updated }}</p>
                    </div>
                </div>
            </div>
            <button class="collapse-side-btn close" @click="isShow = false">
                <font-awesome-icon :icon="['fas', 'angle-up']" rotation=270 />
            </button>
        </aside>
    </transition>
    <transition name="fade">
        <button class="collapse-side-btn open" @click="isShow = true" v-show="!isShow">
            <font-awesome-icon :icon="['fas', 'angle-up']" rotation=90 />
        </button>
    </transition>
</template>

<style lang="scss" scoped>
* {
    color: #000;
    box-sizing: border-box;
    letter-spacing: 2px;
}

body {
    position: relative;
}

aside {
    width: 100%;
    height: 100vh;
    position: relative;
    background-color: #fff;

    div:first-child {
        border-top: none
    }


    >div {
        padding: 20px;
        border-top: 1px solid #efeded;
        width: 100%;
        margin: 0px auto;

    }

    .location-select {
        margin-bottom: 20px;
        width: 80%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .select-title {
            font-size: 16px;
            font-weight: 400;

        }

        .location-select-wrapper {
            width: 40%;
            font-size: 14px;
            position: relative;
            justify-content: space-around;
            border: 1px solid #d6d7d7;
            border-radius: 5px;
            padding: 8px;

            .selected-city,
            .selected-district {
                display: flex;
                justify-content: space-around;
                font-weight: 400;
            }

            select {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
            }
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
        border: 1px solid #d6d7d7;
        border-radius: 5px;
        outline: none;
    }

    .mask-stores-result-area {
        overflow: auto;
        width: 100%;
        height: 76vh;
        padding: 10px;
        background-color: #F5F5F5;

        .mask-store-info-card {
            display: flex;
            padding: 15px;
            border: 1px solid #efeded;
            border-radius: 8px;
            margin-bottom: 5px;
            justify-content: space-between;
            position: relative;
            background-color: #fff;
            cursor: pointer;

            &:hover {
                border: 1px solid #92A1A3;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            }

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

.collapse-side-btn {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    position: absolute;
    right: -28px;
    top: 50vh;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0);
    width: 28px;
    height: 48px;
    text-align: center;
    border: none;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    cursor: pointer;
    z-index: 1099;
}

.open {
    left: 0;
    z-index:1120;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.1s ease;
    position: absolute;
   /* 保證兩 個元素不疊一起 */
    width: 100%;
}

.slide-enter-from {
    transform: translateX(-95%);
    /* 新頁面從右邊進入 */
}

.slide-enter-to {
    transform: translateX(0);
    /* 到中間結束動畫 */
}

.slide-leave-from {
    transform: translateX(0);
    /* 舊頁面一開始在中間 */
}

.slide-leave-to {
    transform: translateX(-95%);
    /* 舊頁面往左退出 */
}

.fade-enter-active,
.fade-leave-active {
    transition:opacity .1s;
    opacity: 0;
}


.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>