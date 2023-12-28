import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import {
  ER_DUP_ENTRY,
  ER_WARN_DATA_OUT_OF_RANGE,
} from '../../commom/constants/error-codes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleDBExceptions (error: any): void {
  if (error.code === ER_DUP_ENTRY) {
    const errorMessage = error.sqlMessage.replace(/ for key '[^']+'$/, '')
    throw new ConflictException(errorMessage)
  }

  if (error.code === ER_WARN_DATA_OUT_OF_RANGE) {
    const errorMessage = error.sqlMessage.replace(/ at row \d+$/, '')
    throw new BadRequestException(errorMessage)
  }

  throw new InternalServerErrorException('Unexpected error, check server logs')
}
