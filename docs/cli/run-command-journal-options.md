# Journal Options for `wasmer run`

The `wasmer run` command supports several options for working with journals, which allow you to record and replay the execution state of WebAssembly modules.

## Journal Options

### `--journal <PATH>`

Specifies one or more journal files that Wasmer will use to restore the state of the WebAssembly process as it executes. The state of the WebAssembly process and its sandbox will be reapplied using the journals in the order that you specify here.

This flag creates a read-only journal that can be used to restore state but will not be written to during execution.

Example:


### `--journal-writable <PATH>`

Specifies one or more journal files that Wasmer will use to restore and save the state of the WebAssembly process as it executes.

If the journal file does not exist, it will be created. If it does exist, it will be opened for read and write. New journal events will be written to this file.

Example:


### `--stop-after-snapshot`

If specified, the runtime will stop executing the WebAssembly module after the first snapshot is taken. This also prevents appending thread exit and process exit events to the journal.

This is useful when you want to create a snapshot without continuing execution, which can be used for creating clean snapshots for later use.

Example:


### `--skip-journal-stdio`

Skip writes to stdout and stderr when replaying journal events to bootstrap a module. This prevents duplicate output when resuming from a snapshot.

This is particularly useful when you're replaying a journal and don't want to see the output that was generated during the original execution.

Example:


### `--snapshot-on <TRIGGER>`

Specifies when snapshots should be taken. Multiple triggers can be specified.

### `--snapshot-period <MILLISECONDS>`

Specifies the interval in milliseconds at which snapshots should be taken. This requires a writable journal to be specified.

Example:


## Use Cases

### Creating Clean Snapshots

To create a clean snapshot and stop execution immediately after:



### Resuming from a Snapshot Without Duplicate Output

To resume execution from a snapshot without seeing the original stdout/stderr output:



### Recording and Replaying with Separate Journals

To use separate journals for reading and writing:



This will load the state from `base-state.journal` and record new events to `new-state.journal`.