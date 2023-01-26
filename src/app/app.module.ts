import {AppRoutingModule} from '@/app-routing.module';
import {registerLocaleData} from '@angular/common';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ViewDetailDocComponent} from '@components/view-detail-doc/view-detail-doc.component';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {LoginComponent} from '@modules/login/login.component';
import {LogoutComponent} from '@modules/logout/logout.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {HeaderComponent} from '@modules/main/header/header.component';
import {LanguageComponent} from '@modules/main/header/language/language.component';
import {MessagesComponent} from '@modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@modules/main/header/notifications/notifications.component';
import {UserComponent} from '@modules/main/header/user/user.component';
import {MainComponent} from '@modules/main/main.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {RegisterComponent} from '@modules/register/register.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {StoreModule} from '@ngrx/store';
import {BlankComponent} from '@pages/blank/blank.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ProfileComponent} from '@pages/profile/profile.component';
import {InterceptorInterceptor} from '@services/interceptor/interceptor.interceptor';
import {DateFormat1Pipe} from '@services/pipes/date-format1.pipe';
import {TypeDocumentPipe} from '@services/pipes/type-document.pipe';
import {NgSelect2Module} from 'ng-select2';
import {ChartsModule} from 'ng2-charts';
import {ToastrModule} from 'ngx-toastr';
import {AppComponent} from './app.component';
import {ButtonComponent} from './components/button/button.component';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {DropdownMenuComponent} from './components/dropdown/dropdown-menu/dropdown-menu.component';
import {DropdownComponent} from './components/dropdown/dropdown.component';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {SelectComponent} from './components/select/select.component';
import {ControlSidebarComponent} from './modules/main/control-sidebar/control-sidebar.component';
import {PrivacyPolicyComponent} from './modules/privacy-policy/privacy-policy.component';
import {MainMenuComponent} from './pages/main-menu/main-menu.component';
import {SubMenuComponent} from './pages/main-menu/sub-menu/sub-menu.component';
import {ManageAccountsComponent} from './pages/manage-accounts/manage-accounts.component';
import {ManageDepartmentsComponent} from './pages/manage-departments/manage-departments.component';
import {ManageDocumentsUnsuccessComponent} from './pages/manage-documents-unsuccess/manage-documents-unsuccess.component';
import {ManageDocumentsComponent} from './pages/manage-documents/manage-documents.component';
import {PaginationDocumentSummaryComponent} from './pages/pagination-document-summary/pagination-document-summary.component';
import {PendingDocumentsComponent} from './pages/pending-documents/pending-documents.component';
import {ReceiveDocumentsComponent} from './pages/receive-documents/receive-documents.component';
import {TrackingComponent} from './pages/tracking/tracking.component';
import {PriorityThaiPipe} from './services/pipes/priority-thai.pipe';
import {StatusThaiPipe} from './services/pipes/status-thai.pipe';
import {authReducer} from './store/auth/reducer';
import {uiReducer} from './store/ui/reducer';
import {SendoutDocumentsComponent} from './pages/sendout-documents/sendout-documents.component';
import {RegisReceivingSendingDocComponent} from './pages/regis-receiving-sending-doc/regis-receiving-sending-doc.component';
import {DateOnlyFormatPipe} from '@services/pipes/date-only-format.pipe';
import {RegisPrintComponent} from './components/print/regis-print/regis-print.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {PreviewPdfComponent} from '@components/preview-pdf/preview-pdf.component';
import {DndDirective} from '@pages/manage-documents/dnd.directive';
import { DocumentRoutingListComponent } from './components/document-routing-list/document-routing-list.component';
import { TrackingDocumentRoutingComponent } from './pages/tracking-document-routing/tracking-document-routing.component';
import { ArchiveDocumentComponent } from './pages/archive-document/archive-document.component';
registerLocaleData(localeEn, 'en-EN');

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        BlankComponent,
        ProfileComponent,
        RegisterComponent,
        DashboardComponent,
        MessagesComponent,
        NotificationsComponent,
        ButtonComponent,
        UserComponent,
        ForgotPasswordComponent,
        RecoverPasswordComponent,
        LanguageComponent,
        PrivacyPolicyComponent,
        MainMenuComponent,
        SubMenuComponent,
        MenuItemComponent,
        DropdownComponent,
        DropdownMenuComponent,
        ControlSidebarComponent,
        SelectComponent,
        CheckboxComponent,
        ManageDepartmentsComponent,
        ManageDocumentsComponent,
        TrackingComponent,
        ManageAccountsComponent,
        LogoutComponent,
        ReceiveDocumentsComponent,
        PendingDocumentsComponent,
        ManageDocumentsUnsuccessComponent,
        PaginationDocumentSummaryComponent,
        TypeDocumentPipe,
        DateFormat1Pipe,
        StatusThaiPipe,
        DateOnlyFormatPipe,
        PriorityThaiPipe,
        ViewDetailDocComponent,
        SendoutDocumentsComponent,
        RegisReceivingSendingDocComponent,
        RegisPrintComponent,
        PreviewPdfComponent,
        DndDirective,
        DocumentRoutingListComponent,
        TrackingDocumentRoutingComponent,
        ArchiveDocumentComponent,
    ],
    imports: [
        BrowserModule,
        StoreModule.forRoot({auth: authReducer, ui: uiReducer}),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FormsModule,
        NgSelect2Module,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        NgbModule,
        ChartsModule,
        PdfViewerModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
