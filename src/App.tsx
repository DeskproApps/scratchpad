import { DeskproAppProvider } from "@deskpro/app-sdk";
import { Main } from "./pages/Main";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "simplebar/dist/simplebar.min.css";
import TranslatedApp from "./TranslatedApp";

function App() {
  return (
    <DeskproAppProvider>
      <TranslatedApp>
        <Main />
      </TranslatedApp>
    </DeskproAppProvider>
  );
}

export default App;
