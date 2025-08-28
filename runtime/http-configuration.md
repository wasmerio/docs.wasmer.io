# HTTP Configuration

Wasmer provides several command-line options to customize HTTP connections, which is particularly useful in corporate environments with specific network configurations.

## Proxy Configuration

If you're behind a corporate proxy, you can configure Wasmer to use it for all HTTP requests:



You can also set this using the environment variable:



## SSL Certificate Configuration

### Custom Root Certificate

In environments where SSL traffic is inspected or where custom certificates are used, you can specify a custom CA certificate file:



You can also set this using the environment variable:



### Self-signed Certificates

In development environments or internal networks that use self-signed certificates, you can disable SSL verification:



You can also set this using the environment variable:



> ⚠️ **Warning**: Disabling SSL verification is potentially insecure and should only be used in trusted environments or for testing purposes.

## When to Use These Options

These options are particularly useful in:

1. **Corporate environments** with proxies and custom SSL certificates
2. **Restricted networks** where direct internet access is not available
3. **Development environments** with self-signed certificates
4. **CI/CD pipelines** that run in isolated or custom network configurations

## Command-line Options Summary

| Option | Environment Variable | Description |
|--------|---------------------|-------------|
| `--proxy <URL>` | `HTTP_PROXY` | Specify an HTTP proxy URL |
| `--ca-file <PATH>` | `CA_FILE` | Path to a custom CA certificate file |
| `--unsafe-disable-ssl-verify` | `WASMER_UNSAFE_DISABLE_SSL_VERIFY` | Disable SSL verification (use with caution) |