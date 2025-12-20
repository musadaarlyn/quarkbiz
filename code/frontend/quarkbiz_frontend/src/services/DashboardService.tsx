const base = 'http://localhost:8080/dashboard';

export type DashboardStats = {
  totalProjects: number;
  projectStatuses: { status: string; count: number }[];
  techStacksPerCategory: { categoryId: number; categoryName: string; techStackCount: number }[];
  techStackUsage: { techStackId: number; techStackName: string; projectCount: number }[];
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${base}/stats`);
  if (!res.ok) throw new Error('Failed to load dashboard stats');
  return res.json();
}
