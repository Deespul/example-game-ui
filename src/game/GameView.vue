<template>
  <v-container>
    <v-card>
      <v-card-title>
        Players online
      </v-card-title>
      <v-data-table
        :headers="tableHeaders"
        :items="playersOnline"
        :loading="!isLoggedIn"
      >
      </v-data-table>
      <div v-if="waitingForGameEnd">Waiting for opponent...</div>
      <v-container>
        <v-btn v-if="isLoggedIn" @click="searchForGame">
          <span v-if="isSearchingForOpponent">Searching game...</span>
          <span v-else>Search for Game</span>
        </v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from "vue-property-decorator";
  import {API_URL} from "@/main";
  import {Match} from "@/game/game.types";
  import {Player} from "@/players/players.types";
  import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";

  @Component({
    components: {}
  })
  export default class GameView extends Vue {
    waitingForGameEnd = false
    isSearchingForOpponent = false
    isLoggedIn = false
    connection!: HubConnection

    tableHeaders = [
      {
        text: 'Player Id',
        align: 'start',
        value: 'playerId',
      },
      { align: 'end', value: 'edit' },
    ]

    public searchForGame() {
      const queueId = this.$store.direct.state.queue.selectedQueue?.queueId
      const playerId = this.$store.direct.state.player.selectedPlayer?.playerId
      this.connection.invoke(
          'Enqueue',
          {
            queueId: queueId,
            playerIds: [{playerId: playerId}]
          },
      )
    }

    get playersOnline() {
      return this.$store.direct.state.game.onlinePlayers
    }

    created() {
      console.log(API_URL)
      this.connection = new HubConnectionBuilder()
          .withUrl(`${API_URL}gamehub`)
          .build();

      this.connection.on('PlayerEntered', (player: Player) => {
        this.$store.direct.commit.game.ADD_ONLINE_PLAYER(player)
      });

      this.connection.on('PlayerLeft', (player: Player) => {
        this.$store.direct.commit.game.REMOVE_ONLINE_PLAYER(player)
      })

      this.connection.on('MatchFinished', (result: Match) => {
        console.log('match finished')
        // searchButton.show()
        // gameResult.empty();
        // onlinePlayerList.show();
        // waitingForGameEnd.hide()
        //
        // const vsSlot = $('<div>')
        // vsSlot.text("Game Result:")
        // gameResult.append(vsSlot)
        //
        // const winnerDiv = $('<div>')
        // const winnerTeam = result.teamsAfterMmrUpdate.find(t => t.playerIds[0].playerId === result.winner)
        // const winnerPlayer = players.find(p => p.playerId === winnerTeam.playerIds[0].playerId)
        // winnerDiv.text(`Winner: ${winnerPlayer.playerId} (${Math.round(winnerTeam.mmr.rating)} MMR)`)
        // gameResult.append(winnerDiv)
        //
        // const looserDiv = $('<div>')
        // const looserTeam = result.teamsAfterMmrUpdate.find(t => t.playerIds[0].playerId !== result.winner)
        // const looserPlayer = players.find(p => p.playerId === looserTeam.playerIds[0].playerId)
        // looserDiv.text(`Looser: ${looserPlayer.playerId} (${Math.round(looserTeam.mmr.rating)} MMR)`)
        // gameResult.append(looserDiv)
        // gameResult.show()
      });

      this.connection.on('PartialResultReported', () => {
        console.log('match partially reported')
        this.waitingForGameEnd = false
      });

      this.connection.on('MatchReportFailed', () => {
        console.log('match report failed')
        this.waitingForGameEnd = false
        this.isSearchingForOpponent = false
      });

      this.connection.on('Enqueued', () => {
        console.log('enqueued')
        this.isSearchingForOpponent = true
      });

      this.connection.on('EnqueueFailed', () => {
        console.log('enqueue failed')
        this.isSearchingForOpponent = false
        this.waitingForGameEnd = false
      })

      this.connection.on('MatchFound', (res: Match) => {
        console.log('match found')
        this.$store.direct.commit.game.FOUND_MATCH(res)
        //
        // matchId = res.matchId
        //
        // const player1Slot = $('<div>')
        // let team1 = res.teams[0];
        // let playerId1 = team1.playerIds[0];
        // const player1 = players.find(p => p.playerId === playerId1.playerId)
        // player1Slot.text(`${player1.playerId} (${Math.round(team1.mmr.rating)} MMR)`)
        // gameFound.append(player1Slot)
        // const vsSlot = $('<div>')
        // vsSlot.text("VS")
        // gameFound.append(vsSlot)
        //
        // const player2Slot = $('<div>')
        // let team2 = res.teams[1];
        // let playerId2 = team2.playerIds[0];
        // const player2 = players.find(p => p.playerId === playerId2.playerId)
        // player2Slot.text(`${player2.playerId} (${Math.round(team2.mmr.rating)} MMR)`)
        // gameFound.append(player2Slot)
        //
        // gameFound.show()
        // startGameButton.show()
        // onlinePlayerList.hide()
        // searchField.hide()
      });

      this.connection.on('LoggedIn', (res: any) => {
        this.isLoggedIn = true
        this.$store.direct.commit.game.SET_PLAYERS_ONLINE(res.onlinePlayers)
      });

      this.connection.start().then(() => {
        const player = this.$store.direct.state.player.selectedPlayer
        this.connection.invoke('LoginAs', player)
      })
    }

    beforeDestroy() {
      console.log("now closing")
      this.connection.stop()
      this.$store.direct.commit.game.SET_PLAYERS_ONLINE([])
    }
  }
</script>
