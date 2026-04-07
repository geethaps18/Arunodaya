export default function ProductTrust() {
  return (
    <div className="w-full px-4 py-5 bg-gradient-to-b">
      <div className="block md:hidden">
        
        {/* Glass Card */}
        <div className="relative rounded-3xl border bg-white/80 p-5 overflow-hidden">

          {/* Glow effect (UPDATED) */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-20"></div>

          {/* Icons Row */}
          <div className="flex items-center justify-between relative z-10">
            
            {/* Genuine */}
            <div className="flex flex-col items-center flex-1 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center shadow-sm transition">
                <span className="text-xl">🏷️</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-800 tracking-wide">
                Genuine Product
              </p>
              <span className="text-[10px] text-gray-400">
                100% Original
              </span>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

            {/* Quality */}
            <div className="flex flex-col items-center flex-1 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-50 flex items-center justify-center shadow-sm transition">
                <span className="text-xl">✔️</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-800 tracking-wide">
                Quality Checked
              </p>
              <span className="text-[10px] text-gray-400">
                Verified by team
              </span>
            </div>

          </div>

          {/* Bottom Info */}
          <div className="mt-5 pt-4 border-t border-gray-100 relative z-10">
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              🔄 Easy 7 days exchange
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Hassle-free exchange for size or fit issues.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}