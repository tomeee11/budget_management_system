export class ExpenseSummary {
  constructor(
    public totalAmount: number,
    public categorySummaries: { category: string; amount: number }[],
  ) {}
}
