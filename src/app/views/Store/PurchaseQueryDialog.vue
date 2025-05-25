<script setup>
import { ref, defineExpose } from "vue";
import { ElNotification } from "element-plus";
import Dialog from "@/components/Dialog";
import { request } from "../../service/protocol";
import store from "../../store";
import i18n from "../../i18n";
import { API_REQUEST_REDEEM_PLATFORM } from "../../service/common";

const t = i18n.global.t,
  v = ref(false),
  isLoading = ref(false),
  appState = store.state,
  formRef = ref(),
  formData = ref({
    code: ""
  }),
  rules = {
    code: {
      required: true,
      message: t("users.newUserDialog.inputSth"),
      trigger: "blur"
    }
  },
  res = ref(null),
  openDialog = () => {
    v.value = true;
  },
  close = () => {
    v.value = false;
    res.value = null;
    formData.value.code = "";
  },
  submit = async () => {
    let valid = false;
    try {
      valid = await formRef.value?.validate();
    } catch {
      //
    }
    if (!valid) return;

    try {
      isLoading.value = true;

      res.value = await request({
        url: API_REQUEST_REDEEM_PLATFORM,
        method: "POST",
        data: {
          targetUrl: "/api/instances/purchase_history",
          method: "GET",
          params: { ...formData.value, businessId: appState.panelStatus.settings.businessId }
        }
      });
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
  <Dialog v-model="v" :cancel="close">
    <template #title>{{ $t("settings.businessMode.TXT_CODE_2093cc1a") }}</template>

    <template #default>
      <el-form
        v-if="!res"
        :model="formData"
        :rules="rules"
        label-position="top"
        size="small"
        ref="formRef"
      >
        <el-form-item :label="$t('settings.businessMode.TXT_CODE_a3de630')" prop="code" required>
          <el-input
            size="small"
            v-model="formData.code"
            autocomplete="off"
            :placeholder="$t('settings.businessMode.TXT_CODE_a95c0f85')"
          >
          </el-input>
        </el-form-item>

        <div class="btn-area">
          <el-button size="small" type="danger" @click="close">{{
            $t("general.cancel")
          }}</el-button>
          <el-button size="small" type="primary" @click="submit" :loading="isLoading">{{
            $t("general.confirm")
          }}</el-button>
        </div>
      </el-form>
      <el-result v-else icon="success">
        <template #subTitle>
          <table>
            <tr>
              <td style="padding-right: 10px">
                <div class="sub-title-title">
                  {{ t("settings.businessMode.TXT_CODE_f3209427") }}
                </div>
              </td>
              <td>
                <a :href="res.panelAddr" target="_blank">{{ res.panelAddr }}</a>
              </td>
            </tr>
            <tr>
              <td style="padding-right: 10px">
                <div class="sub-title-title">
                  {{ t("settings.businessMode.TXT_CODE_c38813a8") }}
                </div>
              </td>
              <td>
                <div class="sub-title-info">{{ res?.username }}</div>
              </td>
            </tr>
            <tr>
              <td style="padding-right: 10px">
                <div class="sub-title-title">{{ t("login.passWord") }}</div>
              </td>
              <td>
                <div class="sub-title-info">
                  {{ res?.password || t("settings.businessMode.TXT_CODE_cb61062d") }}
                </div>
              </td>
            </tr>
          </table>
        </template>
        <template #extra>
          <el-button type="primary" size="medium" @click="close">OK</el-button>
        </template>
      </el-result>
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
</style>
