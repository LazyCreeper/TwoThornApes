<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->

<template>
  <el-menu
    class="page-el-menu"
    mode="vertical"
    :router="true"
    :uniqueOpened="false"
    background-color="#30313300"
    text-color="#fff"
    active-text-color="#ffd04b"
    style="height: 100%; padding: 0px 0px"
    :default-active="$route.meta.activeMenu || $route.path"
  >
    <el-scrollbar>
      <Logo></Logo>
      <el-menu-item-group>
        <template #title>{{ $t("aside.basic") }}</template>
        <el-menu-item key="/overview" index="/overview">
          <i class="el-icon-pie-chart"></i>
          <template #title>{{ $t("router.overview") }}</template>
        </el-menu-item>
        <el-menu-item key="/instances" index="/instances">
          <i class="el-icon-coin"></i>
          <template #title>{{ $t("router.instances") }}</template>
        </el-menu-item>
        <el-menu-item key="/quickstart" index="/quickstart">
          <i class="el-icon-circle-plus-outline"></i>
          <template #title>{{ $t("router.quickStart") }}</template>
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <template #title>{{ $t("aside.advanced") }}</template>
        <el-menu-item key="/services" index="/services">
          <i class="el-icon-connection"></i>
          <template #title>{{ $t("aside.node") }}</template>
        </el-menu-item>
        <el-menu-item key="/users" index="/users">
          <i class="el-icon-user"></i>
          <template #title>{{ $t("aside.user") }}</template>
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group v-if="isBusinessMode">
        <template #title>{{ $t("router.extension") }}</template>
        <el-menu-item key="/store" index="/store">
          <i class="el-icon-shopping-bag-1"></i>
          <template #title>{{ $t("router.store") }}</template>
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <template #title>{{ $t("aside.more") }}</template>
        <el-menu-item key="/settings" index="/settings">
          <i class="el-icon-setting"></i>
          <template #title>{{ $t("router.settings") }}</template>
        </el-menu-item>
        <el-menu-item v-if="hasElectron()" @click="toElectronUI">
          <i class="el-icon-postcard"></i>
          <template #title>{{ $t("aside.backElectronMain") }}</template>
        </el-menu-item>
        <el-menu-item v-if="hasElectron()" @click="toBrowser">
          <i class="el-icon-position"></i>
          <template #title>{{ $t("aside.toBrowser") }}</template>
        </el-menu-item>
      </el-menu-item-group>
    </el-scrollbar>
  </el-menu>
</template>

<script>
import router from "../app/router";
import Logo from "../components/Logo.vue";
import { hasElectron } from "@/app/utils/electron";
export default {
  components: {
    Logo
  },
  data: function () {
    return {};
  },
  watch: {},
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    isTopPermission() {
      return this.$store.state.userInfo.permission >= 10;
    },
    isBusinessMode() {
      return this.$store.state.panelStatus.settings.businessMode;
    }
  },
  methods: {
    hasElectron,
    toRouter(path) {
      router.push({
        path
      });
    },
    toElectronUI() {
      window.electionApi.openHome();
    },
    toBrowser() {
      window.electionApi.openBrowser();
    }
  },
  mounted() {}
};
</script>

<style scoped>
.logo-wrapper {
  margin: 22px 0px;
  text-align: center;
}
.page-el-menu {
  backdrop-filter: var(--cd-blur);
  transition: all 0.4s;
}

.page-el-menu:hover {
  background-position-x: 50px;
}
</style>
