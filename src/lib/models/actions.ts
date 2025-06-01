export type ValidationErrors = Record<string, string[] | undefined>

export interface ActionResponse {
  message?: string
  errors?: ValidationErrors
  success: boolean
  submittedData?: Record<string, string>
}
