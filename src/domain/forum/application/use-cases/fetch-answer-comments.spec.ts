import { expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentRepository } from '@test/repositories/in-memory-answer-comment-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from '@test/factories/make-answer-comment'

let InMemoryAnswersCommentRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch  Answers Answers', () => {
  beforeEach(() => {
    InMemoryAnswersCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new FetchAnswerCommentsUseCase(InMemoryAnswersCommentRepository)
  })

  it('should be able to fetch answers comments', async () => {
    await InMemoryAnswersCommentRepository.create(makeAnswerComment())

    await InMemoryAnswersCommentRepository.create(makeAnswerComment())

    await InMemoryAnswersCommentRepository.create(makeAnswerComment())

    expect(InMemoryAnswersCommentRepository.items).toHaveLength(3)
  })

  it('should be able to fetch paginated answers comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await InMemoryAnswersCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
