<script>
import L from "leaflet"
import { useStoresInfo } from "@/stores/storesInfo";
export default {
    name: "MaskMap",
    data() {
        return {
            map: {},
            store: null,
        }
    },
    computed: {
        currDistrictInfor() {
            if (this.store?.currDistrictInfo) {
                return this.store.currDistrictInfo;
            }
        },
        filteredStores() {
            return this.store?.filteredStores;
        }
    },
    methods: {
        addMarker(item) {
            const ICON = {
                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-marker/master/img/marker-icon-2x-violet.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 4],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shodowSize: [41, 41],
            };
            const marker = L.marker({ lat: item.longitude, lng: item.latitude }, ICON)
                .addTo(this.map)
                .bindPopup(`<h2 class="popup-name">${item.name}</h2>`)
        },
        clearMarkers() {
            if (this.map?.eachLayer) {
                this.map.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        this.map.removeLayer(layer);
                    }
                })
            }
        }
    },
    mounted() {
        this.map = L.map("mask-map", {
            center: [25.03, 121.55],
            zoom: 14
        });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
    },
    created() {
        this.store = useStoresInfo();
    },
    watch: {
        currDistrictInfor(dist) {
            if (dist) {
                this.map.panTo(new L.LatLng(dist[0].latitude, dist[0].longitude));
            }
        },
        filteredStores(stores) {
            this.clearMarkers();
            stores?.forEach(store => {
                this.addMarker(store)
            });
        }
    }
}
</script>
<template>
    <div class="mask-map" id="mask-map">
    </div>
</template>
<style lang="scss" scoped>
#mask-map {
    height: 100vh;
}
</style>
