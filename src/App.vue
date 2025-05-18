<template>
  <div id="main-area">
    <div class="aside-menu">
      <aside-menu />
    </div>
    <lightbox />
   <MaskMap />
  </div>
</template>

<script>
import asideMenu from './components/asideMenu.vue'
import { mapState } from "pinia"
import { mapActions } from "pinia"
import { useStoresInfo } from './stores/storesInfo'
import lightbox from "@/components/lightbox.vue"
import MaskMap from './components/maskMap.vue'


export default {
  components: {
    asideMenu,
    lightbox,
    MaskMap
  },
  name: "App",
  computed: {
    ...mapState(useStoresInfo,["currentCity","currentAdministrativeArea"]),

  },
  methods:{
    ...mapActions(useStoresInfo,['fecthPharmacies','fetchLocations']),
    updateCurrentCity() {
      this.useStoresInfo.$patch({
        currentCity:"台中市",
        currentAdministrativeArea:"大雅區"
      });
    }
  },
  mounted() {
    this.fecthPharmacies();
    this.fetchLocations();
  
  },
  created() {
    this.useStoresInfo = useStoresInfo();
  }

}
</script>
<style lang="scss">
body {
  background-color: #fff;
  font-family:Arial, Helvetica, sans-serif;

  #main-area {
    width: 100%;
    display: flex;
    position: relative;

    #mask-map {
      width: 75%;
    }

    .aside-menu {
      width: 25%;
    }
  }


}
</style>
