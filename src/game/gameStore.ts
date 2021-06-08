import { ActionContext } from "vuex";
import {RootState} from "@/store/rootState";
import {moduleActionContext} from "@/store/store";
import {GameState} from "@/game/game.types";

const mod = {
    namespaced: true,
    state: {
    } as GameState,
    actions: {
        async loadStuff(
            context: ActionContext<GameState, RootState>
        ) {
            const {commit, rootGetters } = moduleActionContext(context, mod);
        },
    },
    mutations: {
    },
} as const;

export default mod;
