export default function Spinner({ label = 'Đang tải...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-500">
      <div className="h-8 w-8 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
