<script setup>
// import { onMounted } from "vue";
import ShelvesCard from "./ShelvesCard.vue";
import BusinessInfoCard from "./BusinessInfoCard.vue";
import { useScreen } from "../../hooks/useScreen";

const { isPhone } = useScreen();
</script>

<template>
  <el-row
    :gutter="20"
    :style="{
      'flex-direction': isPhone ? 'column-reverse' : ''
    }"
  >
    <el-col :md="16" :offset="0">
      <ShelvesCard />
    </el-col>
    <el-col :md="8" :offset="0">
      <BusinessInfoCard />
    </el-col>
  </el-row>
</template>
