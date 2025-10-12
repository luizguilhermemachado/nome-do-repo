import { expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-question-repository'
import { makeQuestion } from '@test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from '@test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '@test/factories/make-question-attachment'

let InMemoryQuestionRepository: InMemoryQuestionsRepository
let InMemoryQuestionsAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    InMemoryQuestionsAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    InMemoryQuestionRepository = new InMemoryQuestionsRepository(
      InMemoryQuestionsAttachmentRepository,
    )
    sut = new DeleteQuestionUseCase(InMemoryQuestionRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('01'),
      },
      new UniqueEntityID('question-1'),
    )

    await InMemoryQuestionRepository.create(newQuestion)

    InMemoryQuestionsAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      questionId: 'question-1',
      authorId: '01',
    })

    expect(InMemoryQuestionRepository.items).toHaveLength(0)
    expect(InMemoryQuestionsAttachmentRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('02'),
      },
      new UniqueEntityID('question-1'),
    )

    await InMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: '01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
