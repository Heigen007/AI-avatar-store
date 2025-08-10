import express, { Router } from 'express';
import { createUser } from './services/createUser';
import { updateUser } from './services/updateUser';
import { createAvatar } from './services/createAvatar';
import { getChatList } from './services/getChatList';
import { getChatHistory } from './services/getChatHistory';
import { sendMessage } from './services/sendMessage';
import { getUser } from './services/getUser';
import { deleteAvatar } from './services/deleteAvatar';
import { updateAvatar } from './services/updateAvatar';
import { submitFeedback } from './services/submitFeedback';
import { sendVoiceMessage } from './services/sendVoiceMessage';
import { uploadImage, uploadVoice } from 'src/middleware/upload';
import { getAdminStats } from './handlers/getAdminStats';
import { getAdminChatsList } from './handlers/getAdminChatsList';
import { getAdminChatsPage } from './handlers/getAdminChatsPage';

const globalRouter: Router = express.Router();

// 1. Создание пользователя
globalRouter.post('/user', createUser);

// 2. Обновление данных пользователя
globalRouter.put('/user/:id', updateUser);

// 3. Создание аватара
globalRouter.post('/avatar', createAvatar);

// 4. Получение списка чатов пользователя
globalRouter.get('/chats/:userId', getChatList);

// 5. Получение истории чата
globalRouter.get('/chat/:chatId/messages', getChatHistory);

// 6. Отправка сообщения
globalRouter.post('/chat/:chatId/message', uploadImage.single('image'), sendMessage)
globalRouter.post('/chat/:chatId/voice', uploadVoice.single('voice'), sendVoiceMessage)

// 7. Получение данных пользователя по ID
globalRouter.get('/user/:id', getUser)

// 8. Удаление аватара (предположим, что есть функция deleteAvatar)
globalRouter.delete('/avatar/:id', deleteAvatar)

// 9. Обновление аватара
globalRouter.put('/avatar/:id', updateAvatar)

// 10. Загрузка изображения аватара
globalRouter.post('/feedback', submitFeedback)

// 11. Административная статистика
globalRouter.get('/admin/stats', getAdminStats);

globalRouter.get('/admin/chats', getAdminChatsPage);
globalRouter.get('/admin/chats/list', getAdminChatsList);

export { globalRouter };