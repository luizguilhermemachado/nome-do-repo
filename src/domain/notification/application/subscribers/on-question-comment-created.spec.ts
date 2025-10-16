import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-question-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notification-repository'
import { makeQuestion } from '@test/factories/make-question'
import { MockInstance, vi } from 'vitest'
import { waitFor } from '@test/utils/wait-for'
import { OnQuestionCommentCreated } from './on-question-comment-created'
import { InMemoryQuestionCommentRepository } from '@test/repositories/in-memory-question-comment-repository'
import { makeQuestionComment } from '@test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryNotificationRepository: InMemoryNotificationsRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository

let sendNotificationExecuteSpy: MockInstance

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // eslint-disable-next-line no-new
    new OnQuestionCommentCreated(
      inMemoryQuestionCommentRepository,
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification when question has new best answer chosen', async () => {
    const question = makeQuestion()

    inMemoryQuestionsRepository.create(question)

    const questionComment = makeQuestionComment({
      questionId: new UniqueEntityID(question.id.toString()),
    })

    inMemoryQuestionCommentRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
