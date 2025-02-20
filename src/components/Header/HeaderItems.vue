<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->

<template>
  <ItemGroup :lr="true">
    <div class="el-dropdown-link">
      <el-tooltip
        class="item"
        effect="dark"
        :content="$t('settings.selectSkin.title')"
        placement="bottom"
      >
        <el-dropdown style="margin: 0px 0px" :lr="true">
          <span>
            <i class="el-icon-brush"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in skins" @click="setSkin(item.fileName)" :key="item">{{
                item.name
              }}</el-dropdown-item>
              <el-dropdown-item @click="setCustomSkin()">{{
                $t("settings.selectSkin.custom")
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </div>

    <div v-if="!isTopPermission" class="el-dropdown-link" @click="toStore">
      <el-tooltip class="item" effect="dark" :content="$t('router.store')" placement="bottom">
        <el-link :underline="false">
          <i class="el-icon-shopping-bag-1"></i>
        </el-link>
      </el-tooltip>
    </div>

    <div class="el-dropdown-link" @click="toPrivate">
      <el-tooltip class="item" effect="dark" :content="$t('root.private')" placement="bottom">
        <el-link :underline="false">
          <i class="el-icon-user"></i>
        </el-link>
      </el-tooltip>
    </div>

    <div class="el-dropdown-link">
      <el-tooltip class="item" effect="dark" :content="$t('root.logout')" placement="bottom">
        <el-popconfirm :title="$t('terminal.confirmOperate')" @confirm="logout">
          <template #reference>
            <el-link :underline="false">
              <i class="el-icon-switch-button"></i>
            </el-link>
          </template>
        </el-popconfirm>
      </el-tooltip>
    </div>
  </ItemGroup>
</template>

<script>
import router from "@/app/router";
import { API_USER_LOGOUT } from "@/app/service/common";
import { request } from "@/app/service/protocol";

export default {
  props: {},
  data: function () {
    return {
      skins: []
    };
  },
  computed: {
    isTopPermission() {
      return this.$store.state.userInfo.permission >= 10;
    }
  },
  mounted() {
    this.getSkins();
  },
  methods: {
    setSkin(v = "") {
      localStorage.setItem("skin", v);
      document.getElementById(
        "linkSkinCss"
      ).innerHTML = `<link type="text/css" rel="stylesheet" href="./static/skins/${v}.css?t_=${Date.now()}">`;
      localStorage.setItem("customSkin", "");
      this.$message({ message: this.$t("fileManager.setSuccess"), type: "success" });
    },
    setCustomSkin() {
      this.$prompt(window.$t("settings.selectSkin.customUrl"), window.$t("CommonText.040"), {
        confirmButtonText: window.$t("CommonText.041"),
        cancelButtonText: window.$t("CommonText.042")
      }).then(({ value }) => {
        this.$message({
          type: "success",
          message: window.$t("fileManager.setSuccess")
        });
        document.getElementById(
          "linkSkinCss"
        ).innerHTML = `<link type="text/css" rel="stylesheet" href="${value}?t_=${Date.now()}">`;
        localStorage.setItem("customSkin", value);
      });
    },
    async getSkins() {
      this.skins = await request({
        method: "GET",
        url: "./static/skins/index.json?t_=" + Date.now()
      });
    },
    async refresh() {
      await this.render();
      this.$message({ message: this.$t("general.refreshFinish"), type: "success" });
    },
    toAside() {
      this.$props.aside();
    },
    toPrivate() {
      router.push({ path: "/private" });
    },
    toStore() {
      router.push({ path: "/store" });
    },
    async logout() {
      try {
        await request({
          method: "GET",
          url: API_USER_LOGOUT
        });
        window.location.href = "./";
        this.$notify({
          title: this.$t("root.logoutSuccess"),
          message: this.$t("root.logoutSuccessInfo"),
          type: "success"
        });
      } catch (error) {
        this.$notify({
          title: this.$t("root.logoutError"),
          message: error.message,
          type: "error",
          duration: 0
        });
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  transition: all 0.4s;
}
.box-card:hover {
  transform: scale(1.01);
}
.el-dropdown-link {
  display: inline-block;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  padding: 0px 2px;
  /* background-color: rgba(0, 0, 0, 0); */
  border-radius: 4px;
}
.el-dropdown-link:hover {
  padding: 0px 12px;
  backdrop-filter: brightness(0.75);
}

.el-dropdown-link i {
  font-weight: 400;
  font-size: 16px;
  color: #409eff;
}
</style>
