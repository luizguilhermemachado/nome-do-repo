import { expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { InMemoryQuestionCommentRepository } from '@test/repositories/in-memory-question-comment-repository'
import { makeQuestionComment } from '@test/factories/make-question-comment'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'

let InMemoryQuestionsCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    InMemoryQuestionsCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new DeleteQuestionCommentUseCase(InMemoryQuestionsCommentRepository)
  })

  it('should be able to delete a comment question', async () => {
    const newCommentQuestion = makeQuestionComment(
      {
        authorId: new UniqueEntityID('01'),
      },
      new UniqueEntityID('question-1'),
    )

    await InMemoryQuestionsCommentRepository.create(newCommentQuestion)

    await sut.execute({
      questionCommentId: 'question-1',
      authorId: '01',
    })

    expect(InMemoryQuestionsCommentRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a comment question from another user', async () => {
    const newCommentQuestion = makeQuestionComment(
      {
        authorId: new UniqueEntityID('01'),
      },
      new UniqueEntityID('question-1'),
    )

    await InMemoryQuestionsCommentRepository.create(newCommentQuestion)

    const result = await sut.execute({
      questionCommentId: 'question-2',
      authorId: '01',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
