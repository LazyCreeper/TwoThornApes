<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->
<template>
  <Dialog v-model="v" :cancel="close">
    <template #title> {{ $t("CommonText.012") }} </template>
    <template #default>
      <div class="wrapper">
        <div v-if="isFromTerminal && viewType === 0">
          <p class="sub-title">
            {{ $t("components.NetworkTip.016") }}
          </p>
        </div>
        <el-row :gutter="20" v-if="viewType === 0">
          <el-col :span="12" :offset="0">
            <SelectBlock style="height: 140px" @click="select(1)">
              <template #title>
                <p class="sub-title-title">
                  {{ $t("components.NetworkTip.001") }}
                </p>
              </template>
              <template #info>
                <p class="sub-title-info">
                  {{ $t("components.NetworkTip.002") }}
                </p>
              </template>
            </SelectBlock>
          </el-col>
          <el-col :span="12" :offset="0">
            <SelectBlock
              style="height: 140px; filter: brightness(0.5) grayscale(1); cursor: no-drop"
            >
              <template #title>
                <p class="sub-title-title">
                  {{ $t("components.NetworkTip.003") }}
                </p>
              </template>
              <template #info>
                <p class="sub-title-info">
                  {{ $t("components.NetworkTip.004") }}
                </p>
              </template>
            </SelectBlock>
          </el-col>
        </el-row>

        <div v-if="viewType === 0" class="row-mt">
          <p>{{ $t("components.NetworkTip.020") }}</p>
          <el-link type="primary" @click="close"> {{ $t("components.NetworkTip.017") }}</el-link>
        </div>

        <div v-if="viewType === 1">
          <div class="flex flex-space-between flex-space-center">
            <div style="margin: 24px 0px 24px 0px; text-align: center">
              <i class="el-icon-share" style="font-size: 72px; margin-bottom: 12px"></i>
              <div>
                <p class="sub-title color-green" v-if="ipv4">
                  {{ $t("components.NetworkTip.005", [ipv4]) }}
                </p>
                <p class="sub-title color-green" v-if="ipv6">
                  {{ ipv6 }}
                </p>
              </div>
            </div>
          </div>

          <p class="sub-title">
            {{ $t("components.NetworkTip.006", [ipv4 ? ipv4 : "8.8.8.8"]) }}
          </p>

          <p class="sub-title">
            {{ $t("components.NetworkTip.007") }}
          </p>
        </div>

        <div v-if="viewType === 2">
          <SelectBlock style="height: 140px" @click="select(3)">
            <template #title>
              <p class="sub-title-title">
                {{ $t("components.NetworkTip.021") }}
                &nbsp;
                <el-tag type="success" size="small">{{ $t("CommonText.045") }}</el-tag>
              </p>
            </template>
            <template #info>
              <p class="sub-title-info">{{ $t("components.NetworkTip.022") }}</p>
            </template>
          </SelectBlock>
          <div class="row-mt">
            <el-link type="primary" @click="close"> {{ $t("components.NetworkTip.017") }}</el-link>
          </div>
        </div>

        <div v-if="viewType === 3">
          <div class="row-mb">
            <p class="sub-title-title">
              {{ $t("components.NetworkTip.008") }}
            </p>
            <p class="sub-title-title">
              {{ $t("components.NetworkTip.009") }}
            </p>
          </div>
          <div>
            <p class="color-red-2">
              {{ $t("components.NetworkTip.023") }}
            </p>
          </div>
          <!-- <p>
            {{ $t("CommonText.013") }}
            <span class="color-gray" v-if="taskInfo.status == 0"> {{ $t("CommonText.014") }} </span>
            <span class="color-green" v-if="taskInfo.status == 1">
              {{ $t("CommonText.015") }}
            </span>
            <span class="color-red" v-if="taskInfo.status == -1"> {{ $t("CommonText.016") }} </span>
          </p> -->
          <p v-if="taskInfo.detail && taskInfo.detail.ip">
            {{ $t("components.NetworkTip.010") }}
            <span class="color-green"> {{ taskInfo.detail.ip }} </span>
          </p>
          <div class="row-mb">
            <div class="sub-title">
              <div class="sub-title-title require-field">
                {{ $t("components.NetworkTip.011") }}
              </div>
              <div class="sub-title-info">
                {{ $t("components.NetworkTip.012") }}
              </div>
            </div>
            <el-input
              v-model="config.openFrpToken"
              size="small"
              clearable
              :placeholder="$t('components.NetworkTip.013')"
            >
            </el-input>
          </div>
          <div class="row-mb">
            <div class="sub-title">
              <div class="sub-title-title require-field">{{ $t("CommonText.031") }}</div>
            </div>
            <el-input
              v-model="config.openFrpTunnelId"
              size="small"
              clearable
              :placeholder="$t('CommonText.031')"
            >
            </el-input>
          </div>

          {{ instanceInfo }}

          <div style="display: flex; justify-content: space-between">
            <div>
              <ItemGroup>
                <el-button type="primary" size="small" @click="saveConfig">
                  {{ $t("general.save") }}
                </el-button>
                <el-link
                  type="primary"
                  :underline="false"
                  href="https://docs.mcsmanager.com/#/tutorial/openfrp"
                  target="_blank"
                >
                  {{ $t("CommonText.019") }}
                </el-link>
                <!-- -
                <el-link
                  type="primary"
                  :underline="false"
                  href="https://www.openfrp.net/"
                  target="_blank"
                >
                  {{ $t("components.NetworkTip.014") }}
                </el-link> -->

                <p class="color-gray">{{ $t("components.NetworkTip.019") }}</p>
                <p class="color-gray">{{ $t("components.NetworkTip.020") }}</p>
              </ItemGroup>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script>
import Dialog from "@/components/Dialog";
import SelectBlock from "@/components/SelectBlock";
import { request } from "@/app/service/protocol";
import {
  API_FORWARD_REQUEST,
  API_INSTANCE_UPDATE,
  QUERY_PUBLIC_IP_V4,
  QUERY_PUBLIC_IP_V6
} from "../app/service/common";
export default {
  components: {
    Dialog,
    SelectBlock
  },
  props: ["serviceUuid", "instanceUuid", "extraServiceConfig"],
  data() {
    return {
      v: false,
      viewType: 0,
      ipv4: "",
      ipv6: "",
      indexCode: "",
      tunnelId: "",
      // config: {},
      taskInfo: {
        status: 0,
        taskId: "--",
        ip: ""
      }
    };
  },
  computed: {
    isOpen() {
      return this.taskInfo.status == 1;
    },
    isFromTerminal() {
      const r = this.$route.query.network_tip ? true : false;
      return r;
    }
  },
  methods: {
    async getPublicIP() {
      try {
        this.ipv4 = await request({
          method: "GET",
          url: API_FORWARD_REQUEST,
          params: {
            target: QUERY_PUBLIC_IP_V4
          }
        });
        this.ipv6 = await request({
          method: "GET",
          url: API_FORWARD_REQUEST,
          params: {
            target: QUERY_PUBLIC_IP_V6
          }
        });
      } catch (error) {
        this.ipv4 = "";
        this.ipv6 = "";
      }
    },
    init() {
      this.getPublicIP();
    },
    open() {
      this.init();
      this.v = true;
    },
    close() {
      this.viewType = 0;
      this.v = false;
    },
    select(type) {
      this.config = this.extraServiceConfig;
      this.viewType = type;
    },
    async saveConfig() {
      this.$emit("submit", this.config);
      await this.updateFrpConfig();
      this.close();
    },
    async updateFrpConfig() {
      try {
        await request({
          method: "PUT",
          url: API_INSTANCE_UPDATE,
          params: {
            daemonId: this.serviceUuid,
            uuid: this.instanceUuid
          },
          data: {
            extraServiceConfig: this.config
          }
        });
        this.$message({
          type: "success",
          message: this.$t("termSet.setUpdate")
        });
      } catch (error) {
        this.$message({
          message: `${this.$t("general.error")}: ${error.message}`,
          type: "error"
        });
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  margin: 16px;
  max-width: 600px;
}
</style>
