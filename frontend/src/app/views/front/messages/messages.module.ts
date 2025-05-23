import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloModule } from 'apollo-angular';
import { MessageChatComponent } from './message-chat/message-chat.component';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserStatusService } from '@app/services/user-status.service';
import { MessageUserProfileComponent } from './message-user-profile/message-user-profile.component';

@NgModule({
  declarations: [
    MessageChatComponent,
    MessagesListComponent,
    UserListComponent,
    MessageUserProfileComponent,
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ApolloModule,
  ],

  providers: [UserStatusService],
})
export class MessagesModule {}
