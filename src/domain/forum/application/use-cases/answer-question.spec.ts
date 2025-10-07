import { expect, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answer-repository'

let InMemoryAnswerRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    InMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(InMemoryAnswerRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'nova resposta',
    })

    expect(result.isRight()).toBe(true)
    expect(InMemoryAnswerRepository.items[0]).toEqual(result.value?.answer)
  })
})
