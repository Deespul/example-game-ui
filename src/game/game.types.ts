import {Mmr, Player} from "@/players/players.types";

export interface GameState {
    onlinePlayers: Player[],
    currentMatch: Match | null,
    matchResult: Match | null,
}

export interface Match {
    matchId: string,
    winner: number,
    queueId: string,
    teams: MatchTeam[],
    teamsAfterMmrUpdate: MatchTeam[],
}

export interface MatchTeam {
    teamId: number,
    players: MatchPlayer[]
}

export interface MatchPlayer {
    playerId: string,
    faction: string,
    teamId: string,
    mmr: Mmr,
}
