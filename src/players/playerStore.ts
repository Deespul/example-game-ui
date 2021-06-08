import {ActionContext} from "vuex";
import {Player, PlayerState} from "@/players/players.types";
import {RootState} from "@/store/rootState";
import {moduleActionContext} from "@/store/store";

const mod = {
    namespaced: true,
    state: {
        players: [] as Player[],
        isLoadingPlayers: true,
        selectedPlayer: null,
    } as PlayerState,
    actions: {
        async loadPlayers(
            context: ActionContext<PlayerState, RootState>
        ) {
            const {commit, rootGetters } = moduleActionContext(context, mod);
            commit.SET_LOADING_PLAYERS(true)

            const players = await rootGetters.playerService.loadPlayers()
            commit.SET_PLAYERS(players);
            commit.SET_LOADING_PLAYERS(false)
        },
    },
    mutations: {
        SET_PLAYERS(state: PlayerState, players: Player[]) {
            state.players = players;
        },
        SET_SELCTED_PLAYER(state: PlayerState, selectedPlayer: Player | null) {
            state.selectedPlayer = selectedPlayer;
        },
        SET_LOADING_PLAYERS(state: PlayerState, isLoadingPlayers: boolean) {
            state.isLoadingPlayers = isLoadingPlayers;
        },
    },
} as const;

export default mod;
