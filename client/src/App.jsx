import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("./pages/HomePage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const AnalyzePage = lazy(() => import("./pages/AnalyzePage"));

function RouteFallback() {
  return (
    <div className="github-bg flex min-h-screen items-center justify-center text-[#7d8590]">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/report/:username" element={<ReportPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
