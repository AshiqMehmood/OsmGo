import { PushDataToOsmPage } from './components/pushDataToOsm/pushDataToOsm';
import { AboutPage } from './components/about/about';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPage } from './components/main/main';
import { SettingsPage } from './components/settings/settings';
import { LoginPage } from './components/login/login.component';
import { AddPointsComponent } from "./components/add-points/add-points.component"


import { ManageTagsComponent } from './components/manage-tags/manage-tags.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  { path: 'main', component: MainPage },
  { path: 'about', component: AboutPage },
  { path: 'settings', component: SettingsPage},
  { path: 'pushData', component: PushDataToOsmPage},
  { path: 'login', component: LoginPage},
  { path: 'tags', component: ManageTagsComponent},
  { path: 'edit', component: AddPointsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
