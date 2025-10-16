import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { QuestionComment } from '../entities/question-comment'

export class QuestionCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public questionComment: QuestionComment

  constructor(questionComment: QuestionComment) {
    this.ocurredAt = new Date()
    this.questionComment = questionComment
  }

  getAggregateId(): UniqueEntityID {
    return this.questionComment.id
  }
}
