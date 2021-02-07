<template>
  <div>
    <b-sidebar
      v-if="ISAUTHENTICATE"
      id="app-side-bar"
      class
      sidebar-class="border-right border-light not-collapsed"
      bg-variant="dark"
      v-model="isOpen"
      shadow
    >
      <div class="d-flex justify-content-center">
        <b-avatar variant="primary" size="4rem">{{ USERNAME.charAt(0).toUpperCase() }}</b-avatar>

        <!-- <strong>
          <h4 class="text-light">
            <router-link :to="{ name: 'userboard'}">{{ USERNAME }}</router-link>
          </h4>
        </strong> -->
      </div>
      <div class="d-flex flex-column justify-content-between mt-5">
        <b-list-group-item
          class="d-flex mb-1"
          v-for="item in menuItems"
          :key="item.title"
          :href="item.path"
          noCloseOnRouteChange
        >
          <span :class="item.icon" aria-hidden="true"></span>
          <div class>{{ item.title }}</div>
        </b-list-group-item>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "nav-side-bar",
  data() {
    return {
      statusSidebar: false,
      isOpen: false,
      menuItems: [
        {
          title: "Dashboard",
          path: "/books",
          icon: "fas fa-tachometer-alt mr-4"
        },
        {
          title: "Clients",
          path: "/books",
          icon: "fas fa-user mr-4"
        },
        {
          title: "Staff",
          path: "/employee",
          icon: "fas fa-user-friends mr-4"
        },
        {
          title: "Services",
          path: "/books",
          icon: "fas fa-table mr-4"
        },
        {
          title: "Settings",
          path: "/books",
          icon: "fas fa-cogs mr-4"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("authentication", ["USERNAME", "ISAUTHENTICATE"])
  },
  watch: {
    name() {}
  },
  methods: {
    ...mapMutations("navBar", ["SET_NAV_BAR_STATUS"])
  },
  created: function() {
    this.$store.commit("navBar/SET_NAV_BAR_STATUS", this.isOpen);
    // burgerMenuSidebar() {
    //   this.statusSidebar = !this.statusSidebar;
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.list-group-item {
  background-color: inherit !important;
  color: white !important;
}
.list-group-item:hover {
  background-color: #686868 !important;
}
.v-b-toggle {
  display: block !important;
}
.b-sidebar {
  width: 15em !important;
  height: 130vh !important;
  display: block;
}

@media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 812px) 
  and (-webkit-min-device-pixel-ratio: 3) { 
.b-sidebar {
  width: 50px !important;
  margin-left: 0px!important;
}
.b-avatar {
 display: none !important;
}
  }
</style>