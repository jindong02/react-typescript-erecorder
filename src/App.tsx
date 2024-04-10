import "./App.css";
import ScreenBox from "./components/ScreenBox";
import CameraBox from "./components/CameraBox";

function App() {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <CameraBox />
        <ScreenBox />
      </div>
    </div>
  );
}

export default App;
