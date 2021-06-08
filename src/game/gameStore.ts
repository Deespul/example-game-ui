import { ActionContext } from "vuex";
import {RootState} from "@/store/rootState";
import {moduleActionContext} from "@/store/store";
import {GameState, Match} from "@/game/game.types";
import {Player} from "@/players/players.types";

const mod = {
    namespaced: true,
    state: {
      onlinePlayers: [],
      currentMatch: null
    } as GameState,
    actions: {
        async loadStuff(
            context: ActionContext<GameState, RootState>
        ) {
            const {commit, rootGetters } = moduleActionContext(context, mod);
        },
    },
    mutations: {
        SET_CURRENT_MATCH(state: GameState, currentMatch: Match | null) {
            state.currentMatch = currentMatch;
        },
        SET_PLAYERS_ONLINE(state: GameState, playersOnline: Player[]) {
            state.onlinePlayers = playersOnline;
        },
        ADD_ONLINE_PLAYER(state: GameState, player: Player) {
            const cleanPlayers = [...state.onlinePlayers.filter(p => p.playerId !== player.playerId)]
            state.onlinePlayers = [...cleanPlayers, player];
        },
        REMOVE_ONLINE_PLAYER(state: GameState, player: Player) {
            state.onlinePlayers = [...state.onlinePlayers.filter(p => p.playerId !== player.playerId)];
        },
    },
} as const;

export default mod;
