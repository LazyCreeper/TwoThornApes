<!--
  Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>
-->

<template>
  <div>
    <transition name="el-fade-in-linear">
      <div v-show="modelValue" class="component-dialog-wrapper">
        <div class="component-dialog-overflow">
          <transition name="el-zoom-in-center">
            <Panel
              v-show="modelValue"
              class="component-dialog-panel"
              :style="{ maxWidth: maxWidth }"
            >
              <template #title>
                <slot name="title"></slot>
              </template>
              <template #rtitle>
                <div class="component-dialog-close-button" @click="close" v-if="canClose">
                  <i class="el-icon-close"></i>
                </div>
              </template>
              <template #default>
                <div class="component-dialog-body">
                  <slot></slot>
                </div>
              </template>
            </Panel>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Panel from "./Panel";

export default {
  props: {
    modelValue: Boolean,
    cancel: Function,
    maxWidth: {
      type: String,
      default: "fit-content"
    },

    canClose: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:modelValue"],
  data: function () {
    return {
      visible: false
    };
  },
  methods: {
    close() {
      if (this.cancel) this.cancel();
      this.$emit("update:modelValue", false);
    }
  },
  components: { Panel }
};
</script>

<style scoped>
.component-dialog-panel {
  margin-bottom: 0px;
}
.component-dialog-overflow {
  max-height: 90%;
  max-width: 90%;
  overflow-y: auto;
}
.component-dialog-wrapper {
  text-align: left;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s;
}
.component-dialog-body {
  word-break: break-all;
  overflow: hidden;
  width: 100%;
}
.component-dialog-close-button {
  cursor: pointer;
  font-size: 18px;
}
@media (max-width: 860px) {
  .component-dialog-panel {
    max-width: 100% !important;
  }
  .component-dialog-overflow {
    max-height: 100%;
    max-width: 100%;
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }
}
</style>
