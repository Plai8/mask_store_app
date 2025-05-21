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
                iconUrl: "location-dot.png",
                iconSize:[40,40]
            };
            const customIcon  = L.icon(ICON);
            const markerOptions = {
                icon:customIcon
            }
            const marker = L.marker({ lat: item.longitude, lng: item.latitude }, markerOptions)
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
#mask-map{
    width: 100%;
    height: 100vh;
}

</style>
