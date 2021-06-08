import axios from "axios";
import {MATCHBOX_API} from "@/main";
import {Queue} from "@/queues/queues.types";

export default class QueueService {
    async loadQueues(): Promise<Queue[]> {
        const queues = await axios.get(`${MATCHBOX_API}queues?api_key=secret`);
        return queues.status !== 200 ? [] : queues.data;
    }
}
