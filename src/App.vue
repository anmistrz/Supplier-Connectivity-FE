<!--
=========================================================
* Vue Argon Dashboard 2 - v3.0.0
=========================================================

* Product Page: https://creative-tim.com/product/vue-argon-dashboard
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
-->
<template>
  <div
    v-show="this.$store.state.layout === 'landing'"
    class="landing-bg h-100 bg-gradient-primary position-fixed"
  ></div>
  <sidenav
    :custom_class="this.$store.state.mcolor"
    :class="[this.$store.state.isTransparent, 'fixed-start']"
    v-if="this.$store.state.showSidenav"
  />
  <main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
  >
    <!-- nav -->
    <navbar
      :class="[navClasses]"
      :textWhite="
        this.$store.state.isAbsolute ? 'text-white opacity-8' : 'text-white'
      "
      :minNav="navbarMinimize"
      v-if="this.$store.state.showNavbar"
    />
    <router-view />
    <app-footer v-show="this.$store.state.showFooter" />
    <configurator
      :toggle="toggleConfigurator"
      :class="[
        this.$store.state.showConfig ? 'show' : '',
        this.$store.state.hideConfigButton ? 'd-none' : '',
      ]"
    />
  </main>
</template>
<script>
import '@/dist/bootstrap.min.js';
import d$auth from '@/stores/auth.d';
import Sidenav from '@/examples/Sidenav/index.vue';
import Configurator from '@/examples/Configurator.vue';
import Navbar from '@/examples/Navbars/Navbar.vue';
import AppFooter from '@/examples/Footer.vue';
import { mapMutations } from 'vuex';
import { mapActions } from 'pinia';

export default {
  name: 'App',
  components: {
    Sidenav,
    Configurator,
    Navbar,
    AppFooter,
  },
  methods: {
    ...mapMutations(['toggleConfigurator', 'navbarMinimize']),
    ...mapActions(d$auth, ['a$setUser']),
  },
  computed: {
    navClasses() {
      return {
        'position-sticky bg-white left-auto top-2 z-index-sticky':
          this.$store.state.isNavFixed && !this.$store.state.darkMode,
        'position-sticky bg-default left-auto top-2 z-index-sticky':
          this.$store.state.isNavFixed && this.$store.state.darkMode,
        'position-absolute px-4 mx-0 w-100 z-index-2':
          this.$store.state.isAbsolute,
        'px-0 mx-4': !this.$store.state.isAbsolute,
      };
    },
  },
  beforeMount() {
    this.$store.state.isTransparent = 'bg-transparent';
  },
  mounted() {
    this.a$setUser();
  },
};
</script>
