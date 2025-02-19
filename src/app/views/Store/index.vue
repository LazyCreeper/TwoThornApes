<script setup>
import { onMounted } from "vue";
import Panel from "../../../components/Panel";
import ShelvesCard from "./ShelvesCard.vue";

onMounted(() => {});
</script>

<template>
  <el-row :gutter="20">
    <el-col :md="16" :offset="0">
      <ShelvesCard />
    </el-col>
    <el-col :md="8" :offset="0">
      <Panel>
        <template #title>商家信息</template>
        <template #default>
          <div style="height: 280px; overflow: auto">
            <div class="sub-title">
              <div class="sub-title-title"></div>
              <div class="sub-title-info"></div>
            </div>
          </div>
        </template>
      </Panel>
    </el-col>
  </el-row>
</template>
