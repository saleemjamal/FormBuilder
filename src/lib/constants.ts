export const FORM_ELEMENT_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  EMAIL: 'email',
  URL: 'url',
  DATE: 'date',
  DATETIME: 'datetime',
  TIME: 'time',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  FILE: 'file',
  IMAGE: 'image',
  DYNAMIC_DROPDOWN: 'dynamic_dropdown',
  REPEATING_SECTION: 'repeating_section',
} as const

export const FORM_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export const SUBMISSION_STATUS = {
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  ARCHIVED: 'archived',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  CREATOR: 'creator',
  VIEWER: 'viewer',
} as const

export const VALIDATION_RULES = {
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  MIN_VALUE: 'min',
  MAX_VALUE: 'max',
  PATTERN: 'pattern',
  REQUIRED: 'required',
} as const

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALL: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']
  }
} as const

export const PERFORMANCE_THRESHOLDS = {
  LOAD_TIME: 2000, // 2 seconds
  SUBMIT_TIME: 3000, // 3 seconds
  DASHBOARD_QUERY_TIME: 5000, // 5 seconds
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const
