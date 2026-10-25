export default function SiteLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="animate-pulse">
      <div className="bg-[#1A1A1A] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="h-3 w-32 bg-white/10 rounded" />
          <div className="h-12 w-2/3 max-w-lg bg-white/10 rounded" />
          <div className="h-4 w-1/2 max-w-md bg-white/10 rounded" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 bg-[#f3f4f6] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
