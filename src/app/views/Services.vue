<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->

<template>
  <Panel>
    <template #title>{{ $t("services.remoteDaemonManage") }}</template>
    <template #default>
      <div class="flex flex-space-between row-mb">
        <ItemGroup>
          <el-button type="success" size="small" @click="openNewServiceDialog">{{
            $t("services.addDaemon")
          }}</el-button>
          <el-button size="small" @click="refresh">{{ $t("general.refresh") }}</el-button>
        </ItemGroup>
        <ItemGroup>
          <el-button size="small" v-if="showTableList" @click="changeView(1)" type="success">{{
            $t("instances.showCardList")
          }}</el-button>

          <el-button size="small" v-if="!showTableList" @click="changeView(2)" type="primary">{{
            $t("instances.showTableList")
          }}</el-button>
          <el-button size="small" @click="openPrinciplePanel">{{
            $t("services.learnHowItWork")
          }}</el-button>
        </ItemGroup>
      </div>
      <div v-html="$t('services.remoteInfo', { specifiedDaemonVersion })"></div>
    </template>
  </Panel>

  <Panel v-show="showTableList">
    <template #title>{{ $t("services.Daemons") }}</template>
    <template #default>
      <el-table :data="services" size="small">
        <el-table-column :label="$t('overview.addr')" width="170">
          <template #default="scope">
            <el-input
              size="small"
              v-model="scope.row.ip"
              :placeholder="$t('general.required')"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('overview.port')" width="100">
          <template #default="scope">
            <el-input
              size="small"
              v-model="scope.row.port"
              :placeholder="$t('general.required')"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('overview.prefix')" width="100">
          <template #default="scope">
            <el-input
              size="small"
              v-model="scope.row.prefix"
              :placeholder="$t('general.optional')"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="ID" width="40">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.uuid + $t('services.copyId')"
              placement="top"
            >
              <i class="pointer el-icon-document-copy" @click="copyText(scope.row.uuid)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('overview.remarks')" width="190">
          <template #default="scope">
            <span>
              {{ scope.row.remarks }}
              <i style="cursor: pointer" class="el-icon-edit" @click="updateRemarks(scope.row)"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('services.platform')" width="100">
          <template #default="scope">
            <div v-if="scope.row.system">
              {{ scope.row.system.platform == "win32" ? "windows" : scope.row.system.platform }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="CPU">
          <template #default="scope">
            <div v-if="scope.row.system">
              {{ Number(scope.row.system.cpuUsage * 100).toFixed(1) }}%
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('overview.mem')">
          <template #default="scope">
            <div v-if="scope.row.system">{{ scope.row.system.memText }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('services.instanceStatus')">
          <template #default="scope">
            <div v-if="scope.row.instance">
              {{ scope.row.instance.running }}/{{ scope.row.instance.total }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('services.version')">
          <template #default="scope">
            <span class="color-green" v-if="scope.row.version === specifiedDaemonVersion">
              <i class="el-icon-circle-check"></i>
              {{ scope.row.version }}
            </span>
            <span class="color-red" v-else>
              <el-tooltip effect="dark" placement="top" :content="$t('overview.lowDaemonVersion')">
                <span>
                  <i class="el-icon-warning-outline"></i>
                  {{ scope.row.version }}
                </span>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('overview.connectStatus')">
          <template #default="scope">
            <span class="color-green" v-if="scope.row.available">
              <i class="el-icon-circle-check"></i>
              {{ $t("overview.online") }}
            </span>
            <span class="color-red" v-if="!scope.row.available">
              <el-tooltip effect="dark" :content="$t('overview.errorConnect')" placement="top">
                <span>
                  <i class="el-icon-warning-outline"></i>
                  {{ $t("overview.offline") }}
                </span>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('overview.frontendConnection')">
          <template #default="scope">
            <span
              class="color-green"
              v-if="frontendSocketStatus[scope.row.uuid] === SocketStatus.Connected"
            >
              <i class="el-icon-circle-check"></i>
              {{ $t("CommonText.056") }}
            </span>
            <span class="color-red" v-else>
              <el-tooltip
                effect="dark"
                :content="$t('overview.frontendConnectionError')"
                placement="top"
              >
                <span>
                  <i class="el-icon-warning-outline"></i>
                  {{ $t("CommonText.057") }}
                </span>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.operate')" style="text-align: center" width="230px">
          <template #default="scope">
            <el-button size="mini" @click="linkService(scope.row, true)">{{
              scope.row.available ? $t("services.update") : $t("services.connect")
            }}</el-button>
            <el-button size="mini" @click="updateKey(scope.row, true)">
              {{ $t("services.changeKey") }}
            </el-button>
            <el-button size="mini" type="danger" plain @click="deleteService(scope.row.uuid)">
              {{ $t("general.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </Panel>

  <div v-show="!showTableList">
    <el-row :gutter="20">
      <el-col
        :md="12"
        :lg="12"
        :xl="6"
        :offset="0"
        v-for="(node, index) in services"
        :key="node.uuid"
      >
        <Panel :tipType="1">
          <template #title>
            <span>{{ node.remarks || `${node.ip}:${node.port}` }}</span>
            <span style="margin-left: 8px">
              <i style="cursor: pointer" class="el-icon-edit" @click="updateRemarks(node)"></i>
            </span>
          </template>
          <template #rtitle v-if="node.available">
            <el-button size="mini" @click="updateKey(node, true)">{{
              $t("services.changeKey")
            }}</el-button>
            <el-button size="mini" type="danger" @click="deleteService(node.uuid)">{{
              $t("general.delete")
            }}</el-button>
          </template>
          <template #default>
            <div class="daemonInfoArea">
              <div class="daemonValueArea">
                <el-row :gutter="20">
                  <el-col :md="12" :xs="12" :lg="6" :offset="0">
                    <p>{{ $t("services.platform") }}</p>
                    <div>
                      {{
                        node?.system?.platform == "win32"
                          ? "windows"
                          : node?.system?.platform || "--"
                      }}
                    </div>
                  </el-col>
                  <el-col :md="12" :xs="12" :lg="6" :offset="0">
                    <p>{{ $t("overview.mem") }}</p>
                    <div>{{ node?.system?.memText || "--" }}</div>
                  </el-col>
                  <el-col :md="12" :xs="12" :lg="6" :offset="0">
                    <p>CPU</p>
                    <div v-if="node.system">
                      {{ Number(node.system.cpuUsage * 100).toFixed(1) }}%
                    </div>
                    <div v-else>--</div>
                  </el-col>
                  <el-col :md="12" :xs="12" :lg="6" :offset="0">
                    <p>{{ $t("services.instanceStatus") }}</p>
                    <div v-if="node.instance">
                      {{ node.instance.running }}/{{ node.instance.total }}
                    </div>
                    <div v-else>--</div>
                  </el-col>
                  <el-col :md="12" :xs="12" :lg="6" :offset="0">
                    <p>{{ $t("overview.connectStatus") }}</p>
                    <div>
                      <span class="color-green" v-if="node.available">
                        <i class="el-icon-circle-check"></i>
                        {{ $t("overview.online") }}
                      </span>
                      <span class="color-red" v-else>
                        <el-tooltip
                          effect="dark"
                          :content="$t('overview.errorConnect')"
                          placement="top"
                        >
                          <span>
                            <i class="el-icon-warning-outline"></i>
                            {{ $t("overview.offline") }}
                          </span>
                        </el-tooltip>
                      </span>
                    </div>
                  </el-col>
                  <el-col :md="12" :xs="12" :lg="6" :offset="0">
                    <p>{{ $t("overview.frontendConnection") }}</p>
                    <div>
                      <span
                        class="color-green"
                        v-if="frontendSocketStatus[node.uuid] === SocketStatus.Connected"
                      >
                        <i class="el-icon-circle-check"></i>
                        {{ $t("CommonText.056") }}
                      </span>
                      <span class="color-red" v-else>
                        <el-tooltip
                          effect="dark"
                          :content="$t('overview.frontendConnectionError')"
                          placement="top"
                        >
                          <span>
                            <i class="el-icon-warning-outline"></i>
                            {{ $t("CommonText.057") }}
                          </span>
                        </el-tooltip>
                      </span>
                    </div>
                  </el-col>
                  <el-col :md="12" :xs="12" :lg="6" :offset="0">
                    <p>{{ $t("services.version") }}</p>
                    <div v-if="node.instance">
                      <span class="color-green" v-if="node.version === specifiedDaemonVersion">
                        <i class="el-icon-circle-check"></i>
                        {{ node.version }}
                      </span>
                      <span class="color-red" v-else>
                        <el-tooltip
                          effect="dark"
                          placement="top"
                          :content="$t('overview.lowDaemonVersion')"
                        >
                          <span>
                            <i class="el-icon-warning-outline"></i>
                            {{ node.version }}
                          </span>
                        </el-tooltip>
                      </span>
                    </div>
                    <div v-else>--</div>
                  </el-col>
                  <el-col :md="12" :xs="12" :lg="6" :offset="0">
                    <p>Daemon ID</p>
                    <div>
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="node.uuid + $t('services.copyId')"
                        placement="top"
                      >
                        <i class="pointer el-icon-document-copy" @click="copyText(node.uuid)"></i>
                      </el-tooltip>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="daemonChartArea">
                <el-row :gutter="20">
                  <el-col :md="12" :offset="0">
                    <p>{{ $t("services.cpuChartTip") }}</p>
                    <div
                      class="daemon-chart"
                      :id="'echart-wrapper-daemon-cpu-' + index"
                      style="width: 100%; height: 40px"
                    ></div>
                  </el-col>
                  <el-col :md="12" :offset="0">
                    <p>{{ $t("services.memChartTip") }}</p>
                    <div
                      class="daemon-chart"
                      :id="'echart-wrapper-daemon-mem-' + index"
                      style="width: 100%; height: 40px"
                    ></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div>
              <el-row :gutter="0" justify="space-between">
                <el-col :md="12" :xl="12" :offset="0">
                  <div class>
                    <el-input
                      size="mini"
                      v-model="node.ip"
                      :placeholder="$t('overview.addr')"
                      style="max-width: 120px; margin-right: 4px"
                    ></el-input>

                    <el-input
                      size="mini"
                      v-model="node.port"
                      :placeholder="$t('overview.port')"
                      style="max-width: 70px; margin-right: 4px"
                    ></el-input>

                    <el-input
                      size="mini"
                      v-model="node.prefix"
                      :placeholder="$t('overview.prefix')"
                      style="max-width: 80px; margin-right: 4px"
                    ></el-input>

                    <el-button size="mini" @click="linkService(node, true)">
                      {{ node.available ? $t("services.update") : $t("services.connect") }}
                    </el-button>
                  </div>
                </el-col>
                <el-col :md="12" :xl="12" :offset="0">
                  <div class="daemon-operations">
                    <template v-if="node.available">
                      <el-button size="mini" @click="toDaemonTerminalPage(node.uuid)">{{
                        $t("services.toTerminal")
                      }}</el-button>
                      <el-button size="mini" @click="toDaemonFileManagerPage(node.uuid)">{{
                        $t("services.toFileManager")
                      }}</el-button>
                      <el-button size="mini" @click="toDaemonImagesPage(node.uuid)">{{
                        $t("services.toDocker")
                      }}</el-button>
                    </template>
                    <template v-else>
                      <el-button size="mini" @click="updateKey(node, true)">{{
                        $t("services.changeKey")
                      }}</el-button>
                      <el-button size="mini" type="danger" @click="deleteService(node.uuid)">{{
                        $t("general.delete")
                      }}</el-button>
                    </template>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
        </Panel>
      </el-col>
    </el-row>
  </div>

  <Dialog v-model="isNewService">
    <template #title>{{ $t("services.addDaemon") }}</template>
    <template #default>
      <div>
        <div class="sub-title">{{ $t("services.remarks") }}</div>
        <el-input
          v-model="newServiceInfo.remarks"
          :placeholder="$t('services.remarksInfo')"
          size="small"
        ></el-input>
        <div class="sub-title row-mt">
          <div class="sub-title-title">{{ $t("services.remoteIP") }}</div>
          <div class="sub-title-info">
            <span v-html="$t('services.remoteIPSub')"></span>
          </div>
        </div>
        <el-input
          v-model="newServiceInfo.ip"
          :placeholder="$t('services.remoteIPInfo')"
          size="small"
        ></el-input>
        <div class="sub-title row-mt">{{ $t("services.daemonPort") }}</div>
        <el-input
          v-model="newServiceInfo.port"
          :placeholder="$t('services.daemonPortInfo')"
          size="small"
        ></el-input>
        <div class="sub-title row-mt">
          <div class="sub-title-title">{{ $t("services.verifyKey") }}</div>
          <div class="sub-title-info">
            {{ $t("services.keySub") }}
            <br />
            {{ $t("services.keySub2") }}
            <br />
            <a href="https://docs.mcsmanager.com/" target="_blank" class="color-blue" v-iszh>{{
              $t("services.getKey")
            }}</a>
            <a
              href="   https://github.com/MCSManager/MCSManager/wiki/Connect-to-a-Remote-Daemon"
              target="_blank"
              class="color-blue"
              v-isen
              >{{ $t("services.getKey") }}</a
            >
          </div>
        </div>
        <el-input
          v-model="newServiceInfo.apiKey"
          :placeholder="$t('services.keyInfo')"
          size="small"
        ></el-input>
        <div class="sub-title row-mt">
          <div class="sub-title-title">{{ $t("overview.prefix") }}</div>
          <div class="sub-title-info">
            {{ $t("services.prefixInfo") }}
          </div>
        </div>
        <el-input
          v-model="newServiceInfo.prefix"
          :placeholder="$t('general.optional')"
          size="small"
        ></el-input>
        <div class="row-mt">
          <ItemGroup>
            <el-button type="success" size="small" @click="toNewService(false)">
              {{ $t("general.add") }}
            </el-button>
            <el-button @click="isNewService = !isNewService" size="small">
              {{ $t("general.cancel") }}
            </el-button>
          </ItemGroup>
        </div>
      </div>
    </template>
  </Dialog>

  <Dialog v-model="isNewServiceWarning">
    <template #title>{{ $t("services.addNewWarn.title") }}</template>
    <template #default>
      <div class="sub-title">
        <div class="sub-title-title">
          <span v-html="$t('services.addNewWarn.ip', { newServiceInfo: newServiceInfo.ip })"></span>
        </div>
        <div class="sub-title-info">{{ $t("services.addNewWarn.outerNet") }}</div>
      </div>
      <div class="sub-title">
        <div class="sub-title-title">{{ $t("services.addNewWarn.whyOuterNet") }}</div>
        <div class="sub-title-info">
          <span v-html="$t('services.addNewWarn.because')"></span>
        </div>
      </div>
      <div class="sub-title">{{ $t("services.addNewWarn.workingPrinciple") }}</div>
      <div style="text-align: center">
        <img :src="require('../../assets/connect.png')" alt srcset style="height: 230px" />
      </div>
      <div class="sub-title row-mt">
        <div class="sub-title-title">{{ $t("services.addNewWarn.KeepIntranet") }}</div>
        <div class="sub-title-info">{{ $t("services.addNewWarn.ifTrueThen") }}</div>
      </div>
      <div class="row-mt">
        <ItemGroup>
          <el-button type="danger" size="small" @click="toNewService(true)">
            {{ $t("services.addNewWarn.yeah") }}
          </el-button>
          <el-button @click="isNewServiceWarning = !isNewServiceWarning" size="small">
            {{ $t("services.addNewWarn.cancel") }}
          </el-button>
        </ItemGroup>
      </div>
    </template>
  </Dialog>

  <Dialog v-model="isOpenPrinciplePanel">
    <template #title>{{ $t("services.principlePanel.title") }}</template>
    <template #default>
      <div class="sub-title">
        <div class="sub-title-info">
          <span v-html="$t('services.principlePanel.desc')"></span>
        </div>
      </div>
      <div class="sub-title">{{ $t("services.principlePanel.principleImage") }}</div>
      <div style="text-align: center">
        <img
          :src="require('../../assets/principle.png')"
          alt
          srcset
          style="max-height: 460px; width: 100%"
        />
      </div>

      <div class="sub-title">
        <div class="sub-title-info">{{ $t("services.principlePanel.onlyOne") }}</div>
      </div>
      <div class="row-mt">
        <ItemGroup>
          <el-button type="success" size="small" @click="isOpenPrinciplePanel = false">{{
            $t("general.confirm")
          }}</el-button>
        </ItemGroup>
      </div>
    </template>
  </Dialog>
</template>

<script>
import * as echarts from "echarts";
import Panel from "../../components/Panel";
import Dialog from "../../components/Dialog";
import axios from "axios";
import { API_OVERVIEW, API_SERVICE_CURD, API_SERVICE_URL } from "../service/common";
import { request } from "../service/protocol";
import { copyText } from "../utils/index";
import { getDaemonMemChartOption } from "../service/chart_option";
import { SocketStatus, testFrontendSocket } from "@/app/utils/socketIo";

export default {
  components: { Panel, Dialog },
  data() {
    return {
      newServiceInfo: {
        ip: "",
        port: "",
        apiKey: "",
        remarks: ""
      },
      services: [],
      drawer: false,
      selectRow: null,
      isNewService: false,
      isNewServiceWarning: false,
      isOpenPrinciplePanel: false,

      panelVersion: null,
      specifiedDaemonVersion: null,

      daemonCharts: {},

      showTableList: false,
      frontendSocketStatus: {},
      SocketStatus
    };
  },
  methods: {
    async checkFrontendSocketStatus() {
      for (const node of this.services) {
        this.frontendSocketStatus[node.uuid] = await testFrontendSocket(node);
      }
    },

    copyText,
    // refresh button
    async refresh() {
      await this.render();
      this.$message({ type: "info", message: this.$t("general.refreshFinish"), duration: 400 });
    },
    // render data method
    async render() {
      const result = await request({
        method: "GET",
        url: API_OVERVIEW
      });
      result.remote.forEach((element) => {
        if (element.system) {
          // compute memory
          const free = Number(element.system.freemem / 1024 / 1024 / 1024).toFixed(1);
          const total = Number(element.system.totalmem / 1024 / 1024 / 1024).toFixed(1);
          const used = Number(total - free).toFixed(1);
          element.system.memText = `${used}G/${total}G`;
        }
      });
      this.services = result.remote;
      this.checkFrontendSocketStatus();
      // Version related data rendering
      this.specifiedDaemonVersion = result.specifiedDaemonVersion;
      this.panelVersion = result.version;

      if (Object.keys(this.daemonCharts).length != 0) {
        for (const key in this.daemonCharts) {
          const chart1 = this.daemonCharts[key]?.cpuChartInstance;
          const chart2 = this.daemonCharts[key]?.memChartInstance;
          chart1?.dispose();
          chart2?.dispose();
          delete this.daemonCharts[key];
        }
      }
      this.$nextTick(() => {
        for (let i = 0; i < this.services.length; i++) {
          const element = this.services[i];
          const echartCpuDom = echarts.init(
            document.querySelector("#echart-wrapper-daemon-cpu-" + i)
          );
          const echartMemDom = echarts.init(
            document.querySelector("#echart-wrapper-daemon-mem-" + i)
          );
          if (element.available && element.cpuMemChart) {
            const cpuChartData = element?.cpuMemChart.map((v) => v.cpu);
            const memChartData = element?.cpuMemChart.map((v) => v.mem);
            echartCpuDom.setOption(getDaemonMemChartOption(cpuChartData));
            echartMemDom.setOption(getDaemonMemChartOption(memChartData));
            this.daemonCharts[element.uuid] = {
              cpu: echartCpuDom,
              mem: echartMemDom,
              cpuChartInstance: echartCpuDom,
              memChartInstance: echartMemDom
            };
            echartCpuDom.setOption({
              series: [
                {
                  lineStyle: {
                    color: "#87c2fe",
                    width: 1
                  },
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgb(135,194,254)"
                      },
                      {
                        offset: 1,
                        color: "rgba(135,194,254,0.3)"
                      }
                    ])
                  }
                }
              ]
            });
            echartMemDom.setOption({
              series: [
                {
                  lineStyle: {
                    color: "#d58dff",
                    width: 1
                  },
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgb(213,141,255)"
                      },
                      {
                        offset: 1,
                        color: "rgba(213,141,255,0.3)"
                      }
                    ])
                  }
                }
              ]
            });
          } else {
            echartCpuDom.setOption(getDaemonMemChartOption(null));
            echartMemDom.setOption(getDaemonMemChartOption(null));
            this.daemonCharts[element.uuid] = {
              cpu: [],
              mem: [],
              cpuChartInstance: echartCpuDom,
              memChartInstance: echartMemDom
            };
          }
        }
      });
    },
    // add service
    async toNewService(enforce = false) {
      const addr = this.newServiceInfo.ip;
      if (addr.indexOf("192.168") === 0 || addr.indexOf("10.") === 0) {
        if (!enforce) {
          this.isNewServiceWarning = true;
          return;
        } else {
          this.isNewServiceWarning = false;
        }
      }
      try {
        if (this.newServiceInfo.remarks === "") this.newServiceInfo.remarks = "Remote Host";
        await request({
          method: "POST",
          url: API_SERVICE_CURD,
          data: this.newServiceInfo
        });
        this.isNewService = false;
        this.$message({ type: "success", message: this.$t("general.success") });
        this.render();
      } catch (err) {
        this.$message({ type: "error", message: this.$t("general.error") });
      }
    },
    // Open the new service panel
    openNewServiceDialog() {
      this.isNewService = true;
    },
    // connect to the service
    async linkService(row, isNeedSave) {
      try {
        if (isNeedSave) await this.updateService(row);
        await request({
          url: `${API_SERVICE_URL}/link_remote_service`,
          method: "GET",
          params: { uuid: row.uuid }
        });
        setTimeout(this.refresh, 500);
        this.$message({ type: "success", message: this.$t("general.success") });
      } catch (error) {
        this.$message({ type: "error", message: error.message });
      }
    },
    // update service
    async updateService(row) {
      await axios.put(
        API_SERVICE_CURD,
        { ip: row.ip, port: row.port, remarks: row.remarks || "Remote Host", prefix: row.prefix },
        {
          params: { uuid: row.uuid }
        }
      );
    },
    // delete service
    async deleteService(uuid) {
      await this.$confirm(this.$t("services.delDaemonWarn"), this.$t("general.warn"), {
        confirmButtonText: this.$t("general.delete"),
        cancelButtonText: this.$t("general.cancel"),
        type: "warning"
      });
      try {
        axios.delete(API_SERVICE_CURD, { params: { uuid } });
        this.$message({ type: "success", message: this.$t("general.success") });
        this.render();
      } catch (err) {
        this.$message({ type: "error", message: this.$t("general.error") });
      }
    },
    // modify the remark information
    async updateRemarks(row) {
      const text = await this.$prompt(
        this.$t("services.inputNewRemark"),
        this.$t("overview.remarks"),
        {
          confirmButtonText: this.$t("general.confirm"),
          cancelButtonText: this.$t("general.cancel")
        }
      );
      row.remarks = text.value;
      try {
        await this.updateService(row);
        this.$message({ type: "success", message: this.$t("services.updateRemarkSuccess") });
      } catch (error) {
        this.$message({ type: "error", message: error });
      }
    },
    // modify key information
    async updateKey(row) {
      let text = await this.$prompt(this.$t("services.inputNewKey"), this.$t("services.key"), {
        confirmButtonText: this.$t("general.confirm"),
        cancelButtonText: this.$t("general.cancel")
      });
      text = String(text.value);
      text = text.trim();
      try {
        await axios.put(
          API_SERVICE_CURD,
          {
            apiKey: text
          },
          {
            params: { uuid: row.uuid }
          }
        );
        // this.$message({ type: "success", message: "Update key successfully" });
        await this.linkService(row, false);
      } catch (error) {
        this.$message({ type: "error", message: error });
      } finally {
        setTimeout(() => this.refresh(), 1000);
      }
    },
    openPrinciplePanel() {
      this.isOpenPrinciplePanel = true;
    },
    // isCorrectDaemonVersion(remoteVersion = "", specifiedDaemonVersion = "") {
    //   const [major1, minor1] = remoteVersion.split(".");
    //   const [major2, minor2] = specifiedDaemonVersion.split(".");
    //   return major1 === major2 && minor1 === minor2;
    // },
    toDaemonTerminalPage(uuid) {
      this.$router.push({
        path: `/global_terminal/${uuid}/global0001/`
      });
    },
    toDaemonFileManagerPage(uuid) {
      this.$router.push({
        path: `/global_files/${uuid}/global0001/`
      });
    },
    toDaemonImagesPage(uuid) {
      this.$router.push({
        path: `/image/${uuid}`
      });
    },
    changeView(type = 1) {
      if (type === 1) this.showTableList = false;
      if (type === 2) this.showTableList = true;
      localStorage.setItem("ServicesView", type);
    }
  },
  async mounted() {
    this.showTableList = Number(localStorage.getItem("ServicesView")) === 2 ? true : false;
    await this.render();
  }
};
</script>

<style scoped lang="scss">
.collapse-item-title-table {
  width: 100%;
}

.service-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pointer {
  color: #409eff;
  cursor: pointer;
}

.daemonInfoArea > * {
  margin-bottom: 6px;
}

.daemonValueArea,
.daemonChartArea {
  p,
  div {
    margin-bottom: 8px;
  }
  p {
    margin-top: 0;
    font-size: 13px;
    line-height: 13px;
  }
  div {
    font-size: 12px;
  }
}

.daemon-chart {
  overflow: hidden;
}
.daemon-operations {
  text-align: right;
  .el-link,
  > span {
    font-size: 12px;
    line-height: 28px;
    margin-left: 6px;
  }
}

@media (max-width: 900px) {
  .daemon-operations {
    margin-top: 12px;
    text-align: left;
    .el-link,
    > span {
      margin-left: 0px !important;
      margin-right: 8px;
    }
  }
}
</style>
