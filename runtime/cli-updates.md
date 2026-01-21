# CLI Updates - HTTP Configuration Options

The Wasmer CLI has been updated with new options to support HTTP proxy and SSL certificate configuration. These options are particularly useful in corporate environments where network access is restricted or customized.

## New CLI Options

The following new options have been added to the `wasmer run` command:



## Updated Help Output

The complete help output for `wasmer run --help` now includes these new options:

```
Run a WebAssembly file or Wasmer container

Usage: wasmer run [OPTIONS] <INPUT> [ARGS]...

Arguments:
  <INPUT>
          The file, URL, or package to run

  [ARGS]...
          Command-line arguments passed to the package

Options:
      --wasmer-dir <WASMER_DIR>
          Set Wasmer's home directory

          [env: WASMER_DIR=/home/user/.local/share/wasmenv/current]
          [default: /home/user/.local/share/wasmenv/current]

      --cache-dir <CACHE_DIR>
          The directory cached artefacts are saved to

          [env: WASMER_CACHE_DIR=/home/user/.wasmer/cache]
          [default: /home/user/.local/share/wasmenv/current/cache]

      --proxy <URL>
          HTTP proxy URL
          
          [env: HTTP_PROXY=]

      --ca-file <PATH>
          Path to CA certificate file
          
          [env: CA_FILE=]

      --unsafe-disable-ssl-verify
          Disable SSL verification (use with caution)
          
          [env: WASMER_UNSAFE_DISABLE_SSL_VERIFY=]

  -v, --verbose...
          Generate verbose output (repeat for more verbosity)

  -q, --quiet
          Do not print progress messages

      --registry <REGISTRY>
          The registry to fetch packages from (inferred from the environment by default)

          [env: WASMER_REGISTRY=]

      --log-format <LOG_FORMAT>
          The format to use when generating logs

          [env: LOG_FORMAT=]
          [default: text]

          Possible values:
          - text: Human-readable logs
          - json: Machine-readable logs

      --token <TOKEN>
          The API token to use when communicating with the registry (inferred from the environment by default)

          [env: WASMER_TOKEN=]

      --color <COLOR>
          When to display colored output

          [default: auto]
          [possible values: auto, always, never]

      --singlepass
          Use Singlepass compiler

      --cranelift
          Use Cranelift compiler

      --llvm
          Use LLVM compiler

      --enable-verifier
          Enable compiler internal verification.

          Available for cranelift, LLVM and singlepass.

      --llvm-debug-dir <LLVM_DEBUG_DIR>
          LLVM debug directory, where IR and object files will be written to.

          Only available for the LLVM compiler.

      --enable-simd
          Enable support for the SIMD proposal

      --disable-threads
          Disable support for the threads proposal

      --enable-threads
          Deprecated, threads are enabled by default

      --enable-reference-types
          Enable support for the reference types proposal

      --enable-multi-value
          Enable support for the multi value proposal

      --enable-bulk-memory
          Enable support for the bulk memory proposal

      --enable-all
          Enable support for all pre-standard proposals

      --dir <DIR>
          WASI pre-opened directory

      --mapdir <GUEST_DIR:HOST_DIR>
          Map a host directory to a different location for the Wasm module

      --env <KEY=VALUE>
          Pass custom environment variables

      --forward-host-env
          Forward all host env variables to guest

          [env: FORWARD_HOST_ENV=]

      --use <USE>
          List of other containers this module depends on

      --include-webc <WEBC>
          List of webc packages that are explicitly included for execution Note: these packages will be used instead of those in the registry

      --map-command <MAPCMD>
          List of injected atoms

      --net[=<NETWORKING>]
          Enable networking with the host network.

          Allows WASI modules to open TCP and UDP connections, create sockets, ...

          Optionally, a set of network filters could be defined which allows fine-grained control over the network sandbox.

          Rule Syntax:

          <rule-type>:<allow|deny>=<rule-expression>

          Examples:

          - Allow a specific domain and port: dns:allow=example.com:80

          - Deny a domain and all its subdomains on all ports: dns:deny=*danger.xyz:*

          - Allow opening ipv4 sockets only on a specific IP and port: ipv4:allow=127.0.0.1:80/in.

      --no-tty
          Disables the TTY bridge

      --enable-async-threads
          Enables asynchronous threading

      --enable-cpu-backoff <ENABLE_CPU_BACKOFF>
          Enables an exponential backoff (measured in milli-seconds) of the process CPU usage when there are no active run tokens (when set holds the maximum amount of time that it will pause the CPU) (default = off)

      --journal <JOURNALS>
          Specifies one or more journal files that Wasmer will use to restore and save the state of the WASM process as it executes.

          The state of the WASM process and its sandbox will be reapplied using the journals in the order that you specify here.

          The last journal file specified will be created if it does not exist and opened for read and write. New journal events will be written to this file

      --enable-compaction
          Flag that indicates if the journal will be automatically compacted as it fills up and when the process exits

      --without-compact-on-drop
          Tells the compactor not to compact when the journal log file is closed

      --with-compact-on-growth <WITH_COMPACT_ON_GROWTH>
          Tells the compactor to compact when it grows by a certain factor of its original size. (i.e. '0.2' would be it compacts after the journal has grown by 20 percent)

          Default is to compact on growth that exceeds 15%

          [default: 0.15]

      --snapshot-on <SNAPSHOT_ON>
          Indicates what events will cause a snapshot to be taken and written to the journal file.

          If not specified, the default is to snapshot when the process idles, when the process exits or periodically if an interval argument is also supplied.

          Additionally if the snapshot-on is not specified it will also take a snapshot on the first stdin, environ or socket listen - this can be used to accelerate the boot up time of WASM processes.

      --snapshot-period <SNAPSHOT_INTERVAL>
          Adds a periodic interval (measured in milli-seconds) that the runtime will automatically take snapshots of the running process and write them to the journal. When specifying this parameter it implies that `--snapshot-on interval` has also been specified

      --http-client
          Allow instances to send http requests.

          Access to domains is granted by default.

      --deny-multiple-wasi-versions
          Require WASI modules to only import 1 version of WASI

  -a, --addr <ADDR>
          The address to serve on

          [env: ADDR=]
          [default: 127.0.0.1:8000]

      --stack-size <STACK_SIZE>
          Set the default stack size (default is 1048576)

  -e, --entrypoint <ENTRYPOINT>
          The entrypoint module for webc packages

  -i, --invoke <INVOKE>
          The function to invoke

      --COREDUMP_PATH <COREDUMP_PATH>
          Generate a coredump at this path if a WebAssembly trap occurs

      --hash-algorithm <HASH_ALGORITHM>
          Hashing algorithm to be used for module hash

          Possible values:
          - sha256:  Sha256
          - xx-hash: XXHash

  -h, --help
          Print help (see a summary with '-h')
```

For more detailed information about these HTTP configuration options, see the [HTTP Configuration](http-configuration.md) documentation.