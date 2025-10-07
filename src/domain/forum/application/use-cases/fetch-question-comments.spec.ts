import { expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentRepository } from '@test/repositories/in-memory-question-comment-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from '@test/factories/make-question-comment'

let InMemoryQuestionsCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch  Questions Answers', () => {
  beforeEach(() => {
    InMemoryQuestionsCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new FetchQuestionCommentsUseCase(InMemoryQuestionsCommentRepository)
  })

  it('should be able to fetch questions comments', async () => {
    await InMemoryQuestionsCommentRepository.create(makeQuestionComment())

    await InMemoryQuestionsCommentRepository.create(makeQuestionComment())

    await InMemoryQuestionsCommentRepository.create(makeQuestionComment())

    expect(InMemoryQuestionsCommentRepository.items).toHaveLength(3)
  })

  it('should be able to fetch paginated questions comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await InMemoryQuestionsCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
