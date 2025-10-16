import { expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-question-repository'
import { makeQuestion } from '@test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from '@test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '@test/factories/make-question-attachment'

let InMemoryQuestionRepository: InMemoryQuestionsRepository
let InMemoryQuestionAttanchmentsReposity: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    InMemoryQuestionRepository = new InMemoryQuestionsRepository(
      InMemoryQuestionAttanchmentsReposity,
    )
    InMemoryQuestionAttanchmentsReposity =
      new InMemoryQuestionAttachmentRepository()
    sut = new EditQuestionUseCase(
      InMemoryQuestionRepository,
      InMemoryQuestionAttanchmentsReposity,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )

    await InMemoryQuestionRepository.create(newQuestion)

    InMemoryQuestionAttanchmentsReposity.items.push(
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
      questionId: newQuestion.id.toString(),
      authorId: 'author-01',
      title: 'Test title',
      content: 'Test content',
      attachmentsIds: ['1', '3'],
    })

    expect(InMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'Test title',
      content: 'Test content',
    })
    expect(
      InMemoryQuestionRepository.items[0]?.attachment.currentItems,
    ).toHaveLength(2)
    expect(
      InMemoryQuestionRepository.items[0]?.attachment.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should be not able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('02'),
      },
      new UniqueEntityID('question-1'),
    )

    await InMemoryQuestionRepository.create(newQuestion)

    InMemoryQuestionAttanchmentsReposity.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-01',
      title: 'Test title',
      content: 'Test content',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
