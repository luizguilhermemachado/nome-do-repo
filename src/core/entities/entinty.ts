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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(entity: Entity<any>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }
  }
}
