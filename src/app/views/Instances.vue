<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->

<template>
  <Panel>
    <template #title>{{ $t("instances.instancesList") }}</template>
    <template #default>
      <el-row :gutter="20" justify="space-between" class="row-mb">
        <el-col :md="24" :offset="0">
          <FunctionGroup :container="true">
            <FunctionComponent>
              <el-select
                style="width: 320px"
                v-model="currentRemoteUuid"
                filterable
                :placeholder="$t('instances.selectDaemon')"
                size="small"
                @change="remoteSelectHandle"
              >
                <el-option
                  v-for="item in remoteList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </FunctionComponent>
            <FunctionComponent>
              <el-select
                style="width: 120px"
                v-model="query.status"
                filterable
                :placeholder="$t('services.instanceStatus')"
                size="small"
                @change="refresh"
              >
                <el-option :label="$t('CommonText.055')" value=""> </el-option>
                <el-option v-for="(item, i) in INSTANCE_STATUS" :key="i" :label="item" :value="i">
                </el-option>
              </el-select>
            </FunctionComponent>
            <FunctionComponent>
              <el-input
                v-model="query.instanceName"
                :placeholder="$t('instances.searchInstanceName')"
                size="small"
                style="width: 160px"
              ></el-input>
            </FunctionComponent>
            <FunctionComponent>
              <el-button size="small" @click="refresh" type="primary">
                <i class="el-icon-refresh"></i> {{ $t("general.search") }}
              </el-button>
            </FunctionComponent>
            <FunctionGroup align="right">
              <FunctionComponent
                component="button"
                type="success"
                size="small"
                :plain="true"
                v-if="showTableList"
                @click="changeView(1)"
              >
                {{ $t("instances.showCardList") }}
              </FunctionComponent>

              <FunctionComponent
                component="button"
                size="small"
                type="primary"
                :plain="true"
                v-if="!showTableList"
                @click="changeView(2)"
              >
                {{ $t("instances.showTableList") }}
              </FunctionComponent>

              <FunctionComponent
                component="button"
                size="small"
                type="success"
                @click="toNewInstance"
              >
                <i class="el-icon-plus"></i> {{ $t("instances.newInstance") }}
              </FunctionComponent>

              <FunctionComponent
                component="button"
                size="small"
                v-if="showTableList"
                @click="batOpen"
              >
                <i class="el-icon-video-play"></i> {{ $t("instances.start") }}
              </FunctionComponent>
              <FunctionComponent
                component="button"
                size="small"
                v-if="showTableList"
                @click="batStop"
              >
                <i class="el-icon-video-pause"></i> {{ $t("instances.stop") }}
              </FunctionComponent>
              <FunctionComponent
                component="button"
                size="small"
                v-if="showTableList"
                @click="batKill"
              >
                <i class="el-icon-video-pause"></i> {{ $t("instances.kill") }}
              </FunctionComponent>
              <FunctionComponent
                component="button"
                size="small"
                type="danger"
                :plain="true"
                v-if="showTableList"
                @click="batDelete(1)"
              >
                <i class="el-icon-delete"></i> {{ $t("instances.remove") }}
              </FunctionComponent>
              <FunctionComponent
                component="button"
                size="small"
                type="danger"
                :plain="true"
                v-if="showTableList"
                @click="batDelete(2)"
              >
                <i class="el-icon-delete"></i> {{ $t("instances.delete") }}
              </FunctionComponent>
            </FunctionGroup>
          </FunctionGroup>
        </el-col>
      </el-row>

      <div>
        <div class="instance-table-wrapper">
          <div>
            <div class="color-red" v-if="!currentRemoteUuid">
              &nbsp;Error: {{ $t("instances.selectRemoteError") }}
            </div>

            <el-button
              v-if="selectedTags.length"
              size="mini"
              type="danger"
              :plain="true"
              @click="removeAllTags"
            >
              <i class="el-icon-delete"></i>
              {{ isZh ? $t("terminal.clearTerminal").slice(0, 2) : $t("terminal.clearTerminal") }}
            </el-button>

            <el-button
              v-for="tag in allTags"
              :key="tag"
              size="mini"
              type="plain"
              class="tag-btn"
              :class="{ 'tag-btn-selected': selectedTags.includes(tag) }"
              @click="selectedTags.includes(tag) ? removeTag(tag) : selectTag(tag)"
              >{{ tag }}</el-button
            >
          </div>
          <div>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="maxPage"
              v-model:currentPage="page"
              :page-size="1"
              @current-change="handleCurrentChange"
              small
            ></el-pagination>
          </div>
        </div>
      </div>
    </template>
  </Panel>

  <!-- Display when no daemon is selected -->
  <Panel v-if="!currentRemoteUuid">
    <template #title>{{ $t("instances.table.instancesList") }}</template>
    <template #default>
      <div class="notAnyInstanceTip">
        <img src="../../assets/p.gif" />
        <div class="sub-title">
          <div class="sub-title-title">{{ $t("instances.selectRemoteTitle") }}</div>
          <div class="sub-title-info">
            {{ $t("instances.selectRemoteInfo") }}
          </div>
        </div>
      </div>
    </template>
  </Panel>

  <!-- Display when the first page has no data -->
  <Panel v-else-if="notAnyInstance && page === 1">
    <template #title>{{ $t("instances.table.instancesList") }}</template>
    <template #default>
      <div class="notAnyInstanceTip">
        <img src="../../assets/notAnyInstance.gif" />
        <div class="sub-title">
          <div class="sub-title-title">{{ $t("instances.notAnyInstanceTitle") }}</div>
          <div class="sub-title-info">
            {{ $t("instances.notAnyInstanceInfo") }}
          </div>
        </div>
      </div>
    </template>
  </Panel>

  <!-- Card display style -->
  <el-row class="row-mb" v-if="!showTableList && !notAnyInstance" style="margin: -10px">
    <el-col
      :xs="24"
      :sm="12"
      :md="8"
      :lg="6"
      :xl="4"
      :offset="0"
      v-for="(item, index) in instances"
      :key="index"
      style="padding: 10px"
    >
      <Panel
        :class="{
          instanceStatusGreen: item.status === 3,
          instanceStatusGray: item.status !== 3,
          runningInstanceCard: true
        }"
        :tipType="0"
        style="margin-bottom: 0; height: 100%"
      >
        <template #title>
          <div
            style="font-size: 13px"
            class="only-line-text"
            @click="toInstance(item.serviceUuid, item.instanceUuid)"
          >
            {{ item.nickname }}
          </div>
        </template>
        <template #rtitle>
          <div>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <i
                  class="el-icon-more-outline"
                  style="font-weight: 400; color: #409eff; font-size: 18px"
                ></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="
                      $refs.tagsDialog.openDialog(
                        item.serviceUuid,
                        item.instanceUuid,
                        item.tags,
                        allTags
                      )
                    "
                    >{{ $t("tag.008") }}</el-dropdown-item
                  >
                  <el-dropdown-item @click="editInstance(item.serviceUuid, item.instanceUuid)">{{
                    $t("instances.card.editConfig")
                  }}</el-dropdown-item>
                  <el-dropdown-item @click="toInstance(item.serviceUuid, item.instanceUuid)">{{
                    $t("instances.card.controlPanel")
                  }}</el-dropdown-item>
                  <el-dropdown-item @click="unlinkInstance(item.instanceUuid)">{{
                    $t("instances.card.remove")
                  }}</el-dropdown-item>
                  <el-dropdown-item @click="unlinkInstance(item.instanceUuid, true)">{{
                    $t("instances.card.delete")
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <template #default>
          <div
            v-if="item.tags.length"
            class="row-mb flex flex-align-items-center flex-wrap"
            style="gap: 8px"
          >
            <el-tag v-for="tag in item.tags" :key="tag" size="mini" type="plain">{{ tag }}</el-tag>
          </div>

          <div
            class="instanceInfoArea only-line-text"
            @click="toInstance(item.serviceUuid, item.instanceUuid)"
          >
            <div>
              {{ $t("instances.status.title") }}:
              <span class="color-gray" v-if="item.status == 0">{{
                $t("instances.status.die")
              }}</span>
              <span class="color-green" v-else-if="item.status == 3">{{
                $t("instances.status.running")
              }}</span>
              <span class="color-yellow" v-else-if="item.status == 1">{{
                $t("instances.status.stopping")
              }}</span>
              <span class="color-yellow" v-else-if="item.status == 2">{{
                $t("instances.status.starting")
              }}</span>
              <span class="color-red" v-else-if="item.status == -1">{{
                $t("instances.status.busy")
              }}</span>
              <span class="color-red" v-else>{{ $t("instances.status.busy") }}</span>
            </div>
            <div>
              <span>{{ $t("instances.lastDatetime") }}: </span>
              <span>{{ formatTimestamp(item.config.lastDatetime) }}</span>
            </div>
            <div>
              <span>{{ $t("instances.endTime") }}: </span>
              <span>{{ formatTimestamp(item.config.endTime) }}</span>
            </div>
            <div>
              <span>{{ $t("instances.otherInfo") }}: </span>
              <span>
                <span v-if="item.info && item.info.currentPlayers >= 0">
                  {{ $t("instances.playerCount") }} {{ item.info.currentPlayers }}/{{
                    item.info.maxPlayers
                  }}
                </span>
                <span v-else-if="item.info && item.version">
                  &nbsp;{{ $t("instances.mcVersion") }} {{ item.version }}
                </span>
                <span v-else></span>
              </span>
            </div>
          </div>
          <div class="InstanceFunctionArea"></div>
        </template>
      </Panel>
    </el-col>
  </el-row>

  <!-- Table display style -->
  <el-row :gutter="20" class="row-mb" v-if="showTableList && !notAnyInstance">
    <el-col :span="24" :offset="0">
      <Panel>
        <template #title>{{ $t("instances.table.instancesList") }}</template>
        <template #default>
          <!-- table display -->
          <el-table
            :data="instances"
            stripe
            style="width: 100%"
            size="mini"
            ref="multipleTable"
            @selection-change="selectionChange"
            v-show="!notAnyInstance && currentRemoteUuid && showTableList"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="nickname" :label="$t('instances.instanceName')" min-width="140">
              <template #default="scope">
                <div
                  @click="toInstance(scope.row.serviceUuid, scope.row.instanceUuid)"
                  class="instanceTitle"
                >
                  {{ scope.row.nickname }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="currentPlayers" label="Tags" min-width="240">
              <template #default="scope">
                <div class="flex flex-align-items-center flex-wrap" style="gap: 8px">
                  <el-button
                    icon="el-icon-edit"
                    size="mini"
                    circle
                    @click="
                      $refs.tagsDialog.openDialog(
                        scope.row.serviceUuid,
                        scope.row.instanceUuid,
                        scope.row.tags,
                        allTags
                      )
                    "
                  >
                  </el-button>
                  <el-tag v-for="tag in scope.row.tags" :key="tag" size="mini" type="plain">{{
                    tag
                  }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="currentPlayers"
              :label="$t('instances.detailsInfo')"
              min-width="100"
            >
              <template #default="scope">
                <div>
                  <span v-if="scope.row.info && scope.row.info.currentPlayers >= 0">
                    {{ $t("instances.playerCount") }}: {{ scope.row.info.currentPlayers }}/{{
                      scope.row.info.maxPlayers
                    }}
                  </span>
                  <span v-if="scope.row.info && scope.row.version">
                    &nbsp;{{ $t("instances.mcVersion") }}: {{ scope.row.version }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('instances.status.runStatus')" width="100">
              <template #default="scope">
                <div class="color-gray" v-if="scope.row.status == 0">
                  <i class="el-icon-video-pause"></i>
                  <span> {{ $t("instances.status.die") }}</span>
                </div>
                <div class="color-green" v-else-if="scope.row.status == 3">
                  <i class="el-icon-video-play"></i>
                  <span> {{ $t("instances.status.running") }}</span>
                </div>
                <span class="color-yellow" v-else-if="scope.row.status == 1">{{
                  $t("instances.status.stopping")
                }}</span>
                <span class="color-yellow" v-else-if="scope.row.status == 2">{{
                  $t("instances.status.starting")
                }}</span>

                <span class="color-red" v-else-if="scope.row.status == -1">{{
                  $t("instances.status.busy")
                }}</span>
                <span class="color-red" v-else>{{ $t("instances.status.busy") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              :label="$t('instances.table.instanceType')"
              width="160"
            ></el-table-column>
            <el-table-column :label="$t('general.operate')" style="text-align: center" width="240">
              <template #default="scope">
                <el-button
                  size="mini"
                  @click="editInstance(scope.row.serviceUuid, scope.row.instanceUuid)"
                >
                  {{ $t("general.setting") }}
                </el-button>
                <el-button
                  size="mini"
                  @click="toInstance(scope.row.serviceUuid, scope.row.instanceUuid)"
                >
                  {{ $t("general.manage") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </Panel>
    </el-col>
  </el-row>

  <TagsDialog ref="tagsDialog" @update:tags="refresh" />
</template>

<style scoped>
.only-line-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.2s;
}

.only-line-text:hover {
  filter: sepia(1);
}

.instanceTitle {
  cursor: pointer;
}

.notAnyInstanceTip {
  text-align: center;
  margin: 100px 0px;
  color: #7f7f7f;
}

.instanceStatusGreen {
  border-left: 4px solid rgb(8, 166, 8);
}

.instanceStatusGray {
  filter: var(--card-instance-gray-filter);
}

.runningInstanceCard {
  overflow: hidden;
  cursor: pointer;
  transition: all 1s;
}
.runningInstanceCard:hover {
  background: var(--card-instance-bg-hover);
  box-shadow: var(--card-instance-shadow-hover);
}
.instanceInfoArea > * {
  margin-bottom: 6px;
}
</style>

<script>
import { CircleCheckFilled, CircleCloseFilled, Edit } from "@element-plus/icons";
import Panel from "../../components/Panel";
// import LineLabel from "../../components/LineLabel";
import { ElMessage } from "element-plus";
import axios from "axios";
import { API_INSTANCE, API_SERVICE_INSTANCES, API_SERVICE_LIST, API_URL } from "../service/common";
import router from "../router";
import { request } from "../service/protocol";
import { typeTextToReadableText } from "../service/instance_tools";
import TagsDialog from "./NewInstance/TagsDialog.vue";
import { parseTimestamp } from "../utils";
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Panel, CircleCheckFilled, CircleCloseFilled, Edit, TagsDialog },
  data() {
    return {
      remoteList: [],
      currentRemoteUuid: null,
      instances: [],
      allTags: [],
      selectedTags: [],
      multipleSelection: [], // table multiple selection properties
      startedInstance: 0,
      loading: true,
      // list of available and unavailable daemons
      availableService: [],
      unavailableService: [],

      notAnyInstance: false,

      page: 1,
      maxPage: 1,

      query: {
        instanceName: "",
        status: ""
      },

      // batch mode
      showTableList: false,

      INSTANCE_STATUS: {
        "-1": this.$t("home.maintaining"),
        0: this.$t("home.outOfRunning"),
        1: this.$t("home.stopping"),
        2: this.$t("home.starting"),
        3: this.$t("home.running")
      }
    };
  },
  computed: {
    isZh() {
      return window.i18n.global.locale === "zh_cn";
    }
  },
  async mounted() {
    // Initialize data read
    this.showTableList = Number(localStorage.getItem("InstanceView")) === 2 ? true : false;
    await this.render();
  },
  beforeUnmount() {},
  methods: {
    // Get the list of distributed services (excluding the list of specific instances)
    async displayRemoteServiceList() {
      const data = await request({
        method: "GET",
        url: API_SERVICE_LIST
      });
      for (const service of data) {
        const ip = `${service.ip}:${service.port}`;
        const remarks = `${service.remarks}`;
        if (service.available) {
          this.remoteList.push({
            value: service.uuid,
            label: `${ip} ${remarks}`,
            available: true
          });
          this.availableService.push(service);
        } else {
          this.remoteList.push({
            value: service.uuid,
            label: `${ip} ${remarks} ( ` + this.$t("overview.offline") + " )",
            available: false
          });
          this.unavailableService.push(service);
        }
      }

      // if existsselect the next record, then jump directly to the previous record
      const lastSelected = localStorage.getItem("pageSelectedRemoteUuid");
      if (lastSelected) {
        this.remoteList.forEach((v) => {
          if (v.value === lastSelected) {
            this.currentRemoteUuid = v.value;
            return this.remoteSelectHandle();
          }
        });
      } else {
        this.remoteList.forEach((v) => {
          if (v.available) {
            // By default, the first open instance is taken
            this.currentRemoteUuid = v.value;
            return;
          }
        });
        this.remoteSelectHandle();
      }
    },
    // Get a list of specific instances of the daemon process
    async remoteSelectHandle() {
      try {
        if (!this.currentRemoteUuid) throw new Error(this.$t("instances.selectRemoteError"));
        this.startedInstance = 0;
        this.instances = [];
        this.loading = true;
        const result = await request({
          method: "GET",
          url: API_SERVICE_INSTANCES,
          params: {
            daemonId: this.currentRemoteUuid,
            page: this.page,
            status: this.query.status,
            page_size: 10,
            instance_name: this.query.instanceName,
            tag: JSON.stringify(this.selectedTags)
          }
        });
        // page number adjustment
        this.page = result.page;
        this.maxPage = result.maxPage;
        this.allTags = result.allTags;
        const instances = result.data;
        instances.forEach((instance) => {
          const status = instance.status;
          const type = typeTextToReadableText(instance.config.type);
          // Calculate the running instance
          if (instance.status != 0) this.startedInstance++;
          // push all instances
          this.instances.push({
            tags: instance.config.tag,
            instanceUuid: instance.instanceUuid,
            serviceUuid: this.currentRemoteUuid,
            nickname: instance.config.nickname,
            info: instance.info,
            currentPlayers: instance.info ? instance.info.currentPlayers : "0",
            version: instance.info ? instance.info.version : "",
            config: instance.config,
            type,
            status
          });
        });
        this.loading = false;
        // Record the currently selected daemon process, so that it can be loaded directly next time
        localStorage.setItem("pageSelectedRemoteUuid", this.currentRemoteUuid);

        // When there is no instance, display the quick creation interface
        if (this.instances.length === 0) {
          this.notAnyInstance = true;
        } else {
          this.notAnyInstance = false;
        }
      } catch (error) {
        this.$notify({
          title: this.$t("notify.connectDaemonError"),
          message: error.toString(),
          type: "error"
        });
      }
    },
    // pagination change
    handleCurrentChange() {
      this.refresh();
    },
    refresh() {
      this.remoteSelectHandle();
    },
    async render() {
      await this.displayRemoteServiceList();
    },
    // table multi-select function
    selectionChange(v) {
      if (v.length == 0) this.canInterval = true;
      else this.canInterval = false;
      this.multipleSelection = v;
    },
    editInstance(serviceUuid, instanceUuid) {
      console.log("Edit Instances:", serviceUuid, instanceUuid);
      router.push({ path: `/instance_detail/${serviceUuid}/${instanceUuid}/` });
    },
    toNewInstance() {
      if (!this.currentRemoteUuid) {
        return this.$message({ type: "info", message: this.$t("instances.selectRemoteTitle") });
      }
      router.push({ path: `/new_instance/${this.currentRemoteUuid}` });
    },
    toInstance(serviceUuid, instanceUuid) {
      console.log("View Instance:", serviceUuid, instanceUuid);
      router.push({ path: `/terminal/${serviceUuid}/${instanceUuid}/` });
    },
    async unlinkInstance(uuid, deleteFile = false) {
      if (deleteFile) {
        await this.$confirm(
          this.$t("notify.confirmDelContent2"),
          this.$t("notify.confirmDelTitle"),
          {
            confirmButtonText: this.$t("general.confirm2"),
            cancelButtonText: this.$t("general.cancel"),
            type: "warning"
          }
        );
      } else {
        await this.$confirm(
          this.$t("notify.confirmDelContent"),
          this.$t("notify.confirmDelTitle"),
          {
            confirmButtonText: this.$t("general.confirm"),
            cancelButtonText: this.$t("general.cancel"),
            type: "warning"
          }
        );
      }
      await axios.request({
        method: "DELETE",
        url: API_INSTANCE,
        params: {
          daemonId: this.currentRemoteUuid
        },
        data: { uuids: [uuid], deleteFile }
      });
      this.$notify({
        title: this.$t("notify.delSuccess"),
        message: this.$t("notify.Success")
      });
    },
    // batch deletion
    async batDelete(type) {
      if (type === 1) {
        await this.$confirm(
          this.$t("notify.confirmBatchDelContent"),
          this.$t("notify.confirmDelTitle"),
          {
            confirmButtonText: this.$t("general.confirm"),
            cancelButtonText: this.$t("general.cancel"),
            type: "warning"
          }
        );
      } else {
        await this.$confirm(
          this.$t("notify.confirmDelContent2"),
          this.$t("notify.confirmDelTitle"),
          {
            confirmButtonText: this.$t("general.confirm2"),
            cancelButtonText: this.$t("general.cancel"),
            type: "warning"
          }
        );
      }

      const uuids = [];
      for (const iterator of this.multipleSelection) {
        uuids.push(iterator.instanceUuid);
      }
      if (uuids.length === 0) {
        return this.$message({ type: "error", message: this.$t("instances.selectOne") });
      }
      await axios.request({
        method: "DELETE",
        url: API_INSTANCE,
        params: {
          daemonId: this.currentRemoteUuid
        },
        data: { uuids, deleteFile: type === 1 ? false : true }
      });
      this.$notify({
        title: this.$t("notify.batchDelSuccess"),
        message: this.$t("notify.mayBeDelay")
      });
    },
    async batKill() {
      if (this.multipleSelection.length == 0)
        return ElMessage.error(this.$t("notify.selectInsError"));
      await axios.request({
        method: "POST",
        url: `${API_URL}/api/instance/multi_kill/`,
        data: this.multipleSelection
      });
      this.$notify({
        title: this.$t("notify.killCmdSend"),
        message: this.$t("notify.cmdSendInfo")
      });
    },
    async batOpen() {
      if (this.multipleSelection.length == 0)
        return ElMessage.error(this.$t("notify.selectInsError"));
      await axios.request({
        method: "POST",
        url: `${API_URL}/api/instance/multi_open/`,
        data: this.multipleSelection
      });
      this.$notify({
        title: this.$t("notify.startCmdSend"),
        message: this.$t("notify.cmdSendInfo")
      });
    },
    async batStop() {
      if (this.multipleSelection.length == 0)
        return ElMessage.error(this.$t("notify.selectInsError"));
      await axios.request({
        method: "POST",
        url: `${API_URL}/api/instance/multi_stop/`,
        data: this.multipleSelection
      });
      this.$notify({
        title: this.$t("notify.stopCmdSend"),
        message: this.$t("notify.cmdSendInfo")
      });
    },
    changeView(type = 1) {
      if (type === 1) this.showTableList = false;
      if (type === 2) this.showTableList = true;
      localStorage.setItem("InstanceView", type);
    },

    selectTag(tag) {
      this.selectedTags.push(tag);
      this.refresh();
    },

    removeTag(tag) {
      this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
      this.refresh();
    },

    removeAllTags() {
      this.selectedTags = [];
      this.refresh();
    },

    formatTimestamp: (t) => parseTimestamp(t)
  }
};
</script>
