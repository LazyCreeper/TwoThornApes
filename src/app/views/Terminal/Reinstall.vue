<template>
  <Dialog v-model="v" :cancel="close">
    <template #title>{{ $t("quickStart.selectTemplate") }}</template>
    <template #default>
      <AppPackages @handleSelectTemplate="handleSelectTemplate" />
    </template>
  </Dialog>
</template>

<script>
// import Panel from "@/components/Panel";
import Dialog from "@/components/Dialog";
import AppPackages from "../quickstart/AppPackages.vue";
import { API_INSTANCE_REINSTALL } from "../../service/common";
import { request } from "../../service/protocol";
export default {
  components: {
    // Panel,
    Dialog,
    AppPackages
  },
  props: {
    daemonId: {
      type: String
    },
    instanceId: {
      type: String
    }
  },
  data: () => ({
    v: false,
    tableData: []
  }),
  methods: {
    open() {
      this.v = true;
    },
    close() {
      this.v = false;
    },
    async handleSelectTemplate(item) {
      const a = await this.$confirm(
        this.$t("quickStart.selectTemplateWarn"),
        this.$t("general.warn"),
        {
          confirmButtonText: this.$t("CommonText.041"),
          cancelButtonText: this.$t("CommonText.042"),
          type: "warning"
        }
      );
      if (a !== "confirm") return;
      try {
        await request({
          url: API_INSTANCE_REINSTALL,
          method: "POST",
          params: {
            daemonId: this.daemonId,
            uuid: this.instanceId
          },
          data: {
            targetUrl: item.targetLink,
            title: item.title,
            description: item.description
          }
        });
        this.close();
      } catch (err) {
        console.error(err);
        return this.$message({
          message: err.message,
          type: "error"
        });
      }
    }
  }
};
</script>
