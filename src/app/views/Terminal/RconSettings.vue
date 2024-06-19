<template>
  <Dialog v-model="v" :cancel="close">
    <template #title>{{ $t("terminal.rconConfig.1") }}</template>
    <template #default>
      <div style="max-width: 444px">
        <p>
          {{ $t("terminal.rconConfig.2") }}
        </p>

        <div class="sub-title row-mt">
          <p class="sub-title-title">{{ $t("terminal.rconConfig.3") }}</p>
          <p class="sub-title-info">
            {{ $t("terminal.rconConfig.4") }}
          </p>
        </div>
        <el-switch v-model="options.enableRcon"></el-switch>

        <div class="sub-title row-mt">
          <p class="sub-title-title">{{ $t("terminal.rconConfig.5") }}</p>
          <p class="sub-title-info">
            {{ $t("terminal.rconConfig.6") }}
          </p>
        </div>
        <el-input v-model="options.rconIp" size="small"></el-input>

        <div class="sub-title row-mt">
          <p class="sub-title-title">{{ $t("terminal.rconConfig.7") }}</p>
          <p class="sub-title-info">
            {{ $t("terminal.rconConfig.8") }}
          </p>
        </div>
        <el-input v-model="options.rconPort" size="small"></el-input>

        <div class="sub-title row-mt">
          <p class="sub-title-title">{{ $t("terminal.rconConfig.9") }}</p>
          <p class="sub-title-info">
            {{ $t("terminal.rconConfig.10") }}
          </p>
        </div>
        <el-input v-model="options.rconPassword" size="small"></el-input>

        <div class="row-mt">
          <ItemGroup>
            <el-button type="success" size="small" @click="submit" :loading="btnLoading">
              {{ $t("users.updateData") }}
            </el-button>
            <el-button @click="close" size="small">
              {{ $t("general.cancel") }}
            </el-button>
          </ItemGroup>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script>
import Dialog from "@/components/Dialog";
import { API_INSTANCE_UPDATE } from "../../service/common";
import { request } from "../../service/protocol";

export default {
  components: {
    Dialog
  },
  props: {
    daemonId: {
      type: String
    },
    instanceId: {
      type: String
    },
    instanceInfo: {
      type: Object
    }
  },
  data() {
    return {
      v: false,
      btnLoading: false,
      options: {
        enableRcon: false,
        rconIp: "",
        rconPassword: "",
        rconPort: ""
      }
    };
  },

  methods: {
    open() {
      this.v = true;
      this.options = {
        enableRcon: this.instanceInfo.config.enableRcon,
        rconIp: this.instanceInfo.config.rconIp,
        rconPassword: this.instanceInfo.config.rconPassword,
        rconPort: this.instanceInfo.config.rconPort
      };
    },
    close() {
      this.v = false;
    },
    async submit() {
      try {
        this.btnLoading = true;
        await request({
          method: "PUT",
          url: API_INSTANCE_UPDATE,
          params: {
            daemonId: this.daemonId,
            uuid: this.instanceId
          },
          data: this.options
        });
        this.options = {};
        this.close();
        this.$message({
          type: "success",
          message: this.$t("home.updateSuccess")
        });
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message
        });
      } finally {
        this.btnLoading = false;
      }
    }
  }
};
</script>
