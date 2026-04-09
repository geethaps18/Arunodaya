import { CheckCircle, ShieldCheck } from "lucide-react";

export default function ProductTrust() {
  return (
    <div className="w-full px-4 py-5 bg-gradient-to-b">
      <div className="block md:hidden">
        
        {/* Glass Card */}
        <div className="relative rounded-3xl border bg-white/80 p-5 overflow-hidden">

          {/* Glow effect */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-20"></div>

          {/* Icons Row */}
          <div className="flex items-center justify-between relative z-10">
            
            {/* Genuine Product */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-300 to-yellow-300 flex items-center justify-center shadow-md">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Genuine Product
              </p>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

            {/* Quality Checked */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Quality Checked
              </p>
            </div>

          </div>

          {/* Exchange Info */}
          <div className="mt-5 px-4 text-center">
            <p className="text-base font-semibold text-gray-800">
              Easy 7 days exchange
            </p>
            <p className="text-sm text-gray-500">
              Exchange available for size or product issues. No returns.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}