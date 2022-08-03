<!--
  Copyright (C) 2022 Suwings <Suwings@outlook.com>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  According to the AGPL, it is forbidden to delete all copyright notices, 
  and if you modify the source code, you must open source the
  modified source code.

  版权所有 (C) 2022 Suwings <Suwings@outlook.com>

  该程序是免费软件，您可以重新分发和/或修改据 GNU Affero 通用公共许可证的条款，
  由自由软件基金会，许可证的第 3 版，或（由您选择）任何更高版本。

  根据 AGPL 与用户协议，您必须保留所有版权声明，如果修改源代码则必须开源修改后的源代码。
  可以前往 https://mcsmanager.com/ 阅读用户协议，申请闭源开发授权等。
-->

<template>
  <Panel>
    <template #title>{{ $t("settings.setOperate") }}</template>
    <template #default>
      <div class="flex flex-space-between flex-align-items-center">
        <div>
          <ItemGroup>
            <el-button type="success" size="small" @click="updateSettings">{{
              $t("settings.updateSet")
            }}</el-button>
            <el-button type="" size="small" @click="refresh">{{ $t("general.refresh") }}</el-button>
          </ItemGroup>
        </div>
        <span class="color-gray hidden-md-and-down"
          >{{ $t("settings.updateSetInfo") }}&nbsp;&nbsp;</span
        >
      </div>
    </template>
  </Panel>

  <div v-if="settings">
    <Panel>
      <template #title>{{ $t("settings.basicSetting") }}</template>
      <template #default>
        <el-row :gutter="20">
          <el-col :md="12">
            <!-- <div class="system-index-block">
              <SystemIndex></SystemIndex>
            </div> -->
            <div class="config-item">
              <div class="sub-title">
                <p class="sub-title-title">{{ $t("settings.accessPort") }}</p>
                <p class="sub-title-info">
                  {{ $t("settings.accessPortInfo") }}
                </p>
              </div>
              <el-input :placeholder="$t('settings.inputNum')" v-model="settings.httpPort">
              </el-input>
            </div>
            <!-- <div class="config-item">
              <div class="sub-title">
                <p class="sub-title-title">面板数据转发端口</p>
                <p class="sub-title-info">
                  采用“面板端流量转发模式”时才使用此端口转发数据到守护进程端，必须开放此端口。
                </p>
              </div>
              <el-input placeholder="请必须填入数字" v-model="settings.dataPort"> </el-input>
            </div> -->
            <div class="config-item">
              <div class="sub-title">
                <p class="sub-title-title">{{ $t("settings.bindIP") }}</p>
                <p class="sub-title-info">
                  {{ $t("settings.bindIPInfo") }}
                </p>
              </div>
              <el-input :placeholder="$t('settings.inputIP')" v-model="settings.httpIp"> </el-input>
            </div>

            <div class="config-item">
              <div class="sub-title">
                <p class="sub-title-title">{{ $t("settings.loginPage") }}</p>
                <p class="sub-title-info">
                  {{ $t("settings.loginPageInfo") }}
                </p>
              </div>
              <el-input :placeholder="$t('settings.inputCopy')" v-model="settings.loginInfo">
              </el-input>
            </div>
          </el-col>

          <el-col :md="4"></el-col>
          <el-col :md="8">
            <div>
              <div class="sub-title">
                <p class="sub-title">{{ $t("settings.referenceLink") }}</p>
                <p class="sub-title-info">
                  {{ $t("settings.referenceLinksInfo") }}
                </p>
              </div>
              <!-- <a class="alink" href="http://">
                <p>面板设置配置手册</p>
              </a>
              <a class="alink">
                <p>反馈问题</p>
              </a> -->
            </div>
          </el-col>
        </el-row>
      </template>
    </Panel>
    <Panel>
      <template #title>{{ $t("settings.limitAndSecurity") }}</template>
      <template #default>
        <el-row :gutter="20">
          <el-col :md="12">
            <!-- <div class="config-item">
              <div class="sub-title">
                <p class="sub-title-title">解压缩功能实现方式</p>
                <p class="sub-title-info">命令实现方式 Windows 自带无需操作，Linux 则需要额外安装 zip/unzip 两个指令确保可用</p>
              </div>
              <el-select v-model="settings.zipType" placeholder="请选择">
                <el-option label="7z/unzip/zip 系统原生命令(效率高,需要额外安装)" :value="1"></el-option>
                <el-option label="Node 跨平台实现方式(效率低)" :value="2"></el-option>
              </el-select>
            </div> -->
            <div class="config-item">
              <div class="sub-title">
                <p class="sub-title-title">{{ $t("settings.canFileManager") }}</p>
                <p class="sub-title-info">
                  {{ $t("settings.canFileManagerInfo") }}
                </p>
              </div>
              <el-select
                v-model="settings.canFileManager"
                :placeholder="$t('general.pleaseSelect')"
              >
                <el-option :label="$t('general.allow')" :value="true"></el-option>
                <el-option :label="$t('general.forbid')" :value="false"></el-option>
              </el-select>
            </div>
            <div class="config-item">
              <div class="sub-title">
                <p class="sub-title-title">{{ $t("settings.crossAPI") }}</p>
                <p class="sub-title-info">
                  {{ $t("settings.crossAPIInfo") }}
                </p>
              </div>
              <el-select v-model="settings.crossDomain" :placeholder="$t('general.pleaseSelect')">
                <el-option :label="$t('general.enable')" :value="true"></el-option>
                <el-option :label="$t('general.forbid')" :value="false"></el-option>
              </el-select>
            </div>
            <div class="config-item">
              <div class="sub-title">
                <p class="sub-title-title">{{ $t("settings.loginCheckIp") }}</p>
                <p class="sub-title-info">
                  {{ $t("settings.loginCheckIpInfo") }}
                </p>
              </div>
              <el-select v-model="settings.loginCheckIp" :placeholder="$t('general.pleaseSelect')">
                <el-option :label="$t('general.enable')" :value="true"></el-option>
                <el-option :label="$t('general.forbid')" :value="false"></el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :md="4"></el-col>
          <el-col :md="8">
            <div>
              <div class="sub-title">
                <p class="sub-title">{{ $t("settings.attention") }}</p>
                <p class="sub-title-info">
                  <span v-html="$t('settings.attentionInfo')"></span>
                </p>
              </div>
              <!-- <div class="sub-title">
                <p class="sub-title">常见概念</p>
              </div>
              <a class="alink" href="https://cn.bing.com/search?q=%E5%B9%B6%E5%8F%91">
                <p>什么是并发？</p>
              </a>
              <a class="alink" href="https://cn.bing.com/search?q=Gzip+%E5%8E%8B%E7%BC%A9">
                <p>什么是 Gzip 压缩？</p>
              </a>
              <a class="alink" href="https://github.com/MCSManager/MCSManager/issues">
                <p>反馈问题</p>
              </a> -->
            </div>
          </el-col>
        </el-row>
      </template>
    </Panel>

    <Panel>
      <template #title>{{ $t("settings.about") }}</template>
      <template #default>
        <el-row :gutter="20">
          <el-col :md="12">
            <div class="sub-title">
              <p class="sub-title-title">
                <span v-html="$t('settings.aboutTitle')"></span>
              </p>
              <p class="sub-title-info">
                <span v-html="$t('settings.aboutTitleInfo')"></span>
              </p>
            </div>

            <div class="sub-title">
              <p class="sub-title-title">{{ $t("settings.closedSource") }}</p>
              <p class="sub-title-info">
                {{ $t("settings.closedSourceInfo") }}
              </p>
            </div>
            <div>
              <ItemGroup>
                <a
                  href="https://mcsmanager.com/#app-download"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="display: inline-block"
                >
                  <el-button type="" size="medium">{{ $t("settings.learnMore") }}</el-button>
                </a>
                <a
                  href="https://mcsmanager.com/agreement.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="display: inline-block"
                >
                  <el-button type="" size="medium">{{ $t("settings.userAgreement") }}</el-button>
                </a>
              </ItemGroup>
            </div>
          </el-col>
          <el-col :md="4"></el-col>
          <el-col :md="8">
            <div v-html="$t('settings.lazy')"></div>
            
          </el-col>
        </el-row>
        <div class="contributors" v-if="sponsorList">
          <div class="sub-title">
            <p class="sub-title-title">{{ $t("settings.sponsorList") }}</p>
            <p class="sub-title-info">
              {{ $t("settings.sponsorListInfo") }}
              <a href="https://mcsmanager.com/" target="_blank" rel="noopener noreferrer">
                MCSManager.com </a
              >。
            </p>
            <p class="sub-title-info"></p>
          </div>
          <el-row :gutter="10">
            <el-col :span="24">
              <div
                v-for="(item, index) in sponsorList"
                :key="index"
                style="margin: 0px 8px 4px 0px; display: inline-block"
              >
                <a
                  :href="item.link || 'https://mcsmanager.com'"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="text-decoration: underline"
                >
                  <span style="margin: 0px; font-size: 13px">
                    {{ item.name }}
                  </span>
                </a>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
    </Panel>
  </div>
</template>

<style scoped>
.selectedForwardMode {
  border: 1px solid #0450ff;
  color: #409eff;
}
</style>

<script>
import Panel from "../../components/Panel";
import SystemIndex from "../../components/SystemImage.vue";
import { API_SETTINGS } from "../service/common";
import { request } from "../service/protocol";
import SelectBlock from "../../components/SelectBlock";
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Panel, SystemIndex, SelectBlock },
  data: function () {
    return {
      settings: {},
      sponsorList: null
    };
  },
  methods: {
    async refresh() {
      await this.render();
      this.$message({ message: this.$t("general.refreshFinish"), type: "success" });
    },
    async render() {
      this.settings = await request({
        method: "GET",
        url: API_SETTINGS
      });
    },
    async updateSettings() {
      try {
        await request({
          method: "PUT",
          url: API_SETTINGS,
          data: this.settings
        });
        this.$message({ message: this.$t("settings.settingUpdate"), type: "success" });
      } catch (error) {
        this.$message({ message: error, type: "error" });
      }
    },
    loadSponsorList() {
      if (window.sponsorList) {
        const arr = window.sponsorList();
        for (const i in arr) {
          for (const j in arr) {
            if (arr[i].price > arr[j].price) {
              const tmp = arr[i];
              arr[i] = arr[j];
              arr[j] = tmp;
            }
          }
        }
        this.sponsorList = arr.slice(0, 40);
      } else {
        this.sponsorList = null;
      }
    }
    //async changeForwardType(v) {
    //}
  },
  async mounted() {
    await this.render();
    setTimeout(this.loadSponsorList, 3000);
  }
};
</script>

<style scoped>
.system-index-block {
  margin: 0px 0px 24px 0px;
}
.config-item {
  margin-top: 10px;
}
.contributors {
  margin: 10px 0px;
}
</style>
