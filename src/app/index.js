// Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>

import { createApp } from "vue";
import i18n from "./i18n";
import elementPlus from "element-plus";
import store from "./store";
import router from "./router";

import "element-plus/dist/index.css";
import "element-plus/theme-chalk/display.css";
import "../assets/css/element-variables.scss";
import "../assets/css/common.css";
import "../assets/css/tools.css";
import "../assets/css/responsive.css";
import "../assets/css/action.css";
import { requestPanelStatus } from "./service/protocol.js";

import App from "./App.vue";
import directive from "./directive";

import ItemGroup from "../components/ItemGroup.vue";
import FunctionGroup from "../components/FunctionGroup.vue";
import FunctionGroupComponent from "../components/FunctionGroupComponent.vue";
import Panel from "../components/Panel.vue";

if (localStorage.getItem("customSkin")) {
  document.getElementById(
    "linkSkinCss"
  ).innerHTML = `<link type="text/css" rel="stylesheet" href="${localStorage.getItem(
    "customSkin"
  )}?t_=${Date.now()}">`;
} else {
  if (localStorage.getItem("skin")) {
    document.getElementById(
      "linkSkinCss"
    ).innerHTML = `<link type="text/css" rel="stylesheet" href="./static/skins/${localStorage.getItem(
      "skin"
    )}.css?t_=${Date.now()}">`;
  } else {
    document.getElementById(
      "linkSkinCss"
    ).innerHTML = `<link type="text/css" rel="stylesheet" href="./static/skins/default.css?t_=${Date.now()}">`;
  }
}

async function main() {
  try {
    const statusInfo = await requestPanelStatus();
    if (statusInfo.language) {
      console.log("SET LANGUAGE:", statusInfo.language, statusInfo, i18n);
      i18n.global.locale = statusInfo.language;
    } else {
      i18n.global.locale = "en_us";
    }
    await initVueApp();
  } catch (error) {
    alert(`Error: ${error.message}, Please refresh!`);
    console.error(error);
  }
}

async function initVueApp() {
  const app = createApp(App);
  app.use(i18n);
  app.use(store);
  app.use(router);
  app.use(elementPlus);

  directive(app);

  app.component("Panel", Panel);
  app.component("ItemGroup", ItemGroup);
  app.component("FunctionGroup", FunctionGroup);
  app.component("FunctionComponent", FunctionGroupComponent);

  window.removeLoadingPage();

  app.mount("#app");
}

main();
