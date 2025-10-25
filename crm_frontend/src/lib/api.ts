import axios from 'axios';
import { Console } from 'console';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token and tenant ID
api.interceptors.request.use((config) => {
  // Get tenant ID from localStorage
  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') : null;
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }
  
  // Get auth token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('API Request Headers:', {
    url: config.url,
    'X-Tenant-ID': tenantId,
    'Authorization': token ? 'Bearer ***' : 'None'
  });
  
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tenantId');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  tenant_id: number | null;
  created_at: string;
}

export interface Tenant {
  id: number;
  name: string;
  schema_name: string;
  is_active: boolean;
  created_at: string;
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Auth API - UPDATED FOR QUERY PARAMETERS
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Use query parameters as your backend expects
    const response = await api.post('/auth/login/', null, {
      params: {
        email: email,
        password: password
      }
    });
    console.log('Login response:', response.data);
    return response.data;

  },
  
  registerTenant: async (name: string): Promise<Tenant> => {
    const response = await api.post('/auth/tenants/', { name });
    return response.data;
  },
  
  registerUser: async (userData: {
    email: string;
    password: string;
    full_name: string;
    tenant_id: number;
  }): Promise<User> => {
    const response = await api.post('/auth/users/', userData);
    return response.data;
  },
};
// Add to your existing API methods

// Admin API
export const adminApi = {
  // Tenants
  getTenants: async (): Promise<Tenant[]> => {
    const response = await api.get('/admin/tenants/');
    return response.data;
  },
  
  createTenant: async (tenant: { name: string }): Promise<Tenant> => {
    const response = await api.post('/admin/tenants/', tenant);
    return response.data;
  },
  
  updateTenant: async (id: number, tenant: Partial<Tenant>): Promise<Tenant> => {
    const response = await api.put(`/admin/tenants/${id}`, tenant);
    return response.data;
  },
  
  deleteTenant: async (id: number): Promise<void> => {
    await api.delete(`/admin/tenants/${id}`);
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users/');
    return response.data;
  },
  
  createUser: async (user: {
    email: string;
    password: string;
    full_name: string;
    tenant_id: number;
    is_superuser?: boolean;
  }): Promise<User> => {
    const response = await api.post('/admin/users/', user);
    return response.data;
  },
  
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, user);
    return response.data;
  },
  
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
  // Contacts - with tenant parameter
  getContacts: async (tenantId: string): Promise<Contact[]> => {
    const response = await api.get(`/admin/crm/contacts/`, {
      headers: { 'X-Tenant-ID': tenantId }
    });
    return response.data;
  },
  
  // Leads - with tenant parameter
  getLeads: async (tenantId: string): Promise<Lead[]> => {
    const response = await api.get(`/admin/crm/leads/`, {
      headers: { 'X-Tenant-ID': tenantId }
    });
    return response.data;
  },
  
  // Opportunities - with tenant parameter
  getOpportunities: async (tenantId: string): Promise<Opportunity[]> => {
    const response = await api.get(`/admin/crm/opportunities/`, {
      headers: { 'X-Tenant-ID': tenantId }
    });
    return response.data;
  },

};
// CRM API
export const crmApi = {
  // Contacts
  getContacts: async (): Promise<Contact[]> => {
    const response = await api.get('/crm/contacts/');
    return response.data;
  },
  
  getContact: async (id: number): Promise<Contact> => {
    const response = await api.get(`/crm/contacts/${id}`);
    return response.data;
  },
  
  createContact: async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> => {
    const response = await api.post('/crm/contacts/', contact);
    return response.data;
  },
  
  updateContact: async (id: number, contact: Partial<Contact>): Promise<Contact> => {
    const response = await api.put(`/crm/contacts/${id}`, contact);
    return response.data;
  },
  
  deleteContact: async (id: number): Promise<void> => {
    await api.delete(`/crm/contacts/${id}`);
  },
  
  // Leads
  getLeads: async (): Promise<Lead[]> => {
    const response = await api.get('/crm/leads/');
    return response.data;
  },
  getLead: async (id: number): Promise<Lead> => {
    const response = await api.get(`/crm/leads/${id}`);
    return response.data;
  },

  
  createLead: async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> => {
    const response = await api.post('/crm/leads/', lead);
    return response.data;
  },
  updateLead: async (id: number, lead: Partial<Lead>): Promise<Lead> => {
    const response = await api.put(`/crm/leads/${id}`, lead);
    return response.data;
  },
  
  deleteLead: async (id: number): Promise<void> => {
    await api.delete(`/crm/leads/${id}`);
  },
  
  // Opportunities
  getOpportunities: async (): Promise<Opportunity[]> => {
    const response = await api.get('/crm/opportunities/');
    return response.data;
  },
  getOpportunity: async (id: number): Promise<Opportunity> => {
    const response = await api.get(`/crm/opportunities/${id}`);
    return response.data;
  },
  
  createOpportunity: async (opportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>): Promise<Opportunity> => {
    const response = await api.post('/crm/opportunities/', opportunity);
    return response.data;
  },
  updateOpportunity: async (id: number, opportunity: Partial<Opportunity>): Promise<Opportunity> => {
    const response = await api.put(`/crm/opportunities/${id}`, opportunity);
    return response.data;
  },
  
  deleteOpportunity: async (id: number): Promise<void> => {
    await api.delete(`/crm/opportunities/${id}`);
  },
};

// Add missing types

// Make sure these interfaces are defined
export interface Lead {
  id: number;
  title: string;
  description?: string;
  status: string;
  source?: string;
  contact_id?: number;
  created_at: string;
  updated_at?: string;
  contact?: Contact; // Make sure this is optional
}

export interface Opportunity {
  id: number;
  name: string;
  description?: string;
  amount?: number;
  stage: string;
  probability: number;
  close_date?: string;
  contact_id?: number;
  lead_id?: number;
  created_at: string;
  updated_at?: string;
  contact?: Contact; // Make sure this is optional
  lead?: Lead; // Make sure this is optional
}
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id?: number;
  email?: string;
  full_name?: string;
  tenant_id?: number;
  is_superuser?: boolean;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  tenant_id: number | null;
  created_at: string;
}
// Add request interceptor to include auth token and tenant ID
api.interceptors.request.use((config) => {
  // Get auth token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Get user data to check if admin
  const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
  let isAdmin = false;
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      isAdmin = user.is_superuser || false;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // Only add tenant ID for non-admin users and for CRM endpoints
  if (!isAdmin && config.url?.includes('/crm/')) {
    const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') : null;
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    } else {
      console.warn('No tenantId found for non-admin user');
    }
  }
  
  console.log('API Request:', {
    url: config.url,
    isAdmin: isAdmin,
    'X-Tenant-ID': isAdmin ? 'Not required (Admin)' : config.headers['X-Tenant-ID'],
    'Authorization': token ? 'Bearer ***' : 'None'
  });
  
  return config;
});
