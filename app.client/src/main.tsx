import { createRoot } from "react-dom/client";
import Root from "./components/Root/Root";


const container = document.getElementById("root");
if (!container) {
    throw new Error("No root element found. Did you add <div id='root'></div> in index.html?");
}

const root = createRoot(container);
root.render(<Root />);
