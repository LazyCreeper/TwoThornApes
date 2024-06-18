<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->
<template>
  <div class="quick-container-install">
    <div v-if="!installView" element-loading-background="rgba(0, 0, 0, 0.5)">
      <Panel>
        <template #title>{{ $t("views.quickstart_McPreset.tip") }}</template>
        <template #default>
          <p>
            {{ $t("views.quickstart_McPreset.eulaReadTitle") }}
            <a href="https://aka.ms/MinecraftEULA" target="_blank" rel="noopener noreferrer">
              {{ $t("views.quickstart_McPreset.eulaReadTitle2") }}
            </a>
          </p>
          <p>{{ $t("views.quickstart_McPreset.007") }}</p>
        </template>
      </Panel>
      <AppPackages @handleSelectTemplate="handleSelectTemplate" />
      <!-- <Panel v-else-if="!requestLoading" class="flex flex-align-items-center flex-space-center">
        <template #default>
          <div style="text-align: center">
            <i class="el-icon-warning-outline" style="font-size: 100px"></i>
            <h2>{{ $t("install.stoppedServiceTitle") }}</h2>
            <div style="margin-bottom: 12px">
              <p>{{ $t("install.stoppedServiceContent") }}</p>

              <el-button type="primary" size="small" @click="toCreateInstancePage">
                {{ $t("install.toCreateInstancePage") }}
              </el-button>
            </div>
          </div>
        </template>
      </Panel> -->
    </div>

    <Panel style="width: 600px" v-if="installView && !isInstalled">
      <template #title>{{ $t("views.quickstart_McPreset.014") }}</template>
      <template #default>
        <div class="display-center">
          <div style="text-align: center" v-if="taskInfo?.status != -1">
            <el-progress type="circle" :percentage="percentage"></el-progress>
            <div style="margin-top: 12px; text-align: center">
              <p class="tip-title">{{ $t("views.quickstart_McPreset.008") }}</p>
              <p class="sub-title-info">{{ $t("views.quickstart_McPreset.009") }}</p>
            </div>
          </div>
          <div style="text-align: center" v-else-if="taskInfo?.status == -1">
            <h1>{{ $t("CommonText.044") }}</h1>
            <p>{{ $t("views.quickstart_McPreset.015") }}</p>
          </div>
        </div>
      </template>
    </Panel>

    <Panel style="width: 640px" v-if="installView && isInstalled">
      <template #title>{{ $t("CommonText.010") }}</template>
      <template #default>
        <div class="display-center">
          <div style="margin: 16px">
            <p class="tip-title">{{ $t("views.quickstart_McPreset.010") }}</p>
            <el-button type="primary" size="default" @click="toInstance">
              {{ $t("views.quickstart_McPreset.011") }}
            </el-button>
          </div>
        </div>
      </template>
    </Panel>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import { API_INSTANCE_ASYNC_TASK, API_INSTANCE_ASYNC_QUERY } from "../../service/common";
import { request } from "../../service/protocol";
import AppPackages from "./AppPackages.vue";
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {
    Panel,
    AppPackages
  },
  props: {
    remoteUuid: {
      type: String
    },
    taskId: {
      type: String,
      default: ""
    }
  },
  data: function () {
    return {
      tableData: [],
      percentage: 1,
      installView: false,
      intervalTask: null,
      requestLoading: true,
      visibleDialog: false,
      isInstalled: false,
      taskInfo: {},
      newTaskInfo: {
        instanceConfig: {
          nickname: ""
        },
        instanceStatus: 0,
        instanceUuid: "",
        status: 1,
        taskId: ""
      }
    };
  },
  methods: {
    async init() {
      if (this.taskId) {
        this.percentage = 50;
        this.startDownloadTask();
      }
    },
    startDownloadTask() {
      if (this.intervalTask) clearInterval(this.intervalTask);
      this.requestLoading = false;
      this.installView = true;
      this.queryStatus();
      this.intervalTask = setInterval(() => {
        if (this.percentage <= 90) this.percentage += 4;
        this.queryStatus();
      }, 3000);
    },
    // Start install
    async handleSelectTemplate(item) {
      const { value: instanceName } = await this.$prompt(
        window.$t("views.quickstart_McPreset.016")
      );
      this.requestLoading = true;
      this.installView = true;
      this.isInstalled = false;
      this.newTaskInfo = await request({
        method: "POST",
        url: API_INSTANCE_ASYNC_TASK,
        params: {
          daemonId: this.remoteUuid,
          uuid: "-",
          task_name: "quick_install"
        },
        data: {
          time: new Date().getTime(),
          newInstanceName: instanceName,
          targetLink: item.targetLink
        }
      });
      this.requestLoading = false;
      this.startDownloadTask();
    },
    async queryStatus() {
      this.taskInfo = await request({
        method: "POST",
        url: API_INSTANCE_ASYNC_QUERY,
        params: {
          daemonId: this.remoteUuid,
          uuid: "-",
          task_name: "quick_install"
        },
        data: {
          taskId: this.newTaskInfo.taskId
        }
      });
      if (this.taskInfo.status === 0) {
        this.percentage = 100;
        setTimeout(() => this.installed(), 2000);
      }
    },
    installed() {
      console.log(window.$t("views.quickstart_McPreset.013"));
      this.isInstalled = true;
    },
    toInstance() {
      this.$router.push({
        path: `/terminal/${this.remoteUuid}/${this.taskInfo.detail.instanceUuid}/`,
        query: {
          network_tip: 1
        }
      });
    },
    toCreateInstancePage() {
      this.$router.push({
        path: `/new_instance/${this.remoteUuid}`
      });
    }
  },
  mounted() {
    this.init();
  },
  unmounted() {
    clearInterval(this.intervalTask);
  }
};
</script>
