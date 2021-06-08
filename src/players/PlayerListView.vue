<template>
  <v-container>
    <v-card>
      <v-card-title>
        Select a player
      </v-card-title>
      <v-data-table
        class="row-pointer"
        :loading="isLoadingPlayers"
        :headers="tableHeaders"
        :items="players"
        @click:row="selectPlayer"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from "vue-property-decorator";
  import {Player} from "@/players/players.types";

  @Component({
    components: {}
  })
  export default class PlayerListView extends Vue {
    tableHeaders = [
      {
        text: 'Player Id',
        align: 'start',
        value: 'playerId',
      },
      { align: 'end', value: 'edit' },
    ]

    get isLoadingPlayers() {
      return this.$store.direct.state.player.isLoadingPlayers
    }

    get players() {
      return this.$store.direct.state.player.players
    }

    public selectPlayer(p: Player) {
      this.$store.direct.commit.player.SET_SELCTED_PLAYER(p)
    }
  }
</script>
<style lang="css" scoped>
  .row-pointer >>> tbody tr :hover {
    cursor: pointer;
  }
</style>
