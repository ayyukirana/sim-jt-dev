<template>
  <div>
    <v-navigation-drawer :clipped="clipped" v-model="drawer" enable-resize-watcher app>
      <v-toolbar class="red darken-3">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/lego/2.jpg">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">{{ username }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-tile v-for="item in items" :key="item.title" :to="{path: item.path}">
          <v-list-tile-action>
            <v-icon>{{ item.action }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <AdminNav/>
        <v-divider></v-divider>
        <v-list-tile @click="logout" >
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Logout
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="red darken-3 white--text" fixed app :clipped-left="clipped">
      <v-toolbar-side-icon id="minimize-menu" @click.stop="drawer = !drawer" class="white--text"></v-toolbar-side-icon>
      <v-toolbar-title>Menu</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="white--text" icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>

  </div>

</template>

<script>
import AdminNav from './AdminNavigation.vue';

export default {
  components: {
    AdminNav,
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      drawer: false,
      clipped: false,
      items: [
        {
          action: 'home',
          title: 'Home',
          path: '/',
        },
        {
          action: 'dashboard',
          title: 'Dashboard',
          path: '/orders',
        },
        {
          action: 'assessment', 
          title: 'Mitra Review', 
          path: '/mitra-review'
        },
        {
          action: 'person', 
          title: 'My Account', 
          path: '/my-account',
        },
        {
          action: 'feedback', 
          title: 'About Page', 
          path: '/about',
        },
      ],
    };
  },
  methods: {
    logout() {
      if(confirm('Logging out, are you sure?')) {
      this.$store.dispatch('logout')
        .then(this.$router.go('/login'));
      }
    }
  }
};

</script>
