import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/send')
  sendMessage(@Body() body: { sender: string; text: string }) {
    return this.messagesService.sendMessage(body.sender, body.text);
  }
}
