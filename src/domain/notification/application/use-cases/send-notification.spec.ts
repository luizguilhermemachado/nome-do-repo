import { expect, it } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification'

let InMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Create Notification', () => {
  beforeEach(() => {
    InMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(InMemoryNotificationRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificacao',
      content: 'Conteudo da notificacao',
    })
    expect(result.isRight()).toBe(true)
    expect(InMemoryNotificationRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
