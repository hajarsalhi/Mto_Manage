import axios from 'axios';

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  accessToken: string;
}

class AuthService {
  private currentUser: User | null = null;
  private tokenKey = 'mto_ledger_token';
  private userKey = 'mto_ledger_user';

  constructor() {
    // Initialize user from localStorage if available
    this.loadUserFromStorage();
    
    // Set up axios interceptor for adding auth token to requests
    this.setupAxiosInterceptors();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
    
    if (token && userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        // Set default auth header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error('Error parsing user from storage', e);
        this.logout();
      }
    }
  }

  private setupAxiosInterceptors() {
    // Add a response interceptor to handle 401 Unauthorized errors
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Auto logout if 401 response returned from api
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(username: string, password: string, rememberMe: boolean = false): Promise<User> {
    try {
      
      const response = await axios.post('/api/auth/login', { username, password });
      const user = response.data;
      
      // Store token and user info
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.tokenKey, user.accessToken);
      storage.setItem(this.userKey, JSON.stringify(user));
      
      // Set current user
      this.currentUser = user;
      
      // Set default auth header for axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
      
      return user;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        throw new Error('No response from server. Please try again later.');
      } else {
        throw new Error('Error during login. Please try again.');
      }
    }
  }

  logout(): void {
    // Clear user from storage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    
    // Clear current user
    this.currentUser = null;
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || 
           sessionStorage.getItem(this.tokenKey) || 
           null;
  }
}

export const authService = new AuthService(); 