<template>
  <v-container>
    <v-card>
      <v-card-title>
        Game jeah
        <v-spacer></v-spacer>
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from "vue-property-decorator";
  import {Queue} from "@/queues/queues.types";

  @Component({
    components: {}
  })
  export default class GameView extends Vue {
  }
</script>
<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
