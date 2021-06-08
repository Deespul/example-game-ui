<template>
  <v-app>
    <v-navigation-drawer
        app
        absolute
        dark
        permanent>
      <v-list
          dense
          nav
          class="py-2 px-1">
        <v-list-item class="py-1" link>
          <v-list-item-content v-if="playerName && !queueName">
            <v-list-item-title>{{ playerName }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-if="playerName && queueName">
            <v-list-item-title>{{ playerName }} playing on {{ queueName }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-if="!playerName && queueName">
            <v-list-item-title>playing on {{ queueName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="queueName" class="py-1" link @click="resetQueue">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Change Queue</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="playerName" class="py-1" link @click="resetPlayer">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Change Player</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>
    <v-container class="px-0 py-0">
      <v-main>
        <HomeView />
      </v-main>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from "vue-property-decorator";
import MatchBoxLogo from "@/components/MatchBoxLogo.vue";
import PlayerListView from "@/players/PlayerListView.vue";
import QueueListView from "@/queues/QueueListView.vue";
import HomeView from "@/HomeView.vue";

@Component({ components: {HomeView, QueueListView, PlayerListView  }})
export default class App extends Vue {

  get playerName() {
    return this.$store.direct.state.player.selectedPlayer?.playerId
  }

  get queueName() {
    return this.$store.direct.state.queue.selectedQueue?.name
  }

  public resetPlayer() {
    this.$store.direct.commit.player.SET_SELCTED_PLAYER(null)
  }

  public resetQueue() {
    this.$store.direct.commit.queue.SET_SELECTED_QUEUE(null)
  }
}
</script>
