import axios from "axios";
import {MATCHBOX_API} from "@/main";
import {Player} from "@/players/players.types";

export default class PlayerService {
    async loadPlayers(): Promise<Player[]> {
        const players = await axios.get(`${MATCHBOX_API}players?api_key=secret`);
        return players.status !== 200 ? [] : players.data;
    }
}
