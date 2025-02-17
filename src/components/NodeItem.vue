<script setup>
import { ref, defineProps, onMounted } from "vue";
import Panel from "@/components/Panel";
import { useSocketIoClient } from "@/app/hooks/useSocketIo";

const { socketStatus, testFrontendSocket } = useSocketIoClient();

const props = defineProps({
  daemon: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const node = ref(props.daemon);

onMounted(() => {
  node.value = props.daemon;
  testFrontendSocket(node.value.uuid);
  console.log(props.daemon);
});
</script>

<template>
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
                {{ node?.system?.platform == "win32" ? "windows" : node?.system?.platform || "--" }}
              </div>
            </el-col>
            <el-col :md="12" :xs="12" :lg="6" :offset="0">
              <p>{{ $t("overview.mem") }}</p>
              <div>{{ node?.system?.memText || "--" }}</div>
            </el-col>
            <el-col :md="12" :xs="12" :lg="6" :offset="0">
              <p>CPU</p>
              <div v-if="node.system">{{ Number(node.system.cpuUsage * 100).toFixed(1) }}%</div>
              <div v-else>--</div>
            </el-col>
            <el-col :md="12" :xs="12" :lg="6" :offset="0">
              <p>{{ $t("services.instanceStatus") }}</p>
              <div v-if="node.instance">{{ node.instance.running }}/{{ node.instance.total }}</div>
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
                  <el-tooltip effect="dark" :content="$t('overview.errorConnect')" placement="top">
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
                <span class="color-green" v-if="socketStatus === 1">
                  <i class="el-icon-circle-check"></i>
                  {{ $t("overview.online") }}
                </span>
                <span class="color-red" v-else>
                  <el-tooltip effect="dark" :content="$t('overview.errorConnect')" placement="top">
                    <span>
                      <i class="el-icon-warning-outline"></i>
                      {{ $t("overview.offline") }}
                    </span>
                  </el-tooltip>
                </span>
              </div>
            </el-col>
            <el-col :md="12" :xs="12" :lg="6" :offset="0">
              <p>{{ $t("services.version") }}</p>
              <div v-if="node.instance">
                <span
                  class="color-green"
                  v-if="isCorrectDaemonVersion(node.version, specifiedDaemonVersion)"
                >
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
</template>
