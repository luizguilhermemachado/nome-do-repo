import { expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-question-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentRepository } from '@test/repositories/in-memory-question-comment-repository'
import { makeQuestion } from '@test/factories/make-question'

let InMemoryQuestionRepository: InMemoryQuestionsRepository
let InMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

describe('Create Comment Question', () => {
  beforeEach(() => {
    InMemoryQuestionRepository = new InMemoryQuestionsRepository()
    InMemoryQuestionCommentsRepository = new InMemoryQuestionCommentRepository()
    sut = new CommentOnQuestionUseCase(
      InMemoryQuestionCommentsRepository,
      InMemoryQuestionRepository,
    )
  })

  it('should be able to  on question', async () => {
    const question = makeQuestion()

    await InMemoryQuestionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comentario test',
    })

    expect(InMemoryQuestionCommentsRepository.items[0]?.content).toEqual(
      'Comentario test',
    )
  })
})
