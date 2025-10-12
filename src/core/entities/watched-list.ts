export abstract class WatchedList<T> {
  public currentItems: T[]
  private initial: T[]
  private new: T[]
  private removed: T[]

  constructor(initialItems?: T[]) {
    this.initial = initialItems || []
    this.currentItems = initialItems || []
    this.new = []
    this.removed = []
  }

  protected abstract compareItems(a: T, b: T): boolean

  public getCurrentItems(): T[] {
    return this.currentItems
  }

  public getNewItems(): T[] {
    return this.new
  }

  public getRemovedItems(): T[] {
    return this.removed
  }

  public add(item: T): void {
    const alreadyExists = this.currentItems.some((i) =>
      this.compareItems(i, item),
    )

    if (!alreadyExists) {
      this.currentItems.push(item)

      const wasRemoved = this.removed.find((r) => this.compareItems(r, item))

      if (wasRemoved) {
        this.removed = this.removed.filter((r) => !this.compareItems(r, item))
      } else {
        this.new.push(item)
      }
    }
  }

  public remove(item: T): void {
    const exists = this.currentItems.some((i) => this.compareItems(i, item))

    if (exists) {
      this.currentItems = this.currentItems.filter(
        (i) => !this.compareItems(i, item),
      )

      const wasNew = this.new.find((n) => this.compareItems(n, item))

      if (wasNew) {
        this.new = this.new.filter((n) => !this.compareItems(n, item))
      } else {
        this.removed.push(item)
      }
    }
  }

  public update(items: T[]): void {
    // Removidos
    const removed = this.currentItems.filter(
      (item) => !items.some((i) => this.compareItems(i, item)),
    )

    for (const item of removed) {
      this.remove(item)
    }

    // Adicionados
    const added = items.filter(
      (item) => !this.currentItems.some((i) => this.compareItems(i, item)),
    )

    for (const item of added) {
      this.add(item)
    }
  }
}
