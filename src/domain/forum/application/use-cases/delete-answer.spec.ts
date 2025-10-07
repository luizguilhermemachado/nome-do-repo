import { expect, it } from 'vitest'
import { makeAnswer } from '@test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answer-repository'
import { NotAllowedError } from './errors/not-allowed-error'

let InMemoryAnwserRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    InMemoryAnwserRepository = new InMemoryAnswersRepository()
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

    await sut.execute({
      answerId: 'answer-1',
      authorId: '01',
    })

    expect(InMemoryAnwserRepository.items).toHaveLength(0)
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
