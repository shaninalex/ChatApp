import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: "settings",
                component: SettingsComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
