import { ActionContext } from "vuex";
import {RootState} from "@/store/rootState";
import {moduleActionContext} from "@/store/store";
import {Queue, QueueState} from "@/queues/queues.types";

const mod = {
    namespaced: true,
    state: {
        selectedQueue: null,
        isLoadingQueues: true,
        queues: [] as Queue[]
    } as QueueState,
    actions: {
        async loadQueues(
            context: ActionContext<QueueState, RootState>
        ) {
            const {commit, rootGetters } = moduleActionContext(context, mod);
            commit.SET_LOADING_QUEUES(true)

            const queues = await rootGetters.queueService.loadQueues()
            commit.SET_QUEUES(queues);
            commit.SET_LOADING_QUEUES(false)
        },
    },
    mutations: {
        SET_LOADING_QUEUES(state: QueueState, isLoading: boolean) {
            state.isLoadingQueues = isLoading;
        },
        SET_SELECTED_QUEUE(state: QueueState, selectedQueue: Queue | null) {
            state.selectedQueue = selectedQueue;
        },
        SET_QUEUES(state: QueueState, queues: Queue[]) {
            state.queues = queues;
        }
    },
} as const;

export default mod;
