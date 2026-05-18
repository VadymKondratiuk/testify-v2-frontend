export type TestStatus = "published" | "draft";

export interface TestSummary {
  id: string;
  title: string;
  status: TestStatus;
  questionsCount: number;
  completions: number;
  updatedAt: string;
}

export interface MyTestApiItem {
  id: string;
  title: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    questions: number;
    attempts: number;
  };
}

export interface MyTestsApiResponse {
  items: MyTestApiItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}
