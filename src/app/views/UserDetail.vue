<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->

<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <Panel>
        <template #title>{{ $t("userDetail.basicInfo") }}</template>
        <template #default>
          <el-row :gutter="20">
            <el-col :md="12" :offset="0">
              <LineLabel class="only-pc-display">
                <template #title>{{ $t("userDetail.uuid") }}</template>
                <template #default>{{ userInfo.uuid }}</template>
              </LineLabel>
              <LineLabel>
                <template #title>{{ $t("users.userName") }}</template>
                <template #default>{{ userInfo.userName }}</template>
              </LineLabel>
              <LineLabel>
                <template #title>{{ $t("userDetail.status") }}</template>
                <template #default>
                  <span style="color: green">{{ moreUserInfo.safe }}</span>
                </template>
              </LineLabel>
            </el-col>
            <el-col :md="12" :offset="0">
              <LineLabel>
                <template #title>{{ $t("users.regTime") }}</template>
                <template #default>{{ userInfo.registerTime }}</template>
              </LineLabel>
              <LineLabel>
                <template #title>{{ $t("userDetail.loginTime") }}</template>
                <template #default>{{ userInfo.loginTime }}</template>
              </LineLabel>
              <LineLabel class="only-pc-display">
                <template #title>{{ $t("userDetail.api") }}</template>
                <template #default>
                  {{ moreUserInfo.api }}
                </template>
              </LineLabel>
            </el-col>
          </el-row>
        </template>
      </Panel>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :md="8" :offset="0">
      <Panel style="height: 350px">
        <template #title>{{ $t("userDetail.attention") }}</template>
        <template #default>
          <div class="sub-title">
            <p class="sub-title">{{ $t("userDetail.aboutName") }}</p>
            <p class="sub-title-info">
              {{ $t("userDetail.aboutNameInfo") }}
            </p>
          </div>
          <div class="sub-title">
            <p class="sub-title">{{ $t("userDetail.aboutPasswd") }}</p>
            <p class="sub-title-info">
              {{ $t("userDetail.aboutPasswdInfo") }}
            </p>
          </div>
          <div class="sub-title">
            <p class="sub-title">{{ $t("userDetail.aboutApiKey") }}</p>
            <p class="sub-title-info">
              {{ $t("userDetail.aboutApiKeyInfo") }}
            </p>
          </div>
        </template>
      </Panel>
    </el-col>
    <el-col :md="8" :offset="0">
      <Panel style="height: 350px">
        <template #title>{{ $t("userDetail.updatePasswd") }}</template>
        <template #default>
          <el-form
            :model="userData"
            :rules="rules"
            label-position="top"
            size="small"
            ref="ruleFormRef"
          >
            <el-form-item :label="$t('userDetail.newPasswd')" prop="passWord" required>
              <el-input
                size="small"
                type="password"
                v-model="userData.passWord"
                autocomplete="off"
                :readonly="readonly.b"
                :placeholder="$t('userDetail.newPasswdInfo')"
                @focus="() => (readonly.b = false)"
              >
              </el-input>
            </el-form-item>

            <el-form-item :label="$t('userDetail.confirmNewPasswd')" prop="passWord2" required>
              <el-input
                size="small"
                type="password"
                v-model="userData.passWord2"
                :placeholder="$t('userDetail.keepOrigin')"
                :readonly="readonly.c"
                @focus="() => (readonly.c = false)"
                autocomplete="off"
              >
              </el-input>
            </el-form-item>
            <div style="text-align: right">
              <el-form-item>
                <el-button size="small" type="danger" plain class="row-mt" @click="update(2)">
                  {{ $t("userDetail.updatePasswd") }}
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </template>
      </Panel>
    </el-col>

    <el-col :md="8" :offset="0">
      <Panel style="height: 350px">
        <template #title>{{ $t("userDetail.apiKey") }}</template>
        <template #default>
          <div class="sub-title row-mt">
            <p class="sub-title-title">{{ $t("userDetail.whatIsApiKey") }}</p>
            <p class="sub-title-info">
              {{ $t("userDetail.apiKeyIs") }}
            </p>
          </div>
          <div
            class="row-mt"
            style="
              padding: 12px 8px;
              background: rgba(0, 0, 0, 0.02);
              box-sizing: border-box;
              border-radius: 2px;
              font-size: 13px;
            "
          >
            <span>{{ userInfo.apiKey ? userInfo.apiKey : $t("userDetail.disable") }}</span>
          </div>
          <div style="text-align: right">
            <ItemGroup>
              <el-button size="small" class="row-mt" @click="changeApi(true)">{{
                $t("userDetail.createApiKey")
              }}</el-button>
              <el-button size="small" class="row-mt" @click="changeApi(false)">{{
                $t("userDetail.disableApiKey")
              }}</el-button>
            </ItemGroup>
          </div>
        </template>
      </Panel>
    </el-col>

    <el-col :md="8" :offset="0">
      <Panel>
        <template #title>{{ $t("userDetail.2fa") }}</template>
        <template #default>
          <div v-if="qrCode" class="row-mt">
            <div class="sub-title row-mt">
              <p class="sub-title-info">1. {{ $t("userDetail.1") }}</p>
              <p class="sub-title-info">2. {{ $t("userDetail.2") }}</p>
            </div>
            <img :src="qrCode" style="height: 180px" />
            <div style="text-align: right">
              <ItemGroup>
                <el-button size="small" class="row-mt" @click="confirm2FACode(true)">{{
                  $t("userDetail.3")
                }}</el-button>
              </ItemGroup>
            </div>
          </div>
          <div v-else>
            <ItemGroup>
              <el-button size="small" class="row-mt" @click="handleBind2FA">{{
                userInfo.open2FA ? $t("userDetail.4") : $t("userDetail.5")
              }}</el-button>
              <el-button
                v-if="userInfo.open2FA"
                type="danger"
                size="small"
                class="row-mt"
                @click="confirm2FACode(false)"
                >{{ $t("userDetail.6") }}</el-button
              >
            </ItemGroup>
          </div>
        </template>
      </Panel>
    </el-col>
  </el-row>
</template>

<script>
import Panel from "../../components/Panel";
import LineLabel from "../../components/LineLabel";
import {
  API_BIND_2FA,
  API_CONFIRM_2FA,
  API_URL,
  API_USER_API,
  API_USER_UPDATE
} from "../service/common";
import { request, requestUserInfo } from "../service/protocol";

export default {
  data() {
    return {
      readonly: {
        a: true,
        b: true,
        c: true
      },
      userData: {
        userName: "",
        passWord: "",
        passWord2: "",
        apiKey: ""
      },
      moreUserInfo: {
        api: API_URL,
        safe: this.$t("userDetail.accountOk")
      },
      api: {
        enable: false,
        key: ""
      },
      rules: {
        passWord: [{ validator: this.validatePassword, trigger: "blur" }],
        passWord2: [{ validator: this.validatePassword, trigger: "blur" }]
      },
      qrCode: ""
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },

  async mounted() {},
  methods: {
    async update() {
      await this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return;
        await this.$confirm(this.$t("userDetail.changeThisInfo"), this.$t("general.warn"), {
          confirmButtonText: this.$t("general.confirm"),
          cancelButtonText: this.$t("general.cancel"),
          type: "warning"
        });
        const passWord = this.userData.passWord;
        try {
          await request({
            method: "PUT",
            url: API_USER_UPDATE,
            data: {
              passWord
            }
          });
          this.$message({ message: this.$t("userDetail.userDataUpdate"), type: "success" });
        } catch (error) {
          this.$message({
            message: error.toString(),
            type: "error"
          });
        }
      });
    },

    async changeApi(enable) {
      try {
        const key = await request({
          method: "PUT",
          url: API_USER_API,
          data: {
            enable
          }
        });
        this.$store.commit("setApiKey", key);
        this.$message({ message: this.$t("userDetail.apiKeyChangeSuccess"), type: "success" });
      } catch (error) {
        this.$message({
          message: `Error: ${error}`,
          type: "error"
        });
      }
    },

    async handleBind2FA() {
      try {
        this.qrCode = await request({
          method: "POST",
          url: API_BIND_2FA,
          data: {}
        });
      } catch (error) {
        this.$message({
          message: `Error: ${error}`,
          type: "error"
        });
      }
    },

    async confirm2FACode(enable) {
      try {
        await request({
          method: "POST",
          url: API_CONFIRM_2FA,
          data: {
            enable
          }
        });
        await requestUserInfo();
        this.qrCode = "";
        this.$message({
          message: this.$t("home.updateSuccess"),
          type: "success"
        });
      } catch (error) {
        this.$message({
          message: `Error: ${error}`,
          type: "error"
        });
      }
    },
    validatePassword(rule, value = "", callback) {
      if (!value) return callback(new Error(this.$t("userDetail.inputPasswd")));
      if (value.length < 9 || value.length > 36)
        return callback(new Error(this.$t("userDetail.notStandard")));
      // const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[0-9A-Za-z]{12,}$/;
      // if (!reg.test(value)) return callback(new Error("Your password must contain: numbers, uppercase and lowercase letters"));
      callback();
    },
    validatePassword2(rule, value = "", callback) {
      if (value !== this.passWord) return callback(new Error(this.$t("userDetail.notSame")));

      callback();
    }
  },
  components: { Panel, LineLabel }
};
</script>
