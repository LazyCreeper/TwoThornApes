<script setup>
import { ref, defineProps, defineExpose } from "vue";
import Dialog from "@/components/Dialog";
import { ElMessage, ElNotification } from "element-plus";
import { request } from "../../service/protocol";
import { API_INSTANCE, API_INSTANCE_UPDATE } from "../../service/common";
const t = window.$t;

const v = ref(false),
  props = defineProps({
    daemonId: {
      type: String,
      required: true
    },
    instanceId: {
      type: String,
      required: true
    }
  }),
  isLoading = ref(true),
  instanceInfo = ref({
    config: {
      startCommand: ""
    }
  }),
  openDialog = () => {
    v.value = true;
    initData();
  },
  close = () => {
    v.value = false;
  },
  initData = async () => {
    try {
      isLoading.value = true;
      instanceInfo.value = await request({
        method: "GET",
        url: API_INSTANCE,
        params: { daemonId: props.daemonId, uuid: props.instanceId }
      });
    } catch (err) {
      ElNotification.error({
        title: "Error",
        message: err.message
      });
    } finally {
      isLoading.value = false;
    }
  },
  submit = async () => {
    try {
      isLoading.value = true;

      await request({
        method: "PUT",
        url: API_INSTANCE_UPDATE,
        params: { daemonId: props.daemonId, uuid: props.instanceId },
        data: instanceInfo.value.config
      });
      ElMessage.success(t("home.updateSuccess"));
      close();
    } catch (err) {
      ElNotification.error({
        title: "Error",
        message: err.message
      });
    } finally {
      isLoading.value = false;
    }
  };

defineExpose({ openDialog });
</script>

<template>
  <Dialog v-model="v" :cancel="close" max-width="666px">
    <template #title>{{ $t("terminal.instanceDetail") }}</template>
    <template #default>
      <div class="sub-title">
        <p class="sub-title-title">{{ $t("newInstances.launchCmd") }}</p>
        <p class="sub-title-info row-mb" v-html="$t('instancesDetail.launchCmdText')"></p>
        <el-input
          v-model="instanceInfo.config.startCommand"
          :rows="3"
          type="textarea"
          resize="none"
        >
        </el-input>
      </div>
      <div class="row-mt">
        <div class="sub-title">
          <div class="sub-title-title">{{ $t("instancesDetail.updateCmd") }}</div>
          <div class="sub-title-info">
            {{ $t("instancesDetail.updateCmdInfo", { t: "${mcsm_workspace}" }) }}
          </div>
        </div>
        <el-input
          v-model="instanceInfo.config.updateCommand"
          type="text"
          :placeholder="defaultInstallCommand"
          :disabled="isGlobalInstance"
        >
        </el-input>
      </div>
      <div class="btn-area">
        <el-button size="small" type="danger" @click="close">{{ $t("general.cancel") }}</el-button>
        <el-button size="small" type="primary" @click="submit" :loading="isLoading">{{
          $t("general.confirm")
        }}</el-button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.btn-area {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.tag-list {
  margin: 8px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
