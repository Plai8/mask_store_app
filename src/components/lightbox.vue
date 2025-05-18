<script>
import { useStoresInfo } from '@/stores/storesInfo';
export default {
    name: "lightbox",
    data() {
        return {
            store: null,
        }
    },
    computed: {
        showModal() {
            return this.store.showModal
        },
        currentStore() {
            return this.store.stores.filter(store => store.id === this.store.infoBoxSid)
        },
        servicePeriods() {
            let servicePeriods = this.currentStore[0].service_periods
            console.log(servicePeriods);
            servicePeriods = servicePeriods.replace(/N/g, "O").replace(/Y/g, "X");
            return servicePeriods ? [servicePeriods.slice(0, 7).split(""), servicePeriods.slice(7, 14).split(""), servicePeriods.slice(14, 21).split("")] : servicePeriods;
        }
    },
    methods: {
        closeModal() {
            this.store.showModal = false;
        },
    },
    created() {
        this.store = useStoresInfo();
    },

}
</script>
<template>
    <div class="modal-mask" v-show="showModal">
        <div class="modal-wrapper" @click.self="closeModal">
            <div class="modal-container">
                <div class="modal-body" v-for="store in currentStore" :key="store.name">
                    <h1 class="store-name">藥局名稱:{{ store.name }}</h1>
                    <hr>
                    <h2 class="title">營業時間</h2>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>一</th>
                                <th>二</th>
                                <th>三</th>
                                <th>四</th>
                                <th>五</th>
                                <th>六</th>
                                <th>日</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>早上</th>
                                <td v-for="(s, idx) in servicePeriods[0]" :key="idx">{{ s }}</td>
                            </tr>
                            <tr>
                                <th>中午</th>
                                <td v-for="(s, idx) in servicePeriods[1]" :key="idx">{{ s }}</td>
                            </tr>
                            <tr>
                                <th>晚上</th>
                                <td v-for="(s, idx) in servicePeriods[2]" :key="idx">{{ s }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h2 class="title">地址：{{ store.address }}</h2>
                    <h2 class="title">電話：{{ store.phone }}</h2>
                    <h2 v-if="store.cistom_note" class="title">備註:{{ store.custom_note }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.modal-mask {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11000;

    .modal-wrapper {
        width: 100%;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba($color: #000000, $alpha: 0.3);
        z-index: 1000;
        cursor: pointer;

        .modal-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            width: 50%;
            padding: 50px 30px;
            z-index: 1001;
            border-radius: 10px;

            .store-name {
                font-size: 26px;
                font-weight: 600;
                color: #26a69a;
                margin-bottom: 20px;
            }

            .title {
                margin: 10px 0;
                font-size: 18px;
                color: #26a69a
            }

            table {
                width: 100%;
                margin: 20px 0;

                th {
                    background-color: #26a69a;
                    padding: 10px;
                    color: #fff
                }

                td {
                    text-align: center;
                }
            }
        }
    }
}
</style>