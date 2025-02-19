<script setup>
import { ref, computed, defineProps, defineEmits, defineExpose } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import Dialog from "@/components/Dialog";
import { request } from "../../service/protocol";
import store from "../../store";
import i18n from "../../i18n";
import { API_REQUEST_REDEEM_PLATFORM, API_URL } from "../../service/common";

const t = i18n.global.t,
  props = defineProps({
    instanceId: {
      type: String,
      required: false
    }
  }),
  v = ref(false),
  isLoading = ref(false),
  emit = defineEmits(["update"]),
  appState = store.state,
  isRenewalMode = computed(() => !!props.instanceId),
  formRef = ref(),
  formData = ref({
    username: appState.userInfo?.userName || "",
    code: ""
  }),
  rules = {
    username: {
      required: true,
      message: t("users.newUserDialog.inputSth"),
      trigger: "blur"
    },
    code: {
      required: true,
      message: t("users.newUserDialog.inputSth"),
      trigger: "blur"
    }
  },
  res = ref(),
  openDialog = () => {
    v.value = true;
  },
  close = () => {
    v.value = false;
    res.value = void 0;
    formData.value.code = "";
  },
  queryUsername = async (username) => {
    try {
      const res = await request({
        method: "GET",
        url: `${API_URL}/api/auth/query_username`,
        params: {
          username
        }
      });

      const c = await ElMessageBox.confirm(
        res.uuid
          ? t("settings.businessMode.TXT_CODE_c684d8b2")
          : t("settings.businessMode.TXT_CODE_4c72565d"),
        t("general.warn"),
        {
          confirmButtonText: t("CommonText.041"),
          cancelButtonText: t("CommonText.042"),
          type: "warning"
        }
      );
      return c;
    } catch (err) {
      //
    }
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

      if (isRenewalMode.value) {
        const f = await queryUsername(formData.value.username);
        if (!f) return;

        res.value = await request({
          url: API_REQUEST_REDEEM_PLATFORM,
          method: "POST",
          data: {
            targetUrl: "/api/instances/use_redeem",
            method: "POST",
            data: {
              ...formData.value,
              businessId: appState.panelStatus.settings.businessId,
              instanceId: props.instanceId
            }
          }
        });
      } else {
        res.value = await request({
          url: API_REQUEST_REDEEM_PLATFORM,
          method: "POST",
          data: {
            targetUrl: "/api/instances/use_redeem",
            method: "POST",
            data: { ...formData.value, businessId: appState.panelStatus.settings.businessId }
          }
        });
        // ElMessageBox.confirm(
        //   t("settings.businessMode.TXT_CODE_8074a178") +
        //     new Date(res.value?.expire ?? 0).toLocaleString(),
        //   t("settings.businessMode.TXT_CODE_ae51f93b"),
        //   {
        //     confirmButtonText: t("CommonText.041"),
        //     cancelButtonText: t("CommonText.042"),
        //     type: "warning"
        //   }
        // ).catch(() => {});
        emit("update");
      }
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
  <Dialog v-model="v" :cancel="close" max-width="500px">
    <template #title>{{ $t("settings.businessMode.005") }}</template>

    <template #default v-if="!res">
      <p>
        {{ t("settings.businessMode.TXT_CODE_b90e9abd") }}
      </p>
      <el-form :model="formData" :rules="rules" label-position="top" size="small" ref="formRef">
        <el-form-item
          :label="$t('settings.businessMode.TXT_CODE_c38813a8')"
          prop="username"
          required
        >
          <el-input
            size="small"
            v-model="formData.username"
            autocomplete="off"
            :placeholder="$t('settings.businessMode.TXT_CODE_8028e95b')"
          >
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('settings.businessMode.TXT_CODE_fb87ccd')" prop="code" required>
          <el-input
            size="small"
            v-model="formData.code"
            :placeholder="$t('settings.businessMode.TXT_CODE_a95c0f85')"
            autocomplete="off"
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
    </template>

    <template #default v-else>
      <el-result icon="success">
        <template #title>
          {{
            isRenewalMode
              ? t("settings.businessMode.TXT_CODE_ae51f93b")
              : t("settings.businessMode.TXT_CODE_3ee20639")
          }}
        </template>
        <template #subTitle>
          <table>
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
                <div class="sub-title-info">{{ res?.password || t("userDetail.keepOrigin") }}</div>
              </td>
            </tr>
            <tr v-if="res?.expire">
              <td style="padding-right: 10px">
                <div class="sub-title-title">{{ t("instances.endTime") }}</div>
              </td>
              <td>
                <div class="sub-title-info">
                  {{ new Date(res?.expire).toLocaleString() }}
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
