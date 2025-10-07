import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityID

  get id() {
    return this._id
  }

  protected constructor(
    protected props: Props,
    id?: UniqueEntityID,
  ) {
    this._id = id ?? new UniqueEntityID()
  }
}
