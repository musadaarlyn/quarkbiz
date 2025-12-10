import { SectionWrapper } from "../layout/SectionWrapper";

const DashboardSection = () => {
  return (
    <SectionWrapper id="dashboard" title="Dashboard">
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <p className="text-gray-600">Dashboard metrics and charts will go here…</p>
      </div>
    </SectionWrapper>
  );
};


export default DashboardSection;
