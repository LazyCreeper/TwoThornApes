<!--
Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->
<template>
  <el-container v-loading="viewLoading">
    <!-- Manage users phone screen menu bar -->
    <el-drawer
      v-if="isTopPermission"
      size="240"
      v-model="drawer"
      :with-header="false"
      direction="ltr"
      style="padding: 0"
    >
      <el-aside width="240px" style="height: 100%">
        <Aside />
      </el-aside>
    </el-drawer>
    <!-- Manage users Computer screen menu bar -->
    <div v-if="isTopPermission" id="app-menu" class="only-pc-display">
      <el-aside width="240px" style="height: 100%">
        <Aside />
      </el-aside>
    </div>

    <el-container>
      <el-main>
        <div :class="{ 'max-width-limit': !isTopPermission }">
          <el-row>
            <el-col>
              <Header v-bind:breadcrumbsList="breadCrumbs" :aside="toAside" />
            </el-col>
          </el-row>
          <div
            v-loading="loading"
            style="min-height: 50px"
            element-loading-background="rgba(0, 0, 0, 0.5)"
          >
            <router-view v-if="!loading"></router-view>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "../components/Aside";
import Header from "../components/Header/index.vue";
import { setupUserInfo } from "./service/protocol.js";
import router from "./router";
import store from "./store";

export default {
  name: "App",
  components: { Aside, Header },
  data() {
    return {
      loading: true,
      viewLoading: false,
      breadCrumbs: [],
      mode: 1,
      drawer: false
    };
  },
  provide() {
    return {
      appLoading: (v) => {
        this.viewLoading = v;
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    isTopPermission() {
      return this.$store.state.userInfo?.permission >= 10;
    }
  },
  methods: {
    toAside() {
      this.drawer = !this.drawer;
    }
  },

  async created() {
    let needToRoot = false;

    // If not installed, must route to /install
    const statusInfo = store.state.panelStatus;
    if (statusInfo?.isInstall === false) {
      this.loading = false;
      setTimeout(() => router.push({ path: "/install" }), 1200);
      return;
    }
    try {
      // After the first refresh, try to get user data once
      // If it fails, navigate to / view to further decide the jump route
      await setupUserInfo();
      const userInfo = this.$store.state.userInfo;
      if (!userInfo || !userInfo.uuid) throw new Error("userInfo.uuid is null");
    } catch (error) {
      console.log("App.vue redirected to root.vue");
      needToRoot = true;
    }

    this.loading = false;
    localStorage.setItem("lastPath", window.location.hash);
    if (needToRoot) return router.push({ path: "/" });
  },

  async mounted() {
    router.beforeEach((to, from, next) => {
      this.breadCrumbs = [
        {
          title: to.name,
          path: to.fullPath
        }
      ];
      this.drawer = false;
      next();
    });
  }
};
</script>

<style scoped>
.max-width-limit {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
