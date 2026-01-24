import { v4 as uuidv4 } from "uuid";

export function getDeviceKey() {
  let key = localStorage.getItem("deviceKey");
  if (!key) {
    key = uuidv4();
    localStorage.setItem("deviceKey", key);
  }
  return key;
}
