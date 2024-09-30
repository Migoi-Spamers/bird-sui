import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import https from "https";

export class HttpService {
  constructor(log, proxy = null, token) {
    this.baseURL = [
      "https://www.vanadatahero.com/_vercel/insights/",
      "https://www.vanadatahero.com/api/"
    ];
    this.proxy = proxy;
    this.log = log;
    this.token = token;
    this.refreshToken = null;
    this.isConnected = false;
    this.headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'Content-Type': 'application/json',
      'Sec-Fetch-Site': 'same-origin',
      'Referer': 'https://www.vanadatahero.com/home',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    };
  }

  updateToken(token) {
    this.token = token;
  }

  updateRefreshToken(token) {
    this.refreshToken = token;
  }

  updateConnect(status) {
    this.isConnected = status;
  }

  initConfig() {
    const headers = {
      ...this.headers,
    };

    if (this.token) {
      headers["x-telegram-web-app-init-data"] = `${this.token}`;
    }
    const config = {
      headers,
    };
    if (this.proxy && this.proxy !== "skip") {
      config["httpsAgent"] = new HttpsProxyAgent(this.proxy);
    }
    return config;
  }

  get(domain, endPoint) {
    const url = this.baseURL[domain] + endPoint;
    const config = this.initConfig();
    return axios.get(url, config);
  }

  post(domain, endPoint, body) {
    const url = this.baseURL[domain] + endPoint;
    const config = this.initConfig();
    return axios.post(url, body, config);
  }

  put(domain, endPoint, body) {
    const url = this.baseURL[domain] + endPoint;
    const config = this.initConfig();
    return axios.put(url, body, config);
  }

  async checkProxyIP() {
    if (!this.proxy || this.proxy === "skip") {
      this.log.updateIp("🖥️");
      return null;
    }
    try {
      const proxyAgent = new HttpsProxyAgent(this.proxy);
      const response = await axios.get("https://api.ipify.org?format=json", {
        httpsAgent: proxyAgent,
      });
      if (response.status === 200) {
        const ip = response.data.ip;
        this.log.updateIp(ip);
        return ip;
      } else {
        throw new Error("Proxy lỗi, kiểm tra lại kết nối proxy");
      }
    } catch (error) {
      this.log.updateIp("🖥️");
      return -1;
    }
  }
}
