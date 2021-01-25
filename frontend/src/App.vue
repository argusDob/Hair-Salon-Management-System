
<template>
<div id="app">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <nav-top-bar></nav-top-bar>
  <nav-side-bar></nav-side-bar>
  <notifier></notifier>
  <router-view :class="contentStatusSidebar"></router-view>
</div>
</template>

<script>
// import Navbar from './components/Navbar'
import Notifier from "./components/Notifier";
export default {
  components: { Notifier },
  data() {
    return {
      statusSidebar: false
    };
  },

  computed: {
    contentStatusSidebar() {
      return this.statusSidebar ? "sidebarhide" : "sidebarshow";
    }
  },
  methods: {
    burgerMenuSidebar() {
      this.statusSidebar = !this.statusSidebar;
    },
 
  }
};
</script>

<style>
#app {
  margin: 20px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.sidebarshow {
  margin-left: 15.5em;
  -webkit-transition: all 1s ease-in-out;
  -moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.sidebarhide {
  margin-left: 0px;
  -webkit-transition: all 1s ease-in-out;
  -moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}
</style>