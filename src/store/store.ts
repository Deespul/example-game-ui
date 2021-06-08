import Vue from 'vue'
import Vuex from 'vuex'

import player from "../players/playerStore";
import queue from "../queues/queueStore";
import game from "../game/gameStore";
import {createDirectStore} from "direct-vuex";
import PlayerService from "@/players/PlayerService";
import QueueService from "@/queues/QueueService";
import {RootState} from "@/store/rootState";
import GameService from "@/game/GameService";

Vue.use(Vuex)
const playerService = new PlayerService()
const queueService = new QueueService()
const gameService = new GameService()

const mod = ({
  modules: {
    player,
    queue,
    game
  },
  state: {
  } as RootState,
  mutations: {},
  actions: {
  },
  getters: {
    playerService() {
      return playerService;
    },
    queueService() {
      return queueService;
    },
    gameService() {
      return gameService;
    },
  }
})

const { store, rootActionContext, moduleActionContext } = createDirectStore(
    mod
);

export default store;

export { rootActionContext, moduleActionContext };

export type AppStore = typeof store;

declare module "vuex" {
  interface Store<S> {
    direct: AppStore;
  }
}
