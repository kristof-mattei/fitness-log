import { createRoot } from "react-dom/client";

import { App } from "../components/app";

const container = document.querySelector("#root");

// oxlint-disable-next-line typescript/no-non-null-assertion -- We control html, there is a #root
const root = createRoot(container!);

root.render(<App />);
