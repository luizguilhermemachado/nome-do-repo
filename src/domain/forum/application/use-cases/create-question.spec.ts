import { expect, it } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-question-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let InMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    InMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(InMemoryQuestionRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Nova pergunta',
      attachmentsIds: ['1', '2'],
    })
    expect(result.isRight()).toBe(true)
    expect(InMemoryQuestionRepository.items[0]).toEqual(result.value?.question)
    expect(InMemoryQuestionRepository.items[0]?.attachment).toHaveLength(2)
    expect(InMemoryQuestionRepository.items[0]?.attachment).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
