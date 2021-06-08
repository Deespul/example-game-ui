<template>
  <v-container>
    <v-card>
      <v-card-title v-if="!isGameStarted">
        Players online
      </v-card-title>
      <v-data-table
        v-if="!isGameStarted"
        :headers="tableHeaders"
        :items="playersOnline"
        :loading="!isLoggedIn"
      >
      </v-data-table>
      <div v-if="waitingForGameEnd">Waiting for opponent...</div>

      <v-container v-if="isLoggedIn && !currentMatch && !isGameStarted" >
        <v-btn @click="searchForGame">
          <span v-if="isSearchingForOpponent">Searching game...</span>
          <span v-else>Search for Game</span>
        </v-btn>
      </v-container>

      <v-container v-if="isLoggedIn && currentMatch && !isGameStarted && !waitingForGameEnd" >
        <v-container>
          <v-card-title>Found Game!</v-card-title>
          <v-container v-for="(team, index) in matchTeams" :key="team.teamId">
            <v-container v-if="index !== 0">VS</v-container>
            <v-container v-for="player in team.players" :key="player.playerId.playerId">
              {{ player.playerId.playerId }} ({{ player.mmr.rating }} MMR)
            </v-container>
          </v-container>
        </v-container>
        <v-btn @click="startGame">
          Start Game
        </v-btn>
      </v-container>

      <v-btn class="click-button" :style="[randomLocation]" v-if="isGameStarted" @click="countClick">
        Click me
      </v-btn>

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
    isGameStarted = false
    gameReported = false
    clickCounter = 0
    gameStartTimer = 0
    connection!: HubConnection
    randomLocation = {
      left: "500px",
      top: "400px"
    }

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
      this.gameReported = false
      this.$store.direct.commit.game.SET_CURRENT_MATCH(null)
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

    get matchTeams() {
      return this.currentMatch?.teams ?? []
    }

    get currentMatch() {
      return this.$store.direct.state.game.currentMatch
    }

    public countClick() {
      this.clickCounter++
      this.moveClickButton()
      if (this.clickCounter >= 3) {
        const gameEnd = performance.now()
        const diff = gameEnd - this.gameStartTimer

        this.connection.invoke('ReportGame', diff, this.currentMatch?.matchId ?? '')
      }
    }

    public moveClickButton() {
      const width = window.innerWidth - 200
      const height = window.innerHeight - 160
      this.randomLocation = {
        left: `${Math.random() * width}px`,
        top: `${Math.random() * height}px`
      }
    }

    public startGame() {
      this.isGameStarted = true
      this.clickCounter = 0;

      this.moveClickButton()

      this.gameStartTimer = performance.now()
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

      this.connection.on('MatchFinished', (res: Match) => {
        console.log('match finished')
        this.isGameStarted = false
        this.gameReported = true
        this.$store.direct.commit.game.SET_CURRENT_MATCH(res)
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
        this.waitingForGameEnd = true
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
        this.$store.direct.commit.game.SET_CURRENT_MATCH(res)
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
<style>
  .click-button {
    position: absolute !important;
    z-index: 5000;
  }
</style>
