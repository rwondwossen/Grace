import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { JourneyProvider } from "./context/JourneyContext";
import Step1Provocation from "./pages/Step1Provocation";
import Step2FeelingQuestion from "./pages/Step2FeelingQuestion";
import Step3Buckets from "./pages/Step3Buckets";
import Step4CoherenceDiagnostic from "./pages/Step4CoherenceDiagnostic";
import Step5GettingGranular from "./pages/Step5GettingGranular";
import Step6ClarityDocument from "./pages/Step6ClarityDocument";
import Step7StayingTheCourse from "./pages/Step7StayingTheCourse";

export default function App() {
  return (
    <JourneyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/step/1" replace />} />
          <Route path="/step/1" element={<Step1Provocation />} />
          <Route path="/step/2" element={<Step2FeelingQuestion />} />
          <Route path="/step/3" element={<Step3Buckets />} />
          <Route path="/step/4" element={<Step4CoherenceDiagnostic />} />
          <Route path="/step/5" element={<Step5GettingGranular />} />
          <Route path="/step/6" element={<Step6ClarityDocument />} />
          <Route path="/step/7" element={<Step7StayingTheCourse />} />
        </Routes>
      </BrowserRouter>
    </JourneyProvider>
  );
}
