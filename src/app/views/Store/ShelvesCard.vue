<script setup>
// import { ref } from "vue"
import { useShopInfo } from "../../hooks/useStore";
import i18n from "../../i18n";
const t = i18n.global.t;

const { products, isLoading, isError } = useShopInfo();
</script>

<template>
  <Panel v-loading="isLoading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <template #title>{{ t("settings.businessMode.TXT_CODE_381f8f22") }}</template>
    <template #default>
      <div v-if="!isError" style="min-height: 280px; overflow: auto">
        <div class="sub-title prods" v-for="(item, index) in products" :key="index">
          <div class="sub-title-title flex flex-space-between flex-wrap row-mb">
            {{ item.title }}
            <small style="opacity: 0.7">Product ID {{ item.productId }}</small>
          </div>
          <div class="sub-title-info row-mb">{{ item.remark }}</div>

          <div class="shelves-card-item-price">
            <div>
              <div class="shelves-card-item-price-label">
                {{ t("settings.businessMode.TXT_CODE_4bf8a52f") }}
              </div>
              <div>
                <span class="price-text"> {{ item.price }} </span>
                <span> / {{ t("schedule.month") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <el-empty
          :image="require('../../../assets/notAnyInstance.gif')"
          :image-size="250"
        ></el-empty>
      </div>
    </template>
  </Panel>
</template>

<style lang="scss" scoped>
.shelves-card-item-price {
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  text-align: right;

  .shelves-card-item-price-label {
    opacity: 0.6;
    font-size: 12px;
    text-align: right;
    margin-bottom: 4px;
  }
}

.prods {
  margin-bottom: 15px;
  border: 1px solid #aaaaaa57;
  padding: 14px;
  backdrop-filter: brightness(0.7);
  transition: all 0.5s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    backdrop-filter: brightness(0.5) blur(5px);
  }
}

.price-text {
  color: #ff5869;
  font-size: 28px;
}
</style>
