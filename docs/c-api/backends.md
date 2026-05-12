# Multiple Backends in the C API

Wasmer's C API now supports multiple backends, allowing you to choose the most appropriate WebAssembly runtime for your specific use case.

## Available Backends

The C API supports the following backends:

- **UNIVERSAL** (sys): The default backend that supports multiple compilers (Cranelift, LLVM, Singlepass)
- **V8**: Google's V8 JavaScript engine
- **WAMR**: WebAssembly Micro Runtime
- **WASMI**: A WebAssembly interpreter written in Rust
- **JSC**: JavaScriptCore engine

## Selecting a Backend

You can select a backend when creating a new engine configuration:



## Default Backend

The default backend is determined by the features enabled during compilation. The priority order is:

1. If a specific `*-default` feature is enabled (e.g., `sys-default`, `v8-default`, etc.), that backend is used
2. Otherwise, the first available backend in the following order is used: sys, wamr, wasmi, v8, js, jsc

## Engine-Specific Configuration

Each backend has its own specific configuration options. The C API now provides engine-specific functions to configure each backend.

### Universal (sys) Backend Configuration

The Universal backend supports multiple compilers and configuration options:



## Breaking Changes

This update introduces several breaking changes to the C API:

1. Functions that were implicitly tied to the `sys` engine are now explicitly scoped with the `sys` prefix:
   - `wasm_config_canonicalize_nans` → `wasm_config_sys_canonicalize_nans`
   - `wasm_config_set_target` → `wasm_config_set_sys_target`
   - `wasm_config_push_middleware` → `wasm_config_sys_push_middleware`
   - `wasm_config_set_compiler` → `wasm_config_set_sys_compiler`

2. Calling engine-specific configuration functions will automatically switch the engine type to the corresponding backend. For example, calling `wasm_config_sys_push_middleware` will set the engine to `UNIVERSAL` regardless of what was previously set.

## Feature Flags

To use a specific backend, you need to enable the corresponding feature when building Wasmer:

- `sys`: Enable the Universal backend
- `v8`: Enable the V8 backend
- `wamr`: Enable the WAMR backend
- `wasmi`: Enable the WASMI backend
- `jsc`: Enable the JSC backend

To set a specific backend as default, use the corresponding `-default` feature:

- `sys-default`: Use the Universal backend as default
- `v8-default`: Use the V8 backend as default
- `wamr-default`: Use the WAMR backend as default
- `wasmi-default`: Use the WASMI backend as default
- `jsc-default`: Use the JSC backend as default

## Example

