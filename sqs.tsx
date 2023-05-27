import middy from "@middy/core";
import { middySqsErrorLogger } from "@voikukka/backend-shared/middleware/middy-sqs-error-logger";
import { middyCorrelationIds } from "@voikukka/backend-shared/middleware/wrapper/middy-correlation-ids";
import { PaymentStreamSnsMessage } from "@voikukka/backend-shared/payments/types/sns";
import { MASKED_LOG_FIELD_NAMES } from "@voikukka/backend-shared/products/constants";
import { Log, middyLogMask } from "@voikukka/shared/logging/shared-logger";
import { SQSEvent } from "aws-lambda";

import { middyXRayEgressHttp } from "../../../shared/middleware/middy-x-ray-egress-http";
import {
  TaggedOrderStateId,
  tagOrderStateId,
  untagId,
  updateInputWithTimestampRefresh
} from "../data-sources/picking-ddb-utils";
import { findOrderStateNode } from "../data-sources/picking-state";
import { updateDocument } from "../data-sources/service/dynamo";
import { PaymentStatus } from "../generated/graphql";
import { OrderStateNode } from "../types/picking-state";

const parseOrdersFromSqs = (event: SQSEvent): PaymentStreamSnsMessage[] => {
  try {
    return event.Records.flatMap(
      (r) => JSON.parse(r.body) as unknown
    ) as PaymentStreamSnsMessage[];
  } catch (error) {
    Log.error("New order from SNS failed at parsing orders", { event }, error);
    return [];
  }
};

export const handlerFn = async (event: SQSEvent): Promise<void> => {
  const orders = parseOrdersFromSqs(event);

  if (orders.length === 0) return;

  console.log({ orders });

  await Promise.allSettled(
    orders.map(async (o) => {
      const existingOrders = await findOrderStateNode(
        tagOrderStateId(o.orderId)
      );
      if (existingOrders === undefined) {
        Log.info("Payment order could not be found from the picking table", {
          order: o
        });
      }
      const existingOrderId = existingOrders?.pk as TaggedOrderStateId;

      const updatedOrder = orders.find(
        (r) => r.orderId === untagId(existingOrderId)
      );

      if (!updatedOrder) return;
      const paymentStatus: PaymentStatus = updatedOrder?.paymentStatus;
      const newUpdatedOrder = updateInputWithTimestampRefresh<OrderStateNode>(
        { pk: existingOrderId, sk: existingOrderId },
        { paymentStatus }
      );

      try {
        await updateDocument(newUpdatedOrder);
      } catch (e) {
        Log.warn(
          "Updating initialized state failed",
          { orderId: newUpdatedOrder.Key },
          e
        );
      }
    })
  );
};

export const handler = middy(handlerFn)
  .use(middyLogMask({ maskedLogFieldNames: MASKED_LOG_FIELD_NAMES }))
  .use(middyCorrelationIds())
  .use(middyXRayEgressHttp())
  .use(middySqsErrorLogger());
