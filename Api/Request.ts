import axios from "axios";
import ResponseModel from "./ResponseModel";
import { useToken } from "../store/tokenStore";
import { ref } from 'vue';

export default class Request {
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
    let result: ResponseModel;
    this.pending.value = true;

    let headers: Record<string, string> = {
      accept: "application/json",
      "Content-Type": "application/json",
    };
    if (this.doauth) {
      const token = useToken().getToken();
      if (token) headers.Authorization = `Token ${token}`;
    }

    try {
      const res = await axios.request({
        baseURL: `${this.url}/`,
        headers: headers,
        method: method,
        url: path,
        params: params,
        data: body,
      });
      const response = res.data;
      result = new ResponseModel(
        response.message ?? "",
        response.ok,
        response.errors,
        response.data,
        res.status
      );
    } catch (error: any) {
      // No response at all: network failure / server down.
      if (!error.response) {
        result = new ResponseModel(
          error.message ?? "خطا در برقراری ارتباط با سرور",
          false,
          [],
          [],
          0
        );
      } else {
        const response = error.response.data ?? {};
        result = new ResponseModel(
          response.message ?? error.message,
          false,
          response.errors ?? [],
          [],
          error.response.status
        );
        if (error.response.status === 401) {
          useToken().logout();
          navigateTo("/auth/login");
        }
      }
    } finally {
      this.pending.value = false;
    }

    return result;
  };
}
