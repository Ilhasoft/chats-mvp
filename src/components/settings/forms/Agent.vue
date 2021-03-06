<template>
  <section class="form-agent">
    <section class="section">
      <p class="title">Adicionar novo Agente</p>

      <section class="controls">
        <unnnic-autocomplete
          v-model="agent.name"
          :data="projectAgents"
          @choose="agent.name = $event"
          @keypress.enter="addAgent"
          label="Selecionar agente"
          placeholder="Pesquise pelo nome"
          iconLeft="search-1"
          iconRight="keyboard-return-1"
          open-with-focus
          highlight
          class="input"
        />
      </section>
    </section>

    <section class="section">
      <p class="title">Selecionar filas para o agente</p>

      <section class="controls">
        <unnnic-autocomplete
          v-model="queue"
          :data="queues.map((q) => q.name)"
          @keypress.enter="addAgentQueue"
          label="Selecionar filas"
          placeholder="Pesquise pelo nome da fila"
          iconLeft="search-1"
          iconRight="keyboard-return-1"
          open-with-focus
          highlight
          class="input"
        />
        <unnnic-button type="secondary" text="Adicionar fila" @click="addAgentQueue" />
      </section>

      <section class="agent-queues">
        <div v-for="queue in agent.queues" :key="queue.name" class="queue">
          {{ queue.name }}
        </div>
      </section>
    </section>

    <unnnic-button
      class="new-agent-button"
      type="secondary"
      text="Salvar novo agente"
      @click="addAgent"
    />

    <section v-if="!!agents.length">
      <list-agents :agents="agents" :title="`Agentes no setor ${sector}`" />
    </section>

    <unnnic-modal
      v-if="agents.length"
      :showModal="isOpenAgentConfirmationDialog"
      text="Agente adicionado"
      modal-icon="check-circle-1-1"
      :description="`${agents.at(-1).name} foi adicionado ao ${sector}`"
      @close="isOpenAgentConfirmationDialog = false"
    >
      <template #options>
        <unnnic-button text="Fechar" @click="isOpenAgentConfirmationDialog = false" />
      </template>
    </unnnic-modal>
  </section>
</template>

<script>
import ListAgents from '@/components/settings/lists/Agents';

export default {
  name: 'FormAgent',

  components: {
    ListAgents,
  },

  props: {
    queues: {
      type: Array,
      default: () => [],
    },
    sector: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    agent: {
      name: '',
      queues: [],
    },
    projectAgents: [
      'Mariano Matos',
      'Carla Meyer',
      'Katia Saldanha',
      'Vinícius Brum',
      'Raine Paula',
    ],
    queue: '',
    isOpenAgentConfirmationDialog: false,
  }),

  computed: {
    agents: {
      get() {
        return this.value;
      },
      set(agents) {
        this.$emit('input', agents);
      },
    },
  },

  methods: {
    addAgent() {
      const name = this.agent.name.trim();
      if (!name) return;

      this.agents.push({
        name,
        queues: this.agent.queues,
        additionDate: Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date()),
      });

      this.agent.name = '';
      this.agent.queues = [];

      this.isOpenAgentConfirmationDialog = true;
    },
    addAgentQueue() {
      const queue = this.queues.find((q) => q.name === this.queue);

      this.agent.queues.push(
        queue || {
          name: this.queue,
          createdAt: Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
          }).format(new Date()),
        },
      );

      this.queue = '';
    },
    validate() {
      return this.agents.length > 0;
    },
  },

  watch: {
    agents: {
      deep: true,
      immediate: true,
      handler() {
        this.$emit('validate', this.validate());
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.form-agent {
  .section {
    margin-bottom: 1.5rem;
  }

  .title {
    font-weight: $unnnic-font-weight-bold;
    color: $unnnic-color-neutral-dark;
    font-size: $unnnic-font-size-body-lg;
    line-height: 1.5rem;

    margin-bottom: 0.5rem;
  }

  .controls {
    display: flex;
    align-items: flex-end;
    gap: 1rem;

    .input {
      flex: 1 1;
    }
  }

  .agent-queues {
    margin-top: 1rem;
    display: grid;
    gap: 0.5rem 1rem;
    grid-template-columns: 1fr 1fr;

    & > * {
      padding: 0.25rem 0.5rem;
      margin: 0 0.5rem;
      background: $unnnic-color-background-carpet;
      color: $unnnic-color-neutral-dark;
      font-size: 0.875rem;
      line-height: 1.375rem;
    }
  }

  .new-agent-button {
    width: 100%;
    margin-bottom: 1.5rem;
  }
}
</style>
