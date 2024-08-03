# Custom image for CircleCI


This is a custom image built on top of `cimg/base`. The general idea is to take
advantage of CircleCI's known working base image image and add the tools this
project requires for full CI/CD integration.

Could I simply use their orbs? Sure. But this gives more granular control.
This image will likely be built on top of a base ubuntu or debian image in the
future.

<br>

## Software & Tools

Taskfile reads version information from `version.json` while building from
`v1/build/Dockerfile`.

__OpenTofu__

Fork of Terraform by the Linux Foundation, used for provioning cloud resources
such as compute instances, load balancers, WAFs, managed databases, and more.

__Ansible__

Configure cloud compute instances & configuration management for applications.

Container orchestration tooling is possible, but needlessly complex for the
purposes of this project. Ansible is sufficient for managing independent Docker
hosts.

__SOPS__

Tool used for secrets management in this project.

__DNSControl__

IaC tooling for managing public & private DNS and registrars from
version-controlled files in this repository.


<br>

## Building this image

This image is built via Github Actions and stored as a package in this GitHub
repository. CircleCI pulls this image and uses it for all CI/CD purposes.

> GitHub Actions Workflow is set to only build the image if a file in this
subdirectory `/apps/cideploy/**` is modified. To trigger a build of this image,
it is recommended to manually update the version number in `version.json`.

While it would be possible to implement an auto-incrementing version number
bump process for this image, the added complexity is not desired. Manual version
numbering is quite sufficient.

__Versioning & Workflow__



__Tags - latest & latest-devel__

Build process builds & tags the tagged with the version number for the build
type, defined in `version.json`. Also always tags this image with `:latest`
for a `current` build, or `:latest-dev` for a `devel` build.


<br>


# Taskfiles


To build the image locally, use the following tasks from the root level of this
repository. Build type is set via environment variable.

```
export CIDEPLOY_BUILD_TYPE=current
task docker:cideploy:build

export CIDEPLOY_BUILD_TYPE=devel
task docker:cideploy:build
```

<br>


# Refs

1. [https://taskfile.dev/](https://taskfile.dev/)
1. [https://github.com/getsops/sops](https://github.com/getsops/sops)
1. [https://docs.ansible.com/core.html](https://docs.ansible.com/core.html)
1. [https://opentofu.org/](https://opentofu.org/)
1. [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
1. [CirclCI - cimg/base](https://circleci.com/developer/images/image/cimg/base)
1. [https://circleci.com/](https://circleci.com/)

