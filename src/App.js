import Navbar from "./Navbar";
import Tren from "./pages/Tren.tsx"

function App() {
  let Component
  switch (window.location.pathname) {
    case "/":
      Component = App
      break;
    case "/tren":
      Component = Tren
      break
    default:
      break;
  }
  return (
    <><Navbar />
    <Component /></>
  )
}

export default App;
