import FamilyProvider from "@/provider/family-provider";
import ModalProvider from "@/provider/modal-provider";
import SessionProvider from "@/provider/session-provider";
import RootRoute from "@/root-route";

function App() {
  return (
    <SessionProvider>
      <ModalProvider>
        <FamilyProvider>
          <RootRoute />
        </FamilyProvider>
      </ModalProvider>
    </SessionProvider>
  );
}

export default App;
