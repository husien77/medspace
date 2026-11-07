import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['SUPER_ADMIN', 'STUDENT']);
export const userStatusEnum = pgEnum('user_status', ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']);
export const lectureStatusEnum = pgEnum('lecture_status', ['NOT_COMPLETED', 'COMPLETED', 'POSTPONED', 'RESCHEDULED']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull().default('STUDENT'),
  status: userStatusEnum('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ emailUnique: uniqueIndex('users_email_unique').on(table.email) }));

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  icon: text('icon').notNull().default('book-open'),
  color: varchar('color', { length: 20 }).notNull().default('#0d6fe8'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const pdfLibrary = pgTable('pdf_library', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(),
  publicationDate: timestamp('publication_date', { withTimezone: true }).notNull().defaultNow(),
  lecturerName: text('lecturer_name'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ subjectIndex: index('pdf_subject_idx').on(table.subjectId) }));

export const lectures = pgTable('lectures', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  lecturerName: text('lecturer_name'),
  notes: text('notes'),
  status: lectureStatusEnum('status').notNull().default('NOT_COMPLETED'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ subjectIndex: index('lecture_subject_idx').on(table.subjectId) }));

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
  isPinned: boolean('is_pinned').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  kind: varchar('kind', { length: 40 }).notNull(),
  route: text('route'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const examinations = pgTable('examinations', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  mode: varchar('mode', { length: 20 }).notNull().default('PRACTICE'),
  durationMinutes: integer('duration_minutes').notNull().default(30),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const examQuestions = pgTable('exam_questions', {
  id: serial('id').primaryKey(),
  examId: integer('exam_id').notNull().references(() => examinations.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  choices: jsonb('choices').notNull(),
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const scheduleEvents = pgTable('schedule_events', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  eventType: varchar('event_type', { length: 30 }).notNull().default('lecture'),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const discussionThreads = pgTable('discussion_threads', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  actorUserId: integer('actor_user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  targetType: varchar('target_type', { length: 40 }).notNull(),
  targetId: integer('target_id').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ createdIndex: index('audit_created_idx').on(table.createdAt) }));
