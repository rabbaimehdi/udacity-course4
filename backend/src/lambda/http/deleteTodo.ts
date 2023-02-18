import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { Logger } from 'winston'

import { deleteTodo } from '../../businessLogic/todoService'
import { createLogger } from '../../utils/logger'
import {
  generateResponse,
  getUserId
} from '../utils'

const logger: Logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.info(todoId)
    logger.info(`delete todo ${todoId}`)

    // TODO: Remove a TODO item by id
    // deleteTodoItem -> TodoService (businesslogic)
    await deleteTodo(getUserId(event), todoId)
    // return 204 (noContent) -> no body
    return generateResponse(204)
  }
)

handler.use(
  cors({
    credentials: true
  })
)
