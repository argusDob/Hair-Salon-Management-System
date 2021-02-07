<template>
<div id="app">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <nav-top-bar></nav-top-bar>
  <nav-side-bar></nav-side-bar>
  <router-view :class="contentStatusSidebar"></router-view>
</div>
</template>

<script>
// import Navbar from './components/Navbar'
export default {
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
.sidebarhide {
  margin-left: 15.5em;
  -webkit-transition: all 1s ease-in-out;
  -moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}
.sidebarshow {
  margin-left: 0px;
  -webkit-transition: all 1s ease-in-out;
  -moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

@media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 812px) 
  and (-webkit-min-device-pixel-ratio: 3) { 
.sidebarhide { margin-left: 50px; }

}
</style>
