<script setup>
import { ref, computed } from "vue";
import { useShopInfo } from "../../hooks/useStore";
import i18n from "../../i18n";
import store from "../../store/index";
import md5 from "md5";
import UseRedeemDialog from "./UseRedeemDialog.vue";
import PurchaseQueryDialog from "./PurchaseQueryDialog.vue";

const t = i18n.global.t;
const isLogin = computed(() => !store.state.userInfo.uuid);
const { isLoading, isError, ispInfo } = useShopInfo();

const useRedeemDialog = ref();
const purchaseQueryDialog = ref();
</script>

<template>
  <Panel v-loading="isLoading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <template #title>{{ t("settings.businessMode.TXT_CODE_4770de17") }}</template>
    <template #default>
      <div v-if="!isError" style="min-height: 280px; overflow: auto">
        <div
          class="flex flex-wrap flex-align-items-center flex-space-around"
          style="margin-bottom: 20px; gap: 15px"
        >
          <el-avatar
            :size="100"
            fit="cover"
            :src="`https://cravatar.cn/avatar/${md5(ispInfo?.username ?? '')}`"
          ></el-avatar>
          <table>
            <tr>
              <td style="padding-right: 10px">
                <div class="sub-title-title">{{ t("settings.businessMode.002") }}</div>
              </td>
              <td>
                <div class="sub-title-info">{{ ispInfo?.username }}</div>
              </td>
            </tr>
            <tr>
              <td style="padding-right: 10px">
                <div class="sub-title-title">{{ t("settings.businessMode.003") }}</div>
              </td>
              <td>
                <div class="sub-title-info">{{ ispInfo?.nickname }}</div>
              </td>
            </tr>
            <tr>
              <td style="padding-right: 10px">
                <div class="sub-title-title">{{ t("settings.businessMode.004") }}</div>
              </td>
              <td>
                <div class="sub-title-info">
                  {{ new Date(ispInfo?.lastTime).toLocaleString() }}
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="sub-title" style="padding: 0 20px">
          <div class="sub-title-title">{{ t("settings.businessMode.006") }}</div>
          <div class="sub-title-info">
            {{ ispInfo?.introduction }}
          </div>
        </div>

        <div class="sub-title" style="padding: 0 20px">
          <div class="sub-title-title">{{ t("settings.businessMode.TXT_CODE_ef27fda1") }}</div>
          <div class="sub-title-info">
            {{ ispInfo?.afterSalesGroup }}
          </div>
        </div>

        <div class="flex flex-space-around" style="margin: 20px 0">
          <el-button v-if="isLogin" type="primary" @click="$router.push('/login')">{{
            t("settings.businessMode.TXT_CODE_22510c5c")
          }}</el-button>
          <el-button type="success" @click="useRedeemDialog?.openDialog">{{
            t("settings.businessMode.005")
          }}</el-button>
          <el-button type="warning" plain @click="purchaseQueryDialog?.openDialog">{{
            t("settings.businessMode.TXT_CODE_17b3748b")
          }}</el-button>
        </div>
      </div>
      <div v-else>
        <el-empty
          :image="require('../../../assets/p.gif')"
          :image-size="250"
          :description="t('settings.businessMode.TXT_CODE_e5bf0df1')"
        ></el-empty>
      </div>
    </template>
  </Panel>

  <UseRedeemDialog ref="useRedeemDialog" />

  <PurchaseQueryDialog ref="purchaseQueryDialog" />
</template>
