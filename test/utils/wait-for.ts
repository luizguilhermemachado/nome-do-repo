export async function waitFor(
  assertions: () => void,
  maxDuration = 1000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0
    const intervalTime = 10

    const interval = setInterval(() => {
      elapsedTime += intervalTime

      try {
        assertions()
        clearInterval(interval)
        resolve()
      } catch (error) {
        if (elapsedTime >= maxDuration) {
          clearInterval(interval)
          reject(error)
        }
      }
    }, intervalTime)
  })
}
