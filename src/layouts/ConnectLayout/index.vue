<template>
  <section id="container">
    <connect-header class="topbar" />

    <nav>
      <unnnic-sidebar-primary
        :expanded="false"
        :items="getSidebarItems"
        class="primary-sidebar"
        language="pt-br"
        hideText="Encolher"
      >
        <template #header>
          <img src="../../assets/weni-logo.svg" alt="Weni's Logo" />
        </template>
      </unnnic-sidebar-primary>
    </nav>
    <div class="view">
      <slot />
    </div>
  </section>
</template>

<script>
import { unnnicSidebarPrimary } from '@weni/unnnic-system';

import ConnectHeader from './components/ConnectHeader';

export default {
  name: 'ConnectLayout',

  components: {
    unnnicSidebarPrimary,
    ConnectHeader,
  },

  computed: {
    getSidebarItems() {
      const items = [
        {
          label: 'Menu principal',
          items: [
            {
              label: 'Início',
              icon: 'house-1-1',
            },
            {
              label: 'Dashboard',
              icon: 'gauge-dashboard-2',
              active: this.route === 'dashboard',
              click: () => {
                this.$router.push('/dashboard/manager');
              },
            },
          ],
        },
        {
          label: 'Sistemas',
          items: [
            { label: 'Fluxos', active: false, icon: 'hierarchy-3-2' },
            { label: 'Inteligência Artificial', active: false, icon: 'science-fiction-robot-2' },
            {
              label: 'Chats',
              active: this.route === 'chats',
              click: () => {
                this.$router.push('/');
              },
              icon: 'messaging-we-chat-3',
            },
          ],
        },
        {
          label: 'Projeto',
          items: [
            {
              label: 'Configurações',
              icon: this.route === 'settings' ? 'cog-2' : 'cog-1',
              active: this.route === 'settings',
              click: () => {
                this.$router.push('/settings');
              },
            },
          ],
        },
      ];

      return items;
    },
    route() {
      const routes = ['dashboard', 'settings'];

      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const route of routes) {
        if (this.$route.path.includes(route)) return route;
      }

      return 'chats';
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  min-height: 100vh;
  max-height: 100vh;
  height: 100vh;

  display: grid;
  grid-template-rows: 5.5rem 1fr;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    'primary-sidebar topbar'
    'primary-sidebar view';

  .topbar {
    grid-area: topbar;
  }

  .primary-sidebar {
    height: 100vh;
    grid-area: primary-sidebar;
  }

  .view {
    height: calc(100vh - 5.5rem);
    max-height: calc(100vh - 5.5rem);
    grid-area: view;
  }
}
</style>
