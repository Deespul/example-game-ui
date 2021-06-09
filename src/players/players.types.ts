export interface PlayerState {
    players: Player[],
    selectedPlayer: Player | null,
    isLoadingPlayers: boolean,
    isLoadingPlayerDetails: boolean,
    playerDetails: Player,
}

export interface Player {
    playerId: string,
    teams: Team[]
}

export interface PlayerIdentification {
    playerId: string,
    faction: string,
}

export interface Team {
    mmr: Mmr,
    queueId: string,
    teamId: string,
    players: PlayerIdentification[]
}

export interface Mmr {
    rating: number,
    ratingDeviation: number,
}
