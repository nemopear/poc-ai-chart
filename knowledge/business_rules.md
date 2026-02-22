# MES Pharma Business Rules

## Chart Type Selection Rules

### Line Charts
- Use for: trends over time
- Examples: "batch release trend", "utilization over time", "production output by month"
- Best for: continuous data, time series

### Bar Charts
- Use for: comparison between categories
- Examples: "batch status by line", "equipment utilization by type", "plan vs actual"
- Best for: discrete categories, ranked comparisons

### Pie/Doughnut Charts
- Use for: percentage breakdown
- Examples: "batch status distribution", "equipment status breakdown", "order fulfillment rate"
- Best for: parts of a whole (must sum to 100%)

### Area Charts
- Use for: volume over time with emphasis on magnitude
- Examples: "cumulative production", "total batch quantity over time"
- Best for: showing total magnitude with trend

### Table
- Use for: detailed data listing
- Examples: "list all batches", "show all equipment", "all orders"
- Best for: exact values, sorted data

## Data Aggregation Rules
- Default to weekly aggregation for production data
- Use daily for critical metrics
- Always include totals for comparisons
- Group by line for production metrics

## Formatting Rules
- Quantities: Use thousand separators (50,000 tablets)
- Percentages: Show with % symbol
- Dates: Use YYYY-MM-DD format or Month DD format
- Equipment rates: Show as percentage with 1 decimal

## KPI Definitions
- **Utilization Rate**: (Running Time / Total Time) * 100
- **Fulfillment Rate**: (Fulfilled Orders / Total Orders) * 100
- **Plan Achievement**: (Actual Quantity / Planned Quantity) * 100
- **Batch Release Rate**: (Released Batches / Total Batches) * 100

## MES-Specific Rules
- Equipment status: Running (green), Idle (yellow), Maintenance (orange), Offline (red)
- Batch status: Released (green), In Progress (blue), Pending (yellow), Rejected (red)
- Order fulfillment: Fulfilled (green), Partial (yellow), Pending (gray)
- Production plan: Completed (green), In Progress (blue), Delayed (orange), Pending (gray)
