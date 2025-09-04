/**
 * Simplified WhenIWork API client
 * Based on WhenIWork API v2 documentation
 */

interface WhenIWorkConfig {
  apiKey: string;
  username?: string;
  password?: string;
  token?: string;
  baseUrl?: string;
  accountId?: number;
}

interface ApiResponse {
  [key: string]: any;
}

export class WhenIWorkClient {
  private token?: string;
  private apiKey: string;
  private baseUrl: string;
  private config: WhenIWorkConfig;

  constructor(config: WhenIWorkConfig) {
    this.apiKey = config.apiKey;
    this.token = config.token;
    this.baseUrl = config.baseUrl || "https://api.wheniwork.com/2";
    this.config = config;
  }

  /**
   * Authenticate with WhenIWork API
   */
  async authenticate(): Promise<void> {
    if (this.token) return; // Already have a token

    if (!this.config.username || !this.config.password) {
      throw new Error("Username and password required for authentication");
    }

    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "W-Key": this.apiKey,
      },
      body: JSON.stringify({
        username: this.config.username,
        password: this.config.password,
        ...(this.config.accountId && { account_id: this.config.accountId }),
      }),
    });

    const data = await response.json() as any;
    
    if (!response.ok || !data.login?.token) {
      throw new Error(`Authentication failed: ${data.error || response.statusText}`);
    }

    this.token = data.login.token;
  }

  /**
   * Make an authenticated API request
   */
  async request<T = ApiResponse>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.token) {
      throw new Error("Not authenticated. Call authenticate() first");
    }

    const url = endpoint.startsWith("http") 
      ? endpoint 
      : `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "W-Token": this.token,
        ...(options.headers || {}),
      },
    });

    const data = await response.json() as any;
    
    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.statusText}`);
    }

    return data;
  }

  // User methods
  async getUsers(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`/users${queryString}`);
  }

  async getUser(userId: number) {
    return this.request(`/users/${userId}`);
  }

  async createUser(userData: any) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: number, userData: any) {
    return this.request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: number) {
    return this.request(`/users/${userId}`, {
      method: "DELETE",
    });
  }

  // Shift methods
  async getShifts(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`/shifts${queryString}`);
  }

  async getShift(shiftId: number) {
    return this.request(`/shifts/${shiftId}`);
  }

  async createShift(shiftData: any) {
    return this.request("/shifts", {
      method: "POST",
      body: JSON.stringify(shiftData),
    });
  }

  async updateShift(shiftId: number, shiftData: any) {
    return this.request(`/shifts/${shiftId}`, {
      method: "PUT",
      body: JSON.stringify(shiftData),
    });
  }

  async deleteShift(shiftId: number) {
    return this.request(`/shifts/${shiftId}`, {
      method: "DELETE",
    });
  }

  // Position methods
  async getPositions(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`/positions${queryString}`);
  }

  async getPosition(positionId: number) {
    return this.request(`/positions/${positionId}`);
  }

  async createPosition(positionData: any) {
    return this.request("/positions", {
      method: "POST",
      body: JSON.stringify(positionData),
    });
  }

  async updatePosition(positionId: number, positionData: any) {
    return this.request(`/positions/${positionId}`, {
      method: "PUT", 
      body: JSON.stringify(positionData),
    });
  }

  async deletePosition(positionId: number) {
    return this.request(`/positions/${positionId}`, {
      method: "DELETE",
    });
  }

  // Location methods
  async getLocations(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`/locations${queryString}`);
  }

  async getLocation(locationId: number) {
    return this.request(`/locations/${locationId}`);
  }

  async createLocation(locationData: any) {
    return this.request("/locations", {
      method: "POST",
      body: JSON.stringify(locationData),
    });
  }

  async updateLocation(locationId: number, locationData: any) {
    return this.request(`/locations/${locationId}`, {
      method: "PUT",
      body: JSON.stringify(locationData),
    });
  }

  async deleteLocation(locationId: number) {
    return this.request(`/locations/${locationId}`, {
      method: "DELETE",
    });
  }

  // Time & Attendance methods
  async getTimes(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`/times${queryString}`);
  }

  async clockIn(data: any) {
    return this.request("/times/clockin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async clockOut(data: any) {
    return this.request("/times/clockout", {
      method: "POST", 
      body: JSON.stringify(data),
    });
  }

  // Request (Time Off) methods
  async getRequests(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`/requests${queryString}`);
  }

  async getRequest(requestId: number) {
    return this.request(`/requests/${requestId}`);
  }

  async createRequest(requestData: any) {
    return this.request("/requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  async updateRequest(requestId: number, requestData: any) {
    return this.request(`/requests/${requestId}`, {
      method: "PUT",
      body: JSON.stringify(requestData),
    });
  }

  async cancelRequest(requestId: number) {
    return this.request(`/requests/${requestId}/cancel`, {
      method: "PUT",
    });
  }

  // Availability methods
  async getAvailability(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`/availabilities${queryString}`);
  }

  async createAvailability(availabilityData: any) {
    return this.request("/availabilities", {
      method: "POST",
      body: JSON.stringify(availabilityData),
    });
  }

  async updateAvailability(availabilityId: number, availabilityData: any) {
    return this.request(`/availabilities/${availabilityId}`, {
      method: "PUT",
      body: JSON.stringify(availabilityData),
    });
  }

  async deleteAvailability(availabilityId: number) {
    return this.request(`/availabilities/${availabilityId}`, {
      method: "DELETE",
    });
  }

  // Account methods  
  async getAccount() {
    return this.request("/account");
  }

  // Payroll methods
  async getPayroll(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`/payrolls${queryString}`);
  }

  // Messages methods
  async getMessages(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request(`/messages${queryString}`);
  }

  async sendMessage(messageData: any) {
    return this.request("/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }
}
