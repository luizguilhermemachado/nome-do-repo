import { expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { InMemoryAnswerCommentRepository } from '@test/repositories/in-memory-answer-comment-repository'
import { makeAnswerComment } from '@test/factories/make-answer-comment'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'

let InMemoryAnswersCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    InMemoryAnswersCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new DeleteAnswerCommentUseCase(InMemoryAnswersCommentRepository)
  })

  it('should be able to delete a comment answer', async () => {
    const newCommentAnswer = makeAnswerComment(
      {
        authorId: new UniqueEntityID('01'),
      },
      new UniqueEntityID('answer-1'),
    )

    await InMemoryAnswersCommentRepository.create(newCommentAnswer)

    await sut.execute({
      answerCommentId: 'answer-1',
      authorId: '01',
    })

    expect(InMemoryAnswersCommentRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a comment answer from another user', async () => {
    const newCommentAnswer = makeAnswerComment(
      {
        authorId: new UniqueEntityID('01'),
      },
      new UniqueEntityID('answer-1'),
    )

    await InMemoryAnswersCommentRepository.create(newCommentAnswer)

    const result = await sut.execute({
      answerCommentId: 'answer-2',
      authorId: '01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
