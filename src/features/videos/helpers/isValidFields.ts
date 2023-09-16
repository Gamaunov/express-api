import { AvailableResolutions, ErrorType } from '../../../shared/types/types'
import { validateAge } from '../../../shared/utils/validate-age'

export let errors: ErrorType = {
  errorsMessages: [],
}

function pushErrors(name: string) {
  return errors.errorsMessages.push({
    message: `Invalid ${name}`,
    field: name,
  })
}

export const isValidFields = (
  title: string,
  author: string,
  availableResolutions: AvailableResolutions[],
  canBeDownloaded?: boolean,
  minAgeRestriction?: number | null,
  publicationDate?: string,
) => {
  if (!title || title.length === 0 || title.trim().length > 40) {
    pushErrors('title')
  }

  if (!author || author.length === 0 || author.trim().length > 20) {
    pushErrors('author')
  }

  if (Array.isArray(availableResolutions)) {
    availableResolutions.map((r) => {
      !AvailableResolutions[r] && pushErrors('availableResolutions')
    })
  }

  if (canBeDownloaded) {
    if (
      typeof canBeDownloaded !== 'undefined' &&
      typeof canBeDownloaded !== 'boolean'
    ) {
      pushErrors('canBeDownloaded')
    }
  }

  if (minAgeRestriction) {
    if (!validateAge(minAgeRestriction)) {
      pushErrors('minAgeRestriction')
    }
  }

  if (publicationDate) {
    if (!publicationDate || typeof publicationDate !== 'string') {
      pushErrors('publicationDate')
    }
  }

  return !!errors.errorsMessages.length
}
