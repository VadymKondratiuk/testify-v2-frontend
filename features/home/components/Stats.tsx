const stats = [
  { num: "1,200+", label: "Tests Available" },
  { num: "48,000+", label: "Users Registered" },
  { num: "98%", label: "Satisfaction Rate" },
];

export default function Stats() {
  return (
    <div
      role="list"
      aria-label="Platform statistics"
      className="grid grid-cols-1 sm:grid-cols-3 bg-white border-b border-[#E2E8F0] shadow-[0_1px_2px_rgba(15,26,53,0.05)]"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          role="listitem"
          className={`py-9 px-8 text-center ${
            i < stats.length - 1
              ? "border-b sm:border-b-0 sm:border-r border-[#E2E8F0]"
              : ""
          }`}
        >
          <div className="font-(family-name:--font-sora) text-[2.4rem] font-extrabold tracking-[-0.04em] text-[#4F46E5] leading-none mb-1.5">
            {stat.num}
          </div>
          <div className="text-[0.82rem] font-medium text-[#64748B] tracking-[0.01em]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}