export default function PromoBanner() {
  return (
    <div className="px-4 pt-3">
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 shadow-sm border border-indigo-100/50">
        <span className="text-sm font-medium text-slate-700">Không biết chọn dịch vụ nào?</span>
        <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-xs font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 min-h-[36px] touch-manipulation">
          Tư vấn khám
        </button>
      </div>
    </div>
  );
}
