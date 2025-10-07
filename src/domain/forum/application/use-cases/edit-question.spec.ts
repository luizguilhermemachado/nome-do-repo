import { expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-question-repository'
import { makeQuestion } from '@test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let InMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    InMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(InMemoryQuestionRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )

    await InMemoryQuestionRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-01',
      title: 'Test title',
      content: 'Test content',
    })

    expect(InMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'Test title',
      content: 'Test content',
    })
  })

  it('should be not able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('02'),
      },
      new UniqueEntityID('question-1'),
    )

    await InMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-01',
      title: 'Test title',
      content: 'Test content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
