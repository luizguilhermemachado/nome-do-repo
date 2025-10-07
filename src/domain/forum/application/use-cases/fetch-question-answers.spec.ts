import { expect, it } from 'vitest'
import { makeAnswer } from '@test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answer-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let InMemoryAnswerRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch  Questions Answers', () => {
  beforeEach(() => {
    InMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(InMemoryAnswerRepository)
  })

  it('should be able to fetch questions answers', async () => {
    await InMemoryAnswerRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await InMemoryAnswerRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await InMemoryAnswerRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated questions answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await InMemoryAnswerRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
