# MES Pharma Data Schema

## Batch Records (Electronic Batch Release)
- **batchId**: Unique identifier for each batch (e.g., B001)
- **productName**: Name of pharmaceutical product
- **line**: Production line (Line A, Line B, Line C)
- **status**: Batch release status (Released, Pending, Rejected, In Progress)
- **quantity**: Batch quantity produced
- **unit**: Unit of measurement (tablets, capsules, etc.)
- **startDate**: Production start date
- **endDate**: Production end date

## Equipment
- **equipmentId**: Unique identifier (e.g., EQ001)
- **name**: Equipment name
- **type**: Equipment type (Tablet Press, Coater, Blister, etc.)
- **status**: Current status (Running, Idle, Maintenance, Offline)
- **utilizationRate**: Percentage of time equipment is running
- **line**: Associated production line

## Production Plan
- **planId**: Unique plan identifier (e.g., P001)
- **productName**: Product being manufactured
- **line**: Production line
- **plannedQuantity**: Target quantity to produce
- **actualQuantity**: Actual quantity produced
- **plannedDate**: Scheduled production date
- **status**: Plan status (Completed, In Progress, Delayed, Pending)

## Orders
- **orderId**: Unique order identifier (e.g., ORD001)
- **productName**: Ordered product
- **quantity**: Ordered quantity
- **dueDate**: Required delivery date
- **fulfillmentStatus**: Order status (Fulfilled, Partial, Pending)
- **line**: Fulfilling production line
