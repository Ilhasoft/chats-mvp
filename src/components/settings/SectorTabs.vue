<template>
  <unnnic-tab v-model="tab" initialTab="sector" :tabs="tabs" class="sector-tabs">
    <template slot="tab-head-sector">
      <div class="form-tab">
        <span class="name">Setor</span>
        <unnnic-tool-tip enabled text="Setor é uma área dentro da sua organização" side="top">
          <unnnic-icon-svg icon="information-circle-4" scheme="neutral-soft" size="sm" />
        </unnnic-tool-tip>
      </div>
    </template>

    <template slot="tab-head-queues">
      <div class="form-tab">
        <span class="name">Filas</span>
        <unnnic-tool-tip
          enabled
          text="Fila é onde o cliente aguarda atendimento de acordo com sua demanda"
          side="top"
        >
          <unnnic-icon-svg icon="information-circle-4" scheme="neutral-soft" size="sm" />
        </unnnic-tool-tip>
      </div>
    </template>

    <template slot="tab-head-agents">
      <div class="form-tab">
        <span class="name">Agentes</span>
        <unnnic-tool-tip enabled text="Agentes atendem os clientes através do Chats" side="top">
          <unnnic-icon-svg icon="information-circle-4" scheme="neutral-soft" size="sm" />
        </unnnic-tool-tip>
      </div>
    </template>

    <template slot="tab-head-tags">
      <div class="form-tab">
        <span class="name">Tags</span>
        <unnnic-icon-svg icon="information-circle-4" scheme="neutral-soft" size="sm" />
      </div>
    </template>

    <template slot="tab-panel-sector">
      <slot name="sector" />
    </template>

    <template slot="tab-panel-queues">
      <slot name="queues" />
    </template>

    <template slot="tab-panel-agents">
      <slot name="agents" />
    </template>

    <template slot="tab-panel-tags">
      <slot name="tags" />
    </template>
  </unnnic-tab>
</template>

<script>
export default {
  name: 'SectorTabs',

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  mounted() {
    const { tab } = this.$route.query;

    if (this.tabs.includes(tab)) this.tab = tab;
  },

  data: () => ({
    tabs: ['sector', 'queues', 'agents', 'tags'],
  }),

  computed: {
    tab: {
      get() {
        return this.value;
      },
      set(tab) {
        this.$emit('input', tab);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.sector-tabs {
  .form-tab {
    display: flex;
    align-items: center;
    gap: $unnnic-spacing-stack-xs;

    .name {
      font-size: $unnnic-font-size-body-lg;
    }
  }
}
</style>
