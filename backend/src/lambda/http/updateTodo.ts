import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { Logger } from 'winston'

import { updateTodo } from '../../businessLogic/todoService'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import {
  generateResponse,
  getUserId
} from '../utils'

const logger: Logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    logger.info(`update todo (${todoId}) with ${JSON.stringify(updatedTodo)}`)

    // update todoitem  -> TodoService (businesslogic)
    const item = await updateTodo(getUserId(event), todoId, updatedTodo)
    // return 200 -> stringify updated item
    return generateResponse(200, item)
  }
)

handler.use(
  cors({
    credentials: true
  })
)
