<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->

<template>
  <Dialog v-model="v" :cancel="close">
    <template #title>{{ $t("dockerInfoDialog.title") }}</template>
    <template #default>
      <div style="min-width: 480px">
        <p>{{ $t("dockerInfoDialog.subtitle") }}</p>
        <el-row :gutter="20">
          <el-col :md="12" :offset="0">
            <LineInfo>
              <i class="el-icon-tickets"></i>
              <span>{{ $t("dockerInfoDialog.memory") }}{{ dockerInfo.memory }}MB</span>
            </LineInfo>
            <LineInfo>
              <i class="el-icon-tickets"></i>
              <span>{{ $t("dockerInfoDialog.network") }}{{ dockerInfo.networkMode }}</span>
            </LineInfo>
            <LineInfo>
              <i class="el-icon-tickets"></i>
              <span>{{ $t("dockerInfoDialog.imageName") }}{{ dockerInfo.image }}</span>
            </LineInfo>
            <LineInfo>
              <i class="el-icon-tickets"></i>
              <span>{{ $t("dockerInfoDialog.containerName") }}{{ dockerInfo.containerName }}</span>
            </LineInfo>
          </el-col>
          <el-col :md="12" :offset="0">
            <LineInfo v-if="dockerInfo && dockerInfo.ports">
              <i class="el-icon-tickets"></i> {{ $t("terminal.dockerPort") }}
              <i class="el-icon-question"></i>:

              <div style="padding: 10px 0px 0px 16px">
                <div
                  style="margin-bottom: 2px"
                  v-for="(item, index) in dockerPortsParse(dockerInfo.ports)"
                  :key="index"
                >
                  <el-tag type="success" size="mini">{{
                    item.protocol.toLocaleUpperCase()
                  }}</el-tag>
                  <span style="margin-left: 8px"
                    >{{ $t("CommonText.029") }}: {{ item.port1 }}
                  </span>
                  <span style="margin-left: 6px"
                    >{{ $t("CommonText.030") }}: {{ item.port2 }}
                  </span>
                </div>
              </div>
            </LineInfo>
          </el-col>
        </el-row>
      </div>
    </template>
  </Dialog>
</template>

<script>
import LineInfo from "@/components/LineInfo";
import Dialog from "@/components/Dialog";
import { TERMINAL_CODE } from "../../service/common";
import { dockerPortsArray } from "../../utils";

export default {
  components: {
    Dialog,
    LineInfo
  },
  props: {
    dockerInfo: {
      type: Object
    }
  },
  data() {
    return {
      TERMINAL_CODE,
      v: false,
      options: {}
    };
  },

  methods: {
    open() {
      this.v = true;
    },
    close() {
      this.v = false;
    },
    // [ "25565:25565/tcp", "27766:27766/tcp" ]
    dockerPortsParse(list = []) {
      return dockerPortsArray(list);
    }
  }
};
</script>

<style scoped>
.btn-area {
  margin-top: 8px;
}
</style>
