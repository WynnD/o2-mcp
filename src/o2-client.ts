export class O2Client {
  private baseUrl: string;
  private org: string;
  private authHeader: string;

  constructor() {
    const baseUrl = process.env.O2_BASE_URL;
    const token = process.env.O2_TOKEN;
    const org = process.env.O2_ORG;

    if (!baseUrl) throw new Error("O2_BASE_URL is required");
    if (!token) throw new Error("O2_TOKEN is required (base64 user:password)");
    if (!org) throw new Error("O2_ORG is required");

    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.org = org;
    this.authHeader = `Basic ${token}`;
  }

  private async request(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<unknown> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`O2 API ${method} ${path} returned ${res.status}: ${text}`);
    }

    return res.json();
  }

  async search(params: {
    sql: string;
    start_time: number;
    end_time: number;
    from?: number;
    size?: number;
  }): Promise<unknown> {
    const { sql, start_time, end_time, from = 0, size = 100 } = params;
    return this.request("POST", `/api/${this.org}/_search?type=logs`, {
      query: { sql, start_time, end_time, from, size },
    });
  }

  async listStreams(params?: {
    type?: string;
    fetchSchema?: boolean;
  }): Promise<unknown> {
    const type = params?.type ?? "";
    const fetchSchema = params?.fetchSchema ?? false;
    return this.request(
      "GET",
      `/api/${this.org}/streams?type=${type}&fetchSchema=${fetchSchema}`,
    );
  }

  async listAlerts(): Promise<unknown> {
    return this.request("GET", `/api/${this.org}/alerts`);
  }

  async createAlert(alert: unknown): Promise<unknown> {
    return this.request("POST", `/api/${this.org}/alerts`, alert);
  }

  async updateAlert(alertId: string, alert: unknown): Promise<unknown> {
    return this.request("PUT", `/api/${this.org}/alerts/${alertId}`, alert);
  }

  async deleteAlert(alertId: string): Promise<unknown> {
    return this.request("DELETE", `/api/${this.org}/alerts/${alertId}`);
  }

  async listDestinations(): Promise<unknown> {
    return this.request("GET", `/api/${this.org}/alerts/destinations`);
  }

  async createDestination(destination: unknown): Promise<unknown> {
    return this.request(
      "POST",
      `/api/${this.org}/alerts/destinations`,
      destination,
    );
  }

  async getLatestTraces(params: {
    stream_name: string;
    start_time: number;
    end_time: number;
    from?: number;
    size?: number;
  }): Promise<unknown> {
    const { stream_name, start_time, end_time, from = 0, size = 20 } = params;
    return this.request(
      "POST",
      `/api/${this.org}/${stream_name}/_search?type=traces`,
      {
        query: {
          sql: `SELECT * FROM "${stream_name}" ORDER BY start_time DESC`,
          start_time,
          end_time,
          from,
          size,
        },
      },
    );
  }
}
