# Package Download Command

The `wasmer package download` command allows you to download Wasmer packages from the registry.

## Usage



## Arguments

* `<PACKAGE>`: The package to download. This can be specified in the format `namespace/name[@version]`.

## Options

* `--out <PATH>`: Specify the output path for the downloaded package. If not provided, the package will be downloaded to the current directory.

* `--validate`: Validate the package signature after downloading.

* `--quiet`: Suppress progress output.

* `--unpack`: Unpack the downloaded package. The output directory will be created next to the downloaded file. If the downloaded file has an extension, the unpacked directory will have the same name without the extension. Otherwise, the directory will have the `.unpacked` extension.

## Examples

Download a package:



Download a package and specify the output path:



Download and automatically unpack a package:



This will download the package to the current directory and unpack it to a directory named `hello`.

## Notes

* If you don't specify an output path, the package will be downloaded to the current directory with the package's filename.

* The `--unpack` flag provides a convenient way to download and unpack a package in one step. Alternatively, you can use the `wasmer package unpack` command to unpack a previously downloaded package.

* When using the `--unpack` flag, the output directory will be created next to the downloaded file. If the downloaded file has an extension (e.g., `.webc`), the unpacked directory will have the same name without the extension. Otherwise, the directory will have the `.unpacked` extension.