import { expect, it } from 'vitest'
import { makeAnswer } from '@test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answer-repository'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-question-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from '@test/factories/make-question'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
let InMemoryQuestionRepository: InMemoryQuestionsRepository
let InMemoryAnwserRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose question best answer', () => {
  beforeEach(() => {
    InMemoryAnwserRepository = new InMemoryAnswersRepository()
    InMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      InMemoryAnwserRepository,
      InMemoryQuestionRepository,
    )
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await InMemoryQuestionRepository.create(question)
    await InMemoryAnwserRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(InMemoryQuestionRepository.items[0]?.bestAnswerId).toEqual(answer.id)
  })

  it('should be not able to choose another user best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    const answer = makeAnswer({
      questionId: question.id,
    })

    await InMemoryQuestionRepository.create(question)
    await InMemoryAnwserRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
