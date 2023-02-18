import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { Logger } from 'winston'

import {
  getSignedUploadUrl,
  updateTodoAttachment
} from '../../businessLogic/todoService'
import { createLogger } from '../../utils/logger'
import {
  generateResponse,
  getUserId
} from '../utils'

const logger: Logger = createLogger('deleteTodo')

const ATTACHMENT_S3_BUCKET: string = process.env.ATTACHMENT_S3_BUCKET
const ContantUrl: string = `https://${ATTACHMENT_S3_BUCKET}.s3.amazonaws.com`

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.info(todoId)
    logger.info(`Generate uploadUrl for todoId${todoId}`)

    // Build img url https + Bucketname + s3.amazon.com + todoitem
    const imageUrl = `${ContantUrl}/${todoId}`
    // Update AttachmentUrl for Todo item  -> TodoService (businesslogic)
    await updateTodoAttachment(getUserId(event), todoId, imageUrl)
    // Get signed url -> DataLayer -> S3Client
    const signedUrl = await getSignedUploadUrl(todoId)

    // return 200 -> stringify url
    return generateResponse(200, { uploadUrl: signedUrl })
  }
)

handler.use(
  cors({
    credentials: true
  })
)
