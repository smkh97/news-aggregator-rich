import { describe, it, expect, beforeEach } from "vitest"
import { useApiError } from "~/composables/useApiError"

describe("useApiError", () => {
  let apiError: ReturnType<typeof useApiError>

  beforeEach(() => {
    apiError = useApiError()
  })

  it("should initialize with null error and false isApiKeyError", () => {
    expect(apiError.error.value).toBeNull()
    expect(apiError.isApiKeyError.value).toBe(false)
  })

  it("should handle 401 error as API key error", () => {
    const error = { response: { status: 401 } }
    apiError.handleError(error)

    expect(apiError.error.value).toBe("Invalid API key. Please check your NewsAPI key configuration.")
    expect(apiError.isApiKeyError.value).toBe(true)
  })

  it("should handle 429 error as rate limit error", () => {
    const error = { response: { status: 429 } }
    apiError.handleError(error)

    expect(apiError.error.value).toBe("You have exceeded your API request limit. Result shown are cached")
    expect(apiError.isApiKeyError.value).toBe(true)
  })

  it("should handle other errors with message from response", () => {
    const error = {
      response: {
        status: 500,
        data: { message: "Server error" },
      },
    }
    apiError.handleError(error)

    expect(apiError.error.value).toBe("Server error")
    expect(apiError.isApiKeyError.value).toBe(false)
  })

  it("should handle errors without response data message", () => {
    const error = { response: { status: 500 } }
    apiError.handleError(error)

    expect(apiError.error.value).toBe("An error occurred while fetching data.")
    expect(apiError.isApiKeyError.value).toBe(false)
  })

  it("should clear error state", () => {
    const error = { response: { status: 401 } }
    apiError.handleError(error)

    expect(apiError.error.value).not.toBeNull()
    expect(apiError.isApiKeyError.value).toBe(true)

    apiError.clearError()

    expect(apiError.error.value).toBeNull()
    expect(apiError.isApiKeyError.value).toBe(false)
  })
})

