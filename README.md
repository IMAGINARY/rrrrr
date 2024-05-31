# RRRRR

RRRRR (Reduce, Reuse, Repair, Refurbish, Recycle) is an interactive exhibit
about the circular economy of smartphones. It simulates the flow of resources in
the ecosystem using a simple multi-compartment model. The user controls the app
via physical or virtual markers that modify certain parameters of the model.

Check out the
[interactive demo](https://imaginary.github.io/rrrrr/index.html?tuio=false&pointer=true)
(tested with Google Chrome 106).

## Options

The exhibit accepts several options as query string parameters of the
`index.html` page:

- `tuio` (default: `true`): Enable marker tracking via TUIO
- `pointer` (default: `false`): Enable marker tracking via mouse/touch pointer
- `numPointerMarkers` (default: `NUM_POINTER_MARKERS` from
  `src/ts/builtin-config.ts`): Number of markers to be controlled with
  mouse/touch pointers
- `tuioUrl` (default: `ws://localhost:3339`): URL of the TUIO WebSocket server
- `tuioReconnectionDelay`(default: `10`): Delay in seconds before trying to
  reconnect to the TUIO WebSocket server after a disconnection
- `autoStart` (default: `true`): Automatically start the simulation of the model
- `devMode` (default: `false`): Enable developer mode (show some debug info)
- `highlightDerivatives` (default: `true`): Highlight increases and decreases in
  the flows of the model
- `markerSlotLabels` (default: `true`): Display marker slot labels
- `autoReset` (default: `default`): Automatically reset the model to its initial
  state when the reset condition is met (see configuration)
- `sentryDsn` (default: none): Set [Sentry](https://sentry.io) DSN for error
  tracking (disabled if not set)

## Configuration

The RRRRR exhibit is composed of an engine and its configuration. The model is
currently hard-coded into the engine. On top of that, initial model values,
graphical overlay elements, parameter transforms their activation via markers
and slot groups can be adjusted via the YAML configuration files that are stored
in the [`config`](config) folder. The configuration files are merged into a
single JSON object during load which is validated against a
[dedicated JSON Schema specification](specs/config-schema.generated.yaml).

# Development

The build system relies on Node.js and NPM. Install the dependencies via

```bash
npm install
```

Afterward, several `npm run` scripts become available:

- `serve`: Start a development server with hot-reloading
- `clean`: Remove the `dist` folder and the top-level `index.html`
- `build`: Build the project
- `format`: `Prettier`-format the project
- `lint`: Run all the `lint` scripts
- `lint:scripts`: Lint the script files
- `lint:styles`: Lint the style files
- `fix`: Run all the `fix` scripts
- `fix:scripts`: Lint the script files and apply the available automatic fixes
- `fix:styles`: Lint the style files and apply the available automatic fixes
- `generate`: Run all the `generate` scripts
- `generate:config-schema`: Generate the JSON schema files and TypeScript types
  from [suretype](https://github.com/grantila/suretype) definitions
- `generate:doc`: Generate the
  [JSON schema documentation](docs/config-schema.md) into the `doc` folder
- `generate:model-class`: Generate the model code from the
  [export](src/insight-maker/CircularEconomyOfSmartPhones.InsightMaker) of the
  [InsightMaker definition](https://insightmaker.com/insight/6Ips1pJgbpZ944AVQow7Lz/Circular-economy-of-smartphones)
  (triggers `generate:config-schema` as well)
- `check-updates`: Check for available NPM package updates
- `udp-websocket-proxy`: Launch a WebSocket server that proxies UDP packets to a
  WebSocket client
- `udp-websocket-proxy:websocat`: Launch a WebSocket server that proxies UDP
  packets to a WebSocket client (uses `websocat` tool with hardcoded IPs and
  ports)
- `udp-websocket-proxy:node`: Launch a WebSocket server that proxies UDP packets
  to a WebSocket client (uses custom Node.js implementation with hardcoded IPs
  and ports)

## Credits

Developed by Christian Stussak, Ariel Cotton, Bianca Violet, Andreas Matt and
Daniel Ramos for IMAGINARY gGmbH.

## License

Copyright (c) 2024 IMAGINARY gGmbH, Licensed under the MIT license (see
[`LICENSE`](LICENSE)), Supported by Futurium gGmbH
