import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Learn from "./pages/Learn";
import Practice from "./pages/Practice";
import EarTraining from "./pages/EarTraining";
import Progress from "./pages/Progress";
import PianoBasics from "./pages/PianoBasics";
import ScaleDetail from "./pages/ScaleDetail";
import ChordDetail from "./pages/ChordDetail";
import CadenceDetail from "./pages/CadenceDetail";
import ScalesSummary from "./pages/ScalesSummary";
import EarTrainingExercise from "./pages/EarTrainingExercise";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative">
          <Routes>
            <Route path="/" element={<Learn />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/ear-training" element={<EarTraining />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/scales" element={<ScalesSummary />} />
            <Route path="/piano-basics" element={<PianoBasics />} />
            <Route path="/scale/:id" element={<ScaleDetail />} />
            <Route path="/chord/:id" element={<ChordDetail />} />
            <Route path="/cadence/:id" element={<CadenceDetail />} />
            <Route path="/ear-training/:type" element={<EarTrainingExercise />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
