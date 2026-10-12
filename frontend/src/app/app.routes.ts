import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards';
import { LoginComponent } from './pages/login.component';
import { UploadComponent } from './pages/upload.component';
import { WallSelectComponent } from './pages/wall-select.component';
import { PreviewComponent } from './pages/preview.component';
import { SavedComponent } from './pages/saved.component';
import { AdminComponent } from './pages/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: UploadComponent, canActivate: [authGuard] },
  { path: 'select', component: WallSelectComponent, canActivate: [authGuard] },
  { path: 'preview', component: PreviewComponent, canActivate: [authGuard] },
  { path: 'saved', component: SavedComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: 'upload' },
];
