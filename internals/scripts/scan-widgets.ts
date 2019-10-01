import { readdirSync, existsSync, writeFileSync } from "fs";

const WIDGETS_PATH = "src/widgets";
const FILE_CONFIGURATION = "configuration.tsx";
const FILE_PROPERTIES = "properties.ts";
const FILE_OUTPUT = "list.ts";

const directoriesForPath = (path: string) =>
  readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

/* A widget is configurable if a configuration file exists */
const isConfigurable = (widget: string) =>
  existsSync(`${WIDGETS_PATH}/${widget}/${FILE_CONFIGURATION}`);

/* Widget properties are defined in a separate file */
const properties = (widget: string) =>
  require(`../../${WIDGETS_PATH}/${widget}/${FILE_PROPERTIES}`);

const allWidgets = directoriesForPath(WIDGETS_PATH);
const result = allWidgets.reduce(
  (acc, widget) => ({
    ...acc,
    [widget]: {
      configurable: isConfigurable(widget),
      ...properties(widget)
    }
  }),
  {}
);

const template = (widgets: object) => `import { Widgets } from "./index";
export default ${JSON.stringify(widgets)} as Widgets;`;

writeFileSync(`${WIDGETS_PATH}/${FILE_OUTPUT}`, template(result));