import { expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-question-repository'
import { makeQuestion } from '@test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let InMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    InMemoryQuestionRepository = new InMemoryQuestionsRepository()
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

    await sut.execute({
      questionId: 'question-1',
      authorId: '01',
    })

    expect(InMemoryQuestionRepository.items).toHaveLength(0)
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
