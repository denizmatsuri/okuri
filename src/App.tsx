import FamilyProvider from "./provider/family-provider";
import SessionProvider from "./provider/session-provider";
import RootRoute from "./root-route";

function App() {
  return (
    <SessionProvider>
      <FamilyProvider>
        <RootRoute />
      </FamilyProvider>
    </SessionProvider>
  );
}

export default App;
