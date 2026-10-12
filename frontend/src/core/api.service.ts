import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Change this to your deployed backend URL (e.g. https://your-api.onrender.com) before deploying
export const API = 'http://localhost:5000';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  get<T = any>(path: string) { return this.http.get<T>(`${API}/api${path}`); }
  post<T = any>(path: string, body: any) { return this.http.post<T>(`${API}/api${path}`, body); }
  put<T = any>(path: string, body: any) { return this.http.put<T>(`${API}/api${path}`, body); }
  del<T = any>(path: string) { return this.http.delete<T>(`${API}/api${path}`); }
}
