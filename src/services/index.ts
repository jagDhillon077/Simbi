// Use REACT_APP_BACKEND_URL if the backend is running under another domain name
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://' + window.location.hostname + ':4000';

export default class HttpService {
  private static async fetch<T>(url: string, init?: RequestInit): Promise<T> {
    // console.log(`${BACKEND_URL}/api${url}`)
    const res = await fetch(`${BACKEND_URL}/api${url}`, init);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return await res.json();
  }

  static get<T>(url: string): Promise<T> {
    return this.fetch(url);
  }

  static getUser<T>(url: string, data:object): Promise<T> {
    return this.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }

  static post<T>(url: string, data: object): Promise<T> {
    return this.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }

  static patch<T>(url: string, data: object): Promise<T> {
    return this.fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }

  static async delete(url: string): Promise<Response> {
    const res = await fetch(`${BACKEND_URL}/api${url}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res;
  }
}
