export interface QueueState {
    queues: Queue[],
    isLoadingQueues: boolean,
    selectedQueue: Queue | null
}

export interface Queue {
    teamSizes: TeamSize[],
    queueId: string,
    name: string,
    queued: number,
    allowedFactions: string[],
}

export class TeamSize {
    constructor(size: number) {
        this.size = size
    }

    size: number
}

