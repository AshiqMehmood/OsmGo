import { PushDataToOsmPage } from './components/pushDataToOsm/pushDataToOsm';
import { AboutPage } from './components/about/about';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPage } from './components/main/main';
import { SettingsPage } from './components/settings/settings';
import { LoginPage } from './components/login/login.component';
import { AddPointsComponent } from "./components/add-points/add-points.component"
import {CommontagsComponent } from "./components/add-points/commontags/commontags.component"
import {AlltagsComponent } from "./components/add-points/alltags/alltags.component"
import {BookmarksComponent } from "./components/add-points/bookmarks/bookmarks.component"
import {TagTypeComponent} from "./components/add-points/tag-type/tag-type.component"


import { ManageTagsComponent } from './components/manage-tags/manage-tags.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  { path: 'main', component: MainPage },
  { path: 'about', component: AboutPage },
  { path: 'settings', component: SettingsPage},
  { path: 'pushData', component: PushDataToOsmPage},
  { path: 'login', component: LoginPage},
  { path: 'tags', component: ManageTagsComponent},
  { path: 'type', component: TagTypeComponent},
  { path: 'edit', component: AddPointsComponent,
  children: [
    {
        path: 'common', // child route path
        children: [
          {
            path: '',
            component: CommontagsComponent
          }
        ]
      },
      {
        path: '',
        redirectTo: '/edit/common',
        pathMatch: 'full'
    },

    {
      path: 'bookmarks', // child route path
      children: [
        {
          path: '',
          component: BookmarksComponent
        }
      ]
    },
    {
      path: '',
      redirectTo: '/edit/bookmarks',
      pathMatch: 'full'
    },
    {
        path: 'all tags', // child route path
        children: [
          {
            path: '',
            component: AlltagsComponent
          }
        ]
      },
      {
        path: '',
        redirectTo: '/edit/all tags',
        pathMatch: 'full'
      } 

  ],




}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
