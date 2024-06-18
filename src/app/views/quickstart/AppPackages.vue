<template>
  <el-row v-loading="appListLoading" :gutter="20" element-loading-background="rgba(0, 0, 0, 0.5)">
    <el-col :span="24">
      <Panel>
        <template #default>
          <el-radio-group style="margin-bottom: 12px" v-model="searchLanguage">
            <el-radio-button v-for="item in allAppLangList" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </template>
      </Panel>
    </el-col>

    <el-col
      v-for="item in appList"
      :key="item.targetLink + item.title"
      :span="24"
      :xl="6"
      :lg="8"
      :sm="12"
    >
      <Panel>
        <template #title>
          {{ item.title }}
        </template>
        <template #default>
          <div class="package-info-wrapper">
            <p>{{ item.description }}</p>
            <p class="color-gray">{{ $t("views.quickstart_McPreset.004") }}: {{ item.runtime }}</p>
            <p class="color-gray">{{ $t("views.quickstart_McPreset.006") }}: {{ item.hardware }}</p>
            <p class="color-gray">{{ $t("views.quickstart_McPreset.005") }}: {{ item.size }} MB</p>
          </div>
          <div class="package-op-wrapper">
            <el-button
              style="width: 100%"
              type="success"
              size="medium"
              icon="el-icon-download"
              @click="$emit('handleSelectTemplate', item)"
            >
              {{ $t("router.install") }}
            </el-button>
          </div>
        </template>
      </Panel>
    </el-col>
  </el-row>
</template>

<script>
import Panel from "@/components/Panel";
import { API_GET_QUICK_INSTALL_LIST_ADDR } from "../../service/common";
import { request } from "../../service/protocol";

export default {
  components: {
    Panel
  },
  data() {
    return {
      searchLanguage: "all",
      ALL_LANG_KEY: "all",
      presetList: null,
      appListLoading: false,
      appLangList: []
    };
  },
  computed: {
    appList() {
      // For MCSManager v9
      const v9List = this.presetList;
      if (v9List && v9List[0] && v9List[0].info && v9List[0].mc) {
        const list = v9List.map((v) => ({
          ...v,
          language: this.ALL_LANG_KEY,
          title: v.mc,
          runtime: `Java ${v.java}+`,
          description: v.info,
          hardware: v.remark,
          size: `${v.size}MB`
        }));
        return list;
      }
      // Check
      if (!this.presetList || !this.presetList.packages || !this.presetList.languages) {
        return [];
      }
      let list = this.presetList.packages;
      if (this.searchLanguage)
        list = list.filter(
          (item) =>
            item.language === this.searchLanguage || this.searchLanguage === this.ALL_LANG_KEY
        );
      return list;
    },
    allAppLangList() {
      let all = [
        {
          label: this.$t("CommonText.055"),
          value: this.ALL_LANG_KEY
        }
      ];
      if (this.presetList && Array.isArray(this.presetList.languages)) {
        all = all.concat(this.presetList.languages);
      }
      return all;
    }
  },
  methods: {
    async init() {
      try {
        this.appListLoading = true;
        const result = await request({
          method: "GET",
          url: API_GET_QUICK_INSTALL_LIST_ADDR
        });
        this.presetList = result;
        this.appListLoading = false;
        if (!this.appList || this.appList.length === 0) {
          this.$alert(
            this.$t("install.stoppedServiceContent"),
            this.$t("install.stoppedServiceTitle")
          );
        }
      } catch (err) {
        console.error(err.message);
        this.$message({
          type: "error",
          message: err.message
        });
        this.appListLoading = false;
      }
    }
  },
  mounted() {
    this.init();
    this.searchLanguage = this.$i18n.locale;
  }
};
</script>

<style lang="scss" scoped>
.package-info-wrapper {
  height: 140px;
  overflow: hidden;
  p {
    font-size: 13px;
    margin: 0px 0px 6px 0px;
  }
}
.package-op-wrapper {
  text-align: center;
  padding-bottom: 8px;
}
.panel-action {
  transition: all 0.4s;
}

.panel-action:hover {
  transform: scale(1.024);
  border: 1px solid rgb(27, 121, 203);
}

.display-center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.quick-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.tip-title {
  font-size: 18px;
}
</style>
