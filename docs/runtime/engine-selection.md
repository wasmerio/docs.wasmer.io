# Automatic Engine Selection

Wasmer can automatically select the most appropriate WebAssembly engine (backend) based on the features required by your WebAssembly module.

## How It Works

When you run a WebAssembly module without explicitly specifying a backend, Wasmer will:

1. Analyze your WebAssembly module to detect which features it uses
2. Filter available backends based on feature compatibility
3. Select the most appropriate backend that supports all required features
4. Fall back to default backends if no compatible backend is found

This ensures your modules run on the most compatible and performant backend without requiring manual configuration.

## Feature-Based Selection

Different WebAssembly features are supported by different backends:

| Feature | Cranelift | LLVM | Singlepass | V8 | WAMR | WASMI |
|---------|----------|------|------------|----|----|------|
| Bulk Memory | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reference Types | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SIMD | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Threads | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Multi-value | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Exceptions | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

### Special Case: Exceptions

If your WebAssembly module uses the exceptions feature, Wasmer will automatically select the LLVM backend, as it's currently the only backend that supports this feature.

## Explicitly Selecting a Backend

You can still explicitly select a backend if you prefer:



When you explicitly select a backend, Wasmer will respect your choice even if the module uses features not supported by that backend (which may result in compilation errors).

## Programmatic Usage

When using Wasmer programmatically, you can leverage the feature detection system:



## Backend Priority

When multiple backends support the required features, Wasmer selects them in this priority order:

1. Cranelift
2. LLVM
3. Singlepass
4. V8
5. WASMI
6. WAMR

This prioritization balances performance and compatibility for most use cases.