import { ref, computed, onMounted } from "vue";
import store from "../store/index";
import { request } from "../service/protocol";
// import { ElNotification } from "element-plus";
import { API_REQUEST_REDEEM_PLATFORM, API_REDEEM_PRODUCTS } from "../service/common";
// import i18n from "../i18n";

export const CURRENT_PANEL_ADDR = window.location.host.includes("localhost")
  ? "http://localhost:23333/"
  : `${window.location.protocol}//${window.location.host}/`;

export function useShopInfo() {
  const isLoading = ref(true);
  const isError = ref();
  const state = ref();
  const appState = store.state.panelStatus;

  const loadProducts = async (businessId) => {
    try {
      isLoading.value = true;
      isError.value = undefined;
      state.value = await request({
        url: API_REQUEST_REDEEM_PLATFORM,
        method: "POST",
        data: {
          targetUrl: API_REDEEM_PRODUCTS,
          method: "GET",
          params: {
            addr: CURRENT_PANEL_ADDR,
            businessId: businessId || appState.settings.businessId,
            _t: Date.now()
          }
        }
      });
    } catch (error) {
      isError.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(async () => {
    await loadProducts();
  });

  return {
    isError,
    loadProducts,
    isLoading,
    state,
    shopInfo: computed(() => state.value?.ispInfo),
    products: computed(() => state.value?.products)
  };
}
