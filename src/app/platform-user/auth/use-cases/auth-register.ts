import { Injectable } from '@nestjs/common';
import { User } from '@platform-user/user/domain/user';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { PositionUser, StatusUser } from '@prisma/client';
import { SendConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-send';
import { AuthRegisterDto } from '@platform-user/auth/use-cases/dto/auth-register.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RegisterAuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly sendConfirm: SendConfirmMailUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: AuthRegisterDto): Promise<any> {
    const hashPassword = await this.bcrypt.hash(input.password);
    const userData = new User({
      name: input.name,
      surname: input.surname,
      middlename: input.middlename,
      birthday: input.birthday,
      userRoleId: 1,
      phone: input.phone,
      email: input.email,
      password: hashPassword,
      position: PositionUser.Owner,
      status: StatusUser.BLOCKED,
      fcmToken: input?.fcmToken,
      receiveNotifications: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    const user = await this.userRepository.create(userData);

    const sendMail = await this.sendConfirm.execute(
      user.email,
      'Полная авторизация',
    );

    this.eventEmitter.emit('notification.welcome', {
      eventType: 'welcome',
      userIds: [user.id],
      fcmTokens: [input?.fcmToken],
      heading: 'Добро пожаловать!',
      body: `Приветствуем вас!
      Наша система поможет вам оптимизировать и контролировать все аспекты вашего бизнеса, начиная с учёта заказов и заканчивая взаимодействием с партнёрами и клиентами.
      Функциональные возможности CRM позволяют настраивать различные параметры в зависимости от ваших потребностей, такие как воронка продаж, учёт эффективности сотрудников и интеграция с различными приложениями.
      Выбирайте подходящий тариф и начните использовать наш сервис уже сегодня
      Мы уверены, что он значительно повысит вашу продуктивность и прибыль.
      С уважением, Onvi_бизнес !`,
    });

    return { user, sendMail };
  }
}
