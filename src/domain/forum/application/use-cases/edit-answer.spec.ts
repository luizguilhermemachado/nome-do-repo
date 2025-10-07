import { expect, it } from 'vitest'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answer-repository'
import { makeAnswer } from '@test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let InMemoryAnswerRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    InMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(InMemoryAnswerRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )

    await InMemoryAnswerRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-01',
      content: 'Test content',
    })

    expect(InMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'Test content',
    })
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
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
