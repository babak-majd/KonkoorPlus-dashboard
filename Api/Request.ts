import axios from "axios";
import ResponseModel from "./ResponseModel";
import ConfigStore from "../store/ConfigStore";
import { ref } from 'vue';

export default class Request {
  private request = useNuxtApp().$axios;
  private url = useRuntimeConfig().public.API_URL;
  private doauth: Boolean = true;
  public readonly pending = ref(false);

  constructor(version: string | null = null) {
    if (version) this.url += `/${version}`;
    return this;
  }

  public static noauth(version: string | null = null) {
    const instance = new Request(version);
    instance.doauth = false;
    return instance;
  }

  public get = async (path: string, params: Record<string, any> | null = null) => {
    return await this.send_request("GET", path, null, params);
  };

  public post = async (path: string, body: Record<string, any> | null = null) => {
    return await this.send_request("POST", path, body, null);
  };

  public delete = async (path: string, body: Record<string, any> | null = null) => {
    return await this.send_request("DELETE", path, body, null);
  };

  public put = async (path: string, body: Record<string, any> | null = null) => {
    return await this.send_request("PUT", path, body, null);
  };

  public patch = async (path: string, body: Record<string, any> | null = null) => {
    return await this.send_request("PATCH", path, body, null);
  };

  protected send_request = async (
    method: string,
    path: string,
    body: Record<string, any> | null = null,
    params: Record<string, any> | null = null
  ): Promise<ResponseModel> => {
    let result: any;
    this.pending.value = true;
    let token = ConfigStore.token() ?? "";

    let headers: Record<string, string> = {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    };
    if (this.doauth) {
      headers.Authorization = `Token ${token}`;
    }
    await axios
      .request({
        baseURL: `${this.url}/`,
        headers: headers,
        method: method,
        url: path,
        params: params,
        data: body,
      })
      .then((res) => {
        let response = res.data;
        result = new ResponseModel(
          response.message ?? "",
          response.ok,
          response.errors,
          response.data,
          res.status
        );
      })
      .catch((res) => {
        let response = res.response.data;
        result = new ResponseModel(
          response.message ?? res.message,
          false,
          response.errors ?? [],
          [],
          res.response.status
        );
        if (res.response.status === 401) {
          ConfigStore.logout();
          navigateTo("/auth/login");
          return false;
        }
        return false;
      })
      .finally(() => {
        this.pending.value = false;
      });

    return result;
  };
}
