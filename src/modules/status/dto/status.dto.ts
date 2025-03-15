import { OrderStatusTOrdpe } from '@prisma/client';

export class CreateStatusDto {
  name: string;
  type: OrderStatusType;
  description?: string;
  isFinal: boolean;
  nextStatusId?: number;
}

export class UpdateStatusDto {
  name?: string;
  type?: OrderStatusType;
  description?: string;
  isFinal?: boolean;
  nextStatusId?: number;
}
