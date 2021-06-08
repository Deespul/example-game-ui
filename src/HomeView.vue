<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <QueueListView v-if="!queueIsSelected"/>
        <PlayerListView v-else-if="!playerIsSelected"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import QueueListView from "@/queues/QueueListView.vue";
import PlayerListView from "@/players/PlayerListView.vue";

@Component({
  components: {PlayerListView, QueueListView}
})
export default class HomeView extends Vue {
  get playerIsSelected() {
    return this.$store.direct.state.player.selectedPlayer
  }

  get queueIsSelected() {
    return this.$store.direct.state.queue.selectedQueue
  }

  async created() {
    this.$store.direct.dispatch.queue.loadQueues()
    this.$store.direct.dispatch.player.loadPlayers()
  }
}
</script>
