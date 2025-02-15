<script setup>
import { ref, computed, nextTick, defineEmits, defineExpose } from "vue";
import Dialog from "@/components/Dialog";
import { arrayUnique } from "../../utils/index";
import { request } from "../../service/protocol";
import { API_INSTANCE } from "../../service/common";
import { ElMessage, ElNotification } from "element-plus";

const t = window.$t;

const v = ref(false),
  isLoading = ref(false),
  inputVisible = ref(false),
  saveTagInput = ref(),
  inputValue = ref(""),
  instanceId = ref(""),
  daemonId = ref(""),
  instanceTags = ref([]),
  allTags = ref([]),
  instanceTagsTips = computed(() => {
    if (allTags.value) {
      const tmp = allTags.value.filter((tag) => !instanceTags.value.includes(tag));
      return arrayUnique(tmp)
        .slice(0, 30)
        .sort((a, b) => (a > b ? 1 : -1));
    }
    return [];
  }),
  emit = defineEmits(["update:tags"]),
  openDialog = (dId, iId, t, allT) => {
    instanceId.value = iId;
    daemonId.value = dId;
    instanceTags.value = JSON.parse(JSON.stringify(t));
    allTags.value = allT;
    v.value = true;
  },
  close = () => {
    v.value = false;
  },
  showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      saveTagInput.value.focus();
    });
  },
  handleInputConfirm = () => {
    if (inputValue.value) {
      addTag(inputValue.value);
    }
    inputValue.value = "";
    inputVisible.value = false;
  },
  addTag = (tag) => {
    tag = tag.trim();
    if (!instanceTags.value.includes(tag)) {
      instanceTags.value.push(tag);
    }
    instanceTags.value = instanceTags.value.sort((a, b) => (a > b ? 1 : -1));
  },
  removeTag = (tag) => {
    tag = tag.trim();
    instanceTags.value.splice(
      instanceTags.value.findIndex((v) => v === tag),
      1
    );
  },
  submit = async () => {
    try {
      isLoading.value = true;
      await request({
        method: "PUT",
        url: API_INSTANCE,
        params: { daemonId: daemonId.value, uuid: instanceId.value },
        data: {
          tag: instanceTags.value
        }
      });
      ElMessage.success({
        message: t("notify.saveSuccess")
      });
      emit("update:tags");
      close();
    } catch (err) {
      ElNotification.error({
        title: "Error",
        message: err.message
      });
    } finally {
      isLoading.value = false;
    }
  };

defineExpose({ openDialog });
</script>

<template>
  <Dialog v-model="v" :cancel="close" max-width="500px">
    <template #title>{{ $t("tag.001") }}</template>
    <template #default>
      <p>
        {{ $t("tag.002") }}
      </p>

      <div>
        <p class="sub-title-title">{{ $t("tag.003") }}</p>
        <p class="sub-title-info">
          {{ $t("tag.004") }}
        </p>

        <div class="tag-list">
          <el-tag
            v-for="tag in instanceTags"
            :key="tag"
            size="mini"
            type="plain"
            closable
            @close="() => removeTag(tag)"
            >{{ tag }}</el-tag
          >
          <el-input
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            style="width: 90px"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-tag v-else size="mini" @click="showInput" style="cursor: pointer"
            >+ {{ $t("tag.005") }}</el-tag
          >
        </div>
      </div>
      <br />
      <div>
        <p class="sub-title-title">{{ $t("tag.006") }}</p>
        <p class="sub-title-info">
          {{ $t("tag.007") }}
        </p>

        <div class="tag-list">
          <el-tag
            v-for="tag in instanceTagsTips"
            :key="tag"
            size="mini"
            type="plain"
            style="cursor: pointer"
            @click="addTag(tag)"
          >
            {{ tag }}</el-tag
          >
        </div>
      </div>

      <div class="btn-area">
        <el-button size="small" type="danger" @click="close">{{ $t("general.cancel") }}</el-button>
        <el-button size="small" type="primary" @click="submit" :loading="isLoading">{{
          $t("general.confirm")
        }}</el-button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.btn-area {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.tag-list {
  margin: 8px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
