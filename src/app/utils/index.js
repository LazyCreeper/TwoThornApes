import { h } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

export async function copyText(text) {
  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(text);
    else {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    ElMessage({
      message: window.$t("general.copySuccess"),
      type: "success"
    });
  } catch (err) {
    ElMessageBox.alert(
      h("span", null, [window.$t("general.copyFailedInfo") + "：", h("br"), text]),
      window.$t("general.copyFailed")
    );
  }
}

export const isInt = (x) => {
  if (x === null || x === "") {
    return false;
  }
  for (let i = 0; i < x.length; i++) {
    const char = x[i];
    if (char < "0" || char > "9") {
      return false;
    }
  }
  return true;
};

const isIPv6 = (str) => {
  return /\[([0-9a-fA-F:]+)\]/g.test(str);
};

export const dockerPortsParse = (ports) => {
  let joinArr = ports.join(":");
  let tempAddr;
  const ipMaps = new Map();

  if (isIPv6(joinArr)) {
    tempAddr = joinArr.match(/\[([0-9a-fA-F:]+)\]/g);
    for (let i = 0; i < tempAddr.length; i++) {
      joinArr = joinArr.replace(tempAddr[i], "IPv6_" + i);
      ipMaps.set("IPv6_" + i, tempAddr[i]);
    }
  }

  let p = isIPv6(ports.join(":")) ? joinArr.split(":") : ports;

  let p1 = [],
    p2 = [];

  for (let i = 0; i < p.length; i++) {
    if (
      (isInt(p[0]) && p.length === 3 && i < 1) ||
      (!isInt(p[0]) && p.length === 3 && i < 2) ||
      (p.length === 4 && i < 2)
    ) {
      p1.push(p[i]);
    } else if (p.length === 2) {
      return { port1: p[0], port2: p[1] };
    } else {
      p2.push(p[i]);
    }
  }

  const v4 = { port1: p1.join(":"), port2: p2.join(":") };

  const v6 = {
    port1: p1.length === 1 ? p1[0] : p1.join(":").replace(p1[0], ipMaps.get(p1[0])),
    port2: p2.length === 1 ? p2[0] : p2.join(":").replace(p2[0], ipMaps.get(p2[0]))
  };

  return isIPv6(ports.join(":")) ? v6 : v4;
};

export const dockerPortsArray = (ports) => {
  const portArray = ports.map((iterator) => {
    const pad = iterator.split("/");
    const ports = pad[0];
    const protocol = pad[1];
    const { port1, port2 } = dockerPortsParse(ports.split(":"));
    return {
      port1,
      port2,
      protocol
    };
  });
  return portArray;
};

export function arrayUnique(arr, felidName) {
  if (!felidName) return Array.from(new Set(arr));
  const map = new Map();
  return arr.filter((v) => !map.has(v[felidName]) && map.set(v[felidName], v));
}

export const parseTimestamp = (t) => (t ? new Date(t).toLocaleString() : "");
