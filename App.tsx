import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";

// ... resto das importações ...

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      {/* Seu conteúdo atual do App */}
    </GluestackUIProvider>
  );
} 