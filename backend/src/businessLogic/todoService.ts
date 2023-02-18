import * as uuid from 'uuid'
import { Logger } from 'winston'

import { TodoDataLayer } from '../dataLayer/todoDataLayer'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const todoDataLayer: TodoDataLayer = new TodoDataLayer()

const logger: Logger = createLogger('TodoService')

export async function getTodos(userId: string): Promise<TodoItem[]> {
  logger.info(`get todos for user ${userId}`)
  return todoDataLayer.getTodos(userId)
}

export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<void> {
  logger.info(`delete todo (${todoId}) for user ${userId}`)
  todoDataLayer.deleteTodo(userId, todoId)
}

export async function createTodo(
  userId: string,
  todoRequest: CreateTodoRequest
): Promise<TodoItem> {
  logger.info(`create todo (${userId}) for user ${userId}`)
  return todoDataLayer.createTodo(CreateTodo(userId, todoRequest))
}

export async function updateTodoAttachment(
  userId: string,
  todoId: string,
  attachmentUrl: string
): Promise<void> {
  logger.info(`update todo attachment (${todoId}) for user ${userId}`)
  return todoDataLayer.updateTodoAttachment(userId, todoId, attachmentUrl)
}

export async function updateTodo(
  userId: string,
  todoId: string,
  todoRequest: UpdateTodoRequest
): Promise<TodoItem> {
  logger.info(`update todo (${todoId}) for user ${userId}`)
  return todoDataLayer.updateTodo(userId, todoId, todoRequest)
}

export async function getSignedUploadUrl(todoId: string): Promise<string> {
  logger.info(`get signed upload url for todoid (${todoId})`)
  return todoDataLayer.getSignedUploadUrl(todoId)
}

function CreateTodo(userId: string, todoRequest: CreateTodoRequest): TodoItem {
  return {
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    userId,
    name: todoRequest.name,
    dueDate: todoRequest.dueDate,
    done: false
  }
}
