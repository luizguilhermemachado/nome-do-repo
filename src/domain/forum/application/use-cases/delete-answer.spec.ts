import { expect, it } from 'vitest'
import { makeAnswer } from '@test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answer-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAnswerAttachmentRepository } from '@test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from '@test/factories/make-answer-attachment'

let InMemoryAnwserRepository: InMemoryAnswersRepository
let InMemoryAnswerAttanchmentsReposity: InMemoryAnswerAttachmentRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    InMemoryAnswerAttanchmentsReposity =
      new InMemoryAnswerAttachmentRepository()
    InMemoryAnwserRepository = new InMemoryAnswersRepository(
      InMemoryAnswerAttanchmentsReposity,
    )
    sut = new DeleteAnswerUseCase(InMemoryAnwserRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('01'),
      },
      new UniqueEntityID('answer-1'),
    )

    await InMemoryAnwserRepository.create(newAnswer)

    InMemoryAnswerAttanchmentsReposity.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      answerId: 'answer-1',
      authorId: '01',
    })

    expect(InMemoryAnwserRepository.items).toHaveLength(0)
    expect(InMemoryAnswerAttanchmentsReposity.items).toHaveLength(0)
  })

  it('should be not able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('02'),
      },
      new UniqueEntityID('answer-1'),
    )

    await InMemoryAnwserRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: '01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
