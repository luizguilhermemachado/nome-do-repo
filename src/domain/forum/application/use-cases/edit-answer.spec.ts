import { expect, it } from 'vitest'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answer-repository'
import { makeAnswer } from '@test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { makeAnswerAttachment } from '@test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentRepository } from '@test/repositories/in-memory-answer-attachments-repository'

let InMemoryAnswerRepository: InMemoryAnswersRepository
let InMemoryAnswerAttanchmentsReposity: InMemoryAnswerAttachmentRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    InMemoryAnswerAttanchmentsReposity =
      new InMemoryAnswerAttachmentRepository()
    InMemoryAnswerRepository = new InMemoryAnswersRepository(
      InMemoryAnswerAttanchmentsReposity,
    )
    sut = new EditAnswerUseCase(
      InMemoryAnswerRepository,
      InMemoryAnswerAttanchmentsReposity,
    )
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )

    await InMemoryAnswerRepository.create(newAnswer)

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
      answerId: newAnswer.id.toString(),
      authorId: 'author-01',
      content: 'Test content',
      attachmentsIds: ['1', '3'],
    })

    expect(InMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'Test content',
    })
    expect(
      InMemoryAnswerRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2)
    expect(InMemoryAnswerRepository.items[0]?.attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
      ],
    )
  })

  it('should be not able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('02'),
      },
      new UniqueEntityID('answer-1'),
    )

    await InMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-01',
      content: 'Test content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
