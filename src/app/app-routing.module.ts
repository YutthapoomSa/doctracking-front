import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SendoutDocumentsComponent} from './pages/sendout-documents/sendout-documents.component';
import {TrackingDocumentRoutingComponent} from './pages/tracking-document-routing/tracking-document-routing.component';

import {NonAuthGuard} from '@guards/non-auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {LoginComponent} from '@modules/login/login.component';
import {MainComponent} from '@modules/main/main.component';
import {PrivacyPolicyComponent} from '@modules/privacy-policy/privacy-policy.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {RegisterComponent} from '@modules/register/register.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {SubMenuComponent} from '@pages/main-menu/sub-menu/sub-menu.component';
import {ManageAccountsComponent} from '@pages/manage-accounts/manage-accounts.component';
import {ManageDepartmentsComponent} from '@pages/manage-departments/manage-departments.component';
import {ManageDocumentsComponent} from '@pages/manage-documents/manage-documents.component';
import {ProfileComponent} from '@pages/profile/profile.component';
import {TrackingComponent} from '@pages/tracking/tracking.component';
import {AuthGuard} from '@services/guard/auth.guard';

import {PreviewPdfComponent} from '@components/preview-pdf/preview-pdf.component';
import {RegisPrintComponent} from '@components/print/regis-print/regis-print.component';
import {RegisReceivingSendingDocComponent} from '@pages/regis-receiving-sending-doc/regis-receiving-sending-doc.component';
import {LogoutComponent} from './modules/logout/logout.component';
import {ManageDocumentsUnsuccessComponent} from './pages/manage-documents-unsuccess/manage-documents-unsuccess.component';
import {PendingDocumentsComponent} from './pages/pending-documents/pending-documents.component';
import {ReceiveDocumentsComponent} from './pages/receive-documents/receive-documents.component';
import {ArchiveDocumentComponent} from '@pages/archive-document/archive-document.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        children: [
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'blank',
                component: BlankComponent
            },
            {
                path: 'receive-documents',
                component: ReceiveDocumentsComponent
            },
            {
                path: 'pending-documents',
                component: PendingDocumentsComponent
            },
            {
                path: 'tracking',
                component: TrackingComponent
            },
            {
                path: 'manage-departments',
                component: ManageDepartmentsComponent
            },
            {
                path: 'manage-documents-unsuccess',
                component: ManageDocumentsUnsuccessComponent
            },
            {
                path: 'sendout-documents',
                component: SendoutDocumentsComponent
            },
            {
                path: 'manage-documents',
                component: ManageDocumentsComponent
            },
            {
                path: 'manage-accounts',
                component: ManageAccountsComponent
            },
            {
                path: 'sub-menu-1',
                component: SubMenuComponent
            },
            {
                path: 'sub-menu-2',
                component: BlankComponent
            },
            {
                path: 'regis-receiving-sending-doc',
                component: RegisReceivingSendingDocComponent
            },
            {
                path: 'tracking-document-routing',
                component: TrackingDocumentRoutingComponent
            },
            {
                path: 'archive-document',
                component: ArchiveDocumentComponent
            },

            {
                path: '',
                component: DashboardComponent
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },

    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'regis-print',
        component: RegisPrintComponent
    },
    {
        path: 'preview-pdf',
        component: PreviewPdfComponent
    },
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
