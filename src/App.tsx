import { DeskproAppProvider } from "@deskpro/app-sdk";
import { Main } from "./pages/Main";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "simplebar/dist/simplebar.min.css";

function App() {
  return (
    <DeskproAppProvider>
      <Main />
    </DeskproAppProvider>
  );
}

export default App;
