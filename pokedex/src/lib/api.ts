import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2/';

class Api {
  private static instance: Api;
  private axiosInstance: any;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
  }

  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  public async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get(url, config);
    return response.data;
  }
}

export const api = Api.getInstance();
