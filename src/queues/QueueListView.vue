<template>
  <v-container>
    <v-card>
      <v-card-title>
        Queues
        <v-spacer></v-spacer>
      </v-card-title>
      <v-data-table
        class="row-pointer"
        :loading="isLoadingQueues"
        :headers="tableHeaders"
        :items="queues"
        @click:row="selectQueue"
      >
        <template v-slot:item.teamSizes="{ item }">
          {{ item.teamSizes.map(i => i.size).join(", ") }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from "vue-property-decorator";
  import {Queue} from "@/queues/queues.types";

  @Component({
    components: {}
  })
  export default class QueueListView extends Vue {
    get isLoadingQueues() {
      return this.$store.direct.state.queue.isLoadingQueues
    }

    get queues() {
      return this.$store.direct.state.queue.queues
    }

    public selectQueue(q: Queue) {
      this.$store.direct.commit.queue.SET_SELECTED_QUEUE(q)
    }

    tableHeaders = [
      { text: 'Name', align: 'start', value: 'name' },
      { text: 'Team Sizes', value: 'teamSizes' },
      { text: 'Team Constellation', value: 'teamConstellation' },
      { align: 'end', value: 'edit' },
    ]
  }
</script>
<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
