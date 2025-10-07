import { expect, it } from 'vitest'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answer-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

import { makeAnswer } from '@test/factories/make-answer'
import { InMemoryAnswerCommentRepository } from '@test/repositories/in-memory-answer-comment-repository'

let InMemoryAnswerRepository: InMemoryAnswersRepository
let InMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository
let sut: CommentOnAnswerUseCase

describe('Create Comment Answer', () => {
  beforeEach(() => {
    InMemoryAnswerRepository = new InMemoryAnswersRepository()
    InMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository()
    sut = new CommentOnAnswerUseCase(
      InMemoryAnswerCommentsRepository,
      InMemoryAnswerRepository,
    )
  })

  it('should be able to  on answer', async () => {
    const answer = makeAnswer()

    await InMemoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Comentario test',
    })

    expect(InMemoryAnswerCommentsRepository.items[0]?.content).toEqual(
      'Comentario test',
    )
  })
})
