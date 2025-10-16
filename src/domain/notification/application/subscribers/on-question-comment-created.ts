import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionCommentCreatedNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  private async sendQuestionCommentCreatedNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    // Busca o comentário completo
    const comment = await this.questionCommentsRepository.findById(
      questionComment.id.toString(),
    )

    if (!comment) return

    // Busca a questão associada a esse comentário
    const question = await this.questionsRepository.findById(
      comment.questionId.toString(),
    )

    if (!question) return

    // Envia notificação para o autor da questão
    await this.sendNotification.execute({
      recipientId: question.authorId.toString(),
      title: `Novo comentário em "${question.title.substring(0, 20)}..."`,
      content: `${questionComment.id} comentou na sua pergunta.`,
    })
  }
}
