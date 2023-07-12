<template>
  <div>
    <Panel>
      <template #title>{{ $t("settings.setOperate") }}</template>
      <template #default>
        <div class="flex flex-space-between flex-align-items-center">
          <div>
            <ItemGroup>
              <el-button type="success" size="small" @click="updateSettings">
                {{
                $t("settings.updateSet")
                }}
              </el-button>
              <el-button size="small" @click="refresh">{{ $t("general.refresh") }}</el-button>
            </ItemGroup>
          </div>
          <span class="color-gray hidden-md-and-down">{{ $t("settings.updateSetInfo") }}&nbsp;&nbsp;</span>
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
              </div>-->

              <div class="config-item" style="margin-top: 0px">
                <div class="sub-title">
                  <p class="sub-title-title">{{ $t("settings.languageSetting") }}</p>
                  <p class="sub-title-info">{{ $t("settings.languageSettingInfo") }}</p>
                </div>
                <el-select v-model="settings.language" :placeholder="$t('general.pleaseSelect')">
                  <el-option label="English" value="en_us"></el-option>
                  <el-option value="zh_cn" :label="$t('CommonText.011')"></el-option>
                  <!-- <el-option label="Japanese" value="jp" disabled></el-option> -->
                </el-select>
              </div>

              <div class="config-item">
                <div class="sub-title">
                  <p class="sub-title-title">{{ $t("settings.accessPort") }}</p>
                  <p class="sub-title-info">{{ $t("settings.accessPortInfo") }}</p>
                </div>
                <el-input :placeholder="$t('settings.inputNum')" v-model="settings.httpPort"></el-input>
              </div>

              <div class="config-item">
                <div class="sub-title">
                  <p class="sub-title-title">{{ $t("settings.bindIP") }}</p>
                  <p class="sub-title-info">{{ $t("settings.bindIPInfo") }}</p>
                </div>
                <el-input :placeholder="$t('settings.inputIP')" v-model="settings.httpIp"></el-input>
              </div>

              <div class="config-item">
                <div class="sub-title">
                  <p class="sub-title-title">{{ $t("settings.loginPage") }}</p>
                  <p class="sub-title-info">{{ $t("settings.loginPageInfo") }}</p>
                </div>
                <el-input :placeholder="$t('settings.inputCopy')" v-model="settings.loginInfo"></el-input>
              </div>

              <div class="config-item" v-iszh>
                <div class="sub-title">
                  <p class="sub-title-title">{{ $t("views.Settings.001") }}</p>
                  <p class="sub-title-info">{{ $t("views.Settings.002") }}</p>
                </div>
                <el-input placeholder="https://..." v-model="settings.quickInstallAddr"></el-input>
              </div>
            </el-col>

            <el-col :md="4"></el-col>
            <el-col :md="8">
              <div>
                <div class="sub-title">
                  <p class="sub-title">{{ $t("settings.referenceLink") }}</p>
                  <p class="sub-title-info">{{ $t("settings.referenceLinksInfo") }}</p>
                </div>
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
              <div class="config-item" style="margin-top: 0px">
                <div class="sub-title">
                  <p class="sub-title-title">{{ $t("settings.canFileManager") }}</p>
                  <p class="sub-title-info">{{ $t("settings.canFileManagerInfo") }}</p>
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
                  <p class="sub-title-info">{{ $t("settings.crossAPIInfo") }}</p>
                </div>
                <el-select v-model="settings.crossDomain" :placeholder="$t('general.pleaseSelect')">
                  <el-option :label="$t('general.enable')" :value="true"></el-option>
                  <el-option :label="$t('general.forbid')" :value="false"></el-option>
                </el-select>
              </div>
              <div class="config-item">
                <div class="sub-title">
                  <p class="sub-title-title">{{ $t("settings.loginCheckIp") }}</p>
                  <p class="sub-title-info">{{ $t("settings.loginCheckIpInfo") }}</p>
                </div>
                <el-select
                  v-model="settings.loginCheckIp"
                  :placeholder="$t('general.pleaseSelect')"
                >
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
                <p class="sub-title-info">{{ $t("settings.aboutTitle2") }}</p>
              </div>

              <div class="contributors" v-if="sponsorList" v-iszh>
                <div class="sub-title">
                  <p class="sub-title-title">{{ $t("settings.sponsorList") }}</p>
                  <p class="sub-title-info">
                    {{ $t("settings.sponsorListInfo") }}
                    <a
                      href="https://mcsmanager.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >MCSManager.com</a>.
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
                        <span style="margin: 0px; font-size: 13px">{{ item.name }}</span>
                      </a>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :md="4"></el-col>
            <el-col :md="8">
              <div>
                <div class="sub-title">
                  <p class="sub-title">{{ $t("settings.aboutTheme.title") }}</p>
                  <p class="sub-title-info">
                    {{ $t("settings.aboutTheme.info") }}
                    <br />
                    {{ $t("settings.aboutTheme.info2") }}
                    <a
                      href="mailto:lazy_creeper@qq.com"
                    >lazy_creeper@qq.com</a>
                  </p>
                  <br />
                  <p class="sub-title-title">
                    {{ $t("settings.aboutTheme.blog") }}
                    <a
                      href="https://blog.imlazy.ink:233/index.php/archives/253/"
                      target="_blank"
                    >{{ $t("settings.aboutTheme.goLink") }}</a>
                  </p>
                  <p class="sub-title-title">
                    {{ $t("settings.aboutTheme.qrCode") }}
                    <a
                      href="https://cdn.imlazy.ink:233/img/20220924.jpg"
                      target="_blank"
                    >{{ $t("settings.aboutTheme.goLink") }}</a>
                  </p>
                  <p class="sub-title-title">
                    {{ $t("settings.aboutTheme.ver") }} {{ themeInfo.version }}&nbsp;&nbsp;
                    <a
                      href="javascript:;"
                      @click="checkThemeUpdate"
                    >{{ $t("settings.aboutTheme.checkVer") }}</a>
                    <lazy id="lazy"></lazy>
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
      </Panel>
    </div>

    <!-- 检查更新 -->
    <Dialog v-model="themeInfo.dialog">
      <template #title>{{ themeInfo.title }}</template>
      <template #default>
        <div v-if="!themeInfo.haveNew" class="themeInfoDialog" style="text-align: center;">
          <h1>你的MCSM主题为最新版本！</h1>
          <div class="row-mt">
            <ItemGroup>
              <el-button size="small" @click="themeInfo.dialog = false">{{ $t("general.cancel") }}</el-button>
            </ItemGroup>
          </div>
        </div>
        <div v-else class="themeInfoDialog">
          <h1>
            当前版本：{{ themeInfo.version }}&nbsp;&nbsp;|&nbsp;&nbsp;最新版本：
            <span
              class="newVersion"
            >{{ themeInfo.haveNew }}</span>
          </h1>
          <h1>更新内容：</h1>
          <wow v-html="themeInfo.content"></wow>
          <img src="../../assets/like.gif" />
          <br />
          <br />
          <b>你可以前往主题发布页获取更新</b>
          <div class="row-mt">
            <ItemGroup>
              <el-button size="small" @click="themeInfo.dialog = false">{{ $t("general.cancel") }}</el-button>
            </ItemGroup>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Panel from "../../components/Panel";
import { API_SETTINGS } from "../service/common";
import { request } from "../service/protocol";
import Dialog from "@/components/Dialog";
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {
    Panel,
    Dialog
  },
  data: function () {
    return {
      settings: {},
      sponsorList: null,
      themeInfo: {
        dialog: false,
        title: "",
        content: "",
        version: "3.0.2",
        haveNew: false
      }
    };
  },
  methods: {
    async refresh() {
      await this.render();
      this.$message({
        message: this.$t("general.refreshFinish"),
        type: "success"
      });
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
        window.location.reload();
        this.$message({
          message: this.$t("settings.settingUpdate"),
          type: "success"
        });
      } catch (error) {
        this.$message({
          message: error,
          type: "error"
        });
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
    }, //async changeForwardType(v) {
    //}

    checkThemeUpdate() {
      const { summer, summertext } = window.ver2;
      if (this.themeInfo.version === summer) {
        this.themeInfo.title = "偶吔~ヾ(≧▽≦*)o——";
        this.themeInfo.haveNew = false;
        this.themeInfo.dialog = true;
      } else {
        this.themeInfo.title = "发现新版本";
        this.themeInfo.content = summertext;
        this.themeInfo.dialog = true;
        this.themeInfo.haveNew = summer;
      }
    }
  },

  async mounted() {
    await this.render();
    setTimeout(this.loadSponsorList, 3000);
  }
};
</script>

<style scoped>
.selectedForwardMode {
  border: 1px solid #0450ff;
  color: #409eff;
}
.system-index-block {
  margin: 0px 0px 24px 0px;
}
.config-item {
  margin-top: 10px;
}
.contributors {
  margin: 10px 0px;
}

.themeInfoDialog {
  position: relative;
  width: 443px;
}
.themeInfoDialog .newVersion {
  filter: hue-rotate(315deg);
}
.themeInfoDialog h1 {
  font-size: 1.17em;
  margin-block: 4px;
}
.themeInfoDialog img {
  position: absolute;
  top: 40px;
  width: 233px;
  right: 0;
}
</style>
