<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->

<template>
  <el-card class="box-card-shadow" :body-style="bodyStyle || 'padding:12px;'" :style="style">
    <div class="box-card-title-wrapper">
      <div v-bind:class="{ 'box-card-title': true }" v-if="$slots.title">
        <span v-bind:class="{ 'left-tip': tipType }"></span>
        <span>
          <slot name="title"></slot>
        </span>
      </div>
      <div class="box-card-rtitle" v-if="$slots.rtitle">
        <slot name="rtitle"></slot>
      </div>
    </div>

    <div class="box-card-content">
      <slot></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    style: String,
    bodyStyle: String,
    tip: {
      type: Boolean,
      default: true
    },
    tipType: {
      type: Number,
      default: 1
    }
  },
  data: function () {
    return {};
  },
  methods: {}
};
</script>

<style>
.box-card-shadow p:first-child {
  margin-top: 0px;
}
</style>

<style scoped>
.box-card-title {
  font-weight: 600;
  font-size: 14px;
}
.box-card-title-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.box-card-rtitle {
  /* float: right; */
}

.box-card-content {
  font-size: 13px;
  font-weight: 400;
}

.box-card-shadow {
  border-radius: 4px;
}

.left-tip {
  display: inline-block;
  margin-right: 6px;
  margin-bottom: 2px;
  /* margin-top: 2px; */
  border-radius: 2px;
  background-color: var(--tip-color);
  height: 14px;
  width: 6px;
  vertical-align: middle;
}
</style>
